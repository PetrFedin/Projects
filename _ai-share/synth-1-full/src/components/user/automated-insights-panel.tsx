'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Lightbulb,
  AlertTriangle,
  Trophy,
  TrendingUp,
  Target,
  Sparkles,
  ArrowRight,
  Info,
  X,
  CheckCircle2,
  AlertCircle,
  Zap,
  Gift,
} from 'lucide-react';
import { useUserInsights, type Insight } from '@/hooks/use-user-insights';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const insightIcons = {
  opportunity: Sparkles,
  warning: AlertTriangle,
  achievement: Trophy,
  recommendation: Lightbulb,
  trend: TrendingUp,
  prediction: Target,
};

const insightColors = {
  opportunity: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  warning: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  achievement: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  recommendation: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  trend: 'bg-green-500/10 text-green-600 border-green-500/20',
  prediction: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
};

export default function AutomatedInsightsPanel() {
  const { insights } = useUserInsights();
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const visibleInsights = insights.filter((insight) => !dismissedIds.has(insight.id));

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
  };

  if (visibleInsights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            Автоматические инсайты
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-4 text-center text-muted-foreground">
            <Info className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>Пока нет новых инсайтов</p>
            <p className="mt-2 text-sm">
              Продолжайте использовать платформу, и мы подготовим для вас персональные рекомендации
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const highPriorityInsights = visibleInsights.filter((i) => i.priority === 'high');
  const otherInsights = visibleInsights.filter((i) => i.priority !== 'high');

  return (
    <div className="space-y-4">
      {/* High Priority Insights */}
      {highPriorityInsights.length > 0 && (
        <Card className="border-2 border-orange-500/20 bg-orange-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Важные инсайты
            </CardTitle>
            <CardDescription>Требуют вашего внимания</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {highPriorityInsights.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onDismiss={handleDismiss}
                isExpanded={expandedId === insight.id}
                onToggleExpand={() => setExpandedId(expandedId === insight.id ? null : insight.id)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* All Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            Автоматические инсайты
            <Badge variant="secondary" className="ml-2">
              {visibleInsights.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {otherInsights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              onDismiss={handleDismiss}
              isExpanded={expandedId === insight.id}
              onToggleExpand={() => setExpandedId(expandedId === insight.id ? null : insight.id)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function InsightCard({
  insight,
  onDismiss,
  isExpanded,
  onToggleExpand,
}: {
  insight: Insight;
  onDismiss: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const Icon = insightIcons[insight.type] || Lightbulb;
  const colorClass = insightColors[insight.type] || insightColors.recommendation;

  return (
    <div
      className={cn(
        'relative rounded-lg border p-4 transition-all',
        colorClass,
        isExpanded && 'ring-2 ring-offset-2'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('rounded-lg p-2', colorClass)}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h4 className="text-sm font-semibold">{insight.title}</h4>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-xs',
                    insight.priority === 'high' && 'border-orange-500/50 text-orange-600',
                    insight.priority === 'medium' && 'border-blue-500/50 text-blue-600',
                    insight.priority === 'low' && 'border-gray-500/50 text-gray-600'
                  )}
                >
                  {insight.priority === 'high'
                    ? 'Важно'
                    : insight.priority === 'medium'
                      ? 'Средне'
                      : 'Низко'}
                </Badge>
                {insight.trend && (
                  <Badge variant="outline" className="text-xs">
                    {insight.trend === 'up' ? '↑' : insight.trend === 'down' ? '↓' : '→'}
                  </Badge>
                )}
              </div>

              <p className="mb-2 text-sm text-muted-foreground">{insight.description}</p>

              {isExpanded && (
                <div className="border-current/20 mt-3 space-y-2 border-t pt-3">
                  {insight.value && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Значение:</span>
                      <span className="text-muted-foreground">{insight.value}</span>
                    </div>
                  )}

                  {insight.trend && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Тренд:</span>
                      <span className="text-muted-foreground">
                        {insight.trend === 'up'
                          ? 'Растет'
                          : insight.trend === 'down'
                            ? 'Падает'
                            : 'Стабилен'}
                      </span>
                    </div>
                  )}

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Info className="h-3 w-3" />
                          <span>Этот инсайт основан на анализе ваших данных</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>AI автоматически анализирует ваши заказы, активность и предпочтения</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}

              {insight.action && (
                <div className="mt-3">
                  {insight.action.href ? (
                    <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                      <Link href={insight.action.href}>
                        {insight.action.label}
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  ) : insight.action.onClick ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={insight.action.onClick}
                    >
                      {insight.action.label}
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  ) : null}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onToggleExpand}>
                {isExpanded ? <X className="h-4 w-4" /> : <Info className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onDismiss(insight.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
