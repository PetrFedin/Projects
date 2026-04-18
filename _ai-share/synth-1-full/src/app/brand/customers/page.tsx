'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  ArrowUpRight,
  Mail,
  ShoppingBag,
  TrendingUp,
  Star,
  ChevronRight,
  Download,
  Zap,
  Brain,
  Target,
  Layers,
  Calendar,
  Clock,
  Sparkles,
  Building2,
  CreditCard,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import Image from 'next/image';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

// --- Advanced CRM Mock Data ---
const extendedCustomers = [
  {
    id: 'usr_001',
    name: 'Анна Новикова',
    email: 'anna.n@example.com',
    phone: '+7 900 123-45-67',
    avatar: 'https://picsum.photos/seed/anna/100/100',
    brandStatus: 'Золотой клиент',
    brandLevel: 2,
    brandLtv: 154800,
    brandLastPurchase: '2026-01-12',
    evolutionStatus: 'Shifting to Premium',
    lastSync: '2 часа назад',
    loyaltyType: 'Мультибрендовый энтузиаст',
    audienceFocus: ['Женская одежда'],
    purchaseDays: ['Сб', 'Вс'],
    purchasePattern: 'Покупает образами (Total Look)',
    styleDNA: 'Минимализм / Наследие',
    materialPref: ['Кашемир', 'Мериносовая шерсть'],
    returnRate: 5,
    frequency: 'Часто',
    aovTrend: 'Растущий',
    seasonality: ['Зима', 'Осень'],
    categoryConcentration: 'Широкая',
    mixesBrands: ['Nordic Wool', 'Syntha Lab', 'Studio 29'],
    totalEcosystemLtv: 450000,
    activeInBrands: 5,
    engagementScore: 92,
    potentialFor: ['Нижнее белье', 'Декор для дома'],
    aiRecommendation:
      "Предложить капсулу 'Nordic Home'. Высокая синергия с текущими покупками изделий из кашемира.",
  },
  {
    id: 'usr_002',
    name: 'Михаил Петров',
    email: 'm.petrov@tech.ru',
    phone: '+7 911 222-33-44',
    avatar: 'https://picsum.photos/seed/mikhail/100/100',
    brandStatus: 'VIP клиент',
    brandLevel: 3,
    brandLtv: 342000,
    brandLastPurchase: '2026-01-13',
    evolutionStatus: 'Loyalty Consolidating',
    lastSync: '15 минут назад',
    loyaltyType: 'Лоялист бренда',
    audienceFocus: ['Мужская одежда', 'Унисекс'],
    purchaseDays: ['Пн', 'Вт'],
    purchasePattern: 'Коллекционер дропов',
    styleDNA: 'Технологичный / Урбан',
    materialPref: ['Мембрана', 'Нейлон'],
    returnRate: 15,
    frequency: 'VIP регулярный',
    aovTrend: 'Стабильный',
    seasonality: ['Всесезонно'],
    categoryConcentration: 'Фокусная (Верхняя одежда)',
    mixesBrands: ['Syntha Lab'],
    totalEcosystemLtv: 380000,
    activeInBrands: 2,
    engagementScore: 85,
    potentialFor: ['Обувь', 'Гаджеты'],
    aiRecommendation:
      'Ранний доступ к дропу Cyber-Sneaker. Вероятность покупки 88% на основе коллекции верхней одежды.',
  },
];

const b2bPartners = [
  {
    id: 'org_001',
    name: 'PODIUM Market',
    type: 'Department Store',
    location: 'Москва, РФ',
    logo: 'https://picsum.photos/seed/podium/100/100',
    tier: 'Strategic Partner',
    ltv: 12450000,
    ordersCount: 42,
    lastOrder: '2026-01-20',
    creditLimit: 5000000,
    creditUsed: 1200000,
    performance: 94,
    returns: 3.2,
    contacts: ['Елена В. (Байер)', 'Алексей М. (Фин.дир)'],
    status: 'Active',
  },
  {
    id: 'org_002',
    name: 'Selfridges',
    type: 'Luxury Retailer',
    location: 'London, UK',
    logo: 'https://picsum.photos/seed/selfridges/100/100',
    tier: 'Global VIP',
    ltv: 45800000,
    ordersCount: 18,
    lastOrder: '2026-01-15',
    creditLimit: 15000000,
    creditUsed: 0,
    performance: 98,
    returns: 1.5,
    contacts: ['Mark Reed (Lead Buyer)'],
    status: 'Active',
  },
  {
    id: 'org_003',
    name: 'Concept Store #1',
    type: 'Boutique',
    location: 'Berlin, DE',
    logo: 'https://picsum.photos/seed/concept/100/100',
    tier: 'Growth Partner',
    ltv: 2100000,
    ordersCount: 5,
    lastOrder: '2025-12-10',
    creditLimit: 500000,
    creditUsed: 450000,
    performance: 72,
    returns: 8.4,
    contacts: ['Hans Klein'],
    status: 'Risk',
  },
];

const crmSegments = [
  {
    name: 'Покупают луками',
    count: 124,
    ltv: '2.4M ₽',
    growth: '+12%',
    icon: <Layers className="h-4 w-4" />,
  },
  {
    name: 'Фанаты эко-материалов',
    count: 85,
    ltv: '1.1M ₽',
    growth: '+5%',
    icon: <Target className="h-4 w-4" />,
  },
  {
    name: 'Риск возврата',
    count: 42,
    ltv: '0.4M ₽',
    growth: '-8%',
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    name: 'Шопинг по выходным',
    count: 210,
    ltv: '3.8M ₽',
    growth: '+18%',
    icon: <Calendar className="h-4 w-4" />,
  },
];

export default function BrandCustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredCustomers = useMemo(
    () =>
      extendedCustomers.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  const filteredPartners = useMemo(
    () => b2bPartners.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm]
  );

  if (!isClient) return null;

  return (
<<<<<<< HEAD
    <div className="space-y-6 pb-20 duration-700 animate-in fade-in">
      {/* Control Panel: Executive Style */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="h-7 border-none bg-indigo-600 px-3 text-[8px] font-black uppercase text-white shadow-lg">
            <Users className="mr-2 h-3 w-3 fill-white" /> Клиентский хаб (CRM)
          </Badge>
          <div className="mx-1 h-4 w-px bg-slate-100" />
          <p className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-slate-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Live
            Ecosystem Sync: OK
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="h-7 text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600"
          >
            Обновить сегменты
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 rounded-xl border-slate-100 bg-white px-3 text-[7px] font-black uppercase tracking-widest text-slate-400 shadow-sm"
          >
            Экспорт базы
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-8 h-10 w-fit rounded-2xl border border-slate-200/60 bg-white/50 p-1 shadow-sm">
          <TabsTrigger
            value="list"
            className="h-12 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl"
          >
            <Users className="mr-2 h-3.5 w-3.5" /> B2C Клиенты
          </TabsTrigger>
          <TabsTrigger
            value="wholesale"
            className="h-12 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl"
          >
            <Building2 className="mr-2 h-3.5 w-3.5" /> B2B Партнеры
          </TabsTrigger>
          <TabsTrigger
            value="segments"
            className="h-12 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl"
          >
            <Target className="mr-2 h-3.5 w-3.5" /> Сегменты
          </TabsTrigger>
          <TabsTrigger
            value="growth"
            className="h-12 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest transition-all data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl"
          >
            <TrendingUp className="mr-2 h-3.5 w-3.5" /> Потенциал
=======
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-16 duration-700 animate-in fade-in">
      <RegistryPageHeader
        title="Клиентский хаб (CRM)"
        leadPlain="B2C и B2B базы, сегменты и потенциал. Live Ecosystem Sync: OK."
        actions={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge className="bg-accent-primary h-7 border-none px-3 text-[8px] font-black uppercase text-white shadow-lg">
              <Users className="mr-2 h-3 w-3 fill-white" /> CRM
            </Badge>
            <Button
              variant="ghost"
              className="text-text-muted hover:text-accent-primary h-7 text-[8px] font-black uppercase tracking-widest"
            >
              Обновить сегменты
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-border-subtle text-text-muted h-7 rounded-xl bg-white px-3 text-[7px] font-black uppercase tracking-widest shadow-sm"
            >
              Экспорт базы
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="list" className="w-full" onValueChange={setActiveTab}>
        {/* cabinetSurface v1 */}
        <TabsList className={cn(cabinetSurface.tabsList, 'mb-8 w-fit flex-wrap')}>
          <TabsTrigger value="list" className={cn(cabinetSurface.tabsTrigger, 'h-9 gap-2')}>
            <Users className="h-3.5 w-3.5 shrink-0" /> B2C Клиенты
          </TabsTrigger>
          <TabsTrigger value="wholesale" className={cn(cabinetSurface.tabsTrigger, 'h-9 gap-2')}>
            <Building2 className="h-3.5 w-3.5 shrink-0" /> B2B Партнеры
          </TabsTrigger>
          <TabsTrigger value="segments" className={cn(cabinetSurface.tabsTrigger, 'h-9 gap-2')}>
            <Target className="h-3.5 w-3.5 shrink-0" /> Сегменты
          </TabsTrigger>
          <TabsTrigger value="growth" className={cn(cabinetSurface.tabsTrigger, 'h-9 gap-2')}>
            <TrendingUp className="h-3.5 w-3.5 shrink-0" /> Потенциал
>>>>>>> recover/cabinet-wip-from-stash
          </TabsTrigger>
        </TabsList>

        {/* B2C List Content */}
        <TabsContent value="list" className="space-y-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
<<<<<<< HEAD
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
=======
              <Search className="text-text-muted absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
>>>>>>> recover/cabinet-wip-from-stash
              <Input
                placeholder="Поиск: имя, email, статус, стиль..."
                className="h-12 rounded-2xl border-none bg-white pl-12 text-xs font-bold shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
<<<<<<< HEAD
              className="h-12 gap-2 rounded-2xl border-slate-100 bg-white px-6 text-[10px] font-black uppercase tracking-widest"
=======
              className="border-border-subtle h-12 gap-2 rounded-2xl bg-white px-6 text-[10px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <Filter className="h-4 w-4" /> Фильтры CRM
            </Button>
          </div>

          <Card className="overflow-hidden rounded-xl border-none bg-white shadow-xl">
            <Table>
<<<<<<< HEAD
              <TableHeader className="bg-slate-50/50">
=======
              <TableHeader className="bg-bg-surface2/80">
>>>>>>> recover/cabinet-wip-from-stash
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="py-6 pl-8 text-[10px] font-black uppercase tracking-widest">
                    Клиент / Экосистема
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Тип лояльности
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">
                    Стиль / Паттерн
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">
                    LTV (Бренд)
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">
                    Вовлеченность
                  </TableHead>
                  <TableHead className="pr-8 text-right text-[10px] font-black uppercase tracking-widest">
                    Детали
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
<<<<<<< HEAD
                    className="group border-slate-50 transition-colors hover:bg-slate-50"
=======
                    className="hover:bg-bg-surface2 border-border-subtle group transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    <TableCell className="py-5 pl-8">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                          <AvatarImage src={customer.avatar} />
                          <AvatarFallback>
                            {customer.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-black uppercase leading-none tracking-tight">
                            {customer.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
<<<<<<< HEAD
                              className="border-slate-100 bg-slate-50 text-[8px] font-black"
                            >
                              {customer.activeInBrands} брендов
                            </Badge>
                            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-tighter text-indigo-600">
=======
                              className="border-border-subtle bg-bg-surface2 text-[8px] font-black"
                            >
                              {customer.activeInBrands} брендов
                            </Badge>
                            <span className="text-accent-primary flex items-center gap-1 text-[9px] font-bold uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                              <TrendingUp className="h-2.5 w-2.5" /> {customer.evolutionStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge
                          className={cn(
                            'border-none px-2 py-0.5 text-[8px] font-black uppercase',
                            customer.loyaltyType === 'Лоялист бренда'
                              ? 'bg-rose-500 text-white'
                              : customer.loyaltyType === 'Мультибрендовый энтузиаст'
<<<<<<< HEAD
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-200 text-slate-600'
=======
                                ? 'bg-accent-primary text-white'
                                : 'bg-border-subtle text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                          )}
                        >
                          {customer.loyaltyType}
                        </Badge>
<<<<<<< HEAD
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
=======
                        <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                          {customer.frequency}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
<<<<<<< HEAD
                        <p className="text-[10px] font-black uppercase text-slate-900">
                          {customer.styleDNA}
                        </p>
                        <p className="text-[9px] font-medium italic text-slate-400">
=======
                        <p className="text-text-primary text-[10px] font-black uppercase">
                          {customer.styleDNA}
                        </p>
                        <p className="text-text-muted text-[9px] font-medium italic">
>>>>>>> recover/cabinet-wip-from-stash
                          {customer.purchasePattern}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <p className="text-sm font-black uppercase">
                          {customer.brandLtv.toLocaleString('ru-RU')} ₽
                        </p>
                        <p
                          className={cn(
                            'text-[9px] font-black uppercase',
<<<<<<< HEAD
                            customer.aovTrend === 'Растущий' ? 'text-emerald-600' : 'text-slate-400'
=======
                            customer.aovTrend === 'Растущий'
                              ? 'text-emerald-600'
                              : 'text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                          )}
                        >
                          Тренд: {customer.aovTrend}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        <p className="text-[10px] font-black tabular-nums">
                          {customer.engagementScore}%
                        </p>
<<<<<<< HEAD
                        <div className="h-1 w-12 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full bg-indigo-600"
=======
                        <div className="bg-bg-surface2 h-1 w-12 overflow-hidden rounded-full">
                          <div
                            className="bg-accent-primary h-full"
>>>>>>> recover/cabinet-wip-from-stash
                            style={{ width: `${customer.engagementScore}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
<<<<<<< HEAD
                        className="h-10 w-10 rounded-xl shadow-sm transition-all hover:bg-slate-900 hover:text-white"
=======
                        className="hover:bg-text-primary/90 h-10 w-10 rounded-xl shadow-sm transition-all hover:text-white"
>>>>>>> recover/cabinet-wip-from-stash
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* B2B / Wholesale Content */}
        <TabsContent
          value="wholesale"
          className="space-y-4 duration-500 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              {
                label: 'Active Wholesale Portfolio',
                val: '42.8M ₽',
                icon: Building2,
<<<<<<< HEAD
                color: 'text-indigo-600',
=======
                color: 'text-accent-primary',
>>>>>>> recover/cabinet-wip-from-stash
              },
              {
                label: 'Total Credit Exposure',
                val: '18.2M ₽',
                icon: CreditCard,
                color: 'text-rose-500',
              },
              { label: 'Avg Partner Score', val: '92/100', icon: Star, color: 'text-amber-500' },
            ].map((m, i) => (
              <Card
                key={i}
                className="flex items-center gap-3 rounded-3xl border-none bg-white p-4 shadow-xl"
              >
                <div
                  className={cn(
<<<<<<< HEAD
                    'flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50',
=======
                    'bg-bg-surface2 flex h-10 w-10 items-center justify-center rounded-2xl',
>>>>>>> recover/cabinet-wip-from-stash
                    m.color
                  )}
                >
                  <m.icon className="h-7 w-7" />
                </div>
                <div>
<<<<<<< HEAD
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {m.label}
                  </p>
                  <p className="text-sm font-black uppercase italic leading-none text-slate-900">
=======
                  <p className="text-text-muted mb-1 text-[10px] font-black uppercase tracking-widest">
                    {m.label}
                  </p>
                  <p className="text-text-primary text-sm font-black uppercase italic leading-none">
>>>>>>> recover/cabinet-wip-from-stash
                    {m.val}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
            <Table>
<<<<<<< HEAD
              <TableHeader className="bg-slate-900 text-white">
=======
              <TableHeader className="bg-text-primary text-white">
>>>>>>> recover/cabinet-wip-from-stash
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="py-6 pl-8 text-[10px] font-black uppercase tracking-widest text-white/60">
                    Партнер / Тип
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/60">
                    Локация / Тир
                  </TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/60">
                    Кредитный лимит
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-white/60">
                    Performance
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase tracking-widest text-white/60">
                    LTV
                  </TableHead>
                  <TableHead className="pr-8 text-right text-[10px] font-black uppercase tracking-widest text-white/60">
                    Действия
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPartners.map((partner) => (
                  <TableRow
                    key={partner.id}
<<<<<<< HEAD
                    className="group border-slate-50 transition-colors hover:bg-slate-50"
                  >
                    <TableCell className="py-6 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-100 shadow-sm">
=======
                    className="hover:bg-bg-surface2 border-border-subtle group transition-colors"
                  >
                    <TableCell className="py-6 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="bg-bg-surface2 border-border-subtle relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border shadow-sm">
>>>>>>> recover/cabinet-wip-from-stash
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
<<<<<<< HEAD
                          <p className="mb-1.5 text-sm font-black uppercase leading-none tracking-tight text-slate-900">
=======
                          <p className="text-text-primary mb-1.5 text-sm font-black uppercase leading-none tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                            {partner.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={cn(
                                'border-none px-2 py-0.5 text-[8px] font-black uppercase',
                                partner.status === 'Active'
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-rose-500 text-white'
                              )}
                            >
                              {partner.status}
                            </Badge>
<<<<<<< HEAD
                            <span className="text-[9px] font-bold uppercase text-slate-400">
=======
                            <span className="text-text-muted text-[9px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                              {partner.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
<<<<<<< HEAD
                        <p className="text-[10px] font-black uppercase text-slate-900">
=======
                        <p className="text-text-primary text-[10px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                          {partner.location}
                        </p>
                        <Badge
                          variant="outline"
<<<<<<< HEAD
                          className="border-indigo-100 bg-indigo-50/50 text-[8px] font-black text-indigo-600"
=======
                          className="border-accent-primary/20 text-accent-primary bg-accent-primary/10 text-[8px] font-black"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          {partner.tier}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[150px] space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
<<<<<<< HEAD
                          <span className="text-slate-400">
                            Лимит: {partner.creditLimit.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
=======
                          <span className="text-text-muted">
                            Лимит: {partner.creditLimit.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                        <div className="bg-bg-surface2 h-1.5 w-full overflow-hidden rounded-full">
>>>>>>> recover/cabinet-wip-from-stash
                          <div
                            className={cn(
                              'h-full transition-all',
                              partner.creditUsed / partner.creditLimit > 0.8
                                ? 'bg-rose-500'
<<<<<<< HEAD
                                : 'bg-indigo-600'
=======
                                : 'bg-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
                            )}
                            style={{
                              width: `${(partner.creditUsed / partner.creditLimit) * 100}%`,
                            }}
                          />
                        </div>
<<<<<<< HEAD
                        <p className="text-[8px] font-bold uppercase text-slate-400">
=======
                        <p className="text-text-muted text-[8px] font-bold uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                          Использовано: {partner.creditUsed.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex flex-col items-end">
                        <p
                          className={cn(
                            'text-sm font-black uppercase italic',
                            partner.performance > 90 ? 'text-emerald-600' : 'text-amber-500'
                          )}
                        >
                          {partner.performance}%
                        </p>
<<<<<<< HEAD
                        <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
=======
                        <p className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                          Efficiency Index
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <p className="text-sm font-black tabular-nums">
                        {(partner.ltv / 1000000).toFixed(1)}M ₽
                      </p>
<<<<<<< HEAD
                      <p className="text-[8px] font-black uppercase text-slate-400">
=======
                      <p className="text-text-muted text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                        {partner.ordersCount} заказов
                      </p>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
<<<<<<< HEAD
                          className="h-9 w-9 rounded-xl border-slate-100 shadow-sm"
=======
                          className="border-border-subtle h-9 w-9 rounded-xl shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
<<<<<<< HEAD
                          className="h-9 w-9 rounded-xl border-slate-100 shadow-sm"
=======
                          className="border-border-subtle h-9 w-9 rounded-xl shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
<<<<<<< HEAD
                          className="h-9 w-9 rounded-xl bg-slate-900 text-white shadow-lg"
=======
                          className="bg-text-primary h-9 w-9 rounded-xl text-white shadow-lg"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent
          value="segments"
          className="space-y-4 duration-500 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {crmSegments.map((segment, i) => (
              <Card
                key={i}
                className="group cursor-pointer overflow-hidden rounded-xl border-none bg-white shadow-sm transition-all hover:shadow-xl"
              >
                <CardHeader className="p-4 pb-4">
                  <div className="mb-4 flex items-center justify-between">
<<<<<<< HEAD
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-all group-hover:bg-indigo-600 group-hover:text-white">
=======
                    <div className="bg-accent-primary/10 text-accent-primary group-hover:bg-accent-primary flex h-10 w-10 items-center justify-center rounded-2xl transition-all group-hover:text-white">
>>>>>>> recover/cabinet-wip-from-stash
                      {segment.icon}
                    </div>
                    <Badge className="border-none bg-emerald-50 px-2 text-[9px] font-black uppercase tracking-widest text-emerald-600">
                      {segment.growth}
                    </Badge>
                  </div>
<<<<<<< HEAD
                  <CardTitle className="text-base font-black uppercase italic tracking-tight transition-colors group-hover:text-indigo-600">
=======
                  <CardTitle className="group-hover:text-accent-primary text-base font-black uppercase italic tracking-tight transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                    {segment.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-end justify-between p-4 pt-0">
                  <div className="space-y-1">
<<<<<<< HEAD
                    <p className="text-[10px] font-black uppercase leading-none tracking-widest text-slate-400">
=======
                    <p className="text-text-muted text-[10px] font-black uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                      Клиентов
                    </p>
                    <p className="text-sm font-black">{segment.count}</p>
                  </div>
                  <div className="text-right">
<<<<<<< HEAD
                    <p className="text-[10px] font-black uppercase leading-none tracking-widest text-slate-400">
=======
                    <p className="text-text-muted text-[10px] font-black uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                      LTV Segment
                    </p>
                    <p className="text-sm font-black italic">{segment.ltv}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

<<<<<<< HEAD
          <Card className="group space-y-6 rounded-xl border-2 border-dashed border-slate-100 bg-slate-50/30 p-16 text-center transition-all hover:border-indigo-100">
            <div className="mx-auto max-w-md space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-xl border border-slate-50 bg-white shadow-xl transition-transform group-hover:scale-110">
                <Sparkles className="h-10 w-10 animate-pulse text-indigo-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black uppercase leading-none tracking-tight text-slate-900">
                  Custom Segment <br /> <span className="italic text-indigo-600">Constructor</span>
                </h3>
                <p className="text-sm font-medium leading-relaxed text-slate-500">
=======
          <Card className="border-border-subtle bg-bg-surface2/30 hover:border-accent-primary/20 group space-y-6 rounded-xl border-2 border-dashed p-16 text-center transition-all">
            <div className="mx-auto max-w-md space-y-6">
              <div className="border-border-subtle mx-auto flex h-20 w-20 items-center justify-center rounded-xl border bg-white shadow-xl transition-transform group-hover:scale-110">
                <Sparkles className="text-accent-primary h-10 w-10 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-text-primary text-base font-black uppercase leading-none tracking-tight">
                  Custom Segment <br />{' '}
                  <span className="text-accent-primary italic">Constructor</span>
                </h3>
                <p className="text-text-secondary text-sm font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                  Используйте AI для поиска сложных связей: "Покупатели кашемира, которые любят
                  авангард и активны в Telegram по выходным".
                </p>
              </div>
<<<<<<< HEAD
              <Button className="h-10 rounded-2xl bg-slate-900 px-10 text-xs font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:bg-indigo-600">
=======
              <Button className="bg-text-primary hover:bg-accent-primary h-10 rounded-2xl px-10 text-xs font-black uppercase tracking-widest text-white shadow-2xl transition-all">
>>>>>>> recover/cabinet-wip-from-stash
                Запустить AI-сканирование <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent
          value="growth"
          className="space-y-10 duration-500 animate-in fade-in slide-in-from-bottom-2"
        >
<<<<<<< HEAD
          <div className="relative overflow-hidden rounded-[3.5rem] bg-slate-900 p-16 text-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)]">
=======
          <div className="bg-text-primary relative overflow-hidden rounded-[3.5rem] p-16 text-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)]">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="absolute right-0 top-0 p-16 opacity-[0.03]">
              <Brain className="h-[400px] w-[400px] rotate-12" />
            </div>
            <div className="relative z-10 grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
              <div className="space-y-10">
                <div className="space-y-6">
<<<<<<< HEAD
                  <Badge className="border-none bg-indigo-600 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
=======
                  <Badge className="bg-accent-primary border-none px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
>>>>>>> recover/cabinet-wip-from-stash
                    Syntha Intelligence 360°
                  </Badge>
                  <h3 className="text-base font-black uppercase italic leading-[0.85] tracking-tighter">
                    Ecosystem <br /> Cross-Brand <br />{' '}
<<<<<<< HEAD
                    <span className="text-indigo-400">Expansion</span>
                  </h3>
                  <p className="max-w-lg text-base font-medium leading-relaxed text-slate-400">
=======
                    <span className="text-accent-primary">Expansion</span>
                  </h3>
                  <p className="text-text-muted max-w-lg text-base font-medium leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                    Мы проанализировали поведение 2М+ клиентов и выделили{' '}
                    <b>1,450 идеальных профилей</b> для вашего бренда.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <div className="space-y-2">
<<<<<<< HEAD
                    <p className="text-[10px] font-black uppercase leading-none tracking-[0.2em] text-slate-500">
=======
                    <p className="text-text-secondary text-[10px] font-black uppercase leading-none tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                      Revenue Forecast
                    </p>
                    <p className="text-sm font-black italic">+4.2M ₽</p>
                  </div>
                  <div className="space-y-2">
<<<<<<< HEAD
                    <p className="text-[10px] font-black uppercase leading-none tracking-[0.2em] text-slate-500">
                      AI Confidence
                    </p>
                    <p className="text-sm font-black italic text-indigo-400">82%</p>
                  </div>
                </div>
                <Button className="h-12 rounded-2xl bg-white px-12 text-sm font-black uppercase tracking-widest text-slate-900 shadow-[0_20px_40px_-5px_rgba(255,255,255,0.2)] transition-all hover:bg-indigo-400 hover:text-white">
=======
                    <p className="text-text-secondary text-[10px] font-black uppercase leading-none tracking-[0.2em]">
                      AI Confidence
                    </p>
                    <p className="text-accent-primary text-sm font-black italic">82%</p>
                  </div>
                </div>
                <Button className="text-text-primary hover:bg-accent-primary h-12 rounded-2xl bg-white px-12 text-sm font-black uppercase tracking-widest shadow-[0_20px_40px_-5px_rgba(255,255,255,0.2)] transition-all hover:text-white">
>>>>>>> recover/cabinet-wip-from-stash
                  Unlock Audience Leads <Zap className="ml-3 h-5 w-5 fill-current" />
                </Button>
              </div>
              <div className="hidden space-y-10 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-3xl lg:block">
                <div className="space-y-6">
                  <h4 className="border-b border-white/5 pb-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                    Synergy Insights
                  </h4>
                  <div className="space-y-6">
                    {[
<<<<<<< HEAD
                      { cat: 'Techwear Accessory Fans', match: 94, color: 'bg-indigo-500' },
=======
                      { cat: 'Techwear Accessory Fans', match: 94, color: 'bg-accent-primary' },
>>>>>>> recover/cabinet-wip-from-stash
                      { cat: 'Heritage Knitwear Enthusiasts', match: 88, color: 'bg-blue-500' },
                      { cat: 'Minimalist Interior Designers', match: 76, color: 'bg-emerald-500' },
                    ].map((item, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-white/80">{item.cat}</span>
<<<<<<< HEAD
                          <span className="text-indigo-400">{item.match}% Match</span>
=======
                          <span className="text-accent-primary">{item.match}% Match</span>
>>>>>>> recover/cabinet-wip-from-stash
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.match}%` }}
                            transition={{ delay: i * 0.2, duration: 1.5 }}
                            className={cn('h-full', item.color)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
<<<<<<< HEAD
                <div className="group relative overflow-hidden rounded-xl border border-indigo-500/30 bg-indigo-600/20 p-4">
                  <div className="absolute right-0 top-0 rotate-45 p-4 opacity-10 transition-transform group-hover:scale-125">
                    <Sparkles className="h-12 w-12 text-white" />
                  </div>
                  <p className="relative z-10 mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
=======
                <div className="bg-accent-primary/20 border-accent-primary/30 group relative overflow-hidden rounded-xl border p-4">
                  <div className="absolute right-0 top-0 rotate-45 p-4 opacity-10 transition-transform group-hover:scale-125">
                    <Sparkles className="h-12 w-12 text-white" />
                  </div>
                  <p className="text-accent-primary relative z-10 mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                    <Brain className="h-3.5 w-3.5" /> High Synergistic Opportunity
                  </p>
                  <p className="relative z-10 text-xs font-medium italic leading-relaxed text-white/90">
                    "Клиенты бренда <b>Syntha Lab</b> на 45% чаще покупают ваши пальто в первый
                    месяц после запуска. Рекомендуем запустить совместную рекламную кампанию
                    (Collaboration Ad)."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
