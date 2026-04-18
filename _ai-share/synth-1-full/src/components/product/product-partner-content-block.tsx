'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Share2,
  Send,
  CheckCircle2,
  CloudDownload,
  Instagram,
  MessageCircle,
  MoreHorizontal,
} from 'lucide-react';
import { getPartnerContentPacks } from '@/lib/fashion/partner-content';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductPartnerContentBlock({ product }: { product: Product }) {
  const pack = getPartnerContentPacks([product.sku])[0];

  return (
    <Card className="border-border-subtle my-4 border-2 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Share2 className="text-text-secondary h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Partner Marketing Pack (RU)
          </h4>
        </div>
        <Badge variant="outline" className="border-border-default text-[8px] font-black uppercase">
          SMM Ready
        </Badge>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="bg-bg-surface2 border-border-subtle flex items-center gap-2 rounded-lg border p-2.5">
          <MessageCircle className="h-4 w-4 text-blue-500" />
          <div className="text-text-secondary text-[9px] font-black uppercase">Telegram Pack</div>
        </div>
        <div className="bg-bg-surface2 border-border-subtle flex items-center gap-2 rounded-lg border p-2.5">
          <div className="bg-accent-primary flex h-4 w-4 items-center justify-center rounded text-[10px] font-black text-white">
            ВК
          </div>
          <div className="text-text-secondary text-[9px] font-black uppercase">VK Feed/Stories</div>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="text-text-muted flex items-center justify-between text-[9px] font-black uppercase">
          <span>High-Res Photos</span>
          <span className="text-text-primary">{pack.assetsCount} Assets</span>
        </div>
        <div className="text-text-muted flex items-center justify-between text-[9px] font-black uppercase">
          <span>Copywriting (RU)</span>
          <span className="flex items-center gap-1 text-emerald-600">
            <CheckCircle2 className="h-3 w-3" /> Ready
          </span>
        </div>
      </div>

      <Button className="bg-text-primary/90 flex h-10 w-full items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-black">
        <CloudDownload className="h-4 w-4" /> Download Social Kit
      </Button>

      <div className="border-border-subtle text-text-muted mt-4 border-t pt-4 text-center text-[8px] font-bold uppercase italic">
        * Assets automatically localized for Russian social platforms.
      </div>
    </Card>
  );
}
