'use client';

import { useCallback, useMemo, type Dispatch, type SetStateAction } from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type {
  Workshop2BomLineCostingHint,
  Workshop2BomLineDeltaDraft,
  Workshop2DossierViewProfile,
  Workshop2MaterialAlternativeDraft,
  Workshop2MaterialAlternativeStatus,
} from '@/lib/production/workshop2-dossier-view-infrastructure';
import {
  mergeCostingHintsByLineRef,
  W2_BOM_SAMPLE_DELTA_KIND_LABELS,
} from '@/lib/production/workshop2-dossier-nine-gap-infrastructure';
import { cn } from '@/lib/utils';

function newDraftId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `w2-${Date.now()}`;
}

const ALT_STATUS_OPTS: Workshop2MaterialAlternativeStatus[] = ['proposed', 'approved', 'rejected', 'superseded'];
const DELTA_KIND_OPTS = ['tz_baseline', 'sample_actual', 'production_series'] as const;
const DELTA_FIELD_OPTS = ['material', 'qty', 'supplier', 'color', 'other'] as const;

type Props = {
  dossier: Workshop2DossierPhase1;
  setDossier: Dispatch<SetStateAction<Workshop2DossierPhase1>>;
  dossierViewProfile: Workshop2DossierViewProfile;
  tzWriteDisabled?: boolean;
  updatedByLabel: string;
};

export function Workshop2DossierSupplyChainDraftsPanel({
  dossier,
  setDossier,
  dossierViewProfile,
  tzWriteDisabled = false,
  updatedByLabel,
}: Props) {
  const showAlts = useMemo(
    () =>
      ['full', 'supply', 'compliance', 'manager', 'technologist', 'production', 'qc'].includes(dossierViewProfile),
    [dossierViewProfile]
  );
  const showDelta = useMemo(
    () => ['full', 'supply', 'technologist', 'production', 'manager'].includes(dossierViewProfile),
    [dossierViewProfile]
  );
  const showCosting = useMemo(
    () => ['full', 'finance', 'manager', 'supply', 'technologist'].includes(dossierViewProfile),
    [dossierViewProfile]
  );

  const costingMerged = useMemo(
    () => mergeCostingHintsByLineRef(dossier.bomLineCostingHints ?? []),
    [dossier.bomLineCostingHints]
  );

  const addAlt = useCallback(() => {
    const row: Workshop2MaterialAlternativeDraft = {
      altId: newDraftId(),
      baseLabel: '',
      proposedLabel: '',
      status: 'proposed',
    };
    setDossier((prev) => ({
      ...prev,
      materialAlternativeDrafts: [...(prev.materialAlternativeDrafts ?? []), row],
    }));
  }, [setDossier]);

  const patchAlt = useCallback(
    (altId: string, patch: Partial<Workshop2MaterialAlternativeDraft>) => {
      setDossier((prev) => ({
        ...prev,
        materialAlternativeDrafts: (prev.materialAlternativeDrafts ?? []).map((r) =>
          r.altId === altId ? { ...r, ...patch } : r
        ),
      }));
    },
    [setDossier]
  );

  const removeAlt = useCallback(
    (altId: string) => {
      setDossier((prev) => ({
        ...prev,
        materialAlternativeDrafts: (prev.materialAlternativeDrafts ?? []).filter((r) => r.altId !== altId),
      }));
    },
    [setDossier]
  );

  const addDelta = useCallback(() => {
    const row: Workshop2BomLineDeltaDraft = {
      deltaId: newDraftId(),
      kind: 'tz_baseline',
      lineRef: '',
      field: 'material',
      beforeLabel: '',
      afterLabel: '',
      at: new Date().toISOString(),
      by: updatedByLabel.slice(0, 120),
    };
    setDossier((prev) => ({
      ...prev,
      bomLineDeltaDrafts: [...(prev.bomLineDeltaDrafts ?? []), row],
    }));
  }, [setDossier, updatedByLabel]);

  const patchDelta = useCallback(
    (deltaId: string, patch: Partial<Workshop2BomLineDeltaDraft>) => {
      setDossier((prev) => ({
        ...prev,
        bomLineDeltaDrafts: (prev.bomLineDeltaDrafts ?? []).map((r) =>
          r.deltaId === deltaId ? { ...r, ...patch } : r
        ),
      }));
    },
    [setDossier]
  );

  const removeDelta = useCallback(
    (deltaId: string) => {
      setDossier((prev) => ({
        ...prev,
        bomLineDeltaDrafts: (prev.bomLineDeltaDrafts ?? []).filter((r) => r.deltaId !== deltaId),
      }));
    },
    [setDossier]
  );

  const addCosting = useCallback(() => {
    const row: Workshop2BomLineCostingHint = { lineRef: '' };
    setDossier((prev) => ({
      ...prev,
      bomLineCostingHints: [...(prev.bomLineCostingHints ?? []), row],
    }));
  }, [setDossier]);

  const patchCostingAt = useCallback(
    (index: number, patch: Partial<Workshop2BomLineCostingHint>) => {
      setDossier((prev) => {
        const list = [...(prev.bomLineCostingHints ?? [])];
        const cur = list[index];
        if (!cur) return prev;
        list[index] = { ...cur, ...patch };
        return { ...prev, bomLineCostingHints: list };
      });
    },
    [setDossier]
  );

  const removeCostingAt = useCallback(
    (index: number) => {
      setDossier((prev) => ({
        ...prev,
        bomLineCostingHints: (prev.bomLineCostingHints ?? []).filter((_, i) => i !== index),
      }));
    },
    [setDossier]
  );

  if (!showAlts && !showDelta && !showCosting) return null;

  const ro = tzWriteDisabled;

  return (
    <div
      id="w2-material-supply-chain-drafts"
      className="scroll-mt-28 space-y-4 rounded-xl border border-violet-200/80 bg-violet-50/30 p-4 shadow-sm"
    >
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white shadow-sm">
          <LucideIcons.ClipboardList className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-slate-900">Снабжение · дельта · costing</h3>
          <p className="text-[11px] leading-snug text-slate-600">
            Черновики живут в объекте досье артикула (сохраняются вместе с ТЗ). Сшивка costing по последней записи на один
            и тот же <span className="font-mono">lineRef</span> (как в строках mat/BOM): {costingMerged.size} уникальных
            ref.
          </p>
        </div>
      </div>

      {showAlts ? (
        <section
          id="w2-material-sc-drafts-alts"
          className="scroll-mt-24 rounded-lg border border-white/80 bg-white/90 p-3 shadow-sm"
        >
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-violet-900">Альтернативы материала / BOM</p>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-7 text-[10px]"
              disabled={ro}
              onClick={addAlt}
            >
              Добавить строку
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-[9px] font-bold uppercase text-slate-500">
                  <th className="py-1.5 pr-2">База</th>
                  <th className="py-1.5 pr-2">Предложение</th>
                  <th className="py-1.5 pr-2">Причина</th>
                  <th className="py-1.5 pr-2">Статус</th>
                  <th className="w-10 py-1.5" />
                </tr>
              </thead>
              <tbody>
                {(dossier.materialAlternativeDrafts ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-3 text-slate-500">
                      Пока нет записей — добавьте согласованную замену или черновик для комплаенса.
                    </td>
                  </tr>
                ) : (
                  (dossier.materialAlternativeDrafts ?? []).map((r) => (
                    <tr key={r.altId} className="border-b border-slate-100 align-top">
                      <td className="py-1.5 pr-2">
                        <Input
                          className="h-8 text-[11px]"
                          value={r.baseLabel}
                          disabled={ro}
                          onChange={(e) => patchAlt(r.altId, { baseLabel: e.target.value })}
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <Input
                          className="h-8 text-[11px]"
                          value={r.proposedLabel}
                          disabled={ro}
                          onChange={(e) => patchAlt(r.altId, { proposedLabel: e.target.value })}
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <Input
                          className="h-8 text-[11px]"
                          value={r.reason ?? ''}
                          disabled={ro}
                          onChange={(e) => patchAlt(r.altId, { reason: e.target.value })}
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <select
                          className={cn(
                            'h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-[11px]',
                            ro && 'opacity-60'
                          )}
                          value={r.status}
                          disabled={ro}
                          onChange={(e) =>
                            patchAlt(r.altId, { status: e.target.value as Workshop2MaterialAlternativeStatus })
                          }
                        >
                          {ALT_STATUS_OPTS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-500"
                          disabled={ro}
                          onClick={() => removeAlt(r.altId)}
                          aria-label="Удалить"
                        >
                          <LucideIcons.Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {showDelta ? (
        <section
          id="w2-material-sc-drafts-delta"
          className="scroll-mt-24 rounded-lg border border-white/80 bg-white/90 p-3 shadow-sm"
        >
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-violet-900">Дельта BOM</p>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-7 text-[10px]"
              disabled={ro}
              onClick={addDelta}
            >
              Добавить строку
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-[9px] font-bold uppercase text-slate-500">
                  <th className="py-1.5 pr-2">Точка</th>
                  <th className="py-1.5 pr-2">lineRef</th>
                  <th className="py-1.5 pr-2">Поле</th>
                  <th className="py-1.5 pr-2">Было</th>
                  <th className="py-1.5 pr-2">Стало</th>
                  <th className="py-1.5 pr-2">Заметка</th>
                  <th className="w-10 py-1.5" />
                </tr>
              </thead>
              <tbody>
                {(dossier.bomLineDeltaDrafts ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-3 text-slate-500">
                      Фиксируйте отличия образца или серии от утверждённого ТЗ.
                    </td>
                  </tr>
                ) : (
                  (dossier.bomLineDeltaDrafts ?? []).map((r) => (
                    <tr key={r.deltaId} className="border-b border-slate-100 align-top">
                      <td className="py-1.5 pr-2">
                        <select
                          className="h-8 w-[140px] max-w-full rounded-md border border-slate-200 bg-white px-1 text-[10px]"
                          value={r.kind}
                          disabled={ro}
                          onChange={(e) =>
                            patchDelta(r.deltaId, { kind: e.target.value as Workshop2BomLineDeltaDraft['kind'] })
                          }
                        >
                          {DELTA_KIND_OPTS.map((k) => (
                            <option key={k} value={k}>
                              {W2_BOM_SAMPLE_DELTA_KIND_LABELS[k]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-1.5 pr-2">
                        <Input
                          className="h-8 font-mono text-[10px]"
                          value={r.lineRef}
                          disabled={ro}
                          onChange={(e) => patchDelta(r.deltaId, { lineRef: e.target.value })}
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <select
                          className="h-8 w-full rounded-md border border-slate-200 bg-white px-1 text-[10px]"
                          value={r.field}
                          disabled={ro}
                          onChange={(e) =>
                            patchDelta(r.deltaId, { field: e.target.value as Workshop2BomLineDeltaDraft['field'] })
                          }
                        >
                          {DELTA_FIELD_OPTS.map((f) => (
                            <option key={f} value={f}>
                              {f}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-1.5 pr-2">
                        <Input
                          className="h-8 text-[10px]"
                          value={r.beforeLabel}
                          disabled={ro}
                          onChange={(e) => patchDelta(r.deltaId, { beforeLabel: e.target.value })}
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <Input
                          className="h-8 text-[10px]"
                          value={r.afterLabel}
                          disabled={ro}
                          onChange={(e) => patchDelta(r.deltaId, { afterLabel: e.target.value })}
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <Input
                          className="h-8 text-[10px]"
                          value={r.note ?? ''}
                          disabled={ro}
                          onChange={(e) => patchDelta(r.deltaId, { note: e.target.value })}
                        />
                      </td>
                      <td className="py-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-500"
                          disabled={ro}
                          onClick={() => removeDelta(r.deltaId)}
                          aria-label="Удалить"
                        >
                          <LucideIcons.Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {showCosting ? (
        <section
          id="w2-material-sc-drafts-costing"
          className="scroll-mt-24 rounded-lg border border-emerald-200/80 bg-emerald-50/40 p-3 shadow-sm"
        >
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-900">Costing по lineRef</p>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="h-7 text-[10px]"
              disabled={ro}
              onClick={addCosting}
            >
              Добавить строку
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-emerald-200/80 text-left text-[9px] font-bold uppercase text-emerald-800">
                  <th className="py-1.5 pr-2">lineRef</th>
                  <th className="py-1.5 pr-2">Ед.</th>
                  <th className="py-1.5 pr-2">Норма / шт</th>
                  <th className="py-1.5 pr-2">Заметка</th>
                  <th className="w-10 py-1.5" />
                </tr>
              </thead>
              <tbody>
                {(dossier.bomLineCostingHints ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-3 text-slate-600">
                      Строки для локальной финмодели; дубликаты lineRef сшиваются при отображении счётчика выше.
                    </td>
                  </tr>
                ) : (
                  (dossier.bomLineCostingHints ?? []).map((r, i) => (
                    <tr key={`${r.lineRef}-${i}`} className="border-b border-emerald-100 align-top">
                      <td className="py-1.5 pr-2">
                        <Input
                          className="h-8 font-mono text-[10px]"
                          value={r.lineRef}
                          disabled={ro}
                          onChange={(e) => patchCostingAt(i, { lineRef: e.target.value })}
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <Input
                          className="h-8 text-[10px]"
                          value={r.unitHint ?? ''}
                          disabled={ro}
                          onChange={(e) => patchCostingAt(i, { unitHint: e.target.value })}
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <Input
                          className="h-8 text-[10px]"
                          type="number"
                          min={0}
                          step="any"
                          value={r.qtyPerGarment ?? ''}
                          disabled={ro}
                          onChange={(e) => {
                            const v = e.target.value;
                            patchCostingAt(i, {
                              qtyPerGarment: v === '' ? undefined : Number(v),
                            });
                          }}
                        />
                      </td>
                      <td className="py-1.5 pr-2">
                        <Input
                          className="h-8 text-[10px]"
                          value={r.financeNote ?? ''}
                          disabled={ro}
                          onChange={(e) => patchCostingAt(i, { financeNote: e.target.value })}
                        />
                      </td>
                      <td className="py-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-500"
                          disabled={ro}
                          onClick={() => removeCostingAt(i)}
                          aria-label="Удалить"
                        >
                          <LucideIcons.Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
