import type { Layer } from '@/lib/types/calendar';
import type { Dispatch, SetStateAction } from 'react';

export const LAYERS: Layer[] = [
  'production',
  'buying',
  'events',
  'drops',
  'content',
  'logistics',
  'orders',
  'communications',
  'market',
  'trends',
  'spam',
];

export type CalendarState = {
  currentRole: string;
  view: 'month' | 'week' | 'day' | 'list';
  currentDate: Date;
  search: string;
  mysteryEnabled: boolean;
  aiAutomationEnabled: boolean;
  isInvestorMode: boolean;
  spamFilterEnabled: boolean;
  layerFilter: Record<Layer, boolean>;
  entityFilters: Record<string, string>;
};

export type CalendarActions = {
  setCurrentRole: (r: string) => void;
  setView: (v: 'month' | 'week' | 'day' | 'list') => void;
  setCurrentDate: (d: Date) => void;
  setSearch: (s: string) => void;
  setMysteryEnabled: (v: boolean) => void;
  setAiAutomationEnabled: (v: boolean) => void;
  setIsInvestorMode: (v: boolean) => void;
  setSpamFilterEnabled: (v: boolean) => void;
  setLayerFilter: Dispatch<SetStateAction<Record<Layer, boolean>>>;
  setEntityFilters: Dispatch<SetStateAction<Record<string, string>>>;
  handleOpenCreateModal: (date?: Date) => void;
};

export const layerColor = (layer: Layer) => {
  switch (layer) {
    case 'production':
      return 'bg-orange-500';
    case 'buying':
      return 'bg-blue-500';
    case 'events':
      return 'bg-emerald-500';
    case 'drops':
      return 'bg-rose-500';
    case 'content':
      return 'bg-amber-500';
    case 'logistics':
      return 'bg-sky-500';
    case 'orders':
      return 'bg-text-primary/75';
    case 'communications':
      return 'bg-accent-primary/100';
    case 'market':
      return 'bg-violet-500';
    case 'trends':
      return 'bg-accent-primary';
    case 'spam':
      return 'bg-bg-surface20';
    default:
      return 'bg-text-muted';
  }
};

export const layerBorder = (layer: Layer) => {
  switch (layer) {
    case 'production':
      return 'border-accent-primary/30';
    case 'buying':
      return 'border-accent-primary/25';
    case 'events':
      return 'border-emerald-200';
    case 'drops':
      return 'border-rose-200';
    case 'content':
      return 'border-amber-200';
    case 'logistics':
      return 'border-sky-200';
    case 'orders':
      return 'border-border-default';
    case 'communications':
      return 'border-accent-primary/25';
    case 'market':
      return 'border-violet-200';
    case 'trends':
      return 'border-accent-primary/30';
    case 'spam':
      return 'border-border-default';
    default:
      return 'border-border-default';
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
    'communications',
    'market',
    'trends',
  ],
  shop: ['buying', 'events', 'drops', 'logistics', 'orders', 'communications', 'trends'],
  manufacturer: ['production', 'events', 'logistics', 'communications'],
  supplier: ['buying', 'production', 'events', 'logistics', 'communications'],
  distributor: ['buying', 'events', 'logistics', 'orders', 'communications'],
  client: ['events', 'drops', 'content', 'communications'],
};
