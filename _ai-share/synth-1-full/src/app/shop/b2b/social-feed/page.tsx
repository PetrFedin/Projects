'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rss, ArrowLeft, Heart, MessageCircle, Share2 } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

/** Лента брендов (Depop/TSUM для РФ): новости коллекций, посты, подписка. */
const MOCK_POSTS = [
  {
    id: '1',
    brand: 'Syntha',
    text: 'FW26: дроп 2 уже в шоуруме. Откройте каталог и оформите предзаказ до 20 марта.',
    time: '2 ч назад',
    likes: 12,
    comments: 3,
  },
  {
    id: '2',
    brand: 'A.P.C.',
    text: 'Новая линейка базового трикотажа — доступна для заказа в матрице. MOQ от 6 шт по артикулу.',
    time: '5 ч назад',
    likes: 8,
    comments: 1,
  },
  {
    id: '3',
    brand: 'Acne Studios',
    text: 'Видео-презентация коллекции SS26: слоты на следующей неделе. Запись через Видео-консультацию.',
    time: '1 дн назад',
    likes: 24,
    comments: 5,
  },
];

export default function SocialFeedPage() {
  const [subscribed, setSubscribed] = useState<Record<string, boolean>>({});

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <Rss className="h-6 w-6" /> Лента брендов
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Новости коллекций и активность ваших брендов. Подписка, лайки и комментарии.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Лента</CardTitle>
          <CardDescription>
            Посты брендов, с которыми вы работаете. Уведомления о новых дропах и условиях заказа.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {MOCK_POSTS.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <span className="font-semibold">{post.brand}</span>
                <span className="text-xs text-slate-400">{post.time}</span>
              </div>
              <p className="mb-3 text-sm text-slate-600">{post.text}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" /> {post.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" /> {post.comments}
                </span>
                <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                  <Link href={ROUTES.shop.b2bMatrix}>В матрицу заказа</Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mb-6 flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bPartners}>Мои бренды</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bTradeShows}>Выставки</Link>
        </Button>
      </div>
      <RelatedModulesBlock
        links={getShopB2BHubLinks()}
        title="Партнёры, выставки, заказы"
        className="mt-6"
      />
    </div>
  );
}
