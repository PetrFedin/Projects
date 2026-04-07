'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Truck, 
  Ship, 
  Plane, 
  Box, 
  Search, 
  Filter, 
  ArrowRight, 
  Timer, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  AlertTriangle,
  Zap,
  Globe,
  Anchor,
  TrendingUp,
  ShoppingCart,
  SwitchCamera,
  Calendar
} from 'lucide-react';
import { InTransitShipment } from '@/lib/types/logistics';
import { MOCK_SHIPMENTS, calculateTotalInTransit } from '@/lib/logic/logistics-utils';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';

/**
 * Shadow Inventory (Sell-in-Transit) — Brand OS
 * Учет и продажа товаров, находящихся в пути от фабрик.
 */

export default function ShadowInventoryPage() {
  const [shipments, setShipments] = useState<InTransitShipment[]>(MOCK_SHIPMENTS);

  const toggleSellable = (shipmentId: string) => {
    setShipments(shipments.map(s => 
      s.id === shipmentId ? { ...s, sellableInTransit: !s.sellableInTransit } : s
    ));
  };

  const getStatusBadge = (status: InTransitShipment['status']) => {
    const config = {
      departed: { label: 'Отправлен', color: 'bg-slate-100 text-slate-600' },
      at_sea: { label: 'В пути (Море)', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
      customs: { label: 'Таможня', color: 'bg-amber-50 text-amber-600 border-amber-100' },
      last_mile: { label: 'Последняя миля', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
      delivered: { label: 'Доставлен', color: 'bg-emerald-500 text-white' },
    };
    const item = config[status];
    return <Badge variant="outline" className={cn("text-[8px] font-black uppercase px-2 h-5", item.color)}>{item.label}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-4 space-y-6 max-w-5xl animate-in fade-in duration-700">
      <SectionInfoCard
        title="Shadow Inventory"
        description="Продажа товаров в пути. Отслеживание грузов от фабрик до склада. Связь с Production (PO), B2B (заказы) и Warehouse (приёмки). Sell-in-transit для ранних продаж."
        icon={Truck}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
        badges={<><Badge variant="outline" className="text-[9px]">Production → PO</Badge><Badge variant="outline" className="text-[9px]">B2B → заказы</Badge><Badge variant="outline" className="text-[9px]">Warehouse</Badge><Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild><Link href="/brand/warehouse">Warehouse</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/logistics/duty-calculator">Duty Calc</Link></Button><Button variant="outline" size="sm" className="text-[9px] h-7" asChild><Link href="/brand/logistics/consolidation">Consolidation</Link></Button></>}
      />
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <Truck className="w-2.5 h-2.5" />
            <span>Inventory Logistics Node</span>
          </div>
          <h1 className="text-sm font-black tracking-tighter uppercase text-slate-900 leading-none">Shadow Inventory</h1>
          <p className="text-[11px] text-slate-500 font-medium px-0.5 mt-1">Real-time sell-in-transit management & allocation.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
           <Button variant="ghost" size="sm" className="h-7 px-3 bg-white text-slate-600 rounded-lg font-bold uppercase text-[9px] tracking-widest shadow-sm border border-slate-200 transition-all hover:text-indigo-600">
              <Globe className="w-3 h-3 mr-1.5" /> Global Track
           </Button>
           <Button className="h-7 px-4 rounded-lg font-bold uppercase text-[9px] tracking-widest bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-all">
              <Filter className="w-3 h-3 mr-1.5" /> Filter
           </Button>
        </div>
      </header>

      {/* Analytics Row — Compact & Normalized */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
         {[
           { label: 'Total In-Transit', value: calculateTotalInTransit(shipments).toLocaleString(), icon: Box, color: 'text-slate-900', bg: 'bg-slate-50/50' },
           { label: 'ATP Shadow Stock', value: '700', icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50/50' },
           { label: 'Active Shipments', value: shipments.length, icon: Ship, color: 'text-blue-600', bg: 'bg-blue-50/50' },
           { label: 'Next Arrival', value: '3 Days', icon: Timer, color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
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

      <div className="grid lg:grid-cols-12 gap-3 mt-2">
         <div className="lg:col-span-8 space-y-4">
            <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
               <CardHeader className="p-3 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/30">
                  <CardTitle className="text-sm font-black uppercase tracking-tight">In-Transit Shipments</CardTitle>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    <Input placeholder="Filter shipments..." className="pl-9 h-8 rounded-lg border-slate-200 text-[10px] font-bold uppercase w-48 bg-white" />
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <Table>
                     <TableHeader className="bg-white">
                        <TableRow className="hover:bg-transparent border-b border-slate-50">
                           <TableHead className="pl-6 text-[9px] font-black uppercase tracking-wider h-10">Shipment ID / Route</TableHead>
                           <TableHead className="text-[9px] font-black uppercase tracking-wider h-10">Status / ETA</TableHead>
                           <TableHead className="text-[9px] font-black uppercase tracking-wider h-10">Items (Shadow)</TableHead>
                           <TableHead className="text-[9px] font-black uppercase tracking-wider text-center h-10">Sell In Transit</TableHead>
                           <TableHead className="pr-6 text-right text-[9px] font-black uppercase tracking-wider h-10">Action</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {shipments.map(ship => (
                           <TableRow key={ship.id} className="hover:bg-slate-50/50 transition-colors group border-b border-slate-50 last:border-0">
                              <TableCell className="pl-6 py-4">
                                 <div className="space-y-1">
                                    <p className="text-[11px] font-black text-slate-900 uppercase">{ship.id}</p>
                                    <div className="flex items-center gap-1 text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                                       <span>{ship.origin.split(',')[1]}</span>
                                       <ArrowRight className="w-2 h-2" />
                                       <span>{ship.destination.split(',')[1]}</span>
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="space-y-1.5">
                                    {getStatusBadge(ship.status)}
                                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase">
                                       <Calendar className="w-2.5 h-2.5" />
                                       {ship.estimatedArrival}
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div className="space-y-1">
                                    <p className="text-xs font-black text-slate-900">{ship.items.reduce((s, i) => s + i.qty, 0)} units</p>
                                    <p className="text-[8px] text-indigo-600 font-black uppercase tracking-tight">
                                       {ship.items.length} SKUs
                                    </p>
                                 </div>
                              </TableCell>
                              <TableCell className="text-center">
                                 <div className="flex flex-col items-center gap-1.5">
                                    <Switch 
                                       checked={ship.sellableInTransit}
                                       onCheckedChange={() => toggleSellable(ship.id)}
                                       className="scale-75"
                                    />
                                    <span className={cn(
                                       "text-[7px] font-black uppercase tracking-widest",
                                       ship.sellableInTransit ? "text-indigo-600" : "text-slate-300"
                                    )}>
                                       {ship.sellableInTransit ? 'Active' : 'Disabled'}
                                    </span>
                                 </div>
                              </TableCell>
                              <TableCell className="pr-6 text-right">
                                 <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
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
               <div className="flex items-center gap-3 mb-5">
                  <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-105 transition-transform">
                     <TrendingUp className="w-4.5 h-4.5 text-indigo-400" />
                  </div>
                  <div>
                     <h3 className="text-xs font-black uppercase tracking-tight">Revenue Pull-Forward</h3>
                     <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Shadow Selling Insight</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center shadow-inner group-hover:bg-white/10 transition-colors">
                     <p className="text-[8px] font-black uppercase text-white/40 mb-1 tracking-[0.2em]">Pre-Sold in Transit</p>
                     <p className="text-sm font-black tabular-nums">$42,500</p>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2.5">
                     <div className="flex justify-between items-center">
                        <span className="text-[8px] font-black uppercase text-white/60 tracking-widest">Transit Sell-Through</span>
                        <span className="text-xs font-black text-indigo-400 tabular-nums">14.2%</span>
                     </div>
                     <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: '14.2%' }} />
                     </div>
                  </div>
               </div>
               <p className="text-[9px] text-white/30 font-medium italic mt-5 leading-relaxed border-t border-white/5 pt-4">
                  "Shadow Selling" allows pre-orders for incoming goods, reducing cash flow gaps by 14-20 days.
               </p>
            </Card>

            <Card className="border border-slate-100 shadow-sm rounded-2xl p-3 bg-white space-y-5 hover:border-amber-100 transition-all group">
               <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm group-hover:scale-105 transition-transform">
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-tight text-slate-900">Transit Risks</h3>
               </div>
               
               <div className="space-y-1">
                  {[
                    { label: 'Port Congestion (Shenzhen)', status: 'Moderate', color: 'text-amber-500' },
                    { label: 'Weather Delay (North Sea)', status: '+2 days', color: 'text-rose-500' },
                    { label: 'Carrier Performance', status: '98% On-time', color: 'text-emerald-500' }
                  ].map((risk, i) => (
                    <div key={i} className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 px-1 rounded-lg transition-colors">
                       <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">{risk.label}</span>
                       <span className={cn("text-[9px] font-black uppercase tracking-tight", risk.color)}>{risk.status}</span>
                    </div>
                  ))}
               </div>
               <Button variant="outline" size="sm" className="w-full h-9 border-slate-200 text-[9px] font-black uppercase rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm tracking-widest">
                  Analyze Supply Chain
               </Button>
            </Card>
         </div>
      </div>
    </div>
  );
}
