'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductionArchiveHub } from '@/components/brand/production-archive-hub';

function archiveUserRole(
  prodRole: string | undefined
): 'admin' | 'brand' | 'manufacturer' {
  if (prodRole === 'manufacturer') return 'manufacturer';
  if (prodRole === 'admin') return 'admin';
  return 'brand';
}

export function ProductionPageContentModalsDialogStackArchive({
  isArchiveOpen,
  setIsArchiveOpen,
  prodRole,
}: {
  isArchiveOpen: boolean;
  setIsArchiveOpen?: (open: boolean) => void;
  prodRole?: string;
}) {
  if (!isArchiveOpen) return null;

  return (
    <Dialog open={!!isArchiveOpen} onOpenChange={(open) => setIsArchiveOpen?.(open)}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Архив</DialogTitle>
        </DialogHeader>
        <ProductionArchiveHub
          sku={{ id: 'archive', name: 'Архив', sku: 'ARCHIVE', factory: '—', brand: 'Syntha' }}
          userRole={archiveUserRole(prodRole)}
        />
      </DialogContent>
    </Dialog>
  );
}
