'use client';

import { useMemo } from 'react';
import type { HandbookCategoryLeaf } from '@/lib/production/category-catalog';
import {
  formatComplianceSummary,
  formatMarketplaceHintLine,
  formatStockUnitRu,
  formatTnvedHints,
  getLeafHandbookGuidance,
} from '@/lib/production/category-catalog';
import { cn } from '@/lib/utils';

type Props = {
  leaf: HandbookCategoryLeaf | undefined;
  className?: string;
};

/**
 * Read-only подсказки по листу справочника: производство, ТН ВЭД, МП, оси подборки, вложения.
 */
export function Workshop2CategoryHandbookGuidance({ leaf, className }: Props) {
  const g = useMemo(() => (leaf ? getLeafHandbookGuidance(leaf) : null), [leaf]);

  if (!g) return null;

  const { profile, requiredAxisLabels, commonAxisLabels, attachmentChecklist, canonicalLeafId } = g;

  return (
    <div
      className={cn(
        'border-border-default bg-bg-surface2/90 text-text-primary rounded-md border px-3 py-2.5 text-[10px] leading-snug',
        className
      )}
    >
<<<<<<< HEAD
      <p className="font-semibold text-slate-900">Подсказки по категории (справочник)</p>
      <p
        className="mt-0.5 font-mono text-[9px] text-slate-500"
=======
      <p className="text-text-primary font-semibold">Подсказки по категории (справочник)</p>
      <p
        className="text-text-secondary mt-0.5 font-mono text-[9px]"
>>>>>>> recover/cabinet-wip-from-stash
        title="Канонический leafId при сохранении"
      >
        leafId: {canonicalLeafId}
      </p>
      <dl className="mt-2 grid gap-1.5">
        <div>
<<<<<<< HEAD
          <dt className="text-slate-500">Ед. учёта (по умолчанию)</dt>
=======
          <dt className="text-text-secondary">Ед. учёта (по умолчанию)</dt>
>>>>>>> recover/cabinet-wip-from-stash
          <dd>
            {formatStockUnitRu(profile.stockUnitDefault)}
            {profile.stockUnitNotes ? ` · ${profile.stockUnitNotes}` : ''}
          </dd>
        </div>
        <div>
          <dt className="text-text-secondary">Маршрут / шаблон этапов</dt>
          <dd>
            <span className="font-mono text-[9px]">{profile.productionRouteTemplateId ?? '—'}</span>
            {profile.productionRouteTemplateLabel ? (
              <span className="text-text-secondary block">
                {profile.productionRouteTemplateLabel}
              </span>
            ) : null}
          </dd>
        </div>
        <div>
          <dt className="text-text-secondary">Комплаенс (ориентиры)</dt>
          <dd>{formatComplianceSummary(profile.complianceTags)}</dd>
        </div>
        <div>
          <dt className="text-text-secondary">ТН ВЭД / классификаторы (подсказка оператору)</dt>
          <dd className="text-text-primary">{formatTnvedHints(profile)}</dd>
        </div>
        {profile.marketplaceRefs.length > 0 ? (
          <div>
            <dt className="text-text-secondary">Маркетплейсы (подсказка)</dt>
            <dd>
              <ul className="text-text-primary list-disc pl-3.5">
                {profile.marketplaceRefs.map((r, i) => (
                  <li key={`${r.channelId}-${i}`}>{formatMarketplaceHintLine(r)}</li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="text-text-secondary">Обязательные оси подборки (карточка / ТЗ)</dt>
          <dd>
            {requiredAxisLabels.length ? (
              <span>{requiredAxisLabels.join(' · ')}</span>
            ) : (
              <span className="text-text-muted">—</span>
            )}
          </dd>
        </div>
        {commonAxisLabels.length > 0 ? (
          <div>
            <dt className="text-text-secondary">Общие оси</dt>
            <dd className="text-text-secondary">{commonAxisLabels.join(' · ')}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-text-secondary">Вложения перед передачей в производство (чеклист)</dt>
          <dd>
            <ul className="mt-0.5 space-y-0.5">
              {attachmentChecklist.map((item) => (
                <li key={item.id} className="flex gap-1.5">
<<<<<<< HEAD
                  <span className="select-none text-slate-400" aria-hidden>
=======
                  <span className="text-text-muted select-none" aria-hidden>
>>>>>>> recover/cabinet-wip-from-stash
                    ☐
                  </span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
<<<<<<< HEAD
          <dt className="text-slate-500">Этикетка: языки и блоки</dt>
          <dd className="text-slate-600">
=======
          <dt className="text-text-secondary">Этикетка: языки и блоки</dt>
          <dd className="text-text-secondary">
>>>>>>> recover/cabinet-wip-from-stash
            {profile.labelLocalesDefault.join(', ') || '—'} ·{' '}
            {profile.mandatoryLabelBlocks.join(', ')}
          </dd>
        </div>
      </dl>
      <p className="border-border-default/80 text-text-secondary mt-2 border-t pt-2 text-[9px]">
        Не юридическая консультация. Источник осей атрибутов: {profile.attributeBinding}
        {profile.attributeBindingNote ? ` — ${profile.attributeBindingNote}` : ''}.
      </p>
    </div>
  );
}
