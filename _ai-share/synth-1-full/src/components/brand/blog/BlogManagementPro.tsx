"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTablePro } from "@/components/data/DataTable/DataTablePro";
import type { DataTableColumn } from "@/components/data/DataTable/types";
import { fmtNumber, fmtMoney } from "@/lib/format";
import { 
  FileText, ImageIcon, TrendingUp, MoreHorizontal, Edit, Trash2, Eye, Sparkles, X, Check, 
  BarChart3, Download, Users as UsersIcon, MousePointerClick, Share2, Clock, 
  ChevronRight, Target, Send, ShieldCheck, Zap, Calendar as CalendarIcon, 
  LayoutGrid, Maximize2, Bot, TrendingDown, Mic, CalendarCheck, PlusCircle, Filter, 
  Search, ArrowUpRight, CircleDollarSign, Plus, UserPlus, Headphones, Globe, Sun, Moon, Cloud, Sunset
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import NextImage from "next/image";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ReferenceDot
} from "recharts";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

// --- TYPES ---

type ContentType = 'news' | 'lookbook' | 'collection' | 'event' | 'blog' | 'press' | 'ugc';
type ContentStatus = 'Draft' | 'Review' | 'Approved' | 'Ready' | 'Published';

interface PostRow {
  id: string;
  title: string;
  type: ContentType;
  status: ContentStatus;
  views: number;
  engagement: string;
  conversion: string;
  date: string;
  author: string;
  image?: string;
  socialSync?: boolean;
}

interface BuyerProfile {
  id: string;
  name: string;
  company: string;
  avatar: string;
  lastActive: string;
  ltv: string;
  probability: string;
}

interface BrandPackage {
  name: string;
  color: string;
  text: string;
  photoLimit: number | string;
  docLimit: number | string;
  postsPerMonth: number | string;
  features: Record<string, boolean>;
}

// --- MOCK DATA ---

const MOCK_BUYERS: BuyerProfile[] = [
  { id: '1', name: 'Светлана Иванова', company: 'ЦУМ', avatar: 'https://i.pravatar.cc/150?u=1', lastActive: '2 мин. назад', ltv: '4.2M ₽', probability: '85%' },
  { id: '2', name: 'Марк Уолберг', company: 'Selfridges', avatar: 'https://i.pravatar.cc/150?u=2', lastActive: '1 час назад', ltv: '12.8M ₽', probability: '92%' },
  { id: '3', name: 'Елена Кузнецова', company: 'KM20', avatar: 'https://i.pravatar.cc/150?u=3', lastActive: '3 часа назад', ltv: '2.1M ₽', probability: '64%' },
];

const BRAND_PACKETS: Record<string, BrandPackage> = {
  BASIC: { name: 'BASIC', color: 'bg-slate-100', text: 'text-slate-600', photoLimit: 10, docLimit: 5, postsPerMonth: 4, features: { creativeLab: false, smartCalendar: false, roiForecast: false, contentCoPilot: false, heatmap: false } },
  PRO: { name: 'PRO', color: 'bg-blue-100', text: 'text-blue-600', photoLimit: 50, docLimit: 20, postsPerMonth: 12, features: { creativeLab: false, smartCalendar: false, roiForecast: true, contentCoPilot: false, heatmap: false } },
  ELITE: { name: 'ELITE', color: 'bg-indigo-100', text: 'text-indigo-600', photoLimit: 200, docLimit: 100, postsPerMonth: 30, features: { creativeLab: true, smartCalendar: true, roiForecast: true, contentCoPilot: true, heatmap: true } },
  ENTERPRISE: { name: 'ENTERPRISE', color: 'bg-slate-900', text: 'text-white', photoLimit: 'Unlimited', docLimit: 'Unlimited', postsPerMonth: 'Unlimited', features: { creativeLab: true, smartCalendar: true, roiForecast: true, contentCoPilot: true, heatmap: true } },
};

const generateChartData = (period: string) => {
  const points = period === 'week' ? 7 : 30;
  return Array.from({ length: points }, (_, i) => ({
    name: i.toString(),
    views: Math.floor(Math.random() * 5000) + 1000,
    posts: Math.random() > 0.8 ? 1 : 0
  }));
};

export default function BlogManagementPro() {
  const [currentPackage, setCurrentPackage] = useState<BrandPackage>(BRAND_PACKETS.ELITE);
  const [isCreativeLabOpen, setIsCreativeLabOpen] = useState(false);
  const [isSmartCalendarOpen, setIsSmartCalendarOpen] = useState(false);
  const [isInfluencerMatchOpen, setIsInfluencerMatchOpen] = useState(false);
  const [isPollsActive, setIsPollsActive] = useState(false);
  const [isSocialSyncActive, setIsSocialSyncActive] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatBuyer, setActiveChatBuyer] = useState<BuyerProfile | null>(null);
  const [isCoPilotOpen, setIsCoPilotOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const chartData = useMemo(() => generateChartData(timeRange), [timeRange]);

  const posts: PostRow[] = [
    { id: '1', title: 'Новая коллекция SS26', type: 'lookbook', status: 'Published', views: 12400, engagement: '4.8%', conversion: '2.1%', date: '2024-01-05', author: 'Александр В.', socialSync: true },
    { id: '2', title: 'Открытие флагмана в Милане', type: 'event', status: 'Approved', views: 8500, engagement: '12.4%', conversion: '0.8%', date: '2024-01-08', author: 'Елена М.' },
    { id: '3', title: 'Технологии графена в одежде', type: 'blog', status: 'Review', views: 3200, engagement: '6.2%', conversion: '1.5%', date: '2024-01-10', author: 'Иван П.' },
  ];

  const columns: DataTableColumn<PostRow>[] = [
    {
      id: 'title', 
      header: 'Заголовок', 
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.image && <div className="h-10 w-10 rounded bg-slate-100 overflow-hidden relative"><NextImage src={row.original.image} alt="" fill className="object-cover" /></div>}
          <div>
            <p className="font-bold text-sm">{row.original.title}</p>
            <div className="flex items-center gap-2">
              <Badge className="text-[9px] uppercase font-black tracking-widest bg-slate-100 text-slate-500 border-none">{row.original.type}</Badge>
              {row.original.socialSync && <Badge className="bg-blue-50 text-blue-600 border-none px-1"><Share2 className="h-2.5 w-2.5" /></Badge>}
            </div>
          </div>
        </div>
      )
    },
    { id: 'status', header: 'Статус', cell: ({ row }) => <Badge className={cn("text-[9px] font-black uppercase tracking-widest", row.original.status === 'Published' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600')}>{row.original.status}</Badge> },
    { id: 'views', header: 'Просмотры', cell: ({ row }) => <span className="font-black tabular-nums">{fmtNumber(row.original.views)}</span> },
    { id: 'engagement', header: 'Вовлеченность', cell: ({ row }) => <span className="font-black text-blue-600">{row.original.engagement}</span> },
    { id: 'conversion', header: 'Конверсия', cell: ({ row }) => <span className="font-black text-emerald-600">{row.original.conversion}</span> },
    { 
      id: 'actions', 
      header: '', 
      cell: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setIsAnalyticsOpen(true)} className="h-8 w-8 p-0"><BarChart3 className="h-4 w-4" /></Button>
          <Button variant="ghost" className="h-8 w-8 p-0"><Edit className="h-4 w-4" /></Button>
          <Button variant="ghost" className="h-8 w-8 p-0 text-rose-500"><Trash2 className="h-4 w-4" /></Button>
        </div>
      )
    }
  ];

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl pb-24 animate-in fade-in duration-700">
      {/* --- TOP STRATEGIC BAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <Link href="/brand" className="hover:text-indigo-600 transition-colors">Organization</Link>
            <ChevronRight className="h-2 w-2" />
            <span className="text-slate-300">Content Studio</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold font-headline tracking-tighter uppercase text-slate-900 leading-none">Media Hub 2.0</h1>
            <Badge variant="outline" className={cn("text-[7px] font-bold px-1.5 h-4 gap-1 tracking-widest shadow-sm transition-all", currentPackage.color, currentPackage.text)}>
               {currentPackage.name}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <div className="flex bg-white border border-slate-200 p-0.5 rounded-lg shadow-sm">
              {Object.keys(BRAND_PACKETS).map(name => (
                <button 
                  key={name} 
                  onClick={() => setCurrentPackage(BRAND_PACKETS[name])}
                  className={cn("px-2.5 h-6 rounded-md text-[9px] font-bold transition-all uppercase", currentPackage.name === name ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:bg-slate-50")}
                >
                  {name}
                </button>
              ))}
            </div>
            <Button variant="ghost" className="h-7 px-3 bg-white text-slate-600 rounded-lg font-bold uppercase text-[9px] tracking-widest shadow-sm border border-slate-200 transition-all hover:text-indigo-600">
              <PlusCircle className="mr-1.5 h-3 w-3" /> New Post
            </Button>
            <Button onClick={() => setIsCoPilotOpen(true)} className="h-7 px-4 rounded-lg bg-slate-900 text-white text-[9px] font-bold uppercase gap-1.5 hover:bg-indigo-600 transition-all shadow-lg border border-slate-900 tracking-widest">
              <Bot className="h-3.5 w-3.5 text-indigo-400" /> Co-Pilot
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* --- ANALYTICAL GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "CONTENT VIEWS", val: "142.5K", sub: "+12.4%", trend: "up", icon: Eye, bg: 'bg-indigo-50/50' },
            { label: "AVG ENGAGEMENT", val: "8.2%", sub: "High", trend: "up", icon: MousePointerClick, bg: 'bg-blue-50/50' },
            { label: "B2B CONVERSION", val: "2.4%", sub: "42 Leads", trend: "up", icon: Target, bg: 'bg-emerald-50/50' },
            { label: "ESTIMATED ROI", val: "12.4M ₽", sub: "Forecast", trend: "up", icon: TrendingUp, bg: 'bg-amber-50/50' },
          ].map((m, i) => (
            <Card key={i} className="border border-slate-100 shadow-sm bg-white p-3.5 group hover:border-indigo-100 transition-all rounded-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none">{m.label}</span>
                <div className={cn("p-1.5 rounded-lg shadow-inner border border-slate-200/50", m.bg)}>
                  <m.icon className={cn("h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors")} />
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
          <div className="xl:col-span-9 space-y-4">
            {/* --- TOOLBAR --- */}
            <div className="bg-slate-100 p-1 flex items-center justify-between rounded-xl border border-slate-200 shadow-inner">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <div className="flex bg-white border border-slate-200 p-1 rounded-lg shadow-sm shrink-0">
                  <button className="h-6.5 px-3 bg-slate-900 text-white text-[9px] font-bold uppercase rounded-md shadow-sm transition-all">Table</button>
                  <button className="h-6.5 px-3 text-slate-400 text-[9px] font-bold uppercase hover:bg-slate-50 rounded-md transition-all">Planner</button>
                </div>
                <div className="h-4 w-[1px] bg-slate-200 mx-0.5 shrink-0" />
                <Button 
                  onClick={() => setIsCreativeLabOpen(true)} 
                  disabled={!currentPackage.features.creativeLab}
                  variant="outline"
                  className="h-6.5 px-2.5 bg-white border border-slate-200 text-slate-900 text-[9px] font-bold uppercase rounded-md gap-1.5 hover:bg-slate-50 disabled:opacity-50 shrink-0 shadow-sm"
                >
                  <Sparkles className="h-3 w-3 text-indigo-500" /> Lab
                </Button>
                <Button 
                  onClick={() => setIsSmartCalendarOpen(true)}
                  disabled={!currentPackage.features.smartCalendar}
                  variant="outline"
                  className="h-6.5 px-2.5 bg-white border border-slate-200 text-slate-900 text-[9px] font-bold uppercase rounded-md gap-1.5 hover:bg-slate-50 disabled:opacity-50 shrink-0 shadow-sm"
                >
                  <CalendarCheck className="h-3 w-3 text-amber-500" /> Planner
                </Button>
                <div className="h-4 w-[1px] bg-slate-200 mx-0.5 shrink-0" />
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => setIsPollsActive(!isPollsActive)} className={cn("h-6.5 px-2.5 border rounded-md text-[9px] font-bold uppercase transition-all shadow-sm", isPollsActive ? "bg-indigo-600 border-indigo-600 text-white shadow-md" : "bg-white border-slate-200 text-slate-400 hover:text-slate-600")}>Polls</button>
                  <button onClick={() => setIsSocialSyncActive(!isSocialSyncActive)} className={cn("h-6.5 px-2.5 border rounded-md text-[9px] font-bold uppercase transition-all shadow-sm", isSocialSyncActive ? "bg-rose-600 border-rose-600 text-white shadow-md" : "bg-white border-slate-200 text-slate-400 hover:text-slate-600")}>Sync</button>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-1 shrink-0">
                <div className="relative group">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <Input placeholder="Search Asset..." className="h-6.5 pl-7 w-24 md:w-32 bg-white border-slate-200 rounded-md text-[9px] font-bold uppercase tracking-tight shadow-sm focus:ring-1 focus:ring-indigo-500" />
                </div>
                <Button variant="ghost" size="icon" className="h-6.5 w-6.5 bg-white border border-slate-200 rounded-md shadow-sm hover:bg-slate-50 transition-all">
                  <Filter className="h-3 w-3 text-slate-400" />
                </Button>
              </div>
            </div>

            {/* --- CONTENT TABLE --- */}
            <div className="border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm hover:border-indigo-100/50 transition-all">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-9 w-[40%]">Content Asset</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-9">Status</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-9 text-right">Views</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-9 text-right">Eng.</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-9 text-right">Conv.</th>
                    <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-9 w-24"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50/50 transition-all group h-12">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 relative border border-slate-200 group-hover:scale-110 transition-transform shadow-sm">
                            {post.image ? <NextImage src={post.image} alt="" fill className="object-cover" /> : <div className="h-full w-full flex items-center justify-center text-slate-300"><ImageIcon className="h-3.5 w-3.5" /></div>}
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-none">{post.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 opacity-60 leading-none">{post.type}</span>
                              {post.socialSync && <Share2 className="h-2.5 w-2.5 text-blue-500 animate-pulse" />}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant="outline" className={cn("text-[7px] font-bold px-1.5 h-3.5 rounded shadow-sm uppercase tracking-widest border transition-all", post.status === 'Published' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100')}>
                          {post.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <span className="text-[11px] font-bold tabular-nums text-slate-900 tracking-tighter">{fmtNumber(post.views)}</span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <span className="text-[11px] font-bold tabular-nums text-indigo-600 tracking-tighter">{post.engagement}</span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <span className="text-[11px] font-bold tabular-nums text-emerald-600 tracking-tighter">{post.conversion}</span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="h-6 w-6 flex items-center justify-center hover:bg-slate-900 rounded-md text-slate-400 hover:text-white transition-all"><BarChart3 className="h-3 w-3" /></button>
                          <button className="h-6 w-6 flex items-center justify-center hover:bg-slate-900 rounded-md text-slate-400 hover:text-white transition-all"><Edit className="h-3 w-3" /></button>
                          <button className="h-6 w-6 flex items-center justify-center hover:bg-slate-900 rounded-md text-rose-500 hover:text-white transition-all"><Trash2 className="h-3 w-3" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-60">Displaying {posts.length} of 128 assets</span>
                <div className="flex gap-1">
                  <button className="h-6 px-2.5 bg-white border border-slate-200 rounded-md text-[8px] font-bold uppercase tracking-widest text-slate-400 hover:bg-slate-50 shadow-sm transition-all disabled:opacity-50" disabled>PREV</button>
                  <button className="h-6 px-2.5 bg-white border border-slate-200 rounded-md text-[8px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 shadow-sm transition-all">NEXT</button>
                </div>
              </div>
            </div>

            {currentPackage.features.roiForecast && (
              <Card className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white relative overflow-hidden group shadow-lg">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 italic text-indigo-300">
                        <TrendingUp className="h-4 w-4" /> ROI Forecast Matrix
                      </h3>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] opacity-60">Predictive Analytics v2.0</p>
                    </div>
                    <Badge className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-[8px] font-bold uppercase px-2 h-5 tracking-widest shadow-lg">AI ENGINE ACTIVE</Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Expected Orders</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold tabular-nums tracking-tighter">420</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">units</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400 text-[9px] font-bold uppercase tracking-widest bg-emerald-400/10 w-fit px-1.5 h-4 rounded">
                        <ArrowUpRight className="h-2.5 w-2.5" /> +15% Trend
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Predicted GMV</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold tabular-nums tracking-tighter">8.2M</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">₽</span>
                      </div>
                      <p className="text-[8px] text-slate-500 font-bold uppercase italic tracking-widest opacity-60">Confidence Score: 94.2%</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm space-y-4 shadow-inner group-hover:bg-white/10 transition-colors">
                      <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest leading-none">Simulation Mode</p>
                      <p className="text-[10px] text-slate-300 font-bold uppercase tracking-tight leading-relaxed italic opacity-80">Add 3 Shoppable Hotspots?</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest opacity-60">
                          <span>Revenue Boost</span>
                          <span className="text-emerald-400">+1.4M ₽</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden shadow-inner border border-white/5">
                          <div className="h-full bg-indigo-500 transition-all duration-1000 shadow-[0_0_8px_rgba(79,70,229,0.4)]" style={{ width: '65%' }} />
                        </div>
                      </div>
                      <Button className="w-full h-7 bg-white text-slate-900 text-[8px] font-bold uppercase rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-xl tracking-widest">Apply Strategy</Button>
                    </div>
                  </div>
                </div>
                <CircleDollarSign className="absolute -right-8 -bottom-8 h-48 w-48 text-indigo-600 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700" />
              </Card>
            )}
          </div>

          <div className="xl:col-span-3 space-y-4">
            {/* --- AI SIDEBAR --- */}
            <Card className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white space-y-4 relative overflow-hidden group shadow-lg">
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg border border-indigo-500 group-hover:scale-105 transition-transform">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300 leading-none">Intelligence AI</span>
                    <p className="text-[11px] font-bold uppercase tracking-tight">Strategic Insight</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] text-slate-300 font-bold uppercase leading-relaxed tracking-tight italic opacity-80">
                    "High affinity detected from UAE retailers. Recommend: Launch 'Graphene' lookbook within 48h for +14% LTV impact."
                  </p>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm group-hover:bg-white/10 transition-colors">
                    <p className="text-[8px] font-bold text-indigo-300 uppercase tracking-widest mb-1.5 leading-none">Velocity Metric</p>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 bg-emerald-500/20 rounded flex items-center justify-center text-emerald-400 border border-emerald-500/30"><TrendingUp className="h-3 w-3" /></div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">LTV GROWTH +14.2%</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full h-8 bg-white text-slate-900 text-[9px] font-bold uppercase rounded-lg mt-4 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-xl tracking-widest">
                  Generate Strategy
                </Button>
              </div>
              <Sparkles className="absolute -right-6 -top-4 h-24 w-24 text-indigo-600 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all duration-700" />
            </Card>

            {/* --- CRM SIDEBAR --- */}
            <Card className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 space-y-4 hover:border-indigo-100 transition-all group">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2.5 px-1">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-700 flex items-center gap-2">
                  <UsersIcon className="h-3.5 w-3.5 text-blue-600" /> Buyer Interest
                </h3>
                <Badge variant="outline" className="bg-slate-50 text-slate-400 border-slate-100 text-[7px] font-bold px-1.5 h-3.5 rounded shadow-sm tracking-widest uppercase">LIVE</Badge>
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl shadow-inner transition-all group-hover:bg-emerald-50/80">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-emerald-700">Real-time Lead</span>
                </div>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tight italic leading-relaxed">
                  "Buyer from <span className="text-slate-900">TSUM</span> just booked 20 units of Graphite-01."
                </p>
              </div>

              <div className="space-y-2.5">
                {MOCK_BUYERS.map((buyer) => (
                  <div key={buyer.id} className="flex items-center justify-between p-2 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all group/item">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 bg-slate-100 rounded-lg overflow-hidden relative border border-slate-200 shadow-sm shrink-0 group-hover/item:scale-110 transition-transform">
                        <NextImage src={buyer.avatar} alt="" fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-tight leading-none mb-1 group-hover/item:text-indigo-600 transition-colors truncate">{buyer.name}</p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest truncate">{buyer.company}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-bold tabular-nums text-slate-900 tracking-tighter leading-none mb-1">{buyer.ltv}</p>
                      <span className="text-[7px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-1 rounded">{buyer.probability}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full h-8 border border-slate-200 text-slate-400 text-[9px] font-bold uppercase rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm flex items-center justify-center gap-1.5 tracking-widest">
                Full Network <ChevronRight className="h-3 w-3" />
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* --- INFLUENCER ECHO DIALOG --- */}
      <Dialog open={isInfluencerMatchOpen} onOpenChange={setIsInfluencerMatchOpen}>
        <DialogContent className="max-w-5xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden bg-white">
          <VisuallyHidden>
            <DialogTitle>Influencer Echo</DialogTitle>
          </VisuallyHidden>
          <div className="p-4 space-y-10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-base font-black uppercase italic tracking-tighter flex items-center gap-3">
                  <UserPlus className="h-8 w-8 text-blue-600" /> Influencer Echo
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI-Powered Ambassador Matching & Outreach</p>
              </div>
              <Badge className="bg-blue-50 text-blue-600 border-none text-[9px] font-black uppercase tracking-widest px-3 py-1 italic">Matching based on post content</Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Top AI Matches</p>
                <div className="space-y-4">
                  {[
                    { name: 'Xenia Tech', fans: '420K', match: '98%', bio: 'Futuristic fashion & urban techwear.' },
                    { name: 'Cyber Alex', fans: '1.2M', match: '94%', bio: 'Digital assets & tech-chic enthusiast.' },
                    { name: 'Mila Graphene', fans: '85K', match: '89%', bio: 'Sustainable innovation in modern fabrics.' },
                  ].map(inf => (
                    <div key={inf.name} className="p-4 bg-slate-50 rounded-[32px] border-2 border-transparent hover:bg-white hover:border-blue-100 hover:shadow-xl transition-all group flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-base font-black text-slate-200">{inf.name[0]}</div>
                        <div>
                          <p className="text-sm font-black uppercase text-slate-900 group-hover:text-blue-600 transition-colors">{inf.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">{inf.fans} Followers • {inf.bio}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-blue-600">{inf.match}</p>
                        <p className="text-[8px] font-black uppercase text-slate-400">Match</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-900 rounded-[40px] p-4 space-y-4 text-white relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                  <h3 className="text-base font-black uppercase tracking-widest flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-blue-400" /> AI Outreach Draft
                  </h3>
                  <div className="p-4 bg-white/5 rounded-3xl border border-white/10 text-sm font-medium leading-relaxed italic text-slate-300">
                    "Hi { '{name}' }! We saw your passion for techwear and think our new SS26 Graphene collection matches your aesthetic perfectly. Would you like to be the first to review our 'Graphite-01' parka?"
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="ghost" className="h-12 border-white/10 text-white font-black uppercase text-[9px] tracking-widest hover:bg-white/5 rounded-xl">Edit Draft</Button>
                    <Button className="h-12 bg-blue-600 text-white font-black uppercase text-[9px] tracking-widest rounded-xl hover:scale-105 transition-all border-none">Send Offer</Button>
                  </div>
                </div>
                <Bot className="absolute -right-8 -bottom-8 h-48 w-48 text-white opacity-[0.02] group-hover:scale-110 transition-transform duration-1000" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- BUYER CHAT DIALOG --- */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-4xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden bg-white">
          <VisuallyHidden>
            <DialogTitle>Чат с байером: {activeChatBuyer?.name}</DialogTitle>
          </VisuallyHidden>
          <div className="flex h-[70vh]">
            <div className="w-80 bg-slate-50 border-r border-slate-100 p-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl overflow-hidden relative shadow-lg">
                    <NextImage src={activeChatBuyer?.avatar || 'https://i.pravatar.cc/150'} alt="" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-slate-900">{activeChatBuyer?.name || 'Buyer'}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{activeChatBuyer?.company || 'Organization'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Account Insight</p>
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[9px] font-black text-slate-400 uppercase">LTV</span>
                      <span className="text-[10px] font-black text-slate-900">{activeChatBuyer?.ltv}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[9px] font-black text-slate-400 uppercase">Probability</span>
                      <span className="text-[10px] font-black text-emerald-600">{activeChatBuyer?.probability}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="ghost" className="w-full h-12 border-2 border-slate-200 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white transition-all">View B2B Profile</Button>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex-1 p-3 flex flex-col justify-end space-y-6">
                <div className="flex flex-col items-start gap-2 max-w-[80%]">
                  <div className="p-3 bg-slate-50 rounded-[24px] rounded-tl-none text-sm font-medium text-slate-900">
                    Здравствуйте! Нас заинтересовала модель из вашего последнего лукбука. Какой MOQ для этой позиции?
                  </div>
                  <span className="text-[9px] font-black text-slate-300 uppercase ml-2">11:42 AM</span>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <span className="text-[9px] font-black uppercase text-blue-600 tracking-widest">AI Draft Suggestion</span>
                  </div>
                  <p className="text-xs font-medium leading-relaxed italic text-slate-600">"Здравствуйте, {activeChatBuyer?.name}! Рады интересу. Для этой модели MOQ — 50 ед., но для {activeChatBuyer?.company} мы можем рассмотреть 30 ед. под заказ."</p>
                  <Button className="h-8 px-4 bg-blue-600 text-white rounded-lg font-black uppercase text-[8px] tracking-widest border-none">Use Draft</Button>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 flex items-center gap-3">
                <Input placeholder="Type a message..." className="h-10 bg-slate-50 border-none rounded-2xl px-6 font-medium" />
                <Button className="h-10 w-10 rounded-2xl bg-slate-900 text-white p-0 flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-none shadow-xl">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- CONTENT CO-PILOT DIALOG --- */}
      <Dialog open={isCoPilotOpen} onOpenChange={setIsCoPilotOpen}>
        <DialogContent className="max-w-2xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden bg-slate-900 text-white">
          <VisuallyHidden>
            <DialogTitle>AI Content Co-Pilot</DialogTitle>
          </VisuallyHidden>
          <div className="p-4 space-y-10 relative">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Bot className="h-8 w-8 text-blue-400" />
                <h2 className="text-base font-black uppercase italic tracking-tighter">AI Content Co-Pilot</h2>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Стратегический центр управления контентом</p>
            </div>

            <div className="space-y-6">
              <div className="relative group">
                <Input placeholder="Например: 'Создай рассылку для байеров из Дубая на основе нового лукбука'..." className="h-20 pl-8 pr-20 bg-white/5 border-white/10 rounded-[28px] text-sm font-medium placeholder:text-slate-600 focus:bg-white/10 focus:ring-[12px] focus:ring-blue-500/5 transition-all text-white border-none" />
                <Button className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-blue-600 text-white rounded-2xl p-0 flex items-center justify-center hover:scale-110 transition-all border-none">
                  <Mic className="h-5 w-5" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { t: 'Optimize SEO Tags', ic: Search },
                  { t: 'Check Plagiarism', ic: ShieldCheck },
                  { t: 'Generate Podcast', ic: Headphones },
                  { t: 'Competitor Search', ic: Globe },
                ].map(cmd => (
                  <button key={cmd.t} className="h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 px-6 hover:bg-white/10 transition-all text-left group">
                    <cmd.ic className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{cmd.t}</span>
                  </button>
                ))}
              </div>
            </div>
            <Sparkles className="absolute -right-10 -top-3 h-48 w-48 text-blue-600 opacity-[0.05]" />
          </div>
        </DialogContent>
      </Dialog>

      {/* --- CREATIVE LAB DIALOG --- */}
      <Dialog open={isCreativeLabOpen} onOpenChange={setIsCreativeLabOpen}>
        <DialogContent className="max-w-5xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden bg-slate-900 text-white">
          <VisuallyHidden>
            <DialogTitle>AI Creative Lab</DialogTitle>
          </VisuallyHidden>
          <div className="flex h-[80vh]">
            <div className="flex-1 p-4 space-y-4 flex flex-col">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-base font-black uppercase italic tracking-tighter flex items-center gap-3">
                    <Sparkles className="h-8 w-8 text-blue-400" /> AI Creative Lab
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Magic Visuals & Product Staging</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600 text-white border-none text-[9px] font-black uppercase tracking-widest px-3 py-1">Advanced Mode</Badge>
                </div>
              </div>

              <div className="flex-1 bg-white/5 rounded-[40px] border border-white/10 relative group overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/bg/1200/800')] opacity-40 grayscale group-hover:scale-105 transition-transform [transition-duration:2000ms]" />
                <div className="relative z-10 text-center space-y-6 max-w-md">
                  <div className="h-24 w-24 bg-white rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                    <ImageIcon className="h-10 w-10 text-slate-900" />
                  </div>
                  <p className="text-sm font-medium leading-relaxed">Загрузите фото товара, и ИИ автоматически изменит фон под стиль вашей новой коллекции.</p>
                  <Button className="h-12 px-8 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest border-none shadow-xl">Select Product Photo</Button>
                </div>
              </div>
            </div>

            <div className="w-80 bg-black/40 border-l border-white/10 p-4 space-y-10">
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Scene Presets</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Cyberpunk', 'Minimalist', 'Lush Nature', 'Old Paris', 'Studio', 'Desert'].map(p => (
                    <button key={p} className="h-20 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-black uppercase flex items-end p-3 hover:bg-white/10 hover:border-blue-500/50 transition-all text-left">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Lighting & mood</p>
                <div className="flex gap-2">
                  {[Sun, Moon, Cloud, Sunset].map((Icon, i) => (
                    <button key={i} className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                      <Icon className="h-4 w-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
              <Button className="w-full h-10 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-50 transition-all border-none">Generate Visuals</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- SMART CALENDAR DIALOG --- */}
      <Dialog open={isSmartCalendarOpen} onOpenChange={setIsSmartCalendarOpen}>
        <DialogContent className="max-w-5xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden bg-white">
          <VisuallyHidden>
            <DialogTitle>Fashion Smart Calendar</DialogTitle>
          </VisuallyHidden>
          <div className="p-4 space-y-10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-base font-black uppercase italic tracking-tighter flex items-center gap-3">
                  <CalendarCheck className="h-8 w-8 text-amber-500" /> Fashion Smart Calendar
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Heat-Days & Global Event Sync</p>
              </div>
              <Button className="h-11 px-6 bg-amber-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest border-none gap-2 shadow-xl shadow-amber-200">
                <Zap className="h-4 w-4" /> Fill My Month (AI Auto-Plan)
              </Button>
            </div>

            <div className="grid md:grid-cols-4 gap-3">
              <div className="md:col-span-3 h-[600px] bg-slate-50 rounded-[40px] border border-slate-100 p-4 relative overflow-hidden">
                <div className="grid grid-cols-7 gap-3 h-full opacity-40">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 relative overflow-hidden">
                      <span className="text-[9px] font-black text-slate-300">{(i % 31) + 1}</span>
                      {Math.random() > 0.8 && <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500/20" />}
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 max-w-sm">
                    <p className="text-sm font-black uppercase italic tracking-widest text-slate-900">Interative Planner Loading...</p>
                    <p className="text-xs text-slate-400 font-medium">Синхронизация с Paris Fashion Week (Mar 3-11) и прогнозом активности байеров.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-3xl space-y-4">
                  <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest">AI Heat-Day Alert</p>
                  <p className="text-sm font-bold text-slate-900">14 Марта - Пик конверсии</p>
                  <p className="text-xs text-slate-500 leading-relaxed">Прогноз роста интереса к категории "Трикотаж" на 24% выше нормы.</p>
                  <Button className="w-full h-9 bg-amber-500 text-white rounded-lg font-black uppercase text-[9px] tracking-widest border-none">Schedule Post</Button>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Upcoming Global Events</p>
                  {[
                    { e: 'Paris Fashion Week', d: 'Mar 3 - 11' },
                    { e: 'Milan Fashion Week', d: 'Feb 24 - Mar 2' },
                    { e: 'Dubai Expo Trade', d: 'Apr 15' },
                  ].map(ev => (
                    <div key={ev.e} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all cursor-default">
                      <p className="text-xs font-black uppercase text-slate-900">{ev.e}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{ev.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- FLOATING CO-PILOT --- */}
      {currentPackage.features.contentCoPilot && (
        <button onClick={() => setIsCoPilotOpen(true)} className="fixed bottom-10 right-10 h-20 w-20 rounded-full bg-slate-900 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all group flex items-center justify-center border-none">
          <Bot className="h-8 w-8 text-blue-400 group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-2 -right-2 h-6 w-6 bg-blue-600 rounded-full border-4 border-slate-50 animate-pulse" />
        </button>
      )}

    </div>
  );
}

