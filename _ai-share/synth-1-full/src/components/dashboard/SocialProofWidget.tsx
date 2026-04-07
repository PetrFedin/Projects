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
        rating: 5
      }
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
        rating: 5
      }
    }
  ];
  
  return (
    <Card className="border-2 border-rose-100 shadow-xl rounded-xl">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-rose-50 to-pink-50">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-rose-600 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">
              Trending This Week
            </CardTitle>
            <p className="text-[10px] text-slate-500 font-medium">
              What other buyers are loving
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {trendingProducts.map((product, i) => (
          <div
            key={product.id}
            className="p-4 bg-rose-50 rounded-xl border-2 border-rose-100 hover:border-rose-300 transition-all cursor-pointer"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="absolute -top-2 -left-2 h-6 w-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-black">
                  #{i + 1}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black uppercase text-slate-900 leading-tight">
                  {product.name}
                </h4>
                <p className="text-[10px] text-slate-600 mb-2">
                  by {product.brand}
                </p>
                
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-black text-slate-900">
                      {product.rating}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ({product.reviews})
                    </span>
                  </div>
                  
                  <Badge className="bg-emerald-100 text-emerald-700 text-[7px] font-black uppercase border-none">
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    {product.orders} orders
                  </Badge>
                  
                  <Badge className="bg-rose-100 text-rose-700 text-[7px] font-black uppercase border-none">
                    <Heart className="h-3 w-3 mr-1" />
                    Hot Item
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Top Review */}
            <div className="p-3 bg-white rounded-lg border border-rose-200">
              <div className="flex items-start gap-2">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={product.topReview.buyerAvatar} />
                  <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-500 text-white text-[10px] font-bold">
                    {product.topReview.buyer.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-bold text-slate-900">
                      {product.topReview.buyer}
                    </p>
                    <div className="flex">
                      {[...Array(product.topReview.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-700 italic leading-relaxed">
                    "{product.topReview.text}"
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-3">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-[8px] font-black uppercase hover:bg-rose-100"
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Read All ({product.reviews})
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-[8px] font-black uppercase bg-rose-600 hover:bg-rose-700"
                  asChild
                >
                  <Link href={`/shop/b2b/products/${product.id}`}>
                    View Product
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border-2 border-rose-100 text-center">
          <p className="text-[11px] font-medium text-rose-900">
            💡 <strong>89% байеров</strong> заказывают эти товары повторно
          </p>
          <p className="text-[9px] text-slate-600 mt-1">
            Based on 12,450 B2B orders in last 60 days
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
