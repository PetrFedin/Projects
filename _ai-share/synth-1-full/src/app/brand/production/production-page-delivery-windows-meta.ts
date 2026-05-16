import type { B2BDeliveryWindow } from '@/lib/order/b2b-order-payload';

export type DeliveryWindowWithMeta = B2BDeliveryWindow & {
  start: Date;
  complete: Date;
  cancel?: Date;
  daysToStart: number;
  daysToCancel?: number;
  isPast: boolean;
  isActive: boolean;
  isUpcoming: boolean;
};

/** Окна поставки с вычисленными датами и флагами для UI этажа. */
export function buildDeliveryWindowsWithMeta(
  windows: readonly B2BDeliveryWindow[],
  todayStart: Date
): DeliveryWindowWithMeta[] {
  return windows.map((w) => {
    const start = new Date(w.startShipDate);
    const complete = new Date(w.completeShipDate);
    const cancel = w.cancelDate ? new Date(w.cancelDate) : undefined;
    const daysToStart = Math.round((start.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));
    const daysToCancel = cancel
      ? Math.round((cancel.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24))
      : undefined;
    const isPast = complete.getTime() < todayStart.getTime();
    const isActive = !isPast && start.getTime() <= todayStart.getTime();
    const isUpcoming = !isPast && start.getTime() > todayStart.getTime();
    return {
      ...w,
      start,
      complete,
      cancel,
      daysToStart,
      daysToCancel,
      isPast,
      isActive,
      isUpcoming,
    };
  });
}
