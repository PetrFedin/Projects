/**
 * @deprecated Use shop-navigation-normalized.ts instead
 * This file is kept for backward compatibility
 */

export {
  shopNavGroups,
  mainShopNavLinks,
<<<<<<< HEAD
  findShopSubsection,
  getShopSubsections,
} from './shop-navigation-normalized';

// Legacy export for b2bNavLinks
import { shopNavGroups as normalizedGroups } from './shop-navigation-normalized';
export const b2bNavLinks = normalizedGroups.find((g) => g.id === 'b2b')?.links || [];
=======
  b2bNavLinks,
  b2bHubTabLinks,
  getB2bHubTabValue,
  getMainShopNavTabValue,
  findShopSubsection,
  getShopSubsections,
  filterShopNavGroupsByTier,
  getShopNavDisplayMode,
  type ShopNavDisplayMode,
} from './shop-navigation-normalized';
>>>>>>> recover/cabinet-wip-from-stash
