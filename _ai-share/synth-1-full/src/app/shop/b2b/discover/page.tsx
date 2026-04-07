'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowLeft, Store, UserPlus, Cloud, Package } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { getSyndicationStatus } from '@/lib/b2b/content-syndication';

/** JOOR Discover: каталог брендов для ритейлеров, поиск поставщиков, запрос доступа. */
const MOCK_BRANDS = [
  { id: '1', name: 'Syntha', slug: 'syntha', category: 'Премиум outerwear', country: 'РФ', status: 'partner' as const },
  { id: '2', name: 'A.P.C.', slug: 'apc', category: 'Минимализм', country: 'Франция', status: 'partner' as const },
  { id: '3', name: 'Acne Studios', slug: 'acne-studios', category: 'Сканди', country: 'Швеция', status: 'request' as const },
];

export default function DiscoverPage() {
  const [q, setQ] = useState('');
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  useEffect(() => {
    const s = getSyndicationStatus();
    setLastSynced(s.lastSyncedAt);
  }, []);

  const lastSyncedFormatted = lastSynced
    ? new Date(lastSynced).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' })
    : null;

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2b}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><Search className="h-6 w-6" /> Discover</h1>
          <p className="text-slate-500 text-sm mt-0.5">JOOR: каталог брендов, поиск поставщиков. Запрос доступа — через «Подать заявку». Fashion Cloud: каталог байера синхронизирован с PIM.</p>
        </div>
        {lastSyncedFormatted && (
          <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
            <Cloud className="h-4 w-4 text-slate-400" />
            <span>Каталог обновлён: {lastSyncedFormatted}</span>
            <Button variant="ghost" size="sm" className="h-7 text-indigo-600" asChild><Link href={ROUTES.shop.b2bCatalog}><Package className="h-3 w-3 mr-1" /> B2B Каталог</Link></Button>
          </div>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Поиск брендов</CardTitle>
          <CardDescription>По названию, категории, стране</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Поиск бренда..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <ul className="space-y-3">
            {MOCK_BRANDS.map((b) => (
              <li key={b.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center"><Store className="h-5 w-5 text-slate-500" /></div>
                  <div>
                    <p className="font-medium">{b.name}</p>
                    <p className="text-xs text-slate-500">{b.category} · {b.country}</p>
                  </div>
                </div>
                {b.status === 'partner' ? (
                  <div className="flex gap-2">
                    <Button size="sm" asChild><Link href={`${ROUTES.shop.b2bCreateOrder}?brand=${encodeURIComponent(b.name)}`}>Заказать</Link></Button>
                    <Button size="sm" variant="outline" asChild><Link href={`${ROUTES.shop.b2bPartners}/${b.slug}`}>В карточку</Link></Button>
                  </div>
                ) : (
                  <Button size="sm" asChild>
                    <Link href={`${ROUTES.shop.b2bApply}?brandId=${encodeURIComponent(b.id)}&brandName=${encodeURIComponent(b.name)}`}>
                      Запросить доступ
                    </Link>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bCatalog}><Package className="h-3 w-3 mr-1" /> B2B Каталог (PIM)</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bApply}><UserPlus className="h-3 w-3 mr-1" /> Подать заявку</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bPartners}>Мои бренды</Link></Button>
      </div>
      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Партнёры, заявка, заказы" />
    </div>
  );
}
