'use client';

import type { ReactNode } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { WorkshopPassportTzPhase } from '@/lib/production/workshop2-passport-check';
import { W2_VISUALS_SKETCH_ANCHOR_ID } from '@/lib/production/workshop2-material-bom-sketch-strip';

/** Якоря подстраницы «Визуал» (совпадают с `W2_VISUAL_SUBPAGE_ANCHORS`, кроме скетча — он в конструкции). */
export const W2_VISUAL_TZ_SUBNAV_ITEMS = [
  { id: 'w2-visuals-hub', label: 'Согласование' },
  { id: 'w2-visuals-checklist', label: 'Чеклист' },
  { id: 'w2-visuals-canon-version', label: 'Канон' },
  { id: 'w2-visuals-attributes', label: 'Поля каталога' },
  { id: 'w2-visuals-refs', label: 'Референсы' },
  { id: W2_VISUALS_SKETCH_ANCHOR_ID, label: 'Скетчи' },
] as const;

export type Workshop2VisualsTzStickySubnavProps = {
  activeAnchorId: string | null;
  onNavigate: (anchorId: string) => void;
  checklistDone: number;
  checklistTotal: number;
  catalogFieldDone: number;
  catalogFieldTotal: number;
  referenceCount: number;
  sketchPinTotal: number;
  sketchHasSubstrate: boolean;
  sketchGateOk: boolean;
  visualGateOpenCount: number;
  /** Рефы с незакрытыми комментариями (resolved). */
  openRefThreadCount?: number;
  /** К пульсу артикула (как в паспорте и материалах). */
  onJumpToPulse?: () => void;
  tzPhase?: WorkshopPassportTzPhase;
  /** Доля готовности секции «Визуал» по строкам текущего шага ТЗ (как в сайдбаре). */
  sectionReadinessPct: number;
  /** Метки без обязательных связей (master + листы) — бейдж у «Скетчи» (редактор на вкладке «Конструкция»). */
  sketchPinLinkIssueCount?: number;
  /** Быстрый переход на вкладки маршрута (посадка, ОТК, снабжение). */
  routeHandoffActions?: readonly { id: string; label: string; onClick: () => void }[];
  /** Блок #w2-visuals-sketch-export-surfaces в хабе согласования на «Визуале». */
  showSketchExportSurfacesNav?: boolean;
  /** Блок #w2-visuals-sketch-link-fields — поля связи метки на «Визуале». */
  showSketchLinkFieldsNav?: boolean;
  /** Кнопка «Шаблоны» ведёт на #w2-visuals-sketch-templates в «Конструкция» → «Табель мер» (не в DOM вкладки «Визуал»). */
  showSketchTemplatesNav?: boolean;
  /** Якорь w2-visuals-handoff — блок передачи в маршрут (рядом с каноном). */
  showVisualHandoffNav?: boolean;
};

const SKETCH_EXPORT_SURFACES_ANCHOR = 'w2-visuals-sketch-export-surfaces';
const SKETCH_LINK_FIELDS_ANCHOR = 'w2-visuals-sketch-link-fields';
const SKETCH_TEMPLATES_ANCHOR = 'w2-visuals-sketch-templates';
const VISUAL_HANDOFF_ANCHOR = 'w2-visuals-handoff';

/**
 * Липкая навигация по подразделам «Визуал / эскиз» в ТЗ (метрики + контур + aria-current снаружи).
 */
export function Workshop2VisualsTzStickySubnav({
  activeAnchorId,
  onNavigate,
  checklistDone,
  checklistTotal,
  catalogFieldDone,
  catalogFieldTotal,
  referenceCount,
  sketchPinTotal,
  sketchHasSubstrate,
  sketchGateOk,
  visualGateOpenCount,
  openRefThreadCount = 0,
  onJumpToPulse,
  tzPhase = '1',
  sectionReadinessPct,
  sketchPinLinkIssueCount = 0,
  routeHandoffActions,
  showSketchExportSurfacesNav = false,
  showSketchLinkFieldsNav = false,
  showSketchTemplatesNav = false,
  showVisualHandoffNav = false,
}: Workshop2VisualsTzStickySubnavProps) {
  return (
    <div
      className="border-border-default/90 sticky top-0 z-30 -mx-1 flex flex-wrap items-center gap-1.5 rounded-lg border bg-white/95 px-2 py-2 shadow-sm backdrop-blur-sm sm:gap-1 sm:py-1.5"
      role="navigation"
      aria-label="Подразделы «Визуал / эскиз»"
    >
      <span
        className="text-text-muted flex w-full flex-wrap items-center gap-1 pl-0.5 text-[9px] font-bold uppercase tracking-wide sm:w-auto sm:pr-1"
        title="Контур «Визуал / эскиз» и готовность полей секции на текущем шаге ТЗ"
      >
        <span>Визуал</span>
        {tzPhase !== '1' ? (
          <span className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary rounded border px-1 py-0 text-[8px] font-black normal-case tracking-wide">
            Шаг {tzPhase}
          </span>
        ) : null}
        <span
          className={cn(
            'normal-case tabular-nums',
            visualGateOpenCount === 0 ? 'text-emerald-600' : 'text-amber-700'
          )}
        >
          {visualGateOpenCount === 0 ? '· контур OK' : `· открыто ${visualGateOpenCount}`}
        </span>
        <span className="text-text-muted font-normal normal-case">(~{sectionReadinessPct}%)</span>
      </span>
      {W2_VISUAL_TZ_SUBNAV_ITEMS.map((x) => {
        let navTitle: string | undefined;
        let navSuffix: ReactNode = null;
        if (x.id === 'w2-visuals-hub') {
          navTitle = `Чеклист готовности визуала: ${checklistDone} из ${checklistTotal}`;
          navSuffix = (
            <span
              className={cn(
                'ml-1 text-[9px] font-bold tabular-nums',
                checklistDone >= checklistTotal ? 'text-emerald-600' : 'text-accent-primary'
              )}
            >
              {checklistDone}/{checklistTotal}
            </span>
          );
        } else if (x.id === 'w2-visuals-canon-version') {
          navTitle = 'Канон скетча и журнал версий визуала';
        } else if (x.id === 'w2-visuals-checklist') {
          navTitle = `Детальный чеклист: ${checklistDone} из ${checklistTotal}`;
          navSuffix = (
            <span
              className={cn(
                'ml-1 text-[9px] font-bold tabular-nums',
                checklistDone >= checklistTotal ? 'text-emerald-600' : 'text-accent-primary'
              )}
            >
              {checklistDone}/{checklistTotal}
            </span>
          );
        } else if (x.id === 'w2-visuals-attributes' && catalogFieldTotal > 0) {
          navTitle = `Поля каталога в «Визуал»: ${catalogFieldDone} из ${catalogFieldTotal}`;
          navSuffix = (
            <span
              className={cn(
                'ml-1 text-[9px] font-bold tabular-nums',
                catalogFieldDone >= catalogFieldTotal ? 'text-emerald-600' : 'text-accent-primary'
              )}
            >
              {catalogFieldDone}/{catalogFieldTotal}
            </span>
          );
        } else if (x.id === 'w2-visuals-refs') {
          navTitle =
            referenceCount > 0
              ? `Референсов: ${referenceCount}${openRefThreadCount > 0 ? ` · открытых тредов: ${openRefThreadCount}` : ''}`
              : 'Референсов пока нет — для контура визуала нужен хотя бы один';
          navSuffix = (
            <span className="ml-1 inline-flex items-center gap-0.5 text-[9px] font-bold tabular-nums">
              <span className={cn(referenceCount > 0 ? 'text-emerald-600' : 'text-amber-600')}>
                {referenceCount}
              </span>
              {openRefThreadCount > 0 ? (
                <span className="text-rose-600" title="Рефы с незакрытыми комментариями">
                  ·{openRefThreadCount}т
                </span>
              ) : null}
            </span>
          );
        } else if (x.id === W2_VISUALS_SKETCH_ANCHOR_ID) {
          navTitle = sketchGateOk
            ? `Подложка или метки: ${sketchPinTotal} меток${sketchHasSubstrate ? ', есть подложка' : ''}`
            : 'Нет подложки и меток на скетче — пункт контура не закрыт';
          navSuffix = (
            <span className="ml-1 inline-flex items-center gap-0.5 text-[9px] font-bold tabular-nums">
              <span className={cn(sketchGateOk ? 'text-emerald-600' : 'text-amber-600')}>
                {sketchPinTotal > 0 ? `${sketchPinTotal}м` : sketchHasSubstrate ? 'фон' : '—'}
              </span>
              {sketchPinLinkIssueCount > 0 ? (
                <span className="text-rose-600" title="Метки без связи с материалом или QC">
                  !{sketchPinLinkIssueCount}
                </span>
              ) : null}
            </span>
          );
        }
        const isCurrent = activeAnchorId === x.id;
        return (
          <Button
            key={x.id}
            type="button"
            variant="outline"
            size="sm"
            aria-current={isCurrent ? 'location' : undefined}
            className={cn(
              'border-border-default text-text-primary min-h-9 min-w-0 bg-white px-2.5 py-1.5 text-[10px] font-medium shadow-none sm:h-7 sm:min-h-0 sm:px-2 sm:py-0',
              isCurrent &&
                'border-accent-primary/30 bg-accent-primary/10 text-accent-primary ring-accent-primary/30 ring-1'
            )}
            onClick={() => onNavigate(x.id)}
            title={navTitle}
          >
            {x.label}
            {navSuffix}
          </Button>
        );
      })}
      {showSketchExportSurfacesNav ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-border-default text-text-primary min-h-9 bg-white px-2.5 py-1.5 text-[10px] font-medium shadow-none sm:h-7 sm:min-h-0 sm:px-2 sm:py-0"
          aria-current={activeAnchorId === SKETCH_EXPORT_SURFACES_ANCHOR ? 'location' : undefined}
          onClick={() => onNavigate(SKETCH_EXPORT_SURFACES_ANCHOR)}
          title="Цех / мерч / комплаенс — что показывать на выгрузке скетча"
        >
          Экспорт
        </Button>
      ) : null}
      {showSketchLinkFieldsNav ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-h-9 border-cyan-200/80 bg-cyan-50/80 px-2.5 py-1.5 text-[10px] font-medium text-cyan-950 shadow-none sm:h-7 sm:min-h-0 sm:px-2 sm:py-0"
          aria-current={activeAnchorId === SKETCH_LINK_FIELDS_ANCHOR ? 'location' : undefined}
          onClick={() => onNavigate(SKETCH_LINK_FIELDS_ANCHOR)}
          title="Поля связи метки: материал, QC, раздел ТЗ"
        >
          Связи
        </Button>
      ) : null}
      {showSketchTemplatesNav ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-border-default text-text-primary min-h-9 bg-white px-2.5 py-1.5 text-[10px] font-medium shadow-none sm:h-7 sm:min-h-0 sm:px-2 sm:py-0"
          aria-current={activeAnchorId === SKETCH_TEMPLATES_ANCHOR ? 'location' : undefined}
          onClick={() => onNavigate(SKETCH_TEMPLATES_ANCHOR)}
          title="Шаблоны меток и библиотека коллекции на общую доску"
        >
          Шаблоны
        </Button>
      ) : null}
      {showVisualHandoffNav ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary min-h-9 px-2.5 py-1.5 text-[10px] font-medium shadow-none sm:h-7 sm:min-h-0 sm:px-2 sm:py-0"
          aria-current={activeAnchorId === VISUAL_HANDOFF_ANCHOR ? 'location' : undefined}
          onClick={() => onNavigate(VISUAL_HANDOFF_ANCHOR)}
          title="Блок передачи визуала в посадку, ОТК или снабжение"
        >
          Передача
        </Button>
      ) : null}
      {routeHandoffActions?.length ? (
        <span className="bg-border-subtle hidden h-4 w-px shrink-0 sm:block" aria-hidden />
      ) : null}
      {routeHandoffActions?.map((a) => (
        <Button
          key={a.id}
          type="button"
          variant="outline"
          size="sm"
          className="border-border-default text-text-primary min-h-9 bg-white px-2.5 py-1.5 text-[10px] font-semibold shadow-none sm:h-7 sm:min-h-0 sm:px-2 sm:py-0"
          onClick={a.onClick}
          title="Открыть вкладку маршрута артикула"
        >
          {a.label}
        </Button>
      ))}
      {onJumpToPulse ? (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary min-h-9 gap-1 px-2.5 py-1.5 text-[10px] font-semibold shadow-none sm:ml-auto sm:h-7 sm:min-h-0 sm:px-2 sm:py-0"
          onClick={onJumpToPulse}
          title="Пульс артикула: SLA, подписи ТЗ"
        >
          <LucideIcons.Activity className="h-3.5 w-3.5 shrink-0" aria-hidden />К пульсу / SLA
        </Button>
      ) : null}
    </div>
  );
}
