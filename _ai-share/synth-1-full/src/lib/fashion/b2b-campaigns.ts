import type { B2BCampaignV1 } from './types';

/** Управление версиями B2B кампаний (Marketing Hub). */
export function getB2BCampaigns(): B2BCampaignV1[] {
  return [
    {
      id: 'CAM-001',
      version: 'v1.2',
      theme: 'Global Heritage',
      targetMarket: 'EU / NA',
      activeStatus: true,
      publishedAt: '2026-03-01',
    },
    {
      id: 'CAM-002',
      version: 'v2.0-beta',
      theme: 'Digital Frontier',
      targetMarket: 'Asia / UAE',
      activeStatus: false,
      publishedAt: '2026-03-15',
    },
  ];
}
