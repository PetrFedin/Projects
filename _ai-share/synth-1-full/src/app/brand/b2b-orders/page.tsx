'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Package,
  Search,
  ArrowRight,
  AlertCircle,
  FileText,
  Truck as TruckIcon,
  CheckSquare,
  Radio,
  Zap,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { mockB2BOrders } from '@/lib/order-data';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import {
  dedupeEntityLinksByHref,
  finalizeRelatedModuleLinks,
  getB2BLinks,
  getBrandB2bOrdersCrossRoleLinks,
} from '@/lib/data/entity-links';
import { ShipWindowBadge } from '@/components/b2b/ShipWindowBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import { RegistryPageHeader, RegistryPageShell } from '@/components/design-system';

const PoContent = dynamic(() => import('@/app/brand/b2b/po/page'), { ssr: false });
const ShipmentsContent = dynamic(() => import('@/app/brand/b2b/shipments/page'), { ssr: false });
const ApprovalContent = dynamic(() => import('@/app/brand/b2b/order-approval-workflow/page'), {
  ssr: false,
});
const OrderAmendmentsContent = dynamic(
  () => import('@/app/brand/b2b/order-amendments/page').then((m) => m.default),
<<<<<<< HEAD
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const B2BOrdersLiveContent = dynamic(
  () => import('@/app/brand/b2b-orders/live/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
);
const ApprovalLiveContent = dynamic(
  () => import('@/app/brand/b2b-orders/approval-live/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="p-8 text-center text-slate-400">Загрузка...</div> }
=======
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const B2BOrdersLiveContent = dynamic(
  () => import('@/app/brand/b2b-orders/live/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
);
const ApprovalLiveContent = dynamic(
  () => import('@/app/brand/b2b-orders/approval-live/page').then((m) => m.default),
  { ssr: false, loading: () => <div className="text-text-muted p-8 text-center">Загрузка...</div> }
>>>>>>> recover/cabinet-wip-from-stash
);

/** JOOR: статусы, требующие действия бренда (одобрение, ответ) */
const PENDING_ACTION_STATUSES = ['На проверке', 'Требует внимания'];

/** Список B2B заказов бренда — вход в детализацию и связанные модули. JOOR: единый дашборд, фильтр по действиям. */
export default function BrandB2BOrdersListPage() {
  const [tab, setTab] = useState('orders');
  const [partnerFilter, setPartnerFilter] = useState<string>('all');
  const [showOnlyNeedingAction, setShowOnlyNeedingAction] = useState(false);
  const orders = mockB2BOrders;
  const partners = [...new Set(orders.map((o) => o.shop))];
  const byPartner =
    partnerFilter === 'all' ? orders : orders.filter((o) => o.shop === partnerFilter);
  const filtered = showOnlyNeedingAction
    ? byPartner.filter((o) => PENDING_ACTION_STATUSES.includes(o.status))
    : byPartner;
  const needingActionCount = orders.filter((o) =>
    PENDING_ACTION_STATUSES.includes(o.status)
  ).length;

  const getStatusVariant = (status: string) => {
    if (status === 'Черновик') return 'secondary';
    if (status === 'Требует внимания') return 'destructive';
    if (status === 'Зарезервировано') return 'default';
    return 'outline';
  };

  return (
<<<<<<< HEAD
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="h-9 gap-0.5 border border-slate-200 bg-slate-50 px-1">
        <TabsTrigger
          value="orders"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <Package className="h-3.5 w-3.5" />
          Заказы
        </TabsTrigger>
        <TabsTrigger
          value="po"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <FileText className="h-3.5 w-3.5" />
          PO
        </TabsTrigger>
        <TabsTrigger
          value="shipments"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <TruckIcon className="h-3.5 w-3.5" />
          Отгрузки
        </TabsTrigger>
        <TabsTrigger
          value="approval"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <CheckSquare className="h-3.5 w-3.5" />
          Согласование
        </TabsTrigger>
        <TabsTrigger
          value="amendments"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          Заявки на изменение
        </TabsTrigger>
        <TabsTrigger
          value="orders-live"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <Zap className="h-3.5 w-3.5" />
          LIVE: Заказы
        </TabsTrigger>
        <TabsTrigger
          value="approval-live"
          className="h-7 gap-1.5 text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <Radio className="h-3.5 w-3.5" />
          LIVE: Согласование
        </TabsTrigger>
      </TabsList>
      <TabsContent value="orders" className="mt-4">
        <div className="container mx-auto max-w-5xl space-y-6 px-4 py-6 pb-24">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold uppercase tracking-tight">
                <Package className="h-6 w-6" /> B2B Заказы
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Заказы от ритейлеров. JOOR: окна доставки, MOQ, заметки.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {needingActionCount > 0 && (
                <Button
                  variant={showOnlyNeedingAction ? 'default' : 'outline'}
                  size="sm"
                  className={
                    showOnlyNeedingAction
                      ? 'bg-amber-500 hover:bg-amber-600'
                      : 'border-amber-200 text-amber-700 hover:bg-amber-50'
                  }
                  onClick={() => setShowOnlyNeedingAction(!showOnlyNeedingAction)}
                >
                  <AlertCircle className="mr-1.5 h-4 w-4" /> Требуют внимания ({needingActionCount})
                </Button>
              )}
              <select
                value={partnerFilter}
                onChange={(e) => setPartnerFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
=======
    <RegistryPageShell className="w-full max-w-none space-y-4 pb-16">
      <RegistryPageHeader
        title="B2B Заказы"
        leadPlain="Заказы от ритейлеров: окна доставки, MOQ, заметки и согласования."
        actions={
          <>
            {needingActionCount > 0 && (
              <Button
                variant={showOnlyNeedingAction ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  'h-8 text-[10px] font-bold uppercase',
                  showOnlyNeedingAction && 'bg-amber-500 hover:bg-amber-600'
                )}
                onClick={() => setShowOnlyNeedingAction(!showOnlyNeedingAction)}
              >
                <AlertCircle className="mr-1 h-3.5 w-3.5" /> Внимание ({needingActionCount})
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-[10px] font-bold uppercase"
              asChild
            >
              <Link href={ROUTES.brand.tradeShows}>Выставки</Link>
            </Button>
          </>
        }
      />
      <Tabs value={tab} onValueChange={setTab}>
        {/* cabinetSurface v1 */}
        <TabsList className={cn(cabinetSurface.tabsList, 'flex-wrap')}>
          <TabsTrigger value="orders" className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}>
            <Package className="h-3.5 w-3.5" />
            Заказы
          </TabsTrigger>
          <TabsTrigger value="po" className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}>
            <FileText className="h-3.5 w-3.5" />
            PO
          </TabsTrigger>
          <TabsTrigger value="shipments" className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}>
            <TruckIcon className="h-3.5 w-3.5" />
            Отгрузки
          </TabsTrigger>
          <TabsTrigger value="approval" className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}>
            <CheckSquare className="h-3.5 w-3.5" />
            Согласование
          </TabsTrigger>
          <TabsTrigger value="amendments" className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}>
            Заявки на изменение
          </TabsTrigger>
          <TabsTrigger
            value="orders-live"
            className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}
          >
            <Zap className="h-3.5 w-3.5" />
            LIVE: Заказы
          </TabsTrigger>
          <TabsTrigger
            value="approval-live"
            className={cn(cabinetSurface.tabsTrigger, 'h-7 gap-1.5')}
          >
            <Radio className="h-3.5 w-3.5" />
            LIVE: Согласование
          </TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="mt-4">
          <div className="w-full space-y-6 pb-8">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <label
                className="text-text-secondary sr-only text-[10px] font-bold uppercase"
                htmlFor="b2b-partner-filter"
              >
                Партнёр
              </label>
              <select
                id="b2b-partner-filter"
                value={partnerFilter}
                onChange={(e) => setPartnerFilter(e.target.value)}
                className="border-border-default min-w-[10rem] rounded-lg border bg-white px-3 py-2 text-sm"
>>>>>>> recover/cabinet-wip-from-stash
              >
                <option value="all">Все партнёры</option>
                {partners.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
<<<<<<< HEAD
              <Button variant="outline" size="sm" asChild>
                <Link href={ROUTES.brand.tradeShows}>Выставки</Link>
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Заказы</CardTitle>
              <CardDescription>
                Клик по номеру — детализация заказа, чат, окна доставки, замена позиций.
              </CardDescription>
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
                        <Link
                          href={`${ROUTES.brand.b2bOrders}/${order.order}`}
                          className="text-indigo-600 hover:underline"
                        >
                          {order.order}
                        </Link>
                      </TableCell>
                      <TableCell>{order.shop}</TableCell>
                      <TableCell>
                        <ShipWindowBadge orderMode={order.orderMode} />
                      </TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString('ru-RU')}</TableCell>
                      <TableCell>{order.amount}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status) as any}>
                          {order.status}
                        </Badge>
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
                <p className="py-8 text-center text-sm text-slate-500">
                  Нет заказов по выбранному фильтру.
                </p>
              )}
            </CardContent>
          </Card>

          <RelatedModulesBlock
            links={getB2BLinks()}
            title="Чаты, календарь, выставки, партнёры, финансы"
          />
        </div>
      </TabsContent>
      <TabsContent value="po" className="mt-4">
        {tab === 'po' && <PoContent />}
      </TabsContent>
      <TabsContent value="shipments" className="mt-4">
        {tab === 'shipments' && <ShipmentsContent />}
      </TabsContent>
      <TabsContent value="approval" className="mt-4">
        {tab === 'approval' && <ApprovalContent />}
      </TabsContent>
      <TabsContent value="amendments" className="mt-4">
        {tab === 'amendments' && <OrderAmendmentsContent />}
      </TabsContent>
      <TabsContent value="orders-live" className="mt-4">
        {tab === 'orders-live' && <B2BOrdersLiveContent />}
      </TabsContent>
      <TabsContent value="approval-live" className="mt-4">
        {tab === 'approval-live' && <ApprovalLiveContent />}
      </TabsContent>
    </Tabs>
=======
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Заказы</CardTitle>
                <CardDescription>
                  Клик по номеру — детализация заказа, чат, окна доставки, замена позиций.
                </CardDescription>
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
                          <Link
                            href={`${ROUTES.brand.b2bOrders}/${order.order}`}
                            className="text-accent-primary hover:underline"
                          >
                            {order.order}
                          </Link>
                        </TableCell>
                        <TableCell>{order.shop}</TableCell>
                        <TableCell>
                          <ShipWindowBadge orderMode={order.orderMode} />
                        </TableCell>
                        <TableCell>{new Date(order.date).toLocaleDateString('ru-RU')}</TableCell>
                        <TableCell>{order.amount}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(order.status) as any}>
                            {order.status}
                          </Badge>
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
                  <p className="text-text-secondary py-8 text-center text-sm">
                    Нет заказов по выбранному фильтру.
                  </p>
                )}
              </CardContent>
            </Card>

            <RelatedModulesBlock
              links={finalizeRelatedModuleLinks(
                dedupeEntityLinksByHref([...getBrandB2bOrdersCrossRoleLinks(), ...getB2BLinks()])
              )}
              title="Связанные кабинеты и B2B-модули"
            />
          </div>
        </TabsContent>
        <TabsContent value="po" className="mt-4">
          {tab === 'po' && <PoContent />}
        </TabsContent>
        <TabsContent value="shipments" className="mt-4">
          {tab === 'shipments' && <ShipmentsContent />}
        </TabsContent>
        <TabsContent value="approval" className="mt-4">
          {tab === 'approval' && <ApprovalContent />}
        </TabsContent>
        <TabsContent value="amendments" className="mt-4">
          {tab === 'amendments' && <OrderAmendmentsContent />}
        </TabsContent>
        <TabsContent value="orders-live" className="mt-4">
          {tab === 'orders-live' && <B2BOrdersLiveContent />}
        </TabsContent>
        <TabsContent value="approval-live" className="mt-4">
          {tab === 'approval-live' && <ApprovalLiveContent />}
        </TabsContent>
      </Tabs>
    </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
  );
}
