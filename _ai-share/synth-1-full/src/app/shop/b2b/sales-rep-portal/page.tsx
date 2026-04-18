'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Store, FileText, Video } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';
import { ShopB2bContentHeader } from '@/components/shop/ShopB2bContentHeader';

/** Shopify/Candid: Sales Rep Portal — портал для репов и showroom */
const MOCK_APPOINTMENTS = [
  {
    id: 'ap1',
    retailer: 'Сеть «Мода»',
    date: '2026-03-15 14:00',
    type: 'showroom',
    status: 'confirmed',
  },
  {
    id: 'ap2',
    retailer: 'Concept Store',
    date: '2026-03-16 10:00',
    type: 'video',
    status: 'pending',
  },
];

export default function SalesRepPortalPage() {
  return (
    <RegistryPageShell className="max-w-3xl space-y-6">
      <ShopB2bContentHeader lead="Портал торгового представителя: встречи в шоуруме, видео и материалы по брендам (сценарии Shopify / Candid)." />

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" /> Ближайшие встречи
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MOCK_APPOINTMENTS.map((a) => (
              <div
                key={a.id}
                className="bg-bg-surface2 flex items-center justify-between rounded-lg p-2"
              >
                <div>
                  <p className="text-sm font-medium">{a.retailer}</p>
                  <p className="text-text-secondary text-xs">
                    {a.date} · {a.type === 'showroom' ? 'Шоурум' : 'Видео'}
                  </p>
                </div>
                <Badge variant={a.status === 'confirmed' ? 'default' : 'secondary'}>
                  {a.status === 'confirmed' ? 'Подтверждено' : 'Ожидает'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Store className="h-4 w-4" /> Шоурумы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-secondary mb-3 text-sm">Забронируйте время в шоуруме бренда</p>
            <Button size="sm" variant="outline" asChild>
              <Link href={ROUTES.shop.b2bVipRoomBooking}>Записаться</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Мои лайншиты
          </CardTitle>
          <CardDescription>Доступные коллекции для показа клиентам</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button size="sm" asChild>
              <Link href={ROUTES.shop.b2bCatalog}>Каталог FW26</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={ROUTES.shop.b2bEzOrder}>EZ Order</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bVideoConsultation}>
            <Video className="mr-1 h-3 w-3" /> Видео-консультация
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bCatalog}>B2B каталог</Link>
        </Button>
      </div>
    </RegistryPageShell>
  );
}
