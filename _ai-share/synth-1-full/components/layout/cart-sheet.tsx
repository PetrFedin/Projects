'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useUIState } from '@/providers/ui-state';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CartSheet() {
  const { isCartOpen, toggleCart, cart, updateCartItemQuantity, removeCartItem } = useUIState();

  const subtotal = useMemo(() => 
    cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0),
    [cart]
  );
  const shipping = subtotal > 0 ? 500 : 0;
  const total = subtotal + shipping;

  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full flex flex-col sm:max-w-md">
        <SheetHeader className="pr-6">
          <SheetTitle className="font-headline text-2xl">Корзина</SheetTitle>
        </SheetHeader>
        {cart.length > 0 ? (
            <>
                <ScrollArea className="flex-1 -mx-6">
                    <div className="px-6 space-y-4">
                        {cart.map(item => (
                        <div key={item.id} className="flex gap-4 items-start">
                            <div className="relative aspect-[4/5] w-24 rounded-md overflow-hidden">
                            <Image src={item.images[0].url} alt={item.images[0].alt} fill className="object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-start">
                                <div>
                                <p className="text-sm font-medium text-muted-foreground">{item.brand}</p>
                                <Link href={`/products/${item.slug}`} onClick={toggleCart} className="font-semibold hover:text-accent transition-colors text-base leading-tight">
                                    {item.name}
                                </Link>
                                </div>
                                <p className="text-base font-semibold">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1 border rounded-md p-0.5">
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}>
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                    type="text"
                                    readOnly
                                    value={item.quantity}
                                    className="w-8 h-6 text-center border-none focus-visible:ring-0 p-0"
                                />
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                                </div>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-7 w-7" onClick={() => removeCartItem(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Удалить товар</span>
                                </Button>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </ScrollArea>
                <SheetFooter className="mt-auto flex flex-col gap-4 !space-x-0 pt-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-muted-foreground">
                        <span>Подытог</span>
                        <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                        <span>Доставка</span>
                        <span>{shipping.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                        <span>Итого</span>
                        <span>{total.toLocaleString('ru-RU')} ₽</span>
                        </div>
                    </div>
                    <Button asChild size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link href="/checkout" onClick={toggleCart}>
                        Перейти к оформлению <ArrowRight className="ml-2" />
                    </Link>
                    </Button>
                </SheetFooter>
            </>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Ваша корзина пуста</h3>
                <p className="text-muted-foreground mt-1">Добавьте товары, чтобы начать</p>
                <Button asChild className="mt-6" onClick={toggleCart}>
                    <Link href="/search">Продолжить покупки</Link>
                </Button>
            </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
