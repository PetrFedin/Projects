'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface AudienceRetentionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const chartData = [
  { minute: 0, retention: 100, joined: 250, left: 0, new: 250, returning: 0 },
  { minute: 5, retention: 85, joined: 50, left: 37, new: 40, returning: 10 },
  { minute: 10, retention: 72, joined: 30, left: 45, new: 20, returning: 10 },
  { minute: 15, retention: 65, joined: 20, left: 30, new: 15, returning: 5 },
  { minute: 20, retention: 58, joined: 15, left: 25, new: 10, returning: 5 },
  { minute: 25, retention: 52, joined: 10, left: 20, new: 5, returning: 5 },
  { minute: 30, retention: 48, joined: 5, left: 15, new: 2, returning: 3 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-lg">
        <p className="font-bold">{`Минута: ${label}`}</p>
        <p className="text-blue-500">{`Удержание: ${data.retention}%`}</p>
        <p className="text-green-500">{`Подключилось: ${data.joined}`}</p>
        <p className="text-red-500">{`Отключилось: ${data.left}`}</p>
        <p className="pl-2 text-xs text-green-500">{`  - Новых: ${data.new} (${((data.new / data.joined) * 100).toFixed(0)}%)`}</p>
        <p className="pl-2 text-xs text-green-500">{`  - Вернувшихся: ${data.returning} (${((data.returning / data.joined) * 100).toFixed(0)}%)`}</p>
      </div>
    );
  }
  return null;
};

export function AudienceRetentionDialog({ open, onOpenChange }: AudienceRetentionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Удержание аудитории</DialogTitle>
          <DialogDescription>
            Анализ того, как долго зрители остаются на трансляции.
          </DialogDescription>
        </DialogHeader>
        <div className="h-[400px] w-full py-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="minute" unit=" мин" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" unit="%" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <defs>
                <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Bar
                yAxisId="right"
                dataKey="joined"
                name="Подключилось"
                fill="hsl(var(--chart-2))"
                barSize={20}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="left"
                name="Отключилось"
                fill="hsl(var(--chart-5))"
                barSize={20}
                radius={[4, 4, 0, 0]}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="retention"
                name="Удержание"
                stroke="hsl(var(--chart-1))"
                fill="url(#colorRetention)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Закрыть</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
