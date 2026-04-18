'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  FileText,
  Layers,
  Scissors,
  Scale,
  Download,
  History,
  CheckCircle2,
  Lock,
  Printer,
  ChevronRight,
  ExternalLink,
  Package,
  Plus,
  Timer,
  Box,
  Hash,
  Ruler,
  Info,
  ArrowRight,
  Eye,
  FileSearch,
  Zap,
  Tag,
  MessageSquare,
  MapPin,
  Coins,
  QrCode,
  Barcode,
  Wind,
  Droplets,
  Sun,
  Thermometer,
  CloudRain,
  ShieldAlert,
  ArrowUpRight,
  ClipboardList,
  Pencil,
  Save,
} from 'lucide-react';
import { TechPack, BOMItem, GradingPoint } from '@/lib/types/production';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import InteractiveFitReview from '@/components/brand/product/interactive-fit-review';
import AuditTrailList from '@/components/brand/audit/audit-trail-list';
import { loadTechPackDraft, saveTechPackDraft } from '@/lib/production-data';
import type { TechPackDraftV1 } from '@/lib/production-data';

/**
 * Помощник для отображения аббревиатур с расшифровкой при наведении.
 */
const Acronym = ({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className="cursor-help px-0.5 font-bold underline decoration-indigo-400 decoration-dotted">
        {children}
      </span>
    </TooltipTrigger>
    <TooltipContent className="z-[100] max-w-xs rounded-2xl border-none bg-slate-900 p-4 text-white shadow-2xl">
      <div className="space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">{title}</p>
        {description && (
          <p className="text-[10px] font-medium leading-tight text-slate-300">{description}</p>
        )}
      </div>
    </TooltipContent>
  </Tooltip>
);

export default function TechPackPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = React.use(paramsPromise);
  const id = params?.id || 'TP-9921-A';
  const [activeTab, setActiveTab] = useState<
    | 'bom'
    | 'microbom'
    | 'grading'
    | 'construction'
    | 'history'
    | 'fit'
    | 'operations'
    | 'packaging'
    | 'patterns'
    | 'care'
    | 'specifications'
  >('bom');
  const [showDiff, setShowDiff] = useState(false);
  const [selectedSizeScale, setSelectedSizeScale] = useState('EU');
  const [isApproved, setIsApproved] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleAction = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };

  const sizeScales = {
    EU: ['XS', 'S', 'M', 'L', 'XL'],
    RU: ['42', '44', '46', '48', '50'],
    INT: ['0', '1', '2', '3', '4'],
  };

  // --- STATE FOR EDITABLE DATA ---
  const [bomData, setBomData] = useState([
    {
      id: 'b1',
      category: 'Ткань',
      name: 'Premium Heavy Cotton 320g',
      colorCode: 'Pantone 19-4008 TCX',
      consumptionPerUnit: 1.8,
      unit: 'meters',
      wastageAllowance: 0.05,
      supplier: 'Global Textiles Ltd',
      storage: 'Склад А (Москва)',
    },
    {
      id: 'b2',
      category: 'Фурнитура',
      name: 'Молния YKK Excella 20cm',
      colorCode: 'Gunmetal',
      consumptionPerUnit: 1,
      unit: 'pcs',
      wastageAllowance: 0.02,
      supplier: 'YKK Russia',
      storage: 'Цех #1 (Пошив)',
    },
    {
      id: 'b3',
      category: 'Этикетка',
      name: 'Сатиновая этикетка по уходу',
      colorCode: 'White/Black',
      consumptionPerUnit: 1,
      unit: 'pcs',
      wastageAllowance: 0,
      supplier: 'Label-Pro',
      storage: 'Склад Б (Тверь)',
    },
  ]);

  const [gradingData, setGradingData] = useState([
    {
      measurementName: '1/2 Обхвата груди (под проймой)',
      values: { XS: 54, S: 56, M: 58, L: 60, XL: 62 },
      tolerance: 5,
    },
    {
      measurementName: 'Длина изделия (от высшей точки плеча)',
      values: { XS: 68, S: 70, M: 72, L: 74, XL: 76 },
      tolerance: 10,
    },
    {
      measurementName: 'Длина рукава',
      values: { XS: 62, S: 63, M: 64, L: 65, XL: 66 },
      tolerance: 5,
    },
    {
      measurementName: 'Ширина плеча',
      values: { XS: 12, S: 12.5, M: 13, L: 13.5, XL: 14 },
      tolerance: 2,
    },
  ]);

  const [patternsData, setPatternsData] = useState([
    { name: 'Полочка', qty: 1, material: 'Main', length: '72 см', area: '0.45 sq.m' },
    { name: 'Спинка', qty: 1, material: 'Main', length: '74 см', area: '0.48 sq.m' },
    { name: 'Рукав (L/R)', qty: 2, material: 'Main', length: '64 см', area: '0.32 sq.m' },
    { name: 'Воротник-стойка', qty: 2, material: 'Main', length: '45 см', area: '0.05 sq.m' },
    { name: 'Манжеты', qty: 2, material: 'Main', length: '24 см', area: '0.04 sq.m' },
  ]);

  const [careData, setCareData] = useState({
    instructions: [
      { icon: Droplets, label: 'Стирка', value: 'Деликатная 30 deg C', color: 'text-sky-500' },
      { icon: ShieldAlert, label: 'Отбеливание', value: 'Запрещено', color: 'text-rose-500' },
      {
        icon: Thermometer,
        label: 'Глажка',
        value: 'Низкая темп. (110 deg C)',
        color: 'text-amber-500',
      },
      { icon: Wind, label: 'Сушка', value: 'В тени, без отжима', color: 'text-indigo-500' },
    ],
    labelText: '95% Хлопок, 5% Эластан\nСделано в России\nРазмер: M (46-48)',
    labelSpecs: [
      { label: 'Тип носителя:', value: 'Сатин (Soft Touch)' },
      { label: 'Размер бирки:', value: '25х60 мм' },
      { label: 'Способ крепления:', value: 'В шве (Loop fold)' },
    ],
  });

  const [specsData, setSpecsData] = useState({
    threads: [
      { label: 'Основные швы', value: 'Aman Serafil #120 / Needles #70-80' },
      { label: 'Декоративные', value: 'Aman Serafil #80 / Needles #90' },
      { label: 'Обметка', value: 'Текстурированная #160' },
    ],
    ironing: [
      { label: 'Температура пресса', value: '140 deg C - 150 deg C' },
      { label: 'Давление', value: '0.3 - 0.4 N/sq.cm' },
      { label: 'Выдержка', value: '12 - 15 секунд' },
    ],
    special: [
      'Проверять на ласы после глажки.',
      'Использовать тефлон на подошву утюга.',
      'Избегать растяжения горловины.',
    ],
  });

  const [seamsData, setSeamsData] = useState([
    { type: '4-ниточный оверлок', thread: 'Silk #40', usage: 'Стачивание боковых швов' },
    { type: 'Цепной стежок', thread: 'Nylon #60', usage: 'Обработка низа' },
    { type: 'Плоский шов', thread: 'Cotton #50', usage: 'Горловина' },
  ]);

  const [smvData, setSmvData] = useState([
    { name: 'Пошив воротника и стойки', time: 2.5, rate: 12.5, rank: '4 р.' },
    { name: 'Притачивание рукавов', time: 4.2, rate: 11.0, rank: '3 р.' },
    { name: 'Обработка низа изделия', time: 1.8, rate: 11.0, rank: '3 р.' },
    { name: 'Установка фурнитуры', time: 3.0, rate: 15.0, rank: '5 р.' },
  ]);

  const [packData, setPackData] = useState({
    folding:
      'Сложить пополам лицевой стороной внутрь, рукава скрестить. Вложить картонную вставку (30х20см). В зип-пакет с лого.',
    marking: ['ЧЗ (КИЗ)', 'EAN-13', 'Составник', 'Размерник'],
    box: '24 ед. в короб (60x40x40 см) • 8.4 кг',
  });

  const [historyData, setHistoryData] = useState([
    {
      version: '2.4',
      date: '10.03.2026',
      author: 'Анна К.',
      changes: 'Обновлена ведомость материалов (BOM), изменен расход основной ткани.',
    },
    {
      version: '2.3',
      date: '05.03.2026',
      author: 'Ли Вэй',
      changes: 'Добавлены схемы обработки узлов воротника.',
    },
    {
      version: '2.2',
      date: '01.03.2026',
      author: 'Анна К.',
      changes: 'Корректировка табеля мер после первой примерки.',
    },
  ]);

  const buildDraft = (approved: boolean): TechPackDraftV1 => ({
    v: 1,
    styleId: id,
    selectedSizeScale,
    isApproved: approved,
    bomData,
    gradingData,
    patternsData,
    careData: {
      labelText: careData.labelText,
      labelSpecs: careData.labelSpecs,
    },
    specsData: specsData as Record<string, unknown>,
    seamsData,
    smvData,
    packData: packData as Record<string, unknown>,
    historyData,
    updatedAt: new Date().toISOString(),
  });

  React.useEffect(() => {
    const d = loadTechPackDraft(id);
    if (!d) return;
    setSelectedSizeScale(d.selectedSizeScale);
    setIsApproved(d.isApproved);
    setBomData(d.bomData as typeof bomData);
    setGradingData(d.gradingData as typeof gradingData);
    setPatternsData(d.patternsData as typeof patternsData);
    setSpecsData(d.specsData as typeof specsData);
    setSeamsData(d.seamsData as typeof seamsData);
    setSmvData(d.smvData as typeof smvData);
    setPackData(d.packData as typeof packData);
    setHistoryData(d.historyData as typeof historyData);
    const c = d.careData as { labelText?: string; labelSpecs?: typeof careData.labelSpecs };
    if (c?.labelText != null || c?.labelSpecs != null) {
      setCareData((prev) => ({
        ...prev,
        ...(c.labelText != null ? { labelText: c.labelText } : {}),
        ...(c.labelSpecs != null ? { labelSpecs: c.labelSpecs } : {}),
      }));
    }
  }, [id]);

  // --- HANDLERS FOR EDITING ---
  const handleSaveAll = () => {
    saveTechPackDraft(buildDraft(isApproved));
    setIsEditing(false);
    toast({
      title: 'Черновик сохранён',
      description:
        'Данные Tech Pack записаны локально (слой production-data). Позже подключится API.',
    });
  };

  const addItem = (type: string) => {
    if (type === 'bom') {
      setBomData([
        ...bomData,
        {
          id: `b${bomData.length + 1}`,
          category: 'Новая',
          name: 'Новый материал',
          colorCode: '-',
          consumptionPerUnit: 0,
          unit: 'meters',
          wastageAllowance: 0,
          supplier: '-',
          storage: '-',
        },
      ]);
    } else if (type === 'grading') {
      setGradingData([
        ...gradingData,
        {
          measurementName: 'Новая точка',
          values: { XS: 0, S: 0, M: 0, L: 0, XL: 0 },
          tolerance: 0,
        },
      ]);
    } else if (type === 'patterns') {
      setPatternsData([
        ...patternsData,
        { name: 'Новая деталь', qty: 1, material: 'Main', length: '-', area: '-' },
      ]);
    } else if (type === 'seams') {
      setSeamsData([...seamsData, { type: 'Новый шов', thread: '-', usage: '-' }]);
    } else if (type === 'smv') {
      setSmvData([...smvData, { name: 'Новая операция', time: 0, rate: 0, rank: '-' }]);
    }
  };

  const removeItem = (type: string, index: number) => {
    if (type === 'bom') {
      setBomData(bomData.filter((_, i) => i !== index));
    } else if (type === 'grading') {
      setGradingData(gradingData.filter((_, i) => i !== index));
    } else if (type === 'patterns') {
      setPatternsData(patternsData.filter((_, i) => i !== index));
    } else if (type === 'seams') {
      setSeamsData(seamsData.filter((_, i) => i !== index));
    } else if (type === 'smv') {
      setSmvData(smvData.filter((_, i) => i !== index));
    }
  };

  const updateItem = (type: string, index: number, field: string, value: any) => {
    if (type === 'bom') {
      const newData = [...bomData];
      (newData[index] as any)[field] = value;
      setBomData(newData);
    } else if (type === 'grading') {
      const newData = [...gradingData];
      (newData[index] as any)[field] = value;
      setGradingData(newData);
    } else if (type === 'patterns') {
      const newData = [...patternsData];
      (newData[index] as any)[field] = value;
      setPatternsData(newData);
    } else if (type === 'smv') {
      const newData = [...smvData];
      (newData[index] as any)[field] = value;
      setSmvData(newData);
    }
  };

  const updateGradingValue = (rowIndex: number, size: string, value: number) => {
    const newData = [...gradingData];
    newData[rowIndex].values[size] = value;
    setGradingData(newData);
  };

  // Mock Tech Pack Data (for UI display only)
  const techPack: any = {
    id: 'TP-9921-A',
    productId: 'P-101',
    version: '2.4',
    status: isApproved ? 'approved' : 'pending',
    bom: bomData,
    grading: gradingData,
    seams: seamsData,
    attachments: [
      { name: 'patterns_v2.4.dxf', url: '#' },
      { name: 'construction_guide.pdf', url: '#' },
      { name: '3d_render_front.glb', url: '#' },
    ],
  };

  const patternPieces = patternsData;
  const careInstructions = careData.instructions;

  return (
    <TooltipProvider>
      <div className="container mx-auto max-w-5xl space-y-4 px-4 py-4 pb-24">
        <header className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-3 md:flex-row md:items-end">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
              <Link href="/brand/production" className="transition-colors hover:text-indigo-600">
                Production
              </Link>
              <ChevronRight className="h-2 w-2" />
              <span className="text-slate-300">Tech Pack</span>
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-headline text-xl font-black uppercase leading-none tracking-tighter text-slate-900 md:text-2xl">
                Digital Tech Pack 2.0
              </h1>
              <Badge
                variant="outline"
                className={cn(
                  'h-5 gap-1 px-2 text-[8px] font-bold uppercase tracking-widest shadow-sm transition-all',
                  isApproved
                    ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                    : 'border-amber-100 bg-amber-50 text-amber-600'
                )}
              >
                {isApproved ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Timer className="h-3.5 w-3.5" />
                )}
                {isApproved ? 'Утвержден' : 'На проверке'}
              </Badge>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">
              v{techPack.version} • 10.03.2026 • Анна К.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
            <Button
              variant="ghost"
              onClick={() => {
                if (isEditing) handleSaveAll();
                else setIsEditing(true);
              }}
              className={cn(
                'h-7 gap-1.5 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all',
                isEditing
                  ? 'border-none bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-white text-indigo-600 hover:bg-indigo-50'
              )}
            >
              {isEditing ? <Save className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
              {isEditing ? 'Сохранить всё' : 'Редактировать'}
            </Button>
            <Button
              variant="ghost"
              className="h-7 gap-1.5 rounded-lg bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:bg-slate-50"
            >
              <Printer className="h-3 w-3 text-slate-400" /> PDF
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowDiff(!showDiff)}
              className={cn(
                'h-7 gap-1.5 rounded-lg bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all',
                showDiff && 'border-none bg-amber-500 text-white hover:bg-amber-600'
              )}
            >
              <History className="h-3 w-3" /> {showDiff ? 'Режим сравнения' : 'Сравнить'}
            </Button>
            <Button
              onClick={() => {
                const next = !isApproved;
                setIsApproved(next);
                saveTechPackDraft(buildDraft(next));
                toast({
                  title: next ? 'Статус: утверждён' : 'Утверждение снято',
                  description: 'Сохранено локально. После API — синхронизация с сервером.',
                });
              }}
              className={cn(
                'h-7 gap-1.5 rounded-lg px-4 text-[9px] font-bold uppercase tracking-widest shadow-md transition-all',
                isApproved
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-slate-900 text-white hover:bg-indigo-600'
              )}
            >
              <Lock className={cn('h-3 w-3', isApproved ? 'text-white' : 'text-amber-400')} />
              {isApproved ? 'Утверждено' : 'Утвердить'} <Acronym title="Gold Sample">GS</Acronym>
            </Button>
          </div>
        </header>

        {showDiff && (
          <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-3 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white shadow-md shadow-amber-100">
                <Eye className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase leading-none tracking-widest text-amber-900">
                  Сравнение: v2.4 vs v2.3
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase leading-none text-amber-700/60">
                  Изменения в BOM и Табеле мер.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowDiff(false)}
              className="h-7 px-3 text-[9px] font-bold uppercase tracking-widest text-amber-900 hover:bg-amber-100"
            >
              Закрыть
            </Button>
          </div>
        )}

        <div className="grid gap-3 lg:grid-cols-4">
          {/* Sidebar Stats & Info */}
          <div className="mx-auto w-full max-w-xl space-y-3 lg:max-w-none">
            <Card className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100 hover:shadow-md">
              <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-slate-50/50">
                <FileText className="h-12 w-12 text-slate-100 transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2.5 bg-slate-900/60 p-4 opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                    Digital Twin
                  </p>
                  <Button
                    onClick={() =>
                      handleAction(
                        '3D Viewer',
                        'Запуск интерактивного модуля просмотра 3D-модели изделия...'
                      )
                    }
                    className="h-8 gap-1.5 rounded-lg border-none bg-white px-4 text-[8px] font-bold uppercase text-slate-900 shadow-xl transition-all hover:scale-105"
                  >
                    <Zap className="h-3 w-3 text-amber-500" /> 3D Viewer PRO
                  </Button>
                </div>
                <Badge className="absolute right-2.5 top-2.5 h-4 border-none bg-slate-900 px-1.5 text-[7px] font-bold uppercase tracking-widest text-white">
                  3D ASSET READY
                </Badge>
              </div>
              <CardContent className="space-y-3.5 p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="mb-0.5 text-[7px] font-bold uppercase leading-none tracking-widest text-slate-400">
                      Артикул
                    </p>
                    <p className="text-[11px] font-bold uppercase leading-none tracking-tight text-slate-900">
                      {techPack.id}
                    </p>
                  </div>
                  <div>
                    <p className="mb-0.5 text-[7px] font-bold uppercase leading-none tracking-widest text-slate-400">
                      Сезон
                    </p>
                    <p className="text-[11px] font-bold uppercase leading-none tracking-tight text-slate-900">
                      SS-2026
                    </p>
                  </div>
                </div>
                <div className="space-y-2 border-t border-slate-50 pt-3">
                  <p className="text-[7px] font-bold uppercase leading-none tracking-widest text-slate-400">
                    Цифровые лекала (CAD)
                  </p>
                  <div className="space-y-1">
                    <Button
                      onClick={() =>
                        handleAction(
                          'Download CAD',
                          'Подготовка и скачивание архива с лекалами в формате DXF/ASTM...'
                        )
                      }
                      variant="ghost"
                      className="group h-8 w-full justify-between rounded-lg border border-slate-100 bg-slate-50 text-[8px] font-bold uppercase transition-all hover:border-indigo-200 hover:bg-white"
                    >
                      <span className="mr-2 truncate text-slate-600">patterns_v2.4.dxf</span>
                      <Download className="h-3 w-3 text-indigo-600 transition-transform group-hover:scale-110" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-indigo-600 p-4 text-white shadow-md transition-colors hover:bg-indigo-700">
              <div className="absolute -bottom-4 -right-4 opacity-10 transition-transform duration-700 group-hover:scale-110">
                <Package className="h-12 w-12" />
              </div>
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg border border-white/20 bg-white/10 p-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Снабжение (AI)
                  </span>
                </div>
                <p className="text-[9px] font-bold uppercase leading-tight tracking-tight text-indigo-100">
                  Потребность на <span className="text-white">500 ед</span>.<br />
                  Бронь 900м ткани.
                </p>
                <Button
                  onClick={() =>
                    handleAction(
                      'Заказ материалов',
                      'Автоматическая заявка на ткани и фурнитуру отправлена поставщикам.'
                    )
                  }
                  className="h-8 w-full rounded-lg border-none bg-white text-[8px] font-bold uppercase tracking-widest text-indigo-600 shadow-lg transition-all hover:bg-indigo-50 active:scale-95"
                >
                  Заказать материалы
                </Button>
              </div>
            </Card>

            <Card className="group rounded-2xl border border-slate-100 bg-slate-900 p-4 text-white shadow-sm transition-colors hover:bg-slate-800">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-emerald-400 shadow-inner transition-transform group-hover:scale-105">
                  <Coins className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-[11px] font-black uppercase leading-none tracking-widest text-white">
                  Финансы SKU
                </h3>
              </div>
              <div className="mb-3 space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-1">
                  <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-white/40">
                    Целевая себест.
                  </p>
                  <p className="text-sm font-black uppercase leading-none tracking-tight">
                    1,850 ₽
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-white/40">
                    Факт (CMT+BOM)
                  </p>
                  <p className="text-sm font-black uppercase leading-none tracking-tight text-emerald-400">
                    1,740 ₽
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() =>
                  handleAction(
                    'Cost Analysis',
                    'Формирование детального финансового отчета по SKU...'
                  )
                }
                className="h-7 w-full rounded-lg bg-white/10 text-[8px] font-bold uppercase tracking-widest text-white transition-all hover:bg-white/20"
              >
                Отчет по костам
              </Button>
            </Card>

            <Card className="group rounded-2xl border border-slate-100 bg-slate-900 p-4 text-white shadow-sm transition-colors hover:bg-slate-800">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-indigo-400 shadow-inner transition-transform group-hover:scale-105">
                  <MessageSquare className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-[10px] font-bold uppercase leading-none tracking-widest text-white">
                  Голос цеха
                </h3>
              </div>
              <div className="mb-3 rounded-xl border border-white/10 bg-white/5 p-2.5 transition-colors group-hover:border-indigo-500/30">
                <p className="text-[8px] font-bold uppercase leading-tight tracking-tight text-indigo-100">
                  "Шов на этой ткани будет тянуть. Рекомендую сменить нить."
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() =>
                  handleAction(
                    'Голос цеха',
                    'Открыт контекстный чат с производством для обсуждения технологии.'
                  )
                }
                className="h-7 w-full rounded-lg bg-indigo-600 text-[8px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-indigo-500"
              >
                Ответить
              </Button>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="mx-auto w-full max-w-4xl space-y-4 lg:col-span-3 lg:max-w-none">
            <div className="no-scrollbar flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 shadow-inner">
              {[
                { id: 'bom', label: 'BOM', title: 'Ведомость материалов' },
                {
                  id: 'microbom',
                  label: 'Micro-BOM',
                  title: 'Нитки, пуговицы, этикетки до копейки',
                },
                { id: 'patterns', label: 'Lecala', title: 'Спецификация деталей (лекал)' },
                { id: 'grading', label: 'Grading', title: 'Табель мер' },
                { id: 'construction', label: 'Seams', title: 'Схемы швов и узлов' },
                { id: 'care', label: 'Care', title: 'Уход и Бирки' },
                { id: 'specifications', label: 'Spec.', title: 'Техническая спецификация (ТЗ)' },
                { id: 'operations', label: 'SMV', title: 'Пооперационный расчет' },
                { id: 'packaging', label: 'Pack.', title: 'Упаковка' },
                { id: 'fit', label: 'Fit', title: 'Примерки' },
                { id: 'history', label: 'History', title: 'История' },
              ].map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  variant="ghost"
                  className={cn(
                    'h-7 whitespace-nowrap rounded-lg px-3.5 text-[9px] font-bold uppercase tracking-widest transition-all duration-200',
                    activeTab === tab.id
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  )}
                >
                  <Acronym title={tab.title}>{tab.label}</Acronym>
                </Button>
              ))}
            </div>

            <Card className="min-h-[400px] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-500 animate-in fade-in hover:border-indigo-100/50">
              <CardContent className="p-0">
                {activeTab === 'bom' && (
                  <div className="overflow-x-auto duration-500 animate-in slide-in-from-right-2">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="h-9 border-none hover:bg-transparent">
                          <TableHead className="h-9 py-2 pl-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Категория
                          </TableHead>
                          <TableHead className="h-9 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Материал / Цвет
                          </TableHead>
                          <TableHead className="h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Расход
                          </TableHead>
                          <TableHead className="h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Брак
                          </TableHead>
                          <TableHead className="h-9 pr-4 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            {isEditing ? 'Действия' : 'Поставщик'}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bomData.map((item, idx) => (
                          <TableRow
                            key={item.id}
                            className={cn(
                              'group h-12 border-slate-100 transition-colors hover:bg-slate-50/50',
                              showDiff &&
                                idx === 1 &&
                                'border-l-4 border-l-emerald-400 bg-emerald-50/30'
                            )}
                          >
                            <TableCell className="py-2 pl-4">
                              {isEditing ? (
                                <select
                                  value={item.category}
                                  onChange={(e) =>
                                    updateItem('bom', idx, 'category', e.target.value)
                                  }
                                  className="h-6 rounded border border-slate-200 bg-white px-1 text-[8px] font-bold uppercase outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                  <option value="Ткань">Ткань</option>
                                  <option value="Фурнитура">Фурнитура</option>
                                  <option value="Этикетка">Этикетка</option>
                                  <option value="Упаковка">Упаковка</option>
                                </select>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="h-3.5 border-slate-200 bg-white px-1.5 text-[7px] font-bold uppercase tracking-widest transition-colors group-hover:border-indigo-200"
                                >
                                  {item.category}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="py-2">
                              <div className="space-y-0.5">
                                {isEditing ? (
                                  <div className="space-y-1">
                                    <input
                                      value={item.name}
                                      onChange={(e) =>
                                        updateItem('bom', idx, 'name', e.target.value)
                                      }
                                      className="h-6 w-full rounded border border-slate-200 bg-white px-1 text-[10px] font-bold uppercase tracking-tight text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <input
                                      value={item.colorCode}
                                      onChange={(e) =>
                                        updateItem('bom', idx, 'colorCode', e.target.value)
                                      }
                                      placeholder="Цвет/Код"
                                      className="h-5 w-full rounded border border-slate-200 bg-white px-1 text-[7px] font-bold uppercase tracking-widest text-slate-500 outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-[10px] font-bold uppercase leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                                      {item.name}
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                      <div className="flex items-center gap-1 rounded bg-slate-100 px-1 py-0.5 text-[7px] font-bold uppercase tracking-widest text-slate-500">
                                        <Tag className="h-2.5 w-2.5 text-indigo-400" />{' '}
                                        {item.colorCode}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-2 text-center">
                              <div className="flex flex-col items-center">
                                {isEditing ? (
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      value={item.consumptionPerUnit}
                                      onChange={(e) =>
                                        updateItem(
                                          'bom',
                                          idx,
                                          'consumptionPerUnit',
                                          parseFloat(e.target.value)
                                        )
                                      }
                                      className="h-6 w-12 rounded border border-slate-200 bg-white px-1 text-center font-mono text-[11px] font-bold text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <select
                                      value={item.unit}
                                      onChange={(e) =>
                                        updateItem('bom', idx, 'unit', e.target.value)
                                      }
                                      className="h-6 rounded border border-slate-200 bg-white px-1 text-[7px] font-bold uppercase text-slate-400 outline-none"
                                    >
                                      <option value="meters">м</option>
                                      <option value="pcs">шт</option>
                                    </select>
                                  </div>
                                ) : (
                                  <>
                                    <span className="font-mono text-[11px] font-bold tracking-tighter text-slate-900">
                                      {item.consumptionPerUnit}
                                    </span>
                                    <span className="text-[7px] font-bold uppercase leading-none tracking-widest text-slate-400">
                                      {item.unit === 'meters' ? 'м' : 'шт'}
                                    </span>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-2 text-center">
                              {isEditing ? (
                                <div className="flex items-center justify-center gap-0.5">
                                  <span className="text-[10px] text-slate-400">+</span>
                                  <input
                                    type="number"
                                    value={item.wastageAllowance * 100}
                                    onChange={(e) =>
                                      updateItem(
                                        'bom',
                                        idx,
                                        'wastageAllowance',
                                        parseFloat(e.target.value) / 100
                                      )
                                    }
                                    className="h-6 w-8 rounded border border-slate-200 bg-white px-1 text-center text-[10px] font-bold text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                  <span className="text-[10px] text-slate-400">%</span>
                                </div>
                              ) : (
                                <span className="text-[10px] font-bold tracking-tighter text-slate-900">
                                  +{item.wastageAllowance * 100}%
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="py-2 pr-4 text-right">
                              {isEditing ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeItem('bom', idx)}
                                  className="h-6 w-6 text-rose-500 hover:bg-rose-50"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              ) : (
                                <div className="flex flex-col items-end gap-0.5">
                                  <p className="text-[9px] font-bold uppercase leading-tight tracking-widest text-slate-900 transition-colors group-hover:text-indigo-600">
                                    {item.supplier}
                                  </p>
                                  <p className="text-[7px] font-bold uppercase leading-tight tracking-tight text-slate-400">
                                    <MapPin className="mr-1 inline h-2.5 w-2.5 text-indigo-400" />{' '}
                                    {item.storage}
                                  </p>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        {isEditing && (
                          <TableRow className="border-none hover:bg-transparent">
                            <TableCell colSpan={5} className="p-2">
                              <Button
                                onClick={() => addItem('bom')}
                                className="h-8 w-full border-2 border-dashed border-slate-200 bg-transparent text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:border-indigo-100 hover:text-indigo-600"
                              >
                                <Plus className="mr-2 h-3 w-3" /> Добавить материал
                              </Button>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {activeTab === 'microbom' && (
                  <div className="p-4 duration-500 animate-in slide-in-from-right-2">
                    <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      Micro-BOM — спецификация до копейки
                    </p>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-200">
                          <TableHead className="text-[9px] font-bold uppercase">Позиция</TableHead>
                          <TableHead className="text-[9px] font-bold uppercase">
                            Расход на ед.
                          </TableHead>
                          <TableHead className="text-[9px] font-bold uppercase">
                            Цена за ед., ₽
                          </TableHead>
                          <TableHead className="text-right text-[9px] font-bold uppercase">
                            Сумма, ₽
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          { pos: 'Нитки основная', qty: '120 м', price: 0.8, sum: 96 },
                          { pos: 'Нитки обмётка', qty: '45 м', price: 0.5, sum: 22.5 },
                          { pos: 'Пуговицы 4 шт', qty: '4', price: 12, sum: 48 },
                          { pos: 'Этикетка состав', qty: '1', price: 2.5, sum: 2.5 },
                          { pos: 'Бирка размер', qty: '1', price: 1.8, sum: 1.8 },
                          { pos: 'Упаковка зип', qty: '1', price: 8, sum: 8 },
                        ].map((r, i) => (
                          <TableRow key={i} className="border-slate-100">
                            <TableCell className="text-[10px] font-medium">{r.pos}</TableCell>
                            <TableCell className="text-[10px]">{r.qty}</TableCell>
                            <TableCell className="text-[10px] tabular-nums">{r.price}</TableCell>
                            <TableCell className="text-right text-[10px] font-bold tabular-nums">
                              {r.sum}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t-2 border-slate-200 bg-slate-50 font-black">
                          <TableCell colSpan={3} className="text-[10px]">
                            Итого Micro-BOM
                          </TableCell>
                          <TableCell className="text-right tabular-nums">178.80 ₽</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}

                {activeTab === 'grading' && (
                  <div className="space-y-0 duration-500 animate-in slide-in-from-right-2">
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-3">
                      <div className="flex items-center gap-3">
                        <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                          Размерная сетка:
                        </p>
                        <div className="flex gap-1 rounded-lg border border-slate-200/50 bg-white p-0.5 shadow-inner">
                          {Object.keys(sizeScales).map((scale) => (
                            <button
                              key={scale}
                              onClick={() => setSelectedSizeScale(scale)}
                              className={cn(
                                'h-5 rounded-md px-2.5 text-[8px] font-bold uppercase transition-all',
                                selectedSizeScale === scale
                                  ? 'bg-indigo-600 text-white shadow-sm'
                                  : 'text-slate-400 hover:text-slate-600'
                              )}
                            >
                              {scale}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {isEditing && (
                          <Button
                            onClick={() => addItem('grading')}
                            className="h-6 gap-1.5 rounded-lg bg-indigo-600 px-3 text-[8px] font-bold uppercase text-white shadow-sm transition-all hover:bg-indigo-700"
                          >
                            <Plus className="h-2.5 w-2.5" /> Добавить точку
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 gap-1.5 rounded-lg border border-slate-200 bg-white text-[8px] font-bold uppercase text-slate-600 shadow-sm transition-all hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <ClipboardList className="h-2.5 w-2.5" /> Справочник ГОСТ
                        </Button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-slate-50/30">
                          <TableRow className="h-9 border-none hover:bg-transparent">
                            <TableHead className="h-9 py-2 pl-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                              Точка измерения
                            </TableHead>
                            {sizeScales[selectedSizeScale as keyof typeof sizeScales].map(
                              (size) => (
                                <TableHead
                                  key={size}
                                  className="h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-600"
                                >
                                  {size}
                                </TableHead>
                              )
                            )}
                            <TableHead className="h-9 pr-4 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-rose-400">
                              {isEditing ? 'Действия' : 'Допуск'}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {gradingData.map((point, i) => (
                            <TableRow
                              key={i}
                              className="group h-10 border-slate-100 transition-colors hover:bg-slate-50/50"
                            >
                              <TableCell className="py-2 pl-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="flex h-5 w-5 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-[8px] font-bold text-slate-400 shadow-inner transition-all group-hover:bg-indigo-600 group-hover:text-white">
                                    {i + 1}
                                  </div>
                                  {isEditing ? (
                                    <input
                                      value={point.measurementName}
                                      onChange={(e) =>
                                        updateItem('grading', i, 'measurementName', e.target.value)
                                      }
                                      className="h-6 w-full rounded border border-slate-200 bg-white px-1 text-[10px] font-bold uppercase tracking-tight text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                  ) : (
                                    <p className="text-[10px] font-bold uppercase leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                                      {point.measurementName}
                                    </p>
                                  )}
                                </div>
                              </TableCell>
                              {sizeScales[selectedSizeScale as keyof typeof sizeScales].map(
                                (size, idx) => (
                                  <TableCell key={idx} className="py-2 text-center">
                                    {isEditing ? (
                                      <input
                                        type="number"
                                        value={point.values[size] || 0}
                                        onChange={(e) =>
                                          updateGradingValue(i, size, parseFloat(e.target.value))
                                        }
                                        className="h-6 w-12 rounded border border-slate-200 bg-white px-1 text-center font-mono text-[11px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                                      />
                                    ) : (
                                      <span className="font-mono text-[11px] font-bold tracking-tighter text-slate-700">
                                        {point.values[size] || 0}
                                      </span>
                                    )}
                                  </TableCell>
                                )
                              )}
                              <TableCell className="py-2 pr-4 text-right">
                                {isEditing ? (
                                  <div className="flex items-center justify-end gap-1.5">
                                    <span className="text-[10px] text-rose-400">±</span>
                                    <input
                                      type="number"
                                      value={point.tolerance}
                                      onChange={(e) =>
                                        updateItem(
                                          'grading',
                                          i,
                                          'tolerance',
                                          parseFloat(e.target.value)
                                        )
                                      }
                                      className="h-6 w-8 rounded border border-slate-200 bg-white px-1 text-center text-[10px] font-bold text-rose-400 outline-none focus:ring-1 focus:ring-rose-500"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeItem('grading', i)}
                                      className="ml-1 h-6 w-6 text-rose-500 hover:bg-rose-50"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-[10px] font-bold tracking-tighter text-rose-400">
                                    ±{point.tolerance} мм
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {activeTab === 'patterns' && (
                  <div className="overflow-x-auto duration-500 animate-in slide-in-from-right-2">
                    <div className="group/header flex items-center justify-between border-b border-white/10 bg-slate-900 p-4 text-white">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg border border-white/20 bg-white/10 p-2 transition-transform group-hover/header:scale-105">
                          <Layers className="h-3.5 w-3.5 text-amber-400" />
                        </div>
                        <div>
                          <h3 className="mb-1 text-[10px] font-bold uppercase leading-none tracking-widest">
                            Спецификация лекал
                          </h3>
                          <p className="text-[8px] font-bold uppercase leading-none tracking-[0.2em] text-white/40">
                            Pattern Piece Inventory
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        {isEditing && (
                          <Button
                            onClick={() => addItem('patterns')}
                            className="h-7 gap-1.5 rounded-lg bg-indigo-600 text-[8px] font-bold uppercase tracking-widest text-white transition-all hover:bg-indigo-500"
                          >
                            <Plus className="h-3 w-3" /> Добавить деталь
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1.5 rounded-lg border border-white/10 bg-white/5 text-[8px] font-bold uppercase tracking-widest text-white transition-all hover:bg-white/20"
                        >
                          <Download className="h-3 w-3" /> DXF
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1.5 rounded-lg border border-white/10 bg-white/5 text-[8px] font-bold uppercase tracking-widest text-white transition-all hover:bg-white/20"
                        >
                          <History className="h-3 w-3" /> Ревизии
                        </Button>
                      </div>
                    </div>
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="h-9 border-none">
                          <TableHead className="h-9 pl-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Деталь
                          </TableHead>
                          <TableHead className="h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Кол-во
                          </TableHead>
                          <TableHead className="h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Материал
                          </TableHead>
                          <TableHead className="h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Длина (см)
                          </TableHead>
                          <TableHead className="h-9 pr-4 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            {isEditing ? 'Действия' : 'Площадь'}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patternsData.map((piece, i) => (
                          <TableRow
                            key={i}
                            className="group h-10 border-slate-100 transition-colors hover:bg-slate-50/50"
                          >
                            <TableCell className="pl-4">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/50 bg-slate-100 shadow-inner transition-transform group-hover:scale-110">
                                  <Scissors className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600" />
                                </div>
                                {isEditing ? (
                                  <input
                                    value={piece.name}
                                    onChange={(e) =>
                                      updateItem('patterns', i, 'name', e.target.value)
                                    }
                                    className="h-6 rounded border border-slate-200 bg-white px-1 text-[10px] font-bold uppercase leading-none text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                ) : (
                                  <p className="text-[10px] font-bold uppercase leading-none text-slate-900 transition-colors group-hover:text-indigo-600">
                                    {piece.name}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={piece.qty}
                                  onChange={(e) =>
                                    updateItem('patterns', i, 'qty', parseInt(e.target.value))
                                  }
                                  className="h-6 w-10 rounded border border-slate-200 bg-white px-1 text-center font-mono text-[11px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              ) : (
                                <span className="font-mono text-[11px] font-bold text-slate-700">
                                  {piece.qty}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {isEditing ? (
                                <select
                                  value={piece.material}
                                  onChange={(e) =>
                                    updateItem('patterns', i, 'material', e.target.value)
                                  }
                                  className="h-6 rounded border border-slate-200 bg-white px-1 text-[7px] font-bold uppercase outline-none"
                                >
                                  <option value="Main">Main</option>
                                  <option value="Lining">Lining</option>
                                  <option value="Fusing">Fusing</option>
                                </select>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="h-3.5 border-slate-200 bg-white px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm"
                                >
                                  {piece.material}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {isEditing ? (
                                <input
                                  value={piece.length}
                                  onChange={(e) =>
                                    updateItem('patterns', i, 'length', e.target.value)
                                  }
                                  className="h-6 w-16 rounded border border-slate-200 bg-white px-1 text-center font-mono text-[11px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              ) : (
                                <span className="font-mono text-[11px] font-bold text-slate-700">
                                  {piece.length}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="pr-4 text-right">
                              {isEditing ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeItem('patterns', i)}
                                  className="h-6 w-6 text-rose-500 hover:bg-rose-50"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              ) : (
                                <span className="font-mono text-[11px] font-bold uppercase tracking-tighter text-indigo-600">
                                  {piece.area}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {activeTab === 'care' && (
                  <div className="space-y-6 p-4 duration-500 animate-in slide-in-from-right-2">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                          <Sun className="h-3.5 w-3.5 text-amber-500" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                            Символы ухода (ISO 3758)
                          </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          {careData.instructions.map((item, i) => (
                            <div
                              key={i}
                              className="group relative flex cursor-default flex-col items-center gap-1.5 rounded-xl border border-slate-100/50 bg-slate-50/50 p-3 transition-all hover:border-indigo-100 hover:bg-white hover:shadow-sm"
                            >
                              <item.icon
                                className={cn(
                                  'h-5 w-5 transition-transform group-hover:scale-110',
                                  item.color
                                )}
                              />
                              <p className="text-[7px] font-bold uppercase leading-none tracking-widest text-slate-400">
                                {item.label}
                              </p>
                              {isEditing ? (
                                <input
                                  value={item.value}
                                  onChange={(e) => {
                                    const newInstructions = [...careData.instructions];
                                    newInstructions[i].value = e.target.value;
                                    setCareData({ ...careData, instructions: newInstructions });
                                  }}
                                  className="h-5 w-full rounded border border-slate-200 bg-white px-1 text-center text-[9px] font-bold uppercase leading-tight tracking-tight text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              ) : (
                                <p className="text-center text-[9px] font-bold uppercase leading-tight tracking-tight text-slate-900">
                                  {item.value}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                          <Tag className="h-3.5 w-3.5 text-indigo-600" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                            Спецификация составника
                          </h4>
                        </div>
                        <Card className="group space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 shadow-inner transition-all hover:border-indigo-100">
                          <div className="space-y-1.5 border-b border-slate-200/50 pb-3 text-center">
                            <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-slate-400">
                              Текст на этикетке
                            </p>
                            {isEditing ? (
                              <textarea
                                value={careData.labelText}
                                onChange={(e) =>
                                  setCareData({ ...careData, labelText: e.target.value })
                                }
                                className="h-20 w-full rounded border border-slate-200 bg-white p-2 text-[10px] font-bold uppercase leading-relaxed text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            ) : (
                              <p className="whitespace-pre-line text-[10px] font-bold uppercase leading-relaxed text-slate-700 transition-colors group-hover:text-slate-900">
                                {careData.labelText}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            {careData.labelSpecs.map((spec, i) => (
                              <div
                                key={i}
                                className="flex justify-between text-[8px] font-bold uppercase"
                              >
                                <span className="text-slate-400">{spec.label}</span>
                                {isEditing ? (
                                  <input
                                    value={spec.value}
                                    onChange={(e) => {
                                      const newSpecs = [...careData.labelSpecs];
                                      newSpecs[i].value = e.target.value;
                                      setCareData({ ...careData, labelSpecs: newSpecs });
                                    }}
                                    className="h-5 rounded border border-slate-200 bg-white px-1 text-right text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                ) : (
                                  <span className="text-slate-900">{spec.value}</span>
                                )}
                              </div>
                            ))}
                          </div>
                          <Button
                            onClick={() =>
                              handleAction(
                                'QR Generator',
                                'Генерация уникальной QR-бирки для паспорта изделия...'
                              )
                            }
                            className="h-8 w-full rounded-xl bg-slate-900 text-[8px] font-bold uppercase text-white shadow-lg"
                          >
                            Генератор QR-бирки
                          </Button>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="space-y-6 p-4 duration-500 animate-in slide-in-from-right-2">
                    <div className="grid gap-3 md:grid-cols-3">
                      <Card className="group space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 shadow-inner transition-all hover:border-indigo-100">
                        <div className="flex items-center gap-2 px-1">
                          <Scissors className="h-3.5 w-3.5 text-indigo-600" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                            Нитки и Иглы
                          </h4>
                        </div>
                        <div className="space-y-2.5">
                          {specsData.threads.map((item, i) => (
                            <div
                              key={i}
                              className="space-y-0.5 border-l-2 border-slate-200 pl-2 transition-colors group-hover:border-indigo-400"
                            >
                              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                                {item.label}
                              </p>
                              {isEditing ? (
                                <input
                                  value={item.value}
                                  onChange={(e) => {
                                    const newThreads = [...specsData.threads];
                                    newThreads[i].value = e.target.value;
                                    setSpecsData({ ...specsData, threads: newThreads });
                                  }}
                                  className="h-6 w-full rounded border border-slate-200 bg-white px-1 text-[10px] font-bold uppercase leading-tight outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              ) : (
                                <p className="text-[10px] font-bold uppercase leading-tight">
                                  {item.value}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>

                      <Card className="group space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 shadow-inner transition-all hover:border-amber-100">
                        <div className="flex items-center gap-2 px-1">
                          <Thermometer className="h-3.5 w-3.5 text-amber-600" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                            Режимы ВТО
                          </h4>
                        </div>
                        <div className="space-y-2.5">
                          {specsData.ironing.map((item, i) => (
                            <div
                              key={i}
                              className="space-y-0.5 border-l-2 border-slate-200 pl-2 transition-colors group-hover:border-amber-400"
                            >
                              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                                {item.label}
                              </p>
                              {isEditing ? (
                                <input
                                  value={item.value}
                                  onChange={(e) => {
                                    const newIroning = [...specsData.ironing];
                                    newIroning[i].value = e.target.value;
                                    setSpecsData({ ...specsData, ironing: newIroning });
                                  }}
                                  className="h-6 w-full rounded border border-slate-200 bg-white px-1 text-[10px] font-bold uppercase leading-tight outline-none focus:ring-1 focus:ring-amber-500"
                                />
                              ) : (
                                <p className="text-[10px] font-bold uppercase leading-tight">
                                  {item.value}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>

                      <Card className="group space-y-3 rounded-xl border border-slate-100 bg-rose-50/10 p-4 shadow-inner transition-all hover:border-rose-100">
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                              Особые указания
                            </h4>
                          </div>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 rounded-full border border-slate-200 bg-white text-rose-600"
                              onClick={() =>
                                setSpecsData({
                                  ...specsData,
                                  special: [...specsData.special, 'Новое указание'],
                                })
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2 px-1">
                          {specsData.special.map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="font-bold text-rose-400">•</span>
                              {isEditing ? (
                                <div className="flex flex-1 gap-1">
                                  <input
                                    value={item}
                                    onChange={(e) => {
                                      const newSpecial = [...specsData.special];
                                      newSpecial[i] = e.target.value;
                                      setSpecsData({ ...specsData, special: newSpecial });
                                    }}
                                    className="h-6 w-full rounded border border-slate-200 bg-white px-1 text-[9px] font-bold uppercase leading-relaxed tracking-tight text-slate-600 outline-none focus:ring-1 focus:ring-rose-500"
                                  />
                                  <button
                                    onClick={() =>
                                      setSpecsData({
                                        ...specsData,
                                        special: specsData.special.filter((_, idx) => idx !== i),
                                      })
                                    }
                                    className="text-rose-400 hover:text-rose-600"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <p className="text-[9px] font-bold uppercase leading-relaxed tracking-tight text-slate-600">
                                  {item}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === 'construction' && (
                  <div className="space-y-6 p-4 text-center duration-500 animate-in slide-in-from-right-2">
                    <div className="mx-auto max-w-md space-y-1.5">
                      <h3 className="text-base font-bold uppercase leading-none tracking-widest text-slate-900">
                        Спецификация швов
                      </h3>
                      <p className="text-[10px] font-bold uppercase leading-relaxed tracking-[0.15em] text-slate-400">
                        Инструкции по типам швов, ниткам и обработке узлов.
                      </p>
                    </div>
                    <div className="mx-auto grid max-w-4xl gap-3 text-left md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <h4 className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                            <Scissors className="h-3 w-3 text-indigo-600" /> Основные швы
                          </h4>
                          {isEditing && (
                            <Button
                              onClick={() => addItem('seams')}
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 rounded-full border border-slate-200 bg-white text-indigo-600 shadow-sm"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          {seamsData.map((stitch, i) => (
                            <div
                              key={i}
                              className="group flex cursor-default items-center justify-between rounded-xl border border-slate-100/50 bg-slate-50/50 p-2.5 transition-all hover:border-indigo-100 hover:bg-white hover:shadow-sm"
                            >
                              <div className="grow space-y-0.5">
                                {isEditing ? (
                                  <div className="space-y-1 pr-4">
                                    <input
                                      value={stitch.type}
                                      onChange={(e) => {
                                        const newSeams = [...seamsData];
                                        newSeams[i].type = e.target.value;
                                        setSeamsData(newSeams);
                                      }}
                                      placeholder="Тип шва"
                                      className="h-6 w-full rounded border border-slate-200 bg-white px-1 text-[10px] font-bold uppercase text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <input
                                      value={stitch.usage}
                                      onChange={(e) => {
                                        const newSeams = [...seamsData];
                                        newSeams[i].usage = e.target.value;
                                        setSeamsData(newSeams);
                                      }}
                                      placeholder="Где применяется"
                                      className="h-5 w-full rounded border border-slate-200 bg-white px-1 text-[8px] font-bold uppercase tracking-widest text-slate-400 outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-[10px] font-bold uppercase text-slate-900 transition-colors group-hover:text-indigo-600">
                                      {stitch.type}
                                    </p>
                                    <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                                      {stitch.usage}
                                    </p>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5">
                                {isEditing ? (
                                  <div className="flex items-center gap-1">
                                    <input
                                      value={stitch.thread}
                                      onChange={(e) => {
                                        const newSeams = [...seamsData];
                                        newSeams[i].thread = e.target.value;
                                        setSeamsData(newSeams);
                                      }}
                                      placeholder="Нить"
                                      className="h-5 w-16 rounded border border-slate-200 bg-white px-1 text-center text-[7px] font-bold uppercase outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <button
                                      onClick={() => removeItem('seams', i)}
                                      className="text-rose-400 hover:text-rose-600"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="border-slate-200 bg-white text-[7px] font-bold uppercase shadow-sm"
                                  >
                                    {stitch.thread}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h4 className="flex items-center gap-1.5 px-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Технологические узлы
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="group/node relative flex aspect-square cursor-zoom-in items-center justify-center overflow-hidden rounded-xl border border-slate-200/50 bg-slate-100/50 shadow-inner transition-all hover:border-indigo-100"
                            >
                              <FileSearch className="h-5 w-5 text-slate-300 transition-all group-hover/node:scale-110 group-hover/node:text-indigo-200" />
                              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 backdrop-blur-[1px] transition-opacity group-hover/node:opacity-100">
                                <p className="text-[8px] font-bold uppercase tracking-widest text-white">
                                  Узел #{i}
                                </p>
                              </div>
                              {isEditing && (
                                <button className="absolute right-1.5 top-1.5 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white shadow-lg transition-colors hover:bg-rose-500">
                                  <Trash2 className="h-2.5 w-2.5" />
                                </button>
                              )}
                            </div>
                          ))}
                          {isEditing && (
                            <div className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-transparent text-slate-300 transition-all hover:border-indigo-100 hover:text-indigo-600">
                              <Plus className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'operations' && (
                  <div className="overflow-x-auto duration-500 animate-in slide-in-from-right-2">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="h-9 border-none hover:bg-transparent">
                          <TableHead className="h-9 py-2 pl-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Операция
                          </TableHead>
                          <TableHead className="h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-600">
                            SMV (мин)
                          </TableHead>
                          <TableHead className="h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            Ставка
                          </TableHead>
                          <TableHead className="h-9 pr-4 text-right text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            {isEditing ? 'Действия' : 'RUB'}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {smvData.map((op, i) => (
                          <TableRow
                            key={i}
                            className="group/row h-11 border-slate-100 transition-colors hover:bg-slate-50/50"
                          >
                            <TableCell className="py-2 pl-4">
                              <div className="space-y-0.5">
                                {isEditing ? (
                                  <div className="space-y-1">
                                    <input
                                      value={op.name}
                                      onChange={(e) => updateItem('smv', i, 'name', e.target.value)}
                                      className="h-6 w-full rounded border border-slate-200 bg-white px-1 text-[10px] font-bold uppercase leading-tight tracking-tight text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                    <input
                                      value={op.rank}
                                      onChange={(e) => updateItem('smv', i, 'rank', e.target.value)}
                                      placeholder="Разряд"
                                      className="h-5 w-16 rounded border border-slate-200 bg-white px-1 text-center text-[7px] font-bold uppercase text-slate-400 outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-[10px] font-bold uppercase leading-tight tracking-tight text-slate-900 transition-colors group-hover/row:text-indigo-600">
                                      {op.name}
                                    </p>
                                    <Badge
                                      variant="outline"
                                      className="h-3.5 border-slate-200 bg-white px-1.5 text-[7px] font-bold uppercase tracking-widest text-slate-400 shadow-sm"
                                    >
                                      {op.rank}
                                    </Badge>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-2 text-center">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={op.time}
                                  onChange={(e) =>
                                    updateItem('smv', i, 'time', parseFloat(e.target.value))
                                  }
                                  className="h-6 w-12 rounded border border-slate-200 bg-white px-1 text-center font-mono text-[11px] font-bold text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              ) : (
                                <span className="font-mono text-[11px] font-bold tracking-tighter text-indigo-600">
                                  {op.time}
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="py-2 text-center">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={op.rate}
                                  onChange={(e) =>
                                    updateItem('smv', i, 'rate', parseFloat(e.target.value))
                                  }
                                  className="h-6 w-12 rounded border border-slate-200 bg-white px-1 text-center font-mono text-[10px] font-bold text-slate-400 outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              ) : (
                                <span className="font-mono text-[10px] font-bold tracking-tighter text-slate-400">
                                  {op.rate.toFixed(1)} ₽/мин
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="py-2 pr-4 text-right">
                              {isEditing ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeItem('smv', i)}
                                  className="h-6 w-6 text-rose-500 hover:bg-rose-50"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              ) : (
                                <span className="text-[11px] font-bold tracking-tighter text-slate-900">
                                  {(op.time * op.rate).toFixed(2)} ₽
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        {isEditing && (
                          <TableRow className="border-none hover:bg-transparent">
                            <TableCell colSpan={4} className="p-2">
                              <Button
                                onClick={() => addItem('smv')}
                                className="h-8 w-full border-2 border-dashed border-slate-200 bg-transparent text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:border-indigo-100 hover:text-indigo-600"
                              >
                                <Plus className="mr-2 h-3 w-3" /> Добавить операцию
                              </Button>
                            </TableCell>
                          </TableRow>
                        )}
                        <TableRow className="h-12 border-none bg-slate-900 text-white shadow-xl">
                          <TableCell className="py-3 pl-4">
                            <p className="mb-1 text-[9px] font-bold uppercase leading-none tracking-[0.2em] text-indigo-400">
                              Итого CMT
                            </p>
                            <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-white/40">
                              Пошив + Крой + Упаковка
                            </p>
                          </TableCell>
                          <TableCell className="py-3 text-center">
                            <span className="text-base font-bold tracking-tighter text-white">
                              {smvData.reduce((acc, op) => acc + op.time, 0).toFixed(1)}
                            </span>
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell className="py-3 pr-4 text-right">
                            <span className="text-sm font-bold tracking-tighter text-emerald-400">
                              {smvData.reduce((acc, op) => acc + op.time * op.rate, 0).toFixed(2)} ₽
                            </span>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}

                {activeTab === 'packaging' && (
                  <div className="space-y-6 p-4 duration-500 animate-in slide-in-from-right-2">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
                          <Box className="h-3.5 w-3.5 text-indigo-600" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                            Складывание
                          </h4>
                        </div>
                        {isEditing ? (
                          <textarea
                            value={packData.folding}
                            onChange={(e) => setPackData({ ...packData, folding: e.target.value })}
                            className="h-24 w-full rounded-xl border border-slate-200 bg-white p-3 text-center text-[10px] font-bold uppercase leading-relaxed tracking-tight shadow-inner outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        ) : (
                          <div className="group rounded-xl border border-slate-100 bg-slate-50 p-3 text-center text-[10px] font-bold uppercase leading-relaxed tracking-tight shadow-inner transition-all duration-300 hover:border-indigo-100 hover:bg-white">
                            "{packData.folding}"
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-2">
                            <Tag className="h-3.5 w-3.5 text-emerald-600" />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                              Маркировка
                            </h4>
                          </div>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 rounded-full border border-slate-200 bg-white text-emerald-600 shadow-sm"
                              onClick={() =>
                                setPackData({
                                  ...packData,
                                  marking: [...packData.marking, 'Новая метка'],
                                })
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <ul className="space-y-1.5">
                          {packData.marking.map((req, i) => (
                            <li
                              key={i}
                              className="group/item flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 shadow-sm transition-all hover:border-emerald-200 hover:bg-white"
                            >
                              <div className="flex grow items-center gap-2.5">
                                <Info className="h-3.5 w-3.5 text-slate-300 transition-colors group-hover/item:text-emerald-600" />
                                {isEditing ? (
                                  <input
                                    value={req}
                                    onChange={(e) => {
                                      const newMarking = [...packData.marking];
                                      newMarking[i] = e.target.value;
                                      setPackData({ ...packData, marking: newMarking });
                                    }}
                                    className="w-full border-none bg-transparent text-[9px] font-bold uppercase leading-none tracking-widest text-slate-900 outline-none focus:ring-0"
                                  />
                                ) : (
                                  <p className="text-[9px] font-bold uppercase leading-none tracking-widest text-slate-900">
                                    {req}
                                  </p>
                                )}
                              </div>
                              {isEditing ? (
                                <button
                                  onClick={() =>
                                    setPackData({
                                      ...packData,
                                      marking: packData.marking.filter((_, idx) => idx !== i),
                                    })
                                  }
                                  className="text-rose-400 hover:text-rose-600"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              ) : (
                                <ChevronRight className="h-2.5 w-2.5 text-slate-200" />
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="group relative flex items-center justify-between overflow-hidden rounded-2xl bg-indigo-600 p-3 text-white shadow-lg transition-colors hover:bg-indigo-700">
                      <div className="absolute -bottom-4 -right-4 opacity-10 transition-transform duration-700 group-hover:scale-110">
                        <Box className="h-20 w-20" />
                      </div>
                      <div className="relative z-10 flex w-full items-center gap-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 shadow-inner transition-transform group-hover:scale-105">
                          <Ruler className="w-4.5 h-4.5 text-amber-400" />
                        </div>
                        <div className="grow space-y-0.5">
                          <p className="mb-1 text-[8px] font-bold uppercase leading-none tracking-[0.2em] text-indigo-200">
                            Упаковка в короб
                          </p>
                          {isEditing ? (
                            <input
                              value={packData.box}
                              onChange={(e) => setPackData({ ...packData, box: e.target.value })}
                              className="h-7 w-full rounded border border-white/20 bg-white/10 px-2 text-[13px] font-bold uppercase leading-none tracking-tighter outline-none focus:ring-1 focus:ring-white/50"
                            />
                          ) : (
                            <p className="text-[13px] font-bold uppercase leading-none tracking-tighter">
                              {packData.box}
                            </p>
                          )}
                        </div>
                      </div>
                      {!isEditing && (
                        <Badge
                          variant="outline"
                          className="relative z-10 ml-4 h-7 shrink-0 cursor-pointer rounded-lg border-white/30 bg-white/5 px-3 text-[8px] font-bold uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white hover:text-indigo-600"
                        >
                          Склад <ExternalLink className="ml-1.5 h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'fit' && (
                  <div className="p-4 duration-500 animate-in slide-in-from-right-2">
                    <InteractiveFitReview skuId={techPack.productId} />
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="space-y-4 p-4 duration-500 animate-in slide-in-from-right-2">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <History className="h-4 w-4 text-indigo-600" />
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                          История изменений Tech Pack
                        </h3>
                      </div>
                      {isEditing && (
                        <Button
                          onClick={() =>
                            setHistoryData([
                              {
                                version: 'New',
                                date: new Date().toLocaleDateString(),
                                author: 'Current User',
                                changes: 'Новое изменение',
                              },
                              ...historyData,
                            ])
                          }
                          className="h-7 gap-1.5 rounded-lg bg-slate-900 text-[9px] font-bold uppercase tracking-widest text-white"
                        >
                          <Plus className="h-3 w-3" /> Добавить запись
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {historyData.map((rev, i) => (
                        <div
                          key={i}
                          className="group space-y-2 rounded-2xl border border-slate-100 bg-slate-50/30 p-4 transition-all hover:border-indigo-100 hover:bg-white"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Badge className="h-5 border-none bg-indigo-600 px-2 text-[9px] font-black text-white">
                                v{rev.version}
                              </Badge>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                {rev.date} • {rev.author}
                              </p>
                            </div>
                            {isEditing && (
                              <button
                                onClick={() =>
                                  setHistoryData(historyData.filter((_, idx) => idx !== i))
                                }
                                className="text-rose-400 opacity-0 transition-opacity hover:text-rose-600 group-hover:opacity-100"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                          {isEditing ? (
                            <textarea
                              value={rev.changes}
                              onChange={(e) => {
                                const newHistory = [...historyData];
                                newHistory[i].changes = e.target.value;
                                setHistoryData(newHistory);
                              }}
                              className="h-16 w-full rounded border border-slate-200 bg-white p-2 text-[11px] font-bold uppercase leading-relaxed tracking-tight text-slate-600 outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          ) : (
                            <p className="text-[11px] font-bold uppercase leading-relaxed tracking-tight text-slate-600">
                              {rev.changes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 pt-4">
                      <AuditTrailList entityType="tech_pack" entityId={techPack.id} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
