import { z } from 'zod';

/**
 * Минимальная строка списка / карточки B2B в operational API (расширения через `.passthrough()`).
 * Сужает контракт до полей, которые реально нужны спискам; остальное — JOOR/NuORDER поля.
 */
export const b2bOperationalOrderRowSchema = z
  .object({
    order: z.string(),
    status: z.string(),
    shop: z.string(),
    brand: z.string(),
    amount: z.string(),
    date: z.string(),
    deliveryDate: z.string(),
    orderMode: z.enum(['buy_now', 'reorder', 'pre_order']).optional(),
    paymentStatus: z.enum(['pending', 'partial', 'paid', 'overdue', 'cancelled']).optional(),
    paidAmount: z.number().optional(),
  })
  .passthrough();

export type B2BOperationalOrderRow = z.infer<typeof b2bOperationalOrderRowSchema>;

const apiMetaSchema = z
  .object({
    requestId: z.string(),
    mode: z.enum(['demo', 'prod']),
  })
  .passthrough();

export const operationalOrdersListSuccessSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    orders: z.array(b2bOperationalOrderRowSchema),
  }),
  meta: apiMetaSchema,
});

export const operationalOrderDetailSuccessSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    order: b2bOperationalOrderRowSchema,
  }),
  meta: apiMetaSchema,
});

export const operationalOrderErrorEnvelopeSchema = z.object({
  ok: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
  meta: apiMetaSchema,
});

export function parseOperationalOrdersListResponse(raw: unknown) {
  return operationalOrdersListSuccessSchema.safeParse(raw);
}

export function parseOperationalOrderDetailResponse(raw: unknown) {
  return operationalOrderDetailSuccessSchema.safeParse(raw);
}

export function parseOperationalOrderErrorEnvelope(raw: unknown) {
  return operationalOrderErrorEnvelopeSchema.safeParse(raw);
}
