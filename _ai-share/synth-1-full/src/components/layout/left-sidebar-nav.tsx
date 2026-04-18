'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { buttonVariants } from '@/components/ui/button';
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
  PanelLeftOpen,
  PanelLeftClose,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIState } from '@/providers/ui-state';
import { ROUTES } from '@/lib/routes';

const REFERENCE_SECTIONS = [
  { href: '/project-info/attributes', icon: ListTree, label: 'Справочник атрибутов' },
  { href: '/project-info/categories', icon: BookText, label: 'Категории' },
  { href: '/project-info/sizes', icon: Ruler, label: 'Размерные сетки' },
  { href: '/project-info/colors', icon: Palette, label: 'Палитра цветов' },
];

type NavLink = { href: string; icon: React.ComponentType<{ className?: string }>; label: string };
type NavDropdown = {
  type: 'dropdown';
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sections: typeof REFERENCE_SECTIONS;
};
<<<<<<< HEAD
=======

function isNavDropdown(item: NavLink | NavDropdown): item is NavDropdown {
  return 'sections' in item;
}
>>>>>>> recover/cabinet-wip-from-stash

export const leftSidebarNavLinks: (NavLink | NavDropdown)[] = [
  { href: ROUTES.catalog, icon: Tags, label: 'Каталог брендов' },
  { href: '/project-info', icon: Info, label: 'О проекте' },
  { href: '/project-status', icon: ClipboardList, label: 'Реестр проекта' },
  { href: '/quiz', icon: HelpCircle, label: 'Квиз для брендов' },
  { href: '/project-info/product-display', icon: Table, label: 'Структура данных' },
  { type: 'dropdown', icon: ListTree, label: 'Справочники', sections: REFERENCE_SECTIONS },
];

export function LeftSidebarNav() {
  const pathname = usePathname();
  const { isFlowMapOpen } = useUIState();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div
      className={cn(
        'fixed left-0 top-1/2 z-[100] -translate-y-1/2 transition-all duration-300',
        isFlowMapOpen && 'pointer-events-none opacity-0',
        collapsed && 'pointer-events-none'
      )}
    >
      {/* Toggle button — always visible */}
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className={cn(
<<<<<<< HEAD
          'pointer-events-auto absolute -right-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-md transition-all hover:bg-slate-50 hover:text-slate-900',
=======
          'border-border-default text-text-muted hover:text-text-primary hover:bg-bg-surface2 pointer-events-auto absolute -right-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-md transition-all',
>>>>>>> recover/cabinet-wip-from-stash
          collapsed ? 'translate-x-[52px]' : 'translate-x-[calc(100%+16px)]'
        )}
        aria-label={collapsed ? 'Развернуть панель' : 'Свернуть панель'}
      >
        {collapsed ? (
          <PanelLeftOpen className="h-3.5 w-3.5" />
        ) : (
          <PanelLeftClose className="h-3.5 w-3.5" />
        )}
      </button>

      <div
        className={cn(
          'flex flex-col overflow-hidden rounded-r-2xl border border-l-0 bg-card shadow-2xl backdrop-blur-xl transition-all duration-300',
          collapsed
            ? 'pointer-events-none max-h-0 w-0 p-0 opacity-0'
            : 'pointer-events-auto w-14 gap-1 p-2 opacity-100'
        )}
      >
        {leftSidebarNavLinks.map((link) => {
<<<<<<< HEAD
          if (link.type === 'dropdown') {
            const isActive = link.sections.some(
              (s) => pathname === s.href || pathname.startsWith(s.href + '/')
=======
          if (isNavDropdown(link)) {
            const isActive = link.sections.some(
              (s: (typeof REFERENCE_SECTIONS)[number]) =>
                pathname === s.href || pathname.startsWith(s.href + '/')
>>>>>>> recover/cabinet-wip-from-stash
            );
            return (
              <DropdownMenu key={link.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger
                      className={cn(
                        buttonVariants({ variant: 'ghost', size: 'icon' }),
                        'h-10 w-10 rounded-xl transition-all duration-300',
                        isActive
<<<<<<< HEAD
                          ? 'bg-slate-900 text-white shadow-lg'
                          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
=======
                          ? 'bg-text-primary text-white shadow-lg'
                          : 'text-text-muted hover:bg-bg-surface2 hover:text-text-primary'
>>>>>>> recover/cabinet-wip-from-stash
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      <span className="sr-only">{link.label}</span>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="rounded-lg text-[10px] font-bold uppercase tracking-widest"
                  >
                    <p>{link.label}</p>
<<<<<<< HEAD
                    <p className="mt-0.5 text-[9px] font-normal normal-case text-slate-400">
=======
                    <p className="text-text-muted mt-0.5 text-[9px] font-normal normal-case">
>>>>>>> recover/cabinet-wip-from-stash
                      Категории, размеры, цвета
                    </p>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent
                  side="right"
                  align="start"
                  className="w-56 rounded-xl border shadow-xl"
                >
<<<<<<< HEAD
                  {link.sections.map((section) => {
=======
                  {link.sections.map((section: (typeof REFERENCE_SECTIONS)[number]) => {
>>>>>>> recover/cabinet-wip-from-stash
                    const SectionIcon = section.icon;
                    return (
                      <DropdownMenuItem key={section.href} asChild>
                        <Link
                          href={section.href}
                          className="flex cursor-pointer items-center gap-2 py-2"
                        >
                          <SectionIcon className="h-4 w-4 shrink-0" />
                          <span className="text-[11px] font-bold">{section.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }
          const navLink = link as NavLink;
          const isActive =
            pathname === navLink.href ||
            (navLink.href !== '/' && pathname.startsWith(navLink.href + '/'));
          return (
            <Tooltip key={navLink.href}>
              <TooltipTrigger asChild>
                <Link
                  href={navLink.href}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'icon' }),
                    'h-10 w-10 rounded-xl transition-all duration-300',
                    isActive
<<<<<<< HEAD
                      ? 'bg-slate-900 text-white shadow-lg'
                      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
=======
                      ? 'bg-text-primary text-white shadow-lg'
                      : 'text-text-muted hover:bg-bg-surface2 hover:text-text-primary'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                >
                  <navLink.icon className="h-5 w-5" />
                  <span className="sr-only">{navLink.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="rounded-lg text-[10px] font-bold uppercase tracking-widest"
              >
                <p>{navLink.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
