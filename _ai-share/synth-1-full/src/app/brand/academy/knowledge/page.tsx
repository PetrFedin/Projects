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
import { FileText, Search, ChevronRight, Plus } from 'lucide-react';
import { EmptyStateB2B } from '@/components/ui/empty-state-b2b';
import {
  getBrandKnowledgeArticles,
  KNOWLEDGE_CATEGORY_LABELS,
} from '@/lib/academy/brand-academy-data';

export default function AcademyKnowledgePage() {
  const [searchKnowledge, setSearchKnowledge] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('Все');

  const knowledgeArticles = useMemo(() => {
    const all = getBrandKnowledgeArticles();
    const bySearch = !searchKnowledge
      ? all
      : all.filter(
          (a) =>
            a.title.toLowerCase().includes(searchKnowledge.toLowerCase()) ||
            a.excerpt.toLowerCase().includes(searchKnowledge.toLowerCase())
        );
    if (filterCategory === 'Все') return bySearch;
    return bySearch.filter((a) => a.category === filterCategory);
  }, [searchKnowledge, filterCategory]);

  return (
    <>
      <section className="space-y-6">
        <SectionHeader
          icon={FileText}
          title="База знаний бренда"
          description="Информация о бренде и сфере для партнёров и клиентов."
        />
        <WidgetCard
          title="Статьи базы знаний"
          description="Поиск и фильтрация по категориям"
          actions={
            <Button variant="outline" className="rounded-lg" asChild>
              <Link href={ROUTES.brand.academyKnowledgeCreate} className="gap-2">
                <Plus className="h-4 w-4" /> Добавить
              </Link>
            </Button>
          }
        >
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Поиск по статьям..."
                value={searchKnowledge}
                onChange={(e) => setSearchKnowledge(e.target.value)}
                className="h-11 rounded-xl border-slate-200 pl-9"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="min-w-[160px] rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            >
              <option value="Все">Все категории</option>
              {Object.entries(KNOWLEDGE_CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-3">
            {knowledgeArticles.length === 0 ? (
              <EmptyStateB2B
                icon={FileText}
                title="Нет статей"
                description="Добавьте первую статью в базу знаний"
                action={
                  <Button variant="outline" size="sm" className="rounded-lg" asChild>
                    <Link href={ROUTES.brand.academyKnowledgeCreate}>Добавить</Link>
                  </Button>
                }
              />
            ) : (
              knowledgeArticles.map((a) => (
                <Link key={a.id} href={ROUTES.brand.academyKnowledgeArticle(a.id)}>
                  <div className="flex cursor-pointer items-start justify-between rounded-2xl border border-slate-200/80 p-5 transition-all hover:border-indigo-200/60 hover:shadow-md">
                    <div>
                      <p className="font-semibold text-slate-900">{a.title}</p>
                      <p className="mt-1 text-[11px] text-slate-500">{a.excerpt}</p>
                      <div className="mt-2 flex gap-2">
                        <Badge variant="outline" className="text-[9px]">
                          {KNOWLEDGE_CATEGORY_LABELS[a.category] ?? a.category}
                        </Badge>
                        {a.audience.map((aud) => (
                          <Badge key={aud} variant="secondary" className="text-[8px]">
                            {aud === 'partners'
                              ? 'Партнёрам'
                              : aud === 'clients'
                                ? 'Клиентам'
                                : 'Команде'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
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
