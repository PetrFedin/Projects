/**
 * Общая фильтрация списка B2B-заказов для operational UI (бренд / ритейлер).
 * Используется и клиентским read-model (сид), и серверным (снимок из файла).
 */
import { isDemoBrandName } from '@/lib/data/demo-platform-brands';
import type { B2BOrder } from '@/lib/types';
import type { PlatformRole } from '@/lib/rbac';

export function filterB2BOrdersByOperationalActor(
  orders: B2BOrder[],
  options?: {
    actorRole?: PlatformRole | null;
    /** Зарезервировано: фильтр по tenant/организации при появлении полей в {@link B2BOrder} */
    actorId?: string;
  }
): B2BOrder[] {
  if (!options?.actorRole) return orders;

  if (options.actorRole === 'brand') {
    return orders.filter((o) => isDemoBrandName(o.brand));
  }

  if (options.actorRole === 'retailer' || options.actorRole === 'buyer') {
    return orders.filter((o) => o.shop.startsWith('Демо-магазин'));
  }

  return orders;
}
