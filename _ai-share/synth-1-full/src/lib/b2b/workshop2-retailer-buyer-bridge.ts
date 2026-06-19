/** Демо-алиасы buyerId в CRM ритейлера (checkout matrix → карточка партнёра). */
export const WORKSHOP2_RETAILER_BUYER_ALIASES: Record<string, readonly string[]> = {
  shop1: ['buyer-demo'],
};

export function resolveWorkshop2RetailerBuyerIds(retailerId: string): string[] {
  const id = retailerId.trim();
  if (!id) return [];
  const aliases = WORKSHOP2_RETAILER_BUYER_ALIASES[id] ?? [];
  return [...new Set([id, ...aliases])];
}
