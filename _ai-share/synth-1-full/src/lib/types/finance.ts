/**
 * Finance & Costing Types
 */

/** Inputs for per-unit landed cost (logic/landed-cost.ts). */
export interface LandedCostInput {
  baseCost: number;
  freightCost: number;
  insuranceCost: number;
  dutyRate: number;
  vatRate: number;
  handlingFees: number;
  batchSize: number;
}

export interface LandedCostResult {
  unitBaseCost: number;
  unitFreight: number;
  unitDuty: number;
  unitVat: number;
  unitHandling: number;
  totalLandedCost: number;
}

export interface MarginAnalysis {
  landedCost: number;
  retailPrice: number;
  profit: number;
  marginPercent: number;
}

export interface LandedCostBreakdown {
  id: string;
  productId: string;
  currency: string;
  
  // Production Costs
  fabricCost: number;
  cmtCost: number; // Cut, Make, Trim
  trimsCost: number;
  packagingCost: number;
  
  // Logistics & Duties
  freightCost: number;
  dutyRate: number; // %
  calculatedDuty: number;
  insuranceCost: number;
  markingCost: number; // Честный ЗНАК etc.
  
  // Operations
  overheadRate: number; // %
  calculatedOverhead: number;
  amortizationCost: number;
  
  totalLandedCost: number;
  targetRetailPrice: number;
  targetMargin: number; // %
}

export interface EscrowMilestone {
  id: string;
  title: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'funded' | 'released' | 'disputed';
  dueAt?: string;
  releasedAt?: string;
  conditions: string[];
}

export interface EscrowAccount {
  id: string;
  orderId: string;
  brandId: string;
  factoryId: string;
  totalAmount: number;
  balance: number;
  status: 'active' | 'completed' | 'on_hold';
  milestones: EscrowMilestone[];
}
