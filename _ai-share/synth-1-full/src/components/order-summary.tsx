'use client';

import { useUIState } from "@/providers/ui-state";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useMemo } from "react";
import { Button } from "./ui/button";

export default function OrderSummary() {
    const { cart } = useUIState();

    const subtotal = useMemo(() => 
        cart.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0),
        [cart]
    );
    const shipping = subtotal > 0 ? 500 : 0;
    const total = subtotal + shipping;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ваш заказ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                    {cart.map(item => (
                        <div key={item.id} className="flex items-start gap-3">
                            <div className="relative aspect-square w-12 rounded-md overflow-hidden flex-shrink-0">
                                <Image src={item.images?.[0]?.url || (item as any).image || '/placeholder.jpg'} alt={item.images?.[0]?.alt || item.name} fill className="object-cover" />
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                                    {item.quantity}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">{item.brand}</p>
                            </div>
                            <p className="text-sm font-semibold">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</p>
                        </div>
                    ))}
                </div>
                <Separator />
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
                    <div className="flex justify-between font-bold text-sm">
                        <span>Итого к оплате</span>
                        <span>{total.toLocaleString('ru-RU')} ₽</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                 <Button variant="secondary" className="w-full" disabled>Применить промокод</Button>
            </CardFooter>
        </Card>
    )
}
