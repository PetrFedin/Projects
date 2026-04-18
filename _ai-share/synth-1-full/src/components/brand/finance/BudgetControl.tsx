'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PiggyBank, Plus, Loader2, DollarSign, ArrowUpRight } from 'lucide-react';
import { fastApiService } from '@/lib/fastapi-service';
import { useToast } from '@/hooks/use-toast';

export default function BudgetControl({ brandId }: { brandId: string }) {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadBudgets() {
      try {
        const data = await fastApiService.getBudgets(brandId, 'SS2026');
        setBudgets(data);
      } catch (error) {
        console.error('Failed to load budgets:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadBudgets();
  }, [brandId]);

  const handleCreateBudget = async () => {
    try {
      const newBudget = await fastApiService.createBudget({
        brand_id: brandId,
        season: 'SS2026',
        budget_type: budgets.length % 2 === 0 ? 'raw_material' : 'production',
        limit_amount: 500000.0,
        spent_amount: 0.0,
        currency: 'USD',
      });
      setBudgets([...budgets, newBudget]);
      toast({
        title: 'Лимит установлен',
        description: 'Бюджет успешно добавлен в систему контроля.',
      });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось создать лимит.' });
    }
  };

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black uppercase italic tracking-tight text-slate-900">
            Контроль <span className="text-indigo-600">Бюджетов</span>
          </h3>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Сезон: SS2026 • Лимиты и расходы
          </p>
        </div>
        <Button
          onClick={handleCreateBudget}
          className="h-10 gap-2 rounded-xl bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white"
        >
          <Plus className="h-4 w-4" /> Новый лимит
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-slate-200" />
          </div>
        ) : budgets.length > 0 ? (
          budgets.map((budget) => {
            const progress = (budget.spent_amount / budget.limit_amount) * 100;
            const isOver = progress > 90;
            return (
              <Card
                key={budget.id}
                className="group overflow-hidden rounded-xl border-slate-100 shadow-xl"
              >
                <CardHeader className="bg-slate-50/50 pb-4">
                  <div className="mb-4 flex items-start justify-between">
                    <Badge className="h-6 border-slate-100 bg-white text-[8px] font-black uppercase text-slate-900">
                      {budget.budget_type === 'raw_material' ? 'Закупка сырья' : 'Пошив коллекции'}
                    </Badge>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm">
                      <PiggyBank className="h-4 w-4 text-indigo-600" />
                    </div>
                  </div>
                  <CardTitle className="text-sm font-black tabular-nums text-slate-900">
                    {budget.currency} {budget.limit_amount.toLocaleString()}
                  </CardTitle>
                  <CardDescription className="text-[9px] font-bold uppercase tracking-widest">
                    Общий лимит на сезон
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">Использовано</span>
                      <span className={isOver ? 'text-rose-500' : 'text-indigo-600'}>
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress
                      value={progress}
                      className="h-2 bg-slate-100"
                      indicatorClassName={isOver ? 'bg-rose-500' : 'bg-indigo-600'}
                    />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[8px] font-black uppercase text-slate-400">Потрачено</p>
                      <p className="text-sm font-black tabular-nums text-slate-900">
                        {budget.currency} {budget.spent_amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-right text-[8px] font-black uppercase text-slate-400">
                        Остаток
                      </p>
                      <p className="text-right text-sm font-black tabular-nums text-emerald-600">
                        {budget.currency}{' '}
                        {(budget.limit_amount - budget.spent_amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full rounded-xl border-2 border-dashed border-slate-100 py-10 text-center">
            <p className="font-medium italic text-slate-400">Лимиты бюджета не установлены.</p>
          </div>
        )}
      </div>
    </div>
  );
}
