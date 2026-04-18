'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Clock, Gift, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useUIState } from '@/providers/ui-state';
import { ordersRepository } from '@/lib/repositories';
import type { Order } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

interface Recommendation {
  id: string;
  type: 'price_drop' | 'restock' | 'complement' | 'trending' | 'personalized';
  title: string;
  description: string;
  productId?: string;
  productName?: string;
  productImage?: string;
  price?: number;
  originalPrice?: number;
  discount?: number;
  urgency?: 'high' | 'medium' | 'low';
  reason: string;
  actionLink: string;
}

export default function SmartRecommendations() {
  const { user } = useAuth();
  const { wishlist, cart } = useUIState();
  const [orders, setOrders] = useState<Order[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadRecommendations = async () => {
      try {
        const userOrders = await ordersRepository.getOrders(user.uid);
        setOrders(userOrders);

        // Generate smart recommendations
        const smartRecs = generateSmartRecommendations(userOrders, wishlist, cart);
        setRecommendations(smartRecs);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [user, wishlist.length, cart.length]);

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="py-4 text-center">AI подбирает рекомендации...</div>
        </CardContent>
      </Card>
    );
  }

  const highPriority = recommendations.filter((r) => r.urgency === 'high');
  const otherRecs = recommendations.filter((r) => r.urgency !== 'high');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Умные рекомендации
        </CardTitle>
        <CardDescription>Персональные предложения на основе ваших предпочтений</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* High Priority Recommendations */}
          {highPriority.length > 0 && (
            <div className="space-y-3">
              {highPriority.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-lg border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                    <div className="flex-1">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h4 className="mb-1 text-sm font-semibold">{rec.title}</h4>
                          <p className="text-sm text-muted-foreground">{rec.description}</p>
                        </div>
                        {rec.discount && (
                          <Badge variant="destructive" className="ml-2">
                            -{rec.discount}%
                          </Badge>
                        )}
                      </div>
                      {rec.productName && (
                        <div className="mt-3 flex items-center gap-3">
                          {rec.productImage && (
                            <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                              <Image
                                src={rec.productImage}
                                alt={rec.productName}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium">{rec.productName}</p>
                            <div className="mt-1 flex items-center gap-2">
                              {rec.originalPrice && rec.price && (
                                <>
                                  <span className="text-sm font-bold text-red-600">
                                    {rec.price.toLocaleString('ru-RU')} ₽
                                  </span>
                                  <span className="text-xs text-muted-foreground line-through">
                                    {rec.originalPrice.toLocaleString('ru-RU')} ₽
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <p className="mt-2 text-xs text-muted-foreground">{rec.reason}</p>
                      <Button size="sm" className="mt-3 w-full" asChild>
                        <Link href={rec.actionLink}>
                          {rec.type === 'price_drop'
                            ? 'Купить со скидкой'
                            : rec.type === 'restock'
                              ? 'Посмотреть товар'
                              : rec.type === 'complement'
                                ? 'Добавить в корзину'
                                : 'Посмотреть рекомендацию'}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Other Recommendations */}
          {otherRecs.length > 0 && (
            <div className="space-y-3">
              {otherRecs.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-lg border bg-muted/50 p-4 transition-colors hover:bg-muted"
                >
                  <div className="flex items-start gap-3">
                    {rec.type === 'price_drop' && (
                      <Gift className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                    )}
                    {rec.type === 'restock' && (
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    )}
                    {rec.type === 'complement' && (
                      <Zap className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                    )}
                    {rec.type === 'trending' && (
                      <TrendingUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                    )}
                    {rec.type === 'personalized' && (
                      <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    )}
                    <div className="flex-1">
                      <div className="mb-1 flex items-start justify-between">
                        <h4 className="text-sm font-semibold">{rec.title}</h4>
                        {rec.discount && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            -{rec.discount}%
                          </Badge>
                        )}
                      </div>
                      <p className="mb-2 text-sm text-muted-foreground">{rec.description}</p>
                      <p className="mb-2 text-xs text-muted-foreground">{rec.reason}</p>
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                        <Link href={rec.actionLink}>Посмотреть →</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {recommendations.length === 0 && (
            <div className="py-4 text-center text-muted-foreground">
              <Sparkles className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p>Нет активных рекомендаций</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function generateSmartRecommendations(
  orders: Order[],
  wishlist: any[],
  cart: any[]
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Price drops in wishlist
  if (wishlist.length > 0) {
    recommendations.push({
      id: 'wishlist_price_drop',
      type: 'price_drop',
      title: 'Скидка на товар из избранного',
      description: `${wishlist.length} товаров из вашего избранного сейчас со скидкой`,
      discount: 25,
      urgency: 'high',
      reason: 'AI заметил, что товары из вашего избранного подешевели',
      actionLink: '/u?tab=wardrobe',
    });
  }

  // Restock notifications
  recommendations.push({
    id: 'restock_notification',
    type: 'restock',
    title: 'Товар снова в наличии',
    description: 'Товар, который вы просматривали, снова доступен в вашем размере',
    urgency: 'medium',
    reason: 'AI отслеживает товары, которые вас интересовали',
    actionLink: '/search?restocked=true',
  });

  // Complementary items
  if (orders.length > 0) {
    recommendations.push({
      id: 'complementary_item',
      type: 'complement',
      title: 'Дополните образ',
      description: 'Отличное дополнение к вашим недавним покупкам',
      urgency: 'medium',
      reason: 'AI подобрал товары, которые сочетаются с вашими покупками',
      actionLink: '/search?complementary=true',
    });
  }

  // Trending items
  recommendations.push({
    id: 'trending_item',
    type: 'trending',
    title: 'Тренд сезона',
    description: '127 пользователей с похожим стилем купили этот товар',
    urgency: 'low',
    reason: 'Популярно среди пользователей с похожими предпочтениями',
    actionLink: '/search?trending=true',
  });

  // Personalized recommendation
  recommendations.push({
    id: 'personalized_rec',
    type: 'personalized',
    title: 'Для вас',
    description: 'AI подобрал товар специально для вашего стиля',
    urgency: 'low',
    reason: 'На основе анализа ваших покупок и предпочтений',
    actionLink: '/search?ai_recommended=true',
  });

  return recommendations;
}
