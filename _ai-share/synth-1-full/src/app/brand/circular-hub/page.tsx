'use client';

import { useState } from 'react';
import { 
  Leaf, 
  Search, 
  Filter, 
  ChevronRight, 
  ShoppingBag, 
  MapPin, 
  Layers, 
  Tag, 
  Clock, 
  ChevronLeft,
  ArrowRight,
  TrendingUp,
  Activity,
  Maximize2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Globe,
  Info
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MOCK_MATERIAL_LISTINGS, getConditionLabel, getConditionColor } from '@/lib/logic/circular-economy-utils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CircularEconomyHubPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredListings = MOCK_MATERIAL_LISTINGS.filter(listing => 
    (searchTerm === '' || listing.materialName.toLowerCase().includes(searchTerm.toLowerCase()) || listing.supplierName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedType === null || listing.type === selectedType)
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl animate-in fade-in duration-700">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        <Link href="/brand" className="hover:text-emerald-600 transition-colors">Бренд-офис</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-900">Circular Economy Hub</span>
      </div>

      {/* Hero Header */}
      <div className="bg-emerald-900 rounded-2xl p-4 md:p-3 text-white relative overflow-hidden shadow-xl border border-emerald-800 group">
        <div className="absolute top-0 right-0 p-4 opacity-[0.05] rotate-12 scale-150 group-hover:scale-[1.6] transition-transform duration-1000">
          <Leaf className="h-64 w-64" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-2xl border border-emerald-400">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Sustainability P3</p>
                <Badge className="bg-white/10 text-white/80 border-none text-[9px] uppercase tracking-wider font-bold h-5 shadow-inner">Eco System</Badge>
              </div>
              <h1 className="text-base font-bold uppercase tracking-tight leading-none">Circular Hub</h1>
              <p className="text-[11px] text-white/40 font-bold uppercase mt-4 tracking-wider flex items-center gap-3">
                <span>Доступно: <span className="text-emerald-400">2,450 кг</span></span>
                <span className="h-1 w-1 bg-white/20 rounded-full" />
                <span>Углеродный след: <span className="text-emerald-400">-12% CO2</span></span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Button className="bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl h-11 px-6 text-[10px] font-bold uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02]">
                Продать остатки
             </Button>
             <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl h-11 px-6 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md transition-all">
                Eco Аналитика
             </Button>
          </div>
        </div>
      </div>

      {/* Stats / Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
         <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
               <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                  <TrendingUp className="h-5 w-5" />
               </div>
               <div>
                  <h4 className="text-[13px] font-bold uppercase tracking-tight text-slate-900">Экономия до 60%</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">От рыночной цены</p>
               </div>
            </div>
            <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
               Покупайте качественные остатки тканей от ведущих брендов и фабрик по сниженным ценам.
            </p>
         </Card>

         <Card className="rounded-xl border border-slate-800 shadow-lg bg-slate-900 text-white p-4 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700"><ShieldCheck className="h-24 w-24 text-emerald-400" /></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
               <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 shadow-inner group-hover:bg-white/20 transition-all">
                  <Globe className="h-5 w-5 text-emerald-400" />
               </div>
               <div>
                  <h4 className="text-[13px] font-bold uppercase tracking-tight">Verified Quality</h4>
                  <p className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-wider mt-0.5">Synth Lab Verification</p>
               </div>
            </div>
            <p className="text-[13px] text-white/60 leading-relaxed relative z-10 font-medium">
               Каждый лот проходит автоматическую верификацию состава через сырьевой паспорт.
            </p>
         </Card>

         <Card className="rounded-xl border border-slate-100 shadow-sm bg-white p-4 hover:shadow-md transition-all">
            <div className="flex items-center gap-3 mb-4">
               <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                  <CheckCircle2 className="h-5 w-5" />
               </div>
               <div>
                  <h4 className="text-[13px] font-bold uppercase tracking-tight text-slate-900">ESG Отчетность</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Zero Waste сертификаты</p>
               </div>
            </div>
            <p className="text-[13px] text-slate-500 leading-relaxed font-medium">
               Сделки автоматически учитываются в годовом ESG-отчете как вклад в экономику цикла.
            </p>
         </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Поиск по ткани, цвету или поставщику..." 
              className="pl-11 h-11 rounded-xl bg-white border-none shadow-sm text-[12px] font-medium tracking-tight focus:ring-2 focus:ring-emerald-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-1.5 px-1">
            {[
              { id: 'fabric', label: 'Ткани' },
              { id: 'leather', label: 'Кожа' },
              { id: 'yarn', label: 'Пряжа' },
              { id: 'trims', label: 'Фурнитура' }
            ].map((type) => (
              <Button 
                key={type.id}
                variant={selectedType === type.id ? 'default' : 'ghost'}
                onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                className={cn(
                  "h-9 rounded-lg px-4 text-[10px] font-bold uppercase tracking-wider transition-all",
                  selectedType === type.id ? "bg-emerald-600 text-white shadow-md shadow-emerald-100 hover:bg-emerald-700" : "text-slate-500 hover:bg-white hover:shadow-sm"
                )}
              >
                {type.label}
              </Button>
            ))}
         </div>
      </div>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
         <AnimatePresence>
            {filteredListings.map((listing) => (
               <motion.div
                 key={listing.id}
                 layout
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.95 }}
               >
                  <Card className="group cursor-pointer border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all rounded-xl overflow-hidden bg-white">
                     <div className="aspect-[16/10] relative overflow-hidden bg-slate-50">
                        <img 
                          src={listing.images[0]} 
                          alt={listing.materialName}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-[1.5s]"
                        />
                        <div className="absolute top-3 left-3 flex gap-1.5">
                           <Badge className={cn("border-none text-[9px] font-bold uppercase px-2 h-5 shadow-md", getConditionColor(listing.condition))}>
                              {getConditionLabel(listing.condition)}
                           </Badge>
                           {listing.isEcoCertified && (
                              <Badge className="bg-emerald-600 text-white border-none text-[9px] font-bold uppercase px-2 h-5 shadow-md">
                                 <Leaf className="h-2.5 w-2.5 mr-1" /> Eco
                              </Badge>
                           )}
                        </div>
                        <div className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-emerald-600 shadow-lg group-hover:bg-emerald-600 group-hover:text-white transition-all transform translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                           <ShoppingBag className="h-4.5 w-4.5" />
                        </div>
                     </div>
                     <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-3">
                           <div>
                              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">{listing.supplierName}</p>
                              <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight">{listing.materialName}</h3>
                           </div>
                           <div className="text-right">
                              <p className="text-[15px] font-bold text-slate-900">{listing.pricePerUnit.toLocaleString('ru-RU')} ₽</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">/ {listing.unit === 'meters' ? 'метр' : 'кг'}</p>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-50 mb-4 bg-slate-50/50 rounded-lg px-3">
                           <div>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Состав</p>
                              <p className="text-[11px] font-bold text-slate-700 truncate">{listing.composition}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">В наличии</p>
                              <p className="text-[11px] font-bold text-slate-700">{listing.quantity} {listing.unit === 'meters' ? 'м' : 'кг'}</p>
                           </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                           <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                              <MapPin className="h-3 w-3 text-emerald-600" />
                              <span>{listing.location}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-md">-{Math.round((1 - listing.pricePerUnit / (listing.originalPrice || listing.pricePerUnit)) * 100)}%</span>
                              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </motion.div>
            ))}
         </AnimatePresence>
      </div>
    </div>
  );
}
