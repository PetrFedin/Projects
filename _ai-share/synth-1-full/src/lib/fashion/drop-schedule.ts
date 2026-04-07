import type { Product } from '@/lib/types';

export type ProductDropInfo = {
  at: Date;
  label: string;
};

/** ISO-строка или timestamp в attributes — для дропов и предзаказа. */
export function parseProductDrop(product: Product): ProductDropInfo | null {
  const a = product.attributes ?? {};
  const raw = a.dropAt ?? a.dropDate ?? a.releaseAt ?? a.launchAt ?? a.preorderUntil;
  if (raw == null || raw === '') return null;
  const d = typeof raw === 'number' ? new Date(raw) : new Date(String(raw).trim());
  if (Number.isNaN(d.getTime())) return null;
  const label = String(a.dropLabel ?? a.releaseLabel ?? 'Старт продаж');
  return { at: d, label };
}

export function formatDropCountdown(target: Date, nowMs = Date.now()): string {
  const ms = target.getTime() - nowMs;
  if (ms <= 0) return 'Уже доступно';
  const sec = Math.floor(ms / 1000);
  const d = Math.floor(sec / 86400);
  const h = Math.floor((sec % 86400) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (d > 0) return `${d} д ${h} ч`;
  if (h > 0) return `${h} ч ${m} мин`;
  return `${m} мин`;
}
