/**
 * Wave I — единые tone-токены для SurfaceStatusBanner и inline warn (supply, hub, assignment).
 * Снижает дублирование amber-стеков и расхождение оттенков между панелями.
 */
export type Workshop2SurfaceBannerTone = 'amber' | 'rose' | 'emerald';

export const WORKSHOP2_SURFACE_BANNER_TONE_CLASS: Record<Workshop2SurfaceBannerTone, string> = {
  amber: 'border-amber-200 bg-amber-50/90 text-amber-950',
  rose: 'border-rose-200 bg-rose-50/90 text-rose-950',
  emerald: 'border-emerald-200 bg-emerald-50/90 text-emerald-950',
};

/** Компактный inline warn (онбординг, assignment tech pack, hub stale). */
export const WORKSHOP2_SURFACE_BANNER_INLINE_WARN_CLASS =
  'rounded-md border border-amber-200/80 bg-amber-50/70 px-2.5 py-2 text-[11px] text-amber-950';

export const WORKSHOP2_SURFACE_BANNER_INLINE_EMERALD_CLASS =
  'rounded-md border border-emerald-200/80 bg-emerald-50/70 px-2.5 py-2 text-[10px] text-emerald-800';

/** MetaChips blockers stack — один amber-слой на панель (§4.16). */
export const WORKSHOP2_SURFACE_BANNER_BLOCKERS_STACK_CLASS =
  'max-w-full rounded border border-amber-200/80 bg-amber-50/60 px-2 py-1.5';

export const WORKSHOP2_SURFACE_BANNER_BLOCKERS_TITLE_CLASS =
  'text-[9px] font-bold tracking-wide text-amber-700';

export const WORKSHOP2_SURFACE_BANNER_BLOCKERS_LIST_CLASS =
  'mt-0.5 list-inside list-disc space-y-0.5 pl-0.5 text-[10px] text-amber-950';

/** MetaChips / PG mirror chip — чуть мягче opacity чем full banner. */
export const WORKSHOP2_SURFACE_CHIP_TONE_CLASS: Record<
  Workshop2SurfaceBannerTone | 'slate',
  string
> = {
  amber: 'border-amber-200/80 bg-amber-50/70 text-amber-950',
  rose: 'border-rose-200/80 bg-rose-50/80 text-rose-950',
  emerald: 'border-emerald-200/80 bg-emerald-50/80 text-emerald-900',
  slate: 'border-border-subtle bg-bg-surface2/80 text-text-secondary',
};

/** Hub cross-tab stale banner (dedup с BackendStatusBanner). */
export const WORKSHOP2_HUB_STALE_BANNER_CLASS =
  'mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2.5 text-[12px] text-amber-950';

/** Wave J — компактный inline warn в meta supply/TZ (без full banner stack). */
export const WORKSHOP2_SURFACE_BANNER_INLINE_META_CLASS = `${WORKSHOP2_SURFACE_BANNER_INLINE_WARN_CLASS} text-[10px] leading-snug`;

/** Wave J — readonly / stage notice в TZ collapsible (rounded-lg variant). */
export const WORKSHOP2_SURFACE_BANNER_TZ_NOTICE_CLASS =
  'rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-950';

/** Wave K — outline action в grading/movement (scale sync, gold sample hint). */
export const WORKSHOP2_SURFACE_BANNER_OUTLINE_ACTION_CLASS =
  'border-amber-200/90 bg-amber-50/80 text-amber-950';

/** Wave K — compact inline hint без full banner stack (movement panel). */
export const WORKSHOP2_SURFACE_BANNER_INLINE_HINT_CLASS = `${WORKSHOP2_SURFACE_BANNER_INLINE_META_CLASS} text-amber-800`;
