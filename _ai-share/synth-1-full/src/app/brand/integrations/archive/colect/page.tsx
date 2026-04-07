'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  BookOpen,
  Image,
  ShoppingCart,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';

type Message = { type: 'success' | 'error'; text: string };

export default function BrandIntegrationsColectPage() {
  const [lookbookId, setLookbookId] = useState('demo-lookbook');
  const [structure, setStructure] = useState<{ id: string; name?: string; chapters?: unknown[]; keyLooks?: unknown[] } | null>(null);
  const [structureLoading, setStructureLoading] = useState(false);
  const [content, setContent] = useState<unknown[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [addToOrderMsg, setAddToOrderMsg] = useState<Message | null>(null);
  const [addToOrderLoading, setAddToOrderLoading] = useState(false);

  const loadStructure = async () => {
    setStructureLoading(true);
    try {
      const res = await fetch(`/api/b2b/colect/lookbook/${encodeURIComponent(lookbookId)}/structure`);
      const data = await res.ok ? res.json() : null;
      setStructure(data);
    } catch {
      setStructure(null);
    } finally {
      setStructureLoading(false);
    }
  };

  const loadContent = async () => {
    setContentLoading(true);
    try {
      const res = await fetch(`/api/b2b/colect/lookbook/${encodeURIComponent(lookbookId)}/content`);
      const data = await res.ok ? res.json() : [];
      setContent(Array.isArray(data) ? data : []);
    } catch {
      setContent([]);
    } finally {
      setContentLoading(false);
    }
  };

  const addToOrder = async () => {
    setAddToOrderMsg(null);
    setAddToOrderLoading(true);
    try {
      const res = await fetch('/api/b2b/colect/add-to-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lookbookId,
          keyLookId: 'demo-key-look',
          skus: [{ sku: 'DEMO-SKU-01', quantity: 2 }],
        }),
      });
      const data = await res.json();
      if (data.success) setAddToOrderMsg({ type: 'success', text: 'Добавлено в заказ' });
      else setAddToOrderMsg({ type: 'error', text: data.error ?? 'Ошибка' });
    } catch (e) {
      setAddToOrderMsg({ type: 'error', text: e instanceof Error ? e.message : 'Ошибка запроса' });
    } finally {
      setAddToOrderLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.brand.integrations}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Colect</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Структура лукбука (главы, Key Looks), контент (фото, видео, 3D), режимы показа, добавление в заказ — при появлении API.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Структура лукбука
            </CardTitle>
            <CardDescription>Главы, Key Looks. Добавление в заказ — при появлении API Colect.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <input
              type="text"
              placeholder="Lookbook ID"
              value={lookbookId}
              onChange={(e) => setLookbookId(e.target.value)}
              className="border rounded px-2 py-1.5 text-sm w-48"
            />
            <Button variant="outline" size="sm" onClick={loadStructure} disabled={structureLoading}>
              {structureLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Загрузить структуру
            </Button>
            {structure && (
              <p className="text-sm text-slate-600">
                {structure.name ?? structure.id} · глав: {structure.chapters?.length ?? 0}, Key Looks: {structure.keyLooks?.length ?? 0}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <Image className="h-4 w-4" /> Контент и режимы показа
            </CardTitle>
            <CardDescription>Фото, видео, 3D — по документации Colect. Режимы: галерея, презентация, полноэкран, сетка.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" size="sm" onClick={loadContent} disabled={contentLoading}>
              {contentLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Загрузить контент
            </Button>
            {content.length > 0 && <p className="text-sm text-slate-600">Элементов: {content.length}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" /> Добавить Key Look в заказ
            </CardTitle>
            <CardDescription>При появлении API — отправка в Colect или создание строк в B2B заказе.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button onClick={addToOrder} disabled={addToOrderLoading}>
              {addToOrderLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Добавить в заказ
            </Button>
            {addToOrderMsg && (
              <span className={addToOrderMsg.type === 'success' ? 'text-green-600' : 'text-red-600'}>
                {addToOrderMsg.type === 'success' ? <CheckCircle2 className="inline h-4 w-4 mr-1" /> : <AlertCircle className="inline h-4 w-4 mr-1" />}
                {addToOrderMsg.text}
              </span>
            )}
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase">При появлении API</CardTitle>
            <CardDescription>
              Настройте COLECT_API_URL и COLECT_ACCESS_TOKEN. Эндпоинты структуры, контента и add-to-order будут вызывать реальный API Colect.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-4 flex gap-2">
        <Link href={ROUTES.brand.lookbookProjects}>
          <Button variant="outline" size="sm">Проекты лукбуков</Button>
        </Link>
        <Link href={ROUTES.brand.integrationsZedonk}>
          <Button variant="ghost" size="sm">Zedonk</Button>
        </Link>
      </div>
    </div>
  );
}
