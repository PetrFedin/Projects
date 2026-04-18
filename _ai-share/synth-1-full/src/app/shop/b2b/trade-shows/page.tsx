'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getUpcomingEvents } from '@/lib/b2b/trade-show-calendar';
import { ROUTES } from '@/lib/routes';
import { ArrowRight } from 'lucide-react';
import { RegistryPageShell } from '@/components/design-system';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';

export default function ShopTradeShowsPage() {
  const events = getUpcomingEvents();

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
        <Calendar className="h-6 w-6" /> Мои выставки
      </h1>
=======
    <RegistryPageShell className="max-w-3xl space-y-6">
      <ShopB2bContentHeader lead="Ближайшие события и запись на встречи с брендами." />
>>>>>>> recover/cabinet-wip-from-stash

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ближайшие события</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {events.map((e) => (
            <div
              key={e.id}
<<<<<<< HEAD
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
            >
              <div>
                <p className="font-medium">{e.name}</p>
                <p className="text-sm text-slate-500">
=======
              className="border-border-default flex items-center justify-between rounded-xl border p-4"
            >
              <div>
                <p className="font-medium">{e.name}</p>
                <p className="text-text-secondary text-sm">
>>>>>>> recover/cabinet-wip-from-stash
                  {e.startDate} – {e.endDate} · {e.city}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`${ROUTES.shop.b2bTradeShowAppointments}?event=${e.id}`}>
                  Записаться <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
<<<<<<< HEAD

      <Button variant="outline" asChild>
        <Link href={ROUTES.shop.b2b}>← B2B хаб</Link>
      </Button>
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
