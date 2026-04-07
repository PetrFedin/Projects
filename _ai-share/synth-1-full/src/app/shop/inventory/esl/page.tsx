'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Wifi, 
  WifiOff, 
  Battery, 
  BatteryLow, 
  BatteryMedium, 
  RefreshCcw, 
  Tag, 
  Search, 
  MoreVertical, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  Cpu,
  Smartphone,
  Globe,
  Monitor,
  Settings2,
  Filter,
  ArrowRight
} from 'lucide-react';
import { ESLDevice } from '@/lib/types/retail';
import { MOCK_ESL_DEVICES, getBatteryStatus } from '@/lib/logic/esl-utils';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

/**
 * Dynamic ESL Sync Page — Shop OS
 * Управление электронными ценниками в торговом зале.
 */

export default function ESLManagementPage() {
  const [devices, setDevices] = useState<ESLDevice[]>(MOCK_ESL_DEVICES);
  const [updating, setUpdating] = useState<string | null>(null);

  const syncAll = () => {
    setUpdating('all');
    setTimeout(() => setUpdating(null), 2000);
  };

  const getBatteryIcon = (level: number) => {
    const status = getBatteryStatus(level);
    if (status === 'critical') return <BatteryLow className="w-4 h-4 text-rose-500 animate-pulse" />;
    if (status === 'low') return <BatteryLow className="w-4 h-4 text-amber-500" />;
    if (status === 'normal') return <BatteryMedium className="w-4 h-4 text-slate-400" />;
    return <Battery className="w-4 h-4 text-emerald-500" />;
  };

  return (
    <div className="container mx-auto px-4 py-4 space-y-10">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
            <Tag className="w-3.5 h-3.5" />
            Retail Operations
          </div>
          <h1 className="text-sm font-black font-headline tracking-tighter uppercase">Dynamic ESL Sync</h1>
          <p className="text-muted-foreground font-medium">Синхронизация цен и акций с электронными ценниками в реальном времени.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px]">
              <Settings2 className="w-4 h-4" /> Gateway Config
           </Button>
           <Button 
              onClick={syncAll}
              disabled={!!updating}
              className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px] bg-indigo-600 text-white shadow-lg shadow-indigo-200"
           >
              <RefreshCcw className={cn("w-4 h-4", updating === 'all' && "animate-spin")} />
              Sync All Devices
           </Button>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-3">
         {[
           { label: 'Total Devices', value: devices.length, status: 'Active' },
           { label: 'Online', value: devices.filter(d => d.status === 'online').length, status: 'Healthy', color: 'text-emerald-500' },
           { label: 'Low Battery', value: devices.filter(d => d.batteryLevel < 20).length, status: 'Requires Action', color: 'text-rose-500' },
           { label: 'Pending Updates', value: '0', status: 'All Synced' },
         ].map((stat, i) => (
           <Card key={i} className="border-none shadow-sm bg-white rounded-3xl p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
              <p className={cn("text-base font-black mb-2", stat.color)}>{stat.value}</p>
              <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-100">{stat.status}</Badge>
           </Card>
         ))}
      </div>

      {/* Main Management Table */}
      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden bg-white">
         <CardHeader className="p-4 border-b border-slate-50 flex flex-row items-center justify-between">
            <div>
               <CardTitle className="text-base font-black uppercase tracking-tight">Label Registry</CardTitle>
               <CardDescription>Устройства, привязанные к артикулам в торговом зале.</CardDescription>
            </div>
            <div className="flex gap-3">
               <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                  <Input placeholder="Search SKU or ID..." className="pl-9 h-10 rounded-xl border-slate-100 text-xs w-64" />
               </div>
               <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl"><Filter className="w-4 h-4" /></Button>
            </div>
         </CardHeader>
         <CardContent className="p-0">
            <Table>
               <TableHeader className="bg-slate-50/50">
                  <TableRow>
                     <TableHead className="pl-8 text-[10px] font-black uppercase">Device / SKU</TableHead>
                     <TableHead className="text-[10px] font-black uppercase">Product</TableHead>
                     <TableHead className="text-[10px] font-black uppercase">Display Price</TableHead>
                     <TableHead className="text-[10px] font-black uppercase">Status</TableHead>
                     <TableHead className="text-[10px] font-black uppercase">Power/Signal</TableHead>
                     <TableHead className="pr-8 text-right text-[10px] font-black uppercase">Action</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {devices.map(device => (
                     <TableRow key={device.id} className="hover:bg-slate-50/50 transition-colors group">
                        <TableCell className="pl-8 py-6">
                           <div className="space-y-1">
                              <p className="text-xs font-black text-slate-900">{device.id}</p>
                              <code className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{device.sku}</code>
                           </div>
                        </TableCell>
                        <TableCell>
                           <p className="text-sm font-black text-slate-900">{device.productName}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{device.location}</p>
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center gap-2">
                              {device.promoPrice ? (
                                 <>
                                    <span className="text-sm font-black text-rose-500">${device.promoPrice}</span>
                                    <span className="text-xs font-bold text-slate-300 line-through">${device.currentPrice}</span>
                                 </>
                              ) : (
                                 <span className="text-sm font-black text-slate-900">${device.currentPrice}</span>
                              )}
                           </div>
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center gap-2">
                              <div className={cn(
                                 "h-2 w-2 rounded-full",
                                 device.status === 'online' ? "bg-emerald-500" : "bg-slate-300"
                              )} />
                              <span className="text-[10px] font-black uppercase text-slate-600">{device.status}</span>
                           </div>
                        </TableCell>
                        <TableCell>
                           <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5">
                                 {getBatteryIcon(device.batteryLevel)}
                                 <span className="text-[10px] font-bold text-slate-500">{device.batteryLevel}%</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                 <Wifi className={cn("w-4 h-4", device.signalStrength > 50 ? "text-indigo-400" : "text-slate-300")} />
                                 <span className="text-[10px] font-bold text-slate-500">{device.signalStrength}%</span>
                              </div>
                           </div>
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

      {/* Info Section */}
      <div className="grid md:grid-cols-2 gap-3">
         <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl p-4 bg-slate-900 text-white relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform">
               <Zap className="w-40 h-40 text-indigo-400" />
            </div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
               <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-indigo-400" />
               </div>
               <h3 className="text-sm font-black uppercase tracking-tight italic">Storefront Automation</h3>
            </div>
            <p className="text-sm text-white/60 leading-relaxed font-medium mb-8 relative z-10">
               Ценники автоматически переключаются в режим «PROMO», когда маркетинговый отдел запускает акцию в Brand OS. 
               При сканировании QR-кода на ценнике клиент попадает в **Digital Product Passport** с историей вещи.
            </p>
            <Button className="rounded-xl bg-indigo-600 text-white border-none font-black uppercase text-[10px] h-10 px-6 relative z-10">
               View Automation Logs
            </Button>
         </Card>

         <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl p-4 bg-white border border-slate-50 space-y-6">
            <div className="flex items-center gap-3">
               <CheckCircle2 className="w-5 h-5 text-emerald-500" />
               <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Sync Status</h3>
            </div>
            <div className="space-y-4">
               {[
                 { label: 'Cloud Gateway', status: 'Operational', color: 'text-emerald-500' },
                 { label: 'Local Base Station', status: 'Online (Showroom A)', color: 'text-emerald-500' },
                 { label: 'Firmware Update', status: 'v2.4.1 (Stable)', color: 'text-slate-400' }
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                    <span className="text-[10px] font-black uppercase text-slate-400">{item.label}</span>
                    <span className={cn("text-[10px] font-black uppercase", item.color)}>{item.status}</span>
                 </div>
               ))}
            </div>
         </Card>
      </div>
    </div>
  );
}
