/**
 * Мост между группами каталога обуви (`category-handbook`) и таблицами на /project-info/sizes.
 * EU/UK ряд общий; колодка и конструкция — в ТЗ.
 */

export type FootwearCoverageRow = {
  catalogGroup: string;
  catalogLeaves: string;
  sizeTableTitle: string;
  fetchKey: string;
  notes: string;
};

export const womenFootwearCoverageRows: FootwearCoverageRow[] = [
  {
    catalogGroup: 'Кроссовки · Слипоны · Спортивная',
    catalogLeaves: 'Все листы этих L2',
    sizeTableTitle: 'Женские кроссовки и спортивная обувь',
    fetchKey: 'sneakers',
    notes: 'Кеды и слипоны — та же сетка; полнота и супинатор в модели.',
  },
  {
    catalogGroup: 'Туфли',
    catalogLeaves: 'Классические / лодочки',
    sizeTableTitle: 'Женские туфли и лодочки',
    fetchKey: 'shoes',
    notes: 'Каблук, платформа, полнота.',
  },
  {
    catalogGroup: 'Туфли · Мюли · Сабо · Эспадрильи',
    catalogLeaves: 'Балетки; мюли; сабо; эспадрильи',
    sizeTableTitle: 'Женские балетки, лоферы и мюли',
    fetchKey: 'flats',
    notes: 'Балетки — только Ж/Дв в каталоге. Эспадрильи/сабо: ширина и верёвочный след в ТЗ.',
  },
  {
    catalogGroup: 'Ботинки · Сапоги · Угги и унты',
    catalogLeaves: 'Ботинки; сапоги; валенки; угги; унты',
    sizeTableTitle: 'Женские ботильоны и сапоги',
    fetchKey: 'boots',
    notes: 'Голенище, обхват икры, каблук.',
  },
  {
    catalogGroup: 'Сандалии и шлёпанцы',
    catalogLeaves: 'Сандалии; шлепанцы; босоножки',
    sizeTableTitle: 'Женские сандалии и босоножки',
    fetchKey: 'sandals',
    notes: 'Босоножки в дефолтах каталога только Ж/Дв.',
  },
  {
    catalogGroup: 'Домашняя обувь',
    catalogLeaves: 'Домашняя обувь',
    sizeTableTitle: 'Женская домашняя и медицинская обувь',
    fetchKey: 'homeshoes',
    notes: 'Мягкая колодка.',
  },
];

export const menFootwearCoverageRows: FootwearCoverageRow[] = [
  {
    catalogGroup: 'Кроссовки · Слипоны · Спортивная',
    catalogLeaves: 'Все листы этих L2',
    sizeTableTitle: 'Мужские кроссовки и кеды',
    fetchKey: 'sneakers',
    notes: 'Зальная обувь и кеды — та же EU-шкала.',
  },
  {
    catalogGroup: 'Туфли · Эспадрильи',
    catalogLeaves: 'Классические / лодочки; эспадрильи',
    sizeTableTitle: 'Мужские туфли и лоферы',
    fetchKey: 'shoes',
    notes: 'Лоферы, оксфорды; эспадрильи — плетёный след в ТЗ. Балеток нет.',
  },
  {
    catalogGroup: 'Мокасины и топсайдеры',
    catalogLeaves: 'Мокасины; топсайдеры',
    sizeTableTitle: 'Мужские туфли и лоферы',
    fetchKey: 'shoes',
    notes: 'Низкий профиль; шнуровка/прошва в ТЗ.',
  },
  {
    catalogGroup: 'Ботинки · Сапоги · Угги и унты',
    catalogLeaves: 'Ботинки; сапоги; валенки; угги; унты',
    sizeTableTitle: 'Мужские ботинки и сапоги',
    fetchKey: 'boots',
    notes: 'Челси, тхэки, зима — одна сетка стопы.',
  },
  {
    catalogGroup: 'Сандалии и шлёпанцы',
    catalogLeaves: 'Сандалии; шлепанцы',
    sizeTableTitle: 'Мужские сандалии и шлёпанцы',
    fetchKey: 'sandals',
    notes: 'Босоножек в каталоге для М/Мл нет.',
  },
  {
    catalogGroup: 'Мюли · Сабо',
    catalogLeaves: 'Мюли; сабо',
    sizeTableTitle: 'Мужские сандалии и шлёпанцы',
    fetchKey: 'sandals',
    notes: 'Редко; габариты сабо дополнительно в ТЗ.',
  },
  {
    catalogGroup: 'Домашняя обувь',
    catalogLeaves: 'Домашняя обувь',
    sizeTableTitle: 'Мужская домашняя обувь',
    fetchKey: 'homeshoes',
    notes: 'Тапочки, чувяки.',
  },
];
