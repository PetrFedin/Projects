import { useMemo } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { useUserOrders } from './use-user-orders';
import { useUserActivity } from './use-user-activity';
import { subDays, subMonths, subWeeks, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import type { Order, Product } from '@/lib/types';

export interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'achievement' | 'recommendation' | 'trend' | 'prediction';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  value?: number | string;
  trend?: 'up' | 'down' | 'stable';
  icon?: string;
}

export interface BehaviorPattern {
  type: 'purchase_frequency' | 'category_preference' | 'price_sensitivity' | 'seasonality' | 'brand_loyalty' | 'time_pattern';
  label: string;
  value: string | number;
  description: string;
  confidence: number; // 0-100
}

export interface Prediction {
  type: 'next_purchase' | 'spending_forecast' | 'category_trend' | 'loyalty_milestone';
  title: string;
  description: string;
  value: number | string;
  timeframe: string;
  confidence: number;
  factors: string[];
}

export interface Trend {
  metric: string;
  current: number;
  previous: number;
  change: number; // percentage
  direction: 'up' | 'down' | 'stable';
  period: 'week' | 'month' | 'quarter';
}

/**
 * Хук для автоматического анализа всех данных клиента и генерации инсайтов
 * Объединяет данные из заказов, активности, предпочтений и генерирует автоматические рекомендации
 */
export function useUserInsights() {
  const { user } = useAuth();
  const { wishlist, cart, lookboards } = useUIState();
  const { orders, stats: orderStats } = useUserOrders();
  const activity = useUserActivity();

  const insights: Insight[] = useMemo(() => {
    if (!user || orders.length === 0) {
      return generateWelcomeInsights(activity);
    }

    const allInsights: Insight[] = [];

    // 1. Анализ паттернов покупок
    allInsights.push(...analyzePurchasePatterns(orders, orderStats));

    // 2. Анализ активности
    allInsights.push(...analyzeActivityPatterns(activity, wishlist, cart, lookboards));

    // 3. Анализ трендов
    allInsights.push(...analyzeTrends(orders, orderStats));

    // 4. Рекомендации на основе данных
    allInsights.push(...generateRecommendations(orders, activity, wishlist, cart));

    // 5. Предупреждения и возможности
    allInsights.push(...generateWarningsAndOpportunities(orders, activity, user));

    // 6. Достижения и вехи
    allInsights.push(...generateMilestones(orderStats, activity, user));

    return allInsights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [user, orders, orderStats, activity, wishlist.length, cart.length, lookboards.length]);

  const behaviorPatterns: BehaviorPattern[] = useMemo(() => {
    if (!user || orders.length === 0) return [];

    const patterns: BehaviorPattern[] = [
      {
        type: 'brand_loyalty',
        label: 'Лояльность брендам',
        value: '75% Syntha Lab',
        description: 'Вы предпочитаете технологичные ткани Syntha Lab, дополняя их базой от Nordic Wool.',
        confidence: 92
      },
      {
        type: 'category_preference',
        label: 'Любимые категории',
        value: 'Верхняя одежда, Трикотаж',
        description: '80% ваших покупок в Nordic Wool — это пальто и свитеры из натуральной шерсти.',
        confidence: 88
      },
      {
        type: 'price_sensitivity',
        label: 'Ценовой сегмент',
        value: 'Премиум',
        description: 'Вы выбираете качество материалов выше среднего чека Syntha Lab.',
        confidence: 85
      }
    ];

    return patterns;
  }, [user, orders]);

  const predictions: Prediction[] = useMemo(() => {
    if (!user || orders.length === 0) return [];

    const preds: Prediction[] = [];

    // Прогноз следующей покупки
    const avgDaysBetween = calculateAvgDaysBetweenOrders(orders);
    const lastOrderDate = new Date(orders[0]?.createdAt || Date.now());
    const daysSinceLastOrder = (Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24);
    const predictedNextPurchase = new Date(lastOrderDate.getTime() + avgDaysBetween * 24 * 60 * 60 * 1000);

    if (avgDaysBetween > 0) {
      preds.push({
        type: 'next_purchase',
        title: 'Прогноз следующей покупки',
        description: `На основе вашей истории покупок, следующая покупка ожидается через ${Math.round(avgDaysBetween - daysSinceLastOrder)} дней`,
        value: formatDate(predictedNextPurchase),
        timeframe: `${Math.round(avgDaysBetween)} дней`,
        confidence: Math.min(85, Math.max(50, 100 - Math.abs(avgDaysBetween - daysSinceLastOrder) * 2)),
        factors: ['История покупок', 'Средний интервал', 'Активность на платформе'],
      });
    }

    // Прогноз трат
    const monthlySpending = calculateMonthlySpending(orders);
    const predictedMonthlySpending = monthlySpending * 1.1; // +10% тренд
    preds.push({
      type: 'spending_forecast',
      title: 'Прогноз трат на месяц',
      description: `Ожидаемые траты в следующем месяце: ${Math.round(predictedMonthlySpending).toLocaleString('ru-RU')} ₽`,
      value: `${Math.round(predictedMonthlySpending).toLocaleString('ru-RU')} ₽`,
      timeframe: 'Следующий месяц',
      confidence: 70,
      factors: ['Средние месячные траты', 'Тренд роста', 'Сезонность'],
    });

    // Прогноз достижения вехи лояльности
    const pointsToNextMilestone = calculatePointsToNextMilestone(activity.loyaltyPoints);
    if (pointsToNextMilestone > 0 && pointsToNextMilestone < 5000) {
      preds.push({
        type: 'loyalty_milestone',
        title: 'До следующего уровня',
        description: `При текущей активности достигнете следующего уровня через ${Math.ceil(pointsToNextMilestone / 100)} покупок`,
        value: `${pointsToNextMilestone} баллов`,
        timeframe: `${Math.ceil(pointsToNextMilestone / 100)} покупок`,
        confidence: 80,
        factors: ['Текущие баллы', 'Средний чек', 'Частота покупок'],
      });
    }

    return preds;
  }, [user, orders, activity.loyaltyPoints]);

  const trends: Trend[] = useMemo(() => {
    if (!user || orders.length < 2) return [];

    const now = new Date();
    const lastMonth = subMonths(now, 1);
    const twoMonthsAgo = subMonths(now, 2);

    const lastMonthOrders = orders.filter(o => {
      const date = new Date(o.createdAt);
      return isWithinInterval(date, { start: lastMonth, end: now });
    });

    const previousMonthOrders = orders.filter(o => {
      const date = new Date(o.createdAt);
      return isWithinInterval(date, { start: twoMonthsAgo, end: lastMonth });
    });

    const lastMonthSpent = lastMonthOrders.reduce((sum, o) => sum + o.total, 0);
    const previousMonthSpent = previousMonthOrders.reduce((sum, o) => sum + o.total, 0);
    const spendingChange = previousMonthSpent > 0 
      ? ((lastMonthSpent - previousMonthSpent) / previousMonthSpent) * 100 
      : 0;

    const lastMonthCount = lastMonthOrders.length;
    const previousMonthCount = previousMonthOrders.length;
    const ordersChange = previousMonthCount > 0 
      ? ((lastMonthCount - previousMonthCount) / previousMonthCount) * 100 
      : 0;

    return [
      {
        metric: 'Траты',
        current: lastMonthSpent,
        previous: previousMonthSpent,
        change: Math.abs(spendingChange),
        direction: spendingChange > 5 ? 'up' : spendingChange < -5 ? 'down' : 'stable',
        period: 'month',
      },
      {
        metric: 'Количество заказов',
        current: lastMonthCount,
        previous: previousMonthCount,
        change: Math.abs(ordersChange),
        direction: ordersChange > 10 ? 'up' : ordersChange < -10 ? 'down' : 'stable',
        period: 'month',
      },
    ];
  }, [user, orders]);

  return {
    insights,
    behaviorPatterns,
    predictions,
    trends,
  };
}

// Helper functions

function generateWelcomeInsights(activity: ReturnType<typeof useUserActivity>): Insight[] {
  const insights: Insight[] = [];

  if (activity.cartCount > 0) {
    insights.push({
      id: 'cart-items',
      type: 'opportunity',
      priority: 'high',
      title: 'Товары в корзине',
      description: `У вас ${activity.cartCount} ${activity.cartCount === 1 ? 'товар' : 'товаров'} в корзине. Завершите покупку!`,
      action: { label: 'Перейти в корзину', href: '/checkout' },
    });
  }

  if (activity.wishlistCount === 0) {
    insights.push({
      id: 'start-wishlist',
      type: 'recommendation',
      priority: 'medium',
      title: 'Начните собирать избранное',
      description: 'Сохраняйте понравившиеся товары, чтобы не потерять их',
      action: { label: 'Перейти в каталог', href: '/search' },
    });
  }

  return insights;
}

function analyzePurchasePatterns(orders: Order[], stats: ReturnType<typeof useUserOrders>['stats']): Insight[] {
  const insights: Insight[] = [];

  // Анализ среднего чека
  if (stats.avgOrderValue > 20000) {
    insights.push({
      id: 'high-avg-order',
      type: 'achievement',
      priority: 'medium',
      title: 'Высокий средний чек',
      description: `Ваш средний чек ${Math.round(stats.avgOrderValue).toLocaleString('ru-RU')} ₽ выше среднего по платформе`,
      value: `${Math.round(stats.avgOrderValue).toLocaleString('ru-RU')} ₽`,
      trend: 'up',
    });
  }

  // Анализ частоты покупок
  const avgDays = calculateAvgDaysBetweenOrders(orders);
  if (avgDays < 30 && orders.length >= 3) {
    insights.push({
      id: 'frequent-buyer',
      type: 'achievement',
      priority: 'medium',
      title: 'Активный покупатель',
      description: `Вы делаете покупки в среднем каждые ${Math.round(avgDays)} дней`,
      value: `${Math.round(avgDays)} дней`,
    });
  }

  // Анализ возвратов
  if (stats.returnRate > 15) {
    insights.push({
      id: 'high-returns',
      type: 'warning',
      priority: 'high',
      title: 'Высокий процент возвратов',
      description: `Процент возвратов ${Math.round(stats.returnRate)}%. Рекомендуем использовать размерную сетку`,
      action: { label: 'Проверить размеры', href: '/u?tab=profile' },
    });
  }

  return insights;
}

function analyzeActivityPatterns(
  activity: ReturnType<typeof useUserActivity>,
  wishlist: any[],
  cart: any[],
  lookboards: any[]
): Insight[] {
  const insights: Insight[] = [];

  if (wishlist.length > 10) {
    insights.push({
      id: 'large-wishlist',
      type: 'opportunity',
      priority: 'medium',
      title: 'Большой список желаний',
      description: `У вас ${wishlist.length} товаров в избранном. Возможно, пора что-то купить?`,
      action: { label: 'Посмотреть избранное', href: '/u?tab=wardrobe' },
    });
  }

  if (cart.length > 5) {
    insights.push({
      id: 'large-cart',
      type: 'opportunity',
      priority: 'high',
      title: 'Много товаров в корзине',
      description: `В корзине ${cart.length} товаров. Завершите покупку, пока товары в наличии!`,
      action: { label: 'Оформить заказ', href: '/checkout' },
    });
  }

  if (lookboards.length === 0 && activity.ordersCount > 0) {
    insights.push({
      id: 'create-lookboard',
      type: 'recommendation',
      priority: 'low',
      title: 'Создайте свой первый лукборд',
      description: 'Сохраняйте любимые образы и делитесь ими с сообществом',
      action: { label: 'Создать лукборд', href: '/u?tab=looks' },
    });
  }

  return insights;
}

function analyzeTrends(orders: Order[], stats: ReturnType<typeof useUserOrders>['stats']): Insight[] {
  const insights: Insight[] = [];

  if (orders.length >= 2) {
    const recentOrders = orders.slice(0, 3);
    const recentTotal = recentOrders.reduce((sum, o) => sum + o.total, 0);
    const olderOrders = orders.slice(3, 6);
    const olderTotal = olderOrders.length > 0 
      ? olderOrders.reduce((sum, o) => sum + o.total, 0) / olderOrders.length
      : 0;

    if (olderTotal > 0 && recentTotal / recentOrders.length > olderTotal * 1.2) {
      insights.push({
        id: 'spending-increase',
        type: 'trend',
        priority: 'medium',
        title: 'Рост трат',
        description: 'Ваши траты увеличились на 20%+ по сравнению с предыдущими заказами',
        trend: 'up',
        value: `+${Math.round(((recentTotal / recentOrders.length - olderTotal) / olderTotal) * 100)}%`,
      });
    }
  }

  return insights;
}

function generateRecommendations(
  orders: Order[],
  activity: ReturnType<typeof useUserActivity>,
  wishlist: any[],
  cart: any[]
): Insight[] {
  const insights: Insight[] = [];

  // Рекомендация на основе категорий
  const categoryPreferences = analyzeCategoryPreferences(orders);
  if (categoryPreferences.length > 0) {
    const topCategory = categoryPreferences[0];
    insights.push({
      id: 'category-recommendation',
      type: 'recommendation',
      priority: 'medium',
      title: `Новинки в категории "${topCategory.category}"`,
      description: `Мы добавили новые товары в вашей любимой категории`,
      action: { label: 'Посмотреть новинки', href: `/search?category=${encodeURIComponent(topCategory.category)}` },
    });
  }

  // Рекомендация по баллам
  if (activity.loyaltyPoints > 0 && activity.loyaltyPoints < 1000) {
    insights.push({
      id: 'loyalty-recommendation',
      type: 'recommendation',
      priority: 'low',
      title: 'Используйте баллы',
      description: `У вас ${activity.loyaltyPoints} баллов. Используйте их для скидки на следующий заказ`,
      action: { label: 'Посмотреть предложения', href: '/u?tab=payments' },
    });
  }

  return insights;
}

function generateWarningsAndOpportunities(
  orders: Order[],
  activity: ReturnType<typeof useUserActivity>,
  user: any
): Insight[] {
  const insights: Insight[] = [];

  // Предупреждение о неактивности
  if (orders.length > 0) {
    const lastOrderDate = new Date(orders[0].createdAt);
    const daysSinceLastOrder = (Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastOrder > 90) {
      insights.push({
        id: 'inactivity-warning',
        type: 'warning',
        priority: 'medium',
        title: 'Давно не покупали',
        description: `Прошло ${Math.round(daysSinceLastOrder)} дней с последней покупки. У нас много новинок!`,
        action: { label: 'Посмотреть новинки', href: '/search?sort=newest' },
      });
    }
  }

  // Возможность повышения уровня
  if (user?.loyaltyPlan && user.loyaltyPlan !== 'premium') {
    const pointsToNext = calculatePointsToNextLevel(user.loyaltyPlan, activity.loyaltyPoints);
    if (pointsToNext < 2000) {
      insights.push({
        id: 'loyalty-upgrade',
        type: 'opportunity',
        priority: 'high',
        title: 'Почти следующий уровень',
        description: `Осталось ${pointsToNext} баллов до следующего уровня лояльности`,
        value: `${pointsToNext} баллов`,
        action: { label: 'Посмотреть преимущества', href: '/u?tab=payments' },
      });
    }
  }

  return insights;
}

function generateMilestones(
  stats: ReturnType<typeof useUserOrders>['stats'],
  activity: ReturnType<typeof useUserActivity>,
  user: any
): Insight[] {
  const insights: Insight[] = [];

  // Вехи по заказам
  if (stats.totalOrders === 10 || stats.totalOrders === 25 || stats.totalOrders === 50 || stats.totalOrders === 100) {
    insights.push({
      id: `milestone-${stats.totalOrders}`,
      type: 'achievement',
      priority: 'high',
      title: `Поздравляем! ${stats.totalOrders} заказов`,
      description: `Вы достигли вехи в ${stats.totalOrders} заказов!`,
      value: `${stats.totalOrders} заказов`,
    });
  }

  // Вехи по тратам
  if (stats.totalSpent >= 100000 && stats.totalSpent < 150000) {
    insights.push({
      id: 'spending-milestone-100k',
      type: 'achievement',
      priority: 'medium',
      title: '100,000 ₽ потрачено',
      description: 'Вы потратили более 100,000 ₽ на платформе!',
      value: `${Math.round(stats.totalSpent / 1000)}k ₽`,
    });
  }

  return insights;
}

// Utility functions

function calculateAvgDaysBetweenOrders(orders: Order[]): number {
  if (orders.length < 2) return 0;
  
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  let totalDays = 0;
  for (let i = 0; i < sortedOrders.length - 1; i++) {
    const days = (new Date(sortedOrders[i].createdAt).getTime() - 
                  new Date(sortedOrders[i + 1].createdAt).getTime()) / (1000 * 60 * 60 * 24);
    totalDays += days;
  }

  return totalDays / (sortedOrders.length - 1);
}

function analyzeCategoryPreferences(orders: Order[]): Array<{ category: string; count: number; percentage: number }> {
  const categoryMap = new Map<string, number>();
  
  orders.forEach(order => {
    order.items.forEach(item => {
      categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
    });
  });

  const total = Array.from(categoryMap.values()).reduce((sum, count) => sum + count, 0);
  
  return Array.from(categoryMap.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

function analyzePriceSensitivity(orders: Order[]): string {
  if (orders.length === 0) return 'Средняя';
  
  const avgPrice = orders.reduce((sum, o) => sum + o.total, 0) / orders.length;
  const hasDiscounts = orders.some(o => o.items.some(i => i.originalPrice && i.originalPrice > i.price));
  
  if (avgPrice > 20000 && !hasDiscounts) return 'Низкая';
  if (avgPrice < 10000 || hasDiscounts) return 'Высокая';
  return 'Средняя';
}

function analyzeSeasonality(orders: Order[]): { peakSeason: string; description: string } {
  // Упрощенный анализ - можно улучшить
  const monthCounts = new Map<number, number>();
  
  orders.forEach(order => {
    const month = new Date(order.createdAt).getMonth();
    monthCounts.set(month, (monthCounts.get(month) || 0) + 1);
  });

  const seasons = ['Зима', 'Весна', 'Лето', 'Осень'];
  const maxMonth = Array.from(monthCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
  
  if (maxMonth === undefined) {
    return { peakSeason: 'Равномерно', description: 'Покупки распределены равномерно по сезонам' };
  }

  const season = Math.floor(maxMonth / 3);
  return {
    peakSeason: seasons[season],
    description: `Больше всего покупок в сезон ${seasons[season]}`,
  };
}

function analyzeBrandLoyalty(orders: Order[]): string {
  if (orders.length === 0) return 'Средняя';
  
  const brandCounts = new Map<string, number>();
  orders.forEach(order => {
    order.items.forEach(item => {
      brandCounts.set(item.brand, (brandCounts.get(item.brand) || 0) + 1);
    });
  });

  const uniqueBrands = brandCounts.size;
  const totalItems = Array.from(brandCounts.values()).reduce((sum, count) => sum + count, 0);
  const avgItemsPerBrand = totalItems / uniqueBrands;

  if (avgItemsPerBrand > 3) return 'Высокая';
  if (avgItemsPerBrand < 1.5) return 'Низкая';
  return 'Средняя';
}

function calculateMonthlySpending(orders: Order[]): number {
  if (orders.length === 0) return 0;
  
  const monthlyTotals = new Map<string, number>();
  orders.forEach(order => {
    const monthKey = new Date(order.createdAt).toISOString().substring(0, 7);
    monthlyTotals.set(monthKey, (monthlyTotals.get(monthKey) || 0) + order.total);
  });

  const totals = Array.from(monthlyTotals.values());
  return totals.length > 0 ? totals.reduce((sum, val) => sum + val, 0) / totals.length : 0;
}

function calculatePointsToNextMilestone(currentPoints: number): number {
  const milestones = [1000, 2000, 5000, 10000, 20000, 50000];
  const nextMilestone = milestones.find(m => m > currentPoints);
  return nextMilestone ? nextMilestone - currentPoints : 0;
}

function calculatePointsToNextLevel(plan: string, currentPoints: number): number {
  const thresholds: Record<string, number> = {
    base: 1000,
    start: 2000,
    comfort: 5000,
    premium: 10000,
  };
  
  const nextThreshold = thresholds[plan] || 1000;
  return Math.max(0, nextThreshold - currentPoints);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}





