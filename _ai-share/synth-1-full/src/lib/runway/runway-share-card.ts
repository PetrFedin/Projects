import type { Product, ProductScrollSwitcherSection } from '@/lib/types';
import { resolveSectionPrice, resolveSectionThumbImage } from '@/lib/product-scroll-switcher';
import { t } from '@/lib/runway/runway-i18n';

export interface RunwayShareCardViewModel {
  productName: string;
  productSlug: string;
  brand?: string;
  sectionIndex: number;
  sectionLabel: string;
  sectionId: string;
  price: number;
  priceFormatted: string;
  thumbUrl?: string;
  shareUrl: string;
  headline: string;
  description: string;
}

function formatPrice(value: number): string {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

/** VM для rich preview при шаринге runway. */
export function buildRunwayShareCardViewModel(
  product: Product,
  section: ProductScrollSwitcherSection,
  sectionIndex: number,
  shareUrl: string
): RunwayShareCardViewModel {
  const price = resolveSectionPrice(product, section);
  const thumbUrl =
    resolveSectionThumbImage(product, section, sectionIndex) ?? product.images[0]?.url;

  return {
    productName: product.name,
    productSlug: product.slug,
    brand: product.brand,
    sectionIndex,
    sectionLabel: section.label,
    sectionId: section.id,
    price,
    priceFormatted: formatPrice(price),
    thumbUrl,
    shareUrl,
    headline: `${product.name} · ${section.label}`,
    description: t('runway.shareDescription', {
      price: formatPrice(price),
      n: sectionIndex + 1,
    }),
  };
}

/** Plain-text для clipboard / Web Share без files. */
export function formatRunwayShareCardPlainText(vm: RunwayShareCardViewModel): string {
  return `${vm.headline}\n${vm.priceFormatted}\n${vm.shareUrl}`;
}
