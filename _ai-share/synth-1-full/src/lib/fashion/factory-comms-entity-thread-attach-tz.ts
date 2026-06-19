import type { ManufacturerCommsEntityThreadKind } from '@/lib/fashion/manufacturer-comms-entity-threads';
import type { SupplierCommsEntityThreadKind } from '@/lib/fashion/supplier-comms-entity-threads';

export type FactoryCommsEntityThreadKind =
  | ManufacturerCommsEntityThreadKind
  | SupplierCommsEntityThreadKind;

export function factoryCommsEntityThreadAttachTzMessage(input: {
  variant: 'manufacturer' | 'supplier';
  threadKind: FactoryCommsEntityThreadKind;
  collectionId: string;
  articleId: string;
  dossierHref: string;
}): string {
  const label =
    input.threadKind === 'bom'
      ? 'BOM · material'
      : input.threadKind === 'dossier'
        ? 'Shop-floor dossier'
        : input.threadKind === 'sample'
          ? 'Sample queue'
          : input.threadKind;
  const roleRu = input.variant === 'manufacturer' ? 'цех' : 'поставщик';
  return `TZ из dossier прикреплён к thread «${label}» (${roleRu}) · ${input.collectionId}:${input.articleId}`;
}

export function manufacturerCommsEntityThreadSupportsAttachTz(
  kind: ManufacturerCommsEntityThreadKind
): boolean {
  return kind === 'dossier' || kind === 'sample';
}

export function supplierCommsEntityThreadSupportsAttachTz(
  kind: SupplierCommsEntityThreadKind
): boolean {
  return kind === 'bom';
}
