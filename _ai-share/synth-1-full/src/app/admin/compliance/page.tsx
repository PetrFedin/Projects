'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Download,
  Send,
  ChevronRight,
} from 'lucide-react';
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
      operator: 'diadoc',
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
      operator: 'diadoc',
    },
  ];

  return (
    <div className="container mx-auto max-w-5xl space-y-4 px-4 py-4 pb-24 duration-700 animate-in fade-in">
      <div className="flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-3 md:flex-row md:items-end">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <span>Admin</span>
            <ChevronRight className="h-2 w-2" />
            <span className="text-slate-300">Regulatory Compliance</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-headline text-base font-bold uppercase leading-none tracking-tighter text-slate-900">
              Security & Legal Hub 2.0
            </h1>
            <Badge
              variant="outline"
              className="h-4 gap-1 border-indigo-100 bg-indigo-50 px-1.5 text-[7px] font-bold uppercase tracking-widest text-indigo-600 shadow-sm transition-all"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-500" /> EDO STATUS:
              SYNCED
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 rounded-lg border-slate-200 px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all hover:bg-slate-50"
          >
            <Download className="mr-1.5 h-3.5 w-3.5 text-slate-400" /> CRPT Manifest
          </Button>
          <Button className="h-8 gap-1.5 rounded-lg border border-slate-900 bg-slate-900 px-4 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-indigo-600">
            <ShieldCheck className="h-3.5 w-3.5" /> Identity Verify
          </Button>
        </div>
      </div>

      <Tabs defaultValue="edo" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full max-w-[320px] rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
          <TabsTrigger
            value="edo"
            className="h-7 flex-1 rounded-lg border-transparent px-4 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:border data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
          >
            <FileText className="mr-2 h-3 w-3" /> EDO Module
          </TabsTrigger>
          <TabsTrigger
            value="cz"
            className="h-7 flex-1 rounded-lg border-transparent px-4 text-[9px] font-bold uppercase tracking-widest transition-all data-[state=active]:border data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
          >
            <QrCode className="mr-2 h-3 w-3" /> Chestny ZNAK
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edo" className="space-y-4 pt-0">
          <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100/50">
            <div className="border-b border-slate-50 bg-slate-50/50 p-4">
              <h3 className="text-[10px] font-bold uppercase leading-none tracking-widest text-slate-900">
                Document Ledger (Diadoc)
              </h3>
              <p className="mt-1 text-[8px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
                Legal Entity Verification & Transmission Pipeline
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="h-10 px-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Entity Type
                  </TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Reference & Date
                  </TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Counterparty
                  </TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Magnitude (VAT Incl.)
                  </TableHead>
                  <TableHead className="h-10 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Status
                  </TableHead>
                  <TableHead className="h-10 w-24 px-4 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-50">
                {edoDocs.map((doc) => (
                  <TableRow key={doc.id} className="group h-12 transition-all hover:bg-slate-50/50">
                    <TableCell className="px-4 text-[10px] font-bold uppercase text-indigo-600">
                      {doc.type}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold uppercase tracking-tight text-slate-900">
                          {doc.number}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
                          {doc.date}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[10px] font-bold uppercase tracking-tight text-slate-600">
                      {doc.receiverId}
                    </TableCell>
                    <TableCell className="text-[11px] font-bold italic tabular-nums tracking-tighter text-slate-900">
                      {doc.totalAmount.toLocaleString()} ₽
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          'h-3.5 rounded border px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm transition-all',
                          doc.status === 'signed'
                            ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                            : 'border-blue-100 bg-blue-50 text-blue-600'
                        )}
                      >
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 transition-all group-hover:opacity-100">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-lg text-slate-400 transition-all hover:bg-slate-900 hover:text-white"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-lg text-indigo-500 transition-all hover:bg-indigo-600 hover:text-white"
                        >
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="cz" className="space-y-4 pt-0">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              {
                label: 'KIZ Inventory (Marking)',
                val: '12,450',
                sub: 'Available via CRPT',
                color: 'text-indigo-600',
                bg: 'bg-indigo-50/50',
              },
              {
                label: 'Operational Circulation',
                val: '8,920',
                sub: 'Active nodes',
                color: 'text-slate-900',
                bg: 'bg-slate-50/50',
              },
              {
                label: 'MTK Exceptions',
                val: '24',
                sub: 'Attention required',
                color: 'text-rose-600',
                bg: 'bg-rose-50/50',
              },
            ].map((m, i) => (
              <Card
                key={i}
                className="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-100"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase leading-none tracking-[0.15em] text-slate-400">
                    {m.label}
                  </span>
                  {m.color === 'text-rose-600' && (
                    <AlertCircle className="h-3 w-3 animate-pulse text-rose-500" />
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={cn(
                      'text-sm font-bold uppercase tabular-nums leading-none tracking-tighter',
                      m.color
                    )}
                  >
                    {m.val}
                  </span>
                </div>
                <p className="mt-2 text-[8px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
                  {m.sub}
                </p>
              </Card>
            ))}
          </div>

          <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100/50">
            <div className="border-b border-slate-50 bg-slate-50/50 p-4">
              <h3 className="text-[10px] font-bold uppercase leading-none tracking-widest text-slate-900">
                Serial Protocol (KIZ Orders)
              </h3>
              <p className="mt-1 text-[8px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
                Production Unit Tracking & GS1 Alignment
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="h-10 px-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Sequence ID
                  </TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Entity / GTIN
                  </TableHead>
                  <TableHead className="h-10 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Volume
                  </TableHead>
                  <TableHead className="h-10 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Timeline
                  </TableHead>
                  <TableHead className="h-10 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    CRPT Status
                  </TableHead>
                  <TableHead className="h-10 w-24 px-4 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-50">
                <TableRow className="group h-12 transition-all hover:bg-slate-50/50">
                  <TableCell className="px-4 font-mono text-[9px] font-bold text-slate-400">
                    ORD-MARK-99821
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold uppercase tracking-tight text-slate-900">
                        Cotton T-Shirt Black
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 opacity-60">
                        GTIN: 4607123456789
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-[11px] font-bold tabular-nums text-slate-900">500</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-bold uppercase tabular-nums text-slate-400">
                      2025-03-01
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className="h-3.5 rounded border-emerald-100 bg-emerald-50 px-1.5 text-[7px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm"
                    >
                      Ready
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 rounded-lg border border-slate-100 bg-slate-50 px-3 text-[8px] font-bold uppercase tracking-widest text-slate-500 shadow-inner transition-all hover:bg-white hover:text-indigo-600 group-hover:bg-white"
                    >
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
