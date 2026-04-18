'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Share2,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Database,
  LayoutGrid,
} from 'lucide-react';
import { products } from '@/lib/products';
import { getMarketplaceMapping } from '@/lib/fashion/marketplace-mapping';
import { Button } from '@/components/ui/button';

export default function MarketplaceMappingPage() {
  const mappingResults = products.slice(0, 10).map((p) => ({
    product: p,
    mapping: getMarketplaceMapping(p),
  }));

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
<<<<<<< HEAD
          <div className="rounded-lg bg-purple-100 p-2">
            <Share2 className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
=======
          <div className="bg-accent-primary/15 rounded-lg p-2">
            <Share2 className="text-accent-primary h-6 w-6" />
          </div>
          <h1 className="text-text-primary text-3xl font-bold tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
            Marketplace SKU Mapping (RF)
          </h1>
        </div>
        <p className="text-muted-foreground">
          Синхронизация внутренних SKU с карточками товаров на Wildberries, Ozon и Lamoda.
        </p>
      </div>

      <div className="space-y-4">
        {mappingResults.map(({ product, mapping }) => (
          <Card
            key={product.id}
<<<<<<< HEAD
            className="overflow-hidden border-2 border-slate-50 p-4 transition-colors hover:border-purple-100"
          >
            <div className="flex flex-col items-center gap-6 lg:flex-row">
              <div className="flex w-full items-center gap-4 lg:w-1/3">
                <div className="h-16 w-12 shrink-0 overflow-hidden rounded border bg-slate-100">
                  <img
                    src={product.image}
=======
            className="border-border-subtle hover:border-accent-primary/20 overflow-hidden border-2 p-4 transition-colors"
          >
            <div className="flex flex-col items-center gap-6 lg:flex-row">
              <div className="flex w-full items-center gap-4 lg:w-1/3">
                <div className="bg-bg-surface2 h-16 w-12 shrink-0 overflow-hidden rounded border">
                  <img
                    src={product.images?.[0]?.url ?? ''}
>>>>>>> recover/cabinet-wip-from-stash
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
<<<<<<< HEAD
                  <div className="mb-1 text-[10px] font-black uppercase leading-none text-slate-400">
                    {product.sku}
                  </div>
                  <div className="truncate text-sm font-bold text-slate-700">{product.name}</div>
=======
                  <div className="text-text-muted mb-1 text-[10px] font-black uppercase leading-none">
                    {product.sku}
                  </div>
                  <div className="text-text-primary truncate text-sm font-bold">{product.name}</div>
>>>>>>> recover/cabinet-wip-from-stash
                  <Badge variant="outline" className="mt-1 h-3.5 text-[9px]">
                    {product.category}
                  </Badge>
                </div>
              </div>

              <div className="grid w-full flex-1 grid-cols-3 gap-4">
<<<<<<< HEAD
                <div className="rounded-lg border border-slate-100 bg-white p-3">
                  <div className="mb-1.5 text-[9px] font-black uppercase leading-none text-slate-400">
                    Wildberries
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-600">
                      {mapping.wildberriesId || '—'}
                    </span>
                    <ExternalLink className="h-3 w-3 text-slate-300" />
                  </div>
                </div>
                <div className="rounded-lg border border-slate-100 bg-white p-3">
                  <div className="mb-1.5 text-[9px] font-black uppercase leading-none text-slate-400">
                    Ozon
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-600">
                      {mapping.ozonId || '—'}
                    </span>
                    <ExternalLink className="h-3 w-3 text-slate-300" />
                  </div>
                </div>
                <div className="rounded-lg border border-slate-100 bg-white p-3">
                  <div className="mb-1.5 text-[9px] font-black uppercase leading-none text-slate-400">
                    Lamoda
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-600">
                      {mapping.lamodaId || '—'}
                    </span>
                    {mapping.lamodaId && <ExternalLink className="h-3 w-3 text-slate-300" />}
=======
                <div className="border-border-subtle rounded-lg border bg-white p-3">
                  <div className="text-text-muted mb-1.5 text-[9px] font-black uppercase leading-none">
                    Wildberries
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary font-mono text-xs font-bold">
                      {mapping.wildberriesId || '—'}
                    </span>
                    <ExternalLink className="text-text-muted h-3 w-3" />
                  </div>
                </div>
                <div className="border-border-subtle rounded-lg border bg-white p-3">
                  <div className="text-text-muted mb-1.5 text-[9px] font-black uppercase leading-none">
                    Ozon
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary font-mono text-xs font-bold">
                      {mapping.ozonId || '—'}
                    </span>
                    <ExternalLink className="text-text-muted h-3 w-3" />
                  </div>
                </div>
                <div className="border-border-subtle rounded-lg border bg-white p-3">
                  <div className="text-text-muted mb-1.5 text-[9px] font-black uppercase leading-none">
                    Lamoda
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary font-mono text-xs font-bold">
                      {mapping.lamodaId || '—'}
                    </span>
                    {mapping.lamodaId && <ExternalLink className="text-text-muted h-3 w-3" />}
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                </div>
              </div>

              <div className="flex w-full items-center justify-between gap-2 lg:w-48 lg:flex-col lg:items-end">
                <Badge className={mapping.status === 'synced' ? 'bg-green-500' : 'bg-red-500'}>
                  {mapping.status.toUpperCase()}
                </Badge>
<<<<<<< HEAD
                <div className="text-[10px] font-black uppercase text-slate-400">
=======
                <div className="text-text-muted text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                  Feed Sync: {mapping.lastFeedUpdate}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
<<<<<<< HEAD
        <Card className="border-2 border-slate-100 bg-slate-50/20 p-6">
          <div className="mb-4 flex items-center gap-3 text-purple-600">
=======
        <Card className="border-border-subtle bg-bg-surface2/20 border-2 p-6">
          <div className="text-accent-primary mb-4 flex items-center gap-3">
>>>>>>> recover/cabinet-wip-from-stash
            <RefreshCw className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase">Auto-Sync Status</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
<<<<<<< HEAD
              <span className="text-[10px] font-bold uppercase text-slate-500">
=======
              <span className="text-text-secondary text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                Active Channels
              </span>
              <span className="font-black">3</span>
            </div>
            <div className="flex items-center justify-between text-xs">
<<<<<<< HEAD
              <span className="text-[10px] font-bold uppercase text-slate-500">
=======
              <span className="text-text-secondary text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                Errors Detected
              </span>
              <span className="font-black text-red-500">2 SKU</span>
            </div>
            <Button
              size="sm"
<<<<<<< HEAD
              className="h-9 w-full bg-purple-600 text-[10px] font-bold uppercase hover:bg-purple-700"
=======
              className="bg-accent-primary hover:bg-accent-primary h-9 w-full text-[10px] font-bold uppercase"
>>>>>>> recover/cabinet-wip-from-stash
            >
              Run Full Sync Now
            </Button>
          </div>
        </Card>

<<<<<<< HEAD
        <Card className="border-2 border-slate-100 bg-slate-50/20 p-6">
=======
        <Card className="border-border-subtle bg-bg-surface2/20 border-2 p-6">
>>>>>>> recover/cabinet-wip-from-stash
          <div className="mb-4 flex items-center gap-3 text-blue-600">
            <Database className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase">Stock Export (XLSX)</h3>
          </div>
          <div className="space-y-4">
<<<<<<< HEAD
            <div className="mb-2 text-[11px] leading-tight text-slate-500">
=======
            <div className="text-text-secondary mb-2 text-[11px] leading-tight">
>>>>>>> recover/cabinet-wip-from-stash
              Generate formatted inventory reports for marketplace backoffices.
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold">
                WB Format
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold">
                Ozon Feed
              </Button>
            </div>
          </div>
        </Card>

<<<<<<< HEAD
        <Card className="border-2 border-slate-100 bg-slate-50/20 p-6">
=======
        <Card className="border-border-subtle bg-bg-surface2/20 border-2 p-6">
>>>>>>> recover/cabinet-wip-from-stash
          <div className="mb-4 flex items-center gap-3 text-amber-600">
            <LayoutGrid className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase">Rich Content Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
<<<<<<< HEAD
              <span className="text-[10px] font-bold uppercase text-slate-600">
=======
              <span className="text-text-secondary text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                Video Previews OK
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
<<<<<<< HEAD
              <span className="text-[10px] font-bold uppercase text-slate-600">
=======
              <span className="text-text-secondary text-[10px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                Missing Rich-Cards (4)
              </span>
            </div>
            <div className="mt-2 flex cursor-pointer items-center gap-1 text-[10px] font-bold uppercase text-blue-500 hover:underline">
              Go to Content Hub <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
