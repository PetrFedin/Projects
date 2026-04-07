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
    <Card className="p-4 border-2 border-slate-100 bg-slate-50/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-purple-500" />
          <h4 className="font-bold text-xs uppercase text-slate-600 tracking-tight">Marketplace Sync (MP)</h4>
        </div>
        <Badge variant="outline" className={`text-[9px] font-black uppercase ${m.status === 'synced' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
          {m.status === 'synced' ? <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> : <AlertCircle className="w-2.5 h-2.5 mr-1" />}
          {m.status}
        </Badge>
      </div>

      <div className="space-y-2.5">
        {m.wildberriesId && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-bold uppercase text-[10px]">Wildberries</span>
            <div className="flex items-center gap-1.5 font-mono text-slate-700">
              {m.wildberriesId} <ExternalLink className="w-3 h-3 text-slate-300" />
            </div>
          </div>
        )}
        {m.ozonId && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-bold uppercase text-[10px]">Ozon</span>
            <div className="flex items-center gap-1.5 font-mono text-slate-700">
              {m.ozonId} <ExternalLink className="w-3 h-3 text-slate-300" />
            </div>
          </div>
        )}
        {m.lamodaId && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-bold uppercase text-[10px]">Lamoda</span>
            <div className="flex items-center gap-1.5 font-mono text-slate-700">
              {m.lamodaId} <ExternalLink className="w-3 h-3 text-slate-300" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t text-[9px] text-slate-400 font-bold uppercase flex justify-between items-center">
        <span>Last Feed Update: {m.lastFeedUpdate}</span>
        <span className="text-purple-600">Active Feed</span>
      </div>
    </Card>
  );
};
