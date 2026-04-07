import type { Product } from '@/lib/types';
import type { EaeuPassportV1 } from './types';

/** Цифровой паспорт изделия (ГОСТ/ЕАЭС Декларации). */
export function getEaeuPassport(product: Product): EaeuPassportV1 {
  const lab = product.attributes?.originCountry === 'Italy' ? 'ЦНИИШор' : 'Глобал Лаб Тест';
  
  return {
    id: `RU-D-${product.id.slice(0, 4).toUpperCase()}`,
    declarationNumber: `ЕАЭС N RU Д-CN.РА01.В.12345/26`,
    standard: product.category === 'Outerwear' ? 'ГОСТ 32119' : 'ГОСТ ISO 12947-2',
    validUntil: '2029-12-31',
    testingLab: lab,
    qrUrl: 'https://pub.fsa.gov.ru/rds/declaration/1234567',
  };
}
