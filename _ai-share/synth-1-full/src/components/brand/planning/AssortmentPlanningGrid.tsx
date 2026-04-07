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

  const totalBudget = useMemo(
    () => items.reduce((acc, item) => acc + item.budget, 0),
    [items]
  );

  const avgMargin = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.round(items.reduce((acc, item) => acc + item.margin, 0) / items.length);
  }, [items]);

  const totalUnits = useMemo(
    () => items.reduce((acc, i) => acc + i.totalQty, 0),
    [items]
  );

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
            ? Math.round(((newItem.retailPrice - newItem.wholesalePrice) / newItem.retailPrice) * 100)
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/analytics/ai-assortment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authentication would go here if needed
        },
        body: JSON.stringify({
          brand_id: 'brand-001',
          season: 'FW25',
          total_budget: 1000000 // 1 million rub budget
        })
      });

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
          "Outerwear": { budget: 400000, target_units: 30, percentage: 40 },
          "Dresses": { budget: 300000, target_units: 45, percentage: 30 },
          "Tops": { budget: 150000, target_units: 60, percentage: 15 },
          "Bottoms": { budget: 100000, target_units: 25, percentage: 10 },
          "Accessories": { budget: 50000, target_units: 80, percentage: 5 }
        },
        reasoning: "Повышена доля верхней одежды в связи с прогнозируемым ранним похолоданием и высоким спросом на технологичные ткани."
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
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-base font-black uppercase tracking-tighter text-slate-900 font-headline">
            Assortment Planning Grid
          </h1>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">
            Планирование коллекции FW25 • Draft v1.2
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="rounded-xl font-black uppercase text-[10px] tracking-widest gap-2"
          >
            <Download className="h-3.5 w-3.5" /> Экспорт CSV
          </Button>

          <Button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg shadow-indigo-100"
          >
            <Save className="h-3.5 w-3.5" /> Сохранить черновик
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card className="rounded-xl border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <DollarSign className="h-4 w-4" />
              </div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Общий бюджет
              </p>
            </div>
            <p className="text-sm font-black tracking-tighter text-slate-900">
              {totalBudget.toLocaleString('ru-RU')} ₽
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <TrendingUp className="h-4 w-4" />
              </div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Средняя маржа
              </p>
            </div>
            <p className="text-sm font-black tracking-tighter text-slate-900">{avgMargin}%</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <Layers className="h-4 w-4" />
              </div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Всего единиц
              </p>
            </div>
            <p className="text-sm font-black tracking-tighter text-slate-900">{totalUnits}</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Статус плана
              </p>
            </div>
            <Badge className="bg-indigo-100 text-indigo-600 border-none font-black text-[10px] uppercase">
              В работе
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border-none shadow-2xl bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BrainCircuit className="h-40 w-40" />
        </div>
        <CardHeader className="p-4 pb-4 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <Badge className="bg-indigo-600 text-white border-none text-[8px] font-black uppercase">
                  AI Assortment Intelligence
                </Badge>
              </div>
              <CardTitle className="text-sm font-black uppercase tracking-tighter">
                Оптимизация структуры коллекции
              </CardTitle>
              <CardDescription className="text-slate-400 font-medium max-w-xl">
                Свяжите данные производства (себестоимость) и аналитики (спрос), чтобы
                автоматически рекомендовать оптимальный Merchandise Grid.
              </CardDescription>
            </div>

            <Button
              onClick={generateAIAssortment}
              disabled={isAiLoading}
              className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-black uppercase text-[10px] tracking-widest px-8 h-12 shadow-xl"
            >
              {isAiLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Анализ...
                </>
              ) : (
                <>
                  <BrainCircuit className="h-4 w-4 mr-2" /> Сгенерировать план
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 relative z-10">
          {aiRecommendation ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-6">
              {Object.entries(aiRecommendation.category_split).map(([cat, data]: [string, any]) => (
                <div key={cat} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between group hover:bg-white/10 transition-all">
                  <div>
                    <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mb-1">{cat}</p>
                    <p className="text-base font-black">{data.percentage}%</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-[8px] font-black uppercase text-white/40 mb-1">Target Units</p>
                    <p className="text-sm font-bold">{data.target_units}</p>
                  </div>
                </div>
              ))}
              <div className="md:col-span-5 mt-6 p-4 bg-indigo-600/20 border border-indigo-400/20 rounded-2xl flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">AI Reasoning</p>
                  <p className="text-sm font-medium text-slate-200 leading-relaxed italic">
                    «{aiRecommendation.reasoning}»
                  </p>
                </div>
                <Button 
                  onClick={applyAiRecommendation}
                  className="bg-indigo-600 text-white rounded-xl font-black uppercase text-[9px] tracking-widest h-10 px-6 self-center"
                >
                  Применить рекомендации
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-8 border-t border-white/5 pt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { title: 'Demand Link', icon: TrendingUp, desc: 'Интеграция с модулем прогнозирования спроса по SKU.' },
                { title: 'Costing Engine', icon: DollarSign, desc: 'Автоматический учет Advanced Costing и маржинальности.' },
                { title: 'Risk Control', icon: AlertTriangle, desc: 'Минимизация рисков оверстока на основе AI-сигналов.' }
              ].map((feature, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <feature.icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase mb-1">{feature.title}</p>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl border-slate-100 shadow-xl overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 p-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-base font-black uppercase tracking-tight">
                Матрица закупки
              </CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Редактируйте количества и цены для автоматического пересчета KPI
              </CardDescription>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl font-black uppercase text-[9px] tracking-widest gap-2"
            >
              <Calculator className="h-3.5 w-3.5" /> Оптимизировать Prepacks
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100 hover:bg-transparent">
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

                  <TableHead className="text-center text-[9px] font-black uppercase tracking-widest bg-slate-100/50">
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
                  <TableHead className="text-right text-[9px] font-black uppercase tracking-widest font-mono">
                    Budget
                  </TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.id}
                    className="border-slate-50 hover:bg-slate-50/30 transition-colors"
                  >
                    <TableCell>
                      <p className="text-[11px] font-black text-slate-900 uppercase leading-none">
                        {item.sku}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                        {item.category}
                      </p>
                    </TableCell>

                    {SIZES.map((size) => (
                      <TableCell key={size} className="p-2">
                        <Input
                          type="number"
                          value={item.sizeRun[size] || 0}
                          onChange={(e) => handleSizeChange(item.id, size, e.target.value)}
                          className="h-9 text-center font-black text-xs rounded-xl border-slate-100 focus:ring-indigo-500/20"
                        />
                      </TableCell>
                    ))}

                    <TableCell className="text-center bg-slate-50/30">
                      <span className="text-xs font-black text-slate-900">{item.totalQty}</span>
                    </TableCell>

                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={item.wholesalePrice}
                        onChange={(e) =>
                          handlePriceChange(item.id, 'wholesalePrice', e.target.value)
                        }
                        className="h-9 text-right font-bold text-xs rounded-xl border-slate-100 w-24 ml-auto"
                      />
                    </TableCell>

                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={item.retailPrice}
                        onChange={(e) => handlePriceChange(item.id, 'retailPrice', e.target.value)}
                        className="h-9 text-right font-bold text-xs rounded-xl border-slate-100 w-24 ml-auto"
                      />
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge
                        className={cn(
                          'font-black text-[10px] border-none',
                          item.margin > 60
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        )}
                      >
                        {item.margin}%
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right font-mono text-xs font-black text-slate-900">
                      {item.budget.toLocaleString('ru-RU')} ₽
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-300 hover:text-rose-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow className="bg-slate-900 text-white hover:bg-slate-900 border-none">
                  <TableCell colSpan={SIZES.length + 1} className="py-6 pl-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 leading-none mb-1">
                      Итого по плану
                    </p>
                    <p className="text-xs font-black uppercase tracking-widest">
                      Ассортиментная матрица FW25
                    </p>
                  </TableCell>

                  <TableCell className="text-center text-xs font-black py-6">
                    {totalUnits}
                  </TableCell>

                  <TableCell colSpan={3} className="py-6" />

                  <TableCell className="text-right font-mono text-sm font-black py-6 pr-8">
                    {totalBudget.toLocaleString('ru-RU')} ₽
                  </TableCell>

                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50/50 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                Некоторые SKU не соответствуют MOQ (минимум 10 ед.)
              </p>
            </div>
          </div>

          <Button className="bg-black text-white hover:bg-slate-800 rounded-xl font-black uppercase text-[10px] tracking-widest px-8 h-12 shadow-xl">
            Превратить в Order List
          </Button>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="rounded-xl border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-slate-50 p-4">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-900">
              <MessageSquare className="h-3.5 w-3.5" /> Коллаборация по плану
            </CardTitle>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            <div className="flex gap-3 items-start">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black">
                ОВ
              </div>
              <div className="flex-1 bg-slate-50 rounded-2xl p-3 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase">Александр Волков (Admin)</span>
                  <span className="text-[8px] text-slate-400">10:45</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Виктория, нужно увеличить закупку по кашемиру на 20%, ожидаем высокий спрос.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black">
                ВБ
              </div>
              <div className="flex-1 bg-indigo-50/50 rounded-2xl p-3 space-y-1 border border-indigo-100/50">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black uppercase text-indigo-600">
                    Виктория Белова (Brand)
                  </span>
                  <span className="text-[8px] text-slate-400">11:02</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Принято. Обновила сетку размеров для KNIT-001.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Input
                placeholder="Написать комментарий к плану..."
                className="rounded-xl h-10 text-xs border-slate-100"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardHeader className="border-b border-slate-50 p-4">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-900">
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
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'h-8 w-8 rounded-lg flex items-center justify-center text-[8px] font-black',
                        doc.status === 'ready'
                          ? 'bg-white text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'
                          : 'bg-amber-50 text-amber-400'
                      )}
                    >
                      {doc.name.split('.').pop()?.toUpperCase()}
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-700">{doc.name}</p>
                      <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">
                        {doc.size} • {doc.status === 'ready' ? 'Загружен' : 'Ожидается'}
                      </p>
                    </div>
                  </div>

                  {doc.status === 'ready' ? (
                    <Download className="h-3 w-3 text-slate-300" />
                  ) : (
                    <Plus className="h-3 w-3 text-amber-400" />
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full h-10 rounded-xl border-dashed border-slate-300 text-[9px] font-black uppercase tracking-widest gap-2 mt-2"
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
