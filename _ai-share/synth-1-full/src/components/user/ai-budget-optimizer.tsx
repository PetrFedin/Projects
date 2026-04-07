'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Wallet, TrendingDown, Target, Gift, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { ordersRepository } from '@/lib/repositories';
import type { Order } from '@/lib/types';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BudgetAnalysis {
  monthlyBudget: number;
  spent: number;
  remaining: number;
  projectedYearly: number;
  savings: number;
  recommendations: string[];
  alerts: { type: 'warning' | 'info'; message: string }[];
}

export default function AIBudgetOptimizer() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [analysis, setAnalysis] = useState<BudgetAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const analyzeBudget = async () => {
      try {
        const userOrders = await ordersRepository.getOrders(user.uid);
        setOrders(userOrders);

        const budgetAnalysis = analyzeBudgetData(userOrders, user.loyaltyPoints || 0);
        setAnalysis(budgetAnalysis);
      } catch (error) {
        console.error('Failed to analyze budget:', error);
      } finally {
        setLoading(false);
      }
    };

    analyzeBudget();
  }, [user]);

  if (loading || !analysis) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-4">AI анализирует бюджет...</div>
        </CardContent>
      </Card>
    );
  }

  const spentPercentage = (analysis.spent / analysis.monthlyBudget) * 100;
  const isOverBudget = analysis.spent > analysis.monthlyBudget;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-accent" />
          AI Оптимизатор бюджета
        </CardTitle>
        <CardDescription>
          Умное управление расходами на одежду
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Monthly Budget */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Бюджет на месяц</span>
              <span className="text-sm text-muted-foreground">
                {analysis.spent.toLocaleString('ru-RU')} / {analysis.monthlyBudget.toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <Progress 
              value={Math.min(100, spentPercentage)} 
              className={cn("h-3", isOverBudget && "bg-red-500")}
            />
            <div className="flex items-center justify-between mt-2 text-xs">
              <span className={cn(isOverBudget ? "text-red-600 font-semibold" : "text-muted-foreground")}>
                {isOverBudget ? `Превышен на ${(analysis.spent - analysis.monthlyBudget).toLocaleString('ru-RU')} ₽` : 
                 `Осталось ${analysis.remaining.toLocaleString('ru-RU')} ₽`}
              </span>
              <span className="text-muted-foreground">
                {format(new Date(), 'MMMM yyyy', { locale: ru })}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-muted">
              <p className="text-sm font-bold">{analysis.projectedYearly.toLocaleString('ru-RU')}</p>
              <p className="text-xs text-muted-foreground mt-1">₽ в год</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <p className="text-sm font-bold text-green-600">{analysis.savings.toLocaleString('ru-RU')}</p>
              <p className="text-xs text-muted-foreground mt-1">₽ сэкономлено</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <p className="text-sm font-bold">{orders.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Покупок</p>
            </div>
          </div>

          {/* Alerts */}
          {analysis.alerts.length > 0 && (
            <div className="space-y-2">
              {analysis.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border flex items-start gap-2",
                    alert.type === 'warning' && "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800",
                    alert.type === 'info' && "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                  )}
                >
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  )}
                  <p className="text-sm flex-1">{alert.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* AI Recommendations */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-accent" />
              Рекомендации AI
            </h4>
            <div className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Gift className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/search?outlet=true">
                <TrendingDown className="h-4 w-4 mr-2" />
                Покупать со скидкой
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function analyzeBudgetData(orders: Order[], loyaltyPoints: number): BudgetAnalysis {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  // Calculate monthly spending
  const monthlyOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return isWithinInterval(orderDate, { start: monthStart, end: monthEnd });
  });

  const spent = monthlyOrders.reduce((sum, order) => sum + order.total, 0);
  
  // Estimate monthly budget (average of last 3 months or default)
  const last3Months = orders
    .filter(order => {
      const orderDate = new Date(order.createdAt);
      const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      return orderDate >= threeMonthsAgo;
    })
    .reduce((sum, order) => sum + order.total, 0);

  const monthlyBudget = last3Months > 0 
    ? Math.round(last3Months / 3)
    : 20000; // Default budget

  const remaining = Math.max(0, monthlyBudget - spent);
  const projectedYearly = Math.round((spent / (now.getDate() / 30)) * 12);

  // Calculate savings from loyalty points and discounts
  const savings = loyaltyPoints + monthlyOrders.reduce((sum, order) => {
    const discount = order.items.reduce((itemSum, item) => {
      if (item.originalPrice && item.originalPrice > item.price) {
        return itemSum + (item.originalPrice - item.price) * item.quantity;
      }
      return itemSum;
    }, 0);
    return sum + discount;
  }, 0);

  const recommendations: string[] = [];
  const alerts: BudgetAnalysis['alerts'] = [];

  if (spent > monthlyBudget) {
    alerts.push({
      type: 'warning',
      message: `Вы превысили месячный бюджет на ${(spent - monthlyBudget).toLocaleString('ru-RU')} ₽`,
    });
    recommendations.push('Рассмотрите покупки в разделе Аутлет для экономии');
  } else if (spent > monthlyBudget * 0.8) {
    alerts.push({
      type: 'warning',
      message: 'Вы потратили 80% месячного бюджета',
    });
    recommendations.push('Рекомендуем отложить крупные покупки до следующего месяца');
  } else {
    alerts.push({
      type: 'info',
      message: `У вас осталось ${remaining.toLocaleString('ru-RU')} ₽ до конца месяца`,
    });
  }

  if (loyaltyPoints > 1000) {
    recommendations.push(`Используйте ${loyaltyPoints.toLocaleString('ru-RU')} бонусных баллов для следующей покупки`);
  }

  recommendations.push('Подпишитесь на уведомления о скидках на товары из избранного');
  recommendations.push('AI рекомендует планировать крупные покупки в конце сезона');

  return {
    monthlyBudget,
    spent,
    remaining,
    projectedYearly,
    savings,
    recommendations,
    alerts,
  };
}
