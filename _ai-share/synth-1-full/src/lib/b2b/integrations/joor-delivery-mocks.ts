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

/**
 * Ранее использовалось для показа карточки «Экспорт в NuOrder» на `/shop/b2b/create-order`.
 * Маршрут `POST /api/b2b/export-order` принимает только `provider: platform`; NuOrder/JOOR — archive.
 * Экспорт в контур платформы — `ShopB2bPlatformExportCard` (тот же endpoint).
 */
export function isNuOrderConfigured(): boolean {
  return false;
}
