/**
 * Wave 29: встречи rep из B2B-заказов (PG/file) — без MOCK_APPOINTMENTS.
 */
import type { Workshop2B2bOrderRecord } from '@/lib/production/workshop2-b2b-order-lifecycle';

export type Workshop2RepAppointment = {
  id: string;
  retailer: string;
  date: string;
  type: 'showroom' | 'video' | 'delivery';
  status: 'confirmed' | 'pending';
  orderId: string;
  href?: string;
};

function formatRuDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Производные встречи из заказов с delivery/rep attribution. */
export function buildWorkshop2RepAppointmentsFromOrders(
  orders: Workshop2B2bOrderRecord[],
  repId?: string
): Workshop2RepAppointment[] {
  const filtered = repId ? orders.filter((o) => o.repId === repId || !o.repId) : orders;
  return filtered
    .filter((o) => o.status !== 'cancelled')
    .slice(0, 12)
    .map((o) => {
      const when = o.requestedDeliveryDate ?? o.updatedAt ?? o.createdAt;
      const confirmed =
        o.status === 'confirmed' || o.status === 'allocated' || o.status === 'shipped';
      return {
        id: `rep-appt-${o.id}`,
        retailer: o.buyerId ? `Байер ${o.buyerId}` : `Заказ ${o.id}`,
        date: formatRuDateTime(when),
        type: o.repId ? 'showroom' : 'delivery',
        status: confirmed ? 'confirmed' : 'pending',
        orderId: o.id,
        href: `/shop/b2b/orders/${encodeURIComponent(o.id)}`,
      };
    });
}
