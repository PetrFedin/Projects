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
import { ROUTES } from '@/lib/routes';

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
        'border-border-default sticky top-[var(--header-height,48px)] z-30 w-full border-b bg-white/90 py-3 shadow-sm backdrop-blur-xl transition-all duration-300',
        (isFlowMapOpen || isCalendarOpen || isMediaRadarOpen) &&
          'pointer-events-none -translate-y-full opacity-0'
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-14">
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
                    : 'text-text-muted group-hover:text-text-secondary'
                )}
              />
              <span className="truncate">{section.label}</span>
            </button>
          ))}

          <Link
            href={ROUTES.brand.controlCenter}
            className="border-accent-primary/30 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/15 flex shrink-0 items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-xs font-bold uppercase tracking-wide transition-all"
          >
            <LayoutDashboard className="h-3 w-3" />
            <span>Brand Center</span>
          </Link>

          <button
            onClick={scrollToTopOrBottom}
            className="hover:bg-text-primary/90 button-glimmer button-professional group ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-lg hover:shadow-xl"
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
