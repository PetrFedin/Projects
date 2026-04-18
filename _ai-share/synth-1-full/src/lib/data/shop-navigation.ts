/**
 * @deprecated Use shop-navigation-normalized.ts instead
 * This file is kept for backward compatibility
 */

export {
  shopNavGroups,
  mainShopNavLinks,
  findShopSubsection,
  getShopSubsections,
} from './shop-navigation-normalized';

// Legacy export for b2bNavLinks
import { shopNavGroups as normalizedGroups } from './shop-navigation-normalized';
export const b2bNavLinks = normalizedGroups.find((g) => g.id === 'b2b')?.links || [];
