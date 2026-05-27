/** Чистая логика видимости RunwayStickyBar (тестируется без DOM). */
export function shouldShowRunwayStickyBar(options: {
  enabled: boolean;
  switcherBottom: number;
  detailsTop: number;
  viewportHeight: number;
}): boolean {
  if (!options.enabled) return false;
  const passedSwitcher = options.switcherBottom < 80;
  const nearDetails = options.detailsTop < options.viewportHeight * 0.85;
  return passedSwitcher && nearDetails;
}
