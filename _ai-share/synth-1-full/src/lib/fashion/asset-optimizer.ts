import type { Product } from '@/lib/types';
import type { MpAssetCheckV1 } from './types';

/** Проверяет соответствие медиа-активов требованиям маркетплейсов. */
export function checkMpAssetCompliance(product: Product): MpAssetCheckV1[] {
  const channels = ['wb', 'ozon', 'lamoda'];

  return channels.map((channel) => {
    const missing: string[] = [];
    const issues: string[] = [];

    if (channel === 'lamoda' && product.images.length < 5) {
      missing.push('Model video', 'Back view');
    }
    if (channel === 'wb' && product.images.some((img) => img.url.includes('placeholder'))) {
      issues.push('Low resolution detected');
    }

    return {
      channel,
      status: missing.length === 0 && issues.length === 0 ? 'pass' : 'fail',
      missingTypes: missing,
      resolutionIssues: issues,
    };
  });
}
