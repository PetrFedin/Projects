'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
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
  ChevronLeft,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { cabinetSurface } from '@/lib/ui/cabinet-surface';
import Image from 'next/image';

export function TechPackBuilder({ collectionId }: { collectionId?: string | null }) {
  const [activeTab, setActiveTab] = useState('general');
  const bomData = React.useMemo(() => {
    if (collectionId === 'SS26' || collectionId === 'BASIC') {
      return [
        {
          id: 1,
          type: 'Fabric',
          name: 'Organic Cotton (180g)',
          quantity: '1.5',
          unit: 'm',
          supplier: 'EcoTextiles',
          cost: 12,
        },
        {
          id: 2,
          type: 'Trim',
          name: 'YKK Vision Zipper 20cm',
          quantity: '1',
          unit: 'pcs',
          supplier: 'YKK Corp',
          cost: 2.5,
        },
        {
          id: 3,
          type: 'Thread',
          name: 'Core Spun Polyester',
          quantity: '0.1',
          unit: 'cone',
          supplier: 'Gutermann',
          cost: 0.8,
        },
      ];
    }
    return [];
  }, [collectionId]);

  const sizingData = React.useMemo(() => {
    if (collectionId === 'SS26' || collectionId === 'BASIC') {
      return [
        {
          id: 1,
          point: 'Chest Width',
          tol: '+/- 0.5',
          xs: '48',
          s: '50',
          m: '52',
          l: '54',
          xl: '56',
        },
        {
          id: 2,
          point: 'Body Length',
          tol: '+/- 1.0',
          xs: '68',
          s: '70',
          m: '72',
          l: '74',
          xl: '76',
        },
        {
          id: 3,
          point: 'Sleeve Length',
          tol: '+/- 0.5',
          xs: '62',
          s: '63',
          m: '64',
          l: '65',
          xl: '66',
        },
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
      <div className="bg-bg-surface2/80 border-border-subtle flex min-h-[400px] flex-col items-center justify-center space-y-4 rounded-xl border p-8 text-center">
        <div className="border-border-subtle mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border bg-white shadow-lg">
          <FileText className="text-text-muted h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-text-primary text-xl font-black uppercase tracking-tighter">
            Спецификация не создана
          </h3>
          <p className="text-text-muted mx-auto max-w-xs text-[10px] font-bold uppercase tracking-widest">
            Выберите артикул из коллекции, чтобы сформировать его тех-пакет.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-surface2/80 border-border-subtle flex min-h-[800px] flex-col space-y-4 rounded-xl border p-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 px-4 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-text-primary shadow-text-primary/20 flex h-10 w-10 items-center justify-center rounded-xl shadow-lg">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            <Badge
              variant="outline"
              className="border-text-primary/20 text-text-primary bg-text-primary/5 text-[9px] font-black uppercase tracking-widest"
            >
              Digital Twin v1.0
            </Badge>
          </div>
          <h2 className="text-text-primary text-sm font-black uppercase leading-none tracking-tighter">
            Tech Pack Builder
          </h2>
          <p className="text-text-muted text-sm font-medium">
            Создание цифровой спецификации продукта для тендера и производства.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-border-default hover:bg-bg-surface2 h-12 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest"
          >
            <Download className="mr-2 h-4 w-4" /> PDF Export
          </Button>
          <Button className="bg-text-primary shadow-text-primary/10 h-12 rounded-xl px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-black">
            <Save className="mr-2 h-4 w-4" /> Save & Commit
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col">
        <div className="px-4">
          {/* cabinetSurface v1 */}
          <TabsList
            className={cn(cabinetSurface.tabsList, 'mb-8 inline-flex w-full flex-wrap md:w-auto')}
          >
            <TabsTrigger
              value="general"
              className={cn(
                cabinetSurface.tabsTrigger,
                'h-9 gap-2 px-4 font-black tracking-widest'
              )}
            >
              <Info className="h-3.5 w-3.5 shrink-0" /> Concept
            </TabsTrigger>
            <TabsTrigger
              value="bom"
              className={cn(
                cabinetSurface.tabsTrigger,
                'h-9 gap-2 px-4 font-black tracking-widest'
              )}
            >
              <Layers className="h-3.5 w-3.5 shrink-0" /> Bill of Materials
            </TabsTrigger>
            <TabsTrigger
              value="sizing"
              className={cn(
                cabinetSurface.tabsTrigger,
                'h-9 gap-2 px-4 font-black tracking-widest'
              )}
            >
              <Ruler className="h-3.5 w-3.5 shrink-0" /> Measurement Table
            </TabsTrigger>
            <TabsTrigger
              value="construction"
              className={cn(
                cabinetSurface.tabsTrigger,
                'h-9 gap-2 px-4 font-black tracking-widest'
              )}
            >
              <Scissors className="h-3.5 w-3.5 shrink-0" /> Construction
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 rounded-xl border border-white bg-white p-4 shadow-2xl shadow-md">
          <TabsContent value="general" className="mt-0 h-full">
            <div className="grid h-full grid-cols-1 gap-3 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-4">
                  <Label className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                    Basic Information
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase">Style Name</Label>
                      <Input
                        placeholder="e.g. Minimalist Overshirt"
                        className="border-border-subtle bg-bg-surface2 rounded-xl font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase">Style ID</Label>
                      <Input
                        placeholder="e.g. SNTH-2026-OW-01"
                        className="border-border-subtle bg-bg-surface2 rounded-xl font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                    Design Concept & AI Insights
                  </Label>
                  <Textarea
                    placeholder="Describe the aesthetic and target silhouette..."
                    className="border-border-subtle bg-bg-surface2 min-h-[150px] rounded-2xl p-4 font-medium italic"
                  />
                  <div className="bg-accent-primary/10 border-accent-primary/20 flex items-start gap-3 rounded-2xl border p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                      <Cpu className="text-accent-primary h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-accent-primary mb-1 text-[10px] font-black uppercase">
                        Syntha AI: Design Validation
                      </p>
                      <p className="text-accent-primary/80 text-xs font-medium leading-relaxed">
                        На основе анализа текущих трендов FW26, данная форма воротника повысит
                        вероятность предзаказа на 18%. Рекомендуемый материал: Хлопок плотностью
                        выше 160г/м.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <Label className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                  Sketch & Moodboard
                </Label>
                <div className="border-border-default bg-bg-surface2 hover:border-border-default group flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl transition-transform group-hover:scale-110">
                    <Plus className="text-text-muted h-10 w-10" />
                  </div>
                  <p className="text-text-muted text-xs font-black uppercase tracking-widest">
                    Drop Sketches or Upload AI Generated Art
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bom" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-text-primary text-base font-black uppercase tracking-tight">
                    Спецификация материалов (BOM)
                  </h3>
                  <p className="text-text-muted mt-1 text-xs font-medium">
                    Автоматический расчет себестоимости на основе актуальных цен поставщиков.
                  </p>
                </div>
                <Button className="bg-text-primary h-10 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Material
                </Button>
              </div>

              <div className="border-border-subtle overflow-hidden rounded-2xl border">
                <Table>
                  <TableHeader className="bg-bg-surface2">
                    <TableRow className="border-none">
                      <TableHead className="text-text-muted text-[9px] font-black uppercase">
                        Type
                      </TableHead>
                      <TableHead className="text-text-muted text-[9px] font-black uppercase">
                        Item Name
                      </TableHead>
                      <TableHead className="text-text-muted text-[9px] font-black uppercase">
                        Quantity
                      </TableHead>
                      <TableHead className="text-text-muted text-[9px] font-black uppercase">
                        Unit
                      </TableHead>
                      <TableHead className="text-text-muted text-[9px] font-black uppercase">
                        Supplier (Suggested)
                      </TableHead>
                      <TableHead className="text-text-muted text-right text-[9px] font-black uppercase">
                        Estimated Cost
                      </TableHead>
                      <TableHead className="text-text-muted w-[50px] text-right text-[9px] font-black uppercase"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bom.map((item) => (
                      <TableRow
                        key={item.id}
                        className="hover:bg-bg-surface2 border-border-subtle border-b transition-colors"
                      >
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="border-border-default text-[8px] font-black uppercase"
                          >
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-text-primary text-xs font-bold uppercase tracking-tight">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-xs font-bold">{item.quantity}</TableCell>
                        <TableCell className="text-text-muted text-xs font-bold uppercase">
                          {item.unit}
                        </TableCell>
                        <TableCell className="text-text-secondary text-xs font-bold uppercase">
                          {item.supplier}
                        </TableCell>
                        <TableCell className="text-text-primary text-right text-xs font-bold">
                          {item.cost.toLocaleString('ru-RU')} ₽
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-text-muted h-8 w-8 rounded-lg hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {bom.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center">
                          <p className="text-text-muted text-[9px] font-black uppercase italic tracking-widest">
                            Спецификация материалов пуста
                          </p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="bg-text-primary flex items-center justify-between rounded-xl p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <Layers className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                      Total Material Cost per Unit
                    </p>
                    <p className="text-sm font-black tracking-tighter">15.30 ₽</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                      Sourcing Efficiency
                    </p>
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
                  <h3 className="text-text-primary text-base font-black uppercase tracking-tight">
                    Таблица измерений (Sizing Table)
                  </h3>
                  <p className="text-text-muted mt-1 text-xs font-medium">
                    Точные замеры для раскройного цеха и QC контроля.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-border-default text-text-muted h-10 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest"
                  >
                    Import S-XL
                  </Button>
                  <Button className="bg-text-primary h-10 rounded-xl px-4 text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
                    <Plus className="mr-1 h-3.5 w-3.5" /> Add Point
                  </Button>
                </div>
              </div>

              <div className="border-border-subtle overflow-hidden rounded-2xl border">
                <Table>
                  <TableHeader className="bg-bg-surface2">
                    <TableRow className="border-none">
                      <TableHead className="text-text-muted text-[9px] font-black uppercase">
                        Measurement Point
                      </TableHead>
                      <TableHead className="text-text-muted text-[9px] font-black uppercase">
                        Tolerance
                      </TableHead>
                      <TableHead className="text-text-muted text-center text-[9px] font-black uppercase">
                        XS
                      </TableHead>
                      <TableHead className="text-text-muted text-center text-[9px] font-black uppercase">
                        S
                      </TableHead>
                      <TableHead className="text-text-muted bg-bg-surface2/50 text-center text-[9px] font-black uppercase">
                        M (Base)
                      </TableHead>
                      <TableHead className="text-text-muted text-center text-[9px] font-black uppercase">
                        L
                      </TableHead>
                      <TableHead className="text-text-muted text-center text-[9px] font-black uppercase">
                        XL
                      </TableHead>
                      <TableHead className="text-text-muted w-[50px] text-right text-[9px] font-black uppercase"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sizing.map((row) => (
                      <TableRow
                        key={row.id}
                        className="hover:bg-bg-surface2 border-border-subtle border-b transition-colors"
                      >
                        <TableCell className="text-text-primary text-xs font-bold uppercase tracking-tight">
                          {row.point}
                        </TableCell>
                        <TableCell className="text-text-muted text-[10px] font-black">
                          {row.tol}
                        </TableCell>
                        <TableCell className="text-center text-xs font-bold">{row.xs}</TableCell>
                        <TableCell className="text-center text-xs font-bold">{row.s}</TableCell>
                        <TableCell className="bg-bg-surface2/80 text-center text-xs font-bold">
                          {row.m}
                        </TableCell>
                        <TableCell className="text-center text-xs font-bold">{row.l}</TableCell>
                        <TableCell className="text-center text-xs font-bold">{row.xl}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-text-muted hover:text-text-primary h-8 w-8 rounded-lg"
                          >
                            <Settings2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {sizing.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="h-32 text-center">
                          <p className="text-text-muted text-[9px] font-black uppercase italic tracking-widest">
                            Таблица измерений пуста
                          </p>
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
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center p-10 text-center">
                <Scissors className="text-text-muted mb-4 h-12 w-12" />
                <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
                  Технологические узлы не определены
                </h4>
                <p className="text-text-muted mt-2 text-[10px] font-bold uppercase">
                  Загрузите эскиз или выберите артикул для начала работы над конструкцией.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                  <div className="bg-bg-surface2 border-border-subtle space-y-4 rounded-xl border p-4">
                    <Label className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                      Stitching Details
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase">Stitch Type</Label>
                        <Select defaultValue="lockstitch">
                          <SelectTrigger className="border-border-subtle rounded-xl bg-white font-bold">
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
                        <Label className="text-[10px] font-bold uppercase">
                          Stitches per Inch (SPI)
                        </Label>
                        <Input
                          defaultValue="12"
                          className="border-border-subtle rounded-xl bg-white font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-bg-surface2 border-border-subtle space-y-4 rounded-xl border p-4">
                    <Label className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
                      Construction Notes
                    </Label>
                    <Textarea
                      placeholder="Special instructions for seam allowances, bonding, or reinforcement..."
                      className="border-border-subtle min-h-[200px] rounded-2xl bg-white p-4 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <Card className="border-border-subtle bg-text-primary relative overflow-hidden rounded-xl border-none p-4 text-white shadow-xl">
                    <div className="absolute right-0 top-0 p-4 opacity-10">
                      <CheckCircle2 className="h-20 w-20" />
                    </div>
                    <div className="relative z-10 space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-accent">
                        Tech Pack Status
                      </p>
                      <h4 className="text-base font-black uppercase tracking-tight">Draft Mode</h4>
                      <p className="text-xs font-medium italic leading-relaxed text-white/50">
                        "Tech pack is currently 65% complete. BOM needs supplier confirmation."
                      </p>
                      <div className="space-y-2 pt-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span>Readiness</span>
                          <span className="text-accent">65%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full bg-accent transition-all duration-1000"
                            style={{ width: '65%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Button className="text-text-primary border-border-subtle hover:bg-bg-surface2 group h-12 w-full rounded-2xl border bg-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                    Send to Marketplace{' '}
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer / Stepper */}
      <div className="border-border-subtle mt-auto flex items-center justify-between border-t bg-white/50 p-4">
        <div className="text-text-muted flex items-center gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              3 Missing Attributes
            </span>
          </div>
          <div className="bg-border-subtle h-4 w-px" />
          <span className="text-[9px] font-bold uppercase italic tracking-widest">
            Last saved: 2 mins ago by Syntha AI
          </span>
        </div>

        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="text-text-muted hover:bg-bg-surface2 h-10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            variant="ghost"
            className="text-text-primary hover:bg-bg-surface2 h-10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest"
          >
            Next Section <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
