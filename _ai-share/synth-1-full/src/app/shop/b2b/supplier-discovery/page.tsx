'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Layers } from 'lucide-react';
import { B2BModulePage } from '@/components/shop/B2BModulePage';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

/** Supl.biz: поиск поставщиков по гео и категориям (РФ). */
export default function B2BSupplierDiscoveryPage() {
  return (
    <B2BModulePage
      title="Поиск поставщиков"
      description="Реестр поставщиков по гео и категориям (Supl.biz)"
      moduleId="supplier-discovery"
      icon={Search}
      phase={1}
    >
      <Card>
        <CardHeader>
          <CardTitle>Фильтры поиска</CardTitle>
          <CardDescription>По региону, категории, MOQ, сертификатам.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Поиск по названию, категории..." className="pl-9" />
            </div>
            <Button>Искать</Button>
          </div>
          <div className="flex gap-2 text-sm text-slate-600">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Регион
            </span>
            <span className="flex items-center gap-1">
              <Layers className="h-3 w-3" /> Категория
            </span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.shop.b2bTenders}>Тендеры B2B</Link>
          </Button>
        </CardContent>
      </Card>
    </B2BModulePage>
  );
}
