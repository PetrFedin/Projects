'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Heart,
    ShoppingCart,
    MessageSquare,
    Share2,
    Eye,
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import LookCard from "../look-card";
import { userLooks } from "@/lib/lookboards";
import { products } from "@/lib/products";
import ProductCard from "../product-card";

const activities = [
    { type: 'purchase', icon: ShoppingCart, text: 'Совершила покупку на 18 500 ₽', time: '2 дня назад' },
    { type: 'wishlist', icon: Heart, text: 'Добавила товар "Шелковое платье-миди" в избранное', time: '3 дня назад' },
    { type: 'comment', icon: MessageSquare, text: 'Оставила комментарий под образом от @max_fashion', time: '4 дня назад' },
    { type: 'view', icon: Eye, text: 'Просмотрела 15 товаров в категории "Верхняя одежда"', time: '4 дня назад' },
    { type: 'share', icon: Share2, text: 'Поделилась лукбордом "Летнее настроение"', time: '5 дней назад' },
];

export function ActivityFeed() {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
             <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Лента активности</CardTitle>
                    <CardDescription>Последние действия клиента на платформе.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-96">
                        <div className="space-y-6">
                            {activities.map((activity, index) => (
                                <div key={index} className="flex gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                                        <activity.icon className="h-4 w-4 text-secondary-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm">{activity.text}</p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Созданные образы</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {userLooks.map(look => <LookCard key={look.id} look={look} showAuthor={false} />)}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Избранные товары</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {products.slice(0, 3).map(p => <ProductCard key={p.id} product={p} />)}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
