'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingBag,
  Search,
  Filter,
  Gavel,
  MessageSquare,
  FileText,
  Truck,
  Clock,
  Zap,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Star,
  Camera,
  Download,
  Wallet,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PARTNER_MATERIALS = [
  {
    id: 'M-101',
    partner: 'Textile-Union (TR)',
    name: 'Heavy Cotton 320g',
    category: 'Ткань',
    stock: '2,500 м',
    price: '8.50 $',
    leadTime: '12-14 дней',
    rating: 4.9,
    certificates: ['OEKO-TEX', 'GOTS'],
    image: '/fabrics/cotton-320.jpg',
  },
  {
    id: 'M-102',
    partner: 'Premium-Hardware (CN)',
    name: 'Excella Zippers 20cm',
    category: 'Фурнитура',
    stock: '15,000 шт',
    price: '1.20 $',
    leadTime: '7-9 дней',
    rating: 4.8,
    certificates: ['ISO 9001'],
    image: '/hardware/zipper.jpg',
  },
  {
    id: 'M-103',
    partner: 'Local-Sourcing (RU)',
    name: 'Silk Jersey',
    category: 'Ткань',
    stock: '450 м',
    price: '1,250 ₽',
    leadTime: '2-3 дня',
    rating: 4.7,
    certificates: ['ТР ТС'],
    image: '/fabrics/silk.jpg',
  },
];

const AUCTION_LOTS = [
  {
    id: 'LOT-992',
    item: 'Остаток: Футер 3х-нитка (Black)',
    partner: 'Mega-Factory',
    qty: '120 м',
    startPrice: '450 ₽/м',
    currentBid: '520 ₽/м',
    endTime: '2ч 45мин',
    bids: 12,
  },
  {
    id: 'LOT-993',
    item: 'Лот: Пуговицы натуральные (Shell)',
    partner: 'Eco-Trim',
    qty: '2,000 шт',
    startPrice: '12 ₽/шт',
    currentBid: '15 ₽/шт',
    endTime: '1ч 15мин',
    bids: 8,
  },
];

interface MaterialMarketplaceProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialQuery?: string;
}

export function MaterialMarketplace({
  isOpen,
  onOpenChange,
  initialQuery = '',
}: MaterialMarketplaceProps) {
  const [activeTab, setActiveTab] = useState('registry');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedItem, setSelectedId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialQuery);
    }
  }, [isOpen, initialQuery]);

  const filteredMaterials = useMemo(() => {
    return PARTNER_MATERIALS.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.partner.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden rounded-3xl border-none bg-white p-0 shadow-2xl sm:max-w-[1000px]">
<<<<<<< HEAD
        <DialogHeader className="relative shrink-0 bg-slate-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-900/20">
=======
        <DialogHeader className="bg-text-primary relative shrink-0 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-accent-primary shadow-accent-primary/20 flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tighter">
                  Биржа материалов и фурнитуры
                </DialogTitle>
<<<<<<< HEAD
                <DialogDescription className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
                <DialogDescription className="text-text-muted mt-0.5 text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Реестр партнеров платформы и аукцион остатков (Stock & Auction)
                </DialogDescription>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-2">
              <div className="text-right">
<<<<<<< HEAD
                <p className="mb-1 text-[8px] font-black uppercase leading-none tracking-widest text-slate-500">
                  Доступно к заказу
                </p>
                <p className="text-sm font-black tabular-nums">
                  42,500+ <span className="text-indigo-400">SKU</span>
=======
                <p className="text-text-secondary mb-1 text-[8px] font-black uppercase leading-none tracking-widest">
                  Доступно к заказу
                </p>
                <p className="text-sm font-black tabular-nums">
                  42,500+ <span className="text-accent-primary">SKU</span>
>>>>>>> recover/cabinet-wip-from-stash
                </p>
              </div>
              <div className="h-8 w-[1px] bg-white/10" />
              <Zap className="h-5 w-5 animate-pulse text-amber-400" />
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
<<<<<<< HEAD
          <div className="flex gap-3 border-b border-slate-100 bg-slate-50 p-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Поиск ткани, фурнитуры или партнера..."
                className="h-10 rounded-xl border-slate-200 bg-white pl-10 text-sm font-bold"
=======
          <div className="bg-bg-surface2 border-border-subtle flex gap-3 border-b p-4">
            <div className="relative flex-1">
              <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Поиск ткани, фурнитуры или партнера..."
                className="border-border-default h-10 rounded-xl bg-white pl-10 text-sm font-bold"
>>>>>>> recover/cabinet-wip-from-stash
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
<<<<<<< HEAD
              className="h-10 gap-2 rounded-xl border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest"
            >
              <Filter className="h-4 w-4 text-slate-400" /> Фильтры
=======
              className="border-border-default h-10 gap-2 rounded-xl bg-white text-[10px] font-black uppercase tracking-widest"
            >
              <Filter className="text-text-muted h-4 w-4" /> Фильтры
>>>>>>> recover/cabinet-wip-from-stash
            </Button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Tabs */}
<<<<<<< HEAD
            <div className="w-48 space-y-1 border-r border-slate-100 bg-slate-50/50 p-2">
=======
            <div className="border-border-subtle bg-bg-surface2/80 w-48 space-y-1 border-r p-2">
>>>>>>> recover/cabinet-wip-from-stash
              {[
                { id: 'registry', label: 'Реестр МТР', icon: FileText },
                { id: 'auction', label: 'Аукцион', icon: Gavel },
                { id: 'orders', label: 'Мои заказы', icon: Truck },
                { id: 'favs', label: 'Избранное', icon: Star },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex h-11 w-full items-center gap-3 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest transition-all',
                    activeTab === tab.id
<<<<<<< HEAD
                      ? 'border border-indigo-100 bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-400 hover:bg-white/50 hover:text-slate-600'
=======
                      ? 'text-accent-primary border-accent-primary/20 border bg-white shadow-sm'
                      : 'text-text-muted hover:text-text-secondary hover:bg-white/50'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Main Content */}
            <div className="custom-scrollbar flex-1 overflow-y-auto bg-white p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'registry' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
                  >
                    {filteredMaterials.map((m) => (
                      <Card
                        key={m.id}
<<<<<<< HEAD
                        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md"
                      >
                        <div className="relative aspect-video overflow-hidden bg-slate-100">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ShoppingBag className="h-12 w-12 text-slate-200" />
=======
                        className="border-border-subtle hover:border-accent-primary/30 group flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="bg-bg-surface2 relative aspect-video overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ShoppingBag className="text-text-muted h-12 w-12" />
>>>>>>> recover/cabinet-wip-from-stash
                          </div>
                          <div className="absolute left-2 top-2 flex gap-1">
                            {m.certificates.map((c) => (
                              <Badge
                                key={c}
                                className="h-4 border-none bg-emerald-500 px-1 text-[7px] font-black text-white"
                              >
                                {c}
                              </Badge>
                            ))}
                          </div>
                          <div className="absolute right-2 top-2">
<<<<<<< HEAD
                            <Badge className="h-5 border-none bg-white/90 px-2 text-[8px] font-black text-slate-900 shadow-sm">
=======
                            <Badge className="text-text-primary h-5 border-none bg-white/90 px-2 text-[8px] font-black shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
                              {m.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col space-y-3 p-4">
                          <div className="space-y-1">
<<<<<<< HEAD
                            <h4 className="text-xs font-black uppercase text-slate-900 transition-colors group-hover:text-indigo-600">
                              {m.name}
                            </h4>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
=======
                            <h4 className="text-text-primary group-hover:text-accent-primary text-xs font-black uppercase transition-colors">
                              {m.name}
                            </h4>
                            <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                              {m.partner}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
<<<<<<< HEAD
                            <div className="space-y-0.5 rounded-xl bg-slate-50 p-2">
                              <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">
                                Цена
                              </p>
                              <p className="text-xs font-black tabular-nums text-slate-900">
                                {m.price}
                              </p>
                            </div>
                            <div className="space-y-0.5 rounded-xl bg-slate-50 p-2">
                              <p className="text-[7px] font-black uppercase tracking-widest text-slate-400">
                                Сток
                              </p>
                              <p className="text-xs font-black tabular-nums text-slate-900">
=======
                            <div className="bg-bg-surface2 space-y-0.5 rounded-xl p-2">
                              <p className="text-text-muted text-[7px] font-black uppercase tracking-widest">
                                Цена
                              </p>
                              <p className="text-text-primary text-xs font-black tabular-nums">
                                {m.price}
                              </p>
                            </div>
                            <div className="bg-bg-surface2 space-y-0.5 rounded-xl p-2">
                              <p className="text-text-muted text-[7px] font-black uppercase tracking-widest">
                                Сток
                              </p>
                              <p className="text-text-primary text-xs font-black tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                                {m.stock}
                              </p>
                            </div>
                          </div>

<<<<<<< HEAD
                          <div className="flex items-center justify-between border-t border-slate-50 pt-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-indigo-400" /> {m.leadTime}
=======
                          <div className="text-text-muted border-border-subtle flex items-center justify-between border-t pt-2 text-[8px] font-black uppercase tracking-widest">
                            <span className="flex items-center gap-1">
                              <Clock className="text-accent-primary h-3 w-3" /> {m.leadTime}
>>>>>>> recover/cabinet-wip-from-stash
                            </span>
                            <span className="flex items-center gap-0.5">
                              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />{' '}
                              {m.rating}
                            </span>
                          </div>

                          <div className="mt-auto flex gap-2 pt-2">
                            <Button
                              onClick={() => setIsChatOpen(true)}
                              variant="outline"
                              size="sm"
<<<<<<< HEAD
                              className="h-8 flex-1 gap-1.5 rounded-lg border-slate-200 text-[9px] font-black uppercase transition-all hover:bg-indigo-50 hover:text-indigo-600"
=======
                              className="border-border-default hover:bg-accent-primary/10 hover:text-accent-primary h-8 flex-1 gap-1.5 rounded-lg text-[9px] font-black uppercase transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              <MessageSquare className="h-3 w-3" /> Чат
                            </Button>
                            <Button
                              size="sm"
<<<<<<< HEAD
                              className="h-8 flex-[2] gap-1.5 rounded-lg bg-slate-900 text-[9px] font-black uppercase text-white shadow-md transition-all hover:bg-indigo-600"
=======
                              className="bg-text-primary hover:bg-accent-primary h-8 flex-[2] gap-1.5 rounded-lg text-[9px] font-black uppercase text-white shadow-md transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              Заказать <ChevronRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'auction' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                          <Gavel className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black uppercase text-amber-900">
                            Аукцион горячих остатков
                          </h4>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-amber-700">
                            Успейте забронировать МТР по ценам ниже рынка на 30-50%
                          </p>
                        </div>
                      </div>
                      <Badge className="h-5 animate-pulse border-none bg-amber-500 px-2 text-[8px] font-black uppercase text-white">
                        Live Now
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {AUCTION_LOTS.map((lot) => (
                        <div
                          key={lot.id}
<<<<<<< HEAD
                          className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:border-amber-200 hover:shadow-md"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 transition-all group-hover:scale-105">
                              <ShoppingBag className="h-6 w-6 text-slate-200" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h5 className="text-xs font-black uppercase text-slate-900">
=======
                          className="border-border-subtle group flex items-center justify-between rounded-2xl border bg-white p-4 transition-all hover:border-amber-200 hover:shadow-md"
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-bg-surface2 border-border-subtle flex h-14 w-14 items-center justify-center rounded-xl border transition-all group-hover:scale-105">
                              <ShoppingBag className="text-text-muted h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h5 className="text-text-primary text-xs font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                  {lot.item}
                                </h5>
                                <Badge
                                  variant="outline"
<<<<<<< HEAD
                                  className="h-3.5 border-slate-200 px-1 text-[7px] font-black uppercase text-slate-400"
=======
                                  className="border-border-default text-text-muted h-3.5 px-1 text-[7px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
                                >
                                  {lot.id}
                                </Badge>
                              </div>
<<<<<<< HEAD
                              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
=======
                              <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                                {lot.partner} • {lot.qty}
                              </p>
                              <div className="mt-1 flex items-center gap-3">
                                <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-black tabular-nums text-rose-500">
                                  {lot.currentBid}
                                </span>
<<<<<<< HEAD
                                <span className="text-[8px] font-bold uppercase italic tracking-widest text-slate-400 line-through">
=======
                                <span className="text-text-muted text-[8px] font-bold uppercase italic tracking-widest line-through">
>>>>>>> recover/cabinet-wip-from-stash
                                  Start: {lot.startPrice}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
<<<<<<< HEAD
                              <p className="mb-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
                                До конца
                              </p>
                              <p className="flex items-center justify-end gap-1 text-xs font-black tabular-nums text-indigo-600">
                                <Clock className="h-3 w-3" /> {lot.endTime}
                              </p>
                            </div>
                            <div className="h-10 w-[1px] bg-slate-100" />
                            <div className="space-y-2">
                              <Button className="h-9 gap-2 rounded-xl bg-slate-900 px-6 text-[9px] font-black uppercase text-white shadow-lg transition-all hover:bg-amber-500">
                                Сделать ставку <Zap className="h-3 w-3 fill-white" />
                              </Button>
                              <p className="text-center text-[7px] font-bold uppercase tracking-widest text-slate-400">
=======
                              <p className="text-text-muted mb-1 text-[8px] font-black uppercase tracking-widest">
                                До конца
                              </p>
                              <p className="text-accent-primary flex items-center justify-end gap-1 text-xs font-black tabular-nums">
                                <Clock className="h-3 w-3" /> {lot.endTime}
                              </p>
                            </div>
                            <div className="bg-bg-surface2 h-10 w-[1px]" />
                            <div className="space-y-2">
                              <Button className="bg-text-primary h-9 gap-2 rounded-xl px-6 text-[9px] font-black uppercase text-white shadow-lg transition-all hover:bg-amber-500">
                                Сделать ставку <Zap className="h-3 w-3 fill-white" />
                              </Button>
                              <p className="text-text-muted text-center text-[7px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                                {lot.bids} ставок сделано
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <DialogFooter className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-6">
          <div className="flex items-center gap-3">
            <Badge className="h-5 border-none bg-indigo-100 px-2 text-[8px] font-black uppercase tracking-widest text-indigo-700">
              Market Status
            </Badge>
            <p className="text-[9px] font-bold italic text-slate-500">
=======
        <DialogFooter className="bg-bg-surface2 border-border-subtle flex items-center justify-between border-t p-6">
          <div className="flex items-center gap-3">
            <Badge className="bg-accent-primary/15 text-accent-primary h-5 border-none px-2 text-[8px] font-black uppercase tracking-widest">
              Market Status
            </Badge>
            <p className="text-text-secondary text-[9px] font-bold italic">
>>>>>>> recover/cabinet-wip-from-stash
              "Все сделки защищены Escrow-сервисом платформы. Доставка от 24 часов."
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
<<<<<<< HEAD
              className="h-11 text-[10px] font-black uppercase tracking-widest text-slate-400"
=======
              className="text-text-muted h-11 text-[10px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
              onClick={() => onOpenChange(false)}
            >
              Закрыть
            </Button>
<<<<<<< HEAD
            <Button className="h-11 gap-2 rounded-2xl bg-indigo-600 px-10 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-indigo-200 transition-all">
=======
            <Button className="bg-accent-primary shadow-accent-primary/15 h-11 gap-2 rounded-2xl px-10 text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all">
>>>>>>> recover/cabinet-wip-from-stash
              <Wallet className="h-4 w-4" /> Пополнить баланс
            </Button>
          </div>
        </DialogFooter>

        {/* Chat Overlay */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
<<<<<<< HEAD
              className="absolute bottom-0 right-0 top-0 z-50 flex w-80 flex-col border-l border-slate-100 bg-white shadow-2xl"
            >
              <div className="flex shrink-0 items-center justify-between bg-slate-900 p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-black">
=======
              className="border-border-subtle absolute bottom-0 right-0 top-0 z-50 flex w-80 flex-col border-l bg-white shadow-2xl"
            >
              <div className="bg-text-primary flex shrink-0 items-center justify-between p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="bg-accent-primary flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black">
>>>>>>> recover/cabinet-wip-from-stash
                    TU
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase">Textile-Union</p>
                    <p className="text-[8px] font-bold uppercase tracking-widest text-emerald-400">
                      Online
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsChatOpen(false)}
                  className="h-8 w-8 rounded-full text-white hover:bg-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
<<<<<<< HEAD
                <div className="mr-8 rounded-2xl rounded-tl-none bg-slate-50 p-3">
                  <p className="text-[10px] font-medium leading-relaxed text-slate-600">
=======
                <div className="bg-bg-surface2 mr-8 rounded-2xl rounded-tl-none p-3">
                  <p className="text-text-secondary text-[10px] font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                    Здравствуйте! На этот артикул у нас сейчас действует спецпредложение. Могу
                    прислать фото образцов в высоком разрешении.
                  </p>
                </div>
<<<<<<< HEAD
                <div className="ml-8 rounded-2xl rounded-tr-none bg-indigo-600 p-3 text-white shadow-md">
=======
                <div className="bg-accent-primary ml-8 rounded-2xl rounded-tr-none p-3 text-white shadow-md">
>>>>>>> recover/cabinet-wip-from-stash
                  <p className="text-[10px] font-medium leading-relaxed">
                    Добрый день! Да, пришлите фото и сертификат OEKO-TEX актуальный.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
<<<<<<< HEAD
                  <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-100">
                    <Camera className="h-4 w-4 text-slate-300" />
                  </div>
                  <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-100">
                    <FileText className="h-4 w-4 text-slate-300" />
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-100 bg-slate-50 p-4">
                <div className="relative">
                  <Input
                    placeholder="Напишите поставщику..."
                    className="h-10 rounded-xl border-slate-200 bg-white pr-10 text-[10px] font-bold shadow-inner"
                  />
                  <Button
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8 rounded-lg bg-indigo-600"
=======
                  <div className="bg-bg-surface2 border-border-default flex aspect-square items-center justify-center rounded-xl border border-dashed">
                    <Camera className="text-text-muted h-4 w-4" />
                  </div>
                  <div className="bg-bg-surface2 border-border-default flex aspect-square items-center justify-center rounded-xl border border-dashed">
                    <FileText className="text-text-muted h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="border-border-subtle bg-bg-surface2 border-t p-4">
                <div className="relative">
                  <Input
                    placeholder="Напишите поставщику..."
                    className="border-border-default h-10 rounded-xl bg-white pr-10 text-[10px] font-bold shadow-inner"
                  />
                  <Button
                    size="icon"
                    className="bg-accent-primary absolute right-1 top-1 h-8 w-8 rounded-lg"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    <ArrowRight className="h-3 w-3 text-white" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// Helper Card Component
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('bg-white', className)}>{children}</div>
);
