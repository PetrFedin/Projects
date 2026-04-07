'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Sparkles, Shirt, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { ordersRepository } from '@/lib/repositories';
import type { Order, Product } from '@/lib/types';
import { format, addDays, isAfter, isBefore } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface WardrobeGap {
  category: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  recommendation: string;
  estimatedPrice?: number;
}

interface EventOutfit {
  event: string;
  date: string;
  status: 'ready' | 'needs_items' | 'missing';
  items: { name: string; status: 'have' | 'need' | 'optional' }[];
  aiRecommendation?: string;
}

export default function AIWardrobePlanner() {
  const { user } = useAuth();
  const { manualWardrobe, wishlist } = useUIState();
  const [orders, setOrders] = useState<Order[]>([]);
  const [gaps, setGaps] = useState<WardrobeGap[]>([]);
  const [events, setEvents] = useState<EventOutfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const analyzeWardrobe = async () => {
      try {
        const userOrders = await ordersRepository.getOrders(user.uid);
        setOrders(userOrders);

        // Analyze wardrobe gaps
        const detectedGaps = analyzeWardrobeGaps(manualWardrobe, userOrders);
        setGaps(detectedGaps);

        // Generate upcoming events
        const upcomingEvents = generateUpcomingEvents(manualWardrobe);
        setEvents(upcomingEvents);
      } catch (error) {
        console.error('Failed to analyze wardrobe:', error);
      } finally {
        setLoading(false);
      }
    };

    analyzeWardrobe();
  }, [user, manualWardrobe.length, wishlist.length]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-4">AI планирует ваш гардероб...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wardrobe Gaps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Пробелы в гардеробе
          </CardTitle>
          <CardDescription>
            AI определил, чего не хватает для идеального гардероба
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gaps.map((gap, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg border",
                  gap.priority === 'high' && "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
                  gap.priority === 'medium' && "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
                  gap.priority === 'low' && "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{gap.category}</h4>
                      <Badge
                        variant={gap.priority === 'high' ? 'destructive' : gap.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {gap.priority === 'high' ? 'Важно' : gap.priority === 'medium' ? 'Средне' : 'Низко'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{gap.reason}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm font-medium mb-1">Рекомендация AI:</p>
                  <p className="text-sm text-muted-foreground">{gap.recommendation}</p>
                  {gap.estimatedPrice && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Примерная стоимость: {gap.estimatedPrice.toLocaleString('ru-RU')} ₽
                    </p>
                  )}
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                  <Link href={`/search?category=${encodeURIComponent(gap.category)}`}>
                    Найти товары
                  </Link>
                </Button>
              </div>
            ))}
            {gaps.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-600" />
                <p>Ваш гардероб сбалансирован! AI не нашел критических пробелов.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Образы для событий
          </CardTitle>
          <CardDescription>
            AI планирует ваши образы на основе календаря
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg border",
                  event.status === 'ready' && "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
                  event.status === 'needs_items' && "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
                  event.status === 'missing' && "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{event.event}</h4>
                      <Badge
                        variant={
                          event.status === 'ready' ? 'default' :
                          event.status === 'needs_items' ? 'secondary' : 'destructive'
                        }
                      >
                        {event.status === 'ready' ? 'Готов' :
                         event.status === 'needs_items' ? 'Нужны дополнения' : 'Требует внимания'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(event.date), 'd MMMM yyyy', { locale: ru })}
                    </p>
                  </div>
                </div>

                {event.aiRecommendation && (
                  <div className="mb-3 p-3 bg-background rounded-lg">
                    <p className="text-xs font-medium mb-1 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-accent" />
                      Рекомендация AI:
                    </p>
                    <p className="text-sm text-muted-foreground">{event.aiRecommendation}</p>
                  </div>
                )}

                <div className="space-y-2">
                  {event.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2 text-sm">
                      {item.status === 'have' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {item.status === 'need' && <AlertCircle className="h-4 w-4 text-red-600" />}
                      {item.status === 'optional' && <Shirt className="h-4 w-4 text-muted-foreground" />}
                      <span className={cn(
                        item.status === 'have' && "text-green-700 dark:text-green-400",
                        item.status === 'need' && "text-red-700 dark:text-red-400",
                        item.status === 'optional' && "text-muted-foreground"
                      )}>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>

                {event.status !== 'ready' && (
                  <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                    <Link href="/search?ai_stylist=true">
                      <Sparkles className="h-3 w-3 mr-2" />
                      Создать образ с AI
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wardrobe Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Статистика гардероба
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-sm font-bold">{manualWardrobe.length}</p>
              <p className="text-xs text-muted-foreground mt-1">В гардеробе</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-sm font-bold">{wishlist.length}</p>
              <p className="text-xs text-muted-foreground mt-1">В избранном</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-sm font-bold">{orders.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Заказов</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted">
              <p className="text-sm font-bold text-accent">
                {Math.round((manualWardrobe.length / Math.max(1, orders.length)) * 100)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Использование</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function analyzeWardrobeGaps(wardrobe: Product[], orders: Order[]): WardrobeGap[] {
  const gaps: WardrobeGap[] = [];
  const categories = new Set(wardrobe.map(item => item.category));
  const allCategories = ['Платья', 'Верх', 'Низ', 'Обувь', 'Аксессуары', 'Верхняя одежда'];

  // Find missing essential categories
  allCategories.forEach(category => {
    if (!categories.has(category)) {
      gaps.push({
        category,
        priority: category === 'Верх' || category === 'Низ' ? 'high' : 'medium',
        reason: `В вашем гардеробе нет товаров категории "${category}"`,
        recommendation: `AI рекомендует добавить базовые вещи категории "${category}" для создания универсальных образов.`,
        estimatedPrice: category === 'Обувь' ? 8000 : category === 'Верхняя одежда' ? 15000 : 5000,
      });
    }
  });

  // Check for basics
  if (wardrobe.length < 5) {
    gaps.push({
      category: 'Базовый гардероб',
      priority: 'high',
      reason: 'В гардеробе недостаточно базовых вещей',
      recommendation: 'AI рекомендует начать с базовых вещей: белая рубашка, черные брюки, классические туфли.',
      estimatedPrice: 20000,
    });
  }

  return gaps.slice(0, 5);
}

function generateUpcomingEvents(wardrobe: Product[]): EventOutfit[] {
  const now = new Date();
  const events: EventOutfit[] = [
    {
      event: 'Деловая встреча',
      date: addDays(now, 7).toISOString(),
      status: wardrobe.length > 2 ? 'ready' : 'needs_items',
      items: [
        { name: 'Классический костюм', status: wardrobe.length > 0 ? 'have' : 'need' },
        { name: 'Рубашка', status: wardrobe.length > 1 ? 'have' : 'need' },
        { name: 'Туфли', status: wardrobe.length > 2 ? 'have' : 'need' },
        { name: 'Сумка', status: 'optional' },
      ],
      aiRecommendation: 'Классический деловой стиль: темный костюм, светлая рубашка, классические туфли.',
    },
    {
      event: 'Романтический ужин',
      date: addDays(now, 14).toISOString(),
      status: wardrobe.length > 1 ? 'needs_items' : 'missing',
      items: [
        { name: 'Платье', status: wardrobe.some(w => w.category.includes('Платье')) ? 'have' : 'need' },
        { name: 'Туфли на каблуке', status: 'optional' },
        { name: 'Клатч', status: 'optional' },
      ],
      aiRecommendation: 'Элегантное платье в романтическом стиле, дополненное аксессуарами.',
    },
    {
      event: 'Выходные на природе',
      date: addDays(now, 21).toISOString(),
      status: 'needs_items',
      items: [
        { name: 'Спортивная одежда', status: wardrobe.some(w => w.category.includes('Спорт')) ? 'have' : 'need' },
        { name: 'Кроссовки', status: 'optional' },
        { name: 'Куртка', status: 'optional' },
      ],
      aiRecommendation: 'Удобная спортивная одежда для активного отдыха.',
    },
  ];

  return events;
}
