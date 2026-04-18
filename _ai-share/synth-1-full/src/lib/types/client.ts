/**
 * Client OS Types
 * Includes Body Measurements, Digital Wardrobe, and AI Styling.
 */

export interface BodyMeasurements {
  id: string;
  userId: string;
  unit: 'cm' | 'in';
  height: number;
  weight?: number;

  // Core circumferences
  neck?: number;
  chest: number;
  waist: number;
  hips: number;

  // Shoulders and arms
  shoulderWidth?: number;
  armLength?: number;
  bicep?: number;
  wrist?: number;

  // Legs
  insideLeg?: number;
  thigh?: number;
  calf?: number;
  ankle?: number;

  // Specialized
  bust?: number; // for women's wear
  underBust?: number;

  // Metadata
  scannedAt: string;
  scanMethod: 'ai_vision' | 'manual' | 'import';
  confidenceScore?: number; // for AI scans
  threeDModelUrl?: string; // pointer to GLB/USDZ file
}

export interface DigitalWardrobeItem {
  id: string;
  userId: string;
  productId: string;
  brandId: string;
  brandName: string;
  productName: string;
  category: string;
  size: string;
  color: string;
  imageUrl: string;
  purchaseDate: string;
  purchasePrice?: number;
  currency?: string;
  condition: 'new' | 'good' | 'worn' | 'needs_repair';
  tags: string[];
  lastWornAt?: string;
  timesWorn: number;
  isFavorite: boolean;
  resaleEligible: boolean;
}

export interface AIStyleRecommendation {
  id: string;
  userId: string;
  type: 'outfit' | 'product_match' | 'size_advice';
  title: string;
  description: string;
  logic: string; // e.g., "Matches your navy blazer and fits your waist profile"
  suggestedItems: {
    productId: string;
    reason: string;
    confidence: number;
  }[];
  wardrobeItemsUsed: string[]; // IDs of DigitalWardrobeItem
  createdAt: string;
}

export interface FitMatchResult {
  productId: string;
  recommendedSize: string;
  confidence: number; // 0-1
  fitType: 'tight' | 'perfect' | 'loose';
  sizeChartUsed: string;
  measurementDelta: {
    chest?: number;
    waist?: number;
    hips?: number;
  };
}

export interface ClientProfile {
  id: string;
  userId: string;
  measurements?: BodyMeasurements;
  wardrobe: DigitalWardrobeItem[];
  stylePreferences: {
    preferredColors: string[];
    dislikedColors: string[];
    preferredStyles: string[]; // e.g., "minimalist", "streetwear"
    fitPreference: 'slim' | 'regular' | 'oversized';
    budgetRange?: {
      min: number;
      max: number;
      currency: string;
    };
  };
  allergyAlerts: string[]; // e.g., "wool", "nickel", "polyester"
  loyaltyPoints: number;
  tier: 'silver' | 'gold' | 'platinum';
}
