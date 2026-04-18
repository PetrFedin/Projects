'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, TrendingUp, Heart, MessageCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface TrendingProduct {
  id: string;
  name: string;
  brand: string;
  rating: number;
  reviews: number;
  orders: number;
  image: string;
  topReview: {
    buyer: string;
    buyerAvatar: string;
    text: string;
    rating: number;
  };
}

export function SocialProofWidget() {
  const trendingProducts: TrendingProduct[] = [
    {
      id: '1',
      name: 'Cyber Tech Parka',
      brand: 'Syntha Lab',
      rating: 4.8,
      reviews: 142,
      orders: 89,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=100',
      topReview: {
        buyer: 'Premium Store Moscow',
        buyerAvatar: '/avatars/premium-store.jpg',
        text: 'Отличное качество! Продаётся как горячие пирожки. Заказали ещё 50 шт.',
        rating: 5,
      },
    },
    {
      id: '2',
      name: 'Nordic Wool Sweater',
      brand: 'Nordic Wool',
      rating: 4.9,
      reviews: 98,
      orders: 67,
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=100',
      topReview: {
        buyer: 'Elite Fashion SPB',
        buyerAvatar: '/avatars/elite-fashion.jpg',
        text: 'Идеальный базовый трикотаж. Клиенты в восторге! Будем заказывать каждый сезон.',
        rating: 5,
      },
    },
  ];

  return (
    <Card className="rounded-xl border-2 border-rose-100 shadow-xl">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-rose-50 to-pink-50">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-600">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">
              Trending This Week
            </CardTitle>
            <p className="text-[10px] font-medium text-slate-500">What other buyers are loving</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        {trendingProducts.map((product, i) => (
          <div
            key={product.id}
            className="cursor-pointer rounded-xl border-2 border-rose-100 bg-rose-50 p-4 transition-all hover:border-rose-300"
          >
            <div className="mb-3 flex items-start gap-3">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-xs font-black text-white">
                  #{i + 1}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-black uppercase leading-tight text-slate-900">
                  {product.name}
                </h4>
                <p className="mb-2 text-[10px] text-slate-600">by {product.brand}</p>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-black text-slate-900">{product.rating}</span>
                    <span className="text-[10px] text-slate-500">({product.reviews})</span>
                  </div>

                  <Badge className="border-none bg-emerald-100 text-[7px] font-black uppercase text-emerald-700">
                    <ShoppingBag className="mr-1 h-3 w-3" />
                    {product.orders} orders
                  </Badge>

                  <Badge className="border-none bg-rose-100 text-[7px] font-black uppercase text-rose-700">
                    <Heart className="mr-1 h-3 w-3" />
                    Hot Item
                  </Badge>
                </div>
              </div>
            </div>

            {/* Top Review */}
            <div className="rounded-lg border border-rose-200 bg-white p-3">
              <div className="flex items-start gap-2">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={product.topReview.buyerAvatar} />
                  <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-500 text-[10px] font-bold text-white">
                    {product.topReview.buyer.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-900">
                      {product.topReview.buyer}
                    </p>
                    <div className="flex">
                      {[...Array(product.topReview.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] italic leading-relaxed text-slate-700">
                    "{product.topReview.text}"
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-[8px] font-black uppercase hover:bg-rose-100"
                >
                  <MessageCircle className="mr-1 h-3 w-3" />
                  Read All ({product.reviews})
                </Button>
                <Button
                  size="sm"
                  className="h-7 bg-rose-600 text-[8px] font-black uppercase hover:bg-rose-700"
                  asChild
                >
                  <Link href={`/shop/b2b/products/${product.id}`}>View Product</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="rounded-xl border-2 border-rose-100 bg-gradient-to-r from-rose-50 to-pink-50 p-4 text-center">
          <p className="text-[11px] font-medium text-rose-900">
            💡 <strong>89% байеров</strong> заказывают эти товары повторно
          </p>
          <p className="mt-1 text-[9px] text-slate-600">
            Based on 12,450 B2B orders in last 60 days
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
