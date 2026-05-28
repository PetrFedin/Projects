/**
 * Стандарты AQL (Acceptable Quality Level) по ISO 2859-1.
 * Используются в швейном производстве для определения размера выборки и порогов брака.
 */

export type AqlLevel = '1.0' | '1.5' | '2.5' | '4.0';

export type AqlPlan = {
  sampleSize: number;
  acceptLimit: number; // Max defects to accept
  rejectLimit: number; // Min defects to reject
};

// Упрощенная таблица для General Inspection Level II (нормальный контроль)
const AQL_TABLE_II: Record<string, Record<AqlLevel, AqlPlan>> = {
  '2-8': {
    '1.0': { sampleSize: 2, acceptLimit: 0, rejectLimit: 1 },
    '1.5': { sampleSize: 2, acceptLimit: 0, rejectLimit: 1 },
    '2.5': { sampleSize: 2, acceptLimit: 0, rejectLimit: 1 },
    '4.0': { sampleSize: 2, acceptLimit: 0, rejectLimit: 1 },
  },
  '9-15': {
    '1.0': { sampleSize: 3, acceptLimit: 0, rejectLimit: 1 },
    '1.5': { sampleSize: 3, acceptLimit: 0, rejectLimit: 1 },
    '2.5': { sampleSize: 3, acceptLimit: 0, rejectLimit: 1 },
    '4.0': { sampleSize: 3, acceptLimit: 0, rejectLimit: 1 },
  },
  '16-25': {
    '1.0': { sampleSize: 5, acceptLimit: 0, rejectLimit: 1 },
    '1.5': { sampleSize: 5, acceptLimit: 0, rejectLimit: 1 },
    '2.5': { sampleSize: 5, acceptLimit: 0, rejectLimit: 1 },
    '4.0': { sampleSize: 5, acceptLimit: 1, rejectLimit: 2 },
  },
  '26-50': {
    '1.0': { sampleSize: 8, acceptLimit: 0, rejectLimit: 1 },
    '1.5': { sampleSize: 8, acceptLimit: 0, rejectLimit: 1 },
    '2.5': { sampleSize: 8, acceptLimit: 1, rejectLimit: 2 },
    '4.0': { sampleSize: 8, acceptLimit: 1, rejectLimit: 2 },
  },
  '51-90': {
    '1.0': { sampleSize: 13, acceptLimit: 0, rejectLimit: 1 },
    '1.5': { sampleSize: 13, acceptLimit: 0, rejectLimit: 1 },
    '2.5': { sampleSize: 13, acceptLimit: 1, rejectLimit: 2 },
    '4.0': { sampleSize: 13, acceptLimit: 2, rejectLimit: 3 },
  },
  '91-150': {
    '1.0': { sampleSize: 20, acceptLimit: 0, rejectLimit: 1 },
    '1.5': { sampleSize: 20, acceptLimit: 1, rejectLimit: 2 },
    '2.5': { sampleSize: 20, acceptLimit: 2, rejectLimit: 3 },
    '4.0': { sampleSize: 20, acceptLimit: 3, rejectLimit: 4 },
  },
  '151-280': {
    '1.0': { sampleSize: 32, acceptLimit: 1, rejectLimit: 2 },
    '1.5': { sampleSize: 32, acceptLimit: 1, rejectLimit: 2 },
    '2.5': { sampleSize: 32, acceptLimit: 2, rejectLimit: 3 },
    '4.0': { sampleSize: 32, acceptLimit: 5, rejectLimit: 6 },
  },
  '281-500': {
    '1.0': { sampleSize: 50, acceptLimit: 1, rejectLimit: 2 },
    '1.5': { sampleSize: 50, acceptLimit: 2, rejectLimit: 3 },
    '2.5': { sampleSize: 50, acceptLimit: 3, rejectLimit: 4 },
    '4.0': { sampleSize: 50, acceptLimit: 7, rejectLimit: 8 },
  },
  '501-1200': {
    '1.0': { sampleSize: 80, acceptLimit: 2, rejectLimit: 3 },
    '1.5': { sampleSize: 80, acceptLimit: 3, rejectLimit: 4 },
    '2.5': { sampleSize: 80, acceptLimit: 5, rejectLimit: 6 },
    '4.0': { sampleSize: 80, acceptLimit: 10, rejectLimit: 11 },
  },
  '1201-3200': {
    '1.0': { sampleSize: 125, acceptLimit: 3, rejectLimit: 4 },
    '1.5': { sampleSize: 125, acceptLimit: 5, rejectLimit: 6 },
    '2.5': { sampleSize: 125, acceptLimit: 7, rejectLimit: 8 },
    '4.0': { sampleSize: 125, acceptLimit: 14, rejectLimit: 15 },
  },
};

export function getAqlPlan(batchSize: number, level: AqlLevel = '2.5'): AqlPlan {
  const rangeKey =
    Object.keys(AQL_TABLE_II).find((key) => {
      const [min, max] = key.split('-').map(Number);
      return batchSize >= min && (max ? batchSize <= max : true);
    }) || '2-8';

  return AQL_TABLE_II[rangeKey][level];
}
