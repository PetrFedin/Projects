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
  FileText,
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
    {
      name: 'Main Hall',
      image:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    },
    {
      name: 'Atrium',
      image:
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop',
    },
  ];

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-black font-sans text-white">
      {/* VR Backdrop */}
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${scenes[currentScene].image})`, filter: 'brightness(0.5)' }}
      />

      {/* Buyer HUD */}
      <header className="pointer-events-none relative z-10 flex items-start justify-between p-3">
        <div className="pointer-events-auto space-y-4">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <Badge className="h-6 border-none bg-indigo-600 px-3 text-[9px] font-black uppercase text-white">
=======
            <Badge className="bg-accent-primary h-6 border-none px-3 text-[9px] font-black uppercase text-white">
>>>>>>> recover/cabinet-wip-from-stash
              Live Selection
            </Badge>
            <span className="text-[10px] font-bold uppercase italic tracking-widest text-white/40">
              SS26 Pre-Order
            </span>
          </div>
          <h1 className="font-headline text-sm font-black uppercase italic tracking-tighter">
            Syntha Lab VR Experience
          </h1>
        </div>

        <div className="pointer-events-auto flex gap-3">
          <Button
            variant="ghost"
            className="h-10 gap-3 rounded-full border border-white/10 bg-white/5 px-8 text-xs font-black uppercase text-white backdrop-blur-xl"
          >
            <MessageSquare className="h-5 w-5" /> Chat with Brand
          </Button>
          <div className="relative">
            <Button className="h-10 gap-3 rounded-full bg-white px-8 text-xs font-black uppercase text-black shadow-2xl">
              <ShoppingCart className="h-5 w-5" /> Cart ({cartCount})
            </Button>
            {cartCount > 0 && (
              <div className="absolute -right-1 -top-1 h-5 w-5 animate-ping rounded-full bg-rose-500 opacity-75" />
            )}
          </div>
        </div>
      </header>

      {/* Hotspots */}
      <div className="relative flex flex-1 items-center justify-center">
        <div className="group pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
<<<<<<< HEAD
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 border-white/30 bg-white/10 shadow-2xl backdrop-blur-3xl transition-all hover:scale-110 hover:bg-indigo-600"
=======
            className="hover:bg-accent-primary flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 border-white/30 bg-white/10 shadow-2xl backdrop-blur-3xl transition-all hover:scale-110"
>>>>>>> recover/cabinet-wip-from-stash
            onMouseEnter={() => setActiveHotspot('p1')}
          >
            <Plus className="h-8 w-8 text-white" />
          </div>

          {activeHotspot === 'p1' && (
            <Card className="absolute bottom-full left-1/2 mb-8 w-96 -translate-x-1/2 rounded-xl border border-none border-white/10 bg-black/80 p-4 shadow-2xl backdrop-blur-3xl duration-300 animate-in fade-in zoom-in-95">
              <div className="flex gap-3">
                <div className="h-40 w-28 shrink-0 overflow-hidden rounded-2xl bg-white/5">
                  <img
                    src="https://images.unsplash.com/photo-1539109132304-39294f18639b?q=80&w=2070"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="mb-1 text-base font-black uppercase italic leading-none">
                      Metallic Satin Gown
                    </h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                      Available Q3 2026
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-white/5 bg-white/5 p-2 text-center">
                      <p className="mb-1 text-[8px] font-black uppercase text-white/40">
                        Wholesale
                      </p>
                      <p className="text-sm font-black">$450</p>
                    </div>
                    <div className="rounded-xl border border-white/5 bg-white/5 p-2 text-center">
                      <p className="mb-1 text-[8px] font-black uppercase text-white/40">
                        Min Order
                      </p>
                      <p className="text-sm font-black">12 pcs</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      setCartCount((c) => c + 1);
                      setActiveHotspot(null);
                    }}
<<<<<<< HEAD
                    className="h-12 w-full gap-2 rounded-2xl bg-indigo-600 text-[10px] font-black uppercase text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
=======
                    className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/20 h-12 w-full gap-2 rounded-2xl text-[10px] font-black uppercase text-white shadow-lg"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    <Plus className="h-4 w-4" /> Add to Pre-Order
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Footer / Info */}
      <footer className="pointer-events-none relative z-10 flex items-end justify-between p-4">
        <div className="pointer-events-auto flex flex-col gap-3">
          <Card className="w-96 space-y-6 rounded-xl border border-white/10 bg-black/60 p-4 shadow-2xl backdrop-blur-2xl">
            <div className="space-y-1">
              <h3 className="text-sm font-black uppercase italic tracking-tighter">
                Collection Insights
              </h3>
              <p className="text-xs font-medium italic leading-relaxed text-white/40">
                "Inspired by the fluid nature of mercury and the precision of cybernetic
                structures."
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="h-11 w-full gap-2 rounded-xl border-white/10 bg-transparent text-[9px] font-black uppercase text-white hover:bg-white hover:text-black"
              >
                <FileText className="h-4 w-4" /> Download Linesheet
              </Button>
              <Button
                variant="outline"
                className="h-11 w-full gap-2 rounded-xl border-white/10 bg-transparent text-[9px] font-black uppercase text-white hover:bg-white hover:text-black"
              >
                <HelpCircle className="h-4 w-4" /> Material Specs
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
                  'h-10 rounded-full px-8 text-[10px] font-black uppercase tracking-widest transition-all',
                  currentScene === i
                    ? 'scale-105 bg-white text-black'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                )}
              >
                {s.name}
              </button>
            ))}
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
            Press [ESC] to Exit VR
          </p>
        </div>
      </footer>
    </div>
  );
}
