'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Trash2, 
  Upload, 
  Plus, 
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Activity,
  Maximize2,
  Package,
  History,
  Info,
  DollarSign
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
import { MOCK_MATERIAL_LISTINGS, MOCK_CIRCULAR_TRANSACTIONS, getConditionLabel, getConditionColor } from '@/lib/logic/circular-economy-utils';
import Link from 'next/link';

export default function SupplierCircularHubPage() {
  const [activeTab, setActiveTab] = useState<'listings' | 'transactions'>('listings');

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-20 px-4 md:px-0">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-4">
        <Link href="/supplier" className="hover:text-emerald-600 transition-colors">Поставщик-офис</Link>
        <ChevronRight className="h-2 w-2" />
        <span className="text-slate-900">Circular Hub (Управление стоками)</span>
      </div>

      {/* Hero Header */}
      <div className="bg-emerald-900 rounded-xl p-4 md:p-4 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-[0.05] rotate-12 scale-150">
          <Package className="h-64 w-64" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-20 w-20 rounded-3xl bg-emerald-500 flex items-center justify-center shadow-2xl">
              <Leaf className="h-10 w-10 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Stock Monetization P3</p>
                <Badge className="bg-white/10 text-white/60 border-none text-[8px] uppercase tracking-widest font-black h-5 italic">Circular Economy</Badge>
              </div>
              <h1 className="text-sm font-black uppercase tracking-tighter italic leading-none">Реализация остатков</h1>
              <p className="text-[11px] text-white/40 font-bold uppercase mt-4 tracking-widest flex items-center gap-2">
                Общая ценность лотов: <span className="text-emerald-400">750 000 ₽</span>
                <span className="h-1 w-1 bg-white/20 rounded-full" />
                Продано за месяц: <span className="text-emerald-400">120 000 ₽</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button className="bg-white text-emerald-900 hover:bg-emerald-50 rounded-2xl h-10 px-8 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105">
                <Plus className="h-4 w-4 mr-2" /> Добавить лот
             </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Активные лоты", value: "12", sub: "3 бренда просматривают", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Заказы в работе", value: "3", sub: "Ожидают отгрузки", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Эффект ESG", value: "245 кг", sub: "Переработано сырья", icon: Leaf, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Доход", value: "482 000 ₽", sub: "Общая выручка хаба", icon: DollarSign, color: "text-slate-900", bg: "bg-slate-100" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white rounded-3xl overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-100">Live</Badge>
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-sm font-black text-slate-900 tracking-tighter">{stat.value}</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{stat.sub}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm rounded-xl bg-white overflow-hidden">
        <CardHeader className="p-4 border-b border-slate-50">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <button 
                   onClick={() => setActiveTab('listings')}
                   className={cn(
                     "text-[11px] font-black uppercase tracking-[0.2em] transition-all pb-2 border-b-2",
                     activeTab === 'listings' ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-900"
                   )}
                 >
                   Мои лоты
                 </button>
                 <button 
                   onClick={() => setActiveTab('transactions')}
                   className={cn(
                     "text-[11px] font-black uppercase tracking-[0.2em] transition-all pb-2 border-b-2",
                     activeTab === 'transactions' ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-900"
                   )}
                 >
                   Транзакции
                 </button>
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
           {activeTab === 'listings' ? (
             <Table>
                <TableHeader>
                  <TableRow className="border-slate-50 hover:bg-transparent h-10">
                    <TableHead className="pl-8 text-[9px] font-black uppercase tracking-widest text-slate-400">Материал</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Тип / Состав</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Остаток</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Состояние</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Цена (Дисконт)</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Статус</TableHead>
                    <TableHead className="pr-8 text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_MATERIAL_LISTINGS.filter(l => l.supplierId === 'org-supplier-001').map((listing) => (
                    <TableRow key={listing.id} className="border-slate-50 group hover:bg-slate-50/50 transition-colors">
                      <TableCell className="pl-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="h-12 w-12 rounded-xl overflow-hidden shadow-sm">
                              <img src={listing.images[0]} className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <p className="text-[11px] font-black uppercase tracking-tighter italic">{listing.materialName}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{listing.id}</p>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                           <Badge className="bg-slate-100 text-slate-600 border-none text-[8px] font-black uppercase px-2 mb-1">{listing.type}</Badge>
                           <p className="text-[10px] font-medium text-slate-500">{listing.composition}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                         <span className="text-[11px] font-black uppercase tracking-tight italic">{listing.quantity} {listing.unit === 'meters' ? 'м' : 'кг'}</span>
                      </TableCell>
                      <TableCell>
                         <Badge className={cn("text-[9px] font-black uppercase border-none px-2 py-0.5", getConditionColor(listing.condition))}>
                            {getConditionLabel(listing.condition)}
                         </Badge>
                      </TableCell>
                      <TableCell>
                         <div className="space-y-1">
                            <p className="text-[11px] font-black italic tracking-tighter">{listing.pricePerUnit.toLocaleString('ru-RU')} ₽</p>
                            <p className="text-[9px] text-rose-500 font-bold uppercase line-through opacity-40">{listing.originalPrice?.toLocaleString('ru-RU')} ₽</p>
                         </div>
                      </TableCell>
                      <TableCell>
                         <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase px-2 h-5">Published</Badge>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600">
                            <Trash2 className="h-4 w-4" />
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
             </Table>
           ) : (
             <Table>
                <TableHeader>
                  <TableRow className="border-slate-50 hover:bg-transparent h-10">
                    <TableHead className="pl-8 text-[9px] font-black uppercase tracking-widest text-slate-400">ID Сделки</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Покупатель</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Объем</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Сумма</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Дата</TableHead>
                    <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Статус</TableHead>
                    <TableHead className="pr-8 text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_CIRCULAR_TRANSACTIONS.map((tr) => (
                    <TableRow key={tr.id} className="border-slate-50 group hover:bg-slate-50/50 transition-colors">
                      <TableCell className="pl-8 py-6">
                         <span className="text-[11px] font-black uppercase tracking-tight italic">{tr.id}</span>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                               <User className="h-3 w-3" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-tight">{tr.buyerName}</span>
                         </div>
                      </TableCell>
                      <TableCell>
                         <span className="text-[11px] font-black">{tr.quantity} м</span>
                      </TableCell>
                      <TableCell>
                         <span className="text-[11px] font-black tabular-nums">{tr.totalAmount.toLocaleString('ru-RU')} ₽</span>
                      </TableCell>
                      <TableCell>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(tr.createdAt).toLocaleDateString('ru-RU')}</span>
                      </TableCell>
                      <TableCell>
                         <Badge className="bg-emerald-100 text-emerald-600 border-none text-[8px] font-black uppercase px-2 h-5">Completed</Badge>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                         <Button variant="outline" className="h-8 rounded-lg text-[8px] font-black uppercase border-slate-200">Документы</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
             </Table>
           )}
        </CardContent>
      </Card>
      
      {/* ESG Impact Visualization */}
      <Card className="rounded-xl border-none shadow-xl bg-slate-900 text-white p-3 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-110 transition-transform"><Leaf className="h-64 w-64 text-emerald-400" /></div>
         <div className="relative z-10 grid md:grid-cols-2 gap-3 items-center">
            <div>
               <h3 className="text-base font-black uppercase tracking-tighter italic mb-4">ESG Impact Dashboard</h3>
               <p className="text-white/60 text-sm leading-relaxed mb-8">
                  Продажа неиспользованного сырья не только приносит доход, но и снижает общие экологические риски вашей компании. Мы автоматически рассчитываем сэкономленные ресурсы для вашего отчета об устойчивом развитии.
               </p>
               <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <p className="text-[8px] font-black uppercase text-indigo-400 mb-1">Water Saved</p>
                     <p className="text-base font-black">1.2M <span className="text-[10px] text-white/40 not-italic ml-1">Liters</span></p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                     <p className="text-[8px] font-black uppercase text-emerald-400 mb-1">CO2 Reduction</p>
                     <p className="text-base font-black">4.5 <span className="text-[10px] text-white/40 not-italic ml-1">Tons</span></p>
                  </div>
               </div>
            </div>
            <div className="h-64 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
               {/* Simplified graph placeholder */}
               <div className="flex gap-3 items-end h-32">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="w-4 bg-emerald-500/30 rounded-t-sm relative group cursor-pointer">
                       <motion.div 
                         initial={{ height: 0 }}
                         animate={{ height: `${h}%` }}
                         className="absolute bottom-0 w-full bg-emerald-500 rounded-t-sm"
                       />
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </Card>
    </div>
  );
}
