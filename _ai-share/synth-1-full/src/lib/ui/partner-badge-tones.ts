/**
 * Бейджи партнёров на главной — классы по ключу тона.
 * Реэкспорт и смежные карты (StatCard, SectionBlock, OfferCoupon): `@/lib/ui/semantic-data-tones`.
 */
export const partnerBadgeToneClasses = {
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600',
  indigo: 'bg-accent-primary/10 border-accent-primary/20 text-accent-primary',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-600',
  teal: 'bg-teal-500/10 border-teal-500/20 text-teal-600',
  rose: 'bg-rose-500/10 border-rose-500/20 text-rose-600',
  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-600',
  yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600',
  violet: 'bg-accent-primary/10 border-accent-primary/20 text-accent-primary',
  orange: 'bg-orange-500/10 border-orange-500/20 text-orange-600',
  pink: 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary',
  cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-600',
  slate: 'bg-bg-surface2/10 border-border-subtle text-text-secondary',
  lime: 'bg-lime-500/10 border-lime-500/20 text-lime-600',
  sky: 'bg-sky-500/10 border-sky-500/20 text-sky-600',
} as const;

export type PartnerBadgeTone = keyof typeof partnerBadgeToneClasses;

/** Иконка в тултипе (динамические `text-${color}-400` в Tailwind не собираются). */
export const partnerBadgeIconToneClasses: Record<PartnerBadgeTone, string> = {
  emerald: 'text-emerald-400',
  indigo: 'text-accent-primary',
  amber: 'text-amber-400',
  teal: 'text-teal-400',
  rose: 'text-rose-400',
  blue: 'text-blue-400',
  yellow: 'text-yellow-400',
  violet: 'text-accent-primary',
  orange: 'text-orange-400',
  pink: 'text-accent-primary',
  cyan: 'text-cyan-400',
  slate: 'text-text-muted',
  lime: 'text-lime-400',
  sky: 'text-sky-400',
};

export function getPartnerBadgeToneClass(color: string): string {
  return partnerBadgeToneClasses[color as PartnerBadgeTone] ?? partnerBadgeToneClasses.slate;
}

export function getPartnerBadgeIconToneClass(color: string): string {
  return (
    partnerBadgeIconToneClasses[color as PartnerBadgeTone] ?? partnerBadgeIconToneClasses.slate
  );
}
