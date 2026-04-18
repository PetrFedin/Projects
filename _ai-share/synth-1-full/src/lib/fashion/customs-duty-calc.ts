import type { Product } from '@/lib/types';
import type { CustomsDutyV1 } from './types';

/** Расчет ввозных пошлин для РФ (Cross-border / Import Estimator). */
export function calculateCustomsDuty(product: Product): CustomsDutyV1 {
  const eurRate = 100; // Mock rate
  const priceEur = Math.round(product.price / eurRate);
  const weight = 0.5 + (product.price % 3); // Mock weight
  const thresholdEur = 200; // EAEU threshold for individuals

  let duty = 0;
  if (priceEur > thresholdEur) {
    duty = (priceEur - thresholdEur) * 0.15; // 15% on the excess
  }

  const brokerFee = 500; // Mock broker fee in RUB
  const totalRub = Math.round(duty * eurRate) + brokerFee;

  return {
    priceEur,
    weightKg: Math.round(weight * 10) / 10,
    dutyEur: Math.round(duty * 100) / 100,
    brokerFee,
    totalDutyRub: totalRub,
    isAboveThreshold: priceEur > thresholdEur,
  };
}
