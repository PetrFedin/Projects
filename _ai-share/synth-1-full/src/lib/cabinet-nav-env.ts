/**
 * Публичные env для «investor spine» и смежных переключателей кабинетов.
 * Канон имён и смыслов: `.planning/research/PLAN_RESTRUCTURE_THREE_PILLARS.md` §8.1, §8.4
 * (реестр не дублируем — держим строки таблицы §8.4 в синхроне с этим модулем и `env.cabinet-nav.example`).
 */

function isPublicOn(raw: string | undefined): boolean {
  if (raw === undefined) return false;
  const t = String(raw).trim().toLowerCase();
  return t === '1' || t === 'true' || t === 'yes' || t === 'on';
}

/** `NEXT_PUBLIC_BRAND_NAV_INVESTOR_SPINE` — сужение сайдбара бренда (см. `applyBrandInvestorSpineClusterOverrides`). */
export function isBrandNavInvestorSpineEnabled(): boolean {
  const isEnabled = isPublicOn(
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_BRAND_NAV_INVESTOR_SPINE : undefined
  );
  console.log('DEBUG: NEXT_PUBLIC_BRAND_NAV_INVESTOR_SPINE', isEnabled);
  return isEnabled;
}

/** `NEXT_PUBLIC_SHOP_NAV_INVESTOR_SPINE` — аналог для shop (не отменяет `NEXT_PUBLIC_SHOP_NAV_MVP`). */
export function isShopNavInvestorSpineEnabled(): boolean {
  const isEnabled = isPublicOn(
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SHOP_NAV_INVESTOR_SPINE : undefined
  );
  console.log('DEBUG: NEXT_PUBLIC_SHOP_NAV_INVESTOR_SPINE', isEnabled);
  return isEnabled;
}

/** `NEXT_PUBLIC_FACTORY_NAV_INVESTOR_SPINE` — опционально для демо второй ролью (фабрика). */
export function isFactoryNavInvestorSpineEnabled(): boolean {
  const isEnabled = isPublicOn(
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_FACTORY_NAV_INVESTOR_SPINE : undefined
  );
  console.log('DEBUG: NEXT_PUBLIC_FACTORY_NAV_INVESTOR_SPINE', isEnabled);
  return isEnabled;
}

/** `NEXT_PUBLIC_DISTRIBUTOR_NAV_INVESTOR_SPINE` — сужение сайдбара дистрибутора (`applyDistributorInvestorSpineClusterOverrides`). */
export function isDistributorNavInvestorSpineEnabled(): boolean {
  const isEnabled = isPublicOn(
    typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_DISTRIBUTOR_NAV_INVESTOR_SPINE
      : undefined
  );
  console.log('DEBUG: NEXT_PUBLIC_DISTRIBUTOR_NAV_INVESTOR_SPINE', isEnabled);
  return isEnabled;
}

type NavGroupLike = { id: string; clusterId?: string };

/**
 * Режим investor для бренда: A→B→C в основном контуре, вторичное (команда / партнёры / логистика) — в архив;
 * «Организация и настройки» (профиль, интеграции) поднимаются в spine для runbook §5 (A1, B4).
 */
export function applyBrandInvestorSpineClusterOverrides<T extends NavGroupLike>(
  groups: readonly T[]
): T[] {
  if (!isBrandNavInvestorSpineEnabled()) return [...groups];
  return groups.map((g) => {
    if (g.id === 'team' || g.id === 'partners' || g.id === 'logistics')
      return { ...g, clusterId: 'archive' } as T;
    if (g.id === 'brand-admin') return { ...g, clusterId: 'syntha-cores' } as T;
    return g;
  });
}

/** Shop: короткий spine под зеркало B2B + коммуникации; партнёры и логистика — в архив. */
export function applyShopInvestorSpineClusterOverrides<T extends NavGroupLike>(
  groups: readonly T[]
): T[] {
  if (!isShopNavInvestorSpineEnabled()) return [...groups];
  return groups.map((g) => {
    if (g.id === 'partners' || g.id === 'logistics') return { ...g, clusterId: 'archive' } as T;
    return g;
  });
}

/**
 * Кабинет производителя (`/factory/production`): исполнение + связь в spine; команда и партнёры — в архив.
 * Тот же env, что и для поставщика: `NEXT_PUBLIC_FACTORY_NAV_INVESTOR_SPINE`.
 */
export function applyFactoryManufacturerInvestorSpineClusterOverrides<T extends NavGroupLike>(
  groups: readonly T[]
): T[] {
  if (!isFactoryNavInvestorSpineEnabled()) return [...groups];
  return groups.map((g) => {
    if (g.id === 'team' || g.id === 'partners') return { ...g, clusterId: 'archive' } as T;
    return g;
  });
}

/** Кабинет поставщика (`/factory/supplier`): материалы и цепочка; партнёры — в архив. */
export function applyFactorySupplierInvestorSpineClusterOverrides<T extends NavGroupLike>(
  groups: readonly T[]
): T[] {
  if (!isFactoryNavInvestorSpineEnabled()) return [...groups];
  return groups.map((g) => {
    if (g.id === 'partners') return { ...g, clusterId: 'archive' } as T;
    return g;
  });
}

/** Дистрибутор: B2B + логистика + связь в spine; команда и партнёры — в архив. */
export function applyDistributorInvestorSpineClusterOverrides<T extends NavGroupLike>(
  groups: readonly T[]
): T[] {
  if (!isDistributorNavInvestorSpineEnabled()) return [...groups];
  return groups.map((g) => {
    if (g.id === 'team' || g.id === 'partners') return { ...g, clusterId: 'archive' } as T;
    return g;
  });
}
