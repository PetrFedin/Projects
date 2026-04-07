/**
 * Шаблоны техзаданий (ТЗ) для коллекций и артикулов
 */

export interface TzTemplate {
  id: string;
  name: string;
  description: string;
  fields: string[]; // обязательные поля ТЗ
}

export const TZ_TEMPLATES: TzTemplate[] = [
  { id: 'basic', name: 'Базовое ТЗ', description: 'Название, категория, материалы, размеры', fields: ['name', 'category', 'materials', 'sizes'] },
  { id: 'full', name: 'Полное ТЗ', description: 'Все поля + конструкция, отделка, маркировка', fields: ['name', 'category', 'materials', 'sizes', 'construction', 'finish', 'labeling'] },
  { id: 'sustainable', name: 'Эко-ТЗ', description: 'Сертификаты, переработанные материалы', fields: ['name', 'category', 'materials', 'certifications', 'recycled'] },
];
