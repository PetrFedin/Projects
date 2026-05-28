'use client';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Product, CartItem, ColorInfo } from '@/lib/types';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ManageCartItemDialogProps {
  product: Product;
  cartItem: CartItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (quantity: number) => void;
  onRemove: () => void;
}

export function ManageCartItemDialog({
  product,
  cartItem,
  isOpen,
  onOpenChange,
  onUpdate,
  onRemove,
}: ManageCartItemDialogProps) {
  const [quantity, setQuantity] = useState(cartItem.quantity);

  const colorInfo = product.availableColors?.find((c) => {
    return c.sizeAvailability?.some((s) => s.size === cartItem.selectedSize);
  });

  const sizeInfo = colorInfo?.sizeAvailability?.find((s) => s.size === cartItem.selectedSize);

  const maxQuantity = sizeInfo?.status === 'in_stock' ? sizeInfo.quantity : undefined;

  useEffect(() => {
    setQuantity(cartItem.quantity);
  }, [cartItem]);

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + amount;
      if (newQuantity < 1) return 1;
      if (maxQuantity !== undefined && newQuantity > maxQuantity) return maxQuantity;
      return newQuantity;
    });
  };

  const handleUpdate = () => {
    onUpdate(quantity);
    onOpenChange(false);
  };

  const handleRemove = () => {
    onRemove();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Изменить количество</AlertDialogTitle>
          <AlertDialogDescription>
            Товар "{product.name}" (размер:{' '}
            <span className="font-semibold">{cartItem.selectedSize}</span>) уже в корзине.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => handleQuantityChange(-1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              readOnly
              value={quantity}
              className="h-10 w-20 text-center text-base font-bold"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => handleQuantityChange(1)}
              disabled={maxQuantity !== undefined && quantity >= maxQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {maxQuantity !== undefined && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              В наличии: {maxQuantity} шт.
              {quantity >= maxQuantity && (
                <span className="ml-1 text-destructive">(Больше нет)</span>
              )}
            </p>
          )}
        </div>
        <AlertDialogFooter className="sm:justify-between">
          <Button variant="destructive" onClick={handleRemove}>
            <Trash2 className="mr-2 h-4 w-4" />
            Удалить
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button onClick={handleUpdate}>Обновить</Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
