/**
 * Валидация формы создания/редактирования артикула в Workshop2.
 */

import {
  findHandbookLeafById,
  getHandbookAudiencesWorkshop2,
} from '@/lib/production/category-catalog';
import {
  defaultAudienceIdForUnisexSku,
  isApparelFootwearAccessoriesCategory,
  isWorkshop2ApparelAudienceId,
  resolveL1NameForCategoryInput,
} from '@/lib/production/workshop2-apparel-audience-domain';

export { defaultAudienceIdForUnisexSku };

export type Workshop2ArticleFormMode = 'new' | 'edit' | 'base';

export type Workshop2ArticleFormInput = {
  mode: Workshop2ArticleFormMode;
  sku: string;
  name: string;
  audienceId: string;
  isUnisex?: boolean;
  resolvedLeafId?: string;
  baseLineId?: string;
  /** Async/server: SKU занят в коллекции или PG-досье. */
  skuDuplicateBlocked?: boolean;
  skuDuplicateMessageRu?: string;
};

export type Workshop2ArticleFormValidation = {
  errors: string[];
  warnings: string[];
  canSubmit: boolean;
};

/** Сегмент U/UNI в SKU — признак унисекс-модели (не значение поля «Аудитория»). */
export function suggestsUnisexFromSku(sku: string): boolean {
  const u = sku.trim().toUpperCase();
  return Boolean(u && (/-U-/.test(u) || /-UNI-/.test(u)));
}

/** Сегмент аудитории из кода SKU (SS27-M-COAT → men). Сегмент U не мапится на аудиторию. */
export function expectedAudienceIdFromSku(sku: string): string | null {
  const u = sku.trim().toUpperCase();
  if (!u) return null;
  if (/-W-/.test(u)) return 'women';
  if (/-M-/.test(u)) return 'men';
  if (/-K-/.test(u)) return 'boys';
  if (/-G-/.test(u)) return 'girls';
  if (/-D-/.test(u)) return 'newborn';
  if (/-B-/.test(u)) return 'boys';
  return null;
}

function audienceNameById(audienceId: string): string {
  const aud = getHandbookAudiencesWorkshop2().find((a) => a.id === audienceId);
  return aud?.name?.trim() || audienceId;
}

/**
 * Обязательные поля карточки: SKU, название, аудитория, лист категории (L1–L3).
 */
export function validateWorkshop2ArticleForm(
  input: Workshop2ArticleFormInput
): Workshop2ArticleFormValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (input.skuDuplicateBlocked) {
    errors.push(
      input.skuDuplicateMessageRu?.trim() ||
        'Этот SKU уже используется — измените код или откройте существующий артикул.'
    );
  }

  if (input.mode === 'base') {
    if (!input.baseLineId?.trim()) {
      errors.push('Выберите артикул из базы.');
    }
  } else {
    if (!input.sku.trim()) {
      errors.push('Укажите код SKU или нажмите «Сгенерировать».');
    }
    if (!input.name.trim()) {
      errors.push('Укажите название артикула.');
    }
    if (!input.audienceId.trim()) {
      errors.push('Выберите аудиторию.');
    }
    if (!input.resolvedLeafId?.trim()) {
      errors.push('Выберите категорию: аудитория и три уровня (L1 → L2 → L3).');
    }
  }

  const skuExpected = expectedAudienceIdFromSku(input.sku);
  if (skuExpected && input.audienceId.trim() && skuExpected !== input.audienceId.trim()) {
    warnings.push(
      `В коде SKU заложена аудитория «${audienceNameById(skuExpected)}», в форме выбрано «${audienceNameById(input.audienceId)}» — проверьте согласованность.`
    );
  }

  if (suggestsUnisexFromSku(input.sku) && !input.isUnisex) {
    warnings.push(
      'В SKU есть сегмент U (унисекс) — включите переключатель «Унисекс: да» или проверьте код.'
    );
  }

  if (suggestsUnisexFromSku(input.sku) && input.audienceId.trim() === 'unisex') {
    warnings.push(
      '«Унисекс» не входит в список аудитории — выберите сегмент (женщины / мужчины / дети) и отметьте унисекс отдельно.'
    );
  }

  const leaf = input.resolvedLeafId ? findHandbookLeafById(input.resolvedLeafId) : undefined;
  const l1Name = resolveL1NameForCategoryInput({
    leafId: input.resolvedLeafId,
    l1Name: leaf?.l1Name,
  });
  const isApparelDomain = isApparelFootwearAccessoriesCategory({
    leafId: input.resolvedLeafId,
    l1Name,
  });

  if (isApparelDomain && input.audienceId.trim() === 'other') {
    errors.push(
      'Для одежды, обуви и аксессуаров нельзя выбрать аудиторию «Остальное» — укажите женщины, мужчины или детей.'
    );
  }

  if (
    isApparelDomain &&
    input.audienceId.trim() &&
    !isWorkshop2ApparelAudienceId(input.audienceId)
  ) {
    errors.push(
      'Для одежды, обуви и аксессуаров доступны только аудитории: женщины, мужчины, дети (девочки / мальчики / новорождённые).'
    );
  }

  if (!isApparelDomain && input.isUnisex) {
    warnings.push(
      'Унисекс для этой категории не применяется — переключатель будет сброшен при сохранении.'
    );
  }
  if (leaf && skuExpected && leaf.audienceId !== skuExpected) {
    warnings.push(
      `Категория относится к «${audienceNameById(leaf.audienceId)}», а сегмент SKU — к «${audienceNameById(skuExpected)}».`
    );
  }

  if (leaf && input.audienceId.trim() && leaf.audienceId !== input.audienceId.trim()) {
    warnings.push(
      `Выбранная аудитория «${audienceNameById(input.audienceId)}» не совпадает с аудиторией листа справочника «${audienceNameById(leaf.audienceId)}».`
    );
  }

  return {
    errors,
    warnings,
    canSubmit: errors.length === 0,
  };
}
