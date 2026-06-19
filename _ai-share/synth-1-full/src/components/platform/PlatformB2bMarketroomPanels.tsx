'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildPlatformB2bMarketroomSession } from '@/lib/b2b/platform-b2b-marketroom';
import { useWorkshop2PublishedArticleCount } from '@/hooks/use-workshop2-published-article-count';
import { PlatformB2bSpineGoldenPathStrip } from '@/components/platform/PlatformB2bSpineGoldenPathStrip';
import { Compass, ShoppingBag } from 'lucide-react';

type Props = {
  collectionId?: string;
};

export function PlatformB2bMarketroomDiscoverPanel({ collectionId }: Props) {
  const session = buildPlatformB2bMarketroomSession({ collectionId });
  const { count, loading, error } = useWorkshop2PublishedArticleCount(session.collectionId);

  return (
    <div className="space-y-4 px-4 pb-8" data-testid="platform-b2b-marketroom-discover-panel">
      <PlatformB2bSpineGoldenPathStrip
        collectionId={session.collectionId}
        activeStep="marketroom"
        testIdPrefix="platform-b2b-marketroom"
      />
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Compass className="h-4 w-4" />
            <CardTitle className="text-base">Discover · collections</CardTitle>
            {!loading && !error && count != null ? (
              <Badge
                variant="outline"
                className="border-emerald-500/40 text-[10px] text-emerald-800"
                data-testid="platform-b2b-marketroom-published-pg-badge"
              >
                PG · {count} articles
              </Badge>
            ) : null}
          </div>
          <CardDescription>
            Platform hub → shop showroom → brand preview.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.shopShowroomHref} data-testid="platform-marketroom-shop-showroom-link">
              Shop showroom
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.brandPreviewHref}>Brand preview</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.partnersHref}>Partners directory</Link>
          </Button>
          <Button size="sm" variant="secondary" asChild>
            <Link href={session.shopMatrixHref} data-testid="platform-marketroom-shop-matrix-link">
              Shop matrix
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function PlatformB2bMarketroomBuyPathPanel({ collectionId }: Props) {
  const session = buildPlatformB2bMarketroomSession({ collectionId });

  return (
    <div className="space-y-4 px-4 pb-8" data-testid="platform-b2b-marketroom-buy-path-panel">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <CardTitle className="text-base">Buy path</CardTitle>
          </div>
          <CardDescription>Столп 3: buy tab → working order · replenishment.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.shopBuyHref} data-testid="platform-marketroom-shop-buy-link">
              Shop buy tab
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.workingOrderHref}>Working order</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.replenishmentAtpHref}>Replenishment · ATP</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
