/**
 * Finance & Costing Types
 */

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
