/**
 * Playwright `APIRequestContext` не знает pathname brand/shop — задаём роль явно,
 * чтобы списки operational orders фильтровались как в UI (см. `b2b-operational-api-server.ts`).
 */
export const b2bV1ActorBrandHeaders = { 'x-syntha-api-actor-role': 'brand' } as const;

/** Retailer / shop кабинет — в read-model фильтр как у `actorRole: 'retailer'`. */
export const b2bV1ActorShopHeaders = { 'x-syntha-api-actor-role': 'shop' } as const;
