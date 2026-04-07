import type { EaeuCustomsValueV1 } from './types';

/** Расчет таможенной стоимости ЕАЭС для B2B контрактов. */
export function calculateEaeuCustomsValue(sku: string, unitPrice: number, qty: number): EaeuCustomsValueV1 {
  const transactionValue = unitPrice * qty;
  const insuranceCost = transactionValue * 0.005; // 0.5% insurance
  const freightCost = 150000; // Mock flat freight for order simulation
  
  const totalCustomsValue = transactionValue + insuranceCost + freightCost;
  const dutyRatePercent = 10; // Default fashion duty
  const vatRatePercent = 20; // Russian VAT

  const dutyAmount = totalCustomsValue * (dutyRatePercent / 100);
  const vatAmount = (totalCustomsValue + dutyAmount) * (vatRatePercent / 100);

  return {
    sku,
    transactionValue,
    insuranceCost,
    freightCost,
    totalCustomsValue,
    dutyRatePercent,
    vatRatePercent,
    estimatedTotalTax: Math.round(dutyAmount + vatAmount),
  };
}
