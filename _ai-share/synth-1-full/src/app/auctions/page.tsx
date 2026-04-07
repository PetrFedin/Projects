'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Gavel, 
  Search, 
  Filter, 
  Clock, 
  Users, 
  TrendingUp, 
  PlusCircle,
  ArrowRight,
  Box,
  Factory,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  Brain
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockAuctions } from '@/lib/auction-data';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIState } from '@/providers/ui-state';
import type { Auction } from '@/lib/types';

export default function PublicAuctionsPage() {
  const { viewRole, user } = useUIState();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeType, setActiveType] = React.useState<'all' | 'production' | 'materials' | 'collaboration' | 'services'>('all');
  const [activeStatus, setActiveStatus] = React.useState<'all' | 'active' | 'completed'>('all');

  const role = user?.activeOrganizationId?.includes('org-brand') ? 'brand' : 
               user?.activeOrganizationId?.includes('org-factory') ? 'factory' :
               user?.activeOrganizationId?.includes('org-shop') ? 'shop' : 'client';

  const filteredAuctions = mockAuctions.filter(auc => {
    const matchesSearch = auc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         auc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeType === 'all' || auc.type === activeType;
    const matchesStatus = activeStatus === 'all' || auc.status === activeStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-4 lg:p-4 font-sans animate-in fade-in duration-300">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20">
                <Gavel className="h-6 w-6 text-white" />
              </div>
              <Badge variant="outline" className="text-[10px] border-slate-900/20 text-slate-900 bg-slate-900/5 uppercase font-black tracking-widest px-3 py-1">
                B2B Exchange
              </Badge>
            </div>
            <h1 className="text-sm md:text-base font-black uppercase tracking-tighter text-slate-900">
              {viewRole === 'b2b' ? (role === 'factory' ? 'Тендеры на мощности' : 'Аукционы') : 'Аукционы'}
            </h1>
            <p className="text-slate-400 font-medium max-w-xl text-sm">
              {viewRole === 'b2b' 
                ? (role === 'factory' 
                    ? 'Получайте заказы от брендов и оптимизируйте загрузку своих цехов через прозрачную систему ставок.' 
                    : 'Размещайте заказы и получайте лучшие предложения от проверенных производств.')
                : 'Размещайте заказы и получайте лучшие предложения от проверенных поставщиков и производств.'}
            </p>
          </div>
          {viewRole === 'b2b' && (role === 'brand' || role === 'shop') && (
            <Button asChild className="rounded-2xl h-12 px-10 bg-slate-900 text-white font-black uppercase text-xs tracking-widest shadow-2xl shadow-slate-900/20 hover:bg-black transition-all group">
              <Link href="/brand/auctions">
                Создать лот <PlusCircle className="ml-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
              </Link>
            </Button>
          )}
        </div>

        {/* Stats / Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="rounded-xl border-none shadow-xl bg-white p-4 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <TrendingUp className="h-24 w-24" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Объем сделок</p>
            <h3 className="text-base font-black text-slate-900 tracking-tighter">158.4M ₽</h3>
          </Card>
          <Card className="rounded-xl border-none shadow-xl bg-white p-4 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Users className="h-24 w-24" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Активных участников</p>
            <h3 className="text-base font-black text-slate-900 tracking-tighter">4,850 <span className="text-sm font-bold text-slate-400 tracking-normal uppercase">профи</span></h3>
          </Card>
          <Card className="rounded-xl border-none shadow-xl bg-indigo-600 text-white p-4 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="h-24 w-24" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200 mb-1">Коллаборации</p>
            <h3 className="text-base font-black tracking-tighter">Influencer Ads</h3>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl shadow-lg border border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-xl">
              {(['all', 'production', 'materials', 'collaboration', 'services'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                    activeType === type ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {type === 'all' ? 'Все типы' : type === 'production' ? 'Производство' : type === 'materials' ? 'Сырье' : type === 'collaboration' ? 'Коллаборации' : 'Услуги'}
                </button>
              ))}
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-xl">
              {(['all', 'active', 'completed'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveStatus(status)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                    activeStatus === status ? "bg-white text-slate-950 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {status === 'all' ? 'Все' : status === 'active' ? 'Активные' : 'Завершенные'}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <Input 
              placeholder="Поиск по тендерам..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-12 rounded-xl border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-widest focus:bg-white focus:ring-slate-900 transition-all"
            />
          </div>
        </div>

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredAuctions.map((auc, idx) => {
              const bestBid = auc.bids.length > 0 ? auc.bids.reduce((prev, curr) => (prev.amount < curr.amount ? prev : curr)) : null;
              
              return (
                <motion.div
                  key={auc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="rounded-xl border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-white overflow-hidden group flex flex-col h-full">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image src={auc.image || ""} alt={auc.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className={cn(
                          "uppercase font-black text-[8px] tracking-[0.1em] px-3 py-1 border-none shadow-lg",
                          auc.type === 'production' ? "bg-blue-600 text-white" : 
                          auc.type === 'materials' ? "bg-emerald-600 text-white" : 
                          auc.type === 'collaboration' ? "bg-purple-600 text-white" :
                          "bg-amber-600 text-white"
                        )}>
                          {auc.type === 'production' ? 'Производство' : auc.type === 'materials' ? 'Закупка сырья' : auc.type === 'collaboration' ? 'Коллаборация' : 'Услуги профи'}
                        </Badge>
                        {auc.influencerData && (
                          <Badge className="bg-white/90 text-slate-900 border-none uppercase text-[8px] font-black tracking-widest px-2 backdrop-blur-md">
                            ER: {auc.influencerData.er}%
                          </Badge>
                        )}
                      </div>

                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">{auc.brandName}</p>
                        <h3 className="text-base font-black uppercase tracking-tight leading-tight line-clamp-2">{auc.title}</h3>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-6 flex-1">
                      {auc.type === 'collaboration' ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <span className="flex items-center gap-1.5"><Users className="h-3 w-3" /> {auc.influencerData?.followers.toLocaleString('ru-RU')} подп.</span>
                            <span className="h-1 w-1 rounded-full bg-slate-200" />
                            <span className="flex items-center gap-1.5 text-indigo-600"><Zap className="h-3 w-3 fill-current" /> {auc.influencerData?.realAudienceScore}% live</span>
                          </div>
                          
                          <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-3 italic">
                            "{auc.description}"
                          </p>

                          <div className="bg-purple-50/50 rounded-2xl p-4 space-y-3 border border-purple-100/50">
                            <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-purple-600">
                              <Brain className="h-3.5 w-3.5" /> AI Match Analysis
                            </div>
                            <p className="text-[10px] font-bold text-slate-600 leading-relaxed">
                              {auc.aiSmartAdvisor?.matchAnalysis}
                            </p>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[8px] font-black uppercase text-slate-400">Relevance Score</span>
                              <span className="text-xs font-black text-purple-600">{auc.aiSmartAdvisor?.relevanceScore}%</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-3 italic">
                            "{auc.description}"
                          </p>

                          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                            <div className="space-y-1">
                              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Current Best Bid</p>
                              <p className="text-sm font-black text-slate-900">
                                {bestBid ? `${bestBid.amount.toLocaleString('ru-RU')} ₽` : 'No Bids'}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Target Volume</p>
                              <p className="text-sm font-black text-slate-900">{auc.targetQuantity?.toLocaleString('ru-RU')} ед.</p>
                            </div>
                          </div>
                        </>
                      )}

                      {auc.type !== 'collaboration' && (
                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-slate-300" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{auc.bids.length} Participants</span>
                          </div>
                          <div className="flex items-center gap-2 text-rose-500">
                            <Clock className="h-4 w-4 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">2d 14h left</span>
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      <Button asChild className={cn(
                        "w-full h-10 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest group shadow-xl transition-all",
                        auc.type === 'collaboration' ? "bg-purple-600 hover:bg-purple-700 shadow-purple-900/10" : "bg-slate-900 hover:bg-black shadow-slate-900/10"
                      )}>
                        <Link href={`/auctions/${auc.id}`}>
                          {auc.type === 'collaboration' ? 'Обсудить коллаборацию' : 'Сделать ставку'} 
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredAuctions.length === 0 && (
          <div className="py-10 text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
              <Search className="h-10 w-10 text-slate-300" />
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-black uppercase tracking-tight text-slate-900">Ничего не найдено</h4>
              <p className="text-slate-400 font-medium">Попробуйте изменить параметры фильтрации или поисковый запрос.</p>
            </div>
            <Button variant="outline" className="rounded-xl h-12" onClick={() => { setSearchQuery(''); setActiveType('all'); setActiveStatus('all'); }}>
              Сбросить фильтры
            </Button>
          </div>
        )}

        {/* CTA Banner for Partners */}
        <Card className="rounded-xl border-none shadow-2xl bg-slate-900 text-white p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Factory className="h-64 w-64 rotate-12" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <Badge className="bg-accent text-white border-none uppercase text-[10px] font-black tracking-widest px-3">For Manufacturers & Suppliers</Badge>
            <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter leading-tight">Ваши мощности простаивают?</h2>
            <p className="text-sm font-bold text-white/60 leading-relaxed">
              Присоединяйтесь к экосистеме Syntha в качестве партнера. Получайте доступ к заказам от ведущих брендов, используйте AI для оценки своих ставок и растите вместе с нами.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="h-12 px-10 rounded-2xl bg-accent text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-accent/20 transition-all">Стать партнером</Button>
              <Button variant="ghost" className="h-12 px-10 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/5 border border-white/10">Как это работает</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
