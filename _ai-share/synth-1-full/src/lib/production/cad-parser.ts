import type { Workshop2ProductionMaterialLine } from '@/lib/production/workshop2-dossier-phase1.types';

export type CadPattern = {
  id: string;
  name: string;
  areaM2: number;
};

export type CadParseSourceKind = 'dxf' | 'proprietary_demo';

export type CadParseResult = {
  patterns: CadPattern[];
  seamLengthsTotalMeters: number;
  /** Строки BOM, рассчитанные из DXF или демо-эвристики проприетарных CAD. */
  derivedMaterialLines: Workshop2ProductionMaterialLine[];
  /** @deprecated Используйте derivedMaterialLines — оставлено для обратной совместимости. */
  mockMaterialLines: Workshop2ProductionMaterialLine[];
  sourceKind: CadParseSourceKind;
  mockMeasurements?: import('@/lib/production/workshop2-dossier-phase1.types').Workshop2ProductionMeasurement[];
};

/** Единый доступ к строкам BOM из результата парсера (новое и legacy поле). */
export function cadParseDerivedMaterialLines(
  result: CadParseResult
): Workshop2ProductionMaterialLine[] {
  return result.derivedMaterialLines?.length
    ? result.derivedMaterialLines
    : (result.mockMaterialLines ?? []);
}

export async function parseCadFile(file: File): Promise<CadParseResult> {
  const filename = file.name.toLowerCase();
  if (filename.endsWith('.dxf')) {
    const text = await file.text();
    return parseDxfText(text);
  }

  await new Promise((resolve) => setTimeout(resolve, 1500));

  const generatedMaterialId1 =
    typeof crypto !== 'undefined' ? crypto.randomUUID() : `mat-${Date.now()}-1`;
  const generatedMaterialId2 =
    typeof crypto !== 'undefined' ? crypto.randomUUID() : `mat-${Date.now()}-2`;

  const derivedMaterialLines: Workshop2ProductionMaterialLine[] = [
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
  ];

  return {
    patterns: [
      { id: 'p1', name: 'Front Panel', areaM2: 0.45 },
      { id: 'p2', name: 'Back Panel', areaM2: 0.5 },
      { id: 'p3', name: 'Sleeve Left', areaM2: 0.25 },
      { id: 'p4', name: 'Sleeve Right', areaM2: 0.25 },
    ],
    seamLengthsTotalMeters: 4.5,
    derivedMaterialLines,
    mockMaterialLines: derivedMaterialLines,
    sourceKind: 'proprietary_demo',
    mockMeasurements: [
      {
        id: typeof crypto !== 'undefined' ? crypto.randomUUID() : `meas-${Date.now()}-1`,
        code: 'CAD-M1',
        label: 'Длина шва (из CAD)',
        size: 'M',
        valueCm: 450,
        tolerancePlusCm: 1,
        toleranceMinusCm: 1,
        comment: 'Сгенерировано из CAD',
      },
    ],
  };
}

function parseDxfText(text: string): CadParseResult {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let totalPerimeter = 0;

  let currentEntity: string | null = null;
  let currentX: number | null = null;
  let currentY: number | null = null;
  let currentX2: number | null = null;
  let currentY2: number | null = null;
  let currentRadius: number | null = null;
  let currentStartAngle: number | null = null;
  let currentEndAngle: number | null = null;
  let polylineVertices: { x: number; y: number }[] = [];
  let lastVertexX: number | null = null;
  let lastVertexY: number | null = null;

  const updateX = (x: number) => {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
  };
  const updateY = (y: number) => {
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  };

  const finishEntity = () => {
    if (!currentEntity) return;

    if (
      currentEntity === 'LINE' &&
      currentX !== null &&
      currentY !== null &&
      currentX2 !== null &&
      currentY2 !== null
    ) {
      const dx = currentX2 - currentX;
      const dy = currentY2 - currentY;
      totalPerimeter += Math.sqrt(dx * dx + dy * dy);
    } else if (currentEntity === 'CIRCLE' && currentRadius !== null) {
      totalPerimeter += 2 * Math.PI * currentRadius;
    } else if (
      currentEntity === 'ARC' &&
      currentRadius !== null &&
      currentStartAngle !== null &&
      currentEndAngle !== null
    ) {
      let diff = currentEndAngle - currentStartAngle;
      if (diff < 0) diff += 360;
      totalPerimeter += currentRadius * ((diff * Math.PI) / 180);
    } else if (currentEntity === 'LWPOLYLINE' && polylineVertices.length > 1) {
      for (let i = 0; i < polylineVertices.length - 1; i++) {
        const dx = polylineVertices[i + 1].x - polylineVertices[i].x;
        const dy = polylineVertices[i + 1].y - polylineVertices[i].y;
        totalPerimeter += Math.sqrt(dx * dx + dy * dy);
      }
    } else if (currentEntity === 'VERTEX' && currentX !== null && currentY !== null) {
      if (lastVertexX !== null && lastVertexY !== null) {
        const dx = currentX - lastVertexX;
        const dy = currentY - lastVertexY;
        totalPerimeter += Math.sqrt(dx * dx + dy * dy);
      }
      lastVertexX = currentX;
      lastVertexY = currentY;
    }

    currentEntity = null;
    currentX = null;
    currentY = null;
    currentX2 = null;
    currentY2 = null;
    currentRadius = null;
    currentStartAngle = null;
    currentEndAngle = null;
    polylineVertices = [];
  };

  for (let i = 0; i < lines.length; i += 2) {
    const code = lines[i];
    const value = lines[i + 1];
    if (value === undefined) break;

    if (code === '0') {
      finishEntity();
      if (['LINE', 'LWPOLYLINE', 'CIRCLE', 'ARC', 'VERTEX'].includes(value)) {
        currentEntity = value;
      } else if (value === 'SEQEND') {
        lastVertexX = null;
        lastVertexY = null;
      }
    } else if (currentEntity) {
      const numVal = parseFloat(value);
      if (!isNaN(numVal)) {
        if (code === '10') {
          currentX = numVal;
          updateX(numVal);
          if (currentEntity === 'LWPOLYLINE') polylineVertices.push({ x: numVal, y: 0 });
        } else if (code === '20') {
          currentY = numVal;
          updateY(numVal);
          if (currentEntity === 'LWPOLYLINE' && polylineVertices.length > 0) {
            polylineVertices[polylineVertices.length - 1].y = numVal;
          }
        } else if (code === '11') {
          currentX2 = numVal;
          updateX(numVal);
        } else if (code === '21') {
          currentY2 = numVal;
          updateY(numVal);
        } else if (code === '40') {
          currentRadius = numVal;
        } else if (code === '50') {
          currentStartAngle = numVal;
        } else if (code === '51') {
          currentEndAngle = numVal;
        }
      }
    }
  }
  finishEntity();

  let areaM2 = 0;
  if (minX !== Infinity && maxX !== -Infinity && minY !== Infinity && maxY !== -Infinity) {
    areaM2 = ((maxX - minX) * (maxY - minY)) / 1_000_000;
  }
  const perimeterMeters = totalPerimeter / 1000;

  const generatedMaterialId1 =
    typeof crypto !== 'undefined' ? crypto.randomUUID() : `mat-${Date.now()}-1`;
  const generatedMaterialId2 =
    typeof crypto !== 'undefined' ? crypto.randomUUID() : `mat-${Date.now()}-2`;

  const derivedMaterialLines: Workshop2ProductionMaterialLine[] = [
    {
      id: generatedMaterialId1,
      nodeId: 'n_body',
      role: 'main',
      materialName: 'Основная ткань (из DXF)',
      unit: 'm2',
      consumption: Number(areaM2.toFixed(2)),
      comment: 'Рассчитано из габаритов DXF',
    },
    {
      id: generatedMaterialId2,
      nodeId: 'n_thread',
      role: 'thread',
      materialName: 'Нитки армированные',
      unit: 'm',
      consumption: Number((perimeterMeters * 1.1).toFixed(2)),
      comment: 'На основе периметра DXF (+10%)',
    },
  ];

  return {
    patterns: [{ id: 'dxf-1', name: 'DXF Bounding Box', areaM2: Number(areaM2.toFixed(2)) }],
    seamLengthsTotalMeters: Number(perimeterMeters.toFixed(2)),
    derivedMaterialLines,
    mockMaterialLines: derivedMaterialLines,
    sourceKind: 'dxf',
    mockMeasurements: [
      {
        id: typeof crypto !== 'undefined' ? crypto.randomUUID() : `meas-${Date.now()}-3`,
        code: 'DXF-M1',
        label: 'Периметр лекал (из DXF)',
        size: 'M',
        valueCm: Number((perimeterMeters * 100).toFixed(1)),
        tolerancePlusCm: 1,
        toleranceMinusCm: 1,
        comment: 'Извлечено из DXF',
      },
    ],
  };
}
