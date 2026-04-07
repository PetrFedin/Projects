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
  Search
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
    { id: 'coo-1', title: 'Certificate of Origin (Form A)', status: 'Pending Signature', type: 'Legal' }
  ];

  return (
    <div className="space-y-4 p-3 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Gavel className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-indigo-100 text-indigo-600 uppercase font-black tracking-widest text-[9px]">
              Customs_Gateway_v1.0
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Global Compliance
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md text-left">
            Automated HS-code mapping and customs documentation engine for seamless cross-border distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-100">
            {['CIS', 'UAE', 'EU'].map(reg => (
              <Button
                key={reg}
                onClick={() => setActiveRegion(reg as any)}
                className={cn(
                  "h-10 px-5 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all",
                  activeRegion === reg ? "bg-white text-slate-900 shadow-sm" : "bg-transparent text-slate-400 hover:text-slate-600"
                )}
              >
                {reg} Region
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Active Document Queue */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Document Generation Queue</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input placeholder="Search Order ID..." className="h-10 pl-9 rounded-xl border-slate-100 bg-slate-50 text-[10px] font-bold uppercase" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {documents.map((doc) => (
              <Card key={doc.id} className="group border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden bg-slate-50/50 hover:bg-white transition-all">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                      <FileCheck className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-black uppercase tracking-tight text-slate-900">{doc.title}</h4>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-100 text-emerald-600 border-none font-black text-[8px] px-2 py-0.5 uppercase">
                          {doc.status}
                        </Badge>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.type} Category</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-slate-200 bg-white">
                      <Printer className="h-5 w-5 text-slate-400" />
                    </Button>
                    <Button className="h-12 bg-slate-900 text-white rounded-xl px-6 font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg shadow-slate-200">
                      Download PDF <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Customs Intelligence Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-indigo-600 text-white p-3 space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Globe className="h-32 w-32" />
            </div>
            
            <div className="relative z-10 space-y-6 text-left">
              <h3 className="text-sm font-black uppercase tracking-tight">Tariff Engine</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/10 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase">HS Code Accuracy</span>
                    <span className="text-emerald-400 text-xs font-black">99.4%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '99.4%' }}
                      className="h-full bg-emerald-400" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[8px] font-black uppercase text-indigo-200 mb-1">Avg. Duty Saved</p>
                    <p className="text-sm font-black">4.2%</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[8px] font-black uppercase text-indigo-200 mb-1">Audit Score</p>
                    <p className="text-sm font-black">AAA</p>
                  </div>
                </div>
              </div>
              <Button className="w-full h-10 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl">
                Manual HS Mapping <Zap className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center">
                <ShieldAlert className="h-5 w-5 text-rose-600" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Regulatory Alerts</h4>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100">
                <p className="text-[10px] font-black text-rose-900 uppercase mb-1">New EU VAT Directive</p>
                <p className="text-[9px] text-rose-600 font-medium leading-relaxed">
                  Updated regulations for textile exports to France starting March 1st. Automation logic updated.
                </p>
              </div>
              <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest gap-2 p-0 h-auto hover:bg-transparent text-slate-400 hover:text-slate-900">
                View Compliance Feed <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
