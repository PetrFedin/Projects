import { UserRole } from '@/lib/types';
import { SHOP_B2B_ORDERS_HUB_LABEL } from '@/lib/ui/b2b-registry-label';
import {
  ArrowDown,
  ArrowUp,
  AlertCircle,
  ShieldAlert,
  LayoutGrid,
  MessageSquare as MessageSquareIcon,
  Star,
  Archive,
  Users,
  Handshake,
  Briefcase,
  Factory,
  Store,
  Shield,
  Package,
  Layers,
  GraduationCap,
} from 'lucide-react';
import React from 'react';

export const USER_STATUSES = [
  { id: 'online', label: 'В сети', color: 'bg-green-500' },
  { id: 'busy', label: 'Занят', color: 'bg-rose-500' },
  { id: 'away', label: 'Отойду', color: 'bg-amber-500' },
  { id: 'delay', label: 'Отвечаю с задержкой', color: 'bg-blue-500' },
];

export const ROLE_LABELS = {
  admin: 'Админ',
  b2b: 'B2B',
  brand: 'Бренд',
  client: 'Клиент',
  shop: 'Магазин',
  distributor: 'Дистрибьютор',
  supplier: 'Поставщик',
  manufacturer: 'Производитель',
} satisfies Record<UserRole, string>;

export const ROLE_PERMISSIONS = {
  admin: [
    'all',
    'admin',
    'brand',
    'distributor',
    'supplier',
    'manufacturer',
    'shop',
    'client',
    'team',
    'academy',
    'starred',
    'archived',
  ],
  b2b: ['all', 'brand', 'shop', 'team', 'b2b_orders', 'collections', 'academy', 'starred', 'archived'],
  brand: [
    'all',
    'admin',
    'brand',
    'distributor',
    'supplier',
    'manufacturer',
    'shop',
    'client',
    'team',
    'production',
    'b2b_orders',
    'collections',
    'academy',
    'starred',
    'archived',
  ],
  client: ['all', 'admin', 'brand', 'shop', 'academy', 'starred', 'archived'],
  shop: ['all', 'admin', 'brand', 'distributor', 'team', 'starred', 'archived', 'client', 'academy'],
  distributor: ['all', 'admin', 'brand', 'shop', 'team', 'starred', 'archived'],
  supplier: ['all', 'admin', 'brand', 'manufacturer', 'team', 'starred', 'archived'],
  manufacturer: ['all', 'admin', 'brand', 'supplier', 'team', 'starred', 'archived'],
} satisfies Record<UserRole, string[]>;

export const chatGroupConfig = {
  all: { label: 'Все потоки', icon: LayoutGrid },
  admin: { label: 'Админ-канал', icon: Shield },
  brand: { label: 'Бренды', icon: Store },
  distributor: { label: 'Дистрибьюторы', icon: Factory },
  supplier: { label: 'Поставщики', icon: Handshake },
  manufacturer: { label: 'Производители', icon: Factory },
  production: { label: 'Производство', icon: Briefcase },
  b2b_orders: { label: SHOP_B2B_ORDERS_HUB_LABEL, icon: Package },
  collections: { label: 'Коллекции', icon: Layers },
  academy: { label: 'Академия', icon: GraduationCap },
  shop: { label: 'Магазины', icon: Users },
  team: { label: 'Команда', icon: Users },
  client: { label: 'Клиенты', icon: Users },
  starred: { label: 'Избранное', icon: Star },
  archived: { label: 'Архив', icon: Archive },
};

export type ChatGroupKey = keyof typeof chatGroupConfig;
export type ChatGroupTuple = [ChatGroupKey, (typeof chatGroupConfig)[ChatGroupKey]];

export const priorityConfig = {
  low: { label: 'Низкий', icon: ArrowDown, color: 'text-text-muted' },
  medium: { label: 'Средний', icon: ArrowUp, color: 'text-amber-500' },
  high: { label: 'Высокий', icon: AlertCircle, color: 'text-rose-500' },
  critical: {
    label: 'Критический',
    icon: ShieldAlert,
    color: 'text-red-600 font-black animate-pulse',
  },
} satisfies Record<string, { label: string; icon: React.ElementType; color: string }>;

export const statusConfig = {
  pending: { label: 'Ожидает', color: 'text-text-muted' },
  in_progress: { label: 'В работе', color: 'text-blue-500' },
  done: { label: 'Завершено', color: 'text-emerald-500' },
};
