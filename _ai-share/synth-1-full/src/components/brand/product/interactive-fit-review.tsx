'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Mic, MessageSquare, Save, Loader2, Play, Trash2, History } from 'lucide-react';
import { fastApiService } from '@/lib/fastapi-service';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

import { useAuth } from '@/providers/auth-provider';

export default function InteractiveFitReview({ skuId }: { skuId: string }) {
    const [corrections, setCorrections] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [comment, setComment] = useState('');
    const { toast } = useToast();
    const { profile, loading: authLoading } = useAuth();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (authLoading || !profile) return;

        async function loadCorrections() {
            try {
                const response = await fastApiService.getFitCorrections(skuId);
                const data = response.data || [];
                setCorrections(data);
            } catch (error) {
                console.error("Failed to load fit corrections:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadCorrections();
    }, [skuId, profile, authLoading]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const newCorrection = await fastApiService.createFitCorrection({
                sku_id: skuId,
                photo_url: "https://cdn.synth-1.io/fit/sample-photo.jpg", // Mock
                pencil_marks_json: { marks: [] }, // Mock canvas data
                voice_note_url: null,
                comments: comment
            });
            setCorrections([newCorrection, ...corrections]);
            setComment('');
            toast({ title: "Правка сохранена", description: "Данные отправлены в производство." });
        } catch (error) {
            toast({ variant: "destructive", title: "Ошибка", description: "Не удалось сохранить правку." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Left: Annotation Tool */}
                <Card className="rounded-xl border-slate-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="uppercase tracking-tight flex items-center gap-2">
                                <Pencil className="h-5 w-5 text-indigo-600" /> Инструмент разметки
                            </CardTitle>
                            <CardDescription>Нанесите правки прямо на фото примерки.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 relative aspect-[3/4] bg-slate-200 flex items-center justify-center">
                        <div className="text-center space-y-2 opacity-40">
                            <Image src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800" alt="Fit Sample" fill className="object-cover" />
                            <canvas ref={canvasRef} className="absolute inset-0 z-10 cursor-crosshair" />
                        </div>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                            <Button size="sm" className="rounded-full bg-white/90 text-slate-900 shadow-xl hover:bg-white px-4 font-black uppercase text-[10px]">
                                <Pencil className="h-3 w-3 mr-2" /> Рисовать
                            </Button>
                            <Button size="sm" className="rounded-full bg-white/90 text-slate-900 shadow-xl hover:bg-white px-4 font-black uppercase text-[10px]">
                                <Mic className="h-3 w-3 mr-2" /> Голос
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Comments & History */}
                <div className="space-y-6">
                    <Card className="rounded-xl border-slate-100 shadow-sm">
                        <CardHeader>
                            <CardTitle className="uppercase tracking-tight text-sm">Новая заметка</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <textarea 
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full h-32 rounded-2xl bg-slate-50 border-none p-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                                placeholder="Опишите необходимые изменения..."
                            />
                            <Button 
                                onClick={handleSave}
                                disabled={isSaving || !comment}
                                className="w-full h-12 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest gap-2"
                            >
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Сохранить правку
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-slate-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50">
                            <CardTitle className="uppercase tracking-tight text-sm flex items-center gap-2">
                                <History className="h-4 w-4" /> История правок
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            {isLoading ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                                </div>
                            ) : corrections.length > 0 ? (
                                <div className="space-y-4">
                                    {corrections.map((corr) => (
                                        <div key={corr.id} className="p-4 rounded-2xl border border-slate-100 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <Badge className="bg-indigo-50 text-indigo-600 border-none text-[8px] font-black">
                                                    {new Date(corr.created_at).toLocaleDateString()}
                                                </Badge>
                                                {corr.voice_note_url && <Play className="h-3 w-3 text-emerald-500" />}
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed">{corr.comments}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-xs text-slate-400 italic py-4">Правки пока не вносились.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
