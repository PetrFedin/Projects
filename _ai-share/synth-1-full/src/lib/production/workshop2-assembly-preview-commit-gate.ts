/**
 * Блокировка commit нового артикула при невалидном assembly preview.
 */
import type { Workshop2ArticleAssemblyPreview } from '@/lib/production/workshop2-article-assembler';

export type Workshop2AssemblyPreviewCommitGateResult = {
  allowed: boolean;
  reasonRu?: string;
  checkId?: string;
};

export function evaluateWorkshop2AssemblyPreviewCommitGate(
  preview: Workshop2ArticleAssemblyPreview | null
): Workshop2AssemblyPreviewCommitGateResult {
  if (!preview) {
    return {
      allowed: false,
      checkId: 'assembly.preview.missing',
      reasonRu: 'Выберите категорию L1→L3 — превью сборки недоступно.',
    };
  }

  if (preview.audienceForbidden) {
    return {
      allowed: false,
      checkId: 'assembly.audience.forbidden',
      reasonRu:
        preview.audienceForbiddenReasonRu ?? 'Аудитория не подходит для выбранной категории.',
    };
  }

  if (preview.phase1AttributeCount === 0) {
    return {
      allowed: false,
      checkId: 'assembly.matrix.empty',
      reasonRu: 'Матрица атрибутов ТЗ пуста для листа — проверьте справочник категории.',
    };
  }

  if (!preview.taTemplateId?.trim()) {
    return {
      allowed: false,
      checkId: 'assembly.ta_template.missing',
      reasonRu: 'Не найден шаблон T&A для категории — укажите другой лист или обновите справочник.',
    };
  }

  return { allowed: true };
}
