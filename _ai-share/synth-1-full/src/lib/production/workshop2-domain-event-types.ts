/**
 * Cross-module domain events Workshop2 → calendar, chat, B2B, notifications.
 */
export const WORKSHOP2_DOMAIN_EVENT_TYPES = [
  'dossier.gate_blocked',
  'dossier.gate_passed',
  'showroom.published',
  'change_request.approved',
  'sample_order.status_changed',
  'supply.cut_ticket.created',
  'supply.fabric_roll.created',
  'supply.garment_dye.created',
  'qc.mes_defect.ingested',
  'b2b.marketplace_order.received',
  'b2b.order.status_changed',
  'fit.comment.added',
  'supply.vendor_bid.received',
  'supply.material_request.updated',
  'qc.inspector_report.saved',
] as const;

export type Workshop2DomainEventType = (typeof WORKSHOP2_DOMAIN_EVENT_TYPES)[number];

export type Workshop2DomainEventEnvelope = {
  id: string;
  type: Workshop2DomainEventType;
  collectionId: string;
  articleId: string;
  payload: Record<string, unknown>;
  createdAt: string;
  organizationId?: string;
};

export function isWorkshop2DomainEventType(value: string): value is Workshop2DomainEventType {
  return (WORKSHOP2_DOMAIN_EVENT_TYPES as readonly string[]).includes(value);
}

/** contextId для contextual chat workspace: collectionId:articleId */
export function workshop2ArticleContextId(collectionId: string, articleId: string): string {
  return `${collectionId.trim()}:${articleId.trim()}`;
}

export const WORKSHOP2_ARTICLE_CONTEXT_TYPE = 'workshop2_article';
