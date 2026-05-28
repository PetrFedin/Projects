import { z } from 'zod';

/** Тело POST расчёта прайсинга заказа (B2B pricing helper). */
export const b2bPricingLineSchema = z.object({
  sku: z.string().optional(),
  qty: z.number().nonnegative(),
  unitPrice: z.number().nonnegative(),
});

export const B2bPricingBodySchema = z.object({
  lines: z.array(b2bPricingLineSchema),
});

export type B2bPricingBody = z.infer<typeof B2bPricingBodySchema>;

/** Тело POST `/api/b2b/export-order` для provider `platform`. */
export const b2bPlatformExportPayloadSchema = z.object({
  orderId: z.string().min(1),
});

export type B2bPlatformExportPayload = z.infer<typeof b2bPlatformExportPayloadSchema>;
