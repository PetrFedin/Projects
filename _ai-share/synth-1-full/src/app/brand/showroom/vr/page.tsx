'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Maximize, 
  ChevronLeft, 
  ChevronRight, 
  Box, 
  Sparkles, 
  ShoppingCart, 
  Info, 
  Monitor, 
  Zap, 
  Layers,
  ShoppingBag,
  Camera,
  PlayCircle,
  Eye,
  ArrowRight,
  ArrowUpRight,
  UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/**
 * VR Showroom 360 Viewer (Brand OS)
 * Виртуальное пространство для презентации коллекций байерам.
 */

export default function VRShowroomPage() {
  const [currentScene, setCurrentScene] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const scenes = [
    { name: 'Main Hall', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop' },
    { name: 'Atrium', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop' },
    { name: 'Vip Lounge', image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=2070&auto=format&fit=crop' }
  ];

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col relative font-sans">
      {/* VR Backdrop (Simulated 360) */}
      <div 
         className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-110"
         style={{ backgroundImage: `url(${scenes[currentScene].image})`, filter: 'brightness(0.6)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      {/* VR HUD — Overlays — More Compact & Premium */}
      <header className="relative z-10 p-4 flex justify-between items-start pointer-events-none">
         <div className="space-y-4 pointer-events-auto">
            <Link href="/brand" className="h-8 w-8 rounded-lg bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all group">
               <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div className="space-y-0.5">
               <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">
                  <Zap className="w-3 h-3" />
                  <span>Immersive Node (B2B)</span>
               </div>
               <h1 className="text-sm font-black tracking-tighter uppercase italic leading-none">SS26 Cyber VR</h1>
               <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Instance: Digital Twin 01</p>
            </div>
         </div>
         
         <div className="flex gap-2 pointer-events-auto">
            <Button size="sm" className="h-9 rounded-lg px-5 bg-white text-black font-black uppercase text-[10px] gap-2 hover:bg-indigo-50 transition-all shadow-xl">
               <UserPlus className="w-3.5 h-3.5" /> Invite Buyer
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:bg-white/20">
               <Maximize className="w-4 h-4" />
            </Button>
         </div>
      </header>

      {/* Scene Content — Hotspots */}
      <div className="relative flex-1 flex items-center justify-center">
         {/* Hotspot 1: Product */}
         <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 group pointer-events-auto">
            <div 
               className="h-10 w-10 rounded-full bg-indigo-500/80 backdrop-blur-xl border-2 border-white/20 flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]"
               onMouseEnter={() => setActiveHotspot('p1')}
            >
               <Plus className="w-5 h-5 text-white" />
            </div>
            
            {activeHotspot === 'p1' && (
               <Card className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 border-none bg-black/60 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex gap-3">
                     <div className="h-24 w-18 bg-white/5 rounded-lg border border-white/10 overflow-hidden shrink-0">
                        <img src="https://images.unsplash.com/photo-1539109132304-39294f18639b?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 space-y-2.5">
                        <div className="space-y-0.5">
                           <p className="text-[8px] font-black uppercase text-indigo-400 tracking-widest">Featured Look</p>
                           <h4 className="text-[13px] font-black uppercase italic leading-none text-white">Metallic Satin Gown</h4>
                        </div>
                        <p className="text-[9px] text-white/40 font-bold uppercase tracking-tighter">BOM ID: BL-SLK-9921</p>
                        <div className="flex items-center justify-between">
                           <p className="text-sm font-black text-white">$450</p>
                           <Button size="sm" className="h-7 px-3 rounded-md bg-indigo-600 text-white font-black uppercase text-[8px] gap-1.5 hover:bg-indigo-500 transition-all">
                              <ShoppingBag className="w-3 h-3" /> Add
                           </Button>
                        </div>
                     </div>
                  </div>
               </Card>
            )}
         </div>

         {/* Hotspot 2: Video */}
         <div className="absolute top-1/3 right-1/4 group pointer-events-auto">
            <div 
               className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 flex items-center justify-center cursor-pointer hover:scale-110 transition-all"
               onMouseEnter={() => setActiveHotspot('v1')}
            >
               <PlayCircle className="w-5 h-5 text-white" />
            </div>
            {activeHotspot === 'v1' && (
               <Card className="absolute bottom-full right-0 mb-4 w-56 border-none bg-black/80 backdrop-blur-2xl rounded-xl p-3 shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p className="text-[8px] font-black uppercase text-white/40 mb-2 tracking-widest">Mood Film</p>
                  <div className="aspect-video bg-white/5 rounded-lg border border-white/10 flex items-center justify-center group/vid overflow-hidden relative">
                     <PlayCircle className="w-8 h-8 text-white/40 group-hover/vid:text-white transition-colors cursor-pointer" />
                  </div>
                  <p className="text-[10px] font-bold mt-2.5 text-center italic text-indigo-200">"Liquid Metal Vision"</p>
               </Card>
            )}
         </div>
      </div>

      {/* VR Controls — Footer — Compact & Anchored */}
      <footer className="relative z-10 p-4 flex justify-between items-end pointer-events-none">
         <div className="flex flex-col gap-3 pointer-events-auto">
            <div className="flex gap-2">
               {scenes.map((scene, i) => (
                  <button 
                     key={i}
                     onClick={() => setCurrentScene(i)}
                     className={cn(
                        "h-9 px-4 rounded-lg font-black uppercase text-[9px] tracking-widest transition-all",
                        currentScene === i ? "bg-white text-black shadow-lg" : "bg-black/40 backdrop-blur-xl text-white/60 border border-white/10 hover:bg-white/10"
                     )}
                  >
                     {scene.name}
                  </button>
               ))}
            </div>
            
            <div className="p-3 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl w-72 space-y-4 shadow-2xl">
               <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase text-white/40 tracking-widest">Buyer Node Stream</span>
                  <Badge variant="outline" className="h-4 border-emerald-500/50 text-emerald-400 text-[8px] font-black uppercase px-1.5">12 Online</Badge>
               </div>
               <div className="flex -space-x-2 overflow-hidden">
                  {[1,2,3,4,5].map(i => (
                     <div key={i} className="inline-block h-7 w-7 rounded-full ring-2 ring-black bg-slate-800 border border-white/10 flex items-center justify-center text-[9px] font-black uppercase text-white/60">
                        {['JD', 'MS', 'AK', 'LP', 'RT'][i-1]}
                     </div>
                  ))}
                  <div className="inline-block h-7 w-7 rounded-full ring-2 ring-black bg-white/10 flex items-center justify-center text-[9px] font-black text-indigo-400">+7</div>
               </div>
               <Button className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-lg font-black uppercase text-[9px] gap-2 shadow-lg transition-all">
                  <Monitor className="w-3.5 h-3.5" /> Start Presentation
               </Button>
            </div>
         </div>

         <div className="flex gap-3 pointer-events-auto items-center">
            <div className="h-12 w-56 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl px-5 flex items-center justify-between shadow-2xl">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase text-white/40 tracking-widest leading-none mb-1">Order Value</span>
                  <span className="text-base font-black italic tabular-nums leading-none">$24,500</span>
               </div>
               <Button variant="ghost" size="sm" className="h-7 rounded-md bg-white text-black font-black uppercase text-[8px] px-4 hover:bg-indigo-50">
                  Checkout
               </Button>
            </div>
            
            <div className="flex flex-col gap-2">
               <Button size="icon" className="h-10 w-10 rounded-lg bg-white/10 backdrop-blur-xl border border-white/10 text-white hover:bg-white/20 transition-all">
                  <Camera className="w-4 h-4" />
               </Button>
               <Button size="icon" className="h-10 w-10 rounded-lg bg-indigo-600 text-white border-none shadow-xl hover:bg-indigo-500 transition-all">
                  <Sparkles className="w-4 h-4" />
               </Button>
            </div>
         </div>
      </footer>
    </div>
  );
}

// Add these to global CSS or as style tag
const styles = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
function Plus(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
