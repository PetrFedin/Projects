import type { Occasion, StyleMood, ColorPalette, Contrast, Season } from '@/lib/repo/aiStylistRepo';
import type { Audience, Product } from '@/data/products.mock';

export const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: 'Daily', label: 'Повседневный' },
  { id: 'Work', label: 'Работа' },
  { id: 'Date', label: 'Свидание' },
  { id: 'Travel', label: 'Путешествие' },
  { id: 'Event', label: 'Мероприятие' },
  { id: 'Sport', label: 'Спорт' },
  { id: 'Golf', label: 'Гольф' },
  { id: 'Evening', label: 'Вечерний' },
];

export const AUDIENCES: { id: Audience; label: string }[] = [
  { id: 'Man', label: 'Мужчина' },
  { id: 'Woman', label: 'Женщина' },
  { id: 'Boy', label: 'Мальчик' },
  { id: 'Girl', label: 'Девочка' },
  { id: 'Teen', label: 'Подросток' },
  { id: 'Elderly', label: 'Пожилой' },
];

export const MOODS: { id: StyleMood; label: string }[] = [
  { id: 'Minimal', label: 'Минимализм' },
  { id: 'Urban', label: 'Урбан' },
  { id: 'Techwear', label: 'Техно' },
  { id: 'Classic', label: 'Классика' },
  { id: 'SportLuxe', label: 'Спорт-люкс' },
  { id: 'AvantGarde', label: 'Авангард' },
];

export const PALETTES: { id: ColorPalette; label: string }[] = [
  { id: 'Warm', label: 'Теплая' },
  { id: 'Cool', label: 'Холодная' },
  { id: 'Neutral', label: 'Нейтральная' },
  { id: 'Monochrome', label: 'Монохром' },
  { id: 'Vibrant', label: 'Яркая' },
];

export const CONTRASTS: { id: Contrast; label: string }[] = [
  { id: 'High', label: 'Высокий' },
  { id: 'Medium', label: 'Средний' },
  { id: 'Low', label: 'Низкий' },
];

export const SEASONS: { id: Season; label: string }[] = [
  { id: 'Spring', label: 'Весна' },
  { id: 'Summer', label: 'Лето' },
  { id: 'Autumn', label: 'Осень' },
  { id: 'Winter', label: 'Зима' },
];

export const CATEGORIES: { id: Product['category']; label: string }[] = [
  { id: 'Outerwear', label: 'Верхняя одежда' },
  { id: 'Tops', label: 'Верх / Топы' },
  { id: 'Bottoms', label: 'Низ / Брюки' },
  { id: 'Shoes', label: 'Обувь' },
  { id: 'Accessories', label: 'Аксессуары' },
];

export const PREF_COLORS: { id: string; label: string }[] = [
  { id: 'Black', label: 'Чёрный' },
  { id: 'White', label: 'Белый' },
  { id: 'Gray', label: 'Серый' },
  { id: 'Navy', label: 'Тёмно-синий' },
  { id: 'Beige', label: 'Бежевый' },
  { id: 'Cream', label: 'Кремовый' },
  { id: 'Olive', label: 'Оливковый' },
  { id: 'Brown', label: 'Коричневый' },
];

export const FORMATS = [
  {
    id: 'all',
    label: 'Полный образ',
    items: ['Tops', 'Bottoms', 'Shoes'] as Product['category'][],
  },
  { id: 'base', label: 'Только база', items: ['Tops', 'Bottoms'] as Product['category'][] },
  {
    id: 'acc',
    label: 'С аксессуарами',
    items: ['Tops', 'Bottoms', 'Shoes', 'Accessories'] as Product['category'][],
  },
  { id: 'shoes', label: 'Акцент на обувь', items: ['Shoes', 'Bottoms'] as Product['category'][] },
];

export const PREF_STORAGE_KEY = 'syntha_stylist_prefs';
export const SESSION_HISTORY_KEY = 'syntha_stylist_sessions';
export const MAX_SESSIONS = 8;
