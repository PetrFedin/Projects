/**
 * Отображение сумм в рублях (РФ) + опциональный пересчёт по курсу для справки.
 * Канон хранения в досье/BOM — RUB; USD/EUR только через калькулятор.
 */

export const W2_FX_PREFS_LS_KEY = 'w2-fx-prefs-v1';

export type Workshop2FxPrefs = {
  /** Курс: 1 единица referenceCurrency = rateRub рублей */
  referenceCurrency: 'USD' | 'EUR' | 'CNY';
  rateRub: number;
  /** Дата курса (ISO date) */
  rateDate: string;
};

export const W2_DEFAULT_FX_PREFS: Workshop2FxPrefs = {
  referenceCurrency: 'USD',
  rateRub: 92.5,
  rateDate: new Date().toISOString().slice(0, 10),
};

export function readWorkshop2FxPrefs(): Workshop2FxPrefs {
  if (typeof window === 'undefined') return W2_DEFAULT_FX_PREFS;
  try {
    const raw = localStorage.getItem(W2_FX_PREFS_LS_KEY);
    if (!raw) return W2_DEFAULT_FX_PREFS;
    const p = JSON.parse(raw) as Partial<Workshop2FxPrefs>;
    if (!p.rateRub || p.rateRub <= 0) return W2_DEFAULT_FX_PREFS;
    return {
      referenceCurrency: p.referenceCurrency ?? W2_DEFAULT_FX_PREFS.referenceCurrency,
      rateRub: p.rateRub,
      rateDate: p.rateDate ?? W2_DEFAULT_FX_PREFS.rateDate,
    };
  } catch {
    return W2_DEFAULT_FX_PREFS;
  }
}

export function persistWorkshop2FxPrefs(prefs: Workshop2FxPrefs): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(W2_FX_PREFS_LS_KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

/** Формат суммы в рублях для UI. */
export function formatWorkshop2Rub(amount: number, fractionDigits = 2): string {
  if (!Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

export function rubToReference(amountRub: number, prefs: Workshop2FxPrefs): number {
  return amountRub / prefs.rateRub;
}

export function referenceToRub(amountRef: number, prefs: Workshop2FxPrefs): number {
  return amountRef * prefs.rateRub;
}

/** Перевод цены из справочника (часто USD) в рубли по сохранённому курсу. */
export function libraryUsdToRub(usd: number, prefs?: Workshop2FxPrefs): number {
  const p = prefs ?? readWorkshop2FxPrefs();
  if (p.referenceCurrency !== 'USD') return usd * p.rateRub;
  return referenceToRub(usd, p);
}
