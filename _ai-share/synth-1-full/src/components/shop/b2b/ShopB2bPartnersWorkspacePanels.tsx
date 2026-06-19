'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildShopB2bPartnersSession } from '@/lib/b2b/shop-b2b-partners-workspace';
import { Compass, Handshake } from 'lucide-react';

type Props = {
  collectionId?: string;
};

export function ShopB2bPartnersDiscoverBridgePanel({ collectionId }: Props) {
  const session = buildShopB2bPartnersSession({ collectionId });

  return (
    <Card data-testid="shop-b2b-partners-discover-bridge-panel">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Compass className="h-4 w-4" />
          <CardTitle className="text-base">Discover brands</CardTitle>
        </div>
        <CardDescription>AI radar · invite · подключение к оптовому контуру.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button size="sm" asChild>
          <Link href={session.discoverPageHref} data-testid="shop-partners-discover-deep-link">
            Open discover radar
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function ShopB2bPartnersRepConnectPanel({ collectionId }: Props) {
  const session = buildShopB2bPartnersSession({ collectionId });

  return (
    <Card data-testid="shop-b2b-partners-rep-panel">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Handshake className="h-4 w-4" />
          <CardTitle className="text-base">Rep · collaborative</CardTitle>
        </div>
        <CardDescription>RepSpark: portal · commission · co-edit matrix.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button size="sm" asChild>
          <Link href={session.salesRepPortalHref} data-testid="shop-partners-rep-portal-link">
            Sales rep portal
          </Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href={session.shopAgentRepCommissionHref}>Commission tab</Link>
        </Button>
        <Button size="sm" variant="outline" asChild>
          <Link href={session.collaborativeHref}>Collaborative order</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
