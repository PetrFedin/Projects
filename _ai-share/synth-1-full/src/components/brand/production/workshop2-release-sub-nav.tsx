'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  WORKSHOP2_RELEASE_SUB_TAB_LABELS_RU,
  WORKSHOP2_RELEASE_SUB_TABS_OVERFLOW,
  WORKSHOP2_RELEASE_SUB_TABS_PRIMARY,
  isWorkshop2ReleaseSubTabInOverflow,
  type Workshop2ReleaseSubTab,
} from '@/lib/production/workshop2-release-sub-param';

type Props = {
  value: Workshop2ReleaseSubTab;
  onChange: (tab: Workshop2ReleaseSubTab) => void;
};

/** Поднавигация внутри вкладки «Производство»: 3 primary + «Ещё» для floor/cut/logistics/timeline. */
export function Workshop2ReleaseSubNav({ value, onChange }: Props) {
  const overflowActive = isWorkshop2ReleaseSubTabInOverflow(value);
  const overflowLabel = overflowActive
    ? WORKSHOP2_RELEASE_SUB_TAB_LABELS_RU[value]
    : 'Ещё';

  return (
    <nav
      className="flex flex-wrap items-center gap-1 rounded-lg border border-input bg-background p-0.5 shadow-sm"
      data-testid="workshop2-release-sub-nav"
      aria-label="Разделы производства"
    >
      {WORKSHOP2_RELEASE_SUB_TABS_PRIMARY.map((id) => (
        <button
          key={id}
          type="button"
          className={cn(
            'rounded-md px-3 py-1.5 text-[11px] font-medium transition-colors',
            value === id
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-text-secondary hover:bg-slate-100'
          )}
          aria-current={value === id ? 'page' : undefined}
          data-testid={`workshop2-release-sub-tab-${id}`}
          onClick={() => onChange(id)}
        >
          {WORKSHOP2_RELEASE_SUB_TAB_LABELS_RU[id]}
        </button>
      ))}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              'inline-flex items-center gap-0.5 rounded-md px-3 py-1.5 text-[11px] font-medium transition-colors',
              overflowActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-text-secondary hover:bg-slate-100'
            )}
            aria-current={overflowActive ? 'page' : undefined}
            data-testid="workshop2-release-sub-tab-more"
          >
            {overflowLabel}
            <ChevronDown className="h-3 w-3 opacity-70" aria-hidden />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[10rem]">
          {WORKSHOP2_RELEASE_SUB_TABS_OVERFLOW.map((id) => (
            <DropdownMenuItem
              key={id}
              className={cn(
                'text-[11px] cursor-pointer',
                value === id && 'bg-indigo-50 font-medium text-indigo-900'
              )}
              data-testid={`workshop2-release-sub-overflow-${id}`}
              onClick={() => onChange(id)}
            >
              {WORKSHOP2_RELEASE_SUB_TAB_LABELS_RU[id]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
