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
        console.error('Failed to load fit corrections:', error);
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
        photo_url: 'https://cdn.synth-1.io/fit/sample-photo.jpg', // Mock
        pencil_marks_json: { marks: [] }, // Mock canvas data
        voice_note_url: null,
        comments: comment,
      });
      setCorrections([newCorrection, ...corrections]);
      setComment('');
      toast({ title: 'Правка сохранена', description: 'Данные отправлены в производство.' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось сохранить правку.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* Left: Annotation Tool */}
<<<<<<< HEAD
        <Card className="overflow-hidden rounded-xl border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50">
            <div>
              <CardTitle className="flex items-center gap-2 uppercase tracking-tight">
                <Pencil className="h-5 w-5 text-indigo-600" /> Инструмент разметки
=======
        <Card className="border-border-subtle overflow-hidden rounded-xl shadow-sm">
          <CardHeader className="bg-bg-surface2/80 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 uppercase tracking-tight">
                <Pencil className="text-accent-primary h-5 w-5" /> Инструмент разметки
>>>>>>> recover/cabinet-wip-from-stash
              </CardTitle>
              <CardDescription>Нанесите правки прямо на фото примерки.</CardDescription>
            </div>
          </CardHeader>
<<<<<<< HEAD
          <CardContent className="relative flex aspect-[3/4] items-center justify-center bg-slate-200 p-0">
=======
          <CardContent className="bg-border-subtle relative flex aspect-[3/4] items-center justify-center p-0">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="space-y-2 text-center opacity-40">
              <Image
                src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"
                alt="Fit Sample"
                fill
                className="object-cover"
              />
              <canvas ref={canvasRef} className="absolute inset-0 z-10 cursor-crosshair" />
            </div>
            <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              <Button
                size="sm"
<<<<<<< HEAD
                className="rounded-full bg-white/90 px-4 text-[10px] font-black uppercase text-slate-900 shadow-xl hover:bg-white"
=======
                className="text-text-primary rounded-full bg-white/90 px-4 text-[10px] font-black uppercase shadow-xl hover:bg-white"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <Pencil className="mr-2 h-3 w-3" /> Рисовать
              </Button>
              <Button
                size="sm"
<<<<<<< HEAD
                className="rounded-full bg-white/90 px-4 text-[10px] font-black uppercase text-slate-900 shadow-xl hover:bg-white"
=======
                className="text-text-primary rounded-full bg-white/90 px-4 text-[10px] font-black uppercase shadow-xl hover:bg-white"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <Mic className="mr-2 h-3 w-3" /> Голос
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right: Comments & History */}
        <div className="space-y-6">
<<<<<<< HEAD
          <Card className="rounded-xl border-slate-100 shadow-sm">
=======
          <Card className="border-border-subtle rounded-xl shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-tight">Новая заметка</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
<<<<<<< HEAD
                className="h-32 w-full rounded-2xl border-none bg-slate-50 p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500"
=======
                className="bg-bg-surface2 focus:ring-accent-primary h-32 w-full rounded-2xl border-none p-4 text-sm outline-none transition-all focus:ring-2"
>>>>>>> recover/cabinet-wip-from-stash
                placeholder="Опишите необходимые изменения..."
              />
              <Button
                onClick={handleSave}
                disabled={isSaving || !comment}
<<<<<<< HEAD
                className="h-12 w-full gap-2 rounded-xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white"
=======
                className="bg-text-primary h-12 w-full gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white"
>>>>>>> recover/cabinet-wip-from-stash
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Сохранить правку
              </Button>
            </CardContent>
          </Card>

<<<<<<< HEAD
          <Card className="overflow-hidden rounded-xl border-slate-100 shadow-sm">
            <CardHeader className="bg-slate-50/50">
=======
          <Card className="border-border-subtle overflow-hidden rounded-xl shadow-sm">
            <CardHeader className="bg-bg-surface2/80">
>>>>>>> recover/cabinet-wip-from-stash
              <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-tight">
                <History className="h-4 w-4" /> История правок
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex justify-center py-4">
<<<<<<< HEAD
                  <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
=======
                  <Loader2 className="text-text-muted h-6 w-6 animate-spin" />
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              ) : corrections.length > 0 ? (
                <div className="space-y-4">
                  {corrections.map((corr) => (
                    <div
                      key={corr.id}
<<<<<<< HEAD
                      className="space-y-2 rounded-2xl border border-slate-100 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <Badge className="border-none bg-indigo-50 text-[8px] font-black text-indigo-600">
=======
                      className="border-border-subtle space-y-2 rounded-2xl border p-4"
                    >
                      <div className="flex items-start justify-between">
                        <Badge className="bg-accent-primary/10 text-accent-primary border-none text-[8px] font-black">
>>>>>>> recover/cabinet-wip-from-stash
                          {new Date(corr.created_at).toLocaleDateString()}
                        </Badge>
                        {corr.voice_note_url && <Play className="h-3 w-3 text-emerald-500" />}
                      </div>
<<<<<<< HEAD
                      <p className="text-sm leading-relaxed text-slate-600">{corr.comments}</p>
=======
                      <p className="text-text-secondary text-sm leading-relaxed">{corr.comments}</p>
>>>>>>> recover/cabinet-wip-from-stash
                    </div>
                  ))}
                </div>
              ) : (
<<<<<<< HEAD
                <p className="py-4 text-center text-xs italic text-slate-400">
=======
                <p className="text-text-muted py-4 text-center text-xs italic">
>>>>>>> recover/cabinet-wip-from-stash
                  Правки пока не вносились.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
