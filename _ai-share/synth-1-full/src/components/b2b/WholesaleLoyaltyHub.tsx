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
  Plus,
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
    <div className="bg-bg-surface2 min-h-screen space-y-4 p-3">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500">
              <Crown className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
              className="border-amber-200 text-[9px] font-black uppercase tracking-widest text-amber-600"
            >
              Elite_Partner_v2.0
            </Badge>
          </div>
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
            Partner Rewards
          </h2>
          <p className="text-text-muted max-w-md text-xs font-medium">
            Earn points for early pre-orders, volume milestones, and ecosystem engagement. Unlock
            exclusive discounts and priority production slots.
          </p>
        </div>

        <Card className="flex items-center gap-3 rounded-xl border-none bg-white p-4 shadow-xl shadow-amber-200/20">
          <div className="space-y-1">
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
              Available Points
            </p>
            <div className="flex items-center gap-3">
              <span className="text-text-primary text-base font-black tabular-nums">
                {points.toLocaleString('ru-RU')}
              </span>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                <Star className="h-3.5 w-3.5 fill-amber-600 text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-bg-surface2 h-12 w-px" />
          <div className="space-y-1">
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
              Partner Tier
            </p>
            <Badge className="bg-text-primary border-none px-3 py-1 text-[10px] font-black uppercase text-white">
              PLATINUM
            </Badge>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Tier Progress */}
        <div className="space-y-4 lg:col-span-8">
          <Card className="bg-text-primary relative overflow-hidden rounded-xl border-none p-3 text-white shadow-2xl shadow-md">
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <TrendingUp className="h-64 w-64" />
            </div>

            <div className="relative z-10 space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-tight">Path to Diamond</h3>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md">
                  <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase text-emerald-400">
                    +2,400 points this month
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-end justify-between text-[10px] font-black uppercase">
                  <span>Current: Platinum</span>
                  <span className="text-amber-400">Next: Diamond (25,000 pts)</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(points / 25000) * 100}%` }}
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                  />
                </div>
                <p className="text-text-muted text-right text-[11px] font-medium italic">
                  "You're 12,550 points away from unlocking 2.5% additional wholesale discount."
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-4 md:grid-cols-3">
                {[
                  { label: 'Priority Production', status: 'UNLOCKED', icon: Zap },
                  { label: 'Private Showroom Access', status: 'UNLOCKED', icon: Crown },
                  { label: 'Extended Payment Terms', status: 'DIAMOND ONLY', icon: ShieldCheck },
                ].map((perk, i) => (
                  <div
                    key={i}
                    className={cn(
                      'rounded-2xl border p-3 transition-all',
                      perk.status === 'UNLOCKED'
                        ? 'border-white/10 bg-white/5'
                        : 'border-white/5 bg-white/[0.02] opacity-40'
                    )}
                  >
                    <perk.icon
                      className={cn(
                        'mb-3 h-5 w-5',
                        perk.status === 'UNLOCKED' ? 'text-amber-400' : 'text-text-secondary'
                      )}
                    />
                    <p className="mb-1 text-[10px] font-black uppercase">{perk.label}</p>
                    <p
                      className={cn(
                        'text-[8px] font-bold uppercase',
                        perk.status === 'UNLOCKED' ? 'text-emerald-400' : 'text-text-secondary'
                      )}
                    >
                      {perk.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <h3 className="text-text-muted px-2 text-left text-sm font-black uppercase tracking-widest">
              Active Missions
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                {
                  title: 'Early Bird pre-order',
                  reward: '+1,500 pts',
                  desc: 'Place order for FW26 before Feb 20.',
                  progress: 80,
                },
                {
                  title: 'Sustainability Champion',
                  reward: '+2,000 pts',
                  desc: 'Order items from Recycled Tech collection.',
                  progress: 45,
                },
              ].map((mission, i) => (
                <Card
                  key={i}
                  className="group space-y-6 rounded-xl border-none bg-white p-4 shadow-md shadow-xl transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
                        {mission.title}
                      </h4>
                      <p className="text-text-muted text-[10px] font-medium leading-relaxed">
                        {mission.desc}
                      </p>
                    </div>
                    <Badge className="border-none bg-amber-100 px-3 py-1 text-[10px] font-black uppercase text-amber-600">
                      {mission.reward}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="text-text-muted flex justify-between text-[9px] font-black uppercase">
                      <span>Progress</span>
                      <span>{mission.progress}%</span>
                    </div>
                    <div className="bg-bg-surface2 h-1.5 w-full overflow-hidden rounded-full">
                      <div
                        className="bg-text-primary h-full transition-all duration-1000"
                        style={{ width: `${mission.progress}%` }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Redemption & History */}
        <div className="space-y-4 lg:col-span-4">
          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-md">
            <h3 className="text-text-primary text-sm font-black uppercase tracking-widest">
              Redeem Points
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Free Global Shipping', cost: 5000, icon: Gift },
                { title: 'Custom POS Branding', cost: 12000, icon: Crown },
                { title: 'Priority Sample Set', cost: 3500, icon: Zap },
              ].map((reward, i) => (
                <button
                  key={i}
                  className="bg-bg-surface2 hover:bg-bg-surface2 hover:border-border-default group flex w-full items-center justify-between rounded-2xl border border-transparent p-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                      <reward.icon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="text-left">
                      <p className="text-text-primary text-[10px] font-black uppercase leading-none">
                        {reward.title}
                      </p>
                      <p className="text-text-muted mt-1 text-[8px] font-bold uppercase">
                        {reward.cost.toLocaleString('ru-RU')} points
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="text-text-muted group-hover:text-text-primary h-4 w-4 transition-all" />
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              className="border-border-subtle h-12 w-full rounded-xl text-[9px] font-black uppercase tracking-widest"
            >
              View All Rewards
            </Button>
          </Card>

          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-md">
            <div className="flex items-center gap-3">
              <History className="text-text-muted h-5 w-5" />
              <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
                Point History
              </h4>
            </div>
            <div className="space-y-4">
              {[
                { title: 'FW26 Main Order Deposit', pts: '+4,500', date: 'Feb 05' },
                { title: 'Early Review Bonus', pts: '+500', date: 'Jan 28' },
                { title: 'Shipping Voucher Redemp.', pts: '-2,500', date: 'Jan 15' },
              ].map((entry, i) => (
                <div
                  key={i}
                  className="border-border-subtle flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="space-y-0.5">
                    <p className="text-text-primary text-[10px] font-black uppercase">
                      {entry.title}
                    </p>
                    <p className="text-text-muted text-[8px] font-bold uppercase">{entry.date}</p>
                  </div>
                  <span
                    className={cn(
                      'text-[10px] font-black',
                      entry.pts.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'
                    )}
                  >
                    {entry.pts}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
