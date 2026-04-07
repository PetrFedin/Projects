'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { SupplierCollabHub } from '@/components/brand/supplier-collab-hub';
import MaterialReservations from '@/components/brand/supply-chain/material-reservations';
import { cn } from '@/lib/utils';
const materials = [
  { id: 'mat1', name: 'Кашемир (смесь)', sku: 'MAT-CASH-01', type: 'Ткань', unit: 'м', stock: 150.5, reserved: 50, cost: 3500, supplier: 'Italian Yarns', status: 'В наличии' },
  { id: 'mat2', name: 'Пуговицы перламутровые', sku: 'BTN-PEARL-15', type: 'Фурнитура', unit: 'шт', stock: 2500, reserved: 800, cost: 50, supplier: 'Button Labs', status: 'В наличии' },
  { id: 'mat3', name: 'Органический хлопок', sku: 'MAT-COT-05', type: 'Ткань', unit: 'м', stock: 320, reserved: 0, cost: 1200, supplier: 'EcoFabrics', status: 'Заказано' },
  { id: 'mat4', name: 'Молния YKK #5', sku: 'ZIP-YKK-5N', type: 'Фурнитура', unit: 'шт', stock: 800, reserved: 650, cost: 80, supplier: 'YKK Group', status: 'В наличии' },
  { id: 'mat5', name: 'Шерсть мериноса', sku: 'MAT-MERINO-02', type: 'Ткань', unit: 'м', stock: 0, reserved: 0, cost: 4200, supplier: 'Woolmark', status: 'Нет в наличии' },
];

export default function MaterialsPage() {
    return (
        <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-end md:items-center gap-3 border-b border-slate-100 pb-4">
                 <Button className="h-9 px-4 rounded-lg font-bold uppercase text-[10px] tracking-wider shadow-md shadow-indigo-100 transition-all">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Добавить материал
                </Button>
            </header>

            <div className="space-y-6">
                <SupplierCollabHub />

                <MaterialReservations brandId="BRAND-XYZ" />

                <Card className="border border-slate-100 shadow-sm rounded-xl overflow-hidden">
                    <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-4">
                         <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700">Материалы на складе</CardTitle>
                            <div className="relative w-full md:max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                <Input placeholder="Поиск по названию или SKU..." className="pl-9 h-8 rounded-lg text-[12px] border-slate-200 bg-white" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[250px]">Название</TableHead>
                                    <TableHead>Тип</TableHead>
                                    <TableHead>На складе</TableHead>
                                    <TableHead>В резерве</TableHead>
                                    <TableHead>Себестоимость</TableHead>
                                    <TableHead>Поставщик</TableHead>
                                    <TableHead>Статус</TableHead>
                                    <TableHead className="text-right">Действия</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {materials.map((item) => (
                                    <TableRow key={item.id} className="group transition-colors">
                                        <TableCell className="py-3">
                                            <div className="space-y-0.5">
                                                <p className="font-bold text-[13px] text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</p>
                                                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">{item.sku}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-100 text-[9px] h-4.5 px-2 font-bold uppercase tracking-wider">
                                                {item.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium text-slate-700">
                                            {item.stock} <span className="text-[10px] text-slate-400 uppercase ml-0.5">{item.unit}</span>
                                        </TableCell>
                                        <TableCell className="text-slate-400 font-medium">
                                            {item.reserved} <span className="text-[10px] opacity-60 uppercase ml-0.5">{item.unit}</span>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-700 text-[12px]">
                                            {item.cost.toLocaleString('ru-RU')} ₽ <span className="text-[9px] text-slate-400 font-normal ml-0.5">/ {item.unit}</span>
                                        </TableCell>
                                        <TableCell className="text-slate-500 font-medium text-[12px]">
                                            {item.supplier}
                                        </TableCell>
                                        <TableCell>
                                            <Badge 
                                                className={cn(
                                                    "h-5 px-2 text-[9px] font-bold uppercase tracking-wider",
                                                    item.status === 'В наличии' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                                                    item.status === 'Заказано' ? "bg-amber-50 text-amber-600 border-amber-100" : 
                                                    "bg-rose-50 text-rose-600 border-rose-100"
                                                )}
                                                variant="outline"
                                            >
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                             <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl border-slate-100">
                                                    <DropdownMenuItem className="text-[11px] font-bold uppercase tracking-wider rounded-lg h-8 cursor-pointer">Редактировать</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-[11px] font-bold uppercase tracking-wider rounded-lg h-8 cursor-pointer">История</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-[11px] font-bold uppercase tracking-wider rounded-lg h-8 cursor-pointer text-indigo-600">Заказать еще</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
