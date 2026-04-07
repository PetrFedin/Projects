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
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Имя</p>
              <p className="font-medium">{user.displayName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            {(user as any).lifestyle && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Город</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {(user as any).lifestyle.city}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Профессия</p>
                  <p className="font-medium flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {(user as any).lifestyle.occupation}
                  </p>
                </div>
                {(user as any).lifestyle.age && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Возраст</p>
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
                  <p className="text-sm text-muted-foreground mb-2">Любимые цвета</p>
                  <div className="flex flex-wrap gap-2">
                    {(user as any).preferences.favoriteColors.map((color: string, index: number) => (
                      <Badge key={index} variant="outline">{color}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {(user as any).preferences.favoriteBrands && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Любимые бренды</p>
                  <div className="flex flex-wrap gap-2">
                    {(user as any).preferences.favoriteBrands.map((brand: string, index: number) => (
                      <Badge key={index} variant="secondary">{brand}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {(user as any).preferences.favoriteCategories && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Любимые категории</p>
                  <div className="flex flex-wrap gap-2">
                    {(user as any).preferences.favoriteCategories.map((cat: string, index: number) => (
                      <Badge key={index} variant="outline">{cat}</Badge>
                    ))}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-sm font-bold">{orderStats.totalOrders}</p>
              <p className="text-xs text-muted-foreground mt-1">Заказов</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-sm font-bold">{orderStats.totalSpent.toLocaleString('ru-RU')}</p>
              <p className="text-xs text-muted-foreground mt-1">₽ потрачено</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-sm font-bold">{Math.round(orderStats.avgOrderValue).toLocaleString('ru-RU')}</p>
              <p className="text-xs text-muted-foreground mt-1">₽ средний чек</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-sm font-bold">{Math.round(orderStats.returnRate)}%</p>
              <p className="text-xs text-muted-foreground mt-1">Возвратов</p>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-sm font-bold">{(user as any).activity.totalViews || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Просмотров</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-sm font-bold">{(user as any).activity.totalLikes || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Лайков</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-sm font-bold">{lookboards.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Лукбордов</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-sm font-bold">{(user as any).activity.totalReviews || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">Отзывов</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

