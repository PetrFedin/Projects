'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  RefreshCcw, 
  Droplets, 
  Wind, 
  ShieldCheck, 
  QrCode, 
  ArrowRight,
  Info,
  BarChart3,
  Factory
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';

export function SustainabilityPassport({ productId = '1' }: { productId?: string }) {
  return (
    <div className="flex flex-col gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 max-w-xl">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-emerald-600" />
            <Badge className="bg-emerald-600 text-white border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5">Eco_Ledger_v1.0</Badge>
          </div>
          <h3 className="text-base font-black uppercase tracking-tight text-slate-900 leading-none">Digital Product<br/>Passport</h3>
        </div>
        <div className="h-20 w-20 bg-white rounded-2xl p-2 shadow-xl shadow-emerald-200/50 border border-emerald-100 flex items-center justify-center">
          <QrCode className="h-full w-full text-slate-900" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Recycled Content', val: '82%', icon: RefreshCcw, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Carbon Footprint', val: '2.4kg', icon: Wind, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Water Usage', val: '12L', icon: Droplets, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Lifespan Score', val: 'A+', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50' }
        ].map((stat, i) => (
          <div key={i} className="p-3 rounded-xl bg-white border border-emerald-100 space-y-3">
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-base font-black text-slate-900">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <Card className="border-none shadow-xl shadow-emerald-200/20 rounded-xl bg-white p-4 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center">
            <Factory className="h-5 w-5 text-white" />
          </div>
          <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Supply Chain Transparency</h4>
        </div>
        <div className="space-y-4">
          {[
            { stage: 'Raw Material', location: 'Turkiye (Organic Cotton)', status: 'Verified' },
            { stage: 'Fabric Mill', location: 'Italy (Recycled Nylon)', status: 'Verified' },
            { stage: 'Assembly', location: 'Portugal (Solar-Powered)', status: 'Verified' }
          ].map((step, i) => (
            <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-slate-900 uppercase">{step.stage}</p>
                <p className="text-[8px] font-medium text-slate-400 uppercase">{step.location}</p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[7px] px-2 py-0.5 uppercase">{step.status}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl text-white">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-emerald-400" />
          <div className="space-y-0.5">
            <p className="text-[10px] font-black uppercase">Blockchain Verified</p>
            <p className="text-[8px] text-slate-400 font-medium">Tx: 0x824...f921</p>
          </div>
        </div>
        <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest gap-2 p-0 h-auto hover:bg-transparent text-emerald-400 hover:text-emerald-300">
          Full ESG Report <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
