'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Clock, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Building2, 
  Factory,
  ArrowRight,
  TrendingUp,
  History,
  Info,
  Plus
} from 'lucide-react';
import { EscrowAccount, EscrowMilestone } from '@/lib/types/finance';
import { cn } from '@/lib/utils';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';

/**
 * Escrow Milestone Engine UI
 * Поэтапная оплата производства через эскроу-счета (Safe Deals).
 */

export default function EscrowPage() {
  const [escrow, setEscrow] = useState<EscrowAccount>({
    id: 'ESC-2026-001',
    orderId: 'PO-8872',
    brandId: 'brand-synth',
    factoryId: 'factory-china-01',
    totalAmount: 125000,
    balance: 37500, // Funded but not released
    status: 'active',
    milestones: [
      { id: 'm1', title: 'Pre-production Deposit', amount: 37500, percentage: 30, status: 'released', releasedAt: '2026-02-15T12:00:00Z', conditions: ['Tech Pack Approval', 'BOM Verification'] },
      { id: 'm2', title: 'Bulk Start (Cutting)', amount: 37500, percentage: 30, status: 'funded', conditions: ['PPS (Pre-production Sample) Approval', 'Material Arrival'] },
      { id: 'm3', title: 'Quality Control (Inline)', amount: 25000, percentage: 20, status: 'pending', conditions: ['AQL 2.5 Inspection Passed', 'Production Photos'] },
      { id: 'm4', title: 'Final Shipment', amount: 25000, percentage: 20, status: 'pending', conditions: ['Bill of Lading Upload', 'Packing List Verification'] },
    ]
  });

  const getStatusBadge = (status: EscrowMilestone['status']) => {
    const config: Record<EscrowMilestone['status'], { label: string, color: string, icon: any }> = {
      'pending': { label: 'Ожидает', color: 'bg-slate-50 text-slate-500 border-slate-100', icon: Clock },
      'funded': { label: 'Депонировано', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: Lock },
      'released': { label: 'Выплачено', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
      'disputed': { label: 'Спор', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: AlertTriangle }
    };
    const item = config[status];
    return (
      <Badge variant="outline" className={cn("text-[8px] font-black uppercase px-2 h-5 gap-1", item.color)}>
        <item.icon className="w-2.5 h-2.5" />
        {item.label}
      </Badge>
    );
  };

  const progress = (escrow.milestones.filter(m => m.status === 'released').length / escrow.milestones.length) * 100;

  return (
    <div className="container mx-auto px-4 py-4 space-y-10">
      <SectionInfoCard
        title="Escrow Milestone Engine"
        description="Безопасные сделки с фабриками: поэтапная оплата. Связи: Finance, Disputes, B2B Orders, Production."
        icon={ShieldCheck}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
        badges={<><Badge variant="outline" className="text-[9px]">Safe Deals</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/finance">Finance</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/calendar?layers=finance,orders">Календарь</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/disputes">Disputes</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/b2b-orders">B2B Orders</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/production">Production</Link></Button></>}
      />
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
            <ShieldCheck className="w-3 h-3" />
            Fintech & Escrow
          </div>
          <h1 className="text-sm font-black font-headline tracking-tighter">Escrow Milestone Engine</h1>
          <p className="text-muted-foreground font-medium">Безопасные сделки с фабриками: оплата только после подтверждения этапов.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px]">
              <FileText className="w-4 h-4" /> Договор Escrow
           </Button>
           <Button className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px] bg-slate-900 text-white shadow-lg">
              <Plus className="w-4 h-4" /> Создать Escrow-счет
           </Button>
        </div>
      </header>

      {/* Main Stats */}
      <div className="grid md:grid-cols-4 gap-3">
         <Card className="md:col-span-2 border-none shadow-xl shadow-indigo-100 rounded-xl bg-indigo-600 text-white p-4 overflow-hidden relative">
            <div className="relative z-10 flex flex-col h-full justify-between">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Всего по контракту</p>
                     <p className="text-sm font-black tracking-tighter">${escrow.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                     <Lock className="w-5 h-5 text-white" />
                  </div>
               </div>
               
               <div className="mt-8 space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                     <span>Прогресс выплат</span>
                     <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                  </div>
               </div>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
         </Card>

         <Card className="border-none shadow-sm bg-white rounded-xl p-4 flex flex-col justify-between">
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">На Escrow-балансе</p>
               <p className="text-sm font-black text-indigo-600">${escrow.balance.toLocaleString()}</p>
            </div>
            <div className="pt-4 border-t border-slate-50">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                  <Unlock className="w-3 h-3" /> Ожидает выплаты: $25,000
               </div>
            </div>
         </Card>

         <Card className="border-none shadow-sm bg-slate-900 text-white rounded-xl p-4 flex flex-col justify-between">
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Контрагент (Фабрика)</p>
               <p className="text-sm font-black tracking-tight">Dongguan Textile Group</p>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center gap-2">
               <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-black text-[8px] uppercase">Verified Provider</Badge>
            </div>
         </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
         <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden">
               <CardHeader className="p-4 border-b border-slate-50">
                  <CardTitle className="text-base font-black uppercase tracking-tight">Milestone Roadmap</CardTitle>
                  <CardDescription>Управление этапами оплаты и условиями разморозки средств.</CardDescription>
               </CardHeader>
               <CardContent className="p-0">
                  <Table>
                     <TableHeader className="bg-slate-50/50">
                        <TableRow>
                           <TableHead className="pl-8 text-[10px] font-black uppercase">Этап / Цель</TableHead>
                           <TableHead className="text-[10px] font-black uppercase">Сумма (%)</TableHead>
                           <TableHead className="text-[10px] font-black uppercase">Статус</TableHead>
                           <TableHead className="pr-8 text-right text-[10px] font-black uppercase">Действие</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {escrow.milestones.map((m, i) => (
                           <TableRow key={m.id} className="hover:bg-slate-50/50 transition-colors">
                              <TableCell className="pl-8 py-6">
                                 <p className="font-bold text-sm text-slate-900">{m.title}</p>
                                 <div className="flex flex-wrap gap-1 mt-2">
                                    {m.conditions.map((c, idx) => (
                                       <span key={idx} className="text-[8px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold uppercase">{c}</span>
                                    ))}
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <p className="text-sm font-black text-slate-900">${m.amount.toLocaleString()}</p>
                                 <p className="text-[10px] text-slate-400 font-bold uppercase">{m.percentage}%</p>
                              </TableCell>
                              <TableCell>
                                 {getStatusBadge(m.status)}
                              </TableCell>
                              <TableCell className="pr-8 text-right">
                                 {m.status === 'pending' && (
                                    <Button size="sm" className="h-8 rounded-lg font-black uppercase text-[9px] bg-indigo-600 text-white">Депонировать</Button>
                                 )}
                                 {m.status === 'funded' && (
                                    <Button size="sm" className="h-8 rounded-lg font-black uppercase text-[9px] bg-emerald-600 text-white">Разморозить</Button>
                                 )}
                                 {m.status === 'released' && (
                                    <div className="flex flex-col items-end">
                                       <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                       <p className="text-[8px] font-black uppercase text-slate-400 mt-1">{new Date(m.releasedAt!).toLocaleDateString()}</p>
                                    </div>
                                 )}
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </div>

         <div className="space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl p-4">
               <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                     <AlertTriangle className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Arbitrage & Security</h3>
               </div>
               
               <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
                  В случае невыполнения условий этапа вы можете инициировать процедуру спора. Средства будут заморожены до решения арбитража Synth-1.
               </p>
               
               <Button variant="outline" className="w-full h-11 border-rose-100 text-rose-600 hover:bg-rose-50 rounded-xl font-black uppercase text-[9px]">Открыть диспут</Button>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl p-4">
               <h3 className="text-sm font-black uppercase tracking-tight mb-6">Recent Log</h3>
               <div className="space-y-4">
                  {[
                     { msg: 'Funds Released: Milestone #1', date: 'Feb 15, 2026', icon: Unlock, color: 'text-emerald-500' },
                     { msg: 'Account Created', date: 'Feb 12, 2026', icon: FileText, color: 'text-slate-400' }
                  ].map((log, i) => (
                     <div key={i} className="flex gap-3">
                        <div className={cn("h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0", log.color)}>
                           <log.icon className="w-4 h-4" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-slate-900">{log.msg}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase">{log.date}</p>
                        </div>
                     </div>
                  ))}
               </div>
               <Button variant="ghost" className="w-full mt-6 text-indigo-600 hover:bg-indigo-50 rounded-xl font-black uppercase text-[9px] h-10">Полный аудит-лог</Button>
            </Card>
         </div>
      </div>
    </div>
  );
}
