'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layers, Store, Package, Percent } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';

/** RepSpark: Custom Assortments — персональный ассортимент под ритейлера */
const MOCK_ASSORTMENTS = [
  {
    id: 'a1',
    retailerName: 'Сеть «Мода»',
    productCount: 120,
    discount: 5,
    validTo: '2026-06-30',
    status: 'active',
  },
  {
    id: 'a2',
    retailerName: 'Concept Store SPb',
    productCount: 45,
    discount: 10,
    validTo: '2026-04-15',
    status: 'active',
  },
  {
    id: 'a3',
    retailerName: 'Outdoor Pro',
    productCount: 80,
    discount: 0,
    validTo: '2026-05-01',
    status: 'draft',
  },
];

export default function CustomAssortmentsPage() {
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
            <Layers className="h-6 w-6" /> Custom Assortments
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            RepSpark: персональный ассортимент под ритейлера — бренд формирует подборку SKU для
            партнёра
          </p>
        </div>
      </div>
=======
    <RegistryPageShell className="max-w-3xl space-y-6">
      <ShopB2bContentHeader lead="Персональный ассортимент под вашу сеть: бренд формирует подборку SKU (сценарий RepSpark / Custom Assortments)." />
>>>>>>> recover/cabinet-wip-from-stash

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ваши персональные подборки</CardTitle>
          <CardDescription>
            Бренды назначают вам индивидуальный ассортимент — только релевантные позиции
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_ASSORTMENTS.map((a) => (
            <div
              key={a.id}
<<<<<<< HEAD
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:border-indigo-200"
=======
              className="border-border-default hover:border-accent-primary/30 flex items-center justify-between rounded-xl border p-4"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <Store className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">{a.retailerName}</p>
<<<<<<< HEAD
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
=======
                  <p className="text-text-secondary mt-0.5 flex items-center gap-2 text-xs">
>>>>>>> recover/cabinet-wip-from-stash
                    <Package className="h-3 w-3" /> {a.productCount} позиций
                    {a.discount > 0 && (
                      <span className="flex items-center gap-1">
                        <Percent className="h-3 w-3" /> −{a.discount}%
                      </span>
                    )}
                    · до {a.validTo}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={a.status === 'active' ? 'default' : 'secondary'}>
                  {a.status === 'active' ? 'Активна' : 'Черновик'}
                </Badge>
                <Button size="sm" asChild>
                  <Link href={`${ROUTES.shop.b2bCatalog}?assortment=${a.id}`}>Смотреть</Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bCatalog}>Каталог</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bCreateOrder}>Написание заказа</Link>
        </Button>
      </div>
    </RegistryPageShell>
  );
}
