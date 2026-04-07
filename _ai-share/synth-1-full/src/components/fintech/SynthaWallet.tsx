'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wallet, CreditCard, ArrowUpRight, ArrowDownRight, 
  History, ShieldCheck, Zap, Lock, DollarSign, 
  PieChart, Settings2, Plus, ArrowRight, RefreshCcw,
  CheckCircle2, AlertTriangle, Eye, EyeOff, Building2,
  Gem, TrendingUp, Info, Briefcase, ShoppingCart, Store,
  Factory, Warehouse, User, BarChart3, Download, Search,
  BrainCircuit, LayoutGrid, ChevronRight, MoreHorizontal,
  Bell, HelpCircle, UserCircle, FileText, Activity, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIState } from '@/providers/ui-state';
import { useAuth } from '@/providers/auth-provider';

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
    stats: { balance: 12480000, escrow: 4500000, bonus: 240000, credit: 15000000, used: 3200000, score: 880, growth: '+12.4%' },
    aiAdvice: "Liquidity analysis indicates a surplus of 4.2M ₽ available for raw material hedging. Projected index for Premium Merino Wool is rising by 12.4% in Q3. Recommendation: Deploy capital now to lock in current rates.",
    features: [
      { id: 'f-b1', name: 'Forward Financing', desc: 'Pre-fund production cycles with AI risk assessment', icon: Zap, status: 'active' },
      { id: 'f-b2', name: 'Royalty Ledger', desc: 'Automated distribution to IP holders & designers', icon: History, status: 'active' },
      { id: 'f-b3', name: 'Duty Reserve', desc: 'Automated VAT/Customs provisioning for imports', icon: ShieldCheck, status: 'setup' }
    ],
    transactions: [
      { id: 'TX-B001', type: 'income', category: 'Retail', title: 'TSUM Moscow Jan Sales Payout', amount: 4200000, date: '2026-02-04', status: 'completed' },
      { id: 'TX-B002', type: 'expense', category: 'Factory', title: 'Winter Capsule Production Payment', amount: 1850000, date: '2026-02-02', status: 'completed' },
      { id: 'TX-B003', type: 'escrow', category: 'Materials', title: 'Italian Silk Batch #4 Hold', amount: 950000, date: '2026-02-01', status: 'locked' }
    ]
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
    stats: { balance: 2850000, escrow: 1200000, bonus: 85000, credit: 5000000, used: 1100000, score: 720, growth: '+8.1%' },
    aiAdvice: "Retail throughput is 18% higher than projected for Feb. Inventory levels for 'Nordic Wool' are at 12%. Recommendation: Utilize Inventory BNPL to restock before the weekend peak.",
    features: [
      { id: 'f-s1', name: 'Inventory BNPL', desc: 'Buy now, pay as you sell inventory management', icon: ShoppingCart, status: 'active' },
      { id: 'f-s2', name: 'POS Real-time Sync', desc: 'Instant liquidity from physical retail points', icon: RefreshCcw, status: 'active' },
      { id: 'f-s3', name: 'VAT Settlement', desc: 'Automated tax reporting and payment engine', icon: FileText, status: 'active' }
    ],
    transactions: [
      { id: 'TX-S001', type: 'income', category: 'B2C', title: 'POS Sync: Daily Settlement', amount: 420000, date: '2026-02-04', status: 'completed' },
      { id: 'TX-S002', type: 'expense', category: 'Stock', title: 'B2B Procurement: Nordic Wool', amount: 850000, date: '2026-02-03', status: 'completed' },
      { id: 'TX-S003', type: 'escrow', category: 'Returns', title: 'Customer Refund Reserve #9921', amount: 12000, date: '2026-02-02', status: 'locked' }
    ]
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
    stats: { balance: 145000, escrow: 8500, bonus: 12400, credit: 300000, used: 45000, score: 920, growth: '+5.2%' },
    aiAdvice: "Your 'Loro Piana' assets have increased in resale value by 15% this month. Recommendation: Unlock a 250k ₽ credit line via Wardrobe Collateral for the upcoming Spring Drop.",
    features: [
      { id: 'f-c1', name: 'Wardrobe Collateral', desc: 'Instant credit line backed by your digital wardrobe', icon: Gem, status: 'active' },
      { id: 'f-c2', name: 'Resale Liquidity', desc: 'Instant payout for authenticated resale listings', icon: RefreshCcw, status: 'active' },
      { id: 'f-c3', name: 'Style Insurance', desc: 'Micro-insurance for high-value fashion assets', icon: ShieldCheck, status: 'active' }
    ],
    transactions: [
      { id: 'TX-C001', type: 'expense', category: 'Style', title: 'Purchase: Oversized Coat', amount: 95000, date: '2026-02-04', status: 'completed' },
      { id: 'TX-C002', type: 'income', category: 'Cashback', title: 'Loyalty: 5% Sync Reward', amount: 4750, date: '2026-02-04', status: 'credited' },
      { id: 'TX-C003', type: 'bonus', category: 'Missions', title: 'Bonus: Wardrobe Upload Reward', amount: 500, date: '2026-02-01', status: 'credited' }
    ]
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
    stats: { balance: 8900000, escrow: 12400000, bonus: 45000, credit: 20000000, used: 5400000, score: 850, growth: '+15.8%' },
    aiAdvice: "Batch #42 is 92% complete. Recommendation: Initiate SCF Factoring for the upcoming 8.5M ₽ payout to pre-fund next textile purchase and secure a 5% supplier discount.",
    features: [
      { id: 'f-m1', name: 'SCF Factoring', desc: 'Get paid instantly for shipped production batches', icon: Zap, status: 'active' },
      { id: 'f-m2', name: 'Equipment Lease', desc: 'Finance industrial machinery with low interest', icon: Building2, status: 'active' },
      { id: 'f-m3', name: 'Labor Escrow', desc: 'Guaranteed payroll funds for verified milestones', icon: User, status: 'active' }
    ],
    transactions: [
      { id: 'TX-M001', type: 'income', category: 'Milestone', title: 'Batch #42 Completion Payout', amount: 3200000, date: '2026-02-04', status: 'completed' },
      { id: 'TX-M002', type: 'expense', category: 'Staff', title: 'Payroll: Production Dept Jan', amount: 1400000, date: '2026-02-01', status: 'completed' },
      { id: 'TX-M003', type: 'escrow', category: 'Quality', title: 'OTK Inspection Retention', amount: 450000, date: '2026-01-30', status: 'locked' }
    ]
  }
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
    if (user?.roles?.includes('manufacturer') || user?.roles?.includes('supplier')) return 'manufacturer';
    return 'brand'; // Default
  }, [viewRole, user]);

  const data = ROLE_DATA[roleKey as keyof typeof ROLE_DATA] || ROLE_DATA.brand;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  if (!mounted) return <div className="min-h-screen bg-[#f8fafc]" />;

  return (
    <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl pb-24 animate-in fade-in duration-700">
      
      {/* --- TOP OPERATIONAL HEADER (B2B STYLE) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <Link href="/brand" className="hover:text-indigo-600 transition-colors">Organization</Link>
            <ChevronRight className="h-2 w-2" />
            <span className="text-slate-300">Financial Hub</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold font-headline tracking-tighter uppercase text-slate-900 leading-none">{data.title}</h1>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold text-[7px] px-1.5 h-4 gap-1 tracking-widest shadow-sm transition-all uppercase">
               {data.tier}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
            <div className="flex items-center gap-3 bg-white border border-slate-200 p-1 rounded-lg shadow-sm px-3 shrink-0">
               <div className="flex flex-col shrink-0">
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Portfolio Value</span>
                <span className="text-[10px] font-bold tabular-nums text-slate-900 leading-none">{(data.stats.balance + data.stats.escrow).toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="h-6 w-px bg-slate-100 mx-0.5 shrink-0" />
              <div className="flex flex-col shrink-0">
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Trust Score</span>
                <span className="text-[10px] font-bold tabular-nums text-indigo-600 italic leading-none">{data.stats.score}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleRefresh} className={cn("h-7 w-7 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-all", isRefreshing && "animate-spin")}>
              <RefreshCcw className="h-3 w-3 text-slate-400" />
            </Button>
            <Button variant="outline" className="h-7 px-3 bg-white text-slate-600 rounded-lg font-bold uppercase text-[9px] tracking-widest shadow-sm border border-slate-200 transition-all hover:text-indigo-600">
              <Download className="mr-1.5 h-3 w-3" /> Export
            </Button>
            <Button className="h-7 px-4 rounded-lg bg-slate-900 text-white text-[9px] font-bold uppercase gap-1.5 hover:bg-indigo-600 transition-all shadow-lg border border-slate-900 tracking-widest">
              <Plus className="h-3.5 w-3.5" /> Transfer
            </Button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          
          {/* --- LEFT COLUMN: FINANCIAL ASSETS --- */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Asset Distribution Grid */}
            <div className="grid grid-cols-1 gap-2">
              {[
                { label: data.balanceLabel, val: data.stats.balance, icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50/50' },
                { label: data.escrowLabel, val: data.stats.escrow, icon: Lock, color: 'text-amber-600', bg: 'bg-amber-50/50' },
                { label: 'Strategic Rewards', val: data.stats.bonus, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50/50' }
              ].map((s, i) => (
                <Card key={i} className="border border-slate-100 shadow-sm bg-white p-3.5 group hover:border-indigo-100 transition-all rounded-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none">{s.label}</span>
                    <div className={cn("p-1.5 rounded-lg shadow-inner border border-slate-200/50", s.bg)}>
                      <s.icon className={cn("h-3.5 w-3.5", s.color)} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold tracking-tighter text-slate-900 tabular-nums uppercase leading-none">{s.val.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Strategic Modules Card */}
            <Card className="border border-slate-100 shadow-sm bg-white rounded-xl overflow-hidden hover:border-indigo-100 transition-all">
              <CardHeader className="p-3.5 border-b border-slate-50 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-900 leading-none">Strategic Modules</CardTitle>
                    <CardDescription className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Active operational units</CardDescription>
                  </div>
                  <LayoutGrid className="h-3.5 w-3.5 text-slate-300" />
                </div>
              </CardHeader>
              <CardContent className="p-2.5 space-y-1.5">
                {data.features.map((feat) => (
                  <div key={feat.id} className="p-2.5 bg-white border border-transparent rounded-lg group cursor-pointer hover:border-slate-100 hover:bg-slate-50/50 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="h-7 w-7 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <feat.icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-[10px] font-bold uppercase tracking-tight text-slate-900 truncate">{feat.name}</h4>
                          {feat.status === 'setup' && (
                            <Badge variant="outline" className="text-[6px] font-bold uppercase px-1 h-3 bg-indigo-50 text-indigo-500 border-indigo-100 tracking-widest">Setup</Badge>
                          )}
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter truncate opacity-70">{feat.desc}</p>
                      </div>
                      <ChevronRight className="ml-auto h-3 w-3 text-slate-200 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all self-center" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

          {/* --- RIGHT COLUMN: STRATEGIC OPERATIONS --- */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Credit Intelligence Panel */}
            <Card className="bg-white border border-slate-100 shadow-sm rounded-xl p-4 space-y-6 relative overflow-hidden group hover:border-indigo-100 transition-all">
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1.5">
                  <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-slate-400 leading-none">System Liquidity Engine</p>
                  <h3 className="text-sm font-bold uppercase tracking-tighter text-slate-900 italic leading-none">{data.creditLabel}</h3>
                </div>
                <div className="text-right space-y-1.5">
                  <p className="text-[8px] font-bold uppercase text-indigo-500 tracking-[0.2em] leading-none">Syntha Intelligence Score</p>
                  <p className="text-sm font-bold text-slate-900 tabular-nums italic leading-none">{data.stats.score} <span className="text-slate-200 text-xs font-bold not-italic">/ 1000</span></p>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-end text-[9px] font-bold uppercase tracking-widest">
                  <span className="text-slate-400">Credit Utilization Index</span>
                  <span className="text-slate-900 tabular-nums italic">Limit: {data.stats.credit.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-50">
                  <div className="h-full bg-slate-900 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(15,23,42,0.3)]" style={{ width: `${(data.stats.used / data.stats.credit) * 100}%` }} />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest italic leading-none">Available: {(data.stats.credit - data.stats.used).toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <Badge variant="outline" className="h-5 rounded-md border-slate-200 text-[7px] font-bold uppercase tracking-widest bg-slate-50 px-2 shadow-sm">Net-60 Priority</Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 relative z-10 pt-2">
                <Button variant="outline" className="h-10 bg-slate-50 border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-slate-900 hover:bg-white transition-all rounded-xl shadow-sm px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <Zap className="h-3.5 w-3.5 text-indigo-500 fill-indigo-500/10" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 leading-none">Instant Factoring</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                </Button>
                <Button variant="outline" className="h-10 bg-slate-50 border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-slate-900 hover:bg-white transition-all rounded-xl shadow-sm px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900 leading-none">Trade Insurance</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                </Button>
              </div>
              <Activity className="absolute -right-8 -top-4 h-32 w-32 text-slate-50 opacity-[0.4] group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000 z-0" />
            </Card>

            {/* Strategic Ledger Table */}
            <div className="space-y-3">
              <div className="bg-slate-100 p-1 flex items-center justify-between rounded-xl border border-slate-200 shadow-inner">
                <div className="flex items-center gap-2 px-2">
                   <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 italic">Audit Ledger</h3>
                   <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">{data.transactions.length} Entries</span>
                </div>
                <div className="flex items-center gap-1.5 px-1">
                  <div className="relative group">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                    <Input placeholder="Filter Ledger..." className="h-6.5 pl-8 pr-4 border border-slate-200 rounded-lg text-[9px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-indigo-500 w-44 bg-white transition-all shadow-sm" />
                  </div>
                  <Button variant="ghost" size="icon" className="h-6.5 w-6.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-all">
                    <Filter className="h-3 w-3 text-slate-400" />
                  </Button>
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm hover:border-indigo-100/50 transition-all">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="py-2.5 px-6 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 h-10">Identifier / Cycle</th>
                      <th className="py-2.5 px-6 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 h-10">Operating Segment</th>
                      <th className="py-2.5 px-6 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 h-10 text-right">Magnitude (RUB)</th>
                      <th className="py-2.5 px-6 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 h-10 text-right">Status Index</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.transactions.map((tx) => (
                      <tr key={tx.id} className="group hover:bg-slate-50/50 transition-all h-10">
                        <td className="py-3 px-6">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-slate-900 tracking-tighter uppercase leading-none">{tx.id}</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 opacity-60">{tx.date}</span>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-7 w-7 rounded-lg flex items-center justify-center border shadow-sm group-hover:scale-110 transition-transform",
                              tx.type === 'income' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : 
                              tx.type === 'expense' ? "bg-slate-50 border-slate-200 text-slate-900" :
                              "bg-amber-50 border-amber-100 text-amber-600"
                            )}>
                              {tx.type === 'income' ? <ArrowDownRight className="h-3.5 w-3.5" /> : 
                               tx.type === 'expense' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-slate-900 uppercase tracking-tight truncate leading-none mb-1 group-hover:text-indigo-600 transition-colors">{tx.title}</p>
                              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest opacity-60">{tx.category} Operations</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-right">
                          <span className={cn(
                            "text-[13px] font-bold tabular-nums italic tracking-tighter",
                            tx.type === 'income' ? "text-emerald-600" : "text-slate-900"
                          )}>
                            {tx.type === 'income' ? '+' : tx.type === 'expense' ? '-' : ''}
                            {tx.amount.toLocaleString('ru-RU')} ₽
                          </span>
                        </td>
                        <td className="py-3 px-6 text-right">
                          <div className="inline-flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 shadow-inner">
                            <div className={cn(
                              "h-1 w-1 rounded-full",
                              tx.status === 'completed' ? "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]" : 
                              tx.status === 'locked' ? "bg-amber-500 shadow-[0_0_4px_rgba(245,158,11,0.5)]" : "bg-slate-300"
                            )} />
                            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-900 italic opacity-80">{tx.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Intelligence Hub - Slate Style */}
            <Card className="bg-slate-900 text-white p-4 rounded-xl relative overflow-hidden group shadow-lg border border-slate-800">
              <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] group-hover:scale-110 transition-all duration-1000 rotate-12">
                <BrainCircuit className="h-48 w-48" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-2.5 justify-center md:justify-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                    <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-indigo-400">Syntha AI Strategy Unit</span>
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-tighter italic leading-none text-white">Strategic Forecast</h4>
                  <p className="text-[12px] leading-relaxed text-slate-400 font-bold uppercase tracking-tight italic max-w-xl opacity-80">
                    "{data.aiAdvice}"
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-64 shrink-0">
                  <Button className="w-full h-9 rounded-lg bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg border border-indigo-600">Execute Strategy</Button>
                  <Button variant="ghost" className="w-full h-9 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 text-[9px] font-bold uppercase tracking-widest transition-all">Adjust Parameters</Button>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>

      {/* Background Decor - B2B Grid */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.02]" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
  );
}
