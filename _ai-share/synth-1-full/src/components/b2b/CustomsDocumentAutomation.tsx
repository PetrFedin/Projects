'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileCheck,
  Globe,
  ShieldAlert,
  Download,
  Printer,
  Gavel,
  ClipboardCheck,
  Zap,
  Info,
  ArrowRight,
  PackageCheck,
  Lock,
  Search,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';

export function CustomsDocumentAutomation() {
  const [activeRegion, setActiveRegion] = useState<'EU' | 'UAE' | 'CIS'>('CIS');

  const documents = [
    { id: 'exp-1', title: 'Export Declaration (EX-1)', status: 'Ready', type: 'Customs' },
    { id: 'inv-1', title: 'Commercial Invoice (HS Coded)', status: 'Verified', type: 'Finance' },
    {
      id: 'coo-1',
      title: 'Certificate of Origin (Form A)',
      status: 'Pending Signature',
      type: 'Legal',
    },
  ];

  return (
    <div className="min-h-screen space-y-4 bg-white p-3">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600">
=======
            <div className="bg-accent-primary flex h-8 w-8 items-center justify-center rounded-xl">
>>>>>>> recover/cabinet-wip-from-stash
              <Gavel className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
<<<<<<< HEAD
              className="border-indigo-100 text-[9px] font-black uppercase tracking-widest text-indigo-600"
=======
              className="border-accent-primary/20 text-accent-primary text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
            >
              Customs_Gateway_v1.0
            </Badge>
          </div>
<<<<<<< HEAD
          <h2 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900 md:text-sm">
            Global Compliance
          </h2>
          <p className="max-w-md text-left text-xs font-medium text-slate-400">
=======
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
            Global Compliance
          </h2>
          <p className="text-text-muted max-w-md text-left text-xs font-medium">
>>>>>>> recover/cabinet-wip-from-stash
            Automated HS-code mapping and customs documentation engine for seamless cross-border
            distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
<<<<<<< HEAD
          <div className="flex items-center gap-1.5 rounded-2xl border border-slate-100 bg-slate-50 p-1">
=======
          <div className="bg-bg-surface2 border-border-subtle flex items-center gap-1.5 rounded-2xl border p-1">
>>>>>>> recover/cabinet-wip-from-stash
            {['CIS', 'UAE', 'EU'].map((reg) => (
              <Button
                key={reg}
                onClick={() => setActiveRegion(reg as any)}
                className={cn(
                  'h-10 rounded-xl px-5 text-[9px] font-black uppercase tracking-widest transition-all',
                  activeRegion === reg
<<<<<<< HEAD
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'bg-transparent text-slate-400 hover:text-slate-600'
=======
                    ? 'text-text-primary bg-white shadow-sm'
                    : 'text-text-muted hover:text-text-secondary bg-transparent'
>>>>>>> recover/cabinet-wip-from-stash
                )}
              >
                {reg} Region
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Active Document Queue */}
        <div className="space-y-6 lg:col-span-8">
          <div className="flex items-center justify-between px-2">
<<<<<<< HEAD
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
              Document Generation Queue
            </h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search Order ID..."
                className="h-10 rounded-xl border-slate-100 bg-slate-50 pl-9 text-[10px] font-bold uppercase"
=======
            <h3 className="text-text-muted text-sm font-black uppercase tracking-widest">
              Document Generation Queue
            </h3>
            <div className="relative w-64">
              <Search className="text-text-muted absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
              <Input
                placeholder="Search Order ID..."
                className="border-border-subtle bg-bg-surface2 h-10 rounded-xl pl-9 text-[10px] font-bold uppercase"
>>>>>>> recover/cabinet-wip-from-stash
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {documents.map((doc) => (
              <Card
                key={doc.id}
<<<<<<< HEAD
                className="group overflow-hidden rounded-xl border-none bg-slate-50/50 shadow-xl shadow-slate-200/50 transition-all hover:bg-white"
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm">
                      <FileCheck className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-black uppercase tracking-tight text-slate-900">
=======
                className="bg-bg-surface2/80 group overflow-hidden rounded-xl border-none shadow-md shadow-xl transition-all hover:bg-white"
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="border-border-subtle flex h-12 w-12 items-center justify-center rounded-2xl border bg-white shadow-sm">
                      <FileCheck className="text-accent-primary h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-text-primary text-base font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-3">
                        <Badge className="border-none bg-emerald-100 px-2 py-0.5 text-[8px] font-black uppercase text-emerald-600">
                          {doc.status}
                        </Badge>
<<<<<<< HEAD
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
                        <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                          {doc.type} Category
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="outline"
                      size="icon"
<<<<<<< HEAD
                      className="h-12 w-12 rounded-xl border-slate-200 bg-white"
                    >
                      <Printer className="h-5 w-5 text-slate-400" />
                    </Button>
                    <Button className="h-12 gap-2 rounded-xl bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-slate-200">
=======
                      className="border-border-default h-12 w-12 rounded-xl bg-white"
                    >
                      <Printer className="text-text-muted h-5 w-5" />
                    </Button>
                    <Button className="bg-text-primary h-12 gap-2 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
                      Download PDF <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Customs Intelligence Sidebar */}
        <div className="space-y-4 lg:col-span-4">
<<<<<<< HEAD
          <Card className="relative space-y-4 overflow-hidden rounded-xl border-none bg-indigo-600 p-3 text-white shadow-2xl shadow-slate-200/50">
=======
          <Card className="bg-accent-primary relative space-y-4 overflow-hidden rounded-xl border-none p-3 text-white shadow-2xl shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="absolute right-0 top-0 p-4 opacity-10">
              <Globe className="h-32 w-32" />
            </div>

            <div className="relative z-10 space-y-6 text-left">
              <h3 className="text-sm font-black uppercase tracking-tight">Tariff Engine</h3>
              <div className="space-y-4">
                <div className="space-y-2 rounded-2xl border border-white/10 bg-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase">HS Code Accuracy</span>
                    <span className="text-xs font-black text-emerald-400">99.4%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '99.4%' }}
                      className="h-full bg-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
<<<<<<< HEAD
                    <p className="mb-1 text-[8px] font-black uppercase text-indigo-200">
=======
                    <p className="text-accent-primary/40 mb-1 text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                      Avg. Duty Saved
                    </p>
                    <p className="text-sm font-black">4.2%</p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
<<<<<<< HEAD
                    <p className="mb-1 text-[8px] font-black uppercase text-indigo-200">
=======
                    <p className="text-accent-primary/40 mb-1 text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                      Audit Score
                    </p>
                    <p className="text-sm font-black">AAA</p>
                  </div>
                </div>
              </div>
<<<<<<< HEAD
              <Button className="h-10 w-full gap-2 rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl">
=======
              <Button className="text-text-primary h-10 w-full gap-2 rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
                Manual HS Mapping <Zap className="h-4 w-4" />
              </Button>
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-slate-200/50">
=======
          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
                <ShieldAlert className="h-5 w-5 text-rose-600" />
              </div>
<<<<<<< HEAD
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">
=======
              <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                Regulatory Alerts
              </h4>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
                <p className="mb-1 text-[10px] font-black uppercase text-rose-900">
                  New EU VAT Directive
                </p>
                <p className="text-[9px] font-medium leading-relaxed text-rose-600">
                  Updated regulations for textile exports to France starting March 1st. Automation
                  logic updated.
                </p>
              </div>
              <Button
                variant="ghost"
<<<<<<< HEAD
                className="h-auto w-full gap-2 p-0 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-transparent hover:text-slate-900"
=======
                className="text-text-muted hover:text-text-primary h-auto w-full gap-2 p-0 text-[10px] font-black uppercase tracking-widest hover:bg-transparent"
>>>>>>> recover/cabinet-wip-from-stash
              >
                View Compliance Feed <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
