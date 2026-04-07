'use client';

import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlatformDataBanner } from '@/components/client/platform-data-banner';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import {
  downloadJsonFile,
  exportVisualSearchSession,
  getVisualSearchTransport,
  loadVisualSearchSession,
  parseVisualSearchImport,
  readJsonFromFile,
  runVisualSearch,
  saveVisualSearchSession,
  type VisualSearchHit,
  type VisualSearchSessionV1,
} from '@/lib/platform/visual-search';
import { VISUAL_SEARCH_EXPORT_VERSION } from '@/lib/platform/types';
import { Camera, ArrowLeft, Sparkles, Download, Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ClientVisualSearchPage() {
  const { toast } = useToast();
  const transport = getVisualSearchTransport();
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [hits, setHits] = useState<VisualSearchHit[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const s = loadVisualSearchSession();
    if (s?.previewDataUrl) setPreview(s.previewDataUrl);
    if (s?.hits?.length) setHits(s.hits);
  }, []);

  const persist = useCallback((nextPreview: string | null, nextHits: VisualSearchHit[]) => {
    const session: VisualSearchSessionV1 = {
      version: VISUAL_SEARCH_EXPORT_VERSION,
      updatedAt: Date.now(),
      previewDataUrl: nextPreview,
      hits: nextHits,
    };
    saveVisualSearchSession(session);
  }, []);

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f?.type.startsWith('image/')) return;
    const r = new FileReader();
    r.onload = () => setPreview(String(r.result));
    r.readAsDataURL(f);
  };

  const runSearch = async () => {
    setBusy(true);
    setApiError(null);
    try {
      const next = await runVisualSearch(transport, products, preview);
      setHits(next);
      persist(preview, next);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка поиска';
      setApiError(msg);
      toast({ title: 'Визуальный поиск', description: msg, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const clearSession = () => {
    setPreview(null);
    setHits([]);
    persist(null, []);
    toast({ title: 'Сессия сброшена' });
  };

  const exportSession = () => {
    const session: VisualSearchSessionV1 = {
      version: VISUAL_SEARCH_EXPORT_VERSION,
      updatedAt: Date.now(),
      previewDataUrl: preview,
      hits,
    };
    downloadJsonFile('synth-visual-search-session.json', exportVisualSearchSession(session));
  };

  const importSession = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    try {
      const raw = await readJsonFromFile(f);
      const s = parseVisualSearchImport(raw);
      if (!s) {
        toast({ title: 'Неверный файл', variant: 'destructive' });
        return;
      }
      if (s.previewDataUrl) setPreview(s.previewDataUrl);
      setHits(s.hits);
      saveVisualSearchSession(s);
      toast({ title: 'Сессия импортирована' });
    } catch {
      toast({ title: 'Не удалось прочитать JSON', variant: 'destructive' });
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.client.home}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Camera className="h-6 w-6" />
              Визуальный поиск
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Референс → похожие SKU. В режиме API ожидается POST{' '}
              <code className="text-[10px] bg-muted px-1 rounded">/v1/client/visual-search</code>.
            </p>
          </div>
        </div>
        <PlatformDataBanner />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Референс</CardTitle>
          <CardDescription>
            JPEG/PNG. Сессия сохраняется в localStorage; экспорт — для бэкапа или миграции на API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input type="file" accept="image/*" className="text-sm" onChange={onFile} />
          {preview ? (
            <div className="relative aspect-video max-h-48 w-full overflow-hidden rounded-lg border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="h-full w-full object-contain" />
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Загрузите фото — появится превью и станет доступен поиск.
            </div>
          )}
          {apiError && <p className="text-xs text-destructive">{apiError}</p>}
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={runSearch} disabled={busy || !preview}>
              <Sparkles className="h-4 w-4 mr-2" />
              {busy ? 'Ищем…' : transport === 'local' ? 'Найти похожие' : 'Найти (API)'}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={exportSession} disabled={!hits.length && !preview}>
              <Download className="h-4 w-4 mr-2" />
              Экспорт JSON
            </Button>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent">
              <Upload className="h-4 w-4 mr-2" />
              Импорт JSON
              <input type="file" accept="application/json,.json" className="sr-only" onChange={importSession} />
            </label>
            <Button type="button" variant="ghost" size="sm" onClick={clearSession}>
              <Trash2 className="h-4 w-4 mr-2" />
              Сброс
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-sm font-semibold mb-3">Выдача (последний запуск)</h2>
        {hits.length === 0 ? (
          <p className="text-sm text-muted-foreground border border-dashed rounded-lg p-6">
            Пока нет результатов. Запустите поиск или импортируйте сессию.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {hits.map((h) => (
              <Link key={h.productId} href={`/products/${h.slug}`} className="group rounded-lg border overflow-hidden bg-card">
                <div className="relative aspect-[3/4]">
                  <Image src={h.imageUrl} alt={h.name} fill className="object-cover" sizes="200px" />
                </div>
                <p className="p-2 text-xs font-medium line-clamp-2 group-hover:text-primary">{h.name}</p>
                {h.score != null && (
                  <p className="px-2 pb-2 text-[10px] text-muted-foreground">score {h.score}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
