'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Megaphone, 
  Package, 
  MapPin, 
  Clock, 
  QrCode, 
  History, 
  Plus, 
  ArrowRightLeft, 
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  Camera,
  Layers,
  Truck,
  UserCircle,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { CollectionSample, SampleStatus } from '@/lib/types/samples';
import { cn } from '@/lib/utils';

import PRSampleReturns from '@/components/brand/marketing/pr-sample-returns';
import { ShowroomSampleTagDialog } from '@/components/brand/marketing/showroom-sample-tag-dialog';

/**
 * PR & Marketing Sample Control UI
 * RFID/QR учет перемещения образцов коллекции.
 */

export default function SampleControlPage() {
  const [samples, setSamples] = useState<CollectionSample[]>([
    { 
      id: 'S-101', 
      productId: 'P-502', 
      sku: 'SKU-001-S',
      internalArticleCode: '100042',
      name: 'Silk Evening Dress', 
      size: 'S', 
      color: 'Midnight Blue', 
      qrCode: 'QR-123456', 
      status: 'with_stylist', 
      currentLocation: 'Ivan Ivanov (Stylist)', 
      condition: 'perfect', 
      lastSeenAt: '2026-03-05T10:00:00Z', 
      expectedReturnAt: '2026-03-10T18:00:00Z', 
      history: [] 
    },
    { 
      id: 'S-102', 
      productId: 'P-503', 
      sku: 'SKU-002-M', 
      name: 'Wool Oversized Coat', 
      size: 'M', 
      color: 'Camel', 
      qrCode: 'QR-654321', 
      status: 'in_stock', 
      currentLocation: 'Main Showroom', 
      condition: 'good', 
      lastSeenAt: '2026-03-07T14:20:00Z', 
      history: [] 
    },
    { 
      id: 'S-103', 
      productId: 'P-504', 
      sku: 'SKU-003-XS', 
      name: 'Leather Bomber Jacket', 
      size: 'XS', 
      color: 'Black', 
      qrCode: 'QR-987654', 
      status: 'in_editorial', 
      currentLocation: 'Vogue HQ', 
      condition: 'perfect', 
      lastSeenAt: '2026-03-01T09:00:00Z', 
      expectedReturnAt: '2026-03-06T18:00:00Z', // Overdue
      history: [] 
    },
  ]);

  const getStatusBadge = (status: SampleStatus) => {
    const config: Record<SampleStatus, { label: string, color: string }> = {
      'in_stock': { label: 'В шоуруме', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
      'with_stylist': { label: 'У стилиста', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
      'in_editorial': { label: 'В редакции', color: 'bg-amber-50 text-amber-600 border-amber-100' },
      'in_transit': { label: 'В пути', color: 'bg-slate-50 text-slate-600 border-slate-100' },
      'damaged': { label: 'Поврежден', color: 'bg-rose-50 text-rose-600 border-rose-100' },
      'lost': { label: 'Утерян', color: 'bg-rose-900 text-white border-none' },
      'archived': { label: 'Архив', color: 'bg-slate-900 text-white border-none' }
    };
    const item = config[status];
    return <Badge variant="outline" className={cn("text-[8px] font-black uppercase px-2 h-5", item.color)}>{item.label}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-4 space-y-10">
      <header className="flex flex-col md:flex-row justify-between md:items-end gap-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
            <Megaphone className="w-3 h-3" />
            Marketing & PR
          </div>
          <h1 className="text-sm font-black font-headline tracking-tighter">PR Sample Control</h1>
          <p className="text-muted-foreground font-medium">RFID/QR учет перемещения образцов коллекции между редакциями и стилистами.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-xl h-11 px-6 font-black uppercase text-[10px]" asChild>
              <Link href={ROUTES.shop.b2bScanner} className="inline-flex items-center gap-2">
                <QrCode className="w-4 h-4" aria-hidden />
                Список со сканера
              </Link>
           </Button>
           <Button className="gap-2 rounded-xl h-11 px-6 font-black uppercase text-[10px] bg-indigo-600 text-white shadow-lg">
              <Plus className="w-4 h-4" /> Новый запрос на образец
           </Button>
        </div>
      </header>

      {/* Stats Cards + PR ROI Widget */}
      <div className="grid md:grid-cols-4 gap-3">
         {[
           { label: 'Всего образцов', value: '142', icon: Layers, color: 'text-slate-900' },
           { label: 'В шоуруме', value: '86', icon: MapPin, color: 'text-emerald-600' },
           { label: 'На съемках', value: '52', icon: Camera, color: 'text-indigo-600' },
           { label: 'Просрочено', value: '4', icon: AlertCircle, color: 'text-rose-600' }
         ].map((stat, i) => (
           <Card key={i} className="border-none shadow-sm bg-white rounded-3xl p-4">
              <div className="flex items-center gap-3 mb-2">
                 <div className="p-2 bg-slate-50 rounded-xl"><stat.icon className="w-4 h-4 text-slate-400" /></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
              </div>
              <p className={`text-sm font-black ${stat.color}`}>{stat.value}</p>
           </Card>
         ))}
      </div>

      {/* PR ROI & Media Stats */}
      <div className="grid md:grid-cols-3 gap-3">
        <Card className="border-none shadow-sm bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black uppercase text-emerald-700 tracking-widest">PR ROI (оценка)</span>
            <BarChart3 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black text-emerald-900">3.2x</p>
          <p className="text-[9px] text-emerald-600 font-medium mt-1">Return от образцов в редакциях</p>
        </Card>
        <Card className="border-none shadow-sm bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black uppercase text-indigo-700 tracking-widest">Публикаций в FW26</span>
            <Megaphone className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="text-xl font-black text-indigo-900">24</p>
          <p className="text-[9px] text-indigo-600 font-medium mt-1">Vogue, Elle, Harper's Bazaar</p>
        </Card>
        <Card className="border-none shadow-sm bg-slate-50 border border-slate-100 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Content Factory</span>
            <Link href="/brand/marketing/content-factory" className="text-indigo-600 hover:underline text-[9px] font-bold">→ Открыть</Link>
          </div>
          <p className="text-base font-black text-slate-900">Креативы и кампании</p>
          <p className="text-[9px] text-slate-500 font-medium mt-1">Связь образцов с контентом</p>
        </Card>
      </div>

      {/* Digital twin sample testing */}
      <Card className="border border-indigo-200 bg-indigo-50/30 rounded-2xl p-4">
        <CardHeader className="p-0 pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <UserCircle className="h-4 w-4 text-indigo-600" /> Digital twin sample testing
          </CardTitle>
          <CardDescription className="text-[11px]">
            Для eyewear — примерка оправы по фото/камере (браузер). Для одежды — отдельный сценарий через API виртуальной примерки.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Button asChild variant="outline" size="sm" className="rounded-xl text-[10px] font-bold gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-100">
            <Link href={ROUTES.brand.virtualTryonGlasses}>
              <Camera className="h-3.5 w-3.5" /> Виртуальная примерка очков
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-3">
         <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl overflow-hidden">
               <CardHeader className="p-4 border-b border-slate-50 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-black uppercase tracking-tight">Активные перемещения</CardTitle>
                    <CardDescription>Список образцов, находящихся вне шоурума.</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                    <Input placeholder="Поиск по SKU / Стилисту" className="pl-9 h-10 rounded-xl border-slate-100 text-xs w-64" />
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <Table>
                     <TableHeader className="bg-slate-50/50">
                        <TableRow>
                           <TableHead className="pl-8 text-[10px] font-black uppercase">Наименование</TableHead>
                           <TableHead className="text-[10px] font-black uppercase">Статус</TableHead>
                           <TableHead className="text-[10px] font-black uppercase">Локация</TableHead>
                           <TableHead className="text-[10px] font-black uppercase">Возврат</TableHead>
                           <TableHead className="pr-8 text-right text-[10px] font-black uppercase">Действие</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {samples.map(sample => {
                           const isOverdue = sample.expectedReturnAt && new Date(sample.expectedReturnAt) < new Date();
                           return (
                              <TableRow key={sample.id} className="hover:bg-slate-50/50 transition-colors">
                                 <TableCell className="pl-8 py-6">
                                    <p className="font-bold text-sm text-slate-900">{sample.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                       <span className="text-[10px] text-muted-foreground uppercase">{sample.sku}</span>
                                       <span className="text-[10px] text-slate-300 font-bold tracking-widest">/</span>
                                       <span className="text-[10px] text-muted-foreground uppercase">{sample.size}</span>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    {getStatusBadge(sample.status)}
                                 </TableCell>
                                 <TableCell>
                                    <div className="flex items-center gap-2">
                                       <div className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center">
                                          <MapPin className="w-3 h-3 text-slate-400" />
                                       </div>
                                       <span className="text-xs font-bold text-slate-600">{sample.currentLocation}</span>
                                    </div>
                                 </TableCell>
                                 <TableCell>
                                    {sample.expectedReturnAt ? (
                                       <div className="space-y-1">
                                          <div className="flex items-center gap-1.5">
                                             <Clock className={cn("w-3 h-3", isOverdue ? "text-rose-500" : "text-slate-400")} />
                                             <span className={cn("text-xs font-mono", isOverdue ? "text-rose-600 font-black" : "text-slate-600")}>
                                                {new Date(sample.expectedReturnAt).toLocaleDateString()}
                                             </span>
                                          </div>
                                          {isOverdue && <p className="text-[8px] font-black uppercase text-rose-500 tracking-widest">Просрочено</p>}
                                       </div>
                                    ) : (
                                       <span className="text-[10px] text-slate-300 italic">—</span>
                                    )}
                                 </TableCell>
                                 <TableCell className="pr-8 text-right">
                                    <div className="flex justify-end flex-wrap gap-1 items-center">
                                       {sample.status === 'in_stock' ? (
                                          <ShowroomSampleTagDialog sample={sample} />
                                       ) : null}
                                       <Button variant="ghost" size="icon" className="text-slate-300 hover:text-indigo-600 h-8 w-8">
                                          <History className="w-4 h-4" />
                                       </Button>
                                       <Button variant="ghost" size="icon" className="text-slate-300 hover:text-indigo-600 h-8 w-8">
                                          <ArrowRightLeft className="w-4 h-4" />
                                       </Button>
                                    </div>
                                 </TableCell>
                              </TableRow>
                           );
                        })}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>

            <PRSampleReturns skuId="SKU-001-S" />
         </div>

         <div className="space-y-6">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl bg-slate-900 text-white p-4">
               <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                     <Clock className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                     <h3 className="text-sm font-black uppercase tracking-tight">Предстоящие возвраты</h3>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Ближайшие 48 часов</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                  {[
                     { name: 'Red Satin Shirt', to: 'Vogue editorial', date: 'Tomorrow, 12:00' },
                     { name: 'Linen Trousers', to: 'Stylist: Anna K.', date: 'Today, 18:00' }
                  ].map((item, i) => (
                     <div key={i} className="flex gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 transition-colors cursor-pointer">
                        <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                           <Truck className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-xs font-black">{item.name}</p>
                           <p className="text-[10px] text-white/40 font-bold uppercase tracking-tight">{item.to}</p>
                           <p className="text-[9px] text-indigo-400 font-black mt-2">{item.date}</p>
                        </div>
                     </div>
                  ))}
               </div>
               <Button className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white border-none rounded-xl font-black uppercase text-[9px] h-10">Весь график логистики</Button>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-xl p-4">
               <h3 className="text-sm font-black uppercase tracking-tight mb-6">Stylist Network KPI</h3>
               <div className="space-y-6">
                  {[
                     { name: 'Anna Petrova', rating: '4.9', samples: 12, overdue: 0 },
                     { name: 'Max Fashion', rating: '4.2', samples: 8, overdue: 2 },
                     { name: 'Elena Style', rating: '5.0', samples: 5, overdue: 0 }
                  ].map((stylist, i) => (
                     <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                              <UserCircle className="w-5 h-5 text-slate-400" />
                           </div>
                           <div>
                              <p className="text-xs font-black">{stylist.name}</p>
                              <p className="text-[8px] font-black uppercase text-slate-400">{stylist.samples} образцов</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="flex items-center gap-1 justify-end">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span className="text-xs font-black">{stylist.rating}</span>
                           </div>
                           {stylist.overdue > 0 && <span className="text-[8px] font-black uppercase text-rose-500 tracking-widest">+{stylist.overdue} просрочено</span>}
                        </div>
                     </div>
                  ))}
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
