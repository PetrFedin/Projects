"use client";

import { Package, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { inventoryStats } from "../_fixtures/finance-data";

export function InventoryValuation() {
  return (
    <div className="space-y-4 animate-in fade-in duration-700">
      <Card className="rounded-xl border-slate-100 shadow-xl bg-white overflow-hidden">
        <CardHeader className="p-3 border-b border-slate-50 flex flex-row justify-between items-center">
          <div>
            <CardTitle className="text-base font-black uppercase tracking-tight text-slate-900">Stock Asset Control</CardTitle>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Учет товарных остатков как финансового обеспечения</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl font-black uppercase text-[9px] tracking-widest h-10 px-6">Сверка стока</Button>
            <Button className="bg-indigo-600 text-white rounded-xl font-black uppercase text-[9px] tracking-widest h-10 px-6 shadow-lg">Оценить ликвидность</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 hover:bg-transparent h-12">
                <TableHead className="pl-10 text-[9px] font-black uppercase tracking-widest text-slate-400">Категория актива</TableHead>
                <TableHead className="text-center text-[9px] font-black uppercase tracking-widest text-slate-400">Единиц</TableHead>
                <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Оценочная стоимость</TableHead>
                <TableHead className="text-center text-[9px] font-black uppercase tracking-widest text-slate-400">Ликвидность</TableHead>
                <TableHead className="pr-10 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">Залог / Обеспечение</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryStats.map((stat, i) => (
                <TableRow key={i} className="border-slate-50 hover:bg-slate-50/30 transition-colors h-12">
                  <TableCell className="pl-10">
                    <p className="text-xs font-black uppercase text-slate-900">{stat.category}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-xs font-bold text-slate-600">{stat.items}</span>
                  </TableCell>
                  <TableCell className="text-right font-black text-xs text-slate-900">{stat.value.toLocaleString('ru-RU')} ₽</TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "text-[8px] font-black uppercase px-2 py-0.5 border-none",
                      stat.liquidity === 'high' ? "bg-emerald-500 text-white" : 
                      stat.liquidity === 'medium' ? "bg-amber-500 text-white" : "bg-slate-400 text-white"
                    )}>
                      {stat.liquidity}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-10 text-center">
                    {stat.collateral ? (
                      <div className="flex items-center justify-center gap-2 text-indigo-600">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[8px] font-black uppercase">Доступно</span>
                      </div>
                    ) : (
                      <span className="text-[8px] font-black uppercase text-slate-300">Недоступно</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="rounded-xl border-none shadow-xl bg-slate-900 text-white p-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">Финансовый потенциал стока</h4>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-white/40 uppercase">Кредитный лимит под залог товара</p>
                <p className="text-sm font-black tabular-nums">9,250,000 ₽</p>
              </div>
              <Button size="sm" className="bg-white text-black hover:bg-indigo-50 rounded-xl font-black uppercase text-[8px] tracking-widest h-8 px-4">Получить предложение</Button>
            </div>
            <Separator className="bg-white/5" />
            <p className="text-[10px] font-medium text-white/40 leading-relaxed">
              *Расчет произведен на основе LTV 50% от оценочной стоимости категории "Готовая продукция" с учетом коэффициента ликвидности.
            </p>
          </div>
        </Card>
        <Card className="rounded-xl border-slate-100 shadow-sm bg-white p-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Оборачиваемость запасов</h4>
          <div className="flex items-center gap-3">
            <div className="h-24 w-24 rounded-full border-8 border-indigo-600 border-t-slate-100 flex items-center justify-center">
              <span className="text-base font-black">42</span>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-black uppercase text-slate-900">дня — средний цикл</p>
              <p className="text-[9px] font-medium text-slate-400 leading-relaxed">
                Ваш текущий цикл оборачиваемости на 12% быстрее среднего по рынку в категории Contemporary.
              </p>
              <div className="flex items-center text-emerald-600 text-[9px] font-black">
                <Package className="h-3 w-3 mr-1" /> Оптимально
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
