'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Maximize, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  ShoppingCart, 
  Info, 
  Zap, 
  ShoppingBag,
  PlayCircle,
  Eye,
  ArrowUpRight,
  MessageSquare,
  HelpCircle,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/**
 * Partner/Buyer VR Showroom Viewer
 * Интерфейс байера для просмотра коллекции в VR и формирования предзаказа.
 */

export default function PartnerVRShowroomPage() {
  const [currentScene, setCurrentScene] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const scenes = [
    { name: 'Main Hall', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop' },
    { name: 'Atrium', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop' },
  ];

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col relative font-sans">
      {/* VR Backdrop */}
      <div 
         className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-110"
         style={{ backgroundImage: `url(${scenes[currentScene].image})`, filter: 'brightness(0.5)' }}
      />
      
      {/* Buyer HUD */}
      <header className="relative z-10 p-3 flex justify-between items-start pointer-events-none">
         <div className="space-y-4 pointer-events-auto">
            <div className="flex items-center gap-3">
               <Badge className="bg-indigo-600 text-white border-none font-black text-[9px] uppercase h-6 px-3">
                  Live Selection
               </Badge>
               <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest italic">SS26 Pre-Order</span>
            </div>
            <h1 className="text-sm font-black font-headline tracking-tighter uppercase italic">Syntha Lab VR Experience</h1>
         </div>
         
         <div className="flex gap-3 pointer-events-auto">
            <Button variant="ghost" className="h-10 rounded-full px-8 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-black uppercase text-xs gap-3">
               <MessageSquare className="w-5 h-5" /> Chat with Brand
            </Button>
            <div className="relative">
               <Button className="h-10 rounded-full px-8 bg-white text-black font-black uppercase text-xs gap-3 shadow-2xl">
                  <ShoppingCart className="w-5 h-5" /> Cart ({cartCount})
               </Button>
               {cartCount > 0 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 rounded-full animate-ping opacity-75" />
               )}
            </div>
         </div>
      </header>

      {/* Hotspots */}
      <div className="relative flex-1 flex items-center justify-center">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group pointer-events-auto">
            <div 
               className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-3xl border-2 border-white/30 flex items-center justify-center cursor-pointer hover:scale-110 hover:bg-indigo-600 transition-all shadow-2xl"
               onMouseEnter={() => setActiveHotspot('p1')}
            >
               <Plus className="w-8 h-8 text-white" />
            </div>
            
            {activeHotspot === 'p1' && (
               <Card className="absolute bottom-full left-1/2 -translate-x-1/2 mb-8 w-96 border-none bg-black/80 backdrop-blur-3xl rounded-xl p-4 shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex gap-3">
                     <div className="h-40 w-28 bg-white/5 rounded-2xl overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1539109132304-39294f18639b?q=80&w=2070" className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 space-y-4">
                        <div>
                           <h4 className="text-base font-black uppercase italic leading-none mb-1">Metallic Satin Gown</h4>
                           <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Available Q3 2026</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           <div className="p-2 bg-white/5 rounded-xl border border-white/5 text-center">
                              <p className="text-[8px] font-black uppercase text-white/40 mb-1">Wholesale</p>
                              <p className="text-sm font-black">$450</p>
                           </div>
                           <div className="p-2 bg-white/5 rounded-xl border border-white/5 text-center">
                              <p className="text-[8px] font-black uppercase text-white/40 mb-1">Min Order</p>
                              <p className="text-sm font-black">12 pcs</p>
                           </div>
                        </div>
                        <Button 
                           onClick={() => { setCartCount(c => c + 1); setActiveHotspot(null); }}
                           className="h-12 w-full rounded-2xl bg-indigo-600 text-white font-black uppercase text-[10px] gap-2 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                        >
                           <Plus className="w-4 h-4" /> Add to Pre-Order
                        </Button>
                     </div>
                  </div>
               </Card>
            )}
         </div>
      </div>

      {/* Footer / Info */}
      <footer className="relative z-10 p-4 flex justify-between items-end pointer-events-none">
         <div className="flex flex-col gap-3 pointer-events-auto">
            <Card className="p-4 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-xl w-96 space-y-6 shadow-2xl">
               <div className="space-y-1">
                  <h3 className="text-sm font-black uppercase italic tracking-tighter">Collection Insights</h3>
                  <p className="text-xs text-white/40 font-medium leading-relaxed italic">"Inspired by the fluid nature of mercury and the precision of cybernetic structures."</p>
               </div>
               
               <div className="space-y-3">
                  <Button variant="outline" className="w-full h-11 border-white/10 bg-transparent text-white hover:bg-white hover:text-black rounded-xl font-black uppercase text-[9px] gap-2">
                     <FileText className="w-4 h-4" /> Download Linesheet
                  </Button>
                  <Button variant="outline" className="w-full h-11 border-white/10 bg-transparent text-white hover:bg-white hover:text-black rounded-xl font-black uppercase text-[9px] gap-2">
                     <HelpCircle className="w-4 h-4" /> Material Specs
                  </Button>
               </div>
            </Card>
         </div>

         <div className="pointer-events-auto flex flex-col items-end gap-3">
            <div className="flex gap-3">
               {scenes.map((s, i) => (
                  <button 
                     key={i} 
                     onClick={() => setCurrentScene(i)}
                     className={cn(
                        "h-10 px-8 rounded-full font-black uppercase text-[10px] tracking-widest transition-all",
                        currentScene === i ? "bg-white text-black scale-105" : "bg-white/10 text-white/60 hover:bg-white/20"
                     )}
                  >
                     {s.name}
                  </button>
               ))}
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Press [ESC] to Exit VR</p>
         </div>
      </footer>
    </div>
  );
}
