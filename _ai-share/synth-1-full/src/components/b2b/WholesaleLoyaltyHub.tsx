'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Gift, 
  TrendingUp, 
  ArrowUpRight, 
  Zap, 
  ShieldCheck, 
  Crown,
  History,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function WholesaleLoyaltyHub() {
  const { retailerLoyalty } = useB2BState();
  const points = retailerLoyalty['retailer-1'] || 12450;

  return (
    <div className="space-y-4 p-3 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-amber-500 flex items-center justify-center">
              <Crown className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-amber-200 text-amber-600 uppercase font-black tracking-widest text-[9px]">
              Elite_Partner_v2.0
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Partner Rewards
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md">
            Earn points for early pre-orders, volume milestones, and ecosystem engagement. Unlock exclusive discounts and priority production slots.
          </p>
        </div>

        <Card className="border-none shadow-xl shadow-amber-200/20 bg-white rounded-xl p-4 flex items-center gap-3">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Points</p>
            <div className="flex items-center gap-3">
              <span className="text-base font-black text-slate-900 tabular-nums">{points.toLocaleString('ru-RU')}</span>
              <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                <Star className="h-3.5 w-3.5 text-amber-600 fill-amber-600" />
              </div>
            </div>
          </div>
          <div className="h-12 w-px bg-slate-100" />
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Partner Tier</p>
            <Badge className="bg-slate-900 text-white border-none font-black text-[10px] px-3 py-1 uppercase">PLATINUM</Badge>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Tier Progress */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-slate-900 text-white p-3 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="h-64 w-64" />
            </div>
            
            <div className="relative z-10 space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-tight">Path to Diamond</h3>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                  <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase text-emerald-400">+2,400 points this month</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end text-[10px] font-black uppercase">
                  <span>Current: Platinum</span>
                  <span className="text-amber-400">Next: Diamond (25,000 pts)</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(points / 25000) * 100}%` }}
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.5)]" 
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium italic text-right">"You're 12,550 points away from unlocking 2.5% additional wholesale discount."</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
                {[
                  { label: 'Priority Production', status: 'UNLOCKED', icon: Zap },
                  { label: 'Private Showroom Access', status: 'UNLOCKED', icon: Crown },
                  { label: 'Extended Payment Terms', status: 'DIAMOND ONLY', icon: ShieldCheck }
                ].map((perk, i) => (
                  <div key={i} className={cn(
                    "p-3 rounded-2xl border transition-all",
                    perk.status === 'UNLOCKED' ? "bg-white/5 border-white/10" : "bg-white/[0.02] border-white/5 opacity-40"
                  )}>
                    <perk.icon className={cn("h-5 w-5 mb-3", perk.status === 'UNLOCKED' ? "text-amber-400" : "text-slate-500")} />
                    <p className="text-[10px] font-black uppercase mb-1">{perk.label}</p>
                    <p className={cn("text-[8px] font-bold uppercase", perk.status === 'UNLOCKED' ? "text-emerald-400" : "text-slate-500")}>{perk.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 px-2 text-left">Active Missions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: 'Early Bird pre-order', reward: '+1,500 pts', desc: 'Place order for FW26 before Feb 20.', progress: 80 },
                { title: 'Sustainability Champion', reward: '+2,000 pts', desc: 'Order items from Recycled Tech collection.', progress: 45 }
              ].map((mission, i) => (
                <Card key={i} className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-white p-4 space-y-6 group hover:scale-[1.02] transition-all">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">{mission.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{mission.desc}</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-600 border-none font-black text-[10px] px-3 py-1 uppercase">{mission.reward}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                      <span>Progress</span>
                      <span>{mission.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900 transition-all duration-1000" style={{ width: `${mission.progress}%` }} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Redemption & History */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-4 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Redeem Points</h3>
            <div className="space-y-3">
              {[
                { title: 'Free Global Shipping', cost: 5000, icon: Gift },
                { title: 'Custom POS Branding', cost: 12000, icon: Crown },
                { title: 'Priority Sample Set', cost: 3500, icon: Zap }
              ].map((reward, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 group">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <reward.icon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-slate-900 uppercase leading-none">{reward.title}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{reward.cost.toLocaleString('ru-RU')} points</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-all" />
                </button>
              ))}
            </div>
            <Button variant="outline" className="w-full h-12 rounded-xl border-slate-100 font-black uppercase text-[9px] tracking-widest">
              View All Rewards
            </Button>
          </Card>

          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-4 space-y-6">
            <div className="flex items-center gap-3">
              <History className="h-5 w-5 text-slate-400" />
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Point History</h4>
            </div>
            <div className="space-y-4">
              {[
                { title: 'FW26 Main Order Deposit', pts: '+4,500', date: 'Feb 05' },
                { title: 'Early Review Bonus', pts: '+500', date: 'Jan 28' },
                { title: 'Shipping Voucher Redemp.', pts: '-2,500', date: 'Jan 15' }
              ].map((entry, i) => (
                <div key={i} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-900 uppercase">{entry.title}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">{entry.date}</p>
                  </div>
                  <span className={cn(
                    "text-[10px] font-black",
                    entry.pts.startsWith('+') ? "text-emerald-600" : "text-rose-600"
                  )}>{entry.pts}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
