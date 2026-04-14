import { z } from 'zod';

/**
 * [Phase 34 — Runtime Data Validation (Zod Schemas)]
 * Строгая валидация входящих данных для критических движков.
 * Предотвращает падение математических формул из-за кривых данных (например, отрицательных цен или веса).
 */

// 1. Валидация для Robotic Returns Processor (Phase 29)
export const ReturnItemScanSchema = z.object({
  rmaId: z.string().min(1),
  sku: z.string().min(1),
  aiVisionAnalysis: z.object({
    hasStains: z.boolean(),
    hasTears: z.boolean(),
    hasOriginalTags: z.boolean(),
    odorDetected: z.boolean(),
  }),
  weightKg: z.number().nonnegative("Weight cannot be negative"), // Защита от отрицательного веса
  expectedWeightKg: z.number().positive("Expected weight must be greater than zero"),
});

// 2. Валидация для Campaign Generator (Phase 33)
export const OverstockContextSchema = z.object({
  sku: z.string().min(1),
  category: z.string().min(1),
  inventoryUnits: z.number().int().nonnegative("Inventory cannot be negative"),
  currentPriceUSD: z.number().nonnegative("Price cannot be negative"),
  targetDemographic: z.enum(['gen_z', 'millennials', 'boomers']),
  localWeatherForecast: z.enum(['sunny', 'rainy', 'snowy']),
});

// 3. Валидация для Yield Management (Phase 29)
export const PerishableInventorySchema = z.object({
  sku: z.string().min(1),
  shelfLifeDays: z.number().int().positive("Shelf life must be > 0"),
  daysOnShelf: z.number().int().nonnegative("Days on shelf cannot be negative"),
  currentPriceUSD: z.number().nonnegative("Price cannot be negative"),
  inventoryUnits: z.number().int().nonnegative(),
  historicalDailyVelocity: z.number().nonnegative(),
}).refine(data => data.daysOnShelf <= data.shelfLifeDays, {
  message: "Days on shelf cannot exceed total shelf life",
  path: ["daysOnShelf"]
});

// 4. Валидация для Smart Swap (Phase 29)
export const StoreInventorySnapshotSchema = z.object({
  storeId: z.string().min(1),
  sku: z.string().min(1),
  currentInventoryUnits: z.number().int().nonnegative(),
  dailySalesVelocity: z.number().nonnegative(),
  daysUntilStockout: z.number().nonnegative(),
  overstockThresholdUnits: z.number().int().positive(),
});

/**
 * Утилита для безопасной валидации данных перед передачей в движки.
 */
export function validateRuntimeData<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error('[RuntimeValidation] Data validation failed:', result.error.format());
    throw new Error(`Runtime Validation Error: ${result.error.message}`);
  }
  return result.data;
}
