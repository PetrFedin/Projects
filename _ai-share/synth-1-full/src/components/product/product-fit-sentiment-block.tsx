'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { getFitSentiment } from '@/lib/fashion/return-intelligence';
import { MessageSquare, ThumbsUp, ThumbsDown, Info } from 'lucide-react';

type Props = { product: Product };

export function ProductFitSentimentBlock({ product }: Props) {
  const sentiment = getFitSentiment(product);

  const labels: Record<string, { text: string; icon: any; color: string }> = {
    small: { text: 'Маломерит', icon: ThumbsDown, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    true: { text: 'В размер', icon: ThumbsUp, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    large: { text: 'Большемерит', icon: ThumbsDown, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  };

  const current = labels[sentiment.overall];

  return (
    <Card className="mt-4 border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Мнения о посадке
        </CardTitle>
        <CardDescription className="text-xs">
          Анализ отзывов и данных о возвратах (демо-NLP).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className={`gap-1.5 px-2 py-0.5 font-medium ${current.color}`}>
            <current.icon className="h-3 w-3" />
            {current.text}
          </Badge>
          <div className="text-[10px] text-muted-foreground font-medium">
            Confidence: {sentiment.confidence}%
          </div>
        </div>

        {sentiment.topComplaints.length > 0 && (
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Частые замечания</p>
            <div className="flex flex-wrap gap-1.5">
              {sentiment.topComplaints.map(c => (
                <span key={c} className="text-[11px] px-2 py-0.5 rounded-full bg-muted border text-muted-foreground">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t flex items-start gap-2">
          <Info className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[9px] text-muted-foreground italic leading-tight">
            Рейтинг возвратов этой модели: {sentiment.returnRate}% (средний по категории: 12%).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
