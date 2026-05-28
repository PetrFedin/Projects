'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Briefcase, Heart, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { useUserOrders } from '@/hooks/use-user-orders';
import { useUserActivity } from '@/hooks/use-user-activity';

export default function ClientProfileDetails() {
  const { user } = useAuth();
  const { lookboards } = useUIState();
  const { stats: orderStats } = useUserOrders();
  const activity = useUserActivity();

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Личная информация
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="mb-1 text-sm text-muted-foreground">Имя</p>
              <p className="font-medium">{user.displayName}</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            {(user as any).lifestyle && (
              <>
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Город</p>
                  <p className="flex items-center gap-1 font-medium">
                    <MapPin className="h-4 w-4" />
                    {(user as any).lifestyle.city}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Профессия</p>
                  <p className="flex items-center gap-1 font-medium">
                    <Briefcase className="h-4 w-4" />
                    {(user as any).lifestyle.occupation}
                  </p>
                </div>
                {(user as any).lifestyle.age && (
                  <div>
                    <p className="mb-1 text-sm text-muted-foreground">Возраст</p>
                    <p className="font-medium">{(user as any).lifestyle.age} лет</p>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      {(user as any).preferences && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Предпочтения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(user as any).preferences.favoriteColors && (
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Любимые цвета</p>
                  <div className="flex flex-wrap gap-2">
                    {(user as any).preferences.favoriteColors.map(
                      (color: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {color}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
              {(user as any).preferences.favoriteBrands && (
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Любимые бренды</p>
                  <div className="flex flex-wrap gap-2">
                    {(user as any).preferences.favoriteBrands.map(
                      (brand: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {brand}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
              {(user as any).preferences.favoriteCategories && (
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Любимые категории</p>
                  <div className="flex flex-wrap gap-2">
                    {(user as any).preferences.favoriteCategories.map(
                      (cat: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {cat}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Статистика покупок
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-sm font-bold">{orderStats.totalOrders}</p>
              <p className="mt-1 text-xs text-muted-foreground">Заказов</p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-sm font-bold">{orderStats.totalSpent.toLocaleString('ru-RU')}</p>
              <p className="mt-1 text-xs text-muted-foreground">₽ потрачено</p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-sm font-bold">
                {Math.round(orderStats.avgOrderValue).toLocaleString('ru-RU')}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">₽ средний чек</p>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-sm font-bold">{Math.round(orderStats.returnRate)}%</p>
              <p className="mt-1 text-xs text-muted-foreground">Возвратов</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      {(user as any).activity && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Активность на платформе
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-sm font-bold">{(user as any).activity.totalViews || 0}</p>
                <p className="mt-1 text-xs text-muted-foreground">Просмотров</p>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-sm font-bold">{(user as any).activity.totalLikes || 0}</p>
                <p className="mt-1 text-xs text-muted-foreground">Лайков</p>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-sm font-bold">{lookboards.length}</p>
                <p className="mt-1 text-xs text-muted-foreground">Лукбордов</p>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-sm font-bold">{(user as any).activity.totalReviews || 0}</p>
                <p className="mt-1 text-xs text-muted-foreground">Отзывов</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
