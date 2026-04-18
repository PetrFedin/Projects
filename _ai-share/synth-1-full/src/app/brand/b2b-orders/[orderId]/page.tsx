'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronLeft,
  File,
  Truck,
  MoreVertical,
  CheckCircle,
  Clock,
  FileText,
  Edit,
  Copy,
  XCircle,
  Send,
  Paperclip,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  DollarSign,
  Box,
  Sparkles,
  Eye,
  Globe,
  Layers,
  Calendar,
  ArrowRight,
  Split,
  Combine,
  PackageCheck,
  PlusCircle,
  Lock,
  Percent,
  StickyNote,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState, useEffect, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  initialOrderItems,
  mockChat,
  orderStatusSteps,
  mockOrderDetailJoors,
} from '@/lib/order-data';
import { getOrderLinks } from '@/lib/data/entity-links';
import { ROUTES } from '@/lib/routes';
import { useOrderShipmentTracking } from '@/hooks/use-b2b-shipment';
import { getCarrierTrackingUrl } from '@/lib/b2b/carrier-tracking-url';
import { RelatedModulesBlock } from '@/components/brand/RelatedModulesBlock';
import { OrderChat, SizeBreakdownDialog } from '@/components/brand/b2b';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MOCK_SHIPMENTS = [
  {
    id: 'ship-1',
    name: 'Drop 1: Core Collection',
    date: '2026-03-15',
    status: 'In Production',
    items: ['1', '3'],
  },
  {
    id: 'ship-2',
    name: 'Drop 2: Seasonal Capsule',
    date: '2026-04-20',
    status: 'Scheduled',
    items: ['2'],
  },
];

export default function B2BOrderDetailsPage({ params: paramsPromise }: { params: any }) {
  const params =
    paramsPromise && typeof paramsPromise.then === 'function' ? use(paramsPromise) : paramsPromise;
  const [orderItems, setOrderItems] = useState(initialOrderItems);
  const [shipments, setShipments] = useState(MOCK_SHIPMENTS);
  const [activeShipment, setActiveShipment] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>(
    'pending'
  );
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [orderDate, setOrderDate] = useState('');
  const [orderNotes, setOrderNotes] = useState(mockOrderDetailJoors.orderNotes);
  /** JOOR: внутренние заметки бренда по заказу (не видны ритейлеру) */
  const [internalNotes, setInternalNotes] = useState(
    'Podium — приоритетный партнёр. Согласовать смену окна Drop 2 по запросу.'
  );
  const currency = mockOrderDetailJoors.currency || 'RUB';
  const orderId = typeof params?.orderId === 'string' ? params.orderId : '';
  const { data: shipmentTracking } = useOrderShipmentTracking(orderId);

  useEffect(() => {
    setOrderDate(new Date().toLocaleDateString('ru-RU'));
  }, []);

  const subtotal = orderItems.reduce(
    (acc, item) => acc + item.price * 0.4 * item.orderedQuantity,
    0
  );
  const total = subtotal;

  const filteredItems = useMemo(() => {
    if (activeShipment === 'all') return orderItems;
    const shipment = shipments.find((s) => s.id === activeShipment);
    return orderItems.filter((item) => shipment?.items.includes(item.id));
  }, [activeShipment, orderItems, shipments]);

  const handleApproveOrder = () => {
    setApprovalStatus('approved');
    toast({
      title: 'Заказ одобрен',
      description: 'Ритейлер получил уведомление. Инвойс сформирован.',
    });
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      toast({
        title: 'Изменения сохранены',
        description: 'Информация о заказе была успешно обновлена.',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, orderedQuantity: newQuantity >= 0 ? newQuantity : 0 }
          : item
      )
    );
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="mb-8 flex items-center gap-3">
        <Button variant="outline" size="icon" className="rounded-xl border-slate-200" asChild>
          <Link href={ROUTES.brand.b2bOrders}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <h1 className="text-sm font-black uppercase tracking-tight text-slate-900">
            Заказ от <span className="text-indigo-600">Podium</span> /{' '}
            <span className="font-mono text-slate-400">{params.orderId}</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Retailer: Podium Moscow • Level: Platinum Partner
          </p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="mr-4 hidden items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-2 lg:flex">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-[10px] font-black uppercase text-amber-700">
              Credit Check: OK (Limit 5.0M ₽)
            </span>
          </div>

          <Button
            variant="outline"
            className="h-10 gap-2 rounded-xl border-slate-200 px-4 text-[10px] font-black uppercase tracking-widest"
            asChild
          >
            <Link href={`/brand/b2b-orders/${params.orderId}/invoice`}>
              <FileText className="h-4 w-4 text-slate-400" /> Pro-forma
            </Link>
          </Button>

          {approvalStatus === 'pending' ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="h-10 rounded-xl border-rose-100 px-4 text-[10px] font-black uppercase text-rose-600 hover:bg-rose-50"
              >
                Отклонить
              </Button>
              <Button
                onClick={handleApproveOrder}
                className="h-10 rounded-xl bg-emerald-600 px-6 text-[10px] font-black uppercase text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Одобрить заказ
              </Button>
            </div>
          ) : (
            <Badge className="h-10 rounded-xl border-none bg-emerald-100 px-6 text-[10px] font-black uppercase text-emerald-700">
              <CheckCircle className="mr-2 h-4 w-4" /> Одобрено
            </Badge>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl border border-slate-200"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-slate-100 p-2 shadow-xl">
              <DropdownMenuItem className="rounded-lg text-[10px] font-bold uppercase tracking-wider">
                Отправить в ERP
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg text-[10px] font-bold uppercase tracking-wider">
                Создать копию
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg text-[10px] font-bold uppercase tracking-wider text-rose-600">
                Удалить
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          {/* JOOR: персональные условия для ритейлера (custom pricing / discount) */}
          <Card className="rounded-xl border-slate-200 bg-slate-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Percent className="h-4 w-4 text-slate-500" /> Персональные условия для ритейлера
              </CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-wider">
                JOOR: индивидуальные скидки и условия по контракту
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="text-slate-700">
                Скидка по контракту: <strong>42%</strong> от розницы
              </p>
              <p className="text-xs text-slate-600">
                Оплата: 50% предоплата, 50% по факту отгрузки. Кредитный лимит: 5.0M ₽.
              </p>
            </CardContent>
          </Card>

          {/* NuORDER/JOOR: график платежей и статус инвойса в одной временной шкале */}
          <Card className="rounded-xl border-slate-200 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                График платежей и инвойс
              </CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-wider">
                Депозит → Баланс → Отсрочка; статус инвойса
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium">Депозит 50%</span>
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-[9px] text-emerald-700"
                  >
                    Оплачено
                  </Badge>
                </div>
                <div className="h-px w-4 bg-slate-200" />
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="text-xs font-medium">Баланс 50%</span>
                  <Badge
                    variant="outline"
                    className="border-amber-200 bg-amber-50 text-[9px] text-amber-700"
                  >
                    По отгрузке
                  </Badge>
                </div>
                <div className="h-px w-4 bg-slate-200" />
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500" />
                  <span className="text-xs font-medium">Инвойс</span>
                  <Badge
                    variant="outline"
                    className="border-indigo-200 bg-indigo-50 text-[9px] text-indigo-700"
                  >
                    Выписан
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {orderNotes != null && orderNotes !== '' && (
            <Card className="rounded-xl border-indigo-100 bg-indigo-50/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  JOOR: Заметки к заказу от байера
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Ответ бренда или пометки…"
                    className="min-h-[80px]"
                  />
                ) : (
                  <p className="whitespace-pre-wrap text-sm text-slate-700">{orderNotes}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* JOOR: внутренние заметки (только для команды бренда, не видны ритейлеру) */}
          <Card className="rounded-xl border-amber-100 bg-amber-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4 text-amber-600" />
                <StickyNote className="h-4 w-4" /> Внутренние заметки
              </CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-wider">
                Только для команды бренда. Ритейлер не видит.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Пометки по заказу, напоминания, согласования…"
                className="min-h-[80px] bg-white/80 text-sm"
              />
            </CardContent>
          </Card>

          {/* --- MULTI-SHIPMENT TIMELINE --- */}
          <Card className="overflow-hidden rounded-xl border-none bg-slate-900 text-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-indigo-400">
                  <Truck className="h-4 w-4" /> Multi-Shipment Controller
                </CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase italic tracking-widest text-slate-400">
                  График отгрузок и консолидация
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest text-white hover:bg-white/10"
              >
                <Split className="mr-2 h-3.5 w-3.5" /> Разделить заказ
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-4">
              <div className="scrollbar-hide flex items-center gap-3 overflow-x-auto pb-4">
                {shipments.map((s, i) => (
                  <div key={s.id} className="flex items-center">
                    <div
                      className={cn(
                        'group relative min-w-[240px] cursor-pointer rounded-2xl border p-3 transition-all',
                        activeShipment === s.id
                          ? 'border-indigo-400 bg-indigo-600 shadow-lg shadow-indigo-500/20'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      )}
                      onClick={() => setActiveShipment(s.id)}
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <Badge
                          className={cn(
                            'h-5 border-none px-2 text-[8px] font-black uppercase',
                            s.status === 'In Production'
                              ? 'bg-amber-500 text-white'
                              : 'bg-indigo-400 text-white'
                          )}
                        >
                          {s.status}
                        </Badge>
                        <span className="text-[10px] font-black text-white/40">
                          {s.items.length} SKU
                        </span>
                      </div>
                      <h4 className="mb-1 text-xs font-black uppercase tracking-tight">{s.name}</h4>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-white/60">
                        <Calendar className="h-3.5 w-3.5" />{' '}
                        {new Date(s.date).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="absolute -bottom-2 -right-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-lg">
                          <ArrowRight className="h-4 w-4 text-indigo-600" />
                        </div>
                      </div>
                    </div>
                    {i < shipments.length - 1 && (
                      <div className="mx-4 flex flex-col items-center gap-1">
                        <div className="h-px w-8 bg-white/10" />
                        <Combine className="h-3 w-3 text-white/20" />
                        <div className="h-px w-8 bg-white/10" />
                      </div>
                    )}
                  </div>
                ))}
                <Button
                  variant="ghost"
                  className="flex h-[110px] min-w-[120px] flex-col gap-2 rounded-2xl border-2 border-dashed border-white/10 text-white/40 transition-all hover:bg-white/5 hover:text-white"
                >
                  <PlusCircle className="h-5 w-5" />
                  <span className="text-[9px] font-black uppercase">Add Drop</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Отгрузка и доставка — то же, что видит ритейлер: дата отгрузки, трек, этапы */}
          {shipmentTracking && (
            <Card className="rounded-xl border-slate-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4" /> Отгрузка и доставка
                </CardTitle>
                <CardDescription className="text-[10px] uppercase">
                  Дата отгрузки, трек, этапы для байера
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {shipmentTracking.shipDate && (
                  <p>
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      Отгрузка:
                    </span>{' '}
                    {new Date(shipmentTracking.shipDate).toLocaleDateString('ru-RU')}
                  </p>
                )}
                {shipmentTracking.trackNumber && (
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase text-slate-500">Трек:</span>
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
                      {shipmentTracking.trackNumber}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        navigator.clipboard.writeText(shipmentTracking.trackNumber ?? '');
                        toast({ title: 'Скопировано' });
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    {getCarrierTrackingUrl(
                      shipmentTracking.carrier,
                      shipmentTracking.trackNumber
                    ) ? (
                      <a
                        href={
                          getCarrierTrackingUrl(
                            shipmentTracking.carrier,
                            shipmentTracking.trackNumber
                          )!
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        {shipmentTracking.carrier}
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500">{shipmentTracking.carrier}</span>
                    )}
                  </p>
                )}
                <ul className="space-y-1.5">
                  {shipmentTracking.stages.map((s) => (
                    <li key={s.id} className="flex items-center gap-2">
                      <div
                        className={cn(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                          s.done && 'bg-primary text-primary-foreground',
                          s.current && 'bg-amber-500 text-white',
                          !s.done && !s.current && 'bg-muted'
                        )}
                      >
                        {s.done ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : s.current ? (
                          <Truck className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <span className={cn('text-xs', s.current && 'font-semibold text-amber-700')}>
                        {s.label}
                      </span>
                      {s.date && (
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(s.date).toLocaleDateString('ru-RU')}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card className="overflow-hidden rounded-xl border-slate-100 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base font-black uppercase tracking-tight text-slate-900">
                    Состав отгрузки
                  </CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase text-slate-400">
                    {activeShipment === 'all'
                      ? 'Полный список товаров'
                      : `Позиции для: ${shipments.find((s) => s.id === activeShipment)?.name}`}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {activeShipment !== 'all' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[10px] font-black uppercase text-indigo-600"
                      onClick={() => setActiveShipment('all')}
                    >
                      Сбросить фильтр
                    </Button>
                  )}
                  <Button
                    variant={isEditing ? 'default' : 'outline'}
                    size="sm"
                    className="rounded-xl text-[10px] font-black uppercase"
                    onClick={handleToggleEdit}
                  >
                    {isEditing ? 'Сохранить изменения' : 'Корректировать количества'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-none">
                    <TableHead className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Изделие
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Кол-во
                    </TableHead>
                    <TableHead className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Оптовая цена
                    </TableHead>
                    <TableHead className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Итого
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item, index) => (
                    <TableRow
                      key={`${item.id}-${index}`}
                      className="group transition-colors hover:bg-slate-50"
                    >
                      <TableCell className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          {item.images && item.images.length > 0 && item.images[0].url && (
                            <div className="relative h-12 w-10 overflow-hidden rounded-lg shadow-sm">
                              <Image
                                src={item.images[0].url}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-black uppercase text-slate-900">
                              {item.name}
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              {item.sku}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={item.orderedQuantity}
                            onChange={(e) =>
                              handleQuantityChange(item.id, parseInt(e.target.value, 10) || 0)
                            }
                            className="h-8 w-20 rounded-lg text-xs font-bold"
                          />
                        ) : (
                          <Button
                            variant="link"
                            className="h-auto p-0 text-xs font-black text-indigo-600 hover:no-underline"
                            onClick={() => setEditingItem(item)}
                          >
                            {item.orderedQuantity} ед.
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-bold tabular-nums text-slate-600">
                        {(item.price * 0.4).toLocaleString('ru-RU')} ₽
                      </TableCell>
                      <TableCell className="px-8 py-4 text-right text-xs font-black tabular-nums text-slate-900">
                        {(item.price * 0.4 * item.orderedQuantity).toLocaleString('ru-RU')} ₽
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 md:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card className="relative space-y-6 overflow-hidden rounded-xl border-none bg-indigo-600 p-4 text-white shadow-xl">
              <Sparkles className="absolute -right-10 -top-3 h-40 w-40 text-white opacity-10" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/20 p-2 backdrop-blur-md">
                    <PackageCheck className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-tight">
                    Shipment Consolidation
                  </h3>
                </div>
                <p className="text-xs font-medium italic leading-relaxed opacity-80">
                  «ИИ обнаружил возможность консолидировать Drop 1 и Drop 2 в одну отгрузку. Это
                  сэкономит байеру 12,400 ₽ на логистике».
                </p>
                <Button className="h-12 w-full rounded-xl bg-white text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-lg hover:bg-slate-100">
                  Консолидировать
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden rounded-xl border-none bg-slate-900 text-white shadow-xl">
              <CardHeader className="border-b border-white/5 p-4 pb-4">
                <CardTitle className="text-sm font-black uppercase tracking-widest">
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-white/40">
                    Subtotal (Wholesale)
                  </span>
                  <span className="text-sm font-black tabular-nums">
                    {subtotal.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-white/40">VAT (20%)</span>
                  <span className="text-sm font-black tabular-nums">
                    {(subtotal * 0.2).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="my-2 h-px w-full bg-white/10" />
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                      Total Payable
                    </p>
                    <p className="text-base font-black tabular-nums">
                      {(subtotal * 1.2).toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                  <Badge className="mb-1 border-none bg-emerald-500 text-[8px] font-black uppercase text-white">
                    Tax Included
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="h-12 w-full rounded-xl bg-indigo-600 text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700">
                  Выставить счет на оплату
                </Button>
              </CardFooter>
            </Card>
            <OrderChat />
            <RelatedModulesBlock links={getOrderLinks(params.orderId, 'Podium')} />
          </div>
        </div>
      </div>
      {editingItem && (
        <SizeBreakdownDialog
          isOpen={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          item={editingItem}
          onSave={(itemId, newSizes) => setEditingItem(null)}
        />
      )}
    </div>
  );
}
