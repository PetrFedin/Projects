'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Sparkles, TrendingUp, Gift, Users, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface FeedItem {
  id: string;
  type: 'new_collection' | 'sale' | 'restock' | 'social' | 'event' | 'recommendation';
  title: string;
  description: string;
  image?: string;
  action?: string;
  actionLink?: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

export default function PersonalizedFeed() {
  const { user } = useAuth();
  const { wishlist } = useUIState();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    if (!user) return;

    // Generate personalized feed
    const items: FeedItem[] = [
      {
        id: '1',
        type: 'sale',
        title: 'Скидка на товары из избранного',
        description: `${wishlist.length} товаров из вашего избранного сейчас со скидкой до 30%`,
        priority: 'high',
        action: 'Посмотреть скидки',
        actionLink: '/u?tab=wardrobe',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'new_collection',
        title: 'Новая коллекция от A.P.C.',
        description: 'Ваш любимый бренд выпустил весеннюю коллекцию',
        priority: 'high',
        action: 'Посмотреть коллекцию',
        actionLink: '/brands/apc',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        type: 'restock',
        title: 'Товар снова в наличии',
        description: 'Платье, которое вы просматривали, снова доступно в размере S',
        priority: 'medium',
        action: 'Посмотреть товар',
        actionLink: '/products/dress-classic',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        type: 'social',
        title: 'Новые лукборды от похожих пользователей',
        description: '23 пользователя с похожим стилем создали новые образы',
        priority: 'medium',
        action: 'Посмотреть образы',
        actionLink: '/community?similar=true',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        type: 'recommendation',
        title: 'AI рекомендует для вас',
        description: 'На основе ваших покупок AI подобрал 5 товаров специально для вас',
        priority: 'low',
        action: 'Посмотреть рекомендации',
        actionLink: '/search?ai_recommended=true',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '6',
        type: 'event',
        title: 'Напоминание о событии',
        description: 'Через 3 дня у вас деловая встреча. Нужен образ?',
        priority: 'high',
        action: 'Создать образ',
        actionLink: '/ai-stylist?event=business',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    setFeedItems(items);
  }, [user, wishlist.length]);

  const getIcon = (type: FeedItem['type']) => {
    switch (type) {
      case 'sale': return <Gift className="h-4 w-4 text-red-600" />;
      case 'new_collection': return <Sparkles className="h-4 w-4 text-purple-600" />;
      case 'restock': return <Bell className="h-4 w-4 text-green-600" />;
      case 'social': return <Users className="h-4 w-4 text-blue-600" />;
      case 'event': return <Calendar className="h-4 w-4 text-orange-600" />;
      case 'recommendation': return <TrendingUp className="h-4 w-4 text-accent" />;
    }
  };

  const getPriorityColor = (priority: FeedItem['priority']) => {
    switch (priority) {
      case 'high': return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20';
      case 'medium': return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20';
      case 'low': return 'border-muted bg-muted/50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Персональная лента
        </CardTitle>
        <CardDescription>
          Все важные обновления в одном месте
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {feedItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border ${getPriorityColor(item.priority)} transition-all hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {format(new Date(item.timestamp), 'd MMM', { locale: ru })}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  {item.action && item.actionLink && (
                    <Button variant="link" size="sm" className="p-0 h-auto text-xs" asChild>
                      <Link href={item.actionLink}>
                        {item.action} <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4" asChild>
          <Link href="/feed">
            Посмотреть всю ленту
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}





