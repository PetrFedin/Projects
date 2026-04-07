"use client";

import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Truck, Factory, Building2 } from "lucide-react";
import { interPartnerInvoices } from "../_fixtures/finance-data";

export function InterPartnerInvoices() {
  return (
    <Card className="rounded-xl border-slate-100 shadow-xl bg-white overflow-hidden animate-in fade-in duration-700">
      <CardHeader className="p-3 border-b border-slate-50 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-base font-black uppercase tracking-tight text-slate-900">Сквозные счета (Inter-Partner Invoicing)</CardTitle>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Учет взаиморасчетов между партнерами внутри платформы</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-black uppercase text-[9px] tracking-widest h-10 px-4">Сверка с банком</Button>
          <Button className="bg-indigo-600 text-white rounded-xl font-black uppercase text-[9px] tracking-widest h-10 px-6">Выставить счет</Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100 hover:bg-transparent h-12">
              <TableHead className="pl-10 text-[9px] font-black uppercase tracking-widest text-slate-400">ID Счета</TableHead>
              <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Контрагент</TableHead>
              <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Сумма</TableHead>
              <TableHead className="text-center text-[9px] font-black uppercase tracking-widest text-slate-400">Тип</TableHead>
              <TableHead className="pr-10 text-center text-[9px] font-black uppercase tracking-widest text-slate-400">Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interPartnerInvoices.map((inv) => (
              <TableRow key={inv.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors h-12">
                <TableCell className="pl-10 font-mono text-[10px] font-black text-slate-400">{inv.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                      {inv.partner.includes('Production') ? <Factory className="h-4 w-4" /> : 
                       inv.partner.includes('Logistics') ? <Truck className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-slate-900">{inv.partner}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Дата: {inv.date}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-black text-xs text-slate-900">{inv.amount.toLocaleString('ru-RU')} ₽</TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={cn(
                    "text-[8px] font-black uppercase border-none",
                    inv.type === 'receivable' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"
                  )}>
                    {inv.type === 'receivable' ? 'Входящий' : 'Исходящий'}
                  </Badge>
                </TableCell>
                <TableCell className="pr-10 text-center">
                  <Badge className={cn(
                    "text-[8px] font-black uppercase px-2 py-0.5 border-none",
                    inv.status === 'paid' ? "bg-emerald-500 text-white" : 
                    inv.status === 'pending' ? "bg-amber-500 text-white" : "bg-rose-500 text-white shadow-lg shadow-rose-100 animate-pulse"
                  )}>
                    {inv.status === 'paid' ? 'Оплачен' : inv.status === 'pending' ? 'Ожидает' : 'Просрочен'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
