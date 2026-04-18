'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';
import { useToast } from '@/hooks/use-toast';

/** JOOR: шаблоны заказов по коллекциям — сохранённые наборы позиций для быстрого повторного заказа. */
const MOCK_TEMPLATES = [
  {
    id: '1',
    name: 'Syntha FW26 — базовая сетка',
    brand: 'Syntha',
    collection: 'Основная коллекция',
    itemsCount: 12,
    updatedAt: '2025-03-01',
  },
  {
    id: '2',
    name: 'A.P.C. деним — повтор',
    brand: 'A.P.C.',
    collection: 'Деним',
    itemsCount: 8,
    updatedAt: '2025-02-15',
  },
];

export default function OrderTemplatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const saveFromOrderId = searchParams.get('saveFrom');
  const [saveFromDismissed, setSaveFromDismissed] = useState(false);
  const { toast } = useToast();
  const [templateName, setTemplateName] = useState('');

  useEffect(() => {
    if (saveFromOrderId) setTemplateName(`Заказ ${saveFromOrderId}`);
  }, [saveFromOrderId]);

  const handleSaveFromOrder = () => {
    toast({
      title: 'Шаблон сохранён',
      description: `Заказ ${saveFromOrderId} сохранён как шаблон «${templateName || 'Без имени'}».`,
    });
    setSaveFromDismissed(true);
    router.replace(ROUTES.shop.b2bOrderTemplates);
  };

  const showSaveFrom = saveFromOrderId && !saveFromDismissed;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.shop.b2b}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
            <Copy className="h-6 w-6" /> Шаблоны заказов
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            JOOR: сохраняйте наборы позиций по коллекции и повторяйте заказ в один клик.
          </p>
        </div>
      </div>

      {showSaveFrom && (
        <Card className="mb-6 border-indigo-200 bg-indigo-50/30">
          <CardHeader>
            <CardTitle className="text-base">Сохранить заказ как шаблон</CardTitle>
            <CardDescription>
              Заказ {saveFromOrderId} будет сохранён как шаблон. Укажите имя шаблона.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label>Имя шаблона</Label>
            <Input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Например: Syntha FW26 — базовая сетка"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveFromOrder}>
              <Save className="mr-2 h-4 w-4" /> Сохранить шаблон
            </Button>
            <Button variant="ghost" asChild>
              <Link href={ROUTES.shop.b2bOrderTemplates}>Отмена</Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Мои шаблоны</CardTitle>
          <CardDescription>
            Создайте шаблон из текущего заказа или матрицы — затем примените к новому заказу
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_TEMPLATES.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
            >
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-slate-500">
                  {t.brand} · {t.collection} · {t.itemsCount} позиций · обновлён {t.updatedAt}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" asChild>
                  <Link href={`${ROUTES.shop.b2bMatrix}?template=${t.id}`}>Применить</Link>
                </Button>
                <Button size="sm" variant="ghost" className="text-slate-400">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mb-6">
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" /> Сохранить шаблон из заказа
        </Button>
        <p className="mt-2 text-xs text-slate-500">
          В карточке заказа или в матрице: «Сохранить как шаблон».
        </p>
      </div>

      <div className="mb-6 flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bCreateOrder}>Написание заказа</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.shop.b2bOrderByCollection}>Заказ по коллекции</Link>
        </Button>
      </div>
      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Матрица, заказы, Reorder" />
    </div>
  );
}
