export type DPPMetrics = {
  passportId: string;
  carbonFootprint: string;
  waterUsage: string;
  recycledContentPct: string;
  ecoScore: string;
};

export type BOMItem = {
  label: string;
  qty?: number;
  unit?: string;
};

const ECO_FACTORS: Record<string, { carbonMultiplier: number; waterMultiplier: number; isRecycled: boolean }> = {
  'хлопок': { carbonMultiplier: 5.5, waterMultiplier: 2500, isRecycled: false },
  'органический хлопок': { carbonMultiplier: 3.2, waterMultiplier: 1200, isRecycled: false },
  'переработанный хлопок': { carbonMultiplier: 1.8, waterMultiplier: 400, isRecycled: true },
  'полиэстер': { carbonMultiplier: 9.5, waterMultiplier: 150, isRecycled: false },
  'переработанный полиэстер': { carbonMultiplier: 3.5, waterMultiplier: 50, isRecycled: true },
  'нейлон': { carbonMultiplier: 10.2, waterMultiplier: 200, isRecycled: false },
  'вискоза': { carbonMultiplier: 7.8, waterMultiplier: 800, isRecycled: false },
  'шерсть': { carbonMultiplier: 15.4, waterMultiplier: 500, isRecycled: false },
  'шелк': { carbonMultiplier: 18.2, waterMultiplier: 600, isRecycled: false },
  'лен': { carbonMultiplier: 6.5, waterMultiplier: 1000, isRecycled: false },
  'default': { carbonMultiplier: 6.0, waterMultiplier: 500, isRecycled: false },
};

function getEcoFactor(label: string) {
  const lowerLabel = label.toLowerCase();
  // We want to match the longest key first, or specific ones before general ones.
  // E.g., 'переработанный хлопок' before 'хлопок'.
  const sortedKeys = Object.keys(ECO_FACTORS).filter(k => k !== 'default').sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    if (lowerLabel.includes(key)) {
      return ECO_FACTORS[key];
    }
  }
  return ECO_FACTORS['default'];
}

export function calculateDPP(bomLines: BOMItem[]): DPPMetrics {
  let totalCarbon = 0;
  let totalWater = 0;
  let totalQty = 0;
  let recycledQty = 0;

  for (const line of bomLines) {
    const qty = line.qty || 1; // Default to 1 if not specified
    const factor = getEcoFactor(line.label || '');
    
    totalCarbon += factor.carbonMultiplier * qty;
    totalWater += factor.waterMultiplier * qty;
    
    totalQty += qty;
    if (factor.isRecycled) {
      recycledQty += qty;
    }
  }

  // Base eco score starts at 50
  let ecoScore = 50;
  
  // Add points for recycled content
  const recycledContentPct = totalQty > 0 ? (recycledQty / totalQty) * 100 : 0;
  ecoScore += (recycledContentPct / 100) * 30;
  
  // Adjust based on carbon (lower is better)
  if (totalCarbon < 5) ecoScore += 10;
  else if (totalCarbon < 10) ecoScore += 5;
  else if (totalCarbon > 20) ecoScore -= 10;
  
  // Adjust based on water (lower is better)
  if (totalWater < 500) ecoScore += 10;
  else if (totalWater < 1000) ecoScore += 5;
  else if (totalWater > 2000) ecoScore -= 10;

  // Clamp eco score between 0 and 100
  ecoScore = Math.max(0, Math.min(100, ecoScore));

  // If no lines, return zeros
  if (bomLines.length === 0) {
    return {
      passportId: `DPP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      carbonFootprint: "0.0",
      waterUsage: "0",
      recycledContentPct: "0",
      ecoScore: "0",
    };
  }

  return {
    passportId: `DPP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    carbonFootprint: totalCarbon.toFixed(1),
    waterUsage: totalWater.toFixed(0),
    recycledContentPct: recycledContentPct.toFixed(0),
    ecoScore: ecoScore.toFixed(0),
  };
}
