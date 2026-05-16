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
import { getWorkshop2Phase1Dossier, setWorkshop2Phase1Dossier } from '@/lib/production/workshop2-phase1-dossier-storage';

export type Workshop2B2BIntegrationPanelProps = {
  dossier: Workshop2DossierPhase1;
  articleId?: string;
};

export function Workshop2B2BIntegrationPanel({ dossier: initialDossier, articleId }: Workshop2B2BIntegrationPanelProps) {
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

  const updateDraft = (patch: Partial<NonNullable<Workshop2DossierPhase1['b2bIntegrationDraft']>>) => {
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

  const articleName = dossier.assignments?.find(a => a.attributeId === 'name')?.values?.[0]?.displayLabel || 'Безымянный артикул';
  const articleSku = dossier.assignments?.find(a => a.attributeId === 'sku')?.values?.[0]?.displayLabel || articleId || 'N/A';

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
    <div className="border-border-default rounded-xl border bg-white p-4 shadow-sm space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Управление цифровым шоурумом и кампаниями предзаказа для {articleName} ({articleSku}).
          </p>
        </div>
        <div className="flex items-center gap-3">
          {syncSuccess && (
            <span className="text-sm text-emerald-600 font-medium flex items-center gap-1 animate-in fade-in slide-in-from-right-4">
              <LucideIcons.CheckCircle2 className="w-4 h-4" /> Синхронизировано
            </span>
          )}
          <Button 
            onClick={handleSync} 
            disabled={isSyncing || syncSuccess}
            className="gap-2 relative overflow-hidden"
          >
            {isSyncing ? (
              <>
                <LucideIcons.RefreshCw className="w-4 h-4 animate-spin" />
                Синхронизация...
              </>
            ) : syncSuccess ? (
              <>
                <LucideIcons.Check className="w-4 h-4" />
                Успешно
              </>
            ) : (
              <>
                <LucideIcons.UploadCloud className="w-4 h-4" />
                Синхронизировать с B2B-порталом
              </>
            )}
            {isSyncing && (
              <div className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-200" style={{ width: `${syncProgress}%` }} />
            )}
          </Button>
        </div>
      </div>

      <div className="min-w-0 space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="border-border-subtle rounded-lg border bg-bg-surface2/40 p-3">
            <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Конверсия</div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-text-primary">14.2%</span>
              <LucideIcons.MousePointerClick className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-[10px] font-medium text-emerald-600 mt-1 flex items-center gap-1">
              <LucideIcons.ArrowUpRight className="w-3 h-3" /> +2.1% за неделю
            </p>
          </div>
          <div className="border-border-subtle rounded-lg border bg-bg-surface2/40 p-3">
            <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Популярные размеры</div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-text-primary">M, L</span>
              <LucideIcons.Ruler className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-[10px] text-text-secondary mt-1">Составляют 68% от объема</p>
          </div>
          <div className="border-border-subtle rounded-lg border bg-bg-surface2/40 p-3">
            <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider mb-2">Выручка (Опт)</div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-text-primary">{(500 * parseFloat(wholesalePrice || '0')).toLocaleString()} ₽</span>
              <LucideIcons.RussianRuble className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-[10px] text-text-secondary mt-1">Ожидается от 500 предзаказов</p>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="border-border-subtle rounded-lg border bg-bg-surface2/20 p-3 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2">
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
              <LucideIcons.Settings className="w-4 h-4 text-slate-400" />
              Настройки шоурума
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-border-subtle rounded-md bg-white">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold">Показывать в шоуруме</Label>
                <p className="text-[10px] text-slate-500">Сделать артикул видимым для зарегистрированных B2B-покупателей.</p>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="live-toggle" 
                  checked={isLive} 
                  onCheckedChange={(checked) => updateDraft({ isLive: checked as boolean })} 
                  className="w-4 h-4"
                />
                <Label htmlFor="live-toggle" className="cursor-pointer text-[11px] font-medium">Опубликовано</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 bg-white p-3 border border-border-subtle rounded-md">
                <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Ценообразование (₽)</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="wholesalePrice" className="text-[11px] font-medium">Оптовая цена</Label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">₽</span>
                      <Input 
                        id="wholesalePrice" 
                        type="number" 
                        value={wholesalePrice}
                        onChange={(e) => updateDraft({ wholesalePrice: e.target.value })}
                        className="pl-6 h-8 text-xs font-medium" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="msrp" className="text-[11px] font-medium">РРЦ</Label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">₽</span>
                      <Input 
                        id="msrp" 
                        type="number" 
                        value={msrp}
                        onChange={(e) => updateDraft({ msrp: e.target.value })}
                        className="pl-6 h-8 text-xs font-medium" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 bg-white p-3 border border-border-subtle rounded-md">
                <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Детали кампании</h3>
                <div className="space-y-1.5">
                  <Label htmlFor="moq" className="text-[11px] font-medium">Минимальный заказ (MOQ)</Label>
                  <div className="relative">
                    <Input 
                      id="moq" 
                      type="number" 
                      value={moq}
                      onChange={(e) => updateDraft({ moq: e.target.value })}
                      className="pr-10 h-8 text-xs font-medium" 
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]">шт.</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="startDate" className="text-[11px] font-medium">Начало</Label>
                    <Input 
                      id="startDate" 
                      type="date" 
                      value={startDate}
                      onChange={(e) => updateDraft({ startDate: e.target.value })}
                      className="h-8 text-[11px] px-2"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="endDate" className="text-[11px] font-medium">Конец</Label>
                    <Input 
                      id="endDate" 
                      type="date" 
                      value={endDate}
                      onChange={(e) => updateDraft({ endDate: e.target.value })}
                      className="h-8 text-[11px] px-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <span className="text-[10px] text-text-muted">Изменения сохраняются автоматически</span>
            </div>
          </div>
        </div>
        
        {/* Campaign Link Section */}
        <div className="border-border-subtle rounded-lg border border-dashed bg-bg-surface2/50 p-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-border-subtle shadow-sm">
                <LucideIcons.Link className="w-4 h-4 text-text-secondary" />
              </div>
              <div>
                <h4 className="font-semibold text-[11px] text-text-primary">Ссылка на B2B-шоурум</h4>
                <p className="text-[10px] text-text-secondary">Отправьте эту ссылку приглашенным байерам</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Input 
                readOnly 
                value={`https://b2b.syntha.co/showroom/p/${articleSku}`} 
                className="bg-white text-xs h-8 md:w-64"
              />
              <Button variant="outline" size="sm" className="h-8 shrink-0">
                <LucideIcons.Copy className="w-3.5 h-3.5 mr-1" />
                Копировать
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
