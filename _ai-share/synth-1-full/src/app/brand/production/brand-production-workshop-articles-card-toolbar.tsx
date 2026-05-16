'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { COLLECTION_STEPS } from '@/lib/production/collection-steps-catalog';
import { JOOR_DELIVERY_WINDOWS } from '@/lib/b2b/joor-constants';
import { AlertCircle, Download, Search } from 'lucide-react';
import type { WorkshopArticlesProgressSummary } from '@/app/brand/production/brand-production-workshop-articles-card-types';

export function BrandProductionWorkshopArticlesCardToolbar(props: {
  collectionLabel: string;
  articlesProgress: WorkshopArticlesProgressSummary;
  totalCollectionArticles: number;
  articleSearch: string;
  onArticleSearchChange: (value: string) => void;
  articleFilterStage: string;
  onArticleFilterStageChange: (value: string) => void;
  articleFilterDrop: string;
  onArticleFilterDropChange: (value: string) => void;
  articleSortBy: 'stage' | 'drop' | 'revenue';
  onArticleSortByChange: (value: 'stage' | 'drop' | 'revenue') => void;
  articleFocusNeedsAttention: boolean;
  onToggleArticleFocusNeedsAttention: () => void;
  needsAttentionCount: number;
  onExportArticlesCsv: () => void;
}) {
  const {
    collectionLabel,
    articlesProgress,
    totalCollectionArticles,
    articleSearch,
    onArticleSearchChange,
    articleFilterStage,
    onArticleFilterStageChange,
    articleFilterDrop,
    onArticleFilterDropChange,
    articleSortBy,
    onArticleSortByChange,
    articleFocusNeedsAttention,
    onToggleArticleFocusNeedsAttention,
    needsAttentionCount,
    onExportArticlesCsv,
  } = props;

  return (
    <CardHeader>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <CardTitle className="text-sm uppercase tracking-tight">Артикулы коллекции</CardTitle>
          <CardDescription className="mt-1 text-xs">
            Все артикулы коллекции «{collectionLabel}». Колонка «В цех · процесс» — вход в полный
            производственный контур по выбранному SKU (этапы, снабжение, эталон, выпуск и т.д.).
            Остальные иконки — быстрые внешние экраны.
          </CardDescription>
        </div>
        {articlesProgress.total > 0 ? (
          <div className="flex flex-wrap gap-2 text-[10px]">
            <Badge variant="outline" className="border-border-default text-text-secondary">
              Tech Pack: {articlesProgress.withTechPack}/{articlesProgress.total}
            </Badge>
            <Badge variant="outline" className="border-border-default text-text-secondary">
              Сэмплы: {articlesProgress.withSamples}/{articlesProgress.total}
            </Badge>
            <Badge variant="outline" className="border-accent-primary/30 text-accent-primary">
              PO: {articlesProgress.withPo}/{articlesProgress.total}
            </Badge>
            <Badge variant="outline" className="border-emerald-200 text-emerald-700">
              Готово: {articlesProgress.ready}/{articlesProgress.total}
            </Badge>
          </div>
        ) : null}
      </div>
      {totalCollectionArticles > 0 ? (
        <div className="border-border-subtle mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
          <div className="relative min-w-[140px] max-w-[200px] flex-1">
            <Search className="text-text-muted absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск: артикул, сезон, категория, ткань…"
              value={articleSearch}
              onChange={(e) => onArticleSearchChange(e.target.value)}
              className="border-border-default focus:ring-accent-primary focus:border-accent-primary h-8 w-full rounded-lg border bg-white pl-8 pr-2 text-[11px] focus:ring-2"
            />
          </div>
          <select
            value={articleFilterStage}
            onChange={(e) => onArticleFilterStageChange(e.target.value)}
            className="border-border-default h-8 rounded-lg border bg-white px-2 text-[11px]"
          >
            <option value="">Все этапы</option>
            {COLLECTION_STEPS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <select
            value={articleFilterDrop}
            onChange={(e) => onArticleFilterDropChange(e.target.value)}
            className="border-border-default h-8 rounded-lg border bg-white px-2 text-[11px]"
          >
            <option value="">Все дропы</option>
            {JOOR_DELIVERY_WINDOWS.map((w) => (
              <option key={w.id} value={w.id}>
                {w.label.replace(/^Drop \d+: /, '')}
              </option>
            ))}
          </select>
          <select
            value={articleSortBy}
            onChange={(e) => onArticleSortByChange(e.target.value as 'stage' | 'drop' | 'revenue')}
            className="border-border-default h-8 rounded-lg border bg-white px-2 text-[11px]"
          >
            <option value="stage">Сортировка: по этапу</option>
            <option value="drop">Сортировка: по дропу</option>
            <option value="revenue">Сортировка: по выручке</option>
          </select>
          <Button
            variant={articleFocusNeedsAttention ? 'default' : 'outline'}
            size="sm"
            className="h-8 gap-1 text-[10px]"
            onClick={onToggleArticleFocusNeedsAttention}
          >
            <AlertCircle className="h-3.5 w-3.5" /> Требуют внимания{' '}
            {needsAttentionCount > 0 ? `(${needsAttentionCount})` : null}
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1 text-[10px]" onClick={onExportArticlesCsv}>
            <Download className="h-3.5 w-3.5" /> Экспорт CSV
          </Button>
        </div>
      ) : null}
    </CardHeader>
  );
}
