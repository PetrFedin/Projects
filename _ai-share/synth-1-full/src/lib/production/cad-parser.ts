import type { Workshop2ProductionMaterialLine } from '@/lib/production/workshop2-dossier-phase1.types';

export type CadPattern = {
  id: string;
  name: string;
  areaM2: number;
};

export type CadParseResult = {
  patterns: CadPattern[];
  seamLengthsTotalMeters: number;
  mockMaterialLines: Workshop2ProductionMaterialLine[];
};

export async function parseCadFile(file: File): Promise<CadParseResult> {
  // Simulate parsing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const generatedMaterialId1 =
    typeof crypto !== 'undefined' ? crypto.randomUUID() : `mat-${Date.now()}-1`;
  const generatedMaterialId2 =
    typeof crypto !== 'undefined' ? crypto.randomUUID() : `mat-${Date.now()}-2`;

  return {
    patterns: [
      { id: 'p1', name: 'Front Panel', areaM2: 0.45 },
      { id: 'p2', name: 'Back Panel', areaM2: 0.5 },
      { id: 'p3', name: 'Sleeve Left', areaM2: 0.25 },
      { id: 'p4', name: 'Sleeve Right', areaM2: 0.25 },
    ],
    seamLengthsTotalMeters: 4.5,
    mockMaterialLines: [
      {
        id: generatedMaterialId1,
        nodeId: 'n_body',
        role: 'main',
        materialName: 'Основная ткань (из САПР)',
        unit: 'm2',
        consumption: 1.45,
        comment: 'Рассчитано автоматически из лекал CAD',
      },
      {
        id: generatedMaterialId2,
        nodeId: 'n_thread',
        role: 'thread',
        materialName: 'Нитки армированные',
        unit: 'm',
        consumption: Number((4.5 * 1.1).toFixed(2)),
        comment: 'На основе длин швов CAD (+10%)',
      },
    ],
  };
}
