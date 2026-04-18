'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Product } from '@/lib/types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface NotifyMeDialogProps {
  product: Product;
  size: string | null;
  mode: 'subscribe' | 'pre_order';
  preOrderDate?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function NotifyMeDialog({
  product,
  size,
  mode,
  preOrderDate,
  isOpen,
  onOpenChange,
  onConfirm,
}: NotifyMeDialogProps) {
  if (!size) return null;

  const isPreOrder = mode === 'pre_order';
  const title = isPreOrder ? 'Оформить предзаказ?' : 'Сообщить о поступлении?';
  const description = isPreOrder
    ? `Вы можете оформить предзаказ на товар "${product.name}" в размере ${size}. Ожидаемая дата поступления: ${preOrderDate ? format(new Date(preOrderDate), 'd MMMM yyyy', { locale: ru }) : 'неизвестно'}.`
    : `Мы сообщим вам, когда товар "${product.name}" в размере ${size} снова появится в наличии.`;
  const confirmText = isPreOrder ? 'Да, оформить предзаказ' : 'Да, сообщить';

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Нет, спасибо</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
