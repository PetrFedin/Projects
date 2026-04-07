'use client';

import * as React from 'react';
import { 
  Gavel, 
  Users, 
  TrendingUp, 
  Search, 
  Filter, 
  Eye, 
  MoreHorizontal, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  Bot,
  ArrowUpRight,
  ShieldAlert,
  Archive,
  Factory,
  Box,
  Shirt,
  Scissors,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { mockAuctions } from '@/lib/auction-data';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminAuctionsPage() {
  const [filter, setFilter] = React.useState<'all' | 'production' | 'materials' | 'collaboration'>('all');
  const [search, setSearch] = React.useState('');

  const filteredAuctions = mockAuctions.filter(auc => {
    const matchesSearch = auc.title.toLowerCase().includes(search.toLowerCase()) || 
                         auc.brandName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || auc.type === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { label: "Всего аукционов", value: "1,240", icon: Gavel, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Активные торги", value: "48", icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { label: "Общий GMV", value: "42.5M ₽", icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "AI Оптимизация", value: "14.2%", icon: Bot, color: "text-accent", bg: "bg-accent/10" },
  ];

  return (
    <div className="space-y-4">
      {/* Admin Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-3xl border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                <p className="text-sm font-black text-slate-900 tracking-tighter">{stat.value}</p>
              </div>
              <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-xl border-none shadow-xl bg-white overflow-hidden">
        <CardHeader className="p-4 border-b border-slate-50 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-tight">Глобальный мониторинг аукционов</CardTitle>
              <p className="text-sm font-medium text-slate-400 mt-1">Управление всеми B2B-запросами на платформе</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl border-slate-100 text-[10px] font-black uppercase tracking-widest">
                <Archive className="mr-2 h-4 w-4" /> Архив
              </Button>
              <Button className="rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                Экспорт отчета
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-50 p-4 rounded-2xl">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {(['all', 'production', 'materials', 'collaboration'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0",
                    filter === t ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {t === 'all' ? 'Все лоты' : t === 'production' ? 'Пошив/Кройка' : t === 'materials' ? 'Сырье/Фурнитура' : 'Коллаборации'}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Поиск по бренду или названию..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-12 rounded-xl border-white bg-white text-[10px] font-bold uppercase tracking-widest focus:ring-slate-900"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none">
                <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Тип / Категория</TableHead>
                <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Бренд / Заказчик</TableHead>
                <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Название лота</TableHead>
                <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Ставок</TableHead>
                <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Лимит цены</TableHead>
                <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Статус системы</TableHead>
                <TableHead className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Контроль</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAuctions.map((auc) => (
                <TableRow key={auc.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm",
                        auc.type === 'production' ? "bg-blue-50" : 
                        auc.type === 'materials' ? "bg-emerald-50" : "bg-purple-50"
                      )}>
                        {auc.type === 'production' ? <Scissors className="h-5 w-5 text-blue-600" /> : 
                         auc.type === 'materials' ? <Box className="h-5 w-5 text-emerald-600" /> : <Sparkles className="h-5 w-5 text-purple-600" />}
                      </div>
                      <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-100">
                        {auc.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 uppercase text-xs">{auc.brandName}</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: {auc.brandId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 max-w-xs">
                    <p className="font-bold text-slate-700 text-xs line-clamp-1">{auc.title}</p>
                    <p className="text-[9px] font-medium text-slate-400 line-clamp-1 italic">{auc.category}</p>
                  </TableCell>
                  <TableCell className="py-6 text-center">
                    <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-slate-900 font-black text-xs">
                      {auc.bids.length}
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <span className="font-bold text-slate-900 text-xs">
                      {auc.targetPrice ? `${auc.targetPrice.toLocaleString('ru-RU')} ₽` : 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-1.5 w-1.5 rounded-full", auc.status === 'active' ? "bg-green-500 animate-pulse" : "bg-slate-300")} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{auc.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100">
                        <Link href={`/auctions/${auc.id}`}><Eye className="h-4 w-4 text-slate-400"/></Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100"><MoreHorizontal className="h-4 w-4 text-slate-400"/></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 shadow-2xl p-2 w-56">
                          <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-[10px] font-black uppercase tracking-widest cursor-pointer flex items-center gap-2">
                            <ShieldAlert className="h-4 w-4 text-rose-500" /> Проверить заявки
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-[10px] font-black uppercase tracking-widest cursor-pointer flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" /> Верифицировать лот
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-50" />
                          <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-[10px] font-black uppercase tracking-widest cursor-pointer text-red-500 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4" /> Приостановить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-slate-50/50 p-4 border-t border-slate-100 flex justify-between items-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Система управления торгами v4.2.0-stable</p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Показать: 20 из 1240</span>
            <div className="flex gap-1">
              {[1, 2, 3].map(p => (
                <button key={p} className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-black", p === 1 ? "bg-slate-900 text-white" : "bg-white text-slate-500 border border-slate-100")}>{p}</button>
              ))}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
