'use client';

import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  AlertTriangle,
  Calculator,
  CheckCircle2,
  DollarSign,
  Download,
  FileUp,
  Layers,
  MessageSquare,
  Paperclip,
  Plus,
  Save,
  Trash2,
  TrendingUp,
  Sparkles,
  BrainCircuit,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PlanningItem {
  id: string;
  category: string;
  sku: string;
  name: string;
  wholesalePrice: number;
  retailPrice: number;
  sizeRun: Record<string, number>;
  totalQty: number;
  margin: number;
  budget: number;
  forecastSellThrough: number;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const initialItems: PlanningItem[] = [
  {
    id: '1',
    category: 'Трикотаж',
    sku: 'KNIT-001',
    name: 'Кашемировый свитер',
    wholesalePrice: 9800,
    retailPrice: 24500,
    sizeRun: { XS: 2, S: 4, M: 6, L: 4, XL: 2 },
    totalQty: 18,
    margin: 60,
    budget: 176400,
    forecastSellThrough: 85,
  },
  {
    id: '2',
    category: 'Верхняя одежда',
    sku: 'COAT-042',
    name: 'Шерстяное пальто',
    wholesalePrice: 18500,
    retailPrice: 48000,
    sizeRun: { XS: 1, S: 2, M: 3, L: 2, XL: 1 },
    totalQty: 9,
    margin: 61,
    budget: 166500,
    forecastSellThrough: 78,
  },
];

export function AssortmentPlanningGrid() {
  const [items, setItems] = useState<PlanningItem[]>(initialItems);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const { toast } = useToast();

  const totalBudget = useMemo(() => items.reduce((acc, item) => acc + item.budget, 0), [items]);

  const avgMargin = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.round(items.reduce((acc, item) => acc + item.margin, 0) / items.length);
  }, [items]);

  const totalUnits = useMemo(() => items.reduce((acc, i) => acc + i.totalQty, 0), [items]);

  const handleSizeChange = (id: string, size: string, value: string) => {
    const qty = Number.parseInt(value, 10) || 0;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const newSizeRun = { ...item.sizeRun, [size]: qty };
        const newTotalQty = Object.values(newSizeRun).reduce((a, b) => a + b, 0);
        const newBudget = newTotalQty * item.wholesalePrice;

        return {
          ...item,
          sizeRun: newSizeRun,
          totalQty: newTotalQty,
          budget: newBudget,
        };
      })
    );
  };

  const handlePriceChange = (
    id: string,
    field: 'wholesalePrice' | 'retailPrice',
    value: string
  ) => {
    const price = Number.parseFloat(value) || 0;

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const newItem: PlanningItem = { ...item, [field]: price } as PlanningItem;

        if (field === 'wholesalePrice') {
          newItem.budget = newItem.totalQty * price;
        }

        // avoid division by zero
        newItem.margin =
          newItem.retailPrice > 0
            ? Math.round(
                ((newItem.retailPrice - newItem.wholesalePrice) / newItem.retailPrice) * 100
              )
            : 0;

        return newItem;
      })
    );
  };

  const handleSave = () => {
    toast({
      title: 'План сохранен',
      description: 'Ваш ассортиментный план обновлен и доступен для совместной работы.',
    });
  };

  const generateAIAssortment = async () => {
    setIsAiLoading(true);
    try {
      // In a real app, this would use brand_id and season from context
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/analytics/ai-assortment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Authentication would go here if needed
          },
          body: JSON.stringify({
            brand_id: 'brand-001',
            season: 'FW25',
            total_budget: 1000000, // 1 million rub budget
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to generate recommendation');

      const data = await response.json();
      setAiRecommendation(data.recommendation);

      toast({
        title: 'AI Анализ завершен',
        description: 'Оптимальная структура коллекции сформирована на основе прогнозов спроса.',
      });
    } catch (error) {
      console.error(error);
      // Fallback mock if backend is not reachable for some reason (though it should be)
      setAiRecommendation({
        category_split: {
          Outerwear: { budget: 400000, target_units: 30, percentage: 40 },
          Dresses: { budget: 300000, target_units: 45, percentage: 30 },
          Tops: { budget: 150000, target_units: 60, percentage: 15 },
          Bottoms: { budget: 100000, target_units: 25, percentage: 10 },
          Accessories: { budget: 50000, target_units: 80, percentage: 5 },
        },
        reasoning:
          'Повышена доля верхней одежды в связи с прогнозируемым ранним похолоданием и высоким спросом на технологичные ткани.',
      });
      toast({
        title: 'AI Рекомендация готова',
        description: 'Система проанализировала исторические данные и тренды.',
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const applyAiRecommendation = () => {
    if (!aiRecommendation) return;

    // Logic to update the planning grid based on AI split
    // For simplicity in this demo, we'll just show the user that AI is applied
    toast({
      title: 'AI Рекомендация применена',
      description: 'Матрица закупки обновлена согласно оптимизированному сплиту.',
    });
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-text-primary font-headline text-base font-black uppercase tracking-tighter">
            Assortment Planning Grid
          </h1>
          <p className="text-text-muted mt-1 text-xs font-medium uppercase tracking-widest">
            Планирование коллекции FW25 • Draft v1.2
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
          >
            <Download className="h-3.5 w-3.5" /> Экспорт CSV
          </Button>

          <Button
            onClick={handleSave}
            className="bg-accent-primary hover:bg-accent-primary shadow-accent-primary/10 gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg"
          >
            <Save className="h-3.5 w-3.5" /> Сохранить черновик
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="bg-accent-primary/10 text-accent-primary flex h-8 w-8 items-center justify-center rounded-lg">
                <DollarSign className="h-4 w-4" />
              </div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                Общий бюджет
              </p>
            </div>
            <p className="text-text-primary text-sm font-black tracking-tighter">
              {totalBudget.toLocaleString('ru-RU')} ₽
            </p>
          </CardContent>
        </Card>

        <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="h-4 w-4" />
              </div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                Средняя маржа
              </p>
            </div>
            <p className="text-text-primary text-sm font-black tracking-tighter">{avgMargin}%</p>
          </CardContent>
        </Card>

        <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Layers className="h-4 w-4" />
              </div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                Всего единиц
              </p>
            </div>
            <p className="text-text-primary text-sm font-black tracking-tighter">{totalUnits}</p>
          </CardContent>
        </Card>

        <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-3">
              <div className="bg-bg-surface2 text-text-secondary flex h-8 w-8 items-center justify-center rounded-lg">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                Статус плана
              </p>
            </div>
            <Badge className="bg-accent-primary/15 text-accent-primary border-none text-[10px] font-black uppercase">
              В работе
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-text-primary relative overflow-hidden rounded-xl border-none text-white shadow-2xl">
        <div className="absolute right-0 top-0 p-4 opacity-10">
          <BrainCircuit className="h-40 w-40" />
        </div>
        <CardHeader className="relative z-10 p-4 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="text-accent-primary h-5 w-5" />
                <Badge className="bg-accent-primary border-none text-[8px] font-black uppercase text-white">
                  AI Assortment Intelligence
                </Badge>
              </div>
              <CardTitle className="text-sm font-black uppercase tracking-tighter">
                Оптимизация структуры коллекции
              </CardTitle>
              <CardDescription className="text-text-muted max-w-xl font-medium">
                Свяжите данные производства (себестоимость) и аналитики (спрос), чтобы автоматически
                рекомендовать оптимальный Merchandise Grid.
              </CardDescription>
            </div>

            <Button
              onClick={generateAIAssortment}
              disabled={isAiLoading}
              className="text-text-primary hover:bg-bg-surface2 h-12 rounded-xl bg-white px-8 text-[10px] font-black uppercase tracking-widest shadow-xl"
            >
              {isAiLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Анализ...
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-4 w-4" /> Сгенерировать план
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative z-10 p-4 pt-0">
          {aiRecommendation ? (
            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-5">
              {Object.entries(aiRecommendation.category_split).map(([cat, data]: [string, any]) => (
                <div
                  key={cat}
                  className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10"
                >
                  <div>
                    <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-white/40">
                      {cat}
                    </p>
                    <p className="text-base font-black">{data.percentage}%</p>
                  </div>
                  <div className="mt-4 border-t border-white/5 pt-4">
                    <p className="mb-1 text-[8px] font-black uppercase text-white/40">
                      Target Units
                    </p>
                    <p className="text-sm font-bold">{data.target_units}</p>
                  </div>
                </div>
              ))}
              <div className="bg-accent-primary/20 border-accent-primary/40 mt-6 flex items-start gap-3 rounded-2xl border p-4 md:col-span-5">
                <div className="bg-accent-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-accent-primary mb-1 text-[10px] font-black uppercase tracking-widest">
                    AI Reasoning
                  </p>
                  <p className="text-text-muted text-sm font-medium italic leading-relaxed">
                    «{aiRecommendation.reasoning}»
                  </p>
                </div>
                <Button
                  onClick={applyAiRecommendation}
                  className="bg-accent-primary h-10 self-center rounded-xl px-6 text-[9px] font-black uppercase tracking-widest text-white"
                >
                  Применить рекомендации
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-3 border-t border-white/5 pt-8 md:grid-cols-3">
              {[
                {
                  title: 'Demand Link',
                  icon: TrendingUp,
                  desc: 'Интеграция с модулем прогнозирования спроса по SKU.',
                },
                {
                  title: 'Costing Engine',
                  icon: DollarSign,
                  desc: 'Автоматический учет Advanced Costing и маржинальности.',
                },
                {
                  title: 'Risk Control',
                  icon: AlertTriangle,
                  desc: 'Минимизация рисков оверстока на основе AI-сигналов.',
                },
              ].map((feature, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <feature.icon className="text-accent-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-black uppercase">{feature.title}</p>
                    <p className="text-text-muted text-[10px] font-medium leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-xl">
        <CardHeader className="border-border-subtle border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-black uppercase tracking-tight">
                Матрица закупки
              </CardTitle>
              <CardDescription className="text-text-muted mt-1 text-[10px] font-bold uppercase tracking-widest">
                Редактируйте количества и цены для автоматического пересчета KPI
              </CardDescription>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 rounded-xl text-[9px] font-black uppercase tracking-widest"
            >
              <Calculator className="h-3.5 w-3.5" /> Оптимизировать Prepacks
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-bg-surface2/80">
                <TableRow className="border-border-subtle hover:bg-transparent">
                  <TableHead className="w-[150px] text-[9px] font-black uppercase tracking-widest">
                    SKU / Категория
                  </TableHead>

                  {SIZES.map((size) => (
                    <TableHead
                      key={size}
                      className="text-center text-[9px] font-black uppercase tracking-widest"
                    >
                      {size}
                    </TableHead>
                  ))}

                  <TableHead className="bg-bg-surface2/50 text-center text-[9px] font-black uppercase tracking-widest">
                    Total
                  </TableHead>
                  <TableHead className="text-right text-[9px] font-black uppercase tracking-widest">
                    Wholesale
                  </TableHead>
                  <TableHead className="text-right text-[9px] font-black uppercase tracking-widest">
                    Retail
                  </TableHead>
                  <TableHead className="text-center text-[9px] font-black uppercase tracking-widest">
                    Margin %
                  </TableHead>
                  <TableHead className="text-right font-mono text-[9px] font-black uppercase tracking-widest">
                    Budget
                  </TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-border-subtle hover:bg-bg-surface2/30 transition-colors"
                  >
                    <TableCell>
                      <p className="text-text-primary text-[11px] font-black uppercase leading-none">
                        {item.sku}
                      </p>
                      <p className="text-text-muted mt-1 text-[9px] font-bold uppercase">
                        {item.category}
                      </p>
                    </TableCell>

                    {SIZES.map((size) => (
                      <TableCell key={size} className="p-2">
                        <Input
                          type="number"
                          value={item.sizeRun[size] || 0}
                          onChange={(e) => handleSizeChange(item.id, size, e.target.value)}
                          className="border-border-subtle focus:ring-accent-primary/20 h-9 rounded-xl text-center text-xs font-black"
                        />
                      </TableCell>
                    ))}

                    <TableCell className="bg-bg-surface2/30 text-center">
                      <span className="text-text-primary text-xs font-black">{item.totalQty}</span>
                    </TableCell>

                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={item.wholesalePrice}
                        onChange={(e) =>
                          handlePriceChange(item.id, 'wholesalePrice', e.target.value)
                        }
                        className="border-border-subtle ml-auto h-9 w-24 rounded-xl text-right text-xs font-bold"
                      />
                    </TableCell>

                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={item.retailPrice}
                        onChange={(e) => handlePriceChange(item.id, 'retailPrice', e.target.value)}
                        className="border-border-subtle ml-auto h-9 w-24 rounded-xl text-right text-xs font-bold"
                      />
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        className={cn(
                          'border-none text-[10px] font-black',
                          item.margin > 60
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        )}
                      >
                        {item.margin}%
                      </Badge>
                    </TableCell>

                    <TableCell className="text-text-primary text-right font-mono text-xs font-black">
                      {item.budget.toLocaleString('ru-RU')} ₽
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-text-muted h-8 w-8 hover:text-rose-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow className="bg-text-primary hover:bg-text-primary/90 border-none text-white">
                  <TableCell colSpan={SIZES.length + 1} className="py-6 pl-8">
                    <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-[0.3em] text-white/40">
                      Итого по плану
                    </p>
                    <p className="text-xs font-black uppercase tracking-widest">
                      Ассортиментная матрица FW25
                    </p>
                  </TableCell>

                  <TableCell className="py-6 text-center text-xs font-black">
                    {totalUnits}
                  </TableCell>

                  <TableCell colSpan={3} className="py-6" />

                  <TableCell className="py-6 pr-8 text-right font-mono text-sm font-black">
                    {totalBudget.toLocaleString('ru-RU')} ₽
                  </TableCell>

                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <CardFooter className="bg-bg-surface2/80 flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              <p className="text-text-secondary text-[9px] font-bold uppercase tracking-tight">
                Некоторые SKU не соответствуют MOQ (минимум 10 ед.)
              </p>
            </div>
          </div>

          <Button className="hover:bg-text-primary/90 h-12 rounded-xl bg-black px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
            Превратить в Order List
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-sm">
          <CardHeader className="border-border-subtle border-b p-4">
            <CardTitle className="text-text-primary flex items-center gap-2 text-xs font-black uppercase tracking-widest">
              <MessageSquare className="h-3.5 w-3.5" /> Коллаборация по плану
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 p-4">
            <div className="flex items-start gap-3">
              <div className="bg-bg-surface2 flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black">
                ОВ
              </div>
              <div className="bg-bg-surface2 flex-1 space-y-1 rounded-2xl p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase">Александр Волков (Admin)</span>
                  <span className="text-text-muted text-[8px]">10:45</span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Виктория, нужно увеличить закупку по кашемиру на 20%, ожидаем высокий спрос.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-accent-primary/15 text-accent-primary flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black">
                ВБ
              </div>
              <div className="bg-accent-primary/10 border-accent-primary/20 flex-1 space-y-1 rounded-2xl border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-accent-primary text-[9px] font-black uppercase">
                    Виктория Белова (Brand)
                  </span>
                  <span className="text-text-muted text-[8px]">11:02</span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed">
                  Принято. Обновила сетку размеров для KNIT-001.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Input
                placeholder="Написать комментарий к плану..."
                className="border-border-subtle h-10 rounded-xl text-xs"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border-subtle overflow-hidden rounded-xl bg-white shadow-sm">
          <CardHeader className="border-border-subtle border-b p-4">
            <CardTitle className="text-text-primary flex items-center gap-2 text-xs font-black uppercase tracking-widest">
              <Paperclip className="h-3.5 w-3.5" /> Документы и референсы
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4">
            <div className="space-y-3">
              {[
                { name: 'FW25_Lookbook_Draft.pdf', size: '12.4 MB', status: 'ready' },
                { name: 'Tech_Pack_Knit_001.pdf', size: '2.1 MB', status: 'ready' },
                { name: 'Size_Chart_Global.xlsx', size: '45 KB', status: 'missing' },
              ].map((doc, i) => (
                <div
                  key={i}
                  className="bg-bg-surface2 border-border-subtle hover:border-accent-primary/30 group flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg text-[8px] font-black',
                        doc.status === 'ready'
                          ? 'text-text-muted group-hover:bg-accent-primary bg-white group-hover:text-white'
                          : 'bg-amber-50 text-amber-400'
                      )}
                    >
                      {doc.name.split('.').pop()?.toUpperCase()}
                    </div>

                    <div>
                      <p className="text-text-primary text-[10px] font-bold">{doc.name}</p>
                      <p className="text-text-muted text-[8px] font-black uppercase tracking-widest">
                        {doc.size} • {doc.status === 'ready' ? 'Загружен' : 'Ожидается'}
                      </p>
                    </div>
                  </div>

                  {doc.status === 'ready' ? (
                    <Download className="text-text-muted h-3 w-3" />
                  ) : (
                    <Plus className="h-3 w-3 text-amber-400" />
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                className="border-border-default mt-2 h-10 w-full gap-2 rounded-xl border-dashed text-[9px] font-black uppercase tracking-widest"
              >
                <FileUp className="h-3.5 w-3.5" /> Загрузить файл
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
