'use client';

import { useState } from 'react';
import { 
  Scissors, 
  Ruler, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Clock, 
  User, 
  Scan, 
  Activity, 
  AlertTriangle,
  Layers,
  Search,
  Maximize2,
  Printer,
  ChevronDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { MOCK_CUSTOM_ORDERS, getStatusLabel, getStatusColor } from '@/lib/logic/customization-utils';
import Link from 'next/link';

export default function FactoryCustomizationPage() {
  const [selectedOrder, setSelectedOrder] = useState(MOCK_CUSTOM_ORDERS[0]);

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-20 px-4 md:px-0">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-4">
        <Link href="/factory" className="hover:text-indigo-600 transition-colors">Производство</Link>
        <ChevronRight className="h-2 w-2" />
        <span className="text-slate-900">Индивидуальные заказы (MTM)</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-3xl bg-slate-900 flex items-center justify-center shadow-2xl">
            <Scissors className="h-8 w-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Made-to-Measure Production</p>
              <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] uppercase tracking-widest font-black h-5">Active Line</Badge>
            </div>
            <h1 className="text-base font-black uppercase tracking-tighter italic leading-none">Цех Спецпошива</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right hidden xl:block">
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Загрузка линии</p>
              <p className="text-base font-black italic text-slate-900 leading-none">84%</p>
           </div>
           <div className="h-10 w-px bg-slate-100 hidden xl:block mx-4" />
           <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl h-12 px-8 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">
              Сводка по материалам
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Orders Queue */}
        <div className="lg:col-span-4 space-y-4">
           <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Поиск заказа..." 
                className="w-full h-12 pl-12 pr-4 bg-white border border-slate-100 rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              />
           </div>
           
           <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
              {MOCK_CUSTOM_ORDERS.map((order) => (
                <Card 
                  key={order.id} 
                  className={cn(
                    "cursor-pointer transition-all border-none shadow-sm rounded-2xl overflow-hidden group",
                    selectedOrder.id === order.id ? "bg-indigo-600 text-white shadow-xl scale-105 z-10" : "bg-white hover:bg-slate-50"
                  )}
                  onClick={() => setSelectedOrder(order)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <p className={cn("text-[9px] font-black uppercase tracking-widest mb-1", selectedOrder.id === order.id ? "text-indigo-200" : "text-slate-400")}>{order.id}</p>
                          <h4 className="text-sm font-black uppercase tracking-tight italic">{order.productName}</h4>
                       </div>
                       <Badge className={cn("text-[8px] font-black uppercase border-none", selectedOrder.id === order.id ? "bg-white/20 text-white" : getStatusColor(order.status))}>
                          {getStatusLabel(order.status)}
                       </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <User className={cn("h-3 w-3", selectedOrder.id === order.id ? "text-indigo-200" : "text-slate-400")} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{order.clientName}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Clock className={cn("h-3 w-3", selectedOrder.id === order.id ? "text-indigo-200" : "text-slate-400")} />
                          <span className="text-[10px] font-black tabular-nums">{order.estimatedDelivery}</span>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
           </div>
        </div>

        {/* Detailed Production Specs */}
        <div className="lg:col-span-8 space-y-6">
           <Card className="border-none shadow-sm rounded-xl bg-white overflow-hidden">
              <CardHeader className="p-3 border-b border-slate-50 bg-slate-50/30">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                       <div className="h-20 w-20 rounded-xl overflow-hidden shadow-2xl">
                          <img src="https://images.unsplash.com/photo-1591047139829-d91aec16adcd?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Production Details</p>
                          <h2 className="text-base font-black uppercase tracking-tighter italic">{selectedOrder.productName}</h2>
                          <div className="flex items-center gap-3 mt-4">
                             <div className="flex items-center gap-2">
                                <Badge className="bg-indigo-600 text-white border-none text-[9px] font-black uppercase px-2 h-6 tracking-widest">MTM Order</Badge>
                                <span className="text-[11px] font-black italic">{selectedOrder.id}</span>
                             </div>
                             <div className="h-1 w-1 bg-slate-200 rounded-full" />
                             <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Client: {selectedOrder.clientName}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-3">
                       <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-slate-200">
                          <Printer className="h-5 w-5 text-slate-400" />
                       </Button>
                       <Button className="h-12 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-500 text-[10px] font-black uppercase tracking-widest px-8 shadow-xl shadow-emerald-200/50">
                          Подтвердить крой
                       </Button>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-3">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Measurements Section */}
                    <div>
                       <div className="flex items-center gap-3 mb-8">
                          <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                             <Ruler className="h-4 w-4" />
                          </div>
                          <h3 className="text-sm font-black uppercase tracking-tight italic">3D-Обмеры (Анатомические)</h3>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                          {[
                            { label: "Рост (Height)", value: selectedOrder.measurements.height, unit: "cm" },
                            { label: "Грудь (Chest)", value: selectedOrder.measurements.chest, unit: "cm" },
                            { label: "Талия (Waist)", value: selectedOrder.measurements.waist, unit: "cm" },
                            { label: "Бедра (Hips)", value: selectedOrder.measurements.hips, unit: "cm" },
                            { label: "Плечи (Shoulders)", value: selectedOrder.measurements.shoulderWidth, unit: "cm" },
                            { label: "Рукав (Arm)", value: selectedOrder.measurements.armLength, unit: "cm" },
                            { label: "Внутр. шов (Inseam)", value: selectedOrder.measurements.inseam, unit: "cm" },
                            { label: "Шея (Neck)", value: selectedOrder.measurements.neck, unit: "cm" },
                          ].map((m, i) => (
                            <div key={i} className="flex justify-between items-baseline border-b border-slate-50 pb-2">
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</span>
                               <span className="text-sm font-black italic tracking-tighter">{m.value}<span className="text-[10px] not-italic ml-1 text-slate-400">{m.unit}</span></span>
                            </div>
                          ))}
                       </div>
                       
                       <div className="mt-10 p-3 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-[11px] font-medium text-amber-800 leading-relaxed">
                             Внимание: Плечевой пояс клиента асимметричен (правое +0.4 см). AI-генератор лекал внес корректировки в паттерн для баланса.
                          </p>
                       </div>
                    </div>

                    {/* Configuration & Materials */}
                    <div>
                       <div className="flex items-center gap-3 mb-8">
                          <div className="h-8 w-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                             <Layers className="h-4 w-4" />
                          </div>
                          <h3 className="text-sm font-black uppercase tracking-tight italic">Спецификация и Материалы</h3>
                       </div>
                       
                       <div className="space-y-4">
                          {selectedOrder.selectedOptions.map((opt, i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                               <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                     {opt.type === 'fabric' ? <div className="h-6 w-6 rounded-full border border-slate-100 shadow-inner" style={{ backgroundColor: opt.value }} /> : <Scissors className="h-4 w-4 text-slate-400" />}
                                  </div>
                                  <div>
                                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">{opt.type}</p>
                                     <p className="text-[11px] font-black uppercase tracking-widest">{opt.name}</p>
                                  </div>
                               </div>
                               <Badge className="bg-white text-slate-600 border-slate-100 text-[8px] font-black uppercase h-5">In Stock</Badge>
                            </div>
                          ))}
                       </div>

                       <div className="mt-8 p-4 bg-slate-900 rounded-xl text-white">
                          <div className="flex items-center gap-3 mb-4">
                             <Scan className="h-4 w-4 text-indigo-400" />
                             <h4 className="text-[11px] font-black uppercase tracking-widest">Digital Pattern (DXF)</h4>
                          </div>
                          <div className="flex items-center justify-between mb-4">
                             <p className="text-[10px] text-white/40 font-bold uppercase tracking-tight">Статус генерации лекал:</p>
                             <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase px-2 h-5">Ready</Badge>
                          </div>
                          <Button className="w-full h-11 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                             Отправить в раскройный комплекс
                          </Button>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
