import { z } from 'zod';

const paymentStatusZ = z.enum(['pending', 'partial', 'paid', 'overdue', 'cancelled']);

export const operationalOrderListRowDtoSchema = z.object({
  wholesaleOrderId: z.string().min(1),
  status: z.string(),
  shop: z.string(),
  brand: z.string(),
  amount: z.string(),
  date: z.string(),
  deliveryDate: z.string(),
  orderMode: z.enum(['buy_now', 'reorder', 'pre_order']).optional(),
  eventId: z.string().optional(),
  passportSlotId: z.string().optional(),
  priceTier: z.enum(['retail_a', 'retail_b', 'outlet']).optional(),
  territory: z.string().optional(),
  creditLimit: z.number().optional(),
  paymentStatus: paymentStatusZ.optional(),
  paidAmount: z.number().optional(),
});

export const operationalOrderDetailDtoSchema = operationalOrderListRowDtoSchema.extend({
  items: z.array(z.any()), // Для demo пока any, позже уточним по B2BOrderLineItem
  orderNotes: z.string().optional(),
  internalNotes: z.string().optional(),
});

const apiMetaV1Schema = z.object({
  requestId: z.string(),
  mode: z.enum(['demo', 'prod']),
  apiVersion: z.literal('v1'),
});

export const operationalOrdersV1ListSuccessSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    orders: z.array(operationalOrderListRowDtoSchema),
  }),
  meta: apiMetaV1Schema,
});

export const operationalOrderV1DetailSuccessSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    order: operationalOrderDetailDtoSchema,
  }),
  meta: apiMetaV1Schema,
});

export function parseOperationalOrdersV1ListResponse(raw: unknown) {
  return operationalOrdersV1ListSuccessSchema.safeParse(raw);
}

export function parseOperationalOrderV1DetailResponse(raw: unknown) {
  return operationalOrderV1DetailSuccessSchema.safeParse(raw);
}
