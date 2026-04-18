'use client';

import React, { useState, useMemo } from 'react';
import {
  Handshake,
  DollarSign,
  Scale,
  Zap,
  Globe,
  ShieldCheck,
  FileText,
  CheckCircle2,
  RefreshCcw,
  ChevronRight,
  ArrowRight,
  Info,
  Percent,
  Clock,
  Users,
  Building2,
  Landmark,
  Briefcase,
  Calculator,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  BadgePercent,
  Search,
  Filter,
  LayoutGrid,
  Truck,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_PARTNERS_TERMS = [
  {
    id: 'p1',
    name: 'ЦУМ (Moscow)',
    type: 'Department Store',
    tier: 'VIP',
    volume: '12.4M ₽',
    discount: 45,
    payment: 'Factoring 60d',
    logistics: 'Ex-Works',
    status: 'Active',
  },
  {
    id: 'p2',
    name: 'PODIUM',
    type: 'Boutique',
    tier: 'Retail',
    volume: '4.2M ₽',
    discount: 40,
    payment: 'Prepayment 100%',
    logistics: 'DDP',
    status: 'Active',
  },
  {
    id: 'p3',
    name: 'Lamoda',
    type: 'Marketplace',
    tier: 'Market',
    volume: '8.1M ₽',
    discount: 50,
    payment: 'Consignment',
    logistics: 'Fulfillment',
    status: 'Review',
  },
];

export function CommercialTermsMatrix() {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const selectedPartner = useMemo(
    () => MOCK_PARTNERS_TERMS.find((p) => p.id === selectedPartnerId),
    [selectedPartnerId]
  );

  // Pricing Engine State
  const [basePrice, setBasePrice] = useState(18000);

  const calculatedPrices = useMemo(() => {
    return {
      vip: basePrice * (1 - 0.45),
      retail: basePrice * (1 - 0.4),
      market: basePrice * (1 - 0.5),
    };
  }, [basePrice]);

  return (
    <div className="space-y-4 duration-700 animate-in fade-in">
      <Card className="overflow-hidden rounded-xl border-none bg-white shadow-2xl">
        <CardHeader className="bg-emerald-600 p-3 pb-4 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="mb-1 flex items-center gap-2">
                <Handshake className="h-6 w-6 text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200">
                  B2B Commercial Engine
                </span>
              </div>
              <CardTitle className="text-base font-black uppercase tracking-tighter">
                Commercial Terms Matrix
              </CardTitle>
              <CardDescription className="font-medium italic text-emerald-50">
                Динамическое управление ценообразованием и условиями для разных групп партнеров.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col items-end rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <p className="text-[8px] font-black uppercase text-emerald-200">
                  Базовая розничная цена (RRP)
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="h-8 w-24 border-none bg-transparent p-0 text-right text-base font-black text-white focus-visible:ring-0"
                  />
                  <span className="text-base font-black text-white">₽</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-10 p-3 pt-10">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <div className="group flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-indigo-200">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <BadgePercent className="h-6 w-6 text-indigo-600" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Pricing Tiers (Wholesale)
                  </span>
                </div>
                <p className="mb-6 text-[10px] font-medium uppercase leading-relaxed text-slate-500">
                  Оптовые цены, рассчитанные на основе выбранной розничной цены.
                </p>
                <div className="space-y-3">
                  {[
                    { label: 'VIP (Tier 1)', discount: '45%', price: calculatedPrices.vip },
                    { label: 'Retail (Tier 2)', discount: '40%', price: calculatedPrices.retail },
                    { label: 'Market (Tier 3)', discount: '50%', price: calculatedPrices.market },
                  ].map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all group-hover:shadow-md"
                    >
                      <div>
                        <span className="block text-[10px] font-black uppercase text-slate-400">
                          {t.label}
                        </span>
                        <span className="text-[8px] font-bold uppercase text-indigo-600">
                          Discount: {t.discount}
                        </span>
                      </div>
                      <span className="text-sm font-black tabular-nums text-slate-900">
                        {t.price.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                className="mt-6 w-full text-[9px] font-black uppercase text-indigo-600"
              >
                Настроить тиры <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>

            <div className="group flex flex-col justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-emerald-200">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <Landmark className="h-6 w-6 text-emerald-600" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Режимы оплаты и факторинг
                  </span>
                </div>
                <p className="mb-6 text-[10px] font-medium uppercase leading-relaxed text-slate-500">
                  Финансовые шлюзы и условия отсрочки платежей.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase leading-tight text-emerald-900">
                        Syntha Factoring
                      </p>
                      <p className="mt-0.5 text-[8px] font-bold uppercase text-emerald-700">
                        Лимит: 120M ₽ • Ставка: 1.2%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase leading-tight text-indigo-900">
                        Escrow Contracts
                      </p>
                      <p className="mt-0.5 text-[8px] font-bold uppercase text-indigo-700">
                        Безопасные сделки для новых партнеров
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="mt-6 h-12 w-full rounded-xl bg-slate-900 text-[9px] font-black uppercase text-white shadow-xl">
                Шлюзы оплаты
              </Button>
            </div>

            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-slate-900 p-4 text-white">
              <div className="absolute right-0 top-0 p-4 opacity-10 transition-transform group-hover:scale-110">
                <Globe className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-500/50">
                    <Truck className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    Logistics Terms
                  </span>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase text-white/40">
                      Incoterms 2026 Engine
                    </p>
                    <p className="text-xs font-medium italic leading-relaxed text-white/80">
                      «Авто-расчет страховки и пошлин при выборе условий поставки для каждого
                      склада».
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Badge className="flex items-center justify-center gap-2 border border-indigo-400/30 bg-indigo-600/50 py-2 text-[8px] font-black uppercase text-white">
                      <CheckCircle2 className="h-3 w-3 text-indigo-300" /> EXW Ready
                    </Badge>
                    <Badge className="flex items-center justify-center gap-2 border border-white/5 bg-white/10 py-2 text-[8px] font-black uppercase text-white/60">
                      <Clock className="h-3 w-3" /> DDP Active
                    </Badge>
                  </div>
                </div>
              </div>
              <Button className="relative z-10 mt-10 h-12 w-full rounded-xl bg-white text-[9px] font-black uppercase text-slate-900 shadow-2xl hover:bg-slate-100">
                Калькулятор доставки
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Реестр партнерских условий
              </h4>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Поиск партнера..."
                    className="h-10 w-64 rounded-xl border-slate-100 pl-9 text-[10px] font-bold uppercase"
                  />
                </div>
                <Button variant="outline" className="h-10 rounded-xl border-slate-100">
                  <Filter className="h-4 w-4 text-slate-400" />
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-none">
                    <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Партнер / Тип
                    </TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Tier / Скидка
                    </TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Условия оплаты
                    </TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Объем (YTD)
                    </TableHead>
                    <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Статус
                    </TableHead>
                    <TableHead className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Действия
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_PARTNERS_TERMS.map((p) => (
                    <TableRow
                      key={p.id}
                      onClick={() => setSelectedPartnerId(p.id)}
                      className={cn(
                        'group cursor-pointer transition-colors hover:bg-slate-50/50',
                        selectedPartnerId === p.id && 'bg-emerald-50/30'
                      )}
                    >
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white text-sm font-black text-emerald-600 shadow-sm transition-transform group-hover:scale-105">
                            {p.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-black uppercase tracking-tight text-slate-900">
                              {p.name}
                            </p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                              {p.type}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            className={cn(
                              'h-5 w-fit border-none px-2 text-[8px] font-black uppercase',
                              p.tier === 'VIP'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-indigo-100 text-indigo-700'
                            )}
                          >
                            {p.tier}
                          </Badge>
                          <span className="text-xs font-black text-slate-900">-{p.discount}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[10px] font-black uppercase italic tracking-tighter text-slate-900">
                        {p.payment}
                      </TableCell>
                      <TableCell className="text-[10px] font-black tabular-nums text-slate-900">
                        {p.volume}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            'h-5 border-none px-2 text-[8px] font-black uppercase shadow-sm',
                            p.status === 'Active'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-amber-500 text-white'
                          )}
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 py-6 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl transition-all group-hover:bg-white group-hover:shadow-md"
                        >
                          <FileText className="h-4 w-4 text-slate-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {selectedPartnerId && selectedPartner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-1 gap-3 lg:grid-cols-2"
          >
            <Card className="relative overflow-hidden rounded-xl border-none bg-slate-900 p-3 text-white shadow-xl">
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <TrendingUp className="h-32 w-32" />
              </div>
              <div className="relative z-10 space-y-6">
                <div>
                  <Badge className="mb-2 border-none bg-indigo-600 text-[8px] font-black uppercase text-white">
                    Partner Health Check
                  </Badge>
                  <h4 className="text-base font-black uppercase tracking-tighter">
                    Анализ эффективности {selectedPartner.name}
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase text-indigo-300">
                      <span>Sell-Through</span>
                      <span>84%</span>
                    </div>
                    <Progress value={84} className="h-1 bg-white/10" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase text-indigo-300">
                      <span>Лояльность</span>
                      <span>High</span>
                    </div>
                    <Progress value={92} className="h-1 bg-white/10" />
                  </div>
                </div>
                <p className="text-sm font-medium italic leading-relaxed text-white/60">
                  «Партнер показывает отличную динамику продаж. AI рекомендует повысить скидку до
                  48% при условии увеличения объема предзаказа на 15% в следующем сезоне».
                </p>
                <Button className="h-10 rounded-2xl bg-white px-8 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-2xl hover:bg-slate-100">
                  Сгенерировать оффер
                </Button>
              </div>
            </Card>

            <Card className="flex flex-col justify-between rounded-xl border-slate-100 bg-white p-3 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50">
                    <ShieldAlert className="h-6 w-6 text-rose-500" />
                  </div>
                  <h4 className="text-base font-black uppercase tracking-tight">Проверка рисков</h4>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2 rounded-2xl border border-rose-100 bg-rose-50 p-4">
                    <p className="text-[10px] font-black uppercase leading-tight text-rose-900">
                      Просрочка платежей
                    </p>
                    <p className="text-[9px] font-bold uppercase text-rose-700">
                      0 дней • Риск отсутствует
                    </p>
                  </div>
                  <div className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                    <p className="text-[10px] font-black uppercase leading-tight text-emerald-900">
                      Юридическая проверка
                    </p>
                    <p className="text-[9px] font-bold uppercase text-emerald-700">
                      Пройдена (Feb 2026)
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-slate-50 pt-8">
                <p className="text-[10px] font-bold uppercase italic tracking-widest text-slate-400">
                  Данные синхронизированы с CRM
                </p>
                <Button
                  variant="ghost"
                  className="text-[9px] font-black uppercase text-slate-400 hover:text-slate-900"
                >
                  Просмотреть договор
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
