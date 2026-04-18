'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { SupplierCollabHub } from '@/components/brand/supplier-collab-hub';
import MaterialReservations from '@/components/brand/supply-chain/material-reservations';
import { cn } from '@/lib/utils';
const materials = [
  {
    id: 'mat1',
    name: 'Кашемир (смесь)',
    sku: 'MAT-CASH-01',
    type: 'Ткань',
    unit: 'м',
    stock: 150.5,
    reserved: 50,
    cost: 3500,
    supplier: 'Italian Yarns',
    status: 'В наличии',
  },
  {
    id: 'mat2',
    name: 'Пуговицы перламутровые',
    sku: 'BTN-PEARL-15',
    type: 'Фурнитура',
    unit: 'шт',
    stock: 2500,
    reserved: 800,
    cost: 50,
    supplier: 'Button Labs',
    status: 'В наличии',
  },
  {
    id: 'mat3',
    name: 'Органический хлопок',
    sku: 'MAT-COT-05',
    type: 'Ткань',
    unit: 'м',
    stock: 320,
    reserved: 0,
    cost: 1200,
    supplier: 'EcoFabrics',
    status: 'Заказано',
  },
  {
    id: 'mat4',
    name: 'Молния YKK #5',
    sku: 'ZIP-YKK-5N',
    type: 'Фурнитура',
    unit: 'шт',
    stock: 800,
    reserved: 650,
    cost: 80,
    supplier: 'YKK Group',
    status: 'В наличии',
  },
  {
    id: 'mat5',
    name: 'Шерсть мериноса',
    sku: 'MAT-MERINO-02',
    type: 'Ткань',
    unit: 'м',
    stock: 0,
    reserved: 0,
    cost: 4200,
    supplier: 'Woolmark',
    status: 'Нет в наличии',
  },
];

export default function MaterialsPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 duration-500 animate-in fade-in">
      <header className="flex flex-col justify-end gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-center">
        <Button className="h-9 rounded-lg px-4 text-[10px] font-bold uppercase tracking-wider shadow-md shadow-indigo-100 transition-all">
          <PlusCircle className="mr-2 h-4 w-4" />
          Добавить материал
        </Button>
      </header>

      <div className="space-y-6">
        <SupplierCollabHub />

        <MaterialReservations brandId="BRAND-XYZ" />

        <Card className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
          <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Материалы на складе
              </CardTitle>
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Поиск по названию или SKU..."
                  className="h-8 rounded-lg border-slate-200 bg-white pl-9 text-[12px]"
                />
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
                        <p className="text-[13px] font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                          {item.name}
                        </p>
                        <p className="font-mono text-[10px] uppercase tracking-tight text-slate-400">
                          {item.sku}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="h-4.5 border-slate-100 bg-slate-50 px-2 text-[9px] font-bold uppercase tracking-wider text-slate-500"
                      >
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">
                      {item.stock}{' '}
                      <span className="ml-0.5 text-[10px] uppercase text-slate-400">
                        {item.unit}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-slate-400">
                      {item.reserved}{' '}
                      <span className="ml-0.5 text-[10px] uppercase opacity-60">{item.unit}</span>
                    </TableCell>
                    <TableCell className="text-[12px] font-bold text-slate-700">
                      {item.cost.toLocaleString('ru-RU')} ₽{' '}
                      <span className="ml-0.5 text-[9px] font-normal text-slate-400">
                        / {item.unit}
                      </span>
                    </TableCell>
                    <TableCell className="text-[12px] font-medium text-slate-500">
                      {item.supplier}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          'h-5 px-2 text-[9px] font-bold uppercase tracking-wider',
                          item.status === 'В наличии'
                            ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                            : item.status === 'Заказано'
                              ? 'border-amber-100 bg-amber-50 text-amber-600'
                              : 'border-rose-100 bg-rose-50 text-rose-600'
                        )}
                        variant="outline"
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-900"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-xl border-slate-100 p-1 shadow-xl"
                        >
                          <DropdownMenuItem className="h-8 cursor-pointer rounded-lg text-[11px] font-bold uppercase tracking-wider">
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem className="h-8 cursor-pointer rounded-lg text-[11px] font-bold uppercase tracking-wider">
                            История
                          </DropdownMenuItem>
                          <DropdownMenuItem className="h-8 cursor-pointer rounded-lg text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                            Заказать еще
                          </DropdownMenuItem>
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
