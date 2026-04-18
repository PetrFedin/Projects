'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Activity,
  Globe,
  MessageSquare,
  Search,
  Filter,
  Star,
  ShieldCheck,
  Target,
  MoreVertical,
  ChevronRight,
  Database,
  PieChart,
  Calendar,
  LineChart,
  Smartphone,
  Cloud,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useUIState } from '@/providers/ui-state';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function PartnerAnalyticsCRM() {
  const { retailerProfiles, b2bConnections } = useB2BState();
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'network' | 'sales' | 'integrations'>('network');

  const displayPartners = useMemo(() => {
    return b2bConnections.map((conn) => {
      const profile = retailerProfiles[conn.retailerId];
      // Enrich with mock analytics data
      return {
        id: conn.retailerId,
        name: profile?.name || 'Unknown Retailer',
        score: profile?.tier === 'VIP' ? 98 : profile?.tier === 'Gold' ? 92 : 85,
        engagement: conn.status === 'active' ? 'High' : 'Pending',
        inquiries: Math.floor(Math.random() * 50),
        conversion: '18%',
        growth: '+12%',
        risk: 'Low',
        pos: '1C / Bitrix24',
      };
    });
  }, [b2bConnections, retailerProfiles]);

  const renderSalesIntelligence = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <LineChart className="text-accent-primary h-5 w-5" />
            <h4 className="text-text-primary text-[10px] font-black uppercase">
              Platform Sell-Through
            </h4>
          </div>
          <div className="space-y-1">
            <p className="text-text-primary text-base font-black">68.2%</p>
            <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
              Average across 14 partners
            </p>
          </div>
          <div className="flex h-12 items-end gap-1">
            {[40, 60, 45, 90, 65, 80, 70].map((h, i) => (
              <div
                key={i}
                className="bg-accent-primary/15 flex-1 rounded-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </Card>

        <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-emerald-500" />
            <h4 className="text-text-primary text-[10px] font-black uppercase">
              POS Data Connectivity
            </h4>
          </div>
          <div className="space-y-1">
            <p className="text-text-primary text-base font-black">12/14</p>
            <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
              Partners with Live POS Sync
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="border-none bg-emerald-50 text-[8px] font-black text-emerald-600">
              ACTIVE SYNC
            </Badge>
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          </div>
        </Card>

        <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <PieChart className="h-5 w-5 text-amber-500" />
            <h4 className="text-text-primary text-[10px] font-black uppercase">Inventory Health</h4>
          </div>
          <div className="space-y-1">
            <p className="text-text-primary text-base font-black">Optimal</p>
            <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
              Weeks of Cover: 6.2
            </p>
          </div>
          <div className="bg-bg-surface2 h-1.5 w-full overflow-hidden rounded-full">
            <div className="h-full w-[62%] bg-amber-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="space-y-6 rounded-xl border-none bg-white p-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-base font-black uppercase tracking-tight">
                Live POS Ingestion Feed
              </h4>
              <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                Real-time sales from connected partner stores
              </p>
            </div>
            <Activity className="h-6 w-6 animate-pulse text-emerald-500" />
          </div>
          <div className="space-y-4">
            {[
              {
                store: 'Premium Store Moscow',
                item: 'Graphene Parka',
                price: '85,000 ₽',
                time: 'Just now',
              },
              {
                store: 'Milan Concept Store',
                item: 'Thermal Shell',
                price: '42,000 ₽',
                time: '2 min ago',
              },
              {
                store: 'Urban Elite Dubai',
                item: 'Neural Knit',
                price: '28,000 ₽',
                time: '5 min ago',
              },
            ].map((sale, i) => (
              <div
                key={i}
                className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-2xl border p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="text-accent-primary flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[10px] font-black uppercase shadow-sm">
                    {sale.store.substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-text-primary text-[10px] font-black uppercase">
                      {sale.item}
                    </p>
                    <p className="text-text-muted text-[8px] font-bold uppercase">{sale.store}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-text-primary text-[10px] font-black">{sale.price}</p>
                  <p className="text-[8px] font-bold uppercase text-emerald-500">{sale.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 rounded-xl border-none bg-white p-3 shadow-xl">
          <div className="space-y-1">
            <h4 className="text-base font-black uppercase tracking-tight">Market Benchmarking</h4>
            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
              Your brand vs. category average performance
            </p>
          </div>
          <div className="space-y-6">
            {[
              { label: 'Sell-Through Rate', your: 68, avg: 52 },
              { label: 'Avg. Transaction Value', your: 85, avg: 64 },
              { label: 'Return Rate', your: 12, avg: 18 },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-[9px] font-black uppercase">
                  <span className="text-text-muted">{stat.label}</span>
                  <span className="text-text-primary">Your Brand: {stat.your}%</span>
                </div>
                <div className="bg-bg-surface2 relative h-2 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-accent-primary absolute inset-y-0 left-0 rounded-full"
                    style={{ width: `${stat.your}%` }}
                  />
                  <div
                    className="border-text-primary absolute inset-y-0 left-0 border-r-2 border-dashed"
                    style={{ width: `${stat.avg}%` }}
                  />
                </div>
                <div className="text-text-muted flex justify-between text-[7px] font-black uppercase">
                  <span>0%</span>
                  <span>Market Avg: {stat.avg}%</span>
                  <span>100%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="bg-text-primary relative overflow-hidden rounded-xl border-none p-3 text-white shadow-2xl">
        <div className="absolute right-0 top-0 p-3 opacity-10">
          <Globe className="h-32 w-32" />
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-3">
          <div className="space-y-6">
            <div className="space-y-2">
              <Badge className="bg-accent-primary border-none px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
                AI Market Pulse
              </Badge>
              <h4 className="text-base font-black uppercase leading-none tracking-tight">
                Demand Forecasting
              </h4>
            </div>
            <p className="text-text-muted text-sm font-medium leading-relaxed">
              Our neural network predicts a **24% surge** in technical outerwear demand for the
              Moscow region over the next 14 days based on weather patterns and social sentiment.
            </p>
            <div className="flex gap-3">
              <Button className="text-text-primary h-12 rounded-2xl bg-white px-8 text-[10px] font-black uppercase tracking-widest shadow-xl">
                Adjust Replenishment
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-white/20 px-8 text-[10px] font-black uppercase tracking-widest text-white"
              >
                View Detailed Map
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40">
                Predictive Revenue
              </p>
              <p className="text-sm font-black">18.4M ₽</p>
              <p className="text-[8px] font-bold uppercase text-emerald-400">+14% vs LY</p>
            </div>
            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40">
                Avg. Unit Price
              </p>
              <p className="text-sm font-black">12.5K ₽</p>
              <p className="text-accent-primary text-[8px] font-bold uppercase">Optimized</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="bg-bg-surface2 min-h-screen space-y-4 p-4 text-left">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-text-primary flex h-8 w-8 items-center justify-center rounded-xl">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
              className="border-border-default text-text-primary text-[9px] font-black uppercase tracking-widest"
            >
              CRM_INTELLIGENCE_v4.0
            </Badge>
          </div>
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
            Partner Insights
            <br />& CRM Analytics
          </h2>
          <p className="text-text-muted max-w-md text-xs font-medium">
            Deep-dive into partner performance, engagement scores, and conversion intelligence.
            Predict demand and manage relationship risks in real-time.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="border-border-default mr-4 flex items-center gap-1.5 rounded-2xl border bg-white p-1 shadow-sm">
            {[
              { id: 'network', label: 'Network', icon: Globe },
              { id: 'sales', label: 'Intelligence', icon: Zap },
              { id: 'integrations', label: 'POS Sync', icon: Database },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all',
                  activeTab === t.id
                    ? 'bg-text-primary text-white shadow-xl'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            className="border-border-default h-10 gap-2 rounded-2xl bg-white px-6 text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowDownRight className="h-4 w-4" /> Export BI Data
          </Button>
        </div>
      </div>

      {activeTab === 'sales' ? (
        renderSalesIntelligence()
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {[
              { label: 'Network Health', val: '94%', trend: '+2.4%', color: 'indigo' },
              { label: 'Avg. Engagement', val: '8.2/10', trend: '+0.5', color: 'emerald' },
              { label: 'Inquiry Velocity', val: '14/day', trend: '+18%', color: 'amber' },
              { label: 'Churn Risk', val: 'Low', trend: '-5%', color: 'blue' },
            ].map((s, i) => (
              <Card key={i} className="rounded-xl border-none bg-white p-4 shadow-md shadow-xl">
                <p className="text-text-muted mb-1 text-[9px] font-black uppercase tracking-widest">
                  {s.label}
                </p>
                <div className="flex items-end justify-between">
                  <h3 className="text-text-primary text-sm font-black">{s.val}</h3>
                  <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                    {s.trend}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            {/* Partner Table */}
            <div className="lg:col-span-8">
              <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl shadow-md">
                <div className="border-border-subtle flex items-center justify-between border-b p-4">
                  <h3 className="text-base font-black uppercase tracking-tight">
                    Partner Performance node
                  </h3>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="text-text-muted absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
                      <Input
                        placeholder="Filter partners..."
                        className="border-border-subtle bg-bg-surface2 h-10 w-48 rounded-xl pl-9 text-[10px]"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-border-subtle h-10 w-10 rounded-xl"
                    >
                      <Filter className="text-text-muted h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-bg-surface2/80">
                        <th className="text-text-muted px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest">
                          Partner
                        </th>
                        <th className="text-text-muted px-8 py-4 text-center text-[9px] font-black uppercase tracking-widest">
                          Score
                        </th>
                        <th className="text-text-muted px-8 py-4 text-center text-[9px] font-black uppercase tracking-widest">
                          Integration
                        </th>
                        <th className="text-text-muted px-8 py-4 text-center text-[9px] font-black uppercase tracking-widest">
                          Inquiries
                        </th>
                        <th className="text-text-muted px-8 py-4 text-center text-[9px] font-black uppercase tracking-widest">
                          Conversion
                        </th>
                        <th className="text-text-muted px-8 py-4 text-right text-[9px] font-black uppercase tracking-widest">
                          Growth
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayPartners.map((p) => (
                        <tr
                          key={p.id}
                          onClick={() => setSelectedPartner(p)}
                          className={cn(
                            'hover:bg-bg-surface2 group cursor-pointer transition-colors',
                            selectedPartner?.id === p.id && 'bg-bg-surface2'
                          )}
                        >
                          <td className="border-border-subtle border-b px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="bg-bg-surface2 h-10 w-10 overflow-hidden rounded-xl">
                                <img src={`https://i.pravatar.cc/100?u=${p.id}`} />
                              </div>
                              <div className="space-y-0.5">
                                <p className="text-text-primary text-sm font-black uppercase">
                                  {p.name}
                                </p>
                                <p className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
                                  {p.engagement} Engagement
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="border-border-subtle border-b px-8 py-6 text-center">
                            <Badge
                              className={cn(
                                'rounded-lg border-none px-2 text-[10px] font-black',
                                p.score > 90
                                  ? 'bg-emerald-100 text-emerald-600'
                                  : 'bg-accent-primary/15 text-accent-primary'
                              )}
                            >
                              {p.score}
                            </Badge>
                          </td>
                          <td className="border-border-subtle border-b px-8 py-6 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-text-primary text-[9px] font-black uppercase">
                                {p.pos}
                              </span>
                              <Badge
                                variant="outline"
                                className="border-emerald-100 px-1 py-0 text-[7px] text-emerald-600"
                              >
                                LIVE SYNC
                              </Badge>
                            </div>
                          </td>
                          <td className="border-border-subtle text-text-secondary border-b px-8 py-6 text-center text-xs font-black">
                            {p.inquiries}
                          </td>
                          <td className="border-border-subtle text-text-secondary border-b px-8 py-6 text-center text-xs font-black">
                            {p.conversion}
                          </td>
                          <td className="border-border-subtle border-b px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-1 text-xs font-black text-emerald-600">
                              <ArrowUpRight className="h-3 w-3" />
                              {p.growth}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* 360 View Sidebar */}
            <div className="lg:col-span-4">
              <AnimatePresence mode="wait">
                {selectedPartner ? (
                  <motion.div
                    key={selectedPartner.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <Card className="bg-text-primary relative space-y-4 overflow-hidden rounded-xl border-none p-3 text-white shadow-2xl shadow-md">
                      <div className="absolute right-0 top-0 p-4 opacity-5">
                        <Activity className="h-32 w-32" />
                      </div>
                      <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10 p-1">
                            <img
                              src={`https://i.pravatar.cc/100?u=${selectedPartner.id}`}
                              className="h-full w-full rounded-2xl object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-sm font-black uppercase tracking-tight">
                              {selectedPartner.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <span className="text-[8px] font-black uppercase tracking-widest text-white/40">
                                Verified Partner node
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="mb-1 text-[8px] font-black uppercase tracking-widest text-white/40">
                              Account Risk
                            </p>
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4 text-emerald-400" />
                              <span className="text-sm font-black">{selectedPartner.risk}</span>
                            </div>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="mb-1 text-[8px] font-black uppercase tracking-widest text-white/40">
                              Lifetime Value
                            </p>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="text-accent-primary h-4 w-4" />
                              <span className="text-sm font-black">12.4M ₽</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">
                              POS Integration
                            </h4>
                            <Database className="text-accent-primary h-3.5 w-3.5" />
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-black uppercase">{selectedPartner.pos}</p>
                            <div className="flex items-center justify-between text-[8px] font-bold uppercase text-white/40">
                              <span>Last Sync: 14m ago</span>
                              <span className="text-emerald-400">Stable</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">
                            Inquiry Analysis
                          </h4>
                          <div className="space-y-3">
                            {[
                              { label: 'Pricing Queries', pct: 65 },
                              { label: 'Logistics Requests', pct: 25 },
                              { label: 'Media Assets', pct: 10 },
                            ].map((item, i) => (
                              <div key={i} className="space-y-1.5">
                                <div className="flex justify-between text-[9px] font-bold uppercase">
                                  <span>{item.label}</span>
                                  <span>{item.pct}%</span>
                                </div>
                                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.pct}%` }}
                                    className="h-full bg-white"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button className="text-text-primary h-10 w-full gap-2 rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest shadow-2xl">
                          View Full Partner Dossier <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="border-border-default flex h-full flex-col items-center justify-center space-y-6 rounded-xl border border-dashed bg-white p-20 text-center">
                    <div className="bg-bg-surface2 flex h-20 w-20 items-center justify-center rounded-full">
                      <Target className="text-text-muted h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-text-muted text-base font-black uppercase tracking-tight">
                        Partner 360 node
                      </h3>
                      <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                        Select a partner to view deep analytics and interaction history
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
