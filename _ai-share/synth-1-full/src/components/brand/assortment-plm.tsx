'use client';

import React, { useState, useMemo } from 'react';
import { 
  Layers, Box, Scissors, FileText, CheckCircle2, 
  Clock, Zap, Layout, Settings, Sparkles, Database,
  Archive, RotateCcw, Ruler, PenTool, Globe, ChevronRight, History,
  Plus, Search, Filter, Move, Trash2, Camera, Calculator,
  ArrowLeft, DollarSign, TrendingUp, AlertTriangle, ShieldCheck,
  Link as LinkIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { CATEGORY_HANDBOOK } from '@/lib/data/category-handbook';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function AssortmentPlm({ 
  collectionId, 
  skus = [], 
  onAddSku,
  onSkuClick,
  onPlmViewSwitch,
  onBomHistory
}: { 
  collectionId?: string | null, 
  skus?: any[],
  onAddSku?: () => void,
  onSkuClick?: (skuId: string) => void,
  onPlmViewSwitch?: (view: 'variants' | 'techpack') => void,
  onBomHistory?: (skuId: string) => void
}) {
  const [activeTab, setActiveTab] = useState<'matrix' | 'rd' | 'archive'>('matrix');
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    audience: 'all',
    cat1: 'all',
    cat2: 'all',
    cat3: 'all'
  });

  // Filter models based on collectionId and user filters
  const models = useMemo(() => {
    let list = skus;
    if (collectionId) {
      list = list.filter(s => s.collection === collectionId);
    }
    
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
    }
    
    if (filters.audience !== 'all') {
      list = list.filter(s => s.audienceId === filters.audience);
    }
    
    if (filters.cat1 !== 'all') {
      list = list.filter(s => s.catLevel1Id === filters.cat1);
    }
    
    if (filters.cat2 !== 'all') {
      list = list.filter(s => s.catLevel2Id === filters.cat2);
    }
    
    if (filters.cat3 !== 'all') {
      list = list.filter(s => s.catLevel3Id === filters.cat3);
    }
    
    return list;
  }, [collectionId, skus, filters]);

  // BOM State for selected model
  const [bomItems, setBomItems] = useState([
    { id: 1, name: 'Main Fabric: Tech Nylon', qty: 2.5, unit: 'm', cost: 1200 },
    { id: 2, name: 'Zipper: YKK AquaGuard', qty: 1, unit: 'pc', cost: 450 },
    { id: 3, name: 'Labor: Syntha Factory', qty: 1, unit: 'pc', cost: 2500 }
  ]);

  const selectedModel = useMemo(() => models.find(m => m.id === selectedModelId), [selectedModelId, models]);

  const landedCost = useMemo(() => {
    return bomItems.reduce((acc, item) => acc + (item.qty * item.cost), 0);
  }, [bomItems]);

  const retailPrice = 18000;
  const margin = ((retailPrice - landedCost) / retailPrice * 100).toFixed(1);

  if (selectedModelId && selectedModel) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
        <header className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3">
              <Button onClick={() => setSelectedModelId(null)} variant="ghost" className="h-10 w-10 rounded-2xl bg-slate-50">
                 <ArrowLeft className="h-6 w-6 text-slate-400" />
              </Button>
              <div>
                 <p className="text-[10px] font-bold uppercase text-indigo-600 tracking-widest">Model Tech-Pack / BOM</p>
                 <h2 className="text-base font-bold uppercase tracking-tighter text-slate-900">{selectedModel.name}</h2>
              </div>
           </div>
           <div className="flex gap-3">
              <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[10px] uppercase px-4 h-10">Landed Cost Validated</Badge>
              <Button className="bg-black text-white rounded-xl h-12 px-8 font-bold uppercase text-[10px] tracking-widest shadow-xl">Зафиксировать BOM</Button>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
           {/* BOM Editor */}
           <div className="lg:col-span-8 space-y-6">
              <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-white">
                 <CardHeader className="p-3 border-b border-slate-50 flex flex-row items-center justify-between">
                    <div>
                       <CardTitle className="text-base font-bold uppercase tracking-tight">Калькулятор себестоимости (BOM)</CardTitle>
                       <CardDescription className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Спецификация материалов и работ</CardDescription>
                    </div>
                    <Button variant="outline" className="rounded-xl h-10 border-slate-200 text-[10px] font-bold uppercase">Добавить позицию +</Button>
                 </CardHeader>
                 <CardContent className="p-0">
                    <Table>
                       <TableHeader className="bg-slate-50">
                          <TableRow className="border-none">
                             <TableHead className="px-10 py-5 text-[10px] font-bold uppercase text-slate-500">Компонент</TableHead>
                             <TableHead className="py-5 text-[10px] font-bold uppercase text-slate-500 text-center">Кол-во</TableHead>
                             <TableHead className="py-5 text-[10px] font-bold uppercase text-slate-500 text-center">Ед. изм.</TableHead>
                             <TableHead className="py-5 text-[10px] font-bold uppercase text-slate-500 text-right">Цена/ед.</TableHead>
                             <TableHead className="px-10 py-5 text-[10px] font-bold uppercase text-slate-500 text-right">Итого</TableHead>
                          </TableRow>
                       </TableHeader>
                       <TableBody>
                          {bomItems.map((item) => (
                            <TableRow key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                               <TableCell className="px-10 py-6 font-bold uppercase text-xs text-slate-900">{item.name}</TableCell>
                               <TableCell className="text-center">
                                  <Input 
                                    type="number" 
                                    defaultValue={item.qty} 
                                    className="w-20 h-10 mx-auto text-center font-bold border-slate-100 rounded-xl" 
                                  />
                               </TableCell>
                               <TableCell className="text-center font-bold text-slate-400 uppercase text-[10px]">{item.unit}</TableCell>
                               <TableCell className="text-right font-bold tabular-nums">{item.cost.toLocaleString('ru-RU')} ₽</TableCell>
                               <TableCell className="px-10 text-right font-bold text-indigo-600 tabular-nums">{(item.qty * item.cost).toLocaleString('ru-RU')} ₽</TableCell>
                            </TableRow>
                          ))}
                       </TableBody>
                    </Table>
                 </CardContent>
                 <CardFooter className="p-3 bg-slate-900 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Себестоимость (Landed)</p>
                          <p className="text-base font-bold tabular-nums">{landedCost.toLocaleString('ru-RU')} <span className="text-sm text-white/40">₽</span></p>
                       </div>
                       <div className="h-10 w-[1px] bg-white/10" />
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Маржинальность</p>
                          <p className="text-base font-bold text-emerald-400 tabular-nums">{margin}%</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Розница (RRP)</p>
                       <p className="text-sm font-bold tabular-nums">{retailPrice.toLocaleString('ru-RU')} ₽</p>
                    </div>
                 </CardFooter>
              </Card>
           </div>

           {/* Model Insights Sidebar */}
           <div className="lg:col-span-4 space-y-4">
              <Card className="rounded-xl border-none shadow-2xl bg-indigo-600 text-white p-4 space-y-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Calculator className="h-32 w-32" />
                 </div>
                 <div className="relative z-10 space-y-4">
                    <Badge className="bg-white/20 text-white border-none uppercase text-[8px] font-bold">AI Profit Guard</Badge>
                    <h4 className="text-base font-bold uppercase leading-tight">Анализ доходности</h4>
                    <p className="text-xs text-indigo-100 font-medium leading-relaxed">
                       «Текущая себестоимость оптимальна. Если вы увеличите объем ткани на 10%, вы получите скидку -5% от поставщика, что поднимет маржу до 72.4%»
                    </p>
                    <div className="pt-4 flex gap-3">
                       <Button className="bg-white text-indigo-600 rounded-xl h-10 px-6 font-bold uppercase text-[9px] shadow-xl">Оптимизировать</Button>
                    </div>
                 </div>
              </Card>

              <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-xl space-y-6">
                 <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                    <Settings className="h-4 w-4 text-slate-400" /> Технические детали
                 </h4>
                 <div className="space-y-4">
                    {[
                      { label: 'Вес изделия', val: '840г' },
                      { label: 'Сложность пошива', val: 'Высокая (Level 4)' },
                      { label: 'Версия тех-пакета', val: 'v2.1 (Locked)' }
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</span>
                         <span className="text-[10px] font-bold text-slate-900 uppercase">{item.val}</span>
                      </div>
                    ))}
                 </div>
                 <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 text-slate-400 text-[9px] font-bold uppercase hover:text-indigo-600">Экспорт тех-пакета (PDF)</Button>
              </div>
           </div>
        </div>
      </motion.div>
    );
  }

  return (
    <Card className="rounded-xl border-none shadow-2xl overflow-hidden bg-white">
      <CardHeader className="p-3 pb-4 bg-slate-900 text-white">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="h-6 w-6 text-indigo-400" />
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Master Production Record</span>
            </div>
            <CardTitle className="text-base font-bold uppercase tracking-tighter">Assortment Matrix & PLM R&D</CardTitle>
            <CardDescription className="font-bold uppercase tracking-tight text-slate-400">Единый реестр моделей, тех-пакетов, лекал и результатов примерки образцов.</CardDescription>
          </div>
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
             {['matrix', 'rd', 'archive'].map((tab) => (
               <button 
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={cn(
                   "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all",
                   activeTab === tab ? "bg-white text-slate-900 shadow-xl" : "text-white/40 hover:text-white"
                 )}
               >
                 {tab === 'matrix' ? 'Матрица' : tab === 'rd' ? 'R&D Этапы' : 'Цифровой Архив'}
               </button>
             ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-10">
        {activeTab === 'matrix' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
             <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                   <div className="flex gap-3">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1">
                         <span className="text-[9px] font-bold text-slate-400 uppercase">Всего в списке</span>
                         <span className="text-base font-bold text-slate-900">{models.length} SKU</span>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1">
                         <span className="text-[9px] font-bold text-slate-400 uppercase">Коллекция</span>
                         <span className="text-base font-bold text-indigo-600 uppercase italic">{collectionId || 'Все'}</span>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <Button variant="outline" className="h-12 border-slate-200 rounded-xl font-bold uppercase text-[10px]">Экспорт в 1С/ERP</Button>
                      <Button onClick={onAddSku} className="h-12 bg-indigo-600 text-white rounded-xl font-bold uppercase text-[10px] px-8">Новая модель +</Button>
                   </div>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-5 gap-2 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <Input 
                        placeholder="Поиск ID/Имя..." 
                        className="h-9 pl-9 text-[10px] uppercase font-bold border-slate-200 rounded-xl bg-white" 
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                      />
                   </div>
                   <Select value={filters.audience} onValueChange={(v) => setFilters({...filters, audience: v})}>
                      <SelectTrigger className="h-9 text-[9px] font-bold uppercase border-slate-200 rounded-xl bg-white">
                         <SelectValue placeholder="Аудитория" />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="all">Все (Аудитория)</SelectItem>
                         {CATEGORY_HANDBOOK.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                      </SelectContent>
                   </Select>
                   <Select value={filters.cat1} onValueChange={(v) => setFilters({...filters, cat1: v, cat2: 'all', cat3: 'all'})}>
                      <SelectTrigger className="h-9 text-[9px] font-bold uppercase border-slate-200 rounded-xl bg-white">
                         <SelectValue placeholder="Кат. 1" />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="all">Уровень 1 (Все)</SelectItem>
                         {filters.audience !== 'all' && CATEGORY_HANDBOOK.find(a => a.id === filters.audience)?.categories.map(c => (
                           <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                         ))}
                      </SelectContent>
                   </Select>
                   <Select value={filters.cat2} onValueChange={(v) => setFilters({...filters, cat2: v, cat3: 'all'})}>
                      <SelectTrigger className="h-9 text-[9px] font-bold uppercase border-slate-200 rounded-xl bg-white">
                         <SelectValue placeholder="Кат. 2" />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="all">Уровень 2 (Все)</SelectItem>
                         {filters.cat1 !== 'all' && filters.audience !== 'all' && 
                           CATEGORY_HANDBOOK.find(a => a.id === filters.audience)?.categories.find(c => c.id === filters.cat1)?.children?.map(sub => (
                             <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                           ))
                         }
                      </SelectContent>
                   </Select>
                   <Select value={filters.cat3} onValueChange={(v) => setFilters({...filters, cat3: v})}>
                      <SelectTrigger className="h-9 text-[9px] font-bold uppercase border-slate-200 rounded-xl bg-white">
                         <SelectValue placeholder="Кат. 3" />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="all">Уровень 3 (Все)</SelectItem>
                         {filters.cat2 !== 'all' && filters.audience !== 'all' && 
                           CATEGORY_HANDBOOK.find(a => a.id === filters.audience)?.categories.find(c => c.id === filters.cat1)?.children?.find(s => s.id === filters.cat2)?.children?.map(leaf => (
                             <SelectItem key={leaf.id} value={leaf.id}>{leaf.name}</SelectItem>
                           ))
                         }
                      </SelectContent>
                   </Select>
                </div>
             </div>

             <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <Table>
                   <TableHeader className="bg-slate-50">
                      <TableRow className="border-none">
                         <TableHead className="px-8 py-5 text-[10px] font-bold uppercase text-slate-500 tracking-widest">Артикул / Модель</TableHead>
                         <TableHead className="py-5 text-[10px] font-bold uppercase text-slate-500 tracking-widest">В сэмпле / PO / ТП</TableHead>
                         <TableHead className="py-5 text-[10px] font-bold uppercase text-slate-500 tracking-widest">Статус / Р&Д</TableHead>
                         <TableHead className="py-5 text-[10px] font-bold uppercase text-slate-500 tracking-widest">Характеристики</TableHead>
                         <TableHead className="py-5 text-[10px] font-bold uppercase text-slate-500 tracking-widest">Ответственный</TableHead>
                         <TableHead className="py-5 text-[10px] font-bold uppercase text-slate-500 tracking-widest">Спеки / Лекала</TableHead>
                         <TableHead className="px-8 py-5 text-right text-[10px] font-bold uppercase text-slate-500 tracking-widest">VariantMatrix ↔ TechPack / Cross-links</TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      {models.map((m) => (
                        <TableRow 
                          key={m.id} 
                          onClick={() => setSelectedModelId(m.id)}
                          className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                        >
                           <TableCell className="px-8 py-6">
                              <p className="text-[11px] font-black uppercase text-slate-900 tracking-tight leading-none mb-1">{m.name}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[7px] font-black uppercase h-3.5 px-1 bg-white border-slate-200">{m.id}</Badge>
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{m.audienceId} • {m.catLevel2Id}</span>
                              </div>
                           </TableCell>
                           <TableCell>
                              <div className="flex gap-1 flex-wrap">
                                {m.inSample && <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-600 uppercase">Сэмпл</span>}
                                {m.inPO && <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-600 uppercase">PO</span>}
                                {m.hasTechPack && <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 uppercase">ТП</span>}
                                {!m.inSample && !m.inPO && !m.hasTechPack && <span className="text-[7px] text-slate-400">—</span>}
                              </div>
                           </TableCell>
                           <TableCell>
                              <Badge className={cn(
                                 "text-[8px] font-black uppercase px-2 py-0.5 border-none shadow-sm",
                                 m.status === 'Production' ? "bg-emerald-500 text-white" :
                                 m.status === 'Development' ? "bg-amber-500 text-white" :
                                 "bg-indigo-600 text-white"
                              )}>
                                 {m.status}
                              </Badge>
                           </TableCell>
                           <TableCell>
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-tight italic">{(m.attributes as any)?.color || 'Base'}</p>
                                <p className="text-[10px] font-black text-slate-900 leading-none">{m.price}</p>
                              </div>
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black border border-slate-200 text-slate-500 uppercase">
                                  {m.responsible?.split(' ').map((n: string) => n[0]).join('') || '??'}
                                </div>
                                <span className="text-[9px] font-bold uppercase text-slate-600">{m.responsible || '—'}</span>
                              </div>
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center gap-2">
                                 <FileText className={cn("h-3.5 w-3.5", m.master ? 'text-indigo-600' : 'text-slate-300')} />
                                 <span className="text-[9px] font-bold uppercase text-slate-500 tracking-tight">{m.master ? 'Spec Locked' : 'Draft'}</span>
                              </div>
                           </TableCell>
                           <TableCell className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-1 flex-wrap">
                                {onPlmViewSwitch && (
                                  <>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-indigo-50 hover:text-indigo-600" title="VariantMatrix" onClick={(e) => { e.stopPropagation(); onPlmViewSwitch('variants'); }}><Layers className="h-3.5 w-3.5" /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-indigo-50 hover:text-indigo-600" title="Tech Pack" onClick={(e) => { e.stopPropagation(); onPlmViewSwitch('techpack'); }}><FileText className="h-3.5 w-3.5" /></Button>
                                  </>
                                )}
                                {onBomHistory && m.bomVersions?.length && (
                                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-amber-50 hover:text-amber-600" title="История BOM" onClick={(e) => { e.stopPropagation(); onBomHistory(m.id); }}><History className="h-3.5 w-3.5" /></Button>
                                )}
                                {onSkuClick && (
                                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-indigo-50 hover:text-indigo-600" title="Cross-links" onClick={(e) => { e.stopPropagation(); onSkuClick(m.id); }}><LinkIcon className="h-3.5 w-3.5" /></Button>
                                )}
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl group-hover:bg-white group-hover:shadow-md transition-all border border-transparent group-hover:border-slate-100"><ChevronRight className="h-4 w-4 text-slate-400" /></Button>
                              </div>
                           </TableCell>
                        </TableRow>
                      ))}
                      {models.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="h-32 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Артикулы не найдены по текущему фильтру</p>
                          </TableCell>
                        </TableRow>
                      )}
                   </TableBody>
                </Table>
             </div>
          </motion.div>
        )}

        {activeTab === 'rd' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {[
                  { stage: 'Разработка лекал', progress: 85, icon: Scissors, desc: '3D-симуляция в CLO3D и DXF экспорт.' },
                  { stage: 'Пошив образца #1', progress: 40, icon: Box, desc: 'Тестирование посадки на манекене.' },
                  { stage: 'Финальная сертификация', progress: 0, icon: ShieldCheck, desc: 'Проверка ГОСТ и качества швов.' }
                ].map((s, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-6">
                     <div className="flex justify-between items-start">
                        <div className="h-10 w-10 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-slate-100">
                           <s.icon className="h-7 w-7 text-indigo-600" />
                        </div>
                        <Badge className="bg-white border border-slate-200 text-slate-400 text-[8px] font-bold uppercase">Шаг {i+1}</Badge>
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-base font-bold uppercase tracking-tighter text-slate-900">{s.stage}</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-bold uppercase">
                           <span>Готовность</span>
                           <span>{s.progress}%</span>
                        </div>
                        <Progress value={s.progress} className="h-1.5 bg-slate-200" />
                     </div>
                     <Button className="w-full h-12 bg-white text-indigo-600 border border-indigo-100 rounded-xl font-bold uppercase text-[10px] hover:bg-indigo-600 hover:text-white transition-all">Открыть тех-пакет</Button>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {activeTab === 'archive' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-slate-900 rounded-xl text-white space-y-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Archive className="h-64 w-64 rotate-12" />
             </div>
             <div className="relative z-10 text-center space-y-4 max-w-2xl mx-auto">
                <div className="h-20 w-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                   <Database className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-tighter">Цифровой Сейф Syntha</h3>
                <p className="text-sm text-white/60 leading-relaxed font-medium">Безопасное хранилище всех версий ваших коллекций, истории производства и интеллектуальной собственности за последние 10 лет.</p>
             </div>
             
             <div className="grid grid-cols-4 gap-3 relative z-10">
                {[
                  { label: 'SS 2024 Collection', items: 42, icon: Box },
                  { label: 'FW 2023 Collection', items: 38, icon: Archive },
                  { label: 'Brand Assets (Logos/Fonts)', items: 12, icon: Layout },
                  { label: 'Archived Patterns', items: 124, icon: Scissors }
                ].map((arch, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
                     <arch.icon className="h-6 w-6 text-indigo-400 mb-4" />
                     <p className="text-xs font-bold uppercase mb-1">{arch.label}</p>
                     <p className="text-[9px] text-white/40 font-bold uppercase">{arch.items} Объектов</p>
                  </div>
                ))}
             </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
