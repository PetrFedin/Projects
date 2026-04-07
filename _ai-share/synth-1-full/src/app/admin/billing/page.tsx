
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, CheckCircle, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const billingHistory = [
  { id: 'inv_124', member: 'Магазин Podium', role: 'shop', amount: '150 000 ₽', date: '2026-02-05', status: 'Оплачен', type: 'subscription' },
  { id: 'inv_123', member: 'Бренд Syntha', role: 'brand', amount: '425 000 ₽', date: '2026-02-04', status: 'Оплачен', type: 'commission' },
  { id: 'inv_122', member: 'Дистрибьютор Hub-Central', role: 'distributor', amount: '85 000 ₽', date: '2026-02-03', status: 'В ожидании', type: 'promo' },
  { id: 'inv_121', member: 'Фабрика ModaTech', role: 'manufacturer', amount: '12 500 ₽', date: '2026-02-01', status: 'Оплачен', type: 'subscription' },
  { id: 'inv_120', member: 'Бренд Nordic Wool', role: 'brand', amount: '35 000 ₽', date: '2026-01-30', status: 'Оплачен', type: 'ads' },
]

const roleConfig = {
    brand: { label: 'Бренд', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    manufacturer: { label: 'Производство', color: 'bg-orange-50 text-orange-600 border-orange-100' },
    supplier: { label: 'Поставщик', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    distributor: { label: 'Дистрибьютор', color: 'bg-blue-50 text-blue-600 border-blue-100' },
    shop: { label: 'Магазин', color: 'bg-rose-50 text-rose-600 border-rose-100' },
};

export default function BillingPage() {

    const getStatusVariant = (status: string) => {
        switch(status) {
            case 'Оплачен': return <CheckCircle className="h-3 w-3 text-emerald-500" />;
            case 'В ожидании': return <Clock className="h-3 w-3 text-amber-500" />;
            default: return null;
        }
    }

    return (
        <div className="space-y-4">
             <header className="border-b pb-4">
                <h1 className="text-base font-black font-headline uppercase tracking-tighter">Финансовый клиринг OS</h1>
                <p className="text-muted-foreground font-medium">Контроль взаиморасчетов, комиссий и подписок всей экосистемы.</p>
            </header>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Card className="border-slate-100 shadow-xl shadow-slate-200/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase text-slate-400">GMV Экосистемы</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-black tracking-tight text-slate-900">84.4 млн ₽</div>
                        <p className="text-[10px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                            <span className="text-emerald-500">▲</span> +12% к прошлому месяцу
                        </p>
                    </CardContent>
                </Card>
                 <Card className="border-slate-100 shadow-xl shadow-slate-200/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase text-slate-400">Комиссионный доход</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-black tracking-tight text-indigo-600">4.2 млн ₽</div>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Чистая прибыль OS</p>
                    </CardContent>
                </Card>
                 <Card className="border-slate-100 shadow-xl shadow-slate-200/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase text-slate-400">Подписки (MRR)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-black tracking-tight text-slate-900">1.8 млн ₽</div>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">1,240 активных брендов</p>
                    </CardContent>
                </Card>
                 <Card className="border-slate-100 shadow-xl shadow-slate-200/20 bg-rose-50 border-rose-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase text-rose-400">Дебиторская задолж.</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-black tracking-tight text-rose-600">350 000 ₽</div>
                        <p className="text-[10px] font-bold text-rose-400 mt-1 uppercase tracking-wider">12 просроченных счетов</p>
                    </CardContent>
                </Card>
             </div>

             <Card className="border-slate-100 shadow-xl shadow-slate-200/20">
                <CardHeader>
                    <CardTitle className="text-sm font-black uppercase tracking-tight">Реестр глобальных транзакций</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-slate-100">
                                <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">ID / Дата</TableHead>
                                <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Участник / Роль</TableHead>
                                <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Тип платежа</TableHead>
                                <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Сумма</TableHead>
                                <TableHead className="text-[9px] font-black uppercase tracking-widest text-slate-400">Статус</TableHead>
                                <TableHead className="text-right text-[9px] font-black uppercase tracking-widest text-slate-400">Действие</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {billingHistory.map(item => {
                                const role = roleConfig[item.role as keyof typeof roleConfig] || { label: 'Система', color: 'bg-slate-100' };
                                return (
                                <TableRow key={item.id} className="border-slate-50 group/row hover:bg-slate-50/50">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-mono text-[10px] font-bold text-slate-900">{item.id}</span>
                                            <span className="text-[9px] text-slate-400 font-medium">{format(new Date(item.date), 'dd.MM.yyyy')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black uppercase tracking-tight text-slate-900 leading-none mb-1">{item.member}</span>
                                            <Badge variant="outline" className={cn("text-[7px] font-black uppercase px-1 py-0 h-3.5 flex items-center justify-center w-fit", role.color)}>
                                                {role.label}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                                            {item.type === 'subscription' ? 'Подписка' : 
                                             item.type === 'commission' ? 'Комиссия B2B' :
                                             item.type === 'promo' ? 'Продвижение' : 'Реклама'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs font-black text-slate-900 tracking-tight">{item.amount}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "flex w-fit items-center gap-1 border-none text-[8px] font-black uppercase px-2 py-0.5",
                                            item.status === 'Оплачен' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                        )}>
                                            {getStatusVariant(item.status)}
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                     <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg hover:bg-slate-100 transition-colors">
                                            <FileText className="h-3.5 w-3.5 text-slate-400" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
