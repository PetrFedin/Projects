'use client';

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Workshop2HandbookMultiSelectPopover as HandbookMultiSelectPopover } from '@/components/brand/production/Workshop2HandbookMultiSelectPopover';
import {
  WORKSHOP_FIELD_LABEL_CLASS,
  WorkshopAttributeHintIcon,
} from '@/components/brand/production/WorkshopFieldHints';
import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import {
  resolveEffectiveParametersForLeaf,
  type ResolvedPhase1AttributeRow,
} from '@/lib/production/attribute-catalog';
import { collectColorBundlePaletteNeedles } from '@/lib/production/workshop2-color-bundle-palette-needles';
import { phase1FieldSatisfiedForUi } from '@/lib/production/w2-dossier-field-presentation';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import { resolvedHandbookDisplayLabel } from '@/lib/production/workshop2-resolved-handbook-display-label';
import { extractHex6, extractTwoHexesFromCss } from '@/lib/production/workshop2-passport-color-hex';
import { normalizeRuColorMatch } from '@/lib/production/workshop2-passport-color-normalize';
import { partitionHandbookAndFree, partitionValues } from '@/lib/production/workshop2-phase1-attribute-partition';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { cn } from '@/lib/utils';

const WORKSHOP_REQUIRED_BADGE_TODO_CLASS =
  'text-[9px] font-semibold text-orange-900 bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5';
const WORKSHOP_REQUIRED_BADGE_DONE_CLASS =
  'text-[9px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5';

const W2_TZ_ATTR_NAME_OVERRIDE: Record<string, string> = {
  garmentLengthApparelOptions: 'Длина изделия',
  draperyOptionsByCategory: 'Драпировка и складки',
  decorOptionsByCategory: 'Декор',
  patternOptionsByCategory: 'Узор',
  colorReferenceSystemOptions: 'Референс цвета',
};

function w2TzAttributeDisplayName(attr: AttributeCatalogAttribute): string {
  if (W2_TZ_ATTR_NAME_OVERRIDE[attr.attributeId]) return W2_TZ_ATTR_NAME_OVERRIDE[attr.attributeId]!;
  const n = attr.name
    .replace(/^\s*Конструкция\s*[·:]\s*/i, '')
    .replace(/^\s*Конструкция\s+/i, '');
  return n.trim() || attr.name;
}

export function AttributeRowEditor({
  attribute,
  dossier,
  allowMultiHandbook,
  onSetHandbookParameters,
  onFreeTextSide,
  patchColor,
}: {
  attribute: AttributeCatalogAttribute;
  dossier: Workshop2DossierPhase1;
  allowMultiHandbook: boolean;
  onSetHandbookParameters: (
    attributeId: string,
    parts: { parameterId: string; displayLabel: string }[]
  ) => void;
  onFreeTextSide: (attributeId: string, text: string) => void;
  patchColor?: (u: {
    handbook?: { parameterId: string; displayLabel: string } | null;
    freeText?: string;
  }) => void;
}) {
  const handbookParts = useMemo(() => {
    const assign = dossier.assignments.find(
      (x) => x.kind === 'canonical' && x.attributeId === attribute.attributeId
    );
    const { hbs: list } = partitionHandbookAndFree(assign);
    const aid = attribute.attributeId;
    return list.map((v) => ({
      parameterId: v.parameterId!,
      displayLabel: resolvedHandbookDisplayLabel(aid, v.parameterId!, v.displayLabel),
    }));
  }, [dossier.assignments, attribute.attributeId]);

  const sortedParams = useMemo(
    () => [...attribute.parameters].sort((x, y) => x.sortOrder - y.sortOrder),
    [attribute.parameters]
  );

  const selectOptions = useMemo(() => {
    const assign = dossier.assignments.find(
      (x) => x.kind === 'canonical' && x.attributeId === attribute.attributeId
    );
    const { hbs: hbList } = partitionHandbookAndFree(assign);
    const list = [...sortedParams];
    for (const v of hbList) {
      const pid = v.parameterId;
      if (pid && !list.some((p) => p.parameterId === pid)) {
        list.unshift({
          parameterId: pid,
          label: v.displayLabel || pid,
          sortOrder: -1,
        });
      }
    }
    return list;
  }, [sortedParams, dossier.assignments, attribute.attributeId]);

  if (attribute.attributeId === 'color' && patchColor) {
    return <ColorAttributeRow attribute={attribute} dossier={dossier} patchColor={patchColor} />;
  }

  const a = dossier.assignments.find(
    (x) => x.kind === 'canonical' && x.attributeId === attribute.attributeId
  );
  const { hbs, ft } = partitionHandbookAndFree(a);
  const freeStr = ft?.text ?? '';

  if (attribute.type === 'text') {
    return (
      <Input
        className="h-9 w-full min-w-0 text-sm"
        value={freeStr}
        onChange={(e) => onFreeTextSide(attribute.attributeId, e.target.value)}
        placeholder={attribute.uiPlaceholder ?? 'Свой текст'}
      />
    );
  }

  if (allowMultiHandbook) {
    const optList = selectOptions.map((p) => ({ parameterId: p.parameterId, label: p.label }));
    return (
      <div className="grid gap-2 sm:grid-cols-2 sm:items-start sm:gap-3">
        <HandbookMultiSelectPopover
          options={optList}
          parts={handbookParts}
          catalogAttributeId={attribute.attributeId}
          resolveDisplayLabel={resolvedHandbookDisplayLabel}
          onPartsChange={(parts) => onSetHandbookParameters(attribute.attributeId, parts)}
        />
        <Input
          className="h-9 min-w-0 text-sm"
          value={freeStr}
          onChange={(e) => onFreeTextSide(attribute.attributeId, e.target.value)}
          placeholder={attribute.uiPlaceholder ?? 'Свой текст'}
        />
      </div>
    );
  }

  const currentPid = hbs[0]?.parameterId ?? '';

  return (
    <div className="grid gap-2 sm:grid-cols-2 sm:items-start">
      <select
        className="border-border-default text-text-primary h-9 w-full min-w-0 rounded-md border bg-white px-2 text-sm"
        value={currentPid}
        onChange={(e) => {
          const pid = e.target.value;
          const p = attribute.parameters.find((x) => x.parameterId === pid);
          onSetHandbookParameters(
            attribute.attributeId,
            pid && p ? [{ parameterId: pid, displayLabel: p.label }] : []
          );
        }}
      >
        <option value="">Не выбрано из справочника</option>
        {selectOptions.map((p) => (
          <option key={p.parameterId} value={p.parameterId}>
            {p.label}
          </option>
        ))}
      </select>
      <Input
        className="h-9 min-w-0 text-sm"
        value={freeStr}
        onChange={(e) => onFreeTextSide(attribute.attributeId, e.target.value)}
        placeholder={attribute.uiPlaceholder ?? 'Свой текст'}
      />
    </div>
  );
}

function ColorAttributeRow({
  attribute,
  dossier,
  patchColor,
  paletteCrossNeedles,
}: {
  attribute: AttributeCatalogAttribute;
  dossier: Workshop2DossierPhase1;
  patchColor: (u: {
    handbook?: { parameterId: string; displayLabel: string } | null;
    freeText?: string;
  }) => void;
  /** Сузить палитру по токенам из основной группы и референса (паспорт). */
  paletteCrossNeedles?: string[];
}) {
  const a = dossier.assignments.find(
    (x) => x.kind === 'canonical' && x.attributeId === attribute.attributeId
  );
  const { hb, ft } = partitionValues(a);
  const currentPid = hb?.parameterId ?? '';
  const freeStr = ft?.text ?? '';

  const sorted = useMemo(
    () => [...attribute.parameters].sort((x, y) => x.sortOrder - y.sortOrder),
    [attribute.parameters]
  );

  const [gradA, setGradA] = useState('#6366f1');
  const [gradB, setGradB] = useState('#ec4899');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [palFilter, setPalFilter] = useState('');
  const [ignorePaletteCross, setIgnorePaletteCross] = useState(false);

  useEffect(() => {
    const p = sorted.find((x) => x.parameterId === currentPid);
    if (p?.colorHex) {
      setGradA(p.colorHex);
      setGradB(p.colorHex);
      return;
    }
    if (p?.gradientCss) {
      const pair = extractTwoHexesFromCss(p.gradientCss);
      if (pair) {
        setGradA(pair.a);
        setGradB(pair.b);
        return;
      }
    }
    const t = freeStr.trim();
    if (t.startsWith('linear-gradient')) {
      const pair = extractTwoHexesFromCss(t);
      if (pair) {
        setGradA(pair.a);
        setGradB(pair.b);
      }
    }
  }, [currentPid, freeStr, sorted]);

  const hexFromText = extractHex6(freeStr);
  const colorInputValue = hexFromText ?? gradA;

  const mergeFreeWithHex = (hex: string) => {
    setGradA(hex);
    setGradB(hex);
    const without = freeStr
      .replace(/#([0-9A-Fa-f]{6})\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    patchColor({ freeText: without ? `${hex} · ${without}` : hex });
  };

  const previewCss = freeStr.trim().startsWith('linear-gradient')
    ? freeStr.trim()
    : `linear-gradient(90deg, ${gradA}, ${gradB})`;

  const pickHandbook = (pid: string, label: string) => {
    if (pid && label)
      patchColor({ handbook: { parameterId: pid, displayLabel: label }, freeText: '' });
    else patchColor({ handbook: null, freeText: '' });
  };

  const current = sorted.find((x) => x.parameterId === currentPid);
  const needle = palFilter.trim().toLowerCase();
  const activeCross =
    !ignorePaletteCross && paletteCrossNeedles && paletteCrossNeedles.length > 0
      ? paletteCrossNeedles
      : [];
  const filteredPalette = sorted.filter((p) => {
    const lbNorm = normalizeRuColorMatch(p.label);
    const byName = !needle || lbNorm.includes(normalizeRuColorMatch(needle));
    const byCross =
      activeCross.length === 0 || activeCross.some((n) => n.length >= 2 && lbNorm.includes(n));
    return byName && byCross;
  });

  const summaryLabel = (() => {
    if (currentPid && current) return current.label;
    const t = freeStr.trim();
    if (t.startsWith('linear-gradient')) return 'Свой градиент (сохранён)';
    if (extractHex6(freeStr)) return 'Свой оттенок / текст';
    return 'Выберите цвет из палитры';
  })();

  const summarySwatchStyle: CSSProperties = (() => {
    if (current?.colorHex) return { backgroundColor: current.colorHex };
    if (current?.gradientCss) return { background: current.gradientCss };
    const t = freeStr.trim();
    if (t.startsWith('linear-gradient')) return { background: t };
    const hx = extractHex6(freeStr);
    if (hx) return { backgroundColor: hx };
    return { background: previewCss };
  })();

  const onFreeTextChange = (raw: string) => {
    patchColor({ freeText: raw });
    const t = raw.trim();
    if (!t.startsWith('linear-gradient')) {
      const hx = extractHex6(raw);
      if (hx) {
        setGradA(hx);
        setGradB(hx);
      }
    }
  };

  /** Единый размер «квадратов»: как прежний блок «Свой оттенок» (h-4), +50% → h-6/w-6. */
  const colorWellClass =
    'h-6 w-6 shrink-0 cursor-pointer rounded-md border border-border-default bg-white p-0 box-border';

  /** Превью в квадрате «Свой оттенок»: сплошной или сохранённый linear-gradient из текста. */
  const shadeSwatchStyle: CSSProperties = (() => {
    const t = freeStr.trim();
    if (t.startsWith('linear-gradient')) return { background: t };
    return summarySwatchStyle;
  })();

  /** Секции палитры / оттенка / градиента — без лишних рамок (визуал). */
  const colorSubCard = 'bg-bg-surface2/40 space-y-2 rounded-md p-3 min-w-0';

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:items-start">
        <div className={colorSubCard}>
          <div className="flex items-center gap-1">
            <Label
              className={cn(WORKSHOP_FIELD_LABEL_CLASS, 'text-text-primary')}
              title="Палитра и градиент"
            >
              Палитра и градиент
            </Label>
          </div>
          <div className="min-w-0 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-border-subtle/80">
            <button
              type="button"
              className="hover:bg-bg-surface2/80 flex h-9 w-full items-center gap-2 px-2 text-left text-sm"
              onClick={() => setPaletteOpen((o) => !o)}
            >
              <span
                className="border-border-default h-2.5 w-2.5 shrink-0 rounded-full border shadow-sm"
                style={summarySwatchStyle}
              />
              <span className="text-text-primary min-w-0 flex-1 truncate font-medium leading-none">
                {summaryLabel}
              </span>
              <span className="text-text-muted shrink-0 text-[10px]">{paletteOpen ? '▲' : '▼'}</span>
            </button>
            {paletteOpen ? (
              <div className="border-t border-border-subtle/70 bg-white p-2">
                <Input
                  className="mb-2 h-9 text-sm"
                  placeholder="Фильтр по названию цвета…"
                  value={palFilter}
                  onChange={(e) => setPalFilter(e.target.value)}
                />
                {paletteCrossNeedles && paletteCrossNeedles.length > 0 ? (
                  <button
                    type="button"
                    className="text-text-primary hover:text-text-secondary mb-2 text-left text-[10px] font-semibold underline underline-offset-2"
                    onClick={() => setIgnorePaletteCross((v) => !v)}
                  >
                    {ignorePaletteCross
                      ? 'Сузить список по основной группе и референсу'
                      : 'Показать всю палитру'}
                  </button>
                ) : null}
                <div className="max-h-52 divide-y divide-border-subtle/70 overflow-y-auto rounded-md bg-white">
                  <button
                    type="button"
                    className="hover:bg-bg-surface2 flex h-9 w-full items-center gap-2 px-2 text-left text-sm"
                    onClick={() => {
                      pickHandbook('', '');
                      setPaletteOpen(false);
                      setPalFilter('');
                    }}
                  >
                    <span className="border-border-default bg-bg-surface2 h-2.5 w-2.5 shrink-0 rounded-full border border-dashed" />
                    <span className="text-text-secondary leading-none">
                      Не выбрано из справочника
                    </span>
                  </button>
                  {filteredPalette.map((p) => (
                    <button
                      key={p.parameterId}
                      type="button"
                      className={cn(
                        'hover:bg-bg-surface2 flex h-9 w-full items-center gap-2 px-2 text-left text-sm',
                        currentPid === p.parameterId && 'bg-accent-primary/15'
                      )}
                      onClick={() => {
                        pickHandbook(p.parameterId, p.label);
                        setPaletteOpen(false);
                        setPalFilter('');
                      }}
                    >
                      <span
                        className="border-border-default h-2.5 w-2.5 shrink-0 rounded-full border"
                        style={
                          p.colorHex
                            ? { backgroundColor: p.colorHex }
                            : p.gradientCss
                              ? { background: p.gradientCss }
                              : { background: 'linear-gradient(135deg, #e2e8f0, #94a3b8)' }
                        }
                      />
                      <span className="min-w-0 flex-1 truncate leading-none">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className={colorSubCard}>
          <div className="flex items-center gap-1">
            <Label className={cn(WORKSHOP_FIELD_LABEL_CLASS, 'text-text-primary')}>
              Свой оттенок
            </Label>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <div
              className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-border-subtle/80"
              title="Превью: при сохранённом градиенте показывается полоса; клик — выбор сплошного цвета"
            >
              <div
                className="pointer-events-none absolute inset-0"
                style={shadeSwatchStyle}
                aria-hidden
              />
              <input
                type="color"
                value={colorInputValue}
                onChange={(e) => mergeFreeWithHex(e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="Выбор оттенка"
              />
            </div>
            <Input
              className="h-9 min-w-0 flex-1 text-sm"
              value={freeStr}
              onChange={(e) => onFreeTextChange(e.target.value)}
              placeholder={attribute.uiPlaceholder ?? 'Пантон, RAL, комментарий к цвету…'}
            />
          </div>
        </div>
      </div>

      <div className={cn(colorSubCard, 'w-full')}>
        <div className="flex items-center gap-1">
          <Label className={cn(WORKSHOP_FIELD_LABEL_CLASS, 'text-text-primary')}>
            Свой градиент
          </Label>
        </div>
        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:flex-nowrap">
          <input
            type="color"
            value={gradA}
            onChange={(e) => setGradA(e.target.value)}
            className={colorWellClass}
            aria-label="Цвет начала градиента"
          />
          <span className="text-text-secondary shrink-0 text-[10px]">→</span>
          <input
            type="color"
            value={gradB}
            onChange={(e) => setGradB(e.target.value)}
            className={colorWellClass}
            aria-label="Цвет конца градиента"
          />
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="h-9 w-9 shrink-0"
            aria-label="Записать градиент в цвет"
            title="Записать градиент в цвет"
            onClick={() =>
              patchColor({
                handbook: null,
                freeText: `linear-gradient(90deg, ${gradA}, ${gradB})`,
              })
            }
          >
            <Check className="h-4 w-4" aria-hidden />
          </Button>
          <div
            className="h-9 min-h-9 min-w-0 flex-1 rounded-md bg-bg-surface2/50 shadow-inner ring-1 ring-inset ring-border-subtle/50"
            style={{ background: previewCss }}
            title="Превью градиента"
          />
        </div>
      </div>
    </div>
  );
}

export function WorkshopPassportColorBundle({
  bundleRows,
  dossier,
  currentLeaf,
  phase,
  allowMultiHandbook,
  patchColor,
  showAttributeHintIcons = false,
  onSetHandbookParameters,
  onFreeTextSide,
  listItemClassName,
}: {
  bundleRows: ResolvedPhase1AttributeRow[];
  dossier: Workshop2DossierPhase1;
  currentLeaf: HandbookCategoryLeaf;
  phase: '1' | '2' | '3';
  allowMultiHandbook: boolean;
  patchColor: (u: {
    handbook?: { parameterId: string; displayLabel: string } | null;
    freeText?: string;
  }) => void;
  onSetHandbookParameters: (
    attributeId: string,
    parts: { parameterId: string; displayLabel: string }[]
  ) => void;
  onFreeTextSide: (attributeId: string, text: string) => void;
  showAttributeHintIcons?: boolean;
  listItemClassName?: string;
}) {
  const primary = bundleRows.find((r) => r.attribute.attributeId === 'primaryColorFamilyOptions');
  const refRow = bundleRows.find((r) => r.attribute.attributeId === 'colorReferenceSystemOptions');
  const colorRow = bundleRows.find((r) => r.attribute.attributeId === 'color');

  const attrRequired = (attr: AttributeCatalogAttribute) =>
    (phase === '1' && attr.requiredForPhase1) || (phase === '2' && attr.requiredForPhase2);

  const isMissingRequired = (attr: AttributeCatalogAttribute | undefined) => {
    if (!attr || !attrRequired(attr)) return false;
    const assignment = dossier.assignments.find((a) => a.attributeId === attr.attributeId);
    return !phase1FieldSatisfiedForUi(attr, assignment);
  };

  let anyShowReq = false;
  let anyMissing = false;
  for (const r of bundleRows) {
    if (attrRequired(r.attribute)) {
      anyShowReq = true;
      if (isMissingRequired(r.attribute)) anyMissing = true;
    }
  }

  const paletteCrossNeedles = useMemo(
    () => collectColorBundlePaletteNeedles(dossier),
    [dossier.assignments]
  );

  return (
    <li
      id="w2-passport-color-bundle"
      className={cn(
        'scroll-mt-24 space-y-3 transition-all',
        listItemClassName,
        anyShowReq && anyMissing && 'ring-2 ring-amber-200/90 ring-offset-1 ring-offset-white'
      )}
    >
      {anyShowReq ? (
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
          <span
            className={cn(
              anyMissing ? WORKSHOP_REQUIRED_BADGE_TODO_CLASS : WORKSHOP_REQUIRED_BADGE_DONE_CLASS,
              anyMissing && 'animate-pulse'
            )}
          >
            {anyMissing ? 'Заполните' : 'Обязательный'}
          </span>
        </div>
      ) : null}
      <div className="space-y-4">
        {primary || refRow ? (
          <div
            className={cn(
              'grid gap-3',
              primary && refRow ? 'md:grid-cols-2 md:items-start' : ''
            )}
          >
            {primary ? (
              <div className="bg-bg-surface2/40 space-y-2 rounded-md p-3">
                <div className="flex items-center gap-1">
                  <Label className={cn(WORKSHOP_FIELD_LABEL_CLASS, 'text-text-primary')}>
                    {w2TzAttributeDisplayName(primary.attribute)}
                  </Label>
                  {showAttributeHintIcons ? (
                    <WorkshopAttributeHintIcon attribute={primary.attribute} />
                  ) : null}
                </div>
                <AttributeRowEditor
                  attribute={{
                    ...primary.attribute,
                    parameters: resolveEffectiveParametersForLeaf(primary.attribute, currentLeaf),
                  }}
                  dossier={dossier}
                  allowMultiHandbook={allowMultiHandbook}
                  onSetHandbookParameters={onSetHandbookParameters}
                  onFreeTextSide={onFreeTextSide}
                />
              </div>
            ) : null}
            {refRow ? (
              <div className="bg-bg-surface2/40 space-y-2 rounded-md p-3">
                <div className="flex items-center gap-1">
                  <Label className={cn(WORKSHOP_FIELD_LABEL_CLASS, 'text-text-primary')}>
                    {w2TzAttributeDisplayName(refRow.attribute)}
                  </Label>
                  {showAttributeHintIcons ? (
                    <WorkshopAttributeHintIcon attribute={refRow.attribute} />
                  ) : null}
                </div>
                <AttributeRowEditor
                  attribute={{
                    ...refRow.attribute,
                    parameters: resolveEffectiveParametersForLeaf(refRow.attribute, currentLeaf),
                  }}
                  dossier={dossier}
                  allowMultiHandbook={allowMultiHandbook}
                  onSetHandbookParameters={onSetHandbookParameters}
                  onFreeTextSide={onFreeTextSide}
                />
              </div>
            ) : null}
          </div>
        ) : null}
        {colorRow ? (
          <div className="space-y-2 pt-2">
            {showAttributeHintIcons ? (
              <div className="flex items-center gap-1">
                <span className={cn(WORKSHOP_FIELD_LABEL_CLASS, 'text-text-primary')}>
                  {w2TzAttributeDisplayName(colorRow.attribute)}
                </span>
                <WorkshopAttributeHintIcon attribute={colorRow.attribute} />
              </div>
            ) : null}
            <ColorAttributeRow
              attribute={{
                ...colorRow.attribute,
                parameters: resolveEffectiveParametersForLeaf(colorRow.attribute, currentLeaf),
              }}
              dossier={dossier}
              patchColor={patchColor}
              paletteCrossNeedles={paletteCrossNeedles}
            />
          </div>
        ) : null}
      </div>
    </li>
  );
}
