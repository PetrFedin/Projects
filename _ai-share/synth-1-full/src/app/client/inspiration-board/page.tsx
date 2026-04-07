'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlatformDataBanner } from '@/components/client/platform-data-banner';
import { ROUTES } from '@/lib/routes';
import { products as libProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import {
  addPin,
  loadInspirationBoard,
  parseInspirationBoardImport,
  removePin,
  saveInspirationBoard,
  type InspirationBoardStateV1,
} from '@/lib/fashion/inspiration-board';
import { downloadJsonFile, readJsonFromFile } from '@/lib/platform/json-io';
import { ArrowLeft, LayoutGrid, Download, Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ChangeEvent } from 'react';

function resolveProduct(slugOrId: string): Product | undefined {
  return libProducts.find((p) => p.slug === slugOrId || String(p.id) === slugOrId);
}

function InspirationBoardInner() {
  const { toast } = useToast();
  const search = useSearchParams();
  const [board, setBoard] = useState<InspirationBoardStateV1>(() => loadInspirationBoard());
  const [catalog, setCatalog] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/data/products.json')
      .then((r) => r.json())
      .then((d: Product[]) => setCatalog(d.length ? d : libProducts))
      .catch(() => setCatalog(libProducts));
  }, []);

  useEffect(() => {
    const add = search.get('add');
    if (!add) return;
    const p = resolveProduct(add);
    if (!p) return;
    setBoard((prev) => {
      const next = addPin(prev, p);
      if (next.pins.length > prev.pins.length) {
        saveInspirationBoard(next);
        toast({ title: 'Добавлено на доску', description: p.name });
        return next;
      }
      return prev;
    });
  }, [search, toast]);

  const byId = new Map(libProducts.map((p) => [String(p.id), p]));
  for (const p of catalog) byId.set(String(p.id), p);

  const pinProducts = board.pins
    .map((pin) => byId.get(pin.productId))
    .filter((x): x is Product => !!x);

  const persist = (updater: (prev: InspirationBoardStateV1) => InspirationBoardStateV1) => {
    setBoard((prev) => {
      const next = updater(prev);
      saveInspirationBoard(next);
      return next;
    });
  };

  const importJson = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    try {
      const raw = await readJsonFromFile(f);
      const parsed = parseInspirationBoardImport(raw);
      if (!parsed) {
        toast({ title: 'Неверный формат', variant: 'destructive' });
        return;
      }
      persist(() => parsed);
      toast({ title: 'Доска импортирована' });
    } catch {
      toast({ title: 'Ошибка чтения', variant: 'destructive' });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Название доски</CardTitle>
          <CardDescription>Хранение в localStorage; экспорт для шаринга или API мудбордов.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="title">Заголовок</Label>
            <Input
              id="title"
              value={board.title}
              onChange={(e) => persist((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => downloadJsonFile('synth-inspiration-board.json', board)}>
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent h-9">
              <Upload className="h-4 w-4 mr-2" />
              Импорт
              <input type="file" accept="application/json,.json" className="sr-only" onChange={importJson} />
            </label>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-sm font-semibold mb-3">Пины ({board.pins.length})</h2>
        {pinProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground border border-dashed rounded-lg p-8">Добавьте товары из сетки или с PDP (кнопка «На доску»).</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {board.pins.map((pin) => {
              const p = byId.get(pin.productId);
              if (!p) return null;
              return (
                <div key={pin.productId} className="relative rounded-lg border overflow-hidden group">
                  <Link href={`/products/${p.slug}`} className="block">
                    <div className="relative aspect-square">
                      <Image src={p.images[0]?.url || '/placeholder.jpg'} alt="" fill className="object-cover" sizes="150px" />
                    </div>
                    <p className="p-2 text-[11px] line-clamp-2">{p.name}</p>
                  </Link>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => persist((prev) => removePin(prev, pin.productId))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Каталог</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
            {catalog.slice(0, 48).map((p) => (
              <button
                key={p.id}
                type="button"
                className="text-left rounded-md border p-1 hover:border-primary"
                onClick={() => persist((prev) => addPin(prev, p))}
              >
                <div className="relative aspect-square rounded overflow-hidden">
                  <Image src={p.images[0]?.url || '/placeholder.jpg'} alt="" fill className="object-cover" sizes="100px" />
                </div>
                <p className="text-[10px] mt-1 line-clamp-2">{p.name}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default function InspirationBoardPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={ROUTES.client.home}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <LayoutGrid className="h-6 w-6" />
              Доска вдохновения
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Пины SKU + версионный JSON. Позже: совместное редактирование и импорт из лукбуков.
            </p>
          </div>
        </div>
        <PlatformDataBanner />
      </div>

      <Suspense fallback={<p className="text-sm text-muted-foreground">Загрузка…</p>}>
        <InspirationBoardInner />
      </Suspense>
    </div>
  );
}
