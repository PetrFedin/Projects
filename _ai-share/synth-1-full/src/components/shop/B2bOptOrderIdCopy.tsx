'use client';

import { useCallback } from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Props = {
  orderId: string;
  className?: string;
  /** Показать подпись «ID заказа опта» (для списков и шапок). */
  showLabel?: boolean;
};

export function B2bOptOrderIdCopy({ orderId, className, showLabel }: Props) {
  const { toast } = useToast();

  const copy = useCallback(() => {
    void navigator.clipboard.writeText(orderId);
    toast({ title: 'Скопировано', description: orderId });
  }, [orderId, toast]);

  return (
    <div className={cn('inline-flex flex-wrap items-center gap-1.5', className)}>
      {showLabel ? (
        <span className="text-text-muted text-[9px] font-black uppercase tracking-widest">
          ID заказа опта
        </span>
      ) : null}
      <span className="text-text-primary font-mono text-sm font-semibold">{orderId}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-text-muted hover:text-text-primary h-7 w-7 shrink-0"
        onClick={copy}
        aria-label="Копировать ID заказа"
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
