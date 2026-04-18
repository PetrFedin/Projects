'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Briefcase,
  FileText,
  Star,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Plus,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Camera,
  Pencil,
  Globe,
  GraduationCap,
  Award,
  Heart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data ---

const TALENTS = [
  {
    id: 't1',
    name: 'Александра В.',
    role: 'Fashion Designer',
    experience: '8 лет',
    location: 'Милан / Москва',
    rating: 4.9,
    projects: 42,
    specialization: ['Luxury', 'Sustainable', 'Couture'],
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    bio: 'Специализируюсь на создании коллекций из переработанных материалов. Работала с крупными домами моды в Италии.',
  },
  {
    id: 't2',
    name: 'Марк С.',
    role: 'Brand Manager',
    experience: '5 лет',
    location: 'Париж',
    rating: 4.8,
    projects: 15,
    specialization: ['Marketing', 'B2B Strategy', 'Retail'],
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    bio: 'Эксперт по выводу локальных брендов на международный рынок B2B.',
  },
  {
    id: 't3',
    name: 'Елена К.',
    role: 'Professional Model',
    experience: '10 лет',
    location: 'Дубай / Лондон',
    rating: 5.0,
    projects: 120,
    specialization: ['Runway', 'Commercial', 'Lookbook'],
    status: 'busy',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    bio: 'Участие в неделях моды, большой опыт работы с топовыми фотографами.',
  },
  {
    id: 't4',
    name: 'Иван П.',
    role: 'Fashion Photographer',
    experience: '6 лет',
    location: 'Москва',
    rating: 4.7,
    projects: 85,
    specialization: ['Editorial', 'Product', 'Studio'],
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
    bio: 'Создаю визуальный контент, который продает ценности бренда, а не просто одежду.',
  },
];

const JOBS = [
  {
    id: 'j1',
    brand: 'Radical Chic',
    title: 'Ведущий стилист съемки',
    type: 'Временный контракт',
    budget: '50,000₽ / день',
    location: 'Студия (Москва)',
    posted: '2 часа назад',
    description: 'Требуется опытный стилист для создания лукбука новой весенней коллекции.',
  },
  {
    id: 'j2',
    brand: 'Nordic Wool',
    title: 'Менеджер по производству',
    type: 'Постоянная работа',
    budget: '150,000₽+',
    location: 'Удаленно / Офис',
    posted: '1 день назад',
    description: 'Ищем специалиста по контролю качества и работе с фабриками в Турции.',
  },
];

export default function CareerPage() {
  const [activeTab, setActiveTab] = useState('talents');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex-1 space-y-4 bg-[#f8fafc] p-4 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10">
              <Briefcase className="h-5 w-5 text-indigo-600" />
            </div>
            <Badge
              variant="outline"
              className="border-indigo-500/20 bg-indigo-500/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600"
            >
              FASHION CAREER HUB
            </Badge>
          </div>
          <h2 className="text-sm font-black uppercase tracking-tighter text-slate-900">
            Карьерный Центр
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Глобальная база специалистов и безопасный мечинг в индустрии моды.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            asChild
            variant="outline"
            className="h-12 rounded-2xl border-slate-200 px-6 text-xs font-black uppercase tracking-widest transition-all hover:border-slate-900 hover:bg-white"
          >
            <Link href="/u?tab=career">
              <FileText className="mr-2 h-4 w-4" />
              Мое Резюме
            </Link>
          </Button>
          <Button className="button-glimmer button-professional h-12 rounded-2xl border-none !bg-black px-8 text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200/50 hover:!bg-black">
            <Plus className="mr-2 h-4 w-4" />
            Разместить заказ/вакансию
          </Button>
        </div>
      </div>

      <Tabs defaultValue="talents" className="space-y-4" onValueChange={setActiveTab}>
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <TabsList className="h-auto w-fit rounded-2xl border border-slate-200 bg-slate-100/50 p-1">
            <TabsTrigger
              value="talents"
              className="rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              База талантов
            </TabsTrigger>
            <TabsTrigger
              value="jobs"
              className="rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              Заказы и Вакансии
            </TabsTrigger>
            <TabsTrigger
              value="contracts"
              className="rounded-xl px-8 py-3 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm"
            >
              Смарт-Контракты
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <div className="group relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-indigo-600" />
              <Input
                placeholder="Поиск по специализации, навыкам..."
                className="h-12 w-[300px] rounded-2xl border-slate-200 bg-white pl-12 pr-6 shadow-sm transition-all focus:border-indigo-500 focus:ring-indigo-500 lg:w-[400px]"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-2xl border-slate-200 hover:border-slate-900"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="talents" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {TALENTS.map((talent) => (
              <motion.div
                key={talent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="group/talent flex h-full flex-col overflow-hidden rounded-3xl border-slate-100 bg-white shadow-sm transition-all duration-500 hover:border-slate-900 hover:shadow-2xl">
                  <div className="flex-1 space-y-6 p-4">
                    <div className="flex items-start justify-between">
                      <div className="relative">
                        <Avatar className="h-20 w-20 rounded-2xl border-2 border-slate-100 transition-colors duration-500 group-hover/talent:border-indigo-500">
                          <AvatarImage src={talent.imageUrl} />
                          <AvatarFallback className="rounded-2xl">
                            {talent.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            'absolute -bottom-1 -right-1 h-4 w-4 animate-pulse rounded-full border-2 border-white',
                            talent.status === 'open' ? 'bg-emerald-500' : 'bg-amber-500'
                          )}
                        />
                      </div>
                      <div className="text-right">
                        <div className="mb-1 flex items-center justify-end gap-1 text-amber-500">
                          <Star className="h-3 w-3 fill-amber-500" />
                          <span className="text-[11px] font-black">{talent.rating}</span>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          {talent.projects} КЕЙСОВ
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-black leading-none tracking-tighter text-slate-900 transition-colors group-hover/talent:text-indigo-600">
                        {talent.name}
                      </h4>
                      <p className="text-[10px] font-black uppercase leading-none tracking-widest text-slate-400">
                        {talent.role}
                      </p>
                    </div>

                    <p className="line-clamp-2 text-xs font-medium leading-relaxed text-slate-500">
                      {talent.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {talent.specialization.map((s) => (
                        <Badge
                          key={s}
                          variant="outline"
                          className="border-slate-100 bg-slate-50 px-2 py-0 text-[8px] font-black uppercase text-slate-500"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />
                        {talent.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        {talent.experience}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto p-2 pt-0">
                    <Button className="h-12 w-full rounded-2xl border-none bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-900 transition-all duration-300 hover:bg-slate-900 hover:text-white">
                      Смотреть Портфолио
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {JOBS.map((job) => (
              <Card
                key={job.id}
                className="overflow-hidden rounded-3xl border-slate-100 bg-white shadow-sm transition-all duration-500 hover:border-slate-900"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col justify-between gap-3 md:flex-row">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 font-black text-slate-400">
                          {job.brand[0]}
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase leading-none tracking-widest text-indigo-600">
                            {job.brand}
                          </p>
                          <h4 className="mt-1 text-sm font-black tracking-tighter text-slate-900">
                            {job.title}
                          </h4>
                        </div>
                      </div>
                      <p className="max-w-xl text-sm font-medium text-slate-500">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap gap-3 pt-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <DollarSign className="h-3 w-3" />
                          {job.budget}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <Clock className="h-3 w-3" />
                          {job.posted}
                        </div>
                      </div>
                    </div>
                    <div className="flex min-w-[200px] flex-col justify-center gap-3">
                      <Button className="button-glimmer button-professional h-12 rounded-2xl !bg-black text-[10px] font-black uppercase tracking-widest hover:!bg-black">
                        Откликнуться
                      </Button>
                      <Button
                        variant="outline"
                        className="h-12 rounded-2xl border-slate-200 text-[10px] font-black uppercase tracking-widest hover:border-slate-900"
                      >
                        Чат с брендом
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="outline-none">
          <div className="mx-auto max-w-4xl space-y-4 py-12 text-center">
            <div className="relative inline-block">
              <div className="absolute -inset-4 animate-pulse rounded-full bg-indigo-500/10 blur-2xl" />
              <ShieldCheck className="relative mx-auto h-24 w-24 text-indigo-600" />
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-black uppercase tracking-tighter text-slate-900">
                Система Смарт-Контрактов
              </h3>
              <p className="mx-auto max-w-2xl text-sm font-medium text-slate-500">
                Платформа SYNTHA гарантирует безопасность сделок. Мы автоматически фиксируем условия
                работы, депонируем оплату и контролируем соблюдение авторских прав.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 text-left md:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Защита оплаты',
                  desc: 'Средства переводятся исполнителю только после принятия работы заказчиком.',
                },
                {
                  icon: FileText,
                  title: 'Цифровой договор',
                  desc: 'Юридически значимые условия фиксируются в коде контракта.',
                },
                {
                  icon: Award,
                  title: 'Портфолио в блокчейн',
                  desc: 'Все завершенные проекты автоматически верифицируются в вашем профиле.',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="space-y-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                  <h5 className="text-sm font-black uppercase tracking-widest text-slate-900">
                    {feature.title}
                  </h5>
                  <p className="text-xs font-medium leading-relaxed text-slate-500">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Profile Builder Section (Subtle Footer CTA) */}
      <div className="group relative overflow-hidden rounded-xl bg-indigo-600 p-4 md:p-4">
        <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/20 blur-3xl transition-all duration-700 group-hover:bg-white/30" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-3 md:flex-row">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-amber-400" />
              <h3 className="text-sm font-black uppercase tracking-tighter text-white md:text-sm">
                Ваш профессиональный профиль готов на 65%
              </h3>
            </div>
            <p className="max-w-xl font-medium text-indigo-100">
              Добавьте свои лучшие работы и опыт, чтобы попасть в топ выдачи для крупнейших
              дистрибуторов и брендов.
            </p>
          </div>
          <Button className="h-10 rounded-2xl bg-white px-10 text-xs font-black uppercase tracking-widest text-indigo-600 shadow-2xl transition-all hover:bg-slate-50">
            Продолжить настройку
          </Button>
        </div>
      </div>
    </div>
  );
}
