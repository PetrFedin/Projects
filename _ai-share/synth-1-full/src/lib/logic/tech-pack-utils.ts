import { TechPack, ProductionOrderRequirement } from '../types/production';

/**
 * Tech Pack Utilities
 */

/**
 * Рассчитывает общую потребность в материалах на тираж
 */
export function calculateMaterialRequirements(
  techPack: TechPack, 
  quantity: number
): ProductionOrderRequirement[] {
  return techPack.bom.map(item => {
    const totalWithWastage = item.consumptionPerUnit * quantity * (1 + item.wastageAllowance);
    return {
      materialId: item.id,
      totalRequired: Number(totalWithWastage.toFixed(3)),
      unit: item.unit
    };
  });
}

/**
 * Проверяет, все ли размеры из сетки присутствуют в каждой точке измерения
 */
export function validateGradingConsistency(
  techPack: TechPack, 
  sizeGrid: string[]
): { valid: boolean; missingSizes: string[] } {
  const missingSizes = new Set<string>();

  techPack.grading.forEach(point => {
    sizeGrid.forEach(size => {
      if (point.values[size] === undefined) {
        missingSizes.add(size);
      }
    });
  });

  return {
    valid: missingSizes.size === 0,
    missingSizes: Array.from(missingSizes)
  };
}
