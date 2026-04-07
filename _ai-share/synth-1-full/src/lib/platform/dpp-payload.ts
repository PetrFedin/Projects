import type { Product } from '@/lib/types';
import type { DigitalProductPassportPayload } from './types';

/** Локальная сборка DPP; при API заменить на fetch по productId. */
export function buildLocalDppPayload(product: Product): DigitalProductPassportPayload {
  const pid = String(product.id);
  return {
    passportId: `DPP-${pid.padStart(6, '0')}-SYN-26`,
    productId: pid,
    productName: product.name,
    brand: product.brand,
    sustainabilityScore: 88,
    sustainabilityBlurb:
      'Этот товар входит в топ 5% самых экологичных в своей категории. Использование переработанных материалов и возобновляемой энергии снизило Carbon Footprint на 42%.',
    batchLabel: 'LOT-2026-03-A · 1 240 шт.',
    dyeBatchLabel: 'DYE-BATCH-884 · RAL 9005',
    fabricCertLine: 'GOTS scope cert №CU-987654 · PDF',
    supplyChain: [
      { stage: 'Сырье', location: 'Турция, Измир', detail: 'Органический хлопок (GOTS)', status: 'completed' },
      { stage: 'Прядение', location: 'Италия, Прато', detail: 'Энергоэффективное производство', status: 'completed' },
      { stage: 'Пошив', location: 'Россия, Иваново', detail: 'Syntha Partner Factory #12', status: 'completed' },
      { stage: 'Логистика', location: 'Москва, Склад Syntha', detail: 'Углеродно-нейтральная доставка', status: 'completed' },
    ],
    materials: [
      { name: 'Organic Cotton', percentage: 95, description: 'Выращено без пестицидов' },
      { name: 'Recycled Elastane', percentage: 5, description: 'Переработанные полимеры' },
    ],
    certificates: [
      { name: 'GOTS Certified', description: 'Global Organic Textile Standard', tone: 'emerald' },
      { name: 'Fair Trade', description: 'Справедливая оплата труда', tone: 'blue' },
      { name: 'Syntha Eco-Verified', description: 'Внутренний стандарт платформы', tone: 'indigo' },
    ],
  };
}
