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
  ShoppingBag
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
  toast
}) => {
  const { b2bCart } = useB2BState();
  const totalItems = useMemo(() => b2bCart.reduce((sum, item) => sum + item.quantity, 0), [b2bCart]);

  const planningConfig = {
    brand: {
      title: "Production Planning AI",
      desc: "Оптимизация производственных циклов и загрузки мощностей",
      badge: "Production AI",
      stats: [
        { label: "Цех Пошива", key: "outerwear", color: "bg-indigo-600" },
        { label: "Раскройный Цех", key: "jersey", color: "bg-emerald-500" },
        { label: "ОТК & Упаковка", key: "accessories", color: "bg-amber-500" },
      ]
    },
    b2b: {
      title: "Retail Planning AI",
      desc: "Прогноз продаж и балансировка ассортиментной матрицы",
      badge: "Retail AI",
      stats: [
        { label: "Верхняя одежда", key: "outerwear", color: "bg-slate-900" },
        { label: "Трикотаж & Топы", key: "jersey", color: "bg-slate-500" },
        { label: "Аксессуары", key: "accessories", color: "bg-slate-300" },
      ]
    },
    distributor: {
      title: "Supply Chain AI",
      desc: "Консолидация партий для региональных хабов",
      badge: "Logistics AI",
      stats: [
        { label: "Центральный Хаб", key: "outerwear", color: "bg-orange-500" },
        { label: "Регион Восток", key: "jersey", color: "bg-cyan-500" },
        { label: "Транзит", key: "accessories", color: "bg-rose-500" },
      ]
    }
  };

  const currentConfig = planningConfig[viewRole as keyof typeof planningConfig] || planningConfig.b2b;

  const [selectedWave, setSelectedWave] = React.useState<string>("Fast Track");

  const stats = useMemo(() => {
    return currentConfig.stats.map(cat => {
      const catItems = b2bCart.filter(item => {
        const category = item.category?.toLowerCase() || '';
        if (cat.key === 'outerwear') return category.includes('курт') || category.includes('пальт') || category.includes('outerwear');
        if (cat.key === 'jersey') return category.includes('трикот') || category.includes('футб') || category.includes('jersey') || category.includes('топ');
        if (cat.key === 'accessories') return category.includes('аксесс') || category.includes('сумк') || category.includes('accessories');
        return false;
      });
      const count = catItems.reduce((sum, item) => sum + item.quantity, 0);
      const percentage = totalItems > 0 ? Math.round((count / totalItems) * 100) : (viewRole === 'brand' ? 65 : 0);
      
      let status = "Balanced";
      let color = "text-emerald-500";
      
      if (viewRole === 'brand') {
        status = percentage > 80 ? "Critical Load" : "Optimal";
        color = percentage > 80 ? "text-rose-500" : "text-emerald-500";
      } else {
        if (percentage > 50) { status = "Overbought"; color = "text-rose-500"; }
        else if (percentage < 15) { status = "Low Stock"; color = "text-amber-500"; }
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
      className="flex-shrink-0 w-full min-h-[600px] space-y-6 pb-10 px-4"
    >
      {/* Financial & Budget Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { label: "Общий бюджет", value: "12,500,000 ₽", sub: "Лимит на сезон FW26", icon: Database, color: "text-slate-900" },
          { label: "Выбрано в заказ", value: `${b2bCart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString('ru-RU')} ₽`, sub: `${b2bCart.length} артикулов`, icon: Check, color: "text-indigo-600" },
          { label: "Остаток лимита", value: `${(12500000 - b2bCart.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toLocaleString('ru-RU')} ₽`, sub: "Доступно для закупки", icon: TrendingUp, color: "text-emerald-500" },
          { label: "Средняя маржа", value: "64.2%", sub: "Прогноз прибыльности", icon: BarChart3, color: "text-indigo-600" },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-indigo-200 transition-all">
            <div className="flex justify-between items-start">
              <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                <item.icon className={cn("h-4 w-4", item.color)} />
              </div>
              <Badge className="bg-slate-50 text-slate-400 border-none text-[7px] font-black tracking-widest uppercase">Live</Badge>
            </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{item.label}</p>
                        <h4 className={cn("text-base font-black tracking-tighter", item.color)}>{item.value}</h4>
                        <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-3 w-3 text-indigo-600" />
                {currentConfig.title}
              </h3>
              <p className="text-[9px] text-slate-400 font-medium">{currentConfig.desc}</p>
            </div>
            <Badge className="bg-indigo-600 text-white border-none text-[8px] font-black px-2 py-0.5 uppercase tracking-widest animate-pulse">
              {currentConfig.badge}
            </Badge>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {stats.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[8px] font-black uppercase text-slate-500 tracking-tighter">{item.label}</span>
                    <span className="text-[9px] font-black text-slate-900">{item.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn("h-full rounded-full", item.color)}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={cn("h-1 w-1 rounded-full", item.gapColor.replace('text', 'bg'))} />
                    <span className={cn("text-[7px] font-black uppercase tracking-tighter", item.gapColor)}>{item.gap}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-start gap-3 shadow-sm">
              <div className="h-8 w-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <AlertCircle className="h-4 w-4 text-amber-600" />
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase text-slate-900">
                  {viewRole === 'brand' ? 'Production Insight' : viewRole === 'distributor' ? 'Logistics Insight' : 'AI Recommendation'}
                </p>
                <p className="text-[9px] text-slate-500 leading-relaxed font-medium">
                  {viewRole === 'brand' ? "Внимание: Нагрузка на цех пошива приближается к лимиту. Рекомендуем открыть дополнительную смену для Drop 2." : 
                   viewRole === 'distributor' ? "Возможна консолидация заказов из региона 'Восток' для экономии 15% на фрахте." :
                   totalItems === 0 ? "Начните добавлять товары в заказ для получения AI-рекомендаций по ассортименту." : 
                   stats.find(s => s.gap === "Low Stock") ? `Внимание: категория "${stats.find(s => s.gap === "Low Stock")?.label}" представлена слабо. Добавьте аксессуары для баланса коллекции.` :
                   "Коллекция сбалансирована. Рекомендуем обратить внимание на новые поступления в категории 'Обувь'."}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-3xl p-4 shadow-2xl relative overflow-hidden group/size-curve">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
          <div className="relative z-10 space-y-5">
            <div className="space-y-1">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white">
                {viewRole === 'brand' ? 'Capacity Curves' : 'Delivery Waves'}
              </h3>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                {viewRole === 'brand' ? 'Резерв мощностей' : 'График отгрузок'}
              </p>
            </div>
            
            <div className="space-y-2">
              {[
                { name: viewRole === 'brand' ? "Full Capacity" : "Fast Track", desc: viewRole === 'brand' ? "Цех + Аутсорс" : "Air Freight" },
                { name: viewRole === 'brand' ? "Эко-режим" : "Стандарт", desc: viewRole === 'brand' ? "Только основной цех" : "Море/Авто" },
                { name: viewRole === 'brand' ? "Sample Only" : "Bulk Wave", desc: viewRole === 'brand' ? "Экспериментальный цех" : "Consolidated" },
              ].map((curve) => (
                <button 
                  key={curve.name}
                  onClick={() => setSelectedWave(curve.name)}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border transition-all text-left flex items-center justify-between group/c",
                    selectedWave === curve.name ? "bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-500/20" : "bg-slate-800 border-slate-700 hover:border-slate-500"
                  )}
                >
                  <div className="space-y-0.5">
                    <p className={cn("text-[9px] font-black uppercase tracking-widest", selectedWave === curve.name ? "text-white" : "text-slate-300")}>{curve.name}</p>
                    <p className="text-[7px] text-slate-500 font-bold uppercase tracking-widest">{curve.desc}</p>
                  </div>
                  <div className={cn(
                    "h-5 w-5 rounded-lg flex items-center justify-center transition-colors",
                    selectedWave === curve.name ? "bg-white/20 text-white" : "bg-slate-700 text-slate-500 group-hover/c:text-slate-300"
                  )}>
                    {selectedWave === curve.name ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  </div>
                </button>
              ))}
            </div>
            
            <Button 
              onClick={() => toast({ title: "Переход в кабинет", description: "Operational parameters updated in Cabinet for Order #8821." })}
              className="w-full bg-white text-slate-900 hover:bg-slate-100 transition-all rounded-xl font-black uppercase text-[9px] tracking-widest h-10 shadow-xl"
            >
              Открыть в заказе #8821
            </Button>
          </div>
        </div>
      </div>
      
      {/* Detailed SKU Planning Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Advanced SKU Matrix Planner</h3>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Детальное распределение артикулов, размеров и логистических волн</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Badge className="bg-emerald-100 text-emerald-600 border-none text-[8px] font-black px-3 py-1 uppercase tracking-widest">
               AI Verified
             </Badge>
             <Badge className="bg-slate-900 text-white border-none text-[8px] font-black px-3 py-1 uppercase tracking-widest">
               {b2bCart.length} SKU
             </Badge>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {b2bCart.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Артикул / Модель</th>
                  <th className="px-8 py-4 text-left text-[9px] font-black uppercase tracking-widest text-slate-400">Категория</th>
                  <th className="px-8 py-4 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">Спецификация</th>
                  <th className="px-8 py-4 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">Кол-во / Сумма</th>
                  <th className="px-8 py-4 text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Логистическая волна</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {b2bCart.map((item) => (
                  <tr key={`${item.id}-${item.selectedSize}`} className="hover:bg-slate-50/80 transition-all group/tr">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-11 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm group-hover/tr:scale-105 transition-transform">
                          <img 
                            src={item.images?.[0]?.url || (item as any).image || '/placeholder.jpg'} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">{item.name}</p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                            <span>SKU: {item.sku || 'N/A'}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span>{item.brand}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge variant="outline" className="text-[8px] border-slate-100 bg-white text-slate-500 font-black uppercase tracking-widest">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">{item.selectedSize}</span>
                        <div className="flex gap-1">
                          <div className="h-2 w-2 rounded-full border border-slate-200" style={{ backgroundColor: item.color || '#ccc' }} />
                          <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">{item.color}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="space-y-1">
                        <p className="text-[11px] font-black text-slate-900">{item.quantity} шт.</p>
                        <p className="text-[9px] font-bold text-indigo-600">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100 shadow-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                          {selectedWave}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-10 flex flex-col items-center justify-center text-slate-300">
              <ShoppingBag className="h-12 w-12 opacity-10 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest">Нет товаров для планирования</p>
              <p className="text-[9px] font-medium mt-1 uppercase">Добавьте товары в витрине, чтобы начать работу в матрице</p>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Inventory Sync: OK</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-indigo-500" />
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Margin Factor: 2.8x</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10 px-6 rounded-xl border-slate-200 bg-white text-slate-600 font-black uppercase text-[9px] tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
              <Plus className="h-3.5 w-3.5" /> Добавить комментарий
            </Button>
            <Button className="h-10 px-8 rounded-xl bg-slate-900 text-white font-black uppercase text-[9px] tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-slate-200">
              Открыть в Личном кабинете <FileText className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
