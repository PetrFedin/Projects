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
                    fastApiService.getNps(brandId)
                ]);
                setFeedback(feedbackData);
                setNps(npsData.nps_score);
            } catch (error) {
                console.error("Failed to load feedback data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [brandId]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* NPS Card */}
                <Card className="rounded-xl border-none shadow-xl bg-indigo-600 text-white p-4 relative overflow-hidden">
                    <TrendingUp className="absolute top-4 right-4 h-12 w-12 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Net Promoter Score</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-sm font-black">{isLoading ? '...' : nps?.toFixed(1)}</h3>
                        <Badge className="bg-white/20 text-white border-none text-[8px] font-black h-5">Real-time</Badge>
                    </div>
                    <p className="text-[9px] text-indigo-100/60 mt-4 italic">На основе последних отзывов клиентов.</p>
                </Card>

                {/* Feedback Counter */}
                <Card className="rounded-xl border-none shadow-sm bg-white p-4 border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Всего отзывов</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-sm font-black text-slate-900">{isLoading ? '...' : feedback.length}</h3>
                        <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black h-5">+5 сегодня</Badge>
                    </div>
                </Card>

                {/* Top Tags */}
                <Card className="rounded-xl border-none shadow-sm bg-white p-4 border border-slate-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Топ тегов (AI)</p>
                    <div className="flex flex-wrap gap-2">
                        <Badge className="bg-slate-50 text-slate-600 border-none text-[8px] font-black h-5 px-2">Качество +82</Badge>
                        <Badge className="bg-slate-50 text-slate-600 border-none text-[8px] font-black h-5 px-2">Посадка +45</Badge>
                        <Badge className="bg-slate-50 text-slate-600 border-none text-[8px] font-black h-5 px-2">Стиль +38</Badge>
                    </div>
                </Card>
            </div>

            {/* Feedback List */}
            <Card className="rounded-xl border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50">
                    <CardTitle className="uppercase tracking-tight text-sm flex items-center gap-2">
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
                                <div key={item.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black uppercase">
                                                {item.customer_id.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase text-slate-900">{item.customer_id}</p>
                                                <p className="text-[8px] text-slate-400 uppercase font-bold">{new Date(item.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={cn("h-3 w-3", i < Math.floor(item.rating / 2) ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed mb-3">{item.comment}</p>
                                    <div className="flex gap-2">
                                        {item.sku_id && (
                                            <Badge variant="outline" className="text-[7px] font-black uppercase border-slate-100 text-slate-400 h-4">
                                                SKU: {item.sku_id}
                                            </Badge>
                                        )}
                                        {Object.entries(item.tags_json || {}).map(([key, val]) => (
                                            <Badge key={key} className="bg-indigo-50 text-indigo-600 border-none text-[7px] font-black h-4 px-1.5 uppercase">
                                                {key}: {val as string}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-slate-400 italic">Нет отзывов для отображения.</div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
