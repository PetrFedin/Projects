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
            <div className="bg-accent-primary flex h-8 w-8 items-center justify-center rounded-xl">
              <Gavel className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
              className="border-accent-primary/20 text-accent-primary text-[9px] font-black uppercase tracking-widest"
            >
              Customs_Gateway_v1.0
            </Badge>
          </div>
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
            Global Compliance
          </h2>
          <p className="text-text-muted max-w-md text-left text-xs font-medium">
            Automated HS-code mapping and customs documentation engine for seamless cross-border
            distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-bg-surface2 border-border-subtle flex items-center gap-1.5 rounded-2xl border p-1">
            {['CIS', 'UAE', 'EU'].map((reg) => (
              <Button
                key={reg}
                onClick={() => setActiveRegion(reg as any)}
                className={cn(
                  'h-10 rounded-xl px-5 text-[9px] font-black uppercase tracking-widest transition-all',
                  activeRegion === reg
                    ? 'text-text-primary bg-white shadow-sm'
                    : 'text-text-muted hover:text-text-secondary bg-transparent'
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
            <h3 className="text-text-muted text-sm font-black uppercase tracking-widest">
              Document Generation Queue
            </h3>
            <div className="relative w-64">
              <Search className="text-text-muted absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
              <Input
                placeholder="Search Order ID..."
                className="border-border-subtle bg-bg-surface2 h-10 rounded-xl pl-9 text-[10px] font-bold uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="bg-bg-surface2/80 group overflow-hidden rounded-xl border-none shadow-md shadow-xl transition-all hover:bg-white"
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="border-border-subtle flex h-12 w-12 items-center justify-center rounded-2xl border bg-white shadow-sm">
                      <FileCheck className="text-accent-primary h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-text-primary text-base font-black uppercase tracking-tight">
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-3">
                        <Badge className="border-none bg-emerald-100 px-2 py-0.5 text-[8px] font-black uppercase text-emerald-600">
                          {doc.status}
                        </Badge>
                        <span className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                          {doc.type} Category
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-border-default h-12 w-12 rounded-xl bg-white"
                    >
                      <Printer className="text-text-muted h-5 w-5" />
                    </Button>
                    <Button className="bg-text-primary h-12 gap-2 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-md">
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
          <Card className="bg-accent-primary relative space-y-4 overflow-hidden rounded-xl border-none p-3 text-white shadow-2xl shadow-md">
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
                    <p className="text-accent-primary/40 mb-1 text-[8px] font-black uppercase">
                      Avg. Duty Saved
                    </p>
                    <p className="text-sm font-black">4.2%</p>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                    <p className="text-accent-primary/40 mb-1 text-[8px] font-black uppercase">
                      Audit Score
                    </p>
                    <p className="text-sm font-black">AAA</p>
                  </div>
                </div>
              </div>
              <Button className="text-text-primary h-10 w-full gap-2 rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                Manual HS Mapping <Zap className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
                <ShieldAlert className="h-5 w-5 text-rose-600" />
              </div>
              <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
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
                className="text-text-muted hover:text-text-primary h-auto w-full gap-2 p-0 text-[10px] font-black uppercase tracking-widest hover:bg-transparent"
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
