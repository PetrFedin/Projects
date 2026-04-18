'use client';

import { useMemo, type ReactNode } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  nineGapBacklogByAreas,
  type W2NineGapArea,
  type W2NineGapBacklogItem,
} from '@/lib/production/workshop2-dossier-nine-gap-infrastructure';
import type { Workshop2TzSignoffSectionKey } from '@/lib/production/workshop2-dossier-phase1.types';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

const VARIANT_STYLES = {
  indigo: {
    wrap: 'border-accent-primary/30 bg-accent-primary/10',
    trigger: 'text-accent-primary hover:text-accent-primary',
    badgeP0: 'bg-accent-primary/15 text-accent-primary border-accent-primary/30',
    badgeP1: 'bg-bg-surface2 text-text-primary border-border-default',
    infra: 'text-accent-primary/85',
  },
  amber: {
    wrap: 'border-amber-200/90 bg-amber-50/45',
    trigger: 'text-amber-900 hover:text-amber-950',
    badgeP0: 'bg-amber-100 text-amber-950 border-amber-200',
    badgeP1: 'bg-bg-surface2 text-text-primary border-border-default',
    infra: 'text-amber-950/85',
  },
  violet: {
    wrap: 'border-accent-primary/30 bg-accent-primary/10',
    trigger: 'text-text-primary hover:text-text-primary',
    badgeP0: 'bg-accent-primary/15 text-text-primary border-accent-primary/25',
    badgeP1: 'bg-bg-surface2 text-text-primary border-border-default',
    infra: 'text-text-primary/85',
  },
  purple: {
    wrap: 'border-accent-primary/25 bg-accent-primary/10',
    trigger: 'text-text-primary hover:text-text-primary',
    badgeP0: 'bg-accent-primary/15 text-text-primary border-accent-primary/25',
    badgeP1: 'bg-bg-surface2 text-text-primary border-border-default',
    infra: 'text-text-primary/85',
  },
} as const;

export type Workshop2NineGapBacklogStripProps = {
  /** Области бэклога; не используется, если задан `backlogItems`. */
  areas?: readonly W2NineGapArea[];
  /** Явный список и порядок пунктов (например `W2_NINE_GAP_VISUAL_SKETCH_ROADMAP`). */
  backlogItems?: readonly W2NineGapBacklogItem[];
  /** Заголовок сворачиваемого блока; по умолчанию «До 9 баллов · дорожная карта (n)». */
  stripTitle?: string;
  variant?: keyof typeof VARIANT_STYLES;
  /** Процент готовности секции досье (0–100), если известен. */
  sectionPct?: number;
  className?: string;
  /** Быстрые переходы к согласованным секциям ТЗ (под списком бэклога). */
  footer?: ReactNode;
  /** Переход к якорю ТЗ по пункту бэклога (если в данных задан `dossierJump`). */
  onDossierJump?: (section: Workshop2TzSignoffSectionKey, anchorId: string) => void;
};

/**
 * Сводка бэклога «до 9 баллов» по областям (`W2_NINE_GAP_BACKLOG`) — прозрачность дорожной карты без нового API.
 */
export function Workshop2NineGapBacklogStrip({
  areas,
  backlogItems,
  stripTitle,
  variant = 'indigo',
  sectionPct,
  className,
  footer,
  onDossierJump,
}: Workshop2NineGapBacklogStripProps) {
  const items = useMemo(() => {
    if (backlogItems && backlogItems.length > 0) return backlogItems;
    return nineGapBacklogByAreas(areas ?? []);
  }, [areas, backlogItems]);
  const v = VARIANT_STYLES[variant];

  if (items.length === 0) return null;

  return (
    <Collapsible
      defaultOpen={false}
      className={cn('rounded-lg border px-3 py-2 shadow-sm', v.wrap, className)}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={cn(
              'flex min-w-0 flex-1 items-center gap-2 text-left text-[10px] font-bold uppercase tracking-wide underline-offset-2 hover:underline',
              v.trigger
            )}
          >
            <LucideIcons.Target className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
            <span>
              {stripTitle
                ? `${stripTitle} (${items.length})`
                : `До 9 баллов · дорожная карта (${items.length})`}
            </span>
          </button>
        </CollapsibleTrigger>
        {typeof sectionPct === 'number' ? (
          <span
<<<<<<< HEAD
            className="shrink-0 text-[10px] font-semibold tabular-nums text-slate-600"
=======
            className="text-text-secondary shrink-0 text-[10px] font-semibold tabular-nums"
>>>>>>> recover/cabinet-wip-from-stash
            title="Готовность текущей вкладки ТЗ (атрибуты каталога и ворота секции, где применимо)"
          >
            Секция ≈ {Math.round(sectionPct)}%
          </span>
        ) : null}
      </div>
      <CollapsibleContent className="space-y-2 pt-2">
        {stripTitle === 'Паспорт · дорожная карта' ? (
          <>
            <p className="text-text-secondary text-[10px] leading-snug">
              P0 — аудит критичных записей журнала и сжатый ТЗ: query{' '}
<<<<<<< HEAD
              <span className="rounded bg-slate-100 px-0.5 font-mono text-[9px] text-slate-800">
                w2view
              </span>
              , корень панели с{' '}
              <span className="rounded bg-slate-100 px-0.5 font-mono text-[9px] text-slate-800">
                data-w2-dossier-view
              </span>
              . P1 — внешняя read-only выдача:{' '}
              <span className="rounded bg-slate-100 px-0.5 font-mono text-[9px] text-slate-800">
=======
              <span className="bg-bg-surface2 text-text-primary rounded px-0.5 font-mono text-[9px]">
                w2view
              </span>
              , корень панели с{' '}
              <span className="bg-bg-surface2 text-text-primary rounded px-0.5 font-mono text-[9px]">
                data-w2-dossier-view
              </span>
              . P1 — внешняя read-only выдача:{' '}
              <span className="bg-bg-surface2 text-text-primary rounded px-0.5 font-mono text-[9px]">
>>>>>>> recover/cabinet-wip-from-stash
                buildWorkshop2ExternalReadOnlyParams
              </span>
              , в ссылке — factory и sketchFloor.
            </p>
            <p className="text-text-secondary text-[10px] leading-snug">
              «Уже в коде» — как в строках списка; «Перейти к блоку» ведёт на якорь в паспорте.
              {onDossierJump
                ? ' У пунктов с ссылкой «Перейти к блоку» открывается нужная вкладка ТЗ и якорь.'
                : null}
            </p>
<<<<<<< HEAD
            <p className="text-[10px] leading-snug text-slate-500">
              Якоря: <span className="font-mono text-[9px] text-slate-700">#w2-passport-audit</span>{' '}
              · <span className="font-mono text-[9px] text-slate-700">#w2-passport-dense-view</span>{' '}
              (breadcrumb + w2view) ·{' '}
              <span className="font-mono text-[9px] text-slate-700">#w2-passport-readonly</span>.
=======
            <p className="text-text-secondary text-[10px] leading-snug">
              Якоря:{' '}
              <span className="text-text-primary font-mono text-[9px]">#w2-passport-audit</span> ·{' '}
              <span className="text-text-primary font-mono text-[9px]">
                #w2-passport-dense-view
              </span>{' '}
              (breadcrumb + w2view) ·{' '}
              <span className="text-text-primary font-mono text-[9px]">#w2-passport-readonly</span>.
>>>>>>> recover/cabinet-wip-from-stash
            </p>
          </>
        ) : stripTitle === 'Визуал · дорожная карта' ? (
          <>
<<<<<<< HEAD
            <p className="text-[10px] leading-snug text-slate-600">
=======
            <p className="text-text-secondary text-[10px] leading-snug">
>>>>>>> recover/cabinet-wip-from-stash
              Визуал / скетч: P0 — связь метка↔материал/QC (поля связи на «Визуале»), шаблоны master
              (якорь в «Конструкция»), канон и журнал версий, handoff; P1 — печать и поверхности
              экспорта.
            </p>
            <p className="text-text-secondary text-[10px] leading-snug">
              «Уже в коде» — см. строки пункта; «Ещё нет (P0)» — продуктовый пробел.
              {onDossierJump
                ? ' У пунктов с ссылкой «Перейти к блоку» открывается нужная вкладка ТЗ и якорь.'
                : null}
            </p>
            <p className="text-text-secondary text-[10px] leading-snug">
              Якоря:{' '}
<<<<<<< HEAD
              <span className="font-mono text-[9px] text-slate-700">
                #w2-visuals-sketch-link-fields
              </span>{' '}
              (вкладка «Визуал») ·{' '}
              <span className="font-mono text-[9px] text-slate-700">
                #w2-visuals-sketch-templates
              </span>{' '}
              («Конструкция») ·{' '}
              <span className="font-mono text-[9px] text-slate-700">#w2-visuals-canon-version</span>{' '}
              · <span className="font-mono text-[9px] text-slate-700">#w2-visuals-handoff</span> ·{' '}
              <span className="font-mono text-[9px] text-slate-700">
=======
              <span className="text-text-primary font-mono text-[9px]">
                #w2-visuals-sketch-link-fields
              </span>{' '}
              (вкладка «Визуал») ·{' '}
              <span className="text-text-primary font-mono text-[9px]">
                #w2-visuals-sketch-templates
              </span>{' '}
              («Конструкция») ·{' '}
              <span className="text-text-primary font-mono text-[9px]">
                #w2-visuals-canon-version
              </span>{' '}
              · <span className="text-text-primary font-mono text-[9px]">#w2-visuals-handoff</span>{' '}
              ·{' '}
              <span className="text-text-primary font-mono text-[9px]">
>>>>>>> recover/cabinet-wip-from-stash
                #w2-visuals-sketch-export-surfaces
              </span>
              .
            </p>
          </>
        ) : stripTitle === 'Материалы · дорожная карта' ? (
          <>
<<<<<<< HEAD
            <p className="text-[10px] leading-snug text-slate-600">
=======
            <p className="text-text-secondary text-[10px] leading-snug">
>>>>>>> recover/cabinet-wip-from-stash
              Материалы / BOM: P0 — дельта к образцу/серии, фабричный CSV (колонки), альтернативы и
              статусы замен, комплаенс в хабе; P1 — costing по lineRef и нормы/потери в черновиках
              снабжения и хабе.
            </p>
            <p className="text-text-secondary text-[10px] leading-snug">
              «Уже в коде» — см. строки пункта; «Ещё нет (P0)» — продуктовый пробел.
              {onDossierJump
                ? ' У пунктов с ссылкой «Перейти к блоку» открывается нужная вкладка ТЗ и якорь.'
                : null}
            </p>
            <p className="text-text-secondary text-[10px] leading-snug">
              Якоря:{' '}
<<<<<<< HEAD
              <span className="font-mono text-[9px] text-slate-700">
                #w2-material-sc-drafts-delta
              </span>{' '}
              ·{' '}
              <span className="font-mono text-[9px] text-slate-700">
                #w2-material-bom-factory-export
              </span>{' '}
              ·{' '}
              <span className="font-mono text-[9px] text-slate-700">
                #w2-material-sc-drafts-alts
              </span>{' '}
              · <span className="font-mono text-[9px] text-slate-700">#w2-material-compliance</span>{' '}
              ·{' '}
              <span className="font-mono text-[9px] text-slate-700">
                #w2-material-sc-drafts-costing
              </span>{' '}
              · <span className="font-mono text-[9px] text-slate-700">#w2-material-bom-norms</span>.
=======
              <span className="text-text-primary font-mono text-[9px]">
                #w2-material-sc-drafts-delta
              </span>{' '}
              ·{' '}
              <span className="text-text-primary font-mono text-[9px]">
                #w2-material-bom-factory-export
              </span>{' '}
              ·{' '}
              <span className="text-text-primary font-mono text-[9px]">
                #w2-material-sc-drafts-alts
              </span>{' '}
              ·{' '}
              <span className="text-text-primary font-mono text-[9px]">
                #w2-material-compliance
              </span>{' '}
              ·{' '}
              <span className="text-text-primary font-mono text-[9px]">
                #w2-material-sc-drafts-costing
              </span>{' '}
              ·{' '}
              <span className="text-text-primary font-mono text-[9px]">#w2-material-bom-norms</span>
              .
>>>>>>> recover/cabinet-wip-from-stash
            </p>
          </>
        ) : stripTitle === 'Конструктор · дорожная карта' ? (
          <>
<<<<<<< HEAD
            <p className="text-[10px] leading-snug text-slate-600">
              Конструктор: P0 — один контур мерки ↔ mat/BOM ↔ узлы каталога и метки скетча (хаб
              «Табель мер»; в коде —{' '}
              <span className="rounded bg-slate-100 px-0.5 font-mono text-[9px] text-slate-800">
                sectionReadiness
              </span>
              ,{' '}
              <span className="rounded bg-slate-100 px-0.5 font-mono text-[9px] text-slate-800">
=======
            <p className="text-text-secondary text-[10px] leading-snug">
              Конструктор: P0 — один контур мерки ↔ mat/BOM ↔ узлы каталога и метки скетча (хаб
              «Табель мер»; в коде —{' '}
              <span className="bg-bg-surface2 text-text-primary rounded px-0.5 font-mono text-[9px]">
                sectionReadiness
              </span>
              ,{' '}
              <span className="bg-bg-surface2 text-text-primary rounded px-0.5 font-mono text-[9px]">
>>>>>>> recover/cabinet-wip-from-stash
                GROUP_TO_DOSSIER_SECTION
              </span>
              , mat ↔ sketch ref); P1 — выгрузка узлов/ТК (маршруты вне экрана) и подпись секции.
            </p>
            <p className="text-text-secondary text-[10px] leading-snug">
              «Уже в коде» — см. строки пункта; «Ещё нет (P0)» — продуктовый пробел.
              {onDossierJump
                ? ' У пунктов с ссылкой «Перейти к блоку» открывается нужная вкладка ТЗ и якорь.'
                : null}
            </p>
            <p className="text-text-secondary text-[10px] leading-snug">
              Якоря:{' '}
<<<<<<< HEAD
              <span className="font-mono text-[9px] text-slate-700">#w2-construction-contour</span>{' '}
              ·{' '}
              <span className="font-mono text-[9px] text-slate-700">
                #w2-construction-sketch-hub
              </span>{' '}
              (метки construction/qc) ·{' '}
              <span className="font-mono text-[9px] text-slate-700">#w2-construction-export</span> ·{' '}
              <span className="font-mono text-[9px] text-slate-700">#w2-construction-signoff</span>.
=======
              <span className="text-text-primary font-mono text-[9px]">
                #w2-construction-contour
              </span>{' '}
              ·{' '}
              <span className="text-text-primary font-mono text-[9px]">
                #w2-construction-sketch-hub
              </span>{' '}
              (метки construction/qc) ·{' '}
              <span className="text-text-primary font-mono text-[9px]">
                #w2-construction-export
              </span>{' '}
              ·{' '}
              <span className="text-text-primary font-mono text-[9px]">
                #w2-construction-signoff
              </span>
              .
>>>>>>> recover/cabinet-wip-from-stash
            </p>
          </>
        ) : (
          <p className="text-text-secondary text-[10px] leading-snug">
            {stripTitle?.startsWith('Паспорт')
              ? 'Паспорт: P0 — аудит журнала по критичным полям и сжатые режимы ТЗ (w2view, первичные секции, data-w2-dossier-view); P1 — внешняя read-only ссылка (factory + sketchFloor). «Уже в коде» — хелперы и блоки в хабе; «Перейти к блоку» ведёт на якорь в паспорте.'
              : 'Ниже — приоритизированный бэклог из кода репозитория. Закрытие пунктов поднимает зрелость маршрута SKU; часть уже опирается на существующие поля досье.'}{' '}
            {onDossierJump
              ? 'У пунктов с ссылкой «Перейти к блоку» открывается нужная вкладка ТЗ и якорь.'
              : null}
          </p>
        )}
        <ul className="space-y-2">
          {items.map((row) => (
            <li
              key={row.id}
              className="text-text-primary rounded-md border border-white/60 bg-white/70 px-2 py-1.5 text-[11px] leading-snug shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={cn(
                    'rounded border px-1 py-0 text-[8px] font-black uppercase tracking-wide',
                    row.priority === 'P0' ? v.badgeP0 : v.badgeP1
                  )}
                >
                  {row.priority}
                </span>
                <span className="text-text-primary font-semibold">{row.title}</span>
              </div>
              {row.infraReady.length > 0 ? (
                <p className={cn('mt-1 text-[9px] leading-snug', v.infra)}>
                  Уже в коде: {row.infraReady.join(' · ')}
                </p>
              ) : null}
              {row.priority === 'P0' && row.productGapP0 && row.productGapP0.length > 0 ? (
                <p className="mt-1 text-[9px] leading-snug text-amber-900/90">
                  Ещё нет (P0): {row.productGapP0.join(' ')}
                </p>
              ) : null}
              {row.dossierJump && onDossierJump ? (
                <button
                  type="button"
                  className={cn(
                    'mt-1 block w-fit text-left text-[9px] font-semibold underline-offset-2 hover:underline',
                    v.trigger
                  )}
                  onClick={() => {
                    const j = row.dossierJump;
                    if (j) onDossierJump(j.section, j.anchorId);
                  }}
                >
                  Перейти к блоку →
                </button>
              ) : null}
            </li>
          ))}
        </ul>
        {footer ? (
<<<<<<< HEAD
          <div className="mt-2 border-t border-slate-200/70 pt-2 text-[10px] text-slate-600">
            <p className="mb-1.5 font-semibold uppercase tracking-wide text-slate-500">
=======
          <div className="border-border-default/70 text-text-secondary mt-2 border-t pt-2 text-[10px]">
            <p className="text-text-secondary mb-1.5 font-semibold uppercase tracking-wide">
>>>>>>> recover/cabinet-wip-from-stash
              Связанные секции
            </p>
            {footer}
          </div>
        ) : null}
      </CollapsibleContent>
    </Collapsible>
  );
}
