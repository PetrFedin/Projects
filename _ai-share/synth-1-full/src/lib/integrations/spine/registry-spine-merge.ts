/**
 * Клиентский merge W2/PG реестра с operational v1 INT-* (file persistence — SoT).
 */
import { isIntegrationImportedWholesaleOrderId } from './integration-ui-utils';

/** INT-* из W2 заменяются строкой из spine overlay; orphan INT-* в W2 отбрасываются. */
export function mergeRegistryRowsWithSpineOverlay<T>(
  nativeRows: T[],
  importedRows: T[],
  getId: (row: T) => string
): T[] {
  const importedById = new Map(importedRows.map((r) => [getId(r), r]));
  const out: T[] = [];
  const seen = new Set<string>();

  for (const native of nativeRows) {
    const id = getId(native);
    if (isIntegrationImportedWholesaleOrderId(id)) {
      const spine = importedById.get(id);
      if (spine) {
        out.push(spine);
        seen.add(id);
      }
      continue;
    }
    out.push(native);
    seen.add(id);
  }

  for (const imp of importedRows) {
    const id = getId(imp);
    if (!seen.has(id)) {
      out.push(imp);
      seen.add(id);
    }
  }

  return out;
}
