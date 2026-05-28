'use client';

import { BrandHubKpiStrip } from '@/components/brand/BrandHubKpiStrip';
import { SearchBar } from '@/components/search/SearchBarLazy';

/** KPI + command palette в шапке brand hub — отдельный chunk от layout shell. */
export function BrandHubTitleTrailing() {
  return (
    <div className="flex w-full min-w-0 shrink-0 flex-wrap items-center justify-end gap-2 sm:w-auto">
      <BrandHubKpiStrip />
      <SearchBar />
    </div>
  );
}
