'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Workshop2DossierPhase1, Workshop2GradingRow } from '@/lib/production/workshop2-dossier-phase1.types';
import {
  getWorkshopDimensionLabels,
  getWorkshopMeasurementPointAddSuggestions,
  getWorkshopParametersForSampleScale,
  getWorkshopSampleSizeScaleOptions,
} from '@/lib/production/workshop-size-handbook';
import {
  mapLinearGradingPresetsToRows,
  serializeWorkshopGradingSnapshot,
  W2_LINEAR_GRADING_PRESETS,
} from '@/lib/production/workshop2-grading-linear';
import { buildGradingRulesFromSampleBase, mergeBuiltGradingPreservingFrozen, pushGradingRulesToSampleDimensions, workshop2SampleBaseSizeRowParts } from '@/lib/production/workshop2-grading-from-sample-base';

const generateId = () => globalThis.crypto.randomUUID();

export type Workshop2GradingMatrixPanelProps = {
  dossier: Workshop2DossierPhase1;
  setDossier: React.Dispatch<React.SetStateAction<Workshop2DossierPhase1>>;
  disabled?: boolean;
  categoryLeafId?: string;
  currentLeaf?: any;
  sizeTableSlot?: React.ReactNode;
};

export function Workshop2GradingMatrixPanel({
  dossier,
  setDossier,
  disabled,
  categoryLeafId,
  currentLeaf,
  sizeTableSlot,
}: Workshop2GradingMatrixPanelProps) {
  const l1 = currentLeaf?.l1Name?.toLowerCase() || '';
  const isShoes = categoryLeafId?.startsWith('catalog-shoes') || l1.includes('обувь') || l1.includes('shoes') || l1.includes('footwear') || false;

  const isBags = categoryLeafId?.startsWith('catalog-bags') || l1.includes('сумки') || l1.includes('bags') || false;

  const safeCurrentLeaf =
    currentLeaf ||
    (categoryLeafId
      ? {
          leafId: categoryLeafId,
          l1Name: isShoes ? 'Обувь' : isBags ? 'Сумки' : 'Одежда (основная)',
          audienceId: dossier.selectedAudienceId || 'unisex',
        }
      : undefined);

  const scaleOptions = useMemo(() => {
    if (!safeCurrentLeaf) return [];
    return getWorkshopSampleSizeScaleOptions(safeCurrentLeaf, dossier.isUnisex);
  }, [safeCurrentLeaf, dossier.isUnisex]);

  const effectiveScaleId = dossier.sampleSizeScaleId ?? scaleOptions[0]?.key;

  const selectedSizes = useMemo(() => {
    const assign = dossier.assignments?.find((a) => a.attributeId === 'sampleBaseSize');
    if (!assign || !assign.values || assign.values.length === 0) return undefined;
    const uniq: string[] = [];
    const seen = new Set<string>();
    
    for (const v of assign.values) {
      if (v.valueSource === 'handbook_parameter') {
        const lbl = v.displayLabel || v.parameterId?.split(':').pop() || '';
        if (!seen.has(lbl)) {
          seen.add(lbl);
          uniq.push(lbl);
        }
      } else if (v.valueSource === 'free_text' && v.text) {
        const parts = v.text
          .split(';')
          .map((s: string) => s.trim())
          .filter(Boolean);
        for (const p of parts) {
          if (!seen.has(p)) {
            seen.add(p);
            uniq.push(p);
          }
        }
      }
    }
    return uniq.length > 0 ? uniq : undefined;
  }, [dossier.assignments]);

  const dynamicSizes = useMemo(() => {
    if (safeCurrentLeaf && effectiveScaleId) {
      const params = getWorkshopParametersForSampleScale(
        safeCurrentLeaf,
        effectiveScaleId,
        dossier.isUnisex
      );
      if (params && params.length > 0) {
        if (selectedSizes && selectedSizes.length > 0) {
          return selectedSizes;
        }
        return params.map((p) => p.label);
      }
    }
    return undefined;
  }, [safeCurrentLeaf, effectiveScaleId, dossier.isUnisex, selectedSizes]);

  const defaultSizes = useMemo(
    () => dynamicSizes ?? (isShoes ? ['39', '40', '41', '42', '43', '44'] : ['XS', 'S', 'M', 'L', 'XL']),
    [dynamicSizes, isShoes]
  );

  const sizes = useMemo(
    () => Array.from(new Set(dossier.gradingSizes ?? defaultSizes)),
    [dossier.gradingSizes, defaultSizes]
  );
  const dimLabels = useMemo(() => getWorkshopDimensionLabels(safeCurrentLeaf, dossier.isUnisex), [safeCurrentLeaf, dossier.isUnisex]);
  const hiddenDimSet = useMemo(() => new Set(dossier.sampleBaseHiddenDimensionKeys ?? []), [dossier.sampleBaseHiddenDimensionKeys]);
  const visibleDimLabels = useMemo(
    () => dimLabels.filter((d: string) => !hiddenDimSet.has(d)),
    [dimLabels, hiddenDimSet]
  );
  const extras = dossier.sampleBaseExtraDimensions ?? [];

  const measurementPoints = useMemo(() => {
    const points: Array<{ id: string; pointName: string; dimKey: string }> = [];
    for (const canon of visibleDimLabels) {
      points.push({
        id: canon,
        pointName: dossier.sampleBaseDimensionLabelOverrides?.[canon] ?? canon,
        dimKey: canon,
      });
    }
    for (const ex of extras) {
      points.push({
        id: ex.id,
        pointName: ex.label.trim() || 'Доп. мерка',
        dimKey: `__extra:${ex.id}`,
      });
    }
    return points;
  }, [visibleDimLabels, extras, dossier.sampleBaseDimensionLabelOverrides]);

  const pointsForSync = useMemo(
    () => measurementPoints.map((mp) => ({ id: mp.id, pointName: mp.pointName, dimKey: mp.dimKey })),
    [measurementPoints]
  );

  const measurementPointSuggestions = useMemo(
    () =>
      getWorkshopMeasurementPointAddSuggestions(safeCurrentLeaf, dossier.isUnisex, {
        visibleDimLabels,
        hiddenDimKeys: dossier.sampleBaseHiddenDimensionKeys ?? [],
        extraLabels: extras.map((e) => e.label),
      }),
    [
      safeCurrentLeaf,
      dossier.isUnisex,
      visibleDimLabels,
      dossier.sampleBaseHiddenDimensionKeys,
      extras,
    ]
  );

  /** Снимок верхнего табеля + набора строк градации: при изменении подтягиваем матрицу, если пользователь не правил градацию вручную. */
  const sampleTableSyncKey = useMemo(() => {
    return JSON.stringify({
      dims: dossier.sampleBasePerSizeDimensions ?? {},
      ranges: dossier.sampleBasePerSizeDimensionRanges ?? {},
      rows: workshop2SampleBaseSizeRowParts(dossier),
      dimKeys: measurementPoints.map((p) => p.dimKey),
    });
  }, [
    dossier.sampleBasePerSizeDimensions,
    dossier.sampleBasePerSizeDimensionRanges,
    dossier.assignments,
    measurementPoints,
  ]);

  const rules = useMemo<Workshop2GradingRow[]>(() => {
    return measurementPoints.map(mp => {
      const existing = (dossier.gradingRules ?? []).find(r => r.id === mp.id || r.pointName === mp.pointName);
      return existing ?? {
        id: mp.id,
        pointName: mp.pointName,
        baseMeasurement: 0,
        increments: sizes.reduce<Record<string, number>>((acc, size) => ({ ...acc, [size]: 0 }), {}),
        gradingStep: 0,
      };
    });
  }, [measurementPoints, dossier.gradingRules, sizes]);

  const baseSizeLabel = dossier.sampleBaseSizeLabel || (isShoes ? '41' : 'M');
  const baseIndex = sizes.indexOf(baseSizeLabel) >= 0 ? sizes.indexOf(baseSizeLabel) : Math.floor(sizes.length / 2);
  const effectiveBaseSizeLabel = sizes[baseIndex] || baseSizeLabel;

  const prevSampleTableSyncKeyRef = useRef<string | null>(null);

  /** Ручные правки в таблице градации — блокируем автосброс правил при смене линейки размеров из справочника. */
  const gradingUserEditedRef = useRef(false);
  const [scaleSyncBlocked, setScaleSyncBlocked] = useState(false);

  useEffect(() => {
    const shouldProtectRules =
      gradingUserEditedRef.current && (dossier.gradingRules?.length ?? 0) > 0;

    if (
      !shouldProtectRules &&
      isShoes &&
      dossier.gradingSizes &&
      (dossier.gradingSizes.includes('M') || dossier.gradingSizes.includes('ONE SIZE'))
    ) {
      setDossier((prev) => ({ ...prev, gradingSizes: undefined, gradingRules: undefined }));
      gradingUserEditedRef.current = false;
      setScaleSyncBlocked(false);
      return;
    }
    if (
      !shouldProtectRules &&
      !isShoes &&
      dossier.gradingSizes &&
      dossier.gradingSizes.includes('41')
    ) {
      setDossier((prev) => ({ ...prev, gradingSizes: undefined, gradingRules: undefined }));
      gradingUserEditedRef.current = false;
      setScaleSyncBlocked(false);
      return;
    }

    if (!dynamicSizes) return;

    if (!dossier.gradingSizes) {
      setDossier((prev) => ({ ...prev, gradingSizes: dynamicSizes }));
      return;
    }

    const currentStr = dossier.gradingSizes.join(',');
    const dynamicStr = dynamicSizes.join(',');
    if (currentStr === dynamicStr) {
      setScaleSyncBlocked(false);
      return;
    }

    if (shouldProtectRules) {
      setScaleSyncBlocked(true);
      return;
    }

    setScaleSyncBlocked(false);
    setDossier((prev) => ({ ...prev, gradingSizes: dynamicSizes, gradingRules: undefined }));
  }, [isShoes, dossier.gradingSizes, dossier.gradingRules, setDossier, dynamicSizes]);

  /** Подтяжка нижней матрицы из верхнего табеля при правках ячеек (не перетираем после ручной градации). */
  useEffect(() => {
    const prevKey = prevSampleTableSyncKeyRef.current;
    if (prevKey !== null && prevKey === sampleTableSyncKey) return;
    const isFirstPaint = prevKey === null;
    prevSampleTableSyncKeyRef.current = sampleTableSyncKey;

    const applyFromSample = (prev: Workshop2DossierPhase1) => {
      const nextRaw = buildGradingRulesFromSampleBase(prev, {
        sizes,
        baseSizeLabel: effectiveBaseSizeLabel,
        points: pointsForSync,
      });
      const next = mergeBuiltGradingPreservingFrozen(prev.gradingRules, nextRaw);
      if (!next?.length) return prev;
      if (
        !isFirstPaint &&
        serializeWorkshopGradingSnapshot(sizes, next) ===
          serializeWorkshopGradingSnapshot(prev.gradingSizes, prev.gradingRules)
      ) {
        return prev;
      }
      if (isFirstPaint && (prev.gradingRules?.length ?? 0) > 0) return prev;
      return { ...prev, gradingRules: next, gradingSizes: sizes };
    };

    if (isFirstPaint) {
      setDossier((prev) => applyFromSample(prev));
      return;
    }

    const timer = window.setTimeout(() => {
      setDossier((prev) => applyFromSample(prev));
    }, 380);
    return () => window.clearTimeout(timer);
  }, [sampleTableSyncKey, sizes, effectiveBaseSizeLabel, pointsForSync, setDossier]);

  /** Новые/удалённые колонки размеров — добиваем ключи приращений без сброса значений. */
  useEffect(() => {
    const list = sizes;
    if (!list.length) return;
    const keySet = new Set(list);
    setDossier((prev) => {
      const gr = prev.gradingRules;
      if (!gr?.length) return prev;
      let anyChanged = false;
      const next = gr.map((r) => {
        const inc = { ...r.increments };
        let rowChanged = false;
        for (const s of list) {
          if (!(s in inc)) {
            inc[s] = 0;
            rowChanged = true;
          }
        }
        for (const k of Object.keys(inc)) {
          if (!keySet.has(k)) {
            delete inc[k];
            rowChanged = true;
          }
        }
        if (!rowChanged) return r;
        anyChanged = true;
        return { ...r, increments: inc };
      });
      return anyChanged ? { ...prev, gradingRules: next } : prev;
    });
  }, [sizes.join('\u001f'), setDossier]);

  const markGradingUserEdited = useCallback(() => {
    gradingUserEditedRef.current = true;
  }, []);

  const moveColumn = useCallback((index: number, direction: 'left' | 'right') => {
    setDossier(p => {
      const newSizes = [...(p.gradingSizes ?? sizes)];
      const newIdx = direction === 'left' ? index - 1 : index + 1;
      if (newIdx < 0 || newIdx >= newSizes.length) return p;
      
      [newSizes[index], newSizes[newIdx]] = [newSizes[newIdx], newSizes[index]];
      return { ...p, gradingSizes: newSizes };
    });
    markGradingUserEdited();
  }, [sizes, setDossier, markGradingUserEdited]);

  const applyHandbookSizeColumns = useCallback(() => {
    if (!dynamicSizes?.length) return;
    gradingUserEditedRef.current = false;
    setScaleSyncBlocked(false);
    setDossier((prev) => ({
      ...prev,
      gradingSizes: [...dynamicSizes],
      gradingRules: undefined,
    }));
  }, [dynamicSizes, setDossier]);

  const handleAutoGenerate = () => {
    const centerIdx = baseIndex;
    gradingUserEditedRef.current = false;
    setScaleSyncBlocked(false);

    const fromSample = buildGradingRulesFromSampleBase(dossier, {
      sizes,
      baseSizeLabel: effectiveBaseSizeLabel,
      points: pointsForSync,
    });
    const merged = mergeBuiltGradingPreservingFrozen(dossier.gradingRules, fromSample);

    if (merged?.length) {
      const withRules = { ...dossier, gradingRules: merged };
      const dimPatch = pushGradingRulesToSampleDimensions(
        withRules,
        { sizes, baseLabel: effectiveBaseSizeLabel },
        merged,
        pointsForSync
      );
      setDossier((prev) => ({
        ...prev,
        gradingSizes: sizes,
        gradingRules: merged,
        ...dimPatch,
      }));
      return;
    }

    const defs = isShoes
      ? W2_LINEAR_GRADING_PRESETS.shoes_auto
      : isBags
        ? W2_LINEAR_GRADING_PRESETS.bags_auto
        : W2_LINEAR_GRADING_PRESETS.apparel_auto;

    const nextRules = mapLinearGradingPresetsToRows(sizes, centerIdx, defs, generateId);
    const syncedRules = measurementPoints.map((mp, i) => {
      const prevRule = dossier.gradingRules?.find((r) => r.id === mp.id);
      if (prevRule?.gradingFrozen) return prevRule;
      const preset = nextRules[Math.min(i, nextRules.length - 1)]!;
      return {
        id: mp.id,
        pointName: mp.pointName,
        baseMeasurement: preset.baseMeasurement,
        increments: { ...preset.increments },
        gradingStep: prevRule?.gradingStep ?? 0,
        gradingFrozen: false,
      };
    });

    const withRules = { ...dossier, gradingRules: syncedRules };
    const dimPatch = pushGradingRulesToSampleDimensions(
      withRules,
      { sizes, baseLabel: effectiveBaseSizeLabel },
      syncedRules,
      pointsForSync
    );
    setDossier((prev) => ({
      ...prev,
      gradingSizes: sizes,
      gradingRules: syncedRules,
      ...dimPatch,
    }));
  };

  const handle3DBodyScanGenerate = () => {
    const centerIdx = baseIndex;
    gradingUserEditedRef.current = false;
    setScaleSyncBlocked(false);

    const fromSample = buildGradingRulesFromSampleBase(dossier, {
      sizes,
      baseSizeLabel: effectiveBaseSizeLabel,
      points: pointsForSync,
    });
    const merged = mergeBuiltGradingPreservingFrozen(dossier.gradingRules, fromSample);

    if (merged?.length) {
      const withRules = { ...dossier, gradingRules: merged };
      const dimPatch = pushGradingRulesToSampleDimensions(
        withRules,
        { sizes, baseLabel: effectiveBaseSizeLabel },
        merged,
        pointsForSync
      );
      setDossier((prev) => ({
        ...prev,
        gradingSizes: sizes,
        gradingRules: merged,
        ...dimPatch,
      }));
      return;
    }

    const defs = isShoes
      ? W2_LINEAR_GRADING_PRESETS.shoes_3d
      : isBags
        ? W2_LINEAR_GRADING_PRESETS.bags_3d
        : W2_LINEAR_GRADING_PRESETS.apparel_3d;

    const nextRules = mapLinearGradingPresetsToRows(sizes, centerIdx, defs, generateId);
    const syncedRules = measurementPoints.map((mp, i) => {
      const prevRule = dossier.gradingRules?.find((r) => r.id === mp.id);
      if (prevRule?.gradingFrozen) return prevRule;
      const preset = nextRules[Math.min(i, nextRules.length - 1)]!;
      return {
        id: mp.id,
        pointName: mp.pointName,
        baseMeasurement: preset.baseMeasurement,
        increments: { ...preset.increments },
        gradingStep: prevRule?.gradingStep ?? 0,
        gradingFrozen: false,
      };
    });

    const withRules = { ...dossier, gradingRules: syncedRules };
    const dimPatch = pushGradingRulesToSampleDimensions(
      withRules,
      { sizes, baseLabel: effectiveBaseSizeLabel },
      syncedRules,
      pointsForSync
    );
    setDossier((prev) => ({
      ...prev,
      gradingSizes: sizes,
      gradingRules: syncedRules,
      ...dimPatch,
    }));
  };

  const addRow = () => {
    markGradingUserEdited();
    setDossier((prev) => {
      const e = prev.sampleBaseExtraDimensions ?? [];
      const newId = generateId();
      return { ...prev, sampleBaseExtraDimensions: [...e, { id: newId, label: 'Новая точка измерения' }] };
    });
  };

  const restoreStandardDimension = (canonKey: string) => {
    setDossier((prev) => ({
      ...prev,
      sampleBaseHiddenDimensionKeys: (prev.sampleBaseHiddenDimensionKeys ?? []).filter((k) => k !== canonKey),
    }));
  };

  const addMeasurementPointFromSuggestion = (label: string, kind: 'restore' | 'extra') => {
    if (kind === 'restore') {
      restoreStandardDimension(label);
      return;
    }
    if (dimLabels.includes(label)) {
      restoreStandardDimension(label);
      return;
    }
    markGradingUserEdited();
    setDossier((prev) => ({
      ...prev,
      sampleBaseExtraDimensions: [
        ...(prev.sampleBaseExtraDimensions ?? []),
        { id: generateId(), label },
      ],
    }));
  };

  const removeRow = (id: string) => {
    markGradingUserEdited();
    setDossier((prev) => {
      const isCanon = visibleDimLabels.includes(id);
      if (isCanon) {
        return {
          ...prev,
          sampleBaseHiddenDimensionKeys: [...(prev.sampleBaseHiddenDimensionKeys ?? []), id],
        };
      } else {
        return {
          ...prev,
          sampleBaseExtraDimensions: (prev.sampleBaseExtraDimensions ?? []).filter((ex) => ex.id !== id),
        };
      }
    });
  };

  const updateRow = (id: string, field: keyof Workshop2GradingRow, value: any) => {
    markGradingUserEdited();
    setDossier((prev) => {
      const prevRule = prev.gradingRules?.find((r) => r.id === id);
      if (prevRule?.gradingFrozen && field !== 'gradingFrozen') {
        return prev;
      }

      // Sync pointName to top table's overrides or extras
      let nextDossier: Workshop2DossierPhase1 = { ...prev };
      if (field === 'pointName') {
        const isCanon = visibleDimLabels.includes(id);
        if (isCanon) {
          const nextOverrides = { ...(prev.sampleBaseDimensionLabelOverrides ?? {}) };
          if (value === id || !value.trim()) delete nextOverrides[id];
          else nextOverrides[id] = value;
          nextDossier = {
            ...nextDossier,
            sampleBaseDimensionLabelOverrides: Object.keys(nextOverrides).length > 0 ? nextOverrides : undefined,
          };
        } else {
          nextDossier = {
            ...nextDossier,
            sampleBaseExtraDimensions: (prev.sampleBaseExtraDimensions ?? []).map((ex) =>
              ex.id === id ? { ...ex, label: value } : ex
            ),
          };
        }
      }

      if (field === 'baseMeasurement' || field === 'increments') {
        const existingRules = nextDossier.gradingRules ?? [];
        const ruleIdx = existingRules.findIndex((r) => r.id === id);
        const newRules = [...existingRules];
        if (ruleIdx >= 0) {
          newRules[ruleIdx] = { ...newRules[ruleIdx]!, [field]: value };
        } else {
          newRules.push({
            id,
            pointName: measurementPoints.find((p) => p.id === id)?.pointName ?? '',
            baseMeasurement: field === 'baseMeasurement' ? value : 0,
            increments:
              field === 'increments'
                ? (value as Record<string, number>)
                : ({} as Record<string, number>),
          });
        }
        nextDossier = { ...nextDossier, gradingRules: newRules };
        const withRules = { ...nextDossier, gradingRules: newRules };
        const dimPatch = pushGradingRulesToSampleDimensions(
          withRules,
          { sizes, baseLabel: effectiveBaseSizeLabel },
          newRules,
          pointsForSync
        );
        nextDossier = { ...withRules, ...dimPatch };
      }
      return nextDossier;
    });
  };

  const toggleGradingFrozen = (id: string) => {
    setDossier((prev) => {
      const gr = [...(prev.gradingRules ?? [])];
      const ruleIdx = gr.findIndex((r) => r.id === id);
      if (ruleIdx < 0) return prev;
      const cur = gr[ruleIdx]!;
      gr[ruleIdx] = { ...cur, gradingFrozen: !cur.gradingFrozen };
      return { ...prev, gradingRules: gr };
    });
  };

  const updateStep = (id: string, step: number) => {
    markGradingUserEdited();
    setDossier((prev) => {
      const existingRules = prev.gradingRules ?? [];
      const ruleIdx = existingRules.findIndex((r) => r.id === id);
      if (ruleIdx >= 0 && existingRules[ruleIdx]?.gradingFrozen) return prev;

      const newRules = [...existingRules];
      
      const currentRule = ruleIdx >= 0 ? newRules[ruleIdx]! : {
        id,
        pointName: measurementPoints.find(p => p.id === id)?.pointName ?? '',
        baseMeasurement: 0,
        increments: {} as Record<string, number>,
        gradingStep: 0,
      };

      const newIncrements = { ...currentRule.increments };
      
      // Применяем шаг ко всем размерам относительно базы
      sizes.forEach((size, idx) => {
        const diff = idx - baseIndex;
        newIncrements[size] = diff * step;
      });

      const updatedRule = { ...currentRule, gradingStep: step, increments: newIncrements };
      
      if (ruleIdx >= 0) {
        newRules[ruleIdx] = updatedRule;
      } else {
        newRules.push(updatedRule);
      }
      
      const withRules = { ...prev, gradingRules: newRules };
      return {
        ...withRules,
        ...pushGradingRulesToSampleDimensions(
          withRules,
          { sizes, baseLabel: effectiveBaseSizeLabel },
          newRules,
          pointsForSync
        ),
      };
    });
  };

  const updateIncrement = (id: string, size: string, value: number) => {
    markGradingUserEdited();
    setDossier((prev) => {
      const existingRules = prev.gradingRules ?? [];
      const ruleIdx = existingRules.findIndex((r) => r.id === id);
      if (ruleIdx >= 0 && existingRules[ruleIdx]?.gradingFrozen) return prev;

      const newRules = [...existingRules];
      
      if (ruleIdx >= 0) {
        const rule = newRules[ruleIdx]!;
        const newIncrements = { ...rule.increments, [size]: value };
        
        // Валидация: последовательность должна быть не убывающей
        const sizeIdx = sizes.indexOf(size);
        for (let i = sizeIdx + 1; i < sizes.length; i++) {
          const s = sizes[i];
          const currentVal = rule.baseMeasurement + newIncrements[size];
          const nextVal = rule.baseMeasurement + (newIncrements[s] || 0);
          if (nextVal < currentVal) {
            newIncrements[s] = currentVal - rule.baseMeasurement;
          }
        }
        for (let i = sizeIdx - 1; i >= 0; i--) {
          const s = sizes[i];
          const currentVal = rule.baseMeasurement + newIncrements[size];
          const prevVal = rule.baseMeasurement + (newIncrements[s] || 0);
          if (prevVal > currentVal) {
            newIncrements[s] = currentVal - rule.baseMeasurement;
          }
        }

        newRules[ruleIdx] = { ...rule, increments: newIncrements };
      } else {
        newRules.push({
          id,
          pointName: measurementPoints.find((p) => p.id === id)?.pointName ?? '',
          baseMeasurement: 0,
          increments: { [size]: value } as Record<string, number>,
          gradingStep: 0,
        });
      }
      const withRules = { ...prev, gradingRules: newRules };
      return {
        ...withRules,
        ...pushGradingRulesToSampleDimensions(
          withRules,
          { sizes, baseLabel: effectiveBaseSizeLabel },
          newRules,
          pointsForSync
        ),
      };
    });
  };

  const dynamicStrLabel = dynamicSizes?.join(', ') ?? '';

  return (
    <div className="border-border-default space-y-6 rounded-xl border bg-white p-4 shadow-sm">
      {/* 1. Основной заголовок и описание блока */}
      <div className="flex items-start gap-3">
        <div className="bg-indigo-100/50 text-indigo-600 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <LucideIcons.Scaling className="h-4 w-4 shrink-0" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-text-primary text-base font-semibold">Умная генерация и проверка градаций</h2>
          <p className="text-text-secondary text-xs leading-snug">
            Приросты по размерам в одной линейке с табелем мер по размерам выше: при совпадении шкалы данные
            подставляются автоматически; здесь можно править табель и экспортировать в производство.
          </p>
        </div>
      </div>

      {/* 2. Слот для выбора размеров и диапазонов (Workshop2SampleBaseSizeBlock) */}
      {sizeTableSlot && (
        <div className="border-border-subtle space-y-4 rounded-lg border border-dashed bg-bg-surface2/30 p-4">
          <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="text-text-primary text-sm font-semibold leading-none">Табель мер по размерам</h3>
            <p className="text-text-secondary text-[11px] leading-snug">
              Укажите базовый размер и диапазоны мерок (см, допуски) для производства. Задайте основные и дополнительные точки измерения.
            </p>
          </div>
          </div>
          <div className="pt-1">{sizeTableSlot}</div>
        </div>
      )}

      {/* 3. Кнопки управления и сама таблица градации */}
      <div className="border-t border-border-subtle pt-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="text-text-primary text-sm font-semibold leading-none">Матрица градации и приращений</h3>
            <p className="text-text-secondary text-[11px] leading-snug">
              Задайте автоматический шаг или ручные приращения (± см) для каждого размера относительно базы.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAutoGenerate}
              disabled={disabled || rules.length === 0}
              className="gap-1.5 h-8 text-[11px] text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border-indigo-200"
            >
              <LucideIcons.Wand2 className="h-3.5 w-3.5" />
              Авто-градация
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handle3DBodyScanGenerate}
              disabled={disabled || rules.length === 0}
              className="gap-1.5 h-8 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white border-transparent"
            >
              <LucideIcons.ScanLine className="h-3.5 w-3.5" />
              Авто по 3D-скану
            </Button>
          </div>
        </div>

        {scaleSyncBlocked && dynamicSizes ? (
        <div className="border-amber-200 bg-amber-50/80 text-amber-950 flex flex-col gap-2 rounded-lg border px-3 py-2 text-[11px] leading-snug">
          <div className="flex items-start gap-2">
            <LucideIcons.AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <div className="min-w-0">
              <p className="font-semibold">Смена линейки размеров не применена</p>
              <p className="text-amber-900/90 mt-0.5">
                В таблице есть ваши правки. Новая линейка из справочника:{' '}
                <span className="font-mono text-[10px]">{dynamicStrLabel}</span>. Сохранены текущие колонки и
                приращения. Чтобы перейти на новую линейку, сбросьте градацию (правила будут очищены).
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pl-6">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 text-[10px] border-amber-300 bg-white"
              disabled={disabled}
              onClick={applyHandbookSizeColumns}
            >
              Применить линейку из справочника (сбросить правила)
            </Button>
          </div>
        </div>
      ) : null}

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[12rem] max-w-[min(28rem,42vw)] whitespace-normal text-left align-bottom">
                Точка измерения
              </TableHead>
              <TableHead className="w-11 text-center align-bottom pb-2 px-0.5">
                <span className="text-[9px] font-bold uppercase tracking-wide text-text-muted" title="Зафиксировать строку: не меняется из табеля и не перезаписывается авто-градацией">
                  Фикс
                </span>
              </TableHead>
              <TableHead className="w-[120px] text-center align-bottom pb-2">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Авто-шаг</span>
                  <span className="text-[9px] text-text-muted">+/- см ко всем</span>
                </div>
              </TableHead>
              {sizes.map((size, idx) => {
                const isBase = size === effectiveBaseSizeLabel;
                return (
                  <TableHead key={size} className="text-center min-w-[120px] px-2 align-bottom pb-2">
                    <div className="flex flex-col items-center justify-end gap-1.5 w-full h-full">
                      <div className="flex items-center gap-1">
                        <span className={cn("font-semibold", isBase ? "text-red-600" : "text-text-primary")}>
                          {size}
                        </span>
                        {isBase && (
                          <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">(база)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded px-1 py-0.5">
                        <button
                          type="button"
                          onClick={() => moveColumn(idx, 'left')}
                          disabled={idx === 0 || disabled}
                          className="text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors p-0.5"
                          title="Сдвинуть влево"
                        >
                          <LucideIcons.ChevronLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveColumn(idx, 'right')}
                          disabled={idx === sizes.length - 1 || disabled}
                          className="text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors p-0.5"
                          title="Сдвинуть вправо"
                        >
                          <LucideIcons.ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </TableHead>
                );
              })}
              <TableHead className="w-[50px] text-right align-bottom pb-2 pr-4"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={sizes.length + 4} className="text-text-muted text-center py-8">
                  Нет правил градации. Нажмите «Авто-градация» или добавьте строки вручную.
                </TableCell>
              </TableRow>
            ) : (
              rules.map((rule) => {
                const maxAbsolute = Math.max(
                  ...sizes.map((s) => rule.baseMeasurement + (rule.increments[s] || 0)),
                  rule.baseMeasurement,
                  1
                );
                const frozen = Boolean(rule.gradingFrozen);

                return (
                  <TableRow key={rule.id}>
                    <TableCell className="min-w-[12rem] max-w-[min(28rem,42vw)] align-top pt-2">
                      <Input
                        value={rule.pointName}
                        title={rule.pointName}
                        onChange={(e) => updateRow(rule.id, 'pointName', e.target.value)}
                        disabled={disabled || frozen}
                        className="h-auto min-h-8 min-w-0 w-full whitespace-normal text-xs font-medium leading-snug border-transparent hover:border-border-default focus:border-accent-primary bg-transparent focus:bg-bg-surface transition-all py-1.5"
                        placeholder="Название точки"
                      />
                    </TableCell>
                    <TableCell className="w-11 align-top px-1 pt-2">
                      <div className="flex justify-center pt-1">
                        <Checkbox
                          checked={frozen}
                          onCheckedChange={() => toggleGradingFrozen(rule.id)}
                          disabled={disabled}
                          className="h-4 w-4 border-slate-300 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                          title="Зафиксировать параметр"
                          aria-label="Зафиксировать строку градации"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="align-top px-2 pt-2">
                      <div className="flex flex-col items-center gap-1">
                        <Input
                          type="number"
                          step="0.1"
                          value={rule.gradingStep ?? ''}
                          onChange={(e) => updateStep(rule.id, parseFloat(e.target.value) || 0)}
                          disabled={disabled || frozen}
                          className="h-8 w-20 text-xs text-center font-bold text-indigo-600 bg-indigo-50/30 border-indigo-100 focus:border-indigo-300"
                          placeholder="0.0"
                        />
                      </div>
                    </TableCell>
                    {sizes.map((size) => {
                      const isBase = size === effectiveBaseSizeLabel;
                      const inc = rule.increments[size] || 0;
                      const absolute = rule.baseMeasurement + inc;
                      const widthPct = Math.min(100, Math.max(0, (absolute / maxAbsolute) * 100));

                      return (
                        <TableCell key={size} className={cn("text-center align-top p-2", isBase && "bg-red-50/30")}>
                          <div className="flex flex-col items-center gap-1.5 w-full">
                            {isBase ? (
                              <Input
                                type="number"
                                value={rule.baseMeasurement || ''}
                                onChange={(e) =>
                                  updateRow(rule.id, 'baseMeasurement', parseFloat(e.target.value) || 0)
                                }
                                disabled={disabled || frozen}
                                className="h-7 w-20 text-xs text-center font-bold text-red-600 border-red-200 bg-white"
                              />
                            ) : (
                              <span className="text-text-primary text-xs font-semibold h-7 flex items-center">
                                {Number(absolute.toFixed(2))}
                              </span>
                            )}
                            <Input
                              type="number"
                              value={inc}
                              onChange={(e) =>
                                updateIncrement(rule.id, size, parseFloat(e.target.value) || 0)
                              }
                              disabled={disabled || isBase || frozen}
                              className={cn(
                                "h-6 w-16 text-center text-[10px]",
                                isBase ? "opacity-0 invisible" : "bg-slate-50 border-slate-200"
                              )}
                            />
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden flex items-center justify-start mt-1">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all duration-500 ease-out",
                                  isBase ? "bg-red-500" : "bg-indigo-500"
                                )}
                                style={{ width: `${widthPct}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-right align-top pr-4 pt-2">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeRow(rule.id)}
                          disabled={disabled || frozen}
                        >
                          <LucideIcons.Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>

    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={addRow}
        disabled={disabled}
        className="gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 shrink-0"
      >
        <LucideIcons.Plus className="h-3.5 w-3.5" />
        Добавить точку измерения
      </Button>
      {measurementPointSuggestions.length > 0 ? (
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          <span className="text-text-muted shrink-0 text-[10px]">из справочника:</span>
          {measurementPointSuggestions.map((s) => (
            <Button
              key={s.key}
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              className="h-7 max-w-full truncate px-2 text-[10px] font-medium border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-700"
              title={s.kind === 'restore' ? 'Вернуть колонку из справочника' : 'Добавить мерку из пресета'}
              onClick={() => addMeasurementPointFromSuggestion(s.label, s.kind)}
            >
              + {s.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
    </div>
  );
}
