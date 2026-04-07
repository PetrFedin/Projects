'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, MessageSquare, Image as ImageIcon, Edit, Trash2, 
  Clock, CheckCircle2, XCircle, Filter, Search
} from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { useUserOrders } from '@/hooks/use-user-orders';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Image from 'next/image';

interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productSlug: string;
  rating: number;
  text: string;
  images?: string[];
  createdAt: Date;
  status: 'published' | 'pending' | 'rejected';
  helpfulCount?: number;
  verifiedPurchase: boolean;
}

export default function MyReviews() {
  const { user } = useAuth();
  const { orders } = useUserOrders();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'pending' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) return;

    // Загружаем отзывы из localStorage (в реальном приложении - из API)
    const stored = localStorage.getItem(`user_reviews_${user.uid}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored).map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));
        setReviews(parsed);
      } catch (e) {
        console.error('Failed to parse reviews:', e);
      }
    } else {
      // Генерируем примерные отзывы на основе заказов
      const mockReviews: Review[] = orders.slice(0, 3).map((order, index) => {
        const item = order.items[0];
        return {
          id: `review-${order.id}-${index}`,
          productId: item.id,
          productName: item.name,
          productImage: item.images?.[0]?.url || '/logo_placeholder.svg',
          productSlug: item.slug || '',
          rating: 4 + (index % 2),
          text: index === 0 
            ? 'Отличное качество, очень доволен покупкой! Материал приятный на ощупь, размер подошел идеально.'
            : index === 1
            ? 'Хороший товар за свою цену. Доставка быстрая, упаковка аккуратная.'
            : 'Все отлично, рекомендую!',
          createdAt: new Date(order.createdAt),
          status: index === 0 ? 'published' : index === 1 ? 'pending' : 'published',
          helpfulCount: Math.floor(Math.random() * 20),
          verifiedPurchase: true,
        };
      });
      setReviews(mockReviews);
      localStorage.setItem(`user_reviews_${user.uid}`, JSON.stringify(mockReviews));
    }
  }, [user, orders]);

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = filter === 'all' || review.status === filter;
    const matchesSearch = !searchQuery || 
      review.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: reviews.length,
    published: reviews.filter(r => r.status === 'published').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    averageRating: reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0,
  };

  const handleDeleteReview = (id: string) => {
    if (!user) return;
    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated);
    localStorage.setItem(`user_reviews_${user.uid}`, JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">Всего отзывов</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-bold">{stats.published}</p>
              <p className="text-xs text-muted-foreground mt-1">Опубликовано</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm font-bold">{stats.pending}</p>
              <p className="text-xs text-muted-foreground mt-1">На модерации</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                <p className="text-sm font-bold">{stats.averageRating.toFixed(1)}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Средняя оценка</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-accent" />
            Мои отзывы
          </CardTitle>
          <CardDescription>
            Управляйте своими отзывами о товарах
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={(v) => setFilter(v as any)}>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <TabsList>
                <TabsTrigger value="all">Все ({stats.total})</TabsTrigger>
                <TabsTrigger value="published">Опубликовано ({stats.published})</TabsTrigger>
                <TabsTrigger value="pending">На модерации ({stats.pending})</TabsTrigger>
                <TabsTrigger value="rejected">Отклонено</TabsTrigger>
              </TabsList>
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Поиск по отзывам..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-md border bg-background text-sm"
                />
              </div>
            </div>

            {filteredReviews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {reviews.length === 0
                    ? 'У вас пока нет отзывов'
                    : 'Ничего не найдено'}
                </p>
                <p className="text-sm mt-2">
                  {reviews.length === 0
                    ? 'Оставляйте отзывы о купленных товарах, чтобы помочь другим покупателям'
                    : 'Попробуйте изменить фильтры'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onDelete={handleDeleteReview}
                  />
                ))}
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewCard({
  review,
  onDelete,
}: {
  review: Review;
  onDelete: (id: string) => void;
}) {
  const statusConfig = {
    published: {
      label: 'Опубликовано',
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    pending: {
      label: 'На модерации',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
    },
    rejected: {
      label: 'Отклонено',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-500/10',
    },
  };

  const config = statusConfig[review.status];
  const StatusIcon = config.icon;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-3">
          {/* Product Image */}
          <Link href={`/products/${review.productSlug}`} className="flex-shrink-0">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
              <Image
                src={review.productImage}
                alt={review.productName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </Link>

          {/* Review Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${review.productSlug}`}
                  className="font-medium hover:text-accent transition-colors block truncate"
                >
                  {review.productName}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          'h-4 w-4',
                          star <= review.rating
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-muted-foreground'
                        )}
                      />
                    ))}
                  </div>
                  {review.verifiedPurchase && (
                    <Badge variant="outline" className="text-xs">
                      ✓ Подтвержденная покупка
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={cn(config.bgColor, config.color)}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {config.label}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{review.text}</p>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mb-3">
                {review.images.slice(0, 3).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-12 h-12 rounded overflow-hidden border"
                  >
                    <Image
                      src={img}
                      alt={`Review image ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
                {review.images.length > 3 && (
                  <div className="w-12 h-12 rounded border flex items-center justify-center bg-muted text-xs">
                    +{review.images.length - 3}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{format(review.createdAt, 'd MMM yyyy', { locale: ru })}</span>
                {review.helpfulCount !== undefined && review.helpfulCount > 0 && (
                  <span>Полезно: {review.helpfulCount}</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(review.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}





