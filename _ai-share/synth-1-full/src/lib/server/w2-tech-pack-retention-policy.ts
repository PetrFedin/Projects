import { MAX_W2_TECHPACK_BYTES } from '@/lib/server/w2-tech-pack-remote-s3';

/**
 * Ретеншн и лимиты (оператор задаёт в env; юридическую часть NDA — в политике компании, не в коде).
 */
export function w2TechPackMaxBytesEffective(): number {
  const n = Number(process.env.W2_TECHPACK_MAX_BYTES);
  if (Number.isFinite(n) && n > 0) return Math.min(n, 100 * 1024 * 1024);
  return MAX_W2_TECHPACK_BYTES;
}

/** Срок хранения объектов в днях (для future lifecycle/cron; сейчас — документация контракта). */
export function w2TechPackRetentionDays(): number | null {
  const n = Number(process.env.W2_TECHPACK_RETENTION_DAYS);
  if (Number.isFinite(n) && n > 0) return Math.floor(n);
  return null;
}
