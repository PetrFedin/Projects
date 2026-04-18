'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  Wallet,
  Banknote,
  CreditCard,
  FileText,
  Clock,
  ChevronRight,
  Download,
  Filter,
  RefreshCcw,
  Zap,
  Target,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { cn } from '@/lib/cn';

export function B2BFinancialPerformance() {
  const { activeCurrency } = useUIState();
  const [activeTab, setActiveTab] = useState<'overview' | 'forecasting' | 'cashflow' | 'budgeting'>(
    'overview'
  );

  const stats = [
    { label: 'Общая выручка', value: '42.8M ₽', change: '+14.2%', trend: 'up' },
    { label: 'Валовая маржа', value: '64.2%', change: '+2.1%', trend: 'up' },
    { label: 'Средний чек (B2B)', value: '840K ₽', change: '-3.4%', trend: 'down' },
    {
      label: 'Дебиторская задолженность',
      value: '12.4M ₽',
      change: '85% Текущая',
      trend: 'neutral',
    },
  ];

  const renderOverview = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <Card key={i} className="space-y-4 rounded-xl border-none bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="bg-bg-surface2 text-text-muted flex h-10 w-10 items-center justify-center rounded-2xl">
                {i === 0 && <DollarSign className="h-5 w-5" />}
                {i === 1 && <PieChart className="h-5 w-5" />}
                {i === 2 && <TrendingUp className="h-5 w-5" />}
                {i === 3 && <Wallet className="h-5 w-5" />}
              </div>
              <Badge
                className={cn(
                  'border-none px-2 py-0.5 text-[8px] font-black',
                  s.trend === 'up'
                    ? 'bg-emerald-50 text-emerald-600'
                    : s.trend === 'down'
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-bg-surface2 text-text-muted'
                )}
              >
                {s.change}
              </Badge>
            </div>
            <div className="space-y-1 text-left">
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                {s.label}
              </p>
              <p className="text-text-primary text-sm font-black">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 text-left">
        <Card className="col-span-2 space-y-4 rounded-xl border-none bg-white p-3 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-base font-black uppercase tracking-tight">
                Эффективность выручки
              </h4>
              <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                Сравнение План vs Факт по месяцам (₽)
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="bg-accent-primary h-2 w-2 rounded-full" />
                <span className="text-text-muted text-[9px] font-black uppercase">Факт</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-border-subtle h-2 w-2 rounded-full" />
                <span className="text-text-muted text-[9px] font-black uppercase">План</span>
              </div>
            </div>
          </div>
          <div className="flex h-64 items-end gap-3 px-4">
            {[40, 65, 55, 90, 75, 85, 95].map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex h-full w-full flex-col justify-end gap-1">
                  <div
                    className="bg-accent-primary w-full rounded-t-lg transition-all duration-1000"
                    style={{ height: `${h}%` }}
                  />
                  <div
                    className="bg-bg-surface2 w-full rounded-b-lg"
                    style={{ height: `${h * 0.8}%` }}
                  />
                </div>
                <span className="text-text-muted text-[9px] font-black uppercase">M0{i + 1}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-text-primary relative space-y-4 overflow-hidden rounded-xl border-none p-3 text-white shadow-2xl">
          <div className="absolute right-0 top-0 p-4 opacity-10">
            <Target className="h-32 w-32" />
          </div>
          <div className="relative z-10 space-y-6">
            <h4 className="text-base font-black uppercase tracking-tight">Рейтинг фин. здоровья</h4>
            <div className="flex items-center justify-center py-4">
              <div className="relative h-48 w-48">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="stroke-current text-white/5"
                    strokeWidth="10"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-accent-primary stroke-current"
                    strokeWidth="10"
                    strokeDasharray="251.2"
                    strokeDashoffset="62.8"
                    strokeLinecap="round"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-sm font-black">84</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    Отлично
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Коэффициент ликвидности', value: '2.4' },
                { label: 'Долг к капиталу', value: '0.15' },
                { label: 'Оборачиваемость дебиторки', value: '32 Дня' },
              ].map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-[10px] font-black uppercase"
                >
                  <span className="text-white/40">{m.label}</span>
                  <span className="text-white">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderForecasting = () => (
    <div className="space-y-4 text-left animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-2 gap-3">
        <Card className="space-y-4 rounded-xl border-none bg-white p-3 shadow-2xl">
          <div className="space-y-1">
            <h4 className="text-base font-black uppercase tracking-tight">AI Прогноз продаж</h4>
            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
              На основе исторических данных и настроений рынка (₽)
            </p>
          </div>
          <div className="bg-bg-surface2 border-border-subtle group relative flex h-64 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed">
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <div className="space-y-4">
                <div className="flex h-32 items-end gap-1">
                  {[30, 45, 40, 60, 55, 80, 70, 90, 100].map((h, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex-1 rounded-t-lg transition-all duration-1000',
                        i > 5 ? 'bg-accent-primary/40' : 'bg-accent-primary'
                      )}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-text-muted text-[9px] font-black uppercase">История</p>
                  <Badge className="bg-accent-primary/10 text-accent-primary border-none text-[8px] font-black">
                    ПРОГНОЗ Q4 '26
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-accent-primary/10 border-accent-primary/20 space-y-1 rounded-2xl border p-4">
              <p className="text-accent-primary text-[9px] font-black uppercase">Ожидаемый рост</p>
              <p className="text-accent-primary text-sm font-black">+24.2%</p>
            </div>
            <div className="bg-bg-surface2 border-border-subtle space-y-1 rounded-2xl border p-4">
              <p className="text-text-muted text-[9px] font-black uppercase">Уровень доверия</p>
              <p className="text-text-primary text-sm font-black">89%</p>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4 rounded-xl border-none bg-white p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Zap className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <h5 className="text-text-primary text-sm font-black uppercase">
                  Конструктор Сценариев
                </h5>
                <p className="text-text-muted text-[9px] font-bold uppercase">
                  Симуляция влияния рынка на P&L
                </p>
              </div>
            </div>
            <div className="space-y-4 pt-4">
              {[
                { label: 'Рост логистических затрат (+15%)', effect: '-2.4M ₽ к выручке' },
                { label: 'Выход в новый регион (CIS)', effect: '+18.5M ₽ к выручке' },
                { label: 'Волатильность валют (5%)', effect: '-1.2M ₽ к марже' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-bg-surface2 hover:bg-bg-surface2 group flex cursor-pointer items-center justify-between rounded-xl p-4 transition-colors"
                >
                  <p className="text-text-secondary group-hover:text-text-primary text-[10px] font-black uppercase transition-colors">
                    {s.label}
                  </p>
                  <ArrowUpRight className="text-text-muted group-hover:text-accent-primary h-3.5 w-3.5 transition-all" />
                </div>
              ))}
            </div>
            <Button className="bg-text-primary mt-4 h-12 w-full rounded-xl text-[10px] font-black uppercase tracking-widest text-white">
              Создать сценарий
            </Button>
          </Card>

          <Card className="bg-bg-surface2 space-y-4 rounded-xl border-none p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h5 className="text-text-primary text-sm font-black uppercase">
                Потоки данных продаж
              </h5>
              <Badge className="border-none bg-emerald-50 text-[8px] font-black text-emerald-600">
                2 АКТИВНО
              </Badge>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Shopify Store (Direct)', status: 'Подключено' },
                { name: 'Milan Retail POS (EDI)', status: 'Подключено' },
                { name: 'Amazon Brand Registry', status: 'Ожидает' },
              ].map((f, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-text-secondary text-[9px] font-bold uppercase">
                    {f.name}
                  </span>
                  <span
                    className={cn(
                      'text-[8px] font-black uppercase',
                      f.status === 'Подключено' ? 'text-emerald-500' : 'text-amber-500'
                    )}
                  >
                    {f.status}
                  </span>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="border-border-default text-accent-primary mt-2 h-10 w-full rounded-xl border text-[9px] font-black uppercase tracking-widest"
            >
              Подключить поток
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderCashFlow = () => (
    <div className="space-y-4 text-left animate-in fade-in slide-in-from-bottom-4">
      <div className="grid grid-cols-3 gap-3">
        <Card className="col-span-2 space-y-4 rounded-xl border-none bg-white p-3 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-base font-black uppercase tracking-tight">
                Прогноз Cash Flow (30 дней)
              </h4>
              <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                Притоки vs Оттоки на основе графиков заказов (₽)
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-border-default h-10 rounded-xl text-[9px] font-black uppercase"
              >
                Экспорт книги
              </Button>
              <Button className="bg-text-primary h-10 rounded-xl px-6 text-[9px] font-black uppercase text-white">
                Добавить расход
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {[
              {
                date: 'Feb 15',
                desc: 'Order #FW26-042 Payment',
                type: 'in',
                amount: '+4.2M ₽',
                status: 'Pending',
              },
              {
                date: 'Feb 18',
                desc: 'Logistics - Moscow Hub',
                type: 'out',
                amount: '-1.8M ₽',
                status: 'Scheduled',
              },
              {
                date: 'Feb 22',
                desc: 'Pre-order #SS27-001 Deposit',
                type: 'in',
                amount: '+12.5M ₽',
                status: 'Confirmed',
              },
              {
                date: 'Feb 28',
                desc: 'Production Milestone - Factory #4',
                type: 'out',
                amount: '-5.4M ₽',
                status: 'Pending',
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-bg-surface2 border-border-subtle hover:border-accent-primary/30 group flex items-center justify-between rounded-2xl border p-3 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 text-center">
                    <p className="text-text-primary text-[10px] font-black uppercase">
                      {t.date.split(' ')[0]}
                    </p>
                    <p className="text-text-primary text-sm font-black">{t.date.split(' ')[1]}</p>
                  </div>
                  <div className="bg-border-subtle h-10 w-[1px]" />
                  <div>
                    <p className="text-text-primary text-xs font-black uppercase">{t.desc}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-border-default text-text-muted text-[8px] font-black"
                      >
                        {t.status}
                      </Badge>
                      {t.type === 'in' ? (
                        <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-rose-500" />
                      )}
                    </div>
                  </div>
                </div>
                <p
                  className={cn(
                    'text-sm font-black',
                    t.type === 'in' ? 'text-emerald-500' : 'text-text-primary'
                  )}
                >
                  {t.amount}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-6 rounded-xl border-none bg-emerald-900 p-3 text-white shadow-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-emerald-400">
              <Banknote className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60">
                Доступная ликвидность
              </p>
              <p className="text-sm font-black">28.4M ₽</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                +12% к прошлому месяцу
              </p>
            </div>
            <div className="space-y-4 border-t border-emerald-800 pt-6">
              <div className="flex items-center justify-between text-[10px] font-black uppercase">
                <span className="text-emerald-400/60">Зарезервировано под пр-во</span>
                <span>14.2M ₽</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase">
                <span className="text-emerald-400/60">Кредитные линии</span>
                <span>40.0M ₽</span>
              </div>
            </div>
            <Button className="h-10 w-full rounded-2xl bg-white text-[10px] font-black uppercase tracking-widest text-emerald-900 shadow-xl shadow-emerald-950/20">
              Управление финансами
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-bg-surface2 flex h-full flex-col">
      <div className="space-y-4 overflow-auto p-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-3">
              <div className="bg-accent-primary shadow-accent-primary/15 flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-lg">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h2 className="text-text-primary text-base font-black uppercase tracking-tight">
                Финансовые показатели
              </h2>
            </div>
            <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
              Фискальный мониторинг в реальном времени, прогнозирование и ИИ-бюджетирование
            </p>
          </div>
          <div className="border-border-subtle flex items-center gap-3 rounded-2xl border bg-white p-1 shadow-sm">
            {[
              { id: 'overview', label: 'Обзор', icon: BarChart3 },
              { id: 'forecasting', label: 'Прогноз', icon: TrendingUp },
              { id: 'cashflow', label: 'Cash Flow', icon: Banknote },
              { id: 'budgeting', label: 'Бюджет', icon: Target },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all',
                  activeTab === tab.id
                    ? 'bg-text-primary text-white shadow-lg'
                    : 'text-text-muted hover:text-text-secondary hover:bg-bg-surface2'
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'forecasting' && renderForecasting()}
            {activeTab === 'cashflow' && renderCashFlow()}
            {activeTab === 'budgeting' && (
              <div className="space-y-4 text-left animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-3 gap-3">
                  <Card className="col-span-2 space-y-4 rounded-xl border-none bg-white p-3 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="text-text-primary text-base font-black uppercase tracking-tight">
                          Распределение бюджета
                        </h4>
                        <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
                          Текущий сезон: FW26 (Осень/Зима 2026)
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="border-border-default h-10 rounded-xl text-[9px] font-black uppercase"
                        >
                          Перераспределить
                        </Button>
                        <Button className="bg-text-primary h-10 rounded-xl px-6 text-[9px] font-black uppercase text-white">
                          Новая цель
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          cat: 'Верхняя одежда',
                          budget: 15000000,
                          spent: 12400000,
                          color: 'bg-accent-primary',
                        },
                        {
                          cat: 'Трикотаж',
                          budget: 8000000,
                          spent: 6200000,
                          color: 'bg-emerald-500',
                        },
                        {
                          cat: 'Аксессуары',
                          budget: 4000000,
                          spent: 3800000,
                          color: 'bg-amber-500',
                        },
                        { cat: 'Обувь', budget: 10000000, spent: 2500000, color: 'bg-rose-500' },
                      ].map((item, i) => (
                        <div key={i} className="space-y-3">
                          <div className="flex items-end justify-between">
                            <div className="space-y-1">
                              <p className="text-text-primary text-xs font-black uppercase">
                                {item.cat}
                              </p>
                              <p className="text-text-muted text-[9px] font-bold uppercase">
                                Освоено: {((item.spent / item.budget) * 100).toFixed(1)}%
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-text-primary text-sm font-black">
                                {item.spent.toLocaleString('ru-RU')} /{' '}
                                {item.budget.toLocaleString('ru-RU')} ₽
                              </p>
                            </div>
                          </div>
                          <div className="bg-bg-surface2 h-2 w-full overflow-hidden rounded-full">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.spent / item.budget) * 100}%` }}
                              className={cn('h-full rounded-full', item.color)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div className="space-y-6">
                    <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="bg-accent-primary/10 text-accent-primary flex h-12 w-12 items-center justify-center rounded-2xl">
                          <PieChart className="h-6 w-6" />
                        </div>
                        <h5 className="text-text-primary text-sm font-black uppercase">
                          Структура бюджета
                        </h5>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase">
                          <span className="text-text-muted">Производство</span>
                          <span className="text-text-primary">65%</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-black uppercase">
                          <span className="text-text-muted">Маркетинг</span>
                          <span className="text-text-primary">20%</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-black uppercase">
                          <span className="text-text-muted">Логистика</span>
                          <span className="text-text-primary">15%</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="border-border-subtle h-12 w-full rounded-xl text-[10px] font-black uppercase tracking-widest"
                      >
                        Детальный отчет
                      </Button>
                    </Card>

                    <Card className="bg-text-primary space-y-4 rounded-xl border-none p-4 text-white shadow-xl">
                      <h5 className="text-sm font-black uppercase tracking-tight">
                        AI Инсайт по экономии
                      </h5>
                      <p className="text-text-muted text-[10px] font-medium uppercase leading-relaxed tracking-widest">
                        Консолидация отгрузок FW26 через **Хаб Дубай** может снизить логистические
                        расходы на **12% (1.4M ₽)**.
                      </p>
                      <Button className="text-text-primary h-10 w-full rounded-xl bg-white text-[9px] font-black uppercase tracking-widest">
                        Оптимизировать
                      </Button>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
