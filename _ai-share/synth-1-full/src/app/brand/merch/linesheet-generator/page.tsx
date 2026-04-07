'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Share2, Eye, History, Layers, CheckCircle2, ShoppingBag } from 'lucide-react';
import { products } from '@/lib/products';
import { generateLineSheet } from '@/lib/fashion/linesheet-generator';
import { Button } from '@/components/ui/button';

export default function LineSheetGeneratorPage() {
  const ls = generateLineSheet(products);
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-slate-800 rounded-lg shadow-sm">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 tracking-tighter uppercase">Line Sheet Generator</h1>
        </div>
        <p className="text-muted-foreground font-medium">
           Автоматическая генерация оптовых каталогов и спецификаций для B2B-партнеров.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Editor / Preview */}
        <div className="lg:col-span-3 space-y-6">
           <Card className="p-8 border-2 border-slate-100 shadow-xl min-h-[800px] relative">
              <div className="flex justify-between items-start border-b pb-8 mb-8">
                 <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{ls.collectionName}</h2>
                    <div className="text-xs font-bold text-slate-400 uppercase mt-1">Ref: {ls.id} • Last Export: {ls.lastExported}</div>
                 </div>
                 <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase">Brand Name</div>
                    <div className="text-xl font-black text-slate-800 uppercase tracking-widest">SYNTH-MODA</div>
                 </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                 {ls.items.map((item) => {
                   const p = products.find(prod => prod.sku === item.sku);
                   if (!p) return null;
                   return (
                     <div key={item.sku} className="group cursor-pointer">
                        <div className="aspect-[3/4] bg-slate-50 rounded-lg overflow-hidden border border-slate-100 mb-3 relative">
                           <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                           <div className="absolute top-2 left-2">
                              <Badge className="bg-white/90 text-slate-800 text-[8px] font-black border-none shadow-sm uppercase">{p.sku}</Badge>
                           </div>
                        </div>
                        <div className="space-y-1">
                           <div className="text-[10px] font-black text-slate-800 uppercase truncate">{p.name}</div>
                           <div className="flex justify-between items-center pt-1 border-t border-slate-50">
                              <div className="text-xs font-black text-slate-900">${item.wholesalePrice} <span className="text-[8px] text-slate-400">WHSL</span></div>
                              <div className="text-[9px] font-bold text-slate-400">MOQ: {item.moq}</div>
                           </div>
                        </div>
                     </div>
                   );
                 })}
              </div>

              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center pt-8 border-t text-[9px] font-black text-slate-300 uppercase tracking-widest">
                 <span>© 2026 SYNTH-MODA Wholesale</span>
                 <span>Page 1 of 1</span>
              </div>
           </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
           <Card className="p-6 border-2 border-slate-100 bg-white shadow-md">
              <h3 className="font-black text-sm uppercase text-slate-800 mb-6 flex items-center gap-2">
                 <Layers className="w-4 h-4 text-indigo-500" /> Export Options
              </h3>
              <div className="space-y-3">
                 <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black uppercase text-[10px] h-10 shadow-lg tracking-widest">
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                 </Button>
                 <Button variant="outline" className="w-full font-black uppercase text-[10px] h-10 border-slate-200">
                    <Share2 className="w-4 h-4 mr-2" /> Share via Link
                 </Button>
                 <Button variant="outline" className="w-full font-black uppercase text-[10px] h-10 border-slate-200">
                    <Eye className="w-4 h-4 mr-2" /> Open Portal
                 </Button>
              </div>
           </Card>

           <Card className="p-6 border-2 border-slate-100 bg-slate-50/20 shadow-md">
              <h3 className="font-black text-sm uppercase text-slate-600 mb-4">Settings</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase text-[9px]">Prices</span>
                    <Badge variant="outline" className="bg-white text-[8px] font-black uppercase">Wholesale</Badge>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase text-[9px]">Currency</span>
                    <Badge variant="outline" className="bg-white text-[8px] font-black uppercase">USD ($)</Badge>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase text-[9px]">SKU Limit</span>
                    <span className="font-black text-slate-800">15 / 50</span>
                 </div>
              </div>
           </Card>

           <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3 items-start shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-[10px] text-emerald-700 font-medium leading-tight">
                 <b>Smart Auto-fill:</b> Цены рассчитаны с учетом 45% маржи для ритейлера на основе ваших розничных цен.
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
