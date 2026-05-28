'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import type { Workshop2DossierFieldDiffSummary } from '@/lib/production/workshop2-dossier-field-diff';

export type Workshop2DossierRemoteUpdateDialogProps = {
  open: boolean;
  updatedBy?: string;
  serverVersion: number | null;
  diff: Workshop2DossierFieldDiffSummary | null;
  onReloadFromServer: () => void;
  onDismiss: () => void;
};

/**
 * SSE DOSSIER_UPDATED от другого пользователя — предложить обновить с сервера с кратким diff.
 */
export function Workshop2DossierRemoteUpdateDialog({
  open,
  updatedBy,
  serverVersion,
  diff,
  onReloadFromServer,
  onDismiss,
}: Workshop2DossierRemoteUpdateDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <RefreshCw className="h-5 w-5 shrink-0 text-sky-600" aria-hidden />
            Обновить с сервера?
          </DialogTitle>
          <DialogDescription className="space-y-2 text-sm leading-relaxed">
            <span className="block">
              Досье изменил{updatedBy ? ` ${updatedBy}` : ' другой пользователь'}
              {serverVersion != null ? ` (версия ${serverVersion})` : ''}. Ваша локальная копия
              может быть устаревшей.
            </span>
            {diff ? (
              <span className="text-text-primary border-border-subtle bg-bg-surface2/60 block rounded-md border px-2.5 py-2 text-xs">
                {diff.summaryRu}
              </span>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onDismiss}>
            Оставить локальную
          </Button>
          <Button type="button" onClick={onReloadFromServer}>
            Обновить с сервера
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
