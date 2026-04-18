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

/** Подпись роли для бейджей кабинетов (без capitalize латиницы). */
export function cabinetRoleLabelRu(role: string): string {
  return ROLE_RU[role] ?? role.replace(/_/g, ' ');
}
