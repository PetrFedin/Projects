/**
 * B2B-Center: Мультивалютность — поддержка нескольких валют и курсов.
 * РФ: RUB, USD, EUR, CNY; курсы ЦБ РФ или внутренние.
 */

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  /** Количество знаков после запятой */
  decimals: number;
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'RUB', name: 'Российский рубль', symbol: '₽', decimals: 2 },
  { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2 },
  { code: 'CNY', name: 'Китайский юань', symbol: '¥', decimals: 2 },
  { code: 'GBP', name: 'British Pound', symbol: '£', decimals: 2 },
];

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  /** Дата курса (ISO) */
  date: string;
  source?: 'cbr' | 'internal' | 'manual';
}

/** Демо: фиксированные курсы к RUB */
export const DEMO_RATES_TO_RUB: Record<string, number> = {
  RUB: 1,
  USD: 95.5,
  EUR: 102,
  CNY: 13.2,
  GBP: 120,
};

export function convertAmount(amount: number, fromCurrency: string, toCurrency: string): number {
  if (fromCurrency === toCurrency) return amount;
  const fromRate = DEMO_RATES_TO_RUB[fromCurrency] ?? 1;
  const toRate = DEMO_RATES_TO_RUB[toCurrency] ?? 1;
  return (amount * fromRate) / toRate;
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const c = SUPPORTED_CURRENCIES.find((x) => x.code === currencyCode);
  const symbol = c?.symbol ?? currencyCode;
  const decimals = c?.decimals ?? 2;
  return `${amount.toLocaleString('ru-RU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })} ${symbol}`;
}
