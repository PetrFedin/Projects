'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bell,
  X,
  Check,
  AlertCircle,
  Gift,
  Package,
  Truck,
  Sparkles,
  Calendar,
  TrendingDown,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { ordersRepository } from '@/lib/repositories';
import type { Order } from '@/lib/types';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'sale' | 'delivery' | 'restock' | 'reminder' | 'achievement' | 'recommendation';
  title: string;
  description: string;
  read: boolean;
  timestamp: string;
  actionLink?: string;
  actionText?: string;
  priority: 'high' | 'medium' | 'low';
}

export default function SmartNotifications() {
  const { user } = useAuth();
  const { cart, wishlist } = useUIState();
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const loadNotifications = async () => {
      try {
        const userOrders = await ordersRepository.getOrders(user.uid);
        setOrders(userOrders);

        // Generate smart notifications
        const generatedNotifications: Notification[] = [
          {
            id: '1',
            type: 'sale',
            title: 'Скидка на избранное',
            description: `${wishlist.length} товаров из вашего избранного сейчас со скидкой до 30%`,
            read: false,
            timestamp: new Date().toISOString(),
            actionLink: '/u?tab=wardrobe',
            actionText: 'Посмотреть скидки',
            priority: 'high',
          },
          {
            id: '2',
            type: 'delivery',
            title: 'Заказ в доставке',
            description: 'Ваш заказ #12344 отправлен. Ожидаемая доставка: 15 января',
            read: false,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            actionLink: '/orders',
            actionText: 'Отследить заказ',
            priority: 'high',
          },
          {
            id: '3',
            type: 'restock',
            title: 'Товар снова в наличии',
            description: 'Платье, которое вы просматривали, снова доступно в размере S',
            read: false,
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            actionLink: '/products/dress-classic',
            actionText: 'Посмотреть товар',
            priority: 'medium',
          },
          {
            id: '4',
            type: 'reminder',
            title: 'Товары в корзине',
            description: `У вас ${cart.length} товаров в корзине. Не забудьте оформить заказ!`,
            read: false,
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            actionLink: '/checkout',
            actionText: 'Оформить заказ',
            priority: 'medium',
          },
          {
            id: '5',
            type: 'achievement',
            title: 'Новое достижение!',
            description: 'Вы получили достижение "Постоянный клиент" за 10 заказов',
            read: true,
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            actionLink: '/u?tab=achievements',
            actionText: 'Посмотреть достижения',
            priority: 'low',
          },
          {
            id: '6',
            type: 'recommendation',
            title: 'AI рекомендует',
            description: 'На основе ваших покупок AI подобрал 5 товаров специально для вас',
            read: true,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            actionLink: '/search?ai_recommended=true',
            actionText: 'Посмотреть рекомендации',
            priority: 'low',
          },
        ];

        setNotifications(generatedNotifications);
        setUnreadCount(generatedNotifications.filter((n) => !n.read).length);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    };

    loadNotifications();
  }, [user, cart.length, wishlist.length]);

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'sale':
        return <Gift className="h-4 w-4 text-red-600" />;
      case 'delivery':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'restock':
        return <Package className="h-4 w-4 text-green-600" />;
      case 'reminder':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'achievement':
        return <Sparkles className="h-4 w-4 text-yellow-600" />;
      case 'recommendation':
        return <TrendingDown className="h-4 w-4 text-purple-600" />;
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Уведомления
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Все важные обновления и напоминания</CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Отметить все прочитанными
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Unread notifications */}
          {unreadNotifications.length > 0 && (
            <>
              {unreadNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'rounded-lg border p-4 transition-all',
                    notification.priority === 'high' &&
                      'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20',
                    notification.priority === 'medium' &&
                      'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20',
                    notification.priority === 'low' && 'border-muted bg-muted/50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon(notification.type)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold">{notification.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.timestamp), {
                              addSuffix: true,
                              locale: ru,
                            })}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                      {notification.actionLink && notification.actionText && (
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                          <Link href={notification.actionLink}>{notification.actionText} →</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Read notifications */}
          {readNotifications.length > 0 && (
            <div className="border-t pt-4">
              <p className="mb-3 text-xs text-muted-foreground">Прочитанные</p>
              {readNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="mb-2 rounded-lg border bg-muted/30 p-3 opacity-60 transition-opacity hover:opacity-100"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getIcon(notification.type)}</div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.timestamp), {
                            addSuffix: true,
                            locale: ru,
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {notifications.length === 0 && (
            <div className="py-4 text-center text-muted-foreground">
              <Bell className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p>Нет уведомлений</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
