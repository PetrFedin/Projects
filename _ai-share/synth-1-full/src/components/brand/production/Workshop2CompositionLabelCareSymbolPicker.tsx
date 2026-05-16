'use client';

import { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { compositionLabelCareSymbolIdsAfterToggle } from '@/lib/production/workshop2-composition-label-constructor';
import {
  W2_COMPOSITION_LABEL_CARE_GROUP_LABELS,
  W2_COMPOSITION_LABEL_CARE_GROUP_ORDER,
  W2_COMPOSITION_LABEL_CARE_SYMBOL_CATALOG,
} from '@/lib/production/workshop2-composition-label-spec-constants';
import type { Workshop2CompositionLabelSpec } from '@/lib/production/workshop2-dossier-phase1.types';

function patchSpec(
  prev: Workshop2CompositionLabelSpec | undefined,
  patch: Partial<Workshop2CompositionLabelSpec>
): Workshop2CompositionLabelSpec {
  return { ...(prev ?? {}), ...patch };
}

export function Workshop2CompositionLabelCareSymbolPicker({
  spec,
  onChange,
  readOnly,
  titleAlert = false,
  embedded = false,
}: {
  spec: Workshop2CompositionLabelSpec | undefined;
  onChange: (next: Workshop2CompositionLabelSpec) => void;
  readOnly: boolean;
  /** Включён ТЗ по уходу, данных нет — закрыть руками. */
  titleAlert?: boolean;
  /** Без заголовка «Блок Б» — заголовок задаёт карточка шага. */
  embedded?: boolean;
}) {
  const ro = readOnly;
  const s = spec ?? {};
  const selected = new Set(s.careSymbolIds ?? []);
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <div className="space-y-2">
      {!embedded ? (
        <>
          <p
            className={cn(
              'text-xs font-semibold uppercase tracking-wide',
              titleAlert ? 'text-red-600' : 'text-text-primary'
            )}
          >
            Блок Б: уход (пиктограммы ISO 3758)
          </p>
          <p className="text-text-secondary text-[11px] leading-snug">
            Нажмите вариант в каждой группе — на бирку попадёт одна семантика из группы (взаимоисключение).
            Пиктограммы — ч/б ориентиры по справочнику{' '}
            <a
              href="https://furtek.ru/znachki-po-uhodu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-primary underline-offset-2 hover:underline"
            >
              Furtek
            </a>{' '}
            (ISO 3758); для тиража используйте официальный вектор у поставщика бирок.
          </p>
        </>
      ) : (
        <p className={cn('text-text-secondary text-xs leading-snug', titleAlert ? 'text-red-600' : '')}>
          В каждой группе — один вариант; для тиража сверяйте знаки с официальным набором.
        </p>
      )}

      <Collapsible open={guideOpen} onOpenChange={setGuideOpen}>
        <CollapsibleTrigger
          type="button"
          className="text-text-muted hover:text-text-secondary flex min-h-9 w-full items-center justify-between gap-2 rounded-md border border-dashed border-neutral-200 bg-neutral-50/80 px-2 py-2 text-left text-xs transition-colors"
        >
          <span>Справка: пять групп и перечёркивание</span>
          <LucideIcons.ChevronDown
            className={cn('h-3.5 w-3.5 shrink-0 transition-transform', guideOpen && 'rotate-180')}
            aria-hidden
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="text-text-secondary space-y-2 border-l-2 border-neutral-200 pl-3 pt-2 text-[11px] leading-snug">
          <p>
            На вшивных бирках знаки ухода по{' '}
            <span className="text-text-primary font-medium">ISO 3758</span> обычно группируют так:
          </p>
          <ul className="list-disc space-y-1 pl-4">
            <li>
              <span className="text-text-primary font-medium">Стирка</span> (чаша с водой) — температура (30°C,
              40°C), деликатный или ручной режим.
            </li>
            <li>
              <span className="text-text-primary font-medium">Отбеливание</span> (треугольник) — разрешено или
              запрещено; перечёркнутый значок означает запрет.
            </li>
            <li>
              <span className="text-text-primary font-medium">Глажка</span> (утюг) — число точек внутри задаёт
              допустимый нагрев подошвы (1 — низкий, 3 — высокий).
            </li>
            <li>
              <span className="text-text-primary font-medium">Сушка</span> (квадрат) — барабан, вертикальная
              сушка, тень / без нагрева и т.п.
            </li>
            <li>
              <span className="text-text-primary font-medium">Химчистка</span> (круг) — буквы внутри (P, F, W…)
              указывают допустимые растворители и процесс.
            </li>
          </ul>
          <p>
            Рядом с уходом на бирке размещают <span className="text-text-primary font-medium">состав</span> в
            процентах по волокнам, <span className="text-text-primary font-medium">размер</span> изделия и при
            необходимости <span className="text-text-primary font-medium">логотип</span>.{' '}
            <span className="text-text-primary font-medium">Перечёркнутый</span> символ — нельзя выполнять это
            воздействие (стирка, отжим, глажка и т.д.).
          </p>
          <p>
            Отдельно оформляют маркировку соответствия (например <span className="font-medium">EAC</span> / знаки
            РСТ) — это не заменяет блок ухода по ISO.
          </p>
          <p className="text-text-muted text-[10px]">
            Жаккард / тканые этикетки часто заказывают от минимального тиража (типично от 100 шт.) — параметры
            уточняйте у поставщика бирок.
          </p>
        </CollapsibleContent>
      </Collapsible>

      <div className="space-y-3">
        {W2_COMPOSITION_LABEL_CARE_GROUP_ORDER.map((group) => {
          const inGroup = W2_COMPOSITION_LABEL_CARE_SYMBOL_CATALOG.filter((c) => c.group === group);
          return (
            <div key={group} className="space-y-1.5">
              <p className="text-xs font-medium text-text-primary">
                {W2_COMPOSITION_LABEL_CARE_GROUP_LABELS[group]}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {inGroup.map((sym) => {
                  const on = selected.has(sym.id);
                  return (
                    <button
                      key={sym.id}
                      type="button"
                      disabled={ro}
                      title={`${sym.label} — ${sym.hint}`}
                      onClick={() => {
                        const nextIds = compositionLabelCareSymbolIdsAfterToggle(
                          s.careSymbolIds,
                          sym.id,
                          !on
                        );
                        onChange(patchSpec(s, { careSymbolIds: nextIds }));
                      }}
                      className={cn(
                        'flex min-h-[5.5rem] flex-col items-center gap-1 rounded-md border p-1.5 text-center transition-colors',
                        on
                          ? 'border-sky-500 bg-sky-50 text-sky-950 shadow-sm'
                          : 'border-border-subtle bg-white text-text-secondary hover:border-sky-300/80 hover:bg-sky-50/40',
                        ro && 'pointer-events-none opacity-60'
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sym.iconUrl}
                        alt=""
                        width={36}
                        height={36}
                        loading="lazy"
                        decoding="async"
                        className="h-9 w-9 shrink-0 object-contain grayscale contrast-125"
                      />
                      <span className="text-text-primary line-clamp-3 text-[9px] font-medium leading-tight">
                        {sym.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
