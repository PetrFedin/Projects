'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone,
  BarChart3,
  MousePointer2,
  Eye,
  Plus,
  Settings2,
  Image as ImageIcon,
  ArrowUpRight,
  TrendingUp,
  Layout,
  Layers,
  ChevronRight,
  Zap,
  MoreVertical,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function B2BMarketingManager() {
  const { viewRole } = useUIState();
  const { marketingBanners, addMarketingBanner } = useB2BState();
  const [isCreating, setIsCreating] = useState(false);

  const mockBanners = [
    {
      id: 'b-1',
      title: 'FW26 VIP Preview',
      placement: 'dashboard',
      views: 12450,
      clicks: 842,
      ctr: '6.7%',
      status: 'active',
    },
    {
      id: 'b-2',
      title: 'Summer Outlet Drop',
      placement: 'showroom_sidebar',
      views: 8900,
      clicks: 312,
      ctr: '3.5%',
      status: 'paused',
    },
  ];

  return (
<<<<<<< HEAD
    <div className="min-h-screen space-y-4 bg-slate-50 p-3">
=======
    <div className="bg-bg-surface2 min-h-screen space-y-4 p-3">
>>>>>>> recover/cabinet-wip-from-stash
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 shadow-lg shadow-rose-200">
              <Megaphone className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
              className="border-rose-100 text-[9px] font-black uppercase tracking-widest text-rose-600"
            >
              Campaign_Manager_v1.2
            </Badge>
          </div>
<<<<<<< HEAD
          <h2 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900 md:text-sm">
            Retailer Engagement
          </h2>
          <p className="max-w-md text-xs font-medium text-slate-400">
=======
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
            Retailer Engagement
          </h2>
          <p className="text-text-muted max-w-md text-xs font-medium">
>>>>>>> recover/cabinet-wip-from-stash
            Manage in-app marketing placements. Drive traffic to your new collections and private
            linesheets through targeted banners.
          </p>
        </div>

        <Button
          onClick={() => setIsCreating(true)}
<<<<<<< HEAD
          className="h-10 gap-2 rounded-[1.5rem] bg-slate-900 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl shadow-slate-200"
=======
          className="bg-text-primary h-10 gap-2 rounded-[1.5rem] px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl shadow-md"
>>>>>>> recover/cabinet-wip-from-stash
        >
          <Plus className="h-5 w-5" /> Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Active Campaigns */}
        <div className="space-y-6 lg:col-span-8">
          <div className="flex items-center justify-between px-2">
<<<<<<< HEAD
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
              Live Placements
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase text-slate-400">View:</span>
              <select className="cursor-pointer border-none bg-transparent text-[10px] font-black uppercase text-slate-900 focus:ring-0">
=======
            <h3 className="text-text-muted text-sm font-black uppercase tracking-widest">
              Live Placements
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-text-muted text-[10px] font-bold uppercase">View:</span>
              <select className="text-text-primary cursor-pointer border-none bg-transparent text-[10px] font-black uppercase focus:ring-0">
>>>>>>> recover/cabinet-wip-from-stash
                <option>All Placements</option>
                <option>Active Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {mockBanners.map((banner) => (
              <Card
                key={banner.id}
<<<<<<< HEAD
                className="group overflow-hidden rounded-xl border-none bg-white shadow-xl shadow-slate-200/50 transition-all hover:scale-[1.01]"
              >
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 p-4">
                    <div className="relative flex h-24 w-40 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 transition-colors group-hover:border-rose-200">
                      <ImageIcon className="h-8 w-8 text-slate-300" />
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 transition-opacity group-hover:opacity-100">
=======
                className="group overflow-hidden rounded-xl border-none bg-white shadow-md shadow-xl transition-all hover:scale-[1.01]"
              >
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 p-4">
                    <div className="bg-bg-surface2 border-border-default relative flex h-24 w-40 items-center justify-center overflow-hidden rounded-2xl border transition-colors group-hover:border-rose-200">
                      <ImageIcon className="text-text-muted h-8 w-8" />
                      <div className="bg-text-primary/40 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
>>>>>>> recover/cabinet-wip-from-stash
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[8px] font-black uppercase text-white"
                        >
                          Preview
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
<<<<<<< HEAD
                        <h4 className="text-base font-black uppercase tracking-tight text-slate-900">
=======
                        <h4 className="text-text-primary text-base font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                          {banner.title}
                        </h4>
                        <Badge
                          className={cn(
                            'px-2 py-0.5 text-[8px] font-black uppercase',
                            banner.status === 'active'
                              ? 'bg-emerald-100 text-emerald-600'
<<<<<<< HEAD
                              : 'bg-slate-100 text-slate-400'
=======
                              : 'bg-bg-surface2 text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                          )}
                        >
                          {banner.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-text-muted flex items-center gap-1.5">
                          <Layout className="h-3.5 w-3.5" />
                          <span className="text-[9px] font-bold uppercase">
                            {banner.placement.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="bg-border-subtle h-1 w-1 rounded-full" />
                        <div className="text-text-muted flex items-center gap-1.5">
                          <TrendingUp className="h-3.5 w-3.5" />
                          <span className="text-[9px] font-bold uppercase">CTR: {banner.ctr}</span>
                        </div>
                      </div>
                    </div>

<<<<<<< HEAD
                    <div className="grid grid-cols-2 gap-3 border-r border-slate-50 pr-8">
                      <div className="space-y-1 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Eye className="h-4 w-4 text-slate-300" />
                          <span className="text-sm font-black text-slate-900">
                            {banner.views.toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
                    <div className="border-border-subtle grid grid-cols-2 gap-3 border-r pr-8">
                      <div className="space-y-1 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Eye className="text-text-muted h-4 w-4" />
                          <span className="text-text-primary text-sm font-black">
                            {banner.views.toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <p className="text-text-muted text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                          Views
                        </p>
                      </div>
                      <div className="space-y-1 text-center">
                        <div className="flex items-center justify-center gap-2">
<<<<<<< HEAD
                          <MousePointer2 className="h-4 w-4 text-slate-300" />
                          <span className="text-sm font-black text-slate-900">
                            {banner.clicks.toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
=======
                          <MousePointer2 className="text-text-muted h-4 w-4" />
                          <span className="text-text-primary text-sm font-black">
                            {banner.clicks.toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <p className="text-text-muted text-[8px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                          Clicks
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-4">
                      <Button
                        variant="ghost"
                        size="icon"
<<<<<<< HEAD
                        className="h-12 w-12 rounded-xl hover:bg-slate-50"
                      >
                        <Settings2 className="h-5 w-5 text-slate-400" />
=======
                        className="hover:bg-bg-surface2 h-12 w-12 rounded-xl"
                      >
                        <Settings2 className="text-text-muted h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
<<<<<<< HEAD
                        className="h-12 w-12 rounded-xl hover:bg-slate-50"
                      >
                        <MoreVertical className="h-5 w-5 text-slate-400" />
=======
                        className="hover:bg-bg-surface2 h-12 w-12 rounded-xl"
                      >
                        <MoreVertical className="text-text-muted h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Campaign Intelligence Sidebar */}
        <div className="space-y-4 lg:col-span-4">
<<<<<<< HEAD
          <Card className="relative space-y-4 overflow-hidden rounded-xl border-none bg-rose-600 p-3 text-white shadow-2xl shadow-slate-200/50">
=======
          <Card className="relative space-y-4 overflow-hidden rounded-xl border-none bg-rose-600 p-3 text-white shadow-2xl shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <Zap className="h-32 w-32" />
            </div>

            <div className="relative z-10 space-y-6">
              <h3 className="text-sm font-black uppercase tracking-tight">Global Performance</h3>
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-200">
                    Network Reach
                  </span>
                  <span className="text-base font-black tabular-nums">128.4K</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '74%' }}
                    className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-widest text-rose-200">
                    Conversion Lift
                  </p>
                  <p className="text-sm font-black">+14.2%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase tracking-widest text-rose-200">
                    Avg. Engagement
                  </p>
                  <p className="text-sm font-black">4.8%</p>
                </div>
              </div>
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                <Layers className="h-5 w-5 text-slate-400" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">
=======
          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-bg-surface2 flex h-10 w-10 items-center justify-center rounded-xl">
                <Layers className="text-text-muted h-5 w-5" />
              </div>
              <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                Placement Inventory
              </h4>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Showroom Hero', status: 'Booked', cost: 'Premium' },
                { name: 'Dashboard Sidebar', status: 'Available', cost: 'Standard' },
                { name: 'Orders Footer', status: 'Available', cost: 'Basic' },
              ].map((slot, i) => (
                <div
                  key={i}
<<<<<<< HEAD
                  className="flex items-center justify-between rounded-2xl border border-transparent bg-slate-50 p-4 transition-all hover:border-slate-100"
                >
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase text-slate-900">{slot.name}</p>
                    <p className="text-[8px] font-bold uppercase text-slate-400">
=======
                  className="bg-bg-surface2 hover:border-border-subtle flex items-center justify-between rounded-2xl border border-transparent p-4 transition-all"
                >
                  <div className="space-y-0.5">
                    <p className="text-text-primary text-[10px] font-black uppercase">
                      {slot.name}
                    </p>
                    <p className="text-text-muted text-[8px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                      {slot.cost} Tier
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      'px-2 py-0.5 text-[7px] font-black uppercase',
                      slot.status === 'Booked'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-emerald-100 text-emerald-600'
                    )}
                  >
                    {slot.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
<<<<<<< HEAD
              className="h-12 w-full gap-2 rounded-xl border-slate-100 text-[9px] font-black uppercase tracking-widest"
=======
              className="border-border-subtle h-12 w-full gap-2 rounded-xl text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
            >
              Explore All Ad Inventory <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
