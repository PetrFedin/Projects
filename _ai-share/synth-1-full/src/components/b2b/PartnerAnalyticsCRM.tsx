'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  Cloud
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
    return b2bConnections.map(conn => {
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
        pos: '1C / Bitrix24'
      };
    });
  }, [b2bConnections, retailerProfiles]);

  const renderSalesIntelligence = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-none shadow-xl bg-white p-4 space-y-6 rounded-xl">
          <div className="flex items-center gap-3">
            <LineChart className="h-5 w-5 text-indigo-600" />
            <h4 className="text-[10px] font-black uppercase text-slate-900">Platform Sell-Through</h4>
          </div>
          <div className="space-y-1">
            <p className="text-base font-black text-slate-900">68.2%</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Average across 14 partners</p>
          </div>
          <div className="flex items-end gap-1 h-12">
            {[40, 60, 45, 90, 65, 80, 70].map((h, i) => (
              <div key={i} className="flex-1 bg-indigo-100 rounded-sm" style={{ height: `${h}%` }} />
            ))}
          </div>
        </Card>

        <Card className="border-none shadow-xl bg-white p-4 space-y-6 rounded-xl">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-emerald-500" />
            <h4 className="text-[10px] font-black uppercase text-slate-900">POS Data Connectivity</h4>
          </div>
          <div className="space-y-1">
            <p className="text-base font-black text-slate-900">12/14</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Partners with Live POS Sync</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black">ACTIVE SYNC</Badge>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </Card>

                  <Card className="border-none shadow-xl bg-white p-4 space-y-6 rounded-xl">
                    <div className="flex items-center gap-3">
                      <PieChart className="h-5 w-5 text-amber-500" />
                      <h4 className="text-[10px] font-black uppercase text-slate-900">Inventory Health</h4>
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-black text-slate-900">Optimal</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Weeks of Cover: 6.2</p>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-[62%]" />
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className="border-none shadow-xl bg-white p-3 rounded-xl space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-base font-black uppercase tracking-tight">Live POS Ingestion Feed</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time sales from connected partner stores</p>
                      </div>
                      <Activity className="h-6 w-6 text-emerald-500 animate-pulse" />
                    </div>
                    <div className="space-y-4">
                      {[
                        { store: 'Premium Store Moscow', item: 'Graphene Parka', price: '85,000 ₽', time: 'Just now' },
                        { store: 'Milan Concept Store', item: 'Thermal Shell', price: '42,000 ₽', time: '2 min ago' },
                        { store: 'Urban Elite Dubai', item: 'Neural Knit', price: '28,000 ₽', time: '5 min ago' }
                      ].map((sale, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm font-black text-[10px] uppercase">
                              {sale.store.substring(0, 2)}
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase text-slate-900">{sale.item}</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase">{sale.store}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-black text-slate-900">{sale.price}</p>
                            <p className="text-[8px] font-bold text-emerald-500 uppercase">{sale.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="border-none shadow-xl bg-white p-3 rounded-xl space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-base font-black uppercase tracking-tight">Market Benchmarking</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your brand vs. category average performance</p>
                    </div>
                    <div className="space-y-6">
                      {[
                        { label: 'Sell-Through Rate', your: 68, avg: 52 },
                        { label: 'Avg. Transaction Value', your: 85, avg: 64 },
                        { label: 'Return Rate', your: 12, avg: 18 }
                      ].map((stat, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between items-center text-[9px] font-black uppercase">
                            <span className="text-slate-400">{stat.label}</span>
                            <span className="text-slate-900">Your Brand: {stat.your}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative">
                            <div className="absolute inset-y-0 left-0 bg-indigo-500 rounded-full" style={{ width: `${stat.your}%` }} />
                            <div className="absolute inset-y-0 left-0 border-r-2 border-slate-900 border-dashed" style={{ width: `${stat.avg}%` }} />
                          </div>
                          <div className="flex justify-between text-[7px] font-black uppercase text-slate-300">
                             <span>0%</span>
                             <span>Market Avg: {stat.avg}%</span>
                             <span>100%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <Card className="border-none shadow-2xl bg-slate-900 text-white p-3 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Globe className="h-32 w-32" />
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-3">
          <div className="space-y-6">
            <div className="space-y-2">
              <Badge className="bg-indigo-600 text-white border-none text-[8px] font-black px-2 py-0.5 uppercase tracking-widest">AI Market Pulse</Badge>
              <h4 className="text-base font-black uppercase tracking-tight leading-none">Demand Forecasting</h4>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Our neural network predicts a **24% surge** in technical outerwear demand for the Moscow region over the next 14 days based on weather patterns and social sentiment.
            </p>
            <div className="flex gap-3">
              <Button className="bg-white text-slate-900 rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl">Adjust Replenishment</Button>
              <Button variant="outline" className="border-white/20 text-white rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-widest">View Detailed Map</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Predictive Revenue</p>
              <p className="text-sm font-black">18.4M ₽</p>
              <p className="text-[8px] font-bold text-emerald-400 uppercase">+14% vs LY</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Avg. Unit Price</p>
              <p className="text-sm font-black">12.5K ₽</p>
              <p className="text-[8px] font-bold text-indigo-400 uppercase">Optimized</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-slate-200 text-slate-900 uppercase font-black tracking-widest text-[9px]">
              CRM_INTELLIGENCE_v4.0
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Partner Insights<br/>& CRM Analytics
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md">
            Deep-dive into partner performance, engagement scores, and conversion intelligence. Predict demand and manage relationship risks in real-time.
          </p>
        </div>

        <div className="flex gap-3">
           <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-sm mr-4">
              {[
                { id: 'network', label: 'Network', icon: Globe },
                { id: 'sales', label: 'Intelligence', icon: Zap },
                { id: 'integrations', label: 'POS Sync', icon: Database }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === t.id ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <t.icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              ))}
           </div>
           <Button variant="outline" className="h-10 rounded-2xl border-slate-200 px-6 font-black uppercase text-[10px] tracking-widest gap-2 bg-white">
              <ArrowDownRight className="h-4 w-4" /> Export BI Data
           </Button>
        </div>
      </div>

      {activeTab === 'sales' ? renderSalesIntelligence() : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
             {[
               { label: 'Network Health', val: '94%', trend: '+2.4%', color: 'indigo' },
               { label: 'Avg. Engagement', val: '8.2/10', trend: '+0.5', color: 'emerald' },
               { label: 'Inquiry Velocity', val: '14/day', trend: '+18%', color: 'amber' },
               { label: 'Churn Risk', val: 'Low', trend: '-5%', color: 'blue' }
             ].map((s, i) => (
               <Card key={i} className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-white p-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
                  <div className="flex items-end justify-between">
                     <h3 className="text-sm font-black text-slate-900">{s.val}</h3>
                     <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">{s.trend}</span>
                  </div>
               </Card>
             ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Partner Table */}
            <div className="lg:col-span-8">
               <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white overflow-hidden">
                  <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                     <h3 className="text-base font-black uppercase tracking-tight">Partner Performance node</h3>
                     <div className="flex gap-2">
                        <div className="relative">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                           <Input placeholder="Filter partners..." className="pl-9 h-10 w-48 rounded-xl border-slate-100 bg-slate-50 text-[10px]" />
                        </div>
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-100"><Filter className="h-4 w-4 text-slate-400" /></Button>
                     </div>
                  </div>
                  <div className="overflow-x-auto">
                     <table className="w-full border-collapse">
                        <thead>
                           <tr className="bg-slate-50/50">
                              <th className="px-8 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Partner</th>
                              <th className="px-8 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Score</th>
                              <th className="px-8 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Integration</th>
                              <th className="px-8 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Inquiries</th>
                              <th className="px-8 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Conversion</th>
                              <th className="px-8 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Growth</th>
                           </tr>
                        </thead>
                        <tbody>
                           {displayPartners.map((p) => (
                             <tr 
                               key={p.id} 
                               onClick={() => setSelectedPartner(p)}
                               className={cn(
                                 "group hover:bg-slate-50 transition-colors cursor-pointer",
                                 selectedPartner?.id === p.id && "bg-slate-50"
                               )}
                             >
                                <td className="px-8 py-6 border-b border-slate-50">
                                   <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-xl bg-slate-100 overflow-hidden">
                                         <img src={`https://i.pravatar.cc/100?u=${p.id}`} />
                                      </div>
                                      <div className="space-y-0.5">
                                         <p className="text-sm font-black text-slate-900 uppercase">{p.name}</p>
                                         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{p.engagement} Engagement</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-6 border-b border-slate-50 text-center">
                                   <Badge className={cn(
                                     "text-[10px] font-black rounded-lg border-none px-2",
                                     p.score > 90 ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"
                                   )}>{p.score}</Badge>
                                </td>
                                <td className="px-8 py-6 border-b border-slate-50 text-center">
                                   <div className="flex flex-col items-center gap-1">
                                      <span className="text-[9px] font-black text-slate-900 uppercase">{p.pos}</span>
                                      <Badge variant="outline" className="text-[7px] border-emerald-100 text-emerald-600 px-1 py-0">LIVE SYNC</Badge>
                                   </div>
                                </td>
                                <td className="px-8 py-6 border-b border-slate-50 text-center text-xs font-black text-slate-600">{p.inquiries}</td>
                                <td className="px-8 py-6 border-b border-slate-50 text-center text-xs font-black text-slate-600">{p.conversion}</td>
                                <td className="px-8 py-6 border-b border-slate-50 text-right">
                                   <div className="flex items-center justify-end gap-1 text-emerald-600 font-black text-xs">
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
                      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-slate-900 text-white p-3 space-y-4 overflow-hidden relative">
                         <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Activity className="h-32 w-32" />
                         </div>
                         <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-3">
                               <div className="h-12 w-12 rounded-3xl bg-white/10 flex items-center justify-center p-1">
                                  <img src={`https://i.pravatar.cc/100?u=${selectedPartner.id}`} className="w-full h-full object-cover rounded-2xl" />
                               </div>
                               <div className="space-y-1">
                                  <h3 className="text-sm font-black uppercase tracking-tight">{selectedPartner.name}</h3>
                                  <div className="flex items-center gap-2">
                                     <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                     <span className="text-[8px] font-black uppercase text-white/40 tracking-widest">Verified Partner node</span>
                                  </div>
                               </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                               <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                  <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Account Risk</p>
                                  <div className="flex items-center gap-2">
                                     <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                     <span className="text-sm font-black">{selectedPartner.risk}</span>
                                  </div>
                               </div>
                               <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                  <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Lifetime Value</p>
                                  <div className="flex items-center gap-2">
                                     <TrendingUp className="h-4 w-4 text-indigo-400" />
                                     <span className="text-sm font-black">12.4M ₽</span>
                                  </div>
                               </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                               <div className="flex items-center justify-between">
                                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">POS Integration</h4>
                                  <Database className="h-3.5 w-3.5 text-indigo-400" />
                               </div>
                               <div className="space-y-2">
                                  <p className="text-xs font-black uppercase">{selectedPartner.pos}</p>
                                  <div className="flex items-center justify-between text-[8px] font-bold text-white/40 uppercase">
                                     <span>Last Sync: 14m ago</span>
                                     <span className="text-emerald-400">Stable</span>
                                  </div>
                               </div>
                            </div>

                            <div className="space-y-4">
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40">Inquiry Analysis</h4>
                               <div className="space-y-3">
                                  {[
                                    { label: 'Pricing Queries', pct: 65 },
                                    { label: 'Logistics Requests', pct: 25 },
                                    { label: 'Media Assets', pct: 10 }
                                  ].map((item, i) => (
                                    <div key={i} className="space-y-1.5">
                                       <div className="flex justify-between text-[9px] font-bold uppercase">
                                          <span>{item.label}</span>
                                          <span>{item.pct}%</span>
                                       </div>
                                       <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
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

                            <Button className="w-full h-10 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-2xl">
                               View Full Partner Dossier <ChevronRight className="h-4 w-4" />
                            </Button>
                         </div>
                      </Card>
                   </motion.div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center p-20 space-y-6 bg-white rounded-xl border border-dashed border-slate-200">
                      <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                         <Target className="h-10 w-10 text-slate-200" />
                      </div>
                      <div className="space-y-2">
                         <h3 className="text-base font-black uppercase tracking-tight text-slate-400">Partner 360 node</h3>
                         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Select a partner to view deep analytics and interaction history</p>
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
