import type { Product } from '@/lib/types';
import type { LcaScorecardV1 } from './types';
import { parseComposition } from './parse-composition';

const MATERIAL_IMPACT: Record<string, { water: number; co2: number; score: number }> = {
  cotton: { water: 2500, co2: 2.5, score: 40 },
  organic_cotton: { water: 500, co2: 1.2, score: 85 },
  polyester: { water: 10, co2: 5.5, score: 30 },
  recycled_polyester: { water: 5, co2: 1.5, score: 75 },
  wool: { water: 500, co2: 15.0, score: 50 },
  linen: { water: 100, co2: 0.5, score: 90 },
  viscose: { water: 200, co2: 3.0, score: 60 },
};

export function calculateLcaScore(product: Product): LcaScorecardV1 {
  const comp = parseComposition(product);
  let water = 0;
  let co2 = 0;
  let totalScore = 0;
  let totalWeight = 0;

  const breakdown: Array<{ label: string; impact: number }> = [];

  comp.forEach(c => {
    const mat = c.material.toLowerCase();
    const pct = c.percentage / 100;
    
    // Find matching material or fallback to neutral
    const impact = Object.entries(MATERIAL_IMPACT).find(([k]) => mat.includes(k))?.[1] || 
                   { water: 500, co2: 3.0, score: 50 };
    
    water += impact.water * pct;
    co2 += impact.co2 * pct;
    totalScore += impact.score * pct;
    totalWeight += pct;
    
    breakdown.push({ label: c.material, impact: Math.round(impact.score * pct) });
  });

  if (totalWeight === 0) return { totalScore: 50, waterLiters: 500, co2Kg: 3.0, grade: 'C', breakdown: [] };

  const finalScore = Math.round(totalScore / totalWeight);
  let grade: LcaScorecardV1['grade'] = 'C';
  if (finalScore >= 80) grade = 'A';
  else if (finalScore >= 65) grade = 'B';
  else if (finalScore >= 45) grade = 'C';
  else if (finalScore >= 30) grade = 'D';
  else grade = 'E';

  return {
    totalScore: finalScore,
    waterLiters: Math.round(water),
    co2Kg: Math.round(co2 * 10) / 10,
    grade,
    breakdown,
  };
}
