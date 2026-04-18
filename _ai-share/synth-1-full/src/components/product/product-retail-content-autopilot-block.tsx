'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Rocket, Share2, Send, MessageSquare, ExternalLink, Activity, Info } from 'lucide-react';
import { generateStoreContentPosts } from '@/lib/fashion/retail-content-autopilot';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

export function ProductRetailContentAutopilotBlock({ product }: { product: Product }) {
  const posts = generateStoreContentPosts(product.sku, product.name);

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-blue-50 bg-blue-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <Rocket className="h-16 w-16 text-blue-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600">
          <Rocket className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Retail AI Content Autopilot
          </h4>
        </div>
        <Badge className="border-none bg-blue-600 text-[8px] font-black uppercase text-white">
          Social Hub Ready
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="text-text-muted flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
          <Activity className="h-3 w-3" /> Suggested Local Posts
        </div>

        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-xl border border-blue-100 bg-white/80 p-3 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between">
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-blue-200 px-2 text-[7px] font-black uppercase text-blue-600"
              >
                {post.platform === 'Telegram' ? (
                  <Send className="h-2.5 w-2.5" />
                ) : (
                  <div className="text-[8px]">VK</div>
                )}
                {post.platform}
              </Badge>
              <div className="text-text-muted text-[7px] font-bold uppercase">
                {post.scheduledDate}
              </div>
            </div>
            <p className="text-text-secondary text-[9px] font-bold italic leading-tight">
              "{post.copyRu}"
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                variant="ghost"
                className="h-7 flex-1 border border-blue-100 text-[8px] font-black uppercase text-blue-600 hover:bg-blue-50"
              >
                Edit Copy
              </Button>
              <Button className="h-7 flex-1 bg-blue-600 text-[8px] font-black uppercase text-white shadow-sm hover:bg-blue-700">
                Schedule Post
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-text-muted mt-4 flex items-center justify-between border-t border-blue-100 pt-4 text-[8px] font-black uppercase">
        <span>Localized for Franchises & Stores</span>
        <span className="flex items-center gap-1 text-blue-600">
          <Info className="h-3 w-3" /> Image Assets Linked
        </span>
      </div>
    </Card>
  );
}
