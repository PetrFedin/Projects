/** Маппинг UI id фабрики → contractorId в W2 sample-order. */
export function resolveWorkshop2FactoryContractorId(factoryUiId: string): string {
  const id = factoryUiId.trim();
  if (!id) return 'fact-1';
  if (id.startsWith('fact-')) return id;
  if (/^f\d+$/i.test(id)) return `fact-${id.replace(/^f/i, '')}`;
  return id;
}
