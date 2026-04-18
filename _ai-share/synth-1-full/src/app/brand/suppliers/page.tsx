'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package,
  Search,
  PlusCircle,
  MoreHorizontal,
  FileText,
  TrendingUp,
  ChevronRight,
  ShieldCheck,
  Truck,
  FileSearch,
  Radio,
} from 'lucide-react';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getSupplierLinks } from '@/lib/data/entity-links';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';
import { ROUTES } from '@/lib/routes';

const SupplierRfqContent = dynamic(() => import('@/app/brand/suppliers/rfq/page'), { ssr: false });
const SourcingLiveContent = dynamic(
  () => import('@/app/brand/suppliers/live/page').then((m) => m.default),
<<<<<<< HEAD
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
=======
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
>>>>>>> recover/cabinet-wip-from-stash
);

const mockSuppliers = [
  {
    id: 'S01',
    name: 'Global Textiles Ltd',
    type: 'Ткани',
    rating: 4.8,
    status: 'active',
    orders: 24,
    lastOrder: '2026-03-01',
    materials: 12,
  },
  {
    id: 'S02',
    name: 'YKK Russia',
    type: 'Фурнитура',
    rating: 4.9,
    status: 'active',
    orders: 156,
    lastOrder: '2026-03-10',
    materials: 8,
  },
  {
    id: 'S03',
    name: 'Smart Tailor Lab',
    type: 'Цех (CMT)',
    rating: 4.5,
    status: 'warning',
    orders: 5,
    lastOrder: '2026-02-28',
    materials: 0,
  },
  {
    id: 'S04',
    name: 'Italian Yarns',
    type: 'Ткани',
    rating: 4.7,
    status: 'active',
    orders: 18,
    lastOrder: '2026-03-05',
    materials: 6,
  },
  {
    id: 'S05',
    name: 'EcoFabrics Co',
    type: 'Ткани',
    rating: 4.6,
    status: 'active',
    orders: 9,
    lastOrder: '2026-02-20',
    materials: 4,
  },
];

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [tab, setTab] = useState('suppliers');

  const filtered = mockSuppliers.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = typeFilter === 'all' || s.type.toLowerCase().includes(typeFilter);
    return matchSearch && matchType;
  });

  return (
<<<<<<< HEAD
    <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="h-9 gap-0.5 border border-slate-200 bg-slate-50 px-1">
          <TabsTrigger
            value="suppliers"
            className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Package className="h-3.5 w-3.5" />
            Реестр поставщиков
          </TabsTrigger>
          <TabsTrigger
            value="rfq"
            className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
=======
    <RegistryPageShell className="w-full max-w-none space-y-6 pb-20">
      <RegistryPageHeader
        title="Поставщики"
        leadPlain="Реестр контрагентов, тендеры RFQ и live-сорсинг в одном хабе."
        actions={
          <Button asChild size="sm" className="h-8 text-[10px] font-bold uppercase">
            <Link href={`${ROUTES.brand.suppliers}?action=add`}>
              <PlusCircle className="mr-1 h-3.5 w-3.5" /> Добавить
            </Link>
          </Button>
        }
      />
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        {/* cabinetSurface v1 */}
        <TabsList className={cn(cabinetSurface.tabsList, 'flex-wrap')}>
          <TabsTrigger value="suppliers" className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}>
            <Package className="h-3.5 w-3.5" />
            Реестр поставщиков
          </TabsTrigger>
          <TabsTrigger value="rfq" className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}>
>>>>>>> recover/cabinet-wip-from-stash
            <FileSearch className="h-3.5 w-3.5" />
            Тендеры (RFQ)
          </TabsTrigger>
          <TabsTrigger
            value="sourcing-live"
<<<<<<< HEAD
            className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
=======
            className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}
>>>>>>> recover/cabinet-wip-from-stash
          >
            <Radio className="h-3.5 w-3.5" />
            LIVE: Сорсинг
          </TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="mt-4 space-y-4">
<<<<<<< HEAD
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-bold uppercase">Реестр поставщиков</h2>
              <p className="text-sm text-slate-500">Ткани, фурнитура, CMT. Договоры, КП, заказы</p>
            </div>
            <Button asChild>
              <Link href="/brand/suppliers?action=add">
                <PlusCircle className="mr-2 h-4 w-4" /> Добавить поставщика
              </Link>
            </Button>
          </div>

=======
>>>>>>> recover/cabinet-wip-from-stash
          <div className="flex flex-wrap gap-2">
            {['all', 'Ткани', 'Фурнитура', 'CMT'].map((t) => (
              <Button
                key={t}
                variant={typeFilter === t ? 'default' : 'outline'}
                size="sm"
                className="h-7 text-[10px]"
                onClick={() => setTypeFilter(t)}
              >
                {t === 'all' ? 'Все' : t}
              </Button>
            ))}
            <div className="ml-auto min-w-[200px] max-w-xs flex-1">
              <div className="relative">
<<<<<<< HEAD
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
=======
                <Search className="text-text-muted absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2" />
>>>>>>> recover/cabinet-wip-from-stash
                <Input
                  placeholder="Поиск по названию..."
                  className="h-9 pl-8"
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
                        <Link
                          href={`/brand/suppliers/${s.id}`}
<<<<<<< HEAD
                          className="flex items-center gap-2 hover:text-indigo-600"
=======
                          className="hover:text-accent-primary flex items-center gap-2"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          {s.name}
                          <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {s.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'font-bold',
                            s.rating >= 4.7
                              ? 'text-emerald-600'
                              : s.rating >= 4.4
                                ? 'text-amber-600'
<<<<<<< HEAD
                                : 'text-slate-600'
=======
                                : 'text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                          )}
                        >
                          {s.rating}/5
                        </span>
                      </TableCell>
                      <TableCell>{s.orders}</TableCell>
                      <TableCell>{s.materials}</TableCell>
<<<<<<< HEAD
                      <TableCell className="text-[11px] text-slate-500">{s.lastOrder}</TableCell>
=======
                      <TableCell className="text-text-secondary text-[11px]">
                        {s.lastOrder}
                      </TableCell>
>>>>>>> recover/cabinet-wip-from-stash
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

      <RelatedModulesBlock title="Связанные модули" links={getSupplierLinks()} />
<<<<<<< HEAD
    </div>
=======
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
