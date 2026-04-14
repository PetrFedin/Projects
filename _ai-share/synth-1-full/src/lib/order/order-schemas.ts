import { z } from 'zod';

/**
 * [Phase 2 — Order architecture]
 * Zod-схемы для валидации данных заказа в рантайме.
 */

export const B2BOrderModeSchema = z.enum(['buy_now', 'reorder', 'pre_order']);

export const OrderCommercialStatusSchema = z.enum([
  'draft',
  'pending_approval',
  'negotiation',
  'confirmed',
  'partially_shipped',
  'shipped',
  'delivered',
  'cancelled',
  'disputed',
]);

export const OrderPaymentStatusSchema = z.enum([
  'pending',
  'partial',
  'paid',
  'overdue',
  'refunded',
  'escrow_held',
  'escrow_released',
]);

export const OrderFulfillmentStatusSchema = z.enum([
  'not_started',
  'picking',
  'packed',
  'ready_for_shipment',
  'shipped',
  'partially_shipped',
  'in_transit',
  'delivered',
]);

export const B2BOrderLineItemSchema = z.object({
  productId: z.string().min(1),
  size: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
  currency: z.string().optional(),
  deliveryDate: z.string().datetime().optional(),
  deliveryWindowId: z.string().optional(),
  lineNotes: z.string().optional(),
  lineStatus: z.enum(['open', 'cancelled', 'replaced']).optional(),
  replacedByProductId: z.string().optional(),
  brandSize: z.string().optional(),
  retailerSize: z.string().optional(),
  tryBeforeBuy: z.boolean().optional(),
});

export const OrderAggregateSchema = z.object({
  id: z.string().min(1),
  participants: z.object({
    brandId: z.string().min(1),
    buyerAccountId: z.string().min(1),
    distributorId: z.string().optional(),
    retailerLocationId: z.string().optional(),
    originLocationId: z.string().optional(),
    tenantId: z.string().optional(), // [Phase 2 Prod] ID арендатора для изоляции
  }),
  status: OrderCommercialStatusSchema,
  projections: z.object({
    payment: OrderPaymentStatusSchema,
    fulfillment: OrderFulfillmentStatusSchema,
    dispute: z.enum(['none', 'open', 'resolved']).optional(),
    sync: z.enum(['pending', 'synced', 'failed']).optional(),
    /** [Phase 2 Prod] Финансовый след (для мультивалютных расчетов) */
    financialImpact: z.object({
      totalAmountBase: z.number(),
      exchangeRate: z.number(),
      currency: z.string(),
      taxAmount: z.number(),
      discountAmount: z.number(),
      refundAmount: z.number().optional(),
    }).optional(),
  }),
  mode: B2BOrderModeSchema,
  terms: z.object({
    currency: z.string().default('RUB'),
    priceTier: z.string().optional(),
    priceListId: z.string().optional(),
    discountPercent: z.number().min(0).max(100).optional(),
    paymentTerms: z.string().optional(),
    /** [Phase 2 Prod] Налоговая ставка (VAT/GST) */
    taxRate: z.number().min(0).optional(),
    /** [Phase 2 Prod] Юрисдикция налогообложения (напр. 'RU', 'EU', 'US') */
    taxJurisdiction: z.string().optional(),
    /** [Phase 2 Prod] Курс обмена (к базовой валюте) */
    exchangeRate: z.number().positive().optional(),
  }),
  lines: z.array(B2BOrderLineItemSchema).min(1),
  context: z.object({
    seasonId: z.string().optional(),
    linesheetId: z.string().optional(),
    shipWindowId: z.string().optional(),
    agreementId: z.string().optional(), // [Phase 2 Prod] Ссылка на VMI-соглашение
    eventId: z.string().optional(),
    passportSlotId: z.string().optional(),
  }),
  metadata: z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    version: z.number().int().nonnegative(),
    source: z.enum(['web_ui', 'api', 'excel_import', 'mobile_app']),
    /** [Phase 2 Prod] Снапшоты аудита для версионирования */
    auditLog: z.array(z.object({
      version: z.number().int(),
      timestamp: z.string().datetime(),
      actorId: z.string(),
      action: z.string(),
      changes: z.record(z.any()),
      /** [Phase 2 Prod] Ссылка на правку (Amendment) */
      amendmentId: z.string().optional(),
      /** [Phase 2 Prod] Дифф изменений для UI */
      diff: z.record(z.any()).optional(),
    })).optional(),
    /** [Phase 3] Многосторонние контрольные ворота (Multi-party Gates) */
    gates: z.array(z.object({
      id: z.string(),
      label: z.string(),
      status: z.enum(['pending', 'approved', 'rejected']),
      role: z.enum(['brand', 'shop', 'factory', 'logistics']),
      required: z.boolean(),
      actorId: z.string().optional(),
      timestamp: z.string().datetime().optional(),
      reason: z.string().optional(),
    })).optional(),
  }),
  notes: z.object({
    orderNotes: z.string().optional(),
    internalNotes: z.string().optional(),
  }),
});

export type OrderAggregateInput = z.input<typeof OrderAggregateSchema>;
export type OrderAggregateOutput = z.output<typeof OrderAggregateSchema>;
