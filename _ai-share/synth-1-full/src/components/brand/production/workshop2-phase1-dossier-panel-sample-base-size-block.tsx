'use client';

import { useEffect, useMemo, type Dispatch, type SetStateAction } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  defaultSizeScaleIdForLeaf,
  resolveSampleBaseSizeParametersForLeaf,
} from '@/lib/production/attribute-catalog';
import type { AttributeCatalogAttribute } from '@/lib/production/attribute-catalog.types';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import {
  cellLooksLikeNumericRange,
  formatRangeToDimensionCell,
  midpointNominalSuggestion,
  parseDimensionValueToRange,
} from '@/lib/production/workshop-dimension-range';
import { getSuggestedBagDimensionsForBagTypeParameterId } from '@/lib/production/workshop-bag-type-defaults';
import {
  getSuggestedDimensionCmForParameterId,
  getWorkshopDimensionLabels,
  getWorkshopSampleSizeScaleOptions,
  MEN_OUTERWEAR_BODY_GRID_CM,
  WOMEN_OUTERWEAR_BODY_GRID_CM,
} from '@/lib/production/workshop-size-handbook';
import { effectiveMoqTargetMaxPieces } from '@/lib/production/workshop2-phase1-dossier-storage';
import type {
  Workshop2DossierPhase1,
  Workshop2Phase1DimensionRangeCell,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { cn } from '@/lib/utils';
import { HandbookMultiSelectPopover } from '@/components/brand/production/workshop2-phase1-dossier-panel-handbook-multi-select';
import { resolvedHandbookDisplayLabel } from '@/components/brand/production/workshop2-phase1-dossier-panel-handbook-display-label';
import { partitionHandbookAndFree } from '@/components/brand/production/workshop2-phase1-dossier-panel-assignment-helpers';
import {
  newUuid,
  syncSampleBaseSizePartsAndPruneDims,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-dossier-mutations';
import {
  WORKSHOP_FIELD_LABEL_CLASS,
  WORKSHOP_HINT_TOOLTIP_CLASS,
} from '@/components/brand/production/workshop2-phase1-dossier-panel-ui-constants';

export function SampleBaseSizeBlock({
  attribute,
  currentLeaf,
  dossier,
  setDossier,
  setDossierInternal,
  tzWriteDisabled,
  onFreeTextSide,
  fieldDeferralPhase1,
  deferHandbookLater,
  onToggleDeferHandbookLater,
  handbookCommentsCount,
  onOpenHandbookComments,
}: {
  attribute: AttributeCatalogAttribute;
  currentLeaf: HandbookCategoryLeaf;
  dossier: Workshop2DossierPhase1;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  setDossierInternal: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  tzWriteDisabled: boolean;
  onFreeTextSide: (attributeId: string, text: string) => void;
  fieldDeferralPhase1: boolean;
  deferHandbookLater: boolean;
  onToggleDeferHandbookLater: () => void;
  handbookCommentsCount: number;
  onOpenHandbookComments: () => void;
}) {
  const scaleRows = useMemo(
    () => getWorkshopSampleSizeScaleOptions(currentLeaf, dossier.isUnisex),
    [currentLeaf, dossier.isUnisex]
  );
  const dimLabels = useMemo(
    () => getWorkshopDimensionLabels(currentLeaf, dossier.isUnisex),
    [currentLeaf, dossier.isUnisex]
  );
  const effectiveScaleId =
    dossier.sampleSizeScaleId ?? scaleRows[0]?.key ?? defaultSizeScaleIdForLeaf(currentLeaf);
  const sizeParams = useMemo(
    () => resolveSampleBaseSizeParametersForLeaf(attribute, currentLeaf, effectiveScaleId),
    [attribute, currentLeaf, effectiveScaleId]
  );

  const sampleAssign = dossier.assignments.find(
    (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
  );
  const handbookParts = useMemo(() => {
    if (!sampleAssign) return [];
    return sampleAssign.values
      .map((v) => {
        if (v.valueSource === 'handbook_parameter') {
          return {
            id: v.valueId,
            parameterId: v.parameterId!,
            displayLabel: resolvedHandbookDisplayLabel(
              'sampleBaseSize',
              v.parameterId!,
              v.displayLabel
            ),
            isFree: false,
          };
        } else {
          return {
            id: v.valueId,
            parameterId: `__free:${v.text}`,
            displayLabel: v.text || '',
            isFree: true,
          };
        }
      })
      .filter((p) => p.displayLabel.trim().length > 0);
  }, [sampleAssign]);

  const freeStr = useMemo(() => {
    if (!sampleAssign) return '';
    return sampleAssign.values
      .filter((v) => v.valueSource === 'free_text' && v.text?.trim())
      .map((v) => v.text)
      .join('; ');
  }, [sampleAssign]);
  const hasSampleBaseSelection = handbookParts.length > 0 || freeStr.trim().length > 0;

  const selectOptions = useMemo(() => {
    const list = [...sizeParams];
    const hbs = sampleAssign?.values.filter((v) => v.valueSource === 'handbook_parameter') || [];
    for (const v of hbs) {
      const pid = v.parameterId;
      if (pid && !list.some((p) => p.parameterId === pid)) {
        list.unshift({
          parameterId: pid,
          label: v.displayLabel || pid,
          sortOrder: -1,
        });
      }
    }
    return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [sizeParams, sampleAssign]);

  const movePart = (index: number, direction: 'up' | 'down') => {
    setDossier((p) => {
      const assignIdx = p.assignments.findIndex(
        (a) => a.kind === 'canonical' && a.attributeId === 'sampleBaseSize'
      );
      if (assignIdx < 0) return p;
      const assign = p.assignments[assignIdx];

      const part = handbookParts[index];
      const otherPart = handbookParts[index + (direction === 'up' ? -1 : 1)];
      if (!part || !otherPart) return p;

      const newValues = [...assign.values];
      const idx1 = newValues.findIndex((v) => v.valueId === part.id);
      const idx2 = newValues.findIndex((v) => v.valueId === otherPart.id);

      if (idx1 >= 0 && idx2 >= 0) {
        const temp = newValues[idx1];
        newValues[idx1] = newValues[idx2];
        newValues[idx2] = temp;
      }

      const newAssignments = [...p.assignments];
      newAssignments[assignIdx] = { ...assign, values: newValues };
      return { ...p, assignments: newAssignments };
    });
  };

  const hiddenDimSet = useMemo(
    () => new Set(dossier.sampleBaseHiddenDimensionKeys ?? []),
    [dossier.sampleBaseHiddenDimensionKeys]
  );
  const visibleDimLabels = useMemo(
    () => dimLabels.filter((d) => !hiddenDimSet.has(d)),
    [dimLabels, hiddenDimSet]
  );

  const extras = dossier.sampleBaseExtraDimensions ?? [];

  function dimValue(pid: string, label: string, rowIndex: number) {
    return (
      dossier.sampleBasePerSizeDimensions?.[pid]?.[label] ??
      (rowIndex === 0 ? dossier.sampleBaseDimensionOverrides?.[label] : undefined) ??
      ''
    );
  }

  const rangeMode = !!dossier.sampleBaseDimensionRangeMode;
  const rangeKeys = dossier.sampleBaseDimensionRangeKeys ?? [];
  const rangeKeysSet = useMemo(() => new Set(rangeKeys), [rangeKeys]);

  const dimensionKeysAll = useMemo(
    () => [...visibleDimLabels, ...extras.map((ex) => `__extra:${ex.id}`)],
    [visibleDimLabels, extras]
  );

  const dimsWithSuggestionRange = useMemo(
    () =>
      dimensionKeysAll.filter((key) =>
        handbookParts.some((part, idx) =>
          cellLooksLikeNumericRange(dimValue(part.parameterId, key, idx))
        )
      ),
    [
      dimensionKeysAll,
      handbookParts,
      dossier.sampleBasePerSizeDimensions,
      dossier.sampleBaseDimensionOverrides,
    ]
  );

  const moqCap = effectiveMoqTargetMaxPieces(dossier.passportProductionBrief);
  const pieceQtyMap = dossier.sampleBasePerSizePieceQty ?? {};

  const tablePieceSum = useMemo(
    () =>
      handbookParts.reduce((s, part) => {
        const v = pieceQtyMap[part.parameterId];
        if (typeof v === 'number' && Number.isFinite(v) && v > 0) return s + Math.floor(v);
        return s;
      }, 0),
    [handbookParts, pieceQtyMap]
  );

  const maxPiecesForPid = (pid: string) => {
    const others = handbookParts.reduce((s, part) => {
      if (part.parameterId === pid) return s;
      const v = pieceQtyMap[part.parameterId];
      if (typeof v === 'number' && Number.isFinite(v) && v > 0) return s + Math.floor(v);
      return s;
    }, 0);
    return Math.max(0, Math.floor(moqCap) - others);
  };

  const patchPieceQty = (pid: string, raw: string) => {
    setDossier((p: Workshop2DossierPhase1) => {
      const assign = p.assignments.find(
        (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
      );
      const { hbs } = partitionHandbookAndFree(assign);
      const cap = effectiveMoqTargetMaxPieces(p.passportProductionBrief);
      const digits = raw.replace(/\D/g, '');
      let v = digits === '' ? 0 : Math.max(0, Math.floor(Number(digits)));
      const prev = { ...(p.sampleBasePerSizePieceQty ?? {}) };
      let others = 0;
      for (const hb of hbs) {
        const opid = hb.parameterId!;
        if (opid === pid) continue;
        const n = prev[opid];
        if (typeof n === 'number' && Number.isFinite(n) && n > 0) others += Math.floor(n);
      }
      if (cap >= 1) {
        v = Math.min(v, Math.max(0, Math.floor(cap) - others));
      }
      const next = { ...prev };
      if (v === 0) delete next[pid];
      else next[pid] = v;
      return {
        ...p,
        sampleBasePerSizePieceQty: Object.keys(next).length ? next : undefined,
      };
    });
  };

  const enableRangeForDimensionKey = (canon: string) => {
    setDossier((p: Workshop2DossierPhase1) => {
      const keys = [...new Set([...(p.sampleBaseDimensionRangeKeys ?? []), canon])];
      const nextRanges = { ...(p.sampleBasePerSizeDimensionRanges ?? {}) };
      const nextPer: Record<string, Record<string, string>> = {
        ...(p.sampleBasePerSizeDimensions ?? {}),
      };
      for (let idx = 0; idx < handbookParts.length; idx++) {
        const part = handbookParts[idx]!;
        const pid = part.parameterId;
        const raw =
          p.sampleBasePerSizeDimensions?.[pid]?.[canon] ??
          (idx === 0 ? p.sampleBaseDimensionOverrides?.[canon] : undefined) ??
          '';
        const parsed = parseDimensionValueToRange(String(raw));
        const cell: Workshop2Phase1DimensionRangeCell = { min: parsed.min, max: parsed.max };
        nextRanges[pid] = { ...(nextRanges[pid] ?? {}), [canon]: cell };
        nextPer[pid] = {
          ...(nextPer[pid] ?? {}),
          [canon]: formatRangeToDimensionCell(cell.min, cell.max),
        };
      }
      return {
        ...p,
        sampleBaseDimensionRangeKeys: keys,
        sampleBasePerSizeDimensionRanges: nextRanges,
        sampleBasePerSizeDimensions: Object.keys(nextPer).length ? nextPer : undefined,
      };
    });
  };

  const disableRangeForDimensionKey = (canon: string) => {
    setDossier((p: Workshop2DossierPhase1) => {
      const keys = (p.sampleBaseDimensionRangeKeys ?? []).filter((k) => k !== canon);
      const nextRanges: Record<string, Record<string, Workshop2Phase1DimensionRangeCell>> = {
        ...(p.sampleBasePerSizeDimensionRanges ?? {}),
      };
      const nextPer: Record<string, Record<string, string>> = {
        ...(p.sampleBasePerSizeDimensions ?? {}),
      };
      for (const part of handbookParts) {
        const pid = part.parameterId;
        const cell = nextRanges[pid]?.[canon];
        if (cell) {
          nextPer[pid] = {
            ...(nextPer[pid] ?? {}),
            [canon]: formatRangeToDimensionCell(cell.min, cell.max),
          };
        }
        if (nextRanges[pid]) {
          const { [canon]: _removed, ...rest } = nextRanges[pid]!;
          if (Object.keys(rest).length) nextRanges[pid] = rest;
          else delete nextRanges[pid];
        }
      }
      return {
        ...p,
        sampleBaseDimensionRangeKeys: keys.length ? keys : undefined,
        sampleBasePerSizeDimensionRanges: Object.keys(nextRanges).length ? nextRanges : undefined,
        sampleBasePerSizeDimensions: Object.keys(nextPer).length ? nextPer : undefined,
      };
    });
  };

  const addAllSuggestedRangeDimensions = () => {
    setDossier((p: Workshop2DossierPhase1) => {
      let next = p;
      let changedColumns = 0;
      let changedCells = 0;
      const sourceKeys = dimsWithSuggestionRange.length
        ? dimsWithSuggestionRange
        : dimensionKeysAll;
      for (const k of sourceKeys) {
        const curKeys = new Set(next.sampleBaseDimensionRangeKeys ?? []);
        const keyAlreadyEnabled = curKeys.has(k);
        let keyHadAnyParsedCell = false;
        const keys = [...curKeys, k];
        const nextRanges = { ...(next.sampleBasePerSizeDimensionRanges ?? {}) };
        const nextPer: Record<string, Record<string, string>> = {
          ...(next.sampleBasePerSizeDimensions ?? {}),
        };
        for (let idx = 0; idx < handbookParts.length; idx++) {
          const part = handbookParts[idx]!;
          const pid = part.parameterId;
          const raw =
            next.sampleBasePerSizeDimensions?.[pid]?.[k] ??
            (idx === 0 ? next.sampleBaseDimensionOverrides?.[k] : undefined) ??
            '';
          const cell = deriveRangeCellFromRaw(String(raw));
          if (!cell) continue;
          nextRanges[pid] = { ...(nextRanges[pid] ?? {}), [k]: cell };
          nextPer[pid] = {
            ...(nextPer[pid] ?? {}),
            [k]: formatRangeToDimensionCell(cell.min, cell.max),
          };
          keyHadAnyParsedCell = true;
          changedCells += 1;
        }
        if (!keyHadAnyParsedCell) continue;
        if (!keyAlreadyEnabled) changedColumns += 1;
        next = {
          ...next,
          sampleBaseDimensionRangeKeys: keys,
          sampleBasePerSizeDimensionRanges: nextRanges,
          sampleBasePerSizeDimensions: Object.keys(nextPer).length ? nextPer : undefined,
        };
      }
      return next;
    });
  };

  useEffect(() => {
    if (tzWriteDisabled) return;
    setDossierInternal((prev: Workshop2DossierPhase1) => {
      const hidden = new Set(prev.sampleBaseHiddenDimensionKeys ?? []);
      const a = prev.assignments.find(
        (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
      );
      const { hbs: list } = partitionHandbookAndFree(a);
      if (!list.length) return prev;
      let nextPer = { ...prev.sampleBasePerSizeDimensions };
      let changed = false;
      for (const v of list) {
        const pid = v.parameterId!;
        const sug = getSuggestedDimensionCmForParameterId(pid, dimLabels);
        if (!sug) continue;
        const row = { ...(nextPer[pid] ?? {}) };
        let rowTouch = false;
        for (const [k, val] of Object.entries(sug)) {
          if (hidden.has(k)) continue;
          if (!row[k]) {
            row[k] = val;
            rowTouch = true;
          }
        }
        if (rowTouch) {
          nextPer[pid] = row;
          changed = true;
        }
      }
      return changed ? { ...prev, sampleBasePerSizeDimensions: nextPer } : prev;
    });
  }, [dossier.assignments, dimLabels, tzWriteDisabled]);

  useEffect(() => {
    if (tzWriteDisabled) return;
    if (currentLeaf.l1Name !== 'Сумки') return;
    setDossierInternal((prev: Workshop2DossierPhase1) => {
      const bagA = prev.assignments.find(
        (x) => x.kind === 'canonical' && x.attributeId === 'bag-type'
      );
      const btPid = bagA?.values.find(
        (v) => v.valueSource === 'handbook_parameter' && v.parameterId
      )?.parameterId;
      const sug = getSuggestedBagDimensionsForBagTypeParameterId(btPid);
      if (!sug || !Object.keys(sug).length) return prev;
      const hidden = new Set(prev.sampleBaseHiddenDimensionKeys ?? []);
      const a = prev.assignments.find(
        (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
      );
      const { hbs: list } = partitionHandbookAndFree(a);
      if (!list.length) return prev;
      let nextPer = { ...prev.sampleBasePerSizeDimensions };
      let changed = false;
      for (const v of list) {
        const pid = v.parameterId!;
        const row = { ...(nextPer[pid] ?? {}) };
        let rowTouch = false;
        for (const [k, val] of Object.entries(sug)) {
          if (!dimLabels.includes(k)) continue;
          if (hidden.has(k)) continue;
          if (!row[k]) {
            row[k] = val;
            rowTouch = true;
          }
        }
        if (rowTouch) {
          nextPer[pid] = row;
          changed = true;
        }
      }
      return changed ? { ...prev, sampleBasePerSizeDimensions: nextPer } : prev;
    });
  }, [currentLeaf.l1Name, dossier.assignments, dimLabels, tzWriteDisabled]);

  const selectCls =
    'h-9 min-w-0 rounded-md border border-border-default bg-white px-2 text-sm text-text-primary';

  const extraDimStorageKey = (id: string) => `__extra:${id}`;

  const addExtraDimension = () => {
    setDossier((p: Workshop2DossierPhase1) => ({
      ...p,
      sampleBaseExtraDimensions: [
        ...(p.sampleBaseExtraDimensions ?? []),
        { id: newUuid(), label: '' },
      ],
    }));
  };

  const removeExtraDimension = (id: string) => {
    const storageKey = extraDimStorageKey(id);
    setDossier((p: Workshop2DossierPhase1) => {
      const raw = p.sampleBasePerSizeDimensions;
      const nextExtras = (p.sampleBaseExtraDimensions ?? []).filter((x) => x.id !== id);
      const nextRangeKeys = (p.sampleBaseDimensionRangeKeys ?? []).filter((k) => k !== storageKey);
      const nextRangesRaw = { ...(p.sampleBasePerSizeDimensionRanges ?? {}) };
      for (const pid of Object.keys(nextRangesRaw)) {
        const rec = nextRangesRaw[pid];
        if (!rec?.[storageKey]) continue;
        const { [storageKey]: _r, ...restR } = rec;
        if (Object.keys(restR).length) nextRangesRaw[pid] = restR;
        else delete nextRangesRaw[pid];
      }
      if (!raw) {
        return {
          ...p,
          sampleBaseExtraDimensions: nextExtras.length ? nextExtras : undefined,
          sampleBaseDimensionRangeKeys: nextRangeKeys.length ? nextRangeKeys : undefined,
          sampleBasePerSizeDimensionRanges: Object.keys(nextRangesRaw).length
            ? nextRangesRaw
            : undefined,
        };
      }
      const nextPer: Record<string, Record<string, string>> = {};
      for (const [pid, rec] of Object.entries(raw) as [string, Record<string, string>][]) {
        const copy = { ...rec };
        delete copy[storageKey];
        nextPer[pid] = copy;
      }
      return {
        ...p,
        sampleBaseExtraDimensions: nextExtras.length ? nextExtras : undefined,
        sampleBasePerSizeDimensions: Object.keys(nextPer).length ? nextPer : undefined,
        sampleBaseDimensionRangeKeys: nextRangeKeys.length ? nextRangeKeys : undefined,
        sampleBasePerSizeDimensionRanges: Object.keys(nextRangesRaw).length
          ? nextRangesRaw
          : undefined,
      };
    });
  };

  const removeStandardDimension = (canonKey: string) => {
    setDossier((p: Workshop2DossierPhase1) => {
      const nextHidden = [...new Set([...(p.sampleBaseHiddenDimensionKeys ?? []), canonKey])];
      const raw = p.sampleBasePerSizeDimensions;
      const nextOv = { ...(p.sampleBaseDimensionLabelOverrides ?? {}) };
      delete nextOv[canonKey];
      const nextRangeKeys = (p.sampleBaseDimensionRangeKeys ?? []).filter((k) => k !== canonKey);
      const nextRangesRaw = { ...(p.sampleBasePerSizeDimensionRanges ?? {}) };
      for (const pid of Object.keys(nextRangesRaw)) {
        const rec = nextRangesRaw[pid];
        if (!rec?.[canonKey]) continue;
        const { [canonKey]: _r, ...restR } = rec;
        if (Object.keys(restR).length) nextRangesRaw[pid] = restR;
        else delete nextRangesRaw[pid];
      }
      if (!raw) {
        return {
          ...p,
          sampleBaseHiddenDimensionKeys: nextHidden,
          sampleBaseDimensionLabelOverrides: Object.keys(nextOv).length > 0 ? nextOv : undefined,
          sampleBaseDimensionRangeKeys: nextRangeKeys.length ? nextRangeKeys : undefined,
          sampleBasePerSizeDimensionRanges: Object.keys(nextRangesRaw).length
            ? nextRangesRaw
            : undefined,
        };
      }
      const nextPer: Record<string, Record<string, string>> = {};
      for (const [pid, rec] of Object.entries(raw) as [string, Record<string, string>][]) {
        const copy = { ...rec };
        delete copy[canonKey];
        nextPer[pid] = copy;
      }
      return {
        ...p,
        sampleBaseHiddenDimensionKeys: nextHidden,
        sampleBaseDimensionLabelOverrides: Object.keys(nextOv).length > 0 ? nextOv : undefined,
        sampleBasePerSizeDimensions: Object.keys(nextPer).length ? nextPer : undefined,
        sampleBaseDimensionRangeKeys: nextRangeKeys.length ? nextRangeKeys : undefined,
        sampleBasePerSizeDimensionRanges: Object.keys(nextRangesRaw).length
          ? nextRangesRaw
          : undefined,
      };
    });
  };

  const setStandardLabelOverride = (canonKey: string, display: string) => {
    setDossier((p: Workshop2DossierPhase1) => {
      const next = { ...(p.sampleBaseDimensionLabelOverrides ?? {}) };
      const t = display.trim();
      if (!t || t === canonKey) delete next[canonKey];
      else next[canonKey] = t;
      return {
        ...p,
        sampleBaseDimensionLabelOverrides: Object.keys(next).length ? next : undefined,
      };
    });
  };

  const optList = selectOptions.map((p) => ({ parameterId: p.parameterId, label: p.label }));

  const sizeLineForPart = (part: { parameterId: string; displayLabel: string }) =>
    selectOptions.find((o) => o.parameterId === part.parameterId)?.label ?? part.displayLabel;

  const dimensionKeyLabel = (k: string) => {
    if (k.startsWith('__extra:')) {
      const id = k.slice('__extra:'.length);
      return extras.find((x) => x.id === id)?.label?.trim() || 'Доп. мерка';
    }
    return dossier.sampleBaseDimensionLabelOverrides?.[k] ?? k;
  };

  function rangeForCell(pid: string, canon: string, rowIndex: number) {
    const stored = dossier.sampleBasePerSizeDimensionRanges?.[pid]?.[canon];
    if (stored) {
      return {
        min: stored.min,
        max: stored.max,
        nominal: stored.nominal ?? '',
      };
    }
    const parsed = parseDimensionValueToRange(dimValue(pid, canon, rowIndex));
    return { ...parsed, nominal: '' };
  }

  const adjustRangeBoundByStep = (
    minRaw: string,
    maxRaw: string,
    bound: 'min' | 'max',
    direction: -1 | 1
  ) => {
    const minVal = Number.parseFloat(String(minRaw).replace(',', '.'));
    const maxVal = Number.parseFloat(String(maxRaw).replace(',', '.'));
    const step = 0.5;
    if (!Number.isFinite(minVal) || !Number.isFinite(maxVal)) return '';
    if (bound === 'min') {
      const nextMin = Math.min(maxVal - step, minVal + direction * step);
      return String(nextMin.toFixed(1)).replace(/\.0$/, '');
    }
    const nextMax = Math.max(minVal + step, maxVal + direction * step);
    return String(nextMax.toFixed(1)).replace(/\.0$/, '');
  };

  const hasNumericMinMax = (minRaw: string, maxRaw: string) => {
    const minVal = Number.parseFloat(String(minRaw).replace(',', '.'));
    const maxVal = Number.parseFloat(String(maxRaw).replace(',', '.'));
    return Number.isFinite(minVal) && Number.isFinite(maxVal);
  };

  const mapBodyRowToDimRecordForCurrentLabels = (row: {
    chest: number;
    waist: number;
    hips: number;
  }): Record<string, string> => {
    const labels = dimLabels.length ? dimLabels : ['Обхват груди', 'Обхват талии', 'Обхват бёдер'];
    const out: Record<string, string> = {};
    for (const label of labels) {
      const low = label.toLowerCase();
      if (low.includes('груд')) out[label] = String(row.chest);
      else if (low.includes('тал')) out[label] = String(row.waist);
      else if (low.includes('бёдр') || low.includes('бедр')) out[label] = String(row.hips);
    }
    return out;
  };

  const inferBodyRowFromDisplayLabel = (displayLabel: string) => {
    const text = displayLabel.trim();
    if (!text) return undefined;
    const euMatch = text.match(/EU\s*(\d{2})/i);
    const alphaMatch = text.match(/\b(XXS|XS|S|M|L|XL|XXL)\b/i);
    const allRows = [...WOMEN_OUTERWEAR_BODY_GRID_CM, ...MEN_OUTERWEAR_BODY_GRID_CM];
    if (euMatch) {
      const eu = `EU ${euMatch[1]}`;
      const byEu = allRows.find((r) => r.eu.toLowerCase() === eu.toLowerCase());
      if (byEu) return byEu;
    }
    if (alphaMatch) {
      const byAlpha = allRows.find((r) => r.alpha.toLowerCase() === alphaMatch[1]!.toLowerCase());
      if (byAlpha) return byAlpha;
    }
    return undefined;
  };

  const getSuggestedByPart = (part: { parameterId: string; displayLabel: string }) => {
    const byId = getSuggestedDimensionCmForParameterId(part.parameterId, dimLabels);
    if (byId && Object.keys(byId).length) return byId;
    const row = inferBodyRowFromDisplayLabel(sizeLineForPart(part) || part.displayLabel || '');
    if (!row) return undefined;
    const mapped = mapBodyRowToDimRecordForCurrentLabels(row);
    return Object.keys(mapped).length ? mapped : undefined;
  };

  const deriveRangeCellFromRaw = (raw: string): Workshop2Phase1DimensionRangeCell | null => {
    const parsed = parseDimensionValueToRange(raw);
    const minNum = Number.parseFloat(String(parsed.min).replace(',', '.'));
    const maxNum = Number.parseFloat(String(parsed.max).replace(',', '.'));
    if (Number.isFinite(minNum) && Number.isFinite(maxNum) && maxNum > minNum) {
      return { min: String(minNum), max: String(maxNum) };
    }
    const single = Number.parseFloat(String(raw).replace(',', '.'));
    if (!Number.isFinite(single)) return null;
    const min = Math.max(0, single - 0.5);
    const max = single + 0.5;
    return { min: String(min), max: String(max), nominal: String(single) };
  };

  const patchRangeCell = (
    pid: string,
    canon: string,
    field: 'min' | 'max' | 'nominal',
    v: string
  ) => {
    setDossier((p: Workshop2DossierPhase1) => {
      const rowIndex = handbookParts.findIndex((x) => x.parameterId === pid);
      const curFlat =
        p.sampleBasePerSizeDimensions?.[pid]?.[canon] ??
        (rowIndex === 0 ? p.sampleBaseDimensionOverrides?.[canon] : undefined) ??
        '';
      const existing = p.sampleBasePerSizeDimensionRanges?.[pid]?.[canon];
      const base = existing ?? parseDimensionValueToRange(String(curFlat));
      const next: Workshop2Phase1DimensionRangeCell = {
        min: field === 'min' ? v : base.min,
        max: field === 'max' ? v : base.max,
      };
      if (field === 'nominal') {
        const t = v.trim();
        if (t) next.nominal = t;
      } else if (existing?.nominal?.trim()) {
        next.nominal = existing.nominal;
      }
      return {
        ...p,
        sampleBasePerSizeDimensionRanges: {
          ...p.sampleBasePerSizeDimensionRanges,
          [pid]: {
            ...(p.sampleBasePerSizeDimensionRanges?.[pid] ?? {}),
            [canon]: next,
          },
        },
        sampleBasePerSizeDimensions: {
          ...p.sampleBasePerSizeDimensions,
          [pid]: {
            ...(p.sampleBasePerSizeDimensions?.[pid] ?? {}),
            [canon]: formatRangeToDimensionCell(next.min, next.max),
          },
        },
      };
    });
  };

  const fillSuggestionsForPart = (part: { parameterId: string; displayLabel: string }) => {
    const suggested = getSuggestedByPart(part);
    if (!suggested) return;
    setDossier((p: Workshop2DossierPhase1) => {
      const hidden = new Set(p.sampleBaseHiddenDimensionKeys ?? []);
      const nextPer = { ...(p.sampleBasePerSizeDimensions ?? {}) };
      const row = { ...(nextPer[part.parameterId] ?? {}) };
      let touch = false;
      for (const [k, val] of Object.entries(suggested)) {
        if (hidden.has(k)) continue;
        if (!row[k] || !String(row[k]).trim()) {
          row[k] = val;
          touch = true;
        }
      }
      if (!touch) return p;
      nextPer[part.parameterId] = row;
      return { ...p, sampleBasePerSizeDimensions: nextPer };
    });
  };

  const fillAllSuggestions = () => {
    setDossier((p: Workshop2DossierPhase1) => {
      const hidden = new Set(p.sampleBaseHiddenDimensionKeys ?? []);
      const nextPer = { ...(p.sampleBasePerSizeDimensions ?? {}) };
      let changed = false;
      let filledCells = 0;
      for (const part of handbookParts) {
        const suggested = getSuggestedByPart(part);
        if (!suggested) continue;
        const row = { ...(nextPer[part.parameterId] ?? {}) };
        for (const [k, val] of Object.entries(suggested)) {
          if (hidden.has(k)) continue;
          if (!row[k] || !String(row[k]).trim()) {
            row[k] = val;
            changed = true;
            filledCells += 1;
          }
        }
        nextPer[part.parameterId] = row;
      }
      return changed
        ? { ...p, sampleBasePerSizeDimensions: Object.keys(nextPer).length ? nextPer : undefined }
        : p;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:gap-4">
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
          <div className="min-w-0 space-y-1">
            <Label className={cn(WORKSHOP_FIELD_LABEL_CLASS, 'text-text-primary')}>
              Шкала размеров
            </Label>
            <select
              className={cn(selectCls, 'h-9 w-full')}
              value={effectiveScaleId}
              onChange={(e) => {
                const sid = e.target.value;
                setDossier((prev: Workshop2DossierPhase1) => {
                  const next: Workshop2DossierPhase1 = { ...prev, sampleSizeScaleId: sid };
                  const params = resolveSampleBaseSizeParametersForLeaf(
                    attribute,
                    currentLeaf,
                    sid
                  );
                  const allow = new Set(params.map((p) => p.parameterId));
                  const a = prev.assignments.find(
                    (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
                  );
                  const { hbs: hbList, ft: ftt } = partitionHandbookAndFree(a);
                  if (!hbList.length) return next;
                  const keep = hbList.filter((hb) => hb.parameterId && allow.has(hb.parameterId));
                  if (keep.length === hbList.length) return next;
                  const parts = keep.map((v) => ({
                    parameterId: v.parameterId!,
                    displayLabel: v.displayLabel ?? '',
                  }));
                  const cap = effectiveMoqTargetMaxPieces(next.passportProductionBrief);
                  const capped = parts.slice(0, Math.floor(cap));
                  return syncSampleBaseSizePartsAndPruneDims(next, capped, ftt?.text ?? '');
                });
              }}
            >
              {scaleRows.length ? (
                scaleRows.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.label}
                  </option>
                ))
              ) : (
                <option value={defaultSizeScaleIdForLeaf(currentLeaf)}>—</option>
              )}
            </select>
          </div>
          <div className="min-w-0 space-y-1">
            <Label className={cn(WORKSHOP_FIELD_LABEL_CLASS, 'text-text-primary')}>
              Свой размер (через ;)
            </Label>
            <Input
              className="h-9 w-full min-w-0 text-sm"
              value={freeStr}
              onChange={(e) => onFreeTextSide(attribute.attributeId, e.target.value)}
              placeholder={attribute.uiPlaceholder ?? 'S; M; L...'}
            />
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-1.5 lg:max-w-[min(100%,28rem)]">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <Label
              className={cn(
                WORKSHOP_FIELD_LABEL_CLASS,
                hasSampleBaseSelection ? 'text-text-primary' : 'text-red-600'
              )}
            >
              Выбор из справочника
            </Label>
            {fieldDeferralPhase1 ? (
              <div className="flex shrink-0 items-center gap-1">
                <label
                  className="text-text-muted hover:text-text-primary flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-[10px] font-semibold"
                  title="Отложенное заполнение сохраняется только в браузере (для команды бренда)"
                >
                  <Checkbox
                    checked={deferHandbookLater}
                    onCheckedChange={() => onToggleDeferHandbookLater()}
                    className="border-border-default h-3.5 w-3.5 shrink-0"
                    aria-label={
                      deferHandbookLater
                        ? 'Снять отложенное заполнение'
                        : 'Заполнить позже (только для бренда)'
                    }
                  />
                  <span>Позже (лок.)</span>
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-text-muted hover:text-text-primary h-8 px-1.5 text-[10px] font-semibold"
                  onClick={onOpenHandbookComments}
                >
                  Комментарий
                  {handbookCommentsCount > 0 ? (
                    <span className="ml-1 inline-flex min-w-4 items-center justify-center rounded-full bg-amber-100 px-1 text-[9px] font-bold text-amber-700">
                      {handbookCommentsCount}
                    </span>
                  ) : null}
                </Button>
              </div>
            ) : null}
          </div>
          <HandbookMultiSelectPopover
            options={optList}
            parts={handbookParts}
            catalogAttributeId="sampleBaseSize"
            maxSelections={moqCap}
            onPartsChange={(nextParts) => {
              setDossier((prev: Workshop2DossierPhase1) => {
                const a = prev.assignments.find(
                  (x) => x.kind === 'canonical' && x.attributeId === 'sampleBaseSize'
                );
                const ftText = partitionHandbookAndFree(a).ft?.text ?? '';
                const cap = effectiveMoqTargetMaxPieces(prev.passportProductionBrief);
                const trimmed = nextParts.slice(0, Math.floor(cap));
                return syncSampleBaseSizePartsAndPruneDims(prev, trimmed, ftText);
              });
            }}
          />
        </div>
      </div>

      {handbookParts.length > 0 && (visibleDimLabels.length > 0 || extras.length > 0) ? (
        <div className="border-border-default min-w-0 max-w-full rounded-xl border bg-white p-1 shadow-sm">
          {tablePieceSum > moqCap ? (
            <p className="mx-1 mb-2 rounded-md border border-amber-200 bg-amber-50/90 px-2 py-1.5 text-[11px] text-amber-900">
              Сумма штук по размерам ({tablePieceSum}) больше количества образцов в паспорте (
              {moqCap}
              ). Уменьшите количества или увеличьте лимит.
            </p>
          ) : null}
          <div className="border-border-subtle bg-bg-surface2/90 text-text-primary mb-2 space-y-2 rounded-lg border p-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="text-text-primary flex cursor-pointer items-center gap-2 font-medium">
                <Checkbox
                  checked={rangeMode}
                  onCheckedChange={(v) =>
                    setDossier((p: Workshop2DossierPhase1) => ({
                      ...p,
                      sampleBaseDimensionRangeMode: v === true ? true : undefined,
                    }))
                  }
                />
                <span className={cn(WORKSHOP_FIELD_LABEL_CLASS, 'text-text-primary')}>
                  Диапазоны (мин–макс)
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-text-secondary hover:text-text-primary inline-flex h-4 w-4 items-center justify-center rounded-full"
                      aria-label="Пояснение по диапазонам"
                    >
                      <LucideIcons.Info className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className={WORKSHOP_HINT_TOOLTIP_CLASS}>
                    <p>
                      «Все мерки с число–число» активна при включённых диапазонах: ищет ячейки, где
                      уже введён диапазон (например 44–46), и переводит колонку в режим мин/макс.
                    </p>
                    <p>
                      «Заполнить по справочнику (EU)» — только пустые ячейки, для шкал одежды с
                      привязкой к EU-сетке.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-accent-primary/20 text-accent-primary hover:bg-accent-primary/10 h-7 bg-white text-[10px] shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                  title="Для одежды (EU/RU/INT): подставляет см из сетки по строке базового размера. Заполняются только пустые ячейки."
                  onClick={fillAllSuggestions}
                >
                  <LucideIcons.Sparkles className="mr-1 h-3 w-3" />
                  Заполнить по справочнику (EU)
                </Button>
                {rangeMode && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 shrink-0 bg-white text-[10px] shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                    title="Включает мин/макс для колонок, где в таблице уже есть диапазон вида «число–число»."
                    onClick={() => addAllSuggestedRangeDimensions()}
                  >
                    <LucideIcons.Sparkles className="text-accent-primary mr-1 h-3 w-3" />
                    Все мерки с «число–число»
                  </Button>
                )}
                {rangeMode ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-text-secondary hover:text-text-primary inline-flex h-8 w-8 items-center justify-center"
                        aria-label="Как работает кнопка «Все мерки с число–число»"
                      >
                        <LucideIcons.Info className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className={WORKSHOP_HINT_TOOLTIP_CLASS}>
                      <p>
                        Кнопка анализирует уже введённые значения вида «число–число» (например
                        44–46) и автоматически включает для таких колонок режим мин/макс.
                      </p>
                      <p>
                        Кнопку можно нажимать повторно: она просто проверяет таблицу ещё раз и не
                        ломает уже включённые колонки.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ) : null}
              </div>
            </div>
          </div>
          <div className="max-w-full overflow-x-auto pb-1">
            <div className="min-w-max space-y-3 px-2">
              <div className="border-border-subtle flex flex-nowrap items-end gap-x-2 gap-y-2 border-b pb-2">
                <div className="min-w-[5rem] max-w-[9rem] shrink-0 pb-2" aria-hidden>
                  <span className="text-text-muted text-[10px] font-semibold">Размер</span>
                </div>
                {visibleDimLabels.map((canon) => {
                  const display = dossier.sampleBaseDimensionLabelOverrides?.[canon] ?? canon;
                  const colRange = rangeMode && rangeKeysSet.has(canon);
                  return (
                    <div
                      key={`hdr-${canon}`}
                      className={cn('relative shrink-0', colRange ? 'w-[5rem]' : 'w-[5rem]')}
                    >
                      <button
                        type="button"
                        className="absolute -right-1 -top-1 z-[1] flex h-5 w-5 items-center justify-center rounded text-base leading-none text-red-600 hover:bg-red-50"
                        aria-label={`Удалить колонку «${canon}»`}
                        onClick={() => removeStandardDimension(canon)}
                      >
                        ×
                      </button>
                      <Input
                        className="text-text-secondary h-8 w-full px-1 pr-4 text-[9px] font-medium leading-tight"
                        value={display}
                        onChange={(e) => setStandardLabelOverride(canon, e.target.value)}
                        aria-label="Подпись мерки"
                      />
                      {rangeMode ? (
                        <label className="mt-1 flex cursor-pointer items-center gap-1">
                          <Checkbox
                            checked={rangeKeysSet.has(canon)}
                            onCheckedChange={(c) => {
                              if (c === true) enableRangeForDimensionKey(canon);
                              else disableRangeForDimensionKey(canon);
                            }}
                            className="h-3 w-3"
                          />
                          <span className="text-text-secondary text-[8px] leading-none">
                            мин–макс
                          </span>
                        </label>
                      ) : null}
                    </div>
                  );
                })}
                {extras.map((ex) => {
                  const ek = extraDimStorageKey(ex.id);
                  const colRange = rangeMode && rangeKeysSet.has(ek);
                  return (
                    <div
                      key={ex.id}
                      className={cn('relative shrink-0', colRange ? 'w-[5.5rem]' : 'w-[5.5rem]')}
                    >
                      <button
                        type="button"
                        className="absolute -right-1 -top-1 z-[1] flex h-5 w-5 items-center justify-center rounded text-base leading-none text-red-600 hover:bg-red-50"
                        aria-label="Удалить мерку"
                        onClick={() => removeExtraDimension(ex.id)}
                      >
                        ×
                      </button>
                      <Input
                        className="text-text-secondary h-8 w-full px-1 pr-4 text-[9px] font-medium leading-tight"
                        value={ex.label}
                        onChange={(e) => {
                          const v = e.target.value;
                          setDossier((p: Workshop2DossierPhase1) => ({
                            ...p,
                            sampleBaseExtraDimensions: (p.sampleBaseExtraDimensions ?? []).map(
                              (x) => (x.id === ex.id ? { ...x, label: v } : x)
                            ),
                          }));
                        }}
                        aria-label="Подпись мерки"
                      />
                      {rangeMode ? (
                        <label className="mt-1 flex cursor-pointer items-center gap-1">
                          <Checkbox
                            checked={rangeKeysSet.has(ek)}
                            onCheckedChange={(c) => {
                              if (c === true) enableRangeForDimensionKey(ek);
                              else disableRangeForDimensionKey(ek);
                            }}
                            className="h-3 w-3"
                          />
                          <span className="text-text-secondary text-[8px] leading-none">
                            мин–макс
                          </span>
                        </label>
                      ) : null}
                    </div>
                  );
                })}
                <div className="w-[4.5rem] shrink-0 pb-2" aria-hidden />
                <div className="w-9 shrink-0" aria-hidden />
              </div>
              {handbookParts.map((part, idx) => (
                <div
                  key={part.id || part.parameterId}
                  className="border-border-subtle group flex flex-nowrap items-start gap-x-2 gap-y-2 border-b pb-3 last:border-0 last:pb-0"
                  aria-label={sizeLineForPart(part)}
                >
                  <div className="flex min-h-9 min-w-[4.5rem] max-w-[9rem] shrink-0 items-center">
                    <span className="text-text-primary text-sm font-medium leading-snug">
                      {sizeLineForPart(part)}
                    </span>
                    <div className="ml-1 flex flex-col rounded border border-slate-100 bg-slate-50">
                      <button
                        type="button"
                        className="p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                        onClick={() => movePart(idx, 'up')}
                        disabled={idx === 0}
                        title="Поднять вверх"
                      >
                        <LucideIcons.ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        className="p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                        onClick={() => movePart(idx, 'down')}
                        disabled={idx === handbookParts.length - 1}
                        title="Опустить вниз"
                      >
                        <LucideIcons.ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  {visibleDimLabels.map((canon) => {
                    const aria = dossier.sampleBaseDimensionLabelOverrides?.[canon] ?? canon;
                    const useRange = rangeMode && rangeKeysSet.has(canon);
                    const rc = rangeForCell(part.parameterId, canon, idx);
                    return (
                      <div
                        key={`${part.parameterId}-${canon}`}
                        className={cn('shrink-0', useRange ? 'w-[5rem]' : 'w-[5rem]')}
                      >
                        {useRange ? (
                          <div className="flex flex-col gap-1">
                            <Input
                              className="h-8 px-1 text-[10px]"
                              inputMode="text"
                              placeholder="номинал"
                              title={`${aria} — номинал для артикула`}
                              aria-label={`${aria}, номинал для артикула`}
                              value={rc.nominal}
                              onChange={(e) =>
                                patchRangeCell(part.parameterId, canon, 'nominal', e.target.value)
                              }
                            />
                            <div className="flex items-stretch gap-0.5">
                              <Input
                                className="h-8 min-w-0 flex-1 px-1 text-[10px]"
                                inputMode="decimal"
                                placeholder="мин"
                                title={`${aria} — мин`}
                                aria-label={`${aria}, мин`}
                                value={rc.min}
                                onChange={(e) =>
                                  patchRangeCell(part.parameterId, canon, 'min', e.target.value)
                                }
                              />
                              <Input
                                className="h-8 min-w-0 flex-1 px-1 text-[10px]"
                                inputMode="decimal"
                                placeholder="макс"
                                title={`${aria} — макс`}
                                aria-label={`${aria}, макс`}
                                value={rc.max}
                                onChange={(e) =>
                                  patchRangeCell(part.parameterId, canon, 'max', e.target.value)
                                }
                              />
                            </div>
                            <div className="grid w-full grid-cols-5 justify-items-center gap-0">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-text-primary h-4 w-4 shrink-0 rounded-none border-0 bg-transparent p-0 text-[10px] shadow-none hover:bg-transparent"
                                title={`${aria} — уменьшить мин`}
                                disabled={!hasNumericMinMax(rc.min, rc.max)}
                                onClick={() => {
                                  const v = adjustRangeBoundByStep(rc.min, rc.max, 'min', -1);
                                  if (v) patchRangeCell(part.parameterId, canon, 'min', v);
                                }}
                              >
                                -
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-text-primary h-4 w-4 shrink-0 rounded-none border-0 bg-transparent p-0 text-[10px] shadow-none hover:bg-transparent"
                                title={`${aria} — увеличить мин`}
                                disabled={!hasNumericMinMax(rc.min, rc.max)}
                                onClick={() => {
                                  const v = adjustRangeBoundByStep(rc.min, rc.max, 'min', 1);
                                  if (v) patchRangeCell(part.parameterId, canon, 'min', v);
                                }}
                              >
                                +
                              </Button>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-text-secondary h-4 w-4 shrink-0 rounded-none border-0 bg-transparent p-0 shadow-none hover:bg-transparent"
                                    aria-label={`${aria} — середина`}
                                    disabled={!midpointNominalSuggestion(rc.min, rc.max)}
                                    onClick={() => {
                                      const m = midpointNominalSuggestion(rc.min, rc.max);
                                      if (m) patchRangeCell(part.parameterId, canon, 'nominal', m);
                                    }}
                                  >
                                    <LucideIcons.MoveHorizontal className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">
                                  середина
                                </TooltipContent>
                              </Tooltip>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-text-primary h-4 w-4 shrink-0 rounded-none border-0 bg-transparent p-0 text-[10px] shadow-none hover:bg-transparent"
                                title={`${aria} — уменьшить макс`}
                                disabled={!hasNumericMinMax(rc.min, rc.max)}
                                onClick={() => {
                                  const v = adjustRangeBoundByStep(rc.min, rc.max, 'max', -1);
                                  if (v) patchRangeCell(part.parameterId, canon, 'max', v);
                                }}
                              >
                                -
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-text-primary h-4 w-4 shrink-0 rounded-none border-0 bg-transparent p-0 text-[10px] shadow-none hover:bg-transparent"
                                title={`${aria} — увеличить макс`}
                                disabled={!hasNumericMinMax(rc.min, rc.max)}
                                onClick={() => {
                                  const v = adjustRangeBoundByStep(rc.min, rc.max, 'max', 1);
                                  if (v) patchRangeCell(part.parameterId, canon, 'max', v);
                                }}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Input
                            className="h-9 px-2 text-xs"
                            inputMode="decimal"
                            placeholder="см"
                            title={aria}
                            aria-label={aria}
                            value={dimValue(part.parameterId, canon, idx)}
                            onChange={(e) => {
                              const v = e.target.value;
                              setDossier((p: Workshop2DossierPhase1) => ({
                                ...p,
                                sampleBasePerSizeDimensions: {
                                  ...p.sampleBasePerSizeDimensions,
                                  [part.parameterId]: {
                                    ...(p.sampleBasePerSizeDimensions?.[part.parameterId] ?? {}),
                                    [canon]: v,
                                  },
                                },
                              }));
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                  {extras.map((ex) => {
                    const ek = extraDimStorageKey(ex.id);
                    const useRange = rangeMode && rangeKeysSet.has(ek);
                    const rc = rangeForCell(part.parameterId, ek, idx);
                    const ariaEx = ex.label.trim() || 'Доп. мерка';
                    return (
                      <div
                        key={`${part.parameterId}-${ex.id}`}
                        className={cn('shrink-0', useRange ? 'w-[5.5rem]' : 'w-[5.5rem]')}
                      >
                        {useRange ? (
                          <div className="flex flex-col gap-1">
                            <Input
                              className="h-8 px-1 text-[10px]"
                              inputMode="text"
                              placeholder="номинал"
                              aria-label={`${ariaEx}, номинал для артикула`}
                              value={rc.nominal}
                              onChange={(e) =>
                                patchRangeCell(part.parameterId, ek, 'nominal', e.target.value)
                              }
                            />
                            <div className="flex items-stretch gap-0.5">
                              <Input
                                className="h-8 min-w-0 flex-1 px-1 text-[10px]"
                                inputMode="decimal"
                                placeholder="мин"
                                aria-label={`${ariaEx}, мин`}
                                value={rc.min}
                                onChange={(e) =>
                                  patchRangeCell(part.parameterId, ek, 'min', e.target.value)
                                }
                              />
                              <Input
                                className="h-8 min-w-0 flex-1 px-1 text-[10px]"
                                inputMode="decimal"
                                placeholder="макс"
                                aria-label={`${ariaEx}, макс`}
                                value={rc.max}
                                onChange={(e) =>
                                  patchRangeCell(part.parameterId, ek, 'max', e.target.value)
                                }
                              />
                            </div>
                            <div className="grid w-full grid-cols-5 justify-items-center gap-0">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-text-primary h-4 w-4 shrink-0 rounded-none border-0 bg-transparent p-0 text-[10px] shadow-none hover:bg-transparent"
                                title={`${ariaEx} — уменьшить мин`}
                                disabled={!hasNumericMinMax(rc.min, rc.max)}
                                onClick={() => {
                                  const v = adjustRangeBoundByStep(rc.min, rc.max, 'min', -1);
                                  if (v) patchRangeCell(part.parameterId, ek, 'min', v);
                                }}
                              >
                                -
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-text-primary h-4 w-4 shrink-0 rounded-none border-0 bg-transparent p-0 text-[10px] shadow-none hover:bg-transparent"
                                title={`${ariaEx} — увеличить мин`}
                                disabled={!hasNumericMinMax(rc.min, rc.max)}
                                onClick={() => {
                                  const v = adjustRangeBoundByStep(rc.min, rc.max, 'min', 1);
                                  if (v) patchRangeCell(part.parameterId, ek, 'min', v);
                                }}
                              >
                                +
                              </Button>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-text-secondary h-4 w-4 shrink-0 rounded-none border-0 bg-transparent p-0 shadow-none hover:bg-transparent"
                                    aria-label={`${ariaEx} — середина`}
                                    disabled={!midpointNominalSuggestion(rc.min, rc.max)}
                                    onClick={() => {
                                      const m = midpointNominalSuggestion(rc.min, rc.max);
                                      if (m) patchRangeCell(part.parameterId, ek, 'nominal', m);
                                    }}
                                  >
                                    <LucideIcons.MoveHorizontal className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs">
                                  середина
                                </TooltipContent>
                              </Tooltip>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-text-primary h-4 w-4 shrink-0 rounded-none border-0 bg-transparent p-0 text-[10px] shadow-none hover:bg-transparent"
                                title={`${ariaEx} — уменьшить макс`}
                                disabled={!hasNumericMinMax(rc.min, rc.max)}
                                onClick={() => {
                                  const v = adjustRangeBoundByStep(rc.min, rc.max, 'max', -1);
                                  if (v) patchRangeCell(part.parameterId, ek, 'max', v);
                                }}
                              >
                                -
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-text-primary h-4 w-4 shrink-0 rounded-none border-0 bg-transparent p-0 text-[10px] shadow-none hover:bg-transparent"
                                title={`${ariaEx} — увеличить макс`}
                                disabled={!hasNumericMinMax(rc.min, rc.max)}
                                onClick={() => {
                                  const v = adjustRangeBoundByStep(rc.min, rc.max, 'max', 1);
                                  if (v) patchRangeCell(part.parameterId, ek, 'max', v);
                                }}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Input
                            className="h-9 px-2 text-xs"
                            inputMode="decimal"
                            placeholder="см"
                            aria-label={ariaEx}
                            value={dimValue(part.parameterId, ek, idx)}
                            onChange={(e) => {
                              const v = e.target.value;
                              setDossier((p: Workshop2DossierPhase1) => ({
                                ...p,
                                sampleBasePerSizeDimensions: {
                                  ...p.sampleBasePerSizeDimensions,
                                  [part.parameterId]: {
                                    ...(p.sampleBasePerSizeDimensions?.[part.parameterId] ?? {}),
                                    [ek]: v,
                                  },
                                },
                              }));
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                  <div className="w-[4.5rem] shrink-0">
                    <Input
                      className="h-9 px-1.5 text-center text-xs"
                      inputMode="numeric"
                      placeholder="—"
                      aria-label={`Количество шт, ${sizeLineForPart(part)}`}
                      title={`Максимум для этой строки: ${maxPiecesForPid(part.parameterId)}`}
                      value={
                        pieceQtyMap[part.parameterId] != null && pieceQtyMap[part.parameterId]! > 0
                          ? String(pieceQtyMap[part.parameterId])
                          : ''
                      }
                      onChange={(e) => patchPieceQty(part.parameterId, e.target.value)}
                      min={0}
                      max={maxPiecesForPid(part.parameterId)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 shrink-0 p-0 text-lg font-medium leading-none"
                    onClick={addExtraDimension}
                    aria-label="Добавить мерку"
                  >
                    +
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
