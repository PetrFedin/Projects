import type { EdiDocumentV1 } from './types';

/** Трекинг ЭДО (EDI) документооборота B2B. */
export function getEdiDocuments(partnerId: string): EdiDocumentV1[] {
  return [
    { id: 'EDI-DOC-001', type: 'contract', status: 'signed', ediOperator: 'Diadoc', legalRef: '№24/2026-SYNTH' },
    { id: 'EDI-DOC-002', type: 'specification', status: 'pending', ediOperator: 'Diadoc', legalRef: 'Order SS26-042' },
    { id: 'EDI-DOC-003', type: 'invoice', status: 'pending', ediOperator: 'Diadoc', legalRef: 'INV-4491-RU' },
  ];
}

export function getEdiOperatorLink(operator: string): string {
  if (operator === 'Diadoc') return 'https://diadoc.ru';
  if (operator === 'Sbis') return 'https://sbis.ru';
  return '#';
}
