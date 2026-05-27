/**
 * Сводка готовности формы создания/редактирования артикула (без localStorage-only submit).
 */
import type { Workshop2ArticleFormValidation } from '@/lib/production/workshop2-article-form-validation';

export type Workshop2ArticleFormReadiness = {
  errorCount: number;
  warningCount: number;
  canSubmit: boolean;
  state: 'blocked' | 'warn' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2ArticleFormReadiness(input: {
  validation: Workshop2ArticleFormValidation;
  /** SKU check ещё в полёте — не давать submit до ответа. */
  skuAvailabilityChecking?: boolean;
}): Workshop2ArticleFormReadiness {
  const errorCount = input.validation.errors.length;
  const warningCount = input.validation.warnings.length;
  const canSubmit = input.validation.canSubmit && !input.skuAvailabilityChecking;

  let state: Workshop2ArticleFormReadiness['state'] = 'ready';
  let hintRu: string | undefined;

  if (input.skuAvailabilityChecking) {
    state = 'blocked';
    hintRu = 'Проверяем уникальность SKU на сервере — дождитесь ответа перед сохранением.';
  } else if (errorCount > 0) {
    state = 'blocked';
    hintRu = input.validation.errors[0];
  } else if (warningCount > 0) {
    state = 'warn';
    hintRu = input.validation.warnings[0];
  }

  return {
    errorCount,
    warningCount,
    canSubmit,
    state,
    hintRu,
  };
}
