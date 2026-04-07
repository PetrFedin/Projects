/**
 * Supl.biz: Поиск поставщиков — реестр по гео и категориям.
 * РФ-рынок: поставщики тканей, фурнитуры, CMT, готовой одежды с фильтром по региону и типу.
 */

export interface SupplierProfile {
  id: string;
  name: string;
  /** Краткое описание */
  description?: string;
  /** Регионы поставки (города/области или «вся РФ») */
  regions: string[];
  /** Категории: ткани, фурнитура, CMT, готовая одежда, крашение, печать */
  categories: string[];
  /** Минимальный объём заказа (опционально) */
  minOrderValue?: number;
  currency: string;
  /** Сертификаты: GOTS, Oeko-Tex и т.д. */
  certifications?: string[];
  /** Контакт */
  contactEmail?: string;
  contactPhone?: string;
  /** Активен в реестре */
  active: boolean;
  updatedAt: string;
}

/** Демо-поставщики для РФ */
export const DEMO_SUPPLIERS: SupplierProfile[] = [
  { id: 'sup1', name: 'Текстиль-М', description: 'Ткани и трикотаж для масс-маркета', regions: ['Москва', 'МО', 'Вся РФ'], categories: ['Ткани'], minOrderValue: 50000, currency: 'RUB', certifications: ['Oeko-Tex'], active: true, updatedAt: '2026-03-01' },
  { id: 'sup2', name: 'Фурнитура Плюс', description: 'Пуговицы, молнии, нитки', regions: ['Санкт-Петербург', 'ЛО', 'Вся РФ'], categories: ['Фурнитура'], minOrderValue: 20000, currency: 'RUB', active: true, updatedAt: '2026-03-01' },
  { id: 'sup3', name: 'CMT Иваново', description: 'Раскрой и пошив под заказ', regions: ['Иваново', 'Ивановская обл.'], categories: ['CMT'], minOrderValue: 100000, currency: 'RUB', certifications: ['GOTS'], active: true, updatedAt: '2026-02-28' },
  { id: 'sup4', name: 'Эко-Текстиль', description: 'Органический хлопок, переработанные материалы', regions: ['Вся РФ'], categories: ['Ткани'], minOrderValue: 80000, currency: 'RUB', certifications: ['GOTS', 'Oeko-Tex'], active: true, updatedAt: '2026-03-01' },
];

export function filterSuppliersByRegion(suppliers: SupplierProfile[], region: string): SupplierProfile[] {
  if (!region) return suppliers;
  return suppliers.filter((s) => s.regions.some((r) => r.toLowerCase().includes(region.toLowerCase())));
}

export function filterSuppliersByCategory(suppliers: SupplierProfile[], category: string): SupplierProfile[] {
  if (!category) return suppliers;
  return suppliers.filter((s) => s.categories.includes(category));
}
