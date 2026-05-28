'use client';

import { useSearchParams } from 'next/navigation';
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
import { Package, PlusCircle, Search, Edit3, Trash2, Globe, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';

const materials = [
  {
    id: 'm1',
    name: 'Кашемир 100%',
    category: 'Ткань',
    type: 'Натуральная',
    origin: 'Италия',
    price: '4500 ₽/м',
    status: 'Active',
  },
  {
    id: 'm2',
    name: 'Шелк Малбери',
    category: 'Ткань',
    type: 'Люкс',
    origin: 'Китай',
    price: '3200 ₽/м',
    status: 'Active',
  },
  {
    id: 'm3',
    name: 'Органик Хлопок',
    category: 'Ткань',
    type: 'Эко',
    origin: 'Турция',
    price: '1100 ₽/м',
    status: 'Review',
  },
];

export default function SupplierCatalogPage() {
  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
              B2B Material Catalog
            </span>
          </div>
          <h1 className="font-headline text-base font-black uppercase tracking-tighter">
            Каталог сырья
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Управляйте ассортиментом материалов, доступных для закупки брендами.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 text-[10px] font-black uppercase tracking-widest"
          >
            <Globe className="mr-2 h-3.5 w-3.5" /> Опубликовать в MP
          </Button>
          <Button className="rounded-xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white">
            <PlusCircle className="mr-2 h-3.5 w-3.5" /> Добавить позицию
          </Button>
        </div>
      </header>

      <Card className="overflow-hidden rounded-xl border-slate-100 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Поиск по каталогу..."
                className="h-11 rounded-xl border-slate-200 bg-white pl-10"
              />
            </div>
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
              {['Все', 'Ткани', 'Фурнитура', 'Нити', 'Упаковка'].map((filter, i) => (
                <button
                  key={i}
                  className={cn(
                    'rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all',
                    i === 0
                      ? 'bg-slate-900 text-white'
                      : 'border border-slate-100 bg-white text-slate-400 hover:text-slate-600'
                  )}
                >
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
                <TableHead className="py-4 pl-8 text-[10px] font-black uppercase tracking-widest">
                  Материал
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">
                  Тип / Группа
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">
                  Происхождение
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">
                  Базовая цена
                </TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">
                  Статус
                </TableHead>
                <TableHead className="pr-8 text-right text-[10px] font-black uppercase tracking-widest">
                  Действия
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((mat) => (
                <TableRow key={mat.id} className="group transition-colors hover:bg-slate-50">
                  <TableCell className="py-6 pl-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-100">
                        <Sparkles className="h-5 w-5 text-slate-300 transition-colors group-hover:text-emerald-500" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-black uppercase tracking-tighter text-slate-900">
                          {mat.name}
                        </p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                          ID: {mat.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge
                        variant="outline"
                        className="border-slate-100 text-[8px] font-black uppercase text-slate-500"
                      >
                        {mat.category}
                      </Badge>
                      <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">
                        {mat.type}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    {mat.origin}
                  </TableCell>
                  <TableCell className="text-xs font-black text-slate-900">{mat.price}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        'border-none px-2 py-0.5 text-[8px] font-black uppercase',
                        mat.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      )}
                    >
                      {mat.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-rose-600"
                      >
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
