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
            className="border-border-default rounded-xl text-[10px] font-black uppercase tracking-widest"
          >
            <Globe className="mr-2 h-3.5 w-3.5" /> Опубликовать в MP
          </Button>
          <Button className="bg-text-primary rounded-xl text-[10px] font-black uppercase tracking-widest text-white">
            <PlusCircle className="mr-2 h-3.5 w-3.5" /> Добавить позицию
          </Button>
        </div>
      </header>

      <Card className="border-border-subtle overflow-hidden rounded-xl shadow-sm">
        <CardHeader className="bg-bg-surface2/80 border-border-subtle border-b p-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="relative w-full max-w-md">
              <Search className="text-text-muted absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Поиск по каталогу..."
                className="border-border-default h-11 rounded-xl bg-white pl-10"
              />
            </div>
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
              {['Все', 'Ткани', 'Фурнитура', 'Нити', 'Упаковка'].map((filter, i) => (
                <button
                  key={i}
                  className={cn(
                    'rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all',
                    i === 0
                      ? 'bg-text-primary text-white'
                      : 'border-border-subtle text-text-muted hover:text-text-secondary border bg-white'
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
              <TableRow className="bg-bg-surface2/30 hover:bg-bg-surface2/30">
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
                <TableRow key={mat.id} className="hover:bg-bg-surface2 group transition-colors">
                  <TableCell className="py-6 pl-8">
                    <div className="flex items-center gap-3">
                      <div className="bg-bg-surface2 border-border-default flex h-12 w-12 items-center justify-center rounded-xl border">
                        <Sparkles className="text-text-muted h-5 w-5 transition-colors group-hover:text-emerald-500" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-text-primary text-xs font-black uppercase tracking-tighter">
                          {mat.name}
                        </p>
                        <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest">
                          ID: {mat.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge
                        variant="outline"
                        className="border-border-subtle text-text-secondary text-[8px] font-black uppercase"
                      >
                        {mat.category}
                      </Badge>
                      <p className="text-text-muted text-[10px] font-bold uppercase tracking-tight">
                        {mat.type}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-text-secondary text-[11px] font-bold uppercase tracking-widest">
                    {mat.origin}
                  </TableCell>
                  <TableCell className="text-text-primary text-xs font-black">
                    {mat.price}
                  </TableCell>
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
                        className="text-text-muted hover:text-accent-primary h-8 w-8"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-text-muted h-8 w-8 hover:text-rose-600"
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
