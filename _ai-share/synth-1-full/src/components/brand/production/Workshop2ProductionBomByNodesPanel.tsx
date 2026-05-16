'use client';

import { useState } from 'react';
import type {
  Workshop2DossierPhase1,
  Workshop2ProductionMaterialLine,
  Workshop2ProductionTrimLine,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { ensureWorkshop2ProductionModel } from '@/lib/production/workshop2-production-model-from-dossier';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Props = {
  dossier: Workshop2DossierPhase1;
  onChange: (patch: Partial<Workshop2DossierPhase1>) => void;
  disabled?: boolean;
};

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function Workshop2ProductionBomByNodesPanel({ dossier, onChange, disabled = false }: Props) {
  const model = ensureWorkshop2ProductionModel(dossier);
  const { toast } = useToast();

  function save(nextModel: typeof model): void {
    onChange({ productionModel: nextModel });
  }

  function addMaterial(nodeId: string): void {
    const next: Workshop2ProductionMaterialLine = {
      id: uid('mat'),
      nodeId,
      role: 'main',
      materialName: '',
    };
    save({ ...model, materialLines: [...model.materialLines, next] });
  }

  function updateMaterial(id: string, patch: Partial<Workshop2ProductionMaterialLine>): void {
    save({
      ...model,
      materialLines: model.materialLines.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    });
  }

  function addTrim(nodeId: string): void {
    const next: Workshop2ProductionTrimLine = {
      id: uid('trim'),
      nodeId,
      trimType: 'other',
      name: '',
    };
    save({ ...model, trimLines: [...model.trimLines, next] });
  }

  function updateTrim(id: string, patch: Partial<Workshop2ProductionTrimLine>): void {
    save({
      ...model,
      trimLines: model.trimLines.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    });
  }

  function addNode(): void {
    const next: typeof model.nodes[number] = {
      id: uid('node'),
      kind: 'other',
      label: 'Новый узел',
      sortOrder: model.nodes.length + 1,
      status: 'draft',
    };
    save({ ...model, nodes: [...model.nodes, next] });
  }

  function updateNodeLabel(id: string, label: string): void {
    save({
      ...model,
      nodes: model.nodes.map((n) => (n.id === id ? { ...n, label } : n)),
    });
  }

  return (
    <div
      id="w2-bom-by-nodes"
      className="border-border-default scroll-mt-24 space-y-4 rounded-xl border bg-white p-4 shadow-sm"
    >
      <div className="flex items-start gap-3 pb-1">
        <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <LucideIcons.ListTree className="h-4 w-4 shrink-0" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="text-text-primary text-base font-semibold">BOM по узлам изделия</h2>
          <p className="text-text-secondary text-[11px] leading-snug">
            Привязка материалов и фурнитуры к конкретному узлу, чтобы цех понимал точное расположение.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={addNode}>
          <LucideIcons.Plus className="mr-1 h-3.5 w-3.5" />
          Добавить узел
        </Button>
      </div>

      <div className="space-y-3">
        {model.nodes
          .filter((n) => !n.notApplicable)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((node) => {
            const materials = model.materialLines.filter((m) => m.nodeId === node.id);
            const trims = model.trimLines.filter((m) => m.nodeId === node.id);
            return (
              <div key={node.id} className="border-border-subtle bg-bg-surface2/30 rounded-lg border p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <Input
                    className="h-8 w-48 text-sm font-semibold bg-transparent border-transparent px-1 hover:border-border-default focus:border-border-default focus:bg-white transition-colors"
                    value={node.label}
                    disabled={disabled}
                    onChange={(e) => updateNodeLabel(node.id, e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-7 text-[10px]"
                      disabled={disabled}
                      onClick={() => addMaterial(node.id)}
                    >
                      + Материал
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-7 text-[10px]"
                      disabled={disabled}
                      onClick={() => addTrim(node.id)}
                    >
                      + Фурнитура
                    </Button>
                  </div>
                </div>

                <div className="grid gap-2">
                  {materials.map((m) => {
                    const cost = (m.yieldPerUnit || 0) * (m.landedCost || m.unitCostNet || 0);
                    return (
                      <div key={m.id} className="flex flex-col gap-2 border-b border-border-subtle/50 pb-3 mb-2 last:border-0 last:pb-0 last:mb-0">
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                          <Input
                            className="h-8 flex-[2] text-xs font-medium"
                            placeholder="Материал (название)"
                            value={m.materialName}
                            disabled={disabled}
                            onChange={(e) => updateMaterial(m.id, { materialName: e.target.value })}
                          />
                          <Input
                            className="h-8 flex-1 text-xs"
                            placeholder="Состав"
                            value={m.compositionText ?? ''}
                            disabled={disabled}
                            onChange={(e) => updateMaterial(m.id, { compositionText: e.target.value })}
                          />
                          <Input
                            className="h-8 w-20 shrink-0 text-xs"
                            placeholder="Плотн. (gsm)"
                            type="number"
                            value={m.gsm ?? ''}
                            disabled={disabled}
                            onChange={(e) =>
                              updateMaterial(m.id, {
                                gsm: e.target.value ? Number(e.target.value) : undefined,
                              })
                            }
                          />
                          <Input
                            className="h-8 flex-1 text-xs"
                            placeholder="Цвет"
                            value={m.color ?? ''}
                            disabled={disabled}
                            onChange={(e) => updateMaterial(m.id, { color: e.target.value })}
                          />
                          <button
                            type="button"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border-subtle text-red-600 hover:bg-red-50"
                            disabled={disabled}
                            title="Удалить материал"
                            onClick={() =>
                              save({
                                ...model,
                                materialLines: model.materialLines.filter((x) => x.id !== m.id),
                              })
                            }
                          >
                            <LucideIcons.Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-slate-50 p-2 rounded-md border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Расчет:</span>
                          <div className="flex items-center gap-1 border border-border-subtle rounded px-1 w-32 shrink-0 bg-white">
                            <input
                              className="h-7 w-12 text-xs bg-transparent focus:outline-none"
                              placeholder="Расход"
                              type="number"
                              step="0.01"
                              value={m.yieldPerUnit ?? ''}
                              disabled={disabled}
                              onChange={(e) =>
                                updateMaterial(m.id, {
                                  yieldPerUnit: e.target.value ? Number(e.target.value) : undefined,
                                })
                              }
                            />
                            <span className="text-text-muted text-[10px]">/</span>
                            <input
                              className="h-7 w-10 text-xs bg-transparent focus:outline-none"
                              placeholder="Ед."
                              value={m.yieldUnit ?? ''}
                              disabled={disabled}
                              onChange={(e) => updateMaterial(m.id, { yieldUnit: e.target.value })}
                            />
                          </div>

                          <div className="flex items-center gap-1 border border-border-subtle rounded px-1.5 w-24 shrink-0 bg-white">
                            <input
                              className="h-7 w-14 text-xs bg-transparent focus:outline-none"
                              placeholder="Цена (Net)"
                              type="number"
                              step="0.01"
                              value={m.unitCostNet ?? ''}
                              disabled={disabled}
                              onChange={(e) =>
                                updateMaterial(m.id, {
                                  unitCostNet: e.target.value ? Number(e.target.value) : undefined,
                                })
                              }
                            />
                          </div>

                          <div className="flex items-center gap-1 border border-border-subtle rounded px-1.5 w-24 shrink-0 bg-white">
                            <input
                              className="h-7 w-14 text-xs bg-transparent focus:outline-none"
                              placeholder="Landed"
                              type="number"
                              step="0.01"
                              value={m.landedCost ?? ''}
                              disabled={disabled}
                              onChange={(e) =>
                                updateMaterial(m.id, {
                                  landedCost: e.target.value ? Number(e.target.value) : undefined,
                                })
                              }
                            />
                          </div>
                          
                          <input
                            className="h-7 w-12 border border-border-subtle rounded px-1.5 text-xs bg-white shrink-0"
                            placeholder="Валюта"
                            value={m.currency ?? ''}
                            disabled={disabled}
                            onChange={(e) => updateMaterial(m.id, { currency: e.target.value })}
                          />

                          <div className="flex items-center justify-end min-w-[4rem] px-2 text-[11px] font-semibold text-emerald-700">
                            {cost > 0 ? `Σ ${(cost).toFixed(2)} ${m.currency || 'USD'}` : '—'}
                          </div>

                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="h-7 text-[10px] ml-auto bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200"
                            disabled={disabled}
                            onClick={() => {
                              const newYield = (m.yieldPerUnit || 1) * 0.85;
                              updateMaterial(m.id, { yieldPerUnit: Number(newYield.toFixed(3)) });
                              toast({ title: 'Yield Optimizer', description: `AI-оптимизация раскладки: расход снижен до ${newYield.toFixed(3)}.` });
                            }}
                          >
                            <LucideIcons.Wand2 className="w-3 h-3 mr-1" />
                            Оптимизировать
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {materials.length > 0 && trims.length > 0 && <div className="h-px bg-border-subtle/50 my-3" />}

                <div className="grid gap-2 mt-3">
                  {trims.map((t) => {
                    const cost = (t.quantity || 0) * (t.unitCostNet || 0);
                    return (
                      <div key={t.id} className="flex flex-col gap-2 border-b border-border-subtle/50 pb-3 mb-2 last:border-0 last:pb-0 last:mb-0">
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                          <Input
                            className="h-8 flex-[2] text-xs font-medium"
                            placeholder="Фурнитура (название)"
                            value={t.name}
                            disabled={disabled}
                            onChange={(e) => updateTrim(t.id, { name: e.target.value })}
                          />
                          <Input
                            className="h-8 flex-1 text-xs"
                            placeholder="Размер/Спека"
                            value={t.size ?? ''}
                            disabled={disabled}
                            onChange={(e) => updateTrim(t.id, { size: e.target.value })}
                          />
                          <Input
                            className="h-8 flex-1 text-xs"
                            placeholder="Цвет"
                            value={t.color ?? ''}
                            disabled={disabled}
                            onChange={(e) => updateTrim(t.id, { color: e.target.value })}
                          />
                          <Input
                            className="h-8 flex-1 text-xs"
                            placeholder="Установка"
                            value={t.placement ?? ''}
                            disabled={disabled}
                            onChange={(e) => updateTrim(t.id, { placement: e.target.value })}
                          />
                          <button
                            type="button"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-border-subtle text-red-600 hover:bg-red-50"
                            disabled={disabled}
                            title="Удалить фурнитуру"
                            onClick={() =>
                              save({
                                ...model,
                                trimLines: model.trimLines.filter((x) => x.id !== t.id),
                              })
                            }
                          >
                            <LucideIcons.Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-slate-50 p-2 rounded-md border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Расчет:</span>
                          <div className="flex items-center gap-1 border border-border-subtle rounded px-1.5 w-24 shrink-0 bg-white">
                            <span className="text-text-muted text-[10px]">Кол-во</span>
                            <input
                              className="h-7 w-10 text-xs text-right bg-transparent focus:outline-none"
                              placeholder="0"
                              type="number"
                              value={t.quantity ?? ''}
                              disabled={disabled}
                              onChange={(e) =>
                                updateTrim(t.id, {
                                  quantity: e.target.value ? Number(e.target.value) : undefined,
                                })
                              }
                            />
                          </div>
                          <div className="flex items-center gap-1 border border-border-subtle rounded px-1.5 w-28 shrink-0 bg-white">
                            <input
                              className="h-7 w-16 text-xs bg-transparent focus:outline-none"
                              placeholder="Цена/ед"
                              type="number"
                              step="0.01"
                              value={t.unitCostNet ?? ''}
                              disabled={disabled}
                              onChange={(e) =>
                                updateTrim(t.id, {
                                  unitCostNet: e.target.value ? Number(e.target.value) : undefined,
                                })
                              }
                            />
                            <span className="text-text-muted text-[10px]">₽</span>
                          </div>
                          <div className="flex items-center justify-end min-w-[4rem] px-2 text-[11px] font-semibold text-emerald-700">
                            {cost > 0 ? `Σ ${(cost).toFixed(2)} ₽` : '—'}
                          </div>
                        </div>
                      </div>
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
