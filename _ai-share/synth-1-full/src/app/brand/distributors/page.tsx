'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Truck, Search, PlusCircle, MoreHorizontal, Store, MapPin,
  TrendingUp, ChevronRight, Globe, DollarSign
} from 'lucide-react';
import { SectionInfoCard } from '@/components/brand/production/ProductionSectionEnhancements';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getDistributorLinks } from '@/lib/data/entity-links';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fmtMoney } from '@/lib/format';

const mockDistributors = [
  { id: 'D01', name: 'Hub-Central Distribution', region: 'ЦФО, СЗФО', revenue: 1850000, orders: 12, retailers: 24, status: 'active' },
  { id: 'D02', name: 'Siberian Fashion Hub', region: 'СФО, УФО', revenue: 920000, orders: 6, retailers: 8, status: 'active' },
  { id: 'D03', name: 'Caucasus Premium', region: 'СКФО, ЮФО', revenue: 450000, orders: 3, retailers: 5, status: 'active' },
];

export default function DistributorsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockDistributors.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <SectionInfoCard
        title="Дистрибьюторы"
        description="Региональные дистрибьюторы: территория, условия, выручка. Связь с B2B заказами, Analytics BI (distributorsRevenue) и Retailers."
        icon={Truck}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        badges={
          <>
            <Badge variant="outline" className="text-[9px]">B2B</Badge>
            <Badge variant="outline" className="text-[9px]">Analytics</Badge>
            <Button variant="outline" size="sm" className="text-[9px] h-7 ml-1" asChild>
              <Link href="/brand/b2b-orders"><Store className="h-3 w-3 mr-1" /> B2B</Link>
            </Button>
            <Button variant="outline" size="sm" className="text-[9px] h-7" asChild>
              <Link href="/brand/analytics-bi"><TrendingUp className="h-3 w-3 mr-1" /> Analytics BI</Link>
            </Button>
            <Button variant="outline" size="sm" className="text-[9px] h-7" asChild>
              <Link href="/brand/retailers"><Globe className="h-3 w-3 mr-1" /> Retailers</Link>
            </Button>
          </>
        }
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase">Distributors Hub</h1>
          <p className="text-sm text-slate-500">Дистрибьюторы: территория, выручка, ритейлеры в сети</p>
        </div>
        <Button asChild>
          <Link href="/brand/distributors?action=add">
            <PlusCircle className="h-4 w-4 mr-2" /> Добавить дистрибьютора
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Дистрибьюторов</p>
          <p className="text-xl font-black text-slate-900">{mockDistributors.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Выручка (всего)</p>
          <p className="text-xl font-black text-slate-900">{fmtMoney(3220000)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Ритейлеров в сети</p>
          <p className="text-xl font-black text-slate-900">37</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Заказов</p>
          <p className="text-xl font-black text-slate-900">21</p>
        </Card>
      </div>

      <div className="flex justify-end">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Поиск по названию или региону..."
            className="pl-8 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Список дистрибьюторов</CardTitle>
          <CardDescription>Регион, выручка, количество ритейлеров</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дистрибьютор</TableHead>
                <TableHead>Регион</TableHead>
                <TableHead className="text-right">Выручка</TableHead>
                <TableHead className="text-right">Заказов</TableHead>
                <TableHead className="text-right">Ритейлеров</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d) => (
                <TableRow key={d.id} className="group">
                  <TableCell className="font-medium">
                    <Link href={`/brand/distributors/${d.id}`} className="hover:text-indigo-600 flex items-center gap-2">
                      {d.name}
                      <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {d.region}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold tabular-nums">{fmtMoney(d.revenue)}</TableCell>
                  <TableCell className="text-right">{d.orders}</TableCell>
                  <TableCell className="text-right">{d.retailers}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/brand/distributors/${d.id}`}>Карточка</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Заказы</DropdownMenuItem>
                        <DropdownMenuItem>Документы</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RelatedModulesBlock
        title="Связанные модули"
        links={getDistributorLinks()}
      />
    </div>
  );
}
