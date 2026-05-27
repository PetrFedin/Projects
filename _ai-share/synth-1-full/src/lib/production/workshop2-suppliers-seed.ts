/**
 * Справочник поставщиков W2 (data/workshop2/suppliers.seed.json).
 */

import suppliersSeed from '../../../data/workshop2/suppliers.seed.json';

export type Workshop2SupplierRow = {
  id: string;
  label: string;
  region?: string;
  roles?: string[];
  capabilities?: string[];
  leadTimeDays?: number;
};

export function getWorkshop2SuppliersSeed(): Workshop2SupplierRow[] {
  return suppliersSeed.suppliers ?? [];
}
