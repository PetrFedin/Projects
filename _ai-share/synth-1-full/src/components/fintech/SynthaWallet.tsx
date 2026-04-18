'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  History,
  ShieldCheck,
  Zap,
  Lock,
  DollarSign,
  PieChart,
  Settings2,
  Plus,
  ArrowRight,
  RefreshCcw,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Building2,
  Gem,
  TrendingUp,
  Info,
  Briefcase,
  ShoppingCart,
  Store,
  Factory,
  Warehouse,
  User,
  BarChart3,
  Download,
  Search,
  BrainCircuit,
  LayoutGrid,
  ChevronRight,
  MoreHorizontal,
  Bell,
  HelpCircle,
  UserCircle,
  FileText,
  Activity,
  Filter,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIState } from '@/providers/ui-state';
import { useAuth } from '@/providers/auth-provider';
import { ROUTES } from '@/lib/routes';
import { RegistryPageShell } from '@/components/design-system';

/**
 * SynthaWallet - JOOR Strategic Intelligence style.
 * Quiet Luxury, High Density, Data-Driven.
 * Matches B2B Home Page aesthetic.
 */

const ROLE_DATA = {
  brand: {
    title: 'Wholesale Capital',
    entity: 'Syntha Global Brand Entity',
    tier: 'Enterprise',
    cardStatus: 'Active',
    cardStyle: 'bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-black',
    balanceLabel: 'Available Balance',
    escrowLabel: 'Production Escrow',
    creditLabel: 'Strategic Line',
    stats: {
      balance: 12480000,
      escrow: 4500000,
      bonus: 240000,
      credit: 15000000,
      used: 3200000,
      score: 880,
      growth: '+12.4%',
    },
    aiAdvice:
      'Liquidity analysis indicates a surplus of 4.2M ₽ available for raw material hedging. Projected index for Premium Merino Wool is rising by 12.4% in Q3. Recommendation: Deploy capital now to lock in current rates.',
    features: [
      {
        id: 'f-b1',
        name: 'Forward Financing',
        desc: 'Pre-fund production cycles with AI risk assessment',
        icon: Zap,
        status: 'active',
      },
      {
        id: 'f-b2',
        name: 'Royalty Ledger',
        desc: 'Automated distribution to IP holders & designers',
        icon: History,
        status: 'active',
      },
      {
        id: 'f-b3',
        name: 'Duty Reserve',
        desc: 'Automated VAT/Customs provisioning for imports',
        icon: ShieldCheck,
        status: 'setup',
      },
    ],
    transactions: [
      {
        id: 'TX-B001',
        type: 'income',
        category: 'Retail',
        title: 'TSUM Moscow Jan Sales Payout',
        amount: 4200000,
        date: '2026-02-04',
        status: 'completed',
      },
      {
        id: 'TX-B002',
        type: 'expense',
        category: 'Factory',
        title: 'Winter Capsule Production Payment',
        amount: 1850000,
        date: '2026-02-02',
        status: 'completed',
      },
      {
        id: 'TX-B003',
        type: 'escrow',
        category: 'Materials',
        title: 'Italian Silk Batch #4 Hold',
        amount: 950000,
        date: '2026-02-01',
        status: 'locked',
      },
    ],
  },
  shop: {
    title: 'Retail Liquidity',
    entity: 'Retail Operations Hub',
    tier: 'Business Pro',
    cardStatus: 'Active',
    cardStyle: 'bg-gradient-to-br from-[#2d3a8c] via-[#1e293b] to-[#0f172a]',
    balanceLabel: 'Operating Funds',
    escrowLabel: 'B2B Pre-orders',
    creditLabel: 'Inventory Credit',
    stats: {
      balance: 2850000,
      escrow: 1200000,
      bonus: 85000,
      credit: 5000000,
      used: 1100000,
      score: 720,
      growth: '+8.1%',
    },
    aiAdvice:
      "Retail throughput is 18% higher than projected for Feb. Inventory levels for 'Nordic Wool' are at 12%. Recommendation: Utilize Inventory BNPL to restock before the weekend peak.",
    features: [
      {
        id: 'f-s1',
        name: 'Inventory BNPL',
        desc: 'Buy now, pay as you sell inventory management',
        icon: ShoppingCart,
        status: 'active',
      },
      {
        id: 'f-s2',
        name: 'POS Real-time Sync',
        desc: 'Instant liquidity from physical retail points',
        icon: RefreshCcw,
        status: 'active',
      },
      {
        id: 'f-s3',
        name: 'VAT Settlement',
        desc: 'Automated tax reporting and payment engine',
        icon: FileText,
        status: 'active',
      },
    ],
    transactions: [
      {
        id: 'TX-S001',
        type: 'income',
        category: 'B2C',
        title: 'POS Sync: Daily Settlement',
        amount: 420000,
        date: '2026-02-04',
        status: 'completed',
      },
      {
        id: 'TX-S002',
        type: 'expense',
        category: 'Stock',
        title: 'B2B Procurement: Nordic Wool',
        amount: 850000,
        date: '2026-02-03',
        status: 'completed',
      },
      {
        id: 'TX-S003',
        type: 'escrow',
        category: 'Returns',
        title: 'Customer Refund Reserve #9921',
        amount: 12000,
        date: '2026-02-02',
        status: 'locked',
      },
    ],
  },
  client: {
    title: 'Private Capital',
    entity: 'Private Style Account',
    tier: 'Platinum Elite',
    cardStatus: 'Active',
    cardStyle: 'bg-gradient-to-br from-[#4f46e5] via-[#3730a3] to-[#1e1b4b]',
    balanceLabel: 'Cash Balance',
    escrowLabel: 'Return Credits',
    creditLabel: 'Shopping Limit',
    stats: {
      balance: 145000,
      escrow: 8500,
      bonus: 12400,
      credit: 300000,
      used: 45000,
      score: 920,
      growth: '+5.2%',
    },
    aiAdvice:
      "Your 'Loro Piana' assets have increased in resale value by 15% this month. Recommendation: Unlock a 250k ₽ credit line via Wardrobe Collateral for the upcoming Spring Drop.",
    features: [
      {
        id: 'f-c1',
        name: 'Wardrobe Collateral',
        desc: 'Instant credit line backed by your digital wardrobe',
        icon: Gem,
        status: 'active',
      },
      {
        id: 'f-c2',
        name: 'Resale Liquidity',
        desc: 'Instant payout for authenticated resale listings',
        icon: RefreshCcw,
        status: 'active',
      },
      {
        id: 'f-c3',
        name: 'Style Insurance',
        desc: 'Micro-insurance for high-value fashion assets',
        icon: ShieldCheck,
        status: 'active',
      },
    ],
    transactions: [
      {
        id: 'TX-C001',
        type: 'expense',
        category: 'Style',
        title: 'Purchase: Oversized Coat',
        amount: 95000,
        date: '2026-02-04',
        status: 'completed',
      },
      {
        id: 'TX-C002',
        type: 'income',
        category: 'Cashback',
        title: 'Loyalty: 5% Sync Reward',
        amount: 4750,
        date: '2026-02-04',
        status: 'credited',
      },
      {
        id: 'TX-C003',
        type: 'bonus',
        category: 'Missions',
        title: 'Bonus: Wardrobe Upload Reward',
        amount: 500,
        date: '2026-02-01',
        status: 'credited',
      },
    ],
  },
  manufacturer: {
    title: 'Industrial Payouts',
    entity: 'Production Management Unit',
    tier: 'Industrial Gold',
    cardStatus: 'Verified',
    cardStyle: 'bg-gradient-to-br from-[#065f46] via-[#064e3b] to-[#022c22]',
    balanceLabel: 'Available Earnings',
    escrowLabel: 'Work-in-Progress',
    creditLabel: 'Material Line',
    stats: {
      balance: 8900000,
      escrow: 12400000,
      bonus: 45000,
      credit: 20000000,
      used: 5400000,
      score: 850,
      growth: '+15.8%',
    },
    aiAdvice:
      'Batch #42 is 92% complete. Recommendation: Initiate SCF Factoring for the upcoming 8.5M ₽ payout to pre-fund next textile purchase and secure a 5% supplier discount.',
    features: [
      {
        id: 'f-m1',
        name: 'SCF Factoring',
        desc: 'Get paid instantly for shipped production batches',
        icon: Zap,
        status: 'active',
      },
      {
        id: 'f-m2',
        name: 'Equipment Lease',
        desc: 'Finance industrial machinery with low interest',
        icon: Building2,
        status: 'active',
      },
      {
        id: 'f-m3',
        name: 'Labor Escrow',
        desc: 'Guaranteed payroll funds for verified milestones',
        icon: User,
        status: 'active',
      },
    ],
    transactions: [
      {
        id: 'TX-M001',
        type: 'income',
        category: 'Milestone',
        title: 'Batch #42 Completion Payout',
        amount: 3200000,
        date: '2026-02-04',
        status: 'completed',
      },
      {
        id: 'TX-M002',
        type: 'expense',
        category: 'Staff',
        title: 'Payroll: Production Dept Jan',
        amount: 1400000,
        date: '2026-02-01',
        status: 'completed',
      },
      {
        id: 'TX-M003',
        type: 'escrow',
        category: 'Quality',
        title: 'OTK Inspection Retention',
        amount: 450000,
        date: '2026-01-30',
        status: 'locked',
      },
    ],
  },
};

export function SynthaWallet() {
  const { viewRole } = useUIState();
  const { user } = useAuth();
  const [showNumbers, setShowNumbers] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine effective role for wallet data
  const roleKey = useMemo(() => {
    if (viewRole === 'client') return 'client';
    if (user?.roles?.includes('brand')) return 'brand';
    if (user?.roles?.includes('shop')) return 'shop';
    if (user?.roles?.includes('manufacturer') || user?.roles?.includes('supplier'))
      return 'manufacturer';
    return 'brand'; // Default
  }, [viewRole, user]);

  const data = ROLE_DATA[roleKey as keyof typeof ROLE_DATA] || ROLE_DATA.brand;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  if (!mounted) return <div className="min-h-screen bg-[#f8fafc]" />;

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-4 px-4 py-4 pb-24 duration-700 animate-in fade-in">
      {/* --- TOP OPERATIONAL HEADER (B2B STYLE) --- */}
      <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <Link href="/brand" className="transition-colors hover:text-indigo-600">
=======
    <RegistryPageShell className="max-w-5xl space-y-4 pb-16 duration-700 animate-in fade-in">
      {/* --- TOP OPERATIONAL HEADER (B2B STYLE) --- */}
      <div className="border-border-subtle flex flex-col items-start justify-between gap-3 border-b pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="text-text-muted flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em]">
            <Link href={ROUTES.brand.home} className="hover:text-accent-primary transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
              Organization
            </Link>
            <ChevronRight className="h-2 w-2" />
            <span className="text-text-muted">Financial Hub</span>
          </div>
          <div className="flex items-center gap-2.5">
<<<<<<< HEAD
            <h1 className="font-headline text-base font-bold uppercase leading-none tracking-tighter text-slate-900">
=======
            <h1 className="text-text-primary font-headline text-base font-bold uppercase leading-none tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
              {data.title}
            </h1>
            <Badge
              variant="outline"
              className="h-4 gap-1 border-emerald-100 bg-emerald-50 px-1.5 text-[7px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm transition-all"
            >
              {data.tier}
            </Badge>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto">
<<<<<<< HEAD
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
            <div className="flex shrink-0 items-center gap-3 rounded-lg border border-slate-200 bg-white p-1 px-3 shadow-sm">
              <div className="flex shrink-0 flex-col">
                <span className="mb-0.5 text-[7px] font-bold uppercase leading-none tracking-widest text-slate-400">
                  Portfolio Value
                </span>
                <span className="text-[10px] font-bold tabular-nums leading-none text-slate-900">
                  {(data.stats.balance + data.stats.escrow).toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="mx-0.5 h-6 w-px shrink-0 bg-slate-100" />
              <div className="flex shrink-0 flex-col">
                <span className="mb-0.5 text-[7px] font-bold uppercase leading-none tracking-widest text-slate-400">
                  Trust Score
                </span>
                <span className="text-[10px] font-bold italic tabular-nums leading-none text-indigo-600">
=======
          <div className="bg-bg-surface2 border-border-default flex items-center gap-1 rounded-xl border p-1 shadow-inner">
            <div className="border-border-default flex shrink-0 items-center gap-3 rounded-lg border bg-white p-1 px-3 shadow-sm">
              <div className="flex shrink-0 flex-col">
                <span className="text-text-muted mb-0.5 text-[7px] font-bold uppercase leading-none tracking-widest">
                  Portfolio Value
                </span>
                <span className="text-text-primary text-[10px] font-bold tabular-nums leading-none">
                  {(data.stats.balance + data.stats.escrow).toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="bg-bg-surface2 mx-0.5 h-6 w-px shrink-0" />
              <div className="flex shrink-0 flex-col">
                <span className="text-text-muted mb-0.5 text-[7px] font-bold uppercase leading-none tracking-widest">
                  Trust Score
                </span>
                <span className="text-accent-primary text-[10px] font-bold italic tabular-nums leading-none">
>>>>>>> recover/cabinet-wip-from-stash
                  {data.stats.score}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className={cn(
<<<<<<< HEAD
                'h-7 w-7 rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:bg-slate-50',
                isRefreshing && 'animate-spin'
              )}
            >
              <RefreshCcw className="h-3 w-3 text-slate-400" />
            </Button>
            <Button
              variant="outline"
              className="h-7 rounded-lg border border-slate-200 bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:text-indigo-600"
            >
              <Download className="mr-1.5 h-3 w-3" /> Export
            </Button>
            <Button className="h-7 gap-1.5 rounded-lg border border-slate-900 bg-slate-900 px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-indigo-600">
=======
                'border-border-default hover:bg-bg-surface2 h-7 w-7 rounded-lg border bg-white shadow-sm transition-all',
                isRefreshing && 'animate-spin'
              )}
            >
              <RefreshCcw className="text-text-muted h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              className="text-text-secondary border-border-default hover:text-accent-primary h-7 rounded-lg border bg-white px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
            >
              <Download className="mr-1.5 h-3 w-3" /> Export
            </Button>
            <Button className="bg-text-primary hover:bg-accent-primary border-text-primary h-7 gap-1.5 rounded-lg border px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all">
>>>>>>> recover/cabinet-wip-from-stash
              <Plus className="h-3.5 w-3.5" /> Transfer
            </Button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* --- LEFT COLUMN: FINANCIAL ASSETS --- */}
          <div className="space-y-4 lg:col-span-4">
            {/* Asset Distribution Grid */}
            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  label: data.balanceLabel,
                  val: data.stats.balance,
                  icon: Wallet,
<<<<<<< HEAD
                  color: 'text-indigo-600',
                  bg: 'bg-indigo-50/50',
=======
                  color: 'text-accent-primary',
                  bg: 'bg-accent-primary/10',
>>>>>>> recover/cabinet-wip-from-stash
                },
                {
                  label: data.escrowLabel,
                  val: data.stats.escrow,
                  icon: Lock,
                  color: 'text-amber-600',
                  bg: 'bg-amber-50/50',
                },
                {
                  label: 'Strategic Rewards',
                  val: data.stats.bonus,
                  icon: TrendingUp,
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50/50',
                },
              ].map((s, i) => (
                <Card
                  key={i}
<<<<<<< HEAD
                  className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all hover:border-indigo-100"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase leading-none tracking-[0.15em] text-slate-400">
=======
                  className="border-border-subtle hover:border-accent-primary/20 group relative overflow-hidden rounded-xl border bg-white p-3.5 shadow-sm transition-all"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-text-muted text-[9px] font-bold uppercase leading-none tracking-[0.15em]">
>>>>>>> recover/cabinet-wip-from-stash
                      {s.label}
                    </span>
                    <div
                      className={cn(
<<<<<<< HEAD
                        'rounded-lg border border-slate-200/50 p-1.5 shadow-inner',
=======
                        'border-border-default/50 rounded-lg border p-1.5 shadow-inner',
>>>>>>> recover/cabinet-wip-from-stash
                        s.bg
                      )}
                    >
                      <s.icon className={cn('h-3.5 w-3.5', s.color)} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
<<<<<<< HEAD
                    <span className="text-sm font-bold uppercase tabular-nums leading-none tracking-tighter text-slate-900">
=======
                    <span className="text-text-primary text-sm font-bold uppercase tabular-nums leading-none tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                      {s.val.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Strategic Modules Card */}
<<<<<<< HEAD
            <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100">
              <CardHeader className="border-b border-slate-50 bg-slate-50/50 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <CardTitle className="text-[10px] font-bold uppercase leading-none tracking-widest text-slate-900">
                      Strategic Modules
                    </CardTitle>
                    <CardDescription className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
=======
            <Card className="border-border-subtle hover:border-accent-primary/20 overflow-hidden rounded-xl border bg-white shadow-sm transition-all">
              <CardHeader className="border-border-subtle bg-bg-surface2/80 border-b p-3.5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <CardTitle className="text-text-primary text-[10px] font-bold uppercase leading-none tracking-widest">
                      Strategic Modules
                    </CardTitle>
                    <CardDescription className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                      Active operational units
                    </CardDescription>
                  </div>
                  <LayoutGrid className="text-text-muted h-3.5 w-3.5" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5 p-2.5">
                {data.features.map((feat) => (
                  <div
                    key={feat.id}
<<<<<<< HEAD
                    className="group cursor-pointer rounded-lg border border-transparent bg-white p-2.5 transition-all hover:border-slate-100 hover:bg-slate-50/50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-slate-100 bg-slate-50 transition-colors group-hover:bg-slate-900 group-hover:text-white">
=======
                    className="hover:border-border-subtle hover:bg-bg-surface2/80 group cursor-pointer rounded-lg border border-transparent bg-white p-2.5 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-bg-surface2 border-border-subtle group-hover:bg-text-primary/90 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors group-hover:text-white">
>>>>>>> recover/cabinet-wip-from-stash
                        <feat.icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5">
<<<<<<< HEAD
                          <h4 className="truncate text-[10px] font-bold uppercase tracking-tight text-slate-900">
=======
                          <h4 className="text-text-primary truncate text-[10px] font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                            {feat.name}
                          </h4>
                          {feat.status === 'setup' && (
                            <Badge
                              variant="outline"
<<<<<<< HEAD
                              className="h-3 border-indigo-100 bg-indigo-50 px-1 text-[6px] font-bold uppercase tracking-widest text-indigo-500"
=======
                              className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 h-3 px-1 text-[6px] font-bold uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              Setup
                            </Badge>
                          )}
                        </div>
<<<<<<< HEAD
                        <p className="truncate text-[9px] font-bold uppercase tracking-tighter text-slate-400 opacity-70">
                          {feat.desc}
                        </p>
                      </div>
                      <ChevronRight className="ml-auto h-3 w-3 self-center text-slate-200 transition-all group-hover:translate-x-0.5 group-hover:text-slate-900" />
=======
                        <p className="text-text-muted truncate text-[9px] font-bold uppercase tracking-tighter opacity-70">
                          {feat.desc}
                        </p>
                      </div>
                      <ChevronRight className="text-text-muted group-hover:text-text-primary ml-auto h-3 w-3 self-center transition-all group-hover:translate-x-0.5" />
>>>>>>> recover/cabinet-wip-from-stash
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* --- RIGHT COLUMN: STRATEGIC OPERATIONS --- */}
          <div className="space-y-4 lg:col-span-8">
            {/* Credit Intelligence Panel */}
<<<<<<< HEAD
            <Card className="group relative space-y-6 overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100">
              <div className="relative z-10 flex items-start justify-between">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-medium uppercase leading-none tracking-[0.15em] text-slate-400">
                    System Liquidity Engine
                  </p>
                  <h3 className="text-sm font-bold uppercase italic leading-none tracking-tighter text-slate-900">
=======
            <Card className="border-border-subtle hover:border-accent-primary/20 group relative space-y-6 overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all">
              <div className="relative z-10 flex items-start justify-between">
                <div className="space-y-1.5">
                  <p className="text-text-muted text-[9px] font-medium uppercase leading-none tracking-[0.15em]">
                    System Liquidity Engine
                  </p>
                  <h3 className="text-text-primary text-sm font-bold uppercase italic leading-none tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                    {data.creditLabel}
                  </h3>
                </div>
                <div className="space-y-1.5 text-right">
<<<<<<< HEAD
                  <p className="text-[8px] font-bold uppercase leading-none tracking-[0.2em] text-indigo-500">
                    Syntha Intelligence Score
                  </p>
                  <p className="text-sm font-bold italic tabular-nums leading-none text-slate-900">
                    {data.stats.score}{' '}
                    <span className="text-xs font-bold not-italic text-slate-200">/ 1000</span>
=======
                  <p className="text-accent-primary text-[8px] font-bold uppercase leading-none tracking-[0.2em]">
                    Syntha Intelligence Score
                  </p>
                  <p className="text-text-primary text-sm font-bold italic tabular-nums leading-none">
                    {data.stats.score}{' '}
                    <span className="text-text-muted text-xs font-bold not-italic">/ 1000</span>
>>>>>>> recover/cabinet-wip-from-stash
                  </p>
                </div>
              </div>

              <div className="relative z-10 space-y-4">
                <div className="flex items-end justify-between text-[9px] font-bold uppercase tracking-widest">
<<<<<<< HEAD
                  <span className="text-slate-400">Credit Utilization Index</span>
                  <span className="italic tabular-nums text-slate-900">
                    Limit: {data.stats.credit.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full border border-slate-50 bg-slate-100 shadow-inner">
                  <div
                    className="h-full bg-slate-900 shadow-[0_0_8px_rgba(15,23,42,0.3)] transition-all duration-1000 ease-out"
=======
                  <span className="text-text-muted">Credit Utilization Index</span>
                  <span className="text-text-primary italic tabular-nums">
                    Limit: {data.stats.credit.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="bg-bg-surface2 border-border-subtle h-1.5 w-full overflow-hidden rounded-full border shadow-inner">
                  <div
                    className="bg-text-primary h-full shadow-[0_0_8px_rgba(15,23,42,0.3)] transition-all duration-1000 ease-out"
>>>>>>> recover/cabinet-wip-from-stash
                    style={{ width: `${(data.stats.used / data.stats.credit) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
                    <span className="text-[9px] font-bold uppercase italic leading-none tracking-widest text-emerald-600">
                      Available: {(data.stats.credit - data.stats.used).toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <Badge
                    variant="outline"
<<<<<<< HEAD
                    className="h-5 rounded-md border-slate-200 bg-slate-50 px-2 text-[7px] font-bold uppercase tracking-widest shadow-sm"
=======
                    className="border-border-default bg-bg-surface2 h-5 rounded-md px-2 text-[7px] font-bold uppercase tracking-widest shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    Net-60 Priority
                  </Badge>
                </div>
              </div>

              <div className="relative z-10 grid gap-3 pt-2 md:grid-cols-2">
                <Button
                  variant="outline"
<<<<<<< HEAD
                  className="group flex h-10 cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 shadow-sm transition-all hover:border-slate-900 hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-inner transition-transform group-hover:scale-110">
                      <Zap className="h-3.5 w-3.5 fill-indigo-500/10 text-indigo-500" />
                    </div>
                    <span className="text-[10px] font-bold uppercase leading-none tracking-widest text-slate-900">
                      Instant Factoring
                    </span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-slate-900" />
                </Button>
                <Button
                  variant="outline"
                  className="group flex h-10 cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 shadow-sm transition-all hover:border-slate-900 hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-inner transition-transform group-hover:scale-110">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-bold uppercase leading-none tracking-widest text-slate-900">
                      Trade Insurance
                    </span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-slate-900" />
                </Button>
              </div>
              <Activity className="absolute -right-8 -top-4 z-0 h-32 w-32 text-slate-50 opacity-[0.4] transition-all duration-1000 group-hover:rotate-12 group-hover:scale-110" />
=======
                  className="bg-bg-surface2 border-border-subtle hover:border-text-primary group flex h-10 cursor-pointer items-center justify-between rounded-xl border px-4 shadow-sm transition-all hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="border-border-default flex h-7 w-7 items-center justify-center rounded-lg border bg-white shadow-inner transition-transform group-hover:scale-110">
                      <Zap className="text-accent-primary fill-accent-primary/10 h-3.5 w-3.5" />
                    </div>
                    <span className="text-text-primary text-[10px] font-bold uppercase leading-none tracking-widest">
                      Instant Factoring
                    </span>
                  </div>
                  <ChevronRight className="text-text-muted group-hover:text-text-primary h-3.5 w-3.5 transition-all group-hover:translate-x-0.5" />
                </Button>
                <Button
                  variant="outline"
                  className="bg-bg-surface2 border-border-subtle hover:border-text-primary group flex h-10 cursor-pointer items-center justify-between rounded-xl border px-4 shadow-sm transition-all hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="border-border-default flex h-7 w-7 items-center justify-center rounded-lg border bg-white shadow-inner transition-transform group-hover:scale-110">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <span className="text-text-primary text-[10px] font-bold uppercase leading-none tracking-widest">
                      Trade Insurance
                    </span>
                  </div>
                  <ChevronRight className="text-text-muted group-hover:text-text-primary h-3.5 w-3.5 transition-all group-hover:translate-x-0.5" />
                </Button>
              </div>
              <Activity className="text-text-inverse absolute -right-8 -top-4 z-0 h-32 w-32 opacity-[0.4] transition-all duration-1000 group-hover:rotate-12 group-hover:scale-110" />
>>>>>>> recover/cabinet-wip-from-stash
            </Card>

            {/* Strategic Ledger Table */}
            <div className="space-y-3">
<<<<<<< HEAD
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
                <div className="flex items-center gap-2 px-2">
                  <h3 className="text-[9px] font-bold uppercase italic tracking-widest text-slate-400">
                    Audit Ledger
                  </h3>
                  <div className="mx-1 h-4 w-[1px] bg-slate-200" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
=======
              <div className="bg-bg-surface2 border-border-default flex items-center justify-between rounded-xl border p-1 shadow-inner">
                <div className="flex items-center gap-2 px-2">
                  <h3 className="text-text-muted text-[9px] font-bold uppercase italic tracking-widest">
                    Audit Ledger
                  </h3>
                  <div className="bg-border-subtle mx-1 h-4 w-[1px]" />
                  <span className="text-text-muted text-[9px] font-bold uppercase tracking-widest opacity-60">
>>>>>>> recover/cabinet-wip-from-stash
                    {data.transactions.length} Entries
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-1">
                  <div className="group relative">
<<<<<<< HEAD
                    <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-indigo-600" />
                    <Input
                      placeholder="Filter Ledger..."
                      className="h-6.5 w-44 rounded-lg border border-slate-200 bg-white pl-8 pr-4 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all focus:ring-1 focus:ring-indigo-500"
=======
                    <Search className="text-text-muted group-focus-within:text-accent-primary absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 transition-colors" />
                    <Input
                      placeholder="Filter Ledger..."
                      className="h-6.5 border-border-default focus:ring-accent-primary w-44 rounded-lg border bg-white pl-8 pr-4 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all focus:ring-1"
>>>>>>> recover/cabinet-wip-from-stash
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
<<<<<<< HEAD
                    className="h-6.5 w-6.5 rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:bg-slate-50"
                  >
                    <Filter className="h-3 w-3 text-slate-400" />
=======
                    className="h-6.5 w-6.5 border-border-default hover:bg-bg-surface2 rounded-lg border bg-white shadow-sm transition-all"
                  >
                    <Filter className="text-text-muted h-3 w-3" />
>>>>>>> recover/cabinet-wip-from-stash
                  </Button>
                </div>
              </div>

<<<<<<< HEAD
              <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100/50">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="h-10 px-6 py-2.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        Identifier / Cycle
                      </th>
                      <th className="h-10 px-6 py-2.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        Operating Segment
                      </th>
                      <th className="h-10 px-6 py-2.5 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        Magnitude (RUB)
                      </th>
                      <th className="h-10 px-6 py-2.5 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
=======
              <div className="border-border-subtle hover:border-accent-primary/20 overflow-hidden rounded-xl border bg-white shadow-sm transition-all">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-bg-surface2/80 border-border-subtle border-b">
                      <th className="text-text-muted h-10 px-6 py-2.5 text-[9px] font-bold uppercase tracking-[0.2em]">
                        Identifier / Cycle
                      </th>
                      <th className="text-text-muted h-10 px-6 py-2.5 text-[9px] font-bold uppercase tracking-[0.2em]">
                        Operating Segment
                      </th>
                      <th className="text-text-muted h-10 px-6 py-2.5 text-right text-[9px] font-bold uppercase tracking-[0.2em]">
                        Magnitude (RUB)
                      </th>
                      <th className="text-text-muted h-10 px-6 py-2.5 text-right text-[9px] font-bold uppercase tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                        Status Index
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-border-subtle divide-y">
                    {data.transactions.map((tx) => (
<<<<<<< HEAD
                      <tr key={tx.id} className="group h-10 transition-all hover:bg-slate-50/50">
                        <td className="px-6 py-3">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold uppercase leading-none tracking-tighter text-slate-900">
                              {tx.id}
                            </span>
                            <span className="mt-1.5 text-[8px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
=======
                      <tr key={tx.id} className="hover:bg-bg-surface2/80 group h-10 transition-all">
                        <td className="px-6 py-3">
                          <div className="flex flex-col">
                            <span className="text-text-primary text-[11px] font-bold uppercase leading-none tracking-tighter">
                              {tx.id}
                            </span>
                            <span className="text-text-muted mt-1.5 text-[8px] font-bold uppercase tracking-widest opacity-60">
>>>>>>> recover/cabinet-wip-from-stash
                              {tx.date}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'flex h-7 w-7 items-center justify-center rounded-lg border shadow-sm transition-transform group-hover:scale-110',
                                tx.type === 'income'
                                  ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                                  : tx.type === 'expense'
<<<<<<< HEAD
                                    ? 'border-slate-200 bg-slate-50 text-slate-900'
=======
                                    ? 'bg-bg-surface2 border-border-default text-text-primary'
>>>>>>> recover/cabinet-wip-from-stash
                                    : 'border-amber-100 bg-amber-50 text-amber-600'
                              )}
                            >
                              {tx.type === 'income' ? (
                                <ArrowDownRight className="h-3.5 w-3.5" />
                              ) : tx.type === 'expense' ? (
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              ) : (
                                <Lock className="h-3.5 w-3.5" />
                              )}
                            </div>
                            <div className="min-w-0">
<<<<<<< HEAD
                              <p className="mb-1 truncate text-[11px] font-bold uppercase leading-none tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                                {tx.title}
                              </p>
                              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
=======
                              <p className="text-text-primary group-hover:text-accent-primary mb-1 truncate text-[11px] font-bold uppercase leading-none tracking-tight transition-colors">
                                {tx.title}
                              </p>
                              <p className="text-text-muted text-[8px] font-bold uppercase tracking-widest opacity-60">
>>>>>>> recover/cabinet-wip-from-stash
                                {tx.category} Operations
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <span
                            className={cn(
                              'text-[13px] font-bold italic tabular-nums tracking-tighter',
<<<<<<< HEAD
                              tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
=======
                              tx.type === 'income' ? 'text-emerald-600' : 'text-text-primary'
>>>>>>> recover/cabinet-wip-from-stash
                            )}
                          >
                            {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                            {tx.amount.toLocaleString('ru-RU')} ₽
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
<<<<<<< HEAD
                          <div className="inline-flex items-center gap-1.5 rounded-md border border-slate-100 bg-slate-50 px-2 py-0.5 shadow-inner">
=======
                          <div className="bg-bg-surface2 border-border-subtle inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 shadow-inner">
>>>>>>> recover/cabinet-wip-from-stash
                            <div
                              className={cn(
                                'h-1 w-1 rounded-full',
                                tx.status === 'completed'
                                  ? 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]'
                                  : tx.status === 'locked'
                                    ? 'bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.5)]'
<<<<<<< HEAD
                                    : 'bg-slate-300'
                              )}
                            />
                            <span className="text-[8px] font-bold uppercase italic tracking-widest text-slate-900 opacity-80">
=======
                                    : 'bg-border-default'
                              )}
                            />
                            <span className="text-text-primary text-[8px] font-bold uppercase italic tracking-widest opacity-80">
>>>>>>> recover/cabinet-wip-from-stash
                              {tx.status}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Intelligence Hub - Slate Style */}
<<<<<<< HEAD
            <Card className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-4 text-white shadow-lg">
=======
            <Card className="bg-text-primary border-text-primary/30 group relative overflow-hidden rounded-xl border p-4 text-white shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
              <div className="absolute right-0 top-0 rotate-12 p-4 opacity-[0.05] transition-all duration-1000 group-hover:scale-110 group-hover:opacity-[0.1]">
                <BrainCircuit className="h-48 w-48" />
              </div>
              <div className="relative z-10 flex flex-col items-center gap-3 text-center md:flex-row md:text-left">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-center gap-2.5 md:justify-start">
<<<<<<< HEAD
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                    <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-indigo-400">
=======
                    <div className="bg-accent-primary h-1.5 w-1.5 animate-pulse rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                    <span className="text-accent-primary text-[9px] font-medium uppercase tracking-[0.15em]">
>>>>>>> recover/cabinet-wip-from-stash
                      Syntha AI Strategy Unit
                    </span>
                  </div>
                  <h4 className="text-sm font-bold uppercase italic leading-none tracking-tighter text-white">
                    Strategic Forecast
                  </h4>
<<<<<<< HEAD
                  <p className="max-w-xl text-[12px] font-bold uppercase italic leading-relaxed tracking-tight text-slate-400 opacity-80">
=======
                  <p className="text-text-muted max-w-xl text-[12px] font-bold uppercase italic leading-relaxed tracking-tight opacity-80">
>>>>>>> recover/cabinet-wip-from-stash
                    "{data.aiAdvice}"
                  </p>
                </div>
                <div className="flex w-full shrink-0 flex-col gap-2 md:w-64">
<<<<<<< HEAD
                  <Button className="h-9 w-full rounded-lg border border-indigo-600 bg-indigo-600 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-indigo-500">
=======
                  <Button className="bg-accent-primary hover:bg-accent-primary border-accent-primary h-9 w-full rounded-lg border text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all">
>>>>>>> recover/cabinet-wip-from-stash
                    Execute Strategy
                  </Button>
                  <Button
                    variant="ghost"
<<<<<<< HEAD
                    className="h-9 w-full rounded-lg text-[9px] font-bold uppercase tracking-widest text-slate-500 transition-all hover:bg-white/5 hover:text-white"
=======
                    className="text-text-secondary h-9 w-full rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all hover:bg-white/5 hover:text-white"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    Adjust Parameters
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Background Decor - B2B Grid */}
      <div
        className="pointer-events-none fixed inset-0 z-[-1] opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
