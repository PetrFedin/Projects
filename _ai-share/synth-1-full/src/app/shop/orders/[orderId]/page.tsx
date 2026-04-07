
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, File, Truck, MoreVertical, CheckCircle, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

const orderStatusSteps = [
    { status: "В ожидании", date: "2024-07-20" },
    { status: "Обработка", date: "2024-07-21" },
    { status: "Отправлен", date: null },
    { status: "Доставлен", date: null },
];


export default function OrderDetailsPage({ params: paramsPromise }: { params: Promise<{ orderId: string }>}) {
    const params = use(paramsPromise);
    const [orderItems, setOrderItems] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch('/data/products.json');
            const allProducts: Product[] = await res.json();
            setOrderItems(allProducts.slice(0, 2));
        };
        fetchProducts();
    }, []);

    const subtotal = orderItems.reduce((acc, item) => acc + item.price, 0);
    const shipping = 500;
    const taxes = (subtotal + shipping) * 0.2;
    const total = subtotal + shipping + taxes;
    const currentStatusIndex = orderStatusSteps.findIndex(s => s.date === null);

    if (orderItems.length === 0) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="space-y-4">
             <div className="flex items-center gap-3 mb-8">
                <Button variant="outline" size="icon" asChild>
                    <Link href="/shop/orders"><ChevronLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-sm font-semibold tracking-tight">
                    Заказ <span className="font-mono text-muted-foreground">{params.orderId}</span>
                </h1>
                <Badge variant="secondary" className="ml-2">В ожидании</Badge>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline">
                        <Truck className="mr-2 h-4 w-4"/>
                        Отправить заказ
                    </Button>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4"/></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem><File className="mr-2 h-4 w-4"/>Скачать инвойс</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Статус заказа</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="flex justify-between">
                                {orderStatusSteps.map((step, index) => (
                                    <div key={step.status} className="flex flex-col items-center text-center relative w-1/4">
                                        <div className={cn(
                                            "h-8 w-8 rounded-full flex items-center justify-center border-2 z-10",
                                            step.date ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-border"
                                        )}>
                                            {step.date ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5 text-muted-foreground"/>}
                                        </div>
                                        <p className="font-medium text-sm mt-2">{step.status}</p>
                                        <p className="text-xs text-muted-foreground">{step.date ? new Date(step.date).toLocaleDateString('ru-RU') : '...'}</p>
                                        {index < orderStatusSteps.length - 1 && (
                                            <div className={cn(
                                                "absolute top-4 left-1/2 w-full h-0.5 -z-0",
                                                step.date && (index < currentStatusIndex - 1 || currentStatusIndex === -1) ? "bg-primary" : "bg-border"
                                            )} />
                                        )}
                                    </div>
                                ))}
                           </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Товары в заказе</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px] hidden md:table-cell">Изобр.</TableHead>
                                        <TableHead>Название</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Кол-во</TableHead>
                                        <TableHead className="text-right">Цена</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderItems.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="hidden md:table-cell">
                                                <Image src={item.images[0].url} alt={item.name} width={64} height={64} className="rounded-md object-cover"/>
                                            </TableCell>
                                            <TableCell className="font-medium">{item.name}</TableCell>
                                            <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                                            <TableCell>1</TableCell>
                                            <TableCell className="text-right">{item.price.toLocaleString('ru-RU')} ₽</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                 <div className="md:col-span-1">
                    <div className="space-y-4 sticky top-24">
                        <Card>
                            <CardHeader>
                                <CardTitle>Информация о клиенте</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="font-semibold">Лиам Джонсон</p>
                                    <Link href="/customer-360" className="text-sm text-muted-foreground hover:text-primary underline">Посмотреть профиль 360°</Link>
                                </div>
                                <Separator />
                                <div className="space-y-1 text-sm">
                                    <p className="text-muted-foreground">Контакт</p>
                                    <p>liam@example.com</p>
                                    <p>+7 (999) 123-45-67</p>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p className="text-muted-foreground">Адрес доставки</p>
                                    <p>123456, Москва, ул. Тверская, д. 1, кв. 10</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full">Связаться с клиентом</Button>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Сумма заказа</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                    <span className="text-muted-foreground">Подытог</span>
                                    <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Доставка</span>
                                    <span>{shipping.toLocaleString('ru-RU')} ₽</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Налоги (20%)</span>
                                    <span>{taxes.toLocaleString('ru-RU')} ₽</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-base">
                                    <span>Итого</span>
                                    <span>{total.toLocaleString('ru-RU')} ₽</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Заметки к заказу</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="order-notes" className="sr-only">Заметки</Label>
                                    <Textarea id="order-notes" placeholder="Внутренние комментарии к заказу..." />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button size="sm">Сохранить заметку</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
