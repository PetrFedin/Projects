
'use client';

import StyleCalendar from '@/components/user/style-calendar';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function B2BOrdersCalendarPage() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-base font-black tracking-tighter text-slate-800 uppercase">Календарь закупок и поставок</h1>
                <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Контроль B2B-заказов и дат отгрузки в едином интерфейсе.</p>
            </header>
            <StyleCalendar initialRole="shop" />
        </div>
    );
}
