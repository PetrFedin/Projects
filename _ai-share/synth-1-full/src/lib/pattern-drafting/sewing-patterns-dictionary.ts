import { sewingPatternsMessages as ru, type SewingPatternsMessages } from '@/lib/pattern-drafting/sewing-patterns-messages';

/** English copy — same keys as RU, для A/B и будущего next-intl. */
export const sewingPatternsMessagesEn: SewingPatternsMessages = {
  nonApparelBannerTitle: 'Pattern drafting does not apply',
  nonApparelBannerBody:
    'This tool visualizes apparel pattern blocks. For bags, shoes, and other non-apparel nodes we only show the catalog path; no garment presets or drafting.',
  nonApparelPathOnlyHint: 'The category path is for alignment; no drafting presets are shown here.',
  formDimmedNote: 'Measurements and drafting options apply when L1 is «Clothing / Одежда».',
  formDescriptionApparel: 'cm, decimals with a dot. Height affects FWL. Step 1 category set ease; adjust manually.',
  formDescriptionNonApparel:
    'Body measurements still load, but the draft preview below is for apparel. Switch L1 to «Одежда» to use the full tool.',
  copyCategorySnapshot: 'Copied',
  copyCategoryDescription: 'Path snapshot in the clipboard (for the brand or order).',
  commitIntentButton: 'Save to server',
  commitIntentSuccess: 'Category verified',
  commitIntentError: 'Validation failed',
  nonApparelSvgLine1: 'Apparel pattern drafting does not apply to this category.',
  nonApparelSvgLine2: 'The canvas below is for the «Clothing / Одежда» branch.',
  nonApparelNote:
    'A draft preview is available when L1 is «Одежда» (category-handbook, audience «Каталог»).',
  nonApparelMetricsEmpty: 'Block metrics are shown only for the «Одежда» branch.',
  commitIntentSuccessWithSchema: (pathLabel, schemaVersion, generatedAt) =>
    `${pathLabel} — leafId checked (category-handbook v${String(schemaVersion)}, snapshot ${generatedAt.slice(0, 10)}).`,
  commitIntentSuccessSimple: (pathLabel) => `${pathLabel} — leafId verified against the handbook snapshot.`,
  commitIntentErrorAborted: 'Request was cancelled (new check or you left the page).',
  commitIntentErrorNetwork: 'Network unavailable. Try again later.',
  commitIntentErrorRateLimited: 'Too many requests. Wait up to a minute and try again.',
  commitIntentErrorCode: (code) => `Code: ${code}. Check the category or refresh.`,
  profileMismatchHint:
    'Field values differ from your saved body profile. You can pull values from the profile.',
  applyFromProfileButton: 'Match profile',
  serverIntentMismatchHint:
    'Fields differ from the last snapshot on the server. You can reset to the server version.',
  applyFromServerButton: 'Match server',
  profileVsServerHint:
    'Your saved body profile and the last server version differ. Use profile, use server, or keep the current fields.',
  measureSourceTitle: 'Measure alignment',
  measureSourceDescription:
    'The form fields, profile, and server snapshot are out of sync. Choose a source and press Apply.',
  measureSourceForm: 'Current fields',
  measureSourceProfile: 'Profile',
  measureSourceServer: 'Server',
  measureSourceApply: 'Apply',
  commitOffline: 'You are offline. Save to the server will work again when the connection is back.',
  svgExportDisabledHint: 'SVG download is disabled in this environment.',
  introTitle: 'Your measurements: made-to-order scenario',
  introClientLabel: 'The customer',
  introAfterClient:
    ' sets body parameters and sees a draft outline and options (ease, part) as a base for discussion, not the final cut. ',
  introBrandLabel: 'The brand and production',
  introAfterBrand:
    " own the patterns: grading, tech pack, cutting, QC — in the brand/MES back office, not here. Section: ",
  introWardrobeName: '«Wardrobe & favorites»',
  introAfterWardrobe: '. Measurements from ',
  introLinkProfile: 'body profile',
  introAfterLink: '; the SVG below is an educational draft.',
  funnelStep1: 'Category',
  funnelStep2: 'Measurements',
  funnelStep3: 'Part & preview',
  commitIntentHint: 'Category + measures are checked against the category-handbook on the server (anti-spoof).',
  previewFileDescription: (widthMm, heightMm, fileName) =>
    `Canvas: ${widthMm.toFixed(0)}×${heightMm.toFixed(0)} u. File: ${fileName}`,
  metricsBlockTitle: 'Metrics',
  metricsBlockDescription: 'Draft numbers for the selected part: to compare with the brand and size charts.',
  educationalDraftBadge: 'Educational draft',
  stepPreviewTitle: 'Preview (mm)',
  uiLocaleShortRu: 'RU',
  uiLocaleShortEn: 'EN',
};

export type SewingPatternsLocale = 'ru' | 'en';

const dict: Record<SewingPatternsLocale, SewingPatternsMessages> = { ru, en: sewingPatternsMessagesEn };

/** `synth.ui.locale` в localStorage: `en` / `en-us` → EN, иначе RU. */
export function readSewingUiLocale(): SewingPatternsLocale {
  if (typeof window === 'undefined') return 'ru';
  const raw = localStorage.getItem('synth.ui.locale')?.trim().toLowerCase();
  if (raw === 'en' || raw === 'en-us') return 'en';
  return 'ru';
}

export function writeSewingUiLocale(l: SewingPatternsLocale): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('synth.ui.locale', l === 'en' ? 'en' : 'ru');
}

/** Словарь UI раздела лекал: учитывает `readSewingUiLocale()`. */
export function getSewingPatternsDictionary(): SewingPatternsMessages {
  if (typeof window === 'undefined') return ru;
  return dict[readSewingUiLocale()];
}

export { ru as sewingPatternsMessagesDefaultRu };
