'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  Gavel, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  MoreHorizontal,
  Eye,
  Trash2,
  ArrowRight,
  Filter,
  BarChart3,
  Bot,
  Brain,
  ShieldCheck,
  Zap,
  Target,
  History,
  Search
} from 'lucide-react';
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
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getAuctionLinks } from '@/lib/data/entity-links';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export default function BrandAuctionsPage() {
  const brandAuctions = mockAuctions.filter(a => a.brandId === 'syntha');

  const priceForecasts = [
    { category: "Пальто (Кашемир)", current: 4500, forecast: 4200, trend: "down" },
    { category: "Джинсы (Деним)", current: 1800, forecast: 1950, trend: "up" },
    { category: "Трикотаж", current: 2200, forecast: 2150, trend: "stable" },
  ];

  const trustedPartners = [
    { name: "Фабрика #1 (Москва)", score: 98, rating: 4.9, tags: ["Premium", "Reliable"] },
    { name: "Текстиль Плюс", score: 95, rating: 4.8, tags: ["Speed", "Eco"] },
  ];

  return (
    <div className="space-y-10 p-4 md:p-4 bg-slate-50/50 min-h-screen font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20">
              <Gavel className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Auction Manager PRO v2.0</h2>
          </div>
          <h1 className="text-sm font-black uppercase tracking-tighter text-slate-900">Управление закупками</h1>
        </div>
        <Button asChild className="bg-white text-slate-400 border border-slate-200 h-10 px-8 min-w-[200px] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 group/btn hover:bg-black hover:text-white hover:border-black hover:button-glimmer hover:button-professional hover:shadow-xl shadow-slate-900/10">
          <Link href="/brand/auctions/new">
            <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover/btn:scale-110" /> Создать новый тендер
          </Link>
        </Button>
      </div>

      {/* Strategic Insights Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        
        {/* AI Price Forecast */}
        <Card className="rounded-xl border-none shadow-2xl bg-slate-950 text-white p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Bot className="h-32 w-32 rotate-12" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-accent" />
              <h3 className="text-sm font-black uppercase tracking-widest leading-none">AI Price Forecast</h3>
            </div>
            <div className="space-y-4">
              {priceForecasts.map((f, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{f.category}</p>
                    <p className="text-sm font-bold">{f.forecast.toLocaleString('ru-RU')} ₽ <span className="text-[10px] text-white/20 font-medium">/ unit</span></p>
                  </div>
                  <Badge className={cn(
                    "text-[8px] font-black border-none px-2",
                    f.trend === 'down' ? "bg-green-500" : f.trend === 'up' ? "bg-rose-500" : "bg-blue-500"
                  )}>
                    {f.trend === 'down' ? '-7%' : f.trend === 'up' ? '+8%' : 'STABLE'}
                  </Badge>
                </div>
              ))}
            </div>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest italic text-center">Прогноз на основе 12,000 закрытых лотов</p>
          </div>
        </Card>

        {/* Trusted Partners */}
        <Card className="rounded-xl border-none shadow-2xl bg-white p-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-black uppercase tracking-widest leading-none text-slate-900">Top Rated Partners</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {trustedPartners.map((p, i) => (
                <div key={i} className="flex items-center gap-3 group cursor-pointer p-2 rounded-2xl hover:bg-slate-50 transition-all">
                  <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    {p.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black uppercase tracking-tight text-slate-900">{p.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-2.5 w-2.5 text-green-500" />
                        <span className="text-[9px] font-black text-green-600 uppercase">{p.score}% Reliability</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[8px] font-black tracking-widest uppercase border-slate-100">{p.rating}★</Badge>
                </div>
              ))}
            </div>
            <Button className="w-full h-12 rounded-xl bg-slate-50 text-slate-900 hover:bg-slate-100 border-none text-[9px] font-black uppercase tracking-widest mt-2">Весь каталог производств</Button>
          </div>
        </Card>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 gap-3">
          <Card className="rounded-xl border-none shadow-lg bg-white p-4 flex items-center justify-between group overflow-hidden">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Active Tenders</p>
              <h3 className="text-base font-black text-slate-900 tracking-tighter">{brandAuctions.length}</h3>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6 text-indigo-600" />
            </div>
          </Card>
          <Card className="rounded-xl border-none shadow-lg bg-white p-4 flex items-center justify-between group overflow-hidden">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Projected Savings</p>
              <h3 className="text-base font-black text-green-500 tracking-tighter">14.2%</h3>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="h-6 w-6 text-white" />
            </div>
          </Card>
        </div>
      </div>

      {/* Main Auctions Table */}
      <Card className="rounded-xl border-none shadow-2xl bg-white overflow-hidden border-none">
        <CardHeader className="p-4 border-b border-slate-50 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-slate-400" />
            <CardTitle className="text-base font-black uppercase tracking-tight">Ваши активные запросы</CardTitle>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input placeholder="Поиск по тендеру..." className="h-10 w-64 pl-9 rounded-xl border-slate-100 text-[10px] font-bold" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Название / SKU</TableHead>
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Статус</TableHead>
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Заявки</TableHead>
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Target Price</TableHead>
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Best Bid</TableHead>
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Прогноз экономии</TableHead>
                <TableHead className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brandAuctions.map((auc) => {
                const bestBid = auc.bids.length > 0 ? auc.bids.reduce((prev, curr) => (prev.amount < curr.amount ? prev : curr)) : null;
                const savings = bestBid ? Math.round(((auc.targetPrice - bestBid.amount) / auc.targetPrice) * 100) : 0;
                
                return (
                  <TableRow key={auc.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                          <Image src={auc.image || ""} alt={auc.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 uppercase tracking-tight">{auc.title}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{auc.category}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <Badge className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 border-none shadow-sm",
                        auc.status === 'active' ? "bg-green-500 text-white animate-pulse" : "bg-slate-200 text-slate-500"
                      )}>
                        {auc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-slate-300" />
                        <span className="text-sm font-bold text-slate-900">{auc.bids.length}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 font-bold text-slate-400 text-sm">
                      {auc.targetPrice.toLocaleString('ru-RU')} ₽
                    </TableCell>
                    <TableCell className="py-6">
                      {bestBid ? (
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900">{bestBid.amount.toLocaleString('ru-RU')} ₽</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">by {bestBid.bidderName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300 font-bold uppercase tracking-widest">Нет заявок</span>
                      )}
                    </TableCell>
                    <TableCell className="py-6">
                      {savings > 0 ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-black text-green-600">-{savings}%</span>
                          <Progress value={savings} className="h-1 w-12 bg-slate-100" />
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300 font-bold uppercase">...</span>
                      )}
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
                          <DropdownMenuContent align="end" className="rounded-2xl border-slate-100 shadow-2xl p-2 w-48">
                            <DropdownMenuItem className="rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest cursor-pointer">Продлить срок</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest cursor-pointer">Изменить ТЗ</DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-50" />
                            <DropdownMenuItem className="rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest cursor-pointer text-red-500">Отменить аукцион</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-slate-50 p-4 px-8 flex justify-between items-center border-t border-slate-100">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-slate-400" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 italic">Последнее обновление системы: 5 минут назад</span>
          </div>
          <Button variant="ghost" className="text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900">Показать завершенные тендеры</Button>
        </CardFooter>
      </Card>

      <RelatedModulesBlock links={getAuctionLinks()} className="mt-6" />
    </div>
  );
}
