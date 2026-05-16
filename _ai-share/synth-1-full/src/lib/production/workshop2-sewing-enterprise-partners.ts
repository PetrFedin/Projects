/** Демо-справочник предприятий / партнёров для контура пошива (до интеграции с B2B API). */
export type SewingEnterprisePartnerOption = {
  id: string;
  label: string;
  capabilities?: string[];
  machines?: string[];
  materialsExpertise?: string[];
};

export const SEWING_ENTERPRISE_PARTNER_OPTIONS: readonly SewingEnterprisePartnerOption[] = [
  {
    id: 'syntha-lab',
    label: 'Syntha Lab · Москва (демо B2B)',
    capabilities: ['Разработка лекал', 'Пошив образцов', 'Градация'],
    machines: ['Прямострочная', 'Оверлок 4-ниточный', 'Петельная'],
    materialsExpertise: ['Хлопок', 'Шелк', 'Трикотаж'],
  },
  {
    id: 'nordic-wool',
    label: 'Nordic Wool · Санкт-Петербург (демо B2B)',
    capabilities: ['Вязание', 'Сборка трикотажа', 'ВТО'],
    machines: ['Плоскошовная', 'Кеттельная', 'Вязальная машина 5 класс'],
    materialsExpertise: ['Шерсть', 'Кашемир', 'Смесовая пряжа'],
  },
  {
    id: 'factory-01',
    label: 'Factory 01',
    capabilities: ['Массовый пошив', 'Упаковка', 'Маркировка'],
    machines: ['Прямострочная автомат', 'Оверлок 5-ниточный', 'Пуговичная'],
    materialsExpertise: ['Деним', 'Костюмные ткани', 'Синтетика'],
  },
  {
    id: 'factory-02',
    label: 'Factory 02',
    capabilities: ['Пошив верхней одежды', 'Сложные узлы', 'Контроль качества'],
    machines: ['Прямострочная', 'Пресс для дублирования', 'Закрепочная'],
    materialsExpertise: ['Пальтовые ткани', 'Курточные ткани', 'Утеплители'],
  },
];
