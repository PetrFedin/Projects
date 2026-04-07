import type { Product } from '@/lib/types';
import { parseComposition } from './parse-composition';
import type { SustainabilityBreakdown } from './types';

const TAG_POINTS: { re: RegExp; pts: number; label: string }[] = [
  { re: /gots|organic|органич/i, pts: 18, label: 'Органика / GOTS' },
  { re: /recycl|переработ|rpet|re-?use/i, pts: 16, label: 'Переработка' },
  { re: /oeko|bluesign|fair\s*trade|fairtrade|справедлив/i, pts: 14, label: 'Сертификат' },
  { re: /low\s*impact|низк.*воздейств|water\s*save|эконом.*вод/i, pts: 12, label: 'Низкий след' },
  { re: /vegan|веган|без\s*кож/i, pts: 8, label: 'Vegan / без кожи' },
  { re: /biodegrad|биоразлага/i, pts: 10, label: 'Биоразлагаемость' },
  { re: /renewable|возобнов/i, pts: 8, label: 'Возобновляемое сырьё' },
  { re: /carbon\s*neutral|углерод|climate/i, pts: 12, label: 'Климат / CO₂' },
];

function haystack(p: Product): string {
  const tags = (p.sustainability ?? []).join(' ');
  const comp = parseComposition(p)
    .map((x) => x.material)
    .join(' ');
  return `${tags} ${comp} ${p.material ?? ''} ${p.description ?? ''}`.slice(0, 4000);
}

/** Детерминированный скоринг для фильтров и PDP до подключения LCA. */
export function deriveSustainabilityBreakdown(product: Product): SustainabilityBreakdown {
  const text = haystack(product);
  const matched: string[] = [];
  let raw = 0;
  for (const { re, pts, label } of TAG_POINTS) {
    if (re.test(text)) {
      matched.push(label);
      raw += pts;
    }
  }
  if ((product.sustainability?.length ?? 0) > 0 && matched.length === 0) {
    matched.push('Метки устойчивости в карточке');
    raw += 12;
  }
  const score = Math.min(100, raw);
  let tier: SustainabilityBreakdown['tier'] = 'unknown';
  if (score >= 55) tier = 'high';
  else if (score >= 28) tier = 'mid';
  else if (score > 0) tier = 'low';

  const summary =
    matched.length > 0
      ? `Сигналы: ${matched.slice(0, 4).join(' · ')}${matched.length > 4 ? '…' : ''}`
      : 'Явных eco-сигналов в данных нет — проверьте PIM и паспорт изделия.';

  return { score, tier, matchedSignals: matched, summary };
}
