'use client';

import React, { useState } from 'react';

/** Deterministic number format to avoid hydration mismatch (no locale). */
function formatClaimValue(value: number | undefined): string {
  if (value == null) return '—';
  return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ShieldAlert, 
  Plus, 
  Search, 
  Info, 
  ChevronRight, 
  Building2, 
  Filter, 
  ArrowRight,
  Zap,
  Gavel,
  DollarSign,
  Clock,
  MoreVertical,
  ExternalLink,
  MessageCircle,
  Package,
  Factory,
  CheckCircle2,
  AlertTriangle,
  History,
  Scale,
  FileCheck,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { Dispute, DisputeStatus, DisputeCategory, DisputeSeverity } from '@/lib/types/disputes';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { getArbitrationLinks } from '@/lib/data/entity-links';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';

/**
 * Dispute Resolution Hub — Brand OS
 * Управление спорами с фабриками и ритейлерами.
 */

export default function BrandDisputesPage() {
  const [activeDisputes, setActiveDisputes] = useState<Dispute[]>([
    {
      id: 'DISP-1',
      caseNumber: 'SYNTH-8821',
      title: 'Batch Q3-101: Quality Defects in Silk Lining',
      category: 'quality_issue',
      status: 'under_review',
      severity: 'high',
      claimantId: 'brand-luxury-silk',
      claimantName: 'Luxury Silk Brand',
      respondentId: 'factory-milan-textile',
      respondentName: 'Milan Textile Factory',
      claimValue: 12500,
      currency: 'USD',
      description: 'The internal silk lining of 500 dresses from Batch Q3-101 shows significant tearing at the seams.',
      evidence: [],
      messages: [],
      createdAt: '2026-03-01T10:00:00Z',
      updatedAt: '2026-03-05T14:30:00Z'
    }
  ]);

  const getStatusBadge = (status: DisputeStatus) => {
    const config: Record<DisputeStatus, { label: string, color: string, icon: any }> = {
      'draft': { label: 'Черновик', color: 'bg-slate-50 text-slate-400 border-slate-100', icon: Info },
      'filed': { label: 'Подано', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: Plus },
      'under_review': { label: 'На проверке', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock },
      'evidence_required': { label: 'Нужны док-ва', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: FileCheck },
      'mediation': { label: 'Медиация', color: 'bg-purple-50 text-purple-600 border-purple-100', icon: MessageCircle },
      'resolved': { label: 'Решено', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2 },
      'closed': { label: 'Закрыто', color: 'bg-slate-900 text-white border-none', icon: Lock }
    };
    const item = config[status];
    return (
      <Badge variant="outline" className={cn("text-[8px] font-black uppercase px-2 h-5 gap-1", item.color)}>
        <item.icon className="w-2.5 h-2.5" />
        {item.label}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-4 space-y-10">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-600">
            <ShieldAlert className="w-3.5 h-3.5" />
            Dispute Resolution
          </div>
          <h1 className="text-sm font-black font-headline tracking-tighter uppercase">Dispute Hub</h1>
          <p className="text-muted-foreground font-medium">Центр управления B2B-претензиями и арбитражем.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px]">
              <History className="w-4 h-4" /> История споров
           </Button>
           <Button variant="outline" asChild className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px]">
              <Link href="/brand/finance/escrow">Escrow</Link>
           </Button>
           <Button className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px] bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200">
              <Plus className="w-4 h-4" /> Подать новую претензию
           </Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-3">
         <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden bg-white">
               <CardHeader className="p-4 border-b border-slate-50 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-black uppercase tracking-tight text-slate-900">Ваши активные споры</CardTitle>
                    <CardDescription>Статус претензий к фабрикам и партнерам.</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    <Input placeholder="Search Case # / Factory" className="pl-9 h-10 rounded-xl border-slate-100 text-xs w-64" />
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <Table>
                     <TableHeader className="bg-slate-50/50">
                        <TableRow>
                           <TableHead className="pl-8 text-[10px] font-black uppercase">Case Info</TableHead>
                           <TableHead className="text-[10px] font-black uppercase">Respondent</TableHead>
                           <TableHead className="text-[10px] font-black uppercase">Status</TableHead>
                           <TableHead className="text-[10px] font-black uppercase">Claim Value</TableHead>
                           <TableHead className="pr-8 text-right text-[10px] font-black uppercase">Action</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {activeDisputes.length === 0 ? (
                           <TableRow>
                              <TableCell colSpan={5} className="py-10 text-center">
                                 <div className="space-y-4">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-100 mx-auto" />
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic">Нет активных споров</p>
                                 </div>
                              </TableCell>
                           </TableRow>
                        ) : (
                           activeDisputes.map(dispute => (
                              <TableRow key={dispute.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                 <TableCell className="pl-8 py-6">
                                    <div className="space-y-1">
                                       <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">{dispute.caseNumber}</span>
                                          <span className="text-xs font-black text-slate-900">{dispute.title}</span>
                                       </div>
                                       <p className="text-[9px] text-slate-400 font-bold uppercase">{dispute.category.replace('_', ' ')}</p>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    <div className="flex items-center gap-2">
                                       <div className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center">
                                          <Factory className="w-3.5 h-3.5 text-slate-400" />
                                       </div>
                                       <span className="text-xs font-bold text-slate-700">{dispute.respondentName}</span>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    {getStatusBadge(dispute.status)}
                                 </TableCell>
                                 <TableCell>
                                    <p className="text-sm font-black text-slate-900">${formatClaimValue(dispute.claimValue)}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{dispute.currency}</p>
                                 </TableCell>
                                 <TableCell className="pr-8 text-right">
                                    <Button variant="ghost" size="icon" className="text-slate-300 hover:text-rose-600 h-8 w-8 group-hover:bg-rose-50 rounded-xl transition-all">
                                       <ArrowRight className="w-4 h-4" />
                                    </Button>
                                 </TableCell>
                              </TableRow>
                           ))
                        )}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </div>

         <div className="space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-slate-900 text-white p-4 overflow-hidden relative">
               <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                     <Scale className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-tight">How Arbitration works</h3>
               </div>
               
               <div className="space-y-2 mb-4">
                  <p className="text-[9px] font-black uppercase text-slate-400">Workflow статусов</p>
                  <div className="flex flex-wrap gap-1">
                    {['Черновик', 'Подано', 'На проверке', 'Медиация', 'Решено'].map((s, i) => (
                      <span key={s} className="text-[8px] font-bold px-2 py-1 rounded bg-white/5 text-white/80">{s}</span>
                    ))}
                  </div>
               </div>
               <div className="space-y-4">
                  {[
                    'Smart Escrow: Средства заморожены до решения арбитража.',
                    'AI Analysis: Synth-1 автоматически оценивает доказательства.',
                    'Final Decision: Решение выносится в течение 72 часов.'
                  ].map((text, i) => (
                    <div key={i} className="flex gap-3">
                       <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                       <p className="text-xs text-white/70 leading-relaxed font-medium">{text}</p>
                    </div>
                  ))}
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full translate-x-16 -translate-y-16 blur-2xl" />
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl p-4 bg-white border border-slate-50">
               <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-6">Dispute Statistics</h3>
               <div className="space-y-6">
                  {[
                    { label: 'Win Rate', value: '88%', color: 'text-emerald-500' },
                    { label: 'Total Recovered', value: '$42,500', color: 'text-slate-900' },
                    { label: 'Avg Claim Time', value: '5 дней', color: 'text-indigo-600' }
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-end border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                       <span className="text-[10px] font-black uppercase text-slate-400">{stat.label}</span>
                       <span className={cn("text-base font-black", stat.color)}>{stat.value}</span>
                    </div>
                  ))}
               </div>
            </Card>
         </div>
      </div>

      <RelatedModulesBlock links={getArbitrationLinks()} className="mt-6" />
    </div>
  );
}
