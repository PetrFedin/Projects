import type { SupplierProcurementBomLine } from '@/lib/platform-core-pillar-snapshot.types';
import { getAttributeById } from '@/lib/production/attribute-catalog';

export type BrandSupplierBomLineRow = {
  lineId: string;
  materialName: string;
  qty: number;
  unit: string;
  supplierHint?: string;
  filled: boolean;
};

export function mapSupplierProcurementBomLines(
  lines: readonly SupplierProcurementBomLine[]
): BrandSupplierBomLineRow[] {
  return lines.map((line, index) => {
    const qty = line.quantity ?? line.consumption ?? 0;
    const materialName = line.materialName?.trim() || 'Material';
    return {
      lineId: `bom-${index}`,
      materialName,
      qty,
      unit: line.unit?.trim() || 'm',
      supplierHint: undefined,
      filled: Boolean(materialName && qty > 0),
    };
  });
}

export function summarizeBrandSupplierBomLines(rows: BrandSupplierBomLineRow[]): {
  total: number;
  filled: number;
} {
  const filled = rows.filter((r) => r.filled).length;
  return { total: rows.length, filled };
}

export function brandSupplierBomLineLabel(materialName: string): string {
  return getAttributeById('mainFabric')?.name ?? materialName;
}
