import type { ShopB2bPartnership } from '@/lib/shop/shop-b2b-partnerships';

export type PlatformB2bPartnerOnboardingRow = ShopB2bPartnership & {
  buyerId: string;
  connectedAt?: string;
  pgRowStatus?: 'requested' | 'connected';
};

export type PlatformB2bPartnersOnboardingCounts = {
  connected: number;
  requested: number;
  profile: number;
};
