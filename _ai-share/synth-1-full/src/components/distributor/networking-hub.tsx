'use client';

import React from 'react';
import {
  Users,
  MessageSquare,
  Handshake,
  Globe,
  Zap,
  Briefcase,
  Star,
  Search,
  Filter,
  ArrowUpRight,
  Target,
  Share2,
  Award,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const MOCK_COLLABS = [
  {
    id: 1,
    title: 'Nordic x Cyber Capsule',
    partners: ['Nordic Wool', 'Cyber Silk'],
    status: 'Drafting',
    impact: 'High Trend',
  },
  {
    id: 2,
    title: 'Zero Waste Initiative',
    partners: ['Syntha Factory', 'All Brands'],
    status: 'Active',
    impact: 'Eco-Standard',
  },
];

const MOCK_PEOPLE = [
<<<<<<< HEAD
  { name: 'Анна К.', role: 'Senior Buyer @ ЦУМ', tags: ['Contemporary', 'Premium'], online: true },
=======
  {
    name: 'Анна К.',
    role: 'Senior Buyer · демо-ритейл',
    tags: ['Contemporary', 'Premium'],
    online: true,
  },
>>>>>>> recover/cabinet-wip-from-stash
  {
    name: 'Марк Р.',
    role: 'Designer @ Nordic Wool',
    tags: ['Knitwear', 'Sustainable'],
    online: false,
  },
  { name: 'Иван С.', role: 'COO @ Tech Factory', tags: ['Supply Chain', 'Scale'], online: true },
];

export function B2BNetworkingHub() {
  return (
    <div className="space-y-6 duration-300 animate-in fade-in">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
<<<<<<< HEAD
        <Card className="relative overflow-hidden rounded-xl border-none bg-indigo-600 p-3 text-white shadow-2xl lg:col-span-2">
=======
        <Card className="bg-accent-primary relative overflow-hidden rounded-xl border-none p-3 text-white shadow-2xl lg:col-span-2">
>>>>>>> recover/cabinet-wip-from-stash
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <Globe className="h-48 w-48" />
          </div>
          <div className="relative z-10 space-y-6">
            <Badge className="border-none bg-white/20 text-[9px] font-black uppercase tracking-widest text-white">
              Global Fashion Network
            </Badge>
            <h3 className="text-sm font-black uppercase tracking-tighter">
              B2B Коллаборации & Связи
            </h3>
<<<<<<< HEAD
            <p className="max-w-xl text-sm font-medium text-indigo-100">
=======
            <p className="text-accent-primary/30 max-w-xl text-sm font-medium">
>>>>>>> recover/cabinet-wip-from-stash
              Центр профессионального общения. Создавайте совместные капсулы, делитесь инсайтами и
              находите экспертов рынка.
            </p>
            <div className="flex gap-3">
<<<<<<< HEAD
              <Button className="h-10 rounded-2xl bg-white px-8 text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-2xl transition-transform hover:scale-105">
=======
              <Button className="text-accent-primary h-10 rounded-2xl bg-white px-8 text-[10px] font-black uppercase tracking-widest shadow-2xl transition-transform hover:scale-105">
>>>>>>> recover/cabinet-wip-from-stash
                Предложить коллаборацию
              </Button>
              <Button
                variant="outline"
                className="h-10 rounded-2xl border-white/20 px-8 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5"
              >
                Найти эксперта
              </Button>
            </div>
          </div>
        </Card>

<<<<<<< HEAD
        <Card className="space-y-6 rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl">
          <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-indigo-400">
=======
        <Card className="bg-text-primary space-y-6 rounded-xl border-none p-4 text-white shadow-xl">
          <h4 className="text-accent-primary flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            <Target className="h-4 w-4" /> Активные Тендеры
          </h4>
          <div className="space-y-4">
            {[
              { title: 'Поиск дизайнера (FW26)', budget: 'High', bids: 12 },
              { title: 'Сорсинг: Recycled Wool', budget: 'Medium', bids: 5 },
            ].map((tender, i) => (
              <div
                key={i}
                className="group cursor-pointer space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
              >
                <p className="text-[10px] font-black uppercase">{tender.title}</p>
                <div className="flex items-center justify-between text-[8px] font-bold uppercase text-white/40">
                  <span>{tender.bids} заявок</span>
<<<<<<< HEAD
                  <span className="text-indigo-400">View Details</span>
=======
                  <span className="text-accent-primary">View Details</span>
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              </div>
            ))}
          </div>
<<<<<<< HEAD
          <Button className="h-12 w-full rounded-xl bg-indigo-600 text-[9px] font-black uppercase">
=======
          <Button className="bg-accent-primary h-12 w-full rounded-xl text-[9px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
            Все предложения
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Newsfeed / Professional Feed */}
        <div className="space-y-6 lg:col-span-8">
<<<<<<< HEAD
          <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
=======
          <h4 className="text-text-muted text-[11px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
            Профессиональная лента
          </h4>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <Card
                key={i}
<<<<<<< HEAD
                className="overflow-hidden rounded-xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md"
=======
                className="border-border-subtle overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <CardContent className="space-y-6 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
<<<<<<< HEAD
                      <Avatar className="h-12 w-12 border-2 border-indigo-50 shadow-sm">
                        <AvatarFallback className="bg-slate-900 text-xs font-black text-white">
=======
                      <Avatar className="border-accent-primary/15 h-12 w-12 border-2 shadow-sm">
                        <AvatarFallback className="bg-text-primary text-xs font-black text-white">
>>>>>>> recover/cabinet-wip-from-stash
                          NK
                        </AvatarFallback>
                      </Avatar>
                      <div>
<<<<<<< HEAD
                        <p className="text-sm font-black uppercase text-slate-900">
                          Nordic Wool Official
                        </p>
                        <p className="text-[9px] font-bold uppercase text-slate-400">
=======
                        <p className="text-text-primary text-sm font-black uppercase">
                          Nordic Wool Official
                        </p>
                        <p className="text-text-muted text-[9px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                          Опубликовано 2ч назад • Insight
                        </p>
                      </div>
                    </div>
                    <Badge className="border-none bg-emerald-50 text-[8px] font-black text-emerald-600">
                      Verified Brand
                    </Badge>
                  </div>

<<<<<<< HEAD
                  <p className="text-sm font-medium leading-relaxed text-slate-600">
=======
                  <p className="text-text-secondary text-sm font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                    «Мы завершили аудит нашей новой цепочки поставок в Турции. Прозрачность повышена
                    на 40%, готовы делиться контактами сертифицированных фабрик для партнеров
                    Syntha».
                  </p>

<<<<<<< HEAD
                  <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                    <div className="flex cursor-pointer items-center gap-2 text-slate-400 transition-colors hover:text-indigo-600">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase">Обсудить (12)</span>
                    </div>
                    <div className="flex cursor-pointer items-center gap-2 text-slate-400 transition-colors hover:text-rose-500">
=======
                  <div className="border-border-subtle flex items-center gap-3 border-t pt-4">
                    <div className="text-text-muted hover:text-accent-primary flex cursor-pointer items-center gap-2 transition-colors">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase">Обсудить (12)</span>
                    </div>
                    <div className="text-text-muted flex cursor-pointer items-center gap-2 transition-colors hover:text-rose-500">
>>>>>>> recover/cabinet-wip-from-stash
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
        <div className="space-y-4 lg:col-span-4">
          <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-xl">
<<<<<<< HEAD
            <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-900">
=======
            <h4 className="text-text-primary flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              <Award className="h-4 w-4 text-amber-500" /> Лидеры мнений
            </h4>
            <div className="space-y-4">
              {MOCK_PEOPLE.map((person, i) => (
                <div key={i} className="group flex cursor-pointer items-center gap-3">
                  <div className="relative">
<<<<<<< HEAD
                    <Avatar className="h-10 w-10 border border-slate-100 transition-transform group-hover:scale-110">
                      <AvatarFallback className="bg-indigo-50 text-[10px] font-black text-indigo-600">
=======
                    <Avatar className="border-border-subtle h-10 w-10 border transition-transform group-hover:scale-110">
                      <AvatarFallback className="bg-accent-primary/10 text-accent-primary text-[10px] font-black">
>>>>>>> recover/cabinet-wip-from-stash
                        {person.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    {person.online && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1">
<<<<<<< HEAD
                    <p className="text-[10px] font-black uppercase leading-tight text-slate-900">
                      {person.name}
                    </p>
                    <p className="text-[8px] font-bold uppercase text-slate-400">{person.role}</p>
=======
                    <p className="text-text-primary text-[10px] font-black uppercase leading-tight">
                      {person.name}
                    </p>
                    <p className="text-text-muted text-[8px] font-bold uppercase">{person.role}</p>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                  >
<<<<<<< HEAD
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
=======
                    <ArrowUpRight className="text-text-muted h-3.5 w-3.5" />
>>>>>>> recover/cabinet-wip-from-stash
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
<<<<<<< HEAD
              className="h-12 w-full rounded-xl border-slate-200 text-[9px] font-black uppercase text-slate-400 hover:text-indigo-600"
=======
              className="border-border-default text-text-muted hover:text-accent-primary h-12 w-full rounded-xl text-[9px] font-black uppercase"
>>>>>>> recover/cabinet-wip-from-stash
            >
              Вся сеть (4.2k)
            </Button>
          </Card>

<<<<<<< HEAD
          <div className="space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <Zap className="h-4 w-4 fill-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">Syntha Event</span>
            </div>
            <p className="text-[11px] font-black uppercase leading-tight text-slate-900">
              B2B Meetup: Digital Fashion Future
            </p>
            <p className="text-[9px] font-medium italic text-slate-500">
              14 Февраля • Online • Moscow HQ
            </p>
            <Button className="h-10 w-full rounded-xl bg-slate-900 text-[8px] font-black uppercase tracking-widest text-white">
=======
          <div className="bg-bg-surface2 border-border-subtle space-y-4 rounded-xl border p-4">
            <div className="text-accent-primary flex items-center gap-2">
              <Zap className="fill-accent-primary h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Syntha Event</span>
            </div>
            <p className="text-text-primary text-[11px] font-black uppercase leading-tight">
              B2B Meetup: Digital Fashion Future
            </p>
            <p className="text-text-secondary text-[9px] font-medium italic">
              14 Февраля • Online • Moscow HQ
            </p>
            <Button className="bg-text-primary h-10 w-full rounded-xl text-[8px] font-black uppercase tracking-widest text-white">
>>>>>>> recover/cabinet-wip-from-stash
              Зарегистрироваться
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
