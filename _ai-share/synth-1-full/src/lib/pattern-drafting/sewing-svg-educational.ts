/**
 * Учебный SVG: водяной знак и флаги экспорта (через NEXT_PUBLIC_*).
 */

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** По умолчанию включён; `NEXT_PUBLIC_SEWING_SVG_WATERMARK=0` — без водяного знака. */
export function shouldApplySewingSvgWatermark(): boolean {
  const v = process.env.NEXT_PUBLIC_SEWING_SVG_WATERMARK?.trim();
  if (v === '0' || v === 'false') return false;
  return true;
}

/**
 * Вставляет в конец SVG невзаимодейктивный текст (низу справа).
 * Не трогает разметку, если нет закрывающего `</svg>`.
 */
export function applyInstructionalWatermarkToSvg(
  svg: string,
  label = 'SYNTH — educational draft'
): string {
  if (!shouldApplySewingSvgWatermark()) return svg;
  const lower = svg.toLowerCase();
  const last = lower.lastIndexOf('</svg>');
  if (last < 0) return svg;
  const safe = escapeXml(label);
  const block = `<g id="synth-sewing-edu-wm" opacity="0.38" style="pointer-events:none" font-family="system-ui,sans-serif" fill="#94a3b8" font-size="11" letter-spacing="0.02em"><text x="96%" y="97%" text-anchor="end" dominant-baseline="alphabetic">${safe}</text></g>`;
  return `${svg.slice(0, last)}${block}${svg.slice(last)}`;
}
