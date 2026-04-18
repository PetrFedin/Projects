'use client';

import { RegistryPageShell } from '@/components/design-system';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { tid } from '@/lib/ui/test-ids';

/** ASOS: маппинг размеров бренда в сетку ритейлера (EU → внутренняя линейка) для маркетплейса. */
const DEFAULT_GRID = [
  { brandSize: 'EU 32', retailerSize: 'XXS', chest: '80', waist: '62', hips: '86' },
  { brandSize: 'EU 34', retailerSize: 'XS', chest: '84', waist: '64', hips: '88' },
  { brandSize: 'EU 36', retailerSize: 'S', chest: '88', waist: '68', hips: '92' },
  { brandSize: 'EU 38', retailerSize: 'M', chest: '92', waist: '72', hips: '96' },
  { brandSize: 'EU 40', retailerSize: 'L', chest: '96', waist: '76', hips: '100' },
  { brandSize: 'EU 42', retailerSize: 'XL', chest: '100', waist: '80', hips: '104' },
];

export default function SizeMappingPage() {
  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-3xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <Ruler className="h-6 w-6" /> Маппинг размеров
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            ASOS: размер бренда (EU) → размер ритейлера для маркетплейса и заказов.
          </p>
        </div>
      </div>
=======
    <RegistryPageShell
      className="min-h-[200px] max-w-3xl space-y-6"
      data-testid={tid.page('shop-b2b-size-mapping')}
    >
      <ShopB2bContentHeader lead="Размер бренда (EU) → размер ритейлера для маркетплейса и заказов (ASOS-style)." />
>>>>>>> recover/cabinet-wip-from-stash

      <Card>
        <CardHeader>
          <CardTitle>Сетка размеров (бренд → ритейл)</CardTitle>
          <CardDescription>
            В заказе сохраняются brandSize и retailerSize для атрибуции.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-border-default border-b">
                  <th className="py-2 pr-4 font-medium">Размер бренда (EU)</th>
                  <th className="py-2 pr-4 font-medium">Размер ритейлера</th>
                  <th className="py-2 pr-4 font-medium">Грудь (см)</th>
                  <th className="py-2 pr-4 font-medium">Талия</th>
                  <th className="py-2 font-medium">Бёдра</th>
                </tr>
              </thead>
              <tbody>
                {DEFAULT_GRID.map((row, i) => (
                  <tr key={i} className="border-border-subtle border-b">
                    <td className="py-2 pr-4 font-medium">{row.brandSize}</td>
                    <td className="py-2 pr-4">{row.retailerSize}</td>
                    <td className="py-2 pr-4">{row.chest}</td>
                    <td className="py-2 pr-4">{row.waist}</td>
                    <td className="py-2">{row.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
<<<<<<< HEAD
          <p className="mt-3 text-xs text-slate-400">
=======
          <p className="text-text-muted mt-3 text-xs">
>>>>>>> recover/cabinet-wip-from-stash
            При API — сохранение сетки по бренду/категории; в позиции заказа: brandSize,
            retailerSize.
          </p>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bSizeFinder}>Подбор размера / Размерная сетка</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bOrders}>Заказы</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.client.profile}>Мерки в профиле</Link>
        </Button>
      </div>
      <RelatedModulesBlock
        links={getShopB2BHubLinks()}
        title="Заказы, маржа, матрица"
        className="mt-6"
      />
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
