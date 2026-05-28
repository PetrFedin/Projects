import type { DigitalTwinTestV1 } from './types';

/** Демо-данные тестов цифровых двойников (A/B тестирование дизайна до пошива). */
export function loadDigitalTwinTests(): DigitalTwinTestV1[] {
  return [
    {
      id: 'dt-01',
      designName: 'Urban Tech Shell',
      variants: 3,
      votes: 1240,
      conversionEstimate: 4.2,
      status: 'active',
    },
    {
      id: 'dt-02',
      designName: 'Linen Summer Set',
      variants: 2,
      votes: 850,
      conversionEstimate: 3.8,
      status: 'completed',
    },
    {
      id: 'dt-03',
      designName: 'Signature Blazer V2',
      variants: 4,
      votes: 2100,
      conversionEstimate: 5.1,
      status: 'active',
    },
  ];
}
