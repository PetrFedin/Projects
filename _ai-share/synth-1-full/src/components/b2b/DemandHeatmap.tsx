'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Map as MapIcon, 
  TrendingUp, 
  Users, 
  Zap, 
  ArrowUpRight, 
  Globe, 
  Search,
  Filter,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';

export function DemandHeatmap() {
  const [activeLayer, setActiveLayer] = useState<'demand' | 'inventory' | 'partners'>('demand');

  const regions = [
    { name: 'Moscow & Central', demand: 92, inventory: 45, partners: 12, trend: '+14%' },
    { name: 'Dubai / MENA', demand: 85, inventory: 60, partners: 8, trend: '+22%' },
    { name: 'Milan / EU', demand: 78, inventory: 30, partners: 15, trend: '+5%' },
    { name: 'Shanghai / Asia', demand: 64, inventory: 80, partners: 4, trend: '+18%' }
  ];

  return (
    <div className="space-y-4 p-3 bg-slate-50 min-h-screen text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Globe className="h-5 w-5" />
            </div>
            <Badge variant="outline" className="border-indigo-100 text-indigo-600 uppercase font-black tracking-widest text-[9px]">
              MARKET_INTEL_v2.0
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Global Demand<br/>Heatmap
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md">
            AI-driven market sentiment analysis. Synchronize your production with real-world demand clusters.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          {[
            { id: 'demand', label: 'Demand', icon: TrendingUp },
            { id: 'inventory', label: 'Inventory', icon: Layers },
            { id: 'partners', label: 'Partners', icon: Users },
          ].map(layer => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeLayer === layer.id 
                  ? "bg-slate-900 text-white shadow-xl" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              )}
            >
              <layer.icon className="h-3.5 w-3.5" />
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <div className="lg:col-span-8">
          <Card className="border-none shadow-2xl bg-slate-900 rounded-xl aspect-[16/10] relative overflow-hidden group">
            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000')] bg-cover bg-center grayscale" />
            
            {/* Interactive Nodes */}
            <div className="absolute top-[30%] left-[20%] group/node">
              <div className="h-4 w-4 bg-indigo-500 rounded-full animate-ping absolute opacity-75" />
              <div className="h-4 w-4 bg-indigo-600 rounded-full relative shadow-[0_0_20px_rgba(79,70,229,0.8)] cursor-pointer" />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-xl p-3 shadow-2xl w-32 opacity-0 group-hover/node:opacity-100 transition-all pointer-events-none z-20">
                <p className="text-[10px] font-black text-slate-900 uppercase">New York</p>
                <p className="text-[8px] font-bold text-indigo-600 uppercase">Demand: 94%</p>
              </div>
            </div>

            <div className="absolute top-[40%] left-[50%] group/node">
              <div className="h-6 w-6 bg-emerald-500 rounded-full animate-ping absolute opacity-75" />
              <div className="h-6 w-6 bg-emerald-600 rounded-full relative shadow-[0_0_30px_rgba(16,185,129,0.8)] cursor-pointer" />
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-xl p-3 shadow-2xl w-32 opacity-0 group-hover/node:opacity-100 transition-all pointer-events-none z-20">
                <p className="text-[10px] font-black text-slate-900 uppercase">Moscow</p>
                <p className="text-[8px] font-bold text-emerald-600 uppercase">Demand: 98%</p>
              </div>
            </div>

            <div className="absolute bottom-[30%] right-[20%] group/node">
              <div className="h-3 w-3 bg-amber-500 rounded-full animate-ping absolute opacity-75" />
              <div className="h-3 w-3 bg-amber-600 rounded-full relative shadow-[0_0_15px_rgba(245,158,11,0.8)] cursor-pointer" />
            </div>

            <div className="absolute bottom-8 left-8 flex items-center gap-3 bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-indigo-500" />
                <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">High Potential</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Active Growth</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl bg-white p-4 rounded-xl space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Regional Performance</h4>
            <div className="space-y-4">
              {regions.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-all">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-900 uppercase">{r.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Sentiment</span>
                      <div className="h-1 w-12 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600" style={{ width: `${r.demand}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-emerald-600">{r.trend}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Growth</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full h-12 rounded-xl border-slate-100 font-black uppercase text-[9px] tracking-widest">Generate Global Strategy</Button>
          </Card>

          <Card className="border-none shadow-2xl bg-indigo-600 text-white p-4 rounded-xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20"><Sparkles className="h-24 w-24" /></div>
            <div className="relative z-10 space-y-4">
              <h5 className="text-sm font-black uppercase tracking-widest text-indigo-200">AI Market Prediction</h5>
              <p className="text-[10px] font-medium text-white/80 uppercase tracking-widest leading-relaxed">
                Expect a **15% surge** in demand for **Thermal Shells** in Northern Europe due to forecasted temperature drops in Q4.
              </p>
              <Button className="w-full h-10 bg-white text-indigo-600 rounded-xl font-black uppercase text-[9px] tracking-widest">Allocate Stock</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
