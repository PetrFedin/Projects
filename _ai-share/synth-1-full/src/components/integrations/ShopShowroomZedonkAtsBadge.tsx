'use client';

import { ShopArticleInventoryBadges } from '@/components/integrations/ShopArticleInventoryBadges';

type Props = {
  sku: string;
};

/** @deprecated Use ShopArticleInventoryBadges — сохранён для совместимости testid. */
export function ShopShowroomZedonkAtsBadge({ sku }: Props) {
  return <ShopArticleInventoryBadges sku={sku} />;
}
