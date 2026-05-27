/**
 * Wave 15 RU: ZIP «пакет соответствия» — reuse существующих builders (TZ parts, бирка PDF, ЧЗ CSV, GTIN, DPP).
 */
import 'server-only';

import JSZip from 'jszip';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { getWorkshop2ReadinessSnapshot } from '@/lib/production/workshop2-readiness-snapshot';
import { findHandbookLeafById } from '@/lib/production/category-handbook-leaves';
import {
  buildWorkshop2DppExportBlock,
  buildWorkshop2DppJsonLdStub,
  extractWorkshop2DppMaterialsFromDossier,
} from '@/lib/production/workshop2-dpp-export';
import { buildWorkshop2MarkingHonestSignCsv } from '@/lib/production/workshop2-marking-honest-sign';
import { compositionLabelDraftPreviewLines } from '@/lib/production/workshop2-composition-label-from-tz';
import { buildCompositionLabelDraftPdfBuffer } from '@/lib/production/workshop2-composition-label-pdf-export';
import { workshop2CompositionLabelSpecHasExportableContent } from '@/lib/production/workshop2-composition-label-spec-utils';
import { resolveWorkshop2PassportMarkingFields } from '@/lib/production/workshop2-marking-honest-sign';

export type Workshop2RuCompliancePackInput = {
  collectionId: string;
  articleId: string;
  articleSku?: string;
  articleName?: string;
  categoryLeafId?: string;
  dossier: Workshop2DossierPhase1;
  version: number;
  updatedAt: string;
};

function sanitizeZipPart(s: string): string {
  return s.replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]+/g, '-').slice(0, 64) || 'article';
}

export function isWorkshop2DppComplianceExportReady(dossier: Workshop2DossierPhase1): boolean {
  const slug = dossier.passportProductionBrief?.b2cProductSlug?.trim();
  if (slug) return true;
  return extractWorkshop2DppMaterialsFromDossier(dossier).length > 0;
}

/** Собирает ZIP пакета соответствия РФ (без полного TZ bundle). */
export async function buildWorkshop2RuCompliancePackZip(
  input: Workshop2RuCompliancePackInput
): Promise<{ buffer: Buffer; filename: string; manifest: string[] }> {
  const zip = new JSZip();
  const manifest: string[] = [];
  const leaf = input.categoryLeafId ? (findHandbookLeafById(input.categoryLeafId) ?? null) : null;
  const readiness = getWorkshop2ReadinessSnapshot({
    dossier: input.dossier,
    leaf,
    articleSkuDraft: input.articleSku,
    articleNameDraft: input.articleName,
  });

  zip.file(
    'readiness.json',
    JSON.stringify(
      {
        collectionId: input.collectionId,
        articleId: input.articleId,
        version: input.version,
        updatedAt: input.updatedAt,
        tzOverallPct: readiness.tzOverallPct,
        preflightScore: readiness.preflightScore,
        sections: readiness.sections,
      },
      null,
      2
    )
  );
  manifest.push('readiness.json');

  const marking = resolveWorkshop2PassportMarkingFields(input.dossier);
  const csv = buildWorkshop2MarkingHonestSignCsv({
    dossier: input.dossier,
    collectionId: input.collectionId,
    articleId: input.articleId,
  });
  zip.file('marking/honest-sign.csv', csv);
  manifest.push('marking/honest-sign.csv');

  if (marking.gtin) {
    zip.file('marking/gtin.txt', `${marking.gtin}\n`);
    manifest.push('marking/gtin.txt');
  }

  const spec = input.dossier.compositionLabelSpec;
  if (spec && workshop2CompositionLabelSpecHasExportableContent(spec)) {
    const lines = compositionLabelDraftPreviewLines(input.dossier, spec);
    const pdfBuffer = buildCompositionLabelDraftPdfBuffer({
      spec,
      lines,
      fileBase: (spec.labelArticleSkuText ?? input.articleId).trim() || 'composition-label',
    });
    zip.file('composition-label/label-draft.pdf', pdfBuffer);
    manifest.push('composition-label/label-draft.pdf');
  }

  if (isWorkshop2DppComplianceExportReady(input.dossier)) {
    const dppBlock = buildWorkshop2DppExportBlock({
      dossier: input.dossier,
      collectionId: input.collectionId,
      articleId: input.articleId,
      articleSku: input.articleSku,
      articleName: input.articleName,
    });
    zip.file('dpp/export-block.json', JSON.stringify(dppBlock, null, 2));
    zip.file('dpp/passport.jsonld', JSON.stringify(buildWorkshop2DppJsonLdStub(dppBlock), null, 2));
    manifest.push('dpp/export-block.json', 'dpp/passport.jsonld');
  }

  zip.file(
    'README.txt',
    [
      'Workshop2 — пакет соответствия РФ',
      '================================',
      `Коллекция: ${input.collectionId}`,
      `Артикул: ${input.articleId}`,
      `Версия досье: ${input.version}`,
      '',
      'Файлы:',
      ...manifest.map((f) => `  · ${f}`),
      '',
      'Сборка из существующих export builders — без fake ACK ЦРПТ/ЭДО.',
    ].join('\n')
  );
  manifest.push('README.txt');

  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const stem = sanitizeZipPart(input.articleSku?.trim() || input.articleId);
  return {
    buffer,
    filename: `w2-ru-compliance-${stem}-v${input.version}.zip`,
    manifest,
  };
}

/** Wave 16: лимит артикулов в batch ZIP коллекции (честный 413 при превышении). */
export const WORKSHOP2_RU_COLLECTION_COMPLIANCE_PACK_MAX = 20;

export type Workshop2RuCollectionComplianceArticleInput = {
  articleId: string;
  articleSku?: string;
  articleName?: string;
  categoryLeafId?: string;
  dossier: Workshop2DossierPhase1;
  version: number;
  updatedAt: string;
};

/** ZIP коллекции: вложенные per-article compliance packs (reuse buildWorkshop2RuCompliancePackZip). */
export async function buildWorkshop2RuCollectionCompliancePackZip(input: {
  collectionId: string;
  articles: Workshop2RuCollectionComplianceArticleInput[];
}): Promise<{ buffer: Buffer; filename: string; manifest: string[]; articleCount: number }> {
  const zip = new JSZip();
  const manifest: string[] = [];
  const cid = input.collectionId.trim();

  for (const article of input.articles) {
    const pack = await buildWorkshop2RuCompliancePackZip({
      collectionId: cid,
      articleId: article.articleId,
      articleSku: article.articleSku,
      articleName: article.articleName,
      categoryLeafId: article.categoryLeafId,
      dossier: article.dossier,
      version: article.version,
      updatedAt: article.updatedAt,
    });
    const nestedPath = `articles/${pack.filename}`;
    zip.file(nestedPath, pack.buffer);
    manifest.push(nestedPath);
  }

  zip.file(
    'README.txt',
    [
      'Workshop2 — пакет соответствия РФ (коллекция)',
      '============================================',
      `Коллекция: ${cid}`,
      `Артикулов: ${input.articles.length}`,
      '',
      'Вложенные ZIP по артикулам:',
      ...manifest.map((f) => `  · ${f}`),
      '',
      `Лимит batch: ${WORKSHOP2_RU_COLLECTION_COMPLIANCE_PACK_MAX} артикулов.`,
    ].join('\n')
  );
  manifest.push('README.txt');

  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const stem = sanitizeZipPart(cid);
  return {
    buffer,
    filename: `w2-ru-compliance-collection-${stem}-n${input.articles.length}.zip`,
    manifest,
    articleCount: input.articles.length,
  };
}
