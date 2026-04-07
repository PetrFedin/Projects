'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, FileText, Download } from "lucide-react";
import { cn } from '@/lib/cn';

const transactions = [
    { id: 'tr1', date: '2024-08-01', amount: 1250000, type: 'income', label: 'Оплата PO-001 (Syntha Lab)', status: 'Завершено' },
    { id: 'tr2', date: '2024-08-03', amount: 450000, type: 'expense', label: 'Закупка сырья (Italian Yarns)', status: 'Завершено' },
    { id: 'tr3', date: '2024-08-05', amount: 800000, type: 'income', label: 'Предоплата PO-002 (A.P.C.)', status: 'В обработке' },
];

export default function FactoryFinancePage() {
    const searchParams = useSearchParams();
    const activeRole = (searchParams.get('role') as 'manufacturer' | 'supplier') || 'manufacturer';

    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-base font-black font-headline uppercase tracking-tighter">Финансовая аналитика</h1>
                <p className="text-muted-foreground">Учет доходов, расходов и дебиторской задолженности.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Выручка (тек. месяц)</p>
                            <h4 className="text-sm font-black text-slate-900 tracking-tighter">2,050,000 ₽</h4>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                            <TrendingDown className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Расходы (тек. месяц)</p>
                            <h4 className="text-sm font-black text-slate-900 tracking-tighter">450,000 ₽</h4>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ожидаемые выплаты</p>
                            <h4 className="text-sm font-black text-slate-900 tracking-tighter">1,200,000 ₽</h4>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-100 rounded-xl shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-black uppercase tracking-tight">История транзакций</CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Последние финансовые операции</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-[10px] font-black uppercase tracking-widest">
                        <Download className="h-3.5 w-3.5 mr-2" /> Экспорт (CSV)
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/30 hover:bg-slate-50/30">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8">Назначение</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Дата</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Сумма</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Статус</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-8">Документы</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((tr) => (
                                <TableRow key={tr.id} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="pl-8 py-4">
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{tr.label}</p>
                                    </TableCell>
                                    <TableCell className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                        {tr.date}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            {tr.type === 'income' ? <ArrowUpRight className="h-3 w-3 text-emerald-500" /> : <TrendingDown className="h-3 w-3 text-rose-500" />}
                                            <span className={cn("text-xs font-black", tr.type === 'income' ? "text-emerald-600" : "text-rose-600")}>
                                                {tr.type === 'income' ? '+' : '-'}{tr.amount.toLocaleString('ru-RU')} ₽
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn(
                                            "text-[8px] font-black uppercase border-none px-2 py-0.5",
                                            tr.status === 'Завершено' ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                                        )}>
                                            {tr.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                                            <FileText className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
