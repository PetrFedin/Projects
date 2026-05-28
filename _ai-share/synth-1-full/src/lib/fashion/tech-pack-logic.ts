import type { Product } from '@/lib/types';
import type { TechPackV1 } from './types';
import { extractFabricSpec } from './fabric-spec';
import { getAllSizeMeasurements } from './garment-measurements';
import { resolveCareSymbolIds } from './care-symbols';
import { compositionToPlainText, parseComposition } from './parse-composition';
import { extractProductIdentifiers } from './product-identifiers';

export function buildTechPack(product: Product): TechPackV1 {
  const compText = compositionToPlainText(parseComposition(product));
  const careIds = resolveCareSymbolIds(product);
  const measurements = getAllSizeMeasurements(product);
  const fabricSpec = extractFabricSpec(product);
  const identifiers = extractProductIdentifiers(product);
  const byKey = Object.fromEntries(identifiers.map((f) => [f.key, f.value])) as Record<
    string,
    string
  >;

  return {
    sku: product.sku,
    name: product.name,
    composition: compText,
    careSymbols: careIds,
    measurements,
    fabricSpec,
    productIdentifiers: {
      ean: byKey.ean,
      upc: byKey.upc,
      gtin: byKey.gtin,
    },
  };
}

export function techPackToJson(techPack: TechPackV1): string {
  return JSON.stringify(techPack, null, 2);
}
