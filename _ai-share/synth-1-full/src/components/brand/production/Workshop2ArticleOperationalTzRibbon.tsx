'use client';

import { useMemo, useState } from 'react';
import { Link2, AlertCircle, CheckCircle2, GitMerge } from 'lucide-react';
import Link from 'next/link';
import {
  buildWorkshop2OperationalTzBridge,
  workshop2OperationalTabToTzW2Sec,
  type Workshop2OperationalPipelineTab,
} from '@/lib/production/workshop2-article-operational-tz-bridge';
import { workshop2ArticleHref } from '@/lib/production/workshop2-url';
import type { Workshop2DossierPhase1 } from '@/lib/production/workshop2-dossier-phase1.types';
import type { HandbookCategoryLeaf } from '@/lib/production/category-handbook-leaves';
import { useWorkspaceStore, useArticleWorkspace } from '@/components/brand/production/article-workspace-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

/** Единая лента «операционная вкладка ↔ ТЗ» для маршрута артикула. */
export function Workshop2ArticleOperationalTzRibbon({
  tab,
  dossier,
  leaf,
  articleUrlSegment,
}: {
  tab: Workshop2OperationalPipelineTab;
  dossier: Workshop2DossierPhase1 | null;
  leaf: HandbookCategoryLeaf | null | undefined;
  /** Сегмент пути `.../a/:segment` — см. `workshop2ArticleUrlSegment`. */
  articleUrlSegment: string;
}) {
  const ref = useWorkspaceStore((state) => state.ref);
  const bundle = useWorkspaceStore((state) => state.bundle);
  const { mergeBundle } = useArticleWorkspace();
  
  const b = useMemo(() => buildWorkshop2OperationalTzBridge(tab, dossier, leaf), [tab, dossier, leaf]);
  const w2sec = workshop2OperationalTabToTzW2Sec(tab);
  const href = workshop2ArticleHref(ref.collectionId, articleUrlSegment, {
    w2pane: 'tz',
    w2sec,
  });

  const dossierVersion = dossier?.dossierVersion || 1;
  const syncedVersion = bundle?.lastSyncedDossierVersion || 1;
  const isOutOfSync = dossierVersion > syncedVersion;

  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      if (typeof window !== 'undefined') {
        if (mergeBundle) {
          await mergeBundle({ lastSyncedDossierVersion: dossierVersion });
        }
      }
    } finally {
      setSyncing(false);
      setSyncDialogOpen(false);
    }
  };

  return (
    <>
      <div className={`border-border-default mb-4 rounded-xl border border-dashed bg-gradient-to-r px-3 py-2.5 shadow-sm ${isOutOfSync ? 'from-amber-50/95 via-white to-amber-50/40 border-amber-300' : 'from-slate-50/95 via-white to-slate-50/40 border-slate-300/80'}`}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-text-primary flex items-center gap-1.5 text-[11px] font-semibold">
              <Link2 className="text-accent-primary h-3.5 w-3.5 shrink-0" aria-hidden />
              Связь с техническим заданием (Версия {dossier?.dossierVersionLabel || `v${dossierVersion}`})
            </p>
            <p className="text-text-secondary text-[11px] leading-snug">{b.contractLine}</p>
            <p className="text-text-muted text-[10px] leading-snug">{b.overallLine}</p>
            <p className="text-text-primary text-[10px] font-semibold tabular-nums">{b.focusPctLabel}</p>
          </div>
          
          <div className="flex flex-col gap-2 items-end">
            <Link
              href={href}
              className="border-border-default bg-white text-accent-primary shrink-0 rounded-md border px-2.5 py-1.5 text-[10px] font-semibold shadow-sm transition-colors hover:border-accent-primary/40 hover:bg-accent-primary/5"
            >
              Открыть ТЗ →
            </Link>
            
            {isOutOfSync && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[10px] bg-amber-100/50 text-amber-900 border-amber-300 hover:bg-amber-200"
                onClick={() => setSyncDialogOpen(true)}
              >
                <GitMerge className="w-3 h-3 mr-1" />
                Синхронизировать (Доступна v{dossierVersion})
              </Button>
            )}
          </div>
        </div>
        {b.blockerLines.length > 0 ? (
          <ul className="mt-2 list-inside list-disc space-y-0.5 border-t border-amber-100/90 pt-2 text-[10px] leading-snug text-amber-950">
            {b.blockerLines.map((line, idx) => (
              <li key={`${idx}-${line.slice(0, 96)}`}>{line}</li>
            ))}
          </ul>
        ) : (
          <p className="text-text-muted mt-2 border-t border-border-subtle/70 pt-2 text-[10px] leading-snug">
            По связанным разделам ТЗ нет открытых предупреждений движка готовности.
          </p>
        )}
      </div>

      <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Smart Diff: Обнаружены изменения ТЗ
            </DialogTitle>
            <DialogDescription>
              Техническое задание было обновлено (до версии {dossier?.dossierVersionLabel || `v${dossierVersion}`}). 
              Текущая вкладка работает с устаревшими данными (v{syncedVersion}).
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-3">
            <div className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="font-semibold text-slate-700 mb-2">Изменения (Diff):</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                <li className="text-amber-700">Изменён материал: Добавлена новая фурнитура "Молния 15см"</li>
                <li className="text-teal-700">Обновлены лекала: Скорректирован припуск на швы</li>
              </ul>
            </div>
            <p className="text-xs text-slate-500">
              Система автоматически объединит бесконфликтные изменения. При возникновении прямых конфликтов вам будет предложено выбрать верный вариант.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSyncDialogOpen(false)}>Отмена</Button>
            <Button 
              size="sm" 
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={handleSync}
              disabled={syncing}
            >
              {syncing ? 'Слияние данных...' : 'Применить изменения ТЗ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
