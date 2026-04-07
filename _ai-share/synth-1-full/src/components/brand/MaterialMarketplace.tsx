'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    image: '/fabrics/cotton-320.jpg'
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
    image: '/hardware/zipper.jpg'
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
    image: '/fabrics/silk.jpg'
  }
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
    bids: 12
  },
  {
    id: 'LOT-993',
    item: 'Лот: Пуговицы натуральные (Shell)',
    partner: 'Eco-Trim',
    qty: '2,000 шт',
    startPrice: '12 ₽/шт',
    currentBid: '15 ₽/шт',
    endTime: '1ч 15мин',
    bids: 8
  }
];

interface MaterialMarketplaceProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialQuery?: string;
}

export function MaterialMarketplace({ isOpen, onOpenChange, initialQuery = "" }: MaterialMarketplaceProps) {
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
    return PARTNER_MATERIALS.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.partner.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] bg-white border-none rounded-3xl p-0 overflow-hidden shadow-2xl flex flex-col">
        <DialogHeader className="p-6 bg-slate-900 text-white shrink-0 relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/20">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black uppercase tracking-tighter">Биржа материалов и фурнитуры</DialogTitle>
                <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Реестр партнеров платформы и аукцион остатков (Stock & Auction)
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 shrink-0">
               <div className="text-right">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Доступно к заказу</p>
                  <p className="text-sm font-black tabular-nums">42,500+ <span className="text-indigo-400">SKU</span></p>
               </div>
               <div className="h-8 w-[1px] bg-white/10" />
               <Zap className="h-5 w-5 text-amber-400 animate-pulse" />
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Поиск ткани, фурнитуры или партнера..." 
                className="pl-10 h-10 bg-white border-slate-200 rounded-xl text-sm font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-10 rounded-xl border-slate-200 bg-white gap-2 font-black uppercase text-[10px] tracking-widest">
              <Filter className="h-4 w-4 text-slate-400" /> Фильтры
            </Button>
          </div>

          <div className="flex-1 overflow-hidden flex">
            {/* Sidebar Tabs */}
            <div className="w-48 border-r border-slate-100 bg-slate-50/50 p-2 space-y-1">
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
                    "w-full flex items-center gap-3 px-4 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    activeTab === tab.id ? "bg-white text-indigo-600 shadow-sm border border-indigo-100" : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'registry' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {filteredMaterials.map((m) => (
                      <Card key={m.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all group flex flex-col">
                        <div className="aspect-video bg-slate-100 relative overflow-hidden">
                           <div className="absolute inset-0 flex items-center justify-center">
                              <ShoppingBag className="h-12 w-12 text-slate-200" />
                           </div>
                           <div className="absolute top-2 left-2 flex gap-1">
                              {m.certificates.map(c => (
                                <Badge key={c} className="bg-emerald-500 text-white border-none text-[7px] font-black h-4 px-1">{c}</Badge>
                              ))}
                           </div>
                           <div className="absolute top-2 right-2">
                              <Badge className="bg-white/90 text-slate-900 border-none text-[8px] font-black h-5 px-2 shadow-sm">{m.category}</Badge>
                           </div>
                        </div>
                        <div className="p-4 space-y-3 flex-1 flex flex-col">
                           <div className="space-y-1">
                              <h4 className="text-xs font-black uppercase text-slate-900 group-hover:text-indigo-600 transition-colors">{m.name}</h4>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.partner}</p>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-2">
                              <div className="p-2 bg-slate-50 rounded-xl space-y-0.5">
                                 <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Цена</p>
                                 <p className="text-xs font-black text-slate-900 tabular-nums">{m.price}</p>
                              </div>
                              <div className="p-2 bg-slate-50 rounded-xl space-y-0.5">
                                 <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Сток</p>
                                 <p className="text-xs font-black text-slate-900 tabular-nums">{m.stock}</p>
                              </div>
                           </div>

                           <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-slate-400 pt-2 border-t border-slate-50">
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-indigo-400" /> {m.leadTime}</span>
                              <span className="flex items-center gap-0.5"><Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" /> {m.rating}</span>
                           </div>

                           <div className="pt-2 mt-auto flex gap-2">
                              <Button 
                                onClick={() => setIsChatOpen(true)}
                                variant="outline" 
                                size="sm" 
                                className="flex-1 h-8 rounded-lg border-slate-200 text-[9px] font-black uppercase gap-1.5 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                              >
                                 <MessageSquare className="h-3 w-3" /> Чат
                              </Button>
                              <Button 
                                size="sm" 
                                className="flex-[2] h-8 rounded-lg bg-slate-900 text-white text-[9px] font-black uppercase gap-1.5 hover:bg-indigo-600 transition-all shadow-md"
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
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center">
                             <Gavel className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                             <h4 className="text-sm font-black uppercase text-amber-900">Аукцион горячих остатков</h4>
                             <p className="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Успейте забронировать МТР по ценам ниже рынка на 30-50%</p>
                          </div>
                       </div>
                       <Badge className="bg-amber-500 text-white border-none animate-pulse text-[8px] font-black uppercase h-5 px-2">Live Now</Badge>
                    </div>

                    <div className="space-y-3">
                       {AUCTION_LOTS.map((lot) => (
                         <div key={lot.id} className="p-4 border border-slate-100 rounded-2xl hover:border-amber-200 hover:shadow-md transition-all group bg-white flex justify-between items-center">
                            <div className="flex items-center gap-4">
                               <div className="h-14 w-14 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 group-hover:scale-105 transition-all">
                                  <ShoppingBag className="h-6 w-6 text-slate-200" />
                               </div>
                               <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                     <h5 className="text-xs font-black uppercase text-slate-900">{lot.item}</h5>
                                     <Badge variant="outline" className="text-[7px] font-black uppercase px-1 h-3.5 border-slate-200 text-slate-400">{lot.id}</Badge>
                                  </div>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{lot.partner} • {lot.qty}</p>
                                  <div className="flex items-center gap-3 mt-1">
                                     <span className="text-[10px] font-black text-rose-500 tabular-nums bg-rose-50 px-1.5 py-0.5 rounded-md">{lot.currentBid}</span>
                                     <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic line-through">Start: {lot.startPrice}</span>
                                  </div>
                               </div>
                            </div>
                            
                            <div className="flex items-center gap-6">
                               <div className="text-right">
                                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">До конца</p>
                                  <p className="text-xs font-black text-indigo-600 tabular-nums flex items-center gap-1 justify-end"><Clock className="h-3 w-3" /> {lot.endTime}</p>
                               </div>
                               <div className="h-10 w-[1px] bg-slate-100" />
                               <div className="space-y-2">
                                  <Button className="h-9 bg-slate-900 text-white text-[9px] font-black uppercase px-6 rounded-xl hover:bg-amber-500 transition-all gap-2 shadow-lg">
                                     Сделать ставку <Zap className="h-3 w-3 fill-white" />
                                  </Button>
                                  <p className="text-[7px] text-center font-bold text-slate-400 uppercase tracking-widest">{lot.bids} ставок сделано</p>
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

        <DialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <Badge className="bg-indigo-100 text-indigo-700 border-none text-[8px] font-black uppercase px-2 h-5 tracking-widest">Market Status</Badge>
              <p className="text-[9px] font-bold text-slate-500 italic">"Все сделки защищены Escrow-сервисом платформы. Доставка от 24 часов."</p>
           </div>
           <div className="flex gap-3">
              <Button variant="ghost" className="h-11 font-black uppercase text-[10px] tracking-widest text-slate-400" onClick={() => onOpenChange(false)}>Закрыть</Button>
              <Button className="h-11 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest px-10 shadow-xl shadow-indigo-200 transition-all gap-2">
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
              className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl border-l border-slate-100 z-50 flex flex-col"
            >
               <div className="p-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-black">TU</div>
                     <div>
                        <p className="text-[10px] font-black uppercase">Textile-Union</p>
                        <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Online</p>
                     </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)} className="h-8 w-8 text-white hover:bg-white/10 rounded-full"><ChevronRight className="h-4 w-4" /></Button>
               </div>
               <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  <div className="p-3 bg-slate-50 rounded-2xl rounded-tl-none mr-8">
                     <p className="text-[10px] text-slate-600 leading-relaxed font-medium">Здравствуйте! На этот артикул у нас сейчас действует спецпредложение. Могу прислать фото образцов в высоком разрешении.</p>
                  </div>
                  <div className="p-3 bg-indigo-600 text-white rounded-2xl rounded-tr-none ml-8 shadow-md">
                     <p className="text-[10px] leading-relaxed font-medium">Добрый день! Да, пришлите фото и сертификат OEKO-TEX актуальный.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <div className="aspect-square bg-slate-100 rounded-xl border border-dashed border-slate-200 flex items-center justify-center"><Camera className="h-4 w-4 text-slate-300" /></div>
                     <div className="aspect-square bg-slate-100 rounded-xl border border-dashed border-slate-200 flex items-center justify-center"><FileText className="h-4 w-4 text-slate-300" /></div>
                  </div>
               </div>
               <div className="p-4 border-t border-slate-100 bg-slate-50">
                  <div className="relative">
                     <Input placeholder="Напишите поставщику..." className="h-10 bg-white border-slate-200 rounded-xl text-[10px] font-bold pr-10 shadow-inner" />
                     <Button size="icon" className="absolute right-1 top-1 h-8 w-8 bg-indigo-600 rounded-lg"><ArrowRight className="h-3 w-3 text-white" /></Button>
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
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white", className)}>{children}</div>
);
