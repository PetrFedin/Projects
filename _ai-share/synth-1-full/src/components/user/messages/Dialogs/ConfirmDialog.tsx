import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
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
  onConfirm
}) => {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-md bg-white rounded-xl p-4">
        <DialogHeader>
          <DialogTitle className="text-sm font-black uppercase tracking-tighter">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 leading-relaxed">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="mt-8 flex gap-3">
          <Button variant="ghost" className="flex-1 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest" onClick={onCancel}>
            ОТМЕНА
          </Button>
          <Button 
            className={destructive ? "flex-1 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest bg-rose-600 hover:bg-rose-700" : "flex-1 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest bg-slate-900 hover:bg-black"} 
            onClick={onConfirm}
          >
            ПОДТВЕРДИТЬ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
