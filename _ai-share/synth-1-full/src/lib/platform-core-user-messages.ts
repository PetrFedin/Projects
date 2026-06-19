/** Пользовательские сообщения Platform Core — без npm/dev-ops на investor surfaces. */

export const PLATFORM_CORE_PG_UNAVAILABLE_RU =
  'Данные коллекции временно недоступны. Обновите страницу или откройте основную коллекцию с хаба.';

export const PLATFORM_CORE_ORDERS_UNAVAILABLE_RU =
  'Реестр оптовых заказов временно недоступен. Попробуйте обновить страницу.';

export const PLATFORM_CORE_ORDER_UNAVAILABLE_RU =
  'Карточка заказа временно недоступна. Попробуйте обновить страницу.';

export const PLATFORM_CORE_SHOWROOM_UNAVAILABLE_RU =
  'Витрина коллекции пока пуста или ещё не опубликована брендом.';

export const PLATFORM_CORE_QUEUE_UNAVAILABLE_RU =
  'Очередь временно недоступна. Откройте раздел позже или перейдите с хаба платформы.';

export const PLATFORM_CORE_BOM_UNAVAILABLE_RU =
  'Спецификация материалов ещё не заполнена в досье артикула.';

export const PLATFORM_CORE_READINESS_PG_UNAVAILABLE_RU =
  'Живые оценки недоступны — показаны ориентиры по сценарию.';

export const PLATFORM_CORE_READINESS_STATIC_RU =
  'Цепочка ещё не синхронизирована — показаны ориентиры по этапам.';

export const PLATFORM_CORE_HUB_STATIC_DISCLAIMER_RU =
  'Без активной коллекции хаб показывает ориентиры по этапам. Откройте основную коллекцию для полного сценария.';

export const PLATFORM_CORE_LINESETS_UNAVAILABLE_RU =
  'Список лайншитов временно недоступен. Проверьте публикацию коллекции у бренда.';

/** Честный empty state лайншита (не ошибка API). */
export function platformCoreLinesheetEmptyMessageRu(collectionId: string): string {
  const id = collectionId.trim().toUpperCase();
  if (id === 'EMPTY27' || id.startsWith('EMPTY')) {
    return 'Коллекция без опубликованных артикулов — лайншит пустой. Для сценария заказа откройте SS27 или опубликуйте артикул в цехе разработки.';
  }
  return `Нет опубликованных артикулов для ${collectionId}. Опубликуйте витрину в цехе разработки — строки появятся здесь автоматически.`;
}

/** Подпись у disabled PDF-ссылки (честно для EMPTY27 и до publish). */
export function platformCoreLinesheetPdfDisabledMessageRu(collectionId: string): string {
  const id = collectionId.trim().toUpperCase();
  if (id === 'EMPTY27' || id.startsWith('EMPTY')) {
    return 'PDF недоступен: пустая коллекция без publish. Для сценария — SS27.';
  }
  return 'PDF появится после публикации артикулов на витрине.';
}

export const PLATFORM_CORE_MESSAGES_UNAVAILABLE_RU =
  'Переписка по заказам временно недоступна. Попробуйте открыть чат из реестра заказа.';

export const PLATFORM_CORE_RANGE_PLANNER_UNAVAILABLE_RU =
  'Состав коллекции ещё не загружен — откройте планировщик после публикации артикулов в разработке.';

export const PLATFORM_CORE_HANDOFF_QUEUE_UNAVAILABLE_RU =
  'Очередь передачи в производство временно недоступна. Попробуйте обновить страницу.';

export const PLATFORM_CORE_RETAILER_NO_ORDERS_RU = 'Нет заказов по этому партнёру.';

export const PLATFORM_CORE_EMPTY_CHAIN_BANNER_RU =
  'Для этой коллекции нет данных — хаб показывает нулевые статусы и пустые реестры. Сравните с основной коллекцией после загрузки сценария.';

export const PLATFORM_CORE_ROLE_EMPTY_PILLAR_RU =
  'На этом этапе цепочки ваша роль не ведёт работу — перейдите к участникам ниже.';

export const PLATFORM_CORE_SUPPLIER_BOM_EMPTY_RU =
  'Состав материалов пуст. Запросите спецификацию у бренда в чате по артикулу.';
