import { z } from 'zod';

export const LabDipTypeSchema = z.enum(['lab-dip', 'strike-off']);
export type LabDipType = z.infer<typeof LabDipTypeSchema>;

export const LabDipStatusSchema = z.enum(['pending', 'approved', 'rejected']);
export type LabDipStatus = z.infer<typeof LabDipStatusSchema>;

export const LabDipSchema = z.object({
  id: z.string(),
  materialId: z.string(),
  type: LabDipTypeSchema,
  status: LabDipStatusSchema,
  submittedAt: z.string().datetime(),
  notes: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export type LabDip = z.infer<typeof LabDipSchema>;

export const UpdateLabDipStatusSchema = z.object({
  id: z.string(),
  status: LabDipStatusSchema,
  notes: z.string().optional(),
});

export type UpdateLabDipStatus = z.infer<typeof UpdateLabDipStatusSchema>;
