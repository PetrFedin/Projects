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
import { Store, Search, ChevronRight, Plus, Clock } from 'lucide-react';
import { EmptyStateB2B } from '@/components/ui/empty-state-b2b';
import { getCollectionTrainings } from '@/lib/academy/brand-academy-data';

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
    const bySearch = !searchStores ? all : all.filter(
      (t) => t.title.toLowerCase().includes(searchStores.toLowerCase()) ||
        t.description.toLowerCase().includes(searchStores.toLowerCase())
    );
    if (filterCollection === 'Все') return bySearch;
    return bySearch.filter((t) => t.collectionId === filterCollection);
  }, [searchStores, filterCollection]);

  return (
    <>
      <section className="space-y-6">
        <SectionHeader
          icon={Store}
          title="Обучение по коллекциям для магазинов"
          description="Product knowledge, мерчандайзинг и тренинги для партнёров."
        />
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
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Поиск по тренингам..."
                value={searchStores}
                onChange={(e) => setSearchStores(e.target.value)}
                className="pl-9 h-11 rounded-xl"
              />
            </div>
            <select
              value={filterCollection}
              onChange={(e) => setFilterCollection(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm min-w-[160px]"
            >
              <option value="Все">Все коллекции</option>
              {collectionIds.map((cid) => (
                <option key={cid} value={cid}>{cid.toUpperCase()}</option>
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
            ) : collectionTrainings.map((t) => (
              <Link key={t.id} href={ROUTES.brand.academyCollectionTraining(t.id)}>
                <div className="flex items-start justify-between p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer">
                  <div>
                    <p className="font-semibold text-slate-900">{t.title}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{t.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-[9px]">{t.collectionName} · {t.season}</Badge>
                      <Badge variant="secondary" className="text-[9px]"><Clock className="h-2.5 w-2.5 mr-0.5" /> {t.duration}</Badge>
                      <Badge variant="secondary" className="text-[9px]">{t.modules} модулей</Badge>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                </div>
              </Link>
            ))}
          </div>
      </WidgetCard>
      </section>

      <RelatedModulesBlock links={getAcademyLinks()} />
    </>
  );
}
