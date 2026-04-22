import type { Dispatch, SetStateAction } from 'react';
import type { EventType, Layer } from '@/lib/types/calendar';

export type CalendarView = 'month' | 'week' | 'day' | 'list';

export interface CalendarState {
  currentRole: string;
  view: CalendarView;
  currentDate: Date;
  search: string;
  layerFilter: Record<Layer, boolean>;
  entityFilters: Record<string, string>;
}

export interface CalendarActions {
  setCurrentRole: (r: string) => void;
  setView: (v: CalendarView) => void;
  setCurrentDate: (d: Date) => void;
  setSearch: (s: string) => void;
  setLayerFilter: Dispatch<SetStateAction<Record<Layer, boolean>>>;
  setEntityFilters: Dispatch<SetStateAction<Record<string, string>>>;
  handleOpenCreateModal: (date?: Date, forcedType?: EventType) => void;
}

export const LAYERS: Layer[] = [
  'production',
  'buying',
  'events',
  'drops',
  'content',
  'logistics',
  'orders',
  'market',
  'communications',
  'trends',
  'spam',
];

export const layerColor = (layer: Layer) => {
  switch (layer) {
    case 'production': return 'bg-orange-500';
    case 'buying': return 'bg-blue-500';
    case 'events': return 'bg-emerald-500';
    case 'drops': return 'bg-rose-500';
    case 'content': return 'bg-amber-500';
    case 'logistics': return 'bg-sky-500';
    case 'orders': return 'bg-slate-700';
    case 'market': return 'bg-cyan-600';
    case 'communications': return 'bg-fuchsia-500';
    case 'trends': return 'bg-indigo-600';
    case 'spam': return 'bg-zinc-500';
    default: return 'bg-slate-400';
  }
};

export const layerBorder = (layer: Layer) => {
  switch (layer) {
    case 'production': return 'border-indigo-200';
    case 'buying': return 'border-violet-200';
    case 'events': return 'border-emerald-200';
    case 'drops': return 'border-rose-200';
    case 'content': return 'border-amber-200';
    case 'logistics': return 'border-sky-200';
    case 'orders': return 'border-slate-200';
    case 'market': return 'border-cyan-200';
    case 'communications': return 'border-fuchsia-200';
    case 'trends': return 'border-indigo-200';
    case 'spam': return 'border-zinc-200';
    default: return 'border-slate-200';
  }
};

export const ROLE_VISIBILITY: Record<string, Layer[]> = {
  admin: LAYERS,
  brand: [
    'production',
    'buying',
    'events',
    'drops',
    'content',
    'logistics',
    'orders',
    'market',
    'communications',
    'trends',
  ],
  shop: [
    'buying',
    'events',
    'drops',
    'logistics',
    'orders',
    'market',
    'communications',
    'trends',
  ],
  manufacturer: [
    'production',
    'events',
    'logistics',
    'communications',
  ],
  supplier: [
    'buying',
    'production',
    'events',
    'logistics',
    'communications',
  ],
  distributor: [
    'buying',
    'events',
    'logistics',
    'orders',
    'communications',
  ],
  client: [
    'events',
    'drops',
    'content',
    'communications',
  ],
};
