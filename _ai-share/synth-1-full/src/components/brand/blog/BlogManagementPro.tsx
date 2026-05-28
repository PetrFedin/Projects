'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataTablePro } from '@/components/data/DataTable/DataTablePro';
import type { DataTableColumn } from '@/components/data/DataTable/types';
import { fmtNumber, fmtMoney } from '@/lib/format';
import {
  FileText,
  ImageIcon,
  TrendingUp,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Sparkles,
  X,
  Check,
  BarChart3,
  Download,
  Users as UsersIcon,
  MousePointerClick,
  Share2,
  Clock,
  ChevronRight,
  Target,
  Send,
  ShieldCheck,
  Zap,
  Calendar as CalendarIcon,
  LayoutGrid,
  Maximize2,
  Bot,
  TrendingDown,
  Mic,
  CalendarCheck,
  PlusCircle,
  Filter,
  Search,
  ArrowUpRight,
  CircleDollarSign,
  Plus,
  UserPlus,
  Headphones,
  Globe,
  Sun,
  Moon,
  Cloud,
  Sunset,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import NextImage from 'next/image';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

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
  {
    id: '1',
    name: 'Светлана Иванова',
    company: 'ЦУМ',
    avatar: 'https://i.pravatar.cc/150?u=1',
    lastActive: '2 мин. назад',
    ltv: '4.2M ₽',
    probability: '85%',
  },
  {
    id: '2',
    name: 'Марк Уолберг',
    company: 'Selfridges',
    avatar: 'https://i.pravatar.cc/150?u=2',
    lastActive: '1 час назад',
    ltv: '12.8M ₽',
    probability: '92%',
  },
  {
    id: '3',
    name: 'Елена Кузнецова',
    company: 'KM20',
    avatar: 'https://i.pravatar.cc/150?u=3',
    lastActive: '3 часа назад',
    ltv: '2.1M ₽',
    probability: '64%',
  },
];

const BRAND_PACKETS: Record<string, BrandPackage> = {
  BASIC: {
    name: 'BASIC',
    color: 'bg-bg-surface2',
    text: 'text-text-secondary',
    photoLimit: 10,
    docLimit: 5,
    postsPerMonth: 4,
    features: {
      creativeLab: false,
      smartCalendar: false,
      roiForecast: false,
      contentCoPilot: false,
      heatmap: false,
    },
  },
  PRO: {
    name: 'PRO',
    color: 'bg-blue-100',
    text: 'text-blue-600',
    photoLimit: 50,
    docLimit: 20,
    postsPerMonth: 12,
    features: {
      creativeLab: false,
      smartCalendar: false,
      roiForecast: true,
      contentCoPilot: false,
      heatmap: false,
    },
  },
  ELITE: {
    name: 'ELITE',
    color: 'bg-accent-primary/15',
    text: 'text-accent-primary',
    photoLimit: 200,
    docLimit: 100,
    postsPerMonth: 30,
    features: {
      creativeLab: true,
      smartCalendar: true,
      roiForecast: true,
      contentCoPilot: true,
      heatmap: true,
    },
  },
  ENTERPRISE: {
    name: 'ENTERPRISE',
    color: 'bg-text-primary',
    text: 'text-white',
    photoLimit: 'Unlimited',
    docLimit: 'Unlimited',
    postsPerMonth: 'Unlimited',
    features: {
      creativeLab: true,
      smartCalendar: true,
      roiForecast: true,
      contentCoPilot: true,
      heatmap: true,
    },
  },
};

const generateChartData = (period: string) => {
  const points = period === 'week' ? 7 : 30;
  return Array.from({ length: points }, (_, i) => ({
    name: i.toString(),
    views: Math.floor(Math.random() * 5000) + 1000,
    posts: Math.random() > 0.8 ? 1 : 0,
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
    {
      id: '1',
      title: 'Новая коллекция SS26',
      type: 'lookbook',
      status: 'Published',
      views: 12400,
      engagement: '4.8%',
      conversion: '2.1%',
      date: '2024-01-05',
      author: 'Александр В.',
      socialSync: true,
    },
    {
      id: '2',
      title: 'Открытие флагмана в Милане',
      type: 'event',
      status: 'Approved',
      views: 8500,
      engagement: '12.4%',
      conversion: '0.8%',
      date: '2024-01-08',
      author: 'Елена М.',
    },
    {
      id: '3',
      title: 'Технологии графена в одежде',
      type: 'blog',
      status: 'Review',
      views: 3200,
      engagement: '6.2%',
      conversion: '1.5%',
      date: '2024-01-10',
      author: 'Иван П.',
    },
  ];

  const columns: DataTableColumn<PostRow>[] = [
    {
      id: 'title',
      header: 'Заголовок',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.image && (
            <div className="bg-bg-surface2 relative h-10 w-10 overflow-hidden rounded">
              <NextImage src={row.original.image} alt="" fill className="object-cover" />
            </div>
          )}
          <div>
            <p className="text-sm font-bold">{row.original.title}</p>
            <div className="flex items-center gap-2">
              <Badge className="bg-bg-surface2 text-text-secondary border-none text-[9px] font-black uppercase tracking-widest">
                {row.original.type}
              </Badge>
              {row.original.socialSync && (
                <Badge className="border-none bg-blue-50 px-1 text-blue-600">
                  <Share2 className="h-2.5 w-2.5" />
                </Badge>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Статус',
      cell: ({ row }) => (
        <Badge
          className={cn(
            'text-[9px] font-black uppercase tracking-widest',
            row.original.status === 'Published'
              ? 'bg-emerald-100 text-emerald-600'
              : 'bg-amber-100 text-amber-600'
          )}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'views',
      header: 'Просмотры',
      cell: ({ row }) => (
        <span className="font-black tabular-nums">{fmtNumber(row.original.views)}</span>
      ),
    },
    {
      id: 'engagement',
      header: 'Вовлеченность',
      cell: ({ row }) => (
        <span className="font-black text-blue-600">{row.original.engagement}</span>
      ),
    },
    {
      id: 'conversion',
      header: 'Конверсия',
      cell: ({ row }) => (
        <span className="font-black text-emerald-600">{row.original.conversion}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setIsAnalyticsOpen(true)} className="h-8 w-8 p-0">
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="h-8 w-8 p-0 text-rose-500">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (!mounted) return null;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-4 pb-24 duration-700 animate-in fade-in sm:px-6">
      {/* --- TOP STRATEGIC BAR --- */}
      <div className="border-border-subtle flex flex-col items-start justify-between gap-3 border-b pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="text-text-muted flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em]">
            <Link href="/brand" className="hover:text-accent-primary transition-colors">
              Organization
            </Link>
            <ChevronRight className="h-2 w-2" />
            <span className="text-text-muted">Content Studio</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-text-primary font-headline text-base font-bold uppercase leading-none tracking-tighter">
              Media Hub 2.0
            </h1>
            <Badge
              variant="outline"
              className={cn(
                'h-4 gap-1 px-1.5 text-[7px] font-bold tracking-widest shadow-sm transition-all',
                currentPackage.color,
                currentPackage.text
              )}
            >
              {currentPackage.name}
            </Badge>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="bg-bg-surface2 border-border-default flex items-center gap-2 rounded-xl border p-1 shadow-inner">
            <div className="border-border-default flex rounded-lg border bg-white p-0.5 shadow-sm">
              {Object.keys(BRAND_PACKETS).map((name) => (
                <button
                  key={name}
                  onClick={() => setCurrentPackage(BRAND_PACKETS[name])}
                  className={cn(
                    'h-6 rounded-md px-2.5 text-[9px] font-bold uppercase transition-all',
                    currentPackage.name === name
                      ? 'bg-text-primary text-white shadow-sm'
                      : 'text-text-muted hover:bg-bg-surface2'
                  )}
                >
                  {name}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              className="text-text-secondary border-border-default hover:text-accent-primary h-7 rounded-lg border bg-white px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
            >
              <PlusCircle className="mr-1.5 h-3 w-3" /> New Post
            </Button>
            <Button
              onClick={() => setIsCoPilotOpen(true)}
              className="bg-text-primary hover:bg-accent-primary border-text-primary h-7 gap-1.5 rounded-lg border px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all"
            >
              <Bot className="text-accent-primary h-3.5 w-3.5" /> Co-Pilot
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* --- ANALYTICAL GRID --- */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: 'CONTENT VIEWS',
              val: '142.5K',
              sub: '+12.4%',
              trend: 'up',
              icon: Eye,
              bg: 'bg-accent-primary/10',
            },
            {
              label: 'AVG ENGAGEMENT',
              val: '8.2%',
              sub: 'High',
              trend: 'up',
              icon: MousePointerClick,
              bg: 'bg-blue-50/50',
            },
            {
              label: 'B2B CONVERSION',
              val: '2.4%',
              sub: '42 Leads',
              trend: 'up',
              icon: Target,
              bg: 'bg-emerald-50/50',
            },
            {
              label: 'ESTIMATED ROI',
              val: '12.4M ₽',
              sub: 'Forecast',
              trend: 'up',
              icon: TrendingUp,
              bg: 'bg-amber-50/50',
            },
          ].map((m, i) => (
            <Card
              key={i}
              className="border-border-subtle hover:border-accent-primary/20 group relative overflow-hidden rounded-xl border bg-white p-3.5 shadow-sm transition-all"
            >
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-text-muted text-[9px] font-bold uppercase leading-none tracking-[0.15em]">
                  {m.label}
                </span>
                <div
                  className={cn(
                    'border-border-default/50 rounded-lg border p-1.5 shadow-inner',
                    m.bg
                  )}
                >
                  <m.icon
                    className={cn(
                      'text-text-muted group-hover:text-accent-primary h-3.5 w-3.5 transition-colors'
                    )}
                  />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-text-primary text-sm font-bold uppercase tabular-nums leading-none tracking-tighter">
                  {m.val}
                </span>
                <span
                  className={cn(
                    'flex h-3.5 items-center rounded px-1 text-[8px] font-bold uppercase tracking-widest',
                    m.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  )}
                >
                  {m.sub}
                </span>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
          <div className="space-y-4 xl:col-span-9">
            {/* --- TOOLBAR --- */}
            <div className="bg-bg-surface2 border-border-default flex items-center justify-between rounded-xl border p-1 shadow-inner">
              <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
                <div className="border-border-default flex shrink-0 rounded-lg border bg-white p-1 shadow-sm">
                  <button className="h-6.5 bg-text-primary rounded-md px-3 text-[9px] font-bold uppercase text-white shadow-sm transition-all">
                    Table
                  </button>
                  <button className="h-6.5 text-text-muted hover:bg-bg-surface2 rounded-md px-3 text-[9px] font-bold uppercase transition-all">
                    Planner
                  </button>
                </div>
                <div className="bg-border-subtle mx-0.5 h-4 w-[1px] shrink-0" />
                <Button
                  onClick={() => setIsCreativeLabOpen(true)}
                  disabled={!currentPackage.features.creativeLab}
                  variant="outline"
                  className="h-6.5 border-border-default text-text-primary hover:bg-bg-surface2 shrink-0 gap-1.5 rounded-md border bg-white px-2.5 text-[9px] font-bold uppercase shadow-sm disabled:opacity-50"
                >
                  <Sparkles className="text-accent-primary h-3 w-3" /> Lab
                </Button>
                <Button
                  onClick={() => setIsSmartCalendarOpen(true)}
                  disabled={!currentPackage.features.smartCalendar}
                  variant="outline"
                  className="h-6.5 border-border-default text-text-primary hover:bg-bg-surface2 shrink-0 gap-1.5 rounded-md border bg-white px-2.5 text-[9px] font-bold uppercase shadow-sm disabled:opacity-50"
                >
                  <CalendarCheck className="h-3 w-3 text-amber-500" /> Planner
                </Button>
                <div className="bg-border-subtle mx-0.5 h-4 w-[1px] shrink-0" />
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => setIsPollsActive(!isPollsActive)}
                    className={cn(
                      'h-6.5 rounded-md border px-2.5 text-[9px] font-bold uppercase shadow-sm transition-all',
                      isPollsActive
                        ? 'bg-accent-primary border-accent-primary text-white shadow-md'
                        : 'border-border-default text-text-muted hover:text-text-secondary bg-white'
                    )}
                  >
                    Polls
                  </button>
                  <button
                    onClick={() => setIsSocialSyncActive(!isSocialSyncActive)}
                    className={cn(
                      'h-6.5 rounded-md border px-2.5 text-[9px] font-bold uppercase shadow-sm transition-all',
                      isSocialSyncActive
                        ? 'border-rose-600 bg-rose-600 text-white shadow-md'
                        : 'border-border-default text-text-muted hover:text-text-secondary bg-white'
                    )}
                  >
                    Sync
                  </button>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 px-1">
                <div className="group relative">
                  <Search className="text-text-muted group-focus-within:text-accent-primary absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 transition-colors" />
                  <Input
                    placeholder="Search Asset..."
                    className="h-6.5 border-border-default focus:ring-accent-primary w-24 rounded-md bg-white pl-7 text-[9px] font-bold uppercase tracking-tight shadow-sm focus:ring-1 md:w-32"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6.5 w-6.5 border-border-default hover:bg-bg-surface2 rounded-md border bg-white shadow-sm transition-all"
                >
                  <Filter className="text-text-muted h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* --- CONTENT TABLE --- */}
            <div className="border-border-subtle hover:border-accent-primary/20 overflow-hidden rounded-xl border bg-white shadow-sm transition-all">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-bg-surface2/80 border-border-subtle border-b">
                    <th className="text-text-muted h-9 w-[40%] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em]">
                      Content Asset
                    </th>
                    <th className="text-text-muted h-9 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em]">
                      Status
                    </th>
                    <th className="text-text-muted h-9 px-4 py-2 text-right text-[9px] font-bold uppercase tracking-[0.2em]">
                      Views
                    </th>
                    <th className="text-text-muted h-9 px-4 py-2 text-right text-[9px] font-bold uppercase tracking-[0.2em]">
                      Eng.
                    </th>
                    <th className="text-text-muted h-9 px-4 py-2 text-right text-[9px] font-bold uppercase tracking-[0.2em]">
                      Conv.
                    </th>
                    <th className="text-text-muted h-9 w-24 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em]"></th>
                  </tr>
                </thead>
                <tbody className="divide-border-subtle divide-y">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-bg-surface2/80 group h-12 transition-all">
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <div className="bg-bg-surface2 border-border-default relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg border shadow-sm transition-transform group-hover:scale-110">
                            {post.image ? (
                              <NextImage src={post.image} alt="" fill className="object-cover" />
                            ) : (
                              <div className="text-text-muted flex h-full w-full items-center justify-center">
                                <ImageIcon className="h-3.5 w-3.5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-text-primary group-hover:text-accent-primary text-[11px] font-bold uppercase leading-none tracking-tight transition-colors">
                              {post.title}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-text-muted text-[8px] font-bold uppercase leading-none tracking-widest opacity-60">
                                {post.type}
                              </span>
                              {post.socialSync && (
                                <Share2 className="h-2.5 w-2.5 animate-pulse text-blue-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            'h-3.5 rounded border px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm transition-all',
                            post.status === 'Published'
                              ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                              : 'border-amber-100 bg-amber-50 text-amber-600'
                          )}
                        >
                          {post.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <span className="text-text-primary text-[11px] font-bold tabular-nums tracking-tighter">
                          {fmtNumber(post.views)}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <span className="text-accent-primary text-[11px] font-bold tabular-nums tracking-tighter">
                          {post.engagement}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <span className="text-[11px] font-bold tabular-nums tracking-tighter text-emerald-600">
                          {post.conversion}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-end gap-1 opacity-0 transition-all group-hover:opacity-100">
                          <button className="hover:bg-text-primary/90 text-text-muted flex h-6 w-6 items-center justify-center rounded-md transition-all hover:text-white">
                            <BarChart3 className="h-3 w-3" />
                          </button>
                          <button className="hover:bg-text-primary/90 text-text-muted flex h-6 w-6 items-center justify-center rounded-md transition-all hover:text-white">
                            <Edit className="h-3 w-3" />
                          </button>
                          <button className="hover:bg-text-primary/90 flex h-6 w-6 items-center justify-center rounded-md text-rose-500 transition-all hover:text-white">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-bg-surface2/80 border-border-subtle flex items-center justify-between border-t px-4 py-2">
                <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest opacity-60">
                  Displaying {posts.length} of 128 assets
                </span>
                <div className="flex gap-1">
                  <button
                    className="border-border-default text-text-muted hover:bg-bg-surface2 h-6 rounded-md border bg-white px-2.5 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all disabled:opacity-50"
                    disabled
                  >
                    PREV
                  </button>
                  <button className="border-border-default text-text-secondary hover:bg-bg-surface2 h-6 rounded-md border bg-white px-2.5 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all">
                    NEXT
                  </button>
                </div>
              </div>
            </div>

            {currentPackage.features.roiForecast && (
              <Card className="bg-text-primary border-text-primary/30 group relative overflow-hidden rounded-xl border p-4 text-white shadow-lg">
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-accent-primary flex items-center gap-2 text-sm font-bold uppercase italic tracking-widest">
                        <TrendingUp className="h-4 w-4" /> ROI Forecast Matrix
                      </h3>
                      <p className="text-text-muted text-[9px] font-bold uppercase tracking-[0.2em] opacity-60">
                        Predictive Analytics v2.0
                      </p>
                    </div>
                    <Badge className="bg-accent-primary/20 text-accent-primary border-accent-primary/30 h-5 border px-2 text-[8px] font-bold uppercase tracking-widest shadow-lg">
                      AI ENGINE ACTIVE
                    </Badge>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="space-y-3">
                      <p className="text-text-secondary text-[9px] font-bold uppercase leading-none tracking-widest">
                        Expected Orders
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold tabular-nums tracking-tighter">
                          420
                        </span>
                        <span className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                          units
                        </span>
                      </div>
                      <div className="flex h-4 w-fit items-center gap-1.5 rounded bg-emerald-400/10 px-1.5 text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                        <ArrowUpRight className="h-2.5 w-2.5" /> +15% Trend
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-text-secondary text-[9px] font-bold uppercase leading-none tracking-widest">
                        Predicted GMV
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-bold tabular-nums tracking-tighter">
                          8.2M
                        </span>
                        <span className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                          ₽
                        </span>
                      </div>
                      <p className="text-text-secondary text-[8px] font-bold uppercase italic tracking-widest opacity-60">
                        Confidence Score: 94.2%
                      </p>
                    </div>
                    <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4 shadow-inner backdrop-blur-sm transition-colors group-hover:bg-white/10">
                      <p className="text-accent-primary text-[9px] font-bold uppercase leading-none tracking-widest">
                        Simulation Mode
                      </p>
                      <p className="text-text-muted text-[10px] font-bold uppercase italic leading-relaxed tracking-tight opacity-80">
                        Add 3 Shoppable Hotspots?
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest opacity-60">
                          <span>Revenue Boost</span>
                          <span className="text-emerald-400">+1.4M ₽</span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full border border-white/5 bg-white/5 shadow-inner">
                          <div
                            className="bg-accent-primary h-full shadow-[0_0_8px_rgba(79,70,229,0.4)] transition-all duration-1000"
                            style={{ width: '65%' }}
                          />
                        </div>
                      </div>
                      <Button className="text-text-primary hover:bg-accent-primary/10 hover:text-accent-primary h-7 w-full rounded-lg bg-white text-[8px] font-bold uppercase tracking-widest shadow-xl transition-all">
                        Apply Strategy
                      </Button>
                    </div>
                  </div>
                </div>
                <CircleDollarSign className="text-accent-primary absolute -bottom-8 -right-8 h-48 w-48 opacity-5 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110" />
              </Card>
            )}
          </div>

          <div className="space-y-4 xl:col-span-3">
            {/* --- AI SIDEBAR --- */}
            <Card className="bg-text-primary border-text-primary/30 group relative space-y-4 overflow-hidden rounded-xl border p-4 text-white shadow-lg">
              <div className="relative z-10">
                <div className="mb-4 flex items-center gap-2.5">
                  <div className="bg-accent-primary border-accent-primary flex h-8 w-8 items-center justify-center rounded-lg border text-white shadow-lg transition-transform group-hover:scale-105">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-accent-primary text-[9px] font-bold uppercase leading-none tracking-[0.2em]">
                      Intelligence AI
                    </span>
                    <p className="text-[11px] font-bold uppercase tracking-tight">
                      Strategic Insight
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-text-muted text-[10px] font-bold uppercase italic leading-relaxed tracking-tight opacity-80">
                    "High affinity detected from UAE retailers. Recommend: Launch 'Graphene'
                    lookbook within 48h for +14% LTV impact."
                  </p>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-colors group-hover:bg-white/10">
                    <p className="text-accent-primary mb-1.5 text-[8px] font-bold uppercase leading-none tracking-widest">
                      Velocity Metric
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded border border-emerald-500/30 bg-emerald-500/20 text-emerald-400">
                        <TrendingUp className="h-3 w-3" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                        LTV GROWTH +14.2%
                      </span>
                    </div>
                  </div>
                </div>

                <Button className="text-text-primary hover:bg-accent-primary/10 hover:text-accent-primary mt-4 h-8 w-full rounded-lg bg-white text-[9px] font-bold uppercase tracking-widest shadow-xl transition-all">
                  Generate Strategy
                </Button>
              </div>
              <Sparkles className="text-accent-primary absolute -right-6 -top-4 h-24 w-24 opacity-10 transition-all duration-700 group-hover:scale-110 group-hover:opacity-20" />
            </Card>

            {/* --- CRM SIDEBAR --- */}
            <Card className="border-border-subtle hover:border-accent-primary/20 group space-y-4 rounded-xl border bg-white p-4 shadow-sm transition-all">
              <div className="border-border-subtle flex items-center justify-between border-b px-1 pb-2.5">
                <h3 className="text-text-primary flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <UsersIcon className="h-3.5 w-3.5 text-blue-600" /> Buyer Interest
                </h3>
                <Badge
                  variant="outline"
                  className="bg-bg-surface2 text-text-muted border-border-subtle h-3.5 rounded px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm"
                >
                  LIVE
                </Badge>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-2.5 shadow-inner transition-all group-hover:bg-emerald-50/80">
                <div className="mb-1 flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-emerald-700">
                    Real-time Lead
                  </span>
                </div>
                <p className="text-text-secondary text-[10px] font-bold uppercase italic leading-relaxed tracking-tight">
                  "Buyer from <span className="text-text-primary">TSUM</span> just booked 20 units
                  of Graphite-01."
                </p>
              </div>

              <div className="space-y-2.5">
                {MOCK_BUYERS.map((buyer) => (
                  <div
                    key={buyer.id}
                    className="hover:border-border-subtle hover:bg-bg-surface2/80 group/item flex items-center justify-between rounded-xl border border-transparent p-2 transition-all"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="bg-bg-surface2 border-border-default relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border shadow-sm transition-transform group-hover/item:scale-110">
                        <NextImage src={buyer.avatar} alt="" fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-text-primary group-hover/item:text-accent-primary mb-1 truncate text-[10px] font-bold uppercase leading-none tracking-tight transition-colors">
                          {buyer.name}
                        </p>
                        <p className="text-text-muted truncate text-[8px] font-bold uppercase tracking-widest">
                          {buyer.company}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-text-primary mb-1 text-[10px] font-bold tabular-nums leading-none tracking-tighter">
                        {buyer.ltv}
                      </p>
                      <span className="rounded bg-emerald-50 px-1 text-[7px] font-bold uppercase tracking-widest text-emerald-600">
                        {buyer.probability}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="border-border-default text-text-muted hover:bg-text-primary/90 hover:border-text-primary flex h-8 w-full items-center justify-center gap-1.5 rounded-lg border text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all hover:text-white"
              >
                Full Network <ChevronRight className="h-3 w-3" />
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* --- INFLUENCER ECHO DIALOG --- */}
      <Dialog open={isInfluencerMatchOpen} onOpenChange={setIsInfluencerMatchOpen}>
        <DialogContent className="max-w-5xl overflow-hidden rounded-[40px] border-none bg-white p-0 shadow-2xl">
          <VisuallyHidden>
            <DialogTitle>Influencer Echo</DialogTitle>
          </VisuallyHidden>
          <div className="space-y-10 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="flex items-center gap-3 text-base font-black uppercase italic tracking-tighter">
                  <UserPlus className="h-8 w-8 text-blue-600" /> Influencer Echo
                </h2>
                <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                  AI-Powered Ambassador Matching & Outreach
                </p>
              </div>
              <Badge className="border-none bg-blue-50 px-3 py-1 text-[9px] font-black uppercase italic tracking-widest text-blue-600">
                Matching based on post content
              </Badge>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-6">
                <p className="text-text-muted px-2 text-[10px] font-black uppercase tracking-widest">
                  Top AI Matches
                </p>
                <div className="space-y-4">
                  {[
                    {
                      name: 'Xenia Tech',
                      fans: '420K',
                      match: '98%',
                      bio: 'Futuristic fashion & urban techwear.',
                    },
                    {
                      name: 'Cyber Alex',
                      fans: '1.2M',
                      match: '94%',
                      bio: 'Digital assets & tech-chic enthusiast.',
                    },
                    {
                      name: 'Mila Graphene',
                      fans: '85K',
                      match: '89%',
                      bio: 'Sustainable innovation in modern fabrics.',
                    },
                  ].map((inf) => (
                    <div
                      key={inf.name}
                      className="bg-bg-surface2 group flex cursor-pointer items-center justify-between rounded-[32px] border-2 border-transparent p-4 transition-all hover:border-blue-100 hover:bg-white hover:shadow-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="border-border-subtle text-text-muted flex h-10 w-10 items-center justify-center rounded-2xl border bg-white text-base font-black">
                          {inf.name[0]}
                        </div>
                        <div>
                          <p className="text-text-primary text-sm font-black uppercase transition-colors group-hover:text-blue-600">
                            {inf.name}
                          </p>
                          <p className="text-text-muted text-[9px] font-bold uppercase">
                            {inf.fans} Followers • {inf.bio}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-blue-600">{inf.match}</p>
                        <p className="text-text-muted text-[8px] font-black uppercase">Match</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-text-primary group relative space-y-4 overflow-hidden rounded-[40px] p-4 text-white">
                <div className="relative z-10 space-y-6">
                  <h3 className="flex items-center gap-3 text-base font-black uppercase tracking-widest">
                    <Sparkles className="h-6 w-6 text-blue-400" /> AI Outreach Draft
                  </h3>
                  <div className="text-text-muted rounded-3xl border border-white/10 bg-white/5 p-4 text-sm font-medium italic leading-relaxed">
                    "Hi {'{name}'}! We saw your passion for techwear and think our new SS26 Graphene
                    collection matches your aesthetic perfectly. Would you like to be the first to
                    review our 'Graphite-01' parka?"
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="ghost"
                      className="h-12 rounded-xl border-white/10 text-[9px] font-black uppercase tracking-widest text-white hover:bg-white/5"
                    >
                      Edit Draft
                    </Button>
                    <Button className="h-12 rounded-xl border-none bg-blue-600 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:scale-105">
                      Send Offer
                    </Button>
                  </div>
                </div>
                <Bot className="absolute -bottom-8 -right-8 h-48 w-48 text-white opacity-[0.02] transition-transform duration-1000 group-hover:scale-110" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- BUYER CHAT DIALOG --- */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-4xl overflow-hidden rounded-[40px] border-none bg-white p-0 shadow-2xl">
          <VisuallyHidden>
            <DialogTitle>Чат с байером: {activeChatBuyer?.name}</DialogTitle>
          </VisuallyHidden>
          <div className="flex h-[70vh]">
            <div className="bg-bg-surface2 border-border-subtle flex w-80 flex-col justify-between border-r p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-2xl shadow-lg">
                    <NextImage
                      src={activeChatBuyer?.avatar || 'https://i.pravatar.cc/150'}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-text-primary text-sm font-black uppercase">
                      {activeChatBuyer?.name || 'Buyer'}
                    </p>
                    <p className="text-text-muted text-[10px] font-bold uppercase">
                      {activeChatBuyer?.company || 'Organization'}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                    Account Insight
                  </p>
                  <div className="border-border-subtle space-y-3 rounded-2xl border bg-white p-4">
                    <div className="flex justify-between">
                      <span className="text-text-muted text-[9px] font-black uppercase">LTV</span>
                      <span className="text-text-primary text-[10px] font-black">
                        {activeChatBuyer?.ltv}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted text-[9px] font-black uppercase">
                        Probability
                      </span>
                      <span className="text-[10px] font-black text-emerald-600">
                        {activeChatBuyer?.probability}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                className="border-border-default h-12 w-full rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white"
              >
                View B2B Profile
              </Button>
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex flex-1 flex-col justify-end space-y-6 p-3">
                <div className="flex max-w-[80%] flex-col items-start gap-2">
                  <div className="bg-bg-surface2 text-text-primary rounded-[24px] rounded-tl-none p-3 text-sm font-medium">
                    Здравствуйте! Нас заинтересовала модель из вашего последнего лукбука. Какой MOQ
                    для этой позиции?
                  </div>
                  <span className="text-text-muted ml-2 text-[9px] font-black uppercase">
                    11:42 AM
                  </span>
                </div>
                <div className="space-y-4 rounded-3xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">
                      AI Draft Suggestion
                    </span>
                  </div>
                  <p className="text-text-secondary text-xs font-medium italic leading-relaxed">
                    "Здравствуйте, {activeChatBuyer?.name}! Рады интересу. Для этой модели MOQ — 50
                    ед., но для {activeChatBuyer?.company} мы можем рассмотреть 30 ед. под заказ."
                  </p>
                  <Button className="h-8 rounded-lg border-none bg-blue-600 px-4 text-[8px] font-black uppercase tracking-widest text-white">
                    Use Draft
                  </Button>
                </div>
              </div>
              <div className="border-border-subtle flex items-center gap-3 border-t p-4">
                <Input
                  placeholder="Type a message..."
                  className="bg-bg-surface2 h-10 rounded-2xl border-none px-6 font-medium"
                />
                <Button className="bg-text-primary flex h-10 w-10 items-center justify-center rounded-2xl border-none p-0 text-white shadow-xl transition-all hover:scale-110 active:scale-95">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- CONTENT CO-PILOT DIALOG --- */}
      <Dialog open={isCoPilotOpen} onOpenChange={setIsCoPilotOpen}>
        <DialogContent className="bg-text-primary max-w-2xl overflow-hidden rounded-[40px] border-none p-0 text-white shadow-2xl">
          <VisuallyHidden>
            <DialogTitle>AI Content Co-Pilot</DialogTitle>
          </VisuallyHidden>
          <div className="relative space-y-10 p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Bot className="h-8 w-8 text-blue-400" />
                <h2 className="text-base font-black uppercase italic tracking-tighter">
                  AI Content Co-Pilot
                </h2>
              </div>
              <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">
                Стратегический центр управления контентом
              </p>
            </div>

            <div className="space-y-6">
              <div className="group relative">
                <Input
                  placeholder="Например: 'Создай рассылку для байеров из Дубая на основе нового лукбука'..."
                  className="placeholder:text-text-secondary h-20 rounded-[28px] border-none border-white/10 bg-white/5 pl-8 pr-20 text-sm font-medium text-white transition-all focus:bg-white/10 focus:ring-[12px] focus:ring-blue-500/5"
                />
                <Button className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border-none bg-blue-600 p-0 text-white transition-all hover:scale-110">
                  <Mic className="h-5 w-5" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { t: 'Optimize SEO Tags', ic: Search },
                  { t: 'Check Plagiarism', ic: ShieldCheck },
                  { t: 'Generate Podcast', ic: Headphones },
                  { t: 'Competitor Search', ic: Globe },
                ].map((cmd) => (
                  <button
                    key={cmd.t}
                    className="group flex h-10 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 text-left transition-all hover:bg-white/10"
                  >
                    <cmd.ic className="h-4 w-4 text-blue-400 transition-transform group-hover:scale-110" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {cmd.t}
                    </span>
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
        <DialogContent className="bg-text-primary max-w-5xl overflow-hidden rounded-[40px] border-none p-0 text-white shadow-2xl">
          <VisuallyHidden>
            <DialogTitle>AI Creative Lab</DialogTitle>
          </VisuallyHidden>
          <div className="flex h-[80vh]">
            <div className="flex flex-1 flex-col space-y-4 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="flex items-center gap-3 text-base font-black uppercase italic tracking-tighter">
                    <Sparkles className="h-8 w-8 text-blue-400" /> AI Creative Lab
                  </h2>
                  <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                    Magic Visuals & Product Staging
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="border-none bg-blue-600 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">
                    Advanced Mode
                  </Badge>
                </div>
              </div>

              <div className="group relative flex flex-1 items-center justify-center overflow-hidden rounded-[40px] border border-white/10 bg-white/5">
                <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/bg/1200/800')] opacity-40 grayscale transition-transform [transition-duration:2000ms] group-hover:scale-105" />
                <div className="relative z-10 max-w-md space-y-6 text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-2xl">
                    <ImageIcon className="text-text-primary h-10 w-10" />
                  </div>
                  <p className="text-sm font-medium leading-relaxed">
                    Загрузите фото товара, и ИИ автоматически изменит фон под стиль вашей новой
                    коллекции.
                  </p>
                  <Button className="h-12 rounded-xl border-none bg-blue-600 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                    Select Product Photo
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-80 space-y-10 border-l border-white/10 bg-black/40 p-4">
              <div className="space-y-6">
                <p className="text-text-secondary text-[10px] font-black uppercase tracking-widest">
                  Scene Presets
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {['Cyberpunk', 'Minimalist', 'Lush Nature', 'Old Paris', 'Studio', 'Desert'].map(
                    (p) => (
                      <button
                        key={p}
                        className="flex h-20 items-end rounded-2xl border border-white/10 bg-white/5 p-3 text-left text-[9px] font-black uppercase transition-all hover:border-blue-500/50 hover:bg-white/10"
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-text-secondary text-[10px] font-black uppercase tracking-widest">
                  Lighting & mood
                </p>
                <div className="flex gap-2">
                  {[Sun, Moon, Cloud, Sunset].map((Icon, i) => (
                    <button
                      key={i}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:bg-white/10"
                    >
                      <Icon className="text-text-muted h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>
              <Button className="text-text-primary h-10 w-full rounded-2xl border-none bg-white text-[10px] font-black uppercase tracking-widest transition-all hover:bg-blue-50">
                Generate Visuals
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- SMART CALENDAR DIALOG --- */}
      <Dialog open={isSmartCalendarOpen} onOpenChange={setIsSmartCalendarOpen}>
        <DialogContent className="max-w-5xl overflow-hidden rounded-[40px] border-none bg-white p-0 shadow-2xl">
          <VisuallyHidden>
            <DialogTitle>Fashion Smart Calendar</DialogTitle>
          </VisuallyHidden>
          <div className="space-y-10 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="flex items-center gap-3 text-base font-black uppercase italic tracking-tighter">
                  <CalendarCheck className="h-8 w-8 text-amber-500" /> Fashion Smart Calendar
                </h2>
                <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                  AI Heat-Days & Global Event Sync
                </p>
              </div>
              <Button className="h-11 gap-2 rounded-xl border-none bg-amber-500 px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-amber-200">
                <Zap className="h-4 w-4" /> Fill My Month (AI Auto-Plan)
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <div className="bg-bg-surface2 border-border-subtle relative h-[600px] overflow-hidden rounded-[40px] border p-4 md:col-span-3">
                <div className="grid h-full grid-cols-7 gap-3 opacity-40">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div
                      key={i}
                      className="border-border-default relative overflow-hidden rounded-2xl border bg-white p-4"
                    >
                      <span className="text-text-muted text-[9px] font-black">{(i % 31) + 1}</span>
                      {Math.random() > 0.8 && (
                        <div className="absolute inset-0 border-2 border-blue-500/20 bg-blue-500/10" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="max-w-sm space-y-4 text-center">
                    <p className="text-text-primary text-sm font-black uppercase italic tracking-widest">
                      Interative Planner Loading...
                    </p>
                    <p className="text-text-muted text-xs font-medium">
                      Синхронизация с Paris Fashion Week (Mar 3-11) и прогнозом активности байеров.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-4 rounded-3xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                    AI Heat-Day Alert
                  </p>
                  <p className="text-text-primary text-sm font-bold">14 Марта - Пик конверсии</p>
                  <p className="text-text-secondary text-xs leading-relaxed">
                    Прогноз роста интереса к категории "Трикотаж" на 24% выше нормы.
                  </p>
                  <Button className="h-9 w-full rounded-lg border-none bg-amber-500 text-[9px] font-black uppercase tracking-widest text-white">
                    Schedule Post
                  </Button>
                </div>
                <div className="space-y-4">
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                    Upcoming Global Events
                  </p>
                  {[
                    { e: 'Paris Fashion Week', d: 'Mar 3 - 11' },
                    { e: 'Milan Fashion Week', d: 'Feb 24 - Mar 2' },
                    { e: 'Dubai Expo Trade', d: 'Apr 15' },
                  ].map((ev) => (
                    <div
                      key={ev.e}
                      className="bg-bg-surface2 border-border-subtle group cursor-default rounded-2xl border p-4 transition-all hover:bg-white hover:shadow-lg"
                    >
                      <p className="text-text-primary text-xs font-black uppercase">{ev.e}</p>
                      <p className="text-text-muted mt-1 text-[9px] font-bold uppercase">{ev.d}</p>
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
        <button
          onClick={() => setIsCoPilotOpen(true)}
          className="bg-text-primary group fixed bottom-10 right-10 flex h-20 w-20 items-center justify-center rounded-full border-none text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
        >
          <Bot className="h-8 w-8 text-blue-400 transition-transform group-hover:rotate-12" />
          <div className="border-border-subtle absolute -right-2 -top-2 h-6 w-6 animate-pulse rounded-full border-4 bg-blue-600" />
        </button>
      )}
    </div>
  );
}
