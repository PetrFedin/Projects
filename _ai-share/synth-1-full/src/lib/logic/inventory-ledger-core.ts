/**
 * Типы гранул стока и расчёты ATP/VMI без зависимости от domain-event-factories (client-safe для control-aggregator).
 */
export type StockState =
  | 'on_hand' // физически на складе, доступно
  | 'reserved' // зарезервировано под заказ
  | 'allocated' // аллоцировано под канал (напр. B2C Marketroom)
  | 'unavailable' // брак, карантин, инвентаризация
  | 'in_transit' // в пути между складами (shadow inventory)
  | 'ex_factory' // отгружено с фабрики, но еще не принято (ASN)
  | 'reserved_for_channel' // [Phase 2 Prod] зарезервировано под канал до подтверждения приёмки
  | 'shipped' // отгружено клиенту (списано из ATP, но еще в Ledger для истории)
  | 'delivered'; // доставлено (финальное состояние в Ledger)

export interface InventoryGrain {
  /** Уникальный ключ записи (SKU x Location x State x Lot) */
  grainId: string;

  /** Ссылки на Build (что это) */
  productId: string;
  sku: string;

  /** Ссылки на Run (где это) */
  locationId: string;

  /** Состояние (ось State) */
  state: StockState;

  /** Партия / Lot (опционально для Phase 2) */
  lotId?: string;

  /** Количество */
  quantity: number;

  /** Владелец (Owner/Tenant) */
  ownerId: string; // brandId или shopId (для VMI/BOPIS)

  /** Арендатор (Tenant) — для изоляции в мульти-арендной среде */
  tenantId?: string; // [Phase 2 Prod] Обязателен для продакшена в будущем

  /** Канал (опционально, если гранула привязана к каналу) */
  channelId?: 'b2b' | 'b2c' | 'retail';

  /** [Phase 2 Prod] Ссылка на VMI-соглашение */
  agreementId?: string;

  /** [Phase 2 Prod] Флаг защиты VMI-стока (только для владельца соглашения) */
  vmiProtected?: boolean;

  /** [Phase 2 Prod] Дата последнего Cycle Counting */
  lastCycleCountAt?: string;

  /** [Phase 2 Prod] Дополнительный аудит-статус (напр. 'verified') */
  auditStatus?: 'pending' | 'verified' | 'flagged';

  /** [Phase 2 Prod] Флаг блокировки гранулы (напр. при обнаружении расхождений) */
  isLocked?: boolean;

  /** [Phase 2 Prod] TTL для резерва (ISO string) */
  expiresAt?: string;

  /** [Phase 2 Prod] Ссылка на родительский резерв (Back-to-Back) */
  parentGrainId?: string;

  /** [Phase 2 Prod] Квота (макс. количество для канала/пула) */
  quota?: number;

  /** [Phase 2 Prod] ID виртуального пула (для изоляции под кампании) */
  virtualPoolId?: string;

  /** Флаг комплаенса (напр. отсутствие КИЗ для РФ) */
  complianceConstrained?: boolean;

  /** Метаданные */
  metadata: {
    lastMovementId?: string;
    updatedAt: string;
    version: number;
    /** [Phase 2 Prod] Ссылка на предыдущую версию гранулы (для аудита) */
    prevGrainId?: string;
    /** [Phase 2 Prod] Аудит-след изменений */
    auditTrail?: Array<{
      timestamp: string;
      actorId: string;
      action: string;
      prevQuantity: number;
      newQuantity: number;
    }>;
  };
}

/**
 * [Phase 2 Prod] Валидация прав на использование VMI-стока.
 */
export function validateVMI(params: {
  grain: InventoryGrain;
  actorId: string;
  actorType: 'brand' | 'shop';
  agreementId?: string;
}): boolean {
  const { grain, actorId, actorType, agreementId } = params;

  if (!grain.agreementId) return true; // Не VMI сток

  // Если это VMI сток, должен быть передан ID соглашения
  if (!agreementId || grain.agreementId !== agreementId) return false;

  // Если сток защищен (vmiProtected), его может использовать только владелец соглашения (shop)
  // или владелец стока (brand) для управления.
  if (grain.vmiProtected) {
    if (actorType === 'shop' && grain.ownerId !== actorId && grain.agreementId === agreementId) {
      // Магазин-бенефициар может использовать VMI сток бренда
      return true;
    }
    if (actorType === 'brand' && grain.ownerId === actorId) {
      // Бренд-владелец всегда имеет доступ к своему стоку
      return true;
    }
    return false;
  }

  return true;
}

/**
 * [Phase 2] ATP (Available to Promise) Calculator foundation.
 * [Phase 3] ATP 2.0: Virtual Pools & Shadow Inventory.
 * ATP = (on_hand + in_transit_confirmed) - reserved - allocated (в зависимости от канала) - safety_stock.
 */
export function calculateATP(params: {
  grains: InventoryGrain[];
  channelId?: 'b2b' | 'b2c' | 'retail';
  actorId?: string;
  actorType?: 'brand' | 'shop';
  /** [Phase 2 Prod] Строгая изоляция арендаторов */
  strictIsolation?: boolean;
  /** [Phase 2 Prod] ID арендатора для фильтрации */
  tenantId?: string;
  /** [Phase 2 Prod] ID виртуального пула для изоляции стока */
  virtualPoolId?: string;
  /** [Phase 2 Prod] ID активного соглашения для проверки VMI */
  agreementId?: string;
  /** [Phase 3] Учет товаров в пути (Shadow Inventory) */
  includeInTransit?: boolean;
  /** [Phase 3] Страховой запас, который нельзя продавать */
  safetyStock?: number;
}): number {
  const {
    grains,
    channelId,
    actorId,
    actorType,
    strictIsolation,
    tenantId,
    virtualPoolId,
    agreementId,
    includeInTransit,
    safetyStock = 0,
  } = params;

  const rawATP = grains
    .filter((g) => {
      // 0. Изоляция арендатора (Tenant Isolation)
      if (tenantId && g.tenantId && g.tenantId !== tenantId) return false;

      // [Phase 2 Prod] Изоляция виртуального пула (Campaign Isolation)
      // Если указан virtualPoolId, берем только гранулы этого пула.
      // Если не указан — берем только свободные гранулы (без virtualPoolId).
      if (virtualPoolId) {
        if (g.virtualPoolId !== virtualPoolId) return false;
      } else {
        if (g.virtualPoolId) return false;
      }

      // [Phase 2 Prod] Если у гранулы нет tenantId, но мы в строгом режиме изоляции — блокируем
      // Исключение: разрешаем системные гранулы без tenantId, если они явно помечены (в будущем)
      if (strictIsolation && !g.tenantId && tenantId) return false;

      // [Phase 2 Prod] Проверка, что владелец гранулы принадлежит тому же арендатору (если указано)
      // Это предотвращает "утечку" стока между арендаторами через общих владельцев
      if (strictIsolation && tenantId && g.tenantId === tenantId && g.ownerId === 'system') {
        // Системный сток внутри арендатора разрешен
      }

      // 1. Базовая фильтрация по состоянию
      const isAvailableState =
        g.state === 'on_hand' ||
        g.state === 'allocated' ||
        (includeInTransit && g.state === 'in_transit');
      if (!isAvailableState) return false;

      // [Phase 2 Prod] Проверка блокировки гранулы
      if (g.isLocked) return false;

      // [Phase 2 Prod] Проверка истечения TTL резерва
      if (g.expiresAt && new Date(g.expiresAt) < new Date()) {
        // Просроченный резерв не считается доступным в ATP как резерв,
        // но в Ledger он еще висит до явного release.
        if (g.state === 'reserved' || g.state === 'reserved_for_channel') return false;
      }

      // 1.1. Compliance check (КИЗ)
      if (g.complianceConstrained) return false;

      // 2. Если указан канал, берем только подходящий сток
      if (channelId) {
        if (channelId === 'b2c') {
          if (g.channelId !== 'b2c' && (g.channelId || g.state !== 'on_hand')) return false;
        }
        if (channelId === 'b2b') {
          if (g.state !== 'on_hand' || g.channelId) return false;
        }
        if (channelId === 'retail') {
          if (g.channelId !== 'retail') return false;
        }
      }

      // 3. Tenant/Owner filtering (если актор указан)
      if (actorId && actorType) {
        if (actorType === 'brand') {
          // Бренд видит свой сток
          if (g.ownerId !== actorId) return false;
        }
        if (actorType === 'shop') {
          // Магазин видит свой сток + то, что ему аллоцировано (в Phase 3)
          if (g.ownerId !== actorId && g.channelId !== 'retail') {
            // [Phase 2 Prod] Использование централизованного валидатора VMI
            if (!validateVMI({ grain: g, actorId, actorType, agreementId })) {
              return false;
            }

            // В демо-режиме (без strict) разрешаем видеть сток бренда для cross-cabinet,
            // но только если это не аллоцировано под другой канал (b2b/b2c)
            if (!strictIsolation && g.channelId) return false;
          }
        }
      } else if (channelId === 'b2b') {
        // Если актор не указан, но канал B2B — по умолчанию видим только свободный сток брендов
        if (g.channelId) return false;
      }

      return true;
    })
    .reduce((acc, g) => acc + g.quantity, 0);

  return Math.max(0, rawATP - safetyStock);
}

/**
 * [Phase 2] Инвалидация кэша/агрегата Control при событиях Ledger.
 */
export function shouldInvalidateControl(grain: InventoryGrain): boolean {
  // Инвалидируем, если изменилось критическое состояние (напр. оверсейл или обнуление стока)
  return grain.quantity === 0 || grain.state === 'unavailable';
}
