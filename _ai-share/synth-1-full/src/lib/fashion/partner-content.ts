import type { PartnerContentPackV1 } from './types';

/** Хаб контента для партнеров (VK/TG/Instagram). */
export function getPartnerContentPacks(skus: string[]): PartnerContentPackV1[] {
  return skus.map((sku) => ({
    sku,
    socialNetworks: ['VK', 'Telegram'],
    assetsCount: 12,
    copywritingReady: true,
    previewUrl: `/assets/partners/${sku}/pack-preview.png`,
  }));
}

export function syncToPartnerSocials(sku: string, channel: string) {
  // Mock logic to push content to partner's SMM tool
  console.log(`Syncing ${sku} assets to ${channel} for partner...`);
}
