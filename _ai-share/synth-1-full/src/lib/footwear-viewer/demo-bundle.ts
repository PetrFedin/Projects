import type { BottomWearPairingPreset, FootwearScanBundle } from './types';

/** Демо-ракурсы: стабильные картинки (picsum seeds). В проде — свои съёмки / выгрузка из скана. */
const seed = (s: string) => `https://picsum.photos/seed/${s}/720/720`;

export const DEMO_FOOTWEAR_BUNDLE: FootwearScanBundle = {
  skuId: 'SKU-FOOT-DEMO',
  name: 'Кроссовки SS26 (демо)',
  model3dUrl: undefined,
  scan: {
    source: 'photogrammetry',
    capturedAt: '2026-03-01',
    notes: 'Облако точек → mesh → текстуры; или загрузка GLB из студии.',
  },
  angles: [
    { id: 'front', label: 'Спереди', imageUrl: seed('shoe-front'), sequenceIndex: 0 },
    { id: 'three_quarter_left', label: '3/4 слева', imageUrl: seed('shoe-34l'), sequenceIndex: 1 },
    { id: 'side_left', label: 'Слева', imageUrl: seed('shoe-side-l'), sequenceIndex: 2 },
    { id: 'back', label: 'Сзади', imageUrl: seed('shoe-back'), sequenceIndex: 3 },
    { id: 'side_right', label: 'Справа', imageUrl: seed('shoe-side-r'), sequenceIndex: 4 },
    {
      id: 'three_quarter_right',
      label: '3/4 справа',
      imageUrl: seed('shoe-34r'),
      sequenceIndex: 5,
    },
    { id: 'top', label: 'Сверху', imageUrl: seed('shoe-top'), sequenceIndex: 6 },
    { id: 'sole', label: 'Подошва', imageUrl: seed('shoe-sole'), sequenceIndex: 7 },
  ],
};

export const DEMO_PAIRING_PRESETS: BottomWearPairingPreset[] = [
  {
    id: 'jeans-mid',
    label: 'Джинсы',
    category: 'jeans',
    fabricHint: 'Деним средней плотности, индиго',
    colorName: 'Индиго',
    colorHex: '#1e3a5f',
    pairingPreviewUrl: seed('pair-jeans'),
  },
  {
    id: 'chinos-sand',
    label: 'Чино',
    category: 'trousers',
    fabricHint: 'Хлопок саржа',
    colorName: 'Песочный',
    colorHex: '#c4a574',
    pairingPreviewUrl: seed('pair-chinos'),
  },
  {
    id: 'dress-grey',
    label: 'Брюки костюмные',
    category: 'dress_pants',
    fabricHint: 'Шерсть супер 100',
    colorName: 'Серый меланж',
    colorHex: '#6b7280',
    pairingPreviewUrl: seed('pair-suit'),
  },
  {
    id: 'joggers-black',
    label: 'Спортивные',
    category: 'joggers',
    fabricHint: 'Флис / трикотаж',
    colorName: 'Чёрный',
    colorHex: '#111827',
    pairingPreviewUrl: seed('pair-jogger'),
  },
  {
    id: 'shorts-linen',
    label: 'Шорты',
    category: 'shorts',
    fabricHint: 'Лён',
    colorName: 'Натуральный лён',
    colorHex: '#d6c4a8',
    pairingPreviewUrl: seed('pair-shorts'),
  },
];
