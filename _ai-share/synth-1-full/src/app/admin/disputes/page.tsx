'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ShieldAlert, 
  MessageSquare, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  History, 
  Plus, 
  Search, 
  Info, 
  ChevronRight, 
  UserCircle, 
  Building2, 
  Filter, 
  ArrowRight,
  Zap,
  BrainCircuit,
  Scale,
  DollarSign,
  Clock,
  MoreVertical,
  ExternalLink,
  MessageCircle,
  Gavel,
  Lock,
  Flag
} from 'lucide-react';
import { Dispute, DisputeStatus, DisputeCategory, DisputeSeverity } from '@/lib/types/disputes';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

/**
 * Dispute Resolution Hub — Admin OS (Arbitration)
 * Цифровой арбитраж для B2B-споров (брак, недовоз, задержка).
 */

export default function AdminDisputesPage() {
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
    },
    {
      id: 'DISP-2',
      caseNumber: 'SYNTH-9122',
      title: 'Missing 50 Units of Wool Oversized Coats',
      category: 'shortage',
      status: 'mediation',
      severity: 'medium',
      claimantId: 'retailer-berlin-store',
      claimantName: 'Berlin Flagship Store',
      respondentId: 'brand-nordic-wool',
      respondentName: 'Nordic Wool Brand',
      claimValue: 4500,
      currency: 'EUR',
      description: 'The shipment arrived with 50 units missing according to the packing list.',
      evidence: [],
      messages: [],
      createdAt: '2026-03-04T09:00:00Z',
      updatedAt: '2026-03-07T11:20:00Z'
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

  const getSeverityBadge = (severity: DisputeSeverity) => {
    const config: Record<DisputeSeverity, { label: string, color: string }> = {
      'low': { label: 'Low', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
      'medium': { label: 'Medium', color: 'bg-amber-50 text-amber-600 border-amber-100' },
      'high': { label: 'High', color: 'bg-rose-50 text-rose-600 border-rose-100' },
      'critical': { label: 'Critical', color: 'bg-rose-600 text-white border-none' }
    };
    const item = config[severity];
    return <Badge variant="outline" className={cn("text-[8px] font-black uppercase px-2 h-5", item.color)}>{item.label}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-4 space-y-6 max-w-5xl animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <Gavel className="w-2.5 h-2.5" />
            <span>Synth-1 Arbitration Center</span>
          </div>
          <h1 className="text-sm font-black tracking-tighter uppercase text-slate-900 leading-none">Dispute Resolution Hub</h1>
          <p className="text-[11px] text-slate-500 font-medium px-0.5">Global B2B arbitration & quality control system.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
           <Button variant="ghost" size="sm" className="h-7 px-3 bg-white text-slate-600 rounded-lg font-bold uppercase text-[9px] tracking-widest shadow-sm border border-slate-200 transition-all hover:text-indigo-600">
              <Filter className="w-3 h-3 mr-1.5" /> Filter
           </Button>
           <Button className="h-7 px-4 rounded-lg font-bold uppercase text-[9px] tracking-widest bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-all">
              <Zap className="w-3 h-3 mr-1.5" /> AI Scan
           </Button>
        </div>
      </header>

      {/* KPI Stats — Normalized & Compact */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
         {[
           { label: 'Active Disputes', value: activeDisputes.length, icon: ShieldAlert, color: 'text-slate-900', bg: 'bg-slate-50/50' },
           { label: 'Total Claim Value', value: '$17,000', icon: DollarSign, color: 'text-rose-600', bg: 'bg-rose-50/50' },
           { label: 'Under Mediation', value: '1', icon: MessageCircle, color: 'text-indigo-600', bg: 'bg-indigo-50/50' },
           { label: 'Avg Resolution', value: '4.2 Days', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50/50' }
         ].map((stat, i) => (
           <Card key={i} className="border border-slate-100 shadow-sm bg-white p-3.5 group hover:border-indigo-100 transition-all rounded-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-2.5">
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none">{stat.label}</span>
                 <div className={cn("p-1.5 rounded-lg shadow-inner border border-slate-200/50", stat.bg)}>
                    <stat.icon className={cn("h-3.5 w-3.5 transition-colors", stat.color)} />
                 </div>
              </div>
              <p className={cn("text-sm font-black tracking-tighter tabular-nums leading-none", stat.color)}>{stat.value}</p>
           </Card>
         ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-3">
         <div className="lg:col-span-8 space-y-4">
            <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
               <CardHeader className="p-3 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/30">
                  <div className="space-y-0.5">
                    <CardTitle className="text-sm font-black uppercase tracking-tight">Active Cases</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Arbitration Management Queue</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    <Input placeholder="Search Case #..." className="pl-9 h-8 rounded-lg border-slate-200 text-[10px] font-bold uppercase w-48 bg-white" />
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <Table>
                     <TableHeader className="bg-white">
                        <TableRow className="hover:bg-transparent border-b border-slate-50">
                           <TableHead className="pl-6 text-[9px] font-black uppercase tracking-wider h-10">Case Info</TableHead>
                           <TableHead className="text-[9px] font-black uppercase tracking-wider h-10">Parties</TableHead>
                           <TableHead className="text-[9px] font-black uppercase tracking-wider h-10">Status & Severity</TableHead>
                           <TableHead className="text-[9px] font-black uppercase tracking-wider h-10">Claim Value</TableHead>
                           <TableHead className="pr-6 text-right text-[9px] font-black uppercase tracking-wider h-10">Action</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {activeDisputes.map(dispute => (
                           <TableRow key={dispute.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer group border-b border-slate-50 last:border-0">
                              <TableCell className="pl-6 py-4">
                                 <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                       <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-100 uppercase tracking-tighter">{dispute.caseNumber}</span>
                                       <span className="text-[11px] font-black text-slate-900 truncate max-w-[150px] uppercase">{dispute.title}</span>
                                    </div>
                                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest opacity-70">{dispute.category.replace('_', ' ')}</p>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                       <div className="h-5 w-5 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                                          <Building2 className="w-2.5 h-2.5 text-emerald-600" />
                                       </div>
                                       <span className="text-[10px] font-bold text-slate-700 truncate max-w-[100px] uppercase">{dispute.claimantName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <div className="h-5 w-5 rounded-md bg-rose-50 border border-rose-100 flex items-center justify-center">
                                          <Building2 className="w-2.5 h-2.5 text-rose-600" />
                                       </div>
                                       <span className="text-[10px] font-bold text-slate-700 truncate max-w-[100px] uppercase">{dispute.respondentName}</span>
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="space-y-1.5">
                                    {getStatusBadge(dispute.status)}
                                    <div className="block">{getSeverityBadge(dispute.severity)}</div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <p className="text-xs font-black text-slate-900 tabular-nums">${dispute.claimValue?.toLocaleString()}</p>
                                 <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{dispute.currency}</p>
                              </TableCell>
                              <TableCell className="pr-6 text-right">
                                 <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all rounded-lg">
                                    <ArrowRight className="w-3.5 h-3.5" />
                                 </Button>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </div>

         <div className="lg:col-span-4 space-y-4">
            <Card className="border border-slate-800 shadow-lg rounded-2xl bg-slate-900 text-white p-3 group transition-all hover:border-indigo-500/30">
               <div className="flex items-center gap-3 mb-5 px-1">
                  <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-105 transition-transform">
                     <BrainCircuit className="w-4.5 h-4.5 text-indigo-400" />
                  </div>
                  <div>
                     <h3 className="text-xs font-black uppercase tracking-tight text-white">AI Arbiter Insights</h3>
                     <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Predictive Resolution</p>
                  </div>
               </div>
               
               <div className="space-y-5 px-1">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2.5 shadow-inner">
                     <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black uppercase text-white/60 tracking-widest">Prob: Claimant Win</span>
                        <span className="text-xs font-black text-indigo-400 tabular-nums">72%</span>
                     </div>
                     <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: '72%' }} />
                     </div>
                     <p className="text-[9px] text-white/30 leading-relaxed italic border-t border-white/5 pt-3 mt-1">
                        "Based on historical data for Batch Quality disputes, claimant win probability is correlated with evidence density."
                     </p>
                  </div>
                  
                  <div className="space-y-2 px-1">
                     <div className="flex items-center gap-2 text-emerald-400">
                        <Scale className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Suggested Action</span>
                     </div>
                     <p className="text-[10px] text-white/60 leading-relaxed font-medium">
                        Initiate Mediation stage. Respondent failed to provide production logs within the 48h protocol window.
                     </p>
                  </div>
               </div>
               <Button size="sm" className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white border-none rounded-lg font-black uppercase text-[9px] h-9 transition-all shadow-md tracking-widest">
                  Open Case Analysis
               </Button>
            </Card>

            <Card className="border border-slate-100 shadow-sm rounded-2xl p-3 bg-white space-y-5 group hover:border-indigo-100 transition-all">
               <h3 className="text-xs font-black uppercase tracking-tight text-slate-900 px-1">Arbitrator Controls</h3>
               <div className="space-y-2 px-1">
                  <Button variant="outline" size="sm" className="w-full h-9 rounded-lg border-slate-200 text-[9px] font-black uppercase gap-3 justify-start px-4 hover:bg-slate-50 transition-all group/btn">
                     <Flag className="w-3.5 h-3.5 text-rose-500 group-hover/btn:scale-110 transition-transform" /> Mark as Critical
                  </Button>
                  <Button variant="outline" size="sm" className="w-full h-9 rounded-lg border-slate-200 text-[9px] font-black uppercase gap-3 justify-start px-4 hover:bg-slate-50 transition-all group/btn">
                     <Scale className="w-3.5 h-3.5 text-indigo-500 group-hover/btn:scale-110 transition-transform" /> Assign Mediator
                  </Button>
                  <Button variant="outline" size="sm" className="w-full h-9 rounded-lg border-slate-200 text-[9px] font-black uppercase gap-3 justify-start px-4 hover:bg-slate-50 transition-all group/btn">
                     <History className="w-3.5 h-3.5 text-slate-400 group-hover/btn:scale-110 transition-transform" /> View Precedents
                  </Button>
               </div>
               <div className="mt-4 pt-4 border-t border-slate-100 px-1">
                  <div className="flex items-center gap-2 text-rose-500 px-1">
                     <AlertTriangle className="w-3 h-3" />
                     <span className="text-[9px] font-black uppercase tracking-widest">Unassigned Cases: 4</span>
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
