/**
 * Минимальное экранирование для вставки в XML/SVG.
 */
export function escapeSvgText(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
