import { ProductPassport, MaterialSource } from '../types/passport';

/**
 * Digital Product Passport Utils
 * Генерация QR-кодов истории вещи и прозрачность цепочки поставок.
 */

// Mock Product Passport Database
export const PASS_DB: Record<string, ProductPassport> = {
  'PASS-9921': {
    id: 'PASS-9921',
    productId: 'p-silk-dress',
    sku: 'SD-001-BL-S',
    name: 'Silk Evening Dress',
    originCountry: 'Italy',
    factoryName: 'Milan Silk Mills',
    factoryLocation: 'Milan, Italy',
    composition: [
      { material: 'Silk', percentage: 100 }
    ],
    certifications: ['OEKO-TEX Standard 100', 'Fair Trade Certified'],
    manufactureDate: '2026-01-15',
    batchNumber: 'B-26-001',
    carbonFootprint: 1.25,
    waterUsage: 2500,
    careInstructions: ['Dry Clean Only', 'Iron Low Heat', 'Do Not Bleach'],
    repairGuideUrl: 'https://synth1.fashion/care/silk-repair',
    recyclingInstructions: 'Silk is a natural fiber and can be composted or recycled into high-quality textiles.',
    resaleEligible: true,
    isAuthentic: true,
    blockchainHash: '0x8872...f9e1'
  },
  'PASS-1022': {
    id: 'PASS-1022',
    productId: 'p-cotton-tee',
    sku: 'CT-002-WH-M',
    name: 'Essential White Tee',
    originCountry: 'Turkey',
    factoryName: 'Istanbul Textile Co.',
    factoryLocation: 'Istanbul, Turkey',
    composition: [
      { material: 'Organic Cotton', percentage: 95 },
      { material: 'Elastane', percentage: 5 }
    ],
    certifications: ['GOTS Organic', 'EAC'],
    manufactureDate: '2026-02-10',
    batchNumber: 'B-26-042',
    carbonFootprint: 0.85,
    waterUsage: 1200,
    careInstructions: ['Machine Wash 30°C', 'Do Not Tumble Dry'],
    recyclingInstructions: 'Organic cotton can be mechanically recycled into insulation material.',
    resaleEligible: true,
    isAuthentic: true
  }
};

/**
 * Get Passport by ID
 */
export function getProductPassport(id: string): ProductPassport | null {
  return PASS_DB[id] || null;
}

/**
 * Generate QR Link for Passport
 */
export function generatePassportLink(id: string): string {
  return `https://synth1.fashion/client/passport/${id}`;
}

/**
 * Mock supply chain data
 */
export const MATERIAL_SOURCES: Record<string, MaterialSource[]> = {
  'PASS-9921': [
    { material: 'Raw Silk', origin: 'Como, Italy', supplier: 'Como Silk Group', sustainabilityScore: 92 },
    { material: 'Dyes', origin: 'Switzerland', supplier: 'EcoColor AG', sustainabilityScore: 98 }
  ]
};
