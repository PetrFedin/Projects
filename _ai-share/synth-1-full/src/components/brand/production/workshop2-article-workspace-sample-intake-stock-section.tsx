'use client';

import { useCallback, useEffect, useState } from 'react';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ArticleWorkspaceBundle } from '@/lib/production/article-workspace/types';
import type {
  Workshop2DossierPhase1,
  Workshop2SampleProductionChainMode,
  Workshop2SampleIntakeReworkIteration,
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
import { newW2ArticleTabPanelRowId as newRowId } from '@/components/brand/production/workshop2-article-workspace-tab-panels-shared';

export function Workshop2ArticleSampleIntakeStockSection({
  mergeBundle,
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
  const reworkHistory = r.reworkHistory ?? [];

  const setReleaseField = <K extends keyof typeof r>(key: K, value: (typeof r)[K]) => {
    patchDossier({
      sampleIntakeRelease: { ...r, [key]: value },
    });
  };

  const addRework = () => {
    const newIteration: Workshop2SampleIntakeReworkIteration = {
      id: newRowId(),
      date: new Date().toISOString(),
      comment: '',
      status: 'returned_to_factory',
    };
    setReleaseField('reworkHistory', [...reworkHistory, newIteration]);
  };

  const updateRework = (id: string, updates: Partial<Workshop2SampleIntakeReworkIteration>) => {
    setReleaseField(
      'reworkHistory',
      reworkHistory.map((x) => (x.id === id ? { ...x, ...updates } : x))
    );
  };

  const fieldClass =
    'border-border-default h-8 w-full rounded-md border bg-white px-2 text-[11px] font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <LucideIcons.PackageCheck className="h-4 w-4 shrink-0" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-text-primary text-sm font-semibold">
              Склад приемки (Sample Intake)
            </h2>
            <p className="text-text-secondary text-[11px] leading-snug">
              Приемка сэмпла в коллекцию, контроль доработок, комплаенс и утверждение Gold-образца.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1">
          <label className="text-text-muted text-[10px] font-semibold">
            Режим цепочки производства
          </label>
          <select
            className={cn(fieldClass, 'bg-white')}
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

        {needSewnRf && (
          <div className="flex items-end space-y-1 pb-1">
            <label className="text-text-primary flex cursor-pointer items-center gap-2 text-[11px] font-medium">
              <input
                type="checkbox"
                checked={Boolean(r.sewnInRussiaConfirmed)}
                onChange={(e) => setReleaseField('sewnInRussiaConfirmed', e.target.checked)}
                className="border-border-default text-accent-primary focus:ring-accent-primary h-4 w-4 rounded"
              />
              Пошив / изготовление в РФ подтверждены
            </label>
          </div>
        )}
      </div>

      <div className="border-border-subtle space-y-4 border-t pt-4">
        <h3 className="text-text-primary text-sm font-semibold">Процесс доработки образца</h3>
        <p className="text-text-secondary text-[11px] leading-snug">
          Если образец имеет дефекты или не соответствует требованиям, верните его на фабрику с
          комментариями.
        </p>

        {reworkHistory.length > 0 && (
          <div className="space-y-3">
            {reworkHistory.map((rw, index) => (
              <div
                key={rw.id}
                className="space-y-3 rounded-lg border border-amber-200/60 bg-amber-50/30 p-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold text-amber-900">
                    Итерация доработки #{index + 1}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-amber-700/70">
                      {rw.date.split('T')[0]}
                    </span>
                    <select
                      className={cn(fieldClass, 'h-7 w-auto bg-white py-0 text-[10px]')}
                      value={rw.status}
                      onChange={(e) =>
                        updateRework(rw.id, {
                          status: e.target.value as 'returned_to_factory' | 'received_back',
                        })
                      }
                    >
                      <option value="returned_to_factory">Отправлено на фабрику</option>
                      <option value="received_back">Получено обратно</option>
                    </select>
                  </div>
                </div>
                <Textarea
                  className="min-h-[60px] resize-none border-amber-200/60 bg-white text-[11px] focus-visible:ring-amber-500/30"
                  placeholder="Опишите замечания к образцу и требования по доработке..."
                  value={rw.comment}
                  onChange={(e) => updateRework(rw.id, { comment: e.target.value })}
                />
              </div>
            ))}
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={addRework}
          disabled={fg.goldApproved}
        >
          <LucideIcons.ArrowLeftRight className="mr-1.5 h-3.5 w-3.5" />
          Отправить на доработку
        </Button>
      </div>

      <div className="border-border-subtle space-y-3 border-t pt-4">
        <h3 className="text-text-primary text-sm font-semibold">Реквизиты и комплаенс</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-text-muted text-[10px] font-semibold">
              Страна происхождения (факт)
            </span>
            <Input
              className={fieldClass}
              value={r.countryOfOriginActual ?? ''}
              onChange={(e) => setReleaseField('countryOfOriginActual', e.target.value)}
              placeholder="По факту поставок ткани / фурнитуры"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-text-muted text-[10px] font-semibold">ТН ВЭД под отгрузку</span>
            <Input
              className={fieldClass}
              value={r.finalTnvedCode ?? ''}
              onChange={(e) => setReleaseField('finalTnvedCode', e.target.value)}
              placeholder="Утверждённый код"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-text-muted text-[10px] font-semibold">
              EAN / GTIN или код партии
            </span>
            <Input
              className={fieldClass}
              value={r.eanOrBatchCode ?? ''}
              onChange={(e) => setReleaseField('eanOrBatchCode', e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-text-muted text-[10px] font-semibold">
              ТР ТС / ЕАЭС — реквизит
            </span>
            <Input
              className={fieldClass}
              value={r.technicalRegulationRef ?? ''}
              onChange={(e) => setReleaseField('technicalRegulationRef', e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-text-muted text-[10px] font-semibold">
              ОКПД2 / отраслевой код
            </span>
            <Input
              className={fieldClass}
              value={r.okpd2Note ?? ''}
              onChange={(e) => setReleaseField('okpd2Note', e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-text-muted text-[10px] font-semibold">
              Декларация / сертификат
            </span>
            <Input
              className={fieldClass}
              value={r.declarationOrCertificateRef ?? ''}
              onChange={(e) => setReleaseField('declarationOrCertificateRef', e.target.value)}
            />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-text-muted text-[10px] font-semibold">
              Маркировка и прослеживаемость (итог)
            </span>
            <Textarea
              className={cn(fieldClass, 'min-h-[60px] py-2')}
              value={r.markingTraceabilityNote ?? ''}
              onChange={(e) => setReleaseField('markingTraceabilityNote', e.target.value)}
            />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="text-text-muted text-[10px] font-semibold">
              Итоговый состав (если менялся на образце)
            </span>
            <Textarea
              className={cn(fieldClass, 'min-h-[56px] py-2')}
              value={r.actualCompositionNote ?? ''}
              onChange={(e) => setReleaseField('actualCompositionNote', e.target.value)}
              placeholder="Необязательно для гейта"
            />
          </label>
        </div>
      </div>

      <div className="border-border-subtle flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <div>
          {fg.goldApproved ? (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
              <LucideIcons.CheckCircle className="h-4 w-4" />
              Сэмпл принят (Gold)
            </span>
          ) : !intake.ok ? (
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-amber-700">
              <LucideIcons.AlertCircle className="h-4 w-4" />
              Заполните обязательные поля
            </span>
          ) : reworkHistory.some((rw) => rw.status === 'returned_to_factory') ? (
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-amber-700">
              <LucideIcons.AlertCircle className="h-4 w-4" />
              Ожидается возврат образца с доработки
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-blue-700">
              <LucideIcons.Info className="h-4 w-4" />
              Готово к приемке
            </span>
          )}
        </div>
        <Button
          type="button"
          disabled={
            !intake.ok ||
            fg.goldApproved ||
            reworkHistory.some((rw) => rw.status === 'returned_to_factory')
          }
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
          Принять сэмпл (Утвердить Gold)
        </Button>
      </div>
    </div>
  );
}
