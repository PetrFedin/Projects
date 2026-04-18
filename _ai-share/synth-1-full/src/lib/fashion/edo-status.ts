import type { EdoDocumentV1 } from './types';

/** Статус электронного документооборота (ЭДО / EDI). */
export function getRecentEdoDocuments(): EdoDocumentV1[] {
  return [
    {
      id: 'UPD-2026-00451',
      type: 'upd',
      status: 'signed',
      counterparty: 'ООО "Ритейл Маркет"',
      totalAmount: 450000,
      signedAt: '2026-03-28',
    },
    {
      id: 'UPD-2026-00482',
      type: 'upd',
      status: 'pending',
      counterparty: 'ИП "Модный Мир"',
      totalAmount: 125000,
    },
  ];
}
