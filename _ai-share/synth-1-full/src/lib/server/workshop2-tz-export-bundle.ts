/**
 * ZIP-пакет экспорта ТЗ: dossier.json + readiness.json + README.txt (Sprint 9 / 14).
 */
import 'server-only';

import JSZip from 'jszip';
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { getWorkshop2ReadinessSnapshot } from '@/lib/production/workshop2-readiness-snapshot';
import {
  assembleWorkshop2ArticleFromTaxonomy,
  type Workshop2ArticleAssemblyPreview,
} from '@/lib/production/workshop2-article-assembler';
import type { Workshop2VaultDocumentRecord } from '@/lib/server/workshop2-dossier-repository';
import { getWorkshop2VaultObjectBuffer } from '@/lib/server/workshop2-vault-s3';
import { syncWorkshop2RoutingStepsOnDossier } from '@/lib/production/workshop2-routing-steps';
import {
  buildWorkshop2DppExportBlock,
  buildWorkshop2DppJsonLdStub,
} from '@/lib/production/workshop2-dpp-export';
import { buildWorkshop2GradingTableExport } from '@/lib/production/workshop2-grading-apply';
import {
  buildWorkshop2HandoffPdfTocLinesRu,
  WORKSHOP2_HANDOFF_PDF_SECTION_LABELS_RU,
  workshop2TzBundleFileLabelRu,
} from '@/lib/production/workshop2-handoff-pdf-section-labels-ru';
import { buildWorkshop2TzHandoffSummaryPdfBytes } from '@/lib/production/workshop2-tz-handoff-summary-pdf';
import {
  buildWorkshop2ProductionAnalyticsExportSnippet,
  type Workshop2ProductionAnalyticsSnapshot,
} from '@/lib/production/workshop2-production-analytics';
import type { Workshop2NestingFactoryExport } from '@/lib/production/workshop2-nesting-request';

export type Workshop2TzExportBundleInput = {
  collectionId: string;
  articleId: string;
  articleSku?: string;
  articleName?: string;
  categoryLeafId?: string;
  audienceId?: string;
  isUnisex?: boolean;
  dossier: Workshop2DossierPhase1;
  version: number;
  updatedAt: string;
  /** Документы vault (PG) — бинарники подтягиваются из S3 при наличии storage_path. */
  vaultDocuments?: Workshop2VaultDocumentRecord[];
  /** Параметры nesting с активного заказа образца (factory handoff JSON). */
  nestingFactoryExport?: Workshop2NestingFactoryExport;
  /** M10 snippet для analytics.json в ZIP. */
  productionAnalytics?: Workshop2ProductionAnalyticsSnapshot | null;
};

function sanitizeZipPart(s: string): string {
  return s.replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]+/g, '-').slice(0, 64) || 'article';
}

function assemblySummaryLines(input: Workshop2TzExportBundleInput): string[] {
  const leafId = input.categoryLeafId?.trim() ?? '';
  const leaf = leafId ? findHandbookLeafById(leafId) : null;
  let preview: Workshop2ArticleAssemblyPreview | null = null;
  if (leafId && leaf) {
    const asm = assembleWorkshop2ArticleFromTaxonomy({
      categoryLeafId: leafId,
      audienceId: input.audienceId?.trim() || input.dossier.selectedAudienceId || 'women',
      isUnisex: input.isUnisex ?? input.dossier.isUnisex,
      sku: input.articleSku,
      name: input.articleName,
    });
    preview = asm?.preview ?? null;
  }
  const lines: string[] = [
    'Workshop2 — пакет экспорта ТЗ',
    '================================',
    `Коллекция: ${input.collectionId}`,
    `Артикул: ${input.articleId}`,
    `SKU: ${input.articleSku?.trim() || '—'}`,
    `Название: ${input.articleName?.trim() || '—'}`,
    `Версия досье (PG): ${input.version}`,
    `Обновлено: ${input.updatedAt}`,
  ];
  if (leaf) {
    lines.push(`Категория: ${leaf.l1Name} › ${leaf.l2Name} › ${leaf.l3Name} (${leaf.leafId})`);
  }
  if (preview) {
    lines.push('', 'Сборка по таксономии (assembler):');
    lines.push(`  ${preview.oneLineRu}`);
    lines.push(`  Шкала: ${preview.scaleLabelRu}`);
    lines.push(`  T&A шаблон: ${preview.taTemplateId}`);
    lines.push(`  Атрибутов фазы 1: ${preview.phase1AttributeCount}`);
  }
  const readiness = getWorkshop2ReadinessSnapshot({
    dossier: input.dossier,
    leaf: leaf ?? null,
    articleSkuDraft: input.articleSku,
    articleNameDraft: input.articleName,
  });
  lines.push('', 'Снимок готовности (readiness):');
  lines.push(`  ТЗ overall: ${readiness.tzOverallPct}%`);
  lines.push(`  Pre-flight производства: ${readiness.preflightScore}/100`);
  for (const key of ['general', 'visuals', 'material', 'construction', 'assignment'] as const) {
    const row = readiness.sections[key];
    if (row) lines.push(`  · ${row.label}: ${row.pct}% (${row.done}/${row.total})`);
  }
  lines.push('', 'Файлы в архиве:');
  lines.push('  dossier.json — полное досье фазы 1');
  lines.push('  readiness.json — метрики готовности');
  lines.push('  routing-steps.json — техпроцесс (routingSteps из досье)');
  lines.push('  grading-table.json — матрица градации (gradingRules + sizes)');
  lines.push('  vault/manifest.json — список файлов vault');
  lines.push('  vault/files/* — бинарники из S3 (если настроено)');
  lines.push('  README.txt — этот файл');
  lines.push('  tz-handoff-summary.pdf — краткая PDF-сводка handoff (jsPDF)');
  lines.push('  dpp/export-block.json — блок DPP для досье');
  lines.push('  dpp/passport.jsonld — JSON-LD stub (EU DPP / schema.org)');
  if (input.nestingFactoryExport) {
    lines.push('  nesting/factory-params.json — раскладка (nesting) для фабрики');
  }
  if (input.productionAnalytics) {
    lines.push('  analytics.json — production analytics (lead time, rework, routing Δ)');
  }
  const gtin = input.dossier.passportProductionBrief?.gtin?.trim();
  if (gtin) {
    lines.push(`  marking/gtin.txt — GTIN маркировки ЧЗ: ${gtin}`);
  }
  return lines;
}

/** Собирает ZIP-буфер для ответа API. */
export async function buildWorkshop2TzExportBundleZip(
  input: Workshop2TzExportBundleInput
): Promise<{ buffer: Buffer; filename: string }> {
  const zip = new JSZip();
  const dossierSynced = syncWorkshop2RoutingStepsOnDossier(input.dossier);
  const readiness = getWorkshop2ReadinessSnapshot({
    dossier: dossierSynced,
    leaf: input.categoryLeafId ? (findHandbookLeafById(input.categoryLeafId) ?? null) : null,
    articleSkuDraft: input.articleSku,
    articleNameDraft: input.articleName,
  });

  zip.file('dossier.json', JSON.stringify(dossierSynced, null, 2));
  zip.file(
    'readiness.json',
    JSON.stringify(
      {
        collectionId: input.collectionId,
        articleId: input.articleId,
        version: input.version,
        updatedAt: input.updatedAt,
        metadataRu: {
          toc: buildWorkshop2HandoffPdfTocLinesRu(),
          sections: WORKSHOP2_HANDOFF_PDF_SECTION_LABELS_RU,
          bundleFiles: {
            'tz-handoff-summary.pdf': workshop2TzBundleFileLabelRu('tz-handoff-summary.pdf'),
            'routing-steps.json': workshop2TzBundleFileLabelRu('routing-steps.json'),
            'grading-table.json': workshop2TzBundleFileLabelRu('grading-table.json'),
            'marking/gtin.txt': workshop2TzBundleFileLabelRu('marking/gtin.txt'),
            'dpp/passport.jsonld': workshop2TzBundleFileLabelRu('dpp/passport.jsonld'),
          },
        },
        ...readiness,
      },
      null,
      2
    )
  );
  if (dossierSynced.routingSteps?.length) {
    zip.file(
      'routing-steps.json',
      JSON.stringify(
        {
          collectionId: input.collectionId,
          articleId: input.articleId,
          labelRu: WORKSHOP2_HANDOFF_PDF_SECTION_LABELS_RU.routing,
          exportedAt: new Date().toISOString(),
          steps: dossierSynced.routingSteps,
        },
        null,
        2
      )
    );
  }
  if (dossierSynced.gradingRules?.length || dossierSynced.gradingSizes?.length) {
    zip.file(
      'grading-table.json',
      JSON.stringify(
        {
          collectionId: input.collectionId,
          articleId: input.articleId,
          labelRu: WORKSHOP2_HANDOFF_PDF_SECTION_LABELS_RU.grading,
          ...buildWorkshop2GradingTableExport(dossierSynced),
        },
        null,
        2
      )
    );
  }
  zip.file('README.txt', assemblySummaryLines(input).join('\n'));

  const tocLines = buildWorkshop2HandoffPdfTocLinesRu();
  zip.file(
    'tz-handoff-summary.pdf',
    buildWorkshop2TzHandoffSummaryPdfBytes({
      collectionId: input.collectionId,
      articleId: input.articleId,
      articleSku: input.articleSku,
      articleName: input.articleName,
      version: input.version,
      updatedAt: input.updatedAt,
      tzOverallPct: readiness.tzOverallPct,
      preflightScore: readiness.preflightScore,
      tocLines,
    })
  );

  const dppBlock = buildWorkshop2DppExportBlock({
    dossier: input.dossier,
    collectionId: input.collectionId,
    articleId: input.articleId,
    articleSku: input.articleSku,
    articleName: input.articleName,
  });
  zip.file('dpp/export-block.json', JSON.stringify(dppBlock, null, 2));
  zip.file('dpp/passport.jsonld', JSON.stringify(buildWorkshop2DppJsonLdStub(dppBlock), null, 2));

  if (input.nestingFactoryExport) {
    zip.file('nesting/factory-params.json', JSON.stringify(input.nestingFactoryExport, null, 2));
  }

  if (input.productionAnalytics) {
    zip.file(
      'analytics.json',
      JSON.stringify(
        buildWorkshop2ProductionAnalyticsExportSnippet(input.productionAnalytics),
        null,
        2
      )
    );
  }

  const gtin = dossierSynced.passportProductionBrief?.gtin?.trim();
  if (gtin) {
    zip.file('marking/gtin.txt', `${gtin}\n`);
  }

  const vaultDocs = input.vaultDocuments ?? [];
  const manifest: {
    documentId: string;
    fileName?: string;
    storagePath?: string;
    includedInZip: boolean;
    sizeBytes?: number;
  }[] = [];

  for (const doc of vaultDocs) {
    const safeName = sanitizeZipPart(doc.fileName?.trim() || doc.documentId);
    let included = false;
    if (doc.storagePath?.trim()) {
      const bytes = await getWorkshop2VaultObjectBuffer(doc.storagePath);
      if (bytes && bytes.length > 0) {
        zip.file(`vault/files/${safeName}`, bytes);
        included = true;
      }
    }
    manifest.push({
      documentId: doc.documentId,
      fileName: doc.fileName,
      storagePath: doc.storagePath,
      includedInZip: included,
      sizeBytes: doc.sizeBytes,
    });
  }
  if (manifest.length) {
    zip.file('vault/manifest.json', JSON.stringify({ files: manifest }, null, 2));
  }

  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const stem = sanitizeZipPart(input.articleSku?.trim() || input.articleId);
  return { buffer, filename: `w2-tz-${stem}-v${input.version}.zip` };
}
