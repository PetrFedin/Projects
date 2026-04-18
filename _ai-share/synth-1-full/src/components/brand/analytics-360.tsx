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
import { ROUTES } from '@/lib/routes';

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
        <CardHeader className="bg-accent-primary p-3 pb-4 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="mb-1 flex items-center gap-2">
                <Users className="text-accent-primary/40 h-6 w-6" />
                <span className="text-accent-primary/40 text-[10px] font-black uppercase tracking-widest">
                  Customer Intelligence 360°
                </span>
              </div>
              <CardTitle className="text-base font-black uppercase tracking-tighter">
                CRM & Поведенческая Аналитика
              </CardTitle>
              <CardDescription className="text-accent-primary/30 font-medium italic">
                Сквозной профиль клиента: от AR-примерок до повторных покупок и лояльности.
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col items-end rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <p className="text-accent-primary/40 text-[8px] font-black uppercase">
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
                <h4 className="text-text-muted text-[11px] font-black uppercase tracking-widest">
                  Топ клиентов (Omni)
                </h4>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                  <Filter className="text-text-muted h-4 w-4" />
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
                        ? 'bg-accent-primary/10 border-accent-primary/30 shadow-lg'
                        : 'border-border-subtle hover:bg-bg-surface2 bg-white'
                    )}
                  >
                    <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                      <AvatarFallback className="bg-text-primary text-xs font-black text-white">
                        {customer.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-text-primary text-sm font-black uppercase leading-tight">
                        {customer.name}
                      </p>
                      <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                        {customer.city} • {customer.ltv}
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        'border-none px-2 py-0.5 text-[8px] font-black uppercase',
                        customer.segment === 'VIP'
                          ? 'bg-amber-500 text-white'
                          : 'bg-accent-primary text-white'
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
                className="border-border-default text-text-muted hover:text-accent-primary h-12 w-full rounded-2xl text-[10px] font-black uppercase"
              >
                <Link href={ROUTES.brand.customers}>Просмотреть всех клиентов</Link>
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
                          color: 'text-accent-primary',
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
                          <div className="bg-bg-surface2 border-border-subtle relative flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border p-4 transition-all group-hover/stat:bg-white group-hover/stat:shadow-xl">
                            <div className="group-hover/stat:bg-text-primary flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition-all group-hover/stat:text-white">
                              <stat.icon
                                className={cn('h-6 w-6', stat.color, 'group-hover/stat:text-white')}
                              />
                            </div>
                            <div>
                              <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                                {stat.label}
                              </p>
                              <p className="text-text-primary text-base font-black">{stat.value}</p>
                            </div>
                            <ArrowUpRight className="text-text-muted absolute right-4 top-4 h-3 w-3 opacity-0 transition-all group-hover/stat:opacity-100" />
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Behavior Timeline & Affinity */}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="border-border-subtle space-y-6 rounded-xl border bg-white p-4 shadow-xl">
                        <h4 className="text-text-primary flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                          <MousePointer2 className="text-accent-primary h-4 w-4" /> Последние
                          действия
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
                              className="border-border-subtle flex items-center justify-between border-b py-3 last:border-none"
                            >
                              <div>
                                <p className="text-text-primary text-[10px] font-black uppercase">
                                  {item.action}
                                </p>
                                <p className="text-text-muted text-[9px] font-bold uppercase">
                                  {item.time}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="border-border-default text-text-muted text-[8px] font-black uppercase"
                              >
                                {item.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-text-primary relative space-y-6 overflow-hidden rounded-xl p-4 text-white">
                        <div className="absolute right-0 top-0 p-4 opacity-10">
                          <Heart className="h-24 w-24 fill-white" />
                        </div>
                        <div className="relative z-10 space-y-6">
                          <h4 className="text-accent-primary text-[11px] font-black uppercase tracking-widest">
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
