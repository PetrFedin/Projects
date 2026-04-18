'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, Wand2, Loader2, Bot, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Textarea } from './ui/textarea';
import { summarizeProductReviews } from '@/ai/flows/summarize-product-reviews';
import type { ProductReview } from '@/lib/types';
import Image from 'next/image';

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
    text: 'Идеальный свитер на осень и зиму. Ношу его не снимая. Очень довольна покупкой, спасибо Syntha!',
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

const reviewSchema = z.object({
  review: z
    .string()
    .min(10, { message: 'Отзыв должен содержать не менее 10 символов.' })
    .max(500, { message: 'Отзыв не должен превышать 500 символов.' }),
});

export default function ProductReviews({ productId }: { productId: string }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { review: '' },
  });

  const onSubmit = (data: z.infer<typeof reviewSchema>) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Отзыв отправлен!',
        description: 'Спасибо за ваш отзыв, он появится после модерации.',
      });
      form.reset();
      setIsSubmitting(false);
    }, 1000);
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary(null);
    try {
      const result = await summarizeProductReviews({
        reviews: mockReviews.map((r) => ({ text: r.text, rating: r.rating })),
      });
      setSummary(result.summary);
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

  const averageRating = mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = mockReviews.filter((r) => r.rating === star).length;
    return { star, count, percentage: (count / mockReviews.length) * 100 };
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <CardTitle className="text-sm font-bold">Отзывы покупателей</CardTitle>
            <CardDescription>Что другие думают об этом товаре.</CardDescription>
          </div>
          <Button variant="outline" onClick={handleSummarize} disabled={isSummarizing}>
            {isSummarizing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Проанализировать отзывы (AI)
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isSummarizing && <Loader2 className="mx-auto my-8 h-8 w-8 animate-spin text-primary" />}
        {summary && (
          <Card className="mb-6 border-accent/50 bg-accent/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Bot />
                AI Анализ отзывов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/90">{summary}</p>
            </CardContent>
          </Card>
        )}
        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex flex-col items-center justify-center rounded-lg bg-secondary/30 p-4 md:col-span-1">
            <p className="text-sm font-bold">{averageRating.toFixed(1)}</p>
            <div className="mt-1 flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/50'}`}
                />
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              на основе {mockReviews.length} отзывов
            </p>
          </div>
          <div className="space-y-2 md:col-span-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="min-w-[55px] text-sm text-muted-foreground">{star} звезд</span>
                <Progress value={percentage} className="h-2 w-full" />
                <span className="w-8 text-right text-sm text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        <div className="space-y-6">
          {mockReviews.map((review) => (
            <div key={review.id} className="flex gap-3">
              <Avatar data-ai-hint="person face">
                <AvatarImage src={review.avatar} alt={review.author} />
                <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <p className="font-semibold">{review.author}</p>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/50'}`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-foreground/90">{review.text}</p>
                {review.images && (
                  <div className="mt-2 flex gap-2">
                    {review.images.map((img) => (
                      <div key={img.id} className="relative h-20 w-20 overflow-hidden rounded-md">
                        <Image
                          src={img.url}
                          alt={img.alt}
                          fill
                          className="cursor-pointer object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
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
      </CardFooter>
    </Card>
  );
}
