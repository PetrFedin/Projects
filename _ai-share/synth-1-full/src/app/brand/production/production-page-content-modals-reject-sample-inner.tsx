'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type RejectSampleTarget = { skuId: string; skuName: string } | null;

type SampleStatusRow = { skuId: string; status: string; [k: string]: unknown };

export function ProductionPageContentModalsRejectSampleInner({
  rejectSample,
  setRejectSample,
  rejectReason,
  setRejectReason,
  rejectCommentCustom,
  setRejectCommentCustom,
  setSampleStatuses,
  handleAction,
}: {
  rejectSample: RejectSampleTarget;
  setRejectSample?: (v: RejectSampleTarget) => void;
  rejectReason: string;
  setRejectReason?: (v: string) => void;
  rejectCommentCustom: string;
  setRejectCommentCustom?: (v: string) => void;
  setSampleStatuses?: (fn: (prev: SampleStatusRow[]) => SampleStatusRow[]) => void;
  handleAction?: (title: string, detail?: string) => void;
}) {
  const resetForm = () => {
    setRejectSample?.(null);
    setRejectReason?.('');
    setRejectCommentCustom?.('');
  };

  return (
    <Dialog
      open={!!rejectSample}
      onOpenChange={(o) => {
        if (!o) resetForm();
      }}
    >
      <DialogContent className="overflow-hidden rounded-2xl border-none p-0 shadow-xl sm:max-w-[400px]">
        <DialogHeader className="bg-text-primary p-6 text-white">
          <DialogTitle className="text-lg font-black uppercase">Отклонить сэмпл</DialogTitle>
          <DialogDescription className="text-text-muted text-[10px]">
            Укажите причину отклонения для {rejectSample?.skuName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 p-6">
          <div>
            <label className="text-text-secondary text-[10px] font-bold uppercase">Причина</label>
            <Select onValueChange={(v) => setRejectReason?.(v)} value={rejectReason}>
              <SelectTrigger className="mt-1 h-9 text-[10px]">
                <SelectValue placeholder="Выберите" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Прочее" className="text-[10px]">
                  Прочее
                </SelectItem>
                <SelectItem value="Несоответствие тех-пака" className="text-[10px]">
                  Несоответствие тех-пака
                </SelectItem>
                <SelectItem value="Качество образца" className="text-[10px]">
                  Качество образца
                </SelectItem>
                <SelectItem value="Сроки нарушены" className="text-[10px]">
                  Сроки нарушены
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          {rejectReason === 'Прочее' && (
            <div>
              <label className="text-text-secondary text-[10px] font-bold uppercase">
                Комментарий
              </label>
              <Input
                value={rejectCommentCustom || ''}
                onChange={(e) => setRejectCommentCustom?.(e.target.value)}
                placeholder="Укажите причину..."
                className="mt-1 h-9 text-[10px]"
              />
            </div>
          )}
        </div>
        <DialogFooter className="bg-bg-surface2 border-border-subtle flex justify-end gap-2 border-t p-6">
          <Button variant="outline" onClick={resetForm}>
            Отмена
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (rejectSample) {
                const reason =
                  rejectReason === 'Прочее'
                    ? rejectCommentCustom || 'Прочее'
                    : rejectReason || 'Причина не указана';
                setSampleStatuses?.((prev) =>
                  prev.map((x) =>
                    x.skuId === rejectSample.skuId ? { ...x, status: 'rejected' } : x
                  )
                );
                handleAction?.('Сэмпл отклонён', `${rejectSample.skuName}: ${reason}`);
                resetForm();
              }
            }}
          >
            Подтвердить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
