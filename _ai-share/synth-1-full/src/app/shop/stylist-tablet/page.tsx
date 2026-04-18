'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, ArrowLeft, ShoppingCart, Users } from 'lucide-react';
import { getEndlessStylistLinks } from '@/lib/data/entity-links';
import { listStylistLooks } from '@/lib/api';
import type { StylistLook } from '@/lib/shop/endless-stylist';

export default function EndlessStylistTabletPage() {
  const links = getEndlessStylistLinks();
  const [looks, setLooks] = useState<StylistLook[]>([]);

  useEffect(() => {
    listStylistLooks().then(setLooks);
  }, []);

  return (
    <div className="container max-w-4xl space-y-6 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Link href="/shop/clienteling">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Endless Stylist Tablet</h1>
          <p className="text-sm text-slate-500">
            Сборка полного образа из онлайн-каталога на планшете продавца. Связь с клиентингом,
            каталогом и заказами.
          </p>
        </div>
      </div>

      <Card className="border-violet-100">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <LayoutGrid className="h-4 w-4 text-violet-600" />
            Последние образы
          </CardTitle>
          <CardDescription>Образы, собранные на планшете в магазине</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {looks.map((look) => (
            <div
              key={look.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3"
            >
              <div>
                <p className="text-sm font-medium">{look.items.map((i) => i.name).join(' + ')}</p>
                {look.customerId && (
                  <Badge variant="outline" className="mt-1 text-[10px]">
                    Клиент привязан
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm">
                Оформить заказ
              </Button>
            </div>
          ))}
          <p className="mt-3 text-xs text-slate-400">
            API: ENDLESS_STYLIST_API — образы, каталог, создание заказа из образа.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Связанные модули</CardTitle>
          <CardDescription>Клиентинг, каталог, заказы</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-wrap gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <Button variant="outline" size="sm" className="text-xs" asChild>
                  <Link href={l.href}>{l.label}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
