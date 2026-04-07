import type { B2BContractV1 } from './types';

/** Генератор B2B спецификаций и договоров на основе корзины шоурума. */
export function generateB2BContract(partnerId: string, orderValue: number): B2BContractV1 {
  const id = `CNTR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`;
  return {
    id,
    partnerId,
    orderValue,
    status: 'draft',
    terms: '50% Pre-payment, 50% Post-shipment (Net 30)',
    generatedDate: new Date().toISOString().split('T')[0],
    legalEntityRu: 'ООО "ФЭШН ТЕХНОЛОДЖИ СИНТ"',
  };
}

export function getContractPdfUrl(contractId: string): string {
  return `/api/documents/contract/${contractId}.pdf`; // Mock path
}
