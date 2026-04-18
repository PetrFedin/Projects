'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Search,
  Filter,
  AlertCircle,
  Truck,
  Warehouse,
  Calendar,
  History,
  TrendingUp,
  Download,
  MoreVertical,
  Plus,
  ArrowRight,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { cn } from '@/lib/cn';

export function ATSInventoryManager() {
  const { inventoryATS, reserveStock } = useB2BState();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWarehouse, setActiveWarehouse] = useState<'Все' | 'Москва' | 'Дубай' | 'Милан'>(
    'Все'
  );

  const filteredInventory = useMemo(() => {
    return inventoryATS.filter((item) => {
      const matchesSearch =
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const warehouseMap: Record<string, string> = {
        Moscow: 'Москва',
        Dubai: 'Дубай',
        Milan: 'Милан',
      };
      const mappedWarehouse = warehouseMap[item.warehouse] || item.warehouse;
      const matchesWarehouse = activeWarehouse === 'Все' || mappedWarehouse === activeWarehouse;
      return matchesSearch && matchesWarehouse;
    });
  }, [inventoryATS, searchQuery, activeWarehouse]);

  return (
    <div className="min-h-screen space-y-4 bg-white p-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900">
              <Warehouse className="h-4 w-4 text-white" />
            </div>
            <Badge
              variant="outline"
              className="border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-900"
            >
              ATS_Inventory_Live
            </Badge>
          </div>
          <h2 className="text-sm font-black uppercase leading-none tracking-tighter text-slate-900 md:text-sm">
            Свободные Запасы
            <br />
            (ATS)
          </h2>
          <p className="max-w-md text-xs font-medium text-slate-400">
            Уровни складских запасов в реальном времени. Управление резервами и мониторинг входящих
            партий продукции.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-2xl border border-slate-100 bg-slate-50 p-1">
            {['Все', 'Москва', 'Дубай', 'Милан'].map((w) => (
              <Button
                key={w}
                onClick={() => setActiveWarehouse(w as any)}
                className={cn(
                  'h-10 rounded-xl px-5 text-[9px] font-black uppercase tracking-widest transition-all',
                  activeWarehouse === w
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'bg-transparent text-slate-400 hover:text-slate-600'
                )}
              >
                {w}
              </Button>
            ))}
          </div>
          <Button variant="outline" className="h-12 w-12 rounded-2xl border-slate-100 p-0">
            <Download className="h-4 w-4 text-slate-400" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <Card className="space-y-2 rounded-xl border-none bg-slate-50 p-4 shadow-xl shadow-slate-200/50">
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
            Всего единиц
          </p>
          <p className="text-sm font-black text-slate-900">42,500</p>
          <div className="flex items-center gap-1.5 text-emerald-600">
            <TrendingUp className="h-3 w-3" />
            <span className="text-[10px] font-black">+12% к пр. нед.</span>
          </div>
        </Card>
        <Card className="space-y-2 rounded-xl border-none bg-slate-50 p-4 shadow-xl shadow-slate-200/50">
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
            Активные резервы
          </p>
          <p className="text-sm font-black text-indigo-600">1,240</p>
          <p className="text-[10px] font-medium uppercase text-slate-400">На сумму 15.4M ₽</p>
        </Card>
        <Card className="space-y-2 rounded-xl border-none bg-slate-50 p-4 shadow-xl shadow-slate-200/50">
          <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
            Ожидается поступление
          </p>
          <p className="text-sm font-black text-slate-900">8,900</p>
          <p className="text-[10px] font-medium uppercase text-slate-400">В след. 14 дней</p>
        </Card>
        <Card className="space-y-2 rounded-xl border-none bg-amber-500 p-4 text-white shadow-xl shadow-slate-200/50">
          <p className="text-[8px] font-black uppercase tracking-widest text-white/60">
            Прогноз дефицита
          </p>
          <p className="text-sm font-black text-white">12 моделей</p>
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-3 w-3" />
            <span className="text-[10px] font-black uppercase">Требуется пополнение</span>
          </div>
        </Card>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/50">
        <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/30 p-4">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Поиск по SKU или названию..."
              className="h-12 rounded-2xl border-none bg-white pl-12 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"
            >
              <History className="h-4 w-4" /> Лог резервов
            </Button>
            <Button className="h-11 gap-2 rounded-xl bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
              <Plus className="h-4 w-4" /> Массовый резерв
            </Button>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white">
              <th className="border-b border-slate-50 px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                Детали модели
              </th>
              <th className="border-b border-slate-50 px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                Склад
              </th>
              <th className="border-b border-slate-50 px-8 py-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                Доступно
              </th>
              <th className="border-b border-slate-50 px-8 py-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                В резерве
              </th>
              <th className="border-b border-slate-50 px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                След. поставка
              </th>
              <th className="border-b border-slate-50 px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.sku} className="group transition-all duration-300 hover:bg-slate-50/50">
                <td className="border-b border-slate-50 px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={`https://placehold.co/100x100/f1f5f9/94a3b8?text=${item.sku.split('-')[0]}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black uppercase tracking-tight text-slate-900">
                        {item.productName}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        {item.sku}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="border-b border-slate-50 px-8 py-6">
                  <div className="flex items-center gap-2">
                    <Warehouse className="h-3.5 w-3.5 text-slate-300" />
                    <span className="text-[10px] font-black uppercase text-slate-900">
                      {item.warehouse} Hub
                    </span>
                  </div>
                </td>
                <td className="border-b border-slate-50 px-8 py-6 text-center">
                  <Badge
                    className={cn(
                      'border-none px-4 py-1.5 text-sm font-black',
                      item.available > 100
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    )}
                  >
                    {item.available} ед.
                  </Badge>
                </td>
                <td className="border-b border-slate-50 px-8 py-6 text-center">
                  <p className="text-sm font-black text-slate-400">{item.reserved}</p>
                </td>
                <td className="border-b border-slate-50 px-8 py-6">
                  {item.incoming.length > 0 ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-indigo-600">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-black uppercase">
                          {item.incoming[0].date}
                        </span>
                      </div>
                      <p className="text-[9px] font-bold uppercase text-slate-400">
                        Qty: +{item.incoming[0].quantity}
                      </p>
                    </div>
                  ) : (
                    <span className="text-[10px] font-black uppercase text-slate-300">
                      None Scheduled
                    </span>
                  )}
                </td>
                <td className="border-b border-slate-50 px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      onClick={() => reserveStock(item.sku, 1, 'retailer-1')}
                      className="h-10 rounded-xl bg-slate-100 px-5 text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm transition-all hover:bg-slate-900 hover:text-white"
                    >
                      Быстрый резерв
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Logistics Intelligence Footer */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="space-y-6 rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Truck className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-tight">
              Здоровье цепочки поставок
            </h4>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-white/40">
                Uptime производства
              </span>
              <span className="text-[10px] font-black text-emerald-400">98.2%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[98%] bg-emerald-500" />
            </div>
          </div>
        </Card>

        <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">
              Авто-истечение резерва
            </h4>
          </div>
          <p className="text-[10px] font-medium leading-relaxed text-slate-500">
            Все ручные резервы истекают через 24 часа неактивности. Автоматические уведомления будут
            отправлены региональному менеджеру.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-indigo-600" />
            <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600">
              Активный мониторинг
            </span>
          </div>
        </Card>

        <Card className="space-y-4 rounded-xl border-none bg-white p-4 shadow-xl shadow-slate-200/50">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <Package className="h-5 w-5 text-slate-900" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">
              Экспорт манифеста
            </h4>
          </div>
          <Button className="h-12 w-full gap-2 rounded-xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white">
            Создать CSV манифест <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="h-10 w-full gap-2 rounded-xl text-[9px] font-black uppercase tracking-widest"
          >
            Документация API Webhook <ArrowRight className="h-3 w-3" />
          </Button>
        </Card>
      </div>
    </div>
  );
}
