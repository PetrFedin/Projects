import { COLLECTION_STEPS } from '@/lib/production/collection-steps-catalog';

/** Порядок id этапов коллекции для unified SKU flow (стабильный массив). */
export const COLLECTION_FLOW_STEP_IDS = COLLECTION_STEPS.map((s) => s.id);
