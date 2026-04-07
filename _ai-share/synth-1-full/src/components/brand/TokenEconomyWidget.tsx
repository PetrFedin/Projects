'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  ShieldCheck, 
  ArrowUpRight, 
  Cpu, 
  BarChart3, 
  Info,
  Layers,
  Activity,
  ChevronRight,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function TokenEconomyWidget() {
  const [isEconomyMode, setIsEconomyMode] = useState(true);
  const [tokenUsage, setTokenUsage] = useState(64); // %

  return (
    <Card className="rounded-xl border-none shadow-2xl bg-slate-900 text-white p-4 overflow-hidden relative group h-full border border-white/5">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
        <Cpu className="h-32 w-32 text-indigo-400" />
      </div>
      
      <div className="relative z-10 space-y-5 flex flex-col h-full">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/20 rounded-lg border border-indigo-500/30 text-indigo-400">
                <Zap className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight">AI Token Economy</h3>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Resource Allocation & Audit</p>
          </div>
          <Badge className={cn(
            "border-none font-black text-[7px] uppercase px-1.5 h-4 tracking-widest shadow-lg",
            isEconomyMode ? "bg-emerald-500 text-white" : "bg-indigo-500 text-white"
          )}>
            {isEconomyMode ? "Economy Active" : "Performance Mode"}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
              <span className="text-slate-400">Daily Quota Utilization</span>
              <span className={cn(
                "tabular-nums",
                tokenUsage > 80 ? "text-rose-400" : "text-indigo-400"
              )}>{tokenUsage}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${tokenUsage}%` }}
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  tokenUsage > 80 ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" : "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-none">Cost Avoided (AI)</p>
              <p className="text-xs font-black text-emerald-400 tracking-tight">$142.50</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
              <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest leading-none">Tokens Saved</p>
              <p className="text-xs font-black text-indigo-400 tracking-tight">1.2M</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-0.5">
              <p className="text-[9px] font-black text-white uppercase tracking-tight leading-none">Smart Optimization</p>
              <p className="text-[7px] font-medium text-slate-400 uppercase tracking-widest">Horizontal connection to Analytics</p>
            </div>
            <button 
              onClick={() => setIsEconomyMode(!isEconomyMode)}
              className="focus:outline-none transition-all hover:scale-110"
            >
              {isEconomyMode ? (
                <ToggleRight className="h-6 w-6 text-emerald-500" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-slate-600" />
              )}
            </button>
          </div>
          
          <Button variant="ghost" className="w-full h-8 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] transition-all gap-2 group/btn">
            Configure Quotas <ChevronRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
