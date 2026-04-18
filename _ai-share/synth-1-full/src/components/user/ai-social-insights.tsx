'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, Heart, Eye, Share2, MessageCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import Link from 'next/link';
import Image from 'next/image';

interface SocialInsight {
  type: 'trending' | 'popular' | 'similar_users' | 'community';
  title: string;
  description: string;
  data: {
    users?: number;
    products?: number;
    engagement?: number;
    trend?: 'up' | 'down' | 'stable';
  };
  action?: string;
  actionLink?: string;
}

export default function AISocialInsights() {
  const { user } = useAuth();
  const { wishlist, lookboards } = useUIState();
  const [insights, setInsights] = useState<SocialInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateInsights = () => {
      // Simulate AI analysis
      const generatedInsights: SocialInsight[] = [
        {
          type: 'trending',
          title: 'Тренд в вашем стиле',
          description: '127 пользователей с похожим стилем купили эту вещь на этой неделе',
          data: {
            users: 127,
            trend: 'up',
          },
          action: 'Посмотреть тренд',
          actionLink: '/search?trending=true',
        },
        {
          type: 'popular',
          title: 'Популярно в сообществе',
          description:
            'Товары из вашего избранного набирают популярность среди других пользователей',
          data: {
            products: wishlist.length,
            engagement: 342,
          },
          action: 'Посмотреть избранное',
          actionLink: '/client/me?tab=wardrobe',
        },
        {
          type: 'similar_users',
          title: 'Пользователи с похожим вкусом',
          description: 'AI нашел 23 пользователя с похожими предпочтениями. Посмотрите их образы!',
          data: {
            users: 23,
          },
          action: 'Найти похожих',
          actionLink: '/community?similar=true',
        },
        {
          type: 'community',
          title: 'Ваши лукборды популярны',
          description: `Ваши ${lookboards.length} лукбордов получили 156 лайков и 23 комментария`,
          data: {
            engagement: 156,
          },
          action: 'Посмотреть лукборды',
          actionLink: '/client/me?tab=looks',
        },
      ];

      setInsights(generatedInsights);
      setLoading(false);
    };

    generateInsights();
  }, [wishlist.length, lookboards.length]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="py-4 text-center">AI анализирует сообщество...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-accent" />
          Социальные инсайты
        </CardTitle>
        <CardDescription>Что делают пользователи с похожим стилем</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="rounded-lg border bg-muted/50 p-4 transition-colors hover:bg-muted"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    {insight.type === 'trending' && (
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                    )}
                    {insight.type === 'popular' && (
                      <Heart className="text-accent-primary h-4 w-4" />
                    )}
                    {insight.type === 'similar_users' && (
                      <Users className="h-4 w-4 text-blue-600" />
                    )}
                    {insight.type === 'community' && (
                      <Share2 className="text-accent-primary h-4 w-4" />
                    )}
                    <h4 className="text-sm font-semibold">{insight.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
                {insight.data.trend && (
                  <Badge variant={insight.data.trend === 'up' ? 'default' : 'secondary'}>
                    {insight.data.trend === 'up' ? '↑' : '↓'}{' '}
                    {insight.data.trend === 'up' ? 'Растет' : 'Падает'}
                  </Badge>
                )}
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                {insight.data.users && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{insight.data.users} пользователей</span>
                  </div>
                )}
                {insight.data.products && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{insight.data.products} товаров</span>
                  </div>
                )}
                {insight.data.engagement && (
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <span>{insight.data.engagement} взаимодействий</span>
                  </div>
                )}
              </div>

              {insight.action && insight.actionLink && (
                <Button variant="link" size="sm" className="mt-3 h-auto p-0 text-xs" asChild>
                  <Link href={insight.actionLink}>{insight.action} →</Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
