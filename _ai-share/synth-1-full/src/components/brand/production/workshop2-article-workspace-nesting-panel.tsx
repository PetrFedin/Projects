'use client';

import { isWorkshop2NestingProdStubDisabled } from '@/lib/production/workshop2-nesting-prod-guard';

import * as LucideIcons from 'lucide-react';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { newW2ArticleTabPanelRowId as newRowId } from '@/components/brand/production/workshop2-article-workspace-tab-panels-shared';

import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

export function Workshop2ArticleNestingPanel({
  dossier = null,
}: {
  dossier?: Workshop2DossierPhase1 | null;
} = {}) {
  const { bundle, loading, mergeBundle, dataMode } = useArticleWorkspace();
  const prodStubDisabled = isWorkshop2NestingProdStubDisabled();
  if (loading || !bundle) return <p className="text-text-secondary text-[12px]">Загрузка…</p>;
  const nesting = bundle.nesting!;

  return (
    <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <LucideIcons.LayoutTemplate className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-text-primary text-base font-semibold">Раскладка (Nesting)</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                Ответственный: Конструктор / Технолог
              </span>
            </div>
            <p className="text-text-secondary text-xs leading-snug">
              Прикрепление артефактов раскладки и анализ утилизации (КПМ).
            </p>
          </div>
        </div>
        <span className="border-border-default bg-bg-surface2 text-text-secondary shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px]">
          {dataMode === 'http' ? 'API' : 'local'}
        </span>
      </div>

      <div className="border-border-subtle mt-4 flex flex-col gap-1.5 border-t border-dotted pt-2.5">
        <div className="flex flex-wrap gap-1.5">
          <span className="bg-bg-surface2/70 text-text-primary border-border-subtle max-w-full rounded border px-2 py-1 text-[10px] leading-snug">
            <span className="text-text-muted font-bold">Суть</span> · Артефактов:{' '}
            {nesting.artifacts.length}
          </span>
          <span className="text-text-primary border-border-subtle max-w-full rounded border bg-white px-2 py-1 text-[10px] font-semibold leading-snug">
            <span className="text-text-muted font-bold">Гот.</span> ·{' '}
            {nesting.artifacts.length > 0 ? 'Есть артефакты раскладки' : 'Не начато'}
          </span>
        </div>
      </div>

      <div className="mt-4 min-w-0 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <p className="text-text-primary flex items-center gap-1.5 text-sm font-semibold">
            <LucideIcons.FileArchive className="h-4 w-4 text-slate-400" />
            Артефакты
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-[11px]"
            onClick={() =>
              void mergeBundle({
                nesting: {
                  ...nesting,
                  artifacts: [
                    ...nesting.artifacts,
                    { id: newRowId(), title: 'Раскладка', at: new Date().toISOString() },
                  ],
                },
              })
            }
          >
            <LucideIcons.Plus className="h-3.5 w-3.5" />
            Добавить артефакт
          </Button>
        </div>

        {nesting.artifacts.length === 0 ? (
          <div className="border-border-default rounded-lg border-2 border-dashed bg-slate-50/50 p-8 text-center">
            <LucideIcons.UploadCloud className="mx-auto mb-3 h-8 w-8 text-slate-400" />
            <p className="text-text-primary mb-1 text-sm font-medium">Загрузите файлы раскладки</p>
            <p className="text-text-secondary mb-4 text-xs">Поддерживаются форматы DXF, PLT, PDF</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() =>
                void mergeBundle({
                  nesting: {
                    ...nesting,
                    artifacts: [
                      ...nesting.artifacts,
                      { id: newRowId(), title: 'Новая раскладка', at: new Date().toISOString() },
                    ],
                  },
                })
              }
            >
              Выбрать файлы
            </Button>
          </div>
        ) : (
          <ul className="space-y-4">
            {nesting.artifacts.map((a) => (
              <li
                key={a.id}
                className="border-border-subtle space-y-3 rounded-lg border bg-slate-50/50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <Input
                      className="focus:border-border-default h-8 border-transparent bg-transparent px-0 text-sm font-semibold shadow-none focus:bg-white focus:px-2"
                      placeholder="Название (например: Раскладка на 150см)"
                      value={a.title}
                      onChange={(e) =>
                        void mergeBundle({
                          nesting: {
                            ...nesting,
                            artifacts: nesting.artifacts.map((x) =>
                              x.id === a.id ? { ...x, title: e.target.value } : x
                            ),
                          },
                        })
                      }
                    />

                    {/* Drag and drop zone for this artifact */}
                    <div className="border-border-default flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed bg-white p-4 transition-colors hover:bg-slate-50">
                      <LucideIcons.FileUp className="h-4 w-4 text-slate-400" />
                      <span className="text-text-secondary text-xs">
                        {a.fileRefNote
                          ? a.fileRefNote
                          : 'Перетащите DXF/PLT/PDF файл или нажмите для выбора'}
                      </span>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                          Длина (м)
                        </label>
                        <Input
                          className="h-8 text-xs focus:bg-white"
                          placeholder="0.00"
                          type="number"
                          step="0.01"
                          value={a.length != null ? String(a.length) : ''}
                          onChange={(e) => {
                            const v = e.target.value.trim();
                            const length = v === '' ? undefined : Number(v);
                            void mergeBundle({
                              nesting: {
                                ...nesting,
                                artifacts: nesting.artifacts.map((x) =>
                                  x.id === a.id
                                    ? {
                                        ...x,
                                        length:
                                          length !== undefined && !Number.isNaN(length)
                                            ? length
                                            : undefined,
                                      }
                                    : x
                                ),
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                          Слои (шт)
                        </label>
                        <Input
                          className="h-8 text-xs focus:bg-white"
                          placeholder="0"
                          type="number"
                          value={a.layers != null ? String(a.layers) : ''}
                          onChange={(e) => {
                            const v = e.target.value.trim();
                            const layers = v === '' ? undefined : Number(v);
                            void mergeBundle({
                              nesting: {
                                ...nesting,
                                artifacts: nesting.artifacts.map((x) =>
                                  x.id === a.id
                                    ? {
                                        ...x,
                                        layers:
                                          layers !== undefined && !Number.isNaN(layers)
                                            ? layers
                                            : undefined,
                                      }
                                    : x
                                ),
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
                          Эффективность (%)
                        </label>
                        <Input
                          className="h-8 text-xs focus:bg-white"
                          placeholder="0"
                          type="number"
                          value={a.efficiencyPct != null ? String(a.efficiencyPct) : ''}
                          onChange={(e) => {
                            const v = e.target.value.trim();
                            const efficiencyPct = v === '' ? undefined : Number(v);
                            void mergeBundle({
                              nesting: {
                                ...nesting,
                                artifacts: nesting.artifacts.map((x) =>
                                  x.id === a.id
                                    ? {
                                        ...x,
                                        efficiencyPct:
                                          efficiencyPct !== undefined &&
                                          !Number.isNaN(efficiencyPct)
                                            ? efficiencyPct
                                            : undefined,
                                      }
                                    : x
                                ),
                              },
                            });
                          }}
                        />
                      </div>
                    </div>

                    {/* AI Action */}
                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="text-accent-primary bg-accent-primary/10 hover:bg-accent-primary/20 h-8 gap-1.5 text-[11px]"
                        data-testid="workshop2-nesting-simulate"
                        disabled={prodStubDisabled}
                        onClick={() => {
                          // Simulate AI request
                          void mergeBundle({
                            nesting: {
                              ...nesting,
                              artifacts: nesting.artifacts.map((x) =>
                                x.id === a.id
                                  ? {
                                      ...x,
                                      efficiencyPct: 85,
                                      fileRefNote: 'Optimized_Nesting.dxf',
                                    }
                                  : x
                              ),
                            },
                          });
                        }}
                      >
                        <LucideIcons.Sparkles className="h-3.5 w-3.5" />
                        Запросить AI-оптимизацию раскладки
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-text-muted mt-1 h-8 w-8 shrink-0 p-0 hover:bg-red-50 hover:text-red-600"
                    onClick={() =>
                      void mergeBundle({
                        nesting: {
                          ...nesting,
                          artifacts: nesting.artifacts.filter((x) => x.id !== a.id),
                        },
                      })
                    }
                  >
                    <LucideIcons.Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
