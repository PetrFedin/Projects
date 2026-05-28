import { partitionHandbookAndFree } from '@/components/brand/production/workshop2-phase1-dossier-panel-assignment-helpers';
import {
  extractHex6,
  normalizeCatalogHex,
  suggestHexFromPrimaryLabels,
  suggestPaletteFromPrimaryLabels,
  suggestPrimaryFamilyFromPaletteLabel,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-color-mat-helpers';
import {
  upsertCanonicalDual,
  upsertCanonicalMultiHandbookAndFree,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-mutations';
import {
  getAttributeById,
  resolveEffectiveParametersForLeaf,
} from '@/lib/production/attribute-catalog';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

type HandbookPart = { parameterId: string; displayLabel: string };

/**
 * Обновление handbook-параметра + синхронизация паспортного блока «Цвет»
 * (primary → палитра; референс → оттенок/градиент; пустая primary при референсе).
 */
export function applyHandbookParametersWithColorBundleSync(
  prev: Workshop2DossierPhase1,
  attributeId: string,
  parts: HandbookPart[],
  currentLeaf: HandbookCategoryLeaf
): Workshop2DossierPhase1 {
  const a = prev.assignments.find((x) => x.kind === 'canonical' && x.attributeId === attributeId);
  const { ft } = partitionHandbookAndFree(a);
  let next = upsertCanonicalMultiHandbookAndFree(prev, attributeId, parts, ft?.text ?? '');

  if (attributeId === 'primaryColorFamilyOptions') {
    const colorAttr = getAttributeById('color');
    if (colorAttr) {
      const effColor = resolveEffectiveParametersForLeaf(colorAttr, currentLeaf);
      const cA = next.assignments.find((x) => x.kind === 'canonical' && x.attributeId === 'color');
      const { hbs: chb, ft: cFt } = partitionHandbookAndFree(cA);
      if (chb.length === 0) {
        const labels = parts.map((p) => p.displayLabel);
        const sug = suggestPaletteFromPrimaryLabels(labels, effColor);
        if (sug) {
          next = upsertCanonicalDual(next, 'color', sug, cFt?.text ?? '');
        } else {
          const hx = suggestHexFromPrimaryLabels(labels);
          /** Не затираем уже введённый «Свой оттенок» / градиент. */
          if (hx && !(cFt?.text ?? '').trim()) {
            next = upsertCanonicalDual(next, 'color', null, hx);
          }
        }
      }
    }
  }

  if (attributeId === 'colorReferenceSystemOptions' && parts.length > 0) {
    const refAttr = getAttributeById('colorReferenceSystemOptions');
    const sel = refAttr?.parameters.find((x) => x.parameterId === parts[0]!.parameterId);
    const colorAttr = getAttributeById('color');
    if (colorAttr) {
      const effColor = resolveEffectiveParametersForLeaf(colorAttr, currentLeaf);
      const hx = normalizeCatalogHex(sel?.colorHex) ?? extractHex6(parts[0]!.displayLabel);
      if (sel?.gradientCss?.trim()) {
        next = upsertCanonicalDual(next, 'color', null, sel.gradientCss.trim());
      } else if (hx) {
        const match = effColor.find((ep) => normalizeCatalogHex(ep.colorHex) === hx);
        if (match) {
          next = upsertCanonicalDual(
            next,
            'color',
            { parameterId: match.parameterId, displayLabel: match.label },
            ''
          );
        } else {
          next = upsertCanonicalDual(next, 'color', null, hx);
        }
      }
    }
    const primaryAttr = getAttributeById('primaryColorFamilyOptions');
    if (primaryAttr) {
      const effPrimary = resolveEffectiveParametersForLeaf(primaryAttr, currentLeaf);
      const pA = next.assignments.find(
        (x) => x.kind === 'canonical' && x.attributeId === 'primaryColorFamilyOptions'
      );
      const { hbs: phb, ft: pFt } = partitionHandbookAndFree(pA);
      if (phb.length === 0) {
        const sug = suggestPrimaryFamilyFromPaletteLabel(parts[0]!.displayLabel, effPrimary);
        if (sug) {
          next = upsertCanonicalMultiHandbookAndFree(
            next,
            'primaryColorFamilyOptions',
            [sug],
            pFt?.text ?? ''
          );
        }
      }
    }
  }

  return next;
}

export type PassportColorPatchInput = {
  handbook?: { parameterId: string; displayLabel: string } | null;
  freeText?: string;
};

/** Патч поля `color` + при необходимости подбор primary из палитры. */
export function applyPassportColorPatchWithPrimarySync(
  prev: Workshop2DossierPhase1,
  u: PassportColorPatchInput,
  currentLeaf: HandbookCategoryLeaf
): Workshop2DossierPhase1 {
  const a = prev.assignments.find((x) => x.kind === 'canonical' && x.attributeId === 'color');
  const { hbs, ft } = partitionHandbookAndFree(a);
  const hb = hbs[0];
  const nextHb =
    u.handbook !== undefined
      ? u.handbook
      : hb?.parameterId
        ? { parameterId: hb.parameterId, displayLabel: hb.displayLabel ?? '' }
        : null;
  const nextFt = u.freeText !== undefined ? u.freeText : (ft?.text ?? '');
  let next = upsertCanonicalDual(prev, 'color', nextHb, nextFt);

  if (u.handbook !== undefined && nextHb?.displayLabel) {
    const primaryAttr = getAttributeById('primaryColorFamilyOptions');
    if (primaryAttr) {
      const effPrimary = resolveEffectiveParametersForLeaf(primaryAttr, currentLeaf);
      const pA = next.assignments.find(
        (x) => x.kind === 'canonical' && x.attributeId === 'primaryColorFamilyOptions'
      );
      const { hbs: phb } = partitionHandbookAndFree(pA);
      if (phb.length === 0) {
        const sug = suggestPrimaryFamilyFromPaletteLabel(nextHb.displayLabel, effPrimary);
        if (sug) {
          const { ft: pFt } = partitionHandbookAndFree(pA);
          next = upsertCanonicalMultiHandbookAndFree(
            next,
            'primaryColorFamilyOptions',
            [sug],
            pFt?.text ?? ''
          );
        }
      }
    }
  }
  return next;
}
