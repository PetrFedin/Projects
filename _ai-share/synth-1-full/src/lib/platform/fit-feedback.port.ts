import { readFitVoteCountsForSku } from '@/lib/client/fit-feedback-local';
import type { FitFeedbackAggregateDto } from './types';

/** Порт агрегата посадки: сейчас только localStorage; позже — fetch. */
export function getFitFeedbackAggregate(sku: string): FitFeedbackAggregateDto {
  const c = readFitVoteCountsForSku(sku);
  return {
    sku,
    runsSmall: c.runs_small,
    trueFit: c.true_fit,
    runsLarge: c.runs_large,
    source: 'local_storage',
  };
}
