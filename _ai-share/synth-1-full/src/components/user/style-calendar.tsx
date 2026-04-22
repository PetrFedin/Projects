'use client';

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useUserOrders } from "@/hooks/use-user-orders";
import { useUserInsights } from "@/hooks/use-user-insights";
import { CalendarEvent, Layer, EventType } from '@/lib/types/calendar';
import { CalendarHeader } from './calendar/_components/CalendarHeader';
import { CalendarGrid } from './calendar/_components/CalendarGrid';
import { EventDialog } from './calendar/_components/EventDialog';
import { ROLE_VISIBILITY } from './calendar/constants';
import { cn } from "@/lib/utils";
import { buildLayerFocusFilter, parseAgendaLayersParam } from "@/lib/communications/calendar-bridge";
import { saveCalendarEvent, deleteCalendarEvent } from '@/lib/collaboration/calendar-store';

export default function StyleCalendar({
  initialRole,
  variant = 'full',
  externalDate,
  onDateChange,
  externalEvents,
  contextSearchSeed,
  calendarLayers,
  calendarDate,
  calendarPartner,
  calendarRole,
  calendarAdd,
}: {
  initialRole?: any;
  variant?: 'full' | 'compact';
  externalDate?: Date;
  onDateChange?: (date: Date) => void;
  /** События из LIVE process, collaboration и др. — объединяются с дефолтными */
  externalEvents?: CalendarEvent[];
  /** Из URL (матрица этапов): предзаполнить поиск артикул / заказ / сезон */
  contextSearchSeed?: string;
  /** Из родителя (напр. `/brand/calendar`): query без useSearchParams внутри виджета */
  calendarLayers?: string | null;
  calendarDate?: string | null;
  calendarPartner?: string | null;
  calendarRole?: string | null;
  calendarAdd?: string | null;
}) {
  const { user } = useAuth();
  const { orders } = useUserOrders();
  const { predictions } = useUserInsights();
  
  const [currentRole, setCurrentRole] = useState((initialRole || (user?.roles?.[0]) || 'client').toLowerCase());
  const [view, setView] = useState(variant === 'compact' ? "month" : "month");
  const [currentDate, _setCurrentDate] = useState<Date>(externalDate || new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const setCurrentDate = (date: Date) => {
    _setCurrentDate(date);
    if (onDateChange) onDateChange(date);
  };

  // Sync with externalDate if it changes
  useEffect(() => {
    if (externalDate) {
      _setCurrentDate(externalDate);
    }
  }, [externalDate]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const contextSeedApplied = useRef(false);

  useEffect(() => {
    if (contextSeedApplied.current || !contextSearchSeed?.trim()) return;
    setSearch(contextSearchSeed.trim());
    contextSeedApplied.current = true;
  }, [contextSearchSeed]);
  const [layerFilter, setLayerFilter] = useState<Record<Layer, boolean>>({
    production: true,
    buying: true,
    events: true,
    drops: true,
    content: true,
    logistics: true,
    orders: true,
    communications: true,
    trends: true,
    market: true,
    spam: false,
  } as Record<Layer, boolean>);
  const lastCalendarQueryKey = useRef<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [draft, setDraft] = useState<Partial<CalendarEvent>>({
    title: '',
    layer: 'events',
    type: 'event',
    visibility: 'public',
    startAt: new Date().toISOString().slice(0, 16),
    endAt: new Date(new Date().getTime() + 3600000).toISOString().slice(0, 16),
    participants: []
  });

  useEffect(() => {
    // Mock events generation (simplified for brevity, logic moved from original)
    // In a real app, this would be a data fetching hook or API call
    const mockEvents: CalendarEvent[] = [
        {
            id: "e1", ownerId: "b1", ownerRole: "brand", ownerName: "Syntha Premium", calendarId: "c1",
            title: "Запуск коллекции FW26", description: "Глобальный релиз новой коллекции.",
            layer: "drops", visibility: "public", type: "event",
            startAt: "2026-02-12T10:00:00.000Z", endAt: "2026-02-12T18:00:00.000Z",
            participants: [], entityId: "b1", entityName: "Syntha Premium",
            importance: 'high', userReaction: 'watching'
        },
        {
            id: "e2", ownerId: "system", ownerRole: "admin", ownerName: "SYNTHA Market", calendarId: "market",
            title: "Market Week Milan", description: "Главное событие сезона для байеров.",
            layer: "buying", visibility: "public", type: "event",
            startAt: "2026-02-15T09:00:00.000Z", endAt: "2026-02-22T20:00:00.000Z",
            participants: [], importance: 'high'
        },
        {
            id: "e3", ownerId: "f1", ownerRole: "manufacturer", ownerName: "Factory North", calendarId: "prod",
            title: "QC: Проверка партии #442", description: "Контроль качества перед отгрузкой.",
            layer: "production", visibility: "internal", type: "task",
            startAt: "2026-02-11T09:30:00.000Z", endAt: "2026-02-11T12:30:00.000Z",
            participants: [], importance: 'medium'
        },
        {
            id: "e4", ownerId: "b1", ownerRole: "brand", ownerName: "Syntha Studio", calendarId: "content",
            title: "Съемка Lookbook SS26", description: "Студийная съемка новой капсулы.",
            layer: "content", visibility: "internal", type: "event",
            startAt: "2026-02-13T11:00:00.000Z", endAt: "2026-02-13T19:00:00.000Z",
            participants: [], importance: 'medium'
        },
        {
            id: "e5", ownerId: "system", ownerRole: "admin", ownerName: "SYNTHA Logistics", calendarId: "logistics",
            title: "Прибытие контейнера (Польша)", description: "Таможенная очистка и приемка.",
            layer: "logistics", visibility: "internal", type: "event",
            startAt: "2026-02-14T08:00:00.000Z", endAt: "2026-02-14T10:00:00.000Z",
            participants: [], importance: 'high'
        },
        {
            id: "e6", ownerId: "system", ownerRole: "admin", ownerName: "SYNTHA AI", calendarId: "ai",
            title: "AI Trend Analysis: Spring 26", description: "Автоматический отчет по трендам на основе спроса.",
            layer: "content", visibility: "public", type: "task",
            startAt: "2026-02-18T12:00:00.000Z", endAt: "2026-02-18T13:00:00.000Z",
            participants: [], importance: 'medium'
        },
        {
            id: "e7", ownerId: "s1", ownerRole: "supplier", ownerName: "Silk Road Co", calendarId: "auction",
            title: "Аукцион: Шелк (Италия)", description: "Торги за остатки премиального шелка.",
            layer: "buying", visibility: "public", type: "event",
            startAt: "2026-02-16T15:00:00.000Z", endAt: "2026-02-16T17:00:00.000Z",
            participants: [], importance: 'high'
        },
        {
            id: "e8", ownerId: "system", ownerRole: "admin", ownerName: "Logistics Hub", calendarId: "log",
            title: "Таможня: Партия #DX-99", description: "Ожидание выпуска.",
            layer: "logistics", visibility: "internal", type: "event",
            startAt: "2026-02-10T09:00:00.000Z", endAt: "2026-02-10T18:00:00.000Z",
            participants: [], importance: 'high'
        },
        {
            id: "e9", ownerId: "b1", ownerRole: "brand", ownerName: "Marketing", calendarId: "mkt",
            title: "PR: Интервью Vogue", description: "Обсуждение коллекции FW26.",
            layer: "communications", visibility: "public", type: "event",
            startAt: "2026-02-11T14:00:00.000Z", endAt: "2026-02-11T15:30:00.000Z",
            participants: [], importance: 'medium'
        },
        {
            id: "e10", ownerId: "f2", ownerRole: "manufacturer", ownerName: "Denim Tech", calendarId: "prod",
            title: "Поставка: Denim Raw (1000m)", description: "Приемка сырья на склад.",
            layer: "production", visibility: "internal", type: "task",
            startAt: "2026-02-12T08:00:00.000Z", endAt: "2026-02-12T10:00:00.000Z",
            participants: [], importance: 'medium'
        },
        {
            id: "e11", ownerId: "system", ownerRole: "admin", ownerName: "System", calendarId: "today",
            title: "Production Sync: Today", description: "Синхронизация по текущим заказам.",
            layer: "production", visibility: "public", type: "event",
            startAt: new Date().toISOString(), endAt: new Date(Date.now() + 3600000).toISOString(),
            participants: [], importance: 'high'
        },
        {
            id: "t1", ownerId: "system", ownerRole: "admin", ownerName: "AI Trend Radar", calendarId: "ai",
            title: "📈 AI TREND: Эко-кожа (Peak)", description: "Ожидается пиковый спрос на категорию 'Эко-кожа' через 14 дней. Рекомендовано увеличить закупки на 25%.",
            layer: "trends", visibility: "public", type: "livestream",
            startAt: new Date(Date.now() + 86400000 * 2).toISOString(), endAt: new Date(Date.now() + 86400000 * 2 + 3600000).toISOString(),
            participants: [], importance: 'critical'
        },
        {
            id: "t2", ownerId: "system", ownerRole: "admin", ownerName: "AI Trend Radar", calendarId: "ai",
            title: "👗 AI INSIGHT: Макси-платья", description: "Тренд на макси-платья возвращается. Рост упоминаний в соцсетях +45% за неделю.",
            layer: "trends", visibility: "public", type: "livestream",
            startAt: new Date(Date.now() + 86400000 * 5).toISOString(), endAt: new Date(Date.now() + 86400000 * 5 + 3600000).toISOString(),
            participants: [], importance: 'high'
        }
    ];
    
    // Add orders and predictions
    if (orders && orders.length > 0) {
        orders.forEach(order => {
            if (order.estimatedDelivery) {
                mockEvents.push({
                    id: `order_${order.id}`,
                    ownerId: 'system',
                    ownerRole: 'admin',
                    ownerName: 'SYNTHA Logistics',
                    calendarId: 'logistics',
                    title: `Доставка заказа #${order.id.slice(0, 5)}`,
                    description: `Статус: ${order.status}`,
                    layer: 'logistics',
                    visibility: 'public',
                    type: 'event',
                    startAt: order.estimatedDelivery,
                    endAt: new Date(new Date(order.estimatedDelivery).getTime() + 3600000).toISOString(),
                    participants: [],
                    importance: 'high'
                });
            }
        });
    }

    if (externalEvents && externalEvents.length > 0) {
      const extIds = new Set(externalEvents.map(e => e.id));
      const merged = [...externalEvents];
      mockEvents.forEach(m => {
        if (!extIds.has(m.id)) merged.push(m);
      });
      setEvents(merged);
    } else {
      setEvents(mockEvents);
    }
  }, [user, orders, predictions, externalEvents]);

  const filteredEvents = useMemo(() => {
    const raw = search.trim().toLowerCase();
    const tokens = raw ? raw.split(/\s+/).filter(Boolean) : [];
    return events.filter(ev => {
      const allowedLayers = ROLE_VISIBILITY[currentRole] || ROLE_VISIBILITY['brand'];
      if (currentRole !== 'admin' && !allowedLayers.includes(ev.layer)) return false;
      if (ev.status === 'cancelled') return false;
      if (!layerFilter[ev.layer]) return false;
      if (tokens.length > 0) {
        const blob = `${ev.title} ${ev.description ?? ''} ${ev.entityName ?? ''}`.toLowerCase();
        const isMatrixDemo = typeof ev.id === 'string' && ev.id.startsWith('demo-stage-cal-');
        if (isMatrixDemo) {
          if (!tokens.some((t) => t.length > 1 && blob.includes(t))) return false;
        } else if (!tokens.every((t) => blob.includes(t))) return false;
      } else if (raw && !ev.title.toLowerCase().includes(raw)) return false;
      return true;
    });
  }, [events, currentRole, layerFilter, search]);

  const handleOpenCreateModal = (date?: Date, forcedType?: EventType) => {
    const start = date ? new Date(date) : new Date();
    start.setHours(12, 0, 0, 0);
    const end = new Date(start.getTime() + 3600000);
    setDraft({
      title: '',
      layer: forcedType === 'reminder' ? 'communications' : 'events',
      type: forcedType || 'event',
      visibility: currentRole === 'client' ? 'public' : 'internal',
      startAt: start.toISOString().slice(0, 16),
      endAt: end.toISOString().slice(0, 16),
      participants: []
    });
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    const uid = user?.uid ?? 'guest';
    const ownerRole = (currentRole as CalendarEvent['ownerRole']) || 'brand';
    const ownerName = user?.displayName || 'Пользователь';
    if (modalMode === 'create') {
      const newEvent: CalendarEvent = {
        ...draft,
        id: `new_${Date.now()}`,
        ownerId: uid,
        ownerRole: ownerRole,
        ownerName,
        calendarId: 'personal',
        status: 'scheduled',
        participants: draft.participants || [],
      } as CalendarEvent;
      saveCalendarEvent(uid, newEvent);
      setEvents((prev) => [...prev, newEvent]);
    } else if (selectedEventId) {
      const prev = events.find((e) => e.id === selectedEventId);
      const merged: CalendarEvent = { ...(prev as CalendarEvent), ...draft } as CalendarEvent;
      saveCalendarEvent(uid, merged);
      setEvents((prev) => prev.map((e) => (e.id === selectedEventId ? merged : e)));
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = () => {
    if (!selectedEventId) return;
    const uid = user?.uid ?? 'guest';
    deleteCalendarEvent(uid, selectedEventId);
    setEvents((prev) => prev.filter((e) => e.id !== selectedEventId));
    setIsModalOpen(false);
    setSelectedEventId(null);
  };

  const handleEventClick = (event: CalendarEvent) => {
      setSelectedEventId(event.id);
      setDraft(event);
      setModalMode('edit');
      setIsModalOpen(true);
  };

  /** Deep links from agenda strip / messages (passed from page with Suspense). */
  useEffect(() => {
    const layersRaw = calendarLayers ?? null;
    const dateStr = calendarDate ?? null;
    const add = calendarAdd ?? null;
    const urlKey = `${layersRaw ?? ''}|${dateStr ?? ''}|${add ?? ''}`;
    if (urlKey === lastCalendarQueryKey.current) return;
    lastCalendarQueryKey.current = urlKey;

    const sources = parseAgendaLayersParam(layersRaw);
    if (sources.length > 0) {
      setLayerFilter(buildLayerFocusFilter(sources));
    }
    if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split('-').map(Number);
      _setCurrentDate(new Date(y, m - 1, d));
    }
    if (add === '1') {
      const start = new Date();
      start.setHours(12, 0, 0, 0);
      const end = new Date(start.getTime() + 3600000);
      setDraft({
        title: '',
        layer: 'events',
        type: 'event',
        visibility: currentRole === 'client' ? 'public' : 'internal',
        startAt: start.toISOString().slice(0, 16),
        endAt: end.toISOString().slice(0, 16),
        participants: [],
      });
      setModalMode('create');
      setSelectedEventId(null);
      setIsModalOpen(true);
    }
  }, [calendarLayers, calendarDate, calendarPartner, calendarRole, calendarAdd, currentRole]);

  return (
    <div className={cn(
      "flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100",
      variant === 'full' ? "h-full" : "h-[600px]"
    )}>
      {variant === 'full' ? (
        <div className="p-4 border-b border-slate-100">
          <CalendarHeader
            state={{
              currentRole,
              view,
              currentDate,
              search,
              layerFilter,
              entityFilters: {},
            }}
            actions={{
              setCurrentRole,
              setView,
              setCurrentDate,
              setSearch,
              setLayerFilter,
              setEntityFilters: () => {},
              handleOpenCreateModal,
            }}
            user={user}
          />
        </div>
      ) : (
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white pointer-events-none opacity-50">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-slate-400" />
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              {currentDate.toLocaleDateString('ru', { month: 'long', year: 'numeric' })}
            </div>
          </div>
          {/* Navigation disabled for compact view as per user request */}
        </div>
      )}
      
      <div className={cn(
        "flex-1 overflow-y-auto bg-slate-50/50",
        variant === 'full' ? "p-4" : "p-2"
      )}>
        <CalendarGrid 
            view={view}
            currentDate={currentDate}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onCellClick={(date) => handleOpenCreateModal(date)}
        />
      </div>

      <EventDialog 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        draft={draft}
        setDraft={setDraft}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        currentRole={currentRole}
      />
    </div>
  );
}
