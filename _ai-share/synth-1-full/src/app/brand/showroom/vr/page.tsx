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
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

/**
 * VR Showroom 360 Viewer (Brand OS)
 * Виртуальное пространство для презентации коллекций байерам.
 */

export default function VRShowroomPage() {
  const [currentScene, setCurrentScene] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

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
    {
      name: 'Vip Lounge',
      image:
        'https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=2070&auto=format&fit=crop',
    },
  ];

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-black font-sans text-white">
      {/* VR Backdrop (Simulated 360) */}
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${scenes[currentScene].image})`, filter: 'brightness(0.6)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      {/* VR HUD — Overlays — More Compact & Premium */}
      <header className="pointer-events-none relative z-10 flex items-start justify-between p-4">
        <div className="pointer-events-auto space-y-4">
          <Link
            href={ROUTES.brand.home}
            className="group flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 backdrop-blur-xl transition-all hover:bg-white/20"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          </Link>
          <div className="space-y-0.5">
            <div className="text-accent-primary flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em]">
              <Zap className="h-3 w-3" />
              <span>Immersive Node (B2B)</span>
            </div>
            <h1 className="text-sm font-black uppercase italic leading-none tracking-tighter">
              SS26 Cyber VR
            </h1>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
              Instance: Digital Twin 01
            </p>
          </div>
        </div>

        <div className="pointer-events-auto flex gap-2">
          <Button
            size="sm"
            className="hover:bg-accent-primary/10 h-9 gap-2 rounded-lg bg-white px-5 text-[10px] font-black uppercase text-black shadow-xl transition-all"
          >
            <UserPlus className="h-3.5 w-3.5" /> Invite Buyer
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg border border-white/10 bg-white/10 text-white backdrop-blur-xl hover:bg-white/20"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Scene Content — Hotspots */}
      <div className="relative flex flex-1 items-center justify-center">
        {/* Hotspot 1: Product */}
        <div className="group pointer-events-auto absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className="bg-accent-primary/80 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-white/20 shadow-[0_0_20px_rgba(99,102,241,0.4)] backdrop-blur-xl transition-all hover:scale-110"
            onMouseEnter={() => setActiveHotspot('p1')}
          >
            <Plus className="h-5 w-5 text-white" />
          </div>

          {activeHotspot === 'p1' && (
            <Card className="absolute bottom-full left-1/2 mb-4 w-72 -translate-x-1/2 rounded-2xl border border-none border-white/10 bg-black/60 p-4 shadow-2xl backdrop-blur-2xl duration-300 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex gap-3">
                <div className="w-18 h-24 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                  <img
                    src="https://images.unsplash.com/photo-1539109132304-39294f18639b?q=80&w=2070&auto=format&fit=crop"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2.5">
                  <div className="space-y-0.5">
                    <p className="text-accent-primary text-[8px] font-black uppercase tracking-widest">
                      Featured Look
                    </p>
                    <h4 className="text-[13px] font-black uppercase italic leading-none text-white">
                      Metallic Satin Gown
                    </h4>
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-tighter text-white/40">
                    BOM ID: BL-SLK-9921
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-white">$450</p>
                    <Button
                      size="sm"
                      className="bg-accent-primary hover:bg-accent-primary h-7 gap-1.5 rounded-md px-3 text-[8px] font-black uppercase text-white transition-all"
                    >
                      <ShoppingBag className="h-3 w-3" /> Add
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Hotspot 2: Video */}
        <div className="group pointer-events-auto absolute right-1/4 top-1/3">
          <div
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-white/20 backdrop-blur-xl transition-all hover:scale-110"
            onMouseEnter={() => setActiveHotspot('v1')}
          >
            <PlayCircle className="h-5 w-5 text-white" />
          </div>
          {activeHotspot === 'v1' && (
            <Card className="absolute bottom-full right-0 mb-4 w-56 rounded-xl border border-none border-white/10 bg-black/80 p-3 shadow-2xl backdrop-blur-2xl duration-300 animate-in fade-in slide-in-from-bottom-2">
              <p className="mb-2 text-[8px] font-black uppercase tracking-widest text-white/40">
                Mood Film
              </p>
              <div className="group/vid relative flex aspect-video items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <PlayCircle className="h-8 w-8 cursor-pointer text-white/40 transition-colors group-hover/vid:text-white" />
              </div>
              <p className="text-accent-primary/40 mt-2.5 text-center text-[10px] font-bold italic">
                "Liquid Metal Vision"
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* VR Controls — Footer — Compact & Anchored */}
      <footer className="pointer-events-none relative z-10 flex items-end justify-between p-4">
        <div className="pointer-events-auto flex flex-col gap-3">
          <div className="flex gap-2">
            {scenes.map((scene, i) => (
              <button
                key={i}
                onClick={() => setCurrentScene(i)}
                className={cn(
                  'h-9 rounded-lg px-4 text-[9px] font-black uppercase tracking-widest transition-all',
                  currentScene === i
                    ? 'bg-white text-black shadow-lg'
                    : 'border border-white/10 bg-black/40 text-white/60 backdrop-blur-xl hover:bg-white/10'
                )}
              >
                {scene.name}
              </button>
            ))}
          </div>

          <div className="w-72 space-y-4 rounded-2xl border border-white/10 bg-black/60 p-3 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                Buyer Node Stream
              </span>
              <Badge
                variant="outline"
                className="h-4 border-emerald-500/50 px-1.5 text-[8px] font-black uppercase text-emerald-400"
              >
                12 Online
              </Badge>
            </div>
            <div className="flex -space-x-2 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="bg-text-primary/90 inline-block flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-[9px] font-black uppercase text-white/60 ring-2 ring-black"
                >
                  {['JD', 'MS', 'AK', 'LP', 'RT'][i - 1]}
                </div>
              ))}
              <div className="text-accent-primary inline-block flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[9px] font-black ring-2 ring-black">
                +7
              </div>
            </div>
            <Button className="bg-accent-primary hover:bg-accent-primary h-9 w-full gap-2 rounded-lg border-none text-[9px] font-black uppercase text-white shadow-lg transition-all">
              <Monitor className="h-3.5 w-3.5" /> Start Presentation
            </Button>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-3">
          <div className="flex h-12 w-56 items-center justify-between rounded-xl border border-white/10 bg-black/60 px-5 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col">
              <span className="mb-1 text-[8px] font-black uppercase leading-none tracking-widest text-white/40">
                Order Value
              </span>
              <span className="text-base font-black italic tabular-nums leading-none">$24,500</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-accent-primary/10 h-7 rounded-md bg-white px-4 text-[8px] font-black uppercase text-black"
            >
              Checkout
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              size="icon"
              className="h-10 w-10 rounded-lg border border-white/10 bg-white/10 text-white backdrop-blur-xl transition-all hover:bg-white/20"
            >
              <Camera className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="bg-accent-primary hover:bg-accent-primary h-10 w-10 rounded-lg border-none text-white shadow-xl transition-all"
            >
              <Sparkles className="h-4 w-4" />
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
  );
}
