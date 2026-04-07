'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MoreHorizontal, PlusCircle, Rocket, Edit, BarChart2,
  TrendingUp, Target, Clock, DollarSign, ArrowUpRight,
  Bot, Sparkles, Filter, Search, ChevronRight, Activity,
  Zap, Package, Megaphone
} from "lucide-react";
import { kickstarterProjects } from "@/lib/kickstarter";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getMarketingLinks } from "@/lib/data/entity-links";
import { RelatedModulesBlock } from "@/components/brand/RelatedModulesBlock";
import { fmtNumber, fmtMoney } from "@/lib/format";
const PromotionsContent = dynamic(() => import('@/app/brand/promotions/page'), { ssr: false });
const TrendSentimentContent = dynamic(() => import('@/app/brand/marketing/trend-sentiment/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const HeritageTimelineContent = dynamic(() => import('@/app/brand/marketing/heritage-timeline/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const StyleMeContent = dynamic(() => import('@/app/brand/marketing/style-me-upsell/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const LocalInventoryAdsContent = dynamic(() => import('@/app/brand/marketing/local-inventory-ads/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });

const statusConfig: { [key: string]: { label: string; color: string; bg: string } } = {
    live: { label: 'LIVE CAMPAIGN', color: 'text-emerald-700', bg: 'bg-emerald-50' },
    successful: { label: 'GOAL REACHED', color: 'text-blue-700', bg: 'bg-blue-50' },
    production: { label: 'IN PRODUCTION', color: 'text-indigo-700', bg: 'bg-indigo-50' },
    draft: { label: 'DRAFT MODE', color: 'text-slate-500', bg: 'bg-slate-50' }
};

export default function BrandKickstarterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tab, setTab] = useState('campaigns');

  const brandCampaigns = useMemo(() => {
    return kickstarterProjects.map(p => ({
    ...p,
    profitMargin: p.productionCost && p.preorderPrice > p.productionCost ? ((p.preorderPrice - p.productionCost) / p.preorderPrice) * 100 : 0,
    daysLeft: Math.max(0, Math.ceil((new Date(p.endAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))),
    })).filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  return (
    <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl pb-24 animate-in fade-in duration-700">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="bg-slate-100/80 border border-slate-200 h-9 px-1 gap-0.5 flex-wrap">
          <TabsTrigger value="campaigns" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
            <Rocket className="h-3.5 w-3.5" />AI Кампании
          </TabsTrigger>
          <TabsTrigger value="promo" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
            <Megaphone className="h-3.5 w-3.5" />Промо и акции
          </TabsTrigger>
          <TabsTrigger value="trends" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
            Радар трендов
          </TabsTrigger>
          <TabsTrigger value="timeline" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
            Timeline
          </TabsTrigger>
          <TabsTrigger value="style-me" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
            Style-Me
          </TabsTrigger>
          <TabsTrigger value="local-ads" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
            Яндекс Карты
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-4">
      {/* Control Panel: Executive Style */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <Link href="/brand" className="hover:text-indigo-600 transition-colors">Organization</Link>
            <ChevronRight className="h-2 w-2" />
            <span className="text-slate-300">Crowdfunding Matrix</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold font-headline tracking-tighter uppercase text-slate-900 leading-none">Pre-Order Hub 2.0</h1>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[7px] px-1.5 h-4 gap-1 tracking-widest shadow-sm transition-all">
               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> SUCCESS RATE: 100%
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <Button variant="ghost" className="h-7 px-3 bg-white text-slate-600 rounded-lg font-bold uppercase text-[9px] tracking-widest shadow-sm border border-slate-200 transition-all hover:text-indigo-600">
              <Activity className="mr-1.5 h-3 w-3" /> Market Interest
            </Button>
            <Button asChild className="h-7 px-4 rounded-lg bg-slate-900 text-white text-[9px] font-bold uppercase gap-1.5 hover:bg-indigo-600 transition-all shadow-lg border border-slate-900 tracking-widest">
              <Link href="/brand/kickstarter/new">
                <PlusCircle className="h-3.5 w-3.5" /> New Campaign
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* --- ANALYTICAL GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "TOTAL PRE-ORDER VAL", val: "4.2M ₽", sub: "+24.5%", trend: "up", icon: Rocket, bg: 'bg-indigo-50/50' },
            { label: "BACKER COUNT", val: "842", sub: "Global", trend: "up", icon: TrendingUp, bg: 'bg-blue-50/50' },
            { label: "AVG PROFIT MARGIN", val: "42.8%", sub: "Stable", trend: "up", icon: DollarSign, bg: 'bg-emerald-50/50' },
            { label: "GOAL ATTAINMENT", val: "88.4%", sub: "Live", trend: "up", icon: Target, bg: 'bg-amber-50/50' },
          ].map((m, i) => (
            <Card key={i} className="border border-slate-100 shadow-sm bg-white p-3.5 group hover:border-indigo-100 transition-all rounded-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none">{m.label}</span>
                <div className={cn("p-1.5 rounded-lg shadow-inner border border-slate-200/50", m.bg)}>
                  <m.icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold tracking-tighter text-slate-900 tabular-nums uppercase leading-none">{m.val}</span>
                <span className={cn("text-[8px] font-bold uppercase px-1 rounded h-3.5 flex items-center tracking-widest", m.trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>{m.sub}</span>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
          <div className="xl:col-span-9 space-y-3">
            {/* --- TOOLBAR --- */}
            <div className="bg-slate-100 p-1 flex items-center justify-between rounded-xl border border-slate-200 shadow-inner">
              <div className="flex items-center gap-1.5">
                <div className="flex bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
                  <button className="h-6.5 px-3 bg-slate-900 text-white text-[9px] font-bold uppercase rounded-md shadow-sm transition-all">Current</button>
                  <button className="h-6.5 px-3 text-slate-400 text-[9px] font-bold uppercase hover:bg-slate-50 rounded-md transition-all">Completed</button>
                </div>
                <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />
                <Badge variant="outline" className="bg-white text-amber-600 border-slate-200 text-[8px] font-bold px-2 h-6.5 rounded-md shadow-sm tracking-widest uppercase flex items-center">CROWDFUNDING HUB</Badge>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                  <Input 
                    placeholder="Search campaigns..." 
                    className="h-7 pl-8 w-32 md:w-44 bg-white border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-tight shadow-sm focus:ring-1 focus:ring-indigo-500" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-all">
                  <Filter className="h-3 w-3 text-slate-400" />
                </Button>
              </div>
            </div>

            {/* --- CAMPAIGNS TABLE --- */}
            <div className="border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm hover:border-indigo-100/50 transition-all">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-9">Campaign Project</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-9">Target Progress</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-9">Backers</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-9">Profit Forecast</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-9">Status</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] w-12 h-9"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                {brandCampaigns.map((campaign) => {
                    const progress = (campaign.currentQuantity / campaign.targetQuantity) * 100;
                    const statusInfo = statusConfig[campaign.status];
                    return (
                      <tr key={campaign.id} className="hover:bg-slate-50/50 transition-all group h-12">
                        <td className="px-4 py-2">
                          <Link href={`/kickstarter/${campaign.id}`} className="text-[11px] font-bold text-slate-900 hover:text-indigo-600 transition-colors underline decoration-slate-200 underline-offset-4 uppercase tracking-tighter">
                            {campaign.title}
                          </Link>
                          <p className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest italic opacity-60 tabular-nums leading-none">{campaign.daysLeft} DAYS LEFT</p>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex flex-col gap-1 w-32">
                            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                              <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-[8px] font-bold tabular-nums text-slate-400 uppercase tracking-widest">{progress.toFixed(0)}% ATTAINED</span>
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-[11px] font-bold tabular-nums text-slate-900 tracking-tighter">{campaign.currentQuantity}</span>
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-[11px] font-bold tabular-nums text-emerald-600 tracking-tighter">+{campaign.profitMargin.toFixed(1)}%</span>
                        </td>
                        <td className="px-4 py-2">
                          <Badge variant="outline" className={cn(
                            "text-[7px] font-bold px-1.5 h-3.5 rounded shadow-sm uppercase tracking-widest border transition-all",
                            statusInfo.bg, statusInfo.color, "border-slate-100"
                          )}>
                            {statusInfo.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button className="h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-slate-900 rounded-md text-slate-400 hover:text-white transition-all"><MoreHorizontal className="h-3.5 w-3.5" /></button>
                        </td>
                      </tr>
                    );
                })}
                </tbody>
              </table>
              <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Displaying {brandCampaigns.length} campaigns</span>
                <div className="flex gap-1">
                  <button className="h-6 px-2.5 bg-white border border-slate-200 rounded-md text-[8px] font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-50 shadow-sm transition-all disabled:opacity-50" disabled>PREV</button>
                  <button className="h-6 px-2.5 bg-white border border-slate-200 rounded-md text-[8px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 shadow-sm transition-all">NEXT</button>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-3 space-y-4">
            {/* --- SENTIMENT AI --- */}
            <Card className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white space-y-4 relative overflow-hidden group shadow-lg">
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="h-8 w-8 bg-amber-600 rounded-lg flex items-center justify-center text-white shadow-lg border border-amber-500 group-hover:scale-105 transition-transform">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-amber-300 leading-none">Intelligence AI</span>
                    <p className="text-[11px] font-bold uppercase tracking-tight">Market Sentiment</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm group-hover:bg-white/10 transition-colors">
                    <p className="text-[8px] font-bold text-amber-400 uppercase tracking-widest mb-1 leading-none">Motivation Index</p>
                    <p className="text-[10px] text-slate-300 font-bold uppercase leading-relaxed tracking-tight">
                      "Sentiment 92% positive. High focus on 'Eco-materials'. Over-funding probability: 84%."
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-[7px] text-slate-500 font-bold uppercase mb-0.5 tracking-widest">Viral Score</p>
                      <span className="text-[11px] font-bold text-amber-400 tabular-nums tracking-tighter">4.2x Index</span>
                    </div>
                    <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-[7px] text-slate-500 font-bold uppercase mb-0.5 tracking-widest">Retention</p>
                      <span className="text-[11px] font-bold text-blue-400 uppercase tracking-tighter">High Tier</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full h-8 bg-white text-slate-900 text-[9px] font-bold uppercase rounded-lg mt-4 hover:bg-amber-50 hover:text-amber-600 transition-all shadow-xl tracking-widest">
                  Boost Marketing
                </Button>
              </div>
              <Sparkles className="absolute -right-6 -top-4 h-24 w-24 text-amber-600 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700" />
            </Card>

            {/* --- PRODUCTION READINESS --- */}
            <Card className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 space-y-4 hover:border-indigo-100 transition-all group">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2.5 px-1">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-700 flex items-center gap-2">
                  <Package className="h-3.5 w-3.5 text-blue-600" /> Manufacturing Hub
                </h3>
                <Badge variant="outline" className="bg-slate-50 text-slate-400 border-slate-100 text-[7px] font-bold px-1.5 h-3.5 rounded shadow-sm tracking-widest uppercase">Active</Badge>
              </div>

              <div className="space-y-3.5">
                {[
                  { component: 'Main Fabric', status: 'Sourced', prog: 100 },
                  { component: 'Trim & Zippers', status: 'Pending', prog: 45 },
                  { component: 'Eco-Packaging', status: 'Research', prog: 20 },
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5 group/item">
                    <div className="flex justify-between items-center px-0.5">
                      <span className="text-[9px] font-bold text-slate-900 uppercase tracking-tight group-hover/item:text-indigo-600 transition-colors leading-none">{item.component}</span>
                      <span className="text-[7px] font-bold uppercase text-slate-400 tracking-widest">{item.status}</span>
                    </div>
                    <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden shadow-inner border border-slate-50">
                      <div className={cn("h-full transition-all duration-1000", item.prog === 100 ? 'bg-emerald-500' : 'bg-indigo-500')} style={{ width: `${item.prog}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full h-8 border border-slate-200 text-slate-400 text-[9px] font-bold uppercase rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm flex items-center justify-center gap-1.5 tracking-widest">
                Supply Chain <ChevronRight className="h-3 w-3" />
              </Button>
            </Card>
          </div>
        </div>
      </div>

      </TabsContent>

        <TabsContent value="promo" className="mt-4">
          {tab === 'promo' && <PromotionsContent />}
        </TabsContent>
        <TabsContent value="trends" className="mt-4">
          {tab === 'trends' && <TrendSentimentContent />}
        </TabsContent>
        <TabsContent value="timeline" className="mt-4">
          {tab === 'timeline' && <HeritageTimelineContent />}
        </TabsContent>
        <TabsContent value="style-me" className="mt-4">
          {tab === 'style-me' && <StyleMeContent />}
        </TabsContent>
        <TabsContent value="local-ads" className="mt-4">
          {tab === 'local-ads' && <LocalInventoryAdsContent />}
        </TabsContent>
      </Tabs>

      <RelatedModulesBlock links={getMarketingLinks()} className="mt-6" />
    </div>
  )
}

