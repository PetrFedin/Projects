'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Target, DollarSign, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Recommendation {
  productId: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  confidence: number;
  reasons: string[];
  projectedProfit: number;
  urgency: 'high' | 'medium' | 'low';
}

export function SmartRecommendationsWidget() {
  const recommendations: Recommendation[] = [
    {
      productId: '1',
      name: 'Tech Parka Pro',
      brand: 'Syntha Lab',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=200',
      price: 28500,
      confidence: 92,
      reasons: [
        'Similar buyers ordered 89 times',
        'High STR predicted: 85%',
        'Perfect for your price point',
        'Trending +45% this month',
      ],
      projectedProfit: 450000,
      urgency: 'high',
    },
    {
      productId: '2',
      name: 'Nordic Wool Bundle',
      brand: 'Nordic Wool',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=200',
      price: 15000,
      confidence: 88,
      reasons: [
        'Complements your current cart',
        'High repeat order rate: 76%',
        'Low competition in market',
        'Proven bestseller last season',
      ],
      projectedProfit: 320000,
      urgency: 'medium',
    },
  ];

  return (
    <Card className="rounded-xl border-2 border-purple-100 shadow-xl">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">
              AI Recommendations
            </CardTitle>
            <p className="text-[10px] font-medium text-slate-500">Personalized for your store</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        {recommendations.map((rec) => (
          <div
            key={rec.productId}
            className={cn(
              'cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-lg',
              rec.urgency === 'high'
                ? 'border-purple-200 bg-purple-50'
                : 'border-slate-200 bg-slate-50'
            )}
          >
            <div className="mb-3 flex items-start gap-3">
              <img
                src={rec.image}
                alt={rec.name}
                className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
              />

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-black uppercase leading-tight text-slate-900">
                      {rec.name}
                    </h4>
                    <p className="mt-1 text-[10px] text-slate-600">by {rec.brand}</p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-black tabular-nums text-purple-600">
                      {rec.confidence}%
                    </p>
                    <p className="text-[8px] font-bold uppercase text-slate-500">Match</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className="border-none bg-purple-100 text-[7px] font-black uppercase text-purple-700">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {rec.urgency} priority
                  </Badge>

                  <Badge className="border-none bg-emerald-100 text-[7px] font-black uppercase text-emerald-700">
                    <DollarSign className="mr-1 h-3 w-3" />
                    {(rec.projectedProfit / 1000).toFixed(0)}K profit
                  </Badge>
                </div>
              </div>
            </div>

            {/* AI Reasons */}
            <div className="mb-3 space-y-1">
              <p className="flex items-center gap-1 text-[9px] font-black uppercase text-slate-400">
                <Sparkles className="h-3 w-3" />
                Why We Recommend:
              </p>
              <ul className="space-y-1">
                {rec.reasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-[10px] text-slate-700">
                    <span className="flex-shrink-0 text-purple-600">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-9 flex-1 bg-purple-600 text-[8px] font-black uppercase hover:bg-purple-700"
              >
                <ShoppingCart className="mr-2 h-3 w-3" />
                Add to Cart
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-9 flex-1 text-[8px] font-black uppercase"
              >
                <Target className="mr-2 h-3 w-3" />
                Learn More
              </Button>
            </div>
          </div>
        ))}

        <div className="rounded-lg border-2 border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-3 text-center">
          <p className="text-[10px] font-medium text-purple-900">
            🤖 <strong>AI analyzed</strong> 12,450 B2B orders to find these matches
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
