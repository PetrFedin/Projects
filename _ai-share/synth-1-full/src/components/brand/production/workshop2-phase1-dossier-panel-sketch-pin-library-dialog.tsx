'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { cn } from '@/lib/utils';
import { formatTzLogTimestamp } from '@/components/brand/production/workshop2-phase1-dossier-panel-tz-action-log';
import { diffMasterSketchAnnotations } from '@/lib/production/sketch-labels-diff';
import { SKETCH_SHEET_VIEW_LABELS } from '@/lib/production/workshop2-sketch-sheets';
import type {
  Workshop2SketchLabelsSnapshot,
  Workshop2SketchPinTemplate,
} from '@/lib/production/workshop2-dossier-phase1.types';

export function Workshop2SketchPinLibraryDialog({
  open,
  onOpenChange,
  snapshots,
  snapshotDiffA,
  snapshotDiffB,
  onSnapshotDiffAChange,
  onSnapshotDiffBChange,
  snapshotDiffSummary,
  onSnapshotDiffSummaryChange,
  onRestoreSnapshot,
  dossierPinTemplates,
  onDeleteDossierPinTemplate,
  collectionId,
  orgPinTemplates,
  onDeleteOrgPinTemplate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snapshots: Workshop2SketchLabelsSnapshot[];
  snapshotDiffA: string;
  snapshotDiffB: string;
  onSnapshotDiffAChange: (value: string) => void;
  onSnapshotDiffBChange: (value: string) => void;
  snapshotDiffSummary: string;
  onSnapshotDiffSummaryChange: (summary: string) => void;
  onRestoreSnapshot: (snap: Workshop2SketchLabelsSnapshot) => void;
  dossierPinTemplates: Workshop2SketchPinTemplate[] | undefined;
  onDeleteDossierPinTemplate: (templateId: string) => void;
  collectionId?: string | null;
  orgPinTemplates: readonly Workshop2SketchPinTemplate[];
  onDeleteOrgPinTemplate: (templateId: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] w-[min(560px,95vw)] max-w-[95vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Снимки и шаблоны меток</DialogTitle>
          <DialogDescription>
            Снимки — полная копия меток master и листов. Шаблоны в досье и в библиотеке
            коллекции (пока localStorage; позже — тот же контракт через API). QR для печати и
            PDF генерируется локально в браузере.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="snapshots" className="w-full">
          {/* cabinetSurface v1 */}
          <TabsList
            className={cn(
              cabinetSurface.tabsList,
              'mb-2 grid h-auto min-h-9 w-full grid-cols-3 gap-0.5 p-1'
            )}
          >
            <TabsTrigger
              value="snapshots"
              className={cn(
                cabinetSurface.tabsTrigger,
                'h-9 text-[10px] font-semibold normal-case tracking-normal sm:text-xs'
              )}
            >
              Снимки
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className={cn(
                cabinetSurface.tabsTrigger,
                'h-9 text-[10px] font-semibold normal-case tracking-normal sm:text-xs'
              )}
            >
              Досье
            </TabsTrigger>
            <TabsTrigger
              value="collection"
              className={cn(
                cabinetSurface.tabsTrigger,
                'h-9 text-[10px] font-semibold normal-case tracking-normal sm:text-xs'
              )}
            >
              Коллекция
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="snapshots"
            className="max-h-[50vh] space-y-2 overflow-y-auto pr-1"
          >
            {snapshots.length >= 2 ? (
              <div className="border-accent-primary/20 bg-accent-primary/10 text-text-primary rounded-md border p-2 text-[11px]">
                <p className="text-accent-primary font-medium">
                  Сравнить master между снимками
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <select
                    className="border-border-default h-8 min-w-[140px] flex-1 rounded border bg-white px-2 text-xs"
                    value={snapshotDiffA}
                    onChange={(e) => onSnapshotDiffAChange(e.target.value)}
                    aria-label="Первый снимок"
                  >
                    <option value="">Снимок A</option>
                    {snapshots.map((s) => (
                      <option key={`a-${s.snapshotId}`} value={s.snapshotId}>
                        {s.label?.trim() || 'Без подписи'} · {formatTzLogTimestamp(s.at)}
                      </option>
                    ))}
                  </select>
                  <select
                    className="border-border-default h-8 min-w-[140px] flex-1 rounded border bg-white px-2 text-xs"
                    value={snapshotDiffB}
                    onChange={(e) => onSnapshotDiffBChange(e.target.value)}
                    aria-label="Второй снимок"
                  >
                    <option value="">Снимок B</option>
                    {snapshots.map((s) => (
                      <option key={`b-${s.snapshotId}`} value={s.snapshotId}>
                        {s.label?.trim() || 'Без подписи'} · {formatTzLogTimestamp(s.at)}
                      </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-8 text-xs"
                    onClick={() => {
                      const sa = snapshots.find(
                        (x) => x.snapshotId === snapshotDiffA
                      );
                      const sb = snapshots.find(
                        (x) => x.snapshotId === snapshotDiffB
                      );
                      if (!sa || !sb) {
                        onSnapshotDiffSummaryChange('Выберите два разных снимка.');
                        return;
                      }
                      const d = diffMasterSketchAnnotations(
                        sa.masterAnnotations ?? [],
                        sb.masterAnnotations ?? []
                      );
                      const lines = [
                        `Добавлено меток: ${d.addedIds.length}${d.addedIds.length ? ` (${d.addedIds.slice(0, 6).join(', ')}${d.addedIds.length > 6 ? '…' : ''})` : ''}`,
                        `Удалено меток: ${d.removedIds.length}${d.removedIds.length ? ` (${d.removedIds.slice(0, 6).join(', ')}${d.removedIds.length > 6 ? '…' : ''})` : ''}`,
                        `Сдвинуто по полю: ${d.moved.length}`,
                        `Изменён текст: ${d.textChanged.length}`,
                      ];
                      onSnapshotDiffSummaryChange(lines.join('\n'));
                    }}
                  >
                    Сравнить
                  </Button>
                </div>
                {snapshotDiffSummary ? (
                  <pre className="border-accent-primary/20 text-text-primary mt-2 max-h-28 overflow-auto whitespace-pre-wrap rounded border bg-white p-2 text-[10px]">
                    {snapshotDiffSummary}
                  </pre>
                ) : null}
              </div>
            ) : null}
            {snapshots.length === 0 ? (
              <p className="text-text-secondary text-sm">
                Пока нет снимков. Нажмите «Снимок меток» в шапке блока скетча.
              </p>
            ) : (
              snapshots.map((snap) => (
                <div
                  key={snap.snapshotId}
                  className="border-border-default flex flex-wrap items-start justify-between gap-2 rounded-md border bg-white p-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="text-text-primary font-medium">
                      {snap.label?.trim() || 'Без подписи'}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {formatTzLogTimestamp(snap.at)} · {snap.by}
                    </p>
                    <p className="text-text-secondary text-[11px]">
                      Master: {snap.masterAnnotations?.length ?? 0} · Листов в снимке:{' '}
                      {snap.sheets?.length ?? 0}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 shrink-0 text-xs"
                    onClick={() => onRestoreSnapshot(snap)}
                  >
                    Вернуть
                  </Button>
                </div>
              ))
            )}
          </TabsContent>
          <TabsContent
            value="templates"
            className="max-h-[50vh] space-y-2 overflow-y-auto pr-1"
          >
            {(dossierPinTemplates ?? []).length === 0 ? (
              <p className="text-text-secondary text-sm">
                В досье нет шаблонов. Сохраните метки кнопкой «В досье» над доской или на
                скетч-листе.
              </p>
            ) : (
              (dossierPinTemplates ?? []).map((t) => (
                <div
                  key={t.templateId}
                  className="border-border-default flex flex-wrap items-center justify-between gap-2 rounded-md border bg-white p-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="text-text-primary font-medium">{t.name}</p>
                    <p className="text-text-secondary text-xs">
                      {formatTzLogTimestamp(t.createdAt)} · {t.annotations.length} меток
                      {t.viewKind ? ` · ${SKETCH_SHEET_VIEW_LABELS[t.viewKind]}` : ''}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs text-rose-600 hover:text-rose-700"
                    onClick={() => onDeleteDossierPinTemplate(t.templateId)}
                  >
                    Удалить
                  </Button>
                </div>
              ))
            )}
          </TabsContent>
          <TabsContent
            value="collection"
            className="max-h-[50vh] space-y-2 overflow-y-auto pr-1"
          >
            {!String(collectionId ?? '').trim() ? (
              <p className="text-text-secondary text-sm">
                Нет id коллекции — библиотека недоступна.
              </p>
            ) : orgPinTemplates.length === 0 ? (
              <p className="text-text-secondary text-sm">
                В этом браузере для коллекции пока нет шаблонов. Сохраните метки кнопкой «В
                коллекцию» над доской.
              </p>
            ) : (
              orgPinTemplates.map((t) => (
                <div
                  key={t.templateId}
                  className="border-border-default flex flex-wrap items-center justify-between gap-2 rounded-md border bg-white p-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="text-text-primary font-medium">{t.name}</p>
                    <p className="text-text-secondary text-xs">
                      {formatTzLogTimestamp(t.createdAt)} · {t.annotations.length} меток
                      {t.viewKind ? ` · ${SKETCH_SHEET_VIEW_LABELS[t.viewKind]}` : ''}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs text-rose-600 hover:text-rose-700"
                    onClick={() => onDeleteOrgPinTemplate(t.templateId)}
                  >
                    Удалить
                  </Button>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
