import { z } from 'zod';

export const TestCategorySchema = z.enum(['shrinkage', 'pilling', 'colorfastness']);
export type TestCategory = z.infer<typeof TestCategorySchema>;

export const PhysicalTestLogSchema = z.object({
  id: z.string(),
  materialId: z.string(),
  testCategory: TestCategorySchema,
  resultValue: z.string(),
  isPass: z.boolean(),
  testedAt: z.string().datetime(),
  notes: z.string().optional(),
});

export type PhysicalTestLog = z.infer<typeof PhysicalTestLogSchema>;

export const CreatePhysicalTestLogSchema = z.object({
  materialId: z.string(),
  testCategory: TestCategorySchema,
  resultValue: z.string().min(1, 'Result value is required'),
  isPass: z.boolean(),
  notes: z.string().optional(),
});

export type CreatePhysicalTestLog = z.infer<typeof CreatePhysicalTestLogSchema>;
