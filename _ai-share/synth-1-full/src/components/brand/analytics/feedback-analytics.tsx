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
        <Card className="relative overflow-hidden rounded-xl border-none bg-indigo-600 p-4 text-white shadow-xl">
          <TrendingUp className="absolute right-4 top-4 h-12 w-12 opacity-10" />
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-indigo-200">
            Net Promoter Score
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-black">{isLoading ? '...' : nps?.toFixed(1)}</h3>
            <Badge className="h-5 border-none bg-white/20 text-[8px] font-black text-white">
              Real-time
            </Badge>
          </div>
          <p className="mt-4 text-[9px] italic text-indigo-100/60">
            На основе последних отзывов клиентов.
          </p>
        </Card>

        {/* Feedback Counter */}
        <Card className="rounded-xl border border-none border-slate-100 bg-white p-4 shadow-sm">
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Всего отзывов
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-black text-slate-900">
              {isLoading ? '...' : feedback.length}
            </h3>
            <Badge className="h-5 border-none bg-emerald-50 text-[8px] font-black text-emerald-600">
              +5 сегодня
            </Badge>
          </div>
        </Card>

        {/* Top Tags */}
        <Card className="rounded-xl border border-none border-slate-100 bg-white p-4 shadow-sm">
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Топ тегов (AI)
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="h-5 border-none bg-slate-50 px-2 text-[8px] font-black text-slate-600">
              Качество +82
            </Badge>
            <Badge className="h-5 border-none bg-slate-50 px-2 text-[8px] font-black text-slate-600">
              Посадка +45
            </Badge>
            <Badge className="h-5 border-none bg-slate-50 px-2 text-[8px] font-black text-slate-600">
              Стиль +38
            </Badge>
          </div>
        </Card>
      </div>

      {/* Feedback List */}
      <Card className="overflow-hidden rounded-xl border-slate-100 shadow-sm">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-tight">
            <MessageSquare className="h-4 w-4 text-indigo-600" /> Последние отзывы
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-200" />
            </div>
          ) : feedback.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {feedback.map((item) => (
                <div key={item.id} className="p-4 transition-colors hover:bg-slate-50/50">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[10px] font-black uppercase">
                        {item.customer_id.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-slate-900">
                          {item.customer_id}
                        </p>
                        <p className="text-[8px] font-bold uppercase text-slate-400">
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
                              : 'text-slate-200'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mb-3 text-sm leading-relaxed text-slate-600">{item.comment}</p>
                  <div className="flex gap-2">
                    {item.sku_id && (
                      <Badge
                        variant="outline"
                        className="h-4 border-slate-100 text-[7px] font-black uppercase text-slate-400"
                      >
                        SKU: {item.sku_id}
                      </Badge>
                    )}
                    {Object.entries(item.tags_json || {}).map(([key, val]) => (
                      <Badge
                        key={key}
                        className="h-4 border-none bg-indigo-50 px-1.5 text-[7px] font-black uppercase text-indigo-600"
                      >
                        {key}: {val as string}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center italic text-slate-400">
              Нет отзывов для отображения.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
