export function extractHex6(s: string): string | undefined {
  const m = s.match(/#([0-9A-Fa-f]{6})\b/);
  return m ? `#${m[1]!.toLowerCase()}` : undefined;
}

export function extractTwoHexesFromCss(s: string): { a: string; b: string } | null {
  const matches = [...s.matchAll(/#([0-9A-Fa-f]{6})\b/gi)];
  if (matches.length >= 2) {
    return { a: `#${matches[0]![1]!.toLowerCase()}`, b: `#${matches[1]![1]!.toLowerCase()}` };
  }
  if (matches.length === 1) {
    const h = `#${matches[0]![1]!.toLowerCase()}`;
    return { a: h, b: h };
  }
  return null;
}
