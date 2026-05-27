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
import { AlertTriangle } from 'lucide-react';

export type Workshop2DossierVersionConflictDialogProps = {
  open: boolean;
  serverVersion: number | null;
  conflictFieldsRu?: string[];
  onReloadFromServer: () => void;
  onDismiss: () => void;
};

/**
 * Модальное окно конфликта optimistic lock (HTTP 409).
 * Дополняет toast — пользователь не пропустит конфликт при активном редактировании.
 */
export function Workshop2DossierVersionConflictDialog({
  open,
  serverVersion,
  conflictFieldsRu = [],
  onReloadFromServer,
  onDismiss,
}: Workshop2DossierVersionConflictDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => !next && onDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" aria-hidden />
            Конфликт версий досье
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            Досье на сервере новее{serverVersion != null ? ` (версия ${serverVersion})` : ''}. Ваши
            несохранённые правки могут перезаписать чужие изменения. Загрузите актуальную версию с
            сервера и проверьте поля перед повторным сохранением.
          </DialogDescription>
        </DialogHeader>
        {conflictFieldsRu.length > 0 ? (
          <ul className="max-h-40 space-y-1 overflow-y-auto rounded-md border border-amber-100 bg-amber-50/60 px-3 py-2 text-xs text-amber-950">
            {conflictFieldsRu.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        ) : null}
        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onDismiss}>
            Закрыть
          </Button>
          <Button type="button" onClick={onReloadFromServer}>
            Загрузить с сервера
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
