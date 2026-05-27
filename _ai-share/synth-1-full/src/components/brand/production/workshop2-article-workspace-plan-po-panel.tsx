'use client';

import * as LucideIcons from 'lucide-react';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Workshop2Core1MatrixBridgeCard } from '@/components/brand/production/Workshop2Core1MatrixBridgeCard';
import {
  W2_ARTICLE_WORKSPACE_TAB_FIELD_CLASS as field,
  newW2ArticleTabPanelRowId as newRowId,
} from '@/components/brand/production/workshop2-article-workspace-tab-panels-shared';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { Workshop2DossierSectionBodyTimeAndAction } from '@/components/brand/production/workshop2-phase1-dossier-panel-section-body-time-and-action';
import { Workshop2B2BIntegrationPanel } from '@/components/brand/production/Workshop2B2BIntegrationPanel';
import { EmptyState } from '@/components/design-system/empty-state';

export function Workshop2ArticlePlanPoPanel({
  dossier = null,
  articleId,
}: {
  dossier?: Workshop2DossierPhase1 | null;
  articleId?: string;
} = {}) {
  const { bundle, loading, mergeBundle, dataMode } = useArticleWorkspace();
  if (loading || !bundle) return <p className="text-text-secondary text-sm">Загрузка…</p>;
  const plan = bundle.planPo!;

  return (
    <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <LucideIcons.ListOrdered className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-text-primary text-base font-semibold">План · заказ (PO)</h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                Ответственный: Менеджер по производству
              </span>
            </div>
            <p className="text-text-secondary text-xs leading-snug">
              Управление партиями заказа и вложенностью.
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
            <span className="text-text-muted font-bold">Суть</span> · Строк PO:{' '}
            {plan.purchaseOrders.length}
          </span>
          <span className="text-text-primary border-border-subtle max-w-full rounded border bg-white px-2 py-1 text-[10px] font-semibold leading-snug">
            <span className="text-text-muted font-bold">Гот.</span> ·{' '}
            {plan.purchaseOrders.length === 0
              ? 'Нет строк PO'
              : plan.purchaseOrders.every((po) => po.status === 'closed')
                ? 'Все партии завершены'
                : 'План в работе'}
          </span>
        </div>
      </div>

      <div className="mt-4 min-w-0 space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <p className="text-text-primary flex items-center gap-1.5 text-sm font-semibold">
              <LucideIcons.Package className="h-4 w-4 text-slate-400" />
              Размещение (PO)
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() =>
                void mergeBundle({
                  planPo: {
                    ...plan,
                    purchaseOrders: [
                      ...plan.purchaseOrders,
                      { id: newRowId(), label: '', qty: '', status: 'draft', dueNote: '' },
                    ],
                  },
                })
              }
            >
              <LucideIcons.Plus className="mr-1 h-3.5 w-3.5" />
              Добавить партию
            </Button>
          </div>

          {plan.purchaseOrders.length === 0 ? (
            <EmptyState
              title="Нет строк PO"
              description="Добавьте первую партию для планирования производства."
              icon={<LucideIcons.ListOrdered className="h-10 w-10 stroke-[1.25]" />}
            />
          ) : (
            <ul className="space-y-3">
              {plan.purchaseOrders.map((po) => (
                <li
                  key={po.id}
                  className="bg-bg-surface border-border-subtle grid gap-3 rounded-lg border p-3 sm:grid-cols-2"
                >
                  <div className="space-y-2">
                    <Input
                      className="h-8 text-[11px] font-medium focus:bg-white"
                      value={po.label}
                      onChange={(e) =>
                        void mergeBundle({
                          planPo: {
                            ...plan,
                            purchaseOrders: plan.purchaseOrders.map((p) =>
                              p.id === po.id ? { ...p, label: e.target.value } : p
                            ),
                          },
                        })
                      }
                      placeholder="PO / партия"
                    />
                    <div className="flex gap-2">
                      <Input
                        className="h-8 w-24 text-[11px] focus:bg-white"
                        placeholder="Кол-во"
                        value={po.qty || ''}
                        onChange={(e) => {
                          const qty = e.target.value;
                          void mergeBundle({
                            planPo: {
                              ...plan,
                              purchaseOrders: plan.purchaseOrders.map((p) =>
                                p.id === po.id ? { ...p, qty } : p
                              ),
                            },
                          });
                        }}
                      />
                      <Input
                        className="h-8 flex-1 text-[11px] focus:bg-white"
                        placeholder="Срок (due date)"
                        value={po.dueNote || ''}
                        onChange={(e) => {
                          const dueNote = e.target.value;
                          void mergeBundle({
                            planPo: {
                              ...plan,
                              purchaseOrders: plan.purchaseOrders.map((p) =>
                                p.id === po.id ? { ...p, dueNote } : p
                              ),
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between gap-2">
                    <select
                      className={cn(field, 'h-8 text-[11px] focus:bg-white')}
                      value={po.status}
                      onChange={(e) => {
                        const status = e.target.value as (typeof plan.purchaseOrders)[0]['status'];
                        void mergeBundle({
                          planPo: {
                            ...plan,
                            purchaseOrders: plan.purchaseOrders.map((p) =>
                              p.id === po.id ? { ...p, status } : p
                            ),
                          },
                        });
                      }}
                    >
                      <option value="draft">Черновик</option>
                      <option value="sent">Отправлен</option>
                      <option value="confirmed">Подтверждён</option>
                      <option value="closed">Закрыт</option>
                    </select>
                    {po.status === 'draft' ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-text-muted h-8 w-8 shrink-0 self-end hover:bg-red-50 hover:text-red-500"
                        onClick={() => {
                          void mergeBundle({
                            planPo: {
                              ...plan,
                              purchaseOrders: plan.purchaseOrders.filter((p) => p.id !== po.id),
                            },
                          });
                        }}
                      >
                        <LucideIcons.Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="border-border-subtle mt-4 flex items-center justify-between border-t pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() =>
                void mergeBundle({
                  planPo: {
                    ...plan,
                    purchaseOrders: [
                      ...plan.purchaseOrders,
                      { id: newRowId(), label: 'Новый PO', status: 'draft' as const },
                    ],
                  },
                })
              }
            >
              <LucideIcons.Plus className="h-3 w-3" /> Добавить PO
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8 gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
            >
              <LucideIcons.CheckCircle2 className="h-3 w-3" /> Утвердить план
            </Button>
          </div>
        </div>
      </div>

      {articleId && (
        <Workshop2DossierSectionBodyTimeAndAction
          articleId={articleId}
          dossier={dossier || undefined}
        />
      )}

      {dossier && <Workshop2B2BIntegrationPanel dossier={dossier} articleId={articleId} />}
    </div>
  );
}
