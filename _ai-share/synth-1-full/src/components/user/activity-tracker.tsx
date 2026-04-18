'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Heart, ShoppingBag, Search, Clock, TrendingUp, Filter } from 'lucide-react';
import { useUIState } from '@/providers/ui-state';
import { ordersRepository } from '@/lib/repositories';
import { useAuth } from '@/providers/auth-provider';
import type { Order } from '@/lib/types';
import { format, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'view' | 'wishlist' | 'cart' | 'purchase' | 'search' | 'comparison';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export default function ActivityTracker() {
  const { user } = useAuth();
  const { cart, wishlist, comparisonList } = useUIState();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const userOrders = await ordersRepository.getOrders(user.uid);
      setOrders(userOrders);

      // Generate activities from various sources
      const generatedActivities: Activity[] = [];

      // Recent orders
      userOrders.slice(0, 3).forEach((order) => {
        generatedActivities.push({
          id: `order-${order.id}`,
          type: 'purchase',
          title: 'Заказ оформлен',
          description: `Заказ на сумму ${order.total.toLocaleString('ru-RU')} ₽`,
          timestamp: new Date(order.createdAt),
          metadata: { orderId: order.id },
        });
      });

      // Cart activity
      if (cart.length > 0) {
        generatedActivities.push({
          id: 'cart-activity',
          type: 'cart',
          title: 'Товары в корзине',
          description: `${cart.length} ${cart.length === 1 ? 'товар' : 'товаров'} ожидают оформления`,
          timestamp: new Date(),
        });
      }

      // Wishlist activity
      if (wishlist.length > 0) {
        generatedActivities.push({
          id: 'wishlist-activity',
          type: 'wishlist',
          title: 'Избранное обновлено',
          description: `В избранном ${wishlist.length} ${wishlist.length === 1 ? 'товар' : 'товаров'}`,
          timestamp: new Date(),
        });
      }

      // Comparison activity
      if (comparisonList.length > 0) {
        generatedActivities.push({
          id: 'comparison-activity',
          type: 'comparison',
          title: 'Сравнение товаров',
          description: `Сравниваете ${comparisonList.length} ${comparisonList.length === 1 ? 'товар' : 'товаров'}`,
          timestamp: new Date(),
        });
      }

      // Simulated view activities
      for (let i = 0; i < 5; i++) {
        generatedActivities.push({
          id: `view-${i}`,
          type: 'view',
          title: 'Просмотр товара',
          description: 'Просмотрен товар из каталога',
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        });
      }

      // Sort by timestamp
      generatedActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setActivities(generatedActivities.slice(0, 20));
    };

    loadData();
  }, [user, cart.length, wishlist.length, comparisonList.length]);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'view':
        return <Eye className="h-4 w-4" />;
      case 'wishlist':
        return <Heart className="h-4 w-4" />;
      case 'cart':
        return <ShoppingBag className="h-4 w-4" />;
      case 'purchase':
        return <ShoppingBag className="h-4 w-4" />;
      case 'search':
        return <Search className="h-4 w-4" />;
      case 'comparison':
        return <Filter className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'purchase':
        return 'text-green-600 bg-green-100 dark:bg-green-950';
      case 'cart':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-950';
      case 'wishlist':
        return 'text-accent-primary bg-accent-primary/15 dark:bg-bg-surface2';
      case 'view':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
      case 'search':
        return 'text-accent-primary bg-accent-primary/15 dark:bg-bg-surface2';
      case 'comparison':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-950';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800';
    }
  };

  const activityStats = {
    totalViews: activities.filter((a) => a.type === 'view').length,
    totalPurchases: orders.length,
    totalWishlist: wishlist.length,
    cartItems: cart.length,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Трекер активности
            </CardTitle>
            <CardDescription>Все ваши действия на платформе</CardDescription>
          </div>
          <Badge variant="outline">{activities.length} действий</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="mb-6 grid grid-cols-4 gap-3">
          <div className="rounded-lg bg-muted p-3 text-center">
            <div className="text-sm font-bold">{activityStats.totalViews}</div>
            <div className="text-xs text-muted-foreground">Просмотров</div>
          </div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <div className="text-sm font-bold">{activityStats.totalPurchases}</div>
            <div className="text-xs text-muted-foreground">Покупок</div>
          </div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <div className="text-sm font-bold">{activityStats.totalWishlist}</div>
            <div className="text-xs text-muted-foreground">В избранном</div>
          </div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <div className="text-sm font-bold">{activityStats.cartItems}</div>
            <div className="text-xs text-muted-foreground">В корзине</div>
          </div>
        </div>

        {/* Activity List */}
        <div className="max-h-96 space-y-3 overflow-y-auto">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className={cn('rounded-lg p-2', getActivityColor(activity.type))}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="whitespace-nowrap text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true, locale: ru })}
                  </div>
                </div>
                {activity.metadata?.orderId && (
                  <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-xs" asChild>
                    <Link href={`/orders/${activity.metadata.orderId}`}>Посмотреть заказ →</Link>
                  </Button>
                )}
              </div>
            </div>
          ))}
          {activities.length === 0 && (
            <div className="py-4 text-center text-muted-foreground">Пока нет активности</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
