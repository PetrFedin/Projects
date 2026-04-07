'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package, Search, PlusCircle, MoreHorizontal,
  FileText, TrendingUp, ChevronRight, ShieldCheck, Truck, FileSearch, Radio
} from 'lucide-react';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getSupplierLinks } from '@/lib/data/entity-links';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const SupplierRfqContent = dynamic(() => import('@/app/brand/suppliers/rfq/page'), { ssr: false });
const SourcingLiveContent = dynamic(() => import('@/app/brand/suppliers/live/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });

const mockSuppliers = [
  { id: 'S01', name: 'Global Textiles Ltd', type: 'Ткани', rating: 4.8, status: 'active', orders: 24, lastOrder: '2026-03-01', materials: 12 },
  { id: 'S02', name: 'YKK Russia', type: 'Фурнитура', rating: 4.9, status: 'active', orders: 156, lastOrder: '2026-03-10', materials: 8 },
  { id: 'S03', name: 'Smart Tailor Lab', type: 'Цех (CMT)', rating: 4.5, status: 'warning', orders: 5, lastOrder: '2026-02-28', materials: 0 },
  { id: 'S04', name: 'Italian Yarns', type: 'Ткани', rating: 4.7, status: 'active', orders: 18, lastOrder: '2026-03-05', materials: 6 },
  { id: 'S05', name: 'EcoFabrics Co', type: 'Ткани', rating: 4.6, status: 'active', orders: 9, lastOrder: '2026-02-20', materials: 4 },
];

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [tab, setTab] = useState('suppliers');

  const filtered = mockSuppliers.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === 'all' || s.type.toLowerCase().includes(typeFilter);
    return matchSearch && matchType;
  });

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="bg-slate-50 border border-slate-200 h-9 px-1 gap-0.5">
          <TabsTrigger value="suppliers" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
            <Package className="h-3.5 w-3.5" />Реестр поставщиков
          </TabsTrigger>
          <TabsTrigger value="rfq" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
            <FileSearch className="h-3.5 w-3.5" />Тендеры (RFQ)
          </TabsTrigger>
          <TabsTrigger value="sourcing-live" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
            <Radio className="h-3.5 w-3.5" />LIVE: Сорсинг
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="mt-4 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold uppercase">Реестр поставщиков</h2>
              <p className="text-sm text-slate-500">Ткани, фурнитура, CMT. Договоры, КП, заказы</p>
            </div>
            <Button asChild>
              <Link href="/brand/suppliers?action=add">
                <PlusCircle className="h-4 w-4 mr-2" /> Добавить поставщика
              </Link>
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            {['all', 'Ткани', 'Фурнитура', 'CMT'].map((t) => (
              <Button
                key={t}
                variant={typeFilter === t ? 'default' : 'outline'}
                size="sm"
                className="text-[10px] h-7"
                onClick={() => setTypeFilter(t)}
              >
                {t === 'all' ? 'Все' : t}
              </Button>
            ))}
            <div className="flex-1 min-w-[200px] max-w-xs ml-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Поиск по названию..."
                  className="pl-8 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Поставщики ({filtered.length})</CardTitle>
              <CardDescription>Тип, рейтинг, количество заказов и материалов в BOM</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Поставщик</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Рейтинг</TableHead>
                    <TableHead>Заказы</TableHead>
                    <TableHead>Материалов в BOM</TableHead>
                    <TableHead>Последний заказ</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.id} className="group">
                      <TableCell className="font-medium">
                        <Link href={`/brand/suppliers/${s.id}`} className="hover:text-indigo-600 flex items-center gap-2">
                          {s.name}
                          <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px]">{s.type}</Badge></TableCell>
                      <TableCell>
                        <span className={cn(
                          'font-bold',
                          s.rating >= 4.7 ? 'text-emerald-600' : s.rating >= 4.4 ? 'text-amber-600' : 'text-slate-600'
                        )}>
                          {s.rating}/5
                        </span>
                      </TableCell>
                      <TableCell>{s.orders}</TableCell>
                      <TableCell>{s.materials}</TableCell>
                      <TableCell className="text-slate-500 text-[11px]">{s.lastOrder}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/brand/suppliers/${s.id}`}>Карточка поставщика</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Договор / КП</DropdownMenuItem>
                            <DropdownMenuItem>История заказов</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rfq" className="mt-4">
          {tab === 'rfq' && <SupplierRfqContent />}
        </TabsContent>
        <TabsContent value="sourcing-live" className="mt-4">
          {tab === 'sourcing-live' && <SourcingLiveContent />}
        </TabsContent>
      </Tabs>

      <RelatedModulesBlock
        title="Связанные модули"
        links={getSupplierLinks()}
      />
    </div>
  );
}
