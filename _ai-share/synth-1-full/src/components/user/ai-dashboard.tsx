'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  Brain,
  Zap,
  Target,
  Award,
  ShoppingBag,
  Heart,
  Eye,
  Clock,
  ArrowRight,
  Gift,
  Star,
  BarChart3,
  Lightbulb,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { useUserOrders } from '@/hooks/use-user-orders';
import { useUserActivity } from '@/hooks/use-user-activity';
import type { Order } from '@/lib/types';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { QuickStatsCard } from './shared/quick-stats-card';
import UnifiedAchievements from './unified-achievements';
import AIStyleAnalyzer from './ai-style-analyzer';
import AIWardrobePlanner from './ai-wardrobe-planner';
import AISocialInsights from './ai-social-insights';
import AIBudgetOptimizer from './ai-budget-optimizer';
import GamificationSystem from './gamification-system';
import QuickActionsPanel from './quick-actions-panel';
import SmartRecommendations from './smart-recommendations';
import PersonalizedFeed from './personalized-feed';
import RecentlyViewed from './recently-viewed';
import SmartNotifications from './smart-notifications';
import VirtualWardrobe from './virtual-wardrobe';
import StyleCalendar from './style-calendar';
import AutomatedInsightsPanel from './automated-insights-panel';
import PredictiveAnalytics from './predictive-analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AIInsight {
  type: 'recommendation' | 'warning' | 'opportunity' | 'achievement';
  title: string;
  description: string;
  action?: string;
  actionLink?: string;
  priority: 'high' | 'medium' | 'low';
}

export default function AIDashboard() {
  const { user } = useAuth();
  const { cart, wishlist, lookboards } = useUIState();
  const { orders, stats: orderStats, loading: ordersLoading } = useUserOrders();
  const activity = useUserActivity();
  const [insights, setInsights] = useState<AIInsight[]>([]);

  useEffect(() => {
    if (!ordersLoading && orders.length >= 0) {
      // Generate AI insights
      const generatedInsights = generateAIInsights(
        orders,
        activity.cartCount,
        activity.wishlistCount,
        activity.lookboardsCount
      );
      setInsights(generatedInsights);
    }
  }, [orders, activity.cartCount, activity.wishlistCount, activity.lookboardsCount, ordersLoading]);

  const pointsToNextLevel = activity.loyaltyPoints
    ? Math.max(0, 2000 - (activity.loyaltyPoints % 2000))
    : 0;
  const pointsProgress = activity.loyaltyPoints
    ? ((activity.loyaltyPoints % 2000) / 2000) * 100
    : 0;

  if (ordersLoading) {
    return <div className="py-12 text-center">Загрузка аналитики...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <QuickStatsCard
          label="Всего потрачено"
          value={`${orderStats.totalSpent.toLocaleString('ru-RU')} ₽`}
          icon={TrendingUp}
          iconColor="text-green-600"
          trend={{ value: '+12% к прошлому месяцу', isPositive: true }}
        />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Заказов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">{orderStats.totalOrders}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <ShoppingBag className="h-3 w-3" />
              <span>Средний чек: {orderStats.avgOrderValue.toLocaleString('ru-RU')} ₽</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Бонусные баллы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {activity.loyaltyPoints.toLocaleString('ru-RU')}
            </div>
            <div className="mt-2">
              <Progress value={pointsProgress} className="h-2" />
              <p className="mt-1 text-xs text-muted-foreground">
                До следующего уровня: {pointsToNextLevel} баллов
              </p>
            </div>
          </CardContent>
        </Card>

        <QuickStatsCard
          label="Активность"
          value={activity.totalActivity}
          icon={Heart}
          iconColor="text-accent-primary/60"
        />
      </div>

      {/* Dashboard Tabs - Organized Analytics Sections */}
      <Tabs defaultValue="overview" className="w-full">
        {/* cabinetSurface v1 */}
        <TabsList
          className={cn(
            cabinetSurface.tabsList,
            'grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
          )}
        >
          <TabsTrigger
            value="overview"
            className={cn(
              cabinetSurface.tabsTrigger,
              'h-9 text-xs font-medium normal-case tracking-normal'
            )}
          >
            Обзор
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className={cn(
              cabinetSurface.tabsTrigger,
              'h-9 text-xs font-medium normal-case tracking-normal'
            )}
          >
            Аналитика
          </TabsTrigger>
          <TabsTrigger
            value="ai-insights"
            className={cn(
              cabinetSurface.tabsTrigger,
              'h-9 text-xs font-medium normal-case tracking-normal'
            )}
          >
            AI Инсайты
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className={cn(
              cabinetSurface.tabsTrigger,
              'h-9 text-xs font-medium normal-case tracking-normal'
            )}
          >
            Активность
          </TabsTrigger>
          <TabsTrigger
            value="recommendations"
            className={cn(
              cabinetSurface.tabsTrigger,
              'h-9 text-xs font-medium normal-case tracking-normal'
            )}
          >
            Рекомендации
          </TabsTrigger>
          <TabsTrigger
            value="quick-actions"
            className={cn(
              cabinetSurface.tabsTrigger,
              'h-9 text-xs font-medium normal-case tracking-normal'
            )}
          >
            Действия
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab - Key Stats and Quick Info */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Smart Notifications - Top Priority */}
          <SmartNotifications />

          {/* Automated Insights - AI-powered insights */}
          <AutomatedInsightsPanel />

          {/* Personalized Feed */}
          <PersonalizedFeed />

          {/* Recently Viewed */}
          <RecentlyViewed />

          {/* Quick Actions */}
          <QuickActionsPanel />
        </TabsContent>

        {/* Analytics Tab - Detailed Analytics */}
        <TabsContent value="analytics" className="mt-6 space-y-6">
          {/* Predictive Analytics - Forecasts and Trends */}
          <PredictiveAnalytics />

          {/* AI Style Analyzer */}
          <AIStyleAnalyzer />

          {/* Social Insights & Budget */}
          <div className="grid gap-3 md:grid-cols-2">
            <AISocialInsights />
            <AIBudgetOptimizer />
          </div>

          {/* Activity Tracker - Now part of UnifiedAchievements */}
          <UnifiedAchievements />
        </TabsContent>

        {/* AI Insights Tab - AI-powered Analysis */}
        <TabsContent value="ai-insights" className="mt-6 space-y-6">
          {/* AI Wardrobe Planner */}
          <AIWardrobePlanner />

          {/* Smart Recommendations */}
          <SmartRecommendations />
        </TabsContent>

        {/* Activity Tab - User Activity and Engagement */}
        <TabsContent value="activity" className="mt-6 space-y-6">
          {/* Unified Achievements and Activity */}
          <UnifiedAchievements />
        </TabsContent>

        {/* Recommendations Tab - Personalized Suggestions */}
        <TabsContent value="recommendations" className="mt-6 space-y-6">
          {/* Smart Recommendations */}
          <SmartRecommendations />

          {/* Personalized Feed */}
          <PersonalizedFeed />

          {/* Recently Viewed */}
          <RecentlyViewed />
        </TabsContent>

        {/* Quick Actions Tab - Fast Access */}
        <TabsContent value="quick-actions" className="mt-6 space-y-6">
          <QuickActionsPanel />
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Button variant="outline" className="h-auto flex-col py-4" asChild>
                  <Link href="/search">
                    <ShoppingBag className="mb-2 h-5 w-5" />
                    <span className="text-xs">Каталог</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto flex-col py-4" asChild>
<<<<<<< HEAD
                  <Link href="/u?tab=wardrobe">
=======
                  <Link href="/client/me?tab=wardrobe">
>>>>>>> recover/cabinet-wip-from-stash
                    <Heart className="mb-2 h-5 w-5" />
                    <span className="text-xs">Избранное</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto flex-col py-4" asChild>
                  <Link href="/orders">
                    <Clock className="mb-2 h-5 w-5" />
                    <span className="text-xs">Заказы</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto flex-col py-4" asChild>
<<<<<<< HEAD
                  <Link href="/u?tab=payments">
=======
                  <Link href="/client/me?tab=payments">
>>>>>>> recover/cabinet-wip-from-stash
                    <Gift className="mb-2 h-5 w-5" />
                    <span className="text-xs">Бонусы</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            Персональные инсайты
          </CardTitle>
          <CardDescription>Мгновенные советы на основе текущих действий</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  'rounded-lg border p-4',
                  insight.type === 'recommendation' && 'border-accent/30 bg-accent/10',
                  insight.type === 'warning' &&
                    'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20',
                  insight.type === 'opportunity' &&
                    'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20',
                  insight.type === 'achievement' &&
<<<<<<< HEAD
                    'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20'
=======
                    'bg-accent-primary/10 dark:bg-bg-surface2/80 border-accent-primary/25 dark:border-border-default'
>>>>>>> recover/cabinet-wip-from-stash
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      {insight.type === 'recommendation' && <Zap className="h-4 w-4 text-accent" />}
                      {insight.type === 'warning' && <Target className="h-4 w-4 text-yellow-600" />}
                      {insight.type === 'opportunity' && (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      )}
                      {insight.type === 'achievement' && (
<<<<<<< HEAD
                        <Award className="h-4 w-4 text-purple-600" />
=======
                        <Award className="text-accent-primary h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                      <h4 className="text-sm font-semibold">{insight.title}</h4>
                      {insight.priority === 'high' && (
                        <Badge variant="destructive" className="text-xs">
                          Важно
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                    {insight.action && insight.actionLink && (
                      <Button variant="link" size="sm" className="mt-2 h-auto p-0" asChild>
                        <Link href={insight.actionLink}>
                          {insight.action} <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Недавняя активность
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderStats.recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">Заказ #{order.id.split('-')[1]}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.createdAt), 'd MMM yyyy, HH:mm', { locale: ru })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{order.total.toLocaleString('ru-RU')} ₽</p>
                    <Badge variant="outline" className="text-xs">
                      {order.status === 'delivered'
                        ? 'Доставлен'
                        : order.status === 'shipped'
                          ? 'Отправлен'
                          : order.status === 'processing'
                            ? 'Обработка'
                            : 'Ожидание'}
                    </Badge>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="py-4 text-center text-muted-foreground">Пока нет заказов</p>
              )}
            </div>
            {orders.length > 0 && (
              <Button variant="outline" className="mt-4 w-full" asChild>
                <Link href="/orders">Все заказы</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Метрики активности
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Просмотров товаров</span>
                </div>
                <span className="font-semibold">~{Math.floor(Math.random() * 50 + 20)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">В избранном</span>
                </div>
                <span className="font-semibold">{activity.wishlistCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">В корзине</span>
                </div>
                <span className="font-semibold">{activity.cartCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Лукбордов</span>
                </div>
                <span className="font-semibold">{activity.lookboardsCount}</span>
              </div>
              <div className="border-t pt-4">
                <p className="mb-2 text-xs text-muted-foreground">Уровень вовлеченности</p>
                <div className="flex items-center gap-2">
                  <Progress value={activity.engagementLevel} className="flex-1" />
                  <span className="text-sm font-semibold">{activity.engagementLevel}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function generateAIInsights(
  orders: Order[],
  cartItems: number,
  wishlistItems: number,
  lookboardsCount: number
): AIInsight[] {
  const insights: AIInsight[] = [];

  // Cart abandonment insight
  if (cartItems > 0) {
    insights.push({
      type: 'opportunity',
      title: 'У вас есть товары в корзине',
      description: `Завершите покупку ${cartItems} ${cartItems === 1 ? 'товара' : 'товаров'} и получите бонусные баллы!`,
      action: 'Перейти в корзину',
      actionLink: '/checkout',
      priority: 'high',
    });
  }

  // Wishlist insight
  if (wishlistItems > 0 && orders.length === 0) {
    insights.push({
      type: 'recommendation',
      title: 'Начните с избранного',
      description: `У вас ${wishlistItems} ${wishlistItems === 1 ? 'товар' : 'товаров'} в избранном. Сделайте первую покупку!`,
      action: 'Посмотреть избранное',
      actionLink: '/client/me?tab=wardrobe',
      priority: 'medium',
    });
  }

  // Loyalty level insight
  if (orders.length > 0 && orders.length % 5 === 0) {
    insights.push({
      type: 'achievement',
      title: 'Поздравляем!',
      description: `Вы сделали ${orders.length} заказов! Получите специальную скидку на следующий заказ.`,
      action: 'Использовать скидку',
      actionLink: '/search',
      priority: 'high',
    });
  }

  // Lookboard insight
  if (lookboardsCount === 0) {
    insights.push({
      type: 'recommendation',
      title: 'Создайте свой первый лукборд',
      description: 'Сохраняйте любимые образы и делитесь ими с сообществом.',
      action: 'Создать лукборд',
      actionLink: '/client/me?tab=looks',
      priority: 'low',
    });
  }

  // Seasonal recommendation
  insights.push({
    type: 'recommendation',
    title: 'Сезонные рекомендации',
    description: 'AI подобрал для вас новые коллекции, которые идеально подходят вашему стилю.',
    action: 'Посмотреть подборку',
    actionLink: '/search?sort=newest',
    priority: 'medium',
  });

  return insights.slice(0, 5); // Limit to 5 insights
}
