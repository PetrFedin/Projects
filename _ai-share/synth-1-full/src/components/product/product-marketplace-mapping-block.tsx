'use client';

import React from 'react';
import type { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { getMarketplaceMapping } from '@/lib/fashion/marketplace-mapping';

export const ProductMarketplaceMappingBlock: React.FC<{ product: Product }> = ({ product }) => {
  const m = getMarketplaceMapping(product);

  return (
    <Card className="border-2 border-slate-100 bg-slate-50/10 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="h-4 w-4 text-purple-500" />
          <h4 className="text-xs font-bold uppercase tracking-tight text-slate-600">
            Marketplace Sync (MP)
          </h4>
        </div>
        <Badge
          variant="outline"
          className={`text-[9px] font-black uppercase ${m.status === 'synced' ? 'border-green-200 bg-green-50 text-green-600' : 'border-red-200 bg-red-50 text-red-600'}`}
        >
          {m.status === 'synced' ? (
            <CheckCircle2 className="mr-1 h-2.5 w-2.5" />
          ) : (
            <AlertCircle className="mr-1 h-2.5 w-2.5" />
          )}
          {m.status}
        </Badge>
      </div>

      <div className="space-y-2.5">
        {m.wildberriesId && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">
              Wildberries
            </span>
            <div className="flex items-center gap-1.5 font-mono text-slate-700">
              {m.wildberriesId} <ExternalLink className="h-3 w-3 text-slate-300" />
            </div>
          </div>
        )}
        {m.ozonId && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Ozon</span>
            <div className="flex items-center gap-1.5 font-mono text-slate-700">
              {m.ozonId} <ExternalLink className="h-3 w-3 text-slate-300" />
            </div>
          </div>
        )}
        {m.lamodaId && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] font-bold uppercase text-muted-foreground">Lamoda</span>
            <div className="flex items-center gap-1.5 font-mono text-slate-700">
              {m.lamodaId} <ExternalLink className="h-3 w-3 text-slate-300" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-3 text-[9px] font-bold uppercase text-slate-400">
        <span>Last Feed Update: {m.lastFeedUpdate}</span>
        <span className="text-purple-600">Active Feed</span>
      </div>
    </Card>
  );
};
