/**
 * SparkLayer: правила по заказу и бренду — MOQ, MOV (мин. сумма заказа), территориальные ограничения.
 * Используются в матрице для Pre-flight check перед подтверждением заказа.
 */

import { getMoqForProduct } from '@/lib/b2b/joor-constants';
import { getCreditForCurrentPartner } from '@/lib/b2b/credit-check';
import type { PriceTierId } from '@/lib/b2b/price-tiers';

export interface OrderRuleByBrand {
  brandId: string;
  brandName: string;
  /** Минимальная сумма заказа (MOV) в рублях */
  minOrderValue: number;
  /** MOQ по стилю (общий — детали по продукту в joor-constants) */
  moqPerStyle: number;
  /** Разрешённые территории (пусто = все) */
  allowedTerritories?: string[];
}

/** Мок: правила по брендам. При API — с бэкенда по контракту партнёра. */
const ORDER_RULES_BY_BRAND: OrderRuleByBrand[] = [
  { brandId: 'syntha', brandName: 'Syntha', minOrderValue: 150_000, moqPerStyle: 6 },
  { brandId: 'apc', brandName: 'A.P.C.', minOrderValue: 120_000, moqPerStyle: 6 },
  { brandId: 'acne', brandName: 'Acne Studios', minOrderValue: 80_000, moqPerStyle: 4 },
];

export function getOrderRulesForBrand(brandName: string): OrderRuleByBrand | undefined {
  const norm = brandName.toLowerCase().replace(/\s+/g, '');
  return ORDER_RULES_BY_BRAND.find(
    (r) => r.brandName.toLowerCase().replace(/\s+/g, '') === norm || r.brandId === norm
  );
}

/** Правила по всем брендам для текущего партнёра (MOV по бренду для экрана «Условия по коллекциям»). */
export function getOrderRulesForPartner(): { movByBrand: Record<string, number> } {
  const movByBrand: Record<string, number> = {};
  for (const r of ORDER_RULES_BY_BRAND) {
    movByBrand[r.brandName] = r.minOrderValue;
  }
  return { movByBrand };
}

export interface PreflightCheckItem {
  id: string;
  label: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
  requiredValue?: string;
  currentValue?: string;
}

/** Pre-flight check: MOQ, MOV, кредит, территория. Для блока в матрице (вкладка Итого). */
export function runPreflightCheck(params: {
  orderTotalAmount: number;
  orderTotalUnits: number;
  brandName: string;
  territory?: string;
  cartByProductId: Record<string, number>;
}): PreflightCheckItem[] {
  const { orderTotalAmount, orderTotalUnits, brandName, territory, cartByProductId } = params;
  const rules = getOrderRulesForBrand(brandName);
  const credit = getCreditForCurrentPartner();
  const items: PreflightCheckItem[] = [];

  // MOV
  const mov = rules?.minOrderValue ?? 0;
  if (mov > 0) {
    const ok = orderTotalAmount >= mov;
    items.push({
      id: 'mov',
      label: 'Минимальная сумма заказа (MOV)',
      status: ok ? 'ok' : orderTotalAmount > 0 ? 'warning' : 'error',
      message: ok ? `Выполнено (≥ ${(mov / 1000).toFixed(0)}k ₽)` : `Минимум ${(mov / 1000).toFixed(0)}k ₽ по бренду`,
      requiredValue: `${(mov / 1000).toFixed(0)}k ₽`,
      currentValue: `${(orderTotalAmount / 1000).toFixed(0)}k ₽`,
    });
  }

  // MOQ по стилям
  const moqPerStyle = rules?.moqPerStyle ?? 6;
  const violatedMoq = Object.entries(cartByProductId).find(([, qty]) => qty > 0 && qty < moqPerStyle);
  if (violatedMoq) {
    const [productId, qty] = violatedMoq;
    const required = getMoqForProduct(productId);
    items.push({
      id: 'moq',
      label: 'MOQ по стилю',
      status: 'warning',
      message: `По стилю не набран минимум: нужно ${required} ед., в корзине ${qty}`,
      requiredValue: `${required} ед.`,
      currentValue: `${qty} ед.`,
    });
  } else if (orderTotalUnits > 0) {
    items.push({
      id: 'moq',
      label: 'MOQ по стилю',
      status: 'ok',
      message: 'Минимумы по стилям соблюдены',
    });
  }

  // Кредитный лимит
  const creditOk = !credit.blocked && !credit.wouldExceed(orderTotalAmount);
  items.push({
    id: 'credit',
    label: 'Кредитный лимит',
    status: credit.blocked ? 'error' : credit.wouldExceed(orderTotalAmount) ? 'warning' : 'ok',
    message: credit.blocked
      ? 'Лимит исчерпан'
      : credit.wouldExceed(orderTotalAmount)
        ? `Сумма заказа превышает доступный лимит (${(credit.available / 1_000_000).toFixed(1)} млн ₽)`
        : `В пределах лимита (доступно ${(credit.available / 1_000_000).toFixed(1)} млн ₽)`,
    currentValue: `${(orderTotalAmount / 1_000_000).toFixed(2)} млн ₽`,
  });

  // Территория
  if (rules?.allowedTerritories?.length && territory) {
    const allowed = rules.allowedTerritories.includes(territory);
    items.push({
      id: 'territory',
      label: 'Территория',
      status: allowed ? 'ok' : 'error',
      message: allowed ? `Территория ${territory} разрешена` : `Для бренда не разрешена территория ${territory}`,
      currentValue: territory,
    });
  }

  return items;
}

/** SparkLayer: правила в реальном времени — блокировка строки в матрице по кредиту / MOV / территории с понятным сообщением. */
export interface RealtimeLineBlock {
  blocked: boolean;
  reasons: string[];
  /** Ключ для отображения (credit | mov | territory | moq) */
  types: ('credit' | 'mov' | 'territory' | 'moq')[];
}

export function getRealtimeLineBlock(params: {
  brandName: string;
  territory?: string;
  /** Сумма заказа с учётом этой строки (для проверки кредита) */
  orderTotalWithLine: number;
  /** Сумма по бренду с учётом этой строки (для MOV) */
  orderTotalByBrandWithLine: number;
  /** Количество по продукту в корзине (для MOQ) */
  qtyForProduct: number;
  productId: string;
  /** MOV по бренду */
  minOrderValue: number;
}): RealtimeLineBlock {
  const { brandName, territory, orderTotalWithLine, orderTotalByBrandWithLine, qtyForProduct, productId, minOrderValue } = params;
  const rules = getOrderRulesForBrand(brandName);
  const credit = getCreditForCurrentPartner();
  const reasons: string[] = [];
  const types: RealtimeLineBlock['types'] = [];

  if (credit.blocked) {
    reasons.push('Кредитный лимит исчерпан. Заказ недоступен.');
    types.push('credit');
  } else if (credit.wouldExceed(orderTotalWithLine)) {
    reasons.push(`Превышен кредитный лимит. Доступно ${(credit.available / 1_000_000).toFixed(1)} млн ₽. Уменьшите количество или свяжитесь с брендом.`);
    types.push('credit');
  }

  const mov = rules?.minOrderValue ?? minOrderValue;
  if (mov > 0 && orderTotalByBrandWithLine > 0 && orderTotalByBrandWithLine < mov) {
    reasons.push(`Минимальная сумма заказа (MOV) по бренду: ${(mov / 1000).toFixed(0)}k ₽. Сейчас ${(orderTotalByBrandWithLine / 1000).toFixed(0)}k ₽.`);
    types.push('mov');
  }

  if (rules?.allowedTerritories?.length && territory && !rules.allowedTerritories.includes(territory)) {
    reasons.push(`Территория «${territory}» не разрешена для бренда ${brandName}.`);
    types.push('territory');
  }

  const moqRequired = getMoqForProduct(productId);
  if (qtyForProduct > 0 && qtyForProduct < moqRequired) {
    reasons.push(`MOQ по стилю: ${moqRequired} ед. В строке ${qtyForProduct} ед. Добавьте ещё ${moqRequired - qtyForProduct} или уберите позицию.`);
    types.push('moq');
  }

  const blocked =
    (types.includes('credit') && (credit.blocked || credit.wouldExceed(orderTotalWithLine))) ||
    types.includes('territory');
  return {
    blocked,
    reasons,
    types,
  };
}
