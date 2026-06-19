import { access, mkdir, readFile, readdir, unlink, writeFile } from 'fs/promises';
import { closeSync, openSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'path';
import { buildAgentDispatchPrompt } from '@/lib/server/platform-core-planner-analyze.server';
import { isPlatformCorePlannerClosedWaveTitle } from '@/lib/platform-core-planner-auto-done';
import {
  readPlannerRuntimeState,
  writePlannerRuntimeState,
  type PlannerRuntimeState,
} from '@/lib/server/platform-core-planner-runtime.server';

export type AgentSessionMessage = {
  role: 'user' | 'assistant' | 'system';
  text: string;
  at: string;
  stream?: boolean;
  done?: boolean;
};

export type AgentSessionMeta = {
  sessionId: string;
  taskId: string;
  taskTitle: string;
  status: 'starting' | 'running' | 'streaming' | 'done' | 'error';
  startedAt: string;
  updatedAt?: string;
  cursorAgentId?: string;
  runId?: string;
  error?: string;
  pid?: number;
};

const SESSIONS_SUBDIR = 'agent-sessions';

function sessionsDir(): string {
  return path.join(process.cwd(), '.planning', SESSIONS_SUBDIR);
}

export function sessionLogPath(sessionId: string): string {
  return path.join(sessionsDir(), `${sessionId}.jsonl`);
}

export function sessionMetaPath(sessionId: string): string {
  return path.join(sessionsDir(), `${sessionId}.meta.json`);
}

export function monorepoRootFromCwd(): string {
  return path.join(process.cwd(), '../..');
}

export async function plannerAgentRunnerInstalled(): Promise<boolean> {
  const runnerDir = path.join(monorepoRootFromCwd(), 'scripts', 'planner-cursor-agent');
  const pkg = path.join(runnerDir, 'node_modules', '@cursor', 'sdk');
  try {
    await access(pkg);
    return true;
  } catch {
    return false;
  }
}

export async function readSessionMessages(sessionId: string): Promise<AgentSessionMessage[]> {
  try {
    const raw = await readFile(sessionLogPath(sessionId), 'utf8');
    return raw
      .split('\n')
      .filter(Boolean)
      .map((line) => JSON.parse(line) as AgentSessionMessage);
  } catch {
    return [];
  }
}

export async function readSessionMeta(sessionId: string): Promise<AgentSessionMeta | null> {
  try {
    return JSON.parse(await readFile(sessionMetaPath(sessionId), 'utf8')) as AgentSessionMeta;
  } catch {
    return null;
  }
}

/** Collapse stream chunks into readable turns for chat UI. */
export function collapseSessionMessages(messages: AgentSessionMessage[]): AgentSessionMessage[] {
  const out: AgentSessionMessage[] = [];
  let streamBuf = '';

  for (const m of messages) {
    if (m.role === 'assistant' && m.stream && !m.done) {
      streamBuf += m.text;
      continue;
    }
    if (streamBuf) {
      out.push({ role: 'assistant', text: streamBuf, at: m.at });
      streamBuf = '';
    }
    if (m.role === 'assistant' && m.stream) {
      out.push({ role: 'assistant', text: m.text, at: m.at, done: m.done });
    } else {
      out.push(m);
    }
  }
  if (streamBuf) {
    out.push({
      role: 'assistant',
      text: streamBuf,
      at: new Date().toISOString(),
    });
  }
  return out;
}

export async function startPlannerAgentSession(input: {
  taskId: string;
  taskTitle: string;
  priority: string;
  source?: string;
  href?: string;
  by: string;
  sessionId?: string;
  promptText?: string;
}): Promise<{ sessionId: string; promptPath: string }> {
  const sessionId =
    input.sessionId ?? `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const dir = sessionsDir();
  await mkdir(dir, { recursive: true });

  const prompt =
    input.promptText ??
    buildAgentDispatchPrompt({
      id: input.taskId,
      title: input.taskTitle,
      priority: input.priority,
      source: input.source,
      href: input.href,
    });

  const promptPath = path.join(dir, `${sessionId}.prompt.txt`);
  await writeFile(promptPath, prompt, 'utf8');

  const meta: AgentSessionMeta = {
    sessionId,
    taskId: input.taskId,
    taskTitle: input.taskTitle,
    status: 'starting',
    startedAt: new Date().toISOString(),
  };
  await writeFile(sessionMetaPath(sessionId), `${JSON.stringify(meta, null, 2)}\n`, 'utf8');

  const state = await readPlannerRuntimeState();
  state.activeAgentSessionId = sessionId;
  state.agentSessions = state.agentSessions ?? {};
  state.agentSessions[sessionId] = {
    taskId: input.taskId,
    taskTitle: input.taskTitle,
    startedAt: meta.startedAt,
    by: input.by,
  };
  await writePlannerRuntimeState(state);

  return { sessionId, promptPath };
}

export async function spawnPlannerCursorAgent(
  sessionId: string,
  promptPath: string,
  opts?: { runtime?: 'local' | 'cloud' }
): Promise<number> {
  const repoRoot = monorepoRootFromCwd();
  const runnerDir = path.join(repoRoot, 'scripts', 'planner-cursor-agent');
  const runnerScript = path.join(runnerDir, 'run.mjs');
  const runtime = opts?.runtime ?? 'local';

  const errLog = path.join(sessionsDir(), `${sessionId}.stderr.log`);
  const errFd = openSync(errLog, 'a');

  const child = spawn(process.execPath, [runnerScript, sessionId, promptPath, repoRoot], {
    cwd: runnerDir,
    detached: true,
    stdio: ['ignore', 'ignore', errFd],
    env: {
      ...process.env,
      SYNTHA_REPO_ROOT: repoRoot,
      CURSOR_API_KEY: process.env.CURSOR_API_KEY ?? '',
      PLANNER_AGENT_RUNTIME: runtime,
    },
  });
  child.unref();
  try {
    closeSync(errFd);
  } catch {
    /* best-effort */
  }

  const meta = (await readSessionMeta(sessionId)) ?? {
    sessionId,
    taskId: '',
    taskTitle: '',
    status: 'starting' as const,
    startedAt: new Date().toISOString(),
  };
  meta.pid = child.pid ?? undefined;
  meta.status = 'running';
  await writeFile(sessionMetaPath(sessionId), `${JSON.stringify(meta, null, 2)}\n`, 'utf8');

  return child.pid ?? 0;
}

export async function openCursorIde(repoRoot: string): Promise<void> {
  if (process.platform !== 'darwin') return;
  const { execFile } = await import('node:child_process');
  await new Promise<void>((resolve) => {
    execFile('open', ['-a', 'Cursor', repoRoot], () => resolve());
  });
}

export function hasCursorApiKey(): boolean {
  return Boolean(process.env.CURSOR_API_KEY?.trim());
}

export async function loadCursorApiKeyFromEnvFiles(): Promise<void> {
  if (process.env.CURSOR_API_KEY?.trim()) return;
  const candidates = [
    path.join(process.cwd(), '.env.local'),
    path.join(monorepoRootFromCwd(), '.env'),
    path.join(monorepoRootFromCwd(), '.env.local'),
  ];
  for (const file of candidates) {
    try {
      const raw = await readFile(file, 'utf8');
      const m = raw.match(/^\s*CURSOR_API_KEY\s*=\s*(.+)\s*$/m);
      if (m?.[1]) {
        const value = m[1].trim().replace(/^["']|["']$/g, '');
        if (!value || value === 'cursor_...' || value.startsWith('cursor_...')) continue;
        process.env.CURSOR_API_KEY = value;
        return;
      }
    } catch {
      /* skip */
    }
  }
}

export async function getActiveSessionId(state: PlannerRuntimeState): Promise<string | null> {
  return state.activeAgentSessionId ?? null;
}

export async function listRecentSessionIds(limit = 5): Promise<string[]> {
  try {
    const files = await readdir(sessionsDir());
    return files
      .filter((f) => f.endsWith('.meta.json'))
      .map((f) => f.replace('.meta.json', ''))
      .slice(-limit);
  } catch {
    return [];
  }
}

/** Архивирует meta/prompt закрытых e2e-волн (источник «фантомных» P0 в истории агента). */
export async function purgeClosedWaveAgentSessionFiles(): Promise<number> {
  let removed = 0;
  try {
    const dir = sessionsDir();
    const files = await readdir(dir);
    for (const file of files) {
      if (!file.endsWith('.meta.json')) continue;
      const raw = await readFile(path.join(dir, file), 'utf8');
      const meta = JSON.parse(raw) as { taskTitle?: string };
      if (!isPlatformCorePlannerClosedWaveTitle(String(meta.taskTitle ?? ''))) continue;
      const sessionId = file.replace(/\.meta\.json$/, '');
      for (const suffix of ['.meta.json', '.prompt.txt', '.log.txt', '.messages.jsonl']) {
        try {
          await unlink(path.join(dir, `${sessionId}${suffix}`));
        } catch {
          /* ignore missing */
        }
      }
      removed += 1;
    }
  } catch {
    return removed;
  }
  return removed;
}
