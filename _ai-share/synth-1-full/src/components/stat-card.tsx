import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    description: string;
    icon: LucideIcon;
}

export function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
    let isPositive = description.startsWith('+');
    let isNegative = description.startsWith('-');

    if (title === 'Возвраты') {
        isPositive = description.startsWith('-');
        isNegative = description.startsWith('+');
    }

    const valueFontSize = title === 'Сред. время просмотра' ? 'text-sm' : 'text-base';

    return (
        <Card className="hover:bg-slate-50/50 transition-all duration-200 border-slate-100 shadow-sm group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 p-4">
                <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-900 transition-colors">{title}</CardTitle>
                <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shadow-sm">
                    <Icon className="h-3.5 w-3.5" />
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className={cn("font-bold tracking-tight text-slate-900", valueFontSize === 'text-base' ? 'text-sm' : 'text-base')}>{value}</div>
                <p className={cn(
                    "text-[10px] font-bold uppercase tracking-tight mt-1",
                    isPositive ? "text-emerald-600" : isNegative ? "text-rose-600" : "text-slate-400"
                )}>
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}
