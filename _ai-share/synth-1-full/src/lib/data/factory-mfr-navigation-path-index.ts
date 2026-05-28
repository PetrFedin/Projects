/**
 * Лёгкий path-index для breadcrumbs — без lucide / nav groups в layout chunk.
 * Синхронизация: npm run cabinet-hub-nav:sync-path-index
 */

import type { CabinetNavPathCandidate } from '@/lib/ui/cabinet-nav-active';

export const factoryMfrNavPathCandidates: readonly CabinetNavPathCandidate[] = [
  {
    href: '/factory',
    label: 'Дашборд',
  },
  {
    href: '/factory/staff',
    label: 'Команда',
  },
  {
    href: '/brand/calendar?layers=tasks,orders,production',
    label: 'Календарь',
  },
  {
    href: '/brand/messages',
    label: 'Сообщения',
  },
  {
    href: '/brand/factories',
    label: 'Партнёры и сеть',
  },
  {
    href: '/brand/factories',
    label: 'Фабрики',
  },
  {
    href: '/brand/production/subcontractor',
    label: 'Субподряд',
  },
  {
    href: '/brand/production',
    label: 'Производство',
  },
  {
    href: '/brand/production/operations',
    label: 'Операции',
  },
  {
    href: '/brand/production/gantt',
    label: 'Диаграмма Ганта',
  },
  {
    href: '/brand/production/daily-output',
    label: 'Дневная выработка',
  },
  {
    href: '/brand/production/worker-skills',
    label: 'Навыки работников',
  },
  {
    href: '/brand/production/ready-made',
    label: 'Готовый продукт',
  },
  {
    href: '/brand/production/nesting',
    label: 'Раскрой (Nesting)',
  },
  {
    href: '/brand/logistics',
    label: 'Логистика и склад',
  },
  {
    href: '/brand/warehouse',
    label: 'Склад',
  },
  {
    href: '/brand/inventory',
    label: 'Остатки',
  },
  {
    href: '/brand/materials',
    label: 'Каталог материалов',
  },
  {
    href: '/brand/materials/reservation',
    label: 'Резервирование',
  },
  {
    href: '/brand/vmi',
    label: 'VMI',
  },
  {
    href: '/brand/compliance',
    label: 'Контроль качества',
  },
  {
    href: '/brand/production/qc-app',
    label: 'QC App',
  },
  {
    href: '/brand/production/gold-sample',
    label: 'Золотой образец',
  },
  {
    href: '/brand/production/fit-comments',
    label: 'Комментарии по посадке',
  },
  {
    href: '/brand/production/milestones-video',
    label: 'Видео этапов',
  },
  {
    href: '/brand/analytics',
    label: 'Аналитика',
  },
] as const;
