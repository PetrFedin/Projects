'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getCustomerGroups } from '@/lib/b2b/customer-groups';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getB2BLinks } from '@/lib/data/entity-links';
import { Users, ArrowLeft, Percent, CreditCard, FileText } from 'lucide-react';

export default function CustomerGroupsPage() {
  const groups = getCustomerGroups();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.brand.retailers}>
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><Users className="h-6 w-6" /> Группы клиентов</h1>
          <p className="text-slate-500 text-sm mt-0.5">Сегментация: розница, дистрибуция, франшиза. Привязка к прайсам, скидкам, Net terms.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Сегменты</CardTitle>
          <CardDescription>Прайс-листы и объёмные скидки фильтруются по группе. Net terms и First order discount — по умолчанию для группы.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {groups.map((g) => (
            <Link key={g.id} href={ROUTES.brand.priceLists + `?group=${g.id}`}>
              <div className="flex items-start justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors">
                <div>
                  <p className="font-medium">{g.nameRu}</p>
                  <p className="text-xs text-slate-500 mt-1">Tier: {g.defaultPriceTier} · Net {g.defaultNetTermDays} дн.</p>
                  <div className="flex gap-1 mt-2">
                    {g.firstOrderDiscountPercent ? (
                      <Badge variant="secondary" className="text-[9px] gap-0.5"><Percent className="h-2.5 w-2.5" /> −{g.firstOrderDiscountPercent}% первый заказ</Badge>
                    ) : null}
                    {g.vatExempt ? (
                      <Badge variant="outline" className="text-[9px]"><FileText className="h-2.5 w-2.5" /> Без НДС</Badge>
                    ) : null}
                  </div>
                </div>
                <Badge variant="outline">{g.id}</Badge>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-2 mb-6">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.priceLists}>Прайс-листы</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.companyAccounts}>Company Accounts</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.brand.financeRf}>Net terms & НДС</Link></Button>
      </div>
      <RelatedModulesBlock links={getB2BLinks()} title="Прайсы, заказы, партнёры" />
    </div>
  );
}
