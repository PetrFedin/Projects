/**
 * Digital Product Passport (DPP) Types
 */

export interface ProductPassport {
  id: string;
  productId: string;
  sku: string;
  name: string;

  // Sustainability & Origin
  originCountry: string;
  factoryName: string;
  factoryLocation: string;
  composition: { material: string; percentage: number }[];
  certifications: string[]; // ['GOTS', 'OEKO-TEX', 'EAC']

  // Lifecycle
  manufactureDate: string;
  batchNumber: string;
  carbonFootprint: number; // in kg CO2
  waterUsage: number; // in liters

  // Care & Circularity
  careInstructions: string[];
  repairGuideUrl?: string;
  recyclingInstructions: string;
  resaleEligible: boolean;

  // Authenticity
  isAuthentic: boolean;
  blockchainHash?: string;
}

export interface MaterialSource {
  material: string;
  origin: string; // e.g., "Egypt", "India"
  supplier: string;
  sustainabilityScore: number; // 0-100
}
