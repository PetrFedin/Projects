'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  Share2,
  Eye,
  History,
  Layers,
  CheckCircle2,
  ShoppingBag,
} from 'lucide-react';
import { products } from '@/lib/products';
import { generateLineSheet } from '@/lib/fashion/linesheet-generator';
import { Button } from '@/components/ui/button';

export default function LineSheetGeneratorPage() {
  const ls = generateLineSheet(products);

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-lg bg-slate-800 p-2 shadow-sm">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-tight tracking-tighter text-slate-800">
            Генератор лайншита
          </h1>
        </div>
        <p className="font-medium text-muted-foreground">
          Автоматическая генерация оптовых каталогов и спецификаций для B2B-партнеров.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Main Editor / Preview */}
        <div className="space-y-6 lg:col-span-3">
          <Card className="relative min-h-[800px] border-2 border-slate-100 p-8 shadow-xl">
            <div className="mb-8 flex items-start justify-between border-b pb-8">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-800">
                  {ls.collectionName}
                </h2>
                <div className="mt-1 text-xs font-bold uppercase text-slate-400">
                  Ref: {ls.id} • Last Export: {ls.lastExported}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black uppercase text-slate-400">Бренд</div>
                <div className="text-xl font-black uppercase tracking-widest text-slate-800">
                  SYNTH-MODA
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              {ls.items.map((item) => {
                const p = products.find((prod) => prod.sku === item.sku);
                if (!p) return null;
                return (
                  <div key={item.sku} className="group cursor-pointer">
                    <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                      <img
                        src={p.images?.[0]?.url ?? ''}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute left-2 top-2">
                        <Badge className="border-none bg-white/90 text-[8px] font-black uppercase text-slate-800 shadow-sm">
                          {p.sku}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="truncate text-[10px] font-black uppercase text-slate-800">
                        {p.name}
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-50 pt-1">
                        <div className="text-xs font-black text-slate-900">
                          {item.wholesalePrice.toLocaleString('ru-RU')} ₽{' '}
                          <span className="text-[8px] text-slate-400">ОПТ</span>
                        </div>
                        <div className="text-[9px] font-bold text-slate-400">MOQ: {item.moq}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between border-t pt-8 text-[9px] font-black uppercase tracking-widest text-slate-300">
              <span>© 2026 SYNTH-MODA — оптовый каталог</span>
              <span>Page 1 of 1</span>
            </div>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <Card className="border-2 border-slate-100 bg-white p-6 shadow-md">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-black uppercase text-slate-800">
              <Layers className="h-4 w-4 text-indigo-500" /> Экспорт
            </h3>
            <div className="space-y-3">
              <Button className="h-10 w-full bg-slate-800 text-[10px] font-black uppercase tracking-widest text-white shadow-lg hover:bg-slate-900">
                <Download className="mr-2 h-4 w-4" /> Скачать PDF
              </Button>
              <Button
                variant="outline"
                className="h-10 w-full border-slate-200 text-[10px] font-black uppercase"
              >
                <Share2 className="mr-2 h-4 w-4" /> Ссылка для партнёра
              </Button>
              <Button
                variant="outline"
                className="h-10 w-full border-slate-200 text-[10px] font-black uppercase"
              >
                <Eye className="mr-2 h-4 w-4" /> Открыть портал
              </Button>
            </div>
          </Card>

          <Card className="border-2 border-slate-100 bg-slate-50/20 p-6 shadow-md">
            <h3 className="mb-4 text-sm font-black uppercase text-slate-600">Настройки</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[9px] font-bold uppercase text-slate-500">Цены</span>
                <Badge variant="outline" className="bg-white text-[8px] font-black uppercase">
                  Опт
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[9px] font-bold uppercase text-slate-500">Валюта</span>
                <Badge variant="outline" className="bg-white text-[8px] font-black uppercase">
                  RUB (₽)
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[9px] font-bold uppercase text-slate-500">Лимит SKU</span>
                <span className="font-black text-slate-800">15 / 50</span>
              </div>
            </div>
          </Card>

          <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <div className="text-[10px] font-medium leading-tight text-emerald-700">
              <b>Smart Auto-fill:</b> Цены рассчитаны с учетом 45% маржи для ритейлера на основе
              ваших розничных цен.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
