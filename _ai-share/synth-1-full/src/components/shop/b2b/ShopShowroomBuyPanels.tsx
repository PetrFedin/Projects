'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildShopShowroomBuySession } from '@/lib/b2b/shop-showroom-buy';
import { FileText, ShoppingBag } from 'lucide-react';

type Props = {
  collectionId: string;
  orderId?: string;
};

export function ShopShowroomLinesheetPanel({ collectionId, orderId }: Props) {
  const session = buildShopShowroomBuySession({ collectionId, orderId });

  return (
    <div className="space-y-4" data-testid="shop-showroom-linesheet-panel">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <FileText className="h-4 w-4" />
            <CardTitle className="text-base">Linesheet · assortment</CardTitle>
          </div>
          <CardDescription>
            JOOR/NuOrder: опубликованная коллекция → матрица размеров и pre-order без дубля витрины.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.matrixHref} data-testid="shop-showroom-linesheet-matrix-link">
              Матрица коллекции
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.prepackHref}>Pre-pack</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.showroomHref}>Витрина browse</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function ShopShowroomBuyPathPanel({ collectionId, orderId }: Props) {
  const session = buildShopShowroomBuySession({ collectionId, orderId });

  return (
    <div className="space-y-4" data-testid="shop-showroom-buy-panel">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <CardTitle className="text-base">Buy path</CardTitle>
          </div>
          <CardDescription>
            Checkout · working order · replenishment — следующий шаг после витрины.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.checkoutHref} data-testid="shop-showroom-buy-checkout-link">
              Checkout
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
