'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Gavel, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Search,
  Zap,
  Filter,
  Eye,
  Handshake,
  LayoutGrid
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockAuctions } from '@/lib/auction-data';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { SlotAuction } from '@/components/factory/slot-auction';

export default function FactoryAuctionsPage() {
  const factoryId = 'fact-1';
  
  // Find auctions where this factory has participated
  const myBids = mockAuctions.flatMap(auc => 
    auc.bids
      .filter(bid => bid.bidderId === factoryId)
      .map(bid => ({ ...bid, auction: auc }))
  );

  return (
    <div className="space-y-10 p-4 md:p-4 bg-slate-50/50 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Bid Hub v1.0</h2>
          </div>
          <h1 className="text-sm font-black uppercase tracking-tighter text-slate-900">Мои ставки и Тендеры</h1>
        </div>
        <Button asChild className="bg-white text-slate-400 border border-slate-200 h-10 px-8 min-w-[200px] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2 group/btn hover:bg-black hover:text-white hover:border-black hover:button-glimmer hover:button-professional hover:shadow-xl shadow-slate-900/10">
          <Link href="/search?category=tenders">
            <Search className="mr-2 h-4 w-4 transition-transform group-hover/btn:scale-110" /> Найти новый тендер
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card className="rounded-xl border-none shadow-xl bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Всего участий</p>
          <h3 className="text-base font-black text-slate-900 tracking-tighter">{myBids.length}</h3>
        </Card>
        <Card className="rounded-xl border-none shadow-xl bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Активно лидируем</p>
          <h3 className="text-base font-black text-green-500 tracking-tighter">
            {myBids.filter(b => b.status === 'leading').length}
          </h3>
        </Card>
        <Card className="rounded-xl border-none shadow-xl bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Вас перебили</p>
          <h3 className="text-base font-black text-rose-500 tracking-tighter">
            {myBids.filter(b => b.status === 'outbid').length}
          </h3>
        </Card>
        <Card className="rounded-xl border-none shadow-xl bg-white p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Принято офферов</p>
          <h3 className="text-base font-black text-blue-600 tracking-tighter">12</h3>
        </Card>
      </div>

      <Card className="rounded-xl border-none shadow-2xl bg-white overflow-hidden border-none">
        <CardHeader className="p-4 border-b border-slate-50 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutGrid className="h-4 w-4 text-slate-400" />
            <CardTitle className="text-base font-black uppercase tracking-tight">Активность в тендерах</CardTitle>
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
                <TableHead className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Аукцион / Заказчик</TableHead>
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Ваша ставка</TableHead>
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Статус ставки</TableHead>
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">AI Score</TableHead>
                <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Окончание</TableHead>
                <TableHead className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myBids.map((bid) => (
                <TableRow key={bid.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                  <TableCell className="px-8 py-6">
                    <div>
                      <p className="font-bold text-slate-900 uppercase tracking-tight">{bid.auction.title}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{bid.auction.brandName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 font-black text-sm text-slate-900">
                    {bid.amount.toLocaleString('ru-RU')} ₽
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge className={cn(
                      "text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 border-none shadow-sm",
                      bid.status === 'leading' ? "bg-green-500 text-white" : 
                      bid.status === 'outbid' ? "bg-rose-500 text-white" : "bg-blue-500 text-white"
                    )}>
                      {bid.status === 'leading' ? 'Лидируете' : bid.status === 'outbid' ? 'Перебито' : bid.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6">
                    {bid.aiAnalysis && (
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-slate-900">{bid.aiAnalysis.reliabilityScore}%</span>
                        <span className={cn(
                          "text-[7px] font-black uppercase tracking-widest",
                          bid.aiAnalysis.riskLevel === 'low' ? "text-green-500" : "text-amber-500"
                        )}>
                          Risk: {bid.aiAnalysis.riskLevel}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs font-bold uppercase">{new Date(bid.auction.endDate).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100">
                        <Link href={`/auctions/${bid.auctionId}`}><Eye className="h-4 w-4 text-slate-400"/></Link>
                      </Button>
                      <Button variant="outline" size="sm" className="h-10 rounded-xl border-slate-100 text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                        Обновить ставку
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <SlotAuction />

      <Card className="rounded-xl border-none shadow-2xl bg-blue-600 text-white p-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Handshake className="h-48 w-48 rotate-12" />
        </div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-3 items-center">
          <div>
            <Badge className="bg-white/20 text-white border-none uppercase text-[10px] font-black tracking-widest mb-4 px-3">Growth Opportunity</Badge>
            <h4 className="text-base font-black uppercase tracking-tighter leading-tight mb-6">Получите статус 'Priority Factory'</h4>
            <p className="text-sm font-bold text-white/80 leading-relaxed mb-8 max-w-md">
              Ваш текущий AI Score надежности: 92%. Выполните еще 2 заказа в срок, чтобы попасть в топ-рейтинг Syntha и получать эксклюзивные приглашения в закрытые тендеры.
            </p>
            <Button className="bg-white text-blue-600 hover:bg-slate-50 border-none rounded-2xl h-10 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl transition-all">Узнать условия</Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-3xl bg-white/10 border border-white/10 backdrop-blur-md">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Наш рейтинг</p>
              <p className="text-sm font-black">#4 в Москве</p>
            </div>
            <div className="p-4 rounded-3xl bg-white/10 border border-white/10 backdrop-blur-md">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">Win Rate</p>
              <p className="text-sm font-black">24%</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
