'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, Loader2, TrendingUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { fastApiService } from '@/lib/fastapi-service';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function FeedbackAnalytics({ brandId }: { brandId: string }) {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [nps, setNps] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const [feedbackData, npsData] = await Promise.all([
          fastApiService.getFeedback(brandId),
          fastApiService.getNps(brandId),
        ]);
        setFeedback(feedbackData);
        setNps(npsData.nps_score);
      } catch (error) {
        console.error('Failed to load feedback data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [brandId]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* NPS Card */}
        <Card className="bg-accent-primary relative overflow-hidden rounded-xl border-none p-4 text-white shadow-xl">
          <TrendingUp className="absolute right-4 top-4 h-12 w-12 opacity-10" />
          <p className="text-accent-primary/40 mb-2 text-[10px] font-black uppercase tracking-widest">
            Net Promoter Score
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-black">{isLoading ? '...' : nps?.toFixed(1)}</h3>
            <Badge className="h-5 border-none bg-white/20 text-[8px] font-black text-white">
              Real-time
            </Badge>
          </div>
          <p className="text-accent-primary/30 mt-4 text-[9px] italic">
            На основе последних отзывов клиентов.
          </p>
        </Card>

        {/* Feedback Counter */}
        <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm">
          <p className="text-text-muted mb-2 text-[10px] font-black uppercase tracking-widest">
            Всего отзывов
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-text-primary text-sm font-black">
              {isLoading ? '...' : feedback.length}
            </h3>
            <Badge className="h-5 border-none bg-emerald-50 text-[8px] font-black text-emerald-600">
              +5 сегодня
            </Badge>
          </div>
        </Card>

        {/* Top Tags */}
        <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm">
          <p className="text-text-muted mb-2 text-[10px] font-black uppercase tracking-widest">
            Топ тегов (AI)
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-bg-surface2 text-text-secondary h-5 border-none px-2 text-[8px] font-black">
              Качество +82
            </Badge>
            <Badge className="bg-bg-surface2 text-text-secondary h-5 border-none px-2 text-[8px] font-black">
              Посадка +45
            </Badge>
            <Badge className="bg-bg-surface2 text-text-secondary h-5 border-none px-2 text-[8px] font-black">
              Стиль +38
            </Badge>
          </div>
        </Card>
      </div>

      {/* Feedback List */}
      <Card className="border-border-subtle overflow-hidden rounded-xl shadow-sm">
        <CardHeader className="bg-bg-surface2/80">
          <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-tight">
            <MessageSquare className="text-accent-primary h-4 w-4" /> Последние отзывы
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="text-text-muted h-8 w-8 animate-spin" />
            </div>
          ) : feedback.length > 0 ? (
            <div className="divide-border-subtle divide-y">
              {feedback.map((item) => (
                <div key={item.id} className="hover:bg-bg-surface2/80 p-4 transition-colors">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-bg-surface2 flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black uppercase">
                        {item.customer_id.charAt(0)}
                      </div>
                      <div>
                        <p className="text-text-primary text-xs font-black uppercase">
                          {item.customer_id}
                        </p>
                        <p className="text-text-muted text-[8px] font-bold uppercase">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-3 w-3',
                            i < Math.floor(item.rating / 2)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-text-muted'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-text-secondary mb-3 text-sm leading-relaxed">{item.comment}</p>
                  <div className="flex gap-2">
                    {item.sku_id && (
                      <Badge
                        variant="outline"
                        className="border-border-subtle text-text-muted h-4 text-[7px] font-black uppercase"
                      >
                        SKU: {item.sku_id}
                      </Badge>
                    )}
                    {Object.entries(item.tags_json || {}).map(([key, val]) => (
                      <Badge
                        key={key}
                        className="bg-accent-primary/10 text-accent-primary h-4 border-none px-1.5 text-[7px] font-black uppercase"
                      >
                        {key}: {val as string}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-text-muted py-12 text-center italic">
              Нет отзывов для отображения.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
