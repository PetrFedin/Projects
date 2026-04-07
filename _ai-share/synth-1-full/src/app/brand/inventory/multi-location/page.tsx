'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getLocations, getStockByLocation } from '@/lib/b2b/multi-location-inventory';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getProductionLinks } from '@/lib/data/entity-links';
import { Package, ArrowLeft, MapPin } from 'lucide-react';

export default function MultiLocationInventoryPage() {
  const locations = getLocations();
  const stocks = locations.flatMap((loc) =>
    getStockByLocation(loc.id).map((s) => ({ ...s, locationName: loc.name }))
  );

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.brand.warehouse}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><MapPin className="h-6 w-6" /> Остатки по складам</h1>
          <p className="text-slate-500 text-sm mt-0.5">Москва, СПб, регионы — остатки по локациям.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Склады</CardTitle>
          <CardDescription>Локации для учёта остатков.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {locations.map((l) => (
            <div key={l.id} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Package className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium">{l.name}</p>
                {l.city && <p className="text-xs text-slate-500">{l.city}</p>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Остатки по SKU</CardTitle>
          <CardDescription>Данные из localStorage (мок). В проде — API.</CardDescription>
        </CardHeader>
        <CardContent>
          {stocks.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>Нет данных. Настройте синхронизацию с ERP.</p>
              <Button variant="outline" size="sm" className="mt-3" asChild><Link href={ROUTES.brand.integrationsErpPlm}>ERP 1С / Мой Склад</Link></Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">SKU</th>
                    <th className="text-left py-2">Локация</th>
                    <th className="text-right py-2">Доступно</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((s) => (
                    <tr key={`${s.productId}-${s.locationId}`} className="border-b">
                      <td className="py-2 font-mono">{s.sku}</td>
                      <td className="py-2">{s.locationName}</td>
                      <td className="text-right py-2 tabular-nums">{s.available}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2 mb-6">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.warehouse}>Склад</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.integrationsErpPlm}>ERP</Link></Button>
      </div>
      <RelatedModulesBlock links={getProductionLinks()} title="Логистика" />
    </div>
  );
}
