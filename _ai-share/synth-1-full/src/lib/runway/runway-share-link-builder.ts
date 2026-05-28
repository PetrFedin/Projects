/**
 * Сборка deep link и UTM-ссылок для runway (email, kiosk, соцсети).
 */

export type RunwayShareUtmSource = 'email' | 'social' | 'kiosk' | 'qr';

export interface RunwayShareLinkOptions {
  productSlug: string;
  sectionIndex?: number;
  origin?: string;
  /** UTM для email-кампаний и аналитики. */
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
  };
  /** Доп. query-параметры (например demo=1). */
  extraParams?: Record<string, string>;
}

/** Базовый PDP deep link на runway-секцию. */
export function buildRunwayShareLink(options: RunwayShareLinkOptions): string {
  const base = options.origin ?? (typeof window !== 'undefined' ? window.location.origin : '');
  const url = new URL(`/products/${options.productSlug}`, base);
  url.searchParams.set('view', 'runway');
  const section = options.sectionIndex ?? 0;
  if (section > 0) url.searchParams.set('section', String(section));

  const utm = options.utm;
  if (utm?.source) url.searchParams.set('utm_source', utm.source);
  if (utm?.medium) url.searchParams.set('utm_medium', utm.medium);
  if (utm?.campaign) url.searchParams.set('utm_campaign', utm.campaign);
  if (utm?.content) url.searchParams.set('utm_content', utm.content);

  if (options.extraParams) {
    for (const [key, value] of Object.entries(options.extraParams)) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

/** Шаблон UTM для email-кампаний (newsletter / CRM). */
export function buildRunwayEmailCampaignLink(
  productSlug: string,
  sectionIndex: number,
  campaign = 'runway-newsletter',
  origin?: string
): string {
  return buildRunwayShareLink({
    productSlug,
    sectionIndex,
    origin,
    utm: {
      source: 'email',
      medium: 'newsletter',
      campaign,
      content: `section-${sectionIndex}`,
    },
  });
}

/** Plain-text блок для вставки в письмо. */
export function formatRunwayEmailCampaignSnippet(productName: string, url: string): string {
  return `${productName} — интерактивная Runway-витрина\n${url}`;
}
