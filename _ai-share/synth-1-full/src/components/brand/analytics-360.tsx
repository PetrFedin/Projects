'use client';

import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  ShoppingBag,
  Heart,
  Target,
  MessageSquare,
  Star,
  ArrowUpRight,
  Filter,
  Search,
  Calendar,
  Zap,
  BarChart3,
  UserCheck,
  ShieldCheck,
  Smartphone,
  Store,
  Globe,
  MousePointer2,
  RefreshCw,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const MOCK_CUSTOMERS = [
  {
    id: 'c1',
    name: 'Александра В.',
    city: 'Москва',
    ltv: '142,000 ₽',
    segment: 'VIP',
    affinity: 'Techwear',
    lastPurchase: '2 дня назад',
    score: 98,
  },
  {
    id: 'c2',
    name: 'Дмитрий К.',
    city: 'СПб',
    ltv: '45,600 ₽',
    segment: 'Loyal',
    affinity: 'Outerwear',
    lastPurchase: '14 дней назад',
    score: 82,
  },
  {
    id: 'c3',
    name: 'Елена М.',
    city: 'Казань',
    ltv: '12,900 ₽',
    segment: 'New',
    affinity: 'Accessories',
    lastPurchase: '1 час назад',
    score: 75,
  },
];

export function Analytics360() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>('c1');
  const selectedCustomer = MOCK_CUSTOMERS.find((c) => c.id === selectedCustomerId);

  return (
    <div className="space-y-10 duration-1000 animate-in fade-in">
      <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
        <CardHeader className="bg-indigo-600 p-3 pb-4 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="mb-1 flex items-center gap-2">
                <Users className="h-6 w-6 text-indigo-200" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">
                  Customer Intelligence 360°
                </span>
              </div>
              <CardTitle className="text-base font-black uppercase tracking-tighter">
                CRM & Поведенческая Аналитика
              </CardTitle>
              <CardDescription className="font-medium italic text-indigo-50">
                Сквозной профиль клиента: от AR-примерок до повторных покупок и лояльности.
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col items-end rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <p className="text-[8px] font-black uppercase text-indigo-200">
                  Active Omni-Profiles
                </p>
                <p className="text-sm font-black text-white">12,482</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 pt-10">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            {/* Customer Segment List */}
            <div className="space-y-6 lg:col-span-4">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Топ клиентов (Omni)
                </h4>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                  <Filter className="h-4 w-4 text-slate-400" />
                </Button>
              </div>
              <div className="space-y-3">
                {MOCK_CUSTOMERS.map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => setSelectedCustomerId(customer.id)}
                    className={cn(
                      'group flex cursor-pointer items-center gap-3 rounded-3xl border p-3 transition-all',
                      selectedCustomerId === customer.id
                        ? 'border-indigo-200 bg-indigo-50 shadow-lg'
                        : 'border-slate-100 bg-white hover:bg-slate-50'
                    )}
                  >
                    <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                      <AvatarFallback className="bg-slate-900 text-xs font-black text-white">
                        {customer.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-black uppercase leading-tight text-slate-900">
                        {customer.name}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        {customer.city} • {customer.ltv}
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        'border-none px-2 py-0.5 text-[8px] font-black uppercase',
                        customer.segment === 'VIP'
                          ? 'bg-amber-500 text-white'
                          : 'bg-indigo-600 text-white'
                      )}
                    >
                      {customer.segment}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button
                asChild
                variant="outline"
                className="h-12 w-full rounded-2xl border-slate-200 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600"
              >
                <Link href="/brand/customers">Просмотреть всех клиентов</Link>
              </Button>
            </div>

            {/* 360 Profile View */}
            <div className="space-y-4 lg:col-span-8">
              <AnimatePresence mode="wait">
                {selectedCustomer && (
                  <motion.div
                    key={selectedCustomer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {/* Profile Header Stats */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      {[
                        {
                          label: 'Customer Score',
                          value: selectedCustomer.score,
                          icon: Target,
                          color: 'text-indigo-600',
                          href: '/brand/customer-intelligence',
                        },
                        {
                          label: 'Returns Rate',
                          value: '4.2%',
                          icon: RefreshCw,
                          color: 'text-emerald-600',
                          href: '/brand/inventory',
                        },
                        {
                          label: 'AR Engagement',
                          value: 'High',
                          icon: Smartphone,
                          color: 'text-rose-600',
                          href: '/brand/products',
                        },
                      ].map((stat, i) => (
                        <Link key={i} href={stat.href} className="group/stat">
                          <div className="relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all group-hover/stat:bg-white group-hover/stat:shadow-xl">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition-all group-hover/stat:bg-slate-900 group-hover/stat:text-white">
                              <stat.icon
                                className={cn('h-6 w-6', stat.color, 'group-hover/stat:text-white')}
                              />
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                {stat.label}
                              </p>
                              <p className="text-base font-black text-slate-900">{stat.value}</p>
                            </div>
                            <ArrowUpRight className="absolute right-4 top-4 h-3 w-3 text-slate-300 opacity-0 transition-all group-hover/stat:opacity-100" />
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Behavior Timeline & Affinity */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="space-y-6 rounded-xl border border-slate-100 bg-white p-4 shadow-xl">
                        <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-900">
                          <MousePointer2 className="h-4 w-4 text-indigo-600" /> Последние действия
                        </h4>
                        <div className="space-y-4">
                          {[
                            {
                              action: 'Примерка в AR (Mobile)',
                              time: '2ч назад',
                              status: 'Success',
                            },
                            {
                              action: 'Просмотр лукбука SS26',
                              time: '1д назад',
                              status: 'Completed',
                            },
                            {
                              action: 'Покупка в магазине (ЦУМ)',
                              time: '2д назад',
                              status: 'Completed',
                            },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between border-b border-slate-50 py-3 last:border-none"
                            >
                              <div>
                                <p className="text-[10px] font-black uppercase text-slate-900">
                                  {item.action}
                                </p>
                                <p className="text-[9px] font-bold uppercase text-slate-400">
                                  {item.time}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="border-slate-200 text-[8px] font-black uppercase text-slate-400"
                              >
                                {item.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="relative space-y-6 overflow-hidden rounded-xl bg-slate-900 p-4 text-white">
                        <div className="absolute right-0 top-0 p-4 opacity-10">
                          <Heart className="h-24 w-24 fill-white" />
                        </div>
                        <div className="relative z-10 space-y-6">
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-400">
                            Интересы (Affinity Score)
                          </h4>
                          <div className="space-y-4">
                            {[
                              { label: 'Techwear / Urban', val: 92 },
                              { label: 'Sustainability', val: 78 },
                              { label: 'Outerwear', val: 45 },
                            ].map((aff, i) => (
                              <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[9px] font-black uppercase">
                                  <span>{aff.label}</span>
                                  <span>{aff.val}%</span>
                                </div>
                                <Progress value={aff.val} className="h-1 bg-white/10" />
                              </div>
                            ))}
                          </div>
                          <p className="text-[10px] italic leading-relaxed text-white/40">
                            «Клиент склонен к покупке новой коллекции Parka v3. Рекомендуем
                            отправить персональный пуш с доступом к предзаказу».
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Loyalty Status */}
                    <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-3xl border border-emerald-100 bg-white shadow-lg">
                          <ShieldCheck className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-900">
                            Статус Лояльности
                          </p>
                          <h4 className="text-sm font-black uppercase tracking-tighter text-emerald-900">
                            Verified Ambassador
                          </h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                          Баланс жетонов
                        </p>
                        <p className="text-sm font-black text-emerald-900">
                          4,200 <span className="text-sm">SYN</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
