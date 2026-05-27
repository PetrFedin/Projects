'use client';

import { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import * as LucideIcons from 'lucide-react';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import { useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import {
  getWorkshop2Phase1Dossier,
  setWorkshop2Phase1Dossier,
} from '@/lib/production/workshop2-phase1-dossier-storage';

export type Workshop2B2BIntegrationPanelProps = {
  dossier: Workshop2DossierPhase1;
  articleId?: string;
};

export function Workshop2B2BIntegrationPanel({
  dossier: initialDossier,
  articleId,
}: Workshop2B2BIntegrationPanelProps) {
  const { ref, loading } = useArticleWorkspace();
  const [dossier, setDossier] = useState<Workshop2DossierPhase1>(initialDossier);

  const reloadDossier = useCallback(() => {
    const loaded = getWorkshop2Phase1Dossier(ref.collectionId, ref.articleId);
    if (loaded) setDossier(loaded);
  }, [ref.articleId, ref.collectionId]);

  useEffect(() => {
    if (loading) return;
    reloadDossier();
  }, [loading, reloadDossier]);

  const persist = useCallback(
    (next: Workshop2DossierPhase1) => {
      setDossier(next);
      setWorkshop2Phase1Dossier(ref.collectionId, ref.articleId, next);
    },
    [ref.articleId, ref.collectionId]
  );

  const draft = dossier.b2bIntegrationDraft || {};

  const isLive = draft.isLive ?? false;
  const wholesalePrice = draft.wholesalePrice ?? '45.00';
  const msrp = draft.msrp ?? '110.00';
  const moq = draft.moq ?? '50';
  const startDate = draft.startDate ?? '2026-06-01';
  const endDate = draft.endDate ?? '2026-06-30';

  const updateDraft = (
    patch: Partial<NonNullable<Workshop2DossierPhase1['b2bIntegrationDraft']>>
  ) => {
    persist({
      ...dossier,
      b2bIntegrationDraft: { ...draft, ...patch },
      updatedAt: new Date().toISOString(),
      updatedBy: 'b2b-integration-panel',
    });
  };

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const articleName =
    dossier.assignments?.find((a) => a.attributeId === 'name')?.values?.[0]?.displayLabel ||
    'Безымянный артикул';
  const articleSku =
    dossier.assignments?.find((a) => a.attributeId === 'sku')?.values?.[0]?.displayLabel ||
    articleId ||
    'N/A';

  const handleSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    setSyncSuccess(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      if (progress >= 100) {
        clearInterval(interval);
        setSyncProgress(100);
        setTimeout(() => {
          setIsSyncing(false);
          setSyncSuccess(true);
          setTimeout(() => setSyncSuccess(false), 3000);
        }, 500);
      } else {
        setSyncProgress(progress);
      }
    }, 200);
  };

  return (
    <div className="border-border-default w-full space-y-6 rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Управление цифровым шоурумом и кампаниями предзаказа для {articleName} ({articleSku}).
          </p>
        </div>
        <div className="flex items-center gap-3">
          {syncSuccess && (
            <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 animate-in fade-in slide-in-from-right-4">
              <LucideIcons.CheckCircle2 className="h-4 w-4" /> Синхронизировано
            </span>
          )}
          <Button
            onClick={handleSync}
            disabled={isSyncing || syncSuccess}
            className="relative gap-2 overflow-hidden"
          >
            {isSyncing ? (
              <>
                <LucideIcons.RefreshCw className="h-4 w-4 animate-spin" />
                Синхронизация...
              </>
            ) : syncSuccess ? (
              <>
                <LucideIcons.Check className="h-4 w-4" />
                Успешно
              </>
            ) : (
              <>
                <LucideIcons.UploadCloud className="h-4 w-4" />
                Синхронизировать с B2B-порталом
              </>
            )}
            {isSyncing && (
              <div
                className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-200"
                style={{ width: `${syncProgress}%` }}
              />
            )}
          </Button>
        </div>
      </div>

      <div className="mt-4 min-w-0 space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <div className="border-border-subtle bg-bg-surface2/40 rounded-lg border p-3">
            <div className="text-text-secondary mb-2 text-[10px] font-semibold uppercase tracking-wider">
              Конверсия
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-primary text-lg font-bold">14.2%</span>
              <LucideIcons.MousePointerClick className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-emerald-600">
              <LucideIcons.ArrowUpRight className="h-3 w-3" /> +2.1% за неделю
            </p>
          </div>
          <div className="border-border-subtle bg-bg-surface2/40 rounded-lg border p-3">
            <div className="text-text-secondary mb-2 text-[10px] font-semibold uppercase tracking-wider">
              Популярные размеры
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-primary text-lg font-bold">M, L</span>
              <LucideIcons.Ruler className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-text-secondary mt-1 text-[10px]">Составляют 68% от объема</p>
          </div>
          <div className="border-border-subtle bg-bg-surface2/40 rounded-lg border p-3">
            <div className="text-text-secondary mb-2 text-[10px] font-semibold uppercase tracking-wider">
              Выручка (Опт)
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-primary text-lg font-bold">
                {(500 * parseFloat(wholesalePrice || '0')).toLocaleString()} ₽
              </span>
              <LucideIcons.RussianRuble className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-text-secondary mt-1 text-[10px]">Ожидается от 500 предзаказов</p>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="border-border-subtle bg-bg-surface2/20 space-y-4 rounded-lg border p-3">
          <div className="border-border-subtle flex items-center justify-between border-b pb-2">
            <h3 className="text-text-primary flex items-center gap-1.5 text-sm font-semibold">
              <LucideIcons.Settings className="h-4 w-4 text-slate-400" />
              Настройки шоурума
            </h3>
          </div>

          <div className="space-y-4">
            <div className="border-border-subtle flex items-center justify-between rounded-md border bg-white p-3">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold">Показывать в шоуруме</Label>
                <p className="text-[10px] text-slate-500">
                  Сделать артикул видимым для зарегистрированных B2B-покупателей.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="live-toggle"
                  checked={isLive}
                  onCheckedChange={(checked) => updateDraft({ isLive: checked as boolean })}
                  className="h-4 w-4"
                />
                <Label htmlFor="live-toggle" className="cursor-pointer text-[11px] font-medium">
                  Опубликовано
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="border-border-subtle space-y-3 rounded-md border bg-white p-3">
                <h3 className="text-text-muted text-[11px] font-semibold uppercase tracking-wider">
                  Ценообразование (₽)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="wholesalePrice" className="text-[11px] font-medium">
                      Оптовая цена
                    </Label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                        ₽
                      </span>
                      <Input
                        id="wholesalePrice"
                        type="number"
                        value={wholesalePrice}
                        onChange={(e) => updateDraft({ wholesalePrice: e.target.value })}
                        className="h-8 pl-6 text-xs font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="msrp" className="text-[11px] font-medium">
                      РРЦ
                    </Label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                        ₽
                      </span>
                      <Input
                        id="msrp"
                        type="number"
                        value={msrp}
                        onChange={(e) => updateDraft({ msrp: e.target.value })}
                        className="h-8 pl-6 text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-border-subtle space-y-3 rounded-md border bg-white p-3">
                <h3 className="text-text-muted text-[11px] font-semibold uppercase tracking-wider">
                  Детали кампании
                </h3>
                <div className="space-y-1.5">
                  <Label htmlFor="moq" className="text-[11px] font-medium">
                    Минимальный заказ (MOQ)
                  </Label>
                  <div className="relative">
                    <Input
                      id="moq"
                      type="number"
                      value={moq}
                      onChange={(e) => updateDraft({ moq: e.target.value })}
                      className="h-8 pr-10 text-xs font-medium"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500">
                      шт.
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="startDate" className="text-[11px] font-medium">
                      Начало
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => updateDraft({ startDate: e.target.value })}
                      className="h-8 px-2 text-[11px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="endDate" className="text-[11px] font-medium">
                      Конец
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => updateDraft({ endDate: e.target.value })}
                      className="h-8 px-2 text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <span className="text-text-muted text-[10px]">
                Изменения сохраняются автоматически
              </span>
            </div>
          </div>
        </div>

        {/* Campaign Link Section */}
        <div className="border-border-subtle bg-bg-surface2/50 rounded-lg border border-dashed p-3">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="border-border-subtle rounded-lg border bg-white p-2 shadow-sm">
                <LucideIcons.Link className="text-text-secondary h-4 w-4" />
              </div>
              <div>
                <h4 className="text-text-primary text-[11px] font-semibold">
                  Ссылка на B2B-шоурум
                </h4>
                <p className="text-text-secondary text-[10px]">
                  Отправьте эту ссылку приглашенным байерам
                </p>
              </div>
            </div>
            <div className="flex w-full items-center gap-2 md:w-auto">
              <Input
                readOnly
                value={`https://b2b.syntha.co/showroom/p/${articleSku}`}
                className="h-8 bg-white text-xs md:w-64"
              />
              <Button variant="outline" size="sm" className="h-8 shrink-0">
                <LucideIcons.Copy className="mr-1 h-3.5 w-3.5" />
                Копировать
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
