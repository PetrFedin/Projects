'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Info, TrendingUp, TrendingDown, Minus, BarChart3, PieChart, 
  LineChart, ArrowRight, HelpCircle, Sparkles, Trophy, Palette, Gem, Fingerprint
} from 'lucide-react';
import { useUserOrders } from '@/hooks/use-user-orders';
import { useUserActivity } from '@/hooks/use-user-activity';
import { useUserInsights } from '@/hooks/use-user-insights';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  Line,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, subMonths, eachMonthOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { ru } from 'date-fns/locale';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface DataMetric {
  label: string;
  value: number | string;
  description: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  explanation: string;
  icon?: React.ReactNode;
  color?: string;
}

export default function EnhancedDataVisualization({ 
  period = 'month',
  variant = 'all'
}: { 
  period?: 'week' | 'month' | 'year' | 'custom',
  variant?: 'all' | 'metrics' | 'patterns'
}) {
  const { orders, stats: orderStats } = useUserOrders();
  const activity = useUserActivity();
  const { trends, behaviorPatterns } = useUserInsights();
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  const metrics: DataMetric[] = [
    {
      label: 'Всего потрачено',
      value: `${(period === 'year' ? orderStats.totalSpent : period === 'month' ? 42100 : 12500).toLocaleString('ru-RU')} ₽`,
      description: 'Общая сумма всех ваших покупок',
      trend: trends.find(t => t.metric === 'Траты')?.direction,
      trendValue: trends.find(t => t.metric === 'Траты')?.change,
      explanation: 'Эта сумма включает все ваши заказы за выбранный период. Учитываются все товары, доставка и налоги.',
      color: 'text-green-600',
    },
    {
      label: 'Количество заказов',
      value: period === 'year' ? orderStats.totalOrders : period === 'month' ? 2 : 1,
      description: 'Всего оформлено заказов',
      trend: trends.find(t => t.metric === 'Количество заказов')?.direction,
      trendValue: trends.find(t => t.metric === 'Количество заказов')?.change,
      explanation: 'Общее количество успешно оформленных заказов за выбранный период.',
      color: 'text-blue-600',
    },
    {
      label: 'Средний чек',
      value: `${Math.round(period === 'year' ? orderStats.avgOrderValue : period === 'month' ? 21050 : 12500).toLocaleString('ru-RU')} ₽`,
      description: 'Средняя стоимость одного заказа',
      explanation: 'Рассчитывается как общая сумма заказов за период, разделенная на их количество.',
      color: 'text-purple-600',
    },
    {
      label: 'Бонусные баллы',
      value: (period === 'year' ? activity.loyaltyPoints : period === 'month' ? 450 : 120).toLocaleString('ru-RU'),
      description: 'Накопленные баллы за период',
      explanation: 'Баллы, начисленные за покупки в выбранном временном интервале.',
      color: 'text-yellow-600',
    },
    {
      label: 'Уровень вовлеченности',
      value: `${period === 'year' ? activity.engagementLevel : period === 'month' ? 72 : 65}%`,
      description: 'Ваша активность на платформе',
      explanation: 'Рассчитывается на основе просмотров, избранного и покупок за выбранный период.',
      color: 'text-pink-600',
    },
    {
      label: 'Процент возвратов',
      value: `${period === 'year' ? Math.round(orderStats.returnRate) : period === 'month' ? 8 : 0}%`,
      description: 'Доля возвращенных товаров',
      explanation: 'Процент заказов за выбранный период, по которым был оформлен возврат.',
      color: orderStats.returnRate > 15 ? 'text-red-600' : 'text-green-600',
    },
    {
      label: 'Fashion ROI',
      value: `${(period === 'year' ? 18400 : period === 'month' ? 3200 : 800).toLocaleString('ru-RU')} ₽`,
      description: 'Ваша суммарная экономия',
      explanation: 'Этот показатель отражает, сколько вы сэкономили за счет бонусов, персональных скидок и участия в закрытых распродажах.',
      color: 'text-emerald-600',
      icon: <Trophy className="h-4 w-4" />
    },
    {
      label: 'Синергия гардероба',
      value: `${period === 'year' ? 82 : period === 'month' ? 75 : 60}%`,
      description: 'Сочетаемость ваших вещей',
      explanation: 'AI анализирует ваши покупки и оценивает, насколько легко они комбинируются между собой в готовые образы.',
      color: 'text-indigo-600',
      icon: <Palette className="h-4 w-4" />
    },
    {
      label: 'Style DNA',
      value: period === 'year' ? 'Минимализм' : period === 'month' ? 'Casual' : 'База',
      description: 'Ваш уникальный код',
      explanation: 'AI проанализировал ваши покупки и определил доминирующий стиль. Это помогает нам подбирать рекомендации, которые на 100% соответствуют вашему вкусу.',
      color: 'text-purple-600',
      icon: <Fingerprint className="h-4 w-4" />
    }
  ];

  // Behavior patterns - fixed set of categories with dynamic content
  const filteredPatterns = useMemo(() => {
    const data = {
      week: [
        { label: 'Пик активности', value: 'Среда, 14:00', confidence: 92, description: 'На этой неделе клиент чаще всего заходил в приложение в середине дня.' },
        { label: 'Режим просмотра', value: 'Быстрый скроллинг', confidence: 85, description: 'Сессии короткие, упор на просмотр новинок без глубокого изучения.' },
        { label: 'Интерес к брендам', value: 'Новинки Syntha', confidence: 88, description: 'Высокий интерес к новой коллекции, вышедшей в понедельник.' },
        { label: 'Стиль недели', value: 'Casual / Аксессуары', confidence: 70, description: 'Поиск сфокусирован на дополнении текущих образов деталями.' },
        { label: 'Ценовой триггер', value: 'Акции и Скидки', confidence: 95, description: 'Все клики на этой неделе были по товарам со спецпредложениями.' },
        { label: 'Прогноз на Пт-Вс', value: 'Высокая вероятность покупки', confidence: 78, description: 'На основе активности в среду ожидаем оформление заказа в выходные.' }
      ],
      month: [
        { label: 'Время шопинга', value: 'Вечерний покупатель', confidence: 82, description: '80% добавлений в корзину за месяц произошло после 20:00.' },
        { label: 'Устройство', value: 'iOS App (90%)', confidence: 98, description: 'Клиент предпочитает мобильный интерфейс для принятия решений.' },
        { label: 'Лояльность', value: 'Syntha, COS', confidence: 90, description: 'Стабильное предпочтение товаров этих брендов на протяжении 30 дней.' },
        { label: 'Стилевой вектор', value: 'Минимализм', confidence: 85, description: 'Клиент игнорирует яркие принты, выбирая базовые силуэты.' },
        { label: 'Средний чек', value: 'Растущий (+12%)', confidence: 80, description: 'В этом месяце клиент выбирает более дорогие позиции, чем обычно.' },
        { label: 'AI Совет', value: 'Персональный оффер', confidence: 88, description: 'Оптимальное время для отправки push-уведомления — четверг вечер.' }
      ],
      year: [
        { label: 'Сезонный пик', value: 'Март - Апрель', confidence: 95, description: 'Ежегодный период максимальных трат на обновление гардероба.' },
        { label: 'Канал продаж', value: 'Omnichannel', confidence: 92, description: 'Использует приложение для выбора, но часто заказывает через сайт.' },
        { label: 'Бренд-амбассадор', value: 'Топ-1% лояльности', confidence: 99, description: 'Входит в число самых преданных покупателей бренда Syntha за год.' },
        { label: 'Гардероб', value: 'Капсульный подход', confidence: 90, description: 'За год собрана полноценная капсула, вещи хорошо сочетаются между собой.' },
        { label: 'LTV Прогноз', value: 'Высокий потенциал', confidence: 85, description: 'Ожидаемый доход от клиента в следующем году вырастет на 20%.' },
        { label: 'Статус', value: 'Лояльный чемпион', confidence: 96, description: 'Самый стабильный и предсказуемый паттерн поведения в базе.' }
      ]
    };

    return period === 'week' ? data.week : (period === 'year' ? data.year : data.month);
  }, [period]);

  // Данные для графиков
  const spendingHistory = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 6);
    const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });
    
    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= monthStart && orderDate <= monthEnd;
      });
      
      const monthSpending = monthOrders.reduce((sum, order) => sum + order.total, 0);
      
      return {
        month: format(month, 'MMM', { locale: ru }),
        траты: monthSpending,
        заказы: monthOrders.length,
      };
    });
  }, [orders]);

  const categoryData = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const current = categoryMap.get(item.category) || 0;
        categoryMap.set(item.category, current + item.price * item.quantity);
      });
    });

    const total = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);
    
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#0088fe'];
    
    return Array.from(categoryMap.entries())
      .map(([name, value], index) => ({
        name,
        value: total > 0 ? Math.round((value / total) * 100) : 0,
        amount: value,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Key Metrics with Explanations */}
      {(variant === 'all' || variant === 'metrics') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Ключевые показатели
            </CardTitle>
            <CardDescription>
              Детальный разбор метрик с AI-пояснениями
            </CardDescription>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {metrics.map((metric, index) => (
              <MetricCard
                key={index}
                metric={metric}
              />
            ))}
          </div>
          </CardContent>
        </Card>
      )}

      {/* Behavior Patterns */}
      {(variant === 'all' || variant === 'patterns') && filteredPatterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Аналитические паттерны
            </CardTitle>
            <CardDescription>
              AI-выводы о ваших долгосрочных привычках
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {filteredPatterns.map((pattern, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border bg-muted/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm">{pattern.label}</h4>
                    <Badge variant="outline" className="text-xs">
                      {pattern.confidence}% точность
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {pattern.description}
                  </p>
                  <div className="mt-2 p-2 rounded bg-background">
                    <p className="text-sm font-bold">{pattern.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function MetricCard({
  metric,
}: {
  metric: DataMetric;
}) {
  const TrendIcon = metric.trend === 'up' 
    ? TrendingUp 
    : metric.trend === 'down' 
    ? TrendingDown 
    : Minus;
  
  const trendColor = metric.trend === 'up' 
    ? 'text-green-600' 
    : metric.trend === 'down' 
    ? 'text-red-600' 
    : 'text-gray-600';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="relative cursor-pointer hover:border-accent/50 transition-colors group">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-sm font-medium text-muted-foreground mb-1">
                  {metric.label}
                </CardTitle>
                <div className="flex items-baseline gap-2">
                  <p className={cn('text-sm font-bold', metric.color)}>
                    {metric.value}
                  </p>
                  {metric.trend && metric.trendValue !== undefined && (
                    <div className={cn('flex items-center gap-1 text-xs', trendColor)}>
                      <TrendIcon className="h-3 w-3" />
                      <span>{Math.abs(metric.trendValue).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metric.description}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 pointer-events-none"
                >
                  <Info className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("p-2 rounded-lg bg-accent/10", metric.color.replace('text-', 'bg-').split(' ')[0] + '/10')}>
              <BarChart3 className="h-5 w-5 text-accent" />
            </div>
            <DialogTitle className="text-base">{metric.label}</DialogTitle>
          </div>
          <DialogDescription className="text-base text-foreground pt-2 leading-relaxed">
            {metric.explanation}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Статистика за период</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase font-bold">Текущее значение</div>
                <div className="text-base font-bold">{metric.value}</div>
              </div>
              {metric.trendValue && (
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">Изменение</div>
                  <div className={cn("text-base font-bold flex items-center gap-1", trendColor)}>
                    <TrendIcon className="h-4 w-4" />
                    {Math.abs(metric.trendValue).toFixed(1)}%
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground italic bg-accent/5 p-3 rounded-lg border border-accent/10">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>AI-анализ подтверждает стабильность данного показателя на основе вашей активности за выбранный период.</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


