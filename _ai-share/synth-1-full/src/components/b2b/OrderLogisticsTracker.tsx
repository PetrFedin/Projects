'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  Package, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Box, 
  ChevronRight, 
  Download, 
  AlertCircle,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Zap,
  Printer
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUIState } from '@/providers/ui-state';
import { cn } from '@/lib/cn';

const ORDER_STATUSES = [
  { id: 'confirmed', label: 'Заказ подтвержден', icon: CheckCircle2, color: 'text-emerald-500' },
  { id: 'production', label: 'В производстве', icon: Box, color: 'text-indigo-500' },
  { id: 'qc', label: 'Контроль качества', icon: ShieldCheck, color: 'text-amber-500' },
  { id: 'shipped', label: 'Отправлено', icon: Truck, color: 'text-blue-500' },
  { id: 'delivered', label: 'Доставлено', icon: Package, color: 'text-emerald-600' }
];

export function OrderLogisticsTracker() {
  const { viewRole } = useUIState();
  const { b2bNegotiations } = useB2BState();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const mockOrders = [
    {
      id: 'WH-8241',
      retailer: 'Premium Store HQ',
      brand: 'Syntha Lab',
      status: 'production',
      totalAmount: 1250000,
      units: 120,
      trackingNo: 'SY-7729-XQ',
      createdAt: '2026-02-01',
      eta: '2026-03-15',
      isSplit: true,
      shipments: [
        { id: 'S1', type: 'Available', units: 80, status: 'shipped', eta: '2026-02-20' },
        { id: 'S2', type: 'Backorder', units: 40, status: 'production', eta: '2026-04-10' }
      ]
    },
    {
      id: 'WH-9012',
      retailer: 'Urban Elite',
      brand: 'Syntha Lab',
      status: 'shipped',
      totalAmount: 480000,
      units: 42,
      trackingNo: 'DHL-9921-ZZ',
      createdAt: '2026-01-28',
      eta: '2026-02-14',
      isSplit: false
    }
  ];

  return (
    <div className="space-y-4 p-4 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <Badge variant="outline" className="border-blue-100 text-blue-600 uppercase font-black tracking-widest text-[9px]">
              Logistics_Control_v1.0
            </Badge>
          </div>
          <h2 className="text-sm md:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Жизненный Цикл Заказа
          </h2>
          <p className="text-slate-400 font-medium text-xs max-w-md">
            Отслеживайте оптовые заказы от производства до двери. Мгновенно формируйте коммерческие счета и упаковочные листы.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 rounded-xl border-slate-200 px-6 font-black uppercase text-[10px] tracking-widest gap-2 bg-white">
            <Printer className="h-4 w-4" /> Пакет документов
          </Button>
          <Button className="h-12 bg-slate-900 text-white rounded-xl px-8 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-slate-200">
            Экспорт логистического манифеста
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Order List */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Активные поставки</h3>
          {mockOrders.map((order) => (
            <button
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={cn(
                "w-full text-left p-4 rounded-xl transition-all duration-300 border",
                selectedOrder?.id === order.id 
                  ? "bg-white border-indigo-200 shadow-xl shadow-indigo-100 scale-[1.02]" 
                  : "bg-white/50 border-slate-100 hover:bg-white hover:border-slate-200"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-slate-900 text-white border-none font-black text-[9px] uppercase tracking-widest">
                  #{order.id}
                </Badge>
                <Badge className={cn(
                  "font-black text-[8px] uppercase tracking-widest",
                  order.status === 'production' ? "bg-indigo-50 text-indigo-600" : "bg-blue-50 text-blue-600"
                )}>
                  {order.status === 'production' ? 'В производстве' : 
                   order.status === 'shipped' ? 'Отправлено' : 
                   order.status === 'delivered' ? 'Доставлено' : order.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900 uppercase">{order.retailer}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{order.units} ед.</span>
                  <span className="h-1 w-1 rounded-full bg-slate-200" />
                  <span className="text-[10px] font-black text-slate-900">{order.totalAmount.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span className="text-[9px] font-bold uppercase">Ожид. дата: {order.eta}</span>
                </div>
                <ChevronRight className={cn(
                  "h-4 w-4 transition-all",
                  selectedOrder?.id === order.id ? "text-indigo-600 translate-x-1" : "text-slate-200"
                )} />
              </div>
            </button>
          ))}
        </div>

        {/* Detailed View */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Status Timeline */}
                {selectedOrder.isSplit && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedOrder.shipments.map((s: any) => (
                      <Card key={s.id} className="border-none shadow-lg rounded-3xl bg-white p-4 border-l-4 border-indigo-500">
                        <div className="flex items-center justify-between mb-2">
                           <Badge className="bg-slate-900 text-white text-[7px] font-black uppercase px-1.5 py-0">Поставка {s.id}</Badge>
                           <Badge variant="outline" className="text-[7px] font-black uppercase">{s.type === 'Available' ? 'В наличии' : 'Дозаказ'}</Badge>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 uppercase">{s.units} ед.</h4>
                        <div className="flex items-center justify-between mt-4">
                           <div className="flex items-center gap-2">
                              <div className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                s.status === 'shipped' ? "bg-emerald-500" : "bg-indigo-500"
                              )} />
                              <span className="text-[9px] font-bold text-slate-400 uppercase">
                                {s.status === 'shipped' ? 'Отправлено' : 'В производстве'}
                              </span>
                           </div>
                           <span className="text-[9px] font-black text-slate-900 uppercase">Ожид. дата: {s.eta}</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-3 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Truck className="h-32 w-32" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-12">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">История отслеживания</p>
                      <h3 className="text-sm font-black uppercase tracking-tight text-slate-900">Этапы поставки</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-end">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Номер отслеживания</p>
                        <p className="text-sm font-black text-indigo-600 uppercase tracking-widest">{selectedOrder.trackingNo}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-slate-50">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="relative flex justify-between items-start max-w-4xl mx-auto">
                    {/* Line behind */}
                    <div className="absolute top-4 left-0 right-0 h-[2px] bg-slate-100" />
                    <div 
                      className="absolute top-4 left-0 h-[2px] bg-indigo-500 transition-all duration-1000" 
                      style={{ width: `${(ORDER_STATUSES.findIndex(s => s.id === selectedOrder.status) / (ORDER_STATUSES.length - 1)) * 100}%` }}
                    />

                    {ORDER_STATUSES.map((status, i) => {
                      const Icon = status.icon;
                      const isActive = ORDER_STATUSES.findIndex(s => s.id === selectedOrder.status) >= i;
                      const isCurrent = selectedOrder.status === status.id;

                      return (
                        <div key={status.id} className="relative z-10 flex flex-col items-center gap-3">
                          <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                            isActive ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "bg-white text-slate-200 border-2 border-slate-100",
                            isCurrent && "ring-4 ring-indigo-50"
                          )}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="text-center space-y-1">
                            <p className={cn(
                              "text-[10px] font-black uppercase tracking-tight whitespace-nowrap",
                              isActive ? "text-slate-900" : "text-slate-300"
                            )}>{status.label}</p>
                            {isCurrent && (
                              <Badge className="bg-indigo-100 text-indigo-600 border-none text-[8px] font-black uppercase">Активно</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* Documents & Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-white p-4 space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Документы комплаенса</h4>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                            <FileText className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] font-black text-slate-900 uppercase leading-none">Коммерческий инвойс</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Сформирован 2 дня назад</p>
                          </div>
                        </div>
                        <Download className="h-4 w-4 text-slate-300 group-hover:text-slate-900" />
                      </button>

                      <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                            <Package className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] font-black text-slate-900 uppercase leading-none">Детальный упаковочный лист</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Готов к печати</p>
                          </div>
                        </div>
                        <Download className="h-4 w-4 text-slate-300 group-hover:text-slate-900" />
                      </button>

                      <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                            <MapPin className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] font-black text-slate-900 uppercase leading-none">Таможенный манифест</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Цифровая подача v2</p>
                          </div>
                        </div>
                        <Download className="h-4 w-4 text-slate-300 group-hover:text-slate-900" />
                      </button>
                    </div>
                  </Card>

                  <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-xl bg-indigo-600 text-white p-4 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Zap className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-tight">Логистический советник</h4>
                    </div>
                    <p className="text-[11px] font-medium text-white/80 leading-relaxed">
                      "На основе текущей загруженности портов в Дубае, мы рекомендуем перенаправить эту партию через наш основной хаб в Москве, чтобы сэкономить 48 часов в пути."
                    </p>
                    <div className="pt-2">
                      <Button className="w-full h-12 rounded-xl bg-white text-indigo-600 font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50">
                        Применить стратегию перенаправления
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-black text-white/40 uppercase tracking-widest">
                      <AlertCircle className="h-3 w-3" />
                      Стратегия валидна в течение 12 часов
                    </div>
                  </Card>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30">
                <Truck className="h-20 w-20 text-slate-300" />
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Выберите заказ для просмотра деталей отслеживания</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
