/**
 * Мост «группы каталога → блоки на /project-info/sizes» для одежды, сумок и аксессуаров.
 * Тот же формат строк, что у обуви (`FootwearCoverageRow`).
 */

import type { FootwearCoverageRow } from '@/lib/footwear-size-coverage';

export const womenApparelCoverageRows: FootwearCoverageRow[] = [
  {
    catalogGroup: 'Одежда › Верхняя одежда',
    catalogLeaves: 'Пальто, куртки, пуховики, парки…',
    sizeTableTitle: 'Женская верхняя одежда',
    fetchKey: 'outerwear',
    notes: 'JSON: size-chart-outerwear.json',
  },
  {
    catalogGroup: 'Одежда › Костюмы и жакеты',
    catalogLeaves: 'Костюмы, блейзеры, пиджаки…',
    sizeTableTitle: 'Женские костюмы и жакеты',
    fetchKey: 'suits',
    notes: '—',
  },
  {
    catalogGroup: 'Одежда › Платья и сарафаны',
    catalogLeaves: 'Платья, сарафаны',
    sizeTableTitle: 'Женские платья и сарафаны',
    fetchKey: 'dresses',
    notes: '—',
  },
  {
    catalogGroup: 'Одежда › Юбки',
    catalogLeaves: 'Юбки',
    sizeTableTitle: 'Женские юбки',
    fetchKey: 'skirts',
    notes: '—',
  },
  {
    catalogGroup: 'Одежда › Рубашки и блузы',
    catalogLeaves: 'Рубашки, блузы',
    sizeTableTitle: 'Женские рубашки и блузы',
    fetchKey: 'shirts',
    notes: 'Встроенная таблица (sizes.ts), не JSON',
  },
  {
    catalogGroup: 'Одежда › Топы и футболки',
    catalogLeaves: 'Топы, футболки, поло, майки…',
    sizeTableTitle: 'Женские топы и футболки',
    fetchKey: 'tops',
    notes: '—',
  },
  {
    catalogGroup: 'Одежда › Джинсы',
    catalogLeaves: 'Джинсы',
    sizeTableTitle: 'Женские джинсы',
    fetchKey: 'jeans',
    notes: '—',
  },
  {
    catalogGroup: 'Одежда › Брюки',
    catalogLeaves: 'Классические, чиносы, карго…',
    sizeTableTitle: 'Женские брюки',
    fetchKey: 'trousers',
    notes: '—',
  },
  {
    catalogGroup: 'Одежда › Трикотаж',
    catalogLeaves: 'Свитеры, худи, кардиганы…',
    sizeTableTitle: 'Женский трикотаж',
    fetchKey: 'knitwear',
    notes: '—',
  },
  {
    catalogGroup: 'Одежда › Нижнее бельё; Пижамы и домашняя одежда',
    catalogLeaves: 'Бельё; халаты, комплекты…',
    sizeTableTitle: 'Женское нижнее бельё и домашняя одежда',
    fetchKey: 'lingerie',
    notes: '—',
  },
  {
    catalogGroup: 'Одежда › Спортивная одежда',
    catalogLeaves: 'Спортивная одежда',
    sizeTableTitle: 'Женская спортивная одежда',
    fetchKey: 'sportswear',
    notes: '—',
  },
  {
    catalogGroup: 'Одежда › Пляжная мода',
    catalogLeaves: 'Пляжная мода',
    sizeTableTitle: 'Женская пляжная мода',
    fetchKey: 'beachwear',
    notes: '—',
  },
  {
    catalogGroup: 'Доп. линия размеров',
    catalogLeaves: 'Для беременных',
    sizeTableTitle: 'Женская одежда для беременных',
    fetchKey: 'maternity',
    notes: 'Нет отдельного L2 в дереве каталога; при отсутствии JSON — women-apparel',
  },
  {
    catalogGroup: 'Доп. линия размеров',
    catalogLeaves: 'Адаптивная одежда',
    sizeTableTitle: '♿ Женская одежда для ограниченной подвижности',
    fetchKey: 'adaptive',
    notes: '—',
  },
];

export const menApparelCoverageRows: FootwearCoverageRow[] = [
  {
    catalogGroup: 'Одежда › Верхняя одежда',
    catalogLeaves: 'Пальто, куртки, пуховики…',
    sizeTableTitle: 'Мужская верхняя одежда',
    fetchKey: 'outerwearMen',
    notes: 'JSON: size-chart-outerwear-men.json',
  },
  {
    catalogGroup: 'Одежда › Костюмы и жакеты',
    catalogLeaves: 'Костюмы, пиджаки, жилеты…',
    sizeTableTitle: 'Мужские костюмы и пиджаки',
    fetchKey: 'suitsMen',
    notes: '—',
  },
  {
    catalogGroup: 'Одежда › Рубашки и блузы',
    catalogLeaves: 'Рубашки',
    sizeTableTitle: 'Мужские рубашки',
    fetchKey: 'shirts',
    notes: 'Встроенная таблица (sizes.ts)',
  },
  {
    catalogGroup: 'Одежда › Топы и футболки',
    catalogLeaves: 'Футболки, поло, майки…',
    sizeTableTitle: 'Мужские футболки и поло',
    fetchKey: 'topsMen',
    notes: '—',
  },
  {
    catalogGroup: 'Одежда › Джинсы',
    catalogLeaves: 'Джинсы',
    sizeTableTitle: 'Мужские джинсы',
    fetchKey: 'jeansMen',
    notes: '—',
  },
  {
    catalogGroup: 'Одежда › Брюки',
    catalogLeaves: 'Классические, чиносы, карго…',
    sizeTableTitle: 'Мужские брюки',
    fetchKey: 'trousersMen',
    notes: '—',
  },
  {
    catalogGroup: 'Одежда › Трикотаж',
    catalogLeaves: 'Свитеры, худи, кардиганы…',
    sizeTableTitle: 'Мужской трикотаж',
    fetchKey: 'knitwearMen',
    notes: '—',
  },
  {
    catalogGroup: 'Одежда › Нижнее бельё; Пижамы и домашняя одежда',
    catalogLeaves: 'Бельё; домашняя линия',
    sizeTableTitle: 'Мужское нижнее бельё и домашняя одежда',
    fetchKey: 'lingerie',
    notes: 'Общий ключ JSON (без суффикса Men)',
  },
  {
    catalogGroup: 'Одежда › Спортивная одежда',
    catalogLeaves: 'Спортивная одежда',
    sizeTableTitle: 'Мужская спортивная одежда',
    fetchKey: 'sportswearMen',
    notes: '—',
  },
];

const bagsL2 = 'Повседневные · Вечерние · Чемоданы · Рабочные · Спортивные и дорожные · Косметички';

export const womenBagsCoverageRows: FootwearCoverageRow[] = [
  {
    catalogGroup: `Сумки › ${bagsL2}`,
    catalogLeaves: 'Тот, шоппер, кросс-боди, клатч, рюкзак, портфель, чемодан…',
    sizeTableTitle: 'Женские сумки',
    fetchKey: 'bags',
    notes: 'Один JSON size-chart-bags.json; women-bags в Цехе',
  },
];

export const menBagsCoverageRows: FootwearCoverageRow[] = [
  {
    catalogGroup: `Сумки › ${bagsL2}`,
    catalogLeaves: 'Те же L2; мужские силуэты',
    sizeTableTitle: 'Мужские сумки',
    fetchKey: 'bags',
    notes: 'Тот же JSON; men-bags в Цехе',
  },
];

/** Женские аксессуары: L1 каталога → блоки страницы */
export const womenAccessoriesCoverageRows: FootwearCoverageRow[] = [
  {
    catalogGroup: 'Головные уборы › кепки, панамы, шляпы…',
    catalogLeaves: 'Кепки; панамы; шляпы; береты; шапки…',
    sizeTableTitle: 'Головные уборы (общая таблица Alpha)',
    fetchKey: 'accessory-sizes / hats',
    notes: 'Плюс числовые женские таблицы и фасоны ниже',
  },
  {
    catalogGroup: 'Аксессуары › Перчатки и варежки',
    catalogLeaves: 'Перчатки; варежки',
    sizeTableTitle: 'Перчатки',
    fetchKey: 'accessory-sizes / gloves',
    notes: '—',
  },
  {
    catalogGroup: 'Аксессуары › Ремни и подтяжки',
    catalogLeaves: 'Ремни; подтяжки',
    sizeTableTitle: 'Ремни',
    fetchKey: 'accessory-sizes / belts',
    notes: '—',
  },
  {
    catalogGroup: 'Аксессуары › Шарфы; Платки',
    catalogLeaves: 'Шарфы; платки',
    sizeTableTitle: 'Шарфы, палантины, платки',
    fetchKey: 'accessory-sizes / scarves',
    notes: '—',
  },
  {
    catalogGroup: 'Аксессуары › Очки',
    catalogLeaves: 'Очки',
    sizeTableTitle: 'Очки',
    fetchKey: 'accessory-sizes / glasses',
    notes: '—',
  },
  {
    catalogGroup: 'Аксессуары › Украшения; Кольца в таблице',
    catalogLeaves: 'Украшения; бижутерия (частично)',
    sizeTableTitle: 'Кольца',
    fetchKey: 'accessory-sizes / rings',
    notes: '—',
  },
  {
    catalogGroup: 'Аксессуары › Кожгалантерея мелкая',
    catalogLeaves: 'Кошельки, визитницы…',
    sizeTableTitle: 'Кошельки',
    fetchKey: 'accessory-sizes / wallets',
    notes: '—',
  },
  {
    catalogGroup: 'Аксессуары › Зонты',
    catalogLeaves: 'Зонты',
    sizeTableTitle: 'Зонты',
    fetchKey: 'accessory-sizes / umbrellas',
    notes: '—',
  },
  {
    catalogGroup: 'Носочно-чулочные',
    catalogLeaves: 'Носки, чулки (L1 каталога)',
    sizeTableTitle: 'Носки и чулки',
    fetchKey: 'accessory-sizes / socks',
    notes: '—',
  },
  {
    catalogGroup: 'Женская сводка; мех',
    catalogLeaves: 'women-accessories; women-fur (production-params)',
    sizeTableTitle: 'Сводная Alpha; меховые изделия (женские)',
    fetchKey: 'accessory-sizes / summary + fur table',
    notes: 'Шкалы Цеха: women-headwear, women-fur, women-accessories',
  },
];

export const menAccessoriesCoverageRows: FootwearCoverageRow[] = [
  {
    catalogGroup: 'Головные уборы › кепки, панамы, шляпы…',
    catalogLeaves: 'Кепки; панамы; шляпы; шапки…',
    sizeTableTitle: 'Головные уборы (общая таблица Alpha) + мужские габариты по размеру',
    fetchKey: 'accessory-sizes / hats + headwear men',
    notes: 'Без отдельной таблицы фасонов (только у женской вкладки)',
  },
  ...womenAccessoriesCoverageRows.slice(1, -1),
  {
    catalogGroup: 'Мужская сводка; мех',
    catalogLeaves: 'men-accessories; men-fur',
    sizeTableTitle: 'Сводная Alpha; меховые изделия (мужские)',
    fetchKey: 'accessory-sizes / summary + fur table',
    notes: 'Шкалы Цеха: men-headwear, men-fur, men-accessories',
  },
];
