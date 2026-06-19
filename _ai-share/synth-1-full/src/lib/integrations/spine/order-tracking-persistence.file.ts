/**
 * Wave D2 · F-TRACKING — shipment / tracking mirror (Zedonk, NuOrder, Syntha).
 */
import 'server-only';

import fs from 'fs';
import path from 'path';

export type OrderTrackingShipment = {
  wholesaleOrderId: string;
  platform: 'zedonk' | 'nuorder' | 'syntha' | 'joor';
  trackingNumber?: string;
  carrier?: string;
  status?: string;
  shippedAt?: string;
  estimatedDelivery?: string;
  updatedAt: string;
};

export type OrderTrackingFileV1 = {
  schemaVersion: 1;
  byWholesaleOrderId: Record<string, OrderTrackingShipment>;
};

const EMPTY: OrderTrackingFileV1 = { schemaVersion: 1, byWholesaleOrderId: {} };

export function orderTrackingFilePath(): string {
  const fromEnv = process.env.B2B_ORDER_TRACKING_FILE?.trim();
  if (fromEnv) return fromEnv;
  return path.join(process.cwd(), 'data', 'b2b-order-tracking.json');
}

function load(): OrderTrackingFileV1 {
  try {
    const raw = fs.readFileSync(orderTrackingFilePath(), 'utf8');
    const j = JSON.parse(raw) as OrderTrackingFileV1;
    if (j?.schemaVersion !== 1) return { ...EMPTY };
    return { schemaVersion: 1, byWholesaleOrderId: j.byWholesaleOrderId ?? {} };
  } catch {
    return { ...EMPTY };
  }
}

function save(data: OrderTrackingFileV1): void {
  const p = orderTrackingFilePath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
  void import('./spine-operational-persistence.pg')
    .then((m) => m.mirrorOrderTrackingSnapshotToPg(data))
    .catch(() => {});
}

export function upsertOrderTracking(shipment: OrderTrackingShipment): OrderTrackingShipment {
  const data = load();
  data.byWholesaleOrderId[shipment.wholesaleOrderId] = shipment;
  save(data);
  return shipment;
}

export function getOrderTracking(wholesaleOrderId: string): OrderTrackingShipment | undefined {
  return load().byWholesaleOrderId[wholesaleOrderId.trim()];
}

export function listOrderTrackingShipments(): OrderTrackingShipment[] {
  return Object.values(load().byWholesaleOrderId);
}
