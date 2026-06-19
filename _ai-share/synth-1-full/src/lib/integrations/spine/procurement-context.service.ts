/**
 * Wave D3 · procurement context by wholesaleOrderId (supplier · pillar 4).
 */
import 'server-only';

import { PLATFORM_CORE_DEMO } from '@/lib/platform-core-demo-context';
import { getCentricRfqByOrderId } from './centric-rfq-persistence.file';
import { getVendorPoByOrderId } from './vendor-po-persistence.file';
import { getDeliveryWindow } from './delivery-window-persistence.file';
import { getImportedOrderRecord } from './imported-orders-persistence';
import { getOperationalImportChainStatus } from './operational-import-handoff.service';
import { isIntegrationImportedWholesaleOrderId } from './integration-ui-utils';
import {
  ensureSpineOperationalStoreReady,
  SPINE_PROCUREMENT_SCOPES,
} from './spine-operational-store';

export type SpineProcurementContext = {
  b2bOrderId: string;
  isSpineImported: boolean;
  poId?: string;
  collectionId?: string;
  articleId?: string;
  centricRfq?: ReturnType<typeof getCentricRfqByOrderId>;
  vendorPo?: ReturnType<typeof getVendorPoByOrderId>;
  deliveryLabel?: string;
  chainHandedOff?: boolean;
  chainMaterialsSupplied?: boolean;
};

export async function getSpineProcurementContext(
  b2bOrderId: string
): Promise<SpineProcurementContext | null> {
  const id = b2bOrderId.trim();
  if (!id) return null;

  await ensureSpineOperationalStoreReady(SPINE_PROCUREMENT_SCOPES);

  const imported = getImportedOrderRecord(id);
  const isSpine = isIntegrationImportedWholesaleOrderId(id);
  const rfq = getCentricRfqByOrderId(id);
  const vendorPo = getVendorPoByOrderId(id);
  const delivery = getDeliveryWindow(id);

  let chainHandedOff: boolean | undefined;
  let chainMaterialsSupplied: boolean | undefined;
  let poId: string | undefined;
  let articleId: string | undefined;

  if (isSpine) {
    const chain = await getOperationalImportChainStatus(id);
    chainHandedOff = chain?.handedOff === true;
    chainMaterialsSupplied = chain?.materialsSupplied === true;
    poId = chain?.productionOrderId;
    articleId = chain?.articleId;
  }

  return {
    b2bOrderId: id,
    isSpineImported: isSpine,
    poId,
    collectionId: rfq?.collectionId ?? (isSpine ? PLATFORM_CORE_DEMO.collectionId : undefined),
    articleId: articleId ?? rfq?.articleId,
    centricRfq: rfq,
    vendorPo,
    deliveryLabel: delivery?.label ?? imported?.order.deliveryDate,
    chainHandedOff,
    chainMaterialsSupplied,
  };
}
