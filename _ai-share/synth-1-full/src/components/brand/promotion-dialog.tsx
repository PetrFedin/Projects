'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  PlusCircle,
  Loader2,
  Wand2,
  TrendingUp,
  Cpu,
  Users,
  ShoppingBag,
  Eye,
  Calendar as CalendarIcon,
  X,
  Rocket,
  Trash2,
} from 'lucide-react';
import type { Product, PromotionType, Kpi } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Combobox } from '../ui/combobox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Separator } from '../ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Switch } from '../ui/switch';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { DateRange } from 'react-day-picker';
import { format, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';

interface PromotionDialogProps {
  product?: Product;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialType?: PromotionType | 'discount' | 'outlet' | 'promo_code' | 'kickstarter_boost';
  initialName?: string;
}

const promotionTypes = [
  { value: 'catalog_boost', label: 'Буст в каталоге' },
  { value: 'outlet_boost', label: 'Буст в аутлете' },
  { value: 'homepage_banner', label: 'Баннер на главной' },
  { value: 'stories_feature', label: 'Промо в историях' },
  { value: 'email_blast', label: 'Email-рассылка' },
  { value: 'shoppable_video', label: 'Shoppable Video' },
  { value: 'shop_the_look', label: 'Продвижение образа' },
  { value: 'live_shopping_event', label: 'Live Shopping' },
  { value: 'kickstarter_boost', label: 'Продвижение Kickstarter' },
  { value: 'ugc_sponsorship', label: 'Спонсорство UGC' },
  { value: 'discount', label: 'Скидка (%)' },
  { value: 'promo_code', label: 'Промокод' },
  { value: 'outlet', label: 'Перенос в Аутлет' },
];

const kpiOptions = [
  { value: 'roi', label: 'Макс. ROI' },
  { value: 'ctr', label: 'Макс. CTR' },
  { value: 'reach', label: 'Макс. охват' },
  { value: 'conversion', label: 'Макс. конверсия в покупку' },
];

const ageSegments = [
  { value: 'all', label: 'Все возрасты' },
  { value: '18-24', label: '18-24' },
  { value: '25-34', label: '25-34' },
  { value: '35-44', label: '35-44' },
  { value: '45+', label: '45+' },
];

const geoSegments = [
  { value: 'russia', label: 'Россия' },
  { value: 'moscow', label: 'Москва' },
  { value: 'spb', label: 'Санкт-Петербург' },
  { value: 'cis', label: 'СНГ' },
  { value: 'europe', label: 'Европа' },
];

const rfmSegments = [
  { value: 'all', label: 'Все сегменты' },
  { value: 'champions', label: 'Лояльные чемпионы' },
  { value: 'promising', label: 'Перспективные' },
  { value: 'newcomers', label: 'Новички' },
  { value: 'at_risk', label: 'В зоне риска' },
];

const engagementLevels = [
  { value: 'any', label: 'Любая' },
  { value: 'high', label: 'Высокая (часто создают образы)' },
  { value: 'medium', label: 'Средняя (просмотры, лайки)' },
  { value: 'low', label: 'Низкая (только просмотры)' },
];

const scenarioConditions = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'after_7_days', label: 'Через 7 дней' },
  { value: 'after_14_days', label: 'Через 14 дней' },
  { value: 'after_30_days', label: 'Через 30 дней' },
  { value: 'stock_level', label: 'При остатке < X шт.' },
];

export function PromotionDialog({
  product: initialProduct,
  isOpen,
  onOpenChange,
  initialType,
  initialName,
}: PromotionDialogProps) {
  const { toast } = useToast();
  const [brandProducts, setBrandProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    initialProduct ? [initialProduct.id] : []
  );
  const [promotionType, setPromotionType] = useState<
    PromotionType | 'discount' | 'outlet' | 'promo_code' | 'kickstarter_boost'
  >(initialType || 'catalog_boost');
  const [promotionName, setPromotionName] = useState(initialName || '');
  const [budget, setBudget] = useState(5000);
  const [bid, setBid] = useState<number | undefined>(300);
  const [promoCode, setPromoCode] = useState('');
  const [audience, setAudience] = useState(['all']);
  const [geo, setGeo] = useState(['russia']);
  const [age, setAge] = useState('all');
  const [rfm, setRfm] = useState('all');
  const [engagement, setEngagement] = useState('any');
  const [isLookalike, setIsLookalike] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [isAiOptimizationEnabled, setIsAiOptimizationEnabled] = useState(false);
  const [targetKpi, setTargetKpi] = useState<Kpi | undefined>('roi');
  const [isLoading, setIsLoading] = useState(false);
  const [aiForecast, setAiForecast] = useState<{
    views: string;
    clicks: string;
    conversion: string;
  } | null>(null);

  const [scenarios, setScenarios] = useState<{ condition: string; value: number }[]>([
    { condition: 'default', value: 30 },
  ]);

  const [targetType, setTargetType] = useState<'brand' | 'products' | 'categories' | 'kickstarter'>(
    initialProduct ? 'products' : initialType === 'kickstarter_boost' ? 'kickstarter' : 'brand'
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [purchaseHistoryCategories, setPurchaseHistoryCategories] = useState<string[]>([]);

  const productOptions = useMemo(
    () => brandProducts.map((p) => ({ value: p.id, label: `${p.sku} - ${p.name}` })),
    [brandProducts]
  );
  const categoryOptions = useMemo(
    () =>
      [
        ...new Set(
          brandProducts.map((p) => p.category || p.subcategory).filter(Boolean) as string[]
        ),
      ].map((c) => ({ value: c, label: c })),
    [brandProducts]
  );

  const budgetModel = promotionType === 'catalog_boost' ? 'cpm' : 'cpc';

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/data/products.json');
        const allProducts = (await res.json()) as Product[];
        setBrandProducts(allProducts.filter((p) => p.brand === 'Syntha'));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedProductIds(initialProduct ? [initialProduct.id] : []);
      setPromotionType(initialType || 'catalog_boost');
      setPromotionName(initialName || '');
      setIsLoading(false);
      setAiForecast(null);
      setScenarios([{ condition: 'default', value: 30 }]);
      setTargetType(
        initialProduct ? 'products' : initialType === 'kickstarter_boost' ? 'kickstarter' : 'brand'
      );
      setSelectedCategories([]);
    }
  }, [isOpen, initialProduct, initialType, initialName]);

  const addScenario = () => setScenarios([...scenarios, { condition: 'after_30_days', value: 0 }]);
  const removeScenario = (index: number) => setScenarios(scenarios.filter((_, i) => i !== index));
  const updateScenario = (index: number, field: 'condition' | 'value', value: string | number) => {
    const newScenarios = [...scenarios];
    if (field === 'value') {
      newScenarios[index][field] = Number(value);
    } else {
      newScenarios[index][field] = value as string;
    }
    setScenarios(newScenarios);
  };

  const handleLaunchPromotion = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      toast({
        title: 'Заявка на продвижение отправлена',
        description: `Кампания "${promotionName || selectedProductIds[0]}" отправлена на модерацию.`,
      });
    }, 1500);
  };

  const handleGenerateForecast = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAiForecast({
        views: `~${(budget * 12).toLocaleString('ru-RU')} показов`,
        clicks: `~${(budget * 0.25).toLocaleString('ru-RU')} кликов`,
        conversion: '1.5-2.5% в покупку',
      });
      setIsLoading(false);
    }, 1000);
  };

  const isActionRequest =
    promotionType === 'discount' || promotionType === 'outlet' || promotionType === 'promo_code';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{isActionRequest ? 'Запрос на акцию' : 'Создать продвижение'}</DialogTitle>
          <DialogDescription>
            {isActionRequest
              ? 'Запрос на изменение условий для выбранных товаров. Будет отправлен на согласование бренду.'
              : 'Выберите объект продвижения и параметры кампании для максимальной эффективности.'}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] space-y-6 overflow-y-auto py-4 pr-4">
          <div className="space-y-2">
            <Label>Объект продвижения</Label>
            <RadioGroup
              value={targetType}
              onValueChange={(v) => setTargetType(v as any)}
              className="flex gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="brand" id="target-brand" />
                <Label htmlFor="target-brand">Весь бренд</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="categories" id="target-categories" />
                <Label htmlFor="target-categories">Категории</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="products" id="target-products" />
                <Label htmlFor="target-products">Товары</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="kickstarter" id="target-kickstarter" />
                <Label htmlFor="target-kickstarter">Kickstarter</Label>
              </div>
            </RadioGroup>
          </div>

          {targetType === 'products' && (
            <div className="space-y-2">
              <Label>Товары</Label>
              <Combobox
                options={productOptions}
                value={selectedProductIds}
                onChange={(v) => setSelectedProductIds(v as string[])}
                multiple
                placeholder="Выберите один или несколько товаров..."
              />
            </div>
          )}
          {targetType === 'categories' && (
            <div className="space-y-2">
              <Label>Категории</Label>
              <Combobox
                options={categoryOptions}
                value={selectedCategories}
                onChange={(v) => setSelectedCategories(v as string[])}
                multiple
                placeholder="Выберите одну или несколько категорий..."
              />
            </div>
          )}
          {targetType === 'kickstarter' && (
            <div className="space-y-2">
              <Label>Kickstarter-кампании</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите кампанию..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ks-1">Urban Shell Parka — Preseason FW25</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {!isActionRequest && (
            <div className="space-y-2">
              <Label htmlFor="promo-name">Название кампании</Label>
              <Input
                id="promo-name"
                value={promotionName}
                onChange={(e) => setPromotionName(e.target.value)}
                placeholder={'Имиджевая кампания'}
              />
            </div>
          )}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Тип акции</Label>
              <Select
                onValueChange={(v) => setPromotionType(v as PromotionType)}
                value={promotionType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип..." />
                </SelectTrigger>
                <SelectContent>
                  {promotionTypes.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {!isActionRequest && (
                <>
                  <div className="space-y-2">
                    <Label>Бюджет, ₽</Label>
                    <Input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      placeholder="5000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ставка ({budgetModel.toUpperCase()})</Label>
                    <Input
                      type="number"
                      value={bid}
                      onChange={(e) => setBid(Number(e.target.value))}
                      placeholder="300"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {promotionType === 'outlet' && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold">Условия для Аутлета</h4>
              <div className="space-y-2">
                <Label>Дата переноса в Аутлет</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date?.from && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        format(date.from, 'PPP', { locale: ru })
                      ) : (
                        <span>Выберите дату</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date?.from}
                      onSelect={(d) => setDate((prev) => ({ from: d, to: prev?.to }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Сценарии скидок</Label>
                {scenarios.map((scenario, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Select
                      value={scenario.condition}
                      onValueChange={(v) => updateScenario(index, 'condition', v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {scenarioConditions.map((c) => (
                          <SelectItem
                            key={c.value}
                            value={c.value}
                            disabled={index > 0 && c.value === 'default'}
                          >
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="relative">
                      <Input
                        type="number"
                        value={scenario.value || ''}
                        onChange={(e) => updateScenario(index, 'value', e.target.value)}
                        className="w-28 pr-6"
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        %
                      </span>
                    </div>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeScenario(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addScenario}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Добавить сценарий
                </Button>
              </div>
            </div>
          )}
          {(promotionType === 'discount' || promotionType === 'promo_code') && (
            <div className="space-y-2 border-t pt-4">
              <Label>{promotionType === 'discount' ? 'Размер скидки (%)' : 'Промокод'}</Label>
              <Input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder={promotionType === 'promo_code' ? 'Напр. SALE20' : 'Напр. 20'}
                type={promotionType === 'promo_code' ? 'text' : 'number'}
              />
            </div>
          )}

          {!isActionRequest && (
            <>
              <div className="space-y-2">
                <Label>Период кампании</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, 'LLL dd, y', { locale: ru })} -{' '}
                            {format(date.to, 'LLL dd, y', { locale: ru })}
                          </>
                        ) : (
                          format(date.from, 'LLL dd, y', { locale: ru })
                        )
                      ) : (
                        <span>Выберите период</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      locale={ru}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Настройки аудитории</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Возрастной сегмент</Label>
                    <Select value={age} onValueChange={setAge}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ageSegments.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Геотаргетинг</Label>
                    <Combobox
                      options={geoSegments}
                      value={geo}
                      onChange={(v) => setGeo((v as string[]) || [])}
                      multiple
                      placeholder="Выберите регионы..."
                    />
                  </div>
                </div>
              </div>

              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="link" className="p-0 text-accent">
                    Расширенный таргетинг
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 pt-4">
                  <div className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="lookalike-audience" className="flex items-center gap-2">
                        <Users className="h-4 w-4" /> Похожая аудитория (Lookalike)
                      </Label>
                      <Switch
                        id="lookalike-audience"
                        checked={isLookalike}
                        onCheckedChange={setIsLookalike}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>RFM-сегмент</Label>
                        <Select value={rfm} onValueChange={setRfm}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {rfmSegments.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Уровень вовлеченности</Label>
                        <Select value={engagement} onValueChange={setEngagement}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {engagementLevels.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>История покупок</Label>
                      <Combobox
                        options={productOptions.map((p) => ({ value: p.label, label: p.label }))}
                        value={purchaseHistoryCategories}
                        onChange={(v) =>
                          setPurchaseHistoryCategories(Array.isArray(v) ? v : v ? [v] : [])
                        }
                        multiple
                        placeholder="Выберите категории..."
                      />
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="ai-optimisation" className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-accent" /> AI-оптимизация бюджета
                  </Label>
                  <Switch
                    id="ai-optimisation"
                    checked={isAiOptimizationEnabled}
                    onCheckedChange={setIsAiOptimizationEnabled}
                  />
                </div>
                {isAiOptimizationEnabled && (
                  <div className="space-y-2 pl-7">
                    <Label>Целевой KPI</Label>
                    <Select value={targetKpi} onValueChange={(v) => setTargetKpi(v as Kpi)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите цель..." />
                      </SelectTrigger>
                      <SelectContent>
                        {kpiOptions.map((kpi) => (
                          <SelectItem key={kpi.value} value={kpi.value}>
                            {kpi.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="flex items-center gap-2 font-semibold">
                    <Wand2 className="h-5 w-5 text-accent" />
                    AI-Прогноз
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateForecast}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Рассчитать'}
                  </Button>
                </div>
                {aiForecast && (
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Показы</p>
                      <p className="text-sm font-bold">{aiForecast.views}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Клики</p>
                      <p className="text-sm font-bold">{aiForecast.clicks}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Конверсия</p>
                      <p className="text-sm font-bold">{aiForecast.conversion}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 border-t pt-4">
                <Label>Рекламные креативы</Label>
                <p className="text-xs text-muted-foreground">
                  Загрузите один или несколько вариантов для A/B-тестирования.
                </p>
                <Button type="button" variant="outline" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Загрузить креативы
                </Button>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button
            onClick={handleLaunchPromotion}
            disabled={
              isLoading ||
              (isActionRequest &&
                (promotionType === 'discount' || promotionType === 'promo_code') &&
                !promoCode)
            }
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isActionRequest ? 'Отправить на согласование' : 'Запустить кампанию'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
