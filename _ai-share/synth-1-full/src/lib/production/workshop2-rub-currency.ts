/**
 * Wave 10 RU: единый канон ₽ — формат, parse, НДС (сквозной для BOM, B2B, комиссий, landed cost).
 */
import { isWorkshop2RuMarket } from '@/lib/production/workshop2-market-profile';

const RU_LOCALE = 'ru-RU';

/** Формат суммы в рублях для UI (Intl + символ ₽). */
export function formatWorkshop2RubCurrency(
  amountRub: number,
  opts?: { fractionDigits?: number; locale?: string }
): string {
  if (!Number.isFinite(amountRub)) return '—';
  const fractionDigits = opts?.fractionDigits ?? 0;
  const formatted = new Intl.NumberFormat(opts?.locale ?? RU_LOCALE, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amountRub);
  return `${formatted} ₽`;
}

/** Парсит ввод пользователя («1 500 000», «1500000,50») в число рублей. */
export function parseWorkshop2RubInput(raw: string): number | null {
  const cleaned = String(raw ?? '')
    .replace(/\s/g, '')
    .replace(/₽/g, '')
    .replace(',', '.');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** НДС «в том числе» из суммы с НДС (цены с НДС, ставка 20% → 20/120). */
export function calcWorkshop2VatFromGrossRub(input: { grossRub: number; vatRatePct: number }): {
  netRub: number;
  vatRub: number;
  grossRub: number;
  vatRatePct: number;
} {
  const rate = Math.max(0, input.vatRatePct);
  const gross = Math.max(0, input.grossRub);
  if (rate <= 0) {
    return { netRub: gross, vatRub: 0, grossRub: gross, vatRatePct: 0 };
  }
  const vatRub = Math.round((gross * rate) / (100 + rate));
  return {
    grossRub: gross,
    vatRub,
    netRub: gross - vatRub,
    vatRatePct: rate,
  };
}

/** НДС сверху от net (для счёта-оферты). */
export function calcWorkshop2VatOnNetRub(input: { netRub: number; vatRatePct: number }): {
  netRub: number;
  vatRub: number;
  grossRub: number;
  vatRatePct: number;
} {
  const rate = Math.max(0, input.vatRatePct);
  const net = Math.max(0, input.netRub);
  const vatRub = Math.round((net * rate) / 100);
  return {
    netRub: net,
    vatRub,
    grossRub: net + vatRub,
    vatRatePct: rate,
  };
}

/** В рынке РФ всегда показываем ₽ в UI (даже если BOM currency USD). */
export function shouldShowWorkshop2RubInUi(
  env: Record<string, string | undefined> = process.env
): boolean {
  return isWorkshop2RuMarket(env);
}
