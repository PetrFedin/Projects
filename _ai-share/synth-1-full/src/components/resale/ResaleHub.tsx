'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Recycle,
  ArrowUpRight,
  ShieldCheck,
  Tag,
  Zap,
  Sparkles,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  Camera,
  History,
  TrendingUp,
  Handshake,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { products as allProducts } from '@/lib/products';
import { useToast } from '@/hooks/use-toast';

export default function ResaleHub() {
  const { toast } = useToast();
  const [view, setView] = useState<'buy' | 'sell'>('buy');
  const [isListing, setIsListing] = useState(false);

  const resaleProducts = allProducts.slice(2, 8).map((p) => ({
    ...p,
    resalePrice: Math.round(p.price * 0.65),
    condition: ['Excellent', 'Great', 'Good'][Math.floor(Math.random() * 3)],
    verified: Math.random() > 0.3,
    owner: 'User_' + Math.floor(Math.random() * 1000),
  }));

  const myPurchases = allProducts.slice(0, 3).map((p) => ({
    ...p,
    purchaseDate: '12.05.2025',
    estimatedResale: Math.round(p.price * 0.7),
  }));

  const handleListForResale = (productId: string) => {
    setIsListing(true);
    setTimeout(() => {
      setIsListing(false);
      toast({
        title: 'Товар выставлен на продажу',
        description: 'AI подтвердил подлинность через DPP. Ваше объявление активно.',
      });
    }, 2000);
  };

  return (
    <div className="space-y-6 duration-700 animate-in fade-in">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-4">
          <Badge className="border-none bg-emerald-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
            Circularity & Resale 2.0
          </Badge>
<<<<<<< HEAD
          <h1 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900">
            Syntha <span className="italic text-emerald-500">Resale</span> Hub
          </h1>
          <p className="max-w-2xl text-sm font-medium text-slate-500">
=======
          <h1 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter">
            Syntha <span className="italic text-emerald-500">Resale</span> Hub
          </h1>
          <p className="text-text-secondary max-w-2xl text-sm font-medium">
>>>>>>> recover/cabinet-wip-from-stash
            Вторая жизнь ваших вещей. Верификация через блокчейн, автоматическая оценка состояния и
            безопасные сделки.
          </p>
        </div>
<<<<<<< HEAD
        <div className="flex shrink-0 rounded-2xl bg-slate-100 p-1.5">
=======
        <div className="bg-bg-surface2 flex shrink-0 rounded-2xl p-1.5">
>>>>>>> recover/cabinet-wip-from-stash
          <button
            onClick={() => setView('buy')}
            className={cn(
              'rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all',
              view === 'buy'
<<<<<<< HEAD
                ? 'bg-white text-slate-900 shadow-lg'
                : 'text-slate-500 hover:text-slate-900'
=======
                ? 'text-text-primary bg-white shadow-lg'
                : 'text-text-secondary hover:text-text-primary'
>>>>>>> recover/cabinet-wip-from-stash
            )}
          >
            Купить
          </button>
          <button
            onClick={() => setView('sell')}
            className={cn(
              'rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest transition-all',
              view === 'sell'
<<<<<<< HEAD
                ? 'bg-white text-slate-900 shadow-lg'
                : 'text-slate-500 hover:text-slate-900'
=======
                ? 'text-text-primary bg-white shadow-lg'
                : 'text-text-secondary hover:text-text-primary'
>>>>>>> recover/cabinet-wip-from-stash
            )}
          >
            Продать
          </button>
        </div>
      </header>

      {view === 'buy' ? (
        <div className="grid gap-3 lg:grid-cols-12">
          {/* Filters & Search */}
          <div className="space-y-4 lg:col-span-3">
            <div className="space-y-4">
<<<<<<< HEAD
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                Поиск по ресейлу
              </h3>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Найти бренд или модель..."
                  className="h-12 w-full rounded-2xl border-2 border-slate-50 bg-white pl-12 pr-4 text-sm font-bold outline-none transition-all focus:border-emerald-500"
=======
              <h3 className="text-text-muted text-sm font-black uppercase tracking-widest">
                Поиск по ресейлу
              </h3>
              <div className="relative">
                <Search className="text-text-muted absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Найти бренд или модель..."
                  className="border-border-subtle h-12 w-full rounded-2xl border-2 bg-white pl-12 pr-4 text-sm font-bold outline-none transition-all focus:border-emerald-500"
>>>>>>> recover/cabinet-wip-from-stash
                />
              </div>
            </div>

<<<<<<< HEAD
            <Card className="rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl">
=======
            <Card className="bg-text-primary rounded-xl border-none p-4 text-white shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
              <Sparkles className="mb-6 h-8 w-8 text-emerald-400" />
              <h3 className="mb-4 text-base font-black uppercase italic leading-tight tracking-tight">
                AI Price Analytics
              </h3>
<<<<<<< HEAD
              <p className="mb-6 text-[10px] font-bold uppercase leading-relaxed tracking-widest text-slate-400">
=======
              <p className="text-text-muted mb-6 text-[10px] font-bold uppercase leading-relaxed tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Текущий рынок ресейла на 15% ниже, чем в прошлом месяце. Идеальное время для покупки
                люкса.
              </p>
              <Button className="h-12 w-full rounded-xl bg-emerald-500 text-[9px] font-black uppercase tracking-widest text-white hover:bg-emerald-600">
                Посмотреть отчет <TrendingUp className="ml-2 h-4 w-4" />
              </Button>
            </Card>

            <div className="space-y-6">
<<<<<<< HEAD
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
=======
              <h3 className="text-text-muted text-sm font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                Состояние
              </h3>
              <div className="space-y-2">
                {['New with Tags', 'Excellent', 'Very Good', 'Good'].map((cond) => (
                  <label key={cond} className="group flex cursor-pointer items-center gap-3">
<<<<<<< HEAD
                    <div className="h-5 w-5 rounded-md border-2 border-slate-100 transition-all group-hover:border-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-tight text-slate-600">
=======
                    <div className="border-border-subtle h-5 w-5 rounded-md border-2 transition-all group-hover:border-emerald-500" />
                    <span className="text-text-secondary text-xs font-bold uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                      {cond}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-9">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {resaleProducts.map((item) => (
                <Card
                  key={item.id}
                  className="group overflow-hidden rounded-xl border-none bg-white shadow-xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={item.images[0].url}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute left-4 top-4 flex gap-2">
<<<<<<< HEAD
                      <Badge className="border-none bg-white/90 px-2 py-1 text-[8px] font-black uppercase text-slate-900 backdrop-blur-md">
=======
                      <Badge className="text-text-primary border-none bg-white/90 px-2 py-1 text-[8px] font-black uppercase backdrop-blur-md">
>>>>>>> recover/cabinet-wip-from-stash
                        {item.condition}
                      </Badge>
                      {item.verified && (
                        <Badge className="flex items-center gap-1 border-none bg-emerald-500 px-2 py-1 text-[8px] font-black uppercase text-white">
                          <ShieldCheck className="h-3 w-3" /> DPP Verified
                        </Badge>
                      )}
                    </div>
<<<<<<< HEAD
                    <button className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow-lg backdrop-blur-md transition-all hover:text-emerald-500">
=======
                    <button className="text-text-muted absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-md transition-all hover:text-emerald-500">
>>>>>>> recover/cabinet-wip-from-stash
                      <Tag className="h-4 w-4" />
                    </button>
                  </div>
                  <CardContent className="space-y-4 p-4">
                    <div>
<<<<<<< HEAD
                      <p className="mb-1 text-[10px] font-black uppercase text-slate-400">
=======
                      <p className="text-text-muted mb-1 text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                        {item.brand}
                      </p>
                      <h4 className="truncate text-sm font-black uppercase leading-none tracking-tight">
                        {item.name}
                      </h4>
                    </div>
<<<<<<< HEAD
                    <div className="flex items-end justify-between border-t border-slate-50 pt-4">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black uppercase text-slate-400 line-through">
                          {item.price.toLocaleString('ru-RU')} ₽
                        </p>
                        <p className="text-sm font-black text-slate-900">
                          {item.resalePrice.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                      <Button className="h-10 rounded-xl bg-slate-900 px-6 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-emerald-600">
=======
                    <div className="border-border-subtle flex items-end justify-between border-t pt-4">
                      <div className="space-y-1">
                        <p className="text-text-muted text-[8px] font-black uppercase line-through">
                          {item.price.toLocaleString('ru-RU')} ₽
                        </p>
                        <p className="text-text-primary text-sm font-black">
                          {item.resalePrice.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                      <Button className="bg-text-primary h-10 rounded-xl px-6 text-[9px] font-black uppercase tracking-widest text-white transition-all hover:bg-emerald-600">
>>>>>>> recover/cabinet-wip-from-stash
                        Купить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl space-y-6">
          <Card className="space-y-4 overflow-hidden rounded-xl border-none bg-white p-4 text-center shadow-2xl">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-xl bg-emerald-50">
              <Camera className="h-10 w-10 text-emerald-500" />
            </div>
            <div className="space-y-4">
              <h2 className="text-base font-black uppercase tracking-tight">
                Выставить товар на ресейл
              </h2>
<<<<<<< HEAD
              <p className="mx-auto max-w-lg font-medium leading-relaxed text-slate-500">
=======
              <p className="text-text-secondary mx-auto max-w-lg font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                Выберите товар из истории покупок. AI автоматически подгрузит все данные из Digital
                Product Passport, подтвердит подлинность и предложит цену.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
<<<<<<< HEAD
              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-6 py-3">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span className="text-[10px] font-black uppercase italic tracking-widest text-slate-600">
                  No Fake Policy
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-6 py-3">
                <Zap className="h-5 w-5 text-indigo-500" />
                <span className="text-[10px] font-black uppercase italic tracking-widest text-slate-600">
                  Instant AI Quote
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-6 py-3">
                <Handshake className="h-5 w-5 text-amber-500" />
                <span className="text-[10px] font-black uppercase italic tracking-widest text-slate-600">
=======
              <div className="bg-bg-surface2 flex items-center gap-2 rounded-2xl px-6 py-3">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span className="text-text-secondary text-[10px] font-black uppercase italic tracking-widest">
                  No Fake Policy
                </span>
              </div>
              <div className="bg-bg-surface2 flex items-center gap-2 rounded-2xl px-6 py-3">
                <Zap className="text-accent-primary h-5 w-5" />
                <span className="text-text-secondary text-[10px] font-black uppercase italic tracking-widest">
                  Instant AI Quote
                </span>
              </div>
              <div className="bg-bg-surface2 flex items-center gap-2 rounded-2xl px-6 py-3">
                <Handshake className="h-5 w-5 text-amber-500" />
                <span className="text-text-secondary text-[10px] font-black uppercase italic tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Secure Escrow
                </span>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
<<<<<<< HEAD
            <h3 className="flex items-center gap-2 px-2 text-sm font-black uppercase tracking-widest text-slate-400">
=======
            <h3 className="text-text-muted flex items-center gap-2 px-2 text-sm font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              <History className="h-4 w-4" /> Ваши покупки, готовые к перепродаже
            </h3>
            <div className="grid gap-3 md:grid-cols-3">
              {myPurchases.map((item) => (
                <Card
                  key={item.id}
                  className="group space-y-6 rounded-xl border-none bg-white p-4 shadow-xl ring-emerald-500/20 transition-all duration-500 hover:ring-2"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                    <Image
                      src={item.images[0].url}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                      <Button
                        onClick={() => handleListForResale(item.id)}
                        disabled={isListing}
                        className="h-12 rounded-xl bg-emerald-500 px-8 text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-600"
                      >
                        {isListing ? <RefreshCcw className="h-4 w-4 animate-spin" /> : 'Выставить'}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
<<<<<<< HEAD
                      <p className="mb-0.5 text-[8px] font-black uppercase text-slate-400">
=======
                      <p className="text-text-muted mb-0.5 text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                        {item.brand}
                      </p>
                      <h4 className="truncate text-sm font-black uppercase leading-none tracking-tight">
                        {item.name}
                      </h4>
                    </div>
<<<<<<< HEAD
                    <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                      <div className="space-y-0.5">
                        <p className="text-[8px] font-black uppercase text-slate-400">Est. Value</p>
=======
                    <div className="border-border-subtle flex items-center justify-between border-t pt-3">
                      <div className="space-y-0.5">
                        <p className="text-text-muted text-[8px] font-black uppercase">
                          Est. Value
                        </p>
>>>>>>> recover/cabinet-wip-from-stash
                        <p className="text-sm font-black text-emerald-600">
                          {item.estimatedResale.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                      <div className="space-y-0.5 text-right">
<<<<<<< HEAD
                        <p className="text-[8px] font-black uppercase text-slate-400">Bought</p>
                        <p className="text-[10px] font-black text-slate-900">{item.purchaseDate}</p>
=======
                        <p className="text-text-muted text-[8px] font-black uppercase">Bought</p>
                        <p className="text-text-primary text-[10px] font-black">
                          {item.purchaseDate}
                        </p>
>>>>>>> recover/cabinet-wip-from-stash
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
