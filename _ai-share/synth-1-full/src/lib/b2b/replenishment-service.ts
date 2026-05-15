export type ReplenishmentBomLine = {
  id: string;
  label: string;
  qty?: number;
  unit?: string;
  costPerUnit?: number;
};

export type ReplenishmentSuggestion = {
  lineId: string;
  label: string;
  suggestedQty: number;
  unit: string;
  estimatedCost: number;
};

export function calculateReplenishment(
  bomLines: ReplenishmentBomLine[],
  plannedQuantity: number
): ReplenishmentSuggestion[] {
  const WASTAGE_BUFFER = 1.08; // 8% wastage
  
  return bomLines.map(line => {
    const requiredQty = (line.qty || 0) * plannedQuantity;
    const qtyWithWastage = Math.ceil(requiredQty * WASTAGE_BUFFER);
    const estimatedCost = qtyWithWastage * (line.costPerUnit || 0);
    
    return {
      lineId: line.id,
      label: line.label,
      suggestedQty: qtyWithWastage,
      unit: line.unit || 'ед.',
      estimatedCost
    };
  });
}
