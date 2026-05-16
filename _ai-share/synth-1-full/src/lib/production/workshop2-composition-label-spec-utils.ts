import type { Workshop2CompositionLabelSpec } from '@/lib/production/workshop2-dossier-phase1.types';

/** Подписи материала бирки для экспорта и ворот. */
export const WORKSHOP2_COMPOSITION_LABEL_PHYSICAL_RU: Record<string, string> = {
  satin: 'Сатин',
  nylon: 'Нейлон',
  jacquard: 'Жаккард',
  polyester: 'Полиэстер',
  cotton: 'Хлопок',
  other: 'Другое',
};

/** Есть ли в спецификации бирки что выводить в HTML и считать «описано» для ворот. */
export function workshop2CompositionLabelSpecHasExportableContent(
  spec: Workshop2CompositionLabelSpec | undefined
): boolean {
  if (!spec) return false;
  return (
    Boolean(spec.labelWidthMm?.trim()) ||
    Boolean(spec.labelHeightMm?.trim()) ||
    Boolean((spec.physicalMaterial ?? '').trim()) ||
    Boolean(spec.includeFiberCompositionFromTz) ||
    Boolean(spec.includeCareSymbolsFromTz) ||
    Boolean(spec.includeManufacturerFromTz) ||
    Boolean(spec.extraLegalLines?.trim()) ||
    Boolean(spec.technologistNotes?.trim()) ||
    Boolean((spec.sheetLayout ?? '').toString().trim()) ||
    Boolean(spec.layoutPlacementNotes?.trim()) ||
    Boolean(spec.brandFaceLines?.trim()) ||
    Boolean(spec.brandLogoPlacementNote?.trim()) ||
    Boolean(spec.typographyFontPreset) ||
    Boolean(spec.typographyCustomFontName?.trim()) ||
    Boolean(spec.typographyBodyPt?.trim()) ||
    Boolean(spec.typographyBoldFiberBlock) ||
    Boolean(spec.typographyBoldCareBlock) ||
    Boolean(spec.careSymbolIds && spec.careSymbolIds.length > 0) ||
    Boolean(spec.careInstructionsSupplement?.trim()) ||
    Boolean(spec.reverseFaceLines?.trim()) ||
    Boolean(spec.labelSizePresetId?.trim()) ||
    Boolean(spec.physicalMaterialNote?.trim()) ||
    Boolean(spec.compositionLabelLogoDataUrl?.trim()) ||
    Boolean(spec.draftTextManual?.trim()) ||
    Boolean(spec.constructorFiberRows?.length) ||
    Boolean(spec.labelOriginPresetId?.trim()) ||
    Boolean(spec.labelGarmentSizeText?.trim()) ||
    Boolean(spec.labelArticleSkuText?.trim()) ||
    Boolean(spec.labelBarcodeText?.trim()) ||
    Boolean(spec.labelQrUrl?.trim())
  );
}
