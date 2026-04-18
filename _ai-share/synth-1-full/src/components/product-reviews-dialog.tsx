'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Star, Filter, X, Wand2, Loader2, Bot, Upload } from 'lucide-react';
import type { Product, ProductReview } from '@/lib/types';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { ProductImageViewer } from './product-image-viewer';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import type { SummarizeProductReviewsOutput } from '@/lib/ai-client/types';
import { moderateContentClient, summarizeProductReviewsClient } from '@/lib/ai-client/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';

const mockReviews: ProductReview[] = [
  {
    id: 1,
    author: 'Елена П.',
    avatar: 'https://picsum.photos/seed/rev1/40/40',
    rating: 5,
    date: '2 недели назад',
    text: 'Абсолютно обожаю этот свитер! Он такой мягкий и уютный. Качество на высоте, стоит каждого рубля. Очень рекомендую.',
    color: 'Черный',
    images: [
      {
        id: 'rev1-1',
        url: 'https://images.unsplash.com/photo-1552044022-b53f602b7a3d?w=800',
        alt: 'Review image',
      },
    ],
  },
  {
    id: 2,
    author: 'Иван К.',
    avatar: 'https://picsum.photos/seed/rev2/40/40',
    rating: 4,
    date: '3 недели назад',
    text: 'Хороший свитер. Немного колется, но в целом очень теплый и стильный. Цвет соответствует фото. Размер подошел идеально.',
    color: 'Серый',
  },
  {
    id: 3,
    author: 'Мария С.',
    avatar: 'https://picsum.photos/seed/rev3/40/40',
    rating: 5,
    date: '1 месяц назад',
    text: 'Идеальные брюки для офиса. Сидят отлично, ткань не мнется. Буду брать еще в другом цвете!',
    color: 'Черный',
  },
  {
    id: 4,
    author: 'Алексей Г.',
    avatar: 'https://picsum.photos/seed/rev4/40/40',
    rating: 3,
    date: '1 месяц назад',
    text: 'Свитер неплохой, но ожидал большего за такую цену. После стирки немного сел. В целом, носить можно, но не вау.',
    color: 'Темно-синий',
    images: [
      {
        id: 'rev4-1',
        url: 'https://images.unsplash.com/photo-1616852365365-22b7d422b821?w=800',
        alt: 'Review image 2',
      },
      {
        id: 'rev4-2',
        url: 'https://images.unsplash.com/photo-1618338949885-3c4033b4ee3f?w=800',
        alt: 'Review image 3',
      },
    ],
  },
];

interface ProductReviewsDialogProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const reviewSchema = z.object({
  review: z
    .string()
    .min(10, { message: 'Отзыв должен содержать не менее 10 символов.' })
    .max(500, { message: 'Отзыв не должен превышать 500 символов.' }),
});

export function ProductReviewsDialog({ product, isOpen, onOpenChange }: ProductReviewsDialogProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [imageViewerStartIndex, setImageViewerStartIndex] = useState(0);

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<SummarizeProductReviewsOutput | null>(null);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { review: '' },
  });

  const filteredReviews = useMemo(() => {
    if (!activeFilter) return mockReviews;
    return mockReviews.filter((review) => review.color === activeFilter);
  }, [activeFilter]);

  const allReviewImages = useMemo(
    () =>
      mockReviews
        .flatMap((review) => review.images || [])
        .map((img) => ({
          ...img,
          url: img.url,
          alt: img.alt,
          id: img.id,
          hint: 'review',
        })),
    []
  );

  if (!product) {
    return null;
  }

  const onSubmit = async (data: z.infer<typeof reviewSchema>) => {
    setIsSubmitting(true);
    try {
      const mod = await moderateContentClient({ text: data.review, context: 'review' });
      if (!mod.approved && mod.flags?.length) {
        toast({
          variant: 'destructive',
          title: 'Отзыв не прошел модерацию',
          description:
            mod.reason || `Обнаружено: ${mod.flags.join(', ')}. Пожалуйста, измените текст.`,
        });
        setIsSubmitting(false);
        return;
      }
      toast({
        title: 'Отзыв отправлен!',
        description: 'Спасибо за ваш отзыв, он появится после модерации.',
      });
      form.reset();
    } catch {
      toast({
        title: 'Отзыв отправлен!',
        description: 'Спасибо за ваш отзыв, он появится после модерации.',
      });
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary(null);
    try {
      const result = await summarizeProductReviewsClient({
        reviews: mockReviews.map((r) => ({ text: r.text, rating: r.rating })),
      });
      setSummary(result);
    } catch (error) {
      console.error('Ошибка анализа отзывов:', error);
      toast({
        variant: 'destructive',
        title: 'Ошибка анализа',
        description: 'Не удалось проанализировать отзывы. Попробуйте снова.',
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const averageRating = product.rating || 4.5;
  const reviewCount = product.reviewCount || mockReviews.length;

  const handleOpenImageViewer = (reviewImageId: string) => {
    const imageIndex = allReviewImages.findIndex((img) => img.id === reviewImageId);
    if (imageIndex > -1) {
      setImageViewerStartIndex(imageIndex);
      setIsImageViewerOpen(true);
    }
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = mockReviews.filter((r) => r.rating === star).length;
    return { star, count, percentage: (count / mockReviews.length) * 100 };
  });

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="flex h-[90vh] max-w-4xl flex-col">
          <DialogHeader>
            <DialogTitle>Отзывы о товаре: {product.name}</DialogTitle>
            <DialogDescription>
              Рейтинг {averageRating.toFixed(1)} на основе {reviewCount} оценок.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="-mx-6 flex-1">
            <div className="space-y-6 px-6">
              <div className="flex justify-end">
                <Button variant="outline" onClick={handleSummarize} disabled={isSummarizing}>
                  {isSummarizing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Проанализировать отзывы (AI)
                </Button>
              </div>

              {isSummarizing && (
                <Loader2 className="mx-auto my-8 h-8 w-8 animate-spin text-primary" />
              )}
              {summary && (
                <Card className="border-accent/50 bg-accent/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Bot />
                      AI Анализ отзывов
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/90">{summary.summary}</p>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-3 md:grid-cols-3">
                <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-4 md:col-span-1">
                  <p className="text-sm font-bold">{averageRating.toFixed(1)}</p>
                  <div className="mt-1 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">Всего {reviewCount} отзывов</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  {ratingDistribution.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="min-w-[55px] text-sm text-muted-foreground">
                        {star} звезд
                      </span>
                      <Progress value={percentage} className="h-2 w-full" />
                      <span className="w-8 text-right text-sm text-muted-foreground">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h4 className="flex items-center gap-2 text-base font-semibold">
                  <Filter className="h-4 w-4" />
                  Фильтры
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">По цвету:</p>
                  <Button
                    variant={!activeFilter ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter(null)}
                  >
                    Все
                  </Button>
                  {product.availableColors?.map((color) => (
                    <Button
                      key={color.name}
                      variant={activeFilter === color.name ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setActiveFilter(color.name)}
                    >
                      {color.name}
                    </Button>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <p className="text-sm font-medium">По параметрам:</p>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="filter-photo" />
                    <Label htmlFor="filter-photo" className="font-normal">
                      С фото
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="filter-my-size" />
                    <Label htmlFor="filter-my-size" className="font-normal">
                      Мой размер
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="flex gap-3">
                    <Avatar data-ai-hint="person face">
                      <AvatarImage src={review.avatar} alt={review.author} />
                      <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <p className="font-semibold">{review.author}</p>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                        {review.color && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div
                              className="h-3 w-3 rounded-full border"
                              style={{
                                backgroundColor: product.availableColors?.find(
                                  (c) => c.name === review.color
                                )?.hex,
                              }}
                            ></div>
                            {review.color}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                          />
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-foreground/90">{review.text}</p>
                      {review.images && review.images.length > 0 && (
                        <div className="mt-2 flex gap-2">
                          {review.images.map((img) => (
                            <button
                              key={img.id}
                              className="relative h-12 w-12 overflow-hidden rounded-md"
                              onClick={() => handleOpenImageViewer(img.id)}
                            >
                              <Image
                                src={img.url}
                                alt={img.alt}
                                fill
                                className="cursor-pointer object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="w-full pt-6">
                <Separator className="my-6" />
                <h3 className="mb-4 text-sm font-semibold">Оставить свой отзыв</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="review"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea placeholder="Расскажите о своих впечатлениях..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center justify-between">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Отправить отзыв
                      </Button>
                      <Button type="button" variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Прикрепить фото
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <ProductImageViewer
        productName={product.name}
        images={allReviewImages}
        startIndex={imageViewerStartIndex}
        isOpen={isImageViewerOpen}
        onOpenChange={setIsImageViewerOpen}
      />
    </>
  );
}
