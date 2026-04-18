'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  ArrowUpRight,
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
    {
      id: 'KIZ-9921-001',
      sku: 'TP-9921',
      name: 'Платье "Midnight"',
      size: 'M',
      status: 'In Stock',
      warehouse: 'Основной склад',
      date: '10.03.2026',
    },
    {
      id: 'KIZ-9921-002',
      sku: 'TP-9921',
      name: 'Платье "Midnight"',
      size: 'S',
      status: 'In Stock',
      warehouse: 'Основной склад',
      date: '10.03.2026',
    },
    {
      id: 'KIZ-8812-045',
      sku: 'TP-8812',
      name: 'Худи "Eco-Life"',
      size: 'L',
      status: 'Shipped',
      warehouse: 'Транзит',
      date: '08.03.2026',
    },
    {
      id: 'KIZ-7734-112',
      sku: 'TP-7734',
      name: 'Брюки "Cargo Pro"',
      size: 'XL',
      status: 'In Stock',
      warehouse: 'Склад Тверь',
      date: '05.03.2026',
    },
    {
      id: 'KIZ-1102-089',
      sku: 'TP-1102',
      name: 'Футболка "Base"',
      size: 'M',
      status: 'Returned',
      warehouse: 'Брак/Возврат',
      date: '01.03.2026',
    },
  ];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: 'Синхронизация завершена',
        description: 'Остатки КИЗ актуализированы с ГИС МТ.',
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-4 pb-24 duration-500 animate-in fade-in">
      {/* Header */}
      <header className="flex flex-col items-start justify-between gap-4 border-b border-slate-100 pb-4 md:flex-row md:items-end">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <Link
              href="/brand/compliance"
              className="flex items-center gap-1 transition-colors hover:text-indigo-600"
            >
              <ArrowLeft className="h-3 w-3" /> Compliance
            </Link>
            <span className="text-slate-300">/</span>
            <span>Складской учет КИЗ</span>
          </div>
          <h1 className="flex items-center gap-3 text-2xl font-black uppercase tracking-tight text-slate-900">
            <QrCode className="h-7 w-7 text-indigo-600" />
            Складской учет КИЗ
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Мониторинг и синхронизация маркированных остатков в реальном времени
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleSync}
            disabled={isSyncing}
            variant="outline"
            className="h-10 gap-2 rounded-xl border-slate-200 bg-white text-[10px] font-bold uppercase tracking-widest shadow-sm"
          >
            <RefreshCcw className={cn('h-4 w-4 text-indigo-600', isSyncing && 'animate-spin')} />
            Синхронизировать с ГИС МТ
          </Button>
          <Button className="h-10 gap-2 rounded-xl bg-slate-900 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg hover:bg-black">
            <Download className="h-4 w-4" />
            Выгрузить отчет
          </Button>
        </div>
      </header>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="group space-y-3 rounded-2xl border-none bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <Badge className="border-none bg-emerald-50 text-[8px] font-black uppercase text-emerald-600">
              Active
            </Badge>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase leading-none tracking-widest text-slate-400">
              Всего на складе
            </p>
            <p className="text-2xl font-black leading-none tracking-tight text-slate-900">12,450</p>
          </div>
        </Card>
        <Card className="group space-y-3 rounded-2xl border-none bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Package className="h-5 w-5" />
            </div>
            <p className="text-[8px] font-black uppercase leading-none tracking-widest text-indigo-600">
              Shipping
            </p>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase leading-none tracking-widest text-slate-400">
              В пути / Транзит
            </p>
            <p className="text-2xl font-black leading-none tracking-tight text-slate-900">3,150</p>
          </div>
        </Card>
        <Card className="group space-y-3 rounded-2xl border-none bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <Badge className="border-none bg-rose-50 text-[8px] font-black uppercase text-rose-600">
              Attention
            </Badge>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase leading-none tracking-widest text-slate-400">
              Брак КИЗ / Ошибки
            </p>
            <p className="text-2xl font-black leading-none tracking-tight text-slate-900">12</p>
          </div>
        </Card>
        <Card className="group relative cursor-pointer space-y-3 overflow-hidden rounded-2xl border-none bg-indigo-600 p-5 text-white shadow-sm transition-all hover:bg-indigo-700">
          <div className="absolute right-0 top-0 p-2 opacity-10 transition-transform group-hover:scale-110">
            <Barcode className="h-24 w-24" />
          </div>
          <div className="relative z-10">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-lg bg-white/10 p-2">
                <RefreshCcw className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 opacity-50" />
            </div>
            <p className="mb-1 text-[10px] font-bold uppercase leading-none tracking-widest text-indigo-100">
              Последняя синхр.
            </p>
            <p className="text-sm font-black uppercase leading-none tracking-tight">
              Сегодня, 12:45
            </p>
          </div>
        </Card>
      </div>

      {/* Registry */}
      <Card className="overflow-hidden rounded-2xl border-none bg-white shadow-sm">
        <CardHeader className="flex flex-col items-center justify-between gap-4 border-b border-slate-50 bg-slate-50/30 px-6 py-6 md:flex-row">
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-800">
              Реестр КИЗ (Коды Маркировки)
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Детальный список всех кодов в системе
            </CardDescription>
          </div>
          <div className="flex w-full items-center gap-3 md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск по КИЗ или SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-xs font-medium shadow-inner outline-none transition-all focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-slate-200 bg-white shadow-sm"
            >
              <Filter className="h-4 w-4 text-slate-500" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="h-12 border-slate-100 hover:bg-transparent">
                <TableHead className="pl-6 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Код (КИЗ)
                </TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Артикул / Модель
                </TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Размер
                </TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Статус ГИС МТ
                </TableHead>
                <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Локация
                </TableHead>
                <TableHead className="pr-6 text-right text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Дата опер.
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockItems.map((item) => (
                <TableRow
                  key={item.id}
                  className="h-14 border-slate-50 transition-colors hover:bg-slate-50"
                >
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="font-mono text-[11px] font-bold tracking-tighter text-slate-900">
                        {item.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black uppercase leading-none tracking-tight text-slate-900">
                        {item.name}
                      </p>
                      <p className="text-[9px] font-bold uppercase leading-none tracking-widest text-slate-400">
                        {item.sku}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="h-5 rounded-md border-slate-200 bg-white px-2 text-[9px] font-black text-slate-600"
                    >
                      {item.size}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        'h-5 border-none px-2 text-[8px] font-black uppercase',
                        item.status === 'In Stock'
                          ? 'bg-emerald-50 text-emerald-600'
                          : item.status === 'Shipped'
                            ? 'bg-indigo-50 text-indigo-600'
                            : item.status === 'Returned'
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-slate-100 text-slate-600'
                      )}
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-[10px] font-bold uppercase tracking-tight text-slate-600">
                      {item.warehouse}
                    </p>
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
            <div className="flex flex-col items-center justify-center space-y-4 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
                <Search className="h-8 w-8 text-slate-200" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black uppercase text-slate-900">Ничего не найдено</p>
                <p className="max-w-xs text-xs text-slate-400">
                  Попробуйте изменить параметры поиска или фильтры.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
