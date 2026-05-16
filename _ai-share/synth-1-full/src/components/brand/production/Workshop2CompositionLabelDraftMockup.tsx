'use client';

import { useLayoutEffect, useRef } from 'react';
import { Workshop2CompositionLabelLayoutPreviewBody } from '@/components/brand/production/Workshop2CompositionLabelLayoutPreviewBody';
import {
  W2_COMPOSITION_LABEL_CARE_SYMBOL_CATALOG,
  W2_COMPOSITION_LABEL_CARE_SYMBOL_MOCKUP_ABBR,
  W2_COMPOSITION_LABEL_FONT_PRESETS,
} from '@/lib/production/workshop2-composition-label-spec-constants';
import { ensureCompositionLabelLayoutElements } from '@/lib/production/workshop2-composition-label-layout';
import {
  compositionLabelCareSymbolGapClass,
  compositionLabelDraftTypographyStyle,
} from '@/lib/production/workshop2-composition-label-typography-style';
import type {
  Workshop2CompositionLabelFontPreset,
  Workshop2CompositionLabelSpec,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { cn } from '@/lib/utils';

function fontCssStack(preset: Workshop2CompositionLabelFontPreset | '' | undefined): string {
  const row = W2_COMPOSITION_LABEL_FONT_PRESETS.find((x) => x.id === (preset ?? ''));
  return row?.cssStack ?? 'system-ui, sans-serif';
}

function DraftLine({
  line,
  index,
  readOnly,
  editable,
  className,
  onCommit,
}: {
  line: string;
  index: number;
  readOnly: boolean;
  editable: boolean;
  className?: string;
  onCommit?: (index: number, text: string) => void;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !editable) return;
    if (document.activeElement === el) return;
    const next = line;
    if (el.textContent !== next) el.textContent = next;
  }, [editable, line]);

  if (!editable || readOnly) {
    return (
      <p ref={editable ? ref : undefined} className={className}>
        {line}
      </p>
    );
  }

  return (
    <p
      ref={ref}
      contentEditable
      suppressHydrationWarning
      suppressContentEditableWarning
      className={cn(
        className,
        'rounded-sm outline-none ring-offset-1 focus-visible:ring-1 focus-visible:ring-sky-500/70'
      )}
      onBlur={(e) => onCommit?.(index, (e.currentTarget.textContent ?? '').replace(/\u00a0/g, ' '))}
    />
  );
}

export function Workshop2CompositionLabelDraftMockup({
  spec,
  displayLines,
  readOnly,
  onCommitLine,
}: {
  spec: Workshop2CompositionLabelSpec | undefined;
  displayLines: string[];
  readOnly: boolean;
  /** Редактирование строк на макете записывает полный текст в `draftTextManual`. */
  onCommitLine?: (lineIndex: number, text: string) => void;
}) {
  const s = spec ?? {};
  const wMm = parseFloat(String(s.labelWidthMm ?? '').replace(',', '.'));
  const hMm = parseFloat(String(s.labelHeightMm ?? '').replace(',', '.'));
  const ratio =
    Number.isFinite(wMm) && Number.isFinite(hMm) && wMm > 0 && hMm > 0 ? `${(hMm / wMm) * 100}%` : '56.25%';

  const bodyPt = parseFloat(String(s.typographyBodyPt ?? '9').replace(',', '.'));
  const fontPx = Number.isFinite(bodyPt) ? `${Math.max(6, bodyPt) * 1.33}px` : '11px';

  const logoUrl = (s.compositionLabelLogoDataUrl ?? '').trim();
  const symIds = s.careSymbolIds ?? [];
  const layered = (s.layoutElements?.length ?? 0) > 0;
  const layoutElements = layered ? ensureCompositionLabelLayoutElements(s.layoutElements) : null;
  const canEditLines = !readOnly && Boolean(onCommitLine) && !layered;
  const printOnReverse = Boolean(s.printOnReverse);
  const reverseLines = (s.reverseFaceLines ?? '')
    .split(/\r?\n/)
    .map((ln) => ln.replace(/\u00a0/g, ' '));
  const hasReverseText = reverseLines.some((ln) => ln.trim());
  const bodyRhythm = compositionLabelDraftTypographyStyle(s);

  const faceShellClass = cn(
    'border-border-default relative mx-auto w-full max-w-sm rounded-md border-2 border-dashed bg-neutral-50 p-2',
    s.showTrimBleedInDraft ? 'border-amber-500/80' : ''
  );

  const faceInner = (
    <div
      className="border-border-default relative w-full overflow-hidden rounded border bg-white shadow-inner"
      style={{ paddingBottom: ratio }}
    >
      {s.showTrimMarksOnDraft ? (
        <div
          className="pointer-events-none absolute inset-0 z-[15] text-neutral-400"
          aria-hidden
        >
          <span className="absolute left-0.5 top-0.5 block h-2 w-2 border-l-2 border-t-2 border-current" />
          <span className="absolute right-0.5 top-0.5 block h-2 w-2 border-r-2 border-t-2 border-current" />
          <span className="absolute bottom-0.5 left-0.5 block h-2 w-2 border-b-2 border-l-2 border-current" />
          <span className="absolute bottom-0.5 right-0.5 block h-2 w-2 border-b-2 border-r-2 border-current" />
        </div>
      ) : null}
      {s.showEacPlaceholderOnDraft ? (
        <div
          className="pointer-events-none absolute right-1 top-1 z-[16] rounded border border-neutral-400 bg-white/95 px-1 py-px font-mono text-[7px] font-bold text-neutral-700 shadow-sm"
          aria-hidden
        >
          EAC
        </div>
      ) : null}
      {layered && layoutElements ? (
        <div
          className="absolute inset-0"
          style={{
            fontFamily: fontCssStack(s.typographyFontPreset),
            fontSize: fontPx,
            lineHeight: bodyRhythm.lineHeight,
            letterSpacing: bodyRhythm.letterSpacing,
          }}
        >
          <Workshop2CompositionLabelLayoutPreviewBody
            spec={s}
            elements={layoutElements}
            draftText={displayLines.join('\n')}
          />
        </div>
      ) : null}
      {!layered ? (
        <div
          className="absolute inset-0 flex flex-col overflow-auto p-2 text-[10px] text-neutral-800"
          style={{
            fontFamily: fontCssStack(s.typographyFontPreset),
            fontSize: fontPx,
            lineHeight: bodyRhythm.lineHeight,
            letterSpacing: bodyRhythm.letterSpacing,
          }}
        >
          {logoUrl ? (
            <div className="mb-1.5 flex shrink-0 justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Логотип на бирке (черновик)"
                className="max-h-[min(22%,4.5rem)] max-w-[min(40%,9rem)] object-contain"
                title="Пропорции на макете ориентировочные; финал — в типографии."
              />
            </div>
          ) : null}

          {symIds.length > 0 ? (
            <div className={cn('mb-1.5 flex flex-wrap', compositionLabelCareSymbolGapClass(s))}>
              {symIds.map((id) => {
                const cat = W2_COMPOSITION_LABEL_CARE_SYMBOL_CATALOG.find((c) => c.id === id);
                const abbr = W2_COMPOSITION_LABEL_CARE_SYMBOL_MOCKUP_ABBR[id] ?? id;
                return (
                  <span
                    key={id}
                    title={cat?.label ?? id}
                    className="border-border-default flex shrink-0 items-center justify-center rounded border bg-neutral-100 px-0.5 py-0.5"
                  >
                    {cat?.iconUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cat.iconUrl}
                        alt=""
                        width={20}
                        height={20}
                        loading="lazy"
                        decoding="async"
                        className="h-5 w-5 object-contain grayscale contrast-125"
                      />
                    ) : (
                      <span className="text-[8px] font-medium text-neutral-700">{abbr}</span>
                    )}
                  </span>
                );
              })}
            </div>
          ) : null}

          <div className="min-h-0 flex-1">
            {displayLines.map((line, i) => {
              const sectionHdr = line.startsWith('— ');
              const compositionHdr = (l: string) =>
                l.startsWith('— Сырьевой') || l.startsWith('— Состав');
              const fiberSection = compositionHdr(line);
              const careSection = line.startsWith('— Уход');
              const mfrSection =
                line.startsWith('— Производитель') || line.startsWith('— Низ бирки');
              const boldFiber =
                Boolean(s.typographyBoldFiberBlock) &&
                !sectionHdr &&
                i > 0 &&
                (() => {
                  for (let j = i - 1; j >= 0; j--) {
                    const l = displayLines[j];
                    if (l.startsWith('— ')) return compositionHdr(l);
                  }
                  return false;
                })();
              const boldCare =
                Boolean(s.typographyBoldCareBlock) &&
                !sectionHdr &&
                i > 0 &&
                (() => {
                  for (let j = i - 1; j >= 0; j--) {
                    const l = displayLines[j];
                    if (l.startsWith('— ')) return l.startsWith('— Уход');
                  }
                  return false;
                })();
              return (
                <DraftLine
                  key={`ln-${i}`}
                  line={line}
                  index={i}
                  readOnly={readOnly}
                  editable={canEditLines}
                  onCommit={onCommitLine}
                  className={cn(
                    'mb-0.5',
                    sectionHdr ? 'font-semibold text-neutral-600' : '',
                    fiberSection || careSection || mfrSection ? 'text-neutral-700' : '',
                    boldFiber || boldCare ? 'font-bold' : ''
                  )}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );

  const reverseInner = (
    <div
      className="border-border-default relative w-full overflow-hidden rounded border bg-white shadow-inner"
      style={{ paddingBottom: ratio }}
    >
      <div
        className="absolute inset-0 overflow-auto p-2 text-[10px] leading-snug text-neutral-800"
        style={{
          fontFamily: fontCssStack(s.typographyFontPreset),
          fontSize: fontPx,
        }}
      >
        {hasReverseText ? (
          <div className="whitespace-pre-wrap">
            {reverseLines.map((line, i) => (
              <p key={`rv-${i}`} className="mb-0.5">
                {line || '\u00a0'}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-text-muted italic">
            Текст оборота не заполнен — укажите в поле «Текст для оборота» в блоке макета.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <p className="text-text-primary mb-1 text-xs font-medium">
        {printOnReverse
          ? 'Визуальные черновики: лицо и оборот (мм; шрифт — блок выше или в редакторе оформления)'
          : 'Визуальный черновик (мм; шрифт — блок выше или в редакторе оформления)'}
      </p>
      <div
        className={cn(
          'mx-auto w-full',
          printOnReverse ? 'grid max-w-4xl gap-3 sm:grid-cols-2' : 'max-w-sm'
        )}
      >
        <div className="min-w-0">
          {printOnReverse ? (
            <div className="mb-1.5 space-y-0.5">
              <p className="text-text-primary text-xs font-medium">Лицо</p>
              <p className="text-text-secondary text-xs leading-snug">
                {layered
                  ? 'Раскладка по %: лого, полоса ухода, основной текст черновика (как в редакторе оформления).'
                  : 'Логотип (если загружен), значки ухода, затем строки черновика: состав, уход, производитель, низ бирки.'}
              </p>
            </div>
          ) : null}
          <div className={faceShellClass}>{faceInner}</div>
        </div>
        {printOnReverse ? (
          <div className="min-w-0">
            <div className="mb-1.5 space-y-0.5">
              <p className="text-text-primary text-xs font-medium">Оборот</p>
              <p className="text-text-secondary text-xs leading-snug">
                Только поле «Текст для оборота»: доп. уход, состав подкладки, EAC, юр. строки второй стороны
                (редактирование — в форме выше, не на макете).
              </p>
            </div>
            <div
              className={cn(
                'border-border-default relative mx-auto w-full max-w-sm rounded-md border-2 border-dashed border-neutral-300/90 bg-neutral-100/80 p-2',
                s.showTrimBleedInDraft ? 'border-amber-500/80' : ''
              )}
            >
              {reverseInner}
            </div>
          </div>
        ) : null}
      </div>
      {(s.labelWidthMm ?? '').trim() || (s.labelHeightMm ?? '').trim() ? (
        <p className="text-text-muted mt-1 text-[10px]">
          Габариты {printOnReverse ? 'каждой стороны' : 'макета'}: {(s.labelWidthMm ?? '').trim() || '—'} ×{' '}
          {(s.labelHeightMm ?? '').trim() || '—'} мм
        </p>
      ) : null}
    </div>
  );
}
