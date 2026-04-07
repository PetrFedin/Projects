/**
 * Analytics & AI SKU Planning Types
 */

export interface SKUDemandForecast {
  productId: string;
  sku: string;
  currentStock: number;
  predictedDemand: number; // For next 30/60/90 days
  confidence: number;
  recommendedReplenishment: number;
  seasonalityIndex: number; // 0-1
  trendScore: number; // -1 to 1
  marketSellThroughAvg: number;
  predictedSellThrough: number;
}

export interface CollectionPlanningMatrix {
  id: string;
  brandId: string;
  name: string;
  season: string;
  targetBudget: number;
  targetMargin: number;
  items: PlannedSKU[];
  status: 'draft' | 'simulating' | 'approved' | 'in_production';
  createdAt: string;
}

export interface PlannedSKU {
  id: string;
  name: string;
  category: string;
  type: 'core' | 'trend' | 'novelty';
  plannedQty: number;
  estimatedCost: number;
  targetRetailPrice: number;
  estimatedMargin: number;
  aiRiskScore: number; // Potential for overstock/understock
}

export interface MarketInsight {
  category: string;
  trendDirection: 'rising' | 'stable' | 'falling';
  topColors: string[];
  topMaterials: string[];
  averagePricePoint: number;
  velocityRank: number; // 1-100
}
