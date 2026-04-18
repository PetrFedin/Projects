'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Calendar,
  PieChart,
  BarChart3,
  Target,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { ordersRepository } from '@/lib/repositories';
import type { Order } from '@/lib/types';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';

interface MonthlyStats {
  month: string;
  total: number;
  orders: number;
  avgOrder: number;
  categories: Record<string, number>;
}

export default function AdvancedAnalytics() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadAnalytics = async () => {
      try {
        const userOrders = await ordersRepository.getOrders(user.uid);
        setOrders(userOrders);

        // Calculate monthly stats
        const now = new Date();
        const sixMonthsAgo = subMonths(now, 6);
        const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });

        const stats: MonthlyStats[] = months.map((month) => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);

          const monthOrders = userOrders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= monthStart && orderDate <= monthEnd;
          });

          const total = monthOrders.reduce((sum, o) => sum + o.total, 0);
          const categories: Record<string, number> = {};

          monthOrders.forEach((order) => {
            order.items.forEach((item) => {
              categories[item.category] =
                (categories[item.category] || 0) + item.price * item.quantity;
            });
          });

          return {
            month: format(month, 'MMM yyyy', { locale: ru }),
            total,
            orders: monthOrders.length,
            avgOrder: monthOrders.length > 0 ? total / monthOrders.length : 0,
            categories,
          };
        });

        setMonthlyStats(stats);
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="py-4 text-center">Загрузка аналитики...</div>
        </CardContent>
      </Card>
    );
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;

  // Calculate category distribution
  const categoryTotals: Record<string, number> = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      categoryTotals[item.category] =
        (categoryTotals[item.category] || 0) + item.price * item.quantity;
    });
  });

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Calculate trend
  const lastMonth = monthlyStats[monthlyStats.length - 1]?.total || 0;
  const prevMonth = monthlyStats[monthlyStats.length - 2]?.total || 0;
  const trend = prevMonth > 0 ? ((lastMonth - prevMonth) / prevMonth) * 100 : 0;

  // Projected yearly spending
  const avgMonthly =
    monthlyStats.reduce((sum, m) => sum + m.total, 0) / Math.max(1, monthlyStats.length);
  const projectedYearly = avgMonthly * 12;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-bold">{totalSpent.toLocaleString('ru-RU')}</p>
              <p className="mt-1 text-xs text-muted-foreground">₽ всего потрачено</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-bold">{totalOrders}</p>
              <p className="mt-1 text-xs text-muted-foreground">Заказов</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-bold">{Math.round(avgOrder).toLocaleString('ru-RU')}</p>
              <p className="mt-1 text-xs text-muted-foreground">₽ средний чек</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="flex items-center justify-center gap-1 text-sm font-bold">
                {trend > 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">+{Math.round(trend)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-red-600">{Math.round(trend)}%</span>
                  </>
                )}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Тренд</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="spending" className="w-full">
        {/* cabinetSurface v1 */}
        <TabsList className={cn(cabinetSurface.tabsList, 'h-auto min-w-0')}>
          <TabsTrigger
            value="spending"
            className={cn(
              cabinetSurface.tabsTrigger,
              'text-xs font-semibold normal-case tracking-normal'
            )}
          >
            Расходы
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className={cn(
              cabinetSurface.tabsTrigger,
              'text-xs font-semibold normal-case tracking-normal'
            )}
          >
            Категории
          </TabsTrigger>
          <TabsTrigger
            value="projections"
            className={cn(
              cabinetSurface.tabsTrigger,
              'text-xs font-semibold normal-case tracking-normal'
            )}
          >
            Прогнозы
          </TabsTrigger>
        </TabsList>

        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Расходы по месяцам
              </CardTitle>
              <CardDescription>Динамика ваших покупок за последние 6 месяцев</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyStats.map((stat, index) => {
                  const maxTotal = Math.max(...monthlyStats.map((s) => s.total));
                  const percentage = maxTotal > 0 ? (stat.total / maxTotal) * 100 : 0;

                  return (
                    <div key={index}>
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{stat.month}</p>
                          <p className="text-xs text-muted-foreground">{stat.orders} заказов</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{stat.total.toLocaleString('ru-RU')} ₽</p>
                          <p className="text-xs text-muted-foreground">
                            Средний чек: {Math.round(stat.avgOrder).toLocaleString('ru-RU')} ₽
                          </p>
                        </div>
                      </div>
                      <div className="h-3 w-full rounded-full bg-muted">
                        <div
                          className="h-3 rounded-full bg-accent transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Распределение по категориям
              </CardTitle>
              <CardDescription>На что вы тратите больше всего</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCategories.map(([category, total], index) => {
                  const percentage = (total / totalSpent) * 100;
                  const maxTotal = Math.max(...topCategories.map(([, t]) => t));
                  const barPercentage = (total / maxTotal) * 100;

                  return (
                    <div key={index}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'h-3 w-3 rounded-full',
                              index === 0 && 'bg-blue-500',
<<<<<<< HEAD
                              index === 1 && 'bg-purple-500',
                              index === 2 && 'bg-pink-500',
=======
                              index === 1 && 'bg-accent-primary',
                              index === 2 && 'bg-accent-primary',
>>>>>>> recover/cabinet-wip-from-stash
                              index === 3 && 'bg-orange-500',
                              index === 4 && 'bg-green-500'
                            )}
                          />
                          <p className="text-sm font-medium">{category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{total.toLocaleString('ru-RU')} ₽</p>
                          <p className="text-xs text-muted-foreground">{Math.round(percentage)}%</p>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div
                          className={cn(
                            'h-2 rounded-full transition-all',
                            index === 0 && 'bg-blue-500',
<<<<<<< HEAD
                            index === 1 && 'bg-purple-500',
                            index === 2 && 'bg-pink-500',
=======
                            index === 1 && 'bg-accent-primary',
                            index === 2 && 'bg-accent-primary',
>>>>>>> recover/cabinet-wip-from-stash
                            index === 3 && 'bg-orange-500',
                            index === 4 && 'bg-green-500'
                          )}
                          style={{ width: `${barPercentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Прогнозы и рекомендации
              </CardTitle>
              <CardDescription>AI анализирует ваши расходы и дает рекомендации</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg bg-muted p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-medium">Прогноз на год</p>
                    <Badge variant="outline">{format(new Date(), 'yyyy')}</Badge>
                  </div>
                  <p className="text-sm font-bold">
                    {Math.round(projectedYearly).toLocaleString('ru-RU')} ₽
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    На основе средних расходов за последние {monthlyStats.length} месяцев
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Рекомендации AI:</h4>
                  <div className="space-y-2">
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
                      <p className="mb-1 text-sm font-medium">Оптимизация бюджета</p>
                      <p className="text-xs text-muted-foreground">
                        Рассмотрите покупки в разделе Аутлет для экономии до 40%
                      </p>
                    </div>
                    <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950/20">
                      <p className="mb-1 text-sm font-medium">Сезонные покупки</p>
                      <p className="text-xs text-muted-foreground">
                        Планируйте крупные покупки в конце сезона для лучших цен
                      </p>
                    </div>
<<<<<<< HEAD
                    <div className="rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-950/20">
=======
                    <div className="bg-accent-primary/10 dark:bg-bg-surface2/80 border-accent-primary/25 dark:border-border-default rounded-lg border p-3">
>>>>>>> recover/cabinet-wip-from-stash
                      <p className="mb-1 text-sm font-medium">Используйте бонусы</p>
                      <p className="text-xs text-muted-foreground">
                        У вас накоплено {user?.loyaltyPoints || 0} баллов. Используйте их для
                        следующей покупки!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
