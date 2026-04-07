'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, TrendingDown, Minus, Target, Calendar, DollarSign,
  Award, BarChart3, Sparkles, Info, ArrowRight, Zap
} from 'lucide-react';
import { useUserInsights } from '@/hooks/use-user-insights';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function PredictiveAnalytics() {
  const { predictions, trends, behaviorPatterns } = useUserInsights();
  const [selectedTab, setSelectedTab] = useState<'predictions' | 'trends' | 'patterns'>('predictions');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-accent" />
          Прогнозная аналитика
        </CardTitle>
        <CardDescription>
          AI предсказывает будущие события на основе ваших данных
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="predictions">Прогнозы</TabsTrigger>
            <TabsTrigger value="trends">Тренды</TabsTrigger>
            <TabsTrigger value="patterns">Паттерны</TabsTrigger>
          </TabsList>

          <TabsContent value="predictions" className="space-y-4 mt-4">
            {predictions.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Недостаточно данных для прогнозов</p>
                <p className="text-sm mt-2">Сделайте больше покупок, чтобы получить точные прогнозы</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {predictions.map((prediction, index) => (
                  <PredictionCard key={index} prediction={prediction} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trends" className="space-y-4 mt-4">
            {trends.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Недостаточно данных для анализа трендов</p>
              </div>
            ) : (
              <div className="space-y-6">
                {trends.map((trend, index) => (
                  <TrendCard key={index} trend={trend} />
                ))}
                <TrendsChart trends={trends} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4 mt-4">
            {behaviorPatterns.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Недостаточно данных для анализа паттернов</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {behaviorPatterns.map((pattern, index) => (
                  <PatternCard key={index} pattern={pattern} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function PredictionCard({ prediction }: { prediction: ReturnType<typeof useUserInsights>['predictions'][0] }) {
  const icons = {
    next_purchase: Calendar,
    spending_forecast: DollarSign,
    category_trend: TrendingUp,
    loyalty_milestone: Award,
  };

  const Icon = icons[prediction.type] || Target;

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/10">
              <Icon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-base">{prediction.title}</CardTitle>
              <CardDescription className="text-xs mt-1">
                {prediction.description}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {prediction.confidence}% уверенность
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
          <div>
            <p className="text-xs text-muted-foreground">Прогнозируемое значение</p>
            <p className="text-sm font-bold mt-1">{prediction.value}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Срок</p>
            <p className="text-sm font-medium mt-1">{prediction.timeframe}</p>
          </div>
        </div>

        {prediction.factors.length > 0 && (
          <div>
            <p className="text-xs font-medium mb-2 text-muted-foreground">Факторы прогноза:</p>
            <div className="flex flex-wrap gap-2">
              {prediction.factors.map((factor, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {factor}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-xs text-muted-foreground cursor-help">
                <Info className="h-3 w-3" />
                <span>Как рассчитывается этот прогноз?</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Прогноз основан на анализе вашей истории покупок, активности и паттернов поведения с использованием машинного обучения</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}

function TrendCard({ trend }: { trend: ReturnType<typeof useUserInsights>['trends'][0] }) {
  const TrendIcon = trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Minus;
  const trendColor = trend.direction === 'up' ? 'text-green-600' : trend.direction === 'down' ? 'text-red-600' : 'text-gray-600';

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{trend.metric}</span>
          <div className="flex items-center gap-2">
            <TrendIcon className={cn('h-5 w-5', trendColor)} />
            <span className={cn('text-sm font-medium', trendColor)}>
              {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
              {trend.change.toFixed(1)}%
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Текущий период</p>
            <p className="text-base font-bold">
              {typeof trend.current === 'number' && trend.current > 1000
                ? `${(trend.current / 1000).toFixed(1)}k`
                : trend.current.toLocaleString('ru-RU')}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Предыдущий период</p>
            <p className="text-base font-bold text-muted-foreground">
              {typeof trend.previous === 'number' && trend.previous > 1000
                ? `${(trend.previous / 1000).toFixed(1)}k`
                : trend.previous.toLocaleString('ru-RU')}
            </p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            Период анализа: {trend.period === 'week' ? 'Неделя' : trend.period === 'month' ? 'Месяц' : 'Квартал'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function PatternCard({ pattern }: { pattern: ReturnType<typeof useUserInsights>['behaviorPatterns'][0] }) {
  const patternIcons = {
    purchase_frequency: Calendar,
    category_preference: BarChart3,
    price_sensitivity: DollarSign,
    seasonality: TrendingUp,
    brand_loyalty: Award,
    time_pattern: Zap,
  };

  const Icon = patternIcons[pattern.type] || Info;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/10">
              <Icon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-base">{pattern.label}</CardTitle>
              <CardDescription className="text-xs mt-1">
                {pattern.description}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {pattern.confidence}% точность
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-3 rounded-lg bg-muted">
          <p className="text-sm font-medium mb-1">Выявленное значение</p>
          <p className="text-base font-bold">{pattern.value}</p>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">Уверенность анализа</span>
            <span className="font-medium">{pattern.confidence}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full transition-all"
              style={{ width: `${pattern.confidence}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrendsChart({ trends }: { trends: ReturnType<typeof useUserInsights>['trends'] }) {
  const chartData = trends.map(trend => ({
    name: trend.metric,
    current: typeof trend.current === 'number' ? trend.current : 0,
    previous: typeof trend.previous === 'number' ? trend.previous : 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Визуализация трендов</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Bar dataKey="current" fill="#8884d8" name="Текущий период" />
            <Bar dataKey="previous" fill="#82ca9d" name="Предыдущий период" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}





