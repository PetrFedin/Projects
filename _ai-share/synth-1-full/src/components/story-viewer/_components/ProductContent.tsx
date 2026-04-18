'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import {
  Search,
  ShoppingBag,
  X,
  Zap,
  Star,
  Check,
  Plus,
  Minus,
  Ruler,
  Bell,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ConfirmDialog } from '@/components/user/messages/Dialogs/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';

interface ProductContentProps {
  product: Product;
  initialColorId?: string;
}

export function ProductContent({ product, initialColorId }: ProductContentProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(initialColorId || null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [preOrderItems, setPreOrderItems] = useState<Record<string, number>>({});
  const [selectedWishlists, setSelectedWishlists] = useState<string[]>([]);
  const [selectedLooks, setSelectedLooks] = useState<string[]>([]);
  const [localQty, setLocalQty] = useState<number>(1);
  const [preOrderRequests, setPreOrderRequests] = useState<Record<string, 'pending' | 'confirmed'>>(
    {}
  );

  const preOrderRequestsRef = useRef(preOrderRequests);
  useEffect(() => {
    preOrderRequestsRef.current = preOrderRequests;
  }, [preOrderRequests]);

  const [isPreOrderDialogOpen, setIsPreOrderDialogOpen] = useState(false);
  const [preOrderDialogSize, setPreOrderDialogSize] = useState<string | null>(null);
  const [sizeToRemove, setSizeToRemove] = useState<{
    size: string;
    type: 'cart' | 'preorder' | 'pending_request';
  } | null>(null);

  const stock: Record<string, number> = useMemo(() => {
    const baseStock: Record<string, Record<string, number>> = {
      c1: { XS: 2, S: 5, M: 0, L: 0 },
      c2: { XS: 0, S: 3, M: 10, L: 2 },
      c3: { XS: 5, S: 0, M: 0, L: 8 },
    };

    if (product.id === '1' || String(product.id) === '1')
      return baseStock[selectedColorId || 'c1'] || baseStock['c1'];
    if (product.id === '12' || String(product.id) === '12')
      return baseStock[selectedColorId || 'c1'] || baseStock['c1'];
    return { XS: 2, S: 5, M: 0, L: 10 };
  }, [product.id, selectedColorId]);

  const canPreOrderSizes = useMemo(() => {
    if (product.id === '1' || String(product.id) === '1') return ['XS', 'S', 'M', 'L'];
    if (product.id === '12' || String(product.id) === '12') {
      if (selectedColorId === 'c2') return ['XS', 'S'];
      return ['M'];
    }
    return ['L'];
  }, [product.id, selectedColorId]);

  useEffect(() => {
    if (selectedSize && selectedColorId) {
      const itemKey = `${selectedColorId}-${selectedSize}`;
      const inCart = cartItems[itemKey] || preOrderItems[itemKey];
      if (inCart) {
        setLocalQty(inCart);
      } else {
        setLocalQty(stock[selectedSize] > 0 ? 1 : 0);
      }
    }
  }, [selectedSize, selectedColorId, cartItems, preOrderItems, stock]);

  const [wishlistGroups, setWishlistGroups] = useState([
    'Ожидание',
    'Весна 2024',
    'Базовый гардероб',
  ]);
  const [lookGroups, setLookGroups] = useState(['Офисный стиль', 'Вечерний выход', 'Weekend']);
  const [newGroupName, setNewGroupName] = useState('');
  const [isAddingWishlistGroup, setIsAddingWishlistGroup] = useState(false);
  const [isAddingLookGroup, setIsAddingLookGroup] = useState(false);

  const { toast } = useToast();

  const handleAddWishlistGroup = () => {
    if (newGroupName.trim() && !wishlistGroups.includes(newGroupName.trim())) {
      setWishlistGroups((prev) => [...prev, newGroupName.trim()]);
      setSelectedWishlists((prev) => [...prev, newGroupName.trim()]);
      setNewGroupName('');
      setIsAddingWishlistGroup(false);
      toast({
        title: 'Группа создана',
        description: `Товар добавлен в новую группу "${newGroupName.trim()}"`,
      });
    }
  };

  const handleAddLookGroup = () => {
    if (newGroupName.trim() && !lookGroups.includes(newGroupName.trim())) {
      setLookGroups((prev) => [...prev, newGroupName.trim()]);
      setSelectedLooks((prev) => [...prev, newGroupName.trim()]);
      setNewGroupName('');
      setIsAddingLookGroup(false);
      toast({
        title: 'Группа создана',
        description: `Товар добавлен в новую группу "${newGroupName.trim()}"`,
      });
    }
  };

  const handleCreatePreOrderRequest = (size: string) => {
    if (!selectedColorId) return;
    const itemKey = `${selectedColorId}-${size}`;

    setPreOrderRequests((prev) => ({ ...prev, [itemKey]: 'pending' }));
    setLocalQty(1);
    setIsPreOrderDialogOpen(false);
    toast({
      title: 'Запрос отправлен',
      description: `Запрос на предзаказ размера ${size} отправлен бренду. Ожидайте подтверждения в сообщениях.`,
    });

    setTimeout(() => {
      if (preOrderRequestsRef.current[itemKey] === 'pending') {
        setPreOrderRequests((prev) => ({ ...prev, [itemKey]: 'confirmed' }));
        toast({
          title: 'Предзаказ подтвержден',
          description: `Бренд подтвердил возможность предзаказа размера ${size}. Вы можете продолжить общение в чате.`,
        });
      }
    }, 5000);
  };

  const measurementLabels: Record<string, string> = {
    bust: 'Обхват груди',
    waist: 'Обхват талии',
    hips: 'Обхват бедер',
    length: 'Длина изделия',
  };

  const measurements: Record<string, any> = {
    XS: { bust: 84, waist: 64, hips: 90, length: 110 },
    S: { bust: 88, waist: 68, hips: 94, length: 112 },
    M: { bust: 92, waist: 72, hips: 98, length: 114 },
    L: { bust: 96, waist: 76, hips: 102, length: 116 },
  };

  const isSoldOut = product.availability === 'sold_out';
  const isPreOrder =
    !isSoldOut &&
    (product.availability === 'pre_order' ||
      String(product.id) === '3' ||
      String(product.id) === '1');
  const isAvailable = !isPreOrder && !isSoldOut;

  const handlePreOrder = () => {
    if (!selectedSize || !selectedColorId) {
      toast({
        title: 'Выберите параметры',
        description: 'Для предзаказа необходимо указать цвет и размер.',
        variant: 'destructive',
      });
      return;
    }
    const itemKey = `${selectedColorId}-${selectedSize}`;
    if (localQty === 0) {
      setPreOrderItems((prev) => {
        const newItems = { ...prev };
        delete newItems[itemKey];
        return newItems;
      });
      return;
    }
    setPreOrderItems((prev) => ({ ...prev, [itemKey]: localQty }));
    toast({ title: 'Заявка принята', description: `Заказано ${localQty} ед.` });
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColorId) {
      toast({
        title: 'Выберите параметры',
        description: 'Пожалуйста, выберите цвет и размер.',
        variant: 'destructive',
      });
      return;
    }
    const itemKey = `${selectedColorId}-${selectedSize}`;
    if (localQty === 0) {
      setCartItems((prev) => {
        const newItems = { ...prev };
        delete newItems[itemKey];
        return newItems;
      });
      return;
    }
    setCartItems((prev) => ({ ...prev, [itemKey]: localQty }));
    toast({ title: 'Добавлено в корзину', description: `${localQty} ед. добавлено в корзину.` });
  };

  const handleConfirmRemoval = () => {
    if (!sizeToRemove || !selectedColorId) return;
    const { size, type } = sizeToRemove;
    const itemKey = `${selectedColorId}-${size}`;

    if (type === 'pending_request') {
      setPreOrderRequests((prev) => {
        const nr = { ...prev };
        delete nr[itemKey];
        return nr;
      });
    } else if (type === 'cart') {
      setCartItems((prev) => {
        const ni = { ...prev };
        delete ni[itemKey];
        return ni;
      });
    } else {
      setPreOrderItems((prev) => {
        const ni = { ...prev };
        delete ni[itemKey];
        return ni;
      });
    }
    setSizeToRemove(null);
  };

  const cartButtonLabel = useMemo(() => {
    if (!selectedSize || !selectedColorId) return 'Корзина';
    const itemKey = `${selectedColorId}-${selectedSize}`;
    const addedQty = cartItems[itemKey];
    if (!addedQty || localQty === 0) return 'Корзина';
    return localQty === addedQty ? 'В корзине' : 'Корзина изменена';
  }, [selectedSize, selectedColorId, cartItems, localQty]);

  const preOrderButtonLabel = useMemo(() => {
    if (!selectedSize || !selectedColorId) return 'Предзаказ';
    const itemKey = `${selectedColorId}-${selectedSize}`;
    if (preOrderRequests[itemKey] === 'confirmed') return 'Предзаказ подтвержден';
    if (preOrderRequests[itemKey] === 'pending') return 'Предзаказ запрошен';
    const addedQty = preOrderItems[itemKey];
    if (!addedQty || localQty === 0) return 'Предзаказ';
    return localQty === addedQty ? 'Предзаказ оформлен' : 'Предзаказ изменен';
  }, [selectedSize, selectedColorId, preOrderItems, localQty, preOrderRequests]);

  const wishlistButtonLabel = selectedWishlists.length > 0 ? 'В избранном' : 'Избранное';
  const lookButtonLabel = selectedLooks.length > 0 ? 'В образе' : 'В образ';

  return (
    <>
      <div className="flex gap-3">
        <div
          className="group/img relative h-32 w-28 shrink-0 cursor-zoom-in overflow-hidden rounded-[1.5rem] shadow-md"
          onClick={() => setIsImageZoomed(true)}
        >
          <Image
            src={product.images[currentImgIdx].url}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover/img:opacity-100">
            <Search className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between py-1">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                {product.brand}
              </p>
              {isPreOrder && (
                <Badge className="bg-amber-500/10 px-2 text-[8px] font-black uppercase tracking-widest text-amber-600">
                  Предзаказ
                </Badge>
              )}
              {isAvailable && (
                <Badge className="bg-green-500/10 px-2 text-[8px] font-black uppercase tracking-widest text-green-600">
                  Доступен
                </Badge>
              )}
            </div>
            <h4 className="text-sm font-black uppercase leading-tight tracking-tight">
              {product.name}
            </h4>
            {isAvailable ? (
              <p className="mt-1 text-base font-black text-black">
                {product.price.toLocaleString('ru-RU')} ₽
              </p>
            ) : (
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-black">
                Цена по запросу
              </p>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            <div className="mb-2 w-full space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">
                  Цвет
                </p>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-900">
                  {(product.availableColors || []).find((c) => c.id === selectedColorId)?.name}
                </p>
              </div>
              <div className="flex gap-2">
                {(product.availableColors || []).map((color) => (
                  <Tooltip key={color.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setSelectedColorId(color.id)}
                        className={cn(
                          'relative h-6 w-6 rounded-full border-2 transition-all active:scale-90',
                          selectedColorId === color.id
                            ? 'scale-110 border-black shadow-md'
                            : 'border-transparent hover:border-slate-300'
                        )}
                        style={{ backgroundColor: color.hex }}
                      />
                    </TooltipTrigger>
                    <TooltipContent className="rounded-lg border-none bg-black px-2 py-1 text-[9px] font-bold uppercase text-white">
                      {color.name}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            <p className="mt-1 w-full text-[8px] font-black uppercase tracking-widest text-slate-500">
              Размер
            </p>
            {['XS', 'S', 'M', 'L'].map((size) => {
              const itemKey = `${selectedColorId}-${size}`;
              const count = cartItems[itemKey] || preOrderItems[itemKey];
              const isOutOfStock = stock[size] === 0;
              const canPreOrder = isPreOrder || (isAvailable && canPreOrderSizes.includes(size));
              const isTotallyUnavailable = isSoldOut || (isOutOfStock && !canPreOrder && !count);
              const requestStatus = preOrderRequests[itemKey];

              return (
                <Tooltip key={size}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        if (requestStatus === 'pending') {
                          setSizeToRemove({ size, type: 'pending_request' });
                          return;
                        }
                        if (requestStatus === 'confirmed') {
                          setSelectedSize(size !== selectedSize ? size : null);
                          return;
                        }
                        if (
                          size === selectedSize &&
                          (cartItems[itemKey] || preOrderItems[itemKey])
                        ) {
                          setSizeToRemove({ size, type: cartItems[itemKey] ? 'cart' : 'preorder' });
                          return;
                        }
                        setSelectedSize(size !== selectedSize ? size : null);
                        if (
                          size !== selectedSize &&
                          isOutOfStock &&
                          canPreOrder &&
                          !requestStatus
                        ) {
                          setPreOrderDialogSize(size);
                          setIsPreOrderDialogOpen(true);
                        }
                      }}
                      className={cn(
                        'relative flex h-7 w-9 items-center justify-center rounded-xl border text-[9px] font-black transition-all',
                        selectedSize === size
                          ? 'scale-105 border-black bg-black text-white shadow-md'
                          : isTotallyUnavailable
                            ? 'border-muted/10 bg-muted/5 text-slate-400'
                            : 'border-slate-200 bg-white text-black hover:border-slate-400'
                      )}
                    >
                      <span className={cn(isTotallyUnavailable && 'relative')}>
                        {size}
                        {isTotallyUnavailable && (
                          <div className="absolute inset-x-0 top-1/2 h-[1px] -rotate-45 bg-red-500" />
                        )}
                      </span>
                      {count && (
                        <div className="absolute -right-2 -top-2 z-30 flex h-4 min-w-[16px] items-center justify-center rounded-full border-2 border-white bg-green-500 px-0.5 text-white shadow-md">
                          <span className="text-[7px] font-black">{count}</span>
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="rounded-lg border-none bg-black px-2 py-1 text-[9px] font-bold uppercase text-white">
                    {isTotallyUnavailable ? 'Нет в наличии' : `В наличии: ${stock[size]} ед.`}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>

      {selectedSize && selectedColorId && (
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center rounded-xl border bg-white p-1 shadow-sm">
            <button
              onClick={() => setLocalQty(Math.max(0, localQty - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-muted"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-[11px] font-black">{localQty}</span>
            <button
              onClick={() => setLocalQty((prev) => Math.min(stock[selectedSize] || 99, prev + 1))}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-green-600 hover:bg-muted"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      <div className="mt-2 grid grid-cols-3 gap-2">
        {isAvailable ? (
          <Button
            onClick={handleAddToCart}
            className={cn(
              'h-10 rounded-[1rem] border-2 px-0 text-[8px] font-black uppercase tracking-tighter transition-all',
              selectedSize && selectedColorId && cartItems[`${selectedColorId}-${selectedSize}`] > 0
                ? 'border-green-500/20 bg-green-500/10 text-green-600'
                : 'border-muted/20 bg-white text-black hover:bg-black hover:text-white'
            )}
          >
            <ShoppingBag className="mr-1 h-3 w-3" /> {cartButtonLabel}
          </Button>
        ) : isPreOrder ? (
          <Button
            onClick={handlePreOrder}
            className={cn(
              'h-10 rounded-[1rem] border-2 px-0 text-[8px] font-black uppercase tracking-tighter transition-all',
              selectedSize &&
                selectedColorId &&
                preOrderItems[`${selectedColorId}-${selectedSize}`] > 0
                ? 'border-green-500/20 bg-green-500/10 text-green-600'
                : 'border-muted/20 bg-white text-black hover:bg-black hover:text-white'
            )}
          >
            <Zap className="mr-1 h-3 w-3" /> {preOrderButtonLabel}
          </Button>
        ) : (
          <Button
            disabled
            className="h-10 rounded-[1rem] border-2 border-muted/10 bg-muted/5 px-0 text-[8px] font-black uppercase tracking-tighter text-muted-foreground transition-all"
          >
            <X className="mr-1 h-3 w-3" /> Нет в наличии
          </Button>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 w-full rounded-[1rem] border-2 px-0 text-[8px] font-black uppercase"
            >
              {wishlistButtonLabel}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-56 rounded-2xl border-none bg-white/95 p-3 shadow-2xl"
            side="top"
          >
            <p className="mb-2 px-2 text-[10px] font-black uppercase text-slate-500">Группы</p>
            {wishlistGroups.map((g) => (
              <button
                key={g}
                onClick={() =>
                  setSelectedWishlists((p) =>
                    p.includes(g) ? p.filter((it) => it !== g) : [...p, g]
                  )
                }
                className="w-full rounded-xl px-3 py-2 text-left text-[10px] font-black uppercase"
              >
                {g}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-10 w-full rounded-[1rem] border-2 px-0 text-[8px] font-black uppercase"
            >
              {lookButtonLabel}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-56 rounded-2xl border-none bg-white/95 p-3 shadow-2xl"
            side="top"
          >
            <p className="mb-2 px-2 text-[10px] font-black uppercase text-slate-500">Образы</p>
            {lookGroups.map((g) => (
              <button
                key={g}
                onClick={() =>
                  setSelectedLooks((p) => (p.includes(g) ? p.filter((it) => it !== g) : [...p, g]))
                }
                className="w-full rounded-xl px-3 py-2 text-left text-[10px] font-black uppercase"
              >
                {g}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      <Dialog open={isPreOrderDialogOpen} onOpenChange={setIsPreOrderDialogOpen}>
        <DialogContent className="max-w-md rounded-xl p-4">
          <DialogHeader>
            <DialogTitle className="text-base font-black uppercase tracking-widest">
              Запрос на предзаказ
            </DialogTitle>
          </DialogHeader>
          <Button
            onClick={() => handleCreatePreOrderRequest(preOrderDialogSize!)}
            className="h-10 w-full rounded-2xl bg-black text-xs font-black uppercase text-white"
          >
            Создать предзаказ
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={isImageZoomed} onOpenChange={setIsImageZoomed}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          <VisuallyHidden>
            <DialogTitle>Zoom</DialogTitle>
          </VisuallyHidden>
          <div className="relative h-[90vh] w-full">
            <Image
              src={product.images[currentImgIdx].url}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!sizeToRemove}
        title="Удалить?"
        destructive
        onConfirm={handleConfirmRemoval}
        onCancel={() => setSizeToRemove(null)}
      />
    </>
  );
}
