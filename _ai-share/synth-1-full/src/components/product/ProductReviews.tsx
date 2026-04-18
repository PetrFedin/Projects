'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageCircle } from 'lucide-react';

/** ASOS-style: отзывы и рейтинг по товару. */
const MOCK_REVIEWS = [
  {
    id: '1',
    author: 'Анна К.',
    rating: 5,
    date: '2026-02-15',
    text: 'Отличное качество, размер подошёл. Рекомендую.',
  },
  {
    id: '2',
    author: 'Мария П.',
    rating: 4,
    date: '2026-02-10',
    text: 'Ткань приятная, но рукав чуть длинноват. В целом довольна.',
  },
  {
    id: '3',
    author: 'Елена С.',
    rating: 5,
    date: '2026-02-01',
    text: 'Уже второй раз заказываю — всё на высоте.',
  },
];

export function ProductReviews({
  productName,
  rating = 4.7,
  reviewCount = 12,
}: {
  productName?: string;
  rating?: number;
  reviewCount?: number;
}) {
  return (
    <Card className="border-border-subtle">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <MessageCircle className="h-4 w-4" /> Отзывы и рейтинг
          <span className="flex items-center gap-1 font-normal text-amber-600">
            <Star className="h-4 w-4 fill-amber-500" /> {rating.toFixed(1)} ({reviewCount})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-2">
          {MOCK_REVIEWS.map((r) => (
            <li key={r.id} className="border-border-subtle border-b pb-2 last:border-0">
              <div className="text-text-secondary flex items-center gap-2 text-xs">
                <span className="text-text-primary font-medium">{r.author}</span>
                <span>{new Date(r.date).toLocaleDateString('ru-RU')}</span>
                <span className="flex items-center gap-0.5 text-amber-600">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-500" />
                  ))}
                </span>
              </div>
              <p className="mt-0.5 text-sm">{r.text}</p>
            </li>
          ))}
        </ul>
<<<<<<< HEAD
        <p className="text-xs text-slate-400">
=======
        <p className="text-text-muted text-xs">
>>>>>>> recover/cabinet-wip-from-stash
          Показаны последние отзывы. API отзывов — при подключении бэкенда.
        </p>
      </CardContent>
    </Card>
  );
}
