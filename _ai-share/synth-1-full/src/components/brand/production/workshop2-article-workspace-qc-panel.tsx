'use client';

import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import QRCode from 'qrcode';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { getAqlPlan } from '@/lib/production/aql-standards';
import { newW2ArticleTabPanelRowId as newRowId } from '@/components/brand/production/workshop2-article-workspace-tab-panels-shared';

import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';

import { EmptyState } from '@/components/design-system/empty-state';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Workshop2QcVisualInspection } from './workshop2-qc-visual-inspection';
import { SupplierQcScorecard } from './supplier-qc-scorecard';

export function Workshop2ArticleQcPanel({
  dossier = null,
}: {
  dossier?: Workshop2DossierPhase1 | null;
} = {}) {
  const { ref, bundle, loading, mergeBundle, dataMode } = useArticleWorkspace();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (isQrModalOpen && bundle?.qc) {
      const pendingBatch =
        bundle.qc.batches.find((b) => b.status === 'pending') || bundle.qc.batches[0];
      const targetBatchId = pendingBatch?.id || '';
      const url = `${window.location.origin}/qc-terminal?articleId=${ref.articleId}&batchId=${targetBatchId}`;

      QRCode.toDataURL(url, { margin: 1, width: 256 }).then(setQrCodeUrl).catch(console.error);
    }
  }, [isQrModalOpen, bundle?.qc]);

  if (loading || !bundle) return <p className="text-text-secondary text-[12px]">Загрузка…</p>;
  const qc = bundle.qc!;

  const field =
    'border-border-default h-8 w-full rounded-md border bg-white px-2 text-[11px] font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <LucideIcons.ShieldCheck className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-text-primary text-base font-semibold">ОТК · Контроль качества</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                Ответственный: Инспектор ОТК
              </span>
            </div>
            <p className="text-text-secondary text-xs leading-snug">
              Партии, проверки, фиксация брака и корректирующие действия по стандарту AQL.
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
            <span className="text-text-muted font-bold">Суть</span> · Партий: {qc.batches.length}
          </span>
          <span className="text-text-primary border-border-subtle max-w-full rounded border bg-white px-2 py-1 text-[10px] font-semibold leading-snug">
            <span className="text-text-muted font-bold">Гот.</span> ·{' '}
            {qc.batches.length === 0
              ? 'Нет партий для инспекции'
              : qc.batches.some(
                    (b) =>
                      b.majorDefects != null &&
                      getAqlPlan(b.batchSize || 0, '2.5') &&
                      b.majorDefects >= getAqlPlan(b.batchSize || 0, '2.5')!.rejectLimit
                  )
                ? 'Брак превышает норму AQL'
                : 'Инспекция в норме'}
          </span>
        </div>
      </div>

      <div className="mt-4 min-w-0 space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <p className="text-text-primary flex items-center gap-1.5 text-sm font-semibold">
              <LucideIcons.ListChecks className="h-4 w-4 text-slate-400" />
              Партии ОТК
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-[11px]"
              onClick={() => {
                void mergeBundle({
                  qc: {
                    ...qc,
                    batches: [
                      ...qc.batches,
                      {
                        id: newRowId(),
                        label: `Партия ${qc.batches.length + 1}`,
                        at: new Date().toISOString(),
                        status: 'pending' as const,
                        defectPhotosCount: 0,
                      },
                    ],
                  },
                });
              }}
            >
              <LucideIcons.Plus className="h-3.5 w-3.5" />
              Добавить партию
            </Button>
          </div>

          {qc.batches.length === 0 ? (
            <EmptyState
              title="Нет партий для инспекции"
              description="Добавьте партию для проведения инспекции качества."
              icon={<LucideIcons.ShieldCheck className="h-10 w-10 stroke-[1.25]" />}
            />
          ) : (
            <div className="space-y-3">
              {qc.batches.map((b) => {
                const aql = b.batchSize ? getAqlPlan(b.batchSize, '2.5') : null;
                const isAqlFail =
                  aql && b.majorDefects != null && b.majorDefects >= aql.rejectLimit;

                return (
                  <div
                    key={b.id}
                    className="border-border-subtle hover:border-accent-primary/20 bg-bg-surface2/40 group space-y-3 rounded-xl border p-3 shadow-sm transition-all"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="flex-1 space-y-1">
                        <Input
                          className="-ml-1 h-8 border-none bg-transparent px-1 text-[13px] font-bold tracking-tight focus:bg-white"
                          value={b.label}
                          placeholder="Название партии"
                          onChange={(e) =>
                            void mergeBundle({
                              qc: {
                                ...qc,
                                batches: qc.batches.map((x) =>
                                  x.id === b.id ? { ...x, label: e.target.value } : x
                                ),
                              },
                            })
                          }
                        />
                        <div className="flex items-center gap-3">
                          <span className="text-text-muted text-[10px] font-medium tracking-wide">
                            {b.at?.split('T')[0]}
                          </span>
                          {b.defectPhotosCount != null && b.defectPhotosCount > 0 && (
                            <div className="flex items-center gap-1">
                              <LucideIcons.Image className="text-accent-primary h-3 w-3" />
                              <span className="text-accent-primary text-[10px] font-semibold">
                                {b.defectPhotosCount} фото
                              </span>
                            </div>
                          )}
                          {isAqlFail && (
                            <Badge className="h-5 border-none bg-rose-500 text-[10px] font-semibold text-white">
                              AQL БРАК
                            </Badge>
                          )}
                          {!isAqlFail && aql && b.majorDefects != null && (
                            <Badge className="h-5 border-none bg-emerald-500 text-[10px] font-semibold text-white">
                              AQL НОРМА
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          className={cn(field, 'h-8 bg-white sm:w-32')}
                          value={b.status}
                          onChange={(e) => {
                            const status = e.target.value as (typeof qc.batches)[0]['status'];
                            void mergeBundle({
                              qc: {
                                ...qc,
                                batches: qc.batches.map((x) =>
                                  x.id === b.id ? { ...x, status, at: new Date().toISOString() } : x
                                ),
                              },
                            });
                          }}
                        >
                          <option value="pending">Ожидает</option>
                          <option value="passed">Принято</option>
                          <option value="failed">Брак</option>
                          <option value="rework">Доработка</option>
                        </select>
                        {b.status === 'pending' ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-text-muted h-8 w-8 hover:bg-red-50 hover:text-red-500"
                            onClick={() => {
                              void mergeBundle({
                                qc: {
                                  ...qc,
                                  batches: qc.batches.filter((x) => x.id !== b.id),
                                },
                              });
                            }}
                          >
                            <LucideIcons.X className="h-4 w-4" />
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="space-y-1">
                        <p className="text-text-muted text-[10px] font-semibold">Партия (ед)</p>
                        <Input
                          type="number"
                          className="h-8 bg-white text-[11px]"
                          value={b.batchSize || ''}
                          placeholder="0"
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            void mergeBundle({
                              qc: {
                                ...qc,
                                batches: qc.batches.map((x) =>
                                  x.id === b.id ? { ...x, batchSize: v } : x
                                ),
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-text-muted text-[10px] font-semibold">Выборка (AQL)</p>
                        <div className="border-border-default text-text-secondary flex h-8 items-center rounded-md border bg-slate-50 px-2 text-[11px] font-medium">
                          {aql ? `${aql.sampleSize} ед.` : '—'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-text-muted text-[10px] font-semibold">Критичный брак</p>
                        <Input
                          type="number"
                          className="h-8 bg-white text-[11px]"
                          value={b.majorDefects || ''}
                          placeholder="0"
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            void mergeBundle({
                              qc: {
                                ...qc,
                                batches: qc.batches.map((x) =>
                                  x.id === b.id ? { ...x, majorDefects: v } : x
                                ),
                              },
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-text-muted text-[10px] font-semibold">
                          Порог отклонения (Re)
                        </p>
                        <div
                          className={cn(
                            'flex h-8 items-center rounded-md border px-2 text-[11px] font-medium',
                            aql
                              ? 'border-border-default text-text-secondary bg-slate-50'
                              : 'text-text-muted border-transparent bg-transparent'
                          )}
                        >
                          {aql ? `≥ ${aql.rejectLimit} ед.` : '—'}
                        </div>
                      </div>
                    </div>

                    {b.status === 'failed' || b.status === 'rework' || (b.majorDefects ?? 0) > 0 ? (
                      <div className="space-y-1 pt-2">
                        <p className="text-text-muted text-[10px] font-semibold">
                          Журнал дефектов и комментарии
                        </p>
                        <Textarea
                          className="border-border-default focus-visible:ring-accent-primary min-h-[60px] resize-none bg-white text-[11px]"
                          placeholder="Опишите найденные дефекты, приложите ссылки на фото или укажите причину возврата на доработку..."
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs font-medium"
            onClick={() =>
              void mergeBundle({
                qc: {
                  ...qc,
                  batches: [
                    ...qc.batches,
                    {
                      id: newRowId(),
                      label: `Партия ${new Date().toISOString().split('T')[0]}`,
                      status: 'pending' as const,
                      at: new Date().toISOString(),
                      defectPhotosCount: 0,
                    },
                  ],
                },
              })
            }
          >
            <LucideIcons.Plus className="h-3.5 w-3.5" /> Добавить партию
          </Button>
        </div>
      </div>

      {/* Визуальная фиксация дефектов */}
      <div className="border-border-default mt-4 scroll-mt-24 rounded-xl border bg-white p-4 shadow-sm">
        <Workshop2QcVisualInspection imageUrl={dossier?.categorySketchImageDataUrl} />
      </div>

      {/* Рейтинг производителя (Scorecard) */}
      <div className="mt-4">
        <SupplierQcScorecard supplierId={dossier?.contractorId || 'supplier-1'} />
      </div>

      {/* Мобильный инспектор */}
      <div className="border-border-default scroll-mt-24 space-y-4 rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="border-accent-primary/20 flex h-8 w-8 items-center justify-center rounded-lg border bg-white shadow-sm">
              <LucideIcons.Scan className="text-accent-primary h-4 w-4 shrink-0" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h2 className="text-text-primary text-base font-semibold">Мобильный инспектор ОТК</h2>
              <p className="text-text-secondary text-[11px] leading-snug">
                Интеграция с мобильными терминалами цеха для фотофиксации дефектов. Данные
                синхронизируются автоматически.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
            <span className="text-xs font-medium text-slate-700">
              Ожидание подключения терминала...
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="h-7 text-[10px]"
            onClick={() => setIsQrModalOpen(true)}
          >
            Сгенерировать QR-код для подключения
          </Button>
        </div>
      </div>

      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LucideIcons.Smartphone className="text-accent-primary h-5 w-5" />
              Подключение терминала ОТК
            </DialogTitle>
            <DialogDescription className="text-xs">
              Отсканируйте этот QR-код через мобильное приложение инспектора для привязки устройства
              к текущей партии.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 p-6">
            <div className="mx-auto flex h-48 w-48 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-white p-4 shadow-sm">
              {qrCodeUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrCodeUrl} alt="QR Code" className="h-full w-full object-contain" />
              ) : (
                <LucideIcons.QrCode className="h-24 w-24 text-slate-300" />
              )}
            </div>
            <p className="text-text-muted max-w-[250px] text-center text-[10px]">
              Код действителен в течение 15 минут. После сканирования терминал автоматически получит
              доступ к чек-листам AQL.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
