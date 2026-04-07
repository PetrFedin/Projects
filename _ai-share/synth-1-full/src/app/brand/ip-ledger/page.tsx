'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  FileText, 
  Search, 
  Filter, 
  ArrowRight, 
  ExternalLink, 
  Cpu, 
  Fingerprint, 
  History, 
  Share2, 
  Plus, 
  Globe, 
  Activity, 
  AlertCircle,
  Hash,
  Box,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { IPRecord } from '@/lib/types/intellectual-property';
import { MOCK_IP_RECORDS, getIPStatusColor } from '@/lib/logic/blockchain-utils';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

/**
 * Blockchain IP Ledger — Brand OS
 * Реестр интеллектуальной собственности на блокчейне.
 */

export default function IPLedgerPage() {
  const [records, setRecords] = useState<IPRecord[]>(MOCK_IP_RECORDS);
  const [search, setSearch] = useState('');

  const filteredRecords = records.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            <ShieldCheck className="w-3.5 h-3.5" />
            Brand Asset Protection
          </div>
          <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase">IP Blockchain Ledger</h1>
          <p className="text-[13px] text-slate-500 font-medium">Защита авторских прав на дизайны и технологии через неизменяемый реестр.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
           <Button variant="ghost" className="gap-2 rounded-lg h-8 px-4 font-bold uppercase text-[10px] text-slate-500 hover:bg-white hover:text-indigo-600 transition-all">
              <History className="w-3.5 h-3.5" /> History
           </Button>
           <Button className="gap-2 rounded-lg h-8 px-4 font-bold uppercase text-[10px] bg-slate-900 text-white shadow-md hover:bg-indigo-600 transition-all">
              <Plus className="w-3.5 h-3.5" /> Register IP
           </Button>
        </div>
      </header>

      {/* Trust & Network Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
         {[
           { label: 'Assets', value: records.length, icon: Database },
           { label: 'Blockchain', value: 'Live', sub: 'Ethereum', icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-50' },
           { label: 'Disputes', value: '0', icon: AlertCircle, color: 'text-slate-400', bg: 'bg-slate-50' },
           { label: 'Verification', value: '100%', icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
         ].map((stat, i) => (
           <Card key={i} className="border border-slate-100 shadow-sm bg-white rounded-xl p-4 group hover:border-indigo-200 transition-all">
              <div className="flex items-center justify-between mb-3">
                 <div className={cn("p-2 rounded-lg shadow-sm border border-slate-50", stat.bg || "bg-slate-50")}><stat.icon className={cn("w-4 h-4", stat.color || "text-slate-400")} /></div>
                 {stat.sub && <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">{stat.sub}</span>}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{stat.label}</p>
              <p className={cn("text-base font-bold tracking-tight", stat.color || "text-slate-900")}>{stat.value}</p>
           </Card>
         ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-3">
         <div className="lg:col-span-8 space-y-6">
            <Card className="border border-slate-100 shadow-sm rounded-xl overflow-hidden bg-white">
               <CardHeader className="p-4 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/30">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700">IP Asset Registry</CardTitle>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input 
                      placeholder="Search assets..." 
                      className="pl-9 h-8 rounded-lg border-slate-200 text-[11px] w-48 bg-white focus:ring-1 focus:ring-indigo-500 shadow-sm"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <Table>
                     <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-none hover:bg-transparent h-10">
                           <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">Asset / ID</TableHead>
                           <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</TableHead>
                           <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Blockchain Hash</TableHead>
                           <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                           <TableHead className="pr-6 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Actions</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {filteredRecords.map(record => (
                           <TableRow key={record.id} className="hover:bg-slate-50/50 transition-colors group h-12">
                              <TableCell className="pl-6">
                                 <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100 group-hover:scale-105 transition-transform shadow-sm">
                                       <Fingerprint className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                    </div>
                                    <div>
                                       <p className="text-[12px] font-bold text-slate-900 leading-tight">{record.title}</p>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{record.id}</p>
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <Badge variant="outline" className="text-[9px] font-bold uppercase border-slate-200 bg-slate-50 text-slate-500 px-2 h-5">
                                    {record.type.replace('_', ' ')}
                                 </Badge>
                              </TableCell>
                              <TableCell>
                                 <div className="flex items-center gap-2 group/hash cursor-pointer">
                                    <code className="text-[10px] font-mono text-slate-400 truncate w-20 block">{record.hash}</code>
                                    <ExternalLink className="w-3 h-3 text-slate-300 opacity-0 group-hover/hash:opacity-100 transition-opacity" />
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <Badge variant="outline" className={cn("text-[9px] font-bold uppercase px-2 h-5 shadow-sm border-none", getIPStatusColor(record.status))}>
                                    {record.status}
                                 </Badge>
                              </TableCell>
                              <TableCell className="pr-6 text-right">
                                 <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 shadow-sm transition-all">
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

         <div className="lg:col-span-4 space-y-6">
            <Card className="border border-indigo-500 shadow-xl rounded-xl bg-indigo-900 text-white p-4 relative overflow-hidden group">
               <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Lock className="w-40 h-40 text-indigo-400" />
               </div>
               <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner group-hover:bg-white group-hover:text-indigo-600 transition-all duration-300">
                     <Hash className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-tight leading-none">Secure Mining</h3>
               </div>
               <div className="space-y-4 relative z-10 mb-8">
                  <p className="text-[13px] text-indigo-100 font-medium leading-relaxed">
                     Synth-1 использует гибридный метод фиксации IP. Каждый техпакет может быть «замайнен» в блокчейн одним кликом. 
                  </p>
                  <p className="text-[11px] text-white/40 leading-relaxed font-medium">
                     Это создает юридический прецедент владения дизайном для арбитражных споров.
                  </p>
               </div>
               <Button className="w-full h-10 rounded-lg bg-white text-indigo-900 font-bold uppercase tracking-widest text-[10px] hover:bg-indigo-50 transition-all shadow-lg relative z-10">
                  Run Global IP Scan
               </Button>
            </Card>

            <Card className="border border-slate-100 shadow-sm rounded-xl p-4 bg-white space-y-6">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm">
                    <Activity className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Network Intelligence</h3>
               </div>
               
               <div className="space-y-4">
                  {[
                    { label: 'Similar Designs', value: '2', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Registry Sync', value: 'Active', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Token Staking', value: 'Inactive', icon: Database, color: 'text-slate-300', bg: 'bg-slate-50' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50/50 border border-slate-100">
                       <div className="flex items-center gap-3">
                          <item.icon className={cn("w-4 h-4", item.color)} />
                          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{item.label}</span>
                       </div>
                       <span className={cn("text-[10px] font-bold uppercase", item.color)}>{item.value}</span>
                    </div>
                  ))}
               </div>
               <div className="pt-2 border-t border-slate-100">
                  <Button variant="ghost" className="w-full h-9 text-[10px] font-bold uppercase text-indigo-600 hover:bg-indigo-50 rounded-lg tracking-wider">
                     Open Legal Export
                  </Button>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
