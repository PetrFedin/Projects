'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Calendar,
  Shirt,
  Layers,
} from 'lucide-react';
import { useUIState } from '@/providers/ui-state';
import QuickCheckout from '@/components/user/quick-checkout';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { CartItem } from '@/lib/types';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ROUTES } from '@/lib/routes';
import {
  cartLineKey,
  sortCartByActiveOutfit,
  cartItemsMatchingOutfit,
  subtotalForItems,
  lineRefMatchesCartItem,
} from '@/lib/cart-outfit-utils';

const ALL_OUTFITS_VALUE = '__all__';

export default function CartSheet() {
  const {
    isCartOpen,
    toggleCart,
    cart,
    updateCartItemQuantity,
    removeCartItem,
    checkATS,
    savedCartOutfits,
    activeCartOutfitId,
    setActiveCartOutfitId,
    saveCartOutfit,
    applyCartOutfitToCart,
  } = useUIState();

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [outfitName, setOutfitName] = useState('');

  const activeOutfit = useMemo(
    () => savedCartOutfits.find((o) => o.id === activeCartOutfitId) ?? null,
    [savedCartOutfits, activeCartOutfitId]
  );

  const sortedCart = useMemo(
    () => sortCartByActiveOutfit(cart, activeOutfit),
    [cart, activeOutfit]
  );
  const outfitCartLines = useMemo(
    () => cartItemsMatchingOutfit(cart, activeOutfit),
    [cart, activeOutfit]
  );

  const subtotal = useMemo(() => {
    if (!activeOutfit) return subtotalForItems(cart);
    if (outfitCartLines.length > 0) return subtotalForItems(outfitCartLines);
    return 0;
  }, [activeOutfit, outfitCartLines, cart]);

  const shipping = subtotal > 0 ? 500 : 0;
  const total = subtotal + shipping;

  const toggleKey = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const selectAllInCart = () => setSelectedKeys(cart.map(cartLineKey));
  const clearLineSelection = () => setSelectedKeys([]);

  const handleSaveOutfit = () => {
    const created = saveCartOutfit(outfitName, selectedKeys);
    if (created) {
      setOutfitName('');
      setSaveDialogOpen(false);
      clearLineSelection();
    }
  };

  const cartItemId = (item: CartItem) => cartLineKey(item);

  const selectValue = activeCartOutfitId ?? ALL_OUTFITS_VALUE;

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={toggleCart}>
        <SheetContent className="flex w-full flex-col sm:max-w-md">
          <SheetHeader className="space-y-1 pr-6">
            <SheetTitle className="font-headline text-sm">Корзина</SheetTitle>
            {cart.length > 0 && (
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-text-muted text-[10px] font-black uppercase tracking-wider">
                    Образ
                  </span>
                  <Link
                    href={ROUTES.client.myOutfits}
                    onClick={toggleCart}
                    className="text-accent-primary text-[10px] font-bold uppercase hover:underline"
                  >
                    Мои образы
                  </Link>
                </div>
                <Select
                  value={selectValue}
                  onValueChange={(v) => setActiveCartOutfitId(v === ALL_OUTFITS_VALUE ? null : v)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Вся корзина" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_OUTFITS_VALUE}>Вся корзина</SelectItem>
                    {savedCartOutfits.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {activeOutfit && outfitCartLines.length === 0 && (
                  <p className="text-[10px] font-medium leading-snug text-amber-700">
                    В корзине нет позиций этого образа.
                    <Button
                      type="button"
                      variant="link"
                      className="text-accent-primary ml-1 h-auto p-0 text-[10px] font-black uppercase"
                      onClick={() => applyCartOutfitToCart(activeOutfit.id)}
                    >
                      Добавить из каталога
                    </Button>
                  </p>
                )}
                {activeOutfit && outfitCartLines.length > 0 && (
                  <div className="scrollbar-hide flex gap-1 overflow-x-auto pb-1">
                    {outfitCartLines.map((item) => (
                      <div
                        key={cartItemId(item)}
                        className="border-accent-primary/20 bg-bg-surface2 relative h-14 w-11 shrink-0 overflow-hidden rounded border"
                      >
                        <Image
                          src={
                            item.images?.[0]?.url ||
                            (item as { image?: string }).image ||
                            '/placeholder.jpg'
                          }
                          alt=""
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] font-bold uppercase"
                    onClick={selectAllInCart}
                  >
                    Все позиции
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[10px] font-bold uppercase"
                    onClick={clearLineSelection}
                  >
                    Снять выбор
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-7 gap-1 text-[10px] font-bold uppercase"
                    disabled={selectedKeys.length === 0}
                    onClick={() => setSaveDialogOpen(true)}
                  >
                    <Shirt className="h-3 w-3" />В образ
                  </Button>
                </div>
              </div>
            )}
          </SheetHeader>
          {cart.length > 0 ? (
            <>
              <ScrollArea className="-mx-6 flex-1">
                <div className="space-y-4 px-6">
                  {sortedCart.map((item) => {
                    const available = checkATS(
                      item.id,
                      item.selectedSize || 'One Size',
                      (item as { color?: string }).color || item.color
                    );
                    const isLimited = item.quantity >= available;
                    const key = cartItemId(item);
                    const inActiveOutfit = activeOutfit
                      ? activeOutfit.lineRefs.some((ref) => lineRefMatchesCartItem(ref, item))
                      : false;

                    return (
                      <div
                        key={key}
                        className={`border-border-subtle -ml-1 flex items-start gap-3 rounded-lg border-b pb-4 pl-1 transition-colors last:border-0 ${
                          inActiveOutfit && activeOutfit
                            ? 'bg-accent-primary/10 ring-accent-primary/20 ring-1'
                            : ''
                        }`}
                      >
                        <div className="pt-1">
                          <Checkbox
                            checked={selectedKeys.includes(key)}
                            onCheckedChange={() => toggleKey(key)}
                            aria-label="Включить в образ"
                            className="border-border-default"
                          />
                        </div>
                        <div className="bg-bg-surface2 relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={
                              item.images?.[0]?.url ||
                              (item as { image?: string }).image ||
                              '/placeholder.jpg'
                            }
                            alt={item.images?.[0]?.alt || item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-accent-primary mb-0.5 text-[10px] font-black uppercase">
                                {item.brand}
                              </p>
                              <Link
                                href={`/products/${item.slug}`}
                                onClick={toggleCart}
                                className="hover:text-accent-primary mb-1 block text-sm font-bold uppercase leading-tight transition-colors"
                              >
                                {item.name}
                              </Link>
                              <div className="mb-1 flex flex-wrap gap-2">
                                {item.selectedSize && (
                                  <Badge
                                    variant="outline"
                                    className="border-border-default h-4 px-1.5 py-0 text-[9px] font-bold"
                                  >
                                    РАЗМЕР: {item.selectedSize}
                                  </Badge>
                                )}
                                {((item as { color?: string }).color || item.color) && (
                                  <Badge
                                    variant="outline"
                                    className="border-border-default h-4 px-1.5 py-0 text-[9px] font-bold uppercase"
                                  >
                                    ЦВЕТ: {(item as { color?: string }).color || item.color}
                                  </Badge>
                                )}
                                {isLimited && (
                                  <Badge className="h-4 border-none bg-amber-50 px-1.5 py-0 text-[8px] font-black uppercase text-amber-600">
                                    MAX ATS: {available}
                                  </Badge>
                                )}
                              </div>
                              {item.deliveryDate && (
                                <p className="text-text-muted mt-1 flex items-center gap-1 text-[9px] font-medium uppercase">
                                  <Calendar className="h-2.5 w-2.5" />
                                  Доставка:{' '}
                                  {format(new Date(item.deliveryDate), 'd MMMM', { locale: ru })}
                                </p>
                              )}
                            </div>
                            <p className="text-text-primary shrink-0 text-sm font-black">
                              {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                            </p>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="bg-bg-surface2 border-border-subtle flex items-center gap-1.5 rounded-lg border p-0.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-white"
                                onClick={() =>
                                  updateCartItemQuantity(
                                    item.id,
                                    item.quantity - 1,
                                    item.selectedSize,
                                    (item as { color?: string }).color || item.color
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center text-xs font-black">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-white"
                                onClick={() =>
                                  updateCartItemQuantity(
                                    item.id,
                                    item.quantity + 1,
                                    item.selectedSize,
                                    (item as { color?: string }).color || item.color
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-text-muted h-7 w-7 transition-colors hover:bg-rose-50 hover:text-rose-500"
                              onClick={() =>
                                removeCartItem(
                                  item.id,
                                  item.selectedSize,
                                  (item as { color?: string }).color || item.color
                                )
                              }
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span className="sr-only">Удалить товар</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              <div className="border-border-subtle mt-auto space-y-2 border-t pt-3">
                {activeOutfit && outfitCartLines.length > 0 && (
                  <div className="text-accent-primary flex items-center justify-between text-xs font-bold uppercase tracking-tight">
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5" />
                      {activeOutfit.name}
                    </span>
                    <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Доставка</span>
                  <span>{shipping > 0 ? `${shipping.toLocaleString('ru-RU')} ₽` : '—'}</span>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <span>
                    {activeOutfit && outfitCartLines.length > 0 ? 'Итого (образ)' : 'Итого'}
                  </span>
                  <span>{total.toLocaleString('ru-RU')} ₽</span>
                </div>
                <Separator />
              </div>
              <SheetFooter className="mt-2 flex flex-col gap-3 !space-x-0 pt-0">
                <QuickCheckout compact scopeItems={activeOutfit ? outfitCartLines : undefined} />
                <Button variant="outline" asChild size="lg" className="w-full">
                  <Link href="/checkout" onClick={toggleCart}>
                    Полное оформление <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </SheetFooter>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-base font-semibold">Ваша корзина пуста</h3>
              <p className="mt-1 text-muted-foreground">Добавьте товары, чтобы начать</p>
              <Button asChild className="mt-6" onClick={toggleCart}>
                <Link href="/search">Продолжить покупки</Link>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline text-base">Сохранить образ</DialogTitle>
            <p className="pt-1 text-sm text-muted-foreground">
              В образ войдут {selectedKeys.length} поз. Позже можно подсветить их в корзине и видеть
              сумму только образа.
            </p>
          </DialogHeader>
          <Input
            placeholder="Название образа"
            value={outfitName}
            onChange={(e) => setOutfitName(e.target.value)}
            className="mt-2"
          />
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Отмена
            </Button>
            <Button type="button" onClick={handleSaveOutfit} disabled={!outfitName.trim()}>
              Сохранить в «Мои образы»
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
