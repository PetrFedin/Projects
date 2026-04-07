'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, File, Truck, MoreVertical, CheckCircle, Clock, FileText, Edit, Copy, XCircle, Send, Paperclip, FileEdit, History, BookmarkPlus, CheckCircle2, PauseCircle, Package, ListChecks, CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Product } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { initialOrderItems, mockChat, orderStatusSteps, mockOrderDetailJoors } from '@/lib/order-data';
import { getOrdersWithPaymentState } from '@/lib/b2b/partner-finance-rollup';
import { AttachProductDialog, OrderChat, SizeBreakdownDialog } from "@/components/shop/b2b";
import { PaymentFlowCard } from "@/components/b2b/PaymentFlowCard";
import { ReplaceLineDialog } from "@/components/b2b/ReplaceLineDialog";
import { RelatedModulesBlock } from "@/components/brand/RelatedModulesBlock";
import { getShopB2BOrderLinks } from "@/lib/data/entity-links";
import { ROUTES } from "@/lib/routes";
import { useOrderShipmentTracking } from "@/hooks/use-b2b-shipment";
import { getCarrierTrackingUrl } from "@/lib/b2b/carrier-tracking-url";


export default function ShopB2BOrderDetailsPage({ params: paramsPromise }: { params: Promise<{ orderId: string }>}) {
    const params = use(paramsPromise);
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [orderItems, setOrderItems] = useState(initialOrderItems);
    const [orderDate, setOrderDate] = useState('');
    const [orderNotes, setOrderNotes] = useState(mockOrderDetailJoors.orderNotes);
    const [replaceItem, setReplaceItem] = useState<any | null>(null);
    const [amendmentDialogOpen, setAmendmentDialogOpen] = useState(false);
    const [amendmentText, setAmendmentText] = useState('');
    const [orderAcknowledged, setOrderAcknowledged] = useState(false);
    const [orderOnHold, setOrderOnHold] = useState(false);
    const [orderHoldReleaseRequested, setOrderHoldReleaseRequested] = useState(false);
    const [shipmentBannerDismissed, setShipmentBannerDismissed] = useState(false);
    const currency = mockOrderDetailJoors.currency || 'RUB';
    const { data: shipmentTracking, loading: shipmentLoading, error: shipmentError, refetch: refetchShipment } = useOrderShipmentTracking(params.orderId);

    useEffect(() => {
        setOrderDate(new Date().toLocaleDateString('ru-RU'));
    }, []);
    
    const subtotal = orderItems.reduce((acc, item) => acc + item.price * 0.4 * item.orderedQuantity, 0); // Assuming 60% wholesale discount
    const total = subtotal;
    
    const handleSaveSizes = (itemId: string, newSizes: any) => {
        console.log("Saving sizes for", itemId, newSizes);
    };
    const handleReplaceLine = (replacementProductId: string) => {
        if (!replaceItem) return;
        setOrderItems(prev => prev.map(it => it.id === replaceItem.id ? { ...it, lineStatus: 'replaced', replacedByProductId: replacementProductId } : it));
        toast({ title: 'Позиция заменена', description: 'Предложенный стиль выбран. Сохраните заказ.' });
        setReplaceItem(null);
    };
    const handleCancelLine = () => {
        if (!replaceItem) return;
        setOrderItems(prev => prev.map(it => it.id === replaceItem.id ? { ...it, lineStatus: 'cancelled' } : it));
        toast({ title: 'Позиция отменена', description: 'Строка помечена как отменённая.' });
        setReplaceItem(null);
    };
    
    const handleQuantityChange = (productId: string, newQuantity: number) => {
        setOrderItems(prevItems => prevItems.map(item =>
            item.id === productId ? { ...item, orderedQuantity: newQuantity >= 0 ? newQuantity : 0 } : item
        ));
    };

    /** Colect/JOOR: комментарий по строке заказа — виден бренду и в экспорте */
    const handleLineNoteChange = (productId: string, lineNotes: string) => {
        setOrderItems(prevItems => prevItems.map(item =>
            item.id === productId ? { ...item, lineNotes } : item
        ));
    };
    
    const handleToggleEdit = () => {
        if(isEditing) {
            // Here would be an API call to save changes
            toast({
                title: "Изменения сохранены",
                description: "Информация о заказе была успешно обновлена."
            });
        }
        setIsEditing(!isEditing);
    }

    const currentStatusIndex = orderStatusSteps.findIndex(s => s.date === null);
    const isAcknowledgmentEligible = orderStatusSteps.some((s, i) => (s.status === 'Согласован' || s.status === 'Подтверждён') && s.date != null) || currentStatusIndex >= 2;
    const reorderHref = `${ROUTES.shop.b2bReorder}?copyFrom=${params.orderId}`;
    const saveAsTemplateHref = `${ROUTES.shop.b2bOrderTemplates}?saveFrom=${params.orderId}`;
    const orderFromList = getOrdersWithPaymentState().find((o) => o.order === params.orderId);
    const paymentStatus = orderFromList?.paymentStatus;
    const paidAmount = orderFromList?.paidAmount;
    const PAYMENT_LABELS: Record<string, string> = { pending: 'Ожидает оплаты', partial: 'Частично оплачен', paid: 'Оплачен', overdue: 'Просрочен', cancelled: 'Отменён' };

    // Mock production stages for the "Live from Factory" view
    const productionStages = [
        { name: 'Раскрой', status: 'completed', date: '2024-07-20' },
        { name: 'Пошив', status: 'current', progress: 65 },
        { name: 'QC (Контроль качества)', status: 'pending' },
        { name: 'Упаковка', status: 'pending' },
    ];

    return (
        <div className="space-y-4">
             <div className="flex items-center gap-3 mb-8">
                <Button variant="outline" size="icon" asChild>
                    <Link href={ROUTES.shop.b2bOrders}><ChevronLeft className="h-4 w-4" /></Link>
                </Button>
                <div className="flex flex-col">
                    <h1 className="text-sm font-black uppercase tracking-tight text-slate-900">
                        Заказ <span className="text-indigo-600">Syntha</span> / <span className="font-mono text-slate-400">{params.orderId}</span>
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">B2B Wholesale Order • Season SS'26</p>
                </div>
                <Badge className="ml-4 bg-indigo-600 text-white border-none font-black text-[10px] uppercase px-3 py-1">В производстве</Badge>
                {paymentStatus && (
                    <span className="ml-2 flex items-center gap-1.5">
                        <Badge variant="outline" className={cn(
                            'font-black text-[10px] uppercase px-3 py-1',
                            paymentStatus === 'paid' && 'border-emerald-400 text-emerald-700 bg-emerald-50',
                            paymentStatus === 'partial' && 'border-amber-400 text-amber-700 bg-amber-50',
                            (paymentStatus === 'pending' || paymentStatus === 'overdue') && 'border-rose-400 text-rose-700 bg-rose-50',
                            paymentStatus === 'cancelled' && 'border-slate-300 text-slate-600 bg-slate-50'
                        )}>
                            {PAYMENT_LABELS[paymentStatus] ?? paymentStatus}
                            {paidAmount != null && paidAmount > 0 && ` · ${paidAmount.toLocaleString('ru-RU')} ₽`}
                        </Badge>
                        {(paymentStatus === 'pending' || paymentStatus === 'partial' || paymentStatus === 'overdue') && (
                            <Button size="sm" className="h-8 rounded-lg font-bold text-[10px] uppercase gap-1" asChild>
                                <Link href={`${ROUTES.shop.b2bPayment}?orderId=${encodeURIComponent(params.orderId)}`}>
                                    <CreditCard className="h-3.5 w-3" /> Оплатить
                                </Link>
                            </Button>
                        )}
                    </span>
                )}
                {orderOnHold && (
                    <Badge variant="outline" className="ml-2 border-amber-400 text-amber-700 bg-amber-50 font-black text-[10px] uppercase px-3 py-1 flex items-center gap-1">
                        <PauseCircle className="h-3 w-3" /> На удержании
                    </Badge>
                )}
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="ghost" className="h-10 px-4 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2" asChild>
                        <Link href={reorderHref}><Copy className="h-4 w-4"/> Дублировать / Reorder</Link>
                    </Button>
                    <Button variant="ghost" className="h-10 px-4 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2" asChild>
                        <Link href={saveAsTemplateHref}><BookmarkPlus className="h-4 w-4"/> Сохранить как шаблон</Link>
                    </Button>
                    <Dialog open={amendmentDialogOpen} onOpenChange={setAmendmentDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" className="h-10 px-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-amber-600 hover:bg-amber-50 gap-2">
                                <FileEdit className="h-4 w-4"/> Запросить изменение
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Запрос на изменение заказа</DialogTitle>
                                <DialogDescription>Опишите, что нужно изменить (позиции, количество, отмена строк). Бренд рассмотрит заявку в разделе «Заявки на изменение заказа».</DialogDescription>
                            </DialogHeader>
                            <Textarea value={amendmentText} onChange={e => setAmendmentText(e.target.value)} placeholder="Например: увеличить qty по артикулу CTP-26-001 на 20 шт; отменить позицию CTP-26-003…" className="min-h-[100px]" />
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setAmendmentDialogOpen(false)}>Отмена</Button>
                                <Button onClick={() => { toast({ title: 'Заявка отправлена', description: 'Бренд рассмотрит запрос на изменение заказа.' }); setAmendmentText(''); setAmendmentDialogOpen(false); }}>Отправить</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    {orderOnHold && (
                        <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 text-amber-700 border-amber-300" onClick={() => { setOrderHoldReleaseRequested(true); toast({ title: 'Запрос отправлен', description: 'Бренд рассмотрит запрос на снятие заказа с удержания.' }); }} disabled={orderHoldReleaseRequested}>
                            {orderHoldReleaseRequested ? 'Запрос на снятие отправлен' : 'Запросить снятие с удержания'}
                        </Button>
                    )}
                    {isAcknowledgmentEligible && !orderAcknowledged && (
                        <Button className="h-10 px-4 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => { setOrderAcknowledged(true); toast({ title: 'Заказ подтверждён', description: 'Вы подтвердили получение условий заказа.' }); }}>
                            <CheckCircle2 className="h-4 w-4"/> Подтвердить заказ
                        </Button>
                    )}
                     <Button variant="ghost" className="h-10 px-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-rose-600 hover:bg-rose-50">
                        <XCircle className="h-4 w-4"/> Отменить
                    </Button>
                </div>
            </div>

            {/* Уведомление «Заказ отгружен» — при статусе отгружен/в пути */}
            {shipmentTracking?.isShipped && !shipmentBannerDismissed && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-emerald-600" />
                        <span className="font-semibold text-emerald-800">Заказ отгружен</span>
                        {shipmentTracking.shipDate && (
                            <span className="text-emerald-700">· Отгрузка {new Date(shipmentTracking.shipDate).toLocaleDateString('ru-RU')}</span>
                        )}
                        {shipmentTracking.trackNumber && (
                            <span className="font-mono text-xs text-emerald-600">Трек: {shipmentTracking.trackNumber}</span>
                        )}
                    </div>
                    <Button variant="ghost" size="sm" className="text-emerald-700 hover:bg-emerald-100" onClick={() => setShipmentBannerDismissed(true)}>
                        Скрыть
                    </Button>
                </div>
            )}

            <div className="grid gap-3 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                    {/* --- LIVE PRODUCTION TRACKER --- */}
                    <Card className="border-indigo-100 bg-indigo-50/20 overflow-hidden relative border-2">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Truck className="h-32 w-32 text-indigo-600" />
                        </div>
                        <CardHeader className="relative z-10 border-b border-indigo-100/50 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-sm font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
                                        Live from Factory: Москва, Цех #4
                                    </CardTitle>
                                    <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Прямая трансляция статуса производства вашего заказа</CardDescription>
                                </div>
                                <Badge className="bg-white text-indigo-600 border-indigo-100 font-black text-[8px] uppercase">Intel OS Sync</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10 pt-6">
                            <div className="flex justify-between relative">
                                <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 -z-0" />
                                {productionStages.map((stage, i) => (
                                    <div key={i} className="flex flex-col items-center gap-3 relative z-10 w-1/4">
                                        <div className={cn(
                                            "h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                                            stage.status === 'completed' ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200" :
                                            stage.status === 'current' ? "bg-white border-indigo-600 text-indigo-600 shadow-xl scale-110" :
                                            "bg-white border-slate-200 text-slate-300"
                                        )}>
                                            {stage.status === 'completed' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className={cn("text-[9px] font-black uppercase tracking-tight", 
                                                stage.status === 'current' ? "text-indigo-600" : "text-slate-500")}>
                                                {stage.name}
                                            </p>
                                            {stage.status === 'current' && (
                                                <div className="w-12 mx-auto">
                                                    <div className="h-1 w-full bg-indigo-100 rounded-full overflow-hidden mt-1">
                                                        <div className="h-full bg-indigo-600 animate-pulse" style={{ width: `${stage.progress}%` }} />
                                                    </div>
                                                    <p className="text-[8px] font-bold text-indigo-600 mt-1">{stage.progress}%</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                     <Card className="rounded-xl border-slate-100 shadow-sm overflow-hidden">
                        <CardHeader>
                            <CardTitle>Статус заказа</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="flex justify-between">
                                {orderStatusSteps.map((step, index) => (
                                    <div key={step.status} className="flex flex-col items-center text-center relative w-1/4">
                                        <div className={cn(
                                            "h-8 w-8 rounded-full flex items-center justify-center border-2 z-10",
                                            step.date ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-border"
                                        )}>
                                            {step.date ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5 text-muted-foreground"/>}
                                        </div>
                                        <p className="font-medium text-sm mt-2">{step.status}</p>
                                        <p className="text-xs text-muted-foreground">{step.date ? new Date(step.date).toLocaleDateString('ru-RU') : '...'}</p>
                                        {index < orderStatusSteps.length - 1 && (
                                            <div className={cn(
                                                "absolute top-4 left-1/2 w-full h-0.5 -z-0",
                                                step.date && (index < currentStatusIndex - 1 || currentStatusIndex === -1) ? "bg-primary" : "bg-border"
                                            )} />
                                        )}
                                    </div>
                                ))}
                           </div>
                        </CardContent>
                    </Card>
                    {/* JOOR: отгрузки (ASN) по заказу — трекинг и документы */}
                    <Card className="border-slate-100">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm flex items-center gap-2"><Package className="h-4 w-4" /> Отгрузки по заказу</CardTitle>
                                <Button variant="ghost" size="sm" asChild><Link href={ROUTES.shop.b2bTracking}>Карта поставок</Link></Button>
                            </div>
                            <CardDescription className="text-xs">Advanced Shipping Notice (ASN) — статус отгрузок от бренда</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                <li className="flex items-center justify-between text-sm p-2 rounded-lg bg-slate-50">
                                    <span className="font-mono text-xs">B2B-0012-S1</span>
                                    <Badge variant="outline" className="text-[10px]">В пути</Badge>
                                    <span className="text-slate-500 text-xs">ETA 15.09.2024</span>
                                </li>
                                <li className="flex items-center justify-between text-sm p-2 rounded-lg bg-slate-50">
                                    <span className="font-mono text-xs">B2B-0012-S2</span>
                                    <Badge variant="secondary" className="text-[10px]">Готовится</Badge>
                                    <span className="text-slate-500 text-xs">Drop 2</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    {/* Отгрузка и доставка: дата отгрузки, трек, этапы. Инфраструктура: загрузка/ошибка/refetch. */}
                    <Card className="border-slate-100">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-sm flex items-center gap-2"><Truck className="h-4 w-4" /> Отгрузка и доставка</CardTitle>
                                <CardDescription className="text-xs">Статус доставки и трек-номер</CardDescription>
                            </div>
                            {shipmentError && (
                                <Button variant="ghost" size="sm" className="text-amber-600 text-xs" onClick={() => refetchShipment()}>Повторить</Button>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {shipmentLoading && !shipmentTracking && (
                                <div className="space-y-3 animate-pulse">
                                    <div className="h-4 w-3/4 bg-slate-100 rounded" />
                                    <div className="h-16 bg-slate-100 rounded" />
                                    <div className="h-24 bg-slate-100 rounded" />
                                </div>
                            )}
                            {shipmentError && shipmentTracking && (
                                <p className="text-xs text-amber-600">Показаны закэшированные данные. {shipmentError}</p>
                            )}
                            {shipmentTracking && !shipmentLoading && (
                                <>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        {shipmentTracking.shipDate && (
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-muted-foreground">Дата отгрузки</p>
                                                <p className="font-medium">{new Date(shipmentTracking.shipDate).toLocaleDateString('ru-RU')}</p>
                                            </div>
                                        )}
                                        {shipmentTracking.estimatedDelivery && (
                                            <div>
                                                <p className="text-[10px] font-bold uppercase text-muted-foreground">Ожидаемая доставка</p>
                                                <p className="font-medium">{new Date(shipmentTracking.estimatedDelivery).toLocaleDateString('ru-RU')}</p>
                                            </div>
                                        )}
                                        {shipmentTracking.trackNumber && (
                                            <div className="col-span-2 flex items-center gap-2 flex-wrap">
                                                <p className="text-[10px] font-bold uppercase text-muted-foreground shrink-0">Трек-номер</p>
                                                <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{shipmentTracking.trackNumber}</code>
                                                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { navigator.clipboard.writeText(shipmentTracking.trackNumber ?? ''); toast({ title: 'Скопировано', description: 'Трек-номер в буфере обмена.' }); }}>
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                                {getCarrierTrackingUrl(shipmentTracking.carrier, shipmentTracking.trackNumber ?? '') ? (
                                                    <a href={getCarrierTrackingUrl(shipmentTracking.carrier, shipmentTracking.trackNumber ?? '')!} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">{shipmentTracking.carrier}</a>
                                                ) : (
                                                    <span className="text-xs text-slate-500">{shipmentTracking.carrier}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <ul className="space-y-2">
                                        {shipmentTracking.stages.map((stage) => (
                                            <li key={stage.id} className="flex items-center gap-3 text-sm">
                                                <div className={cn(
                                                    "h-6 w-6 rounded-full flex items-center justify-center shrink-0",
                                                    stage.done && "bg-primary text-primary-foreground",
                                                    stage.current && "bg-amber-500 text-white",
                                                    !stage.done && !stage.current && "bg-muted"
                                                )}>
                                                    {stage.done ? <CheckCircle className="h-3.5 w-3.5" /> : stage.current ? <Truck className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5 text-muted-foreground" />}
                                                </div>
                                                <span className={cn("font-medium", stage.current && "text-amber-700")}>{stage.label}</span>
                                                {stage.date && <span className="text-xs text-muted-foreground">{new Date(stage.date).toLocaleDateString('ru-RU')}</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><History className="h-4 w-4" /> История заказа</CardTitle>
                            <CardDescription>Активность и ключевые события по заказу (JOOR/NuOrder)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {orderStatusSteps.map((step, i) => (
                                    <li key={step.status} className="flex items-start gap-3">
                                        <div className={cn("h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5", step.date ? "bg-primary text-primary-foreground" : "bg-muted")}>
                                            {step.date ? <CheckCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5 text-muted-foreground" />}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{step.status}</p>
                                            <p className="text-xs text-muted-foreground">{step.date ? new Date(step.date).toLocaleDateString('ru-RU') : 'Ожидается'}</p>
                                        </div>
                                    </li>
                                ))}
                                <li className="flex items-start gap-3 text-muted-foreground">
                                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5"><FileText className="h-3.5 w-3.5" /></div>
                                    <div>
                                        <p className="font-medium text-sm">Инвойс отправлен</p>
                                        <p className="text-xs">—</p>
                                    </div>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                    {orderNotes !== undefined && (
                        <Card className="border-indigo-100 bg-indigo-50/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">JOOR: Заметки к заказу</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <Textarea value={orderNotes} onChange={e => setOrderNotes(e.target.value)} placeholder="Комментарий для бренда…" className="min-h-[80px]" />
                                ) : (
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{orderNotes || '—'}</p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Состав заказа</CardTitle>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-[10px] font-bold uppercase">{currency}</Badge>
                                    <Button variant={isEditing ? "default" : "outline"} size="sm" onClick={handleToggleEdit}>
                                        {isEditing ? 'Сохранить изменения' : 'Редактировать заказ'}
                                    </Button>
                                </div>
                            </div>
                            <CardDescription>Заказ № {params.orderId} от {orderDate} · Окна доставки: {mockOrderDetailJoors.deliveryWindows?.map(w => w.label).join(', ')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Товар</TableHead>
                                        <TableHead>Окно доставки</TableHead>
                                        <TableHead>Категория</TableHead>
                                        <TableHead>Кол-во</TableHead>
                                        <TableHead className="text-right">Сумма</TableHead>
                                        <TableHead>Заметка</TableHead>
                                        <TableHead className="text-right"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderItems.map((item: any, index) => {
                                        const windowLabel = item.deliveryWindowId ? mockOrderDetailJoors.deliveryWindows?.find(w => w.id === item.deliveryWindowId)?.label ?? item.deliveryWindowId : '—';
                                        const lineStatus = item.lineStatus || 'open';
                                        return (
                                        <TableRow key={`${item.id}-${index}`} className={lineStatus !== 'open' ? 'opacity-60' : 'hover:bg-muted/50'}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {item.images && item.images.length > 0 && item.images[0].url && (
                                                        <Image src={item.images[0].url} alt={item.name} width={40} height={50} className="rounded-md object-cover" />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{item.name}</p>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <div className="h-3 w-3 rounded-full border" style={{backgroundColor: item.colorCode}}></div>
                                                            <span className="text-xs text-muted-foreground">{item.color}</span>
                                                            {lineStatus !== 'open' && <Badge variant="secondary" className="text-[9px] ml-1">{lineStatus === 'cancelled' ? 'Отменена' : 'Заменена'}</Badge>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{windowLabel}</TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{item.category}</TableCell>
                                            <TableCell>
                                                 {isEditing ? (
                                                    <Input type="number" value={item.orderedQuantity} onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 0)} className="w-20 h-8" />
                                                ) : (
                                                    item.orderedQuantity
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">{(item.price * 0.4 * item.orderedQuantity).toLocaleString('ru-RU')} {currency === 'RUB' ? '₽' : currency}</TableCell>
                                            <TableCell className="max-w-[180px]">
                                                {isEditing ? (
                                                    <Input value={item.lineNotes || ''} onChange={(e) => handleLineNoteChange(item.id, e.target.value)} placeholder="Комментарий к строке…" className="text-xs h-8" />
                                                ) : (
                                                    <span className="text-xs text-muted-foreground truncate block" title={item.lineNotes}>{item.lineNotes || '—'}</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {lineStatus === 'open' && (
                                                    <>
                                                        <Button variant="outline" size="sm" className="mr-1" onClick={() => setEditingItem(item)}>
                                                            <Edit className="mr-2 h-3 w-3"/> Размеры
                                                        </Button>
                                                        <Button variant="outline" size="sm" onClick={() => setReplaceItem(item)}>Замена</Button>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );})}
                                </TableBody>
                            </Table>
                        </CardContent>
                         <CardFooter className="justify-end gap-3 font-semibold text-sm">
                            <span>Итого ({currency}):</span>
                            <span>{total.toLocaleString('ru-RU')} {currency === 'RUB' ? '₽' : currency}</span>
                        </CardFooter>
                    </Card>
                </div>
                 <div className="md:col-span-1">
                    <div className="space-y-4 sticky top-24">
                       <PaymentFlowCard orderId={params.orderId} amount={`${total.toLocaleString('ru-RU')} ₽`} status="pending" dueDate="20.03.2026" onPay={() => toast({ title: 'Оплата', description: 'Переход к платёжному шлюзу' })} />
                       <OrderChat />
                        <Card>
                            <CardHeader>
                                <CardTitle>Финансы</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Сумма заказа</span>
                                    <span>{total.toLocaleString('ru-RU')} ₽</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Предоплата (50%)</span>
                                    <span className="font-semibold">{(total * 0.5).toLocaleString('ru-RU')} ₽</span>
                                </div>
                                 <div className="flex justify-between">
                                    <span className="text-muted-foreground">Статус оплаты</span>
                                    <Badge variant="secondary">Ожидает</Badge>
                                </div>
                            </CardContent>
                             <CardFooter className="flex flex-wrap gap-2">
                                <Button variant="outline" className="flex-1 min-w-[140px]" onClick={() => toast({ title: 'Инвойс', description: 'Файл инвойса скачан.' })}>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Скачать инвойс
                                </Button>
                                <Button variant="outline" className="flex-1 min-w-[140px]" onClick={() => toast({ title: 'Упаковочный лист', description: 'Packing list (ship memo) скачан.' })}>
                                    <ListChecks className="mr-2 h-4 w-4" />
                                    Упаковочный лист
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>

            <RelatedModulesBlock links={getShopB2BOrderLinks(params.orderId)} title="JOOR: матрица, reorder, выставки" />

            {editingItem && (
                <SizeBreakdownDialog 
                    isOpen={!!editingItem}
                    onOpenChange={(open) => !open && setEditingItem(null)}
                    item={editingItem}
                    onSave={handleSaveSizes}
                />
            )}
            {replaceItem && (
                <ReplaceLineDialog
                    open={!!replaceItem}
                    onOpenChange={(open) => !open && setReplaceItem(null)}
                    item={{ id: replaceItem.id, name: replaceItem.name, category: replaceItem.category, price: replaceItem.price }}
                    onReplace={handleReplaceLine}
                    onCancelLine={handleCancelLine}
                />
            )}
        </div>
    )
}
