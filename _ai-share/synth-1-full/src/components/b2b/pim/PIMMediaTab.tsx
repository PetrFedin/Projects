'use client';

import React from 'react';
import { Maximize2, Trash2, Plus, Compass, Zap, Video } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PIMMediaTabProps {
  selectedProduct: any;
}

export function PIMMediaTab({ selectedProduct }: PIMMediaTabProps) {
  return (
    <div className="space-y-4 text-left animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Image Gallery
        </h4>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-3xl bg-slate-100"
            >
              <img
                src={`https://placehold.co/400x400/f8fafc/64748b?text=SHOT_${i}`}
                className="h-full w-full object-cover"
                alt={`Shot ${i}`}
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-slate-900/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-white text-slate-900"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-white text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <button className="flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl border-4 border-dashed border-slate-100 transition-all hover:border-indigo-200 hover:bg-slate-50">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
              <Plus className="h-6 w-6 text-slate-300" />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-300">Add Media</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            3D Master Assets
          </h4>
          <Badge className="border-none bg-indigo-600 text-[8px] font-black text-white">
            USDZ / GLB SUPPORTED
          </Badge>
        </div>
        <Card className="group flex items-center justify-between rounded-xl border-none bg-slate-50 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
              <Compass className="animate-spin-slow h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black uppercase text-slate-900">
                {selectedProduct.sku}_Master.glb
              </p>
              <p className="text-[9px] font-bold uppercase text-slate-400">
                Size: 12.4 MB • Last Sync: 4h ago
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-10 rounded-xl border-slate-200 bg-white text-[9px] font-black uppercase tracking-widest"
            >
              Open Configurator
            </Button>
            <Button className="h-10 rounded-xl bg-slate-900 px-6 text-[9px] font-black uppercase tracking-widest text-white">
              Manage Textures
            </Button>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Video Lookbook
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <Card className="group relative aspect-video overflow-hidden rounded-xl border-none bg-slate-50 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1539109132304-372874a581ad?q=80&w=800"
              className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40">
              <div className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white text-slate-900 shadow-xl transition-transform hover:scale-110">
                <Video className="h-5 w-5" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <p className="text-[10px] font-black uppercase text-white">Main Campaign Shot</p>
              <Badge className="border-none bg-white/20 text-[8px] font-black text-white backdrop-blur-md">
                0:15
              </Badge>
            </div>
          </Card>
          <button className="flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border-4 border-dashed border-slate-100 transition-all hover:border-indigo-200 hover:bg-slate-50">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
              <Plus className="h-6 w-6 text-slate-300" />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-300">
              Upload Campaign Video
            </span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-slate-900 p-4 text-white">
        <div className="space-y-1">
          <h4 className="text-base font-black uppercase tracking-tight">AI Asset Studio</h4>
          <p className="text-[10px] font-medium uppercase tracking-widest text-white/50">
            Generate lifestyle content from 3D models automatically
          </p>
        </div>
        <Button className="h-12 gap-2 rounded-2xl bg-indigo-600 px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-900/20 hover:bg-indigo-700">
          Launch AI Generator <Zap className="h-4 w-4 fill-white" />
        </Button>
      </div>
    </div>
  );
}
