import type { VMPlanogramV1 } from './types';

/** Генератор планограмм (инструкции по мерчандайзингу в магазинах). */
export function generateVMPlanogram(selectedSkus: string[]): VMPlanogramV1[] {
  return selectedSkus.map((sku, idx) => ({
    id: `VM-${sku}`,
    sku,
    displayType: idx % 3 === 0 ? 'mannequin' : (idx % 2 === 0 ? 'hanging' : 'folding'),
    priorityLevel: idx < 2 ? 1 : 2,
    suggestedNeighbors: selectedSkus.filter(s => s !== sku).slice(0, 2),
    technicalNotes: idx % 3 === 0 ? 'Center of the floor' : 'Standard rack, 10cm distance',
  }));
}
