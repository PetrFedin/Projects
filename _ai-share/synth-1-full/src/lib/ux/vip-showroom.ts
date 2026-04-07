/**
 * Le New Black: Le Privé / VIP-шоурум — приватный showroom с отдельным URL.
 * Токен/slug в URL — доступ только по приглашению.
 */

export interface VipShowroom {
  id: string;
  slug: string;
  /** Уникальный URL: /s/privé/{slug} */
  token: string;
  name: string;
  brandId: string;
  brandName: string;
  /** Описание приватного шоурума */
  description?: string;
  /** productIds в подборке */
  productIds: string[];
  /** Действует до (ISO) */
  validUntil: string;
  /** Пароль (опционально) */
  password?: string;
  active: boolean;
}

const DEMO_VIP_SHOWROOMS: VipShowroom[] = [
  {
    id: 'vip1',
    slug: 'syntha-fw26-elite',
    token: 'syntha-fw26-elite',
    name: 'Syntha FW26 — Elite',
    brandId: 'syntha',
    brandName: 'Syntha',
    description: 'Приватный превью коллекции FW26 для ключевых партнёров',
    productIds: ['p1', 'p2', 'p3', 'p4', 'p5'],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    active: true,
  },
];

export function getVipShowroomBySlug(slug: string): VipShowroom | null {
  const now = new Date().toISOString();
  const room = DEMO_VIP_SHOWROOMS.find((r) => r.slug === slug && r.active && r.validUntil > now);
  return room ?? null;
}
