/**
 * Справочник категорий — снимок строится через `npm run gen:category-catalog`.
 * Иерархия: Ур.1 → Ур.2 → лист (ур.3 в таблице).
 * Файл сгенерирован скриптом `scripts/generate-category-handbook.py` (не править дерево руками).
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
    options: ['Весна–лето', 'Осень–зима', 'Круиз', 'Пре-осень', 'Мультисезон'],
  },
  { id: 'composition', name: 'Состав', type: 'text' },
  {
    id: 'countryOfOrigin',
    name: 'Страна производства',
    type: 'select',
    options: ['Россия', 'Китай', 'Турция', 'Италия', 'Вьетнам', 'Беларусь', 'Узбекистан'],
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
              { id: 'catalog-apparel-g0-l15', name: 'Анораки' },
              { id: 'catalog-apparel-g0-l16', name: 'Косухи' },
              { id: 'catalog-apparel-g0-l17', name: 'Дубленки' },
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
              { id: 'catalog-apparel-g2-l2', name: 'Туники' },
            ],
          },
          {
            id: 'catalog-apparel-g3',
            name: 'Юбки',
            children: [
              { id: 'catalog-apparel-g3-l0', name: 'Мини' },
              { id: 'catalog-apparel-g3-l1', name: 'Миди' },
              { id: 'catalog-apparel-g3-l2', name: 'Макси' },
            ],
          },
          {
            id: 'catalog-apparel-g4',
            name: 'Рубашки и блузы',
            children: [
              { id: 'catalog-apparel-g4-l0', name: 'Рубашки' },
              { id: 'catalog-apparel-g4-l1', name: 'Блузы' },
              { id: 'catalog-apparel-g4-l2', name: 'Сорочки' },
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
              { id: 'catalog-apparel-g5-l5', name: 'Лонгсливы' },
            ],
          },
          {
            id: 'catalog-apparel-g6',
            name: 'Джинсы',
            children: [
              { id: 'catalog-apparel-g6-l0', name: 'Прямые' },
              { id: 'catalog-apparel-g6-l1', name: 'Зауженные' },
              { id: 'catalog-apparel-g6-l2', name: 'Широкие' },
              { id: 'catalog-apparel-g6-l3', name: 'Клеш' },
              { id: 'catalog-apparel-g6-l4', name: 'Бойфренды' },
              { id: 'catalog-apparel-g6-l5', name: 'Мом' },
              { id: 'catalog-apparel-g6-l6', name: 'Скинни' },
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
              { id: 'catalog-apparel-g7-l5', name: 'Леггинсы' },
              { id: 'catalog-apparel-g7-l6', name: 'Шорты' },
              { id: 'catalog-apparel-g7-l7', name: 'Бермуды' },
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
              { id: 'catalog-apparel-g8-l4', name: 'Джемперы' },
              { id: 'catalog-apparel-g8-l5', name: 'Пуловеры' },
              { id: 'catalog-apparel-g8-l6', name: 'Свитшоты' },
            ],
          },
          {
            id: 'catalog-apparel-g9',
            name: 'Нижнее бельё',
            children: [
              { id: 'catalog-apparel-g9-l0', name: 'Трусы' },
              { id: 'catalog-apparel-g9-l1', name: 'Бюстгальтеры' },
              { id: 'catalog-apparel-g9-l2', name: 'Бюстье' },
              { id: 'catalog-apparel-g9-l3', name: 'Боди' },
              { id: 'catalog-apparel-g9-l4', name: 'Термобелье' },
              { id: 'catalog-apparel-g9-l5', name: 'Комбинации' },
              { id: 'catalog-apparel-g9-l6', name: 'Корсеты' },
            ],
          },
          {
            id: 'catalog-apparel-g10',
            name: 'Спортивная одежда',
            children: [
              { id: 'catalog-apparel-g10-l0', name: 'Спортивные костюмы' },
              { id: 'catalog-apparel-g10-l1', name: 'Тайтсы' },
              { id: 'catalog-apparel-g10-l2', name: 'Рашгарды' },
              { id: 'catalog-apparel-g10-l3', name: 'Спортивные топы' },
              { id: 'catalog-apparel-g10-l4', name: 'Шорты для плавания' },
            ],
          },
          {
            id: 'catalog-apparel-g11',
            name: 'Пляжная мода',
            children: [
              { id: 'catalog-apparel-g11-l0', name: 'Слитные купальники' },
              { id: 'catalog-apparel-g11-l1', name: 'Раздельные купальники' },
              { id: 'catalog-apparel-g11-l2', name: 'Плавки' },
              { id: 'catalog-apparel-g11-l3', name: 'Парео' },
              { id: 'catalog-apparel-g11-l4', name: 'Пляжные туники' },
            ],
          },
          {
            id: 'catalog-apparel-g12',
            name: 'Пижамы и домашняя одежда',
            children: [
              { id: 'catalog-apparel-g12-l0', name: 'Халаты' },
              { id: 'catalog-apparel-g12-l1', name: 'Комплекты' },
              { id: 'catalog-apparel-g12-l2', name: 'Ночные сорочки' },
              { id: 'catalog-apparel-g12-l3', name: 'Пижамы' },
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
              { id: 'catalog-shoes-g0-l0', name: 'Спортивные' },
              { id: 'catalog-shoes-g0-l1', name: 'Повседневные' },
              { id: 'catalog-shoes-g0-l2', name: 'Хайтопы' },
              { id: 'catalog-shoes-g0-l3', name: 'Сникерсы' },
            ],
          },
          {
            id: 'catalog-shoes-g1',
            name: 'Туфли',
            children: [
              { id: 'catalog-shoes-g1-l0', name: 'Классические / лодочки' },
              { id: 'catalog-shoes-g1-l1', name: 'Балетки' },
              { id: 'catalog-shoes-g1-l2', name: 'Лоферы' },
              { id: 'catalog-shoes-g1-l3', name: 'Оксфорды' },
              { id: 'catalog-shoes-g1-l4', name: 'Дерби' },
              { id: 'catalog-shoes-g1-l5', name: 'Броги' },
            ],
          },
          {
            id: 'catalog-shoes-g2',
            name: 'Ботинки',
            children: [
              { id: 'catalog-shoes-g2-l0', name: 'Демисезонные' },
              { id: 'catalog-shoes-g2-l1', name: 'Зимние' },
              { id: 'catalog-shoes-g2-l2', name: 'Челси' },
              { id: 'catalog-shoes-g2-l3', name: 'Дезерты' },
              { id: 'catalog-shoes-g2-l4', name: 'Берцы' },
              { id: 'catalog-shoes-g2-l5', name: 'Тимберленды' },
              { id: 'catalog-shoes-g2-l6', name: 'Треккинговые' },
            ],
          },
          {
            id: 'catalog-shoes-g3',
            name: 'Сандалии и шлёпанцы',
            children: [
              { id: 'catalog-shoes-g3-l0', name: 'Сандалии' },
              { id: 'catalog-shoes-g3-l1', name: 'Шлепанцы' },
              { id: 'catalog-shoes-g3-l2', name: 'Босоножки' },
              { id: 'catalog-shoes-g3-l3', name: 'Вьетнамки' },
              { id: 'catalog-shoes-g3-l4', name: 'Сабо' },
              { id: 'catalog-shoes-g3-l5', name: 'Мюли' },
            ],
          },
          {
            id: 'catalog-shoes-g4',
            name: 'Сапоги',
            children: [
              { id: 'catalog-shoes-g4-l0', name: 'Зимние' },
              { id: 'catalog-shoes-g4-l1', name: 'Демисезонные' },
              { id: 'catalog-shoes-g4-l2', name: 'Ботфорты' },
              { id: 'catalog-shoes-g4-l3', name: 'Полусапоги' },
              { id: 'catalog-shoes-g4-l4', name: 'Резиновые' },
              { id: 'catalog-shoes-g4-l5', name: 'Казаки' },
            ],
          },
          {
            id: 'catalog-shoes-g5',
            name: 'Мокасины и топсайдеры',
            children: [
              { id: 'catalog-shoes-g5-l0', name: 'Мокасины' },
              { id: 'catalog-shoes-g5-l1', name: 'Топсайдеры' },
              { id: 'catalog-shoes-g5-l2', name: 'Слипоны' },
              { id: 'catalog-shoes-g5-l3', name: 'Эспадрильи' },
            ],
          },
          {
            id: 'catalog-shoes-g6',
            name: 'Угги и унты',
            children: [
              { id: 'catalog-shoes-g6-l0', name: 'Валенки' },
              { id: 'catalog-shoes-g6-l1', name: 'Угги' },
              { id: 'catalog-shoes-g6-l2', name: 'Унты' },
              { id: 'catalog-shoes-g6-l3', name: 'Дутики' },
            ],
          },
          {
            id: 'catalog-shoes-g7',
            name: 'Домашняя обувь',
            children: [
              { id: 'catalog-shoes-g7-l0', name: 'Тапочки' },
              { id: 'catalog-shoes-g7-l1', name: 'Чуни' },
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
              { id: 'catalog-bags-g0-l6', name: 'Сумка-мешок' },
              { id: 'catalog-bags-g0-l7', name: 'Сумка-багет' },
            ],
          },
          {
            id: 'catalog-bags-g1',
            name: 'Вечерние',
            children: [
              { id: 'catalog-bags-g1-l0', name: 'Клатчи' },
              { id: 'catalog-bags-g1-l1', name: 'Минодьеры' },
              { id: 'catalog-bags-g1-l2', name: 'Сумки-конверты' },
            ],
          },
          {
            id: 'catalog-bags-g2',
            name: 'Чемоданы',
            children: [
              { id: 'catalog-bags-g2-l0', name: 'На колесах' },
              { id: 'catalog-bags-g2-l1', name: 'Сумки-тележки' },
              { id: 'catalog-bags-g2-l2', name: 'Кейсы' },
            ],
          },
          {
            id: 'catalog-bags-g3',
            name: 'Рабочие',
            children: [
              { id: 'catalog-bags-g3-l0', name: 'Для ноутбука' },
              { id: 'catalog-bags-g3-l1', name: 'Портфель' },
              { id: 'catalog-bags-g3-l2', name: 'Папки' },
              { id: 'catalog-bags-g3-l3', name: 'Сумка-портфель' },
            ],
          },
          {
            id: 'catalog-bags-g4',
            name: 'Спортивные и дорожные',
            children: [
              { id: 'catalog-bags-g4-l0', name: 'Спортивные сумки' },
              { id: 'catalog-bags-g4-l1', name: 'Дорожные сумки' },
              { id: 'catalog-bags-g4-l2', name: 'Рюкзаки туристические' },
              { id: 'catalog-bags-g4-l3', name: 'Дафл' },
            ],
          },
          {
            id: 'catalog-bags-g5',
            name: 'Косметички',
            children: [
              { id: 'catalog-bags-g5-l0', name: 'Несессеры' },
              { id: 'catalog-bags-g5-l1', name: 'Бьюти-кейсы' },
              { id: 'catalog-bags-g5-l2', name: 'Косметички' },
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
              { id: 'catalog-accessories-g0-l0', name: 'Солнцезащитные' },
              { id: 'catalog-accessories-g0-l1', name: 'Оправы' },
              { id: 'catalog-accessories-g0-l2', name: 'Футляры для очков' },
            ],
          },
          {
            id: 'catalog-accessories-g1',
            name: 'Ремни и подтяжки',
            children: [
              { id: 'catalog-accessories-g1-l0', name: 'Ремни' },
              { id: 'catalog-accessories-g1-l1', name: 'Подтяжки' },
              { id: 'catalog-accessories-g1-l2', name: 'Пояса' },
            ],
          },
          {
            id: 'catalog-accessories-g2',
            name: 'Перчатки и варежки',
            children: [
              { id: 'catalog-accessories-g2-l0', name: 'Перчатки' },
              { id: 'catalog-accessories-g2-l1', name: 'Варежки' },
              { id: 'catalog-accessories-g2-l2', name: 'Митенки' },
            ],
          },
          {
            id: 'catalog-accessories-g3',
            name: 'Шарфы',
            children: [
              { id: 'catalog-accessories-g3-l0', name: 'Шарфы' },
              { id: 'catalog-accessories-g3-l1', name: 'Снуды' },
              { id: 'catalog-accessories-g3-l2', name: 'Палантины' },
              { id: 'catalog-accessories-g3-l3', name: 'Горжетки' },
            ],
          },
          {
            id: 'catalog-accessories-g4',
            name: 'Галстуки и бабочки',
            children: [
              { id: 'catalog-accessories-g4-l0', name: 'Галстуки' },
              { id: 'catalog-accessories-g4-l1', name: 'Бабочки' },
              { id: 'catalog-accessories-g4-l2', name: 'Зажимы для галстука' },
            ],
          },
          {
            id: 'catalog-accessories-g5',
            name: 'Платки',
            children: [
              { id: 'catalog-accessories-g5-l0', name: 'Шейные платки' },
              { id: 'catalog-accessories-g5-l1', name: 'Банданы' },
              { id: 'catalog-accessories-g5-l2', name: 'Косынки' },
            ],
          },
          {
            id: 'catalog-accessories-g6',
            name: 'Украшения',
            children: [
              { id: 'catalog-accessories-g6-l0', name: 'Кольца' },
              { id: 'catalog-accessories-g6-l1', name: 'Серьги' },
              { id: 'catalog-accessories-g6-l2', name: 'Браслеты' },
              { id: 'catalog-accessories-g6-l3', name: 'Колье' },
              { id: 'catalog-accessories-g6-l4', name: 'Подвески' },
              { id: 'catalog-accessories-g6-l5', name: 'Броши' },
              { id: 'catalog-accessories-g6-l6', name: 'Цепочки' },
            ],
          },
          {
            id: 'catalog-accessories-g7',
            name: 'Кожгалантерея мелкая',
            children: [
              { id: 'catalog-accessories-g7-l0', name: 'Кошельки' },
              { id: 'catalog-accessories-g7-l1', name: 'Портмоне' },
              { id: 'catalog-accessories-g7-l2', name: 'Визитницы' },
              { id: 'catalog-accessories-g7-l3', name: 'Ключницы' },
              { id: 'catalog-accessories-g7-l4', name: 'Обложки для документов' },
            ],
          },
          {
            id: 'catalog-accessories-g8',
            name: 'Зонты',
            children: [
              { id: 'catalog-accessories-g8-l0', name: 'Трости' },
              { id: 'catalog-accessories-g8-l1', name: 'Складные' },
            ],
          },
          {
            id: 'catalog-accessories-g9',
            name: 'Тех-аксессуары',
            children: [
              { id: 'catalog-accessories-g9-l0', name: 'Чехлы для телефонов' },
              { id: 'catalog-accessories-g9-l1', name: 'Чехлы для наушников' },
              { id: 'catalog-accessories-g9-l2', name: 'Ремешки для часов' },
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
              { id: 'catalog-headwear-g0-l0', name: 'Бейсболки' },
              { id: 'catalog-headwear-g0-l1', name: 'Снепбеки' },
              { id: 'catalog-headwear-g0-l2', name: 'Тракеры' },
              { id: 'catalog-headwear-g0-l3', name: 'Кепки-уточки' },
            ],
          },
          {
            id: 'catalog-headwear-g1',
            name: 'Панамы',
            children: [
              { id: 'catalog-headwear-g1-l0', name: 'Панамы' },
              { id: 'catalog-headwear-g1-l1', name: 'Шляпы-ведро' },
            ],
          },
          {
            id: 'catalog-headwear-g2',
            name: 'Шляпы',
            children: [
              { id: 'catalog-headwear-g2-l0', name: 'Федоры' },
              { id: 'catalog-headwear-g2-l1', name: 'Трилби' },
              { id: 'catalog-headwear-g2-l2', name: 'Канотье' },
              { id: 'catalog-headwear-g2-l3', name: 'Широкополые' },
              { id: 'catalog-headwear-g2-l4', name: 'Цилиндры' },
              { id: 'catalog-headwear-g2-l5', name: 'Котелки' },
            ],
          },
          {
            id: 'catalog-headwear-g3',
            name: 'Береты',
            children: [
              { id: 'catalog-headwear-g3-l0', name: 'Классические' },
              { id: 'catalog-headwear-g3-l1', name: 'Объемные' },
            ],
          },
          {
            id: 'catalog-headwear-g4',
            name: 'Шапки',
            children: [
              { id: 'catalog-headwear-g4-l0', name: 'Бини' },
              { id: 'catalog-headwear-g4-l1', name: 'Ушанки' },
              { id: 'catalog-headwear-g4-l2', name: 'С помпоном' },
              { id: 'catalog-headwear-g4-l3', name: 'Капоры' },
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
              { id: 'catalog-hosiery-g0-l0', name: 'Короткие' },
              { id: 'catalog-hosiery-g0-l1', name: 'Классические' },
              { id: 'catalog-hosiery-g0-l2', name: 'Спортивные' },
              { id: 'catalog-hosiery-g0-l3', name: 'Следки' },
            ],
          },
          {
            id: 'catalog-hosiery-g1',
            name: 'Колготки',
            children: [
              { id: 'catalog-hosiery-g1-l0', name: 'Капроновые' },
              { id: 'catalog-hosiery-g1-l1', name: 'Хлопковые' },
              { id: 'catalog-hosiery-g1-l2', name: 'Шерстяные' },
              { id: 'catalog-hosiery-g1-l3', name: 'Фантазийные' },
            ],
          },
          {
            id: 'catalog-hosiery-g2',
            name: 'Чулки',
            children: [
              { id: 'catalog-hosiery-g2-l0', name: 'С кружевом' },
              { id: 'catalog-hosiery-g2-l1', name: 'Под пояс' },
              { id: 'catalog-hosiery-g2-l2', name: 'Компрессионные' },
            ],
          },
          {
            id: 'catalog-hosiery-g3',
            name: 'Гольфы',
            children: [
              { id: 'catalog-hosiery-g3-l0', name: 'Капроновые' },
              { id: 'catalog-hosiery-g3-l1', name: 'Хлопковые' },
            ],
          },
          {
            id: 'catalog-hosiery-g4',
            name: 'Гетры',
            children: [
              { id: 'catalog-hosiery-g4-l0', name: 'Спортивные' },
              { id: 'catalog-hosiery-g4-l1', name: 'Вязаные' },
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
              { id: 'catalog-beauty-g0-l0', name: 'Духи' },
              { id: 'catalog-beauty-g0-l1', name: 'Парфюмерная вода' },
              { id: 'catalog-beauty-g0-l2', name: 'Туалетная вода' },
              { id: 'catalog-beauty-g0-l3', name: 'Одеколоны' },
              { id: 'catalog-beauty-g0-l4', name: 'Спреи для тела' },
            ],
          },
          {
            id: 'catalog-beauty-g1',
            name: 'Косметика',
            children: [
              { id: 'catalog-beauty-g1-l0', name: 'Для лица' },
              { id: 'catalog-beauty-g1-l1', name: 'Для глаз' },
              { id: 'catalog-beauty-g1-l2', name: 'Для губ' },
              { id: 'catalog-beauty-g1-l3', name: 'Для бровей' },
              { id: 'catalog-beauty-g1-l4', name: 'Палетки' },
              { id: 'catalog-beauty-g1-l5', name: 'Кисти и спонжи' },
            ],
          },
          {
            id: 'catalog-beauty-g2',
            name: 'Уход',
            children: [
              { id: 'catalog-beauty-g2-l0', name: 'Для лица' },
              { id: 'catalog-beauty-g2-l1', name: 'Для тела' },
              { id: 'catalog-beauty-g2-l2', name: 'Для волос' },
              { id: 'catalog-beauty-g2-l3', name: 'Для рук' },
              { id: 'catalog-beauty-g2-l4', name: 'Для ног' },
              { id: 'catalog-beauty-g2-l5', name: 'Солнцезащитные средства' },
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
              { id: 'catalog-home-g0-l6', name: 'Салфетки' },
            ],
          },
          {
            id: 'catalog-home-g1',
            name: 'Декор',
            children: [
              { id: 'catalog-home-g1-l0', name: 'Вазы' },
              { id: 'catalog-home-g1-l1', name: 'Свечи' },
              { id: 'catalog-home-g1-l2', name: 'Подсвечники' },
              { id: 'catalog-home-g1-l3', name: 'Картины' },
              { id: 'catalog-home-g1-l4', name: 'Постеры' },
              { id: 'catalog-home-g1-l5', name: 'Зеркала' },
              { id: 'catalog-home-g1-l6', name: 'Статуэтки' },
            ],
          },
          {
            id: 'catalog-home-g2',
            name: 'Аксессуары',
            children: [
              { id: 'catalog-home-g2-l0', name: 'Ароматы для дома' },
              { id: 'catalog-home-g2-l1', name: 'Диффузоры' },
              { id: 'catalog-home-g2-l2', name: 'Саше' },
              { id: 'catalog-home-g2-l3', name: 'Органайзеры' },
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
              { id: 'catalog-home-g3-l4', name: 'Ошейники' },
              { id: 'catalog-home-g3-l5', name: 'Игрушки' },
              { id: 'catalog-home-g3-l6', name: 'Миски' },
            ],
          },
          {
            id: 'catalog-home-g4',
            name: 'Lifestyle-гаджеты',
            children: [
              { id: 'catalog-home-g4-l0', name: 'Будильники' },
              { id: 'catalog-home-g4-l1', name: 'Лампы' },
              { id: 'catalog-home-g4-l2', name: 'Увлажнители' },
              { id: 'catalog-home-g4-l3', name: 'Массажеры' },
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
            name: 'Игрушки',
            children: [
              { id: 'catalog-toys-g0-l0', name: 'Мягкие игрушки' },
              { id: 'catalog-toys-g0-l1', name: 'Развивающие' },
              { id: 'catalog-toys-g0-l2', name: 'Конструкторы' },
              { id: 'catalog-toys-g0-l3', name: 'Куклы' },
              { id: 'catalog-toys-g0-l4', name: 'Машинки' },
              { id: 'catalog-toys-g0-l5', name: 'Настольные игры' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'women',
    name: 'Женщины',
    categories: [
      {
        id: 'women-apparel',
        name: 'Одежда',
        children: [
          {
            id: 'women-apparel-g0',
            name: 'Верхняя одежда',
            children: [
              { id: 'women-apparel-g0-l0', name: 'Пальто' },
              { id: 'women-apparel-g0-l1', name: 'Тренчи' },
              { id: 'women-apparel-g0-l2', name: 'Парки' },
              { id: 'women-apparel-g0-l3', name: 'Пуховики' },
              { id: 'women-apparel-g0-l4', name: 'Куртки' },
              { id: 'women-apparel-g0-l5', name: 'Бомберы' },
              { id: 'women-apparel-g0-l6', name: 'Ветровки' },
              { id: 'women-apparel-g0-l7', name: 'Жилеты' },
              { id: 'women-apparel-g0-l8', name: 'Плащи' },
              { id: 'women-apparel-g0-l9', name: 'Дождевики' },
              { id: 'women-apparel-g0-l10', name: 'Пончо' },
              { id: 'women-apparel-g0-l11', name: 'Шубы' },
              { id: 'women-apparel-g0-l12', name: 'Лайнеры' },
              { id: 'women-apparel-g0-l13', name: 'Подстёжки' },
              { id: 'women-apparel-g0-l14', name: 'Комбинезоны' },
              { id: 'women-apparel-g0-l15', name: 'Анораки' },
              { id: 'women-apparel-g0-l16', name: 'Косухи' },
              { id: 'women-apparel-g0-l17', name: 'Дубленки' },
            ],
          },
          {
            id: 'women-apparel-g1',
            name: 'Костюмы и жакеты',
            children: [
              { id: 'women-apparel-g1-l0', name: 'Костюмы' },
              { id: 'women-apparel-g1-l1', name: 'Блейзеры' },
              { id: 'women-apparel-g1-l2', name: 'Смокинги' },
              { id: 'women-apparel-g1-l3', name: 'Фраки' },
              { id: 'women-apparel-g1-l4', name: 'Пиджаки' },
              { id: 'women-apparel-g1-l5', name: 'Жилеты' },
            ],
          },
          {
            id: 'women-apparel-g2',
            name: 'Платья и сарафаны',
            children: [
              { id: 'women-apparel-g2-l0', name: 'Платья' },
              { id: 'women-apparel-g2-l1', name: 'Сарафаны' },
              { id: 'women-apparel-g2-l2', name: 'Туники' },
            ],
          },
          {
            id: 'women-apparel-g3',
            name: 'Юбки',
            children: [
              { id: 'women-apparel-g3-l0', name: 'Мини' },
              { id: 'women-apparel-g3-l1', name: 'Миди' },
              { id: 'women-apparel-g3-l2', name: 'Макси' },
            ],
          },
          {
            id: 'women-apparel-g4',
            name: 'Рубашки и блузы',
            children: [
              { id: 'women-apparel-g4-l0', name: 'Рубашки' },
              { id: 'women-apparel-g4-l1', name: 'Блузы' },
              { id: 'women-apparel-g4-l2', name: 'Сорочки' },
            ],
          },
          {
            id: 'women-apparel-g5',
            name: 'Топы и футболки',
            children: [
              { id: 'women-apparel-g5-l0', name: 'Топы' },
              { id: 'women-apparel-g5-l1', name: 'Футболки' },
              { id: 'women-apparel-g5-l2', name: 'Поло' },
              { id: 'women-apparel-g5-l3', name: 'Майки' },
              { id: 'women-apparel-g5-l4', name: 'Кроп-топы' },
              { id: 'women-apparel-g5-l5', name: 'Лонгсливы' },
            ],
          },
          {
            id: 'women-apparel-g6',
            name: 'Джинсы',
            children: [
              { id: 'women-apparel-g6-l0', name: 'Прямые' },
              { id: 'women-apparel-g6-l1', name: 'Зауженные' },
              { id: 'women-apparel-g6-l2', name: 'Широкие' },
              { id: 'women-apparel-g6-l3', name: 'Клеш' },
              { id: 'women-apparel-g6-l4', name: 'Бойфренды' },
              { id: 'women-apparel-g6-l5', name: 'Мом' },
              { id: 'women-apparel-g6-l6', name: 'Скинни' },
            ],
          },
          {
            id: 'women-apparel-g7',
            name: 'Брюки',
            children: [
              { id: 'women-apparel-g7-l0', name: 'Классические' },
              { id: 'women-apparel-g7-l1', name: 'Чиносы' },
              { id: 'women-apparel-g7-l2', name: 'Спортивные' },
              { id: 'women-apparel-g7-l3', name: 'Джоггеры' },
              { id: 'women-apparel-g7-l4', name: 'Карго' },
              { id: 'women-apparel-g7-l5', name: 'Леггинсы' },
              { id: 'women-apparel-g7-l6', name: 'Шорты' },
              { id: 'women-apparel-g7-l7', name: 'Бермуды' },
            ],
          },
          {
            id: 'women-apparel-g8',
            name: 'Трикотаж',
            children: [
              { id: 'women-apparel-g8-l0', name: 'Свитеры' },
              { id: 'women-apparel-g8-l1', name: 'Худи' },
              { id: 'women-apparel-g8-l2', name: 'Кардиганы' },
              { id: 'women-apparel-g8-l3', name: 'Водолазки' },
              { id: 'women-apparel-g8-l4', name: 'Джемперы' },
              { id: 'women-apparel-g8-l5', name: 'Пуловеры' },
              { id: 'women-apparel-g8-l6', name: 'Свитшоты' },
            ],
          },
          {
            id: 'women-apparel-g9',
            name: 'Нижнее бельё',
            children: [
              { id: 'women-apparel-g9-l0', name: 'Трусы' },
              { id: 'women-apparel-g9-l1', name: 'Бюстгальтеры' },
              { id: 'women-apparel-g9-l2', name: 'Бюстье' },
              { id: 'women-apparel-g9-l3', name: 'Боди' },
              { id: 'women-apparel-g9-l4', name: 'Термобелье' },
              { id: 'women-apparel-g9-l5', name: 'Комбинации' },
              { id: 'women-apparel-g9-l6', name: 'Корсеты' },
            ],
          },
          {
            id: 'women-apparel-g10',
            name: 'Спортивная одежда',
            children: [
              { id: 'women-apparel-g10-l0', name: 'Спортивные костюмы' },
              { id: 'women-apparel-g10-l1', name: 'Тайтсы' },
              { id: 'women-apparel-g10-l2', name: 'Рашгарды' },
              { id: 'women-apparel-g10-l3', name: 'Спортивные топы' },
              { id: 'women-apparel-g10-l4', name: 'Шорты для плавания' },
            ],
          },
          {
            id: 'women-apparel-g11',
            name: 'Пляжная мода',
            children: [
              { id: 'women-apparel-g11-l0', name: 'Слитные купальники' },
              { id: 'women-apparel-g11-l1', name: 'Раздельные купальники' },
              { id: 'women-apparel-g11-l2', name: 'Плавки' },
              { id: 'women-apparel-g11-l3', name: 'Парео' },
              { id: 'women-apparel-g11-l4', name: 'Пляжные туники' },
            ],
          },
          {
            id: 'women-apparel-g12',
            name: 'Пижамы и домашняя одежда',
            children: [
              { id: 'women-apparel-g12-l0', name: 'Халаты' },
              { id: 'women-apparel-g12-l1', name: 'Комплекты' },
              { id: 'women-apparel-g12-l2', name: 'Ночные сорочки' },
              { id: 'women-apparel-g12-l3', name: 'Пижамы' },
            ],
          },
        ],
      },
      {
        id: 'women-shoes',
        name: 'Обувь',
        children: [
          {
            id: 'women-shoes-g0',
            name: 'Кроссовки',
            children: [
              { id: 'women-shoes-g0-l0', name: 'Спортивные' },
              { id: 'women-shoes-g0-l1', name: 'Повседневные' },
              { id: 'women-shoes-g0-l2', name: 'Хайтопы' },
              { id: 'women-shoes-g0-l3', name: 'Сникерсы' },
            ],
          },
          {
            id: 'women-shoes-g1',
            name: 'Туфли',
            children: [
              { id: 'women-shoes-g1-l0', name: 'Классические / лодочки' },
              { id: 'women-shoes-g1-l1', name: 'Балетки' },
              { id: 'women-shoes-g1-l2', name: 'Лоферы' },
              { id: 'women-shoes-g1-l3', name: 'Оксфорды' },
              { id: 'women-shoes-g1-l4', name: 'Дерби' },
              { id: 'women-shoes-g1-l5', name: 'Броги' },
            ],
          },
          {
            id: 'women-shoes-g2',
            name: 'Ботинки',
            children: [
              { id: 'women-shoes-g2-l0', name: 'Демисезонные' },
              { id: 'women-shoes-g2-l1', name: 'Зимние' },
              { id: 'women-shoes-g2-l2', name: 'Челси' },
              { id: 'women-shoes-g2-l3', name: 'Дезерты' },
              { id: 'women-shoes-g2-l4', name: 'Берцы' },
              { id: 'women-shoes-g2-l5', name: 'Тимберленды' },
              { id: 'women-shoes-g2-l6', name: 'Треккинговые' },
            ],
          },
          {
            id: 'women-shoes-g3',
            name: 'Сандалии и шлёпанцы',
            children: [
              { id: 'women-shoes-g3-l0', name: 'Сандалии' },
              { id: 'women-shoes-g3-l1', name: 'Шлепанцы' },
              { id: 'women-shoes-g3-l2', name: 'Босоножки' },
              { id: 'women-shoes-g3-l3', name: 'Вьетнамки' },
              { id: 'women-shoes-g3-l4', name: 'Сабо' },
              { id: 'women-shoes-g3-l5', name: 'Мюли' },
            ],
          },
          {
            id: 'women-shoes-g4',
            name: 'Сапоги',
            children: [
              { id: 'women-shoes-g4-l0', name: 'Зимние' },
              { id: 'women-shoes-g4-l1', name: 'Демисезонные' },
              { id: 'women-shoes-g4-l2', name: 'Ботфорты' },
              { id: 'women-shoes-g4-l3', name: 'Полусапоги' },
              { id: 'women-shoes-g4-l4', name: 'Резиновые' },
              { id: 'women-shoes-g4-l5', name: 'Казаки' },
            ],
          },
          {
            id: 'women-shoes-g5',
            name: 'Мокасины и топсайдеры',
            children: [
              { id: 'women-shoes-g5-l0', name: 'Мокасины' },
              { id: 'women-shoes-g5-l1', name: 'Топсайдеры' },
              { id: 'women-shoes-g5-l2', name: 'Слипоны' },
              { id: 'women-shoes-g5-l3', name: 'Эспадрильи' },
            ],
          },
          {
            id: 'women-shoes-g6',
            name: 'Угги и унты',
            children: [
              { id: 'women-shoes-g6-l0', name: 'Валенки' },
              { id: 'women-shoes-g6-l1', name: 'Угги' },
              { id: 'women-shoes-g6-l2', name: 'Унты' },
              { id: 'women-shoes-g6-l3', name: 'Дутики' },
            ],
          },
          {
            id: 'women-shoes-g7',
            name: 'Домашняя обувь',
            children: [
              { id: 'women-shoes-g7-l0', name: 'Тапочки' },
              { id: 'women-shoes-g7-l1', name: 'Чуни' },
            ],
          },
        ],
      },
      {
        id: 'women-bags',
        name: 'Сумки',
        children: [
          {
            id: 'women-bags-g0',
            name: 'Повседневные',
            children: [
              { id: 'women-bags-g0-l0', name: 'Тот' },
              { id: 'women-bags-g0-l1', name: 'Шоппер' },
              { id: 'women-bags-g0-l2', name: 'Кросс-боди' },
              { id: 'women-bags-g0-l3', name: 'Рюкзак' },
              { id: 'women-bags-g0-l4', name: 'Клатч' },
              { id: 'women-bags-g0-l5', name: 'Поясная' },
              { id: 'women-bags-g0-l6', name: 'Сумка-мешок' },
              { id: 'women-bags-g0-l7', name: 'Сумка-багет' },
            ],
          },
          {
            id: 'women-bags-g1',
            name: 'Вечерние',
            children: [
              { id: 'women-bags-g1-l0', name: 'Клатчи' },
              { id: 'women-bags-g1-l1', name: 'Минодьеры' },
              { id: 'women-bags-g1-l2', name: 'Сумки-конверты' },
            ],
          },
          {
            id: 'women-bags-g2',
            name: 'Чемоданы',
            children: [
              { id: 'women-bags-g2-l0', name: 'На колесах' },
              { id: 'women-bags-g2-l1', name: 'Сумки-тележки' },
              { id: 'women-bags-g2-l2', name: 'Кейсы' },
            ],
          },
          {
            id: 'women-bags-g3',
            name: 'Рабочие',
            children: [
              { id: 'women-bags-g3-l0', name: 'Для ноутбука' },
              { id: 'women-bags-g3-l1', name: 'Портфель' },
              { id: 'women-bags-g3-l2', name: 'Папки' },
              { id: 'women-bags-g3-l3', name: 'Сумка-портфель' },
            ],
          },
          {
            id: 'women-bags-g4',
            name: 'Спортивные и дорожные',
            children: [
              { id: 'women-bags-g4-l0', name: 'Спортивные сумки' },
              { id: 'women-bags-g4-l1', name: 'Дорожные сумки' },
              { id: 'women-bags-g4-l2', name: 'Рюкзаки туристические' },
              { id: 'women-bags-g4-l3', name: 'Дафл' },
            ],
          },
          {
            id: 'women-bags-g5',
            name: 'Косметички',
            children: [
              { id: 'women-bags-g5-l0', name: 'Несессеры' },
              { id: 'women-bags-g5-l1', name: 'Бьюти-кейсы' },
              { id: 'women-bags-g5-l2', name: 'Косметички' },
            ],
          },
        ],
      },
      {
        id: 'women-accessories',
        name: 'Аксессуары',
        children: [
          {
            id: 'women-accessories-g0',
            name: 'Очки',
            children: [
              { id: 'women-accessories-g0-l0', name: 'Солнцезащитные' },
              { id: 'women-accessories-g0-l1', name: 'Оправы' },
              { id: 'women-accessories-g0-l2', name: 'Футляры для очков' },
            ],
          },
          {
            id: 'women-accessories-g1',
            name: 'Ремни и подтяжки',
            children: [
              { id: 'women-accessories-g1-l0', name: 'Ремни' },
              { id: 'women-accessories-g1-l1', name: 'Подтяжки' },
              { id: 'women-accessories-g1-l2', name: 'Пояса' },
            ],
          },
          {
            id: 'women-accessories-g2',
            name: 'Перчатки и варежки',
            children: [
              { id: 'women-accessories-g2-l0', name: 'Перчатки' },
              { id: 'women-accessories-g2-l1', name: 'Варежки' },
              { id: 'women-accessories-g2-l2', name: 'Митенки' },
            ],
          },
          {
            id: 'women-accessories-g3',
            name: 'Шарфы',
            children: [
              { id: 'women-accessories-g3-l0', name: 'Шарфы' },
              { id: 'women-accessories-g3-l1', name: 'Снуды' },
              { id: 'women-accessories-g3-l2', name: 'Палантины' },
              { id: 'women-accessories-g3-l3', name: 'Горжетки' },
            ],
          },
          {
            id: 'women-accessories-g4',
            name: 'Галстуки и бабочки',
            children: [
              { id: 'women-accessories-g4-l0', name: 'Галстуки' },
              { id: 'women-accessories-g4-l1', name: 'Бабочки' },
              { id: 'women-accessories-g4-l2', name: 'Зажимы для галстука' },
            ],
          },
          {
            id: 'women-accessories-g5',
            name: 'Платки',
            children: [
              { id: 'women-accessories-g5-l0', name: 'Шейные платки' },
              { id: 'women-accessories-g5-l1', name: 'Банданы' },
              { id: 'women-accessories-g5-l2', name: 'Косынки' },
            ],
          },
          {
            id: 'women-accessories-g6',
            name: 'Украшения',
            children: [
              { id: 'women-accessories-g6-l0', name: 'Кольца' },
              { id: 'women-accessories-g6-l1', name: 'Серьги' },
              { id: 'women-accessories-g6-l2', name: 'Браслеты' },
              { id: 'women-accessories-g6-l3', name: 'Колье' },
              { id: 'women-accessories-g6-l4', name: 'Подвески' },
              { id: 'women-accessories-g6-l5', name: 'Броши' },
              { id: 'women-accessories-g6-l6', name: 'Цепочки' },
            ],
          },
          {
            id: 'women-accessories-g7',
            name: 'Кожгалантерея мелкая',
            children: [
              { id: 'women-accessories-g7-l0', name: 'Кошельки' },
              { id: 'women-accessories-g7-l1', name: 'Портмоне' },
              { id: 'women-accessories-g7-l2', name: 'Визитницы' },
              { id: 'women-accessories-g7-l3', name: 'Ключницы' },
              { id: 'women-accessories-g7-l4', name: 'Обложки для документов' },
            ],
          },
          {
            id: 'women-accessories-g8',
            name: 'Зонты',
            children: [
              { id: 'women-accessories-g8-l0', name: 'Трости' },
              { id: 'women-accessories-g8-l1', name: 'Складные' },
            ],
          },
          {
            id: 'women-accessories-g9',
            name: 'Тех-аксессуары',
            children: [
              { id: 'women-accessories-g9-l0', name: 'Чехлы для телефонов' },
              { id: 'women-accessories-g9-l1', name: 'Чехлы для наушников' },
              { id: 'women-accessories-g9-l2', name: 'Ремешки для часов' },
            ],
          },
          {
            id: 'women-accessories-g10',
            name: 'Маски и бафы',
            children: [
              { id: 'women-accessories-g10-l0', name: 'Маски' },
              { id: 'women-accessories-g10-l1', name: 'Балаклавы' },
              { id: 'women-accessories-g10-l2', name: 'Бафы' },
            ],
          },
        ],
      },
      {
        id: 'women-headwear',
        name: 'Головные уборы',
        children: [
          {
            id: 'women-headwear-g0',
            name: 'Кепки',
            children: [
              { id: 'women-headwear-g0-l0', name: 'Бейсболки' },
              { id: 'women-headwear-g0-l1', name: 'Снепбеки' },
              { id: 'women-headwear-g0-l2', name: 'Тракеры' },
              { id: 'women-headwear-g0-l3', name: 'Кепки-уточки' },
            ],
          },
          {
            id: 'women-headwear-g1',
            name: 'Панамы',
            children: [
              { id: 'women-headwear-g1-l0', name: 'Панамы' },
              { id: 'women-headwear-g1-l1', name: 'Шляпы-ведро' },
            ],
          },
          {
            id: 'women-headwear-g2',
            name: 'Шляпы',
            children: [
              { id: 'women-headwear-g2-l0', name: 'Федоры' },
              { id: 'women-headwear-g2-l1', name: 'Трилби' },
              { id: 'women-headwear-g2-l2', name: 'Канотье' },
              { id: 'women-headwear-g2-l3', name: 'Широкополые' },
              { id: 'women-headwear-g2-l4', name: 'Цилиндры' },
              { id: 'women-headwear-g2-l5', name: 'Котелки' },
            ],
          },
          {
            id: 'women-headwear-g3',
            name: 'Береты',
            children: [
              { id: 'women-headwear-g3-l0', name: 'Классические' },
              { id: 'women-headwear-g3-l1', name: 'Объемные' },
            ],
          },
          {
            id: 'women-headwear-g4',
            name: 'Шапки',
            children: [
              { id: 'women-headwear-g4-l0', name: 'Бини' },
              { id: 'women-headwear-g4-l1', name: 'Ушанки' },
              { id: 'women-headwear-g4-l2', name: 'С помпоном' },
              { id: 'women-headwear-g4-l3', name: 'Капоры' },
            ],
          },
        ],
      },
      {
        id: 'women-hosiery',
        name: 'Носочно-чулочные',
        children: [
          {
            id: 'women-hosiery-g0',
            name: 'Носки',
            children: [
              { id: 'women-hosiery-g0-l0', name: 'Короткие' },
              { id: 'women-hosiery-g0-l1', name: 'Классические' },
              { id: 'women-hosiery-g0-l2', name: 'Спортивные' },
              { id: 'women-hosiery-g0-l3', name: 'Следки' },
            ],
          },
          {
            id: 'women-hosiery-g1',
            name: 'Колготки',
            children: [
              { id: 'women-hosiery-g1-l0', name: 'Капроновые' },
              { id: 'women-hosiery-g1-l1', name: 'Хлопковые' },
              { id: 'women-hosiery-g1-l2', name: 'Шерстяные' },
              { id: 'women-hosiery-g1-l3', name: 'Фантазийные' },
            ],
          },
          {
            id: 'women-hosiery-g2',
            name: 'Чулки',
            children: [
              { id: 'women-hosiery-g2-l0', name: 'С кружевом' },
              { id: 'women-hosiery-g2-l1', name: 'Под пояс' },
              { id: 'women-hosiery-g2-l2', name: 'Компрессионные' },
            ],
          },
          {
            id: 'women-hosiery-g3',
            name: 'Гольфы',
            children: [
              { id: 'women-hosiery-g3-l0', name: 'Капроновые' },
              { id: 'women-hosiery-g3-l1', name: 'Хлопковые' },
            ],
          },
          {
            id: 'women-hosiery-g4',
            name: 'Гетры',
            children: [
              { id: 'women-hosiery-g4-l0', name: 'Спортивные' },
              { id: 'women-hosiery-g4-l1', name: 'Вязаные' },
            ],
          },
        ],
      },
      {
        id: 'women-beauty',
        name: 'Красота и уход',
        children: [
          {
            id: 'women-beauty-g0',
            name: 'Парфюмерия',
            children: [
              { id: 'women-beauty-g0-l0', name: 'Духи' },
              { id: 'women-beauty-g0-l1', name: 'Парфюмерная вода' },
              { id: 'women-beauty-g0-l2', name: 'Туалетная вода' },
              { id: 'women-beauty-g0-l3', name: 'Одеколоны' },
              { id: 'women-beauty-g0-l4', name: 'Спреи для тела' },
            ],
          },
          {
            id: 'women-beauty-g1',
            name: 'Косметика',
            children: [
              { id: 'women-beauty-g1-l0', name: 'Для лица' },
              { id: 'women-beauty-g1-l1', name: 'Для глаз' },
              { id: 'women-beauty-g1-l2', name: 'Для губ' },
              { id: 'women-beauty-g1-l3', name: 'Для бровей' },
              { id: 'women-beauty-g1-l4', name: 'Палетки' },
              { id: 'women-beauty-g1-l5', name: 'Кисти и спонжи' },
            ],
          },
          {
            id: 'women-beauty-g2',
            name: 'Уход',
            children: [
              { id: 'women-beauty-g2-l0', name: 'Для лица' },
              { id: 'women-beauty-g2-l1', name: 'Для тела' },
              { id: 'women-beauty-g2-l2', name: 'Для волос' },
              { id: 'women-beauty-g2-l3', name: 'Для рук' },
              { id: 'women-beauty-g2-l4', name: 'Для ног' },
              { id: 'women-beauty-g2-l5', name: 'Солнцезащитные средства' },
            ],
          },
        ],
      },
      {
        id: 'women-home',
        name: 'Дом и стиль жизни',
        children: [
          {
            id: 'women-home-g0',
            name: 'Текстиль',
            children: [
              { id: 'women-home-g0-l0', name: 'Пледы' },
              { id: 'women-home-g0-l1', name: 'Скатерти' },
              { id: 'women-home-g0-l2', name: 'Постельное' },
              { id: 'women-home-g0-l3', name: 'Полотенца' },
              { id: 'women-home-g0-l4', name: 'Коврики для ванной' },
              { id: 'women-home-g0-l5', name: 'Шторы' },
              { id: 'women-home-g0-l6', name: 'Салфетки' },
            ],
          },
          {
            id: 'women-home-g1',
            name: 'Декор',
            children: [
              { id: 'women-home-g1-l0', name: 'Вазы' },
              { id: 'women-home-g1-l1', name: 'Свечи' },
              { id: 'women-home-g1-l2', name: 'Подсвечники' },
              { id: 'women-home-g1-l3', name: 'Картины' },
              { id: 'women-home-g1-l4', name: 'Постеры' },
              { id: 'women-home-g1-l5', name: 'Зеркала' },
              { id: 'women-home-g1-l6', name: 'Статуэтки' },
            ],
          },
          {
            id: 'women-home-g2',
            name: 'Аксессуары',
            children: [
              { id: 'women-home-g2-l0', name: 'Ароматы для дома' },
              { id: 'women-home-g2-l1', name: 'Диффузоры' },
              { id: 'women-home-g2-l2', name: 'Саше' },
              { id: 'women-home-g2-l3', name: 'Органайзеры' },
            ],
          },
          {
            id: 'women-home-g3',
            name: 'Питомцы',
            children: [
              { id: 'women-home-g3-l0', name: 'Одежда' },
              { id: 'women-home-g3-l1', name: 'Лежанки' },
              { id: 'women-home-g3-l2', name: 'Переноски' },
              { id: 'women-home-g3-l3', name: 'Поводки' },
              { id: 'women-home-g3-l4', name: 'Ошейники' },
              { id: 'women-home-g3-l5', name: 'Игрушки' },
              { id: 'women-home-g3-l6', name: 'Миски' },
            ],
          },
          {
            id: 'women-home-g4',
            name: 'Lifestyle-гаджеты',
            children: [
              { id: 'women-home-g4-l0', name: 'Будильники' },
              { id: 'women-home-g4-l1', name: 'Лампы' },
              { id: 'women-home-g4-l2', name: 'Увлажнители' },
              { id: 'women-home-g4-l3', name: 'Массажеры' },
            ],
          },
        ],
      },
      {
        id: 'women-toys',
        name: 'Игрушки (детские)',
        children: [
          {
            id: 'women-toys-g0',
            name: 'Игрушки',
            children: [
              { id: 'women-toys-g0-l0', name: 'Мягкие игрушки' },
              { id: 'women-toys-g0-l1', name: 'Развивающие' },
              { id: 'women-toys-g0-l2', name: 'Конструкторы' },
              { id: 'women-toys-g0-l3', name: 'Куклы' },
              { id: 'women-toys-g0-l4', name: 'Машинки' },
              { id: 'women-toys-g0-l5', name: 'Настольные игры' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'men',
    name: 'Мужчины',
    categories: [
      {
        id: 'men-apparel',
        name: 'Одежда',
        children: [
          {
            id: 'men-apparel-g0',
            name: 'Верхняя одежда',
            children: [
              { id: 'men-apparel-g0-l0', name: 'Пальто' },
              { id: 'men-apparel-g0-l1', name: 'Тренчи' },
              { id: 'men-apparel-g0-l2', name: 'Парки' },
              { id: 'men-apparel-g0-l3', name: 'Пуховики' },
              { id: 'men-apparel-g0-l4', name: 'Куртки' },
              { id: 'men-apparel-g0-l5', name: 'Бомберы' },
              { id: 'men-apparel-g0-l6', name: 'Ветровки' },
              { id: 'men-apparel-g0-l7', name: 'Жилеты' },
              { id: 'men-apparel-g0-l8', name: 'Плащи' },
              { id: 'men-apparel-g0-l9', name: 'Дождевики' },
              { id: 'men-apparel-g0-l10', name: 'Пончо' },
              { id: 'men-apparel-g0-l11', name: 'Шубы' },
              { id: 'men-apparel-g0-l12', name: 'Лайнеры' },
              { id: 'men-apparel-g0-l13', name: 'Подстёжки' },
              { id: 'men-apparel-g0-l14', name: 'Комбинезоны' },
              { id: 'men-apparel-g0-l15', name: 'Анораки' },
              { id: 'men-apparel-g0-l16', name: 'Косухи' },
              { id: 'men-apparel-g0-l17', name: 'Дубленки' },
            ],
          },
          {
            id: 'men-apparel-g1',
            name: 'Костюмы и жакеты',
            children: [
              { id: 'men-apparel-g1-l0', name: 'Костюмы' },
              { id: 'men-apparel-g1-l1', name: 'Блейзеры' },
              { id: 'men-apparel-g1-l2', name: 'Смокинги' },
              { id: 'men-apparel-g1-l3', name: 'Фраки' },
              { id: 'men-apparel-g1-l4', name: 'Пиджаки' },
              { id: 'men-apparel-g1-l5', name: 'Жилеты' },
            ],
          },
          {
            id: 'men-apparel-g2',
            name: 'Платья и сарафаны',
            children: [
              { id: 'men-apparel-g2-l0', name: 'Платья' },
              { id: 'men-apparel-g2-l1', name: 'Сарафаны' },
              { id: 'men-apparel-g2-l2', name: 'Туники' },
            ],
          },
          {
            id: 'men-apparel-g3',
            name: 'Юбки',
            children: [
              { id: 'men-apparel-g3-l0', name: 'Мини' },
              { id: 'men-apparel-g3-l1', name: 'Миди' },
              { id: 'men-apparel-g3-l2', name: 'Макси' },
            ],
          },
          {
            id: 'men-apparel-g4',
            name: 'Рубашки и блузы',
            children: [
              { id: 'men-apparel-g4-l0', name: 'Рубашки' },
              { id: 'men-apparel-g4-l1', name: 'Блузы' },
              { id: 'men-apparel-g4-l2', name: 'Сорочки' },
            ],
          },
          {
            id: 'men-apparel-g5',
            name: 'Топы и футболки',
            children: [
              { id: 'men-apparel-g5-l0', name: 'Топы' },
              { id: 'men-apparel-g5-l1', name: 'Футболки' },
              { id: 'men-apparel-g5-l2', name: 'Поло' },
              { id: 'men-apparel-g5-l3', name: 'Майки' },
              { id: 'men-apparel-g5-l4', name: 'Кроп-топы' },
              { id: 'men-apparel-g5-l5', name: 'Лонгсливы' },
            ],
          },
          {
            id: 'men-apparel-g6',
            name: 'Джинсы',
            children: [
              { id: 'men-apparel-g6-l0', name: 'Прямые' },
              { id: 'men-apparel-g6-l1', name: 'Зауженные' },
              { id: 'men-apparel-g6-l2', name: 'Широкие' },
              { id: 'men-apparel-g6-l3', name: 'Клеш' },
              { id: 'men-apparel-g6-l4', name: 'Бойфренды' },
              { id: 'men-apparel-g6-l5', name: 'Мом' },
              { id: 'men-apparel-g6-l6', name: 'Скинни' },
            ],
          },
          {
            id: 'men-apparel-g7',
            name: 'Брюки',
            children: [
              { id: 'men-apparel-g7-l0', name: 'Классические' },
              { id: 'men-apparel-g7-l1', name: 'Чиносы' },
              { id: 'men-apparel-g7-l2', name: 'Спортивные' },
              { id: 'men-apparel-g7-l3', name: 'Джоггеры' },
              { id: 'men-apparel-g7-l4', name: 'Карго' },
              { id: 'men-apparel-g7-l5', name: 'Леггинсы' },
              { id: 'men-apparel-g7-l6', name: 'Шорты' },
              { id: 'men-apparel-g7-l7', name: 'Бермуды' },
            ],
          },
          {
            id: 'men-apparel-g8',
            name: 'Трикотаж',
            children: [
              { id: 'men-apparel-g8-l0', name: 'Свитеры' },
              { id: 'men-apparel-g8-l1', name: 'Худи' },
              { id: 'men-apparel-g8-l2', name: 'Кардиганы' },
              { id: 'men-apparel-g8-l3', name: 'Водолазки' },
              { id: 'men-apparel-g8-l4', name: 'Джемперы' },
              { id: 'men-apparel-g8-l5', name: 'Пуловеры' },
              { id: 'men-apparel-g8-l6', name: 'Свитшоты' },
            ],
          },
          {
            id: 'men-apparel-g9',
            name: 'Нижнее бельё',
            children: [
              { id: 'men-apparel-g9-l0', name: 'Трусы' },
              { id: 'men-apparel-g9-l1', name: 'Бюстгальтеры' },
              { id: 'men-apparel-g9-l2', name: 'Бюстье' },
              { id: 'men-apparel-g9-l3', name: 'Боди' },
              { id: 'men-apparel-g9-l4', name: 'Термобелье' },
              { id: 'men-apparel-g9-l5', name: 'Комбинации' },
              { id: 'men-apparel-g9-l6', name: 'Корсеты' },
            ],
          },
          {
            id: 'men-apparel-g10',
            name: 'Спортивная одежда',
            children: [
              { id: 'men-apparel-g10-l0', name: 'Спортивные костюмы' },
              { id: 'men-apparel-g10-l1', name: 'Тайтсы' },
              { id: 'men-apparel-g10-l2', name: 'Рашгарды' },
              { id: 'men-apparel-g10-l3', name: 'Спортивные топы' },
              { id: 'men-apparel-g10-l4', name: 'Шорты для плавания' },
            ],
          },
          {
            id: 'men-apparel-g11',
            name: 'Пляжная мода',
            children: [
              { id: 'men-apparel-g11-l0', name: 'Слитные купальники' },
              { id: 'men-apparel-g11-l1', name: 'Раздельные купальники' },
              { id: 'men-apparel-g11-l2', name: 'Плавки' },
              { id: 'men-apparel-g11-l3', name: 'Парео' },
              { id: 'men-apparel-g11-l4', name: 'Пляжные туники' },
            ],
          },
          {
            id: 'men-apparel-g12',
            name: 'Пижамы и домашняя одежда',
            children: [
              { id: 'men-apparel-g12-l0', name: 'Халаты' },
              { id: 'men-apparel-g12-l1', name: 'Комплекты' },
              { id: 'men-apparel-g12-l2', name: 'Ночные сорочки' },
              { id: 'men-apparel-g12-l3', name: 'Пижамы' },
            ],
          },
        ],
      },
      {
        id: 'men-shoes',
        name: 'Обувь',
        children: [
          {
            id: 'men-shoes-g0',
            name: 'Кроссовки',
            children: [
              { id: 'men-shoes-g0-l0', name: 'Спортивные' },
              { id: 'men-shoes-g0-l1', name: 'Повседневные' },
              { id: 'men-shoes-g0-l2', name: 'Хайтопы' },
              { id: 'men-shoes-g0-l3', name: 'Сникерсы' },
            ],
          },
          {
            id: 'men-shoes-g1',
            name: 'Туфли',
            children: [
              { id: 'men-shoes-g1-l0', name: 'Классические / лодочки' },
              { id: 'men-shoes-g1-l1', name: 'Балетки' },
              { id: 'men-shoes-g1-l2', name: 'Лоферы' },
              { id: 'men-shoes-g1-l3', name: 'Оксфорды' },
              { id: 'men-shoes-g1-l4', name: 'Дерби' },
              { id: 'men-shoes-g1-l5', name: 'Броги' },
            ],
          },
          {
            id: 'men-shoes-g2',
            name: 'Ботинки',
            children: [
              { id: 'men-shoes-g2-l0', name: 'Демисезонные' },
              { id: 'men-shoes-g2-l1', name: 'Зимние' },
              { id: 'men-shoes-g2-l2', name: 'Челси' },
              { id: 'men-shoes-g2-l3', name: 'Дезерты' },
              { id: 'men-shoes-g2-l4', name: 'Берцы' },
              { id: 'men-shoes-g2-l5', name: 'Тимберленды' },
              { id: 'men-shoes-g2-l6', name: 'Треккинговые' },
            ],
          },
          {
            id: 'men-shoes-g3',
            name: 'Сандалии и шлёпанцы',
            children: [
              { id: 'men-shoes-g3-l0', name: 'Сандалии' },
              { id: 'men-shoes-g3-l1', name: 'Шлепанцы' },
              { id: 'men-shoes-g3-l2', name: 'Босоножки' },
              { id: 'men-shoes-g3-l3', name: 'Вьетнамки' },
              { id: 'men-shoes-g3-l4', name: 'Сабо' },
              { id: 'men-shoes-g3-l5', name: 'Мюли' },
            ],
          },
          {
            id: 'men-shoes-g4',
            name: 'Сапоги',
            children: [
              { id: 'men-shoes-g4-l0', name: 'Зимние' },
              { id: 'men-shoes-g4-l1', name: 'Демисезонные' },
              { id: 'men-shoes-g4-l2', name: 'Ботфорты' },
              { id: 'men-shoes-g4-l3', name: 'Полусапоги' },
              { id: 'men-shoes-g4-l4', name: 'Резиновые' },
              { id: 'men-shoes-g4-l5', name: 'Казаки' },
            ],
          },
          {
            id: 'men-shoes-g5',
            name: 'Мокасины и топсайдеры',
            children: [
              { id: 'men-shoes-g5-l0', name: 'Мокасины' },
              { id: 'men-shoes-g5-l1', name: 'Топсайдеры' },
              { id: 'men-shoes-g5-l2', name: 'Слипоны' },
              { id: 'men-shoes-g5-l3', name: 'Эспадрильи' },
            ],
          },
          {
            id: 'men-shoes-g6',
            name: 'Угги и унты',
            children: [
              { id: 'men-shoes-g6-l0', name: 'Валенки' },
              { id: 'men-shoes-g6-l1', name: 'Угги' },
              { id: 'men-shoes-g6-l2', name: 'Унты' },
              { id: 'men-shoes-g6-l3', name: 'Дутики' },
            ],
          },
          {
            id: 'men-shoes-g7',
            name: 'Домашняя обувь',
            children: [
              { id: 'men-shoes-g7-l0', name: 'Тапочки' },
              { id: 'men-shoes-g7-l1', name: 'Чуни' },
            ],
          },
        ],
      },
      {
        id: 'men-bags',
        name: 'Сумки',
        children: [
          {
            id: 'men-bags-g0',
            name: 'Повседневные',
            children: [
              { id: 'men-bags-g0-l0', name: 'Тот' },
              { id: 'men-bags-g0-l1', name: 'Шоппер' },
              { id: 'men-bags-g0-l2', name: 'Кросс-боди' },
              { id: 'men-bags-g0-l3', name: 'Рюкзак' },
              { id: 'men-bags-g0-l4', name: 'Клатч' },
              { id: 'men-bags-g0-l5', name: 'Поясная' },
              { id: 'men-bags-g0-l6', name: 'Сумка-мешок' },
              { id: 'men-bags-g0-l7', name: 'Сумка-багет' },
            ],
          },
          {
            id: 'men-bags-g1',
            name: 'Вечерние',
            children: [
              { id: 'men-bags-g1-l0', name: 'Клатчи' },
              { id: 'men-bags-g1-l1', name: 'Минодьеры' },
              { id: 'men-bags-g1-l2', name: 'Сумки-конверты' },
            ],
          },
          {
            id: 'men-bags-g2',
            name: 'Чемоданы',
            children: [
              { id: 'men-bags-g2-l0', name: 'На колесах' },
              { id: 'men-bags-g2-l1', name: 'Сумки-тележки' },
              { id: 'men-bags-g2-l2', name: 'Кейсы' },
            ],
          },
          {
            id: 'men-bags-g3',
            name: 'Рабочие',
            children: [
              { id: 'men-bags-g3-l0', name: 'Для ноутбука' },
              { id: 'men-bags-g3-l1', name: 'Портфель' },
              { id: 'men-bags-g3-l2', name: 'Папки' },
              { id: 'men-bags-g3-l3', name: 'Сумка-портфель' },
            ],
          },
          {
            id: 'men-bags-g4',
            name: 'Спортивные и дорожные',
            children: [
              { id: 'men-bags-g4-l0', name: 'Спортивные сумки' },
              { id: 'men-bags-g4-l1', name: 'Дорожные сумки' },
              { id: 'men-bags-g4-l2', name: 'Рюкзаки туристические' },
              { id: 'men-bags-g4-l3', name: 'Дафл' },
            ],
          },
          {
            id: 'men-bags-g5',
            name: 'Косметички',
            children: [
              { id: 'men-bags-g5-l0', name: 'Несессеры' },
              { id: 'men-bags-g5-l1', name: 'Бьюти-кейсы' },
              { id: 'men-bags-g5-l2', name: 'Косметички' },
            ],
          },
        ],
      },
      {
        id: 'men-accessories',
        name: 'Аксессуары',
        children: [
          {
            id: 'men-accessories-g0',
            name: 'Очки',
            children: [
              { id: 'men-accessories-g0-l0', name: 'Солнцезащитные' },
              { id: 'men-accessories-g0-l1', name: 'Оправы' },
              { id: 'men-accessories-g0-l2', name: 'Футляры для очков' },
            ],
          },
          {
            id: 'men-accessories-g1',
            name: 'Ремни и подтяжки',
            children: [
              { id: 'men-accessories-g1-l0', name: 'Ремни' },
              { id: 'men-accessories-g1-l1', name: 'Подтяжки' },
              { id: 'men-accessories-g1-l2', name: 'Пояса' },
            ],
          },
          {
            id: 'men-accessories-g2',
            name: 'Перчатки и варежки',
            children: [
              { id: 'men-accessories-g2-l0', name: 'Перчатки' },
              { id: 'men-accessories-g2-l1', name: 'Варежки' },
              { id: 'men-accessories-g2-l2', name: 'Митенки' },
            ],
          },
          {
            id: 'men-accessories-g3',
            name: 'Шарфы',
            children: [
              { id: 'men-accessories-g3-l0', name: 'Шарфы' },
              { id: 'men-accessories-g3-l1', name: 'Снуды' },
              { id: 'men-accessories-g3-l2', name: 'Палантины' },
              { id: 'men-accessories-g3-l3', name: 'Горжетки' },
            ],
          },
          {
            id: 'men-accessories-g4',
            name: 'Галстуки и бабочки',
            children: [
              { id: 'men-accessories-g4-l0', name: 'Галстуки' },
              { id: 'men-accessories-g4-l1', name: 'Бабочки' },
              { id: 'men-accessories-g4-l2', name: 'Зажимы для галстука' },
            ],
          },
          {
            id: 'men-accessories-g5',
            name: 'Платки',
            children: [
              { id: 'men-accessories-g5-l0', name: 'Шейные платки' },
              { id: 'men-accessories-g5-l1', name: 'Банданы' },
              { id: 'men-accessories-g5-l2', name: 'Косынки' },
            ],
          },
          {
            id: 'men-accessories-g6',
            name: 'Украшения',
            children: [
              { id: 'men-accessories-g6-l0', name: 'Кольца' },
              { id: 'men-accessories-g6-l1', name: 'Серьги' },
              { id: 'men-accessories-g6-l2', name: 'Браслеты' },
              { id: 'men-accessories-g6-l3', name: 'Колье' },
              { id: 'men-accessories-g6-l4', name: 'Подвески' },
              { id: 'men-accessories-g6-l5', name: 'Броши' },
              { id: 'men-accessories-g6-l6', name: 'Цепочки' },
            ],
          },
          {
            id: 'men-accessories-g7',
            name: 'Кожгалантерея мелкая',
            children: [
              { id: 'men-accessories-g7-l0', name: 'Кошельки' },
              { id: 'men-accessories-g7-l1', name: 'Портмоне' },
              { id: 'men-accessories-g7-l2', name: 'Визитницы' },
              { id: 'men-accessories-g7-l3', name: 'Ключницы' },
              { id: 'men-accessories-g7-l4', name: 'Обложки для документов' },
            ],
          },
          {
            id: 'men-accessories-g8',
            name: 'Зонты',
            children: [
              { id: 'men-accessories-g8-l0', name: 'Трости' },
              { id: 'men-accessories-g8-l1', name: 'Складные' },
            ],
          },
          {
            id: 'men-accessories-g9',
            name: 'Тех-аксессуары',
            children: [
              { id: 'men-accessories-g9-l0', name: 'Чехлы для телефонов' },
              { id: 'men-accessories-g9-l1', name: 'Чехлы для наушников' },
              { id: 'men-accessories-g9-l2', name: 'Ремешки для часов' },
            ],
          },
          {
            id: 'men-accessories-g10',
            name: 'Маски и бафы',
            children: [
              { id: 'men-accessories-g10-l0', name: 'Маски' },
              { id: 'men-accessories-g10-l1', name: 'Балаклавы' },
              { id: 'men-accessories-g10-l2', name: 'Бафы' },
            ],
          },
        ],
      },
      {
        id: 'men-headwear',
        name: 'Головные уборы',
        children: [
          {
            id: 'men-headwear-g0',
            name: 'Кепки',
            children: [
              { id: 'men-headwear-g0-l0', name: 'Бейсболки' },
              { id: 'men-headwear-g0-l1', name: 'Снепбеки' },
              { id: 'men-headwear-g0-l2', name: 'Тракеры' },
              { id: 'men-headwear-g0-l3', name: 'Кепки-уточки' },
            ],
          },
          {
            id: 'men-headwear-g1',
            name: 'Панамы',
            children: [
              { id: 'men-headwear-g1-l0', name: 'Панамы' },
              { id: 'men-headwear-g1-l1', name: 'Шляпы-ведро' },
            ],
          },
          {
            id: 'men-headwear-g2',
            name: 'Шляпы',
            children: [
              { id: 'men-headwear-g2-l0', name: 'Федоры' },
              { id: 'men-headwear-g2-l1', name: 'Трилби' },
              { id: 'men-headwear-g2-l2', name: 'Канотье' },
              { id: 'men-headwear-g2-l3', name: 'Широкополые' },
              { id: 'men-headwear-g2-l4', name: 'Цилиндры' },
              { id: 'men-headwear-g2-l5', name: 'Котелки' },
            ],
          },
          {
            id: 'men-headwear-g3',
            name: 'Береты',
            children: [
              { id: 'men-headwear-g3-l0', name: 'Классические' },
              { id: 'men-headwear-g3-l1', name: 'Объемные' },
            ],
          },
          {
            id: 'men-headwear-g4',
            name: 'Шапки',
            children: [
              { id: 'men-headwear-g4-l0', name: 'Бини' },
              { id: 'men-headwear-g4-l1', name: 'Ушанки' },
              { id: 'men-headwear-g4-l2', name: 'С помпоном' },
              { id: 'men-headwear-g4-l3', name: 'Капоры' },
            ],
          },
        ],
      },
      {
        id: 'men-hosiery',
        name: 'Носочно-чулочные',
        children: [
          {
            id: 'men-hosiery-g0',
            name: 'Носки',
            children: [
              { id: 'men-hosiery-g0-l0', name: 'Короткие' },
              { id: 'men-hosiery-g0-l1', name: 'Классические' },
              { id: 'men-hosiery-g0-l2', name: 'Спортивные' },
              { id: 'men-hosiery-g0-l3', name: 'Следки' },
            ],
          },
          {
            id: 'men-hosiery-g1',
            name: 'Колготки',
            children: [
              { id: 'men-hosiery-g1-l0', name: 'Капроновые' },
              { id: 'men-hosiery-g1-l1', name: 'Хлопковые' },
              { id: 'men-hosiery-g1-l2', name: 'Шерстяные' },
              { id: 'men-hosiery-g1-l3', name: 'Фантазийные' },
            ],
          },
          {
            id: 'men-hosiery-g2',
            name: 'Чулки',
            children: [
              { id: 'men-hosiery-g2-l0', name: 'С кружевом' },
              { id: 'men-hosiery-g2-l1', name: 'Под пояс' },
              { id: 'men-hosiery-g2-l2', name: 'Компрессионные' },
            ],
          },
          {
            id: 'men-hosiery-g3',
            name: 'Гольфы',
            children: [
              { id: 'men-hosiery-g3-l0', name: 'Капроновые' },
              { id: 'men-hosiery-g3-l1', name: 'Хлопковые' },
            ],
          },
          {
            id: 'men-hosiery-g4',
            name: 'Гетры',
            children: [
              { id: 'men-hosiery-g4-l0', name: 'Спортивные' },
              { id: 'men-hosiery-g4-l1', name: 'Вязаные' },
            ],
          },
        ],
      },
      {
        id: 'men-beauty',
        name: 'Красота и уход',
        children: [
          {
            id: 'men-beauty-g0',
            name: 'Парфюмерия',
            children: [
              { id: 'men-beauty-g0-l0', name: 'Духи' },
              { id: 'men-beauty-g0-l1', name: 'Парфюмерная вода' },
              { id: 'men-beauty-g0-l2', name: 'Туалетная вода' },
              { id: 'men-beauty-g0-l3', name: 'Одеколоны' },
              { id: 'men-beauty-g0-l4', name: 'Спреи для тела' },
            ],
          },
          {
            id: 'men-beauty-g1',
            name: 'Косметика',
            children: [
              { id: 'men-beauty-g1-l0', name: 'Для лица' },
              { id: 'men-beauty-g1-l1', name: 'Для глаз' },
              { id: 'men-beauty-g1-l2', name: 'Для губ' },
              { id: 'men-beauty-g1-l3', name: 'Для бровей' },
              { id: 'men-beauty-g1-l4', name: 'Палетки' },
              { id: 'men-beauty-g1-l5', name: 'Кисти и спонжи' },
            ],
          },
          {
            id: 'men-beauty-g2',
            name: 'Уход',
            children: [
              { id: 'men-beauty-g2-l0', name: 'Для лица' },
              { id: 'men-beauty-g2-l1', name: 'Для тела' },
              { id: 'men-beauty-g2-l2', name: 'Для волос' },
              { id: 'men-beauty-g2-l3', name: 'Для рук' },
              { id: 'men-beauty-g2-l4', name: 'Для ног' },
              { id: 'men-beauty-g2-l5', name: 'Солнцезащитные средства' },
            ],
          },
        ],
      },
      {
        id: 'men-home',
        name: 'Дом и стиль жизни',
        children: [
          {
            id: 'men-home-g0',
            name: 'Текстиль',
            children: [
              { id: 'men-home-g0-l0', name: 'Пледы' },
              { id: 'men-home-g0-l1', name: 'Скатерти' },
              { id: 'men-home-g0-l2', name: 'Постельное' },
              { id: 'men-home-g0-l3', name: 'Полотенца' },
              { id: 'men-home-g0-l4', name: 'Коврики для ванной' },
              { id: 'men-home-g0-l5', name: 'Шторы' },
              { id: 'men-home-g0-l6', name: 'Салфетки' },
            ],
          },
          {
            id: 'men-home-g1',
            name: 'Декор',
            children: [
              { id: 'men-home-g1-l0', name: 'Вазы' },
              { id: 'men-home-g1-l1', name: 'Свечи' },
              { id: 'men-home-g1-l2', name: 'Подсвечники' },
              { id: 'men-home-g1-l3', name: 'Картины' },
              { id: 'men-home-g1-l4', name: 'Постеры' },
              { id: 'men-home-g1-l5', name: 'Зеркала' },
              { id: 'men-home-g1-l6', name: 'Статуэтки' },
            ],
          },
          {
            id: 'men-home-g2',
            name: 'Аксессуары',
            children: [
              { id: 'men-home-g2-l0', name: 'Ароматы для дома' },
              { id: 'men-home-g2-l1', name: 'Диффузоры' },
              { id: 'men-home-g2-l2', name: 'Саше' },
              { id: 'men-home-g2-l3', name: 'Органайзеры' },
            ],
          },
          {
            id: 'men-home-g3',
            name: 'Питомцы',
            children: [
              { id: 'men-home-g3-l0', name: 'Одежда' },
              { id: 'men-home-g3-l1', name: 'Лежанки' },
              { id: 'men-home-g3-l2', name: 'Переноски' },
              { id: 'men-home-g3-l3', name: 'Поводки' },
              { id: 'men-home-g3-l4', name: 'Ошейники' },
              { id: 'men-home-g3-l5', name: 'Игрушки' },
              { id: 'men-home-g3-l6', name: 'Миски' },
            ],
          },
          {
            id: 'men-home-g4',
            name: 'Lifestyle-гаджеты',
            children: [
              { id: 'men-home-g4-l0', name: 'Будильники' },
              { id: 'men-home-g4-l1', name: 'Лампы' },
              { id: 'men-home-g4-l2', name: 'Увлажнители' },
              { id: 'men-home-g4-l3', name: 'Массажеры' },
            ],
          },
        ],
      },
      {
        id: 'men-toys',
        name: 'Игрушки (детские)',
        children: [
          {
            id: 'men-toys-g0',
            name: 'Игрушки',
            children: [
              { id: 'men-toys-g0-l0', name: 'Мягкие игрушки' },
              { id: 'men-toys-g0-l1', name: 'Развивающие' },
              { id: 'men-toys-g0-l2', name: 'Конструкторы' },
              { id: 'men-toys-g0-l3', name: 'Куклы' },
              { id: 'men-toys-g0-l4', name: 'Машинки' },
              { id: 'men-toys-g0-l5', name: 'Настольные игры' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'kids',
    name: 'Дети',
    categories: [
      {
        id: 'kids-apparel',
        name: 'Одежда',
        children: [
          {
            id: 'kids-apparel-g0',
            name: 'Верхняя одежда',
            children: [
              { id: 'kids-apparel-g0-l0', name: 'Пальто' },
              { id: 'kids-apparel-g0-l1', name: 'Тренчи' },
              { id: 'kids-apparel-g0-l2', name: 'Парки' },
              { id: 'kids-apparel-g0-l3', name: 'Пуховики' },
              { id: 'kids-apparel-g0-l4', name: 'Куртки' },
              { id: 'kids-apparel-g0-l5', name: 'Бомберы' },
              { id: 'kids-apparel-g0-l6', name: 'Ветровки' },
              { id: 'kids-apparel-g0-l7', name: 'Жилеты' },
              { id: 'kids-apparel-g0-l8', name: 'Плащи' },
              { id: 'kids-apparel-g0-l9', name: 'Дождевики' },
              { id: 'kids-apparel-g0-l10', name: 'Пончо' },
              { id: 'kids-apparel-g0-l11', name: 'Шубы' },
              { id: 'kids-apparel-g0-l12', name: 'Лайнеры' },
              { id: 'kids-apparel-g0-l13', name: 'Подстёжки' },
              { id: 'kids-apparel-g0-l14', name: 'Комбинезоны' },
              { id: 'kids-apparel-g0-l15', name: 'Анораки' },
              { id: 'kids-apparel-g0-l16', name: 'Косухи' },
              { id: 'kids-apparel-g0-l17', name: 'Дубленки' },
            ],
          },
          {
            id: 'kids-apparel-g1',
            name: 'Костюмы и жакеты',
            children: [
              { id: 'kids-apparel-g1-l0', name: 'Костюмы' },
              { id: 'kids-apparel-g1-l1', name: 'Блейзеры' },
              { id: 'kids-apparel-g1-l2', name: 'Смокинги' },
              { id: 'kids-apparel-g1-l3', name: 'Фраки' },
              { id: 'kids-apparel-g1-l4', name: 'Пиджаки' },
              { id: 'kids-apparel-g1-l5', name: 'Жилеты' },
            ],
          },
          {
            id: 'kids-apparel-g2',
            name: 'Платья и сарафаны',
            children: [
              { id: 'kids-apparel-g2-l0', name: 'Платья' },
              { id: 'kids-apparel-g2-l1', name: 'Сарафаны' },
              { id: 'kids-apparel-g2-l2', name: 'Туники' },
            ],
          },
          {
            id: 'kids-apparel-g3',
            name: 'Юбки',
            children: [
              { id: 'kids-apparel-g3-l0', name: 'Мини' },
              { id: 'kids-apparel-g3-l1', name: 'Миди' },
              { id: 'kids-apparel-g3-l2', name: 'Макси' },
            ],
          },
          {
            id: 'kids-apparel-g4',
            name: 'Рубашки и блузы',
            children: [
              { id: 'kids-apparel-g4-l0', name: 'Рубашки' },
              { id: 'kids-apparel-g4-l1', name: 'Блузы' },
              { id: 'kids-apparel-g4-l2', name: 'Сорочки' },
            ],
          },
          {
            id: 'kids-apparel-g5',
            name: 'Топы и футболки',
            children: [
              { id: 'kids-apparel-g5-l0', name: 'Топы' },
              { id: 'kids-apparel-g5-l1', name: 'Футболки' },
              { id: 'kids-apparel-g5-l2', name: 'Поло' },
              { id: 'kids-apparel-g5-l3', name: 'Майки' },
              { id: 'kids-apparel-g5-l4', name: 'Кроп-топы' },
              { id: 'kids-apparel-g5-l5', name: 'Лонгсливы' },
            ],
          },
          {
            id: 'kids-apparel-g6',
            name: 'Джинсы',
            children: [
              { id: 'kids-apparel-g6-l0', name: 'Прямые' },
              { id: 'kids-apparel-g6-l1', name: 'Зауженные' },
              { id: 'kids-apparel-g6-l2', name: 'Широкие' },
              { id: 'kids-apparel-g6-l3', name: 'Клеш' },
              { id: 'kids-apparel-g6-l4', name: 'Бойфренды' },
              { id: 'kids-apparel-g6-l5', name: 'Мом' },
              { id: 'kids-apparel-g6-l6', name: 'Скинни' },
            ],
          },
          {
            id: 'kids-apparel-g7',
            name: 'Брюки',
            children: [
              { id: 'kids-apparel-g7-l0', name: 'Классические' },
              { id: 'kids-apparel-g7-l1', name: 'Чиносы' },
              { id: 'kids-apparel-g7-l2', name: 'Спортивные' },
              { id: 'kids-apparel-g7-l3', name: 'Джоггеры' },
              { id: 'kids-apparel-g7-l4', name: 'Карго' },
              { id: 'kids-apparel-g7-l5', name: 'Леггинсы' },
              { id: 'kids-apparel-g7-l6', name: 'Шорты' },
              { id: 'kids-apparel-g7-l7', name: 'Бермуды' },
            ],
          },
          {
            id: 'kids-apparel-g8',
            name: 'Трикотаж',
            children: [
              { id: 'kids-apparel-g8-l0', name: 'Свитеры' },
              { id: 'kids-apparel-g8-l1', name: 'Худи' },
              { id: 'kids-apparel-g8-l2', name: 'Кардиганы' },
              { id: 'kids-apparel-g8-l3', name: 'Водолазки' },
              { id: 'kids-apparel-g8-l4', name: 'Джемперы' },
              { id: 'kids-apparel-g8-l5', name: 'Пуловеры' },
              { id: 'kids-apparel-g8-l6', name: 'Свитшоты' },
            ],
          },
          {
            id: 'kids-apparel-g9',
            name: 'Нижнее бельё',
            children: [
              { id: 'kids-apparel-g9-l0', name: 'Трусы' },
              { id: 'kids-apparel-g9-l1', name: 'Бюстгальтеры' },
              { id: 'kids-apparel-g9-l2', name: 'Бюстье' },
              { id: 'kids-apparel-g9-l3', name: 'Боди' },
              { id: 'kids-apparel-g9-l4', name: 'Термобелье' },
              { id: 'kids-apparel-g9-l5', name: 'Комбинации' },
              { id: 'kids-apparel-g9-l6', name: 'Корсеты' },
            ],
          },
          {
            id: 'kids-apparel-g10',
            name: 'Спортивная одежда',
            children: [
              { id: 'kids-apparel-g10-l0', name: 'Спортивные костюмы' },
              { id: 'kids-apparel-g10-l1', name: 'Тайтсы' },
              { id: 'kids-apparel-g10-l2', name: 'Рашгарды' },
              { id: 'kids-apparel-g10-l3', name: 'Спортивные топы' },
              { id: 'kids-apparel-g10-l4', name: 'Шорты для плавания' },
            ],
          },
          {
            id: 'kids-apparel-g11',
            name: 'Пляжная мода',
            children: [
              { id: 'kids-apparel-g11-l0', name: 'Слитные купальники' },
              { id: 'kids-apparel-g11-l1', name: 'Раздельные купальники' },
              { id: 'kids-apparel-g11-l2', name: 'Плавки' },
              { id: 'kids-apparel-g11-l3', name: 'Парео' },
              { id: 'kids-apparel-g11-l4', name: 'Пляжные туники' },
            ],
          },
          {
            id: 'kids-apparel-g12',
            name: 'Пижамы и домашняя одежда',
            children: [
              { id: 'kids-apparel-g12-l0', name: 'Халаты' },
              { id: 'kids-apparel-g12-l1', name: 'Комплекты' },
              { id: 'kids-apparel-g12-l2', name: 'Ночные сорочки' },
              { id: 'kids-apparel-g12-l3', name: 'Пижамы' },
            ],
          },
        ],
      },
      {
        id: 'kids-shoes',
        name: 'Обувь',
        children: [
          {
            id: 'kids-shoes-g0',
            name: 'Кроссовки',
            children: [
              { id: 'kids-shoes-g0-l0', name: 'Спортивные' },
              { id: 'kids-shoes-g0-l1', name: 'Повседневные' },
              { id: 'kids-shoes-g0-l2', name: 'Хайтопы' },
              { id: 'kids-shoes-g0-l3', name: 'Сникерсы' },
            ],
          },
          {
            id: 'kids-shoes-g1',
            name: 'Туфли',
            children: [
              { id: 'kids-shoes-g1-l0', name: 'Классические / лодочки' },
              { id: 'kids-shoes-g1-l1', name: 'Балетки' },
              { id: 'kids-shoes-g1-l2', name: 'Лоферы' },
              { id: 'kids-shoes-g1-l3', name: 'Оксфорды' },
              { id: 'kids-shoes-g1-l4', name: 'Дерби' },
              { id: 'kids-shoes-g1-l5', name: 'Броги' },
            ],
          },
          {
            id: 'kids-shoes-g2',
            name: 'Ботинки',
            children: [
              { id: 'kids-shoes-g2-l0', name: 'Демисезонные' },
              { id: 'kids-shoes-g2-l1', name: 'Зимние' },
              { id: 'kids-shoes-g2-l2', name: 'Челси' },
              { id: 'kids-shoes-g2-l3', name: 'Дезерты' },
              { id: 'kids-shoes-g2-l4', name: 'Берцы' },
              { id: 'kids-shoes-g2-l5', name: 'Тимберленды' },
              { id: 'kids-shoes-g2-l6', name: 'Треккинговые' },
            ],
          },
          {
            id: 'kids-shoes-g3',
            name: 'Сандалии и шлёпанцы',
            children: [
              { id: 'kids-shoes-g3-l0', name: 'Сандалии' },
              { id: 'kids-shoes-g3-l1', name: 'Шлепанцы' },
              { id: 'kids-shoes-g3-l2', name: 'Босоножки' },
              { id: 'kids-shoes-g3-l3', name: 'Вьетнамки' },
              { id: 'kids-shoes-g3-l4', name: 'Сабо' },
              { id: 'kids-shoes-g3-l5', name: 'Мюли' },
            ],
          },
          {
            id: 'kids-shoes-g4',
            name: 'Сапоги',
            children: [
              { id: 'kids-shoes-g4-l0', name: 'Зимние' },
              { id: 'kids-shoes-g4-l1', name: 'Демисезонные' },
              { id: 'kids-shoes-g4-l2', name: 'Ботфорты' },
              { id: 'kids-shoes-g4-l3', name: 'Полусапоги' },
              { id: 'kids-shoes-g4-l4', name: 'Резиновые' },
              { id: 'kids-shoes-g4-l5', name: 'Казаки' },
            ],
          },
          {
            id: 'kids-shoes-g5',
            name: 'Мокасины и топсайдеры',
            children: [
              { id: 'kids-shoes-g5-l0', name: 'Мокасины' },
              { id: 'kids-shoes-g5-l1', name: 'Топсайдеры' },
              { id: 'kids-shoes-g5-l2', name: 'Слипоны' },
              { id: 'kids-shoes-g5-l3', name: 'Эспадрильи' },
            ],
          },
          {
            id: 'kids-shoes-g6',
            name: 'Угги и унты',
            children: [
              { id: 'kids-shoes-g6-l0', name: 'Валенки' },
              { id: 'kids-shoes-g6-l1', name: 'Угги' },
              { id: 'kids-shoes-g6-l2', name: 'Унты' },
              { id: 'kids-shoes-g6-l3', name: 'Дутики' },
            ],
          },
          {
            id: 'kids-shoes-g7',
            name: 'Домашняя обувь',
            children: [
              { id: 'kids-shoes-g7-l0', name: 'Тапочки' },
              { id: 'kids-shoes-g7-l1', name: 'Чуни' },
            ],
          },
        ],
      },
      {
        id: 'kids-bags',
        name: 'Сумки',
        children: [
          {
            id: 'kids-bags-g0',
            name: 'Повседневные',
            children: [
              { id: 'kids-bags-g0-l0', name: 'Тот' },
              { id: 'kids-bags-g0-l1', name: 'Шоппер' },
              { id: 'kids-bags-g0-l2', name: 'Кросс-боди' },
              { id: 'kids-bags-g0-l3', name: 'Рюкзак' },
              { id: 'kids-bags-g0-l4', name: 'Клатч' },
              { id: 'kids-bags-g0-l5', name: 'Поясная' },
              { id: 'kids-bags-g0-l6', name: 'Сумка-мешок' },
              { id: 'kids-bags-g0-l7', name: 'Сумка-багет' },
            ],
          },
          {
            id: 'kids-bags-g1',
            name: 'Вечерние',
            children: [
              { id: 'kids-bags-g1-l0', name: 'Клатчи' },
              { id: 'kids-bags-g1-l1', name: 'Минодьеры' },
              { id: 'kids-bags-g1-l2', name: 'Сумки-конверты' },
            ],
          },
          {
            id: 'kids-bags-g2',
            name: 'Чемоданы',
            children: [
              { id: 'kids-bags-g2-l0', name: 'На колесах' },
              { id: 'kids-bags-g2-l1', name: 'Сумки-тележки' },
              { id: 'kids-bags-g2-l2', name: 'Кейсы' },
            ],
          },
          {
            id: 'kids-bags-g3',
            name: 'Рабочие',
            children: [
              { id: 'kids-bags-g3-l0', name: 'Для ноутбука' },
              { id: 'kids-bags-g3-l1', name: 'Портфель' },
              { id: 'kids-bags-g3-l2', name: 'Папки' },
              { id: 'kids-bags-g3-l3', name: 'Сумка-портфель' },
            ],
          },
          {
            id: 'kids-bags-g4',
            name: 'Спортивные и дорожные',
            children: [
              { id: 'kids-bags-g4-l0', name: 'Спортивные сумки' },
              { id: 'kids-bags-g4-l1', name: 'Дорожные сумки' },
              { id: 'kids-bags-g4-l2', name: 'Рюкзаки туристические' },
              { id: 'kids-bags-g4-l3', name: 'Дафл' },
            ],
          },
          {
            id: 'kids-bags-g5',
            name: 'Косметички',
            children: [
              { id: 'kids-bags-g5-l0', name: 'Несессеры' },
              { id: 'kids-bags-g5-l1', name: 'Бьюти-кейсы' },
              { id: 'kids-bags-g5-l2', name: 'Косметички' },
            ],
          },
        ],
      },
      {
        id: 'kids-accessories',
        name: 'Аксессуары',
        children: [
          {
            id: 'kids-accessories-g0',
            name: 'Очки',
            children: [
              { id: 'kids-accessories-g0-l0', name: 'Солнцезащитные' },
              { id: 'kids-accessories-g0-l1', name: 'Оправы' },
              { id: 'kids-accessories-g0-l2', name: 'Футляры для очков' },
            ],
          },
          {
            id: 'kids-accessories-g1',
            name: 'Ремни и подтяжки',
            children: [
              { id: 'kids-accessories-g1-l0', name: 'Ремни' },
              { id: 'kids-accessories-g1-l1', name: 'Подтяжки' },
              { id: 'kids-accessories-g1-l2', name: 'Пояса' },
            ],
          },
          {
            id: 'kids-accessories-g2',
            name: 'Перчатки и варежки',
            children: [
              { id: 'kids-accessories-g2-l0', name: 'Перчатки' },
              { id: 'kids-accessories-g2-l1', name: 'Варежки' },
              { id: 'kids-accessories-g2-l2', name: 'Митенки' },
            ],
          },
          {
            id: 'kids-accessories-g3',
            name: 'Шарфы',
            children: [
              { id: 'kids-accessories-g3-l0', name: 'Шарфы' },
              { id: 'kids-accessories-g3-l1', name: 'Снуды' },
              { id: 'kids-accessories-g3-l2', name: 'Палантины' },
              { id: 'kids-accessories-g3-l3', name: 'Горжетки' },
            ],
          },
          {
            id: 'kids-accessories-g4',
            name: 'Галстуки и бабочки',
            children: [
              { id: 'kids-accessories-g4-l0', name: 'Галстуки' },
              { id: 'kids-accessories-g4-l1', name: 'Бабочки' },
              { id: 'kids-accessories-g4-l2', name: 'Зажимы для галстука' },
            ],
          },
          {
            id: 'kids-accessories-g5',
            name: 'Платки',
            children: [
              { id: 'kids-accessories-g5-l0', name: 'Шейные платки' },
              { id: 'kids-accessories-g5-l1', name: 'Банданы' },
              { id: 'kids-accessories-g5-l2', name: 'Косынки' },
            ],
          },
          {
            id: 'kids-accessories-g6',
            name: 'Украшения',
            children: [
              { id: 'kids-accessories-g6-l0', name: 'Кольца' },
              { id: 'kids-accessories-g6-l1', name: 'Серьги' },
              { id: 'kids-accessories-g6-l2', name: 'Браслеты' },
              { id: 'kids-accessories-g6-l3', name: 'Колье' },
              { id: 'kids-accessories-g6-l4', name: 'Подвески' },
              { id: 'kids-accessories-g6-l5', name: 'Броши' },
              { id: 'kids-accessories-g6-l6', name: 'Цепочки' },
            ],
          },
          {
            id: 'kids-accessories-g7',
            name: 'Кожгалантерея мелкая',
            children: [
              { id: 'kids-accessories-g7-l0', name: 'Кошельки' },
              { id: 'kids-accessories-g7-l1', name: 'Портмоне' },
              { id: 'kids-accessories-g7-l2', name: 'Визитницы' },
              { id: 'kids-accessories-g7-l3', name: 'Ключницы' },
              { id: 'kids-accessories-g7-l4', name: 'Обложки для документов' },
            ],
          },
          {
            id: 'kids-accessories-g8',
            name: 'Зонты',
            children: [
              { id: 'kids-accessories-g8-l0', name: 'Трости' },
              { id: 'kids-accessories-g8-l1', name: 'Складные' },
            ],
          },
          {
            id: 'kids-accessories-g9',
            name: 'Тех-аксессуары',
            children: [
              { id: 'kids-accessories-g9-l0', name: 'Чехлы для телефонов' },
              { id: 'kids-accessories-g9-l1', name: 'Чехлы для наушников' },
              { id: 'kids-accessories-g9-l2', name: 'Ремешки для часов' },
            ],
          },
          {
            id: 'kids-accessories-g10',
            name: 'Маски и бафы',
            children: [
              { id: 'kids-accessories-g10-l0', name: 'Маски' },
              { id: 'kids-accessories-g10-l1', name: 'Балаклавы' },
              { id: 'kids-accessories-g10-l2', name: 'Бафы' },
            ],
          },
        ],
      },
      {
        id: 'kids-headwear',
        name: 'Головные уборы',
        children: [
          {
            id: 'kids-headwear-g0',
            name: 'Кепки',
            children: [
              { id: 'kids-headwear-g0-l0', name: 'Бейсболки' },
              { id: 'kids-headwear-g0-l1', name: 'Снепбеки' },
              { id: 'kids-headwear-g0-l2', name: 'Тракеры' },
              { id: 'kids-headwear-g0-l3', name: 'Кепки-уточки' },
            ],
          },
          {
            id: 'kids-headwear-g1',
            name: 'Панамы',
            children: [
              { id: 'kids-headwear-g1-l0', name: 'Панамы' },
              { id: 'kids-headwear-g1-l1', name: 'Шляпы-ведро' },
            ],
          },
          {
            id: 'kids-headwear-g2',
            name: 'Шляпы',
            children: [
              { id: 'kids-headwear-g2-l0', name: 'Федоры' },
              { id: 'kids-headwear-g2-l1', name: 'Трилби' },
              { id: 'kids-headwear-g2-l2', name: 'Канотье' },
              { id: 'kids-headwear-g2-l3', name: 'Широкополые' },
              { id: 'kids-headwear-g2-l4', name: 'Цилиндры' },
              { id: 'kids-headwear-g2-l5', name: 'Котелки' },
            ],
          },
          {
            id: 'kids-headwear-g3',
            name: 'Береты',
            children: [
              { id: 'kids-headwear-g3-l0', name: 'Классические' },
              { id: 'kids-headwear-g3-l1', name: 'Объемные' },
            ],
          },
          {
            id: 'kids-headwear-g4',
            name: 'Шапки',
            children: [
              { id: 'kids-headwear-g4-l0', name: 'Бини' },
              { id: 'kids-headwear-g4-l1', name: 'Ушанки' },
              { id: 'kids-headwear-g4-l2', name: 'С помпоном' },
              { id: 'kids-headwear-g4-l3', name: 'Капоры' },
            ],
          },
        ],
      },
      {
        id: 'kids-hosiery',
        name: 'Носочно-чулочные',
        children: [
          {
            id: 'kids-hosiery-g0',
            name: 'Носки',
            children: [
              { id: 'kids-hosiery-g0-l0', name: 'Короткие' },
              { id: 'kids-hosiery-g0-l1', name: 'Классические' },
              { id: 'kids-hosiery-g0-l2', name: 'Спортивные' },
              { id: 'kids-hosiery-g0-l3', name: 'Следки' },
            ],
          },
          {
            id: 'kids-hosiery-g1',
            name: 'Колготки',
            children: [
              { id: 'kids-hosiery-g1-l0', name: 'Капроновые' },
              { id: 'kids-hosiery-g1-l1', name: 'Хлопковые' },
              { id: 'kids-hosiery-g1-l2', name: 'Шерстяные' },
              { id: 'kids-hosiery-g1-l3', name: 'Фантазийные' },
            ],
          },
          {
            id: 'kids-hosiery-g2',
            name: 'Чулки',
            children: [
              { id: 'kids-hosiery-g2-l0', name: 'С кружевом' },
              { id: 'kids-hosiery-g2-l1', name: 'Под пояс' },
              { id: 'kids-hosiery-g2-l2', name: 'Компрессионные' },
            ],
          },
          {
            id: 'kids-hosiery-g3',
            name: 'Гольфы',
            children: [
              { id: 'kids-hosiery-g3-l0', name: 'Капроновые' },
              { id: 'kids-hosiery-g3-l1', name: 'Хлопковые' },
            ],
          },
          {
            id: 'kids-hosiery-g4',
            name: 'Гетры',
            children: [
              { id: 'kids-hosiery-g4-l0', name: 'Спортивные' },
              { id: 'kids-hosiery-g4-l1', name: 'Вязаные' },
            ],
          },
        ],
      },
      {
        id: 'kids-newborn',
        name: 'Аксессуары для новорождённых',
        children: [
          {
            id: 'kids-newborn-g0',
            name: 'Коляски',
            children: [
              { id: 'kids-newborn-g0-l0', name: 'Коляски' },
              { id: 'kids-newborn-g0-l1', name: 'Аксессуары для колясок' },
            ],
          },
          {
            id: 'kids-newborn-g1',
            name: 'Аксессуары',
            children: [
              { id: 'kids-newborn-g1-l0', name: 'Пелёнки' },
              { id: 'kids-newborn-g1-l1', name: 'Бутылочки' },
              { id: 'kids-newborn-g1-l2', name: 'Соски и пустышки' },
              { id: 'kids-newborn-g1-l3', name: 'Подгузники' },
              { id: 'kids-newborn-g1-l4', name: 'Поильники' },
              { id: 'kids-newborn-g1-l5', name: 'Гигиена и купание' },
              { id: 'kids-newborn-g1-l6', name: 'Переноски и слинги' },
              { id: 'kids-newborn-g1-l7', name: 'Прочее' },
            ],
          },
        ],
      },
      {
        id: 'kids-toys',
        name: 'Игрушки (детские)',
        children: [
          {
            id: 'kids-toys-g0',
            name: 'Игрушки',
            children: [
              { id: 'kids-toys-g0-l0', name: 'Мягкие игрушки' },
              { id: 'kids-toys-g0-l1', name: 'Развивающие' },
              { id: 'kids-toys-g0-l2', name: 'Конструкторы' },
              { id: 'kids-toys-g0-l3', name: 'Куклы' },
              { id: 'kids-toys-g0-l4', name: 'Машинки' },
              { id: 'kids-toys-g0-l5', name: 'Настольные игры' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'unisex',
    name: 'Унисекс',
    categories: [
      {
        id: 'unisex-apparel',
        name: 'Одежда',
        children: [
          {
            id: 'unisex-apparel-g0',
            name: 'Верхняя одежда',
            children: [
              { id: 'unisex-apparel-g0-l0', name: 'Пальто' },
              { id: 'unisex-apparel-g0-l1', name: 'Тренчи' },
              { id: 'unisex-apparel-g0-l2', name: 'Парки' },
              { id: 'unisex-apparel-g0-l3', name: 'Пуховики' },
              { id: 'unisex-apparel-g0-l4', name: 'Куртки' },
              { id: 'unisex-apparel-g0-l5', name: 'Бомберы' },
              { id: 'unisex-apparel-g0-l6', name: 'Ветровки' },
              { id: 'unisex-apparel-g0-l7', name: 'Жилеты' },
              { id: 'unisex-apparel-g0-l8', name: 'Плащи' },
              { id: 'unisex-apparel-g0-l9', name: 'Дождевики' },
              { id: 'unisex-apparel-g0-l10', name: 'Пончо' },
              { id: 'unisex-apparel-g0-l11', name: 'Шубы' },
              { id: 'unisex-apparel-g0-l12', name: 'Лайнеры' },
              { id: 'unisex-apparel-g0-l13', name: 'Подстёжки' },
              { id: 'unisex-apparel-g0-l14', name: 'Комбинезоны' },
              { id: 'unisex-apparel-g0-l15', name: 'Анораки' },
              { id: 'unisex-apparel-g0-l16', name: 'Косухи' },
              { id: 'unisex-apparel-g0-l17', name: 'Дубленки' },
            ],
          },
          {
            id: 'unisex-apparel-g1',
            name: 'Костюмы и жакеты',
            children: [
              { id: 'unisex-apparel-g1-l0', name: 'Костюмы' },
              { id: 'unisex-apparel-g1-l1', name: 'Блейзеры' },
              { id: 'unisex-apparel-g1-l2', name: 'Смокинги' },
              { id: 'unisex-apparel-g1-l3', name: 'Фраки' },
              { id: 'unisex-apparel-g1-l4', name: 'Пиджаки' },
              { id: 'unisex-apparel-g1-l5', name: 'Жилеты' },
            ],
          },
          {
            id: 'unisex-apparel-g2',
            name: 'Платья и сарафаны',
            children: [
              { id: 'unisex-apparel-g2-l0', name: 'Платья' },
              { id: 'unisex-apparel-g2-l1', name: 'Сарафаны' },
              { id: 'unisex-apparel-g2-l2', name: 'Туники' },
            ],
          },
          {
            id: 'unisex-apparel-g3',
            name: 'Юбки',
            children: [
              { id: 'unisex-apparel-g3-l0', name: 'Мини' },
              { id: 'unisex-apparel-g3-l1', name: 'Миди' },
              { id: 'unisex-apparel-g3-l2', name: 'Макси' },
            ],
          },
          {
            id: 'unisex-apparel-g4',
            name: 'Рубашки и блузы',
            children: [
              { id: 'unisex-apparel-g4-l0', name: 'Рубашки' },
              { id: 'unisex-apparel-g4-l1', name: 'Блузы' },
              { id: 'unisex-apparel-g4-l2', name: 'Сорочки' },
            ],
          },
          {
            id: 'unisex-apparel-g5',
            name: 'Топы и футболки',
            children: [
              { id: 'unisex-apparel-g5-l0', name: 'Топы' },
              { id: 'unisex-apparel-g5-l1', name: 'Футболки' },
              { id: 'unisex-apparel-g5-l2', name: 'Поло' },
              { id: 'unisex-apparel-g5-l3', name: 'Майки' },
              { id: 'unisex-apparel-g5-l4', name: 'Кроп-топы' },
              { id: 'unisex-apparel-g5-l5', name: 'Лонгсливы' },
            ],
          },
          {
            id: 'unisex-apparel-g6',
            name: 'Джинсы',
            children: [
              { id: 'unisex-apparel-g6-l0', name: 'Прямые' },
              { id: 'unisex-apparel-g6-l1', name: 'Зауженные' },
              { id: 'unisex-apparel-g6-l2', name: 'Широкие' },
              { id: 'unisex-apparel-g6-l3', name: 'Клеш' },
              { id: 'unisex-apparel-g6-l4', name: 'Бойфренды' },
              { id: 'unisex-apparel-g6-l5', name: 'Мом' },
              { id: 'unisex-apparel-g6-l6', name: 'Скинни' },
            ],
          },
          {
            id: 'unisex-apparel-g7',
            name: 'Брюки',
            children: [
              { id: 'unisex-apparel-g7-l0', name: 'Классические' },
              { id: 'unisex-apparel-g7-l1', name: 'Чиносы' },
              { id: 'unisex-apparel-g7-l2', name: 'Спортивные' },
              { id: 'unisex-apparel-g7-l3', name: 'Джоггеры' },
              { id: 'unisex-apparel-g7-l4', name: 'Карго' },
              { id: 'unisex-apparel-g7-l5', name: 'Леггинсы' },
              { id: 'unisex-apparel-g7-l6', name: 'Шорты' },
              { id: 'unisex-apparel-g7-l7', name: 'Бермуды' },
            ],
          },
          {
            id: 'unisex-apparel-g8',
            name: 'Трикотаж',
            children: [
              { id: 'unisex-apparel-g8-l0', name: 'Свитеры' },
              { id: 'unisex-apparel-g8-l1', name: 'Худи' },
              { id: 'unisex-apparel-g8-l2', name: 'Кардиганы' },
              { id: 'unisex-apparel-g8-l3', name: 'Водолазки' },
              { id: 'unisex-apparel-g8-l4', name: 'Джемперы' },
              { id: 'unisex-apparel-g8-l5', name: 'Пуловеры' },
              { id: 'unisex-apparel-g8-l6', name: 'Свитшоты' },
            ],
          },
          {
            id: 'unisex-apparel-g9',
            name: 'Нижнее бельё',
            children: [
              { id: 'unisex-apparel-g9-l0', name: 'Трусы' },
              { id: 'unisex-apparel-g9-l1', name: 'Бюстгальтеры' },
              { id: 'unisex-apparel-g9-l2', name: 'Бюстье' },
              { id: 'unisex-apparel-g9-l3', name: 'Боди' },
              { id: 'unisex-apparel-g9-l4', name: 'Термобелье' },
              { id: 'unisex-apparel-g9-l5', name: 'Комбинации' },
              { id: 'unisex-apparel-g9-l6', name: 'Корсеты' },
            ],
          },
          {
            id: 'unisex-apparel-g10',
            name: 'Спортивная одежда',
            children: [
              { id: 'unisex-apparel-g10-l0', name: 'Спортивные костюмы' },
              { id: 'unisex-apparel-g10-l1', name: 'Тайтсы' },
              { id: 'unisex-apparel-g10-l2', name: 'Рашгарды' },
              { id: 'unisex-apparel-g10-l3', name: 'Спортивные топы' },
              { id: 'unisex-apparel-g10-l4', name: 'Шорты для плавания' },
            ],
          },
          {
            id: 'unisex-apparel-g11',
            name: 'Пляжная мода',
            children: [
              { id: 'unisex-apparel-g11-l0', name: 'Слитные купальники' },
              { id: 'unisex-apparel-g11-l1', name: 'Раздельные купальники' },
              { id: 'unisex-apparel-g11-l2', name: 'Плавки' },
              { id: 'unisex-apparel-g11-l3', name: 'Парео' },
              { id: 'unisex-apparel-g11-l4', name: 'Пляжные туники' },
            ],
          },
          {
            id: 'unisex-apparel-g12',
            name: 'Пижамы и домашняя одежда',
            children: [
              { id: 'unisex-apparel-g12-l0', name: 'Халаты' },
              { id: 'unisex-apparel-g12-l1', name: 'Комплекты' },
              { id: 'unisex-apparel-g12-l2', name: 'Ночные сорочки' },
              { id: 'unisex-apparel-g12-l3', name: 'Пижамы' },
            ],
          },
        ],
      },
      {
        id: 'unisex-shoes',
        name: 'Обувь',
        children: [
          {
            id: 'unisex-shoes-g0',
            name: 'Кроссовки',
            children: [
              { id: 'unisex-shoes-g0-l0', name: 'Спортивные' },
              { id: 'unisex-shoes-g0-l1', name: 'Повседневные' },
              { id: 'unisex-shoes-g0-l2', name: 'Хайтопы' },
              { id: 'unisex-shoes-g0-l3', name: 'Сникерсы' },
            ],
          },
          {
            id: 'unisex-shoes-g1',
            name: 'Туфли',
            children: [
              { id: 'unisex-shoes-g1-l0', name: 'Классические / лодочки' },
              { id: 'unisex-shoes-g1-l1', name: 'Балетки' },
              { id: 'unisex-shoes-g1-l2', name: 'Лоферы' },
              { id: 'unisex-shoes-g1-l3', name: 'Оксфорды' },
              { id: 'unisex-shoes-g1-l4', name: 'Дерби' },
              { id: 'unisex-shoes-g1-l5', name: 'Броги' },
            ],
          },
          {
            id: 'unisex-shoes-g2',
            name: 'Ботинки',
            children: [
              { id: 'unisex-shoes-g2-l0', name: 'Демисезонные' },
              { id: 'unisex-shoes-g2-l1', name: 'Зимние' },
              { id: 'unisex-shoes-g2-l2', name: 'Челси' },
              { id: 'unisex-shoes-g2-l3', name: 'Дезерты' },
              { id: 'unisex-shoes-g2-l4', name: 'Берцы' },
              { id: 'unisex-shoes-g2-l5', name: 'Тимберленды' },
              { id: 'unisex-shoes-g2-l6', name: 'Треккинговые' },
            ],
          },
          {
            id: 'unisex-shoes-g3',
            name: 'Сандалии и шлёпанцы',
            children: [
              { id: 'unisex-shoes-g3-l0', name: 'Сандалии' },
              { id: 'unisex-shoes-g3-l1', name: 'Шлепанцы' },
              { id: 'unisex-shoes-g3-l2', name: 'Босоножки' },
              { id: 'unisex-shoes-g3-l3', name: 'Вьетнамки' },
              { id: 'unisex-shoes-g3-l4', name: 'Сабо' },
              { id: 'unisex-shoes-g3-l5', name: 'Мюли' },
            ],
          },
          {
            id: 'unisex-shoes-g4',
            name: 'Сапоги',
            children: [
              { id: 'unisex-shoes-g4-l0', name: 'Зимние' },
              { id: 'unisex-shoes-g4-l1', name: 'Демисезонные' },
              { id: 'unisex-shoes-g4-l2', name: 'Ботфорты' },
              { id: 'unisex-shoes-g4-l3', name: 'Полусапоги' },
              { id: 'unisex-shoes-g4-l4', name: 'Резиновые' },
              { id: 'unisex-shoes-g4-l5', name: 'Казаки' },
            ],
          },
          {
            id: 'unisex-shoes-g5',
            name: 'Мокасины и топсайдеры',
            children: [
              { id: 'unisex-shoes-g5-l0', name: 'Мокасины' },
              { id: 'unisex-shoes-g5-l1', name: 'Топсайдеры' },
              { id: 'unisex-shoes-g5-l2', name: 'Слипоны' },
              { id: 'unisex-shoes-g5-l3', name: 'Эспадрильи' },
            ],
          },
          {
            id: 'unisex-shoes-g6',
            name: 'Угги и унты',
            children: [
              { id: 'unisex-shoes-g6-l0', name: 'Валенки' },
              { id: 'unisex-shoes-g6-l1', name: 'Угги' },
              { id: 'unisex-shoes-g6-l2', name: 'Унты' },
              { id: 'unisex-shoes-g6-l3', name: 'Дутики' },
            ],
          },
          {
            id: 'unisex-shoes-g7',
            name: 'Домашняя обувь',
            children: [
              { id: 'unisex-shoes-g7-l0', name: 'Тапочки' },
              { id: 'unisex-shoes-g7-l1', name: 'Чуни' },
            ],
          },
        ],
      },
      {
        id: 'unisex-bags',
        name: 'Сумки',
        children: [
          {
            id: 'unisex-bags-g0',
            name: 'Повседневные',
            children: [
              { id: 'unisex-bags-g0-l0', name: 'Тот' },
              { id: 'unisex-bags-g0-l1', name: 'Шоппер' },
              { id: 'unisex-bags-g0-l2', name: 'Кросс-боди' },
              { id: 'unisex-bags-g0-l3', name: 'Рюкзак' },
              { id: 'unisex-bags-g0-l4', name: 'Клатч' },
              { id: 'unisex-bags-g0-l5', name: 'Поясная' },
              { id: 'unisex-bags-g0-l6', name: 'Сумка-мешок' },
              { id: 'unisex-bags-g0-l7', name: 'Сумка-багет' },
            ],
          },
          {
            id: 'unisex-bags-g1',
            name: 'Вечерние',
            children: [
              { id: 'unisex-bags-g1-l0', name: 'Клатчи' },
              { id: 'unisex-bags-g1-l1', name: 'Минодьеры' },
              { id: 'unisex-bags-g1-l2', name: 'Сумки-конверты' },
            ],
          },
          {
            id: 'unisex-bags-g2',
            name: 'Чемоданы',
            children: [
              { id: 'unisex-bags-g2-l0', name: 'На колесах' },
              { id: 'unisex-bags-g2-l1', name: 'Сумки-тележки' },
              { id: 'unisex-bags-g2-l2', name: 'Кейсы' },
            ],
          },
          {
            id: 'unisex-bags-g3',
            name: 'Рабочие',
            children: [
              { id: 'unisex-bags-g3-l0', name: 'Для ноутбука' },
              { id: 'unisex-bags-g3-l1', name: 'Портфель' },
              { id: 'unisex-bags-g3-l2', name: 'Папки' },
              { id: 'unisex-bags-g3-l3', name: 'Сумка-портфель' },
            ],
          },
          {
            id: 'unisex-bags-g4',
            name: 'Спортивные и дорожные',
            children: [
              { id: 'unisex-bags-g4-l0', name: 'Спортивные сумки' },
              { id: 'unisex-bags-g4-l1', name: 'Дорожные сумки' },
              { id: 'unisex-bags-g4-l2', name: 'Рюкзаки туристические' },
              { id: 'unisex-bags-g4-l3', name: 'Дафл' },
            ],
          },
          {
            id: 'unisex-bags-g5',
            name: 'Косметички',
            children: [
              { id: 'unisex-bags-g5-l0', name: 'Несессеры' },
              { id: 'unisex-bags-g5-l1', name: 'Бьюти-кейсы' },
              { id: 'unisex-bags-g5-l2', name: 'Косметички' },
            ],
          },
        ],
      },
      {
        id: 'unisex-accessories',
        name: 'Аксессуары',
        children: [
          {
            id: 'unisex-accessories-g0',
            name: 'Очки',
            children: [
              { id: 'unisex-accessories-g0-l0', name: 'Солнцезащитные' },
              { id: 'unisex-accessories-g0-l1', name: 'Оправы' },
              { id: 'unisex-accessories-g0-l2', name: 'Футляры для очков' },
            ],
          },
          {
            id: 'unisex-accessories-g1',
            name: 'Ремни и подтяжки',
            children: [
              { id: 'unisex-accessories-g1-l0', name: 'Ремни' },
              { id: 'unisex-accessories-g1-l1', name: 'Подтяжки' },
              { id: 'unisex-accessories-g1-l2', name: 'Пояса' },
            ],
          },
          {
            id: 'unisex-accessories-g2',
            name: 'Перчатки и варежки',
            children: [
              { id: 'unisex-accessories-g2-l0', name: 'Перчатки' },
              { id: 'unisex-accessories-g2-l1', name: 'Варежки' },
              { id: 'unisex-accessories-g2-l2', name: 'Митенки' },
            ],
          },
          {
            id: 'unisex-accessories-g3',
            name: 'Шарфы',
            children: [
              { id: 'unisex-accessories-g3-l0', name: 'Шарфы' },
              { id: 'unisex-accessories-g3-l1', name: 'Снуды' },
              { id: 'unisex-accessories-g3-l2', name: 'Палантины' },
              { id: 'unisex-accessories-g3-l3', name: 'Горжетки' },
            ],
          },
          {
            id: 'unisex-accessories-g4',
            name: 'Галстуки и бабочки',
            children: [
              { id: 'unisex-accessories-g4-l0', name: 'Галстуки' },
              { id: 'unisex-accessories-g4-l1', name: 'Бабочки' },
              { id: 'unisex-accessories-g4-l2', name: 'Зажимы для галстука' },
            ],
          },
          {
            id: 'unisex-accessories-g5',
            name: 'Платки',
            children: [
              { id: 'unisex-accessories-g5-l0', name: 'Шейные платки' },
              { id: 'unisex-accessories-g5-l1', name: 'Банданы' },
              { id: 'unisex-accessories-g5-l2', name: 'Косынки' },
            ],
          },
          {
            id: 'unisex-accessories-g6',
            name: 'Украшения',
            children: [
              { id: 'unisex-accessories-g6-l0', name: 'Кольца' },
              { id: 'unisex-accessories-g6-l1', name: 'Серьги' },
              { id: 'unisex-accessories-g6-l2', name: 'Браслеты' },
              { id: 'unisex-accessories-g6-l3', name: 'Колье' },
              { id: 'unisex-accessories-g6-l4', name: 'Подвески' },
              { id: 'unisex-accessories-g6-l5', name: 'Броши' },
              { id: 'unisex-accessories-g6-l6', name: 'Цепочки' },
            ],
          },
          {
            id: 'unisex-accessories-g7',
            name: 'Кожгалантерея мелкая',
            children: [
              { id: 'unisex-accessories-g7-l0', name: 'Кошельки' },
              { id: 'unisex-accessories-g7-l1', name: 'Портмоне' },
              { id: 'unisex-accessories-g7-l2', name: 'Визитницы' },
              { id: 'unisex-accessories-g7-l3', name: 'Ключницы' },
              { id: 'unisex-accessories-g7-l4', name: 'Обложки для документов' },
            ],
          },
          {
            id: 'unisex-accessories-g8',
            name: 'Зонты',
            children: [
              { id: 'unisex-accessories-g8-l0', name: 'Трости' },
              { id: 'unisex-accessories-g8-l1', name: 'Складные' },
            ],
          },
          {
            id: 'unisex-accessories-g9',
            name: 'Тех-аксессуары',
            children: [
              { id: 'unisex-accessories-g9-l0', name: 'Чехлы для телефонов' },
              { id: 'unisex-accessories-g9-l1', name: 'Чехлы для наушников' },
              { id: 'unisex-accessories-g9-l2', name: 'Ремешки для часов' },
            ],
          },
          {
            id: 'unisex-accessories-g10',
            name: 'Маски и бафы',
            children: [
              { id: 'unisex-accessories-g10-l0', name: 'Маски' },
              { id: 'unisex-accessories-g10-l1', name: 'Балаклавы' },
              { id: 'unisex-accessories-g10-l2', name: 'Бафы' },
            ],
          },
        ],
      },
      {
        id: 'unisex-headwear',
        name: 'Головные уборы',
        children: [
          {
            id: 'unisex-headwear-g0',
            name: 'Кепки',
            children: [
              { id: 'unisex-headwear-g0-l0', name: 'Бейсболки' },
              { id: 'unisex-headwear-g0-l1', name: 'Снепбеки' },
              { id: 'unisex-headwear-g0-l2', name: 'Тракеры' },
              { id: 'unisex-headwear-g0-l3', name: 'Кепки-уточки' },
            ],
          },
          {
            id: 'unisex-headwear-g1',
            name: 'Панамы',
            children: [
              { id: 'unisex-headwear-g1-l0', name: 'Панамы' },
              { id: 'unisex-headwear-g1-l1', name: 'Шляпы-ведро' },
            ],
          },
          {
            id: 'unisex-headwear-g2',
            name: 'Шляпы',
            children: [
              { id: 'unisex-headwear-g2-l0', name: 'Федоры' },
              { id: 'unisex-headwear-g2-l1', name: 'Трилби' },
              { id: 'unisex-headwear-g2-l2', name: 'Канотье' },
              { id: 'unisex-headwear-g2-l3', name: 'Широкополые' },
              { id: 'unisex-headwear-g2-l4', name: 'Цилиндры' },
              { id: 'unisex-headwear-g2-l5', name: 'Котелки' },
            ],
          },
          {
            id: 'unisex-headwear-g3',
            name: 'Береты',
            children: [
              { id: 'unisex-headwear-g3-l0', name: 'Классические' },
              { id: 'unisex-headwear-g3-l1', name: 'Объемные' },
            ],
          },
          {
            id: 'unisex-headwear-g4',
            name: 'Шапки',
            children: [
              { id: 'unisex-headwear-g4-l0', name: 'Бини' },
              { id: 'unisex-headwear-g4-l1', name: 'Ушанки' },
              { id: 'unisex-headwear-g4-l2', name: 'С помпоном' },
              { id: 'unisex-headwear-g4-l3', name: 'Капоры' },
            ],
          },
        ],
      },
      {
        id: 'unisex-hosiery',
        name: 'Носочно-чулочные',
        children: [
          {
            id: 'unisex-hosiery-g0',
            name: 'Носки',
            children: [
              { id: 'unisex-hosiery-g0-l0', name: 'Короткие' },
              { id: 'unisex-hosiery-g0-l1', name: 'Классические' },
              { id: 'unisex-hosiery-g0-l2', name: 'Спортивные' },
              { id: 'unisex-hosiery-g0-l3', name: 'Следки' },
            ],
          },
          {
            id: 'unisex-hosiery-g1',
            name: 'Колготки',
            children: [
              { id: 'unisex-hosiery-g1-l0', name: 'Капроновые' },
              { id: 'unisex-hosiery-g1-l1', name: 'Хлопковые' },
              { id: 'unisex-hosiery-g1-l2', name: 'Шерстяные' },
              { id: 'unisex-hosiery-g1-l3', name: 'Фантазийные' },
            ],
          },
          {
            id: 'unisex-hosiery-g2',
            name: 'Чулки',
            children: [
              { id: 'unisex-hosiery-g2-l0', name: 'С кружевом' },
              { id: 'unisex-hosiery-g2-l1', name: 'Под пояс' },
              { id: 'unisex-hosiery-g2-l2', name: 'Компрессионные' },
            ],
          },
          {
            id: 'unisex-hosiery-g3',
            name: 'Гольфы',
            children: [
              { id: 'unisex-hosiery-g3-l0', name: 'Капроновые' },
              { id: 'unisex-hosiery-g3-l1', name: 'Хлопковые' },
            ],
          },
          {
            id: 'unisex-hosiery-g4',
            name: 'Гетры',
            children: [
              { id: 'unisex-hosiery-g4-l0', name: 'Спортивные' },
              { id: 'unisex-hosiery-g4-l1', name: 'Вязаные' },
            ],
          },
        ],
      },
      {
        id: 'unisex-beauty',
        name: 'Красота и уход',
        children: [
          {
            id: 'unisex-beauty-g0',
            name: 'Парфюмерия',
            children: [
              { id: 'unisex-beauty-g0-l0', name: 'Духи' },
              { id: 'unisex-beauty-g0-l1', name: 'Парфюмерная вода' },
              { id: 'unisex-beauty-g0-l2', name: 'Туалетная вода' },
              { id: 'unisex-beauty-g0-l3', name: 'Одеколоны' },
              { id: 'unisex-beauty-g0-l4', name: 'Спреи для тела' },
            ],
          },
          {
            id: 'unisex-beauty-g1',
            name: 'Косметика',
            children: [
              { id: 'unisex-beauty-g1-l0', name: 'Для лица' },
              { id: 'unisex-beauty-g1-l1', name: 'Для глаз' },
              { id: 'unisex-beauty-g1-l2', name: 'Для губ' },
              { id: 'unisex-beauty-g1-l3', name: 'Для бровей' },
              { id: 'unisex-beauty-g1-l4', name: 'Палетки' },
              { id: 'unisex-beauty-g1-l5', name: 'Кисти и спонжи' },
            ],
          },
          {
            id: 'unisex-beauty-g2',
            name: 'Уход',
            children: [
              { id: 'unisex-beauty-g2-l0', name: 'Для лица' },
              { id: 'unisex-beauty-g2-l1', name: 'Для тела' },
              { id: 'unisex-beauty-g2-l2', name: 'Для волос' },
              { id: 'unisex-beauty-g2-l3', name: 'Для рук' },
              { id: 'unisex-beauty-g2-l4', name: 'Для ног' },
              { id: 'unisex-beauty-g2-l5', name: 'Солнцезащитные средства' },
            ],
          },
        ],
      },
      {
        id: 'unisex-home',
        name: 'Дом и стиль жизни',
        children: [
          {
            id: 'unisex-home-g0',
            name: 'Текстиль',
            children: [
              { id: 'unisex-home-g0-l0', name: 'Пледы' },
              { id: 'unisex-home-g0-l1', name: 'Скатерти' },
              { id: 'unisex-home-g0-l2', name: 'Постельное' },
              { id: 'unisex-home-g0-l3', name: 'Полотенца' },
              { id: 'unisex-home-g0-l4', name: 'Коврики для ванной' },
              { id: 'unisex-home-g0-l5', name: 'Шторы' },
              { id: 'unisex-home-g0-l6', name: 'Салфетки' },
            ],
          },
          {
            id: 'unisex-home-g1',
            name: 'Декор',
            children: [
              { id: 'unisex-home-g1-l0', name: 'Вазы' },
              { id: 'unisex-home-g1-l1', name: 'Свечи' },
              { id: 'unisex-home-g1-l2', name: 'Подсвечники' },
              { id: 'unisex-home-g1-l3', name: 'Картины' },
              { id: 'unisex-home-g1-l4', name: 'Постеры' },
              { id: 'unisex-home-g1-l5', name: 'Зеркала' },
              { id: 'unisex-home-g1-l6', name: 'Статуэтки' },
            ],
          },
          {
            id: 'unisex-home-g2',
            name: 'Аксессуары',
            children: [
              { id: 'unisex-home-g2-l0', name: 'Ароматы для дома' },
              { id: 'unisex-home-g2-l1', name: 'Диффузоры' },
              { id: 'unisex-home-g2-l2', name: 'Саше' },
              { id: 'unisex-home-g2-l3', name: 'Органайзеры' },
            ],
          },
          {
            id: 'unisex-home-g3',
            name: 'Питомцы',
            children: [
              { id: 'unisex-home-g3-l0', name: 'Одежда' },
              { id: 'unisex-home-g3-l1', name: 'Лежанки' },
              { id: 'unisex-home-g3-l2', name: 'Переноски' },
              { id: 'unisex-home-g3-l3', name: 'Поводки' },
              { id: 'unisex-home-g3-l4', name: 'Ошейники' },
              { id: 'unisex-home-g3-l5', name: 'Игрушки' },
              { id: 'unisex-home-g3-l6', name: 'Миски' },
            ],
          },
          {
            id: 'unisex-home-g4',
            name: 'Lifestyle-гаджеты',
            children: [
              { id: 'unisex-home-g4-l0', name: 'Будильники' },
              { id: 'unisex-home-g4-l1', name: 'Лампы' },
              { id: 'unisex-home-g4-l2', name: 'Увлажнители' },
              { id: 'unisex-home-g4-l3', name: 'Массажеры' },
            ],
          },
        ],
      },
      {
        id: 'unisex-toys',
        name: 'Игрушки (детские)',
        children: [
          {
            id: 'unisex-toys-g0',
            name: 'Игрушки',
            children: [
              { id: 'unisex-toys-g0-l0', name: 'Мягкие игрушки' },
              { id: 'unisex-toys-g0-l1', name: 'Развивающие' },
              { id: 'unisex-toys-g0-l2', name: 'Конструкторы' },
              { id: 'unisex-toys-g0-l3', name: 'Куклы' },
              { id: 'unisex-toys-g0-l4', name: 'Машинки' },
              { id: 'unisex-toys-g0-l5', name: 'Настольные игры' },
            ],
          },
        ],
      },
    ],
  },
];
