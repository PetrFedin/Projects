export interface PriceComparisonEntry {
  platform: string;
  logoUrl: string;
  price: number;
  originalPrice?: number;
  availability: 'in_stock' | 'pre_order' | 'out_of_stock';
  url: string;
  location: string;
}

export interface PriceComparisonData {
  lastChecked: string;
  offers: PriceComparisonEntry[];
}

export const priceComparisonData: Record<string, PriceComparisonData> = {
  '1': {
    // Product ID for 'Кашемировый свитер с круглым вырезом'
    lastChecked: 'сегодня в 14:30',
    offers: [
      {
        platform: 'Syntha',
        logoUrl: '/logo_placeholder.svg', // Assuming you have a local logo
        price: 24500,
        availability: 'in_stock',
        url: '#',
        location: 'Россия',
      },
      {
        platform: 'Универмаг "Центральный"',
        logoUrl: 'https://i.imgur.com/JMgcWwL.png',
        price: 26800,
        availability: 'in_stock',
        url: '#',
        location: 'Россия',
      },
      {
        platform: 'Онлайн-маркетплейс "Экспресс"',
        logoUrl: 'https://i.imgur.com/2s2nSqt.png',
        price: 25500,
        originalPrice: 28000,
        availability: 'out_of_stock',
        url: '#',
        location: 'Казахстан',
      },
      {
        platform: 'Farfetch',
        logoUrl: 'https://i.imgur.com/DkI7OZX.png',
        price: 31000,
        availability: 'in_stock',
        url: '#',
        location: 'Международный',
      },
    ],
  },
};
