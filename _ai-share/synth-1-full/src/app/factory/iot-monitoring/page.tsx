'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Cpu, 
  Activity, 
  Zap, 
  Settings2, 
  RefreshCcw, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Gauge, 
  Thermometer, 
  History,
  MoreVertical,
  Factory
} from 'lucide-react';
import { MachineKPI, ProductionLine } from '@/lib/types/production-iot';
import { MOCK_LINES, MOCK_MACHINES, getMachineStatusColor } from '@/lib/logic/production-iot-utils';
import { cn } from '@/lib/utils';

/**
 * IoT Machine Monitoring — Factory Dashboard
 * Глобальный мониторинг КПД и состояния оборудования.
 */

export default function MachineMonitoringPage() {
  const [lines] = useState(MOCK_LINES) as [ProductionLine[]];
  const [machines] = useState(MOCK_MACHINES) as [MachineKPI[]];

  return (
    <>
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-6xl animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            <Cpu className="w-3.5 h-3.5" />
            Industry 4.0 Core
          </div>
          <h1 className="text-sm font-bold tracking-tight text-slate-900 uppercase">Machine Monitoring</h1>
          <p className="text-[13px] text-slate-500 font-medium">Мониторинг КПД, температуры и выработки оборудования в реальном времени.</p>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
           <Button variant="ghost" className="gap-2 rounded-lg h-8 px-4 font-bold uppercase text-[10px] text-slate-500 hover:bg-white transition-all">
              <History className="w-3.5 h-3.5" /> Maintenance
           </Button>
           <Button className="gap-2 rounded-lg h-8 px-4 font-bold uppercase text-[10px] bg-slate-900 text-white shadow-md hover:bg-indigo-600 transition-all">
              <RefreshCcw className="w-3.5 h-3.5" /> Hard Reset
           </Button>
        </div>
      </header>

      {/* Global OEE (Overall Equipment Effectiveness) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
         {[
           { label: 'Factory OEE', value: '88.4%', icon: Gauge, color: 'text-indigo-600', bg: 'bg-indigo-50' },
           { label: 'Active Machines', value: '42 / 45', icon: Factory, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Energy Load', value: '340 kW/h', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
           { label: 'Critical Alerts', value: '1', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50' },
         ].map((stat, i) => (
           <Card key={i} className="border border-slate-100 shadow-sm bg-white rounded-xl p-4 group hover:border-indigo-200 transition-all">
              <div className="flex items-center justify-between mb-3">
                 <div className={cn("p-2 rounded-lg shadow-sm border border-slate-50", stat.bg)}>
                    {React.createElement(stat.icon, { className: cn("w-4 h-4", stat.color) })}
                 </div>
                 <Badge variant="outline" className="text-[9px] font-bold uppercase border-slate-200 bg-slate-50 px-2 h-5 text-slate-500">Live</Badge>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{stat.label}</p>
              <p className={cn("text-base font-bold tracking-tight", stat.color)}>{stat.value}</p>
           </Card>
         ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-3">
         {/* Lines Monitor */}
         <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 px-1">
               <div className="h-1 w-6 bg-indigo-600 rounded-full" />
               <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Production Lines</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
               {lines.map(line => (
                 <Card key={line.id} className="border border-slate-100 shadow-sm rounded-xl overflow-hidden bg-white hover:border-indigo-200 transition-all">
                    <div className="p-3 border-b border-slate-50 bg-slate-50/30">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">{line.name}</h3>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{line.id}</p>
                          </div>
                          <Badge className={cn(
                            "text-[9px] font-bold uppercase px-2 h-5 shadow-sm border-none",
                            line.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                          )}>
                            {line.status}
                          </Badge>
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between items-center">
                             <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Efficiency</span>
                             <span className="text-[13px] font-bold text-indigo-600">{line.efficiency}%</span>
                          </div>
                          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                             <div 
                                className={cn("h-full rounded-full transition-all duration-1000", line.efficiency > 80 ? "bg-emerald-500" : "bg-amber-500")}
                                style={{ width: `${line.efficiency}%` }}
                             />
                          </div>
                       </div>
                    </div>
                    <div className="p-4 bg-white">
                       <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">
                          <span>Nodes Activity</span>
                          <span className="text-indigo-600 cursor-pointer hover:underline">Manage</span>
                       </div>
                       <div className="flex -space-x-1.5">
                          {line.machines.map(m => (
                            <div key={m.id} className={cn("h-7 w-7 rounded-lg border-2 border-white flex items-center justify-center text-[9px] font-bold text-white shadow-sm", getMachineStatusColor(m.status))}>
                               {m.id.split('-')[1]}
                            </div>
                          ))}
                       </div>
                    </div>
                 </Card>
               ))}
            </div>

            <Card className="border border-slate-100 shadow-sm rounded-xl overflow-hidden bg-white mt-6">
               <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/30">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700">Machine Fleet Details</CardTitle>
                  <CardDescription className="text-[11px] text-slate-400 font-medium">Показатели отдельных узлов и сенсоров.</CardDescription>
               </CardHeader>
               <CardContent className="p-0 overflow-x-auto">
                  <Table>
                     <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-none hover:bg-transparent h-10">
                           <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">Machine ID</TableHead>
                           <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Type / Op</TableHead>
                           <TableHead className="text-[10px] font-bold uppercase tracking-wider text-center h-10 text-slate-400">Output 24h</TableHead>
                           <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Temp / RPM</TableHead>
                           <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">KPI</TableHead>
                           <TableHead className="pr-6 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Actions</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {machines.map(m => (
                           <TableRow key={m.id} className="hover:bg-slate-50/50 transition-colors group h-12">
                              <TableCell className="pl-6">
                                 <div className="flex items-center gap-3">
                                    <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm", getMachineStatusColor(m.status))} />
                                    <div>
                                       <p className="text-[12px] font-bold text-slate-900 leading-tight">{m.id}</p>
                                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{m.status}</p>
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <p className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{m.type}</p>
                                 <p className="text-[10px] text-slate-400 font-medium">{m.operator}</p>
                              </TableCell>
                              <TableCell className="text-center">
                                 <p className="text-[13px] font-bold text-slate-900">{m.output24h}</p>
                                 <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Units</p>
                              </TableCell>
                              <TableCell>
                                 <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                       <Thermometer className="w-3 h-3 text-slate-400" />
                                       <span className={cn("text-[10px] font-bold", m.temperature > 50 ? "text-rose-500" : "text-slate-600")}>{m.temperature}°C</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                       <Gauge className="w-3 h-3 text-slate-400" />
                                       <span className="text-[10px] font-bold text-slate-600">{m.rpm}</span>
                                    </div>
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <Badge variant="outline" className={cn(
                                   "text-[9px] font-bold uppercase px-2 h-5 shadow-sm border-none",
                                   m.efficiency > 90 ? "text-emerald-600 bg-emerald-50" : 
                                   m.efficiency > 50 ? "text-amber-600 bg-amber-50" : "text-rose-600 bg-rose-50"
                                 )}>
                                   {m.efficiency}% OEE
                                 </Badge>
                              </TableCell>
                              <TableCell className="pr-6 text-right">
                                 <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                                    <MoreVertical className="w-4 h-4" />
                                 </Button>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </div>

         {/* Maintenance & Intelligence */}
         <div className="space-y-6">
            <Card className="border border-indigo-500 shadow-xl rounded-xl bg-indigo-900 text-white p-4 relative overflow-hidden group">
               <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-[1.5s]">
                  <Cpu className="w-40 h-40 text-indigo-400" />
               </div>
               <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner group-hover:bg-white group-hover:text-indigo-600 transition-all duration-300">
                     <Zap className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-tight">Predictive AI</h3>
               </div>
               <div className="space-y-6 relative z-10 mb-2">
                  <p className="text-[13px] text-indigo-100 font-medium leading-relaxed">
                     AI анализирует вибрации моторов. Узел **EM-301** требует замены подшипников через ~48 часов.
                  </p>
                  <Button className="w-full h-11 rounded-lg bg-white text-indigo-900 font-bold uppercase tracking-widest text-[10px] hover:bg-indigo-50 transition-all shadow-xl">
                     Schedule Service
                  </Button>
               </div>
            </Card>

            <Card className="border border-slate-100 shadow-sm rounded-xl p-4 bg-white space-y-6">
               <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Connectivity Hub</h3>
               </div>
               <div className="space-y-3">
                  {[
                    { label: 'Factory Gateway', status: 'Online', color: 'text-emerald-500' },
                    { label: 'Cutting Node', status: 'Online', color: 'text-emerald-500' },
                    { label: 'Finishing Node', status: 'Offline', color: 'text-rose-500' },
                    { label: 'Cloud Sync', status: 'Active (12ms)', color: 'text-indigo-500' }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2.5 px-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                       <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{item.label}</span>
                       <span className={cn("text-[10px] font-bold uppercase", item.color)}>{item.status}</span>
                    </div>
                  ))}
               </div>
            </Card>
         </div>
      </div>
    </div>
    </>
  );
}
