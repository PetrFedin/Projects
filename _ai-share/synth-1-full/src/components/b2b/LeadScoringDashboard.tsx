'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  Target, 
  Filter, 
  Search, 
  Star,
  ArrowUpRight,
  Zap,
  Briefcase,
  BarChart3,
  Globe,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';

export function LeadScoringDashboard() {
  const { wholesaleLeads } = useB2BState();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'high_score' | 'qualified'>('all');

  const filteredLeads = useMemo(() => {
    let list = wholesaleLeads;
    if (activeTab === 'high_score') list = list.filter(l => l.score >= 80);
    if (activeTab === 'qualified') list = list.filter(l => l.status === 'qualified');
    if (searchQuery) {
      list = list.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()) || l.location.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list;
  }, [wholesaleLeads, searchQuery, activeTab]);

  return (
    <div className="space-y-4 p-4 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Target className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-indigo-100 text-indigo-600 uppercase font-black tracking-widest text-[9px]">
              AI_Lead_Engine_v2.0
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Оценка Оптовых<br/>Лидов (Scoring)
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Поиск лидов..." 
              className="pl-10 h-12 rounded-2xl border-slate-100 bg-white focus-visible:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 w-12 rounded-2xl border-slate-100 p-0 bg-white">
            <Filter className="h-4 w-4" />
          </Button>
          <Button className="h-12 bg-slate-900 text-white rounded-2xl px-6 font-black uppercase text-[10px] tracking-widest gap-2">
            Импорт лидов
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { label: 'Всего проспектов', value: '1,240', change: '+12%', icon: Users, color: 'blue' },
          { label: 'Высокий потенциал', value: '84', change: '+8%', icon: Zap, color: 'amber' },
          { label: 'Конверсия', value: '14.2%', change: '+2.4%', icon: TrendingUp, color: 'emerald' },
          { label: 'Объем воронки', value: '42.5M ₽', change: '+18%', icon: BarChart3, color: 'indigo' }
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center",
                  stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                  stat.color === 'amber' ? "bg-amber-50 text-amber-600" :
                  stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                )}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black">{stat.change}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-sm font-black text-slate-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Lead List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 p-1 bg-white border border-slate-100 rounded-2xl w-fit">
            {(['all', 'high_score', 'qualified'] as const).map((tab) => (
              <Button
                key={tab}
                variant="ghost"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "h-10 px-6 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all",
                  activeTab === tab ? "bg-slate-900 text-white" : "text-slate-400"
                )}
              >
                {tab === 'all' ? 'Все' : tab === 'high_score' ? 'Высокий балл' : 'Квалифицирован'}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <motion.div
                key={lead.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group p-4 bg-white rounded-xl border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-indigo-200 transition-all cursor-pointer"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                        <Briefcase className="h-8 w-8 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                      <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-[10px] font-black text-indigo-600">
                        {lead.score}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-slate-900 uppercase tracking-tight leading-none">{lead.name}</h4>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                          <MapPin className="h-3 w-3" /> {lead.location}
                        </div>
                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {lead.source}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Ожид. объем</p>
                      <p className="text-sm font-black text-slate-900">{(lead.estimatedVolume / 1000).toFixed(0)}K ₽ / год</p>
                    </div>
                    <div className="h-10 w-px bg-slate-100" />
                    <Badge className={cn(
                      "border-none text-[8px] font-black uppercase tracking-widest px-3 py-1",
                      lead.status === 'qualified' ? "bg-emerald-50 text-emerald-600" :
                      lead.status === 'negotiation' ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-600"
                    )}>
                      {lead.status === 'qualified' ? 'Квалифицирован' : 
                       lead.status === 'negotiation' ? 'Переговоры' : 
                       lead.status === 'prospect' ? 'Проспект' : lead.status}
                    </Badge>
                    <Button variant="ghost" className="h-10 w-10 rounded-xl p-0 hover:bg-slate-50">
                      <ArrowUpRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                   <div className="flex gap-2">
                     {lead.tags.map(tag => (
                       <Badge key={tag} variant="outline" className="text-[7px] border-slate-100 text-slate-400 uppercase font-bold">{tag}</Badge>
                     ))}
                   </div>
                   <div className="flex items-center gap-3">
                     <span className="text-[9px] font-bold text-slate-300 uppercase">Последняя активность: {new Date(lead.lastActivity).toLocaleDateString()}</span>
                     <Button className="h-8 bg-indigo-600 text-white rounded-lg px-4 text-[9px] font-black uppercase tracking-widest gap-2">
                       Написать <MessageSquare className="h-3 w-3" />
                     </Button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <div className="space-y-4">
           <Card className="border-none shadow-2xl shadow-indigo-100/50 rounded-xl bg-indigo-600 text-white overflow-hidden">
             <CardContent className="p-4 space-y-6">
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-black uppercase tracking-tight">AI Ассистент Продаж</h3>
                  <p className="text-indigo-100 text-[10px] font-medium leading-relaxed opacity-80 uppercase tracking-widest">Инсайты и прогнозы рынка</p>
                </div>
                <div className="space-y-4">
                  {[
                    "Рынок Токио показывает 40% рост спроса на техвир.",
                    "Высокий балл для 'Berlin Tech-Wear' из-за совпадения эстетического ДНК.",
                    "Ритейлер 'ret-1' имеет свободный лимит (OTB) на 200 единиц Cyber Parka."
                  ].map((insight, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/10 border border-white/5 flex items-start gap-3">
                      <div className="h-5 w-5 rounded-lg bg-indigo-400 flex items-center justify-center mt-0.5">
                        <TrendingUp className="h-3 w-3 text-white" />
                      </div>
                      <p className="text-[10px] font-bold leading-normal">{insight}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full h-12 rounded-2xl bg-white text-indigo-600 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50">
                  Сформировать полный отчет
                </Button>
             </CardContent>
           </Card>

           <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl p-4 bg-white space-y-6">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Региональное распределение</p>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Глобальный охват</h4>
              </div>
              <div className="space-y-4">
                {[
                  { region: 'Европа', share: 45, color: 'indigo' },
                  { region: 'Азия', share: 30, color: 'blue' },
                  { region: 'Америка', share: 25, color: 'emerald' }
                ].map((reg, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase">
                      <span className="text-slate-600">{reg.region}</span>
                      <span className="text-slate-900">{reg.share}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                       <div className={cn("h-full rounded-full", reg.color === 'indigo' ? "bg-indigo-600" : reg.color === 'blue' ? "bg-blue-600" : "bg-emerald-600")} style={{ width: `${reg.share}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50">
                Открыть карту спроса <Globe className="ml-2 h-4 w-4" />
              </Button>
           </Card>
        </div>
      </div>
    </div>
  );
}
