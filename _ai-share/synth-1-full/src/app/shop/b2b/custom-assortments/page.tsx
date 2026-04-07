'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Layers, Store, Package, Percent } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

/** RepSpark: Custom Assortments — персональный ассортимент под ритейлера */
const MOCK_ASSORTMENTS = [
  { id: 'a1', retailerName: 'Сеть «Мода»', productCount: 120, discount: 5, validTo: '2026-06-30', status: 'active' },
  { id: 'a2', retailerName: 'Concept Store SPb', productCount: 45, discount: 10, validTo: '2026-04-15', status: 'active' },
  { id: 'a3', retailerName: 'Outdoor Pro', productCount: 80, discount: 0, validTo: '2026-05-01', status: 'draft' },
];

export default function CustomAssortmentsPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><Layers className="h-6 w-6" /> Custom Assortments</h1>
          <p className="text-slate-500 text-sm mt-0.5">RepSpark: персональный ассортимент под ритейлера — бренд формирует подборку SKU для партнёра</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ваши персональные подборки</CardTitle>
          <CardDescription>Бренды назначают вам индивидуальный ассортимент — только релевантные позиции</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_ASSORTMENTS.map((a) => (
            <div key={a.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-200">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Store className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">{a.retailerName}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <Package className="h-3 w-3" /> {a.productCount} позиций
                    {a.discount > 0 && (
                      <span className="flex items-center gap-1"><Percent className="h-3 w-3" /> −{a.discount}%</span>
                    )}
                    · до {a.validTo}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={a.status === 'active' ? 'default' : 'secondary'}>{a.status === 'active' ? 'Активна' : 'Черновик'}</Badge>
                <Button size="sm" asChild><Link href={`${ROUTES.shop.b2bCatalog}?assortment=${a.id}`}>Смотреть</Link></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bCatalog}>Каталог</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bCreateOrder}>Написание заказа</Link></Button>
      </div>
    </div>
  );
}
