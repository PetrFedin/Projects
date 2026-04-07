/** Стандартная палитра цветов для модной индустрии */
export interface ColorEntry {
  name: string;
  hex: string;
  pantone?: string;
}

export const COLOR_PALETTE: ColorEntry[] = [
  { name: 'Чёрный', hex: '#000000', pantone: 'Black' },
  { name: 'Белый', hex: '#FFFFFF', pantone: 'White' },
  { name: 'Серый', hex: '#808080', pantone: 'Cool Gray 6' },
  { name: 'Тёмно-серый', hex: '#404040', pantone: 'Cool Gray 11' },
  { name: 'Светло-серый', hex: '#C0C0C0', pantone: 'Cool Gray 3' },
  { name: 'Бежевый', hex: '#F5F5DC', pantone: 'Cream' },
  { name: 'Кремовый', hex: '#FFFDD0', pantone: 'Vanilla' },
  { name: 'Шампань', hex: '#F7E7CE', pantone: 'Champagne' },
  { name: 'Коричневый', hex: '#8B4513', pantone: 'Brown' },
  { name: 'Тёмно-коричневый', hex: '#3D2314', pantone: 'Dark Brown' },
  { name: 'Камель', hex: '#C19A6B', pantone: 'Camel' },
  { name: 'Бордовый', hex: '#800020', pantone: 'Burgundy' },
  { name: 'Красный', hex: '#FF0000', pantone: 'Red' },
  { name: 'Тёмно-красный', hex: '#8B0000', pantone: 'Scarlet' },
  { name: 'Коралловый', hex: '#FF7F50', pantone: 'Coral' },
  { name: 'Розовый', hex: '#FFC0CB', pantone: 'Pink' },
  { name: 'Фуксия', hex: '#FF00FF', pantone: 'Fuchsia' },
  { name: 'Сиреневый', hex: '#E6E6FA', pantone: 'Lavender' },
  { name: 'Фиолетовый', hex: '#8B008B', pantone: 'Violet' },
  { name: 'Синий', hex: '#0000FF', pantone: 'Blue' },
  { name: 'Тёмно-синий', hex: '#00008B', pantone: 'Navy Blue' },
  { name: 'Голубой', hex: '#87CEEB', pantone: 'Sky Blue' },
  { name: 'Бирюзовый', hex: '#40E0D0', pantone: 'Turquoise' },
  { name: 'Зелёный', hex: '#008000', pantone: 'Green' },
  { name: 'Оливковый', hex: '#808000', pantone: 'Olive' },
  { name: 'Хаки', hex: '#C3B091', pantone: 'Khaki' },
  { name: 'Жёлтый', hex: '#FFFF00', pantone: 'Yellow' },
  { name: 'Горчичный', hex: '#FFDB58', pantone: 'Mustard' },
  { name: 'Оранжевый', hex: '#FFA500', pantone: 'Orange' },
  { name: 'Терракотовый', hex: '#E2725B', pantone: 'Terracotta' },
  { name: 'Золотой', hex: '#FFD700', pantone: 'Gold' },
  { name: 'Серебряный', hex: '#C0C0C0', pantone: 'Silver' },
  { name: 'Мятный', hex: '#98FF98', pantone: 'Mint' },
  { name: 'Лайм', hex: '#32CD32', pantone: 'Lime' },
  { name: 'Индиго', hex: '#4B0082', pantone: 'Indigo' },
];
