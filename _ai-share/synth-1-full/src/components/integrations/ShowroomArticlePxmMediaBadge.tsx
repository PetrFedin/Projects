'use client';

import { Badge } from '@/components/ui/badge';

type Props = {
  pxmSource?: boolean;
  pxmAssetCount?: number;
};

/** Wave B3 · badge when hero comes from Centric PXM overlay. */
export function ShowroomArticlePxmMediaBadge({ pxmSource, pxmAssetCount }: Props) {
  if (!pxmSource) return null;
  return (
    <Badge
      variant="outline"
      className="border-violet-200 bg-violet-50 text-[9px] text-violet-900"
      data-testid="showroom-article-pxm-badge"
    >
      PXM · {pxmAssetCount ?? 1} asset
    </Badge>
  );
}
