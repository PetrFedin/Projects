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
<<<<<<< HEAD
        <Card className="relative overflow-hidden rounded-xl border-none bg-indigo-600 p-4 text-white shadow-xl">
          <TrendingUp className="absolute right-4 top-4 h-12 w-12 opacity-10" />
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-indigo-200">
=======
        <Card className="bg-accent-primary relative overflow-hidden rounded-xl border-none p-4 text-white shadow-xl">
          <TrendingUp className="absolute right-4 top-4 h-12 w-12 opacity-10" />
          <p className="text-accent-primary/40 mb-2 text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Net Promoter Score
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-black">{isLoading ? '...' : nps?.toFixed(1)}</h3>
            <Badge className="h-5 border-none bg-white/20 text-[8px] font-black text-white">
              Real-time
            </Badge>
          </div>
<<<<<<< HEAD
          <p className="mt-4 text-[9px] italic text-indigo-100/60">
=======
          <p className="text-accent-primary/30 mt-4 text-[9px] italic">
>>>>>>> recover/cabinet-wip-from-stash
            На основе последних отзывов клиентов.
          </p>
        </Card>

        {/* Feedback Counter */}
<<<<<<< HEAD
        <Card className="rounded-xl border border-none border-slate-100 bg-white p-4 shadow-sm">
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Всего отзывов
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-black text-slate-900">
=======
        <Card className="border-border-subtle rounded-xl border border-none bg-white p-4 shadow-sm">
          <p className="text-text-muted mb-2 text-[10px] font-black uppercase tracking-widest">
            Всего отзывов
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-text-primary text-sm font-black">
>>>>>>> recover/cabinet-wip-from-stash
              {isLoading ? '...' : feedback.length}
            </h3>
            <Badge className="h-5 border-none bg-emerald-50 text-[8px] font-black text-emerald-600">
              +5 сегодня
            </Badge>
          </div>
        </Card>

        {/* Top Tags */}
<<<<<<< HEAD
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
=======
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
>>>>>>> recover/cabinet-wip-from-stash
              Стиль +38
            </Badge>
          </div>
        </Card>
      </div>

      {/* Feedback List */}
<<<<<<< HEAD
      <Card className="overflow-hidden rounded-xl border-slate-100 shadow-sm">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-tight">
            <MessageSquare className="h-4 w-4 text-indigo-600" /> Последние отзывы
=======
      <Card className="border-border-subtle overflow-hidden rounded-xl shadow-sm">
        <CardHeader className="bg-bg-surface2/80">
          <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-tight">
            <MessageSquare className="text-accent-primary h-4 w-4" /> Последние отзывы
>>>>>>> recover/cabinet-wip-from-stash
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
<<<<<<< HEAD
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
=======
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
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                              : 'text-slate-200'
=======
                              : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                          )}
                        />
                      ))}
                    </div>
                  </div>
<<<<<<< HEAD
                  <p className="mb-3 text-sm leading-relaxed text-slate-600">{item.comment}</p>
=======
                  <p className="text-text-secondary mb-3 text-sm leading-relaxed">{item.comment}</p>
>>>>>>> recover/cabinet-wip-from-stash
                  <div className="flex gap-2">
                    {item.sku_id && (
                      <Badge
                        variant="outline"
<<<<<<< HEAD
                        className="h-4 border-slate-100 text-[7px] font-black uppercase text-slate-400"
=======
                        className="border-border-subtle text-text-muted h-4 text-[7px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        SKU: {item.sku_id}
                      </Badge>
                    )}
                    {Object.entries(item.tags_json || {}).map(([key, val]) => (
                      <Badge
                        key={key}
<<<<<<< HEAD
                        className="h-4 border-none bg-indigo-50 px-1.5 text-[7px] font-black uppercase text-indigo-600"
=======
                        className="bg-accent-primary/10 text-accent-primary h-4 border-none px-1.5 text-[7px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        {key}: {val as string}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
<<<<<<< HEAD
            <div className="py-12 text-center italic text-slate-400">
=======
            <div className="text-text-muted py-12 text-center italic">
>>>>>>> recover/cabinet-wip-from-stash
              Нет отзывов для отображения.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
