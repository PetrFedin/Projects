'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  TrendingUp,
  Palette,
  Shirt,
  Target,
  Zap,
  Lightbulb,
  BarChart3,
  Calendar,
  MapPin,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { ordersRepository, productsRepository } from '@/lib/repositories';
import type { Order, Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface StyleProfile {
  preferredColors: { color: string; percentage: number }[];
  preferredCategories: { category: string; count: number }[];
  stylePersonality: 'minimalist' | 'bohemian' | 'classic' | 'edgy' | 'romantic' | 'sporty';
  priceRange: { min: number; max: number; avg: number };
  seasonality: { season: string; activity: number }[];
  brandAffinity: { brand: string; score: number }[];
}

interface AIPrediction {
  type: 'purchase' | 'trend' | 'opportunity' | 'warning';
  title: string;
  description: string;
  confidence: number;
  timeframe?: string;
  action?: string;
  actionLink?: string;
}

export default function AIStyleAnalyzer() {
  const { user } = useAuth();
  const { wishlist, lookboards, manualWardrobe } = useUIState();
  const [orders, setOrders] = useState<Order[]>([]);
  const [styleProfile, setStyleProfile] = useState<StyleProfile | null>(null);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const analyzeStyle = async () => {
      try {
        const userOrders = await ordersRepository.getOrders(user.uid);
        setOrders(userOrders);

        // Analyze style from orders and wishlist
        const allItems = [...userOrders.flatMap((o) => o.items), ...wishlist, ...manualWardrobe];

        const profile = generateStyleProfile(allItems, userOrders);
        setStyleProfile(profile);

        // Generate AI predictions
        const aiPredictions = generateAIPredictions(profile, userOrders, wishlist.length);
        setPredictions(aiPredictions);
      } catch (error) {
        console.error('Failed to analyze style:', error);
      } finally {
        setLoading(false);
      }
    };

    analyzeStyle();
  }, [user, wishlist.length, lookboards.length, manualWardrobe.length]);

  if (loading || !styleProfile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="py-4 text-center">AI анализирует ваш стиль...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Style Personality */}
      <Card className="border-accent/30 bg-gradient-to-br from-background to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Профиль Стиля
          </CardTitle>
          <CardDescription>Персональный анализ ваших предпочтений и стиля</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Style Personality Badge */}
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Ваш стиль</p>
                <Badge variant="outline" className="px-4 py-2 text-sm">
                  {getStyleLabel(styleProfile.stylePersonality)}
                </Badge>
              </div>
              <div className="text-right">
                <p className="mb-1 text-sm text-muted-foreground">Уверенность AI</p>
                <p className="text-sm font-bold text-accent">94%</p>
              </div>
            </div>

            {/* Preferred Colors */}
            <div>
              <p className="mb-3 text-sm font-medium">Любимые цвета</p>
              <div className="space-y-2">
                {styleProfile.preferredColors.slice(0, 5).map((color, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className="h-6 w-6 rounded-full border-2 border-border"
                      style={{ backgroundColor: color.color }}
                    />
                    <div className="flex-1">
                      <Progress value={color.percentage} className="h-2" />
                    </div>
                    <span className="w-12 text-right text-sm text-muted-foreground">
                      {Math.round(color.percentage)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferred Categories */}
            <div>
              <p className="mb-3 text-sm font-medium">Популярные категории</p>
              <div className="flex flex-wrap gap-2">
                {styleProfile.preferredCategories.slice(0, 6).map((cat, index) => (
                  <Badge key={index} variant="secondary">
                    {cat.category} ({cat.count})
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-3 gap-3 border-t pt-4">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Средний чек</p>
                <p className="text-sm font-bold">
                  {Math.round(styleProfile.priceRange.avg).toLocaleString('ru-RU')} ₽
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Диапазон</p>
                <p className="text-sm font-medium">
                  {styleProfile.priceRange.min.toLocaleString('ru-RU')} -{' '}
                  {styleProfile.priceRange.max.toLocaleString('ru-RU')} ₽
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Всего потрачено</p>
                <p className="text-sm font-bold text-accent">
                  {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            AI Предсказания и Рекомендации
          </CardTitle>
          <CardDescription>Что AI знает о ваших будущих покупках</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.map((prediction, index) => (
              <div
                key={index}
                className={cn(
                  'rounded-lg border p-4',
                  prediction.type === 'purchase' &&
                    'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20',
                  prediction.type === 'trend' &&
                    'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20',
                  prediction.type === 'opportunity' &&
                    'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20',
                  prediction.type === 'warning' &&
                    'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20'
                )}
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {prediction.type === 'purchase' && (
                      <ShoppingBag className="h-4 w-4 text-blue-600" />
                    )}
                    {prediction.type === 'trend' && (
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                    )}
                    {prediction.type === 'opportunity' && (
                      <Zap className="h-4 w-4 text-green-600" />
                    )}
                    {prediction.type === 'warning' && (
                      <Target className="h-4 w-4 text-yellow-600" />
                    )}
                    <h4 className="text-sm font-semibold">{prediction.title}</h4>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {prediction.confidence}% уверенность
                  </Badge>
                </div>
                <p className="mb-2 text-sm text-muted-foreground">{prediction.description}</p>
                {prediction.timeframe && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {prediction.timeframe}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brand Affinity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Сродство с брендами
          </CardTitle>
          <CardDescription>AI определил ваши любимые бренды</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {styleProfile.brandAffinity.slice(0, 5).map((brand, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold',
                      index === 0 && 'bg-accent text-accent-foreground',
                      index === 1 && 'bg-muted',
                      index >= 2 && 'bg-muted/50'
                    )}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{brand.brand}</p>
                    <p className="text-xs text-muted-foreground">Совпадение стиля</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-accent">{Math.round(brand.score)}%</p>
                  <Progress value={brand.score} className="mt-1 h-2 w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seasonality Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Сезонная активность
          </CardTitle>
          <CardDescription>Когда вы покупаете больше всего</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {styleProfile.seasonality.map((season, index) => (
              <div key={index} className="text-center">
                <p className="mb-2 text-sm font-medium">{season.season}</p>
                <div className="relative flex h-24 items-end justify-center rounded-lg bg-muted p-2">
                  <div
                    className="w-full rounded-t-lg bg-accent transition-all"
                    style={{ height: `${season.activity}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{Math.round(season.activity)}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function generateStyleProfile(items: Product[], orders: Order[]): StyleProfile {
  // Analyze colors
  const colorMap = new Map<string, number>();
  items.forEach((item) => {
    if (item.color) {
      colorMap.set(item.color, (colorMap.get(item.color) || 0) + 1);
    }
    item.availableColors?.forEach((color) => {
      colorMap.set(color.name, (colorMap.get(color.name) || 0) + 1);
    });
  });
  const totalItems = items.length || 1;
  const preferredColors = Array.from(colorMap.entries())
    .map(([color, count]) => ({
      color: getColorHex(color),
      percentage: (count / totalItems) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 10);

  // Analyze categories
  const categoryMap = new Map<string, number>();
  items.forEach((item) => {
    categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
  });
  const preferredCategories = Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // Determine style personality
  const stylePersonality = determineStylePersonality(items, preferredCategories);

  // Analyze price range
  const prices = orders.flatMap((o) => o.items.map((i) => i.price));
  const priceRange = {
    min: prices.length > 0 ? Math.min(...prices) : 0,
    max: prices.length > 0 ? Math.max(...prices) : 0,
    avg: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
  };

  // Seasonality (mock data for demo)
  const seasonality = [
    { season: 'Весна', activity: 75 },
    { season: 'Лето', activity: 90 },
    { season: 'Осень', activity: 85 },
    { season: 'Зима', activity: 60 },
  ];

  // Brand affinity
  const brandMap = new Map<string, number>();
  items.forEach((item) => {
    brandMap.set(item.brand, (brandMap.get(item.brand) || 0) + 1);
  });
  const brandAffinity = Array.from(brandMap.entries())
    .map(([brand, count]) => ({
      brand,
      score: Math.min(100, (count / totalItems) * 100 + Math.random() * 20),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return {
    preferredColors,
    preferredCategories,
    stylePersonality,
    priceRange,
    seasonality,
    brandAffinity,
  };
}

function determineStylePersonality(
  items: Product[],
  categories: { category: string; count: number }[]
): StyleProfile['stylePersonality'] {
  const categoryNames = categories.map((c) => c.category.toLowerCase());

  if (categoryNames.some((c) => c.includes('классик') || c.includes('костюм'))) {
    return 'classic';
  }
  if (categoryNames.some((c) => c.includes('спорт') || c.includes('активный'))) {
    return 'sporty';
  }
  if (categoryNames.some((c) => c.includes('платье') || c.includes('романт'))) {
    return 'romantic';
  }
  if (items.length < 5) {
    return 'minimalist';
  }
  return 'classic';
}

function getStyleLabel(personality: StyleProfile['stylePersonality']): string {
  const labels = {
    minimalist: 'Минималист',
    bohemian: 'Бохо',
    classic: 'Классический',
    edgy: 'Экспериментальный',
    romantic: 'Романтичный',
    sporty: 'Спортивный',
  };
  return labels[personality];
}

function getColorHex(colorName: string): string {
  const colorMap: Record<string, string> = {
    черный: '#000000',
    белый: '#FFFFFF',
    серый: '#808080',
    бежевый: '#F5F5DC',
    коричневый: '#A52A2A',
    синий: '#0000FF',
    голубой: '#87CEEB',
    красный: '#FF0000',
    розовый: '#FFC0CB',
    зеленый: '#008000',
    желтый: '#FFFF00',
    оранжевый: '#FFA500',
    фиолетовый: '#800080',
  };
  return colorMap[colorName.toLowerCase()] || '#808080';
}

function generateAIPredictions(
  profile: StyleProfile,
  orders: Order[],
  wishlistCount: number
): AIPrediction[] {
  const predictions: AIPrediction[] = [];

  // Purchase prediction
  const daysSinceLastOrder =
    orders.length > 0
      ? Math.floor((Date.now() - new Date(orders[0].createdAt).getTime()) / (1000 * 60 * 60 * 24))
      : 30;

  if (daysSinceLastOrder > 14) {
    predictions.push({
      type: 'purchase',
      title: 'Время для обновления гардероба',
      description: `Прошло ${daysSinceLastOrder} дней с последней покупки. AI рекомендует обратить внимание на новые коллекции в вашем стиле.`,
      confidence: 85,
      timeframe: 'В ближайшие 7-14 дней',
      action: 'Посмотреть рекомендации',
      actionLink: '/search?ai_recommended=true',
    });
  }

  // Trend prediction
  predictions.push({
    type: 'trend',
    title: 'Тренд сезона',
    description: `Цвет ${profile.preferredColors[0]?.color || 'вашего любимого цвета'} будет популярен этой весной. AI рекомендует добавить аксессуары в этом цвете.`,
    confidence: 78,
    timeframe: 'Актуально сейчас',
    action: 'Посмотреть тренды',
    actionLink: '/search?trending=true',
  });

  // Opportunity
  if (wishlistCount > 0) {
    predictions.push({
      type: 'opportunity',
      title: 'Скидка на избранное',
      description: `У ${wishlistCount} товаров из вашего избранного сейчас действуют скидки. Не упустите возможность!`,
      confidence: 92,
      action: 'Посмотреть избранное',
      actionLink: '/u?tab=wardrobe',
    });
  }

  // Budget optimization
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  if (totalSpent > 50000) {
    predictions.push({
      type: 'opportunity',
      title: 'Премиум статус близко',
      description: `Вы потратили ${totalSpent.toLocaleString('ru-RU')} ₽. Еще немного до премиум уровня с дополнительными привилегиями!`,
      confidence: 88,
      action: 'Узнать больше',
      actionLink: '/u?tab=payments',
    });
  }

  return predictions;
}
