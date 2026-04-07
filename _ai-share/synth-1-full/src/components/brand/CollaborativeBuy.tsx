'use client';

import React, { useState, useEffect } from 'react';
import { 
    Users, Video, MessageSquare, ShoppingBag, 
    MousePointer2, Sparkles, Send, Mic, MicOff,
    Monitor, Share2, Save, CheckCircle2, AlertCircle,
    ChevronRight, ArrowRight, Eye, Layers, Palette
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_SESSION_ITEMS = [
    { id: '1', name: 'Cyber Parka', price: 18000, quantity: 12, status: 'Confirmed', buyerNote: 'Need XL for Tokyo store' },
    { id: '2', name: 'Neural Cargo', price: 9500, quantity: 24, status: 'Draft', buyerNote: '' },
    { id: '3', name: 'Silk Overshirt', price: 12000, quantity: 0, status: 'Suggestion', buyerNote: 'Matches their palette' },
];

export function CollaborativeBuy() {
    const [isMicOn, setIsMicOn] = useState(true);
    const [items, setItems] = useState(MOCK_SESSION_ITEMS);
    const [activeBuyer, setActiveBuyer] = useState({ name: 'Takashi K.', company: 'BEAMS Tokyo', avatar: 'https://i.pravatar.cc/150?u=beams' });

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 h-[calc(100vh-200px)]">
            {/* Left: Live View & Video */}
            <div className="xl:col-span-8 flex flex-col gap-3">
                <Card className="flex-1 rounded-xl border-none shadow-2xl bg-slate-900 overflow-hidden relative">
                    {/* Live Video Overlay */}
                    <div className="absolute top-4 left-6 z-20 flex gap-3">
                        <div className="bg-rose-600 text-white px-3 py-1.5 rounded-xl flex items-center gap-2 animate-pulse shadow-lg">
                            <div className="h-2 w-2 rounded-full bg-white" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Live Session</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10">
                            <Users className="h-3.5 w-3.5 text-indigo-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">2 Participants</span>
                        </div>
                    </div>

                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200')] bg-cover bg-center opacity-40" />
                    
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-white/10 backdrop-blur-xl p-4 rounded-xl border border-white/10 shadow-2xl">
                        <Button variant="ghost" size="icon" className={cn("h-12 w-12 rounded-2xl transition-all", isMicOn ? "bg-white text-slate-900 shadow-xl" : "text-white hover:bg-white/20")} onClick={() => setIsMicOn(!isMicOn)}>
                            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-white hover:bg-white/20">
                            <Video className="h-5 w-5" />
                        </Button>
                        <div className="h-8 w-px bg-white/10 mx-2" />
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-white hover:bg-white/20">
                            <Monitor className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-white hover:bg-white/20">
                            <Share2 className="h-5 w-5" />
                        </Button>
                        <Button className="h-12 px-8 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">
                            Завершить сессию
                        </Button>
                    </div>

                    {/* Buyer's View Cursor Simulation */}
                    <motion.div 
                        animate={{ x: [100, 400, 200], y: [100, 200, 150] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute z-10 flex flex-col items-center gap-2"
                    >
                        <div className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase shadow-lg">Takashi is looking here</div>
                        <MousePointer2 className="h-6 w-6 text-indigo-600 fill-indigo-600" />
                    </motion.div>
                </Card>

                {/* Quick Selection / Recommendations */}
                <div className="h-48 flex gap-3 overflow-x-auto scrollbar-hide">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Card key={i} className="min-w-[160px] rounded-3xl border-none shadow-sm hover:shadow-xl transition-all cursor-pointer group bg-white p-3 space-y-3">
                            <div className="aspect-[3/4] bg-slate-50 rounded-2xl overflow-hidden relative">
                                <img src={`https://picsum.photos/seed/${i+10}/200/300`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/20 transition-colors" />
                            </div>
                            <Button className="w-full h-8 bg-slate-900 text-white rounded-xl text-[8px] font-black uppercase">Предложить байеру</Button>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Right: Collaborative Cart & Chat */}
            <div className="xl:col-span-4 flex flex-col gap-3">
                <Card className="flex-1 rounded-xl border-none shadow-xl bg-white overflow-hidden flex flex-col">
                    <CardHeader className="p-4 pb-4 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-indigo-100">
                                <AvatarImage src={activeBuyer.avatar} />
                                <AvatarFallback>TK</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-sm font-black uppercase tracking-tight">{activeBuyer.name}</CardTitle>
                                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeBuyer.company}</CardDescription>
                            </div>
                            <Badge className="ml-auto bg-indigo-50 text-indigo-600 border-none font-black text-[8px] uppercase">Control Mode: Shared</Badge>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                        <ScrollArea className="flex-1 px-8 py-6">
                            <div className="space-y-6">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Корзина сессии</h4>
                                {items.map((item) => (
                                    <div key={item.id} className={cn(
                                        "p-4 rounded-2xl border transition-all space-y-3",
                                        item.status === 'Suggestion' ? "bg-indigo-50/50 border-indigo-100 border-dashed" : "bg-white border-slate-100"
                                    )}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-8 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                                    <img src={`https://picsum.photos/seed/${item.id}/100/150`} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-[11px] font-black uppercase text-slate-900">{item.name}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase">{item.price.toLocaleString('ru-RU')} ₽</p>
                                                </div>
                                            </div>
                                            {item.status === 'Suggestion' ? (
                                                <Badge className="bg-white text-indigo-600 border-indigo-100 text-[8px] font-black uppercase">Suggested</Badge>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black tabular-nums">{item.quantity}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">ед.</span>
                                                </div>
                                            )}
                                        </div>
                                        {item.buyerNote && (
                                            <div className="p-2.5 bg-white border border-slate-100 rounded-xl text-[9px] text-slate-500 italic flex items-center gap-2">
                                                <MessageSquare className="h-3 w-3 text-indigo-400" /> "{item.buyerNote}"
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t border-slate-50 space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Предварительный итог</p>
                                    <p className="text-sm font-black text-slate-900">444,000 ₽</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">MOQ Met</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase italic">Ready for approval</p>
                                </div>
                            </div>
                            <Button className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-200">
                                Сформировать черновик заказа <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Session AI Pulse */}
                <Card className="rounded-xl border-none shadow-xl bg-slate-900 text-white p-4 relative overflow-hidden">
                    <Sparkles className="absolute -right-10 -top-3 h-32 w-32 text-indigo-500 opacity-10" />
                    <div className="relative z-10 flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">AI Buy Assistant</p>
                            <p className="text-[11px] font-medium leading-tight text-white/80">«Байер проявляет интерес к аксессуарам. Предложите Neural Scarf для апсейла».</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
