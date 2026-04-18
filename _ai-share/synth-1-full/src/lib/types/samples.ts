/**
 * Sample Tracking & PR Control Types
 */

export type SampleStatus =
  | 'in_stock'
  | 'with_stylist'
  | 'in_editorial'
  | 'in_transit'
  | 'damaged'
  | 'lost'
  | 'archived';

export interface CollectionSample {
  id: string;
  productId: string;
  sku: string;
  name: string;
  /** Внутренний артикул (например 6 знаков Цеха 2) — попадает в payload бирки. */
  internalArticleCode?: string;
  size: string;
  color: string;
  qrCode: string;
  rfidTag?: string;
  status: SampleStatus;
  currentLocation: string; // "Showroom", "Vogue HQ", "Ivan Ivanov (Stylist)"
  condition: 'perfect' | 'good' | 'worn' | 'damaged';
  lastSeenAt: string;
  expectedReturnAt?: string;
  history: SampleMovement[];
}

export interface SampleMovement {
  id: string;
  sampleId: string;
  fromLocation: string;
  toLocation: string;
  movedAt: string;
  movedBy: string;
  note?: string;
  statusAfter: SampleStatus;
}

export interface SampleRequest {
  id: string;
  requesterName: string;
  requesterOrg: string;
  requestDate: string;
  items: string[]; // Sample IDs
  startDate: string;
  endDate: string;
  purpose: 'editorial' | 'celebrity' | 'influencer' | 'e-comm_shoot' | 'fitting';
  status: 'pending' | 'approved' | 'shipped' | 'returned' | 'cancelled';
}
