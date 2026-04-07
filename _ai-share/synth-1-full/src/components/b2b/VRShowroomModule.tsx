'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Orbit, 
  Maximize2, 
  Scan, 
  Layers, 
  Box, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  ChevronRight, 
  Plus, 
  ShoppingCart,
  Eye,
  Camera,
  Play
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { cn } from '@/lib/cn';

export function VRShowroomModule() {
  const [activeView, setActiveAnalysis] = useState<'3d' | 'ar' | 'tour'>('3d');

  return (
    <div className="space-y-4 p-4 bg-slate-900 min-h-screen text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Orbit className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 uppercase font-black tracking-widest text-[9px] bg-indigo-500/5 backdrop-blur-md">
              VR_Ecosystem_v5.0
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-white leading-none">
            Virtual Reality<br/>Showroom
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md text-left">
            Immersive wholesale experience. Walk through digital twins of our physical showrooms, examine textures in 8K, and place orders in 3D.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
            {[
              { id: '3d', label: '3D Orbit', icon: Maximize2 },
              { id: 'ar', label: 'AR Projection', icon: Scan },
              { id: 'tour', label: 'VR Tour', icon: Camera }
            ].map(tab => (
              <Button
                key={tab.id}
                onClick={() => setActiveAnalysis(tab.id as any)}
                className={cn(
                  "h-10 px-5 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all gap-2",
                  activeView === tab.id ? "bg-white text-slate-900 shadow-xl" : "bg-transparent text-slate-400 hover:text-white"
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Main VR Viewport */}
        <div className="lg:col-span-8">
          <div className="relative aspect-video rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 overflow-hidden border border-white/10 shadow-2xl group cursor-crosshair">
            {/* Mock VR Scene */}
            <img 
              src="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1200" 
              className="w-full h-full object-cover opacity-40 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000" 
            />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[100px] opacity-20 animate-pulse" />
                <div className="h-24 w-24 rounded-full border-2 border-white/20 flex items-center justify-center relative z-10 backdrop-blur-sm group-hover:scale-110 transition-all">
                  <Play className="h-8 w-8 text-white fill-white" />
                </div>
              </div>
            </div>

            {/* Overlays */}
            <div className="absolute top-4 left-8 flex flex-col gap-2">
              <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] uppercase tracking-widest px-3 py-1">Streaming Live: 8K Ready</Badge>
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-full px-3 py-1 border border-white/10">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">Headset Connected</span>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
              <div className="space-y-4">
                <div className="p-4 bg-black/60 backdrop-blur-xl rounded-[1.5rem] border border-white/10 max-w-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-tight">Active Perspective</h4>
                    <Eye className="h-3 w-3 text-slate-400" />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Main Hall Cluster: Cyber Tech Core. Hover to inspect individual SKU details.</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button className="h-10 w-10 rounded-2xl bg-white text-slate-900 shadow-2xl p-0 hover:bg-slate-100">
                  <Maximize2 className="h-6 w-6" />
                </Button>
                <Button className="h-10 bg-indigo-600 text-white rounded-2xl px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-2xl shadow-indigo-900/40">
                  Enter Full Immersion <Zap className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* VR HUD Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-none shadow-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400">Environment HUD</h3>
            
            <div className="space-y-6">
              {[
                { label: 'Texture Detail', val: 'Ultra', icon: Layers },
                { label: 'Lighting Sync', val: 'RTX-ON', icon: Sparkles },
                { label: 'Physics Engine', val: 'Active', icon: Box }
              ].map((control, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <control.icon className="h-4 w-4 text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{control.label}</span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-400">{control.val}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">Quick Commands</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-12 rounded-xl border-white/10 bg-white/5 text-white font-black uppercase text-[8px] tracking-widest hover:bg-white/10 transition-all">
                  Snapshot <Camera className="h-3 w-3 ml-2" />
                </Button>
                <Button variant="outline" className="h-12 rounded-xl border-white/10 bg-white/5 text-white font-black uppercase text-[8px] tracking-widest hover:bg-white/10 transition-all">
                  Sync All <Zap className="h-3 w-3 ml-2" />
                </Button>
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-2xl bg-indigo-600 rounded-xl p-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight">Security Anchor</h4>
            </div>
            <p className="text-[11px] font-medium text-white/80 leading-relaxed">
              All interactions within the VR showroom are recorded and cryptographically signed for order verification and auditing.
            </p>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[9px] font-black uppercase text-indigo-200 tracking-widest">Digital Signature: ACTIVE</span>
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
