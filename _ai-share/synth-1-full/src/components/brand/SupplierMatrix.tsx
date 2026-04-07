'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";

const RUSSIAN_SUPPLIERS = [
  {
    id: 1,
    name: "Текстиль-Профи (Иваново)",
    category: "Ткани / Трикотаж",
    location: "Иваново, РФ",
    rating: 4.9,
    leadTime: "3-5 дней",
    specialty: "Футер, Кулирная гладь",
    status: "Проверен",
    minOrder: "1 рулон"
  },
  {
    id: 2,
    name: "Фурнитура-Центр",
    category: "Фурнитура",
    location: "Москва, РФ",
    rating: 4.7,
    leadTime: "1-2 дня",
    specialty: "Молнии, Пуговицы",
    status: "VIP Партнер",
    minOrder: "100 шт"
  },
  {
    id: 3,
    name: "YKK Russia",
    category: "Фурнитура",
    location: "Тверь, РФ",
    rating: 5.0,
    leadTime: "7-10 дней",
    specialty: "Премиум молнии",
    status: "Офиц. дилер",
    minOrder: "500 шт"
  },
  {
    id: 4,
    name: "KORTEX (Нити)",
    category: "Нитки",
    location: "СПб, РФ",
    rating: 4.8,
    leadTime: "4 дня",
    specialty: "Армированные нити",
    status: "Проверен",
    minOrder: "1 короб"
  }
];

export function SupplierMatrix() {
  return (
    <Card className="border border-slate-100 shadow-sm rounded-xl bg-white overflow-hidden">
      <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-2 text-slate-900">
            <Building2 className="w-4 h-4 text-indigo-600" />
            Матрица локальных поставщиков (РФ)
          </CardTitle>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Проверенные контрагенты с быстрой логистикой.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg text-slate-400 border-slate-200"><Search className="h-3.5 w-3.5" /></Button>
          <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg text-slate-400 border-slate-200"><Filter className="h-3.5 w-3.5" /></Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {RUSSIAN_SUPPLIERS.map((supplier) => (
          <div key={supplier.id} className="p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-100 hover:shadow-md transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{supplier.name}</h4>
                  <Badge className={cn(
                    "text-[7px] font-black uppercase h-4 px-1.5 border-none",
                    supplier.status === 'Проверен' ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                  )}>
                    {supplier.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5" /> {supplier.location}</span>
                  <span className="flex items-center gap-1 text-indigo-500/70"><Tag className="h-2.5 w-2.5" /> {supplier.category}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-0.5">
                  <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-black text-slate-900">{supplier.rating}</span>
                </div>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Min: {supplier.minOrder}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-50">
              <div className="space-y-0.5">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Срок</p>
                <p className="text-[9px] font-bold text-slate-700 flex items-center gap-1.5"><Clock className="h-2.5 w-2.5 text-indigo-400" /> {supplier.leadTime}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Специализация</p>
                <p className="text-[9px] font-bold text-slate-700 truncate">{supplier.specialty}</p>
              </div>
              <div className="flex justify-end items-end">
                <Button variant="ghost" className="h-6 px-2 text-[8px] font-black uppercase text-indigo-600 hover:bg-indigo-50 rounded-lg gap-1 transition-all">
                  Прайс-лист <ArrowUpRight className="h-2.5 w-2.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        <Button className="w-full h-9 mt-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg transition-all gap-2">
          <Globe className="h-3.5 w-3.5" /> Поиск по всей базе (РФ / Турция / Китай)
        </Button>
      </CardContent>
    </Card>
  );
}
