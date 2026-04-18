'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import {
  Eye,
  Heart,
  ShoppingBag,
  X,
  Send,
  Ruler,
  Search,
  ArrowRight,
  Zap,
  Plus,
  Check,
  Minus,
  Calendar as CalendarIcon,
  Edit2,
  Sparkles,
  Trophy,
  Ticket,
  Layers,
  AlertCircle,
  Bell,
  Radio,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/user/messages/Dialogs/ConfirmDialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Product, ColorInfo } from '@/lib/types';

export function ProductContent({
  product,
  initialColorId,
}: {
  product: Product;
  initialColorId?: string;
}) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(initialColorId || null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  // State to track additions with size and count
  const [cartItems, setCartItems] = useState<Record<string, number>>({});
  const [preOrderItems, setPreOrderItems] = useState<Record<string, number>>({});
  const [selectedWishlists, setSelectedWishlists] = useState<string[]>([]);
  const [selectedLooks, setSelectedLooks] = useState<string[]>([]);
  const [localQty, setLocalQty] = useState<number>(1);
  const [preOrderRequests, setPreOrderRequests] = useState<Record<string, 'pending' | 'confirmed'>>(
    {}
  );

  // Ref to track latest preOrderRequests for async checks
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

  // Mock stock data synchronized with brand and color
  const stock: Record<string, number> = useMemo(() => {
    // Базовые остатки для разных цветов
    const baseStock: Record<string, Record<string, number>> = {
      c1: { XS: 2, S: 5, M: 0, L: 0 },
      c2: { XS: 0, S: 3, M: 10, L: 2 },
      c3: { XS: 5, S: 0, M: 0, L: 8 },
    };

    if (product.id === '1' || product.id === 1) {
      return baseStock[selectedColorId || 'c1'] || baseStock['c1'];
    }
    if (product.id === '12' || product.id === 12) {
      return baseStock[selectedColorId || 'c1'] || baseStock['c1'];
    }
    return { XS: 2, S: 5, M: 0, L: 10 };
  }, [product.id, selectedColorId]);

  // Sizes that can be requested for pre-order if out of stock
  const canPreOrderSizes = useMemo(() => {
    if (product.id === '1' || product.id === 1) {
      return ['XS', 'S', 'M', 'L'];
    }
    if (product.id === '12' || product.id === 12) {
      // Для разных цветов разные доступные размеры для предзаказа
      if (selectedColorId === 'c2') return ['XS', 'S'];
      return ['M'];
    }
    return ['L'];
  }, [product.id, selectedColorId]);

  // Update localQty when selectedSize or selectedColor changes
  useEffect(() => {
    if (selectedSize && selectedColorId) {
      const itemKey = `${selectedColorId}-${selectedSize}`;
      const inCart = cartItems[itemKey] || preOrderItems[itemKey];
      if (inCart) {
        setLocalQty(inCart);
      } else {
        // Если товара нет в наличии, ставим 0, иначе 1
        setLocalQty(stock[selectedSize] > 0 ? 1 : 0);
      }
    }
  }, [selectedSize, selectedColorId, cartItems, preOrderItems, stock]);

  // State for groups
  const [wishlistGroups, setWishlistGroups] = useState([
    'Ожидание',
    'Весна 2024',
    'Базовый гардероб',
  ]);
  const [lookGroups, setLookGroups] = useState(['Офисный стиль', 'Вечерний выход', 'Weekend']);
  const [newGroupName, setNewGroupName] = useState('');
  const [isAddingWishlistGroup, setIsAddingWishlistGroup] = useState(false);
  const [isAddingLookGroup, setIsAddingLookGroup] = useState(false);

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

  const { toast } = useToast();

  const handleCreatePreOrderRequest = (size: string) => {
    if (!selectedColorId) return;
    const itemKey = `${selectedColorId}-${size}`;

    setPreOrderRequests((prev) => ({ ...prev, [itemKey]: 'pending' }));
    setLocalQty(1); // При создании запроса устанавливаем кол-во 1
    setIsPreOrderDialogOpen(false);
    toast({
      title: 'Запрос отправлен',
      description: `Запрос на предзаказ размера ${size} отправлен бренду. Ожидайте подтверждения в сообщениях.`,
    });

    // Simulate confirmation after some time for demo
    setTimeout(() => {
      // Проверяем актуальность запроса через Ref, чтобы избежать stale closure и side-effects в updater
      if (preOrderRequestsRef.current[itemKey] === 'pending') {
        setPreOrderRequests((prev) => ({ ...prev, [itemKey]: 'confirmed' }));
        toast({
          title: 'Предзаказ подтвержден',
          description: `Бренд подтвердил возможность предзаказа размера ${size}. Вы можете продолжить общение в чате.`,
        });
      }
    }, 5000);
  };

  // Russian labels for measurements
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
      product.id === '3' ||
      product.id === '1' ||
      product.id === 1);
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
    if (localQty > stock[selectedSize]) {
      toast({
        title: 'Превышен лимит',
        description: 'К сожалению, доступное количество товара этого размера исчерпано.',
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
      toast({
        title: 'Удалено',
        description: `${product.name} (размер ${selectedSize}) удален из предзаказа.`,
      });
      return;
    }
    setPreOrderItems((prev) => ({
      ...prev,
      [itemKey]: localQty,
    }));
    toast({
      title: 'Заявка принята',
      description: `Заказано ${localQty} ед. Наш менеджер свяжется с вами в ближайшее время для обсуждения деталей предзаказа.`,
    });
  };

  const handleRemovePreOrder = (size: string, e?: React.MouseEvent) => {
    if (!selectedColorId) return;
    e?.stopPropagation();
    const itemKey = `${selectedColorId}-${size}`;

    setPreOrderItems((prev) => {
      const newItems = { ...prev };
      if (newItems[itemKey] > 1) {
        newItems[itemKey] -= 1;
      } else {
        delete newItems[itemKey];
      }
      return newItems;
    });
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColorId) {
      toast({
        title: 'Выберите параметры',
        description: 'Пожалуйста, выберите цвет и размер перед добавлением в корзину.',
        variant: 'destructive',
      });
      return;
    }
    if (localQty > stock[selectedSize]) {
      toast({
        title: 'Превышен лимит',
        description: 'К сожалению, доступное количество товара этого размера исчерпано.',
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
      toast({
        title: 'Удалено',
        description: `${product.name} (размер ${selectedSize}) удален из корзины.`,
      });
      return;
    }
    setCartItems((prev) => ({
      ...prev,
      [itemKey]: localQty,
    }));
    toast({
      title: 'Добавлено',
      description: `В корзине ${localQty} шт. ${product.name} (размер ${selectedSize}).`,
    });
  };

  const handleRemoveFromCart = (size: string, e?: React.MouseEvent) => {
    if (!selectedColorId) return;
    e?.stopPropagation();
    const itemKey = `${selectedColorId}-${size}`;

    setCartItems((prev) => {
      const newItems = { ...prev };
      if (newItems[itemKey] > 1) {
        newItems[itemKey] -= 1;
      } else {
        delete newItems[itemKey];
      }
      return newItems;
    });
  };

  const handleRemoveRequest = (size: string, e?: React.MouseEvent) => {
    if (!selectedColorId) return;
    e?.stopPropagation();
    const itemKey = `${selectedColorId}-${size}`;

    setPreOrderRequests((prev) => {
      const newItems = { ...prev };
      delete newItems[itemKey];
      return newItems;
    });
    toast({ title: 'Запрос отменен', description: `Запрос на предзаказ размера ${size} отменен.` });
  };

  const colors: ColorInfo[] = product.availableColors || [
    {
      id: 'c1',
      name: 'Графит',
      hex: '#374151',
      colorDescription: 'Глубокий серый оттенок',
      status: 'active',
      isBase: true,
      lifecycleStatus: 'in_stock',
      noSale: false,
      carryOver: true,
    },
    {
      id: 'c2',
      name: 'Олива',
      hex: '#374631',
      colorDescription: 'Приглушенный зеленый милитари',
      status: 'active',
      isBase: false,
      lifecycleStatus: 'in_stock',
      noSale: false,
      carryOver: false,
    },
    {
      id: 'c3',
      name: 'Песочный',
      hex: '#d1bfa7',
      colorDescription: 'Теплый бежевый оттенок',
      status: 'active',
      isBase: false,
      lifecycleStatus: 'in_stock',
      noSale: false,
      carryOver: false,
    },
  ];

  const activeColor = colors.find((c) => c.id === selectedColorId) || colors[0];

  return (
    <div className="flex h-full flex-col">
      <div
        className="group/image relative aspect-[3/4] w-full shrink-0 cursor-zoom-in"
        onClick={() => setIsImageZoomed(true)}
      >
        {product.images?.[currentImgIdx]?.url ? (
          <Image
            src={product.images[currentImgIdx].url}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (product as any).image ? (
          <Image src={(product as any).image} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Eye className="h-12 w-12 text-muted-foreground opacity-20" />
          </div>
        )}

        {/* Image Navigation */}
        {(product.images?.length || 0) > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImgIdx((prev) =>
                  prev > 0 ? prev - 1 : (product.images?.length || 1) - 1
                );
              }}
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/10 text-white opacity-0 backdrop-blur-md transition-all hover:bg-black/30 group-hover/image:opacity-100"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImgIdx((prev) =>
                  prev < (product.images?.length || 1) - 1 ? prev + 1 : 0
                );
              }}
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/10 text-white opacity-0 backdrop-blur-md transition-all hover:bg-black/30 group-hover/image:opacity-100"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Status Badges */}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {isPreOrder && (
            <Badge className="border-none bg-blue-500 text-white shadow-lg">PRE-ORDER</Badge>
          )}
          {isSoldOut && (
            <Badge variant="destructive" className="shadow-lg">
              SOLD OUT
            </Badge>
          )}
          {activeColor.isBase && (
            <Badge variant="secondary" className="bg-white/90 shadow-sm backdrop-blur-md">
              Base Collection
            </Badge>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="rounded-2xl border border-white/20 bg-white/90 p-3 shadow-lg backdrop-blur-md">
            <h4 className="mb-1 text-sm font-black uppercase leading-none tracking-tight">
              {product.name}
            </h4>
            <p className="text-xs font-bold text-muted-foreground">
              {product.price.toLocaleString('ru-RU')} ₽
            </p>
          </div>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full bg-white/90 shadow-lg hover:bg-white"
                >
                  <Heart
                    className={cn(
                      'h-5 w-5',
                      selectedWishlists.length > 0 ? 'fill-red-500 text-red-500' : ''
                    )}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-56 overflow-hidden rounded-2xl p-0 shadow-xl"
                align="end"
              >
                <div className="border-b bg-muted/50 p-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Добавить в вишлист
                </div>
                <div className="custom-scrollbar max-h-48 space-y-1 overflow-y-auto p-2">
                  {wishlistGroups.map((group) => (
                    <div
                      key={group}
                      className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors hover:bg-muted"
                      onClick={() => {
                        if (selectedWishlists.includes(group)) {
                          setSelectedWishlists((prev) => prev.filter((g) => g !== group));
                        } else {
                          setSelectedWishlists((prev) => [...prev, group]);
                          toast({
                            title: 'Добавлено',
                            description: `Товар добавлен в список "${group}"`,
                          });
                        }
                      }}
                    >
                      <div
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded border transition-colors',
                          selectedWishlists.includes(group)
                            ? 'border-black bg-black text-white'
                            : 'border-muted-foreground/30'
                        )}
                      >
                        {selectedWishlists.includes(group) && <Check className="h-3 w-3" />}
                      </div>
                      <span className="text-xs font-medium">{group}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t bg-muted/30 p-2">
                  {!isAddingWishlistGroup ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-full justify-start text-xs"
                      onClick={() => setIsAddingWishlistGroup(true)}
                    >
                      <Plus className="mr-2 h-3 w-3" /> Создать группу
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className="h-8 text-xs"
                        placeholder="Название..."
                        autoFocus
                      />
                      <Button size="sm" className="h-8 w-8 p-0" onClick={handleAddWishlistGroup}>
                        <Check className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full bg-white/90 shadow-lg hover:bg-white"
                >
                  <Layers
                    className={cn('h-5 w-5', selectedLooks.length > 0 ? 'text-accent' : '')}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-56 overflow-hidden rounded-2xl p-0 shadow-xl"
                align="end"
              >
                <div className="border-b bg-muted/50 p-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Добавить в образ
                </div>
                <div className="custom-scrollbar max-h-48 space-y-1 overflow-y-auto p-2">
                  {lookGroups.map((group) => (
                    <div
                      key={group}
                      className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors hover:bg-muted"
                      onClick={() => {
                        if (selectedLooks.includes(group)) {
                          setSelectedLooks((prev) => prev.filter((g) => g !== group));
                        } else {
                          setSelectedLooks((prev) => [...prev, group]);
                          toast({
                            title: 'Добавлено',
                            description: `Товар добавлен в образ "${group}"`,
                          });
                        }
                      }}
                    >
                      <div
                        className={cn(
                          'flex h-4 w-4 items-center justify-center rounded border transition-colors',
                          selectedLooks.includes(group)
                            ? 'border-accent bg-accent text-white'
                            : 'border-muted-foreground/30'
                        )}
                      >
                        {selectedLooks.includes(group) && <Check className="h-3 w-3" />}
                      </div>
                      <span className="text-xs font-medium">{group}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t bg-muted/30 p-2">
                  {!isAddingLookGroup ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-full justify-start text-xs"
                      onClick={() => setIsAddingLookGroup(true)}
                    >
                      <Plus className="mr-2 h-3 w-3" /> Создать образ
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        className="h-8 text-xs"
                        placeholder="Название..."
                        autoFocus
                      />
                      <Button size="sm" className="h-8 w-8 p-0" onClick={handleAddLookGroup}>
                        <Check className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-4">
        {/* Color Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Цвет
            </span>
            <span className="text-xs font-bold">{activeColor.name}</span>
          </div>
          <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
            {colors.map((color) => (
              <TooltipProvider key={color.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        setSelectedColorId(color.id);
                        // Reset size if needed, or keep if valid
                      }}
                      className={cn(
                        'relative h-10 w-10 shrink-0 rounded-full border-2 transition-all',
                        selectedColorId === color.id
                          ? 'scale-110 border-black shadow-md'
                          : 'border-transparent hover:border-black/20'
                      )}
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColorId === color.id && (
                        <Check
                          className={cn(
                            'absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2',
                            color.hex === '#ffffff' ? 'text-black' : 'text-white'
                          )}
                        />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs font-medium">
                    <p>{color.name}</p>
                    {color.colorDescription && (
                      <p className="text-[10px] text-muted-foreground">{color.colorDescription}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Размер
            </span>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="link"
                  className="h-auto p-0 text-[10px] font-bold uppercase tracking-widest text-accent hover:no-underline"
                >
                  <Ruler className="mr-1 h-3 w-3" /> Таблица размеров
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Таблица размеров</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <div className="mb-2 grid grid-cols-5 gap-3 border-b pb-2 text-center text-sm font-bold">
                    <div className="text-left">Размер</div>
                    <div>Грудь</div>
                    <div>Талия</div>
                    <div>Бедра</div>
                    <div>Длина</div>
                  </div>
                  {Object.entries(measurements).map(([size, m]: [string, any]) => (
                    <div
                      key={size}
                      className="grid grid-cols-5 gap-3 border-b py-2 text-center text-sm transition-colors last:border-0 hover:bg-muted/50"
                    >
                      <div className="text-left font-bold">{size}</div>
                      <div>{m.bust}</div>
                      <div>{m.waist}</div>
                      <div>{m.hips}</div>
                      <div>{m.length}</div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['XS', 'S', 'M', 'L'].map((size) => {
              const inStock = stock[size] > 0;
              const inCart = (selectedColorId ? cartItems[`${selectedColorId}-${size}`] : 0) || 0;
              const inPreOrder =
                (selectedColorId ? preOrderItems[`${selectedColorId}-${size}`] : 0) || 0;
              const pendingRequest = selectedColorId
                ? preOrderRequests[`${selectedColorId}-${size}`]
                : undefined;
              const isPending = pendingRequest === 'pending';
              const isConfirmed = pendingRequest === 'confirmed';
              const canPreOrder = !inStock && canPreOrderSizes.includes(size);

              return (
                <button
                  key={size}
                  disabled={!inStock && !canPreOrder && !isPending && !isConfirmed}
                  onClick={() => {
                    if (inStock || canPreOrder || isConfirmed) {
                      setSelectedSize(size);
                    } else if (isPending) {
                      toast({
                        title: 'Запрос в обработке',
                        description: 'Мы уже обрабатываем ваш запрос на этот размер.',
                      });
                    } else {
                      // Request logic
                      setPreOrderDialogSize(size);
                      setIsPreOrderDialogOpen(true);
                    }
                  }}
                  className={cn(
                    'group/size relative h-12 overflow-hidden rounded-xl border-2 text-xs font-bold transition-all',
                    selectedSize === size
                      ? 'border-black bg-black text-white shadow-lg'
                      : inStock
                        ? 'border-muted bg-white hover:border-black/20'
                        : canPreOrder || isConfirmed
                          ? 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300'
                          : isPending
                            ? 'cursor-default border-yellow-200 bg-yellow-50 text-yellow-700'
                            : 'cursor-not-allowed border-muted bg-muted/20 text-muted-foreground opacity-50'
                  )}
                >
                  {size}
                  {inCart > 0 && (
                    <div className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-green-500 px-0.5 text-[8px] text-white shadow-sm">
                      {inCart}
                    </div>
                  )}
                  {inPreOrder > 0 && (
                    <div className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blue-500 px-0.5 text-[8px] text-white shadow-sm">
                      {inPreOrder}
                    </div>
                  )}
                  {!inStock && (canPreOrder || isConfirmed) && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500/20" />
                  )}
                  {!inStock && isPending && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-yellow-500/20" />
                  )}
                </button>
              );
            })}
          </div>
          {selectedSize && !stock[selectedSize] && canPreOrderSizes.includes(selectedSize) && (
            <p className="text-[10px] font-medium text-blue-600 animate-in slide-in-from-top-1">
              Доступен для предзаказа. Отправка через 7-10 дней.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          {isAvailable && (
            <div className="flex items-center gap-3">
              {/* Quantity Controls */}
              <div className="flex h-10 shrink-0 items-center rounded-xl border-2 border-muted bg-white px-2">
                <button
                  onClick={() => setLocalQty(Math.max(0, localQty - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-black"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-bold">{localQty}</span>
                <button
                  onClick={() =>
                    setLocalQty(Math.min(stock[selectedSize || ''] || 99, localQty + 1))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-black"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                className="h-10 flex-1 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-black/5 transition-all hover:shadow-black/10 active:scale-95"
                onClick={handleAddToCart}
                disabled={!selectedSize || localQty === 0}
              >
                {localQty > 0 ? (
                  <>
                    <ShoppingBag className="mr-2 h-4 w-4" />В корзину •{' '}
                    {(product.price * localQty).toLocaleString('ru-RU')} ₽
                  </>
                ) : (
                  'Выберите количество'
                )}
              </Button>
            </div>
          )}

          {isPreOrder && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 shrink-0 items-center rounded-xl border-2 border-blue-100 bg-blue-50/50 px-2">
                  <button
                    onClick={() => setLocalQty(Math.max(0, localQty - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-blue-900">{localQty}</span>
                  <button
                    onClick={() => setLocalQty(localQty + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-blue-700 transition-colors hover:bg-blue-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button
                  className="h-10 flex-1 rounded-xl bg-blue-600 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 hover:bg-blue-700"
                  onClick={handlePreOrder}
                  disabled={!selectedSize || localQty === 0}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Оформить предзаказ
                </Button>
              </div>
              <p className="text-center text-[10px] text-muted-foreground">
                Предоплата 100%. Гарантия возврата средств.
              </p>
            </div>
          )}

          {isSoldOut && (
            <Button
              variant="secondary"
              className="h-10 w-full cursor-not-allowed rounded-xl bg-muted text-xs font-black uppercase tracking-widest text-muted-foreground"
              disabled
            >
              Нет в наличии
            </Button>
          )}
        </div>
      </div>

      {/* Image Zoom Dialog */}
      <Dialog open={isImageZoomed} onOpenChange={setIsImageZoomed}>
        <DialogContent className="h-[90vh] w-full max-w-screen-xl border-none bg-black p-0">
          <div className="relative flex h-full w-full items-center justify-center">
            <button
              onClick={() => setIsImageZoomed(false)}
              className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >
              <X className="h-6 w-6" />
            </button>
            {product.images?.[currentImgIdx]?.url ? (
              <Image
                src={product.images[currentImgIdx].url}
                alt={product.name}
                fill
                className="object-contain"
                quality={100}
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={!!sizeToRemove}
        onOpenChange={(open) => !open && setSizeToRemove(null)}
        title={
          sizeToRemove?.type === 'pending_request' ? 'Отменить запрос?' : 'Удалить из корзины?'
        }
        description={
          sizeToRemove?.type === 'pending_request'
            ? 'Вы уверены, что хотите отменить запрос на предзаказ? Это действие нельзя отменить.'
            : 'Вы уверены, что хотите удалить этот товар?'
        }
        onConfirm={() => {
          if (!sizeToRemove) return;
          if (sizeToRemove.type === 'cart') {
            handleRemoveFromCart(sizeToRemove.size);
          } else if (sizeToRemove.type === 'preorder') {
            handleRemovePreOrder(sizeToRemove.size);
          } else if (sizeToRemove.type === 'pending_request') {
            handleRemoveRequest(sizeToRemove.size);
          }
          setSizeToRemove(null);
        }}
      />

      <Dialog open={isPreOrderDialogOpen} onOpenChange={setIsPreOrderDialogOpen}>
        <DialogContent className="max-w-sm rounded-xl p-4">
          <DialogHeader>
            <DialogTitle className="text-center text-base font-black uppercase tracking-tight">
              Запрос размера
            </DialogTitle>
            <DialogDescription className="pt-2 text-center text-xs font-medium">
              Размера {preOrderDialogSize} сейчас нет в наличии. <br />
              Хотите отправить запрос бренду на индивидуальный пошив или уведомление о поступлении?
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-3">
            <Button
              className="h-12 w-full rounded-xl bg-black font-bold text-white hover:bg-black/90"
              onClick={() => preOrderDialogSize && handleCreatePreOrderRequest(preOrderDialogSize)}
            >
              Отправить запрос
            </Button>
            <Button
              variant="outline"
              className="h-12 w-full rounded-xl border-muted-foreground/20 font-bold"
              onClick={() => setIsPreOrderDialogOpen(false)}
            >
              Отмена
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
