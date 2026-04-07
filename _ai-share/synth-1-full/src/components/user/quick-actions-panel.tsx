'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Search, Heart, ShoppingBag, Calendar, Camera, Sparkles, Gift, Zap,
  Share2, HelpCircle, Settings, Bell, CreditCard, Package, Truck,
} from 'lucide-react';
import Link from 'next/link';
import { useUIState } from '@/providers/ui-state';
import { Badge } from '@/components/ui/badge';

export default function QuickActionsPanel() {
  const { cart, wishlist } = useUIState();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const quickActions = [
    {
      icon: Search,
      label: 'Поиск',
      href: '/search',
      description: 'Найти товары',
      color: 'text-blue-600',
    },
    {
      icon: Sparkles,
      label: 'AI Стилист',
      href: '/ai-stylist',
      description: 'Создать образ',
      color: 'text-purple-600',
      badge: 'AI',
    },
    {
      icon: Heart,
      label: 'Избранное',
      href: '/u?tab=wardrobe',
      description: `${wishlistCount} товаров`,
      color: 'text-pink-600',
      badge: wishlistCount > 0 ? wishlistCount.toString() : undefined,
    },
    {
      icon: Zap,
      label: 'Предзаказ',
      href: '/u?tab=preorders',
      description: 'Ваши запросы',
      color: 'text-amber-600',
    },
    {
      icon: ShoppingBag,
      label: 'Корзина',
      href: '/checkout',
      description: `${cartCount} товаров`,
      color: 'text-green-600',
      badge: cartCount > 0 ? cartCount.toString() : undefined,
    },
    {
      icon: Calendar,
      label: 'События',
      href: '/u?tab=events',
      description: 'Планирование',
      color: 'text-orange-600',
    },
    {
      icon: Camera,
      label: 'AR Примерка',
      href: '/ar-try-on',
      description: 'Виртуальная примерка',
      color: 'text-indigo-600',
      badge: 'NEW',
    },
    {
      icon: Gift,
      label: 'Подарки',
      href: '/gifts',
      description: 'Выбрать подарок',
      color: 'text-red-600',
    },
    {
      icon: Share2,
      label: 'Поделиться',
      href: '/share',
      description: 'Реферальная программа',
      color: 'text-cyan-600',
    },
  ];

  const supportActions = [
    {
      icon: HelpCircle,
      label: 'Помощь',
      href: '/help',
      description: 'FAQ и поддержка',
    },
    {
      icon: Bell,
      label: 'Уведомления',
      href: '/u?tab=settings',
      description: 'Настройки',
    },
    {
      icon: Settings,
      label: 'Настройки',
      href: '/u?tab=settings',
      description: 'Профиль и настройки',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
          <CardDescription>
            Все важные функции в одном месте
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto flex-col py-4 relative"
                asChild
              >
                <Link href={action.href}>
                  <action.icon className={`h-5 w-5 mb-2 ${action.color}`} />
                  <span className="text-xs font-medium">{action.label}</span>
                  <span className="text-xs text-muted-foreground mt-1">{action.description}</span>
                  {action.badge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {action.badge}
                    </Badge>
                  )}
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Support Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Поддержка</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {supportActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-auto flex-col py-3"
                asChild
              >
                <Link href={action.href}>
                  <action.icon className="h-4 w-4 mb-1" />
                  <span className="text-xs">{action.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Status Quick View */}
      <Card>
        <CardHeader>
          <CardTitle>Статус заказов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">В обработке</p>
                  <p className="text-xs text-muted-foreground">Заказ #12345</p>
                </div>
              </div>
              <Button variant="link" size="sm" asChild>
                <Link href="/orders">Подробнее →</Link>
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">В доставке</p>
                  <p className="text-xs text-muted-foreground">Заказ #12344</p>
                </div>
              </div>
              <Button variant="link" size="sm" asChild>
                <Link href="/orders">Отследить →</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}





