'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { WidgetCard } from '@/components/ui/widget-card';
import { EmptyStateB2B } from '@/components/ui/empty-state-b2b';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPriceLists } from '@/lib/b2b/price-lists';
import { getCustomerGroups } from '@/lib/b2b/customer-groups';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getB2BLinks } from '@/lib/data/entity-links';
import { DollarSign, Users } from 'lucide-react';

const CustomerGroupsContent = dynamic(() => import('@/app/brand/b2b/customer-groups/page'), {
  ssr: false,
});

export default function PriceListsPage() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'price-lists' | 'groups'>('price-lists');
  const groupFilter = searchParams.get('group');
  const lists = getPriceLists();
  const groups = getCustomerGroups();
  const filtered = groupFilter
    ? lists.filter((pl) => pl.customerGroupIds?.includes(groupFilter as any))
    : lists;

  return (
    <div className="space-y-6 pb-24">
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as 'price-lists' | 'groups')}
        className="space-y-6"
      >
        <TabsList className="h-9 gap-0.5 border border-slate-200 bg-slate-50 px-1">
          <TabsTrigger
            value="price-lists"
            className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <DollarSign className="h-3 w-3" /> Прайс-листы
          </TabsTrigger>
          <TabsTrigger
            value="groups"
            className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Users className="h-3 w-3" /> Группы клиентов
          </TabsTrigger>
        </TabsList>

        <TabsContent value="price-lists" className="mt-0 space-y-6">
          <div className="flex flex-wrap gap-2">
            <Button variant={!groupFilter ? 'default' : 'outline'} size="sm" asChild>
              <Link href={ROUTES.brand.priceLists}>Все</Link>
            </Button>
            {groups.map((g) => (
              <Button
                key={g.id}
                variant={groupFilter === g.id ? 'default' : 'outline'}
                size="sm"
                asChild
              >
                <Link href={`${ROUTES.brand.priceLists}?group=${g.id}`}>{g.nameRu}</Link>
              </Button>
            ))}
          </div>

          <WidgetCard
            title="Прайс-листы"
            description="Активные по каналу и группе клиентов. Связь с Volume Discounts."
          >
            {filtered.length === 0 ? (
              <EmptyStateB2B
                icon={DollarSign}
                title="Нет прайсов"
                description="Нет прайсов для выбранной группы. Добавьте прайс-лист или выберите другую группу."
                action={
                  <Button variant="outline" size="sm" asChild>
                    <Link href={ROUTES.brand.customerGroups}>Группы клиентов</Link>
                  </Button>
                }
              />
            ) : (
              filtered.map((pl) => (
                <div
                  key={pl.id}
                  className="flex items-start justify-between rounded-xl border border-slate-200 p-4"
                >
                  <div>
                    <p className="font-medium">{pl.name}</p>
                    <p className="text-xs text-slate-500">
                      {pl.channel} · {pl.validFrom} – {pl.validTo}
                    </p>
                    {pl.customerGroupIds?.length ? (
                      <div className="mt-2 flex gap-1">
                        {pl.customerGroupIds.map((gid) => (
                          <Badge key={gid} variant="outline" className="text-[9px]">
                            {groups.find((g) => g.id === gid)?.nameRu ?? gid}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <Badge variant="secondary" className="mt-2 text-[9px]">
                        Все группы
                      </Badge>
                    )}
                    {pl.type === 'multiplier' && pl.multiplier != null && (
                      <p className="mt-1 text-xs">Множитель: {(pl.multiplier * 100).toFixed(0)}%</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </WidgetCard>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={ROUTES.brand.customerGroups}>Группы клиентов</Link>
            </Button>
          </div>
          <RelatedModulesBlock links={getB2BLinks()} title="B2B" />
        </TabsContent>

        <TabsContent value="groups" className="mt-0 space-y-6">
          {tab === 'groups' && <CustomerGroupsContent />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
