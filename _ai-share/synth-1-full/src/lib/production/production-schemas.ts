import { z } from 'zod';

/**
 * [Phase 2 — Production architecture]
 * Zod-схемы производственного контура.
 */

export const ProductionCommitmentTypeSchema = z.enum([
  'bulk_production',
  'sample_proto',
  'sample_sms',
  'sample_gold',
  'material_po',
]);

export const ProductionStatusSchema = z.enum([
  'planned',
  'material_wait',
  'in_work',
  'qc_pending',
  'qc_failed',
  'completed',
  'shipped',
  'cancelled',
]);

export const QCGateSchema = z.object({
  id: z.string(),
  inspectorId: z.string(),
  passed: z.boolean(),
  defectsCount: z.number().int().nonnegative().default(0),
  notes: z.string().optional(),
  checkedAt: z.string(),
  attachments: z.array(z.string()).optional(),
});

export const ProductionCommitmentSchema = z.object({
  id: z.string().min(1),
  type: ProductionCommitmentTypeSchema,
  status: ProductionStatusSchema,
  articleId: z.string().min(1),
  factoryId: z.string().min(1),
  wholesaleOrderIds: z.array(z.string()).optional(),
  targetQuantity: z.number().int().positive(),
  actualQuantity: z.number().int().nonnegative().default(0),
  qcPassedQuantity: z.number().int().nonnegative().default(0),
  plannedStartDate: z.string(),
  plannedEndDate: z.string(),
  actualEndDate: z.string().optional(),
  qcGates: z.array(QCGateSchema).default([]),
  estimatedUnitCost: z.number().nonnegative().optional(),
  currency: z.string().default('RUB'),
  metadata: z.object({
    createdAt: z.string(),
    updatedAt: z.string(),
    version: z.number().int().nonnegative(),
  }),
});

export type ProductionCommitment = z.infer<typeof ProductionCommitmentSchema>;
export type QCGate = z.infer<typeof QCGateSchema>;
