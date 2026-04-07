'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, BellOff, TrendingDown, X, CheckCircle2, 
  ShoppingBag, Percent, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productSlug: string;
  currentPrice: number;
  targetPrice?: number;
  originalPrice: number;
  discount?: number;
  isActive: boolean;
  createdAt: Date;
  notifiedAt?: Date;
}

export default function PriceAlerts() {
  const { user } = useAuth();
  const { wishlist } = useUIState();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'triggered'>('all');

  useEffect(() => {
    if (!user) return;

    // Создаем алерты на основе избранного
    const wishlistAlerts: PriceAlert[] = wishlist.map((item, index) => {
      const originalPrice = item.originalPrice || item.price;
      const currentPrice = item.price;
      const discount = originalPrice > currentPrice 
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : undefined;

      return {
        id: `alert-${item.id}`,
        productId: item.id,
        productName: item.name,
        productImage: item.images?.[0]?.url || '/logo_placeholder.svg',
        productSlug: item.slug || '',
        currentPrice,
        originalPrice,
        discount,
        isActive: true,
        createdAt: new Date(Date.now() - index * 86400000), // Разные даты для демо
        notifiedAt: discount && discount > 20 ? new Date() : undefined,
      };
    });

    setAlerts(wishlistAlerts);
  }, [user, wishlist]);

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'active') return alert.isActive && !alert.notifiedAt;
    if (filter === 'triggered') return alert.notifiedAt !== undefined;
    return true;
  });

  const activeAlerts = alerts.filter(a => a.isActive && !a.notifiedAt).length;
  const triggeredAlerts = alerts.filter(a => a.notifiedAt !== undefined).length;

  const handleToggleAlert = (id: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const handleRemoveAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">{alerts.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Всего отслеживаний</p>
              </div>
              <Bell className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">{activeAlerts}</p>
                <p className="text-xs text-muted-foreground mt-1">Активных</p>
              </div>
              <Bell className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">{triggeredAlerts}</p>
                <p className="text-xs text-muted-foreground mt-1">Сработало</p>
              </div>
              <TrendingDown className="h-8 w-8 text-accent opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-accent" />
            Уведомления о снижении цен
          </CardTitle>
          <CardDescription>
            Получайте уведомления, когда цена на товары из избранного снижается
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">Все ({alerts.length})</TabsTrigger>
              <TabsTrigger value="active">Активные ({activeAlerts})</TabsTrigger>
              <TabsTrigger value="triggered">Сработало ({triggeredAlerts})</TabsTrigger>
            </TabsList>

            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {alerts.length === 0
                    ? 'Нет отслеживаемых товаров'
                    : 'Ничего не найдено'}
                </p>
                <p className="text-sm mt-2">
                  {alerts.length === 0
                    ? 'Добавьте товары в избранное, чтобы отслеживать изменения цен'
                    : 'Попробуйте изменить фильтры'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onToggle={handleToggleAlert}
                    onRemove={handleRemoveAlert}
                  />
                ))}
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function AlertCard({
  alert,
  onToggle,
  onRemove,
}: {
  alert: PriceAlert;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const hasDiscount = alert.discount && alert.discount > 0;
  const priceChange = alert.originalPrice - alert.currentPrice;

  return (
    <Card className={cn(
      'transition-all',
      alert.notifiedAt && 'border-green-500/20 bg-green-500/5'
    )}>
      <CardContent className="pt-6">
        <div className="flex gap-3">
          {/* Product Image */}
          <Link href={`/products/${alert.productSlug}`} className="flex-shrink-0">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
              <Image
                src={alert.productImage}
                alt={alert.productName}
                fill
                className="object-cover"
                unoptimized
              />
              {hasDiscount && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-red-500 text-white">
                    -{alert.discount}%
                  </Badge>
                </div>
              )}
            </div>
          </Link>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${alert.productSlug}`}
                  className="font-medium hover:text-accent transition-colors block truncate"
                >
                  {alert.productName}
                </Link>
                <div className="flex items-center gap-3 mt-2">
                  {hasDiscount ? (
                    <>
                      <span className="text-sm font-bold text-green-600">
                        {alert.currentPrice.toLocaleString('ru-RU')} ₽
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {alert.originalPrice.toLocaleString('ru-RU')} ₽
                      </span>
                      <Badge variant="outline" className="text-green-600 border-green-500/20">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Экономия {priceChange.toLocaleString('ru-RU')} ₽
                      </Badge>
                    </>
                  ) : (
                    <span className="text-sm font-bold">
                      {alert.currentPrice.toLocaleString('ru-RU')} ₽
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {alert.notifiedAt && (
                  <Badge variant="outline" className="text-green-600 border-green-500/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Уведомлено
                  </Badge>
                )}
                <Switch
                  checked={alert.isActive}
                  onCheckedChange={() => onToggle(alert.id)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(alert.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
              <span>
                Отслеживается с {format(alert.createdAt, 'd MMM yyyy', { locale: ru })}
              </span>
              {alert.notifiedAt && (
                <span>
                  Уведомление: {format(alert.notifiedAt, 'd MMM yyyy, HH:mm', { locale: ru })}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}





