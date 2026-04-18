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
  { name: 'Анна К.', role: 'Senior Buyer @ ЦУМ', tags: ['Contemporary', 'Premium'], online: true },
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
        <Card className="relative overflow-hidden rounded-xl border-none bg-indigo-600 p-3 text-white shadow-2xl lg:col-span-2">
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
            <p className="max-w-xl text-sm font-medium text-indigo-100">
              Центр профессионального общения. Создавайте совместные капсулы, делитесь инсайтами и
              находите экспертов рынка.
            </p>
            <div className="flex gap-3">
              <Button className="h-10 rounded-2xl bg-white px-8 text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-2xl transition-transform hover:scale-105">
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

        <Card className="space-y-6 rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl">
          <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-indigo-400">
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
                  <span className="text-indigo-400">View Details</span>
                </div>
              </div>
            ))}
          </div>
          <Button className="h-12 w-full rounded-xl bg-indigo-600 text-[9px] font-black uppercase">
            Все предложения
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        {/* Newsfeed / Professional Feed */}
        <div className="space-y-6 lg:col-span-8">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
            Профессиональная лента
          </h4>
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <Card
                key={i}
                className="overflow-hidden rounded-xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="space-y-6 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-indigo-50 shadow-sm">
                        <AvatarFallback className="bg-slate-900 text-xs font-black text-white">
                          NK
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-black uppercase text-slate-900">
                          Nordic Wool Official
                        </p>
                        <p className="text-[9px] font-bold uppercase text-slate-400">
                          Опубликовано 2ч назад • Insight
                        </p>
                      </div>
                    </div>
                    <Badge className="border-none bg-emerald-50 text-[8px] font-black text-emerald-600">
                      Verified Brand
                    </Badge>
                  </div>

                  <p className="text-sm font-medium leading-relaxed text-slate-600">
                    «Мы завершили аудит нашей новой цепочки поставок в Турции. Прозрачность повышена
                    на 40%, готовы делиться контактами сертифицированных фабрик для партнеров
                    Syntha».
                  </p>

                  <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
                    <div className="flex cursor-pointer items-center gap-2 text-slate-400 transition-colors hover:text-indigo-600">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-[10px] font-black uppercase">Обсудить (12)</span>
                    </div>
                    <div className="flex cursor-pointer items-center gap-2 text-slate-400 transition-colors hover:text-rose-500">
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
            <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-900">
              <Award className="h-4 w-4 text-amber-500" /> Лидеры мнений
            </h4>
            <div className="space-y-4">
              {MOCK_PEOPLE.map((person, i) => (
                <div key={i} className="group flex cursor-pointer items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border border-slate-100 transition-transform group-hover:scale-110">
                      <AvatarFallback className="bg-indigo-50 text-[10px] font-black text-indigo-600">
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
                    <p className="text-[10px] font-black uppercase leading-tight text-slate-900">
                      {person.name}
                    </p>
                    <p className="text-[8px] font-bold uppercase text-slate-400">{person.role}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="h-12 w-full rounded-xl border-slate-200 text-[9px] font-black uppercase text-slate-400 hover:text-indigo-600"
            >
              Вся сеть (4.2k)
            </Button>
          </Card>

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
              Зарегистрироваться
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
