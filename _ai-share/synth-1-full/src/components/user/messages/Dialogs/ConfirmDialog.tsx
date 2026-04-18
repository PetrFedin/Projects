import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  destructive,
  onCancel,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-md rounded-xl bg-white p-4">
        <DialogHeader>
          <DialogTitle className="text-sm font-black uppercase tracking-tighter">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="mt-2 text-xs font-bold uppercase leading-relaxed tracking-widest text-slate-400">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="mt-8 flex gap-3">
          <Button
            variant="ghost"
            className="h-12 flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest"
            onClick={onCancel}
          >
            ОТМЕНА
          </Button>
          <Button
            className={
              destructive
                ? 'h-12 flex-1 rounded-xl bg-rose-600 text-[10px] font-black uppercase tracking-widest hover:bg-rose-700'
                : 'h-12 flex-1 rounded-xl bg-slate-900 text-[10px] font-black uppercase tracking-widest hover:bg-black'
            }
            onClick={onConfirm}
          >
            ПОДТВЕРДИТЬ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
