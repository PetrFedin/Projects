'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';

const purchaseHistoryData = [
  { month: "Янв", total: 18600 },
  { month: "Фев", total: 30500 },
  { month: "Март", total: 23700 },
  { month: "Апр", total: 17300 },
  { month: "Май", total: 20900 },
  { month: "Июнь", total: 21400 },
];

const categoryViewData = [
  { name: 'Топы', value: 400, fill: 'hsl(var(--chart-1))' },
  { name: 'Брюки', value: 300, fill: 'hsl(var(--chart-2))' },
  { name: 'Платья', value: 300, fill: 'hsl(var(--chart-3))' },
  { name: 'Аксессуары', value: 200, fill: 'hsl(var(--chart-4))' },
];

const returnsData = [
    { name: 'Не подошел размер', value: 60, fill: 'hsl(var(--chart-1))' },
    { name: 'Не понравилось качество', value: 25, fill: 'hsl(var(--chart-2))'},
    { name: 'Отличается цвет', value: 15, fill: 'hsl(var(--chart-3))'},
]

export function BehaviorCharts() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>История покупок (6 мес.)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="aspect-auto h-[250px] w-full">
                        <BarChart data={purchaseHistoryData}>
                             <CartesianGrid vertical={false} />
                            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(value) => `${Number(value) / 1000}k`}/>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" formatter={(value) => `${Number(value).toLocaleString('ru-RU')} ₽`} />} />
                            <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={8} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Просмотры по категориям</CardTitle>
                    <CardDescription>Какие разделы каталога клиент просматривает чаще всего.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="aspect-auto h-[200px] w-full">
                        <PieChart>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                            <Pie data={categoryViewData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                                 {categoryViewData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Причины возвратов</CardTitle>
                    <CardDescription>Общий процент возвратов: 8%</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={{}} className="aspect-auto h-[200px] w-full">
                        <BarChart layout="vertical" data={returnsData}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={5} width={120} />
                             <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" formatter={(value) => `${value}%`} />} />
                             <Bar dataKey="value" layout="vertical" radius={5}>
                                 {returnsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                             </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
