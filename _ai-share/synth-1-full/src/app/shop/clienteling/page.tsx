'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserCircle, 
  ShoppingCart, 
  Heart, 
  Star, 
  Clock, 
  MapPin, 
  History, 
  Zap, 
  BrainCircuit, 
  Info, 
  MessageSquare, 
  Plus, 
  Search, 
  ArrowRight,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Scale,
  Package,
  Layers,
  Sparkles,
  UserCheck,
  Phone,
  Mail,
  MoreVertical,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CustomerProfile, RecommendationEngineResult } from '@/lib/types/clienteling';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

/**
 * Clienteling 2.0 Dash — Shop OS
 * Планшет продавца с глубоким профилем клиента и AI-рекомендациями.
 */

export default function ClientelingDashPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'recommendations'>('profile');
  const [customer, setCustomer] = useState<CustomerProfile>({
    id: 'C-8812',
    name: 'Alexandra Romanova',
    email: 'alexandra.r@example.com',
    phone: '+7 900 123-45-67',
    avatarUrl: '/avatars/alexandra.jpg',
    totalSpent: 4250,
    lastVisit: '2026-03-05T14:00:00Z',
    loyaltyTier: 'gold',
    loyaltyPoints: 1250,
    measurements: {
      id: 'm-1',
      clientId: 'C-8812',
      height: 172,
      weight: 60,
      chest: 88,
      waist: 65,
      hips: 92,
      shoulders: 40,
      armLength: 58,
      legLength: 102,
      scanMethod: 'photo_ai',
      lastUpdated: '2026-02-15T10:00:00Z'
    },
    stylePreferences: ['Oversized', 'Minimalism', 'Natural Fabrics'],
    favoriteCategories: ['Knitwear', 'Dresses', 'Outerwear'],
    dislikedMaterials: ['Polyester', 'Synthetic fur'],
    wishlist: ['P-101', 'P-102'],
    purchaseHistory: [
      { orderId: 'ORD-1', date: '2026-02-15', amount: 850, items: [{ productId: 'p-1', name: 'Silk Blouse', size: 'S', color: 'White' }], storeId: 'Moscow City' },
      { orderId: 'ORD-2', date: '2025-12-20', amount: 1200, items: [{ productId: 'p-2', name: 'Wool Coat', size: 'S', color: 'Camel' }], storeId: 'Online' }
    ],
    staffNotes: [
      { id: 'n-1', staffId: 'S-42', staffName: 'Elena K.', text: 'Предпочитает примерку в отдельной кабине. Любит кофе без молока.', createdAt: '2026-02-15' }
    ]
  });

  const recommendations: RecommendationEngineResult = {
    customerId: 'C-8812',
    suggestedProducts: [
      { productId: 'p-1', name: 'Silk Trousers', reason: 'Matches previous purchase of Silk Blouse', score: 98 },
      { productId: 'p-2', name: 'Cashmere Sweater', reason: 'Fits preference for Minimalism & Natural Fabrics', score: 92 },
      { productId: 'p-3', name: 'Leather Belt', reason: 'Perfect accessory for the Oversized look', score: 85 }
    ] as any,
    styleInsight: "Клиент ценит тактильность и качество швов. Фокус на материалах."
  };

  return (
    <div className="container mx-auto px-4 py-4 space-y-10">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
            <UserCheck className="w-3 h-3" />
            Clienteling 2.0 Intelligence
          </div>
          <h1 className="text-sm font-black font-headline tracking-tighter uppercase">Customer Tablet</h1>
          <p className="text-muted-foreground font-medium">Инструмент продавца: глубокий профиль клиента и AI-ассистент продаж.</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
              <Input placeholder="Поиск клиента (Имя/Телефон)" className="pl-9 h-11 rounded-xl border-slate-100 text-xs w-64 shadow-sm" />
           </div>
           <Button className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px] bg-slate-900 text-white shadow-lg shadow-slate-200">
              <Plus className="w-4 h-4" /> Новый клиент
           </Button>
        </div>
      </header>

      {/* Profile Header Card */}
      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-white p-3 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full translate-x-32 -translate-y-32 opacity-30" />
         
         <div className="relative z-10 flex flex-col md:flex-row gap-3 items-start">
            <div className="h-32 w-32 rounded-xl bg-slate-100 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
               <UserCircle className="w-24 h-24 text-slate-300" />
            </div>
            
            <div className="flex-1 space-y-6">
               <div className="space-y-2">
                  <div className="flex items-center gap-3">
                     <h2 className="text-base font-black tracking-tighter uppercase">{customer.name}</h2>
                     <Badge variant="outline" className={cn(
                        "text-[10px] font-black uppercase px-3 h-6",
                        customer.loyaltyTier === 'gold' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-400 border-slate-100"
                     )}>
                        {customer.loyaltyTier.toUpperCase()} MEMBER
                     </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 items-center">
                     <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Phone className="w-3 h-3" /> {customer.phone}
                     </div>
                     <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Mail className="w-3 h-3" /> {customer.email}
                     </div>
                     <div className="flex items-center gap-1.5 text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
                        <Star className="w-3 h-3 fill-indigo-600" /> {customer.loyaltyPoints} POINTS
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-slate-50">
                  {[
                    { label: 'Total Spent', value: `$${customer.totalSpent.toLocaleString()}`, icon: DollarSign, color: 'text-slate-900' },
                    { label: 'Last Visit', value: '2 дня назад', icon: Clock, color: 'text-indigo-600' },
                    { label: 'Items in Wishlist', value: customer.wishlist.length, icon: Heart, color: 'text-rose-500' },
                    { label: 'Purchased Items', value: '12', icon: Package, color: 'text-emerald-600' }
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1">
                       <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                          <stat.icon className="w-2.5 h-2.5" /> {stat.label}
                       </p>
                       <p className={cn("text-base font-black", stat.color)}>{stat.value}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
               <Button className="rounded-xl h-12 px-8 font-black uppercase text-[10px] bg-slate-900 text-white shadow-xl shadow-slate-200">
                  Оформить продажу
               </Button>
               <Button variant="outline" className="rounded-xl h-12 px-8 font-black uppercase text-[10px] border-slate-100 hover:bg-slate-50">
                  Добавить замер (AI Scan)
               </Button>
            </div>
         </div>
      </Card>

      <div className="grid lg:grid-cols-12 gap-3">
         {/* AI Style Assistant Panel */}
         <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-xl shadow-indigo-100 rounded-xl bg-indigo-600 text-white p-4 overflow-hidden relative">
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                        <BrainCircuit className="w-5 h-5" />
                     </div>
                     <h3 className="text-sm font-black uppercase tracking-tight">AI Sales Stylist</h3>
                  </div>

                  <div className="space-y-4">
                     <p className="text-xs text-white/70 leading-relaxed font-medium">
                        "{recommendations.styleInsight}"
                     </p>
                     
                     <div className="space-y-3 pt-4">
                        <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Suggested for today</p>
                        {recommendations.suggestedProducts.map((rec, i) => (
                           <div key={i} className="flex gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-all cursor-pointer">
                              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-indigo-200 text-xs">
                                 {rec.score}%
                              </div>
                              <div className="space-y-0.5">
                                 <p className="text-xs font-black uppercase tracking-tight">{rec.name}</p>
                                 <p className="text-[9px] text-white/40 font-medium leading-tight">{rec.reason}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 ml-auto text-white/20 group-hover:text-white transition-colors self-center" />
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
               <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-400/20 rounded-full translate-y-16 translate-x-16 blur-3xl" />
            </Card>

            <Card className="border-none shadow-sm rounded-xl p-4 bg-white space-y-6">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Staff Notes</h3>
               <div className="space-y-4">
                  {customer.staffNotes.map(note => (
                     <div key={note.id} className="p-4 bg-slate-50 rounded-2xl space-y-2">
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">"{note.text}"</p>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                           <span className="text-[9px] font-black uppercase text-slate-400">{note.staffName}</span>
                           <span className="text-[9px] font-bold text-slate-400">{note.createdAt}</span>
                        </div>
                     </div>
                  ))}
                  <Button variant="ghost" className="w-full h-10 rounded-xl text-indigo-600 hover:bg-indigo-50 font-black uppercase text-[9px] gap-2">
                     <Plus className="w-3 h-3" /> Добавить заметку
                  </Button>
               </div>
            </Card>
         </div>

         {/* Deep Profile Details */}
         <div className="lg:col-span-8 space-y-6">
            <div className="flex gap-2 p-1 bg-slate-100/50 rounded-2xl w-fit">
               {[
                 { id: 'profile', label: 'Style & Fit', icon: Layers },
                 { id: 'history', label: 'Purchase History', icon: History },
                 { id: 'recommendations', label: 'Full Catalog Match', icon: Sparkles },
               ].map(tab => (
                 <Button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    variant={activeTab === tab.id ? 'default' : 'ghost'}
                    className={cn(
                       "rounded-xl h-10 px-6 font-black uppercase text-[9px] gap-2 transition-all",
                       activeTab === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                    )}
                 >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                 </Button>
               ))}
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-white p-3 overflow-hidden min-h-[500px]">
               {activeTab === 'profile' && (
                  <div className="grid md:grid-cols-2 gap-3">
                     <div className="space-y-4">
                        <div className="space-y-4">
                           <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-900 flex items-center gap-2">
                              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Style DNA
                           </h4>
                           <div className="flex flex-wrap gap-2">
                              {customer.stylePreferences.map(pref => (
                                 <Badge key={pref} className="bg-slate-900 text-white rounded-full px-4 h-8 font-black uppercase text-[8px] border-none">
                                    {pref}
                                 </Badge>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-4 pt-8 border-t border-slate-50">
                           <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-900 flex items-center gap-2">
                              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Favorite Categories
                           </h4>
                           <div className="flex flex-wrap gap-2">
                              {customer.favoriteCategories.map(cat => (
                                 <Badge key={cat} variant="outline" className="rounded-full px-4 h-8 font-black uppercase text-[8px] text-slate-500 border-slate-200">
                                    {cat}
                                 </Badge>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-4 pt-8 border-t border-slate-50">
                           <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-rose-600 flex items-center gap-2">
                              <AlertTriangle className="w-3.5 h-3.5" /> Restrictions
                           </h4>
                           <div className="flex flex-wrap gap-2">
                              {customer.dislikedMaterials.map(mat => (
                                 <Badge key={mat} variant="ghost" className="bg-rose-50 text-rose-600 rounded-full px-4 h-8 font-black uppercase text-[8px]">
                                    {mat}
                                 </Badge>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="bg-slate-50 rounded-xl p-4 space-y-4">
                        <div className="flex justify-between items-center">
                           <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-900">Digital Twin (Body Metrics)</h4>
                           <Badge variant="outline" className="bg-white text-emerald-600 border-emerald-100 font-black uppercase text-[8px] px-2 h-5">Verified</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-y-6">
                           {[
                             { label: 'Рост', value: `${customer.measurements?.height} cm` },
                             { label: 'Грудь', value: `${customer.measurements?.chest} cm` },
                             { label: 'Талия', value: `${customer.measurements?.waist} cm` },
                             { label: 'Бедра', value: `${customer.measurements?.hips} cm` },
                             { label: 'Shoulders', value: `${customer.measurements?.shoulders} cm` },
                             { label: 'Leg Length', value: `${customer.measurements?.legLength} cm` }
                           ].map((m, i) => (
                             <div key={i} className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-slate-400">{m.label}</p>
                                <p className="text-sm font-black text-slate-900">{m.value}</p>
                             </div>
                           ))}
                        </div>

                        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                           <span className="text-[9px] font-black uppercase text-slate-400">Last updated: {new Date(customer.measurements?.lastUpdated!).toLocaleDateString()}</span>
                           <Button variant="ghost" size="sm" className="h-7 rounded-lg text-[9px] font-black uppercase text-indigo-600 gap-1 p-0">
                              Update Scan <ChevronRight className="w-3 h-3" />
                           </Button>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'history' && (
                  <div className="space-y-6">
                     {customer.purchaseHistory.map((record, i) => (
                        <div key={record.orderId} className="group p-4 bg-slate-50 rounded-3xl hover:bg-slate-100 transition-all cursor-pointer">
                           <div className="flex justify-between items-start mb-4">
                              <div className="space-y-1">
                                 <p className="text-[10px] font-black uppercase text-slate-400">{record.date}</p>
                                 <h5 className="text-sm font-black text-slate-900 uppercase tracking-tighter">{record.orderId}</h5>
                              </div>
                              <div className="text-right">
                                 <p className="text-base font-black text-slate-900">${record.amount}</p>
                                 <p className="text-[9px] font-black uppercase text-indigo-600">{record.storeId}</p>
                              </div>
                           </div>
                           <div className="flex gap-3">
                              {record.items.map((item, idx) => (
                                 <div key={idx} className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-slate-200">
                                       <Package className="w-5 h-5 text-slate-300" />
                                    </div>
                                    <div className="space-y-0.5">
                                       <p className="text-xs font-black uppercase tracking-tight text-slate-700">{item.name}</p>
                                       <p className="text-[10px] text-slate-400 font-bold">{item.size} • {item.color}</p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               )}

               {activeTab === 'recommendations' && (
                  <div className="py-10 text-center space-y-6 max-w-sm mx-auto">
                     <div className="h-20 w-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-10 h-10 text-indigo-600 animate-pulse" />
                     </div>
                     <h3 className="text-base font-black uppercase tracking-tight text-slate-900">AI Catalog Integration</h3>
                     <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        Анализ всего глобального стока (3000+ SKU) для подбора идеальных луков под ДНК клиента.
                     </p>
                     <Button className="rounded-xl h-12 px-8 font-black uppercase text-[10px] bg-slate-900 text-white shadow-xl">
                        Запустить полный подбор
                     </Button>
                  </div>
               )}
            </Card>
         </div>
      </div>
    </div>
  );
}
