'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  QrCode, 
  Package, 
  RefreshCcw, 
  Search, 
  ArrowLeft, 
  Filter, 
  Download,
  AlertTriangle,
  CheckCircle2,
  Barcode,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function KizStockAccountingPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Mock Data for KIZ stock
  const stockItems = [
    { id: 'KIZ-9921-001', sku: 'TP-9921', name: 'Платье "Midnight"', size: 'M', status: 'In Stock', warehouse: 'Основной склад', date: '10.03.2026' },
    { id: 'KIZ-9921-002', sku: 'TP-9921', name: 'Платье "Midnight"', size: 'S', status: 'In Stock', warehouse: 'Основной склад', date: '10.03.2026' },
    { id: 'KIZ-8812-045', sku: 'TP-8812', name: 'Худи "Eco-Life"', size: 'L', status: 'Shipped', warehouse: 'Транзит', date: '08.03.2026' },
    { id: 'KIZ-7734-112', sku: 'TP-7734', name: 'Брюки "Cargo Pro"', size: 'XL', status: 'In Stock', warehouse: 'Склад Тверь', date: '05.03.2026' },
    { id: 'KIZ-1102-089', sku: 'TP-1102', name: 'Футболка "Base"', size: 'M', status: 'Returned', warehouse: 'Брак/Возврат', date: '01.03.2026' },
  ];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: "Синхронизация завершена",
        description: "Остатки КИЗ актуализированы с ГИС МТ.",
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-4 space-y-6 pb-24 max-w-6xl animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <Link href="/brand/compliance" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Compliance
            </Link>
            <span className="text-slate-300">/</span>
            <span>Складской учет КИЗ</span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-3">
            <QrCode className="w-7 h-7 text-indigo-600" />
            Складской учет КИЗ
          </h1>
          <p className="text-xs text-slate-500 font-medium">Мониторинг и синхронизация маркированных остатков в реальном времени</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleSync}
            disabled={isSyncing}
            variant="outline" 
            className="h-10 rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2 bg-white shadow-sm border-slate-200"
          >
            <RefreshCcw className={cn("w-4 h-4 text-indigo-600", isSyncing && "animate-spin")} />
            Синхронизировать с ГИС МТ
          </Button>
          <Button className="h-10 rounded-xl font-bold uppercase text-[10px] tracking-widest gap-2 bg-slate-900 text-white hover:bg-black shadow-lg">
            <Download className="w-4 h-4" />
            Выгрузить отчет
          </Button>
        </div>
      </header>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-none shadow-sm bg-white p-5 space-y-3 group hover:shadow-md transition-all">
          <div className="flex justify-between items-center">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><CheckCircle2 className="w-5 h-5" /></div>
            <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase">Active</Badge>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest leading-none mb-1">Всего на складе</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">12,450</p>
          </div>
        </Card>
        <Card className="rounded-2xl border-none shadow-sm bg-white p-5 space-y-3 group hover:shadow-md transition-all">
          <div className="flex justify-between items-center">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Package className="w-5 h-5" /></div>
            <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest leading-none">Shipping</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest leading-none mb-1">В пути / Транзит</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">3,150</p>
          </div>
        </Card>
        <Card className="rounded-2xl border-none shadow-sm bg-white p-5 space-y-3 group hover:shadow-md transition-all">
          <div className="flex justify-between items-center">
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><AlertTriangle className="w-5 h-5" /></div>
            <Badge className="bg-rose-50 text-rose-600 border-none text-[8px] font-black uppercase">Attention</Badge>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest leading-none mb-1">Брак КИЗ / Ошибки</p>
            <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">12</p>
          </div>
        </Card>
        <Card className="rounded-2xl border-none shadow-sm bg-indigo-600 text-white p-5 space-y-3 group hover:bg-indigo-700 transition-all cursor-pointer overflow-hidden relative">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform"><Barcode className="w-24 h-24" /></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-3">
              <div className="p-2 bg-white/10 rounded-lg"><RefreshCcw className="w-5 h-5" /></div>
              <ArrowUpRight className="w-4 h-4 opacity-50" />
            </div>
            <p className="text-[10px] font-bold uppercase text-indigo-100 tracking-widest leading-none mb-1">Последняя синхр.</p>
            <p className="text-sm font-black tracking-tight leading-none uppercase">Сегодня, 12:45</p>
          </div>
        </Card>
      </div>

      {/* Registry */}
      <Card className="rounded-2xl border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="px-6 py-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-800">Реестр КИЗ (Коды Маркировки)</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Детальный список всех кодов в системе</CardDescription>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Поиск по КИЗ или SKU..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-inner"
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-white border-slate-200 shadow-sm">
              <Filter className="w-4 h-4 text-slate-500" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-slate-100 h-12">
                <TableHead className="pl-6 text-[9px] font-black uppercase tracking-widest text-slate-400">Код (КИЗ)</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Артикул / Модель</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Размер</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Статус ГИС МТ</TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Локация</TableHead>
                <TableHead className="pr-6 text-[9px] font-black uppercase tracking-widest text-slate-400 text-right">Дата опер.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50 border-slate-50 transition-colors h-14">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-mono text-[11px] font-bold text-slate-900 tracking-tighter">{item.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-black text-[10px] text-slate-900 uppercase tracking-tight leading-none">{item.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{item.sku}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="h-5 px-2 rounded-md font-black text-[9px] border-slate-200 text-slate-600 bg-white">
                      {item.size}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "text-[8px] font-black uppercase px-2 h-5 border-none",
                      item.status === 'In Stock' ? "bg-emerald-50 text-emerald-600" :
                      item.status === 'Shipped' ? "bg-indigo-50 text-indigo-600" :
                      item.status === 'Returned' ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-600"
                    )}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{item.warehouse}</p>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <p className="text-[10px] font-bold text-slate-400">{item.date}</p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Empty State if needed */}
          {stockItems.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center">
                <Search className="h-8 w-8 text-slate-200" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black uppercase text-slate-900">Ничего не найдено</p>
                <p className="text-xs text-slate-400 max-w-xs">Попробуйте изменить параметры поиска или фильтры.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
