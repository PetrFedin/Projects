
'use client';

import StyleCalendar from '@/components/user/style-calendar';

export default function PromotionsCalendarPage() {
    return (
        <div className="space-y-4">
            <header>
                <h1 className="text-base font-black tracking-tighter text-slate-800 uppercase">Календарь продвижения</h1>
                <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Визуальное управление всеми активностями в экосистеме Syntha.</p>
            </header>
            <StyleCalendar initialRole="admin" />
        </div>
    );
}
