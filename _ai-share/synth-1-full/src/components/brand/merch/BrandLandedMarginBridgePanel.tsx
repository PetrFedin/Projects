'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildBrandLandedMarginSession } from '@/lib/b2b/brand-landed-margin';
import { Percent } from 'lucide-react';

type Props = {
  collectionId?: string;
  orderId?: string;
};

export function BrandLandedMarginBridgePanel({ collectionId, orderId }: Props) {
  const session = buildBrandLandedMarginSession({ collectionId, orderId });

  return (
    <div className="space-y-4" data-testid="brand-landed-margin-pricelist-panel">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Percent className="h-4 w-4" />
            <CardTitle className="text-base">Pricelist · tier</CardTitle>
          </div>
          <CardDescription>Brand tiers → shop margin pricelist tab.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.priceListsVersionsHref}>Price list versions</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.shopMarginPricelistHref}>Shop pricelist tab</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
