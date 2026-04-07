'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, 
  Download, 
  Share2, 
  Search, 
  Filter, 
  Plus, 
  ImageIcon, 
  Video, 
  Tag, 
  Maximize2,
  Trash2,
  Copy,
  Instagram,
  Zap,
  Globe,
  LayoutGrid
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function MarketingAssetCloud() {
  const { marketingAssets } = useB2BState();
  const [selectedAsset, setSelectedAsset] = useState<BrandAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Cloud className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-indigo-100 text-indigo-600 uppercase font-black tracking-widest text-[9px]">
              CONTENT_SYNC_v4.1
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Brand Marketing<br/>Asset Cloud
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md text-left">
            Direct access to high-fidelity campaign assets, social media templates, and studio content. Download or sync directly to your retail platforms.
          </p>
        </div>

        <div className="flex gap-3">
           <Button variant="outline" className="h-10 rounded-2xl border-slate-200 px-6 font-black uppercase text-[10px] tracking-widest gap-2 bg-white">
              <Globe className="h-4 w-4" /> Global Sync Settings
           </Button>
           <Button className="h-10 bg-slate-900 text-white rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-slate-200">
              <Plus className="h-4 w-4" /> Upload New Assets
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Browser */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                 <Input 
                   placeholder="Search assets by tag, style or campaign..." 
                   className="pl-12 h-12 rounded-xl border-none bg-slate-50 shadow-none focus-visible:ring-indigo-500" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>
              <div className="flex items-center gap-2 px-4">
                 <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400"><Filter className="h-4 w-4" /></Button>
                 <div className="h-6 w-[1px] bg-slate-100 mx-2" />
                 <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md bg-white shadow-sm"><LayoutGrid className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md"><Filter className="h-3.5 w-3.5" /></Button>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {marketingAssets.map((asset) => (
                <Card 
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={cn(
                    "group border-none shadow-xl shadow-slate-200/50 rounded-xl cursor-pointer transition-all overflow-hidden",
                    selectedAsset?.id === asset.id ? "ring-4 ring-indigo-600" : "bg-white hover:scale-[1.02]"
                  )}
                >
                   <div className="relative aspect-[4/5] overflow-hidden">
                      <img src={asset.thumbnail} className="w-full h-full object-cover" />
                      <div className="absolute top-4 left-4">
                         <Badge className="bg-black/50 backdrop-blur-md text-white border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5">
                            {asset.type}
                         </Badge>
                      </div>
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white text-slate-900"><Download className="h-4 w-4" /></Button>
                         <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white text-slate-900"><Share2 className="h-4 w-4" /></Button>
                      </div>
                   </div>
                   <CardContent className="p-4">
                      <h4 className="text-xs font-black uppercase text-slate-900 truncate mb-2">{asset.title}</h4>
                      <div className="flex flex-wrap gap-1">
                         {asset.tags.map(tag => (
                           <span key={tag} className="text-[7px] font-black uppercase text-slate-400">#{tag}</span>
                         ))}
                      </div>
                   </CardContent>
                </Card>
              ))}
           </div>
        </div>

        {/* Inspector */}
        <div className="lg:col-span-4">
           <AnimatePresence mode="wait">
             {selectedAsset ? (
               <motion.div
                 key={selectedAsset.id}
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className="space-y-4"
               >
                  <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-3 space-y-4">
                     <div className="space-y-4">
                        <div className="aspect-[4/5] rounded-xl bg-slate-100 border border-slate-100 overflow-hidden shadow-2xl">
                           <img src={selectedAsset.thumbnail} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center space-y-1">
                           <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">{selectedAsset.title}</h3>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type: {selectedAsset.type} • 1080x1350</p>
                        </div>
                     </div>

                     <div className="space-y-4 pt-4 border-t border-slate-50">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Integrations</h4>
                        <div className="grid grid-cols-2 gap-2">
                           <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg shadow-indigo-100">
                              <Instagram className="h-4 w-4" /> Instagram Sync
                           </Button>
                           <Button variant="outline" className="h-10 border-slate-100 text-slate-900 font-black uppercase text-[10px] tracking-widest gap-2 rounded-2xl">
                              <Zap className="h-4 w-4 fill-amber-500 text-amber-500" /> Shopify Push
                           </Button>
                        </div>
                     </div>

                     <div className="pt-4 space-y-3">
                        <Button className="w-full h-10 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-2xl">
                           <Download className="h-4 w-4" /> Download High-Res
                        </Button>
                        <Button variant="ghost" onClick={() => setSelectedAsset(null)} className="w-full h-10 text-slate-400 font-black uppercase text-[10px] tracking-widest">
                           Close Inspector
                        </Button>
                     </div>
                  </Card>
               </motion.div>
             ) : (
               <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-indigo-600 text-white p-3 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                     <Cloud className="h-32 w-32" />
                  </div>
                  <div className="relative z-10 space-y-6">
                     <h3 className="text-sm font-black uppercase tracking-tight">AI Content node</h3>
                     <p className="text-xs font-medium text-white/60 leading-relaxed uppercase">
                       Use our AI Studio to automatically resize campaign shots for your local store's digital screens or social media dimensions.
                     </p>
                     <div className="pt-4 p-4 rounded-3xl bg-white/10 border border-white/10 space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase">
                           <span>Cloud Storage</span>
                           <span>42% Used</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: '42%' }} className="h-full bg-white shadow-[0_0_10px_white]" />
                        </div>
                     </div>
                     <Button className="w-full h-10 bg-white text-indigo-600 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-2xl">
                        Open AI Studio <Maximize2 className="h-4 w-4" />
                     </Button>
                  </div>
               </Card>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
