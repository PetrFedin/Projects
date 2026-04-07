'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Plus, 
  ChevronRight, 
  X,
  Maximize2,
  Share2,
  Download,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';

interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  productId: string;
  productName: string;
  price: number;
}

interface LookbookPage {
  id: string;
  imageUrl: string;
  title: string;
  hotspots: Hotspot[];
}

export function WholesaleLookbook({ onShopProduct }: { onShopProduct: (productId: string) => void }) {
  const [activePage, setActivePage] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  const pages: LookbookPage[] = [
    {
      id: 'p1',
      title: 'Neural Nomad - Opening Look',
      imageUrl: 'https://images.unsplash.com/photo-1539109132304-372874a581ad?auto=format&fit=crop&q=80&w=1200',
      hotspots: [
        { id: 'h1', x: 45, y: 30, productId: '1', productName: 'Cyber Tech Parka', price: 12400 },
        { id: 'h2', x: 55, y: 75, productId: '2', productName: 'Neural Cargo Pants', price: 8900 }
      ]
    },
    {
      id: 'p2',
      title: 'Structural Silence',
      imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=1200',
      hotspots: [
        { id: 'h3', x: 40, y: 40, productId: '3', productName: 'Minimalist Overcoat', price: 15600 }
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10 bg-slate-900/50 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-4 w-4 text-indigo-400" />
            <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 font-black text-[8px] tracking-widest uppercase">
              INTERACTIVE_LOOKBOOK_v1
            </Badge>
          </div>
          <h3 className="text-base font-black uppercase tracking-tight text-white">{pages[activePage].title}</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-white/50 hover:text-white hover:bg-white/10">
             <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-white/50 hover:text-white hover:bg-white/10">
             <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Viewport */}
      <div className="relative flex-1 bg-black group overflow-hidden">
        <motion.img 
          key={pages[activePage].id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          src={pages[activePage].imageUrl}
          className="w-full h-full object-cover"
        />

        {/* Hotspots */}
        {pages[activePage].hotspots.map((hs) => (
          <button
            key={hs.id}
            onClick={() => setSelectedHotspot(hs)}
            style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/20 backdrop-blur-md border border-white/50 flex items-center justify-center hover:scale-125 hover:bg-indigo-600 hover:border-indigo-400 transition-all group/hs"
          >
            <div className="h-2 w-2 rounded-full bg-white" />
            <div className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-20" />
          </button>
        ))}

        {/* Hotspot Popup */}
        <AnimatePresence>
          {selectedHotspot && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              style={{ left: `${selectedHotspot.x}%`, top: `${selectedHotspot.y + 5}%` }}
              className="absolute z-10 -translate-x-1/2 p-4 bg-white rounded-2xl shadow-2xl border border-slate-100 min-w-[200px]"
            >
              <button 
                onClick={() => setSelectedHotspot(null)}
                className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center text-slate-300 hover:text-slate-900"
              >
                <X className="h-3 w-3" />
              </button>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase text-slate-900 leading-tight">{selectedHotspot.productName}</h4>
                  <p className="text-[12px] font-black text-indigo-600">{selectedHotspot.price.toLocaleString('ru-RU')} ₽</p>
                </div>
                <Button 
                  onClick={() => {
                    onShopProduct(selectedHotspot.productId);
                    setSelectedHotspot(null);
                  }}
                  className="w-full h-8 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest gap-2"
                >
                  Shop the look <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 p-2 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10">
          {pages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActivePage(i)}
              className={cn(
                "h-2 w-12 rounded-full transition-all",
                activePage === i ? "bg-white" : "bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>

        {/* Sidebar info toggle */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-3">
           <Button variant="outline" className="h-12 w-12 rounded-full border-white/10 bg-black/20 backdrop-blur-md text-white p-0">
              <Maximize2 className="h-5 w-5" />
           </Button>
           <Button variant="outline" className="h-12 w-12 rounded-full border-white/10 bg-black/20 backdrop-blur-md text-white p-0">
              <Info className="h-5 w-5" />
           </Button>
        </div>
      </div>

      {/* Footer / Thumbnail strip */}
      <div className="h-32 bg-slate-800/50 backdrop-blur-md border-t border-white/10 p-4 flex items-center gap-3 overflow-x-auto">
        {pages.map((page, i) => (
          <button
            key={page.id}
            onClick={() => setActivePage(i)}
            className={cn(
              "h-20 w-32 rounded-xl overflow-hidden shrink-0 border-2 transition-all",
              activePage === i ? "border-indigo-500 scale-105" : "border-transparent opacity-50 hover:opacity-100"
            )}
          >
            <img src={page.imageUrl} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
