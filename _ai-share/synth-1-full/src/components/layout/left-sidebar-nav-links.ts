import type { LucideIcon } from 'lucide-react';
import {
  Info,
  ClipboardList,
  HelpCircle,
  Table,
  ListTree,
  Tags,
  BookText,
  Ruler,
  Palette,
  TableProperties,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';

const REFERENCE_SECTIONS = [
  { href: '/project-info/attributes', icon: ListTree, label: 'Справочник атрибутов' },
  { href: '/project-info/categories', icon: BookText, label: 'Категории' },
  { href: '/project-info/sizes', icon: Ruler, label: 'Размерные сетки' },
  { href: '/project-info/colors', icon: Palette, label: 'Палитра цветов' },
] as const;

export type LeftSidebarNavLink = {
  href: string;
  icon: LucideIcon;
  label: string;
};

export type LeftSidebarNavDropdown = {
  type: 'dropdown';
  icon: LucideIcon;
  label: string;
  sections: typeof REFERENCE_SECTIONS;
};

/** Лёгкий data-модуль для header mobile nav — без UI-компонента sidebar. */
export const leftSidebarNavLinks: (LeftSidebarNavLink | LeftSidebarNavDropdown)[] = [
  { href: ROUTES.catalog, icon: Tags, label: 'Каталог брендов' },
  { href: '/project-info', icon: Info, label: 'О проекте' },
  { href: '/project-status', icon: ClipboardList, label: 'Реестр проекта' },
  {
    href: '/project-info/roles-matrix',
    icon: TableProperties,
    label: 'Матрица ролей',
  },
  { href: '/quiz', icon: HelpCircle, label: 'Квиз для брендов' },
  { href: '/project-info/product-display', icon: Table, label: 'Структура данных' },
  { type: 'dropdown', icon: ListTree, label: 'Справочники', sections: REFERENCE_SECTIONS },
];
