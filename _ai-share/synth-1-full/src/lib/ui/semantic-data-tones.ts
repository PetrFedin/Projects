/**
 * Единая карта стабильных ключей тона в данных (`color: 'indigo' | 'slate' | …`) → классы на дизайн-токенах.
 * Главный проект: _ai-share/synth-1-full — расширять здесь, не дублировать `cn()` по файлам.
 */
export {
  partnerBadgeToneClasses,
  partnerBadgeIconToneClasses,
  getPartnerBadgeToneClass,
  getPartnerBadgeIconToneClass,
  type PartnerBadgeTone,
} from './partner-badge-tones';

/** Иконки KPI / шапок секций (StatCard, SectionHeader) — те же ключи, что в фикстурах. */
export const UI_ICON_TONES = ['indigo', 'slate', 'emerald', 'amber', 'rose', 'blue'] as const;
export type UiIconTone = (typeof UI_ICON_TONES)[number];

/** StatCard: иконка с hover на карточке. */
export const statCardIconToneInteractiveClasses: Record<UiIconTone, string> = {
  indigo: 'bg-accent-primary/10 text-accent-primary group-hover:bg-accent-primary/15',
  slate: 'bg-bg-surface2 text-text-secondary group-hover:bg-bg-surface2',
  emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
  amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
  rose: 'bg-rose-50 text-rose-600 group-hover:bg-rose-100',
  blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
};

/** SectionHeader: статичная подложка иконки. */
export const sectionHeaderIconToneClasses: Record<UiIconTone, string> = {
  indigo: 'bg-accent-primary/10 text-accent-primary',
  slate: 'bg-bg-surface2 text-text-secondary',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
  blue: 'bg-blue-50 text-blue-600',
};

export function getStatCardIconToneClass(tone: string): string {
  return (
    statCardIconToneInteractiveClasses[tone as UiIconTone] ??
    statCardIconToneInteractiveClasses.slate
  );
}

export function getSectionHeaderIconToneClass(tone: string): string {
  return sectionHeaderIconToneClasses[tone as UiIconTone] ?? sectionHeaderIconToneClasses.slate;
}

/** Вертикальная полоска акцента у SectionBlock (заголовки сворачиваемых секций бренда). */
export const SECTION_BLOCK_ACCENT_TONES = [
  'indigo',
  'slate',
  'rose',
  'blue',
  'emerald',
  'amber',
] as const;
export type SectionBlockAccentTone = (typeof SECTION_BLOCK_ACCENT_TONES)[number];

export const sectionBlockAccentBarClasses: Record<SectionBlockAccentTone, string> = {
  indigo: 'bg-accent-primary',
  slate: 'bg-text-primary',
  rose: 'bg-rose-600',
  blue: 'bg-blue-600',
  emerald: 'bg-emerald-600',
  amber: 'bg-amber-600',
};

export function getSectionBlockAccentBarClass(tone: string): string {
  return (
    sectionBlockAccentBarClasses[tone as SectionBlockAccentTone] ??
    sectionBlockAccentBarClasses.indigo
  );
}

/** OfferCoupon (кабинет пользователя): градиент карточки + подложка иконки. */
export const OFFER_COUPON_TONES = ['emerald', 'accent', 'purple', 'indigo'] as const;
export type OfferCouponTone = (typeof OFFER_COUPON_TONES)[number];

export const offerCouponCardGradientClasses: Record<OfferCouponTone, string> = {
  emerald:
    'from-emerald-50/50 to-teal-50/50 border-emerald-100 text-emerald-900 hover:border-emerald-300',
  accent:
    'from-accent-primary/10 to-bg-surface2 border-border-subtle text-text-primary hover:border-accent-primary/40',
  purple:
    'from-accent-primary/10 to-accent-primary/5 border-accent-primary/20 text-text-primary hover:border-accent-primary/40',
  indigo:
    'from-accent-primary/10 to-bg-surface2 border-border-subtle text-text-primary hover:border-accent-primary/40',
};

export const offerCouponIconToneClasses: Record<OfferCouponTone, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-600 shadow-inner border border-emerald-100/50',
  accent: 'bg-accent-primary/10 text-accent-primary shadow-inner border border-border-subtle',
  purple: 'bg-accent-primary/10 text-accent-primary shadow-inner border border-accent-primary/20',
  indigo: 'bg-accent-primary/10 text-accent-primary shadow-inner border border-border-subtle',
};

export function getOfferCouponCardClass(tone: string): string {
  return (
    offerCouponCardGradientClasses[tone as OfferCouponTone] ?? offerCouponCardGradientClasses.accent
  );
}

export function getOfferCouponIconClass(tone: string): string {
  return offerCouponIconToneClasses[tone as OfferCouponTone] ?? offerCouponIconToneClasses.accent;
}

/** Полоски прогресса / барчарты по ключу из данных (LeadScoring и т.п.). */
export const DATA_VIZ_BAR_TONES = ['indigo', 'blue', 'emerald'] as const;
export type DataVizBarTone = (typeof DATA_VIZ_BAR_TONES)[number];

export const dataVizBarToneClasses: Record<DataVizBarTone, string> = {
  indigo: 'bg-accent-primary',
  blue: 'bg-blue-600',
  emerald: 'bg-emerald-600',
};

export function getDataVizBarToneClass(tone: string): string {
  return dataVizBarToneClasses[tone as DataVizBarTone] ?? dataVizBarToneClasses.indigo;
}

/** KPI value/иконка для коротких дашборд-метрик. */
export const METRIC_VALUE_TONES = [
  'indigo',
  'slate',
  'emerald',
  'amber',
  'rose',
  'blue',
  'cyan',
  'green',
] as const;
export type MetricValueTone = (typeof METRIC_VALUE_TONES)[number];

export const metricValueToneClasses: Record<MetricValueTone, string> = {
  indigo: 'text-accent-primary',
  slate: 'text-text-primary',
  emerald: 'text-emerald-600',
  amber: 'text-amber-600',
  rose: 'text-rose-600',
  blue: 'text-blue-600',
  cyan: 'text-cyan-600',
  green: 'text-emerald-600',
};

export function getMetricValueToneClass(tone: string): string {
  return metricValueToneClasses[tone as MetricValueTone] ?? metricValueToneClasses.slate;
}

/** Мягкая подложка + текст для KPI-чипов/иконок по ключу цвета. */
export const metricSoftToneClasses: Record<MetricValueTone | 'pink', string> = {
  indigo: 'bg-accent-primary/10 text-accent-primary',
  slate: 'bg-bg-surface2 text-text-secondary',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
  blue: 'bg-blue-50 text-blue-600',
  cyan: 'bg-cyan-50 text-cyan-600',
  green: 'bg-emerald-50 text-emerald-600',
  pink: 'bg-accent-primary/10 text-accent-primary',
};

export function getMetricSoftToneClass(tone: string): string {
  return (
    metricSoftToneClasses[tone as keyof typeof metricSoftToneClasses] ?? metricSoftToneClasses.slate
  );
}
