
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer } from 'recharts';
import { Eye, Heart, MessageSquare, ShoppingCart, ThumbsUp, Hand } from 'lucide-react';


const generateLiveAnalyticsData = (length = 30) => {
    return Array.from({ length }).map((_, i) => ({
        minute: i + 1,
        views: 100 + Math.floor(Math.random() * 50) + i * 10,
        reactions: 10 + Math.floor(Math.random() * 20) + i * 2,
        comments: 1 + Math.floor(Math.random() * 5) + Math.floor(i / 5),
        cart: Math.floor(Math.random() * 3) + Math.floor(i / 10),
    }));
};

const metricConfig = {
    views: { label: "Просмотры", icon: Eye, color: "hsl(var(--chart-1))" },
    reactions: { label: "Реакции", icon: ThumbsUp, color: "hsl(var(--chart-2))" },
    comments: { label: "Комментарии", icon: MessageSquare, color: "hsl(var(--chart-3))" },
    cart: { label: "Товар выбран", icon: Hand, color: "hsl(var(--chart-4))" },
};

type MetricKey = keyof typeof metricConfig;

interface LiveStreamAnalyticsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialMetric?: MetricKey;
}

export function LiveStreamAnalyticsDialog({ isOpen, onOpenChange, initialMetric = 'views' }: LiveStreamAnalyticsDialogProps) {
    const [data, setData] = useState(generateLiveAnalyticsData());
    const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>([initialMetric]);

    useEffect(() => {
        if (isOpen) {
            setSelectedMetrics([initialMetric]);
        }
    }, [isOpen, initialMetric]);

    const handleMetricToggle = (metric: MetricKey) => {
        setSelectedMetrics(prev => 
            prev.includes(metric)
            ? prev.filter(m => m !== metric)
            : [...prev, metric]
        );
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Аналитика трансляции в реальном времени</DialogTitle>
                    <DialogDescription>
                        Динамика ключевых метрик вовлеченности аудитории поминутно.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="flex flex-wrap gap-3 mb-4">
                        {Object.entries(metricConfig).map(([key, config]) => (
                            <div key={key} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={key}
                                    checked={selectedMetrics.includes(key as MetricKey)}
                                    onCheckedChange={() => handleMetricToggle(key as MetricKey)}
                                />
                                <Label htmlFor={key} className="flex items-center gap-1.5 cursor-pointer">
                                    <config.icon className="h-4 w-4" style={{ color: config.color }}/>
                                    {config.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                    <ChartContainer config={{}} className="h-[400px] w-full">
                        <ResponsiveContainer>
                             <LineChart
                                data={data}
                                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                <XAxis dataKey="minute" tick={{ fontSize: 12 }} tickFormatter={(value) => `${value} мин`} />
                                <YAxis yAxisId="left" orientation="left" stroke={metricConfig.views.color} tick={{ fontSize: 12 }} />
                                <YAxis yAxisId="right" orientation="right" stroke={metricConfig.reactions.color} tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(value, name) => [value, metricConfig[name as MetricKey]?.label]}/>
                                <Legend />
                                {selectedMetrics.includes('views') && <Line yAxisId="left" type="monotone" dataKey="views" name="Просмотры" stroke={metricConfig.views.color} strokeWidth={2} dot={false} />}
                                {selectedMetrics.includes('reactions') && <Line yAxisId="right" type="monotone" dataKey="reactions" name="Реакции" stroke={metricConfig.reactions.color} strokeWidth={2} dot={false} />}
                                {selectedMetrics.includes('comments') && <Line yAxisId="right" type="monotone" dataKey="comments" name="Комментарии" stroke={metricConfig.comments.color} strokeWidth={2} dot={false} />}
                                {selectedMetrics.includes('cart') && <Line yAxisId="right" type="monotone" dataKey="cart" name="Товар выбран" stroke={metricConfig.cart.color} strokeWidth={2} dot={false} />}
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            </DialogContent>
        </Dialog>
    );
}
