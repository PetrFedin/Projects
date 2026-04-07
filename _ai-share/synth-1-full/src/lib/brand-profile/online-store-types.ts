/**
 * Интернет-магазины: типы и статусы синхронизации с участниками платформы.
 * Бренд может добавить магазин из списка участников или вручную.
 * Магазин, зарегистрировавшийся позже, может найти и подтвердить связь.
 */

/** Статус синхронизации бренд ↔ магазин */
export type OnlineStoreSyncStatus =
  | 'manual'               // Добавлено вручную, без привязки к участнику
  | 'linked'               // Бренд выбрал из участников, ждёт подтверждения магазина
  | 'pending_confirmation' // То же что linked (алиас)
  | 'confirmed';           // Магазин подтвердил — двусторонняя связь

export interface OnlineStore {
  id: string;
  name: string;
  productUrl: string;
  parsingEnabled: boolean;
  /** ID участника платформы (shop), если выбран из списка */
  platformShopId?: string;
  /** Статус синхронизации с магазином */
  syncStatus?: OnlineStoreSyncStatus;
}

/** Участник платформы (магазин) для выбора при добавлении интернет-магазина */
export interface PlatformShop {
  id: string;
  name: string;
  nameAlt?: string;
  city?: string;
  type?: string;
  logoUrl?: string;
  website?: string;
  /** Ссылка на каталог бренда (если есть) */
  productUrl?: string;
}
