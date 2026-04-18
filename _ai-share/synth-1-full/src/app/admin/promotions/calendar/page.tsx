'use client';

import StyleCalendar from '@/components/user/style-calendar';

export default function PromotionsCalendarPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-base font-black uppercase tracking-tighter text-slate-800">
          Календарь продвижения
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Визуальное управление всеми активностями в экосистеме Syntha.
        </p>
      </header>
      <StyleCalendar initialRole="admin" />
    </div>
  );
}
