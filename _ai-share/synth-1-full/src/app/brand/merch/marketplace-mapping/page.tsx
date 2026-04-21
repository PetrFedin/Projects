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
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';

export default function MarketplaceMappingPage() {
  const mappingResults = products.slice(0, 10).map((p) => ({
    product: p,
    mapping: getMarketplaceMapping(p),
  }));

  return (
    <CabinetPageContent maxWidth="6xl" className="space-y-6 p-8 pb-24">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="bg-accent-primary/15 rounded-lg p-2">
            <Share2 className="text-accent-primary h-6 w-6" />
          </div>
          <h1 className="text-text-primary text-3xl font-bold tracking-tight">
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
            className="border-border-subtle hover:border-accent-primary/20 overflow-hidden border-2 p-4 transition-colors"
          >
            <div className="flex flex-col items-center gap-6 lg:flex-row">
              <div className="flex w-full items-center gap-4 lg:w-1/3">
                <div className="bg-bg-surface2 h-16 w-12 shrink-0 overflow-hidden rounded border">
                  <img
                    src={product.images?.[0]?.url ?? ''}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-text-muted mb-1 text-[10px] font-black uppercase leading-none">
                    {product.sku}
                  </div>
                  <div className="text-text-primary truncate text-sm font-bold">{product.name}</div>
                  <Badge variant="outline" className="mt-1 h-3.5 text-[9px]">
                    {product.category}
                  </Badge>
                </div>
              </div>

              <div className="grid w-full flex-1 grid-cols-3 gap-4">
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
                  </div>
                </div>
              </div>

              <div className="flex w-full items-center justify-between gap-2 lg:w-48 lg:flex-col lg:items-end">
                <Badge className={mapping.status === 'synced' ? 'bg-green-500' : 'bg-red-500'}>
                  {mapping.status.toUpperCase()}
                </Badge>
                <div className="text-text-muted text-[10px] font-black uppercase">
                  Feed Sync: {mapping.lastFeedUpdate}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-border-subtle bg-bg-surface2/20 border-2 p-6">
          <div className="text-accent-primary mb-4 flex items-center gap-3">
            <RefreshCw className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase">Auto-Sync Status</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary text-[10px] font-bold uppercase">
                Active Channels
              </span>
              <span className="font-black">3</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary text-[10px] font-bold uppercase">
                Errors Detected
              </span>
              <span className="font-black text-red-500">2 SKU</span>
            </div>
            <Button
              size="sm"
              className="bg-accent-primary hover:bg-accent-primary h-9 w-full text-[10px] font-bold uppercase"
            >
              Run Full Sync Now
            </Button>
          </div>
        </Card>

        <Card className="border-border-subtle bg-bg-surface2/20 border-2 p-6">
          <div className="mb-4 flex items-center gap-3 text-blue-600">
            <Database className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase">Stock Export (XLSX)</h3>
          </div>
          <div className="space-y-4">
            <div className="text-text-secondary mb-2 text-[11px] leading-tight">
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

        <Card className="border-border-subtle bg-bg-surface2/20 border-2 p-6">
          <div className="mb-4 flex items-center gap-3 text-amber-600">
            <LayoutGrid className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase">Rich Content Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-text-secondary text-[10px] font-bold uppercase">
                Video Previews OK
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-text-secondary text-[10px] font-bold uppercase">
                Missing Rich-Cards (4)
              </span>
            </div>
            <div className="mt-2 flex cursor-pointer items-center gap-1 text-[10px] font-bold uppercase text-blue-500 hover:underline">
              Go to Content Hub <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </Card>
      </div>
    </CabinetPageContent>
  );
}
