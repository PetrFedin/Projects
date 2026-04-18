'use client';

import {
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
  Globe,
  Leaf,
  Scale,
  Database,
  Zap,
  ArrowUpRight,
  ChevronRight,
  Calculator,
  FileText,
  LayoutDashboard,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { b2bSections } from './_fixtures/home-data';
import { useUIState } from '@/providers/ui-state';
<<<<<<< HEAD
=======
import { ROUTES } from '@/lib/routes';
>>>>>>> recover/cabinet-wip-from-stash

interface B2BNavigationProps {
  viewRole: string;
  activeB2BSection: string;
  onSectionChange?: (id: string) => void;
  isScrolledDown: boolean;
}

export function B2BNavigation({
  viewRole,
  activeB2BSection,
  onSectionChange,
  isScrolledDown,
}: B2BNavigationProps) {
  const { isFlowMapOpen, isCalendarOpen, isMediaRadarOpen } = useUIState();

  if (viewRole !== 'b2b') {
    return null;
  }

  const scrollToSection = (id: string) => {
    onSectionChange?.(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -135;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTopOrBottom = () => {
    if (isScrolledDown) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      className={cn(
<<<<<<< HEAD
        'sticky top-[var(--header-height,48px)] z-30 w-full border-b border-slate-200 bg-white/90 py-3 shadow-sm backdrop-blur-xl transition-all duration-300',
=======
        'border-border-default sticky top-[var(--header-height,48px)] z-30 w-full border-b bg-white/90 py-3 shadow-sm backdrop-blur-xl transition-all duration-300',
>>>>>>> recover/cabinet-wip-from-stash
        (isFlowMapOpen || isCalendarOpen || isMediaRadarOpen) &&
          'pointer-events-none -translate-y-full opacity-0'
      )}
    >
<<<<<<< HEAD
      <div className="container mx-auto px-14">
=======
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-14">
>>>>>>> recover/cabinet-wip-from-stash
        <div className="flex items-center gap-1.5">
          {b2bSections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                'group flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border px-1.5 py-2.5 text-xs font-bold uppercase tracking-wide transition-all',
                activeB2BSection === section.id ? 'btn-tab-active' : 'btn-tab-inactive-light'
              )}
            >
              <section.icon
                className={cn(
                  'h-3 w-3 shrink-0 transition-transform',
                  activeB2BSection === section.id
                    ? 'text-white'
<<<<<<< HEAD
                    : 'text-slate-400 group-hover:text-slate-600'
=======
                    : 'text-text-muted group-hover:text-text-secondary'
>>>>>>> recover/cabinet-wip-from-stash
                )}
              />
              <span className="truncate">{section.label}</span>
            </button>
          ))}

          <Link
<<<<<<< HEAD
            href="/brand/control-center"
            className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-indigo-700 transition-all hover:bg-indigo-100"
=======
            href={ROUTES.brand.controlCenter}
            className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/15 flex shrink-0 items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-bold uppercase tracking-wide transition-all"
>>>>>>> recover/cabinet-wip-from-stash
          >
            <LayoutDashboard className="h-3 w-3" />
            <span>Brand Center</span>
          </Link>

          <button
            onClick={scrollToTopOrBottom}
<<<<<<< HEAD
            className="button-glimmer button-professional group ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-lg hover:bg-slate-800 hover:shadow-xl"
=======
            className="hover:bg-text-primary/90 button-glimmer button-professional group ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-lg hover:shadow-xl"
>>>>>>> recover/cabinet-wip-from-stash
            title={isScrolledDown ? 'Наверх' : 'Вниз'}
          >
            <ArrowRight
              className={cn(
                'h-4 w-4 transition-transform duration-500',
                isScrolledDown ? '-rotate-90' : 'rotate-90'
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
