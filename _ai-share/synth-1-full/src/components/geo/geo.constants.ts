import { CisCode, CountryView } from './geo.types';

export const CIS_CODES: CisCode[] = [
  'RU',
  'BY',
  'UA',
  'KZ',
  'AM',
  'AZ',
  'KG',
  'UZ',
  'TJ',
  'TM',
  'MD',
  'GE',
];

export const CIS_VIEW_DATA: Record<CisCode, CountryView> = {
  RU: {
    code: 'RU',
    name: 'Россия',
    viewers: 15400,
    cities: [
      { name: 'Москва (Центральный ФО)', viewers: 6400, lon: 37.6173, lat: 55.7558 },
      { name: 'Санкт-Петербург (Северо-Запад)', viewers: 2200, lon: 30.3141, lat: 59.9386 },
      { name: 'Новосибирск (Сибирь)', viewers: 1800, lon: 82.9346, lat: 55.0084 },
      { name: 'Екатеринбург (Урал)', viewers: 1200, lon: 60.6057, lat: 56.8389 },
      { name: 'Казань (Поволжье)', viewers: 950, lon: 49.1064, lat: 55.7887 },
      { name: 'Краснодар (Юг)', viewers: 800, lon: 38.9769, lat: 45.0355 },
      { name: 'Самара (Поволжье)', viewers: 750, lon: 50.1001, lat: 53.2415 },
      { name: 'Ростов-на-Дону (Юг)', viewers: 700, lon: 39.7233, lat: 47.2313 },
      { name: 'Владивосток (Дальний Восток)', viewers: 600, lon: 131.8853, lat: 43.1155 },
    ],
  },
  BY: {
    code: 'BY',
    name: 'Беларусь',
    viewers: 2200,
    cities: [
      { name: 'Минск', viewers: 1500, lon: 27.5615, lat: 53.9023 },
      { name: 'Брест', viewers: 400, lon: 23.6848, lat: 52.0975 },
    ],
  },
  UA: {
    code: 'UA',
    name: 'Украина',
    viewers: 4100,
    cities: [
      { name: 'Киев', viewers: 2200, lon: 30.5234, lat: 50.4501 },
      { name: 'Одесса', viewers: 900, lon: 30.7233, lat: 46.4825 },
    ],
  },
  KZ: {
    code: 'KZ',
    name: 'Казахстан',
    viewers: 4200,
    cities: [
      { name: 'Алматы', viewers: 2100, lon: 76.885, lat: 43.2389 },
      { name: 'Астана', viewers: 1200, lon: 71.4382, lat: 51.1694 },
      { name: 'Шымкент', viewers: 900, lon: 69.5901, lat: 42.3249 },
    ],
  },
  AM: {
    code: 'AM',
    name: 'Армения',
    viewers: 700,
    cities: [{ name: 'Ереван', viewers: 600, lon: 44.5152, lat: 40.1872 }],
  },
  AZ: {
    code: 'AZ',
    name: 'Азербайджан',
    viewers: 800,
    cities: [{ name: 'Баку', viewers: 700, lon: 49.8671, lat: 40.4093 }],
  },
  KG: {
    code: 'KG',
    name: 'Киргизия',
    viewers: 600,
    cities: [{ name: 'Бишкек', viewers: 500, lon: 74.6122, lat: 42.8746 }],
  },
  UZ: {
    code: 'UZ',
    name: 'Узбекистан',
    viewers: 1450,
    cities: [
      { name: 'Ташкент', viewers: 1100, lon: 69.2401, lat: 41.2995 },
      { name: 'Самарканд', viewers: 350, lon: 66.9597, lat: 39.627 },
    ],
  },
  TJ: {
    code: 'TJ',
    name: 'Таджикистан',
    viewers: 520,
    cities: [{ name: 'Душанбе', viewers: 450, lon: 68.7791, lat: 38.5598 }],
  },
  TM: {
    code: 'TM',
    name: 'Туркменистан',
    viewers: 480,
    cities: [{ name: 'Ашхабад', viewers: 420, lon: 58.3833, lat: 37.95 }],
  },
  MD: {
    code: 'MD',
    name: 'Молдова',
    viewers: 430,
    cities: [{ name: 'Кишинёв', viewers: 380, lon: 28.8638, lat: 47.0105 }],
  },
  GE: {
    code: 'GE',
    name: 'Грузия',
    viewers: 900,
    cities: [{ name: 'Тбилиси', viewers: 700, lon: 44.8016, lat: 41.7151 }],
  },
};
