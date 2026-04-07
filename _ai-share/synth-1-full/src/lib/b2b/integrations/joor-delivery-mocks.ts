/**
 * Статические окна доставки (drop) для UI до подключения JOOR/NuOrder API.
 */

export interface JoorDeliveryWindow {
  id: string;
  label: string;
  startShipDate: string;
  completeShipDate: string;
  cancelDate?: string;
}

const MOCK_WINDOWS: JoorDeliveryWindow[] = [
  {
    id: 'fw26-drop1',
    label: 'FW26 — дроп 1',
    startShipDate: '2026-08-01',
    completeShipDate: '2026-08-15',
    cancelDate: '2026-07-25',
  },
  {
    id: 'fw26-drop2',
    label: 'FW26 — дроп 2',
    startShipDate: '2026-09-01',
    completeShipDate: '2026-09-20',
    cancelDate: '2026-08-28',
  },
];

export function joorGetDeliveryWindows(): JoorDeliveryWindow[] {
  return MOCK_WINDOWS;
}

/** NuOrder / Excel Working Order — пока выключено в мок-режиме. */
export function isNuOrderConfigured(): boolean {
  return false;
}
