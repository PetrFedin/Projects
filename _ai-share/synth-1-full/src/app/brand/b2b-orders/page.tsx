'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Search, ArrowRight, AlertCircle, FileText, Truck as TruckIcon, CheckSquare, Radio, Zap } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { mockB2BOrders } from '@/lib/order-data';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { getB2BLinks } from '@/lib/data/entity-links';
import { ShipWindowBadge } from '@/components/b2b/ShipWindowBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PoContent = dynamic(() => import('@/app/brand/b2b/po/page'), { ssr: false });
const ShipmentsContent = dynamic(() => import('@/app/brand/b2b/shipments/page'), { ssr: false });
const ApprovalContent = dynamic(() => import('@/app/brand/b2b/order-approval-workflow/page'), { ssr: false });
const OrderAmendmentsContent = dynamic(() => import('@/app/brand/b2b/order-amendments/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const B2BOrdersLiveContent = dynamic(() => import('@/app/brand/b2b-orders/live/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });
const ApprovalLiveContent = dynamic(() => import('@/app/brand/b2b-orders/approval-live/page').then(m => m.default), { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> });

/** JOOR: статусы, требующие действия бренда (одобрение, ответ) */
const PENDING_ACTION_STATUSES = ['На проверке', 'Требует внимания'];

/** Список B2B заказов бренда — вход в детализацию и связанные модули. JOOR: единый дашборд, фильтр по действиям. */
export default function BrandB2BOrdersListPage() {
  const [tab, setTab] = useState('orders');
  const [partnerFilter, setPartnerFilter] = useState<string>('all');
  const [showOnlyNeedingAction, setShowOnlyNeedingAction] = useState(false);
  const orders = mockB2BOrders;
  const partners = [...new Set(orders.map(o => o.shop))];
  const byPartner = partnerFilter === 'all' ? orders : orders.filter(o => o.shop === partnerFilter);
  const filtered = showOnlyNeedingAction ? byPartner.filter(o => PENDING_ACTION_STATUSES.includes(o.status)) : byPartner;
  const needingActionCount = orders.filter(o => PENDING_ACTION_STATUSES.includes(o.status)).length;

  const getStatusVariant = (status: string) => {
    if (status === 'Черновик') return 'secondary';
    if (status === 'Требует внимания') return 'destructive';
    if (status === 'Зарезервировано') return 'default';
    return 'outline';
  };

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="bg-slate-50 border border-slate-200 h-9 px-1 gap-0.5">
        <TabsTrigger value="orders" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
          <Package className="h-3.5 w-3.5" />Заказы
        </TabsTrigger>
        <TabsTrigger value="po" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
          <FileText className="h-3.5 w-3.5" />PO
        </TabsTrigger>
        <TabsTrigger value="shipments" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
          <TruckIcon className="h-3.5 w-3.5" />Отгрузки
        </TabsTrigger>
        <TabsTrigger value="approval" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
          <CheckSquare className="h-3.5 w-3.5" />Согласование
        </TabsTrigger>
        <TabsTrigger value="amendments" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
          Заявки на изменение
        </TabsTrigger>
        <TabsTrigger value="orders-live" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
          <Zap className="h-3.5 w-3.5" />LIVE: Заказы
        </TabsTrigger>
        <TabsTrigger value="approval-live" className="text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm h-7 gap-1.5">
          <Radio className="h-3.5 w-3.5" />LIVE: Согласование
        </TabsTrigger>
      </TabsList>
      <TabsContent value="orders" className="mt-4">
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-5xl pb-24">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6" /> B2B Заказы
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Заказы от ритейлеров. JOOR: окна доставки, MOQ, заметки.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {needingActionCount > 0 && (
            <Button
              variant={showOnlyNeedingAction ? 'default' : 'outline'}
              size="sm"
              className={showOnlyNeedingAction ? 'bg-amber-500 hover:bg-amber-600' : 'border-amber-200 text-amber-700 hover:bg-amber-50'}
              onClick={() => setShowOnlyNeedingAction(!showOnlyNeedingAction)}
            >
              <AlertCircle className="h-4 w-4 mr-1.5" /> Требуют внимания ({needingActionCount})
            </Button>
          )}
          <select
            value={partnerFilter}
            onChange={(e) => setPartnerFilter(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm bg-white"
          >
            <option value="all">Все партнёры</option>
            {partners.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.brand.tradeShows}>Выставки</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Заказы</CardTitle>
          <CardDescription>Клик по номеру — детализация заказа, чат, окна доставки, замена позиций.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер</TableHead>
                <TableHead>Партнёр</TableHead>
                <TableHead>Окно</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((order) => (
                <TableRow key={order.order}>
                  <TableCell className="font-medium">
                    <Link href={`${ROUTES.brand.b2bOrders}/${order.order}`} className="text-indigo-600 hover:underline">
                      {order.order}
                    </Link>
                  </TableCell>
                  <TableCell>{order.shop}</TableCell>
                  <TableCell><ShipWindowBadge orderMode={order.orderMode} /></TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString('ru-RU')}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8" asChild>
                      <Link href={`${ROUTES.brand.b2bOrders}/${order.order}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <p className="text-slate-500 text-sm py-8 text-center">Нет заказов по выбранному фильтру.</p>
          )}
        </CardContent>
      </Card>

      <RelatedModulesBlock links={getB2BLinks()} title="Чаты, календарь, выставки, партнёры, финансы" />
    </div>
      </TabsContent>
      <TabsContent value="po" className="mt-4">{tab === 'po' && <PoContent />}</TabsContent>
      <TabsContent value="shipments" className="mt-4">{tab === 'shipments' && <ShipmentsContent />}</TabsContent>
      <TabsContent value="approval" className="mt-4">{tab === 'approval' && <ApprovalContent />}</TabsContent>
      <TabsContent value="amendments" className="mt-4">{tab === 'amendments' && <OrderAmendmentsContent />}</TabsContent>
      <TabsContent value="orders-live" className="mt-4">{tab === 'orders-live' && <B2BOrdersLiveContent />}</TabsContent>
      <TabsContent value="approval-live" className="mt-4">{tab === 'approval-live' && <ApprovalLiveContent />}</TabsContent>
    </Tabs>
  );
}
