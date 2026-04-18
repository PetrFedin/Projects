import type { B2BCampaignV1 } from './types';

/** Управление версиями каталога для разных типов байеров (B2B Tiers). */
export function getAvailableCampaigns(): B2BCampaignV1[] {
  return [
    {
      id: 'eb-ss26',
      version: 'early_bird',
      priceMultiplier: 0.9,
      accessExpiry: '2026-05-01',
      moqOverride: 120,
    },
    { id: 'std-fw25', version: 'standard', priceMultiplier: 1.0, accessExpiry: '2026-09-01' },
    {
      id: 'out-clr',
      version: 'outlet',
      priceMultiplier: 0.6,
      accessExpiry: '2026-12-31',
      moqOverride: 24,
    },
  ];
}
