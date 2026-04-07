'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Warehouse, Search, MoveRight, AlertTriangle, CheckCircle2, History } from "lucide-react";
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';

const inventory = [
    { id: 'i1', name: 'Кашемир (Black)', stock: '120м', reserved: '45м', available: '75м', health: 'Normal' },
    { id: 'i2', name: 'Молнии YKK #5', stock: '2500 шт', reserved: '800 шт', available: '1700 шт', health: 'Normal' },
    { id: 'i3', name: 'Шелк (Natural)', stock: '40м', reserved: '35м', available: '5м', health: 'Critical' },
];

export default function SupplierInventoryPage() {
    return (
        <div className="space-y-4">
            <header className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Warehouse className="h-5 w-5 text-indigo-600" />
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Global Warehouse Sync</span>
                    </div>
                    <h1 className="text-base font-black font-headline uppercase tracking-tighter">Складские остатки</h1>
                    <p className="text-muted-foreground text-sm font-medium">Контроль наличия, резервов и автоматизация пополнения.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl border-slate-200 text-[10px] font-black uppercase tracking-widest">
                        <History className="h-3.5 w-3.5 mr-2" /> История движений
                    </Button>
                    <Button className="rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                        <MoveRight className="h-3.5 w-3.5 mr-2" /> Перемещение
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Товаров в наличии</p>
                            <h4 className="text-sm font-black text-slate-900 tracking-tighter">128 SKU</h4>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Критический остаток</p>
                            <h4 className="text-sm font-black text-slate-900 tracking-tighter">12 позиций</h4>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-100 rounded-xl shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Поиск по складу..." className="pl-10 h-11 rounded-xl bg-white border-slate-200" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/30 hover:bg-slate-50/30">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8 py-4">Позиция</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Общий запас</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">В резерве</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Доступно</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Статус</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-8">Действие</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventory.map((item) => (
                                <TableRow key={item.id} className="hover:bg-slate-50 transition-colors group">
                                    <TableCell className="pl-8 py-6">
                                        <div>
                                            <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{item.name}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {item.id}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs font-black text-slate-900">{item.stock}</TableCell>
                                    <TableCell className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.reserved}</TableCell>
                                    <TableCell>
                                        <span className={cn("text-xs font-black", item.health === 'Critical' ? "text-rose-600" : "text-emerald-600")}>
                                            {item.available}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={cn(
                                            "text-[8px] font-black uppercase border-none px-2 py-0.5",
                                            item.health === 'Normal' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                        )}>
                                            {item.health}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <Button size="sm" variant="outline" className="rounded-lg h-8 text-[8px] font-black uppercase border-slate-200">
                                            Пополнить
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
