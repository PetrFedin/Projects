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
  Package
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { cn } from '@/lib/cn';

export function ATSInventoryManager() {
  const { inventoryATS, reserveStock } = useB2BState();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeWarehouse, setActiveWarehouse] = useState<'Все' | 'Москва' | 'Дубай' | 'Милан'>('Все');

  const filteredInventory = useMemo(() => {
    return inventoryATS.filter(item => {
      const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const warehouseMap: Record<string, string> = {
        'Moscow': 'Москва',
        'Dubai': 'Дубай',
        'Milan': 'Милан'
      };
      const mappedWarehouse = warehouseMap[item.warehouse] || item.warehouse;
      const matchesWarehouse = activeWarehouse === 'Все' || mappedWarehouse === activeWarehouse;
      return matchesSearch && matchesWarehouse;
    });
  }, [inventoryATS, searchQuery, activeWarehouse]);

  return (
    <div className="space-y-4 p-4 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center">
              <Warehouse className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-slate-200 text-slate-900 uppercase font-black tracking-widest text-[9px]">
              ATS_Inventory_Live
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Свободные Запасы<br/>(ATS)
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md">
            Уровни складских запасов в реальном времени. Управление резервами и мониторинг входящих партий продукции.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-100">
            {['Все', 'Москва', 'Дубай', 'Милан'].map(w => (
              <Button
                key={w}
                onClick={() => setActiveWarehouse(w as any)}
                className={cn(
                  "h-10 px-5 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all",
                  activeWarehouse === w ? "bg-white text-slate-900 shadow-sm" : "bg-transparent text-slate-400 hover:text-slate-600"
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-slate-50 p-4 space-y-2">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Всего единиц</p>
          <p className="text-sm font-black text-slate-900">42,500</p>
          <div className="flex items-center gap-1.5 text-emerald-600">
            <TrendingUp className="h-3 w-3" />
            <span className="text-[10px] font-black">+12% к пр. нед.</span>
          </div>
        </Card>
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-slate-50 p-4 space-y-2">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Активные резервы</p>
          <p className="text-sm font-black text-indigo-600">1,240</p>
          <p className="text-[10px] font-medium text-slate-400 uppercase">На сумму 15.4M ₽</p>
        </Card>
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-slate-50 p-4 space-y-2">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Ожидается поступление</p>
          <p className="text-sm font-black text-slate-900">8,900</p>
          <p className="text-[10px] font-medium text-slate-400 uppercase">В след. 14 дней</p>
        </Card>
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-amber-500 text-white p-4 space-y-2">
          <p className="text-[8px] font-black text-white/60 uppercase tracking-widest">Прогноз дефицита</p>
          <p className="text-sm font-black text-white">12 моделей</p>
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-3 w-3" />
            <span className="text-[10px] font-black uppercase">Требуется пополнение</span>
          </div>
        </Card>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Поиск по SKU или названию..." 
              className="pl-12 h-12 rounded-2xl border-none bg-white shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-400 gap-2">
              <History className="h-4 w-4" /> Лог резервов
            </Button>
            <Button className="h-11 bg-slate-900 text-white rounded-xl px-6 font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg">
              <Plus className="h-4 w-4" /> Массовый резерв
            </Button>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white">
              <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Детали модели</th>
              <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Склад</th>
              <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Доступно</th>
              <th className="px-8 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">В резерве</th>
              <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">След. поставка</th>
              <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.sku} className="group hover:bg-slate-50/50 transition-all duration-300">
                <td className="px-8 py-6 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                      <img src={`https://placehold.co/100x100/f1f5f9/94a3b8?text=${item.sku.split('-')[0]}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.productName}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <Warehouse className="h-3.5 w-3.5 text-slate-300" />
                    <span className="text-[10px] font-black text-slate-900 uppercase">{item.warehouse} Hub</span>
                  </div>
                </td>
                <td className="px-8 py-6 border-b border-slate-50 text-center">
                  <Badge className={cn(
                    "text-sm font-black border-none px-4 py-1.5",
                    item.available > 100 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {item.available} ед.
                  </Badge>
                </td>
                <td className="px-8 py-6 border-b border-slate-50 text-center">
                  <p className="text-sm font-black text-slate-400">{item.reserved}</p>
                </td>
                <td className="px-8 py-6 border-b border-slate-50">
                  {item.incoming.length > 0 ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-indigo-600">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-black uppercase">{item.incoming[0].date}</span>
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Qty: +{item.incoming[0].quantity}</p>
                    </div>
                  ) : (
                    <span className="text-[10px] font-black text-slate-300 uppercase">None Scheduled</span>
                  )}
                </td>
                <td className="px-8 py-6 border-b border-slate-50 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      onClick={() => reserveStock(item.sku, 1, 'retailer-1')}
                      className="h-10 px-5 rounded-xl bg-slate-100 text-slate-900 font-black uppercase text-[9px] tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-slate-900 text-white p-4 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Truck className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-tight">Здоровье цепочки поставок</h4>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/40 uppercase">Uptime производства</span>
              <span className="text-[10px] font-black text-emerald-400">98.2%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[98%]" />
            </div>
          </div>
        </Card>

        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-white p-4 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Авто-истечение резерва</h4>
          </div>
          <p className="text-[10px] font-medium text-slate-500 leading-relaxed">
            Все ручные резервы истекают через 24 часа неактивности. Автоматические уведомления будут отправлены региональному менеджеру.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Активный мониторинг</span>
          </div>
        </Card>

        <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-white p-4 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
              <Package className="h-5 w-5 text-slate-900" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">Экспорт манифеста</h4>
          </div>
          <Button className="w-full h-12 rounded-xl bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest gap-2">
            Создать CSV манифест <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="w-full h-10 rounded-xl font-black uppercase text-[9px] tracking-widest gap-2">
            Документация API Webhook <ArrowRight className="h-3 w-3" />
          </Button>
        </Card>
      </div>
    </div>
  );
}
