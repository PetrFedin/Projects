import { LandedCostInput, LandedCostResult, MarginAnalysis } from '../types/finance';

/**
 * Landed Cost Engine
 * Расчет полной себестоимости товара с учетом логистики и налогов.
 */

export function calculateLandedCost(input: LandedCostInput): LandedCostResult {
  const { 
    baseCost, 
    freightCost, 
    insuranceCost, 
    dutyRate, 
    vatRate, 
    handlingFees, 
    batchSize 
  } = input;

  const unitFreight = freightCost / batchSize;
  const unitInsurance = insuranceCost / batchSize;
  const unitHandling = handlingFees / batchSize;
  
  // Пошлина обычно считается от (Base + Freight + Insurance)
  const dutyBase = baseCost + unitFreight + unitInsurance;
  const unitDuty = dutyBase * dutyRate;
  
  // НДС считается от (Duty Base + Duty)
  const unitVat = (dutyBase + unitDuty) * vatRate;

  const totalLandedCost = baseCost + unitFreight + unitInsurance + unitDuty + unitVat + unitHandling;

  return {
    unitBaseCost: baseCost,
    unitFreight,
    unitDuty,
    unitVat,
    unitHandling,
    totalLandedCost
  };
}

export function calculateMargin(landedCost: number, retailPrice: number): MarginAnalysis {
  const profit = retailPrice - landedCost;
  const marginPercent = (profit / retailPrice) * 100;

  return {
    landedCost,
    retailPrice,
    profit,
    marginPercent
  };
}
