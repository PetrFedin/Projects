'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  AlertCircle,
  Check,
  Plus,
  FileText,
  Database,
  ArrowRight,
  TrendingUp,
  PieChart,
  Calendar,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useB2BState } from '@/providers/b2b-state';
import { cn } from '@/lib/cn';
import { CartItem, UserRole } from '@/lib/types';

interface PlanningDashboardProps {
  viewRole: UserRole;
  currency: string;
  toast: any;
}

export const PlanningDashboard: React.FC<PlanningDashboardProps> = ({
  viewRole,
  currency,
  toast,
}) => {
  const { b2bCart } = useB2BState();
  const totalItems = useMemo(
    () => b2bCart.reduce((sum, item) => sum + item.quantity, 0),
    [b2bCart]
  );

  const planningConfig = {
    brand: {
      title: 'Production Planning AI',
      desc: 'Оптимизация производственных циклов и загрузки мощностей',
      badge: 'Production AI',
      stats: [
        { label: 'Цех Пошива', key: 'outerwear', color: 'bg-accent-primary' },
        { label: 'Раскройный Цех', key: 'jersey', color: 'bg-emerald-500' },
        { label: 'ОТК & Упаковка', key: 'accessories', color: 'bg-amber-500' },
      ],
    },
    b2b: {
      title: 'Retail Planning AI',
      desc: 'Прогноз продаж и балансировка ассортиментной матрицы',
      badge: 'Retail AI',
      stats: [
        { label: 'Верхняя одежда', key: 'outerwear', color: 'bg-text-primary' },
        { label: 'Трикотаж & Топы', key: 'jersey', color: 'bg-bg-surface2' },
        { label: 'Аксессуары', key: 'accessories', color: 'bg-border-default' },
      ],
    },
    distributor: {
      title: 'Supply Chain AI',
      desc: 'Консолидация партий для региональных хабов',
      badge: 'Logistics AI',
      stats: [
        { label: 'Центральный Хаб', key: 'outerwear', color: 'bg-orange-500' },
        { label: 'Регион Восток', key: 'jersey', color: 'bg-cyan-500' },
        { label: 'Транзит', key: 'accessories', color: 'bg-rose-500' },
      ],
    },
  };

  const currentConfig =
    planningConfig[viewRole as keyof typeof planningConfig] || planningConfig.b2b;

  const [selectedWave, setSelectedWave] = React.useState<string>('Fast Track');

  const stats = useMemo(() => {
    return currentConfig.stats.map((cat) => {
      const catItems = b2bCart.filter((item) => {
        const category = item.category?.toLowerCase() || '';
        if (cat.key === 'outerwear')
          return (
            category.includes('курт') ||
            category.includes('пальт') ||
            category.includes('outerwear')
          );
        if (cat.key === 'jersey')
          return (
            category.includes('трикот') ||
            category.includes('футб') ||
            category.includes('jersey') ||
            category.includes('топ')
          );
        if (cat.key === 'accessories')
          return (
            category.includes('аксесс') ||
            category.includes('сумк') ||
            category.includes('accessories')
          );
        return false;
      });
      const count = catItems.reduce((sum, item) => sum + item.quantity, 0);
      const percentage =
        totalItems > 0 ? Math.round((count / totalItems) * 100) : viewRole === 'brand' ? 65 : 0;

      let status = 'Balanced';
      let color = 'text-emerald-500';

      if (viewRole === 'brand') {
        status = percentage > 80 ? 'Critical Load' : 'Optimal';
        color = percentage > 80 ? 'text-rose-500' : 'text-emerald-500';
      } else {
        if (percentage > 50) {
          status = 'Overbought';
          color = 'text-rose-500';
        } else if (percentage < 15) {
          status = 'Low Stock';
          color = 'text-amber-500';
        }
      }

      return { ...cat, value: percentage, gap: status, gapColor: color };
    });
  }, [b2bCart, totalItems, viewRole, currentConfig]);

  return (
    <motion.div
      key="planning-dashboard"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="min-h-[600px] w-full flex-shrink-0 space-y-6 px-4 pb-10"
    >
      {/* Financial & Budget Header */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {[
          {
            label: 'Общий бюджет',
            value: '12,500,000 ₽',
            sub: 'Лимит на сезон FW26',
            icon: Database,
            color: 'text-text-primary',
          },
          {
            label: 'Выбрано в заказ',
            value: `${b2bCart.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString('ru-RU')} ₽`,
            sub: `${b2bCart.length} артикулов`,
            icon: Check,
            color: 'text-accent-primary',
          },
          {
            label: 'Остаток лимита',
            value: `${(12500000 - b2bCart.reduce((sum, item) => sum + item.price * item.quantity, 0)).toLocaleString('ru-RU')} ₽`,
            sub: 'Доступно для закупки',
            icon: TrendingUp,
            color: 'text-emerald-500',
          },
          {
            label: 'Средняя маржа',
            value: '64.2%',
            sub: 'Прогноз прибыльности',
            icon: BarChart3,
            color: 'text-accent-primary',
          },
        ].map((item, i) => (
          <div
            key={i}
            className="border-border-subtle hover:border-accent-primary/30 group flex flex-col justify-between rounded-xl border bg-white p-4 shadow-sm transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="bg-bg-surface2 group-hover:bg-accent-primary/10 flex h-8 w-8 items-center justify-center rounded-xl transition-colors">
                <item.icon className={cn('h-4 w-4', item.color)} />
              </div>
              <Badge className="bg-bg-surface2 text-text-muted border-none text-[7px] font-black uppercase tracking-widest">
                Live
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-text-muted mb-1 text-[10px] font-black uppercase tracking-widest">
                {item.label}
              </p>
              <h4 className={cn('text-base font-black tracking-tighter', item.color)}>
                {item.value}
              </h4>
              <p className="text-text-muted mt-1 text-[7px] font-bold uppercase">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="border-border-subtle rounded-xl border bg-white p-4 shadow-sm md:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-text-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <BarChart3 className="text-accent-primary h-3 w-3" />
                {currentConfig.title}
              </h3>
              <p className="text-text-muted text-[9px] font-medium">{currentConfig.desc}</p>
            </div>
            <Badge className="bg-accent-primary animate-pulse border-none px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
              {currentConfig.badge}
            </Badge>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {stats.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-end justify-between">
                    <span className="text-text-secondary text-[8px] font-black uppercase tracking-tighter">
                      {item.label}
                    </span>
                    <span className="text-text-primary text-[9px] font-black">{item.value}%</span>
                  </div>
                  <div className="bg-border-subtle h-1.5 w-full overflow-hidden rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className={cn('h-full rounded-full', item.color)}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={cn('h-1 w-1 rounded-full', item.gapColor.replace('text', 'bg'))}
                    />
                    <span
                      className={cn(
                        'text-[7px] font-black uppercase tracking-tighter',
                        item.gapColor
                      )}
                    >
                      {item.gap}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-border-subtle flex items-start gap-3 rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
              <div className="space-y-1">
                <p className="text-text-primary text-[9px] font-black uppercase">
                  {viewRole === 'brand'
                    ? 'Production Insight'
                    : viewRole === 'distributor'
                      ? 'Logistics Insight'
                      : 'AI Recommendation'}
                </p>
                <p className="text-text-secondary text-[9px] font-medium leading-relaxed">
                  {viewRole === 'brand'
                    ? 'Внимание: Нагрузка на цех пошива приближается к лимиту. Рекомендуем открыть дополнительную смену для Drop 2.'
                    : viewRole === 'distributor'
                      ? "Возможна консолидация заказов из региона 'Восток' для экономии 15% на фрахте."
                      : totalItems === 0
                        ? 'Начните добавлять товары в заказ для получения AI-рекомендаций по ассортименту.'
                        : stats.find((s) => s.gap === 'Low Stock')
                          ? `Внимание: категория "${stats.find((s) => s.gap === 'Low Stock')?.label}" представлена слабо. Добавьте аксессуары для баланса коллекции.`
                          : "Коллекция сбалансирована. Рекомендуем обратить внимание на новые поступления в категории 'Обувь'."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-text-primary group/size-curve relative overflow-hidden rounded-3xl p-4 shadow-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.15),transparent)]" />
          <div className="relative z-10 space-y-5">
            <div className="space-y-1">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white">
                {viewRole === 'brand' ? 'Capacity Curves' : 'Delivery Waves'}
              </h3>
              <p className="text-text-secondary text-[9px] font-bold uppercase tracking-tighter">
                {viewRole === 'brand' ? 'Резерв мощностей' : 'График отгрузок'}
              </p>
            </div>

            <div className="space-y-2">
              {[
                {
                  name: viewRole === 'brand' ? 'Full Capacity' : 'Fast Track',
                  desc: viewRole === 'brand' ? 'Цех + Аутсорс' : 'Air Freight',
                },
                {
                  name: viewRole === 'brand' ? 'Эко-режим' : 'Стандарт',
                  desc: viewRole === 'brand' ? 'Только основной цех' : 'Море/Авто',
                },
                {
                  name: viewRole === 'brand' ? 'Sample Only' : 'Bulk Wave',
                  desc: viewRole === 'brand' ? 'Экспериментальный цех' : 'Consolidated',
                },
              ].map((curve) => (
                <button
                  key={curve.name}
                  onClick={() => setSelectedWave(curve.name)}
                  className={cn(
                    'group/c flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all',
                    selectedWave === curve.name
                      ? 'bg-accent-primary border-accent-primary/40 shadow-accent-primary/20 shadow-lg'
                      : 'bg-text-primary/90 border-text-primary/25 hover:border-border-subtle'
                  )}
                >
                  <div className="space-y-0.5">
                    <p
                      className={cn(
                        'text-[9px] font-black uppercase tracking-widest',
                        selectedWave === curve.name ? 'text-white' : 'text-text-muted'
                      )}
                    >
                      {curve.name}
                    </p>
                    <p className="text-text-secondary text-[7px] font-bold uppercase tracking-widest">
                      {curve.desc}
                    </p>
                  </div>
                  <div
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-lg transition-colors',
                      selectedWave === curve.name
                        ? 'bg-white/20 text-white'
                        : 'bg-text-primary/75 text-text-secondary group-hover/c:text-text-muted'
                    )}
                  >
                    {selectedWave === curve.name ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <Button
              onClick={() =>
                toast({
                  title: 'Переход в кабинет',
                  description: 'Operational parameters updated in Cabinet for Order #8821.',
                })
              }
              className="text-text-primary hover:bg-bg-surface2 h-10 w-full rounded-xl bg-white text-[9px] font-black uppercase tracking-widest shadow-xl transition-all"
            >
              Открыть в заказе #8821
            </Button>
          </div>
        </div>
      </div>

      {/* Detailed SKU Planning Table */}
      <div className="border-border-subtle overflow-hidden rounded-xl border bg-white shadow-sm animate-in fade-in slide-in-from-bottom-4">
        <div className="border-border-subtle bg-bg-surface2/20 flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-3">
            <div className="bg-accent-primary shadow-accent-primary/15 flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-text-primary text-sm font-black uppercase tracking-widest">
                Advanced SKU Matrix Planner
              </h3>
              <p className="text-text-muted text-[10px] font-medium uppercase tracking-tighter">
                Детальное распределение артикулов, размеров и логистических волн
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="border-none bg-emerald-100 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-emerald-600">
              AI Verified
            </Badge>
            <Badge className="bg-text-primary border-none px-3 py-1 text-[8px] font-black uppercase tracking-widest text-white">
              {b2bCart.length} SKU
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          {b2bCart.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bg-surface2/80 border-border-subtle border-b">
                  <th className="text-text-muted px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest">
                    Артикул / Модель
                  </th>
                  <th className="text-text-muted px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest">
                    Категория
                  </th>
                  <th className="text-text-muted px-8 py-4 text-center text-[9px] font-black uppercase tracking-widest">
                    Спецификация
                  </th>
                  <th className="text-text-muted px-8 py-4 text-center text-[9px] font-black uppercase tracking-widest">
                    Кол-во / Сумма
                  </th>
                  <th className="text-text-muted px-8 py-4 text-right text-[9px] font-black uppercase tracking-widest">
                    Логистическая волна
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border-subtle divide-y">
                {b2bCart.map((item) => (
                  <tr
                    key={`${item.id}-${item.selectedSize}`}
                    className="hover:bg-bg-surface2/80 group/tr transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-bg-surface2 border-border-default h-10 w-11 overflow-hidden rounded-xl border shadow-sm transition-transform group-hover/tr:scale-105">
                          <img
                            src={item.images?.[0]?.url || (item as any).image || '/placeholder.jpg'}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-text-primary text-[11px] font-black uppercase tracking-tighter">
                            {item.name}
                          </p>
                          <p className="text-text-muted flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest">
                            <span>SKU: {item.sku || 'N/A'}</span>
                            <span className="bg-border-default h-1 w-1 rounded-full" />
                            <span>{item.brand}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge
                        variant="outline"
                        className="border-border-subtle text-text-secondary bg-white text-[8px] font-black uppercase tracking-widest"
                      >
                        {item.category}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-text-primary mb-1 text-[10px] font-black uppercase tracking-widest">
                          {item.selectedSize}
                        </span>
                        <div className="flex gap-1">
                          <div
                            className="border-border-default h-2 w-2 rounded-full border"
                            style={{ backgroundColor: item.color || '#ccc' }}
                          />
                          <span className="text-text-muted text-[7px] font-bold uppercase tracking-widest">
                            {item.color}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="space-y-1">
                        <p className="text-text-primary text-[11px] font-black">
                          {item.quantity} шт.
                        </p>
                        <p className="text-accent-primary text-[9px] font-bold">
                          {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="bg-accent-primary/10 border-accent-primary/20 inline-flex items-center gap-3 rounded-xl border px-4 py-2 shadow-sm">
                        <div className="bg-accent-primary h-1.5 w-1.5 animate-pulse rounded-full" />
                        <span className="text-accent-primary text-[9px] font-black uppercase tracking-widest">
                          {selectedWave}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-text-muted flex flex-col items-center justify-center py-10">
              <ShoppingBag className="mb-4 h-12 w-12 opacity-10" />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Нет товаров для планирования
              </p>
              <p className="mt-1 text-[9px] font-medium uppercase">
                Добавьте товары в витрине, чтобы начать работу в матрице
              </p>
            </div>
          )}
        </div>

        <div className="bg-bg-surface2/80 border-border-subtle flex items-center justify-between border-t p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-text-secondary text-[8px] font-black uppercase tracking-widest">
                Inventory Sync: OK
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-accent-primary h-2 w-2 rounded-full" />
              <span className="text-text-secondary text-[8px] font-black uppercase tracking-widest">
                Margin Factor: 2.8x
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-border-default text-text-secondary hover:bg-bg-surface2 flex h-10 items-center gap-2 rounded-xl bg-white px-6 text-[9px] font-black uppercase tracking-widest transition-all"
            >
              <Plus className="h-3.5 w-3.5" /> Добавить комментарий
            </Button>
            <Button className="bg-text-primary flex h-10 items-center gap-2 rounded-xl px-8 text-[9px] font-black uppercase tracking-widest text-white shadow-md shadow-xl transition-all hover:bg-black">
              Открыть в Личном кабинете <FileText className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
