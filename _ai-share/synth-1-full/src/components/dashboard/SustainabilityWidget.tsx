'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Leaf, TrendingDown, Award, Recycle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useB2BState } from '@/providers/b2b-state';

export function SustainabilityWidget() {
  const { b2bCart } = useB2BState();

  // Mock calculations - в реальности из API
  const carbonSaved = 350; // kg CO2
  const industryAvg = 540; // kg CO2
  const reduction = Math.round(((industryAvg - carbonSaved) / industryAvg) * 100);

  const ecoProducts = [
    { name: 'Organic Cotton', count: 12, badge: 'Organic' },
    { name: 'Recycled Materials', count: 8, badge: 'Recycled' },
    { name: 'Carbon Neutral', count: 5, badge: 'Carbon Neutral' },
  ];

  const circularEconomy = {
    buyBackAvailable: 12,
  };

  return (
    <Card className="rounded-xl border-2 border-emerald-100 shadow-xl">
      <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-sm font-black uppercase tracking-tight text-slate-900">
              Экологический трекер
            </CardTitle>
            <p className="text-[10px] font-medium text-slate-500">Экологический след FW26</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-4">
        {/* Carbon Footprint */}
        <div className="space-y-3">
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
            <TrendingDown className="h-4 w-4 text-emerald-600" />
            Углеродный след
          </h4>

          <div className="rounded-xl bg-emerald-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-base font-black tabular-nums tracking-tight text-emerald-900">
                  {carbonSaved} kg
                </p>
                <p className="text-[10px] font-bold uppercase text-emerald-600">CO₂ сэкономлено</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-black tabular-nums tracking-tight text-slate-600">
                  {industryAvg} kg
                </p>
                <p className="text-[10px] font-bold uppercase text-slate-500">Среднее по отрасли</p>
              </div>
            </div>

            <Progress value={100 - reduction} className="mb-2 h-2" />

            <Badge className="w-full justify-center border-none bg-emerald-600 text-[8px] font-black uppercase text-white">
              −{reduction}% к обычным закупкам
            </Badge>
          </div>
        </div>

        {/* Eco Products */}
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
            <Award className="h-4 w-4 text-emerald-600" />
            Эко-SKU
          </h4>

          <div className="space-y-2">
            {ecoProducts.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl bg-emerald-50 p-3"
              >
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-slate-900">{item.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className="border-none bg-emerald-100 text-[8px] font-black uppercase text-emerald-700">
                    {item.count} шт.
                  </Badge>
                  <Badge className="border border-emerald-200 bg-white text-[7px] font-black uppercase text-emerald-700">
                    {item.badge}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Circular Economy */}
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
            <Recycle className="h-4 w-4 text-emerald-600" />
            Циркулярная мода
          </h4>

          <div className="rounded-xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
            <div className="mb-2">
              <p className="text-base font-black tabular-nums tracking-tight text-emerald-900">
                {circularEconomy.buyBackAvailable} SKU
              </p>
              <p className="text-[10px] font-bold uppercase text-emerald-600">
                Доступен выкуп
              </p>
            </div>

            <p className="text-[10px] font-medium italic text-emerald-900">
              💡 Эти позиции подходят под программу выкупа бренда: дольше жизненный цикл, меньше
              отходов.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
