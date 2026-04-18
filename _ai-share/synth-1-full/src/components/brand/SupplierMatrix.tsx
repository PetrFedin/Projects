'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  MapPin,
  Phone,
  Star,
  Truck,
  Clock,
  ArrowUpRight,
  Filter,
  Search,
  Globe,
  Tag,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const RUSSIAN_SUPPLIERS = [
  {
    id: 1,
    name: 'Текстиль-Профи (Иваново)',
    category: 'Ткани / Трикотаж',
    location: 'Иваново, РФ',
    rating: 4.9,
    leadTime: '3-5 дней',
    specialty: 'Футер, Кулирная гладь',
    status: 'Проверен',
    minOrder: '1 рулон',
  },
  {
    id: 2,
    name: 'Фурнитура-Центр',
    category: 'Фурнитура',
    location: 'Москва, РФ',
    rating: 4.7,
    leadTime: '1-2 дня',
    specialty: 'Молнии, Пуговицы',
    status: 'VIP Партнер',
    minOrder: '100 шт',
  },
  {
    id: 3,
    name: 'YKK Russia',
    category: 'Фурнитура',
    location: 'Тверь, РФ',
    rating: 5.0,
    leadTime: '7-10 дней',
    specialty: 'Премиум молнии',
    status: 'Офиц. дилер',
    minOrder: '500 шт',
  },
  {
    id: 4,
    name: 'KORTEX (Нити)',
    category: 'Нитки',
    location: 'СПб, РФ',
    rating: 4.8,
    leadTime: '4 дня',
    specialty: 'Армированные нити',
    status: 'Проверен',
    minOrder: '1 короб',
  },
];

export function SupplierMatrix() {
  return (
<<<<<<< HEAD
    <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/30 p-4">
        <div className="space-y-0.5">
          <CardTitle className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-900">
            <Building2 className="h-4 w-4 text-indigo-600" />
            Матрица локальных поставщиков (РФ)
          </CardTitle>
          <p className="text-[10px] font-medium uppercase tracking-tight text-slate-400">
=======
    <Card className="border-border-subtle overflow-hidden rounded-xl border bg-white shadow-sm">
      <CardHeader className="border-border-subtle bg-bg-surface2/30 flex flex-row items-center justify-between border-b p-4">
        <div className="space-y-0.5">
          <CardTitle className="text-text-primary flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
            <Building2 className="text-accent-primary h-4 w-4" />
            Матрица локальных поставщиков (РФ)
          </CardTitle>
          <p className="text-text-muted text-[10px] font-medium uppercase tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
            Проверенные контрагенты с быстрой логистикой.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
<<<<<<< HEAD
            className="h-7 w-7 rounded-lg border-slate-200 text-slate-400"
=======
            className="text-text-muted border-border-default h-7 w-7 rounded-lg"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <Search className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
<<<<<<< HEAD
            className="h-7 w-7 rounded-lg border-slate-200 text-slate-400"
=======
            className="text-text-muted border-border-default h-7 w-7 rounded-lg"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <Filter className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {RUSSIAN_SUPPLIERS.map((supplier) => (
          <div
            key={supplier.id}
<<<<<<< HEAD
            className="group cursor-pointer rounded-xl border border-slate-100 bg-white p-3 transition-all hover:border-indigo-100 hover:shadow-md"
=======
            className="border-border-subtle hover:border-accent-primary/20 group cursor-pointer rounded-xl border bg-white p-3 transition-all hover:shadow-md"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <div className="mb-2 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
<<<<<<< HEAD
                  <h4 className="text-[11px] font-bold uppercase tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
=======
                  <h4 className="text-text-primary group-hover:text-accent-primary text-[11px] font-bold uppercase tracking-tight transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                    {supplier.name}
                  </h4>
                  <Badge
                    className={cn(
                      'h-4 border-none px-1.5 text-[7px] font-black uppercase',
                      supplier.status === 'Проверен'
                        ? 'bg-emerald-50 text-emerald-600'
<<<<<<< HEAD
                        : 'bg-indigo-50 text-indigo-600'
=======
                        : 'bg-accent-primary/10 text-accent-primary'
>>>>>>> recover/cabinet-wip-from-stash
                    )}
                  >
                    {supplier.status}
                  </Badge>
                </div>
<<<<<<< HEAD
                <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-2.5 w-2.5" /> {supplier.location}
                  </span>
                  <span className="flex items-center gap-1 text-indigo-500/70">
=======
                <div className="text-text-muted flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-2.5 w-2.5" /> {supplier.location}
                  </span>
                  <span className="text-accent-primary/70 flex items-center gap-1">
>>>>>>> recover/cabinet-wip-from-stash
                    <Tag className="h-2.5 w-2.5" /> {supplier.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
<<<<<<< HEAD
                  <span className="text-[10px] font-black text-slate-900">{supplier.rating}</span>
                </div>
                <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-slate-400">
=======
                  <span className="text-text-primary text-[10px] font-black">
                    {supplier.rating}
                  </span>
                </div>
                <p className="text-text-muted text-[8px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Min: {supplier.minOrder}
                </p>
              </div>
            </div>

<<<<<<< HEAD
            <div className="grid grid-cols-3 gap-2 border-t border-slate-50 pt-2">
              <div className="space-y-0.5">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                  Срок
                </p>
                <p className="flex items-center gap-1.5 text-[9px] font-bold text-slate-700">
                  <Clock className="h-2.5 w-2.5 text-indigo-400" /> {supplier.leadTime}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                  Специализация
                </p>
                <p className="truncate text-[9px] font-bold text-slate-700">{supplier.specialty}</p>
=======
            <div className="border-border-subtle grid grid-cols-3 gap-2 border-t pt-2">
              <div className="space-y-0.5">
                <p className="text-text-muted text-[8px] font-black uppercase tracking-widest">
                  Срок
                </p>
                <p className="text-text-primary flex items-center gap-1.5 text-[9px] font-bold">
                  <Clock className="text-accent-primary h-2.5 w-2.5" /> {supplier.leadTime}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-text-muted text-[8px] font-black uppercase tracking-widest">
                  Специализация
                </p>
                <p className="text-text-primary truncate text-[9px] font-bold">
                  {supplier.specialty}
                </p>
>>>>>>> recover/cabinet-wip-from-stash
              </div>
              <div className="flex items-end justify-end">
                <Button
                  variant="ghost"
<<<<<<< HEAD
                  className="h-6 gap-1 rounded-lg px-2 text-[8px] font-black uppercase text-indigo-600 transition-all hover:bg-indigo-50"
=======
                  className="text-accent-primary hover:bg-accent-primary/10 h-6 gap-1 rounded-lg px-2 text-[8px] font-black uppercase transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  Прайс-лист <ArrowUpRight className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
<<<<<<< HEAD
        <Button className="mt-2 h-9 w-full gap-2 rounded-xl bg-slate-900 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-indigo-600">
=======
        <Button className="bg-text-primary hover:bg-accent-primary mt-2 h-9 w-full gap-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white shadow-lg transition-all">
>>>>>>> recover/cabinet-wip-from-stash
          <Globe className="h-3.5 w-3.5" /> Поиск по всей базе (РФ / Турция / Китай)
        </Button>
      </CardContent>
    </Card>
  );
}
