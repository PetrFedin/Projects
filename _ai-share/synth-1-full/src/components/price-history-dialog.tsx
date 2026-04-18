'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from 'recharts';
import type { Product } from '@/lib/types';

interface PriceHistoryDialogProps {
  product: Product;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const generatePriceData = (basePrice: number) => {
  const data = [];
  let currentPrice = basePrice * (1 + (Math.random() - 0.5) * 0.2); // Start with some fluctuation
  for (let i = 12; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i * 7);

    // Syntha price fluctuation
    const synthaFluctuation = (Math.random() - 0.5) * 0.1; // +/- 5%
    currentPrice = Math.max(basePrice * 0.8, currentPrice * (1 + synthaFluctuation));

    // Competitor price fluctuation
    const competitor1Price = currentPrice * (1 + Math.random() * 0.1 + 0.05); // Usually 5-15% more expensive
    const competitor2Price = currentPrice * (1 + Math.random() * 0.05 + 0.02); // Usually 2-7% more expensive

    data.push({
      date: date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
      Syntha: Math.round(currentPrice / 100) * 100,
      ЦУМ: Math.round(competitor1Price / 100) * 100,
      Lamoda: Math.round(competitor2Price / 100) * 100,
    });
  }
  return data;
};

export function PriceHistoryDialog({ product, isOpen, onOpenChange }: PriceHistoryDialogProps) {
  const priceHistoryData = generatePriceData(product.price);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>История цен: {product.name}</DialogTitle>
          <DialogDescription>
            Динамика цен за последние 3 месяца на разных платформах.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={priceHistoryData}
              margin={{
                top: 5,
                right: 20,
                left: -10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${Number(value) / 1000}k`}
              />
              <Tooltip
                formatter={(value) => [`${Number(value).toLocaleString('ru-RU')} ₽`, null]}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Syntha"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="ЦУМ"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="Lamoda"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
