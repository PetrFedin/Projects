/**
 * DPP: экспорт заготовки из досье — JSON-LD с полями BOM/паспорта (не пустой stub).
 */
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { calculateDPP, type BOMItem, type DPPMetrics } from '@/lib/platform/dpp-calculator';
import { buildColorwayRowsFromDossier } from '@/lib/production/workshop2-colorway-palette';

export type Workshop2DppMaterialRow = {
  name: string;
  percentage?: number;
  compositionText?: string;
  role?: string;
  supplier?: string;
};

export type Workshop2DppExportBlock = {
  passportId: string;
  generatedAt: string;
  metrics: DPPMetrics;
  collectionId: string;
  articleId: string;
  articleSku?: string;
  articleName?: string;
  jsonLdContext: string;
  /** Строки состава из досье (BOM + бирка). */
  materials: Workshop2DppMaterialRow[];
  compositionText?: string;
  careInstructions?: string;
  manufacturerLabel?: string;
  /** Цветомодели из паспорта (уже заполненные пользователем поля). */
  colorways?: { label: string; paletteCode: string }[];
  /** Краткий замысел / mood из досье. */
  designerIntentSummary?: string;
  /** Предварительный ТН ВЭД из атрибутов паспорта. */
  customsTnvedCode?: string;
  /** Заготовка EU registry — без write-back в реальный реестр. */
  registryStub: {
    status: 'draft_export';
    scheme: 'EU-ESPR-textile-v1';
    registryId: null;
    noteRu: string;
  };
};

export function workshop2DossierToBomLines(dossier: Workshop2DossierPhase1): BOMItem[] {
  const lines: BOMItem[] = [
    ...(dossier.productionModel?.materialLines ?? []).map((m) => ({
      label: String(m.materialName ?? 'Материал'),
      qty: Number(m.yieldPerUnit ?? m.consumption) || 1,
      unit: String(m.yieldUnit ?? m.unit ?? 'ед.'),
    })),
    ...(dossier.productionModel?.trimLines ?? []).map((t) => ({
      label: String((t as { name?: string }).name ?? 'Фурнитура'),
      qty: Number((t as { quantity?: number }).quantity) || 1,
      unit: 'шт',
    })),
  ];
  return lines.length > 0 ? lines : [{ label: 'состав не указан', qty: 1 }];
}

/** Извлекает строки состава из productionModel и compositionLabelSpec. */
export function extractWorkshop2DppMaterialsFromDossier(
  dossier: Workshop2DossierPhase1
): Workshop2DppMaterialRow[] {
  const fromBom = (dossier.productionModel?.materialLines ?? []).map((m) => ({
    name: m.materialName,
    percentage: m.percentage,
    compositionText: m.compositionText,
    role: m.role,
    supplier: m.supplier,
  }));

  if (fromBom.length > 0) return fromBom;

  const spec = dossier.compositionLabelSpec;
  if (spec?.extraLegalLines?.trim()) {
    return [{ name: spec.extraLegalLines.trim() }];
  }

  return [];
}

function extractCustomsTnvedFromDossier(dossier: Workshop2DossierPhase1): string | undefined {
  const attrIds = [
    'customsTnvedPreliminaryCode',
    'customsTnvedCodePrimary',
    'customsTnvedCodeSecondary',
  ] as const;
  for (const attributeId of attrIds) {
    const assign = dossier.assignments?.find(
      (a) => a.kind === 'canonical' && a.attributeId === attributeId
    );
    const label = assign?.values?.[0]?.displayLabel?.trim();
    if (label) return label;
  }
  return undefined;
}

function buildDesignerIntentSummary(dossier: Workshop2DossierPhase1): string | undefined {
  const mood = dossier.designerIntent?.mood?.trim();
  const bullets = (dossier.designerIntent?.bullets ?? [])
    .map((b) => b.trim())
    .filter(Boolean)
    .slice(0, 2);
  const parts = [mood, ...bullets].filter(Boolean);
  return parts.length ? parts.join(' · ') : undefined;
}

function buildCompositionText(
  dossier: Workshop2DossierPhase1,
  materials: Workshop2DppMaterialRow[]
): string {
  const fromMaterials = materials
    .filter((m) => m.name)
    .map((m) => {
      const pct = m.percentage != null ? `${m.percentage}% ` : '';
      const comp = m.compositionText ? ` (${m.compositionText})` : '';
      return `${pct}${m.name}${comp}`.trim();
    })
    .join(', ');

  if (fromMaterials) return fromMaterials;
  return dossier.compositionLabelSpec?.extraLegalLines?.trim() || '';
}

/** Блок DPP для панели досье / sustainability. */
export function buildWorkshop2DppExportBlock(input: {
  dossier: Workshop2DossierPhase1;
  collectionId: string;
  articleId: string;
  articleSku?: string;
  articleName?: string;
}): Workshop2DppExportBlock {
  const materials = extractWorkshop2DppMaterialsFromDossier(input.dossier);
  const metrics = calculateDPP(workshop2DossierToBomLines(input.dossier));
  const compositionText = buildCompositionText(input.dossier, materials);
  const colorways = buildColorwayRowsFromDossier(input.dossier).map((cw) => ({
    label: cw.label,
    paletteCode: cw.paletteCode,
  }));

  return {
    passportId: metrics.passportId,
    generatedAt: new Date().toISOString(),
    metrics,
    collectionId: input.collectionId,
    articleId: input.articleId,
    articleSku: input.articleSku,
    articleName: input.articleName,
    jsonLdContext: 'https://schema.org/',
    materials,
    compositionText: compositionText || undefined,
    careInstructions: input.dossier.compositionLabelSpec?.technologistNotes?.trim() || undefined,
    manufacturerLabel: input.dossier.compositionLabelSpec?.brandFaceLines?.trim() || undefined,
    colorways: colorways.length ? colorways : undefined,
    designerIntentSummary: buildDesignerIntentSummary(input.dossier),
    customsTnvedCode: extractCustomsTnvedFromDossier(input.dossier),
    registryStub: {
      status: 'draft_export',
      scheme: 'EU-ESPR-textile-v1',
      registryId: null,
      noteRu:
        'Заготовка DPP для экспорта в TZ bundle. Запись в EU registry не выполняется — заполните registryId после интеграции.',
    },
  };
}

/** JSON-LD экспорт заготовки DPP (machine-readable, поля из досье). */
export function buildWorkshop2DppJsonLdStub(
  block: Workshop2DppExportBlock
): Record<string, unknown> {
  const sku = block.articleSku?.trim() || block.articleId;
  const name = block.articleName?.trim() || `Article ${block.articleId}`;

  const materialProperties = block.materials.map((m) => ({
    '@type': 'PropertyValue',
    name: 'materialComponent',
    value: [m.percentage != null ? `${m.percentage}%` : null, m.name, m.compositionText]
      .filter(Boolean)
      .join(' '),
  }));

  return {
    '@context': ['https://schema.org/', 'https://w3id.org/circularityhub/dpp/v0.1'],
    '@type': 'Product',
    '@id': `urn:w2:dpp:${block.collectionId}:${block.articleId}:${block.passportId}`,
    name,
    sku,
    identifier: block.passportId,
    material: block.compositionText || undefined,
    manufacturer: block.manufacturerLabel
      ? { '@type': 'Organization', name: block.manufacturerLabel }
      : undefined,
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'carbonFootprintKgCo2e',
        value: block.metrics.carbonFootprint,
      },
      { '@type': 'PropertyValue', name: 'waterUsageLiters', value: block.metrics.waterUsage },
      {
        '@type': 'PropertyValue',
        name: 'recycledContentPercent',
        value: block.metrics.recycledContentPct,
      },
      { '@type': 'PropertyValue', name: 'ecoScore', value: block.metrics.ecoScore },
      { '@type': 'PropertyValue', name: 'workshop2CollectionId', value: block.collectionId },
      { '@type': 'PropertyValue', name: 'workshop2ArticleId', value: block.articleId },
      { '@type': 'PropertyValue', name: 'euEsprScheme', value: block.registryStub.scheme },
      { '@type': 'PropertyValue', name: 'dppExportStatus', value: block.registryStub.status },
      ...(block.customsTnvedCode
        ? [{ '@type': 'PropertyValue', name: 'customsTnvedCode', value: block.customsTnvedCode }]
        : []),
      ...(block.colorways?.length
        ? [
            {
              '@type': 'PropertyValue',
              name: 'colorways',
              value: block.colorways.map((c) => `${c.paletteCode}:${c.label}`).join('; '),
            },
          ]
        : []),
      ...(block.designerIntentSummary
        ? [
            {
              '@type': 'PropertyValue',
              name: 'designerIntentSummary',
              value: block.designerIntentSummary,
            },
          ]
        : []),
      ...materialProperties,
    ],
    isRelatedTo: {
      '@type': 'CreativeWork',
      name: 'Workshop2 TZ export bundle',
      description: block.registryStub.noteRu,
    },
    ...(block.careInstructions
      ? {
          usageInfo: {
            '@type': 'CreativeWork',
            text: block.careInstructions,
          },
        }
      : {}),
    potentialAction: {
      '@type': 'RegisterAction',
      name: 'EU DPP registry (stub)',
      description: 'registryId=null — интеграция write-back не подключена',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://ec.europa.eu/sustainable-products/digital-product-passport',
      },
    },
    dateModified: block.generatedAt,
  };
}
