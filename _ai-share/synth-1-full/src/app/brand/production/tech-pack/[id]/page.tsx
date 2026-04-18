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
<<<<<<< HEAD
=======
  Trash2,
>>>>>>> recover/cabinet-wip-from-stash
} from 'lucide-react';
import { TechPack, BOMItem, GradingPoint } from '@/lib/types/production';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
<<<<<<< HEAD
=======
import { ROUTES } from '@/lib/routes';
>>>>>>> recover/cabinet-wip-from-stash
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import InteractiveFitReview from '@/components/brand/product/interactive-fit-review';
import AuditTrailList from '@/components/brand/audit/audit-trail-list';
import { loadTechPackDraft, saveTechPackDraft } from '@/lib/production-data';
import type { TechPackDraftV1 } from '@/lib/production-data';
import { RegistryPageShell } from '@/components/design-system';

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
<<<<<<< HEAD
      <span className="cursor-help px-0.5 font-bold underline decoration-indigo-400 decoration-dotted">
        {children}
      </span>
    </TooltipTrigger>
    <TooltipContent className="z-[100] max-w-xs rounded-2xl border-none bg-slate-900 p-4 text-white shadow-2xl">
      <div className="space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">{title}</p>
        {description && (
          <p className="text-[10px] font-medium leading-tight text-slate-300">{description}</p>
=======
      <span className="decoration-accent-primary cursor-help px-0.5 font-bold underline decoration-dotted">
        {children}
      </span>
    </TooltipTrigger>
    <TooltipContent className="bg-text-primary z-[100] max-w-xs rounded-2xl border-none p-4 text-white shadow-2xl">
      <div className="space-y-1">
        <p className="text-accent-primary text-[11px] font-bold uppercase tracking-wider">
          {title}
        </p>
        {description && (
          <p className="text-text-muted text-[10px] font-medium leading-tight">{description}</p>
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
      { icon: Wind, label: 'Сушка', value: 'В тени, без отжима', color: 'text-indigo-500' },
=======
      { icon: Wind, label: 'Сушка', value: 'В тени, без отжима', color: 'text-accent-primary' },
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
        'Данные Tech Pack записаны локально (слой production-data). Позже подключится API.',
=======
        'Данные техпака записаны локально (слой production-data). Позже подключится API.',
>>>>>>> recover/cabinet-wip-from-stash
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
    newData[rowIndex] = {
      ...newData[rowIndex],
      values: { ...newData[rowIndex].values, [size]: value },
    };
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
<<<<<<< HEAD
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
=======
      <RegistryPageShell className="max-w-5xl space-y-4 pb-16">
        <header className="border-border-subtle flex flex-col justify-between gap-3 border-b pb-3 md:flex-row md:items-end">
          <div className="space-y-0.5">
            <div className="text-text-muted flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em]">
              <Link
                href={ROUTES.brand.production}
                className="hover:text-accent-primary transition-colors"
              >
                Производство
              </Link>
              <ChevronRight className="h-2 w-2" />
              <span className="text-text-muted">Техпак</span>
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-text-primary font-headline text-xl font-black uppercase leading-none tracking-tighter md:text-2xl">
                Цифровой техпак 2.0
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
            <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">
              v{techPack.version} • 10.03.2026 • Анна К.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1 shadow-inner">
=======
            <p className="text-text-muted text-[10px] font-bold uppercase tracking-tight">
              v{techPack.version} • 10.03.2026 • Анна К.
            </p>
          </div>
          <div className="bg-bg-surface2 border-border-default flex flex-wrap gap-1.5 rounded-xl border p-1 shadow-inner">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                  : 'bg-white text-indigo-600 hover:bg-indigo-50'
=======
                  : 'text-accent-primary hover:bg-accent-primary/10 bg-white'
>>>>>>> recover/cabinet-wip-from-stash
              )}
            >
              {isEditing ? <Save className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
              {isEditing ? 'Сохранить всё' : 'Редактировать'}
            </Button>
            <Button
              variant="ghost"
<<<<<<< HEAD
              className="h-7 gap-1.5 rounded-lg bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all hover:bg-slate-50"
            >
              <Printer className="h-3 w-3 text-slate-400" /> PDF
=======
              className="text-text-secondary hover:bg-bg-surface2 h-7 gap-1.5 rounded-lg bg-white px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all"
            >
              <Printer className="text-text-muted h-3 w-3" /> PDF
>>>>>>> recover/cabinet-wip-from-stash
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowDiff(!showDiff)}
              className={cn(
<<<<<<< HEAD
                'h-7 gap-1.5 rounded-lg bg-white px-3 text-[9px] font-bold uppercase tracking-widest text-slate-600 shadow-sm transition-all',
=======
                'text-text-secondary h-7 gap-1.5 rounded-lg bg-white px-3 text-[9px] font-bold uppercase tracking-widest shadow-sm transition-all',
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                  : 'bg-slate-900 text-white hover:bg-indigo-600'
=======
                  : 'bg-text-primary hover:bg-accent-primary text-white'
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
            <Card className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100 hover:shadow-md">
              <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden bg-slate-50/50">
                <FileText className="h-12 w-12 text-slate-100 transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2.5 bg-slate-900/60 p-4 opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-indigo-400">
                    Digital Twin
=======
            <Card className="border-border-subtle hover:border-accent-primary/20 group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md">
              <div className="bg-bg-surface2/80 relative flex aspect-[3/4] items-center justify-center overflow-hidden">
                <FileText className="text-text-inverse h-12 w-12 transition-transform duration-700 group-hover:scale-110" />
                <div className="bg-text-primary/60 absolute inset-0 flex flex-col items-center justify-center space-y-2.5 p-4 opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <p className="text-accent-primary text-[7px] font-bold uppercase tracking-[0.2em]">
                    Цифровой двойник
>>>>>>> recover/cabinet-wip-from-stash
                  </p>
                  <Button
                    onClick={() =>
                      handleAction(
<<<<<<< HEAD
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
=======
                        '3D-просмотр',
                        'Запуск интерактивного модуля просмотра 3D-модели изделия...'
                      )
                    }
                    className="text-text-primary h-8 gap-1.5 rounded-lg border-none bg-white px-4 text-[8px] font-bold uppercase shadow-xl transition-all hover:scale-105"
                  >
                    <Zap className="h-3 w-3 text-amber-500" /> 3D-просмотр PRO
                  </Button>
                </div>
                <Badge className="bg-text-primary absolute right-2.5 top-2.5 h-4 border-none px-1.5 text-[7px] font-bold uppercase tracking-widest text-white">
                  3D-АССЕТ ГОТОВ
>>>>>>> recover/cabinet-wip-from-stash
                </Badge>
              </div>
              <CardContent className="space-y-3.5 p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
<<<<<<< HEAD
                    <p className="mb-0.5 text-[7px] font-bold uppercase leading-none tracking-widest text-slate-400">
                      Артикул
                    </p>
                    <p className="text-[11px] font-bold uppercase leading-none tracking-tight text-slate-900">
=======
                    <p className="text-text-muted mb-0.5 text-[7px] font-bold uppercase leading-none tracking-widest">
                      Артикул
                    </p>
                    <p className="text-text-primary text-[11px] font-bold uppercase leading-none tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                      {techPack.id}
                    </p>
                  </div>
                  <div>
<<<<<<< HEAD
                    <p className="mb-0.5 text-[7px] font-bold uppercase leading-none tracking-widest text-slate-400">
                      Сезон
                    </p>
                    <p className="text-[11px] font-bold uppercase leading-none tracking-tight text-slate-900">
=======
                    <p className="text-text-muted mb-0.5 text-[7px] font-bold uppercase leading-none tracking-widest">
                      Сезон
                    </p>
                    <p className="text-text-primary text-[11px] font-bold uppercase leading-none tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                      SS-2026
                    </p>
                  </div>
                </div>
<<<<<<< HEAD
                <div className="space-y-2 border-t border-slate-50 pt-3">
                  <p className="text-[7px] font-bold uppercase leading-none tracking-widest text-slate-400">
=======
                <div className="border-border-subtle space-y-2 border-t pt-3">
                  <p className="text-text-muted text-[7px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                      className="group h-8 w-full justify-between rounded-lg border border-slate-100 bg-slate-50 text-[8px] font-bold uppercase transition-all hover:border-indigo-200 hover:bg-white"
                    >
                      <span className="mr-2 truncate text-slate-600">patterns_v2.4.dxf</span>
                      <Download className="h-3 w-3 text-indigo-600 transition-transform group-hover:scale-110" />
=======
                      className="bg-bg-surface2 border-border-subtle hover:border-accent-primary/30 group h-8 w-full justify-between rounded-lg border text-[8px] font-bold uppercase transition-all hover:bg-white"
                    >
                      <span className="text-text-secondary mr-2 truncate">patterns_v2.4.dxf</span>
                      <Download className="text-accent-primary h-3 w-3 transition-transform group-hover:scale-110" />
>>>>>>> recover/cabinet-wip-from-stash
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

<<<<<<< HEAD
            <Card className="group relative overflow-hidden rounded-2xl border border-indigo-100 bg-indigo-600 p-4 text-white shadow-md transition-colors hover:bg-indigo-700">
=======
            <Card className="border-accent-primary/20 bg-accent-primary hover:bg-accent-primary group relative overflow-hidden rounded-2xl border p-4 text-white shadow-md transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                <p className="text-[9px] font-bold uppercase leading-tight tracking-tight text-indigo-100">
=======
                <p className="text-accent-primary/30 text-[9px] font-bold uppercase leading-tight tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                  className="h-8 w-full rounded-lg border-none bg-white text-[8px] font-bold uppercase tracking-widest text-indigo-600 shadow-lg transition-all hover:bg-indigo-50 active:scale-95"
=======
                  className="text-accent-primary hover:bg-accent-primary/10 h-8 w-full rounded-lg border-none bg-white text-[8px] font-bold uppercase tracking-widest shadow-lg transition-all active:scale-95"
>>>>>>> recover/cabinet-wip-from-stash
                >
                  Заказать материалы
                </Button>
              </div>
            </Card>

<<<<<<< HEAD
            <Card className="group rounded-2xl border border-slate-100 bg-slate-900 p-4 text-white shadow-sm transition-colors hover:bg-slate-800">
=======
            <Card className="border-border-subtle bg-text-primary hover:bg-text-primary/90 group rounded-2xl border p-4 text-white shadow-sm transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                    'Cost Analysis',
                    'Формирование детального финансового отчета по SKU...'
=======
                    'Анализ себестоимости',
                    'Формирование детального финансового отчёта по SKU...'
>>>>>>> recover/cabinet-wip-from-stash
                  )
                }
                className="h-7 w-full rounded-lg bg-white/10 text-[8px] font-bold uppercase tracking-widest text-white transition-all hover:bg-white/20"
              >
                Отчет по костам
              </Button>
            </Card>

<<<<<<< HEAD
            <Card className="group rounded-2xl border border-slate-100 bg-slate-900 p-4 text-white shadow-sm transition-colors hover:bg-slate-800">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-indigo-400 shadow-inner transition-transform group-hover:scale-105">
=======
            <Card className="border-border-subtle bg-text-primary hover:bg-text-primary/90 group rounded-2xl border p-4 text-white shadow-sm transition-colors">
              <div className="mb-3 flex items-center gap-2">
                <div className="text-accent-primary flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 shadow-inner transition-transform group-hover:scale-105">
>>>>>>> recover/cabinet-wip-from-stash
                  <MessageSquare className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-[10px] font-bold uppercase leading-none tracking-widest text-white">
                  Голос цеха
                </h3>
              </div>
<<<<<<< HEAD
              <div className="mb-3 rounded-xl border border-white/10 bg-white/5 p-2.5 transition-colors group-hover:border-indigo-500/30">
                <p className="text-[8px] font-bold uppercase leading-tight tracking-tight text-indigo-100">
=======
              <div className="group-hover:border-accent-primary/30 mb-3 rounded-xl border border-white/10 bg-white/5 p-2.5 transition-colors">
                <p className="text-accent-primary/30 text-[8px] font-bold uppercase leading-tight tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                className="h-7 w-full rounded-lg bg-indigo-600 text-[8px] font-bold uppercase tracking-widest text-white shadow-md transition-all hover:bg-indigo-500"
=======
                className="bg-accent-primary hover:bg-accent-primary h-7 w-full rounded-lg text-[8px] font-bold uppercase tracking-widest text-white shadow-md transition-all"
>>>>>>> recover/cabinet-wip-from-stash
              >
                Ответить
              </Button>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="mx-auto w-full max-w-4xl space-y-4 lg:col-span-3 lg:max-w-none">
<<<<<<< HEAD
            <div className="no-scrollbar flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 shadow-inner">
=======
            <div className="bg-bg-surface2 no-scrollbar flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl p-1 shadow-inner">
>>>>>>> recover/cabinet-wip-from-stash
              {[
                { id: 'bom', label: 'BOM', title: 'Ведомость материалов' },
                {
                  id: 'microbom',
<<<<<<< HEAD
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
=======
                  label: 'Микро-BOM',
                  title: 'Нитки, пуговицы, этикетки до копейки',
                },
                { id: 'patterns', label: 'Лекала', title: 'Спецификация деталей (лекал)' },
                { id: 'grading', label: 'Градация', title: 'Табель мер' },
                { id: 'construction', label: 'Швы', title: 'Схемы швов и узлов' },
                { id: 'care', label: 'Уход', title: 'Уход и бирки' },
                { id: 'specifications', label: 'Spec.', title: 'Техническая спецификация (ТЗ)' },
                { id: 'operations', label: 'SMV', title: 'Пооперационный расчет' },
                { id: 'packaging', label: 'Pack.', title: 'Упаковка' },
                { id: 'fit', label: 'Примерки', title: 'Примерки' },
                { id: 'history', label: 'История', title: 'История' },
>>>>>>> recover/cabinet-wip-from-stash
              ].map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  variant="ghost"
                  className={cn(
                    'h-7 whitespace-nowrap rounded-lg px-3.5 text-[9px] font-bold uppercase tracking-widest transition-all duration-200',
                    activeTab === tab.id
<<<<<<< HEAD
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
=======
                      ? 'text-accent-primary bg-white shadow-sm'
                      : 'text-text-muted hover:text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                >
                  <Acronym title={tab.title}>{tab.label}</Acronym>
                </Button>
              ))}
            </div>

<<<<<<< HEAD
            <Card className="min-h-[400px] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-500 animate-in fade-in hover:border-indigo-100/50">
=======
            <Card className="border-border-subtle hover:border-accent-primary/20 min-h-[400px] overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-500 animate-in fade-in">
>>>>>>> recover/cabinet-wip-from-stash
              <CardContent className="p-0">
                {activeTab === 'bom' && (
                  <div className="overflow-x-auto duration-500 animate-in slide-in-from-right-2">
                    <Table>
<<<<<<< HEAD
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
=======
                      <TableHeader className="bg-bg-surface2/80">
                        <TableRow className="h-9 border-none hover:bg-transparent">
                          <TableHead className="text-text-muted h-9 py-2 pl-4 text-[9px] font-bold uppercase tracking-[0.2em]">
                            Категория
                          </TableHead>
                          <TableHead className="text-text-muted h-9 text-[9px] font-bold uppercase tracking-[0.2em]">
                            Материал / Цвет
                          </TableHead>
                          <TableHead className="text-text-muted h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em]">
                            Расход
                          </TableHead>
                          <TableHead className="text-text-muted h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em]">
                            Брак
                          </TableHead>
                          <TableHead className="text-text-muted h-9 pr-4 text-right text-[9px] font-bold uppercase tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                            {isEditing ? 'Действия' : 'Поставщик'}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bomData.map((item, idx) => (
                          <TableRow
                            key={item.id}
                            className={cn(
<<<<<<< HEAD
                              'group h-12 border-slate-100 transition-colors hover:bg-slate-50/50',
=======
                              'hover:bg-bg-surface2/80 border-border-subtle group h-12 transition-colors',
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                  className="h-6 rounded border border-slate-200 bg-white px-1 text-[8px] font-bold uppercase outline-none focus:ring-1 focus:ring-indigo-500"
=======
                                  className="border-border-default focus:ring-accent-primary h-6 rounded border bg-white px-1 text-[8px] font-bold uppercase outline-none focus:ring-1"
>>>>>>> recover/cabinet-wip-from-stash
                                >
                                  <option value="Ткань">Ткань</option>
                                  <option value="Фурнитура">Фурнитура</option>
                                  <option value="Этикетка">Этикетка</option>
                                  <option value="Упаковка">Упаковка</option>
                                </select>
                              ) : (
                                <Badge
                                  variant="outline"
<<<<<<< HEAD
                                  className="h-3.5 border-slate-200 bg-white px-1.5 text-[7px] font-bold uppercase tracking-widest transition-colors group-hover:border-indigo-200"
=======
                                  className="border-border-default group-hover:border-accent-primary/30 h-3.5 bg-white px-1.5 text-[7px] font-bold uppercase tracking-widest transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                      className="h-6 w-full rounded border border-slate-200 bg-white px-1 text-[10px] font-bold uppercase tracking-tight text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
=======
                                      className="text-text-primary border-border-default focus:ring-accent-primary h-6 w-full rounded border bg-white px-1 text-[10px] font-bold uppercase tracking-tight outline-none focus:ring-1"
>>>>>>> recover/cabinet-wip-from-stash
                                    />
                                    <input
                                      value={item.colorCode}
                                      onChange={(e) =>
                                        updateItem('bom', idx, 'colorCode', e.target.value)
                                      }
                                      placeholder="Цвет/Код"
<<<<<<< HEAD
                                      className="h-5 w-full rounded border border-slate-200 bg-white px-1 text-[7px] font-bold uppercase tracking-widest text-slate-500 outline-none focus:ring-1 focus:ring-indigo-500"
=======
                                      className="text-text-secondary border-border-default focus:ring-accent-primary h-5 w-full rounded border bg-white px-1 text-[7px] font-bold uppercase tracking-widest outline-none focus:ring-1"
>>>>>>> recover/cabinet-wip-from-stash
                                    />
                                  </div>
                                ) : (
                                  <>
<<<<<<< HEAD
                                    <p className="text-[10px] font-bold uppercase leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
                                      {item.name}
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                      <div className="flex items-center gap-1 rounded bg-slate-100 px-1 py-0.5 text-[7px] font-bold uppercase tracking-widest text-slate-500">
                                        <Tag className="h-2.5 w-2.5 text-indigo-400" />{' '}
=======
                                    <p className="text-text-primary group-hover:text-accent-primary text-[10px] font-bold uppercase leading-tight tracking-tight transition-colors">
                                      {item.name}
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                      <div className="bg-bg-surface2 text-text-secondary flex items-center gap-1 rounded px-1 py-0.5 text-[7px] font-bold uppercase tracking-widest">
                                        <Tag className="text-accent-primary h-2.5 w-2.5" />{' '}
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                      className="h-6 w-12 rounded border border-slate-200 bg-white px-1 text-center font-mono text-[11px] font-bold text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
=======
                                      className="text-text-primary border-border-default focus:ring-accent-primary h-6 w-12 rounded border bg-white px-1 text-center font-mono text-[11px] font-bold outline-none focus:ring-1"
>>>>>>> recover/cabinet-wip-from-stash
                                    />
                                    <select
                                      value={item.unit}
                                      onChange={(e) =>
                                        updateItem('bom', idx, 'unit', e.target.value)
                                      }
<<<<<<< HEAD
                                      className="h-6 rounded border border-slate-200 bg-white px-1 text-[7px] font-bold uppercase text-slate-400 outline-none"
=======
                                      className="text-text-muted border-border-default h-6 rounded border bg-white px-1 text-[7px] font-bold uppercase outline-none"
>>>>>>> recover/cabinet-wip-from-stash
                                    >
                                      <option value="meters">м</option>
                                      <option value="pcs">шт</option>
                                    </select>
                                  </div>
                                ) : (
                                  <>
<<<<<<< HEAD
                                    <span className="font-mono text-[11px] font-bold tracking-tighter text-slate-900">
                                      {item.consumptionPerUnit}
                                    </span>
                                    <span className="text-[7px] font-bold uppercase leading-none tracking-widest text-slate-400">
=======
                                    <span className="text-text-primary font-mono text-[11px] font-bold tracking-tighter">
                                      {item.consumptionPerUnit}
                                    </span>
                                    <span className="text-text-muted text-[7px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                                      {item.unit === 'meters' ? 'м' : 'шт'}
                                    </span>
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-2 text-center">
                              {isEditing ? (
                                <div className="flex items-center justify-center gap-0.5">
<<<<<<< HEAD
                                  <span className="text-[10px] text-slate-400">+</span>
=======
                                  <span className="text-text-muted text-[10px]">+</span>
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                    className="h-6 w-8 rounded border border-slate-200 bg-white px-1 text-center text-[10px] font-bold text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                  <span className="text-[10px] text-slate-400">%</span>
                                </div>
                              ) : (
                                <span className="text-[10px] font-bold tracking-tighter text-slate-900">
=======
                                    className="text-text-primary border-border-default focus:ring-accent-primary h-6 w-8 rounded border bg-white px-1 text-center text-[10px] font-bold outline-none focus:ring-1"
                                  />
                                  <span className="text-text-muted text-[10px]">%</span>
                                </div>
                              ) : (
                                <span className="text-text-primary text-[10px] font-bold tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                  <p className="text-[9px] font-bold uppercase leading-tight tracking-widest text-slate-900 transition-colors group-hover:text-indigo-600">
                                    {item.supplier}
                                  </p>
                                  <p className="text-[7px] font-bold uppercase leading-tight tracking-tight text-slate-400">
                                    <MapPin className="mr-1 inline h-2.5 w-2.5 text-indigo-400" />{' '}
=======
                                  <p className="text-text-primary group-hover:text-accent-primary text-[9px] font-bold uppercase leading-tight tracking-widest transition-colors">
                                    {item.supplier}
                                  </p>
                                  <p className="text-text-muted text-[7px] font-bold uppercase leading-tight tracking-tight">
                                    <MapPin className="text-accent-primary mr-1 inline h-2.5 w-2.5" />{' '}
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                className="h-8 w-full border-2 border-dashed border-slate-200 bg-transparent text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:border-indigo-100 hover:text-indigo-600"
=======
                                className="border-border-default text-text-muted hover:text-accent-primary hover:border-accent-primary/20 h-8 w-full border-2 border-dashed bg-transparent text-[9px] font-bold uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                    <p className="mb-3 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                      Micro-BOM — спецификация до копейки
                    </p>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-200">
=======
                    <p className="text-text-muted mb-3 text-[9px] font-bold uppercase tracking-widest">
                      Микро-BOM — спецификация до копейки
                    </p>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border-default">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                          <TableRow key={i} className="border-slate-100">
=======
                          <TableRow key={i} className="border-border-subtle">
>>>>>>> recover/cabinet-wip-from-stash
                            <TableCell className="text-[10px] font-medium">{r.pos}</TableCell>
                            <TableCell className="text-[10px]">{r.qty}</TableCell>
                            <TableCell className="text-[10px] tabular-nums">{r.price}</TableCell>
                            <TableCell className="text-right text-[10px] font-bold tabular-nums">
                              {r.sum}
                            </TableCell>
                          </TableRow>
                        ))}
<<<<<<< HEAD
                        <TableRow className="border-t-2 border-slate-200 bg-slate-50 font-black">
                          <TableCell colSpan={3} className="text-[10px]">
                            Итого Micro-BOM
=======
                        <TableRow className="border-border-default bg-bg-surface2 border-t-2 font-black">
                          <TableCell colSpan={3} className="text-[10px]">
                            Итого микро-BOM
>>>>>>> recover/cabinet-wip-from-stash
                          </TableCell>
                          <TableCell className="text-right tabular-nums">178.80 ₽</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}

                {activeTab === 'grading' && (
                  <div className="space-y-0 duration-500 animate-in slide-in-from-right-2">
<<<<<<< HEAD
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-3">
                      <div className="flex items-center gap-3">
                        <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                          Размерная сетка:
                        </p>
                        <div className="flex gap-1 rounded-lg border border-slate-200/50 bg-white p-0.5 shadow-inner">
=======
                    <div className="bg-bg-surface2/80 border-border-subtle flex items-center justify-between border-b p-3">
                      <div className="flex items-center gap-3">
                        <p className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
                          Размерная сетка:
                        </p>
                        <div className="border-border-default/50 flex gap-1 rounded-lg border bg-white p-0.5 shadow-inner">
>>>>>>> recover/cabinet-wip-from-stash
                          {Object.keys(sizeScales).map((scale) => (
                            <button
                              key={scale}
                              onClick={() => setSelectedSizeScale(scale)}
                              className={cn(
                                'h-5 rounded-md px-2.5 text-[8px] font-bold uppercase transition-all',
                                selectedSizeScale === scale
<<<<<<< HEAD
                                  ? 'bg-indigo-600 text-white shadow-sm'
                                  : 'text-slate-400 hover:text-slate-600'
=======
                                  ? 'bg-accent-primary text-white shadow-sm'
                                  : 'text-text-muted hover:text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                            className="h-6 gap-1.5 rounded-lg bg-indigo-600 px-3 text-[8px] font-bold uppercase text-white shadow-sm transition-all hover:bg-indigo-700"
=======
                            className="bg-accent-primary hover:bg-accent-primary h-6 gap-1.5 rounded-lg px-3 text-[8px] font-bold uppercase text-white shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            <Plus className="h-2.5 w-2.5" /> Добавить точку
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
<<<<<<< HEAD
                          className="h-6 gap-1.5 rounded-lg border border-slate-200 bg-white text-[8px] font-bold uppercase text-slate-600 shadow-sm transition-all hover:bg-indigo-50 hover:text-indigo-600"
=======
                          className="border-border-default text-text-secondary hover:bg-accent-primary/10 hover:text-accent-primary h-6 gap-1.5 rounded-lg border bg-white text-[8px] font-bold uppercase shadow-sm transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          <ClipboardList className="h-2.5 w-2.5" /> Справочник ГОСТ
                        </Button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
<<<<<<< HEAD
                        <TableHeader className="bg-slate-50/30">
                          <TableRow className="h-9 border-none hover:bg-transparent">
                            <TableHead className="h-9 py-2 pl-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
=======
                        <TableHeader className="bg-bg-surface2/30">
                          <TableRow className="h-9 border-none hover:bg-transparent">
                            <TableHead className="text-text-muted h-9 py-2 pl-4 text-[9px] font-bold uppercase tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                              Точка измерения
                            </TableHead>
                            {sizeScales[selectedSizeScale as keyof typeof sizeScales].map(
                              (size) => (
                                <TableHead
                                  key={size}
<<<<<<< HEAD
                                  className="h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-600"
=======
                                  className="text-accent-primary h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em]"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                              className="group h-10 border-slate-100 transition-colors hover:bg-slate-50/50"
                            >
                              <TableCell className="py-2 pl-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="flex h-5 w-5 items-center justify-center rounded-md border border-slate-200 bg-slate-100 text-[8px] font-bold text-slate-400 shadow-inner transition-all group-hover:bg-indigo-600 group-hover:text-white">
=======
                              className="hover:bg-bg-surface2/80 border-border-subtle group h-10 transition-colors"
                            >
                              <TableCell className="py-2 pl-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="bg-bg-surface2 border-border-default text-text-muted group-hover:bg-accent-primary flex h-5 w-5 items-center justify-center rounded-md border text-[8px] font-bold shadow-inner transition-all group-hover:text-white">
>>>>>>> recover/cabinet-wip-from-stash
                                    {i + 1}
                                  </div>
                                  {isEditing ? (
                                    <input
                                      value={point.measurementName}
                                      onChange={(e) =>
                                        updateItem('grading', i, 'measurementName', e.target.value)
                                      }
<<<<<<< HEAD
                                      className="h-6 w-full rounded border border-slate-200 bg-white px-1 text-[10px] font-bold uppercase tracking-tight text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                  ) : (
                                    <p className="text-[10px] font-bold uppercase leading-tight tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
=======
                                      className="text-text-primary border-border-default focus:ring-accent-primary h-6 w-full rounded border bg-white px-1 text-[10px] font-bold uppercase tracking-tight outline-none focus:ring-1"
                                    />
                                  ) : (
                                    <p className="text-text-primary group-hover:text-accent-primary text-[10px] font-bold uppercase leading-tight tracking-tight transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                        value={point.values[size] || 0}
                                        onChange={(e) =>
                                          updateGradingValue(i, size, parseFloat(e.target.value))
                                        }
                                        className="h-6 w-12 rounded border border-slate-200 bg-white px-1 text-center font-mono text-[11px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                                      />
                                    ) : (
                                      <span className="font-mono text-[11px] font-bold tracking-tighter text-slate-700">
                                        {point.values[size] || 0}
=======
                                        value={(point.values as Record<string, number>)[size] || 0}
                                        onChange={(e) =>
                                          updateGradingValue(i, size, parseFloat(e.target.value))
                                        }
                                        className="text-text-primary border-border-default focus:ring-accent-primary h-6 w-12 rounded border bg-white px-1 text-center font-mono text-[11px] font-bold outline-none focus:ring-1"
                                      />
                                    ) : (
                                      <span className="text-text-primary font-mono text-[11px] font-bold tracking-tighter">
                                        {(point.values as Record<string, number>)[size] || 0}
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                      className="h-6 w-8 rounded border border-slate-200 bg-white px-1 text-center text-[10px] font-bold text-rose-400 outline-none focus:ring-1 focus:ring-rose-500"
=======
                                      className="border-border-default h-6 w-8 rounded border bg-white px-1 text-center text-[10px] font-bold text-rose-400 outline-none focus:ring-1 focus:ring-rose-500"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                    <div className="group/header flex items-center justify-between border-b border-white/10 bg-slate-900 p-4 text-white">
=======
                    <div className="bg-text-primary group/header flex items-center justify-between border-b border-white/10 p-4 text-white">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                            className="h-7 gap-1.5 rounded-lg bg-indigo-600 text-[8px] font-bold uppercase tracking-widest text-white transition-all hover:bg-indigo-500"
=======
                            className="bg-accent-primary hover:bg-accent-primary h-7 gap-1.5 rounded-lg text-[8px] font-bold uppercase tracking-widest text-white transition-all"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
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
=======
                      <TableHeader className="bg-bg-surface2/80">
                        <TableRow className="h-9 border-none">
                          <TableHead className="text-text-muted h-9 pl-4 text-[9px] font-bold uppercase tracking-[0.2em]">
                            Деталь
                          </TableHead>
                          <TableHead className="text-text-muted h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em]">
                            Кол-во
                          </TableHead>
                          <TableHead className="text-text-muted h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em]">
                            Материал
                          </TableHead>
                          <TableHead className="text-text-muted h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em]">
                            Длина (см)
                          </TableHead>
                          <TableHead className="text-text-muted h-9 pr-4 text-right text-[9px] font-bold uppercase tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                            {isEditing ? 'Действия' : 'Площадь'}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patternsData.map((piece, i) => (
                          <TableRow
                            key={i}
<<<<<<< HEAD
                            className="group h-10 border-slate-100 transition-colors hover:bg-slate-50/50"
                          >
                            <TableCell className="pl-4">
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/50 bg-slate-100 shadow-inner transition-transform group-hover:scale-110">
                                  <Scissors className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600" />
=======
                            className="hover:bg-bg-surface2/80 border-border-subtle group h-10 transition-colors"
                          >
                            <TableCell className="pl-4">
                              <div className="flex items-center gap-2.5">
                                <div className="bg-bg-surface2 border-border-default/50 flex h-7 w-7 items-center justify-center rounded-lg border shadow-inner transition-transform group-hover:scale-110">
                                  <Scissors className="text-text-muted group-hover:text-accent-primary h-3.5 w-3.5" />
>>>>>>> recover/cabinet-wip-from-stash
                                </div>
                                {isEditing ? (
                                  <input
                                    value={piece.name}
                                    onChange={(e) =>
                                      updateItem('patterns', i, 'name', e.target.value)
                                    }
<<<<<<< HEAD
                                    className="h-6 rounded border border-slate-200 bg-white px-1 text-[10px] font-bold uppercase leading-none text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                ) : (
                                  <p className="text-[10px] font-bold uppercase leading-none text-slate-900 transition-colors group-hover:text-indigo-600">
=======
                                    className="text-text-primary border-border-default focus:ring-accent-primary h-6 rounded border bg-white px-1 text-[10px] font-bold uppercase leading-none outline-none focus:ring-1"
                                  />
                                ) : (
                                  <p className="text-text-primary group-hover:text-accent-primary text-[10px] font-bold uppercase leading-none transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                  className="h-6 w-10 rounded border border-slate-200 bg-white px-1 text-center font-mono text-[11px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              ) : (
                                <span className="font-mono text-[11px] font-bold text-slate-700">
=======
                                  className="text-text-primary border-border-default focus:ring-accent-primary h-6 w-10 rounded border bg-white px-1 text-center font-mono text-[11px] font-bold outline-none focus:ring-1"
                                />
                              ) : (
                                <span className="text-text-primary font-mono text-[11px] font-bold">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                  className="h-6 rounded border border-slate-200 bg-white px-1 text-[7px] font-bold uppercase outline-none"
                                >
                                  <option value="Main">Main</option>
=======
                                  className="border-border-default h-6 rounded border bg-white px-1 text-[7px] font-bold uppercase outline-none"
                                >
                                  <option value="Main">Основная</option>
>>>>>>> recover/cabinet-wip-from-stash
                                  <option value="Lining">Lining</option>
                                  <option value="Fusing">Fusing</option>
                                </select>
                              ) : (
                                <Badge
                                  variant="outline"
<<<<<<< HEAD
                                  className="h-3.5 border-slate-200 bg-white px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm"
=======
                                  className="border-border-default h-3.5 bg-white px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                  className="h-6 w-16 rounded border border-slate-200 bg-white px-1 text-center font-mono text-[11px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              ) : (
                                <span className="font-mono text-[11px] font-bold text-slate-700">
=======
                                  className="text-text-primary border-border-default focus:ring-accent-primary h-6 w-16 rounded border bg-white px-1 text-center font-mono text-[11px] font-bold outline-none focus:ring-1"
                                />
                              ) : (
                                <span className="text-text-primary font-mono text-[11px] font-bold">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                <span className="font-mono text-[11px] font-bold uppercase tracking-tighter text-indigo-600">
=======
                                <span className="text-accent-primary font-mono text-[11px] font-bold uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
=======
                          <h4 className="text-text-primary text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                            Символы ухода (ISO 3758)
                          </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          {careData.instructions.map((item, i) => (
                            <div
                              key={i}
<<<<<<< HEAD
                              className="group relative flex cursor-default flex-col items-center gap-1.5 rounded-xl border border-slate-100/50 bg-slate-50/50 p-3 transition-all hover:border-indigo-100 hover:bg-white hover:shadow-sm"
=======
                              className="bg-bg-surface2/80 border-border-subtle/50 hover:border-accent-primary/20 group relative flex cursor-default flex-col items-center gap-1.5 rounded-xl border p-3 transition-all hover:bg-white hover:shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              <item.icon
                                className={cn(
                                  'h-5 w-5 transition-transform group-hover:scale-110',
                                  item.color
                                )}
                              />
<<<<<<< HEAD
                              <p className="text-[7px] font-bold uppercase leading-none tracking-widest text-slate-400">
=======
                              <p className="text-text-muted text-[7px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                  className="h-5 w-full rounded border border-slate-200 bg-white px-1 text-center text-[9px] font-bold uppercase leading-tight tracking-tight text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              ) : (
                                <p className="text-center text-[9px] font-bold uppercase leading-tight tracking-tight text-slate-900">
=======
                                  className="text-text-primary border-border-default focus:ring-accent-primary h-5 w-full rounded border bg-white px-1 text-center text-[9px] font-bold uppercase leading-tight tracking-tight outline-none focus:ring-1"
                                />
                              ) : (
                                <p className="text-text-primary text-center text-[9px] font-bold uppercase leading-tight tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                                  {item.value}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 px-1">
<<<<<<< HEAD
                          <Tag className="h-3.5 w-3.5 text-indigo-600" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                            Спецификация составника
                          </h4>
                        </div>
                        <Card className="group space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 shadow-inner transition-all hover:border-indigo-100">
                          <div className="space-y-1.5 border-b border-slate-200/50 pb-3 text-center">
                            <p className="text-[8px] font-bold uppercase leading-none tracking-widest text-slate-400">
=======
                          <Tag className="text-accent-primary h-3.5 w-3.5" />
                          <h4 className="text-text-primary text-[10px] font-bold uppercase tracking-widest">
                            Спецификация составника
                          </h4>
                        </div>
                        <Card className="border-border-subtle bg-bg-surface2/80 hover:border-accent-primary/20 group space-y-3 rounded-xl border p-4 shadow-inner transition-all">
                          <div className="border-border-default/50 space-y-1.5 border-b pb-3 text-center">
                            <p className="text-text-muted text-[8px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                              Текст на этикетке
                            </p>
                            {isEditing ? (
                              <textarea
                                value={careData.labelText}
                                onChange={(e) =>
                                  setCareData({ ...careData, labelText: e.target.value })
                                }
<<<<<<< HEAD
                                className="h-20 w-full rounded border border-slate-200 bg-white p-2 text-[10px] font-bold uppercase leading-relaxed text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            ) : (
                              <p className="whitespace-pre-line text-[10px] font-bold uppercase leading-relaxed text-slate-700 transition-colors group-hover:text-slate-900">
=======
                                className="text-text-primary border-border-default focus:ring-accent-primary h-20 w-full rounded border bg-white p-2 text-[10px] font-bold uppercase leading-relaxed outline-none focus:ring-1"
                              />
                            ) : (
                              <p className="text-text-primary group-hover:text-text-primary whitespace-pre-line text-[10px] font-bold uppercase leading-relaxed transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                <span className="text-slate-400">{spec.label}</span>
=======
                                <span className="text-text-muted">{spec.label}</span>
>>>>>>> recover/cabinet-wip-from-stash
                                {isEditing ? (
                                  <input
                                    value={spec.value}
                                    onChange={(e) => {
                                      const newSpecs = [...careData.labelSpecs];
                                      newSpecs[i].value = e.target.value;
                                      setCareData({ ...careData, labelSpecs: newSpecs });
                                    }}
<<<<<<< HEAD
                                    className="h-5 rounded border border-slate-200 bg-white px-1 text-right text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                ) : (
                                  <span className="text-slate-900">{spec.value}</span>
=======
                                    className="text-text-primary border-border-default focus:ring-accent-primary h-5 rounded border bg-white px-1 text-right outline-none focus:ring-1"
                                  />
                                ) : (
                                  <span className="text-text-primary">{spec.value}</span>
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                            className="h-8 w-full rounded-xl bg-slate-900 text-[8px] font-bold uppercase text-white shadow-lg"
=======
                            className="bg-text-primary h-8 w-full rounded-xl text-[8px] font-bold uppercase text-white shadow-lg"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                      <Card className="group space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 shadow-inner transition-all hover:border-indigo-100">
                        <div className="flex items-center gap-2 px-1">
                          <Scissors className="h-3.5 w-3.5 text-indigo-600" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
=======
                      <Card className="border-border-subtle bg-bg-surface2/80 hover:border-accent-primary/20 group space-y-3 rounded-xl border p-4 shadow-inner transition-all">
                        <div className="flex items-center gap-2 px-1">
                          <Scissors className="text-accent-primary h-3.5 w-3.5" />
                          <h4 className="text-text-primary text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                            Нитки и Иглы
                          </h4>
                        </div>
                        <div className="space-y-2.5">
                          {specsData.threads.map((item, i) => (
                            <div
                              key={i}
<<<<<<< HEAD
                              className="space-y-0.5 border-l-2 border-slate-200 pl-2 transition-colors group-hover:border-indigo-400"
                            >
                              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
=======
                              className="border-border-default group-hover:border-accent-primary/40 space-y-0.5 border-l-2 pl-2 transition-colors"
                            >
                              <p className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                  className="h-6 w-full rounded border border-slate-200 bg-white px-1 text-[10px] font-bold uppercase leading-tight outline-none focus:ring-1 focus:ring-indigo-500"
=======
                                  className="border-border-default focus:ring-accent-primary h-6 w-full rounded border bg-white px-1 text-[10px] font-bold uppercase leading-tight outline-none focus:ring-1"
>>>>>>> recover/cabinet-wip-from-stash
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

<<<<<<< HEAD
                      <Card className="group space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 shadow-inner transition-all hover:border-amber-100">
                        <div className="flex items-center gap-2 px-1">
                          <Thermometer className="h-3.5 w-3.5 text-amber-600" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
=======
                      <Card className="border-border-subtle bg-bg-surface2/80 group space-y-3 rounded-xl border p-4 shadow-inner transition-all hover:border-amber-100">
                        <div className="flex items-center gap-2 px-1">
                          <Thermometer className="h-3.5 w-3.5 text-amber-600" />
                          <h4 className="text-text-primary text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                            Режимы ВТО
                          </h4>
                        </div>
                        <div className="space-y-2.5">
                          {specsData.ironing.map((item, i) => (
                            <div
                              key={i}
<<<<<<< HEAD
                              className="space-y-0.5 border-l-2 border-slate-200 pl-2 transition-colors group-hover:border-amber-400"
                            >
                              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
=======
                              className="border-border-default space-y-0.5 border-l-2 pl-2 transition-colors group-hover:border-amber-400"
                            >
                              <p className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                  className="h-6 w-full rounded border border-slate-200 bg-white px-1 text-[10px] font-bold uppercase leading-tight outline-none focus:ring-1 focus:ring-amber-500"
=======
                                  className="border-border-default h-6 w-full rounded border bg-white px-1 text-[10px] font-bold uppercase leading-tight outline-none focus:ring-1 focus:ring-amber-500"
>>>>>>> recover/cabinet-wip-from-stash
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

<<<<<<< HEAD
                      <Card className="group space-y-3 rounded-xl border border-slate-100 bg-rose-50/10 p-4 shadow-inner transition-all hover:border-rose-100">
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
=======
                      <Card className="border-border-subtle group space-y-3 rounded-xl border bg-rose-50/10 p-4 shadow-inner transition-all hover:border-rose-100">
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                            <h4 className="text-text-primary text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                              Особые указания
                            </h4>
                          </div>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="icon"
<<<<<<< HEAD
                              className="h-5 w-5 rounded-full border border-slate-200 bg-white text-rose-600"
=======
                              className="border-border-default h-5 w-5 rounded-full border bg-white text-rose-600"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                    className="h-6 w-full rounded border border-slate-200 bg-white px-1 text-[9px] font-bold uppercase leading-relaxed tracking-tight text-slate-600 outline-none focus:ring-1 focus:ring-rose-500"
=======
                                    className="text-text-secondary border-border-default h-6 w-full rounded border bg-white px-1 text-[9px] font-bold uppercase leading-relaxed tracking-tight outline-none focus:ring-1 focus:ring-rose-500"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                <p className="text-[9px] font-bold uppercase leading-relaxed tracking-tight text-slate-600">
=======
                                <p className="text-text-secondary text-[9px] font-bold uppercase leading-relaxed tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                      <h3 className="text-base font-bold uppercase leading-none tracking-widest text-slate-900">
                        Спецификация швов
                      </h3>
                      <p className="text-[10px] font-bold uppercase leading-relaxed tracking-[0.15em] text-slate-400">
=======
                      <h3 className="text-text-primary text-base font-bold uppercase leading-none tracking-widest">
                        Спецификация швов
                      </h3>
                      <p className="text-text-muted text-[10px] font-bold uppercase leading-relaxed tracking-[0.15em]">
>>>>>>> recover/cabinet-wip-from-stash
                        Инструкции по типам швов, ниткам и обработке узлов.
                      </p>
                    </div>
                    <div className="mx-auto grid max-w-4xl gap-3 text-left md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
<<<<<<< HEAD
                          <h4 className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                            <Scissors className="h-3 w-3 text-indigo-600" /> Основные швы
=======
                          <h4 className="text-text-muted flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest">
                            <Scissors className="text-accent-primary h-3 w-3" /> Основные швы
>>>>>>> recover/cabinet-wip-from-stash
                          </h4>
                          {isEditing && (
                            <Button
                              onClick={() => addItem('seams')}
                              variant="ghost"
                              size="icon"
<<<<<<< HEAD
                              className="h-5 w-5 rounded-full border border-slate-200 bg-white text-indigo-600 shadow-sm"
=======
                              className="border-border-default text-accent-primary h-5 w-5 rounded-full border bg-white shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          {seamsData.map((stitch, i) => (
                            <div
                              key={i}
<<<<<<< HEAD
                              className="group flex cursor-default items-center justify-between rounded-xl border border-slate-100/50 bg-slate-50/50 p-2.5 transition-all hover:border-indigo-100 hover:bg-white hover:shadow-sm"
=======
                              className="bg-bg-surface2/80 border-border-subtle/50 hover:border-accent-primary/20 group flex cursor-default items-center justify-between rounded-xl border p-2.5 transition-all hover:bg-white hover:shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                      className="h-6 w-full rounded border border-slate-200 bg-white px-1 text-[10px] font-bold uppercase text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
=======
                                      className="text-text-primary border-border-default focus:ring-accent-primary h-6 w-full rounded border bg-white px-1 text-[10px] font-bold uppercase outline-none focus:ring-1"
>>>>>>> recover/cabinet-wip-from-stash
                                    />
                                    <input
                                      value={stitch.usage}
                                      onChange={(e) => {
                                        const newSeams = [...seamsData];
                                        newSeams[i].usage = e.target.value;
                                        setSeamsData(newSeams);
                                      }}
                                      placeholder="Где применяется"
<<<<<<< HEAD
                                      className="h-5 w-full rounded border border-slate-200 bg-white px-1 text-[8px] font-bold uppercase tracking-widest text-slate-400 outline-none focus:ring-1 focus:ring-indigo-500"
=======
                                      className="text-text-muted border-border-default focus:ring-accent-primary h-5 w-full rounded border bg-white px-1 text-[8px] font-bold uppercase tracking-widest outline-none focus:ring-1"
>>>>>>> recover/cabinet-wip-from-stash
                                    />
                                  </div>
                                ) : (
                                  <>
<<<<<<< HEAD
                                    <p className="text-[10px] font-bold uppercase text-slate-900 transition-colors group-hover:text-indigo-600">
                                      {stitch.type}
                                    </p>
                                    <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
=======
                                    <p className="text-text-primary group-hover:text-accent-primary text-[10px] font-bold uppercase transition-colors">
                                      {stitch.type}
                                    </p>
                                    <p className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                      className="h-5 w-16 rounded border border-slate-200 bg-white px-1 text-center text-[7px] font-bold uppercase outline-none focus:ring-1 focus:ring-indigo-500"
=======
                                      className="border-border-default focus:ring-accent-primary h-5 w-16 rounded border bg-white px-1 text-center text-[7px] font-bold uppercase outline-none focus:ring-1"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                    className="border-slate-200 bg-white text-[7px] font-bold uppercase shadow-sm"
=======
                                    className="border-border-default bg-white text-[7px] font-bold uppercase shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                        <h4 className="flex items-center gap-1.5 px-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
=======
                        <h4 className="text-text-muted flex items-center gap-1.5 px-1 text-[9px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Технологические узлы
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
<<<<<<< HEAD
                              className="group/node relative flex aspect-square cursor-zoom-in items-center justify-center overflow-hidden rounded-xl border border-slate-200/50 bg-slate-100/50 shadow-inner transition-all hover:border-indigo-100"
                            >
                              <FileSearch className="h-5 w-5 text-slate-300 transition-all group-hover/node:scale-110 group-hover/node:text-indigo-200" />
                              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 opacity-0 backdrop-blur-[1px] transition-opacity group-hover/node:opacity-100">
=======
                              className="bg-bg-surface2/50 border-border-default/50 group/node hover:border-accent-primary/20 relative flex aspect-square cursor-zoom-in items-center justify-center overflow-hidden rounded-xl border shadow-inner transition-all"
                            >
                              <FileSearch className="text-text-muted group-hover/node:text-accent-primary/40 h-5 w-5 transition-all group-hover/node:scale-110" />
                              <div className="bg-text-primary/60 absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-[1px] transition-opacity group-hover/node:opacity-100">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                            <div className="flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-transparent text-slate-300 transition-all hover:border-indigo-100 hover:text-indigo-600">
=======
                            <div className="border-border-default text-text-muted hover:border-accent-primary/20 hover:text-accent-primary flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed bg-transparent transition-all">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
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
=======
                      <TableHeader className="bg-bg-surface2/80">
                        <TableRow className="h-9 border-none hover:bg-transparent">
                          <TableHead className="text-text-muted h-9 py-2 pl-4 text-[9px] font-bold uppercase tracking-[0.2em]">
                            Операция
                          </TableHead>
                          <TableHead className="text-accent-primary h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em]">
                            SMV (мин)
                          </TableHead>
                          <TableHead className="text-text-muted h-9 text-center text-[9px] font-bold uppercase tracking-[0.2em]">
                            Ставка
                          </TableHead>
                          <TableHead className="text-text-muted h-9 pr-4 text-right text-[9px] font-bold uppercase tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
                            {isEditing ? 'Действия' : 'RUB'}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {smvData.map((op, i) => (
                          <TableRow
                            key={i}
<<<<<<< HEAD
                            className="group/row h-11 border-slate-100 transition-colors hover:bg-slate-50/50"
=======
                            className="hover:bg-bg-surface2/80 border-border-subtle group/row h-11 transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                          >
                            <TableCell className="py-2 pl-4">
                              <div className="space-y-0.5">
                                {isEditing ? (
                                  <div className="space-y-1">
                                    <input
                                      value={op.name}
                                      onChange={(e) => updateItem('smv', i, 'name', e.target.value)}
<<<<<<< HEAD
                                      className="h-6 w-full rounded border border-slate-200 bg-white px-1 text-[10px] font-bold uppercase leading-tight tracking-tight text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500"
=======
                                      className="text-text-primary border-border-default focus:ring-accent-primary h-6 w-full rounded border bg-white px-1 text-[10px] font-bold uppercase leading-tight tracking-tight outline-none focus:ring-1"
>>>>>>> recover/cabinet-wip-from-stash
                                    />
                                    <input
                                      value={op.rank}
                                      onChange={(e) => updateItem('smv', i, 'rank', e.target.value)}
                                      placeholder="Разряд"
<<<<<<< HEAD
                                      className="h-5 w-16 rounded border border-slate-200 bg-white px-1 text-center text-[7px] font-bold uppercase text-slate-400 outline-none focus:ring-1 focus:ring-indigo-500"
=======
                                      className="text-text-muted border-border-default focus:ring-accent-primary h-5 w-16 rounded border bg-white px-1 text-center text-[7px] font-bold uppercase outline-none focus:ring-1"
>>>>>>> recover/cabinet-wip-from-stash
                                    />
                                  </div>
                                ) : (
                                  <>
<<<<<<< HEAD
                                    <p className="text-[10px] font-bold uppercase leading-tight tracking-tight text-slate-900 transition-colors group-hover/row:text-indigo-600">
=======
                                    <p className="text-text-primary group-hover/row:text-accent-primary text-[10px] font-bold uppercase leading-tight tracking-tight transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                                      {op.name}
                                    </p>
                                    <Badge
                                      variant="outline"
<<<<<<< HEAD
                                      className="h-3.5 border-slate-200 bg-white px-1.5 text-[7px] font-bold uppercase tracking-widest text-slate-400 shadow-sm"
=======
                                      className="text-text-muted border-border-default h-3.5 bg-white px-1.5 text-[7px] font-bold uppercase tracking-widest shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                  className="h-6 w-12 rounded border border-slate-200 bg-white px-1 text-center font-mono text-[11px] font-bold text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              ) : (
                                <span className="font-mono text-[11px] font-bold tracking-tighter text-indigo-600">
=======
                                  className="text-accent-primary border-border-default focus:ring-accent-primary h-6 w-12 rounded border bg-white px-1 text-center font-mono text-[11px] font-bold outline-none focus:ring-1"
                                />
                              ) : (
                                <span className="text-accent-primary font-mono text-[11px] font-bold tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                  className="h-6 w-12 rounded border border-slate-200 bg-white px-1 text-center font-mono text-[10px] font-bold text-slate-400 outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              ) : (
                                <span className="font-mono text-[10px] font-bold tracking-tighter text-slate-400">
=======
                                  className="text-text-muted border-border-default focus:ring-accent-primary h-6 w-12 rounded border bg-white px-1 text-center font-mono text-[10px] font-bold outline-none focus:ring-1"
                                />
                              ) : (
                                <span className="text-text-muted font-mono text-[10px] font-bold tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                <span className="text-[11px] font-bold tracking-tighter text-slate-900">
=======
                                <span className="text-text-primary text-[11px] font-bold tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                className="h-8 w-full border-2 border-dashed border-slate-200 bg-transparent text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:border-indigo-100 hover:text-indigo-600"
=======
                                className="border-border-default text-text-muted hover:text-accent-primary hover:border-accent-primary/20 h-8 w-full border-2 border-dashed bg-transparent text-[9px] font-bold uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
                              >
                                <Plus className="mr-2 h-3 w-3" /> Добавить операцию
                              </Button>
                            </TableCell>
                          </TableRow>
                        )}
<<<<<<< HEAD
                        <TableRow className="h-12 border-none bg-slate-900 text-white shadow-xl">
                          <TableCell className="py-3 pl-4">
                            <p className="mb-1 text-[9px] font-bold uppercase leading-none tracking-[0.2em] text-indigo-400">
=======
                        <TableRow className="bg-text-primary h-12 border-none text-white shadow-xl">
                          <TableCell className="py-3 pl-4">
                            <p className="text-accent-primary mb-1 text-[9px] font-bold uppercase leading-none tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                          <Box className="h-3.5 w-3.5 text-indigo-600" />
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
=======
                          <Box className="text-accent-primary h-3.5 w-3.5" />
                          <h4 className="text-text-primary text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                            Складывание
                          </h4>
                        </div>
                        {isEditing ? (
                          <textarea
                            value={packData.folding}
                            onChange={(e) => setPackData({ ...packData, folding: e.target.value })}
<<<<<<< HEAD
                            className="h-24 w-full rounded-xl border border-slate-200 bg-white p-3 text-center text-[10px] font-bold uppercase leading-relaxed tracking-tight shadow-inner outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        ) : (
                          <div className="group rounded-xl border border-slate-100 bg-slate-50 p-3 text-center text-[10px] font-bold uppercase leading-relaxed tracking-tight shadow-inner transition-all duration-300 hover:border-indigo-100 hover:bg-white">
=======
                            className="border-border-default focus:ring-accent-primary h-24 w-full rounded-xl border bg-white p-3 text-center text-[10px] font-bold uppercase leading-relaxed tracking-tight shadow-inner outline-none focus:ring-1"
                          />
                        ) : (
                          <div className="bg-bg-surface2 border-border-subtle hover:border-accent-primary/20 group rounded-xl border p-3 text-center text-[10px] font-bold uppercase leading-relaxed tracking-tight shadow-inner transition-all duration-300 hover:bg-white">
>>>>>>> recover/cabinet-wip-from-stash
                            "{packData.folding}"
                          </div>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-2">
                            <Tag className="h-3.5 w-3.5 text-emerald-600" />
<<<<<<< HEAD
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
=======
                            <h4 className="text-text-primary text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                              Маркировка
                            </h4>
                          </div>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="icon"
<<<<<<< HEAD
                              className="h-5 w-5 rounded-full border border-slate-200 bg-white text-emerald-600 shadow-sm"
=======
                              className="border-border-default h-5 w-5 rounded-full border bg-white text-emerald-600 shadow-sm"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                              className="group/item flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 shadow-sm transition-all hover:border-emerald-200 hover:bg-white"
                            >
                              <div className="flex grow items-center gap-2.5">
                                <Info className="h-3.5 w-3.5 text-slate-300 transition-colors group-hover/item:text-emerald-600" />
=======
                              className="bg-bg-surface2/80 border-border-subtle group/item flex items-center justify-between rounded-xl border p-2.5 shadow-sm transition-all hover:border-emerald-200 hover:bg-white"
                            >
                              <div className="flex grow items-center gap-2.5">
                                <Info className="text-text-muted h-3.5 w-3.5 transition-colors group-hover/item:text-emerald-600" />
>>>>>>> recover/cabinet-wip-from-stash
                                {isEditing ? (
                                  <input
                                    value={req}
                                    onChange={(e) => {
                                      const newMarking = [...packData.marking];
                                      newMarking[i] = e.target.value;
                                      setPackData({ ...packData, marking: newMarking });
                                    }}
<<<<<<< HEAD
                                    className="w-full border-none bg-transparent text-[9px] font-bold uppercase leading-none tracking-widest text-slate-900 outline-none focus:ring-0"
                                  />
                                ) : (
                                  <p className="text-[9px] font-bold uppercase leading-none tracking-widest text-slate-900">
=======
                                    className="text-text-primary w-full border-none bg-transparent text-[9px] font-bold uppercase leading-none tracking-widest outline-none focus:ring-0"
                                  />
                                ) : (
                                  <p className="text-text-primary text-[9px] font-bold uppercase leading-none tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                                <ChevronRight className="h-2.5 w-2.5 text-slate-200" />
=======
                                <ChevronRight className="text-text-muted h-2.5 w-2.5" />
>>>>>>> recover/cabinet-wip-from-stash
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
<<<<<<< HEAD
                    <div className="group relative flex items-center justify-between overflow-hidden rounded-2xl bg-indigo-600 p-3 text-white shadow-lg transition-colors hover:bg-indigo-700">
=======
                    <div className="bg-accent-primary hover:bg-accent-primary group relative flex items-center justify-between overflow-hidden rounded-2xl p-3 text-white shadow-lg transition-colors">
>>>>>>> recover/cabinet-wip-from-stash
                      <div className="absolute -bottom-4 -right-4 opacity-10 transition-transform duration-700 group-hover:scale-110">
                        <Box className="h-20 w-20" />
                      </div>
                      <div className="relative z-10 flex w-full items-center gap-3.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 shadow-inner transition-transform group-hover:scale-105">
                          <Ruler className="w-4.5 h-4.5 text-amber-400" />
                        </div>
                        <div className="grow space-y-0.5">
<<<<<<< HEAD
                          <p className="mb-1 text-[8px] font-bold uppercase leading-none tracking-[0.2em] text-indigo-200">
=======
                          <p className="text-accent-primary/40 mb-1 text-[8px] font-bold uppercase leading-none tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                          className="relative z-10 ml-4 h-7 shrink-0 cursor-pointer rounded-lg border-white/30 bg-white/5 px-3 text-[8px] font-bold uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white hover:text-indigo-600"
=======
                          className="hover:text-accent-primary relative z-10 ml-4 h-7 shrink-0 cursor-pointer rounded-lg border-white/30 bg-white/5 px-3 text-[8px] font-bold uppercase tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white"
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                        <History className="h-4 w-4 text-indigo-600" />
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                          История изменений Tech Pack
=======
                        <History className="text-accent-primary h-4 w-4" />
                        <h3 className="text-text-primary text-sm font-bold uppercase tracking-widest">
                          История изменений техпака
>>>>>>> recover/cabinet-wip-from-stash
                        </h3>
                      </div>
                      {isEditing && (
                        <Button
                          onClick={() =>
                            setHistoryData([
                              {
<<<<<<< HEAD
                                version: 'New',
                                date: new Date().toLocaleDateString(),
                                author: 'Current User',
=======
                                version: 'Новая',
                                date: new Date().toLocaleDateString(),
                                author: 'Текущий пользователь',
>>>>>>> recover/cabinet-wip-from-stash
                                changes: 'Новое изменение',
                              },
                              ...historyData,
                            ])
                          }
<<<<<<< HEAD
                          className="h-7 gap-1.5 rounded-lg bg-slate-900 text-[9px] font-bold uppercase tracking-widest text-white"
=======
                          className="bg-text-primary h-7 gap-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-white"
>>>>>>> recover/cabinet-wip-from-stash
                        >
                          <Plus className="h-3 w-3" /> Добавить запись
                        </Button>
                      )}
                    </div>
                    <div className="space-y-3">
                      {historyData.map((rev, i) => (
                        <div
                          key={i}
<<<<<<< HEAD
                          className="group space-y-2 rounded-2xl border border-slate-100 bg-slate-50/30 p-4 transition-all hover:border-indigo-100 hover:bg-white"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Badge className="h-5 border-none bg-indigo-600 px-2 text-[9px] font-black text-white">
                                v{rev.version}
                              </Badge>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
=======
                          className="border-border-subtle bg-bg-surface2/30 hover:border-accent-primary/20 group space-y-2 rounded-2xl border p-4 transition-all hover:bg-white"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Badge className="bg-accent-primary h-5 border-none px-2 text-[9px] font-black text-white">
                                v{rev.version}
                              </Badge>
                              <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
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
<<<<<<< HEAD
                              className="h-16 w-full rounded border border-slate-200 bg-white p-2 text-[11px] font-bold uppercase leading-relaxed tracking-tight text-slate-600 outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          ) : (
                            <p className="text-[11px] font-bold uppercase leading-relaxed tracking-tight text-slate-600">
=======
                              className="text-text-secondary border-border-default focus:ring-accent-primary h-16 w-full rounded border bg-white p-2 text-[11px] font-bold uppercase leading-relaxed tracking-tight outline-none focus:ring-1"
                            />
                          ) : (
                            <p className="text-text-secondary text-[11px] font-bold uppercase leading-relaxed tracking-tight">
>>>>>>> recover/cabinet-wip-from-stash
                              {rev.changes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
<<<<<<< HEAD
                    <div className="border-t border-slate-100 pt-4">
=======
                    <div className="border-border-subtle border-t pt-4">
>>>>>>> recover/cabinet-wip-from-stash
                      <AuditTrailList entityType="tech_pack" entityId={techPack.id} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
<<<<<<< HEAD
      </div>
=======
      </RegistryPageShell>
>>>>>>> recover/cabinet-wip-from-stash
    </TooltipProvider>
  );
}
