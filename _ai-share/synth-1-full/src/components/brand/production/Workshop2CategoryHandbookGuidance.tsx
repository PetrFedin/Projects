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
        'rounded-md border border-slate-200 bg-slate-50/90 px-3 py-2.5 text-[10px] leading-snug text-slate-800',
        className
      )}
    >
      <p className="font-semibold text-slate-900">Подсказки по категории (справочник)</p>
      <p className="mt-0.5 font-mono text-[9px] text-slate-500" title="Канонический leafId при сохранении">
        leafId: {canonicalLeafId}
      </p>
      <dl className="mt-2 grid gap-1.5">
        <div>
          <dt className="text-slate-500">Ед. учёта (по умолчанию)</dt>
          <dd>{formatStockUnitRu(profile.stockUnitDefault)}{profile.stockUnitNotes ? ` · ${profile.stockUnitNotes}` : ''}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Маршрут / шаблон этапов</dt>
          <dd>
            <span className="font-mono text-[9px]">{profile.productionRouteTemplateId ?? '—'}</span>
            {profile.productionRouteTemplateLabel ? (
              <span className="block text-slate-600">{profile.productionRouteTemplateLabel}</span>
            ) : null}
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Комплаенс (ориентиры)</dt>
          <dd>{formatComplianceSummary(profile.complianceTags)}</dd>
        </div>
        <div>
          <dt className="text-slate-500">ТН ВЭД / классификаторы (подсказка оператору)</dt>
          <dd className="text-slate-700">{formatTnvedHints(profile)}</dd>
        </div>
        {profile.marketplaceRefs.length > 0 ? (
          <div>
            <dt className="text-slate-500">Маркетплейсы (подсказка)</dt>
            <dd>
              <ul className="list-disc pl-3.5 text-slate-700">
                {profile.marketplaceRefs.map((r, i) => (
                  <li key={`${r.channelId}-${i}`}>{formatMarketplaceHintLine(r)}</li>
                ))}
              </ul>
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="text-slate-500">Обязательные оси подборки (карточка / ТЗ)</dt>
          <dd>
            {requiredAxisLabels.length ? (
              <span>{requiredAxisLabels.join(' · ')}</span>
            ) : (
              <span className="text-slate-400">—</span>
            )}
          </dd>
        </div>
        {commonAxisLabels.length > 0 ? (
          <div>
            <dt className="text-slate-500">Общие оси</dt>
            <dd className="text-slate-600">{commonAxisLabels.join(' · ')}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-slate-500">Вложения перед передачей в производство (чеклист)</dt>
          <dd>
            <ul className="mt-0.5 space-y-0.5">
              {attachmentChecklist.map((item) => (
                <li key={item.id} className="flex gap-1.5">
                  <span className="text-slate-400 select-none" aria-hidden>
                    ☐
                  </span>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">Этикетка: языки и блоки</dt>
          <dd className="text-slate-600">
            {profile.labelLocalesDefault.join(', ') || '—'} · {profile.mandatoryLabelBlocks.join(', ')}
          </dd>
        </div>
      </dl>
      <p className="mt-2 border-t border-slate-200/80 pt-2 text-[9px] text-slate-500">
        Не юридическая консультация. Источник осей атрибутов: {profile.attributeBinding}
        {profile.attributeBindingNote ? ` — ${profile.attributeBindingNote}` : ''}.
      </p>
    </div>
  );
}
