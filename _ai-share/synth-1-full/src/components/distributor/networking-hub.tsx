'use client';

import React from 'react';
import { 
  Users, MessageSquare, Handshake, Globe, 
  Zap, Briefcase, Star, Search, Filter, 
  ArrowUpRight, Target, Share2, Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from '@/lib/utils';

const MOCK_COLLABS = [
  { id: 1, title: 'Nordic x Cyber Capsule', partners: ['Nordic Wool', 'Cyber Silk'], status: 'Drafting', impact: 'High Trend' },
  { id: 2, title: 'Zero Waste Initiative', partners: ['Syntha Factory', 'All Brands'], status: 'Active', impact: 'Eco-Standard' }
];

const MOCK_PEOPLE = [
  { name: 'Анна К.', role: 'Senior Buyer @ ЦУМ', tags: ['Contemporary', 'Premium'], online: true },
  { name: 'Марк Р.', role: 'Designer @ Nordic Wool', tags: ['Knitwear', 'Sustainable'], online: false },
  { name: 'Иван С.', role: 'COO @ Tech Factory', tags: ['Supply Chain', 'Scale'], online: true }
];

export function B2BNetworkingHub() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
         <Card className="lg:col-span-2 rounded-xl border-none shadow-2xl bg-indigo-600 text-white p-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Globe className="h-48 w-48" /></div>
            <div className="relative z-10 space-y-6">
               <Badge className="bg-white/20 text-white border-none uppercase text-[9px] font-black tracking-widest">Global Fashion Network</Badge>
               <h3 className="text-sm font-black uppercase tracking-tighter">B2B Коллаборации & Связи</h3>
               <p className="text-indigo-100 font-medium max-w-xl text-sm">
                  Центр профессионального общения. Создавайте совместные капсулы, делитесь инсайтами и находите экспертов рынка.
               </p>
               <div className="flex gap-3">
                  <Button className="h-10 px-8 bg-white text-indigo-600 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 transition-transform">Предложить коллаборацию</Button>
                  <Button variant="outline" className="h-10 px-8 border-white/20 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/5">Найти эксперта</Button>
               </div>
            </div>
         </Card>

         <Card className="rounded-xl border-none shadow-xl bg-slate-900 text-white p-4 space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
               <Target className="h-4 w-4" /> Активные Тендеры
            </h4>
            <div className="space-y-4">
               {[
                 { title: 'Поиск дизайнера (FW26)', budget: 'High', bids: 12 },
                 { title: 'Сорсинг: Recycled Wool', budget: 'Medium', bids: 5 }
               ].map((tender, i) => (
                 <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2 group hover:bg-white/10 transition-all cursor-pointer">
                    <p className="text-[10px] font-black uppercase">{tender.title}</p>
                    <div className="flex justify-between items-center text-[8px] font-bold text-white/40 uppercase">
                       <span>{tender.bids} заявок</span>
                       <span className="text-indigo-400">View Details</span>
                    </div>
                 </div>
               ))}
            </div>
            <Button className="w-full bg-indigo-600 h-12 rounded-xl font-black uppercase text-[9px]">Все предложения</Button>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
         {/* Newsfeed / Professional Feed */}
         <div className="lg:col-span-8 space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Профессиональная лента</h4>
            <div className="space-y-6">
               {[1, 2].map(i => (
                 <Card key={i} className="rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-6">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <Avatar className="h-12 w-12 border-2 border-indigo-50 shadow-sm">
                                <AvatarFallback className="bg-slate-900 text-white text-xs font-black">NK</AvatarFallback>
                             </Avatar>
                             <div>
                                <p className="text-sm font-black uppercase text-slate-900">Nordic Wool Official</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Опубликовано 2ч назад • Insight</p>
                             </div>
                          </div>
                          <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px]">Verified Brand</Badge>
                       </div>
                       
                       <p className="text-sm text-slate-600 font-medium leading-relaxed">
                          «Мы завершили аудит нашей новой цепочки поставок в Турции. Прозрачность повышена на 40%, готовы делиться контактами сертифицированных фабрик для партнеров Syntha».
                       </p>

                       <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                          <div className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors">
                             <MessageSquare className="h-4 w-4" />
                             <span className="text-[10px] font-black uppercase">Обсудить (12)</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 hover:text-rose-500 cursor-pointer transition-colors">
                             <Share2 className="h-4 w-4" />
                             <span className="text-[10px] font-black uppercase">Поделиться</span>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
               ))}
            </div>
         </div>

         {/* Industry Leaders / Contacts */}
         <div className="lg:col-span-4 space-y-4">
            <Card className="rounded-xl border-none shadow-xl bg-white p-4 space-y-6">
               <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" /> Лидеры мнений
               </h4>
               <div className="space-y-4">
                  {MOCK_PEOPLE.map((person, i) => (
                    <div key={i} className="flex items-center gap-3 group cursor-pointer">
                       <div className="relative">
                          <Avatar className="h-10 w-10 border border-slate-100 group-hover:scale-110 transition-transform">
                             <AvatarFallback className="bg-indigo-50 text-indigo-600 text-[10px] font-black">{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          {person.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border-2 border-white rounded-full" />}
                       </div>
                       <div className="flex-1">
                          <p className="text-[10px] font-black uppercase text-slate-900 leading-tight">{person.name}</p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase">{person.role}</p>
                       </div>
                       <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUpRight className="h-3.5 w-3.5 text-slate-400" /></Button>
                    </div>
                  ))}
               </div>
               <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 text-slate-400 text-[9px] font-black uppercase hover:text-indigo-600">Вся сеть (4.2k)</Button>
            </Card>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
               <div className="flex items-center gap-2 text-indigo-600">
                  <Zap className="h-4 w-4 fill-indigo-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Syntha Event</span>
               </div>
               <p className="text-[11px] font-black uppercase text-slate-900 leading-tight">B2B Meetup: Digital Fashion Future</p>
               <p className="text-[9px] text-slate-500 font-medium italic">14 Февраля • Online • Moscow HQ</p>
               <Button className="w-full h-10 bg-slate-900 text-white rounded-xl text-[8px] font-black uppercase tracking-widest">Зарегистрироваться</Button>
            </div>
         </div>
      </div>
    </div>
  );
}
