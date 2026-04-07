'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, UserCircle, Calendar, Store, FileText, Video } from 'lucide-react';
import { ROUTES } from '@/lib/routes';

/** Shopify/Candid: Sales Rep Portal — портал для репов и showroom */
const MOCK_APPOINTMENTS = [
  { id: 'ap1', retailer: 'Сеть «Мода»', date: '2026-03-15 14:00', type: 'showroom', status: 'confirmed' },
  { id: 'ap2', retailer: 'Concept Store', date: '2026-03-16 10:00', type: 'video', status: 'pending' },
];

export default function SalesRepPortalPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><UserCircle className="h-6 w-6" /> Sales Rep Portal</h1>
          <p className="text-slate-500 text-sm mt-0.5">Shopify/Candid: портал для репов — записи на showroom, видео-консультации, лайншиты</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Calendar className="h-4 w-4" /> Ближайшие встречи</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {MOCK_APPOINTMENTS.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <div>
                  <p className="font-medium text-sm">{a.retailer}</p>
                  <p className="text-xs text-slate-500">{a.date} · {a.type === 'showroom' ? 'Шоурум' : 'Видео'}</p>
                </div>
                <Badge variant={a.status === 'confirmed' ? 'default' : 'secondary'}>{a.status === 'confirmed' ? 'Подтверждено' : 'Ожидает'}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2"><Store className="h-4 w-4" /> Шоурумы</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-3">Забронируйте время в шоуруме бренда</p>
            <Button size="sm" variant="outline" asChild><Link href={ROUTES.shop.b2bVipRoomBooking}>Записаться</Link></Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Мои лайншиты</CardTitle>
          <CardDescription>Доступные коллекции для показа клиентам</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button size="sm" asChild><Link href={ROUTES.shop.b2bCatalog}>Каталог FW26</Link></Button>
            <Button size="sm" variant="outline" asChild><Link href={ROUTES.shop.b2bEzOrder}>EZ Order</Link></Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bVideoConsultation}><Video className="h-3 w-3 mr-1" /> Видео-консультация</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2b}>B2B хаб</Link></Button>
      </div>
    </div>
  );
}
