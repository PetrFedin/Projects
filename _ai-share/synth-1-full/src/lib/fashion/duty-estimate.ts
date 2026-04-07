import type { DutyEstimateResult } from './types';

/** Демо пошлина + НДС для РФ (не юридическая консультация). Заменить на тарифный API. */
export function estimateFashionImportDuty(
  amountRub: number,
  categoryHint: string,
  _originCountry: string,
): DutyEstimateResult {
  const c = categoryHint.toLowerCase();
  let ratePct = 12;
  if (/обув|shoe|boot|кроссов/i.test(c)) ratePct = 15;
  else if (/сумк|аксесс|ремен|шарф|шапк|bag|belt|scarf|hat/i.test(c)) ratePct = 10;
  else if (/пальто|куртк|пухов|outer|coat|jacket/i.test(c)) ratePct = 12;

  const dutyRub = Math.round((amountRub * ratePct) / 100);
  const vatBase = amountRub + dutyRub;
  const vatRub = Math.round((vatBase * 20) / 100);
  const totalRub = amountRub + dutyRub + vatRub;
  const note =
    'Оценка для демо: ставка по ключевым словам категории + НДС 20% от базы (товар + пошлина). Учитывайте льготы и ТПП.';

  return { ratePct, dutyRub, vatRub, totalRub, note };
}
