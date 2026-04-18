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
<<<<<<< HEAD
          <div className="rounded-lg bg-slate-800 p-2 shadow-sm">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-tight tracking-tighter text-slate-800">
=======
          <div className="bg-text-primary/90 rounded-lg p-2 shadow-sm">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-text-primary text-3xl font-bold uppercase tracking-tight tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
            Line Sheet Generator
          </h1>
        </div>
        <p className="font-medium text-muted-foreground">
          Автоматическая генерация оптовых каталогов и спецификаций для B2B-партнеров.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Main Editor / Preview */}
        <div className="space-y-6 lg:col-span-3">
<<<<<<< HEAD
          <Card className="relative min-h-[800px] border-2 border-slate-100 p-8 shadow-xl">
            <div className="mb-8 flex items-start justify-between border-b pb-8">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-800">
                  {ls.collectionName}
                </h2>
                <div className="mt-1 text-xs font-bold uppercase text-slate-400">
=======
          <Card className="border-border-subtle relative min-h-[800px] border-2 p-8 shadow-xl">
            <div className="mb-8 flex items-start justify-between border-b pb-8">
              <div>
                <h2 className="text-text-primary text-2xl font-black uppercase tracking-tighter">
                  {ls.collectionName}
                </h2>
                <div className="text-text-muted mt-1 text-xs font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                  Ref: {ls.id} • Last Export: {ls.lastExported}
                </div>
              </div>
              <div className="text-right">
<<<<<<< HEAD
                <div className="text-[10px] font-black uppercase text-slate-400">Brand Name</div>
                <div className="text-xl font-black uppercase tracking-widest text-slate-800">
=======
                <div className="text-text-muted text-[10px] font-black uppercase">Brand Name</div>
                <div className="text-text-primary text-xl font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                    <div className="relative mb-3 aspect-[3/4] overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                      <img
                        src={p.image}
=======
                    <div className="bg-bg-surface2 border-border-subtle relative mb-3 aspect-[3/4] overflow-hidden rounded-lg border">
                      <img
                        src={p.images?.[0]?.url ?? ''}
>>>>>>> recover/cabinet-wip-from-stash
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute left-2 top-2">
<<<<<<< HEAD
                        <Badge className="border-none bg-white/90 text-[8px] font-black uppercase text-slate-800 shadow-sm">
=======
                        <Badge className="text-text-primary border-none bg-white/90 text-[8px] font-black uppercase shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
                          {p.sku}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
<<<<<<< HEAD
                      <div className="truncate text-[10px] font-black uppercase text-slate-800">
                        {p.name}
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-50 pt-1">
                        <div className="text-xs font-black text-slate-900">
                          ${item.wholesalePrice}{' '}
                          <span className="text-[8px] text-slate-400">WHSL</span>
                        </div>
                        <div className="text-[9px] font-bold text-slate-400">MOQ: {item.moq}</div>
=======
                      <div className="text-text-primary truncate text-[10px] font-black uppercase">
                        {p.name}
                      </div>
                      <div className="border-border-subtle flex items-center justify-between border-t pt-1">
                        <div className="text-text-primary text-xs font-black">
                          ${item.wholesalePrice}{' '}
                          <span className="text-text-muted text-[8px]">WHSL</span>
                        </div>
                        <div className="text-text-muted text-[9px] font-bold">MOQ: {item.moq}</div>
>>>>>>> recover/cabinet-wip-from-stash
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

<<<<<<< HEAD
            <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between border-t pt-8 text-[9px] font-black uppercase tracking-widest text-slate-300">
=======
            <div className="text-text-muted absolute bottom-8 left-8 right-8 flex items-center justify-between border-t pt-8 text-[9px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              <span>© 2026 SYNTH-MODA Wholesale</span>
              <span>Page 1 of 1</span>
            </div>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
<<<<<<< HEAD
          <Card className="border-2 border-slate-100 bg-white p-6 shadow-md">
            <h3 className="mb-6 flex items-center gap-2 text-sm font-black uppercase text-slate-800">
              <Layers className="h-4 w-4 text-indigo-500" /> Export Options
            </h3>
            <div className="space-y-3">
              <Button className="h-10 w-full bg-slate-800 text-[10px] font-black uppercase tracking-widest text-white shadow-lg hover:bg-slate-900">
=======
          <Card className="border-border-subtle border-2 bg-white p-6 shadow-md">
            <h3 className="text-text-primary mb-6 flex items-center gap-2 text-sm font-black uppercase">
              <Layers className="text-accent-primary h-4 w-4" /> Export Options
            </h3>
            <div className="space-y-3">
              <Button className="bg-text-primary/90 hover:bg-text-primary/90 h-10 w-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
              <Button
                variant="outline"
<<<<<<< HEAD
                className="h-10 w-full border-slate-200 text-[10px] font-black uppercase"
=======
                className="border-border-default h-10 w-full text-[10px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <Share2 className="mr-2 h-4 w-4" /> Share via Link
              </Button>
              <Button
                variant="outline"
<<<<<<< HEAD
                className="h-10 w-full border-slate-200 text-[10px] font-black uppercase"
=======
                className="border-border-default h-10 w-full text-[10px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <Eye className="mr-2 h-4 w-4" /> Open Portal
              </Button>
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="border-2 border-slate-100 bg-slate-50/20 p-6 shadow-md">
            <h3 className="mb-4 text-sm font-black uppercase text-slate-600">Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[9px] font-bold uppercase text-slate-500">Prices</span>
=======
          <Card className="border-border-subtle bg-bg-surface2/20 border-2 p-6 shadow-md">
            <h3 className="text-text-secondary mb-4 text-sm font-black uppercase">Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary text-[9px] font-bold uppercase">Prices</span>
>>>>>>> recover/cabinet-wip-from-stash
                <Badge variant="outline" className="bg-white text-[8px] font-black uppercase">
                  Wholesale
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
<<<<<<< HEAD
                <span className="text-[9px] font-bold uppercase text-slate-500">Currency</span>
=======
                <span className="text-text-secondary text-[9px] font-bold uppercase">Currency</span>
>>>>>>> recover/cabinet-wip-from-stash
                <Badge variant="outline" className="bg-white text-[8px] font-black uppercase">
                  USD ($)
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
<<<<<<< HEAD
                <span className="text-[9px] font-bold uppercase text-slate-500">SKU Limit</span>
                <span className="font-black text-slate-800">15 / 50</span>
=======
                <span className="text-text-secondary text-[9px] font-bold uppercase">
                  SKU Limit
                </span>
                <span className="text-text-primary font-black">15 / 50</span>
>>>>>>> recover/cabinet-wip-from-stash
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
