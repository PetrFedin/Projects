'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Zap, Plus, Trash2, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getShopB2BHubLinks } from '@/lib/data/entity-links';

/** NuOrder/JOOR: быстрый заказ по артикулам — ввод строк "стиль / размер / кол-во" без каталога. */
type QuickLine = { styleNumber: string; size: string; qty: string };

const DEFAULT_LINE: QuickLine = { styleNumber: '', size: '', qty: '0' };
const MOCK_SIZES = ['XS', 'S', 'M', 'L', 'XL', '36', '38', '40', '42'];
/** NuOrder/SparkLayer: фильтр по сезону для быстрого поиска артикулов */
const SEASONS = [
  { value: '', label: 'Все сезоны' },
  { value: 'FW26', label: 'FW26' },
  { value: 'SS26', label: 'SS26' },
  { value: 'FW25', label: 'FW25' },
  { value: 'SS25', label: 'SS25' },
];
/** Фильтр по цвету (Fashion Cloud / Colect) */
const COLORS = [
  { value: '', label: 'Все цвета' },
  { value: 'black', label: 'Чёрный' },
  { value: 'white', label: 'Белый' },
  { value: 'navy', label: 'Тёмно-синий' },
  { value: 'grey', label: 'Серый' },
  { value: 'beige', label: 'Бежевый' },
  { value: 'denim', label: 'Деним' },
];

export default function QuickOrderPage() {
  const router = useRouter();
  const [brand, setBrand] = useState('Syntha');
  const [season, setSeason] = useState('');
  const [color, setColor] = useState('');
  const [lines, setLines] = useState<QuickLine[]>([{ ...DEFAULT_LINE }]);

  const addLine = () => setLines((prev) => [...prev, { ...DEFAULT_LINE }]);
  const removeLine = (i: number) => setLines((prev) => prev.filter((_, idx) => idx !== i));
  const updateLine = (i: number, field: keyof QuickLine, value: string) => {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  };

  const validLines = lines.filter((l) => l.styleNumber.trim() && parseInt(l.qty, 10) > 0);
  const canSubmit = validLines.length > 0;

  const handleSubmit = () => {
    const params = new URLSearchParams({
      mode: 'quick',
      brand,
      lines: JSON.stringify(validLines.map((l) => ({ style: l.styleNumber.trim(), size: l.size || 'M', qty: parseInt(l.qty, 10) }))),
    });
    if (season) params.set('season', season);
    if (color) params.set('color', color);
    router.push(`${ROUTES.shop.b2bMatrix}?${params.toString()}`);
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.shop.b2bOrderMode}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2"><Zap className="h-6 w-6" /> Быстрый заказ по артикулам</h1>
          <p className="text-slate-500 text-sm mt-0.5">NuOrder/JOOR: введите артикулы стилей, размеры и количество — затем перейдите в матрицу для проверки и отправки.</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Строки заказа</CardTitle>
          <CardDescription>Стиль (артикул), размер и количество. Пустые строки и qty=0 не учитываются. В матрице заказа отображается ATS (доступно к продаже) по размеру; при превышении — предупреждение «недостаточно остатка».</CardDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            <div>
              <Label className="text-xs text-slate-500">Бренд</Label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm w-[180px] block mt-0.5"
              >
                <option value="Syntha">Syntha</option>
                <option value="A.P.C.">A.P.C.</option>
                <option value="Acne Studios">Acne Studios</option>
              </select>
            </div>
            <div>
              <Label className="text-xs text-slate-500">Сезон</Label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm w-[140px] block mt-0.5"
              >
                {SEASONS.map((s) => (
                  <option key={s.value || 'all'} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs text-slate-500">Цвет</Label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm w-[140px] block mt-0.5"
              >
                {COLORS.map((c) => (
                  <option key={c.value || 'all'} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            {(season || color) && (
              <span className="text-xs text-slate-400 self-end pb-2">Фильтр: {[season, color].filter(Boolean).join(' · ') || '—'}</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-[1fr_100px_80px_40px] gap-2 text-xs font-medium text-slate-500 uppercase">
            <span>Артикул / стиль</span>
            <span>Размер</span>
            <span>Кол-во</span>
            <span></span>
          </div>
          {lines.map((line, i) => (
            <div key={i} className="grid grid-cols-[1fr_100px_80px_40px] gap-2 items-center">
              <Input
                placeholder="CTP-26-001"
                value={line.styleNumber}
                onChange={(e) => updateLine(i, 'styleNumber', e.target.value)}
                className="font-mono text-sm"
              />
              <select
                value={line.size}
                onChange={(e) => updateLine(i, 'size', e.target.value)}
                className="rounded-md border border-slate-200 px-2 py-2 text-sm h-9"
              >
                <option value="">—</option>
                {MOCK_SIZES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <Input
                type="number"
                min={0}
                value={line.qty}
                onChange={(e) => updateLine(i, 'qty', e.target.value)}
                className="h-9"
              />
              <Button type="button" variant="ghost" size="icon" className="h-9 w-9 text-slate-400" onClick={() => removeLine(i)} disabled={lines.length <= 1}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addLine} className="mt-2">
            <Plus className="h-4 w-4 mr-2" /> Добавить строку
          </Button>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-slate-500">Строк к заказу: {validLines.length}</p>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            В матрицу с выбранными позициями <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bCreateOrder}>Написание по коллекции</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bReorder}>Reorder из истории</Link></Button>
        <Button variant="outline" size="sm" asChild><Link href={ROUTES.shop.b2bEzOrder}>EZ Order</Link></Button>
      </div>
      <RelatedModulesBlock links={getShopB2BHubLinks()} title="Матрица, EZ Order, шаблоны" />
    </div>
  );
}
