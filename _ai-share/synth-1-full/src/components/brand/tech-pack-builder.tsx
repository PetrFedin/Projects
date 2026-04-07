'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Layers, 
  Ruler, 
  Palette, 
  Info,
  Download,
  Share2,
  CheckCircle2,
  AlertCircle,
  Scissors,
  Settings2,
  Cpu,
  Save,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function TechPackBuilder({ collectionId }: { collectionId?: string | null }) {
  const [activeTab, setActiveTab] = useState('general');
  const bomData = React.useMemo(() => {
    if (collectionId === 'SS26' || collectionId === 'BASIC') {
      return [
        { id: 1, type: 'Fabric', name: 'Organic Cotton (180g)', quantity: '1.5', unit: 'm', supplier: 'EcoTextiles', cost: 12 },
        { id: 2, type: 'Trim', name: 'YKK Vision Zipper 20cm', quantity: '1', unit: 'pcs', supplier: 'YKK Corp', cost: 2.5 },
        { id: 3, type: 'Thread', name: 'Core Spun Polyester', quantity: '0.1', unit: 'cone', supplier: 'Gutermann', cost: 0.8 },
      ];
    }
    return [];
  }, [collectionId]);

  const sizingData = React.useMemo(() => {
    if (collectionId === 'SS26' || collectionId === 'BASIC') {
      return [
        { id: 1, point: 'Chest Width', tol: '+/- 0.5', xs: '48', s: '50', m: '52', l: '54', xl: '56' },
        { id: 2, point: 'Body Length', tol: '+/- 1.0', xs: '68', s: '70', m: '72', l: '74', xl: '76' },
        { id: 3, point: 'Sleeve Length', tol: '+/- 0.5', xs: '62', s: '63', m: '64', l: '65', xl: '66' },
      ];
    }
    return [];
  }, [collectionId]);

  const [bom, setBom] = useState(bomData);
  const [sizing, setSizing] = useState(sizingData);

  React.useEffect(() => {
    setBom(bomData);
    setSizing(sizingData);
  }, [bomData, sizingData]);

  if (!collectionId) {
    return (
      <div className="space-y-4 bg-slate-50/50 p-8 rounded-xl border border-slate-100 min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="h-20 w-20 rounded-3xl bg-white flex items-center justify-center shadow-lg border border-slate-100 mb-6">
          <FileText className="h-10 w-10 text-slate-300" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">Спецификация не создана</h3>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest max-w-xs mx-auto">Выберите артикул из коллекции, чтобы сформировать его тех-пакет.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 min-h-[800px] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-slate-900/20 text-slate-900 bg-slate-900/5">
              Digital Twin v1.0
            </Badge>
          </div>
          <h2 className="text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">
            Tech Pack Builder
          </h2>
          <p className="text-slate-400 font-medium text-sm">Создание цифровой спецификации продукта для тендера и производства.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl h-12 px-6 border-slate-200 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100">
            <Download className="mr-2 h-4 w-4" /> PDF Export
          </Button>
          <Button className="rounded-xl h-12 px-8 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-slate-900/10 hover:bg-black">
            <Save className="mr-2 h-4 w-4" /> Save & Commit
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4">
          <TabsList className="bg-white/50 backdrop-blur p-1 rounded-2xl h-10 w-full md:w-auto border border-white inline-flex mb-8">
            <TabsTrigger value="general" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black uppercase text-[9px] tracking-widest transition-all">
              <Info className="mr-2 h-3.5 w-3.5" /> Concept
            </TabsTrigger>
            <TabsTrigger value="bom" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black uppercase text-[9px] tracking-widest transition-all">
              <Layers className="mr-2 h-3.5 w-3.5" /> Bill of Materials
            </TabsTrigger>
            <TabsTrigger value="sizing" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black uppercase text-[9px] tracking-widest transition-all">
              <Ruler className="mr-2 h-3.5 w-3.5" /> Measurement Table
            </TabsTrigger>
            <TabsTrigger value="construction" className="rounded-xl px-6 data-[state=active]:bg-white data-[state=active]:shadow-lg font-black uppercase text-[9px] tracking-widest transition-all">
              <Scissors className="mr-2 h-3.5 w-3.5" /> Construction
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-2xl shadow-slate-200/50 p-4 border border-white">
          <TabsContent value="general" className="mt-0 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-full">
              <div className="space-y-4">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Basic Information</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase">Style Name</Label>
                      <Input placeholder="e.g. Minimalist Overshirt" className="rounded-xl border-slate-100 bg-slate-50 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase">Style ID</Label>
                      <Input placeholder="e.g. SNTH-2026-OW-01" className="rounded-xl border-slate-100 bg-slate-50 font-bold" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Design Concept & AI Insights</Label>
                  <Textarea 
                    placeholder="Describe the aesthetic and target silhouette..." 
                    className="min-h-[150px] rounded-2xl border-slate-100 bg-slate-50 p-4 italic font-medium"
                  />
                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                      <Cpu className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-indigo-900 mb-1">Syntha AI: Design Validation</p>
                      <p className="text-xs font-medium text-indigo-700/80 leading-relaxed">
                        На основе анализа текущих трендов FW26, данная форма воротника повысит вероятность предзаказа на 18%. Рекомендуемый материал: Хлопок плотностью выше 160г/м.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 flex flex-col">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sketch & Moodboard</Label>
                <div className="flex-1 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-4 text-center group cursor-pointer hover:border-slate-300 transition-all">
                  <div className="h-20 w-20 rounded-3xl bg-white flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="h-10 w-10 text-slate-300" />
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Drop Sketches or Upload AI Generated Art</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bom" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Спецификация материалов (BOM)</h3>
                  <p className="text-xs font-medium text-slate-400 mt-1">Автоматический расчет себестоимости на основе актуальных цен поставщиков.</p>
                </div>
                <Button className="rounded-xl h-10 px-4 bg-slate-900 text-white font-black uppercase text-[9px] tracking-widest shadow-lg">
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Material
                </Button>
              </div>

              <div className="rounded-2xl border border-slate-100 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="border-none">
                      <TableHead className="text-[9px] font-black uppercase text-slate-400">Type</TableHead>
                      <TableHead className="text-[9px] font-black uppercase text-slate-400">Item Name</TableHead>
                      <TableHead className="text-[9px] font-black uppercase text-slate-400">Quantity</TableHead>
                      <TableHead className="text-[9px] font-black uppercase text-slate-400">Unit</TableHead>
                      <TableHead className="text-[9px] font-black uppercase text-slate-400">Supplier (Suggested)</TableHead>
                      <TableHead className="text-[9px] font-black uppercase text-slate-400 text-right">Estimated Cost</TableHead>
                      <TableHead className="text-[9px] font-black uppercase text-slate-400 text-right w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bom.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                        <TableCell><Badge variant="outline" className="text-[8px] font-black uppercase border-slate-200">{item.type}</Badge></TableCell>
                        <TableCell className="text-xs font-bold text-slate-900 uppercase tracking-tight">{item.name}</TableCell>
                        <TableCell className="text-xs font-bold">{item.quantity}</TableCell>
                        <TableCell className="text-xs font-bold uppercase text-slate-400">{item.unit}</TableCell>
                        <TableCell className="text-xs font-bold text-slate-500 uppercase">{item.supplier}</TableCell>
                        <TableCell className="text-xs font-bold text-slate-900 text-right">{item.cost.toLocaleString('ru-RU')} ₽</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-500 rounded-lg">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {bom.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 italic">Спецификация материалов пуста</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Total Material Cost per Unit</p>
                    <p className="text-sm font-black tracking-tighter">15.30 ₽</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Sourcing Efficiency</p>
                    <p className="text-sm font-black tracking-tighter text-green-400">+12%</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sizing" className="mt-0">
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight text-slate-900">Таблица измерений (Sizing Table)</h3>
                  <p className="text-xs font-medium text-slate-400 mt-1">Точные замеры для раскройного цеха и QC контроля.</p>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" className="rounded-xl h-10 px-4 border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Import S-XL
                  </Button>
                  <Button className="rounded-xl h-10 px-4 bg-slate-900 text-white font-black uppercase text-[9px] tracking-widest shadow-lg">
                    <Plus className="mr-1 h-3.5 w-3.5" /> Add Point
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-100 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="border-none">
                      <TableHead className="text-[9px] font-black uppercase text-slate-400">Measurement Point</TableHead>
                      <TableHead className="text-[9px] font-black uppercase text-slate-400">Tolerance</TableHead>
                      <TableHead className="text-[9px] font-black uppercase text-slate-400 text-center">XS</TableHead>
                      <TableHead className="text-[9px] font-black uppercase text-slate-400 text-center">S</TableHead>
                      <TableHead className="text-[9px] font-black uppercase text-slate-400 text-center bg-slate-100/50">M (Base)</TableHead>
                      <TableHead className="text-[9px] font-black uppercase text-slate-400 text-center">L</TableHead>
                      <TableHead className="text-[9px] font-black uppercase text-slate-400 text-center">XL</TableHead>
                      <TableHead className="text-[9px] font-black uppercase text-slate-400 text-right w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sizing.map((row) => (
                      <TableRow key={row.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50">
                        <TableCell className="text-xs font-bold text-slate-900 uppercase tracking-tight">{row.point}</TableCell>
                        <TableCell className="text-[10px] font-black text-slate-400">{row.tol}</TableCell>
                        <TableCell className="text-xs font-bold text-center">{row.xs}</TableCell>
                        <TableCell className="text-xs font-bold text-center">{row.s}</TableCell>
                        <TableCell className="text-xs font-bold text-center bg-slate-50/50">{row.m}</TableCell>
                        <TableCell className="text-xs font-bold text-center">{row.l}</TableCell>
                        <TableCell className="text-xs font-bold text-center">{row.xl}</TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-slate-900 rounded-lg">
                            <Settings2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {sizing.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="h-32 text-center">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 italic">Таблица измерений пуста</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="construction" className="mt-0 h-full">
            {sizing.length === 0 ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-10">
                <Scissors className="h-12 w-12 text-slate-200 mb-4" />
                <h4 className="text-sm font-black uppercase text-slate-900 tracking-tight">Технологические узлы не определены</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Загрузите эскиз или выберите артикул для начала работы над конструкцией.</p>
              </div>
            ) : (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
               <div className="lg:col-span-2 space-y-6">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Stitching Details</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase">Stitch Type</Label>
                        <Select defaultValue="lockstitch">
                          <SelectTrigger className="rounded-xl border-slate-100 bg-white font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="lockstitch">Single Needle Lockstitch</SelectItem>
                            <SelectItem value="overlock">4-Thread Overlock</SelectItem>
                            <SelectItem value="coverstitch">Coverstitch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase">Stitches per Inch (SPI)</Label>
                        <Input defaultValue="12" className="rounded-xl border-slate-100 bg-white font-bold" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Construction Notes</Label>
                    <Textarea 
                      placeholder="Special instructions for seam allowances, bonding, or reinforcement..." 
                      className="min-h-[200px] rounded-2xl border-slate-100 bg-white p-4 font-medium"
                    />
                  </div>
               </div>

               <div className="space-y-6">
                 <Card className="rounded-xl border-slate-100 shadow-xl bg-slate-900 text-white p-4 border-none overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CheckCircle2 className="h-20 w-20" />
                   </div>
                   <div className="relative z-10 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-accent">Tech Pack Status</p>
                    <h4 className="text-base font-black uppercase tracking-tight">Draft Mode</h4>
                    <p className="text-xs text-white/50 leading-relaxed font-medium italic">
                      "Tech pack is currently 65% complete. BOM needs supplier confirmation."
                    </p>
                    <div className="pt-4 space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span>Readiness</span>
                         <span className="text-accent">65%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-accent transition-all duration-1000" style={{ width: '65%' }}></div>
                       </div>
                    </div>
                   </div>
                 </Card>

                 <Button className="w-full h-12 rounded-2xl bg-white text-slate-900 border border-slate-100 shadow-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 group">
                    Send to Marketplace <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                 </Button>
               </div>
             </div>
            )}
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer / Stepper */}
      <div className="p-4 mt-auto flex justify-between items-center bg-white/50 border-t border-slate-100">
        <div className="flex items-center gap-3 text-slate-400">
           <div className="flex items-center gap-2">
             <AlertCircle className="h-4 w-4 text-amber-500" />
             <span className="text-[9px] font-black uppercase tracking-widest">3 Missing Attributes</span>
           </div>
           <div className="h-4 w-px bg-slate-200" />
           <span className="text-[9px] font-bold uppercase tracking-widest italic">Last saved: 2 mins ago by Syntha AI</span>
        </div>
        
        <div className="flex gap-3">
          <Button variant="ghost" className="rounded-xl h-10 px-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button variant="ghost" className="rounded-xl h-10 px-4 text-slate-900 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100">
            Next Section <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
