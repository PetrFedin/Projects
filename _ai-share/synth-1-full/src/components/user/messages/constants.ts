import { UserRole } from '@/lib/types';
import { 
  ArrowDown, ArrowUp, AlertCircle, ShieldAlert,
  LayoutGrid, MessageSquare as MessageSquareIcon, Star, Archive, Users, Handshake, Briefcase, Factory, Store, Shield, Package, Layers
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
  brand: 'Бренд',
  b2b: 'B2B',
  client: 'Клиент',
  shop: 'Магазин',
  distributor: 'Дистрибьютор',
  supplier: 'Поставщик',
  manufacturer: 'Производитель',
} satisfies Record<UserRole, string>;

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['all', 'admin', 'brand', 'distributor', 'supplier', 'manufacturer', 'shop', 'client', 'team', 'starred', 'archived'],
  brand: ['all', 'admin', 'brand', 'distributor', 'supplier', 'manufacturer', 'shop', 'client', 'team', 'production', 'b2b_orders', 'collections', 'starred', 'archived'],
  b2b: ['all', 'admin', 'brand', 'shop', 'team', 'starred', 'archived', 'client', 'b2b_orders'],
  client: ['all', 'admin', 'brand', 'shop', 'starred', 'archived'],
  shop: ['all', 'admin', 'brand', 'distributor', 'team', 'starred', 'archived', 'client'],
  distributor: ['all', 'admin', 'brand', 'shop', 'team', 'starred', 'archived'],
  supplier: ['all', 'admin', 'brand', 'manufacturer', 'team', 'starred', 'archived'],
  manufacturer: ['all', 'admin', 'brand', 'supplier', 'team', 'starred', 'archived'],
};

export const chatGroupConfig = {
  all: { label: 'Все потоки', icon: LayoutGrid },
  admin: { label: 'Админ-канал', icon: Shield },
  brand: { label: 'Бренды', icon: Store },
  distributor: { label: 'Дистрибьюторы', icon: Factory },
  supplier: { label: 'Поставщики', icon: Handshake },
  manufacturer: { label: 'Производители', icon: Factory },
  production: { label: 'Производство', icon: Briefcase },
  b2b_orders: { label: 'B2B Заказы', icon: Package },
  collections: { label: 'Коллекции', icon: Layers },
  shop: { label: 'Магазины', icon: Users },
  team: { label: 'Команда', icon: Users },
  client: { label: 'Клиенты', icon: Users },
  starred: { label: 'Избранное', icon: Star },
  archived: { label: 'Архив', icon: Archive },
};

export const priorityConfig = {
  low: { label: 'Низкий', icon: ArrowDown, color: 'text-slate-400' },
  medium: { label: 'Средний', icon: ArrowUp, color: 'text-amber-500' },
  high: { label: 'Высокий', icon: AlertCircle, color: 'text-rose-500' },
  critical: { label: 'Критический', icon: ShieldAlert, color: 'text-red-600 font-black animate-pulse' },
} satisfies Record<string, { label: string; icon: React.ElementType; color: string }>;

export const statusConfig = {
  pending: { label: 'Ожидает', color: 'text-slate-400' },
  in_progress: { label: 'В работе', color: 'text-blue-500' },
  done: { label: 'Завершено', color: 'text-emerald-500' },
};
