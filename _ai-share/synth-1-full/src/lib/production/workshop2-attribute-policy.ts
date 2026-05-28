/**
 * Единая policy-точка для скрытия/показа атрибутов Workshop2 в UI и экспортах.
 * Текущее покрытие: подавленные поля карточки артикула (этап ТЗ).
 *
 * Дальше расширяем в полноценную матрицу:
 * audienceId × leafId × phase × stage -> required/recommended/hidden.
 */

export type Workshop2AttributePolicyContext = {
  audienceId?: string | null;
  leafId?: string | null;
  l1Name?: string | null;
  l2Name?: string | null;
  l3Name?: string | null;
  phase?: 1 | 2 | 3;
  source?: 'catalog' | 'ui' | 'export' | 'report';
};

export type Workshop2LeafPolicyRule = {
  requiredAttrIds: string[];
  recommendedAttrIds: string[];
  hiddenAttrIds: string[];
};

/** Базовые подавления: в карточке ТЗ эти поля убраны продуктовым решением. */
export const W2_POLICY_SUPPRESSED_ATTR_IDS = new Set<string>([
  'season',
  'collectionSeasonTagOptions',
  'styleOccasionOptions',
  'countryOfOriginMarketOptions',
]);

/**
 * Soft rollout: включаем leaf-пакеты только для пилотных листов.
 * Это снижает риск массового изменения формы на всех ветках сразу.
 */
export const W2_POLICY_LEAF_PACKAGE_ROLLOUT_IDS = new Set<string>([
  'catalog-apparel-g0-l3', // Одежда › Верхняя одежда › Пуховики
  'catalog-shoes-g0-l0', // Обувь › Ботинки (первая ветка обуви)
  'catalog-bags-g0-l0', // Сумки › Сумки
]);

const W2_LEAF_POLICY_RULES: Record<string, Workshop2LeafPolicyRule> = {
  'catalog::catalog-apparel-g0-l3': {
    requiredAttrIds: ['insulationMaterialOptions', 'insulationLevelOptions'],
    recommendedAttrIds: [
      'thermoTechOptions',
      'liningOptionsByCategory',
      'hoodPresenceOptionsByCategory',
    ],
    /** Для пуховиков не нужен блок драпировки в базовом ТЗ пилота. */
    hiddenAttrIds: ['draperyOptionsByCategory'],
  },
  'catalog::catalog-shoes-g0-l0': {
    requiredAttrIds: ['shoe-closure', 'shoe-lining'],
    recommendedAttrIds: ['shoe-outsole-tread', 'shoe-purpose'],
    hiddenAttrIds: [],
  },
  'catalog::catalog-bags-g0-l0': {
    requiredAttrIds: ['bag-type', 'mat'],
    recommendedAttrIds: ['hardwareOptionsByCategory'],
    hiddenAttrIds: [],
  },
};

function policyKey(
  audienceId: string | null | undefined,
  leafId: string | null | undefined
): string | null {
  const leaf = (leafId ?? '').trim();
  if (!leaf) return null;
  const aud = (audienceId ?? 'catalog').trim() || 'catalog';
  return `${aud}::${leaf}`;
}

export function workshop2LeafPolicyRuleForContext(
  ctx?: Workshop2AttributePolicyContext
): Workshop2LeafPolicyRule | null {
  const key = policyKey(ctx?.audienceId, ctx?.leafId);
  if (!key) return null;
  return W2_LEAF_POLICY_RULES[key] ?? null;
}

export function workshop2LeafPolicyPackageEnabled(ctx?: Workshop2AttributePolicyContext): boolean {
  const leafId = (ctx?.leafId ?? '').trim();
  if (!leafId) return false;
  return W2_POLICY_LEAF_PACKAGE_ROLLOUT_IDS.has(leafId);
}

/**
 * Подготовка к audience/leaf policy.
 * Сейчас возвращает базовый набор + контекстные подавления (пока пусто, но единый API уже есть).
 */
export function workshop2PolicySuppressedAttrIdsForContext(
  _ctx?: Workshop2AttributePolicyContext
): ReadonlySet<string> {
  const out = new Set<string>(W2_POLICY_SUPPRESSED_ATTR_IDS);
  if (!_ctx || !workshop2LeafPolicyPackageEnabled(_ctx)) return out;
  const rule = workshop2LeafPolicyRuleForContext(_ctx);
  for (const id of rule?.hiddenAttrIds ?? []) out.add(id);
  return out;
}

export function workshop2PolicySuppressesAttribute(
  attributeId: string,
  ctx?: Workshop2AttributePolicyContext
): boolean {
  return workshop2PolicySuppressedAttrIdsForContext(ctx).has(attributeId);
}
