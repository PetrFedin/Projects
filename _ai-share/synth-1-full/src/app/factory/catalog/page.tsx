'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, PlusCircle, Search, Edit3, Trash2, Globe, Sparkles } from "lucide-react";
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';

const materials = [
    { id: 'm1', name: 'Кашемир 100%', category: 'Ткань', type: 'Натуральная', origin: 'Италия', price: '4500 ₽/м', status: 'Active' },
    { id: 'm2', name: 'Шелк Малбери', category: 'Ткань', type: 'Люкс', origin: 'Китай', price: '3200 ₽/м', status: 'Active' },
    { id: 'm3', name: 'Органик Хлопок', category: 'Ткань', type: 'Эко', origin: 'Турция', price: '1100 ₽/м', status: 'Review' },
];

export default function SupplierCatalogPage() {
    return (
        <div className="space-y-4">
            <header className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Package className="h-5 w-5 text-emerald-600" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">B2B Material Catalog</span>
                    </div>
                    <h1 className="text-base font-black font-headline uppercase tracking-tighter">Каталог сырья</h1>
                    <p className="text-muted-foreground text-sm font-medium">Управляйте ассортиментом материалов, доступных для закупки брендами.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl border-slate-200 text-[10px] font-black uppercase tracking-widest">
                        <Globe className="h-3.5 w-3.5 mr-2" /> Опубликовать в MP
                    </Button>
                    <Button className="rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                        <PlusCircle className="h-3.5 w-3.5 mr-2" /> Добавить позицию
                    </Button>
                </div>
            </header>

            <Card className="border-slate-100 rounded-xl shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Поиск по каталогу..." className="pl-10 h-11 rounded-xl bg-white border-slate-200" />
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                            {['Все', 'Ткани', 'Фурнитура', 'Нити', 'Упаковка'].map((filter, i) => (
                                <button key={i} className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    i === 0 ? "bg-slate-900 text-white" : "bg-white border border-slate-100 text-slate-400 hover:text-slate-600"
                                )}>
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/30 hover:bg-slate-50/30">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest pl-8 py-4">Материал</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Тип / Группа</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Происхождение</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Базовая цена</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest">Статус</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-8">Действия</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {materials.map((mat) => (
                                <TableRow key={mat.id} className="hover:bg-slate-50 transition-colors group">
                                    <TableCell className="pl-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                                                <Sparkles className="h-5 w-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{mat.name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {mat.id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-100 text-slate-500">{mat.category}</Badge>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{mat.type}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{mat.origin}</TableCell>
                                    <TableCell className="text-xs font-black text-slate-900">{mat.price}</TableCell>
                                    <TableCell>
                                        <Badge className={cn(
                                            "text-[8px] font-black uppercase border-none px-2 py-0.5",
                                            mat.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                        )}>
                                            {mat.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                                                <Edit3 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-600">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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
