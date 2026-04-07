'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shirt, ArrowLeft, LayoutGrid } from 'lucide-react';
import { getDigitalWardrobeLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { listWardrobeItems, listWardrobeLooks } from '@/lib/api';
import type { WardrobeItem, WardrobeLook } from '@/lib/client/digital-wardrobe';

export default function DigitalWardrobePage() {
  const links = getDigitalWardrobeLinks();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [looks, setLooks] = useState<WardrobeLook[]>([]);

  useEffect(() => {
    listWardrobeItems().then(setItems);
    listWardrobeLooks().then(setLooks);
  }, []);

  return (
    <div className="container max-w-4xl py-6 space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <Link href={ROUTES.client.home}><Button variant="ghost" size="icon" aria-label="Назад"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Digital Wardrobe</h1>
          <p className="text-slate-500 text-sm">Виртуальный шкаф купленного + конструктор луков. Заказы, Body Scan, каталог.</p>
        </div>
      </div>

      <Card className="border-amber-100">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shirt className="h-4 w-4 text-amber-600" />
            Мой шкаф
          </CardTitle>
          <CardDescription>Товары из ваших заказов. Синхронизация при API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.map((i) => (
            <div key={i.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium">{i.name}</p>
                <p className="text-xs text-slate-500">{i.sku} · заказ {i.orderId}</p>
              </div>
              <Badge variant="outline" className="text-[10px]">{i.category}</Badge>
            </div>
          ))}
          <p className="text-xs text-slate-400 mt-3">API: DIGITAL_WARDROBE_API — items, sync from orders, recommend.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <LayoutGrid className="h-4 w-4" />
            Мои образы
          </CardTitle>
          <CardDescription>Конструктор луков из вещей шкафа.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {looks.map((l) => (
              <li key={l.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <p className="text-sm font-medium">{l.name ?? 'Без названия'}</p>
                <p className="text-xs text-slate-500">Вещей в образе: {l.itemIds.length}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Связанные модули</CardTitle>
          <CardDescription>Заказы, Body Scan, каталог</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap gap-2">
            {links.map((l) => (
              <li key={l.href}><Button variant="outline" size="sm" className="text-xs" asChild><Link href={l.href}>{l.label}</Link></Button></li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
