import { z } from 'zod';

export const orderOperationalNotePatchBodySchema = z.object({
  note: z.string().min(1).max(2000),
});

export const orderOperationalNoteSuccessSchema = z.object({
  ok: z.literal(true),
  data: z.object({
    /** Совпадает с полем `order` в B2BOrder (demo wholesale id). */
    wholesaleOrderId: z.string(),
    note: z.string(),
    updatedAt: z.string(),
  }),
  meta: z.object({
    requestId: z.string(),
    mode: z.enum(['demo', 'prod']),
    apiVersion: z.literal('v1'),
    idempotentReplay: z.boolean().optional(),
  }),
});
