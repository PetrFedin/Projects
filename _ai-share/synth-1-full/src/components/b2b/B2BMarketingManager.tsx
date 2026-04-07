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
  MoreVertical
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
      status: 'active'
    },
    {
      id: 'b-2',
      title: 'Summer Outlet Drop',
      placement: 'showroom_sidebar',
      views: 8900,
      clicks: 312,
      ctr: '3.5%',
      status: 'paused'
    }
  ];

  return (
    <div className="space-y-4 p-3 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-200">
              <Megaphone className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-rose-100 text-rose-600 uppercase font-black tracking-widest text-[9px]">
              Campaign_Manager_v1.2
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Retailer Engagement
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md">
            Manage in-app marketing placements. Drive traffic to your new collections and private linesheets through targeted banners.
          </p>
        </div>

        <Button 
          onClick={() => setIsCreating(true)}
          className="h-10 bg-slate-900 text-white rounded-[1.5rem] px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-2xl shadow-slate-200"
        >
          <Plus className="h-5 w-5" /> Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Active Campaigns */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Live Placements</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">View:</span>
              <select className="bg-transparent border-none text-[10px] font-black text-slate-900 focus:ring-0 uppercase cursor-pointer">
                <option>All Placements</option>
                <option>Active Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {mockBanners.map((banner) => (
              <Card key={banner.id} className="group border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden bg-white hover:scale-[1.01] transition-all">
                <CardContent className="p-0">
                  <div className="flex items-center p-4 gap-3">
                    <div className="h-24 w-40 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden relative group-hover:border-rose-200 transition-colors">
                      <ImageIcon className="h-8 w-8 text-slate-300" />
                      <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="text-white text-[8px] font-black uppercase">Preview</Button>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-base font-black uppercase tracking-tight text-slate-900">{banner.title}</h4>
                        <Badge className={cn(
                          "text-[8px] font-black uppercase px-2 py-0.5",
                          banner.status === 'active' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                        )}>
                          {banner.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Layout className="h-3.5 w-3.5" />
                          <span className="text-[9px] font-bold uppercase">{banner.placement.replace('_', ' ')}</span>
                        </div>
                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <TrendingUp className="h-3.5 w-3.5" />
                          <span className="text-[9px] font-bold uppercase">CTR: {banner.ctr}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pr-8 border-r border-slate-50">
                      <div className="space-y-1 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <Eye className="h-4 w-4 text-slate-300" />
                          <span className="text-sm font-black text-slate-900">{banner.views.toLocaleString('ru-RU')}</span>
                        </div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Views</p>
                      </div>
                      <div className="space-y-1 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <MousePointer2 className="h-4 w-4 text-slate-300" />
                          <span className="text-sm font-black text-slate-900">{banner.clicks.toLocaleString('ru-RU')}</span>
                        </div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Clicks</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-4">
                      <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-slate-50">
                        <Settings2 className="h-5 w-5 text-slate-400" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-slate-50">
                        <MoreVertical className="h-5 w-5 text-slate-400" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Campaign Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-rose-600 text-white p-3 space-y-4 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="h-32 w-32" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <h3 className="text-sm font-black uppercase tracking-tight">Global Performance</h3>
              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-200">Network Reach</span>
                  <span className="text-base font-black tabular-nums">128.4K</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '74%' }}
                    className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                  />
                </div>
              </div>
              <div className="pt-4 grid grid-cols-2 gap-3 border-t border-white/10">
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase text-rose-200 tracking-widest">Conversion Lift</p>
                  <p className="text-sm font-black">+14.2%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase text-rose-200 tracking-widest">Avg. Engagement</p>
                  <p className="text-sm font-black">4.8%</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center">
                <Layers className="h-5 w-5 text-slate-400" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Placement Inventory</h4>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Showroom Hero', status: 'Booked', cost: 'Premium' },
                { name: 'Dashboard Sidebar', status: 'Available', cost: 'Standard' },
                { name: 'Orders Footer', status: 'Available', cost: 'Basic' }
              ].map((slot, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-slate-900 uppercase">{slot.name}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">{slot.cost} Tier</p>
                  </div>
                  <Badge className={cn(
                    "text-[7px] font-black uppercase px-2 py-0.5",
                    slot.status === 'Booked' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                  )}>{slot.status}</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full h-12 rounded-xl border-slate-100 font-black uppercase text-[9px] tracking-widest gap-2">
              Explore All Ad Inventory <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
