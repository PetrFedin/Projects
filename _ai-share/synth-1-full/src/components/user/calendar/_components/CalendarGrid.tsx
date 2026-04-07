import React from 'react';
import { format, isSameDay, startOfWeek, addDays, startOfMonth, endOfMonth, isSameMonth } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarEvent } from '@/lib/types/calendar';
import { layerColor, layerBorder } from '../constants';
import { Lock, EyeOff, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CalendarGridProps {
  view: string;
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onCellClick: (date: Date) => void;
}

export function CalendarGrid({ view, currentDate, events, onEventClick, onCellClick }: CalendarGridProps) {
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfMonth(monthEnd); // Simplified end date logic for grid

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    // Generate grid 6 weeks to be safe or until end of month
    // Just a simple loop for 35-42 days
    const totalDays = 42; 
    
    for (let i = 0; i < totalDays; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        
        const dayEvents = events.filter(e => isSameDay(new Date(e.startAt), day));
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());

        days.push(
            <div
                key={day.toString()}
                className={cn(
                    "min-h-[100px] border p-1 transition-colors hover:bg-muted/20 cursor-pointer relative group",
                    !isCurrentMonth && "bg-muted/10 text-muted-foreground",
                    isToday && "bg-accent/5"
                )}
                onClick={() => onCellClick(cloneDay)}
            >
                <div className={cn(
                    "text-right text-xs p-1 font-medium",
                    isToday && "text-accent font-bold"
                )}>
                    {formattedDate}
                </div>
                <div className="space-y-1 mt-1">
                    {dayEvents.slice(0, 4).map(ev => (
                        <div
                            key={ev.id}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEventClick(ev);
                            }}
                            className={cn(
                                "text-[10px] px-2 py-1 rounded-md truncate font-bold border-l-4 cursor-pointer hover:brightness-95 transition-all flex flex-col gap-0.5 shadow-md min-h-[32px] justify-center mb-1",
                                layerColor(ev.layer),
                                layerBorder(ev.layer),
                                "text-white"
                            )}
                        >
                            <div className="flex items-center gap-1">
                                {ev.isMystery && <EyeOff className="h-2 w-2 shrink-0 opacity-80" />}
                                {ev.importance === 'critical' && <AlertCircle className="h-2 w-2 shrink-0 text-white animate-pulse" />}
                                {ev.isSpam && <span className="text-white/80 font-black">SPAM:</span>}
                                <span className="truncate leading-tight">{ev.title}</span>
                            </div>
                            {ev.description && (
                                <span className="text-[8px] font-medium text-white/90 truncate leading-none">
                                    {ev.description}
                                </span>
                            )}
                        </div>
                    ))}
                    {dayEvents.length > 4 && (
                        <div className="text-[9px] text-center text-muted-foreground font-medium">
                            Еще {dayEvents.length - 4}...
                        </div>
                    )}
                </div>
                {isToday && (
                    <div className="absolute top-1 left-1 h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                )}
            </div>
        );
        day = addDays(day, 1);
    }

    // Chunk days into rows of 7
    const gridRows = [];
    for (let i = 0; i < days.length; i += 7) {
        gridRows.push(
            <div className="grid grid-cols-7" key={i}>
                {days.slice(i, i + 7)}
            </div>
        );
    }

    return (
        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="grid grid-cols-7 border-b bg-muted/40">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
                    <div key={d} className="p-2 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {d}
                    </div>
                ))}
            </div>
            {gridRows}
        </div>
    );
  };

  const renderWeekView = () => {
    // Simplified week view
    return (
        <div className="p-3 text-center text-muted-foreground">
            Недельный вид в разработке
        </div>
    );
  };

  const renderDayView = () => {
    // Simplified day view
    return (
        <div className="p-3 text-center text-muted-foreground">
            Дневной вид в разработке
        </div>
    );
  };

  const renderListView = () => {
    const sortedEvents = [...events].sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
    
    return (
        <div className="space-y-2">
            {sortedEvents.map(ev => (
                <div 
                    key={ev.id} 
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors bg-white"
                    onClick={() => onEventClick(ev)}
                >
                    <div className={cn("w-1 h-10 rounded-full", layerColor(ev.layer).replace('bg-', 'bg-'))} />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm truncate">{ev.title}</h4>
                            {ev.isMystery && <Badge variant="secondary" className="text-[9px] h-4 px-1">Mystery</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{ev.description}</p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground shrink-0">
                        <div>{format(new Date(ev.startAt), 'd MMM', { locale: ru })}</div>
                        <div>{format(new Date(ev.startAt), 'HH:mm')}</div>
                    </div>
                </div>
            ))}
            {sortedEvents.length === 0 && (
                <div className="p-4 text-center text-muted-foreground text-sm">
                    Нет событий для отображения
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="flex-1">
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
        {view === 'list' && renderListView()}
    </div>
  );
}

function Badge({ children, variant, className }: any) {
    return (
        <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
            {children}
        </span>
    )
}
