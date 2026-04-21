'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getAqlPlan, AqlLevel } from '@/lib/production/aql-standards';
import { W2_ARTICLE_SECTION_DOM } from '@/lib/production/workshop2-url';
import { Textarea } from '@/components/ui/textarea';
import type { ArticleWorkspaceBundle } from '@/lib/production/article-workspace/types';
import type {
  Workshop2DossierPhase1,
  Workshop2SampleProductionChainMode,
} from '@/lib/production/workshop2-dossier-phase1.types';
import {
  emptyWorkshop2DossierPhase1,
  getWorkshop2Phase1Dossier,
  setWorkshop2Phase1Dossier,
} from '@/lib/production/workshop2-phase1-dossier-storage';
import {
  SAMPLE_PRODUCTION_CHAIN_LABELS,
  validateSampleIntakeForCollection,
} from '@/lib/production/workshop2-sample-intake-gate';
import { Workshop2Core1MatrixBridgeCard } from '@/components/brand/production/Workshop2Core1MatrixBridgeCard';

function newRowId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `r_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

const field =
  'flex h-8 w-full rounded-md border border-border-default bg-white px-2 text-[12px] text-text-primary shadow-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary';

function PanelShell({
  title,
  hint,
  dataMode,
  summary,
  readiness,
  blockers,
  nextAction,
  children,
}: {
  title: string;
  hint: string;
  dataMode: string;
  summary?: string;
  readiness?: string;
  blockers?: string[];
  nextAction?: string;
  children: ReactNode;
}) {
  return (
    <Card className="border-border-default">
      <CardContent className="space-y-4 pb-4 pt-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="space-y-1">
            <p className="text-text-primary text-[12px] font-semibold">{title}</p>
            <CardDescription className="text-[11px]">{hint}</CardDescription>
            <p className="text-teal-900/85 text-[10px] leading-snug" role="note">
              <span className="font-bold text-teal-950">Сэмплы</span> — тот же контур, что правая часть мини-шкалы в
              списке коллекции (группа «Сэмплы и выпуск» в статусе маршрута выше). В каталоге этапов коллекции это зона
              от supply-path и далее (в т.ч. шаг samples — отшив и приёмка образца), распределённая по этим вкладкам и
              полу цеха.
            </p>
          </div>
          <span className="border-border-default bg-bg-surface2 text-text-secondary rounded border px-1.5 py-0.5 font-mono text-[9px]">
            {dataMode === 'http' ? 'API' : 'local'}
          </span>
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_250px]">
          <div className="min-w-0">{children}</div>
          <aside className="space-y-3">
            {summary ? (
              <div className="border-border-default bg-bg-surface2/70 rounded-lg border p-3">
                <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                  Суть этапа
                </p>
                <p className="text-text-primary mt-1 text-[11px]">{summary}</p>
              </div>
            ) : null}
            {readiness ? (
              <div className="border-border-default rounded-lg border bg-white p-3">
                <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                  Готовность
                </p>
                <p className="text-text-primary mt-1 text-[11px] font-semibold">{readiness}</p>
              </div>
            ) : null}
            {nextAction ? (
              <div className="border-accent-primary/20 bg-accent-primary/10 rounded-lg border p-3">
                <p className="text-accent-primary text-[9px] font-black uppercase tracking-widest">
                  Следующее действие
                </p>
                <p className="text-accent-primary mt-1 text-[11px] font-semibold">{nextAction}</p>
              </div>
            ) : null}
            {blockers && blockers.length > 0 ? (
              <div className="rounded-lg border border-amber-100 bg-amber-50/60 p-3">
                <p className="text-[9px] font-black uppercase tracking-widest text-amber-500">
                  Что мешает
                </p>
                <ul className="mt-1 space-y-1">
                  {blockers.map((blocker) => (
                    <li key={blocker} className="text-[11px] text-amber-900">
                      {blocker}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </CardContent>
    </Card>
  );
}

export function Workshop2ArticleSupplyPanel() {
  const { bundle, loading, mergeBundle, dataMode } = useArticleWorkspace();
  if (loading || !bundle) {
    return <p className="text-text-secondary text-[12px]">Загрузка…</p>;
  }
  const supply = bundle.supply!;
  const totalCost = supply.lines.reduce(
    (acc, line) => acc + (line.qty || 0) * (line.costPerUnit || 0),
    0
  );

  return (
    <PanelShell
      title="Снабжение · BOM / брони"
      hint="Строки сырья и статусы; позже синхронизация с закупками и VMI."
      dataMode={dataMode}
      summary={`Строк BOM: ${supply.lines.length} · ${totalCost.toLocaleString()} ₽`}
      readiness={
        supply.lines.length === 0
          ? 'Не начато'
          : supply.lines.every((line) => line.status !== 'draft')
            ? 'BOM собран и подтвержден'
            : 'Есть черновые позиции'
      }
      blockers={[
        ...(supply.lines.length === 0 ? ['Нет строк BOM.'] : []),
        ...supply.lines
          .filter((line) => line.status === 'ordered' && (line.leadTimeDays ?? 0) > 14)
          .map((line) => `Срок поставки > 14 дней: ${line.label || 'без названия'}`),
      ]}
      nextAction={
        supply.lines.length === 0
          ? 'Добавить основные материалы из ТЗ.'
          : 'Подтвердить поставщика и срок поставки для критичных строк.'
      }
    >
      <div className="space-y-2">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
            Спецификация материалов
          </p>
          <div className="text-right">
            <span className="text-text-muted text-[10px] font-bold uppercase">Итого (BOM): </span>
            <span className="text-accent-primary text-[12px] font-black">
              {totalCost.toLocaleString()} ₽
            </span>
          </div>
        </div>
        {supply.lines.length === 0 ? (
          <p className="text-text-secondary text-[11px]">Пока нет строк — добавьте черновик.</p>
        ) : (
          <ul className="space-y-2">
            {supply.lines.map((line) => (
              <li
                key={line.id}
                className="border-border-subtle bg-bg-surface2/80 grid gap-2 rounded-md border p-2 sm:grid-cols-[1fr_minmax(0,100px)_minmax(0,120px)_auto]"
              >
                <div className="space-y-1">
                  <Input
                    className="h-8 text-[11px]"
                    value={line.label}
                    onChange={(e) => {
                      const label = e.target.value;
                      void mergeBundle({
                        supply: {
                          ...supply,
                          lines: supply.lines.map((l) => (l.id === line.id ? { ...l, label } : l)),
                        },
                      });
                    }}
                    placeholder="Материал / позиция"
                  />
                  <div className="flex gap-2">
                    <Input
                      className="h-7 w-20 text-[10px]"
                      value={line.qty != null ? String(line.qty) : ''}
                      onChange={(e) => {
                        const v = e.target.value.trim();
                        const qty = v === '' ? undefined : Number(v);
                        void mergeBundle({
                          supply: {
                            ...supply,
                            lines: supply.lines.map((l) =>
                              l.id === line.id
                                ? { ...l, qty: !Number.isNaN(qty) ? qty : undefined }
                                : l
                            ),
                          },
                        });
                      }}
                      placeholder="Кол-во"
                    />
                    <Input
                      className="h-7 w-12 text-[10px]"
                      value={line.unit ?? ''}
                      onChange={(e) => {
                        const unit = e.target.value;
                        void mergeBundle({
                          supply: {
                            ...supply,
                            lines: supply.lines.map((l) => (l.id === line.id ? { ...l, unit } : l)),
                          },
                        });
                      }}
                      placeholder="Ед"
                    />
                    <Input
                      className="h-7 w-20 text-[10px]"
                      value={line.costPerUnit != null ? String(line.costPerUnit) : ''}
                      onChange={(e) => {
                        const v = e.target.value.trim();
                        const costPerUnit = v === '' ? undefined : Number(v);
                        void mergeBundle({
                          supply: {
                            ...supply,
                            lines: supply.lines.map((l) =>
                              l.id === line.id
                                ? {
                                    ...l,
                                    costPerUnit: !Number.isNaN(costPerUnit)
                                      ? costPerUnit
                                      : undefined,
                                  }
                                : l
                            ),
                          },
                        });
                      }}
                      placeholder="Цена ед."
                    />
                    <Input
                      className="h-7 w-16 text-[10px]"
                      value={line.leadTimeDays != null ? String(line.leadTimeDays) : ''}
                      onChange={(e) => {
                        const v = e.target.value.trim();
                        const leadTimeDays = v === '' ? undefined : Number(v);
                        void mergeBundle({
                          supply: {
                            ...supply,
                            lines: supply.lines.map((l) =>
                              l.id === line.id
                                ? {
                                    ...l,
                                    leadTimeDays: !Number.isNaN(leadTimeDays)
                                      ? leadTimeDays
                                      : undefined,
                                  }
                                : l
                            ),
                          },
                        });
                      }}
                      placeholder="Срок, дн."
                    />
                    {line.leadTimeDays != null &&
                      line.status === 'ordered' &&
                      line.leadTimeDays > 14 && (
                        <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-rose-500">
                          <LucideIcons.AlertTriangle className="h-2.5 w-2.5" /> Высокий риск
                        </div>
                      )}
                  </div>
                </div>
                <select
                  className={cn(field, 'h-8')}
                  value={line.status}
                  onChange={(e) => {
                    const status = e.target.value as (typeof supply.lines)[0]['status'];
                    void mergeBundle({
                      supply: {
                        ...supply,
                        lines: supply.lines.map((l) => (l.id === line.id ? { ...l, status } : l)),
                      },
                    });
                  }}
                >
                  <option value="draft">черновик</option>
                  <option value="ordered">заказано</option>
                  <option value="in_transit">в пути</option>
                  <option value="at_factory">на фабрике</option>
                  <option value="reserved">бронь</option>
                  <option value="consumed">списано</option>
                </select>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-[11px] text-red-600"
                  onClick={() =>
                    void mergeBundle({
                      supply: { ...supply, lines: supply.lines.filter((l) => l.id !== line.id) },
                    })
                  }
                >
                  Удалить
                </Button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() =>
              void mergeBundle({
                supply: {
                  ...supply,
                  lines: [...supply.lines, { id: newRowId(), label: '', status: 'draft' as const }],
                },
              })
            }
          >
            Добавить строку
          </Button>
        </div>
        <label className="block space-y-1">
          <span className="text-text-muted text-[10px] font-semibold uppercase tracking-wide">
            Заметка
          </span>
          <textarea
            className={cn(field, 'min-h-[64px] py-2')}
            value={supply.note ?? ''}
            onChange={(e) => void mergeBundle({ supply: { ...supply, note: e.target.value } })}
            placeholder="VMI, поставщик, особые условия…"
          />
        </label>
      </div>
    </PanelShell>
  );
}

/** Приёмка сэмпла и включение в коллекцию: досье фазы 1 + gold в bundle (вкладка «Склад»). */
function Workshop2ArticleSampleIntakeStockSection({
  mergeBundle,
  dataMode,
}: {
  mergeBundle: (patch: Partial<ArticleWorkspaceBundle>) => Promise<ArticleWorkspaceBundle>;
  dataMode: string;
}) {
  const { ref, bundle, loading } = useArticleWorkspace();
  const [dossier, setDossier] = useState<Workshop2DossierPhase1 | null>(null);

  useEffect(() => {
    setDossier(getWorkshop2Phase1Dossier(ref.collectionId, ref.articleId) ?? null);
  }, [ref.collectionId, ref.articleId]);

  const patchDossier = useCallback(
    (patch: Partial<Workshop2DossierPhase1>) => {
      setDossier((prev) => {
        const base = prev ?? emptyWorkshop2DossierPhase1();
        const merged: Workshop2DossierPhase1 = {
          ...base,
          ...patch,
          updatedAt: new Date().toISOString(),
          updatedBy: 'stock-sample-intake',
        };
        setWorkshop2Phase1Dossier(ref.collectionId, ref.articleId, merged);
        return merged;
      });
    },
    [ref.articleId, ref.collectionId]
  );

  if (loading || !bundle) return null;
  const fg = bundle.fitGold!;
  const intake = validateSampleIntakeForCollection(dossier);
  const r = dossier?.sampleIntakeRelease ?? {};
  const mode = dossier?.sampleProductionChainMode;
  const needSewnRf = mode === 'rf_sewn' || mode === 'rf_import_materials';

  const setReleaseField = <K extends keyof typeof r>(key: K, value: (typeof r)[K]) => {
    patchDossier({
      sampleIntakeRelease: { ...r, [key]: value },
    });
  };

  return (
    <PanelShell
      title="Склад · приёмка сэмпла в коллекцию"
      hint="Перед включением в коллекцию заполните режим цепочки и финальные комплаенс-поля; данные пишутся в досье артикула (локально). Кнопка ниже выставляет Gold так же, как раньше на Fit."
      dataMode={dataMode}
      summary={`Режим цепочки: ${mode ? SAMPLE_PRODUCTION_CHAIN_LABELS[mode] : '—'} · В коллекции: ${fg.goldApproved ? 'да' : 'нет'}`}
      readiness={
        fg.goldApproved
          ? 'Сэмпл принят в коллекцию'
          : intake.ok
            ? 'Гейт приёмки закрыт — можно принять'
            : 'Заполните обязательные поля приёмки'
      }
      blockers={fg.goldApproved ? [] : intake.ok ? [] : intake.missing}
      nextAction={
        fg.goldApproved
          ? 'Можно оформлять движения ГП и дальнейший маршрут.'
          : intake.ok
            ? 'Нажмите «Принять сэмпл в коллекцию».'
            : 'Сверьтесь со списком «Что мешает» справа.'
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
            Режим цепочки производства
          </p>
          <select
            className={cn(field, 'py-1.5')}
            value={mode ?? ''}
            onChange={(e) => {
              const v = e.target.value as Workshop2SampleProductionChainMode | '';
              patchDossier({
                sampleProductionChainMode: v === '' ? undefined : v,
              });
            }}
          >
            <option value="">Выберите…</option>
            {(
              Object.keys(SAMPLE_PRODUCTION_CHAIN_LABELS) as Workshop2SampleProductionChainMode[]
            ).map((k) => (
              <option key={k} value={k}>
                {SAMPLE_PRODUCTION_CHAIN_LABELS[k]}
              </option>
            ))}
          </select>
        </div>

        {needSewnRf ? (
          <label className="text-text-primary flex items-center gap-2 text-[12px] font-semibold">
            <input
              type="checkbox"
              checked={Boolean(r.sewnInRussiaConfirmed)}
              onChange={(e) => setReleaseField('sewnInRussiaConfirmed', e.target.checked)}
              className="border-border-default text-accent-primary focus:ring-accent-primary h-4 w-4 rounded"
            />
            Пошив / изготовление в РФ подтверждены
          </label>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-text-muted text-[10px] font-semibold uppercase tracking-wide">
              Страна происхождения товара (факт после образца)
            </span>
            <Input
              className={field}
              value={r.countryOfOriginActual ?? ''}
              onChange={(e) => setReleaseField('countryOfOriginActual', e.target.value)}
              placeholder="По факту поставок ткани / фурнитуры"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-text-muted text-[10px] font-semibold uppercase tracking-wide">
              ТН ВЭД под отгрузку
            </span>
            <Input
              className={field}
              value={r.finalTnvedCode ?? ''}
              onChange={(e) => setReleaseField('finalTnvedCode', e.target.value)}
              placeholder="Утверждённый код"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-text-muted text-[10px] font-semibold uppercase tracking-wide">
              EAN / GTIN или код партии
            </span>
            <Input
              className={field}
              value={r.eanOrBatchCode ?? ''}
              onChange={(e) => setReleaseField('eanOrBatchCode', e.target.value)}
            />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-text-muted text-[10px] font-semibold uppercase tracking-wide">
              Маркировка и прослеживаемость (итог)
            </span>
            <Textarea
              className={cn(field, 'min-h-[64px] py-2')}
              value={r.markingTraceabilityNote ?? ''}
              onChange={(e) => setReleaseField('markingTraceabilityNote', e.target.value)}
            />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-text-muted text-[10px] font-semibold uppercase tracking-wide">
              ТР ТС / ЕАЭС — реквизит или ссылка
            </span>
            <Input
              className={field}
              value={r.technicalRegulationRef ?? ''}
              onChange={(e) => setReleaseField('technicalRegulationRef', e.target.value)}
            />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-text-muted text-[10px] font-semibold uppercase tracking-wide">
              ОКПД2 / отраслевой код (примечание)
            </span>
            <Input
              className={field}
              value={r.okpd2Note ?? ''}
              onChange={(e) => setReleaseField('okpd2Note', e.target.value)}
            />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-text-muted text-[10px] font-semibold uppercase tracking-wide">
              Декларация соответствия / сертификат (реквизиты){' '}
              <span className="text-text-muted font-normal normal-case">
                — для импорта / вне ЕАЭС / смешанной цепочки
              </span>
            </span>
            <Input
              className={field}
              value={r.declarationOrCertificateRef ?? ''}
              onChange={(e) => setReleaseField('declarationOrCertificateRef', e.target.value)}
            />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-text-muted text-[10px] font-semibold uppercase tracking-wide">
              Итоговый состав (если менялся на образце)
            </span>
            <Textarea
              className={cn(field, 'min-h-[56px] py-2')}
              value={r.actualCompositionNote ?? ''}
              onChange={(e) => setReleaseField('actualCompositionNote', e.target.value)}
              placeholder="Необязательно для гейта"
            />
          </label>
        </div>

        <div className="border-border-subtle flex flex-wrap items-center gap-3 border-t pt-3">
          <Button
            type="button"
            disabled={!intake.ok || fg.goldApproved}
            className="h-9 text-xs font-semibold"
            onClick={() =>
              void mergeBundle({
                fitGold: {
                  ...fg,
                  goldApproved: true,
                  approvedAt: new Date().toISOString(),
                },
              })
            }
          >
            Принять сэмпл в коллекцию
          </Button>
          {fg.goldApproved ? (
            <span className="text-[11px] font-medium text-emerald-700">Сэмпл уже принят.</span>
          ) : !intake.ok ? (
            <span className="text-text-secondary text-[11px]">
              Кнопка активна после закрытия гейта приёмки.
            </span>
          ) : null}
        </div>
      </div>
    </PanelShell>
  );
}

export function Workshop2ArticleFitGoldPanel() {
  const { bundle, loading, mergeBundle, dataMode } = useArticleWorkspace();

  if (loading || !bundle) return <p className="text-text-secondary text-[12px]">Загрузка…</p>;
  const fg = bundle.fitGold!;
  const hasComments = fg.fitComments.length > 0;

  return (
    <PanelShell
      title="Эталон · посадка"
      hint="Virtual fit и журнал комментариев по посадке образца. Включение сэмпла в коллекцию и комплаенс — на вкладке «Склад»."
      dataMode={dataMode}
      summary={`Комментарии: ${fg.fitComments.length} · Virtual fit: ${fg.virtualFitScore ?? '—'}% · Gold / коллекция: ${fg.goldApproved ? 'закрыто на складе' : 'ожидает склад'}`}
      readiness={
        fg.goldApproved
          ? 'Сэмпл принят в коллекцию (оформлено на складе)'
          : hasComments
            ? 'Есть записи по посадке'
            : 'Добавьте комментарии по примерке'
      }
      blockers={[]}
      nextAction={
        fg.goldApproved
          ? 'Переходите к плану PO и запуску.'
          : 'Откройте «Склад», заполните приёмку сэмпла и нажмите «Принять сэмпл в коллекцию».'
      }
    >
      <div className="border-border-subtle mb-4 flex flex-wrap items-center gap-3 border-b pb-4">
        {fg.virtualFitScore != null ? (
          <div className="flex items-center gap-2">
            <span className="text-text-muted text-[10px] font-bold uppercase tracking-wider">
              Virtual Fit Score:
            </span>
            <Badge className="h-5 border-emerald-100 bg-emerald-50 text-[10px] text-emerald-700">
              {fg.virtualFitScore}%
            </Badge>
          </div>
        ) : (
          <p className="text-text-secondary text-[11px]">Оценка Virtual Fit ещё не рассчитана.</p>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
          Журнал комментариев
        </p>
        {fg.fitComments.length === 0 ? (
          <p className="text-text-secondary text-[11px] italic">Комментариев пока нет.</p>
        ) : (
          <ul className="space-y-2">
            {fg.fitComments.map((c) => (
              <li
                key={c.id}
                className="border-border-subtle hover:border-accent-primary/20 group rounded-xl border bg-white p-3 shadow-sm transition-colors"
              >
                <div className="mb-1 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-bg-surface2 text-text-secondary flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-black">
                      {c.by?.[0] || 'U'}
                    </div>
                    <span className="text-text-primary text-[10px] font-black">
                      {c.by || 'Пользователь'}
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-bg-surface2 border-border-default h-3.5 text-[7px] uppercase"
                    >
                      {c.role === 'designer'
                        ? 'Дизайнер'
                        : c.role === 'technologist'
                          ? 'Технолог'
                          : 'Бренд-менеджер'}
                    </Badge>
                  </div>
                  <span className="text-text-muted font-mono text-[9px]">{c.at.split('T')[0]}</span>
                </div>
                <p className="text-text-secondary text-[11px] leading-relaxed">{c.text}</p>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => {
              const text = window.prompt('Комментарий дизайнера');
              if (text == null || !text.trim()) return;
              void mergeBundle({
                fitGold: {
                  ...fg,
                  fitComments: [
                    ...fg.fitComments,
                    {
                      id: newRowId(),
                      text: text.trim(),
                      at: new Date().toISOString(),
                      role: 'designer',
                      by: 'D. Designer',
                    },
                  ],
                },
              });
            }}
          >
            <LucideIcons.Plus className="h-3 w-3" /> Дизайнер
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => {
              const text = window.prompt('Комментарий технолога');
              if (text == null || !text.trim()) return;
              void mergeBundle({
                fitGold: {
                  ...fg,
                  fitComments: [
                    ...fg.fitComments,
                    {
                      id: newRowId(),
                      text: text.trim(),
                      at: new Date().toISOString(),
                      role: 'technologist',
                      by: 'T. Tech',
                    },
                  ],
                },
              });
            }}
          >
            <LucideIcons.Plus className="h-3 w-3" /> Технолог
          </Button>
        </div>
      </div>
    </PanelShell>
  );
}

export function Workshop2ArticlePlanPoPanel() {
  const { bundle, loading, mergeBundle, dataMode } = useArticleWorkspace();
  if (loading || !bundle) return <p className="text-text-secondary text-[12px]">Загрузка…</p>;
  const plan = bundle.planPo!;

  return (
    <div className="space-y-3">
      <Workshop2Core1MatrixBridgeCard />
      <PanelShell
        title="План · заказ (PO)"
        hint="Черновики и статусы заказов; дальше — связь с ERP и подтверждениями."
        dataMode={dataMode}
        summary={`PO lines: ${plan.purchaseOrders.length} · Nesting AI: ${plan.nestingAiOptimization ? 'готов' : 'не запускался'}`}
        readiness={
          plan.purchaseOrders.some((po) => po.status === 'confirmed' || po.status === 'closed')
            ? 'Есть подтвержденный PO'
            : plan.purchaseOrders.length > 0
              ? 'PO в работе'
              : 'Не начато'
        }
        blockers={plan.purchaseOrders.length === 0 ? ['Нет ни одного PO.'] : []}
        nextAction={
          plan.purchaseOrders.length === 0
            ? 'Создать первый PO и due date.'
            : 'Подтвердить PO и запустить подготовку к release.'
        }
      >
        {plan.purchaseOrders.length === 0 ? (
          <p className="text-text-secondary text-[11px] italic">Нет строк PO.</p>
        ) : (
          <ul className="space-y-2">
            {plan.purchaseOrders.map((po) => (
              <li
                key={po.id}
                className="bg-bg-surface2 border-border-subtle group grid gap-2 rounded-xl border p-2 shadow-sm sm:grid-cols-2"
              >
                <div className="space-y-1">
                  <Input
                    className="h-8 text-[11px] font-bold"
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
                      className="h-7 w-20 text-[10px]"
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
                      className="h-7 flex-1 text-[10px]"
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
                <div className="flex flex-col gap-1">
                  <select
                    className={cn(field, 'h-8')}
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
                    <option value="draft">черновик</option>
                    <option value="sent">отправлен</option>
                    <option value="confirmed">подтверждён</option>
                    <option value="closed">закрыт</option>
                  </select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[9px] font-black uppercase text-red-500 hover:bg-red-50"
                    onClick={() => {
                      void mergeBundle({
                        planPo: {
                          ...plan,
                          purchaseOrders: plan.purchaseOrders.filter((p) => p.id !== po.id),
                        },
                      });
                    }}
                  >
                    Удалить PO
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
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
                  { id: newRowId(), label: 'PO-2026-X', status: 'draft' as const },
                ],
              },
            })
          }
        >
          <LucideIcons.Plus className="h-3 w-3" /> Добавить PO
        </Button>
      </PanelShell>

      <Card className="border-accent-primary/20 bg-accent-primary/10 group relative overflow-hidden shadow-sm">
        <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5 transition-transform group-hover:scale-110">
          <LucideIcons.Zap className="text-accent-primary h-16 w-16" />
        </div>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LucideIcons.Zap className="text-accent-primary h-4 w-4" />
              <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
                Nesting AI Optimizer
              </h4>
            </div>
            <Badge className="bg-accent-primary h-4 border-none text-[8px] font-black text-white">
              AI ACTIVE
            </Badge>
          </div>

          {plan.nestingAiOptimization ? (
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <span className="text-text-primary text-[18px] font-black">
                  +{plan.nestingAiOptimization.efficiencyGainPct}%{' '}
                  <span className="text-text-muted text-[10px] font-bold uppercase">
                    Efficiency
                  </span>
                </span>
                <span className="text-text-muted text-[9px] font-bold uppercase tracking-tighter">
                  Last Run: {plan.nestingAiOptimization.lastRunAt.split('T')[0]}
                </span>
              </div>
              <div className="border-accent-primary/20 text-text-secondary rounded-lg border bg-white p-2 text-[9px] leading-tight">
                Optimized markers for: {plan.nestingAiOptimization.fabricsOptimized.join(', ')}
              </div>
            </div>
          ) : (
            <p className="text-text-secondary text-[11px] italic">
              AI-оптимизация раскладки еще не запускалась.
            </p>
          )}

          <Button
            variant="default"
            size="sm"
            className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/10 h-8 w-full gap-2 text-[9px] font-black uppercase tracking-widest shadow-lg"
            onClick={() => {
              void mergeBundle({
                planPo: {
                  ...plan,
                  nestingAiOptimization: {
                    lastRunAt: new Date().toISOString(),
                    efficiencyGainPct: 12.4,
                    fabricsOptimized: ['Main Shell (Wool)', 'Lining (Silk)'],
                  },
                },
              });
            }}
          >
            <LucideIcons.RefreshCw className="animate-spin-slow h-3 w-3" /> Run AI Nesting Analysis
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function Workshop2ArticleNestingPanel() {
  const { bundle, loading, mergeBundle, dataMode } = useArticleWorkspace();
  if (loading || !bundle) return <p className="text-text-secondary text-[12px]">Загрузка…</p>;
  const nesting = bundle.nesting!;

  return (
    <PanelShell
      title="Nesting"
      hint="Артефакты раскладки (ссылки на файлы — пока текстом)."
      dataMode={dataMode}
      summary={`Artifacts: ${nesting.artifacts.length}`}
      readiness={nesting.artifacts.length > 0 ? 'Есть раскладки и артефакты' : 'Не начато'}
      blockers={nesting.artifacts.length === 0 ? ['Нет артефактов раскладки.'] : []}
      nextAction={
        nesting.artifacts.length === 0
          ? 'Добавить первый artifact / marker result.'
          : 'Проверить эффективность и привязку к PO.'
      }
    >
      {nesting.artifacts.length === 0 ? (
        <p className="text-text-secondary text-[11px]">Нет вложений раскладки.</p>
      ) : (
        <ul className="space-y-2">
          {nesting.artifacts.map((a) => (
            <li key={a.id} className="border-border-subtle space-y-1 rounded border p-2">
              <Input
                className="h-8 text-[11px]"
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
              <div className="flex gap-2">
                <Input
                  className="h-8 text-[11px]"
                  placeholder="% утилизации"
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
                                  efficiencyPct !== undefined && !Number.isNaN(efficiencyPct)
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
            </li>
          ))}
        </ul>
      )}
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
                { id: newRowId(), title: 'Раскладка', at: new Date().toISOString() },
              ],
            },
          })
        }
      >
        Добавить артефакт
      </Button>
    </PanelShell>
  );
}

export function Workshop2ArticleReleasePanel() {
  const { bundle, loading, mergeBundle, dataMode } = useArticleWorkspace();
  if (loading || !bundle) return <p className="text-text-secondary text-[12px]">Загрузка…</p>;
  const rel = bundle.release ?? { note: '', shiftNote: '', subcontractNote: '', operations: [] };
  const operations = rel.operations ?? [];
  const totalSewingCostPerUnit = operations.reduce((acc, op) => acc + (op.costPerUnit || 0), 0);
  const totalSASH = operations.reduce((acc, op) => acc + (op.sash || 0), 0);

  return (
    <PanelShell
      title="Выпуск · Техпроцесс"
      hint="Смены, субподряд и перечень швейных операций (SASH/стоимость)."
      dataMode={dataMode}
      summary={`Операции: ${operations.length} · SASH: ${totalSASH.toFixed(2)} мин · ${totalSewingCostPerUnit.toLocaleString()} ₽/ед`}
      readiness={
        operations.some((op) => op.status === 'completed')
          ? 'Выпуск активен'
          : operations.length > 0
            ? 'Маршрут задан'
            : 'Не начато'
      }
      blockers={operations.length === 0 ? ['Нет техопераций для запуска.'] : []}
      nextAction={
        operations.length === 0
          ? 'Собрать маршрут операций по SKU.'
          : 'Отслеживать bottlenecks и подтверждать completed ops.'
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="mb-1 flex items-center justify-between">
            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
              Технологические операции
            </p>
            <div className="flex gap-4 text-right">
              <div>
                <span className="text-text-muted text-[9px] font-bold uppercase">
                  Общее время:{' '}
                </span>
                <span className="text-text-primary text-[11px] font-black">
                  {totalSASH.toFixed(2)} мин
                </span>
              </div>
              <div>
                <span className="text-text-muted text-[9px] font-bold uppercase">
                  Итого (пошив):{' '}
                </span>
                <span className="text-accent-primary text-[11px] font-black">
                  {totalSewingCostPerUnit.toLocaleString()} ₽/ед
                </span>
              </div>
            </div>
          </div>
          {operations.length === 0 ? (
            <p className="text-text-secondary text-[11px] italic">Операции не заданы.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-border-subtle text-text-muted border-b text-left">
                    <th className="pb-1 font-semibold">Название</th>
                    <th className="pb-1 font-semibold">SASH (мин)</th>
                    <th className="pb-1 font-semibold">Цена (₽)</th>
                    <th className="pb-1 font-semibold">Статус</th>
                    <th className="pb-1"></th>
                  </tr>
                </thead>
                <tbody className="divide-border-subtle divide-y">
                  {operations.map((op) => (
                    <tr key={op.id}>
                      <td className="py-2">
                        <Input
                          className="h-7 border-none bg-transparent text-[11px] focus:bg-white"
                          value={op.name}
                          onChange={(e) => {
                            const name = e.target.value;
                            void mergeBundle({
                              release: {
                                ...rel,
                                operations: operations.map((o) =>
                                  o.id === op.id ? { ...o, name } : o
                                ),
                              },
                            });
                          }}
                        />
                      </td>
                      <td className="py-2">
                        <Input
                          className="h-7 w-16 border-none bg-transparent text-[11px] focus:bg-white"
                          value={op.sash}
                          type="number"
                          onChange={(e) => {
                            const sash = Number(e.target.value);
                            void mergeBundle({
                              release: {
                                ...rel,
                                operations: operations.map((o) =>
                                  o.id === op.id ? { ...o, sash } : o
                                ),
                              },
                            });
                          }}
                        />
                      </td>
                      <td className="py-2">
                        <Input
                          className="h-7 w-16 border-none bg-transparent text-[11px] focus:bg-white"
                          value={op.costPerUnit}
                          type="number"
                          onChange={(e) => {
                            const costPerUnit = Number(e.target.value);
                            void mergeBundle({
                              release: {
                                ...rel,
                                operations: operations.map((o) =>
                                  o.id === op.id ? { ...o, costPerUnit } : o
                                ),
                              },
                            });
                          }}
                        />
                      </td>
                      <td className="py-2">
                        <select
                          className="h-7 bg-transparent text-[10px] font-semibold outline-none"
                          value={op.status}
                          onChange={(e) => {
                            const status = e.target.value as (typeof operations)[0]['status'];
                            void mergeBundle({
                              release: {
                                ...rel,
                                operations: operations.map((o) =>
                                  o.id === op.id ? { ...o, status } : o
                                ),
                              },
                            });
                          }}
                        >
                          <option value="pending">Ожидает</option>
                          <option value="in_progress">В работе</option>
                          <option value="completed">Готово</option>
                        </select>
                      </td>
                      <td className="py-2 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-text-muted h-6 w-6 p-0 hover:text-red-500"
                          onClick={() => {
                            void mergeBundle({
                              release: {
                                ...rel,
                                operations: operations.filter((o) => o.id !== op.id),
                              },
                            });
                          }}
                        >
                          ×
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 text-[10px] font-bold uppercase tracking-wider"
            onClick={() => {
              void mergeBundle({
                release: {
                  ...rel,
                  operations: [
                    ...operations,
                    {
                      id: newRowId(),
                      name: 'Новая операция',
                      sash: 0,
                      costPerUnit: 0,
                      status: 'pending',
                    },
                  ],
                },
              });
            }}
          >
            Добавить операцию
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-text-muted text-[10px] font-semibold uppercase tracking-wide">
              Смены
            </span>
            <textarea
              className={cn(field, 'min-h-[48px] py-2')}
              value={rel.shiftNote ?? ''}
              onChange={(e) => void mergeBundle({ release: { ...rel, shiftNote: e.target.value } })}
              placeholder="График работы, мастера..."
            />
          </label>
          <label className="block space-y-1">
            <span className="text-text-muted text-[10px] font-semibold uppercase tracking-wide">
              Субподряд
            </span>
            <textarea
              className={cn(field, 'min-h-[48px] py-2')}
              value={rel.subcontractNote ?? ''}
              onChange={(e) =>
                void mergeBundle({ release: { ...rel, subcontractNote: e.target.value } })
              }
              placeholder="Внешние цеха, спец. операции..."
            />
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-text-muted text-[10px] font-semibold uppercase tracking-wide">
            Общая заметка
          </span>
          <textarea
            className={cn(field, 'min-h-[56px] py-2')}
            value={rel.note ?? ''}
            onChange={(e) => void mergeBundle({ release: { ...rel, note: e.target.value } })}
            placeholder="Особые инструкции по выпуску..."
          />
        </label>
      </div>
    </PanelShell>
  );
}

export function Workshop2ArticleQcPanel() {
  const { bundle, loading, mergeBundle, dataMode } = useArticleWorkspace();
  if (loading || !bundle) return <p className="text-text-secondary text-[12px]">Загрузка…</p>;
  const qc = bundle.qc!;

  return (
    <div className="space-y-3">
      <PanelShell
        title="ОТК · Контроль качества"
        hint="Партии и статусы проверки; позже мобильный QC и фото."
        dataMode={dataMode}
        summary={`Партии: ${qc.batches.length}`}
        readiness={
          qc.batches.some((batch) => batch.status === 'failed')
            ? 'Есть quality issue'
            : qc.batches.length > 0
              ? 'QC в работе'
              : 'Не начато'
        }
        blockers={qc.batches
          .filter((batch) => batch.status === 'failed')
          .map((batch) => `Партия ${batch.label}: failed`)}
        nextAction={
          qc.batches.length === 0
            ? 'Добавить batch и завести AQL-проверку.'
            : 'Разобрать failed/rework batch и закрыть corrective loop.'
        }
      >
        {qc.batches.length === 0 ? (
          <p className="text-text-secondary text-[11px] italic">Нет партий для инспекции.</p>
        ) : (
          <ul className="space-y-3">
            {qc.batches.map((b) => {
              const aql = b.batchSize ? getAqlPlan(b.batchSize, '2.5') : null;
              const isAqlFail = aql && b.majorDefects != null && b.majorDefects >= aql.rejectLimit;

              return (
                <li
                  key={b.id}
                  className="border-border-subtle hover:border-accent-primary/20 group rounded-2xl border bg-white p-3 shadow-sm transition-all"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="flex-1 space-y-1">
                        <Input
                          className="bg-bg-surface2 h-8 border-none text-[11px] font-black uppercase tracking-tight focus:bg-white"
                          value={b.label}
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
                          <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                            {b.at?.split('T')[0]}
                          </span>
                          {b.defectPhotosCount != null && b.defectPhotosCount > 0 && (
                            <div className="flex items-center gap-1">
                              <LucideIcons.Image className="text-accent-primary h-2.5 w-2.5" />
                              <span className="text-accent-primary text-[9px] font-black">
                                {b.defectPhotosCount} photos
                              </span>
                            </div>
                          )}
                          {isAqlFail && (
                            <Badge className="h-4 border-none bg-rose-500 text-[8px] font-black text-white">
                              AQL REJECT
                            </Badge>
                          )}
                          {!isAqlFail && aql && b.majorDefects != null && (
                            <Badge className="h-4 border-none bg-emerald-500 text-[8px] font-black text-white">
                              AQL PASS
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          className={cn(field, 'h-8 sm:w-32')}
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
                          <option value="pending">ожидает</option>
                          <option value="passed">принято</option>
                          <option value="failed">брак</option>
                          <option value="rework">доработка</option>
                        </select>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-text-muted h-8 w-8 p-0 hover:text-red-500"
                          onClick={() => {
                            void mergeBundle({
                              qc: {
                                ...qc,
                                batches: qc.batches.filter((x) => x.id !== b.id),
                              },
                            });
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    </div>

                    <div className="bg-bg-surface2/80 border-border-subtle grid grid-cols-2 gap-3 rounded-xl border p-2 sm:grid-cols-4">
                      <div className="space-y-1">
                        <p className="text-text-muted text-[8px] font-black uppercase">
                          Партия (ед)
                        </p>
                        <Input
                          type="number"
                          className="h-7 text-[10px]"
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
                        <p className="text-text-muted text-[8px] font-black uppercase">
                          Выборка (AQL)
                        </p>
                        <div className="border-border-default text-text-secondary flex h-7 items-center rounded-md border bg-white px-2 text-[10px] font-bold">
                          {aql ? `${aql.sampleSize} ед.` : '—'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-text-muted text-[8px] font-black uppercase">
                          Крит. брак
                        </p>
                        <Input
                          type="number"
                          className="h-7 text-[10px]"
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
                        <p className="text-text-muted text-[8px] font-black uppercase">
                          Порог (Re)
                        </p>
                        <div
                          className={cn(
                            'flex h-7 items-center rounded-md px-2 text-[10px] font-bold',
                            aql
                              ? 'border-border-default text-text-secondary border bg-white'
                              : 'text-text-muted'
                          )}
                        >
                          {aql ? `≥ ${aql.rejectLimit} ед.` : '—'}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() =>
            void mergeBundle({
              qc: {
                ...qc,
                batches: [
                  ...qc.batches,
                  {
                    id: newRowId(),
                    label: 'BATCH-2026-01',
                    status: 'pending' as const,
                    at: new Date().toISOString(),
                    defectPhotosCount: 0,
                  },
                ],
              },
            })
          }
        >
          <LucideIcons.Plus className="h-3 w-3" /> Добавить партию
        </Button>
      </PanelShell>

      <Card className="border-accent-primary/20 bg-accent-primary/10 group relative overflow-hidden shadow-sm">
        <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-5 transition-transform group-hover:scale-110">
          <LucideIcons.Smartphone className="text-accent-primary h-16 w-16" />
        </div>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="border-accent-primary/20 flex h-10 w-10 items-center justify-center rounded-xl border bg-white shadow-sm">
              <LucideIcons.Scan className="text-accent-primary h-5 w-5" />
            </div>
            <div>
              <h4 className="text-text-primary text-[11px] font-black uppercase leading-tight tracking-tight">
                Mobile QC Inspector
              </h4>
              <p className="text-text-secondary text-[9px] font-medium">
                Link with factory-floor mobile devices for photo defect logging.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-accent-primary/30 text-accent-primary hover:bg-accent-primary/10 h-8 text-[9px] font-black uppercase tracking-widest"
          >
            Open App Mock <LucideIcons.ArrowRight className="ml-1 h-2.5 w-2.5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function Workshop2ArticleStockPanel() {
  const { bundle, loading, mergeBundle, dataMode } = useArticleWorkspace();
  if (loading || !bundle) return <p className="text-text-secondary text-[12px]">Загрузка…</p>;
  const stock = bundle.stock!;

  const totalQtyOnHand = stock.movements.reduce((acc, m) => {
    if (m.kind === 'in') return acc + m.qty;
    if (m.kind === 'out') return acc - m.qty;
    return acc;
  }, 0);

  const avgUnitCost =
    stock.movements.length > 0
      ? stock.movements.reduce((acc, m) => acc + m.unitCostRub, 0) / stock.movements.length
      : 0;

  return (
    <div className="space-y-3">
      <Workshop2ArticleSampleIntakeStockSection mergeBundle={mergeBundle} dataMode={dataMode} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="border-border-default flex items-center justify-between bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-bg-surface2 flex h-10 w-10 items-center justify-center rounded-xl">
              <LucideIcons.Boxes className="text-text-secondary h-5 w-5" />
            </div>
            <div>
              <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                Текущий остаток
              </p>
              <p className="text-text-primary text-xl font-black">
                {totalQtyOnHand.toLocaleString()} ед.
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="bg-bg-surface2 text-text-secondary border-border-default h-5 text-[8px] font-black uppercase"
          >
            Live Inventory
          </Badge>
        </Card>
        <Card className="border-border-default flex items-center justify-between bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-accent-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
              <LucideIcons.CircleDollarSign className="text-accent-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                Средняя себестоимость
              </p>
              <p className="text-text-primary text-xl font-black">
                {avgUnitCost.toLocaleString()} ₽/ед
              </p>
            </div>
          </div>
          <LucideIcons.TrendingUp className="h-4 w-4 text-emerald-500" />
        </Card>
      </div>

      <PanelShell
        title="Склад · Движение товара"
        hint="Остатки и движения по складу готовой продукции."
        dataMode={dataMode}
        summary={`Движения: ${stock.movements.length} · Остаток: ${totalQtyOnHand.toLocaleString()} ед.`}
        readiness={stock.movements.length > 0 ? 'Есть движения по ГП' : 'Не начато'}
        blockers={stock.movements.length === 0 ? ['Нет приемки / движений по складу.'] : []}
        nextAction={
          stock.movements.length === 0
            ? 'Зафиксировать первую приемку или движение.'
            : 'Проверить blocked units / release to ship.'
        }
      >
        {stock.movements.length === 0 ? (
          <p className="text-text-secondary text-[11px] italic">
            Движений по складу не зафиксировано.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-border-subtle text-text-muted border-b text-left uppercase tracking-tighter">
                  <th className="pb-2 font-bold">Операция</th>
                  <th className="pb-2 font-bold">Тип</th>
                  <th className="pb-2 font-bold">Кол-во</th>
                  <th className="pb-2 font-bold">Себ-ть</th>
                  <th className="pb-2 font-bold">Дата</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody className="divide-border-subtle divide-y">
                {stock.movements.map((m) => (
                  <tr key={m.id} className="hover:bg-bg-surface2/80 group transition-colors">
                    <td className="py-2.5">
                      <Input
                        className="h-7 border-none bg-transparent text-[11px] font-bold focus:bg-white"
                        value={m.label}
                        onChange={(e) =>
                          void mergeBundle({
                            stock: {
                              ...stock,
                              movements: stock.movements.map((x) =>
                                x.id === m.id ? { ...x, label: e.target.value } : x
                              ),
                            },
                          })
                        }
                      />
                    </td>
                    <td className="py-2.5">
                      <select
                        className="h-7 bg-transparent text-[10px] font-semibold outline-none"
                        value={m.kind}
                        onChange={(e) => {
                          const kind = e.target.value as (typeof stock.movements)[0]['kind'];
                          void mergeBundle({
                            stock: {
                              ...stock,
                              movements: stock.movements.map((x) =>
                                x.id === m.id ? { ...x, kind } : x
                              ),
                            },
                          });
                        }}
                      >
                        <option value="in">Приход</option>
                        <option value="out">Расход</option>
                        <option value="transfer">Перемещение</option>
                      </select>
                    </td>
                    <td className="py-2.5">
                      <Input
                        className="h-7 w-16 border-none bg-transparent text-right text-[11px] focus:bg-white"
                        type="number"
                        value={m.qty}
                        onChange={(e) => {
                          const qty = Number(e.target.value);
                          void mergeBundle({
                            stock: {
                              ...stock,
                              movements: stock.movements.map((x) =>
                                x.id === m.id ? { ...x, qty } : x
                              ),
                            },
                          });
                        }}
                      />
                    </td>
                    <td className="py-2.5">
                      <Input
                        className="text-accent-primary h-7 w-20 border-none bg-transparent text-right text-[11px] font-black focus:bg-white"
                        type="number"
                        value={m.unitCostRub}
                        onChange={(e) => {
                          const unitCostRub = Number(e.target.value);
                          void mergeBundle({
                            stock: {
                              ...stock,
                              movements: stock.movements.map((x) =>
                                x.id === m.id ? { ...x, unitCostRub } : x
                              ),
                            },
                          });
                        }}
                      />
                    </td>
                    <td className="text-text-muted py-2.5 font-mono text-[9px]">
                      {m.at.split('T')[0]}
                    </td>
                    <td className="py-2.5 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-text-muted h-6 w-6 p-0 hover:text-red-500"
                        onClick={() => {
                          void mergeBundle({
                            stock: {
                              ...stock,
                              movements: stock.movements.filter((x) => x.id !== m.id),
                            },
                          });
                        }}
                      >
                        ×
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() =>
            void mergeBundle({
              stock: {
                ...stock,
                movements: [
                  ...stock.movements,
                  {
                    id: newRowId(),
                    label: 'Приёмка партии',
                    at: new Date().toISOString(),
                    kind: 'in' as const,
                    qty: 100,
                    unitCostRub: 2500,
                  },
                ],
              },
            })
          }
        >
          <LucideIcons.Plus className="h-3 w-3" /> Добавить операцию
        </Button>
      </PanelShell>
    </div>
  );
}

export type Workshop2ArticleWorkspaceMainTab =
  | 'supply'
  | 'fit'
  | 'plan'
  | 'release'
  | 'qc'
  | 'stock';

const W2_SECTION_FLASH_CLASS = 'rounded-xl transition-[box-shadow] duration-300';

function SectionFlashWrap({
  id,
  flashSectionId,
  children,
}: {
  id: string;
  flashSectionId: string | null;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      className={cn(
        W2_SECTION_FLASH_CLASS,
        flashSectionId === id && 'ring-accent-primary ring-offset-bg-surface2 ring-4 ring-offset-2'
      )}
    >
      {children}
    </div>
  );
}

export function Workshop2ArticleWorkspaceTabPanels({
  tab,
  flashSectionId = null,
}: {
  tab: Workshop2ArticleWorkspaceMainTab;
  flashSectionId?: string | null;
}) {
  switch (tab) {
    case 'supply':
      return (
        <SectionFlashWrap id={W2_ARTICLE_SECTION_DOM.supply} flashSectionId={flashSectionId}>
          <Workshop2ArticleSupplyPanel />
        </SectionFlashWrap>
      );
    case 'fit':
      return (
        <SectionFlashWrap id={W2_ARTICLE_SECTION_DOM.fit} flashSectionId={flashSectionId}>
          <Workshop2ArticleFitGoldPanel />
        </SectionFlashWrap>
      );
    case 'plan':
      return (
        <div className="grid gap-3 lg:grid-cols-2">
          <SectionFlashWrap id={W2_ARTICLE_SECTION_DOM.planPo} flashSectionId={flashSectionId}>
            <Workshop2ArticlePlanPoPanel />
          </SectionFlashWrap>
          <SectionFlashWrap id={W2_ARTICLE_SECTION_DOM.planNest} flashSectionId={flashSectionId}>
            <Workshop2ArticleNestingPanel />
          </SectionFlashWrap>
        </div>
      );
    case 'release':
      return (
        <SectionFlashWrap id={W2_ARTICLE_SECTION_DOM.release} flashSectionId={flashSectionId}>
          <Workshop2ArticleReleasePanel />
        </SectionFlashWrap>
      );
    case 'qc':
      return (
        <SectionFlashWrap id={W2_ARTICLE_SECTION_DOM.qc} flashSectionId={flashSectionId}>
          <Workshop2ArticleQcPanel />
        </SectionFlashWrap>
      );
    case 'stock':
      return (
        <SectionFlashWrap id={W2_ARTICLE_SECTION_DOM.stock} flashSectionId={flashSectionId}>
          <Workshop2ArticleStockPanel />
        </SectionFlashWrap>
      );
    default:
      return null;
  }
}
