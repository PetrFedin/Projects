import type { Product } from '@/lib/types';

/** Технологическая база знаний для персонала магазина. */
export function getStaffKnowledgePack(product: Product) {
  return {
    sku: product.sku,
    materialsDescription: 'This high-density knit keeps shape through 50+ wash cycles. Perfect for travel collection.',
    stylingScript: 'Suggest pairing with wide-leg trousers and silk scarves to elevate the look from casual to evening.',
    technicalEdge: 'Seamless shoulder tech for maximum movement comfort.',
    careInstructionsForStaff: 'Handle with gloved hands for light colors; steaming only (no iron).',
  };
}
