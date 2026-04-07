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
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 text-left">
      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Image Gallery</h4>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="relative aspect-square rounded-3xl bg-slate-100 overflow-hidden group">
              <img src={`https://placehold.co/400x400/f8fafc/64748b?text=SHOT_${i}`} className="w-full h-full object-cover" alt={`Shot ${i}`} />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white text-slate-900"><Maximize2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white text-rose-600"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
          <button className="aspect-square rounded-3xl border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-indigo-200 hover:bg-slate-50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">
              <Plus className="h-6 w-6 text-slate-300" />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-300">Add Media</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">3D Master Assets</h4>
          <Badge className="bg-indigo-600 text-white border-none text-[8px] font-black">USDZ / GLB SUPPORTED</Badge>
        </div>
        <Card className="border-none shadow-sm bg-slate-50 p-4 rounded-xl flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
              <Compass className="h-8 w-8 animate-spin-slow" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-black uppercase text-slate-900">{selectedProduct.sku}_Master.glb</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Size: 12.4 MB • Last Sync: 4h ago</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-10 rounded-xl bg-white border-slate-200 text-[9px] font-black uppercase tracking-widest">Open Configurator</Button>
            <Button className="h-10 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-6">Manage Textures</Button>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Video Lookbook</h4>
        <div className="grid grid-cols-2 gap-3">
          <Card className="border-none shadow-sm bg-slate-50 aspect-video rounded-xl overflow-hidden relative group">
            <img src="https://images.unsplash.com/photo-1539109132304-372874a581ad?q=80&w=800" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-xl cursor-pointer hover:scale-110 transition-transform">
                <Video className="h-5 w-5" />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <p className="text-[10px] font-black text-white uppercase">Main Campaign Shot</p>
              <Badge className="bg-white/20 backdrop-blur-md text-white border-none text-[8px] font-black">0:15</Badge>
            </div>
          </Card>
          <button className="aspect-video rounded-xl border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-indigo-200 hover:bg-slate-50 transition-all">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center">
              <Plus className="h-6 w-6 text-slate-300" />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-300">Upload Campaign Video</span>
          </button>
        </div>
      </div>
      
      <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-base font-black uppercase tracking-tight">AI Asset Studio</h4>
          <p className="text-[10px] font-medium text-white/50 uppercase tracking-widest">Generate lifestyle content from 3D models automatically</p>
        </div>
        <Button className="h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-indigo-900/20">
          Launch AI Generator <Zap className="h-4 w-4 fill-white" />
        </Button>
      </div>
    </div>
  );
}
