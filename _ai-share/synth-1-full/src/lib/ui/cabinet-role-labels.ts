const ROLE_RU: Record<string, string> = {
  admin: 'Администратор',
  brand: 'Бренд',
  retailer: 'Ритейлер',
  buyer: 'Байер',
  distributor: 'Дистрибутор',
  manufacturer: 'Производитель',
  supplier: 'Поставщик',
  designer: 'Дизайнер',
  technologist: 'Технолог',
  production_manager: 'Руководитель производства',
  finance_manager: 'Финансовый менеджер',
  sales_rep: 'Торговый представитель',
  merchandiser: 'Мерчендайзер',
  client: 'Клиент',
};

/** Родительный падеж (для кого): «для клиента», «для байера». */
const ROLE_RU_GENITIVE: Record<string, string> = {
  admin: 'администратора',
  brand: 'бренда',
  retailer: 'ритейлера',
  buyer: 'байера',
  distributor: 'дистрибутора',
  manufacturer: 'производителя',
  supplier: 'поставщика',
  designer: 'дизайнера',
  technologist: 'технолога',
  production_manager: 'руководителя производства',
  finance_manager: 'финансового менеджера',
  sales_rep: 'торгового представителя',
  merchandiser: 'мерчендайзера',
  client: 'клиента',
};

/** Подпись роли для бейджей кабинетов (без capitalize латиницы). */
export function cabinetRoleLabelRu(role: string): string {
  return ROLE_RU[role] ?? role.replace(/_/g, ' ');
}

/** Форма после предлога «для …» (родительный падеж). */
export function cabinetRoleLabelRuGenitive(role: string): string {
  return ROLE_RU_GENITIVE[role] ?? cabinetRoleLabelRu(role).toLowerCase();
}
