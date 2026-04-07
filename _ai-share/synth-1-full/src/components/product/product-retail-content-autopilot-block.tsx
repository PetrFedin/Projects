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
    <Card className="p-4 border-2 border-blue-50 bg-blue-50/10 shadow-sm my-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 pointer-events-none">
         <Rocket className="w-16 h-16 text-blue-600" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-blue-600">
          <Rocket className="w-4 h-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-700">Retail AI Content Autopilot</h4>
        </div>
        <Badge className="bg-blue-600 text-white text-[8px] font-black border-none uppercase">Social Hub Ready</Badge>
      </div>

      <div className="space-y-3">
         <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-3 h-3" /> Suggested Local Posts
         </div>
         
         {posts.map(post => (
           <div key={post.id} className="p-3 bg-white/80 rounded-xl border border-blue-100 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                 <Badge variant="outline" className="text-[7px] font-black uppercase border-blue-200 text-blue-600 px-2 flex gap-1 items-center">
                    {post.platform === 'Telegram' ? <Send className="w-2.5 h-2.5" /> : <div className="text-[8px]">VK</div>}
                    {post.platform}
                 </Badge>
                 <div className="text-[7px] font-bold text-slate-400 uppercase">{post.scheduledDate}</div>
              </div>
              <p className="text-[9px] font-bold text-slate-600 leading-tight italic">
                 "{post.copyRu}"
              </p>
              <div className="flex gap-2 mt-3">
                 <Button variant="ghost" className="h-7 flex-1 text-[8px] font-black uppercase text-blue-600 hover:bg-blue-50 border border-blue-100">
                    Edit Copy
                 </Button>
                 <Button className="h-7 flex-1 bg-blue-600 text-white hover:bg-blue-700 text-[8px] font-black uppercase shadow-sm">
                    Schedule Post
                 </Button>
              </div>
           </div>
         ))}
      </div>

      <div className="mt-4 pt-4 border-t border-blue-100 flex justify-between items-center text-[8px] font-black text-slate-400 uppercase">
         <span>Localized for Franchises & Stores</span>
         <span className="text-blue-600 flex items-center gap-1">
            <Info className="w-3 h-3" /> Image Assets Linked
         </span>
      </div>
    </Card>
  );
}
