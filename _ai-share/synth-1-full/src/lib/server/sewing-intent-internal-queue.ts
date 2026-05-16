import { appendFile, mkdir } from 'fs/promises';
import { dirname, resolve } from 'path';
import type { SewingOrderIntentServerRecordV1 } from '@/lib/client/sewing-order-intent';

/**
 * Внутренняя «очередь» для бренд-процесса/воркеров: NDJSON, опциональный путь.
 * Не заменяет domain events / webhook; дублирует факт commit для at-least-once offline ETL.
 */
const DEFAULT_FILE = 'data/sewing-intent-task-queue.jsonl';

function pathFromEnv(): string {
  const raw = process.env.SEWING_INTENT_INTERNAL_QUEUE_FILE?.trim();
  return raw ? resolve(raw) : resolve(process.cwd(), DEFAULT_FILE);
}

export async function appendSewingIntentInternalTask(
  record: SewingOrderIntentServerRecordV1
): Promise<void> {
  const file = pathFromEnv();
  const line = JSON.stringify({ type: 'sewing_intent_committed' as const, at: new Date().toISOString(), record }) + '\n';
  try {
    await mkdir(dirname(file), { recursive: true });
    await appendFile(file, line, { encoding: 'utf8' });
  } catch (e) {
    console.error('[sewing-intent-internal-queue] append failed', e);
  }
}
