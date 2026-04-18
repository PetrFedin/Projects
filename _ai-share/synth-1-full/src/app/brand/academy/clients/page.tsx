'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
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
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

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
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
        title="Материалы для клиентов"
        leadPlain="Уход, стилинг и ознакомление с коллекциями для покупателей."
      />
      <section className="space-y-6">
<<<<<<< HEAD
        <SectionHeader
          icon={UserCircle}
          title="Материалы для клиентов"
          description="Уход, стилинг и ознакомление с коллекциями для покупателей."
        />
=======
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
=======
              <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
              className="min-w-[160px] rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
=======
              className="border-border-default min-w-[160px] rounded-xl border px-3 py-2.5 text-sm"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                  <div className="flex cursor-pointer items-start justify-between rounded-xl border border-slate-200/80 p-5 transition-all hover:border-slate-300 hover:shadow-md">
                    <div>
                      <p className="font-semibold text-slate-900">{m.title}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{m.description}</p>
=======
                  <div className="border-border-default/80 hover:border-border-default flex cursor-pointer items-start justify-between rounded-xl border p-5 transition-all hover:shadow-md">
                    <div>
                      <p className="text-text-primary font-semibold">{m.title}</p>
                      <p className="text-text-secondary mt-1 text-[11px]">{m.description}</p>
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
=======
                    <ChevronRight className="text-text-muted h-4 w-4 shrink-0" />
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                </Link>
              ))
            )}
          </div>
        </WidgetCard>
      </section>

      <RelatedModulesBlock links={getAcademyLinks()} />
    </RegistryPageShell>
  );
}
