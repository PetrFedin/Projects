/**
 * Shared Tailwind class fragments for brand operational surfaces (rail, registry).
 * Эталон заголовков и лент: `registry-feed-layout.ts` + `RegistryPageHeader` (admin/activity).
 */
export const operationalLayoutContract = {
  pageTitle: 'font-semibold tracking-tight text-text-primary',
  filterBar: 'flex flex-wrap items-center gap-2',
  panel: 'rounded-xl border border-border-default/80 bg-white',
  tableWrap: 'overflow-x-auto',
  /** В духе «Глобальной ленты»: uppercase, widest tracking */
  tableHeadCell: 'px-3 text-left text-[9px] font-black uppercase tracking-widest text-text-muted',
  tableRow: 'border-b border-border-subtle transition-colors hover:bg-bg-surface2/80',
  tableCell: 'px-3 py-3 text-sm text-text-primary align-middle',
  numericCell: 'text-right tabular-nums',
  primaryLink: 'text-accent-primary underline-offset-4 hover:underline',
} as const;
