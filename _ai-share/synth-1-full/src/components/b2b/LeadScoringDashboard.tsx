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
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';
import { getDataVizBarToneClass, getMetricSoftToneClass } from '@/lib/ui/semantic-data-tones';

export function LeadScoringDashboard() {
  const { wholesaleLeads } = useB2BState();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'high_score' | 'qualified'>('all');

  const filteredLeads = useMemo(() => {
    let list = wholesaleLeads;
    if (activeTab === 'high_score') list = list.filter((l) => l.score >= 80);
    if (activeTab === 'qualified') list = list.filter((l) => l.status === 'qualified');
    if (searchQuery) {
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return list;
  }, [wholesaleLeads, searchQuery, activeTab]);

  return (
    <div className="bg-bg-surface2/80 min-h-screen space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-accent-primary flex h-8 w-8 items-center justify-center rounded-xl">
              <Target className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
              className="border-accent-primary/20 text-accent-primary text-[9px] font-black uppercase tracking-widest"
            >
              AI_Lead_Engine_v2.0
            </Badge>
          </div>
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter md:text-sm">
            Оценка Оптовых
            <br />
            Лидов (Scoring)
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Поиск лидов..."
              className="border-border-subtle focus-visible:ring-accent-primary h-12 rounded-2xl bg-white pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="border-border-subtle h-12 w-12 rounded-2xl bg-white p-0"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button className="bg-text-primary h-12 gap-2 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest text-white">
            Импорт лидов
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {[
          { label: 'Всего проспектов', value: '1,240', change: '+12%', icon: Users, color: 'blue' },
          { label: 'Высокий потенциал', value: '84', change: '+8%', icon: Zap, color: 'amber' },
          {
            label: 'Конверсия',
            value: '14.2%',
            change: '+2.4%',
            icon: TrendingUp,
            color: 'emerald',
          },
          {
            label: 'Объем воронки',
            value: '42.5M ₽',
            change: '+18%',
            icon: BarChart3,
            color: 'indigo',
          },
        ].map((stat, i) => (
          <Card key={i} className="overflow-hidden rounded-xl border-none shadow-md shadow-xl">
            <CardContent className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    getMetricSoftToneClass(stat.color)
                  )}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <Badge className="border-none bg-emerald-50 text-[8px] font-black text-emerald-600">
                  {stat.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                  {stat.label}
                </p>
                <p className="text-text-primary text-sm font-black">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Lead List */}
        <div className="space-y-6 lg:col-span-2">
          <div className="border-border-subtle flex w-fit items-center gap-2 rounded-2xl border bg-white p-1">
            {(['all', 'high_score', 'qualified'] as const).map((tab) => (
              <Button
                key={tab}
                variant="ghost"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'h-10 rounded-xl px-6 text-[9px] font-black uppercase tracking-widest transition-all',
                  activeTab === tab ? 'bg-text-primary text-white' : 'text-text-muted'
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
                className="border-border-subtle shadow-md/40 hover:border-accent-primary/30 group cursor-pointer rounded-xl border bg-white p-4 shadow-xl transition-all"
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="bg-bg-surface2 border-border-subtle group-hover:bg-accent-primary/10 flex h-12 w-12 items-center justify-center rounded-2xl border transition-colors">
                        <Briefcase className="text-text-muted group-hover:text-accent-primary h-8 w-8" />
                      </div>
                      <div className="text-accent-primary absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-white text-[10px] font-black shadow-lg">
                        {lead.score}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-text-primary text-base font-black uppercase leading-none tracking-tight">
                        {lead.name}
                      </h4>
                      <div className="flex items-center gap-3">
                        <div className="text-text-muted flex items-center gap-1 text-[10px] font-bold">
                          <MapPin className="h-3 w-3" /> {lead.location}
                        </div>
                        <div className="bg-border-subtle h-1 w-1 rounded-full" />
                        <div className="text-text-muted flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                          {lead.source}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="space-y-1 text-right">
                      <p className="text-text-muted text-[9px] font-black uppercase leading-none tracking-widest">
                        Ожид. объем
                      </p>
                      <p className="text-text-primary text-sm font-black">
                        {(lead.estimatedVolume / 1000).toFixed(0)}K ₽ / год
                      </p>
                    </div>
                    <div className="bg-bg-surface2 h-10 w-px" />
                    <Badge
                      className={cn(
                        'border-none px-3 py-1 text-[8px] font-black uppercase tracking-widest',
                        lead.status === 'qualified'
                          ? 'bg-emerald-50 text-emerald-600'
                          : lead.status === 'negotiation'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-bg-surface2 text-text-secondary'
                      )}
                    >
                      {lead.status === 'qualified'
                        ? 'Квалифицирован'
                        : lead.status === 'negotiation'
                          ? 'Переговоры'
                          : lead.status === 'new'
                            ? 'Проспект'
                            : lead.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      className="hover:bg-bg-surface2 h-10 w-10 rounded-xl p-0"
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="border-border-subtle mt-6 flex items-center justify-between border-t pt-6">
                  <div className="flex gap-2">
                    {lead.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-border-subtle text-text-muted text-[7px] font-bold uppercase"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-text-muted text-[9px] font-bold uppercase">
                      Последняя активность: {new Date(lead.lastActivity).toLocaleDateString()}
                    </span>
                    <Button className="bg-accent-primary h-8 gap-2 rounded-lg px-4 text-[9px] font-black uppercase tracking-widest text-white">
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
          <Card className="shadow-accent-primary/10 bg-accent-primary overflow-hidden rounded-xl border-none text-white shadow-2xl">
            <CardContent className="space-y-6 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-black uppercase tracking-tight">AI Ассистент Продаж</h3>
                <p className="text-accent-primary/30 text-[10px] font-medium uppercase leading-relaxed tracking-widest opacity-80">
                  Инсайты и прогнозы рынка
                </p>
              </div>
              <div className="space-y-4">
                {[
                  'Рынок Токио показывает 40% рост спроса на техвир.',
                  "Высокий балл для 'Berlin Tech-Wear' из-за совпадения эстетического ДНК.",
                  "Ритейлер 'ret-1' имеет свободный лимит (OTB) на 200 единиц Cyber Parka.",
                ].map((insight, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/10 p-4"
                  >
                    <div className="bg-accent-primary/40 mt-0.5 flex h-5 w-5 items-center justify-center rounded-lg">
                      <TrendingUp className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-[10px] font-bold leading-normal">{insight}</p>
                  </div>
                ))}
              </div>
              <Button className="text-accent-primary hover:bg-bg-surface2 h-12 w-full rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest">
                Сформировать полный отчет
              </Button>
            </CardContent>
          </Card>

          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-2xl shadow-md">
            <div className="space-y-1">
              <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                Региональное распределение
              </p>
              <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
                Глобальный охват
              </h4>
            </div>
            <div className="space-y-4">
              {[
                { region: 'Европа', share: 45, color: 'indigo' },
                { region: 'Азия', share: 30, color: 'blue' },
                { region: 'Америка', share: 25, color: 'emerald' },
              ].map((reg, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase">
                    <span className="text-text-secondary">{reg.region}</span>
                    <span className="text-text-primary">{reg.share}%</span>
                  </div>
                  <div className="bg-bg-surface2 h-1.5 overflow-hidden rounded-full">
                    <div
                      className={cn('h-full rounded-full', getDataVizBarToneClass(reg.color))}
                      style={{ width: `${reg.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="text-accent-primary hover:bg-accent-primary/10 w-full text-[10px] font-black uppercase tracking-widest"
            >
              Открыть карту спроса <Globe className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
