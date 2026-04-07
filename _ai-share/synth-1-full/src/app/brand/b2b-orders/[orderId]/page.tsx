'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    ChevronLeft, File, Truck, MoreVertical, CheckCircle, Clock, FileText, 
    Edit, Copy, XCircle, Send, Paperclip, MessageSquare, AlertTriangle, 
    ShieldCheck, DollarSign, Box, Sparkles, Eye, Globe, Layers,
    Calendar, ArrowRight, Split, Combine, PackageCheck, PlusCircle,
    Lock, Percent, StickyNote
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useState, useEffect, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { initialOrderItems, mockChat, orderStatusSteps, mockOrderDetailJoors } from "@/lib/order-data";
import { getOrderLinks } from "@/lib/data/entity-links";
import { ROUTES } from "@/lib/routes";
import { useOrderShipmentTracking } from "@/hooks/use-b2b-shipment";
import { getCarrierTrackingUrl } from "@/lib/b2b/carrier-tracking-url";
import { RelatedModulesBlock } from "@/components/brand/RelatedModulesBlock";
import { OrderChat, SizeBreakdownDialog } from '@/components/brand/b2b';
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MOCK_SHIPMENTS = [
    { id: 'ship-1', name: 'Drop 1: Core Collection', date: '2026-03-15', status: 'In Production', items: ['1', '3'] },
    { id: 'ship-2', name: 'Drop 2: Seasonal Capsule', date: '2026-04-20', status: 'Scheduled', items: ['2'] },
];

export default function B2BOrderDetailsPage({ params: paramsPromise }: { params: any }) {
    const params = (paramsPromise && typeof paramsPromise.then === 'function') ? use(paramsPromise) : paramsPromise;
    const [orderItems, setOrderItems] = useState(initialOrderItems);
    const [shipments, setShipments] = useState(MOCK_SHIPMENTS);
    const [activeShipment, setActiveShipment] = useState('all');
    const [isEditing, setIsEditing] = useState(false);
    const [approvalStatus, setApprovalStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const { toast } = useToast();
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [orderDate, setOrderDate] = useState('');
    const [orderNotes, setOrderNotes] = useState(mockOrderDetailJoors.orderNotes);
    /** JOOR: внутренние заметки бренда по заказу (не видны ритейлеру) */
    const [internalNotes, setInternalNotes] = useState('Podium — приоритетный партнёр. Согласовать смену окна Drop 2 по запросу.');
    const currency = mockOrderDetailJoors.currency || 'RUB';
    const orderId = typeof params?.orderId === 'string' ? params.orderId : '';
    const { data: shipmentTracking } = useOrderShipmentTracking(orderId);

    useEffect(() => {
        setOrderDate(new Date().toLocaleDateString('ru-RU'));
    }, []);

    const subtotal = orderItems.reduce((acc, item) => acc + item.price * 0.4 * item.orderedQuantity, 0); 
    const total = subtotal;

    const filteredItems = useMemo(() => {
        if (activeShipment === 'all') return orderItems;
        const shipment = shipments.find(s => s.id === activeShipment);
        return orderItems.filter(item => shipment?.items.includes(item.id));
    }, [activeShipment, orderItems, shipments]);

    const handleApproveOrder = () => {
        setApprovalStatus('approved');
        toast({
            title: "Заказ одобрен",
            description: "Ритейлер получил уведомление. Инвойс сформирован.",
        });
    }

    const handleToggleEdit = () => {
        if(isEditing) {
            toast({
                title: "Изменения сохранены",
                description: "Информация о заказе была успешно обновлена."
            });
        }
        setIsEditing(!isEditing);
    }
    
    const handleQuantityChange = (productId: string, newQuantity: number) => {
        setOrderItems(prevItems => prevItems.map(item =>
            item.id === productId ? { ...item, orderedQuantity: newQuantity >= 0 ? newQuantity : 0 } : item
        ));
    };

    return (
        <div className="space-y-4 pb-20">
             <div className="flex items-center gap-3 mb-8">
                <Button variant="outline" size="icon" className="rounded-xl border-slate-200" asChild>
                    <Link href={ROUTES.brand.b2bOrders}><ChevronLeft className="h-4 w-4" /></Link>
                </Button>
                <div className="flex flex-col">
                    <h1 className="text-sm font-black uppercase tracking-tight text-slate-900">
                        Заказ от <span className="text-indigo-600">Podium</span> / <span className="font-mono text-slate-400">{params.orderId}</span>
                    </h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Retailer: Podium Moscow • Level: Platinum Partner</p>
                </div>
                
                <div className="ml-auto flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-xl mr-4">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span className="text-[10px] font-black text-amber-700 uppercase">Credit Check: OK (Limit 5.0M ₽)</span>
                    </div>
                    
                    <Button variant="outline" className="h-10 px-4 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 border-slate-200" asChild>
                        <Link href={`/brand/b2b-orders/${params.orderId}/invoice`}>
                            <FileText className="h-4 w-4 text-slate-400"/> Pro-forma
                        </Link>
                    </Button>

                    {approvalStatus === 'pending' ? (
                        <div className="flex gap-2">
                            <Button variant="outline" className="h-10 px-4 rounded-xl font-black uppercase text-[10px] text-rose-600 border-rose-100 hover:bg-rose-50">
                                Отклонить
                            </Button>
                            <Button onClick={handleApproveOrder} className="h-10 px-6 rounded-xl font-black uppercase text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100">
                                <CheckCircle className="mr-2 h-4 w-4" /> Одобрить заказ
                            </Button>
                        </div>
                    ) : (
                        <Badge className="h-10 px-6 rounded-xl font-black uppercase text-[10px] bg-emerald-100 text-emerald-700 border-none">
                            <CheckCircle className="mr-2 h-4 w-4" /> Одобрено
                        </Badge>
                    )}

                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-slate-200"><MoreVertical className="h-4 w-4"/></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl p-2 border-slate-100 shadow-xl">
                            <DropdownMenuItem className="rounded-lg text-[10px] font-bold uppercase tracking-wider">Отправить в ERP</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg text-[10px] font-bold uppercase tracking-wider">Создать копию</DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg text-[10px] font-bold uppercase tracking-wider text-rose-600">Удалить</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                    {/* JOOR: персональные условия для ритейлера (custom pricing / discount) */}
                    <Card className="rounded-xl border-slate-200 bg-slate-50/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2"><Percent className="h-4 w-4 text-slate-500" /> Персональные условия для ритейлера</CardTitle>
                            <CardDescription className="text-[10px] uppercase tracking-wider">JOOR: индивидуальные скидки и условия по контракту</CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm space-y-1">
                            <p className="text-slate-700">Скидка по контракту: <strong>42%</strong> от розницы</p>
                            <p className="text-slate-600 text-xs">Оплата: 50% предоплата, 50% по факту отгрузки. Кредитный лимит: 5.0M ₽.</p>
                        </CardContent>
                    </Card>

                    {/* NuORDER/JOOR: график платежей и статус инвойса в одной временной шкале */}
                    <Card className="rounded-xl border-slate-200 bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">График платежей и инвойс</CardTitle>
                            <CardDescription className="text-[10px] uppercase tracking-wider">Депозит → Баланс → Отсрочка; статус инвойса</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span className="text-xs font-medium">Депозит 50%</span>
                                    <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-200">Оплачено</Badge>
                                </div>
                                <div className="h-px w-4 bg-slate-200" />
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-amber-400" />
                                    <span className="text-xs font-medium">Баланс 50%</span>
                                    <Badge variant="outline" className="text-[9px] bg-amber-50 text-amber-700 border-amber-200">По отгрузке</Badge>
                                </div>
                                <div className="h-px w-4 bg-slate-200" />
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                                    <span className="text-xs font-medium">Инвойс</span>
                                    <Badge variant="outline" className="text-[9px] bg-indigo-50 text-indigo-700 border-indigo-200">Выписан</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {orderNotes != null && orderNotes !== '' && (
                        <Card className="rounded-xl border-indigo-100 bg-indigo-50/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm flex items-center gap-2">JOOR: Заметки к заказу от байера</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isEditing ? (
                                    <Textarea value={orderNotes} onChange={e => setOrderNotes(e.target.value)} placeholder="Ответ бренда или пометки…" className="min-h-[80px]" />
                                ) : (
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{orderNotes}</p>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* JOOR: внутренние заметки (только для команды бренда, не видны ритейлеру) */}
                    <Card className="rounded-xl border-amber-100 bg-amber-50/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2"><Lock className="h-4 w-4 text-amber-600" /><StickyNote className="h-4 w-4" /> Внутренние заметки</CardTitle>
                            <CardDescription className="text-[10px] uppercase tracking-wider">Только для команды бренда. Ритейлер не видит.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea value={internalNotes} onChange={e => setInternalNotes(e.target.value)} placeholder="Пометки по заказу, напоминания, согласования…" className="min-h-[80px] text-sm bg-white/80" />
                        </CardContent>
                    </Card>

                    {/* --- MULTI-SHIPMENT TIMELINE --- */}
                    <Card className="rounded-xl border-none shadow-sm bg-slate-900 text-white overflow-hidden">
                        <CardHeader className="p-4 pb-4 flex flex-row items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 flex items-center gap-2">
                                    <Truck className="h-4 w-4" /> Multi-Shipment Controller
                                </CardTitle>
                                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">График отгрузок и консолидация</CardDescription>
                            </div>
                            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl font-black uppercase text-[9px] tracking-widest">
                                <Split className="mr-2 h-3.5 w-3.5" /> Разделить заказ
                            </Button>
                        </CardHeader>
                        <CardContent className="p-4 pt-4">
                            <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                {shipments.map((s, i) => (
                                    <div key={s.id} className="flex items-center">
                                        <div className={cn(
                                            "min-w-[240px] p-3 rounded-2xl border transition-all cursor-pointer relative group",
                                            activeShipment === s.id ? "bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-500/20" : "bg-white/5 border-white/10 hover:bg-white/10"
                                        )} onClick={() => setActiveShipment(s.id)}>
                                            <div className="flex justify-between items-start mb-4">
                                                <Badge className={cn(
                                                    "text-[8px] font-black uppercase px-2 h-5 border-none",
                                                    s.status === 'In Production' ? "bg-amber-500 text-white" : "bg-indigo-400 text-white"
                                                )}>{s.status}</Badge>
                                                <span className="text-[10px] font-black text-white/40">{s.items.length} SKU</span>
                                            </div>
                                            <h4 className="text-xs font-black uppercase tracking-tight mb-1">{s.name}</h4>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-white/60">
                                                <Calendar className="h-3.5 w-3.5" /> {new Date(s.date).toLocaleDateString('ru-RU')}
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="h-8 w-8 bg-white rounded-xl shadow-lg flex items-center justify-center">
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
                                    className="min-w-[120px] h-[110px] border-2 border-dashed border-white/10 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all flex flex-col gap-2"
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
                                <CardTitle className="text-sm flex items-center gap-2"><Truck className="h-4 w-4" /> Отгрузка и доставка</CardTitle>
                                <CardDescription className="text-[10px] uppercase">Дата отгрузки, трек, этапы для байера</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                {shipmentTracking.shipDate && <p><span className="text-slate-500 text-[10px] uppercase font-bold">Отгрузка:</span> {new Date(shipmentTracking.shipDate).toLocaleDateString('ru-RU')}</p>}
                                {shipmentTracking.trackNumber && (
                                    <p className="flex items-center gap-2 flex-wrap">
                                        <span className="text-slate-500 text-[10px] uppercase font-bold">Трек:</span>
                                        <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">{shipmentTracking.trackNumber}</code>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => { navigator.clipboard.writeText(shipmentTracking.trackNumber ?? ''); toast({ title: 'Скопировано' }); }}><Copy className="h-3 w-3" /></Button>
                                        {getCarrierTrackingUrl(shipmentTracking.carrier, shipmentTracking.trackNumber) ? (
                                            <a href={getCarrierTrackingUrl(shipmentTracking.carrier, shipmentTracking.trackNumber)!} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">{shipmentTracking.carrier}</a>
                                        ) : (
                                            <span className="text-xs text-slate-500">{shipmentTracking.carrier}</span>
                                        )}
                                    </p>
                                )}
                                <ul className="space-y-1.5">
                                    {shipmentTracking.stages.map((s) => (
                                        <li key={s.id} className="flex items-center gap-2">
                                            <div className={cn("h-5 w-5 rounded-full flex items-center justify-center shrink-0", s.done && "bg-primary text-primary-foreground", s.current && "bg-amber-500 text-white", !s.done && !s.current && "bg-muted")}>
                                                {s.done ? <CheckCircle className="h-3 w-3" /> : s.current ? <Truck className="h-3 w-3" /> : <Clock className="h-3 w-3 text-muted-foreground" />}
                                            </div>
                                            <span className={cn("text-xs", s.current && "font-semibold text-amber-700")}>{s.label}</span>
                                            {s.date && <span className="text-[10px] text-muted-foreground">{new Date(s.date).toLocaleDateString('ru-RU')}</span>}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="rounded-xl border-slate-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50 p-4 border-b border-slate-100">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-base font-black uppercase tracking-tight text-slate-900">Состав отгрузки</CardTitle>
                                    <CardDescription className="text-[10px] font-bold uppercase text-slate-400">
                                        {activeShipment === 'all' ? 'Полный список товаров' : `Позиции для: ${shipments.find(s => s.id === activeShipment)?.name}`}
                                    </CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    {activeShipment !== 'all' && (
                                        <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-indigo-600" onClick={() => setActiveShipment('all')}>
                                            Сбросить фильтр
                                        </Button>
                                    )}
                                    <Button variant={isEditing ? "default" : "outline"} size="sm" className="rounded-xl font-black uppercase text-[10px]" onClick={handleToggleEdit}>
                                        {isEditing ? 'Сохранить изменения' : 'Корректировать количества'}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="border-none">
                                        <TableHead className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Изделие</TableHead>
                                        <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Кол-во</TableHead>
                                        <TableHead className="py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Оптовая цена</TableHead>
                                        <TableHead className="px-8 py-4 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Итого</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.map((item, index) => (
                                        <TableRow key={`${item.id}-${index}`} className="group hover:bg-slate-50 transition-colors">
                                            <TableCell className="px-8 py-4">
                                                <div className="flex items-center gap-3">
                                                    {item.images && item.images.length > 0 && item.images[0].url && (
                                                        <div className="h-12 w-10 rounded-lg overflow-hidden relative shadow-sm">
                                                            <Image src={item.images[0].url} alt={item.name} fill className="object-cover" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-xs font-black uppercase text-slate-900">{item.name}</p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.sku}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                  {isEditing ? (
                                                    <Input type="number" value={item.orderedQuantity} onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10) || 0)} className="w-20 h-8 rounded-lg text-xs font-bold" />
                                                ) : (
                                                    <Button variant="link" className="p-0 h-auto text-xs font-black text-indigo-600 hover:no-underline" onClick={() => setEditingItem(item)}>
                                                        {item.orderedQuantity} ед.
                                                    </Button>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs font-bold text-slate-600 tabular-nums">{(item.price * 0.4).toLocaleString('ru-RU')} ₽</TableCell>
                                            <TableCell className="px-8 py-4 text-right text-xs font-black text-slate-900 tabular-nums">{(item.price * 0.4 * item.orderedQuantity).toLocaleString('ru-RU')} ₽</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                 <div className="md:col-span-1 space-y-4">
                    <div className="space-y-4 sticky top-24">
                        <Card className="rounded-xl border-none shadow-xl bg-indigo-600 text-white p-4 space-y-6 overflow-hidden relative">
                            <Sparkles className="absolute -right-10 -top-3 h-40 w-40 text-white opacity-10" />
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                        <PackageCheck className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-tight">Shipment Consolidation</h3>
                                </div>
                                <p className="text-xs font-medium leading-relaxed italic opacity-80">
                                    «ИИ обнаружил возможность консолидировать Drop 1 и Drop 2 в одну отгрузку. Это сэкономит байеру 12,400 ₽ на логистике».
                                </p>
                                <Button className="w-full bg-white text-indigo-600 hover:bg-slate-100 rounded-xl font-black uppercase text-[10px] tracking-widest h-12 shadow-lg">
                                    Консолидировать
                                </Button>
                            </div>
                        </Card>

                        <Card className="rounded-xl border-none shadow-xl bg-slate-900 text-white overflow-hidden">
                            <CardHeader className="p-4 pb-4 border-b border-white/5">
                                <CardTitle className="text-sm font-black uppercase tracking-widest">Financial Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-white/40 uppercase">Subtotal (Wholesale)</span>
                                    <span className="text-sm font-black tabular-nums">{subtotal.toLocaleString('ru-RU')} ₽</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-bold text-white/40 uppercase">VAT (20%)</span>
                                    <span className="text-sm font-black tabular-nums">{(subtotal * 0.2).toLocaleString('ru-RU')} ₽</span>
                                </div>
                                <div className="h-px w-full bg-white/10 my-2" />
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Total Payable</p>
                                        <p className="text-base font-black tabular-nums">{(subtotal * 1.2).toLocaleString('ru-RU')} ₽</p>
                                    </div>
                                    <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase mb-1">Tax Included</Badge>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-indigo-500/20">
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
    )
}
