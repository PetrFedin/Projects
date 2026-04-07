'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, QrCode, ShieldCheck, AlertCircle, Download, Send, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EDODocument, ChestnyZNAKCode } from '@/lib/types/compliance';

/**
 * Compliance Dashboard UI (Russian Layer)
 * Управление маркировкой Честный ЗНАК и ЭДО (УПД/УКД).
 */

export default function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState('edo');

  // Mock Data
  const edoDocs: EDODocument[] = [
    {
      id: 'doc-101',
      type: 'UPD',
      number: 'УПД-445/25',
      date: '2025-03-05',
      senderId: 'brand-ltd-1',
      receiverId: 'retail-store-2',
      totalAmount: 450000,
      vatAmount: 75000,
      currency: 'RUB',
      status: 'signed',
      xmlUrl: '#',
      items: [],
      operator: 'diadoc'
    },
    {
      id: 'doc-102',
      type: 'UPD',
      number: 'УПД-446/25',
      date: '2025-03-07',
      senderId: 'brand-ltd-1',
      receiverId: 'warehouse-global',
      totalAmount: 1200000,
      vatAmount: 200000,
      currency: 'RUB',
      status: 'sent',
      xmlUrl: '#',
      items: [],
      operator: 'diadoc'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-4 space-y-4 max-w-5xl animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <span>Admin</span>
            <ChevronRight className="h-2 w-2" />
            <span className="text-slate-300">Regulatory Compliance</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold font-headline tracking-tighter uppercase text-slate-900 leading-none">Security & Legal Hub 2.0</h1>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 font-bold text-[7px] px-1.5 h-4 gap-1 tracking-widest shadow-sm transition-all uppercase">
               <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" /> EDO STATUS: SYNCED
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" className="h-8 px-3 rounded-lg border-slate-200 text-[9px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Download className="mr-1.5 h-3.5 w-3.5 text-slate-400" /> CRPT Manifest
           </Button>
           <Button className="h-8 px-4 rounded-lg bg-slate-900 text-white text-[9px] font-bold uppercase gap-1.5 hover:bg-indigo-600 transition-all shadow-lg border border-slate-900 tracking-widest">
              <ShieldCheck className="h-3.5 w-3.5" /> Identity Verify
           </Button>
        </div>
      </div>

      <Tabs defaultValue="edo" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner w-full max-w-[320px] mb-4">
          <TabsTrigger value="edo" className="rounded-lg px-4 h-7 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm data-[state=active]:border border-transparent flex-1">
            <FileText className="h-3 w-3 mr-2" /> EDO Module
          </TabsTrigger>
          <TabsTrigger value="cz" className="rounded-lg px-4 h-7 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm data-[state=active]:border border-transparent flex-1">
            <QrCode className="h-3 w-3 mr-2" /> Chestny ZNAK
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edo" className="space-y-4 pt-0">
          <Card className="border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm hover:border-indigo-100/50 transition-all">
            <div className="p-4 border-b border-slate-50 bg-slate-50/50">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 leading-none">Document Ledger (Diadoc)</h3>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60">Legal Entity Verification & Transmission Pipeline</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                  <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10 px-4">Entity Type</TableHead>
                  <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">Reference & Date</TableHead>
                  <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">Counterparty</TableHead>
                  <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">Magnitude (VAT Incl.)</TableHead>
                  <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10 text-center">Status</TableHead>
                  <TableHead className="text-right text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10 px-4 w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-50">
                {edoDocs.map(doc => (
                  <TableRow key={doc.id} className="hover:bg-slate-50/50 transition-all group h-12">
                    <TableCell className="px-4 font-bold text-[10px] uppercase text-indigo-600">{doc.type}</TableCell>
                    <TableCell>
                       <div className="flex flex-col">
                         <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{doc.number}</span>
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">{doc.date}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{doc.receiverId}</TableCell>
                    <TableCell className="text-[11px] font-bold text-slate-900 tabular-nums italic tracking-tighter">{doc.totalAmount.toLocaleString()} ₽</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={cn("text-[7px] font-bold px-1.5 h-3.5 rounded shadow-sm uppercase tracking-widest border transition-all", doc.status === 'signed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100')}>
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-4">
                       <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-slate-900 hover:text-white transition-all text-slate-400"><Download className="h-3.5 w-3.5" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-indigo-600 hover:text-white transition-all text-indigo-500"><Send className="h-3.5 w-3.5" /></Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="cz" className="space-y-4 pt-0">
           <div className="grid md:grid-cols-3 gap-3">
              {[
                { label: "KIZ Inventory (Marking)", val: "12,450", sub: "Available via CRPT", color: "text-indigo-600", bg: "bg-indigo-50/50" },
                { label: "Operational Circulation", val: "8,920", sub: "Active nodes", color: "text-slate-900", bg: "bg-slate-50/50" },
                { label: "MTK Exceptions", val: "24", sub: "Attention required", color: "text-rose-600", bg: "bg-rose-50/50" },
              ].map((m, i) => (
                <Card key={i} className="border border-slate-100 shadow-sm bg-white p-4 group hover:border-indigo-100 transition-all rounded-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none">{m.label}</span>
                    {m.color === 'text-rose-600' && <AlertCircle className="h-3 w-3 text-rose-500 animate-pulse" />}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={cn("text-sm font-bold tracking-tighter tabular-nums uppercase leading-none", m.color)}>{m.val}</span>
                  </div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2 opacity-60">{m.sub}</p>
                </Card>
              ))}
           </div>

           <Card className="border border-slate-100 rounded-xl bg-white overflow-hidden shadow-sm hover:border-indigo-100/50 transition-all">
              <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 leading-none">Serial Protocol (KIZ Orders)</h3>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60">Production Unit Tracking & GS1 Alignment</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10 px-4">Sequence ID</TableHead>
                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">Entity / GTIN</TableHead>
                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10 text-right">Volume</TableHead>
                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10">Timeline</TableHead>
                    <TableHead className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10 text-center">CRPT Status</TableHead>
                    <TableHead className="text-right text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] h-10 px-4 w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-50">
                  <TableRow className="hover:bg-slate-50/50 transition-all group h-12">
                    <TableCell className="px-4 font-mono text-[9px] font-bold text-slate-400">ORD-MARK-99821</TableCell>
                    <TableCell>
                       <div className="flex flex-col">
                         <span className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">Cotton T-Shirt Black</span>
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">GTIN: 4607123456789</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-right"><span className="text-[11px] font-bold text-slate-900 tabular-nums">500</span></TableCell>
                    <TableCell><span className="text-[10px] font-bold text-slate-400 uppercase tabular-nums">2025-03-01</span></TableCell>
                    <TableCell className="text-center">
                       <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[7px] font-bold px-1.5 h-3.5 rounded shadow-sm tracking-widest uppercase">Ready</Badge>
                    </TableCell>
                    <TableCell className="text-right px-4">
                       <Button size="sm" variant="ghost" className="h-7 px-3 rounded-lg font-bold uppercase text-[8px] bg-slate-50 border border-slate-100 text-slate-500 hover:text-indigo-600 hover:bg-white transition-all shadow-inner tracking-widest group-hover:bg-white">
                          <Download className="mr-1.5 h-3 w-3" /> Manifest PDF
                       </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
