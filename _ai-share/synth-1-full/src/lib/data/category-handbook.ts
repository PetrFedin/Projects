/**
 * Справочник категорий — снимок строится через `npm run gen:category-catalog`.
 * Иерархия: Ур.1 → Ур.2 → лист (ур.3 в таблице). Одна запись «Каталог» без разбиения по аудиториям.
 * Файл сгенерирован скриптом `scripts/generate-category-handbook.py` (не править дерево руками).
 *
 * Производство и интеграции по листу (`leafId`): дефолты и переопределения — `category-leaf-production.ts`,
 * алиасы таксономии в снимке v2, оси атрибутов карточки — `info-pick-attribute-keys` + `product-attributes`
 * (узловые `CategoryNode.attributes` — опционально, см. `CategoryAttributeBindingSource` в типах производства).
 * Источник правды по осям подборки: по умолчанию только `info-pick` + `product-attributes`; дерево узлов не дублирует их без явного `hybrid`.
 */

export interface CategoryAttribute {
  id: string;
  name: string;
  type: 'select' | 'multiselect' | 'text' | 'number';
  options?: string[];
  required?: boolean;
}

export interface CategoryNode {
  id: string;
  name: string;
  children?: CategoryNode[];
  attributes?: CategoryAttribute[];
}

export interface Audience {
  id: string;
  name: string;
  categories: CategoryNode[];
}

export const GLOBAL_ATTRIBUTES: CategoryAttribute[] = [
  {
    id: 'color',
    name: 'Цвет',
    type: 'select',
    options: ['Чёрный', 'Белый', 'Тёмно-синий', 'Серый', 'Бежевый', 'Красный'],
  },
  {
    id: 'season',
    name: 'Сезон',
    type: 'select',
    options: ['Весна–лето', 'Осень–зима', 'Круиз', 'Пре-осень'],
  },
  { id: 'composition', name: 'Состав', type: 'text' },
  {
    id: 'countryOfOrigin',
    name: 'Страна производства',
    type: 'select',
    options: ['Россия', 'Китай', 'Турция', 'Италия', 'Вьетнам'],
  },
];


export const CATEGORY_HANDBOOK: Audience[] = [
  {
    id: 'catalog',
    name: 'Каталог',
    categories: [
      {
        id: 'catalog-apparel',
        name: 'Одежда',
        children: [
          {
            id: 'catalog-apparel-g0',
            name: 'Верхняя одежда',
            children: [
              { id: 'catalog-apparel-g0-l0', name: 'Пальто' },
              { id: 'catalog-apparel-g0-l1', name: 'Тренчи' },
              { id: 'catalog-apparel-g0-l2', name: 'Парки' },
              { id: 'catalog-apparel-g0-l3', name: 'Пуховики' },
              { id: 'catalog-apparel-g0-l4', name: 'Куртки' },
              { id: 'catalog-apparel-g0-l5', name: 'Бомберы' },
              { id: 'catalog-apparel-g0-l6', name: 'Ветровки' },
              { id: 'catalog-apparel-g0-l7', name: 'Жилеты' },
              { id: 'catalog-apparel-g0-l8', name: 'Плащи' },
              { id: 'catalog-apparel-g0-l9', name: 'Дождевики' },
              { id: 'catalog-apparel-g0-l10', name: 'Пончо' },
              { id: 'catalog-apparel-g0-l11', name: 'Шубы' },
              { id: 'catalog-apparel-g0-l12', name: 'Лайнеры' },
              { id: 'catalog-apparel-g0-l13', name: 'Подстёжки' },
              { id: 'catalog-apparel-g0-l14', name: 'Комбинезоны' },
            ],
          },
          {
            id: 'catalog-apparel-g1',
            name: 'Костюмы и жакеты',
            children: [
              { id: 'catalog-apparel-g1-l0', name: 'Костюмы' },
              { id: 'catalog-apparel-g1-l1', name: 'Блейзеры' },
              { id: 'catalog-apparel-g1-l2', name: 'Смокинги' },
              { id: 'catalog-apparel-g1-l3', name: 'Фраки' },
              { id: 'catalog-apparel-g1-l4', name: 'Пиджаки' },
              { id: 'catalog-apparel-g1-l5', name: 'Жилеты' },
            ],
          },
          {
            id: 'catalog-apparel-g2',
            name: 'Платья и сарафаны',
            children: [
              { id: 'catalog-apparel-g2-l0', name: 'Платья' },
              { id: 'catalog-apparel-g2-l1', name: 'Сарафаны' },
            ],
          },
          {
            id: 'catalog-apparel-g3',
            name: 'Юбки',
            children: [
              { id: 'catalog-apparel-g3-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-apparel-g4',
            name: 'Рубашки и блузы',
            children: [
              { id: 'catalog-apparel-g4-l0', name: 'Рубашки' },
              { id: 'catalog-apparel-g4-l1', name: 'Блузы' },
            ],
          },
          {
            id: 'catalog-apparel-g5',
            name: 'Топы и футболки',
            children: [
              { id: 'catalog-apparel-g5-l0', name: 'Топы' },
              { id: 'catalog-apparel-g5-l1', name: 'Футболки' },
              { id: 'catalog-apparel-g5-l2', name: 'Поло' },
              { id: 'catalog-apparel-g5-l3', name: 'Майки' },
              { id: 'catalog-apparel-g5-l4', name: 'Кроп-топы' },
            ],
          },
          {
            id: 'catalog-apparel-g6',
            name: 'Джинсы',
            children: [
              { id: 'catalog-apparel-g6-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-apparel-g7',
            name: 'Брюки',
            children: [
              { id: 'catalog-apparel-g7-l0', name: 'Классические' },
              { id: 'catalog-apparel-g7-l1', name: 'Чиносы' },
              { id: 'catalog-apparel-g7-l2', name: 'Спортивные' },
              { id: 'catalog-apparel-g7-l3', name: 'Джоггеры' },
              { id: 'catalog-apparel-g7-l4', name: 'Карго' },
            ],
          },
          {
            id: 'catalog-apparel-g8',
            name: 'Трикотаж',
            children: [
              { id: 'catalog-apparel-g8-l0', name: 'Свитеры' },
              { id: 'catalog-apparel-g8-l1', name: 'Худи' },
              { id: 'catalog-apparel-g8-l2', name: 'Кардиганы' },
              { id: 'catalog-apparel-g8-l3', name: 'Водолазки' },
              { id: 'catalog-apparel-g8-l4', name: 'Юбки' },
            ],
          },
          {
            id: 'catalog-apparel-g9',
            name: 'Нижнее бельё',
            children: [
              { id: 'catalog-apparel-g9-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-apparel-g10',
            name: 'Спортивная одежда',
            children: [
              { id: 'catalog-apparel-g10-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-apparel-g11',
            name: 'Пляжная мода',
            children: [
              { id: 'catalog-apparel-g11-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-apparel-g12',
            name: 'Пижамы и домашняя одежда',
            children: [
              { id: 'catalog-apparel-g12-l0', name: 'Халаты' },
              { id: 'catalog-apparel-g12-l1', name: 'Лонгсливы' },
              { id: 'catalog-apparel-g12-l2', name: 'Комплекты' },
            ],
          },
        ],
      },
      {
        id: 'catalog-shoes',
        name: 'Обувь',
        children: [
          {
            id: 'catalog-shoes-g0',
            name: 'Кроссовки',
            children: [
              { id: 'catalog-shoes-g0-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-shoes-g1',
            name: 'Туфли',
            children: [
              { id: 'catalog-shoes-g1-l0', name: 'Классические / лодочки' },
              { id: 'catalog-shoes-g1-l1', name: 'Балетки' },
            ],
          },
          {
            id: 'catalog-shoes-g2',
            name: 'Ботинки',
            children: [
              { id: 'catalog-shoes-g2-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-shoes-g3',
            name: 'Сандалии и шлёпанцы',
            children: [
              { id: 'catalog-shoes-g3-l0', name: 'Сандалии' },
              { id: 'catalog-shoes-g3-l1', name: 'Шлепанцы' },
              { id: 'catalog-shoes-g3-l2', name: 'Босоножки' },
            ],
          },
          {
            id: 'catalog-shoes-g4',
            name: 'Сапоги',
            children: [
              { id: 'catalog-shoes-g4-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-shoes-g5',
            name: 'Мокасины и топсайдеры',
            children: [
              { id: 'catalog-shoes-g5-l0', name: 'Мокасины' },
              { id: 'catalog-shoes-g5-l1', name: 'Топсайдеры' },
            ],
          },
          {
            id: 'catalog-shoes-g6',
            name: 'Угги и унты',
            children: [
              { id: 'catalog-shoes-g6-l0', name: 'Валенки' },
              { id: 'catalog-shoes-g6-l1', name: 'Угги' },
              { id: 'catalog-shoes-g6-l2', name: 'Унты' },
            ],
          },
          {
            id: 'catalog-shoes-g7',
            name: 'Слипоны',
            children: [
              { id: 'catalog-shoes-g7-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-shoes-g8',
            name: 'Эспадрильи',
            children: [
              { id: 'catalog-shoes-g8-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-shoes-g9',
            name: 'Мюли',
            children: [
              { id: 'catalog-shoes-g9-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-shoes-g10',
            name: 'Сабо',
            children: [
              { id: 'catalog-shoes-g10-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-shoes-g11',
            name: 'Домашняя обувь',
            children: [
              { id: 'catalog-shoes-g11-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-shoes-g12',
            name: 'Спортивная',
            children: [
              { id: 'catalog-shoes-g12-l0', name: '—' },
            ],
          },
        ],
      },
      {
        id: 'catalog-bags',
        name: 'Сумки',
        children: [
          {
            id: 'catalog-bags-g0',
            name: 'Повседневные',
            children: [
              { id: 'catalog-bags-g0-l0', name: 'Тот' },
              { id: 'catalog-bags-g0-l1', name: 'Шоппер' },
              { id: 'catalog-bags-g0-l2', name: 'Кросс-боди' },
              { id: 'catalog-bags-g0-l3', name: 'Рюкзак' },
              { id: 'catalog-bags-g0-l4', name: 'Клатч' },
              { id: 'catalog-bags-g0-l5', name: 'Поясная' },
            ],
          },
          {
            id: 'catalog-bags-g1',
            name: 'Вечерние',
            children: [
              { id: 'catalog-bags-g1-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-bags-g2',
            name: 'Чемоданы',
            children: [
              { id: 'catalog-bags-g2-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-bags-g3',
            name: 'Рабочие',
            children: [
              { id: 'catalog-bags-g3-l0', name: 'Для ноутбука' },
              { id: 'catalog-bags-g3-l1', name: 'Портфель' },
            ],
          },
          {
            id: 'catalog-bags-g4',
            name: 'Спортивные и дорожные',
            children: [
              { id: 'catalog-bags-g4-l0', name: 'Спортивные сумки' },
              { id: 'catalog-bags-g4-l1', name: 'Дорожные сумки' },
            ],
          },
          {
            id: 'catalog-bags-g5',
            name: 'Косметички',
            children: [
              { id: 'catalog-bags-g5-l0', name: 'Несессеры' },
            ],
          },
        ],
      },
      {
        id: 'catalog-accessories',
        name: 'Аксессуары',
        children: [
          {
            id: 'catalog-accessories-g0',
            name: 'Очки',
            children: [
              { id: 'catalog-accessories-g0-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-accessories-g1',
            name: 'Ремни и подтяжки',
            children: [
              { id: 'catalog-accessories-g1-l0', name: 'Ремни' },
              { id: 'catalog-accessories-g1-l1', name: 'Подтяжки' },
            ],
          },
          {
            id: 'catalog-accessories-g2',
            name: 'Перчатки и варежки',
            children: [
              { id: 'catalog-accessories-g2-l0', name: 'Перчатки' },
              { id: 'catalog-accessories-g2-l1', name: 'Варежки' },
            ],
          },
          {
            id: 'catalog-accessories-g3',
            name: 'Шарфы',
            children: [
              { id: 'catalog-accessories-g3-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-accessories-g4',
            name: 'Галстуки и бабочки',
            children: [
              { id: 'catalog-accessories-g4-l0', name: 'Галстуки' },
              { id: 'catalog-accessories-g4-l1', name: 'Бабочки' },
            ],
          },
          {
            id: 'catalog-accessories-g5',
            name: 'Платки',
            children: [
              { id: 'catalog-accessories-g5-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-accessories-g6',
            name: 'Украшения',
            children: [
              { id: 'catalog-accessories-g6-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-accessories-g7',
            name: 'Кожгалантерея мелкая',
            children: [
              { id: 'catalog-accessories-g7-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-accessories-g8',
            name: 'Зонты',
            children: [
              { id: 'catalog-accessories-g8-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-accessories-g9',
            name: 'Тех-аксессуары',
            children: [
              { id: 'catalog-accessories-g9-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-accessories-g10',
            name: 'Маски и бафы',
            children: [
              { id: 'catalog-accessories-g10-l0', name: 'Маски' },
              { id: 'catalog-accessories-g10-l1', name: 'Балаклавы' },
              { id: 'catalog-accessories-g10-l2', name: 'Бафы' },
            ],
          },
        ],
      },
      {
        id: 'catalog-headwear',
        name: 'Головные уборы',
        children: [
          {
            id: 'catalog-headwear-g0',
            name: 'Кепки',
            children: [
              { id: 'catalog-headwear-g0-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-headwear-g1',
            name: 'Панамы',
            children: [
              { id: 'catalog-headwear-g1-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-headwear-g2',
            name: 'Шляпы',
            children: [
              { id: 'catalog-headwear-g2-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-headwear-g3',
            name: 'Береты',
            children: [
              { id: 'catalog-headwear-g3-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-headwear-g4',
            name: 'Шапки',
            children: [
              { id: 'catalog-headwear-g4-l0', name: '—' },
            ],
          },
        ],
      },
      {
        id: 'catalog-hosiery',
        name: 'Носочно-чулочные',
        children: [
          {
            id: 'catalog-hosiery-g0',
            name: 'Носки',
            children: [
              { id: 'catalog-hosiery-g0-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-hosiery-g1',
            name: 'Колготки',
            children: [
              { id: 'catalog-hosiery-g1-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-hosiery-g2',
            name: 'Чулки',
            children: [
              { id: 'catalog-hosiery-g2-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-hosiery-g3',
            name: 'Гольфы',
            children: [
              { id: 'catalog-hosiery-g3-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-hosiery-g4',
            name: 'Гетры',
            children: [
              { id: 'catalog-hosiery-g4-l0', name: '—' },
            ],
          },
        ],
      },
      {
        id: 'catalog-beauty',
        name: 'Красота и уход',
        children: [
          {
            id: 'catalog-beauty-g0',
            name: 'Парфюмерия',
            children: [
              { id: 'catalog-beauty-g0-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-beauty-g1',
            name: 'Косметика',
            children: [
              { id: 'catalog-beauty-g1-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-beauty-g2',
            name: 'Уход',
            children: [
              { id: 'catalog-beauty-g2-l0', name: '—' },
            ],
          },
        ],
      },
      {
        id: 'catalog-home',
        name: 'Дом и стиль жизни',
        children: [
          {
            id: 'catalog-home-g0',
            name: 'Текстиль',
            children: [
              { id: 'catalog-home-g0-l0', name: 'Пледы' },
              { id: 'catalog-home-g0-l1', name: 'Скатерти' },
              { id: 'catalog-home-g0-l2', name: 'Постельное' },
              { id: 'catalog-home-g0-l3', name: 'Полотенца' },
              { id: 'catalog-home-g0-l4', name: 'Коврики для ванной' },
              { id: 'catalog-home-g0-l5', name: 'Шторы' },
            ],
          },
          {
            id: 'catalog-home-g1',
            name: 'Декор',
            children: [
              { id: 'catalog-home-g1-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-home-g2',
            name: 'Аксессуары',
            children: [
              { id: 'catalog-home-g2-l0', name: '—' },
            ],
          },
          {
            id: 'catalog-home-g3',
            name: 'Питомцы',
            children: [
              { id: 'catalog-home-g3-l0', name: 'Одежда' },
              { id: 'catalog-home-g3-l1', name: 'Лежанки' },
              { id: 'catalog-home-g3-l2', name: 'Переноски' },
              { id: 'catalog-home-g3-l3', name: 'Поводки' },
            ],
          },
          {
            id: 'catalog-home-g4',
            name: 'Lifestyle-гаджеты',
            children: [
              { id: 'catalog-home-g4-l0', name: '—' },
            ],
          },
        ],
      },
      {
        id: 'catalog-newborn',
        name: 'Аксессуары для новорождённых',
        children: [
          {
            id: 'catalog-newborn-g0',
            name: 'Коляски',
            children: [
              { id: 'catalog-newborn-g0-l0', name: 'Коляски' },
              { id: 'catalog-newborn-g0-l1', name: 'Аксессуары для колясок' },
            ],
          },
          {
            id: 'catalog-newborn-g1',
            name: 'Аксессуары',
            children: [
              { id: 'catalog-newborn-g1-l0', name: 'Пелёнки' },
              { id: 'catalog-newborn-g1-l1', name: 'Бутылочки' },
              { id: 'catalog-newborn-g1-l2', name: 'Соски и пустышки' },
              { id: 'catalog-newborn-g1-l3', name: 'Подгузники' },
              { id: 'catalog-newborn-g1-l4', name: 'Поильники' },
              { id: 'catalog-newborn-g1-l5', name: 'Гигиена и купание' },
              { id: 'catalog-newborn-g1-l6', name: 'Переноски и слинги' },
              { id: 'catalog-newborn-g1-l7', name: 'Прочее' },
            ],
          },
        ],
      },
      {
        id: 'catalog-toys',
        name: 'Игрушки (детские)',
        children: [
          {
            id: 'catalog-toys-g0',
            name: '—',
            children: [
              { id: 'catalog-toys-g0-l0', name: '—' },
            ],
          },
        ],
      },
    ],
  },
];
