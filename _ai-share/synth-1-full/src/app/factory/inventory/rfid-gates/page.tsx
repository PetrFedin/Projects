'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Scan, 
  Box, 
  Zap, 
  Wifi, 
  WifiOff, 
  Search, 
  Filter, 
  ArrowRight, 
  History, 
  Settings2, 
  Maximize2, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Anchor, 
  ArrowUpRight,
  Terminal,
  Database
} from 'lucide-react';
import { WarehouseGate, PalletScan } from '@/lib/types/warehouse';
import { MOCK_GATES, MOCK_SCANS, getScanStatusColor, getGateStatusColor } from '@/lib/logic/rfid-utils';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

/**
 * RFID Warehouse Gates — Factory/Warehouse Profile
 * Система для мгновенной приемки паллет через RFID-ворота.
 */

export default function RFIDGatesPage() {
  const [gates, setGates] = useState<WarehouseGate[]>(MOCK_GATES);
  const [scans, setScans] = useState<PalletScan[]>(MOCK_SCANS);

  return (
    <div className="container mx-auto px-4 py-4 space-y-10 pb-24">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
            <Scan className="w-3.5 h-3.5" />
            Industrial Automation
          </div>
          <h1 className="text-sm font-black font-headline tracking-tighter uppercase">RFID Warehouse Gates</h1>
          <p className="text-muted-foreground font-medium">Мгновенное сканирование целых паллет при приемке и отгрузке без вскрытия коробок.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px]">
              <Settings2 className="w-4 h-4" /> Gates Config
           </Button>
           <Button className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px] bg-emerald-600 text-white shadow-lg shadow-emerald-200">
              <Zap className="w-4 h-4" /> Start Batch Scan
           </Button>
        </div>
      </header>

      {/* Gates Monitor */}
      <div className="grid md:grid-cols-4 gap-3">
         {gates.map(gate => (
           <Card key={gate.id} className="border-none shadow-sm bg-white rounded-3xl p-4 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                 <div className={cn(
                   "h-2.5 w-2.5 rounded-full",
                   getGateStatusColor(gate.status)
                 )} />
                 <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-100">{gate.id}</Badge>
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">{gate.name}</h3>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                 <span className="flex items-center gap-1"><History className="w-3 h-3" /> {new Date(gate.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                 <span className="flex items-center gap-1 text-indigo-500"><Scan className="w-3 h-3" /> {gate.scanCount24h} / 24h</span>
              </div>
           </Card>
         ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-3">
         <div className="lg:col-span-8 space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden bg-white">
               <CardHeader className="p-4 border-b border-slate-50 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-black uppercase tracking-tight">Recent Scans</CardTitle>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    <Input placeholder="Search scan ID or gate..." className="pl-9 h-10 rounded-xl border-slate-100 text-xs w-64" />
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <Table>
                     <TableHeader className="bg-slate-50/50">
                        <TableRow>
                           <TableHead className="pl-8 text-[10px] font-black uppercase">Scan ID / Time</TableHead>
                           <TableHead className="text-[10px] font-black uppercase">Gate</TableHead>
                           <TableHead className="text-[10px] font-black uppercase text-center">Qty (Actual/Expected)</TableHead>
                           <TableHead className="text-[10px] font-black uppercase">Result</TableHead>
                           <TableHead className="pr-8 text-right text-[10px] font-black uppercase">Details</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {scans.map(scan => (
                           <TableRow key={scan.id} className="hover:bg-slate-50/50 transition-colors group">
                              <TableCell className="pl-8 py-6">
                                 <div className="space-y-1">
                                    <p className="text-xs font-black text-slate-900">{scan.id}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{new Date(scan.timestamp).toLocaleString()}</p>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-200 bg-slate-50">
                                    {scan.gateId}
                                 </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                 <div className="inline-flex items-center gap-2">
                                    <span className={cn(
                                       "text-sm font-black",
                                       scan.itemCount === scan.expectedItemCount ? "text-slate-900" : "text-rose-500"
                                    )}>{scan.itemCount}</span>
                                    <span className="text-slate-300 text-xs">/</span>
                                    <span className="text-xs font-bold text-slate-400">{scan.expectedItemCount}</span>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <Badge variant="outline" className={cn("text-[8px] font-black uppercase px-2 h-5", getScanStatusColor(scan.status))}>
                                    {scan.status}
                                 </Badge>
                              </TableCell>
                              <TableCell className="pr-8 text-right">
                                 <Button variant="ghost" size="icon" className="text-slate-300 hover:text-indigo-600 rounded-xl">
                                    <ArrowRight className="w-4 h-4" />
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
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-slate-900 text-white p-4 overflow-hidden relative group">
               <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform">
                  <Maximize2 className="w-40 h-40 text-indigo-400" />
               </div>
               <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                     <Cpu className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-tight italic">Scan Tech OS</h3>
               </div>
               <div className="space-y-6 relative z-10">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-black uppercase text-white/40">Throughput (Units/min)</span>
                        <ArrowUpRight className="w-3 h-3 text-indigo-400" />
                     </div>
                     <p className="text-sm font-black">12,500 <span className="text-[10px] text-white/40 not-italic">U/M</span></p>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-white/60">Inventory Precision</span>
                        <span className="text-sm font-black text-emerald-400">99.98%</span>
                     </div>
                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '99.98%' }} />
                     </div>
                  </div>
               </div>
               <p className="text-[10px] text-white/40 font-medium italic mt-8 leading-relaxed relative z-10">
                  RFID-ворота мгновенно считывают сотни меток в секунду, сопоставляя их с заказом (PO) и автоматически обновляя статус стока в **Integration Hub**.
               </p>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl p-4 bg-white border border-slate-50 space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Database className="w-5 h-5 text-indigo-600" />
                     <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">System Logs</h3>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase">Live Sync</Badge>
               </div>
               
               <div className="space-y-4 font-mono text-[9px] text-slate-400 overflow-hidden max-h-40">
                  <p className="border-l-2 border-indigo-500 pl-3">[09:45:10] SCAN-10025: Batch verified (300 units)</p>
                  <p className="border-l-2 border-rose-500 pl-3">[09:29:55] SCAN-10024: Mismatch detected (2 units missing)</p>
                  <p className="border-l-2 border-indigo-500 pl-3">[08:14:22] SCAN-10023: Batch verified (450 units)</p>
                  <p className="border-l-2 border-slate-200 pl-3">[07:00:01] System boot successful. All gates online.</p>
               </div>
               <Button variant="outline" className="w-full h-11 border-slate-100 text-[10px] font-black uppercase rounded-xl hover:bg-slate-50">
                  Open Control Terminal
               </Button>
            </Card>
         </div>
      </div>
    </div>
  );
}
