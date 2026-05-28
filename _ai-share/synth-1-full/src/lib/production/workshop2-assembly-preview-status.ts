/**
 * Статус live-preview сборки артикула (шкала, T&A template, матрица атрибутов).
 */
import type { Workshop2ArticleAssemblyPreview } from '@/lib/production/workshop2-article-assembler';

export type Workshop2AssemblyPreviewStatus = {
  hasPreview: boolean;
  phase1AttributeCount: number;
  taTemplateId: string;
  pomRowsInPreview: boolean;
  state: 'empty' | 'blocked' | 'warn' | 'ready';
  hintRu?: string;
};

export function summarizeWorkshop2AssemblyPreviewStatus(
  preview: Workshop2ArticleAssemblyPreview | null
): Workshop2AssemblyPreviewStatus {
  if (!preview) {
    return {
      hasPreview: false,
      phase1AttributeCount: 0,
      taTemplateId: '',
      pomRowsInPreview: false,
      state: 'empty',
      hintRu: 'Выберите категорию L1→L3 — появится превью шкалы и шаблона T&A.',
    };
  }

  if (preview.audienceForbidden) {
    return {
      hasPreview: true,
      phase1AttributeCount: preview.phase1AttributeCount,
      taTemplateId: preview.taTemplateId,
      pomRowsInPreview: preview.pomTemplateRowCount > 0,
      state: 'blocked',
      hintRu:
        preview.audienceForbiddenReasonRu ??
        'Аудитория не подходит для выбранной категории одежды/обуви.',
    };
  }

  let state: Workshop2AssemblyPreviewStatus['state'] = 'ready';
  let hintRu: string | undefined;

  const pomRowsInPreview = preview.pomTemplateRowCount > 0;
  if (preview.phase1AttributeCount === 0) {
    state = 'warn';
    hintRu = 'В матрице ТЗ нет атрибутов для листа — проверьте справочник категории.';
  } else if (!pomRowsInPreview) {
    state = 'warn';
    hintRu = 'POM-шаблон для листа не найден — после создания примените табель на конструкции.';
  } else {
    state = 'ready';
    hintRu = undefined;
  }

  return {
    hasPreview: true,
    phase1AttributeCount: preview.phase1AttributeCount,
    taTemplateId: preview.taTemplateId,
    pomRowsInPreview,
    state,
    hintRu,
  };
}
