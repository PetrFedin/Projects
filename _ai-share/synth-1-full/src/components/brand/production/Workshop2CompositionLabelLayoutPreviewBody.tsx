'use client';

import {
  W2_COMPOSITION_LABEL_CARE_SYMBOL_CATALOG,
  W2_COMPOSITION_LABEL_CARE_SYMBOL_MOCKUP_ABBR,
} from '@/lib/production/workshop2-composition-label-spec-constants';
import {
  compositionLabelCareSymbolGapClass,
  compositionLabelDraftTypographyStyle,
} from '@/lib/production/workshop2-composition-label-typography-style';
import type {
  Workshop2CompositionLabelLayoutElement,
  Workshop2CompositionLabelSpec,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { cn } from '@/lib/utils';

/** Абсолютная раскладка внутри контейнера с `position: relative` и известной высотой (padding-bottom trick). */
export function Workshop2CompositionLabelLayoutPreviewBody({
  spec,
  elements,
  draftText,
  selectedId,
  onSelectElement,
}: {
  spec: Workshop2CompositionLabelSpec;
  elements: Workshop2CompositionLabelLayoutElement[];
  draftText: string;
  selectedId?: string | null;
  onSelectElement?: (id: string) => void;
}) {
  const logoUrl = (spec.compositionLabelLogoDataUrl ?? '').trim();
  const symIds = spec.careSymbolIds ?? [];
  const interactive = Boolean(onSelectElement);
  const bodyRhythm = compositionLabelDraftTypographyStyle(spec);

  return (
    <div className="absolute inset-0">
      {[...elements]
        .sort((a, b) => (a.zIndex ?? 0) - (b.zIndex ?? 0))
        .map((el) => {
          const sel = el.elementId === selectedId;
          const rot = el.rotationDeg ?? 0;
          const commonStyle = {
            left: `${el.xPct}%`,
            top: `${el.yPct}%`,
            width: `${el.wPct}%`,
            height: `${el.hPct}%`,
            transform: `rotate(${rot}deg)`,
            transformOrigin: 'center center' as const,
            zIndex: sel ? 20 : el.zIndex,
            opacity: (el.opacityPct ?? 100) / 100,
          };
          const commonClass = cn(
            'absolute box-border overflow-hidden rounded-sm border text-left transition-shadow',
            interactive &&
              (sel
                ? 'border-accent-primary z-10 shadow-[0_0_0_2px_rgba(59,130,246,0.35)]'
                : 'border-transparent hover:border-neutral-300')
          );
          const inner = (
            <>
              {el.kind === 'logo' && logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt=""
                  className="h-full w-full object-contain p-0.5"
                  draggable={false}
                />
              ) : null}
              {el.kind === 'logo' && !logoUrl ? (
                <span className="text-text-muted flex h-full items-center justify-center p-1 text-[8px]">
                  Лого (загрузите в блоке бирки)
                </span>
              ) : null}
              {el.kind === 'careStrip' ? (
                <div
                  className={cn(
                    'flex h-full flex-wrap content-center overflow-hidden p-0.5',
                    compositionLabelCareSymbolGapClass(spec)
                  )}
                >
                  {symIds.length ? (
                    symIds.map((id) => {
                      const cat = W2_COMPOSITION_LABEL_CARE_SYMBOL_CATALOG.find((c) => c.id === id);
                      const abbr = W2_COMPOSITION_LABEL_CARE_SYMBOL_MOCKUP_ABBR[id] ?? id;
                      return (
                        <span
                          key={id}
                          title={cat?.label ?? id}
                          className="border-border-default flex shrink-0 items-center justify-center rounded border bg-neutral-100 p-px"
                        >
                          {cat?.iconUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={cat.iconUrl}
                              alt=""
                              width={14}
                              height={14}
                              loading="lazy"
                              decoding="async"
                              className="h-3.5 w-3.5 object-contain grayscale contrast-125"
                            />
                          ) : (
                            <span className="text-[7px] font-medium text-neutral-700">{abbr}</span>
                          )}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-text-muted text-[8px]">Иконки ухода (выберите в бирке)</span>
                  )}
                </div>
              ) : null}
              {el.kind === 'text' ? (
                <div
                  className="h-full overflow-auto whitespace-pre-wrap p-1 text-neutral-800"
                  style={{
                    fontSize: `${el.fontSizePx ?? 11}px`,
                    fontWeight: el.fontWeight === 'bold' ? 700 : 400,
                    textAlign: el.textAlign ?? 'left',
                    lineHeight: bodyRhythm.lineHeight,
                    letterSpacing: bodyRhythm.letterSpacing,
                  }}
                >
                  {draftText || '— текст черновика по данным бирки —'}
                </div>
              ) : null}
            </>
          );

          if (interactive && onSelectElement) {
            return (
              <button
                key={el.elementId}
                type="button"
                className={commonClass}
                style={commonStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectElement(el.elementId);
                }}
              >
                {inner}
              </button>
            );
          }

          return (
            <div key={el.elementId} className={cn(commonClass, 'border-transparent')} style={commonStyle}>
              {inner}
            </div>
          );
        })}
    </div>
  );
}
