/**
 * Inventory adapters — separate feat ids per ADR §19.8 (do not mix APIs in one column).
 */
import type { IntegrationPlatform } from './integration-platform';

export type MatrixInventoryCell = {
  sku: string;
  ats: number;
  preBook?: number;
  openToSell?: number;
  sourcePlatform: IntegrationPlatform;
  availableDate?: string;
};

const DEMO_NUORDER: MatrixInventoryCell[] = [
  { sku: 'SS27-M-COAT-01', ats: 480, preBook: 120, sourcePlatform: 'nuorder' },
  { sku: 'SS27-W-DRS-02', ats: 320, preBook: 80, sourcePlatform: 'nuorder' },
];

const DEMO_JOOR: MatrixInventoryCell[] = [
  { sku: 'SS27-M-COAT-01', ats: 450, sourcePlatform: 'joor', availableDate: '2026-08-01' },
  { sku: 'SS27-W-DRS-02', ats: 290, sourcePlatform: 'joor', availableDate: '2026-08-15' },
];

const DEMO_AM: MatrixInventoryCell[] = [
  { sku: 'SS27-M-COAT-01', ats: 200, sourcePlatform: 'apparel_magic' },
  { sku: 'SS27-W-DRS-02', ats: 150, sourcePlatform: 'apparel_magic' },
];

const DEMO_ZEDONK: MatrixInventoryCell[] = [
  { sku: 'SS27-M-COAT-01', ats: 220, sourcePlatform: 'zedonk', availableDate: '2026-07-20' },
  { sku: 'SS27-W-DRS-02', ats: 165, sourcePlatform: 'zedonk', availableDate: '2026-07-25' },
];

const DEMO_AIMS: MatrixInventoryCell[] = [
  { sku: 'SS27-M-COAT-01', ats: 100, openToSell: 580, sourcePlatform: 'aims360' },
  { sku: 'SS27-W-DRS-02', ats: 80, openToSell: 370, sourcePlatform: 'aims360' },
];

export function getMatrixInventoryForPlatform(
  platform: IntegrationPlatform,
  skuFilter?: string
): MatrixInventoryCell[] {
  let rows: MatrixInventoryCell[];
  switch (platform) {
    case 'nuorder':
      rows = DEMO_NUORDER;
      break;
    case 'joor':
      rows = DEMO_JOOR;
      break;
    case 'apparel_magic':
      rows = DEMO_AM;
      break;
    case 'zedonk':
      rows = DEMO_ZEDONK;
      break;
    case 'aims360':
      rows = DEMO_AIMS;
      break;
    default:
      rows = [];
  }
  if (skuFilter) {
    return rows.filter((r) => r.sku === skuFilter);
  }
  return rows;
}
