'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Video,
  MessageSquare,
  ShoppingBag,
  MousePointer2,
  Sparkles,
  Send,
  Mic,
  MicOff,
  Monitor,
  Share2,
  Save,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Eye,
  Layers,
  Palette,
} from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_SESSION_ITEMS = [
  {
    id: '1',
    name: 'Cyber Parka',
    price: 18000,
    quantity: 12,
    status: 'Confirmed',
    buyerNote: 'Need XL for Tokyo store',
  },
  { id: '2', name: 'Neural Cargo', price: 9500, quantity: 24, status: 'Draft', buyerNote: '' },
  {
    id: '3',
    name: 'Silk Overshirt',
    price: 12000,
    quantity: 0,
    status: 'Suggestion',
    buyerNote: 'Matches their palette',
  },
];

export function CollaborativeBuy() {
  const [isMicOn, setIsMicOn] = useState(true);
  const [items, setItems] = useState(MOCK_SESSION_ITEMS);
  const [activeBuyer, setActiveBuyer] = useState({
    name: 'Takashi K.',
    company: 'BEAMS Tokyo',
    avatar: 'https://i.pravatar.cc/150?u=beams',
  });

  return (
    <div className="grid h-[calc(100vh-200px)] grid-cols-1 gap-3 xl:grid-cols-12">
      {/* Left: Live View & Video */}
      <div className="flex flex-col gap-3 xl:col-span-8">
<<<<<<< HEAD
        <Card className="relative flex-1 overflow-hidden rounded-xl border-none bg-slate-900 shadow-2xl">
=======
        <Card className="bg-text-primary relative flex-1 overflow-hidden rounded-xl border-none shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
          {/* Live Video Overlay */}
          <div className="absolute left-6 top-4 z-20 flex gap-3">
            <div className="flex animate-pulse items-center gap-2 rounded-xl bg-rose-600 px-3 py-1.5 text-white shadow-lg">
              <div className="h-2 w-2 rounded-full bg-white" />
              <span className="text-[10px] font-black uppercase tracking-widest">Live Session</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-white backdrop-blur-md">
<<<<<<< HEAD
              <Users className="h-3.5 w-3.5 text-indigo-400" />
=======
              <Users className="text-accent-primary h-3.5 w-3.5" />
>>>>>>> recover/cabinet-wip-from-stash
              <span className="text-[10px] font-black uppercase tracking-widest">
                2 Participants
              </span>
            </div>
          </div>

          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200')] bg-cover bg-center opacity-40" />

          <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-12 w-12 rounded-2xl transition-all',
<<<<<<< HEAD
                isMicOn ? 'bg-white text-slate-900 shadow-xl' : 'text-white hover:bg-white/20'
=======
                isMicOn ? 'text-text-primary bg-white shadow-xl' : 'text-white hover:bg-white/20'
>>>>>>> recover/cabinet-wip-from-stash
              )}
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-2xl text-white hover:bg-white/20"
            >
              <Video className="h-5 w-5" />
            </Button>
            <div className="mx-2 h-8 w-px bg-white/10" />
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-2xl text-white hover:bg-white/20"
            >
              <Monitor className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-2xl text-white hover:bg-white/20"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            <Button className="h-12 rounded-2xl bg-rose-600 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-rose-700">
              Завершить сессию
            </Button>
          </div>

          {/* Buyer's View Cursor Simulation */}
          <motion.div
            animate={{ x: [100, 400, 200], y: [100, 200, 150] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute z-10 flex flex-col items-center gap-2"
          >
<<<<<<< HEAD
            <div className="rounded-lg bg-indigo-600 px-3 py-1 text-[10px] font-black uppercase text-white shadow-lg">
              Takashi is looking here
            </div>
            <MousePointer2 className="h-6 w-6 fill-indigo-600 text-indigo-600" />
=======
            <div className="bg-accent-primary rounded-lg px-3 py-1 text-[10px] font-black uppercase text-white shadow-lg">
              Takashi is looking here
            </div>
            <MousePointer2 className="text-accent-primary fill-accent-primary h-6 w-6" />
>>>>>>> recover/cabinet-wip-from-stash
          </motion.div>
        </Card>

        {/* Quick Selection / Recommendations */}
        <div className="scrollbar-hide flex h-48 gap-3 overflow-x-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card
              key={i}
              className="group min-w-[160px] cursor-pointer space-y-3 rounded-3xl border-none bg-white p-3 shadow-sm transition-all hover:shadow-xl"
            >
<<<<<<< HEAD
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-50">
=======
              <div className="bg-bg-surface2 relative aspect-[3/4] overflow-hidden rounded-2xl">
>>>>>>> recover/cabinet-wip-from-stash
                <img
                  src={`https://picsum.photos/seed/${i + 10}/200/300`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
<<<<<<< HEAD
                <div className="absolute inset-0 bg-indigo-600/0 transition-colors group-hover:bg-indigo-600/20" />
              </div>
              <Button className="h-8 w-full rounded-xl bg-slate-900 text-[8px] font-black uppercase text-white">
=======
                <div className="bg-accent-primary/0 group-hover:bg-accent-primary/20 absolute inset-0 transition-colors" />
              </div>
              <Button className="bg-text-primary h-8 w-full rounded-xl text-[8px] font-black uppercase text-white">
>>>>>>> recover/cabinet-wip-from-stash
                Предложить байеру
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Right: Collaborative Cart & Chat */}
      <div className="flex flex-col gap-3 xl:col-span-4">
        <Card className="flex flex-1 flex-col overflow-hidden rounded-xl border-none bg-white shadow-xl">
<<<<<<< HEAD
          <CardHeader className="border-b border-slate-50 p-4 pb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-indigo-100">
=======
          <CardHeader className="border-border-subtle border-b p-4 pb-4">
            <div className="flex items-center gap-3">
              <Avatar className="border-accent-primary/20 h-12 w-12 border-2">
>>>>>>> recover/cabinet-wip-from-stash
                <AvatarImage src={activeBuyer.avatar} />
                <AvatarFallback>TK</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-tight">
                  {activeBuyer.name}
                </CardTitle>
<<<<<<< HEAD
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {activeBuyer.company}
                </CardDescription>
              </div>
              <Badge className="ml-auto border-none bg-indigo-50 text-[8px] font-black uppercase text-indigo-600">
=======
                <CardDescription className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                  {activeBuyer.company}
                </CardDescription>
              </div>
              <Badge className="bg-accent-primary/10 text-accent-primary ml-auto border-none text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                Control Mode: Shared
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
            <ScrollArea className="flex-1 px-8 py-6">
              <div className="space-y-6">
<<<<<<< HEAD
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
=======
                <h4 className="text-text-muted text-[11px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Корзина сессии
                </h4>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'space-y-3 rounded-2xl border p-4 transition-all',
                      item.status === 'Suggestion'
<<<<<<< HEAD
                        ? 'border-dashed border-indigo-100 bg-indigo-50/50'
                        : 'border-slate-100 bg-white'
=======
                        ? 'bg-accent-primary/10 border-accent-primary/20 border-dashed'
                        : 'border-border-subtle bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
<<<<<<< HEAD
                        <div className="h-10 w-8 shrink-0 overflow-hidden rounded-lg bg-slate-100">
=======
                        <div className="bg-bg-surface2 h-10 w-8 shrink-0 overflow-hidden rounded-lg">
>>>>>>> recover/cabinet-wip-from-stash
                          <img
                            src={`https://picsum.photos/seed/${item.id}/100/150`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
<<<<<<< HEAD
                          <p className="text-[11px] font-black uppercase text-slate-900">
                            {item.name}
                          </p>
                          <p className="text-[9px] font-bold uppercase text-slate-400">
=======
                          <p className="text-text-primary text-[11px] font-black uppercase">
                            {item.name}
                          </p>
                          <p className="text-text-muted text-[9px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                            {item.price.toLocaleString('ru-RU')} ₽
                          </p>
                        </div>
                      </div>
                      {item.status === 'Suggestion' ? (
<<<<<<< HEAD
                        <Badge className="border-indigo-100 bg-white text-[8px] font-black uppercase text-indigo-600">
=======
                        <Badge className="text-accent-primary border-accent-primary/20 bg-white text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                          Suggested
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black tabular-nums">{item.quantity}</span>
<<<<<<< HEAD
                          <span className="text-[9px] font-bold uppercase text-slate-400">ед.</span>
=======
                          <span className="text-text-muted text-[9px] font-bold uppercase">
                            ед.
                          </span>
>>>>>>> recover/cabinet-wip-from-stash
                        </div>
                      )}
                    </div>
                    {item.buyerNote && (
<<<<<<< HEAD
                      <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white p-2.5 text-[9px] italic text-slate-500">
                        <MessageSquare className="h-3 w-3 text-indigo-400" /> "{item.buyerNote}"
=======
                      <div className="border-border-subtle text-text-secondary flex items-center gap-2 rounded-xl border bg-white p-2.5 text-[9px] italic">
                        <MessageSquare className="text-accent-primary h-3 w-3" /> "{item.buyerNote}"
>>>>>>> recover/cabinet-wip-from-stash
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

<<<<<<< HEAD
            <div className="space-y-4 border-t border-slate-50 p-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Предварительный итог
                  </p>
                  <p className="text-sm font-black text-slate-900">444,000 ₽</p>
=======
            <div className="border-border-subtle space-y-4 border-t p-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                    Предварительный итог
                  </p>
                  <p className="text-text-primary text-sm font-black">444,000 ₽</p>
>>>>>>> recover/cabinet-wip-from-stash
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                    MOQ Met
                  </p>
<<<<<<< HEAD
                  <p className="text-[9px] font-bold uppercase italic text-slate-400">
=======
                  <p className="text-text-muted text-[9px] font-bold uppercase italic">
>>>>>>> recover/cabinet-wip-from-stash
                    Ready for approval
                  </p>
                </div>
              </div>
<<<<<<< HEAD
              <Button className="h-10 w-full rounded-2xl bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl shadow-indigo-200 hover:bg-indigo-700">
=======
              <Button className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/15 h-10 w-full rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-2xl">
>>>>>>> recover/cabinet-wip-from-stash
                Сформировать черновик заказа <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Session AI Pulse */}
<<<<<<< HEAD
        <Card className="relative overflow-hidden rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl">
          <Sparkles className="absolute -right-10 -top-3 h-32 w-32 text-indigo-500 opacity-10" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/50">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
=======
        <Card className="bg-text-primary relative overflow-hidden rounded-xl border-none p-4 text-white shadow-xl">
          <Sparkles className="text-accent-primary absolute -right-10 -top-3 h-32 w-32 opacity-10" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-accent-primary shadow-accent-primary/25 flex h-10 w-10 items-center justify-center rounded-xl shadow-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-accent-primary text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                AI Buy Assistant
              </p>
              <p className="text-[11px] font-medium leading-tight text-white/80">
                «Байер проявляет интерес к аксессуарам. Предложите Neural Scarf для апсейла».
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
