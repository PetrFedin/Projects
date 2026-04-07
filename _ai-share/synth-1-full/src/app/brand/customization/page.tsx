'use client';

import { useState } from 'react';
import { 
  Scissors, 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  Calendar, 
  User, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronLeft,
  ArrowRight,
  TrendingUp,
  Activity,
  Maximize2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { MOCK_CUSTOM_ORDERS, getStatusLabel, getStatusColor } from '@/lib/logic/customization-utils';
import Link from 'next/link';

export default function BrandCustomizationPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl animate-in fade-in duration-700">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        <Link href="/brand" className="hover:text-indigo-600 transition-colors">Бренд-офис</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-900">Customization Hub</span>
      </div>

      {/* Hero Header */}
      <div className="bg-slate-900 rounded-2xl p-4 md:p-3 text-white relative overflow-hidden shadow-xl border border-slate-800 group">
        <div className="absolute top-0 right-0 p-4 opacity-[0.05] rotate-12 scale-150 group-hover:scale-[1.6] transition-transform duration-[1.5s]">
          <Scissors className="h-64 w-64" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl border border-indigo-500">
              <Scissors className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Customization Hub P3</p>
                <Badge className="bg-white/10 text-white/80 border-none text-[9px] uppercase tracking-wider font-bold h-5 shadow-inner">Beta</Badge>
              </div>
              <h1 className="text-base font-bold uppercase tracking-tight leading-none">Управление пошивом</h1>
              <p className="text-[11px] text-white/40 font-bold uppercase mt-4 tracking-wider flex items-center gap-3">
                <span>Активных заказов: <span className="text-indigo-400">148</span></span>
                <span className="h-1 w-1 bg-white/20 rounded-full" />
                <span>Очередь: <span className="text-emerald-400">12 дней</span></span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button className="bg-white text-slate-900 hover:bg-slate-50 rounded-xl h-11 px-6 text-[10px] font-bold uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02]" asChild>
                <Link href="/brand/customization/patterns">Библиотека лекал</Link>
             </Button>
             <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl h-11 px-6 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md transition-all">
                Аналитика спроса
             </Button>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Средний чек", value: "54 200 ₽", sub: "+12% vs RTW", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Точность посадки", value: "98.4%", sub: "AI Scanner", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "В очереди", value: "42", sub: "За 24 часа", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Проблемные", value: "3", sub: "Требуют правок", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((stat, i) => (
          <Card key={i} className="border border-slate-100 shadow-sm bg-white rounded-xl p-4 group hover:border-indigo-200 transition-all">
            <div className="flex justify-between items-start mb-3">
              <div className={cn("p-2 rounded-lg shadow-sm border border-slate-50 transition-transform group-hover:scale-105", stat.bg)}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
              <Badge variant="outline" className="text-[9px] font-bold uppercase border-slate-100 text-slate-400">Live</Badge>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h4 className="text-base font-bold text-slate-900 tracking-tight">{stat.value}</h4>
                <p className={cn("text-[9px] font-bold uppercase px-1 rounded", stat.sub.includes('+') ? "text-emerald-600 bg-emerald-50" : "text-slate-400 bg-slate-50")}>{stat.sub}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="lg:col-span-3 border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden">
          <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700">Реестр спецзаказов</CardTitle>
                <CardDescription className="text-[11px] font-medium text-slate-400 mt-0.5">Очередь производства на основе 3D-мерок</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input 
                    placeholder="Поиск клиента или ID..." 
                    className="pl-9 h-8 w-48 rounded-lg bg-white border-slate-200 text-[11px] font-medium focus:ring-1 focus:ring-indigo-500 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50">
                  <Filter className="h-3.5 w-3.5 text-slate-500" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-none hover:bg-transparent h-10">
                  <TableHead className="pl-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">Заказ / Дата</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Клиент</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Модель</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Конфигурация</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Готовность</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Сумма</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Статус</TableHead>
                  <TableHead className="pr-6 text-right h-10 text-slate-400"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_CUSTOM_ORDERS.map((order) => (
                  <TableRow key={order.id} className="border-b border-slate-50 group hover:bg-slate-50/50 transition-all h-10">
                    <TableCell className="pl-6">
                      <div>
                        <p className="text-[12px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{order.id}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[12px] font-bold text-slate-700">{order.clientName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[12px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{order.productName}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {order.selectedOptions.map((opt, i) => (
                          <Badge key={i} className="bg-slate-50 text-slate-500 border-slate-100 text-[9px] font-bold px-1.5 h-4.5 rounded shadow-sm">
                            {opt.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span className="text-[11px] font-bold text-slate-600 tabular-nums">{new Date(order.estimatedDelivery).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[12px] font-bold text-slate-900 tabular-nums">{order.totalPrice.toLocaleString('ru-RU')} ₽</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-[9px] font-bold uppercase px-2 h-5 shadow-sm border-none", getStatusColor(order.status))}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-7 w-7 p-0 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all">
                            <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl p-1.5 w-48 bg-white">
                          <DropdownMenuItem className="rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2 cursor-pointer h-8">
                            <Maximize2 className="h-3.5 w-3.5" /> Детали заказа
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2 cursor-pointer h-8">
                            <Scissors className="h-3.5 w-3.5" /> Генерировать лекала
                          </DropdownMenuItem>
                          <div className="h-px bg-slate-50 my-1" />
                          <DropdownMenuItem className="rounded-lg text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-2 cursor-pointer h-8">
                            <AlertCircle className="h-3.5 w-3.5" /> Отменить заказ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 bg-slate-50/50 flex justify-center border-t border-slate-100">
               <Button variant="ghost" className="rounded-lg border border-slate-200 bg-white text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 hover:shadow-sm transition-all h-8 px-6">
                  Загрузить еще
               </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
