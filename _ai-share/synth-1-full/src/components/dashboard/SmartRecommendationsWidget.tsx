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
    <Card className="border-accent-primary/20 rounded-xl border-2 shadow-xl">
      <CardHeader className="border-border-subtle from-accent-primary/10 to-accent-primary/10 border-b bg-gradient-to-r">
        <div className="flex items-center gap-3">
          <div className="bg-accent-primary flex h-12 w-12 items-center justify-center rounded-xl">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-text-primary text-sm font-black uppercase tracking-tight">
              AI Recommendations
            </CardTitle>
            <p className="text-text-secondary text-[10px] font-medium">
              Personalized for your store
            </p>
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
                ? 'bg-accent-primary/10 border-accent-primary/25'
                : 'bg-bg-surface2 border-border-default'
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
                    <h4 className="text-text-primary text-sm font-black uppercase leading-tight">
                      {rec.name}
                    </h4>
                    <p className="text-text-secondary mt-1 text-[10px]">by {rec.brand}</p>
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <p className="text-accent-primary text-sm font-black tabular-nums">
                      {rec.confidence}%
                    </p>
                    <p className="text-text-secondary text-[8px] font-bold uppercase">Match</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className="bg-accent-primary/15 text-accent-primary border-none text-[7px] font-black uppercase">
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
              <p className="text-text-muted flex items-center gap-1 text-[9px] font-black uppercase">
                <Sparkles className="h-3 w-3" />
                Why We Recommend:
              </p>
              <ul className="space-y-1">
                {rec.reasons.map((reason, i) => (
                  <li key={i} className="text-text-primary flex items-start gap-2 text-[10px]">
                    <span className="text-accent-primary flex-shrink-0">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-accent-primary hover:bg-accent-primary h-9 flex-1 text-[8px] font-black uppercase"
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

        <div className="from-accent-primary/10 to-accent-primary/10 border-accent-primary/20 rounded-lg border-2 bg-gradient-to-r p-3 text-center">
          <p className="text-text-primary text-[10px] font-medium">
            🤖 <strong>AI analyzed</strong> 12,450 B2B orders to find these matches
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
