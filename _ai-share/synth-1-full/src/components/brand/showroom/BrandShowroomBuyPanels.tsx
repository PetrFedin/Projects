'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildBrandShowroomBuySession } from '@/lib/fashion/brand-showroom-buy';
import { Rocket, Store } from 'lucide-react';

type Props = {
  collectionId: string;
};

export function BrandShowroomPublishPanel({ collectionId }: Props) {
  const session = buildBrandShowroomBuySession({ collectionId });

  return (
    <div className="space-y-4" data-testid="brand-showroom-publish-panel">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Rocket className="h-4 w-4" />
            <CardTitle className="text-base">Publish · syndication</CardTitle>
          </div>
          <CardDescription>
            Release gate → linesheet feed → shop showroom — без второго экрана publish.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.launchReadinessHref} data-testid="brand-showroom-publish-readiness-link">
              Launch readiness
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.syndicationHref}>Syndication tab</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.previewHref}>Preview витрины</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function BrandShowroomShopBuyPanel({ collectionId }: Props) {
  const session = buildBrandShowroomBuySession({ collectionId });

  return (
    <div className="space-y-4" data-testid="brand-showroom-shop-buy-panel">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Store className="h-4 w-4" />
            <CardTitle className="text-base">Shop buy mirror</CardTitle>
          </div>
          <CardDescription>
            Как магазин видит коллекцию после publish — deep-link в shop showroom и matrix.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.shopShowroomHref} data-testid="brand-showroom-shop-showroom-link">
              Shop showroom
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.shopBuyPathHref}>Shop buy path</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
