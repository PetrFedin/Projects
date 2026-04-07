'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, ArrowRight, ExternalLink, RefreshCw, AlertCircle, Database, LayoutGrid } from 'lucide-react';
import { products } from '@/lib/products';
import { getMarketplaceMapping } from '@/lib/fashion/marketplace-mapping';
import { Button } from '@/components/ui/button';

export default function MarketplaceMappingPage() {
  const mappingResults = products.slice(0, 10).map(p => ({
    product: p,
    mapping: getMarketplaceMapping(p)
  }));
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Share2 className="w-6 h-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Marketplace SKU Mapping (RF)</h1>
        </div>
        <p className="text-muted-foreground">
          Синхронизация внутренних SKU с карточками товаров на Wildberries, Ozon и Lamoda.
        </p>
      </div>

      <div className="space-y-4">
        {mappingResults.map(({ product, mapping }) => (
          <Card key={product.id} className="p-4 overflow-hidden border-2 border-slate-50 hover:border-purple-100 transition-colors">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <div className="flex items-center gap-4 w-full lg:w-1/3">
                <div className="w-12 h-16 bg-slate-100 rounded overflow-hidden border shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{product.sku}</div>
                  <div className="text-sm font-bold truncate text-slate-700">{product.name}</div>
                  <Badge variant="outline" className="text-[9px] h-3.5 mt-1">{product.category}</Badge>
                </div>
              </div>

              <div className="flex-1 w-full grid grid-cols-3 gap-4">
                <div className="p-3 bg-white rounded-lg border border-slate-100">
                  <div className="text-[9px] font-black text-slate-400 uppercase mb-1.5 leading-none">Wildberries</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-600">{mapping.wildberriesId || '—'}</span>
                    <ExternalLink className="w-3 h-3 text-slate-300" />
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-100">
                  <div className="text-[9px] font-black text-slate-400 uppercase mb-1.5 leading-none">Ozon</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-600">{mapping.ozonId || '—'}</span>
                    <ExternalLink className="w-3 h-3 text-slate-300" />
                  </div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-100">
                  <div className="text-[9px] font-black text-slate-400 uppercase mb-1.5 leading-none">Lamoda</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-600">{mapping.lamodaId || '—'}</span>
                    {mapping.lamodaId && <ExternalLink className="w-3 h-3 text-slate-300" />}
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-48 flex lg:flex-col items-center lg:items-end justify-between gap-2">
                <Badge className={mapping.status === 'synced' ? 'bg-green-500' : 'bg-red-500'}>
                  {mapping.status.toUpperCase()}
                </Badge>
                <div className="text-[10px] font-black text-slate-400 uppercase">
                  Feed Sync: {mapping.lastFeedUpdate}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-2 border-slate-100 bg-slate-50/20">
          <div className="flex items-center gap-3 mb-4 text-purple-600">
             <RefreshCw className="w-5 h-5" />
             <h3 className="font-bold text-sm uppercase">Auto-Sync Status</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Active Channels</span>
              <span className="font-black">3</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Errors Detected</span>
              <span className="font-black text-red-500">2 SKU</span>
            </div>
            <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 font-bold uppercase text-[10px] h-9">
              Run Full Sync Now
            </Button>
          </div>
        </Card>

        <Card className="p-6 border-2 border-slate-100 bg-slate-50/20">
          <div className="flex items-center gap-3 mb-4 text-blue-600">
             <Database className="w-5 h-5" />
             <h3 className="font-bold text-sm uppercase">Stock Export (XLSX)</h3>
          </div>
          <div className="space-y-4">
            <div className="text-[11px] text-slate-500 leading-tight mb-2">
              Generate formatted inventory reports for marketplace backoffices.
            </div>
            <div className="grid grid-cols-2 gap-2">
               <Button variant="outline" size="sm" className="text-[10px] font-bold h-8">WB Format</Button>
               <Button variant="outline" size="sm" className="text-[10px] font-bold h-8">Ozon Feed</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-slate-100 bg-slate-50/20">
          <div className="flex items-center gap-3 mb-4 text-amber-600">
             <LayoutGrid className="w-5 h-5" />
             <h3 className="font-bold text-sm uppercase">Rich Content Status</h3>
          </div>
          <div className="space-y-3">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] font-bold text-slate-600 uppercase">Video Previews OK</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-[10px] font-bold text-slate-600 uppercase">Missing Rich-Cards (4)</span>
             </div>
             <div className="mt-2 text-[10px] font-bold text-blue-500 uppercase cursor-pointer hover:underline flex items-center gap-1">
                Go to Content Hub <ArrowRight className="w-3 h-3" />
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
