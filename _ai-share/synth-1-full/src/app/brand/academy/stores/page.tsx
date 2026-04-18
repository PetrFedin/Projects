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
import { Store, Search, ChevronRight, Plus, Clock } from 'lucide-react';
import { EmptyStateB2B } from '@/components/ui/empty-state-b2b';
import { getCollectionTrainings } from '@/lib/academy/brand-academy-data';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

export default function AcademyStoresPage() {
  const [searchStores, setSearchStores] = useState('');
  const [filterCollection, setFilterCollection] = useState<string>('Все');

  const collectionIds = useMemo(() => {
    const ids = new Set<string>();
    getCollectionTrainings().forEach((t) => ids.add(t.collectionId));
    return Array.from(ids);
  }, []);

  const collectionTrainings = useMemo(() => {
    const all = getCollectionTrainings();
    const bySearch = !searchStores
      ? all
      : all.filter(
          (t) =>
            t.title.toLowerCase().includes(searchStores.toLowerCase()) ||
            t.description.toLowerCase().includes(searchStores.toLowerCase())
        );
    if (filterCollection === 'Все') return bySearch;
    return bySearch.filter((t) => t.collectionId === filterCollection);
  }, [searchStores, filterCollection]);

  return (
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16">
      <RegistryPageHeader
        title="Обучение по коллекциям для магазинов"
        leadPlain="Product knowledge, мерчандайзинг и тренинги для партнёров."
      />
      <section className="space-y-6">
<<<<<<< HEAD
        <SectionHeader
          icon={Store}
          title="Обучение по коллекциям для магазинов"
          description="Product knowledge, мерчандайзинг и тренинги для партнёров."
        />
=======
>>>>>>> recover/cabinet-wip-from-stash
        <WidgetCard
          title="Тренинги"
          description="Поиск и фильтрация по коллекциям"
          actions={
            <Button variant="outline" className="rounded-lg" asChild>
              <Link href={ROUTES.brand.academyCollectionTrainingCreate} className="gap-2">
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
                placeholder="Поиск по тренингам..."
                value={searchStores}
                onChange={(e) => setSearchStores(e.target.value)}
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
          <div className="space-y-4">
            {collectionTrainings.length === 0 ? (
              <EmptyStateB2B
                icon={Store}
                title="Нет тренингов"
                description="Добавьте обучение по коллекции для магазинов"
                action={
                  <Button variant="outline" size="sm" className="rounded-lg" asChild>
                    <Link href={ROUTES.brand.academyCollectionTrainingCreate}>Добавить</Link>
                  </Button>
                }
              />
            ) : (
              collectionTrainings.map((t) => (
                <Link key={t.id} href={ROUTES.brand.academyCollectionTraining(t.id)}>
<<<<<<< HEAD
                  <div className="flex cursor-pointer items-start justify-between rounded-xl border border-slate-200/80 p-5 transition-all hover:border-slate-300 hover:shadow-md">
                    <div>
                      <p className="font-semibold text-slate-900">{t.title}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{t.description}</p>
=======
                  <div className="border-border-default/80 hover:border-border-default flex cursor-pointer items-start justify-between rounded-xl border p-5 transition-all hover:shadow-md">
                    <div>
                      <p className="text-text-primary font-semibold">{t.title}</p>
                      <p className="text-text-secondary mt-1 text-[11px]">{t.description}</p>
>>>>>>> recover/cabinet-wip-from-stash
                      <div className="mt-2 flex gap-2">
                        <Badge variant="outline" className="text-[9px]">
                          {t.collectionName} · {t.season}
                        </Badge>
                        <Badge variant="secondary" className="text-[9px]">
                          <Clock className="mr-0.5 h-2.5 w-2.5" /> {t.duration}
                        </Badge>
                        <Badge variant="secondary" className="text-[9px]">
                          {t.modules} модулей
                        </Badge>
                      </div>
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
