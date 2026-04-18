'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { SectionHeader } from '@/components/ui/section-header';
import { WidgetCard } from '@/components/ui/widget-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getAcademyLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { ROUTES } from '@/lib/routes';
import { UserCircle, Search, ChevronRight, Plus } from 'lucide-react';
import { EmptyStateB2B } from '@/components/ui/empty-state-b2b';
import { getClientMaterials } from '@/lib/academy/brand-academy-data';

export default function AcademyClientsPage() {
  const [searchClients, setSearchClients] = useState('');
  const [filterCollection, setFilterCollection] = useState<string>('Все');

  const collectionIds = useMemo(() => {
    const ids = new Set<string>();
    getClientMaterials().forEach((m) => m.collectionId && ids.add(m.collectionId));
    return Array.from(ids);
  }, []);

  const clientMaterials = useMemo(() => {
    const all = getClientMaterials();
    const bySearch = !searchClients
      ? all
      : all.filter(
          (m) =>
            m.title.toLowerCase().includes(searchClients.toLowerCase()) ||
            m.description.toLowerCase().includes(searchClients.toLowerCase())
        );
    if (filterCollection === 'Все') return bySearch;
    return bySearch.filter((m) => !m.collectionId || m.collectionId === filterCollection);
  }, [searchClients, filterCollection]);

  return (
    <>
      <section className="space-y-6">
        <SectionHeader
          icon={UserCircle}
          title="Материалы для клиентов"
          description="Уход, стилинг и ознакомление с коллекциями для покупателей."
        />
        <WidgetCard
          title="Материалы"
          description="Поиск и фильтрация по коллекциям"
          actions={
            <Button variant="outline" className="rounded-lg" asChild>
              <Link href={ROUTES.brand.academyClientMaterialCreate} className="gap-2">
                <Plus className="h-4 w-4" /> Добавить
              </Link>
            </Button>
          }
        >
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Поиск по материалам..."
                value={searchClients}
                onChange={(e) => setSearchClients(e.target.value)}
                className="h-11 rounded-xl pl-9"
              />
            </div>
            <select
              value={filterCollection}
              onChange={(e) => setFilterCollection(e.target.value)}
              className="min-w-[160px] rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            >
              <option value="Все">Все коллекции</option>
              {collectionIds.map((cid) => (
                <option key={cid} value={cid}>
                  {cid.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-3">
            {clientMaterials.length === 0 ? (
              <EmptyStateB2B
                icon={UserCircle}
                title="Нет материалов"
                description="Добавьте материалы для конечных покупателей"
                action={
                  <Button variant="outline" size="sm" className="rounded-lg" asChild>
                    <Link href={ROUTES.brand.academyClientMaterialCreate}>Добавить</Link>
                  </Button>
                }
              />
            ) : (
              clientMaterials.map((m) => (
                <Link key={m.id} href={ROUTES.brand.academyClientMaterial(m.id)}>
                  <div className="flex cursor-pointer items-start justify-between rounded-xl border border-slate-200/80 p-5 transition-all hover:border-slate-300 hover:shadow-md">
                    <div>
                      <p className="font-semibold text-slate-900">{m.title}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{m.description}</p>
                      <Badge variant="outline" className="mt-2 text-[9px]">
                        {m.type === 'care'
                          ? 'Уход'
                          : m.type === 'styling'
                            ? 'Стилинг'
                            : m.type === 'intro'
                              ? 'О коллекции'
                              : 'Lookbook'}
                      </Badge>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </WidgetCard>
      </section>

      <RelatedModulesBlock links={getAcademyLinks()} />
    </>
  );
}
