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
        'Trending +45% this month'
      ],
      projectedProfit: 450000,
      urgency: 'high'
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
        'Proven bestseller last season'
      ],
      projectedProfit: 320000,
      urgency: 'medium'
    }
  ];
  
  return (
    <Card className="border-2 border-purple-100 shadow-xl rounded-xl">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-purple-600 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">
              AI Recommendations
            </CardTitle>
            <p className="text-[10px] text-slate-500 font-medium">
              Personalized for your store
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.productId}
            className={cn(
              "p-4 rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg",
              rec.urgency === 'high' ? 'bg-purple-50 border-purple-200' : 'bg-slate-50 border-slate-200'
            )}
          >
            <div className="flex items-start gap-3 mb-3">
              <img
                src={rec.image}
                alt={rec.name}
                className="h-20 w-20 rounded-lg object-cover flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-sm font-black uppercase text-slate-900 leading-tight">
                      {rec.name}
                    </h4>
                    <p className="text-[10px] text-slate-600 mt-1">
                      by {rec.brand}
                    </p>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-purple-600 tabular-nums">
                      {rec.confidence}%
                    </p>
                    <p className="text-[8px] text-slate-500 uppercase font-bold">
                      Match
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-100 text-purple-700 text-[7px] font-black uppercase border-none">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {rec.urgency} priority
                  </Badge>
                  
                  <Badge className="bg-emerald-100 text-emerald-700 text-[7px] font-black uppercase border-none">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {(rec.projectedProfit / 1000).toFixed(0)}K profit
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* AI Reasons */}
            <div className="space-y-1 mb-3">
              <p className="text-[9px] font-black uppercase text-slate-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Why We Recommend:
              </p>
              <ul className="space-y-1">
                {rec.reasons.map((reason, i) => (
                  <li key={i} className="text-[10px] text-slate-700 flex items-start gap-2">
                    <span className="text-purple-600 flex-shrink-0">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 h-9 text-[8px] font-black uppercase bg-purple-600 hover:bg-purple-700"
              >
                <ShoppingCart className="mr-2 h-3 w-3" />
                Add to Cart
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-9 text-[8px] font-black uppercase"
              >
                <Target className="mr-2 h-3 w-3" />
                Learn More
              </Button>
            </div>
          </div>
        ))}
        
        <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-100 text-center">
          <p className="text-[10px] font-medium text-purple-900">
            🤖 <strong>AI analyzed</strong> 12,450 B2B orders to find these matches
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
