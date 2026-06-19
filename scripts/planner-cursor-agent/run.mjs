#!/usr/bin/env node
/**
 * Cursor SDK local agent runner for Platform Core planner.
 * Usage: node run.mjs <sessionId> <promptFile> <repoRoot>
 */
import { readFileSync, appendFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { Agent, CursorAgentError } from '@cursor/sdk';

const [sessionId, promptFile, repoRootArg] = process.argv.slice(2);
if (!sessionId || !promptFile) {
  console.error('Usage: run.mjs <sessionId> <promptFile> [repoRoot]');
  process.exit(1);
}

const repoRoot = repoRootArg || process.env.SYNTHA_REPO_ROOT || process.cwd();
const sessionsDir = path.join(repoRoot, '_ai-share', 'synth-1-full', '.planning', 'agent-sessions');
mkdirSync(sessionsDir, { recursive: true });

const logFile = path.join(sessionsDir, `${sessionId}.jsonl`);
const metaFile = path.join(sessionsDir, `${sessionId}.meta.json`);
const plannerPort = process.env.PORT || '3001';

function writeMeta(patch) {
  let base = {};
  try {
    base = JSON.parse(readFileSync(metaFile, 'utf8'));
  } catch {
    /* empty */
  }
  writeFileSync(metaFile, `${JSON.stringify({ ...base, ...patch, updatedAt: new Date().toISOString() }, null, 2)}\n`);
}

function log(role, text, extra = {}) {
  appendFileSync(
    logFile,
    `${JSON.stringify({ role, text, at: new Date().toISOString(), ...extra })}\n`
  );
}

async function ingestScanResults() {
  const scanPath = path.join(
    repoRoot,
    '_ai-share',
    'synth-1-full',
    '.planning',
    `planner-scan-${sessionId}.json`
  );
  if (!existsSync(scanPath)) return null;
  try {
    const raw = readFileSync(scanPath, 'utf8');
    const body = JSON.parse(raw);
    const r = await fetch(`http://127.0.0.1:${plannerPort}/api/dev/platform-core/planner/discover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const j = await r.json();
    return j;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

const prompt = readFileSync(promptFile, 'utf8');
const apiKey = process.env.CURSOR_API_KEY?.trim();

writeMeta({ sessionId, status: 'starting', repoRoot, taskPromptFile: promptFile });

if (!apiKey) {
  log(
    'system',
    'CURSOR_API_KEY не задан. Получите ключ: cursor.com/dashboard/integrations → добавьте в .env.local как CURSOR_API_KEY=...'
  );
  writeMeta({ status: 'error', error: 'missing_api_key' });
  process.exit(1);
}

log('user', prompt.slice(0, 2000));
writeMeta({ status: 'running' });

let assistantBuffer = '';

try {
  const runtime = (process.env.PLANNER_AGENT_RUNTIME || 'local').trim().toLowerCase();
  const cloudRepo = process.env.PLANNER_AGENT_CLOUD_REPO_URL?.trim();

  const agentCreateOpts = {
    apiKey,
    model: { id: 'composer-2.5' },
    ...(runtime === 'cloud' && cloudRepo
      ? { cloud: { repos: [{ url: cloudRepo }] } }
      : { local: { cwd: repoRoot, settingSources: [] } }),
  };

  log(
    'system',
    runtime === 'cloud' && cloudRepo
      ? `Cursor cloud agent · repo ${cloudRepo}`
      : `Cursor local agent · cwd ${repoRoot}`
  );

  const agent = await Agent.create(agentCreateOpts);

  try {
    writeMeta({ cursorAgentId: agent.agentId });

    const run = await agent.send(prompt);
    writeMeta({ runId: run.id, status: 'streaming' });

    for await (const event of run.stream()) {
      if (event.type === 'assistant') {
        for (const block of event.message.content) {
          if (block.type === 'text' && block.text) {
            assistantBuffer += block.text;
            log('assistant', block.text, { stream: true });
          }
        }
      }
    }

    const result = await run.wait();

    if (result.status === 'error') {
      log('system', `Агент завершился с ошибкой (run ${result.id}). Проверьте diff в репо.`, {
        status: 'error',
      });
      writeMeta({ status: 'error', runStatus: result.status, runId: result.id });
      process.exit(2);
    }

    const finalText =
      (typeof result.result === 'string' && result.result) ||
      assistantBuffer ||
      'Агент завершил задачу. Проверьте изменения в репозитории и отметьте complete в planner.';

    log('assistant', finalText, { done: true, status: result.status });

    if (sessionId.startsWith('scan-')) {
      const ingested = await ingestScanResults();
      if (ingested?.ok) {
        log(
          'system',
          `Сканирование загружено в планировщик: +${ingested.added?.total ?? 0} пункт(ов). Обновите вкладку План.`
        );
      } else if (ingested?.error) {
        log('system', `Не удалось загрузить scan JSON: ${ingested.error}`);
      } else {
        log(
          'system',
          `Файл planner-scan-${sessionId}.json не найден — агент должен записать JSON по инструкции.`
        );
      }
    }

    writeMeta({ status: 'done', runStatus: result.status, runId: result.id });
  } finally {
    if (typeof agent[Symbol.asyncDispose] === 'function') {
      await agent[Symbol.asyncDispose]();
    }
  }
} catch (err) {
  const msg =
    err instanceof CursorAgentError
      ? `Cursor SDK: ${err.message}${err.isRetryable ? ' (можно повторить)' : ''}`
      : err instanceof Error
        ? err.message
        : String(err);
  log('system', msg, { status: 'error' });
  writeMeta({ status: 'error', error: msg });
  process.exit(1);
}
