'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { Package, Bookmark, Factory } from 'lucide-react';
import { getSupplierLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';

const MOCK_MATERIALS = [
  {
    id: '1',
    name: 'Premium Cotton 320g',
    supplier: 'Global Textiles',
    stock: 1200,
    unit: 'м',
    reserved: 0,
  },
  {
    id: '2',
    name: 'Молния YKK 20cm',
    supplier: 'YKK Russia',
    stock: 500,
    unit: 'шт',
    reserved: 200,
  },
];

export default function MaterialReservationPage() {
  const [reserving, setReserving] = useState<string | null>(null);

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-6 pb-24">
      <SectionInfoCard
        title="Material Reservation Hub"
        description="Бронирование остатков ткани и фурнитуры напрямую из техпакета у поставщика."
        icon={Bookmark}
        iconBg="bg-teal-100"
        iconColor="text-teal-600"
        badges={
          <>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/materials">Materials</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/suppliers">Поставщики</Link>
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-[9px]" asChild>
              <Link href="/brand/production/tech-pack/TP-9921-A">Tech Pack</Link>
            </Button>
          </>
        }
      />
      <h1 className="text-2xl font-bold uppercase">Material Reservation Hub</h1>

      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4" /> Остатки у поставщиков
          </CardTitle>
          <CardDescription>Забронируйте материал для коллекции из Tech Pack</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {MOCK_MATERIALS.map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div>
                  <p className="font-bold">{m.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {m.supplier} · Остаток: {m.stock} {m.unit}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="rounded-lg"
                  onClick={() => setReserving(m.id)}
                  disabled={!!reserving}
                >
                  Забронировать
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getSupplierLinks()} />
    </div>
  );
}
