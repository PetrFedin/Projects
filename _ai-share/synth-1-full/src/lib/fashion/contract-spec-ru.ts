import type { RUContractSpecV1 } from './types';

/** Генератор спецификации к договору и УПД для РФ. */
export function generateRUContractSpec(
  buyerId: string,
  orderItems: { sku: string; name: string; qty: number; price: number }[]
): RUContractSpecV1 {
  const totalQuantity = orderItems.reduce((acc, item) => acc + item.qty, 0);
  const totalAmountRub = orderItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  return {
    id: `SPEC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    docNumber: `№${Math.floor(Math.random() * 1000)}/2026`,
    date: new Date().toLocaleDateString('ru-RU'),
    buyerLegalName: 'ООО "Фэшн Ритейл Групп"',
    totalQuantity,
    totalAmountRub,
    items: orderItems,
  };
}
