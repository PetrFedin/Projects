import type { Product } from '@/lib/types';
import type { FashionSeasonParsed } from './types';

/** Нормализация строки сезона для фильтров и мерча (без тяжёлого NLP). */
export function parseFashionSeasonLabel(
  season: string,
  tags?: Product['tags']
): FashionSeasonParsed {
  const raw = (season || '').trim();
  let half: FashionSeasonParsed['half'] = null;
  const u = raw.toUpperCase();
  if (/\bSS\b|SPRING|SUMMER|ВЕСН|ЛЕТО|СС/i.test(raw)) half = 'SS';
  if (/\bFW\b|\bAW\b|FALL|WINTER|ОСЕН|ЗИМ|ЗИМА|FW/i.test(raw)) half = 'FW';
  const m = raw.match(/(20[2-3]\d)/);
  const year = m ? parseInt(m[1], 10) : null;
  const isCarryover = !!(tags && tags.includes('carryover'));
  return { raw: raw || '—', half, year, isCarryover };
}

export function seasonBucketKey(p: Product): string {
  const x = parseFashionSeasonLabel(p.season, p.tags);
  if (x.isCarryover) return 'carryover';
  if (x.half && x.year) return `${x.half} ${x.year}`;
  if (x.half) return x.half;
  if (x.raw && x.raw !== '—') return x.raw;
  return 'unsorted';
}

export function seasonBucketLabel(key: string): string {
  if (key === 'carryover') return 'Carryover';
  if (key === 'unsorted') return 'Без сезона';
  return key;
}
