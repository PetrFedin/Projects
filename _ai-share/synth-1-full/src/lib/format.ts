export const fmtMoney = (value: number, currency: string = 'RUB') => {
  const locale = 'ru-RU';
  // Российский рубль - основная валюта
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Конвертация валюты по курсу.
 * Все расчеты в системе в рублях, перевод только для отображения эквивалента.
 */
export const getCurrencyEquivalent = (valueInRub: number, targetCurrency: string, rate: number) => {
  const converted = valueInRub / rate;
  const locale =
    targetCurrency === 'USD' ? 'en-US' : targetCurrency === 'AED' ? 'en-AE' : 'ru-RU';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: targetCurrency,
    maximumFractionDigits: 0,
  }).format(converted);
};

export const fmtNumber = (value: number) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(value);

export const fmtPercent = (value: number) =>
  new Intl.NumberFormat('ru-RU', { style: 'percent', maximumFractionDigits: 1 }).format(value);
