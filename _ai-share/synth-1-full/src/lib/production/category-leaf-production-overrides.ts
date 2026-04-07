import type { LeafProductionProfile } from './category-leaf-production-types';

/**
 * Переопределения профиля производства по `leafId`.
 * У записей маркетплейсов ниже выставлено `subjectIdVerified: true` — считаем subject/ветку сверенной с ЛК для шаблона проекта.
 * При смене кабинета или изменении дерева категорий WB/Ozon/Я.Маркет — обновите `subjectId` / `categoryPathHint` и сбросьте флаг в `false`, пока не сверите снова.
 */
export const LEAF_PRODUCTION_PROFILE_OVERRIDES: Partial<
  Record<string, Partial<LeafProductionProfile>>
> = {
  'catalog-apparel-g0-l0': {
    productionRouteTemplateId: 'route-apparel-outerwear',
    productionRouteTemplateLabel: 'Лекала → раскрой → швейка → втачка рукавов → глажка → ОТК',
    externalClassifiers: {
      tnvedEaEuChapterHint: '61',
      tnvedEaEuCodeHints: ['6101', '6102', '610230'],
      okpd2Hints: ['14.19.21', '14.19.22'],
      vedCodeHints: ['6101'],
    },
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '1512',
        categoryPathHint: 'Женщинам / Одежда / Верхняя / Пальто',
      },
      {
        channelId: 'ozon',
        subjectIdVerified: true,
        categoryPathHint: 'Одежда / Женщинам / Верхняя одежда / Пальто',
      },
      { channelId: 'yandex_market', subjectIdVerified: true, categoryPathHint: 'Одежда / Пальто' },
    ],
    labelLocalesDefault: ['ru', 'en'],
  },
  'catalog-apparel-g8-l0': {
    productionRouteTemplateId: 'route-apparel-knitwear',
    productionRouteTemplateLabel: 'Программа вязания → сборка → кольцевание → ОТК',
    externalClassifiers: {
      tnvedEaEuChapterHint: '61',
      tnvedEaEuCodeHints: ['6110'],
      okpd2Hints: ['14.19.31'],
    },
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '741',
        categoryPathHint: 'Одежда / Джемперы и свитеры',
      },
      {
        channelId: 'ozon',
        subjectIdVerified: true,
        categoryPathHint: 'Одежда / Свитеры и джемперы',
      },
    ],
    labelLocalesDefault: ['ru', 'en'],
  },
  'catalog-apparel-g5-l1': {
    productionRouteTemplateId: 'route-apparel-cut-sew-basic',
    productionRouteTemplateLabel: 'Раскрой трикотажного полотна → швейка → шелкография/принт → ОТК',
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '192',
        categoryPathHint: 'Одежда / Футболки',
      },
      { channelId: 'ozon', subjectIdVerified: true, categoryPathHint: 'Одежда / Футболки' },
    ],
  },
  'catalog-apparel-g3-l0': {
    productionRouteTemplateId: 'route-apparel-denim',
    productionRouteTemplateLabel: 'Раскрой денима → швейка → постобработка → ОТК',
    externalClassifiers: { tnvedEaEuCodeHints: ['620342', '620462'] },
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '182',
        categoryPathHint: 'Одежда / Джинсы',
      },
      { channelId: 'ozon', subjectIdVerified: true, categoryPathHint: 'Одежда / Джинсы' },
    ],
  },
  'catalog-shoes-g0-l0': {
    productionRouteTemplateId: 'route-footwear-sports',
    productionRouteTemplateLabel:
      'Раскрой верха → прошив/клеевой узел → подошва → формование → ОТК',
    sizeParameterProfileId: 'women-shoes',
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '151',
        categoryPathHint: 'Обувь / Кроссовки',
      },
      { channelId: 'ozon', subjectIdVerified: true, categoryPathHint: 'Обувь / Кроссовки' },
    ],
    labelLocalesDefault: ['ru', 'en', 'cn'],
  },
  'catalog-shoes-g12-l0': {
    productionRouteTemplateId: 'route-footwear-sports',
    productionRouteTemplateLabel: 'Как кроссовки + усиленный контроль швов и подошвы',
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '151',
        categoryPathHint: 'Обувь / Спортивная обувь',
      },
      { channelId: 'ozon', subjectIdVerified: true, categoryPathHint: 'Обувь / Спортивная' },
    ],
  },
  'catalog-bags-g0-l0': {
    productionRouteTemplateId: 'route-bags-leather-textile',
    productionRouteTemplateLabel: 'Раскрой кожи/ткани → сборка → фурнитура → контроль швов',
    externalClassifiers: { tnvedEaEuChapterHint: '42', tnvedEaEuCodeHints: ['4202'] },
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '602',
        categoryPathHint: 'Сумки / Сумки-шопперы',
      },
      {
        channelId: 'ozon',
        subjectIdVerified: true,
        categoryPathHint: 'Сумки и рюкзаки / Сумки-шопперы',
      },
    ],
  },
  'catalog-bags-g2-l0': {
    productionRouteTemplateId: 'route-luggage-hard-shell',
    productionRouteTemplateLabel: 'Сборка корпуса → колёса/ручки → замки → упаковка',
    externalClassifiers: { tnvedEaEuChapterHint: '42', tnvedEaEuCodeHints: ['4202'] },
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '858',
        categoryPathHint: 'Чемоданы и дорожные сумки',
      },
      { channelId: 'ozon', subjectIdVerified: true, categoryPathHint: 'Чемоданы' },
    ],
  },
  'catalog-bags-g5-l0': {
    productionRouteTemplateId: 'route-bags-small-goods',
    productionRouteTemplateLabel: 'Раскрой → сборка → фурнитура',
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '605',
        categoryPathHint: 'Косметички',
      },
      { channelId: 'ozon', subjectIdVerified: true, categoryPathHint: 'Косметички и органайзеры' },
    ],
  },
  'catalog-accessories-g9-l0': {
    productionRouteTemplateId: 'route-gadgets-oem-qc',
    productionRouteTemplateLabel: 'Приёмка OEM → проверка ТР ТС 004/020 → маркировка → отгрузка',
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '6240',
        categoryPathHint: 'Электроника / Аксессуары для телефонов',
      },
      { channelId: 'ozon', subjectIdVerified: true, categoryPathHint: 'Электроника / Аксессуары' },
    ],
    labelLocalesDefault: ['ru', 'en'],
  },
  'catalog-accessories-g6-l0': {
    productionRouteTemplateId: 'route-jewelry-assembly',
    productionRouteTemplateLabel: 'Сборка / инкрустация → контроль пробы/покрытия → упаковка',
    externalClassifiers: { tnvedEaEuChapterHint: '71', tnvedEaEuCodeHints: ['7117'] },
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '799',
        categoryPathHint: 'Бижутерия',
      },
      { channelId: 'ozon', subjectIdVerified: true, categoryPathHint: 'Украшения / Бижутерия' },
    ],
  },
  'catalog-headwear-g1-l0': {
    productionRouteTemplateId: 'route-headwear-cut-sew',
    productionRouteTemplateLabel: 'Раскрой → швейка → декор → ОТК',
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '489',
        categoryPathHint: 'Головные уборы / Шапки',
      },
      { channelId: 'ozon', subjectIdVerified: true, categoryPathHint: 'Головные уборы' },
    ],
  },
  'catalog-hosiery-g0-l0': {
    productionRouteTemplateId: 'route-hosiery-knit',
    productionRouteTemplateLabel: 'Вязание/кольцевание → формование пары → упаковка',
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '750',
        categoryPathHint: 'Носки',
      },
      { channelId: 'ozon', subjectIdVerified: true, categoryPathHint: 'Носки' },
    ],
  },
  'catalog-beauty-g0-l0': {
    productionRouteTemplateId: 'route-cosmetics-fill-pack-perfume',
    productionRouteTemplateLabel: 'Налив → укупорка → этикетка → укупорочная линия → ОТК',
    externalClassifiers: {
      tnvedEaEuChapterHint: '33',
      tnvedEaEuCodeHints: ['3303', '3304'],
      okpd2Hints: ['20.42'],
    },
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '10596',
        categoryPathHint: 'Красота / Парфюмерия',
      },
      {
        channelId: 'ozon',
        subjectIdVerified: true,
        categoryPathHint: 'Красота и гигиена / Парфюмерия',
      },
    ],
    labelLocalesDefault: ['ru', 'en'],
  },
  'catalog-beauty-g1-l0': {
    productionRouteTemplateId: 'route-cosmetics-fill-pack-decorative',
    productionRouteTemplateLabel: 'Смешивание → налив → укупорка → маркировка ТР ТС 009',
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '49',
        categoryPathHint: 'Косметика декоративная',
      },
      { channelId: 'ozon', subjectIdVerified: true, categoryPathHint: 'Косметика / Декоративная' },
    ],
    labelLocalesDefault: ['ru', 'en'],
  },
  'catalog-beauty-g2-l0': {
    productionRouteTemplateId: 'route-cosmetics-care-bulk',
    productionRouteTemplateLabel: 'Смешивание → фасовка → маркировка',
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '12667',
        categoryPathHint: 'Уход за телом и волосами',
      },
      { channelId: 'ozon', subjectIdVerified: true, categoryPathHint: 'Красота / Уход' },
    ],
  },
  'catalog-home-g0-l2': {
    productionRouteTemplateId: 'route-home-textile-bedding',
    productionRouteTemplateLabel: 'Раскрой → швейка → стирка/глажка → упаковка',
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '1295',
        categoryPathHint: 'Дом / Текстиль / Постельное',
      },
      {
        channelId: 'ozon',
        subjectIdVerified: true,
        categoryPathHint: 'Дом и сад / Постельное бельё',
      },
    ],
  },
  'catalog-home-g4-l0': {
    productionRouteTemplateId: 'route-gadgets-oem-qc',
    productionRouteTemplateLabel: 'OEM-партия → проверка сертификации → маркировка',
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '6256',
        categoryPathHint: 'Электроника / Гаджеты',
      },
      { channelId: 'ozon', subjectIdVerified: true, categoryPathHint: 'Электроника' },
    ],
    labelLocalesDefault: ['ru', 'en'],
  },
  'catalog-newborn-g0-l0': {
    productionRouteTemplateId: 'route-kids-stroller-assembly',
    productionRouteTemplateLabel:
      'Сборка шасси → ткань/капор → испытания по ТР ТС 007 → маркировка',
    externalClassifiers: { tnvedEaEuChapterHint: '87', vedCodeHints: ['8713'] },
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '6721',
        categoryPathHint: 'Детям / Коляски',
      },
      { channelId: 'ozon', subjectIdVerified: true, categoryPathHint: 'Детские товары / Коляски' },
    ],
    labelLocalesDefault: ['ru'],
  },
  'catalog-newborn-g1-l1': {
    productionRouteTemplateId: 'route-kids-feeding-plastics',
    productionRouteTemplateLabel: 'Литьё/выдув → обработка → стерилизационная упаковка → ОТК',
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '4859',
        categoryPathHint: 'Бутылочки для кормления',
      },
      { channelId: 'ozon', subjectIdVerified: true, categoryPathHint: 'Кормление / Бутылочки' },
    ],
  },
  'catalog-toys-g0-l0': {
    productionRouteTemplateId: 'route-toys-assembly-qc',
    productionRouteTemplateLabel:
      'Сборка → крепления/мелкие детали по инструкции → испытания ТР ТС 008',
    marketplaceRefs: [
      {
        channelId: 'wildberries',
        subjectIdVerified: true,
        subjectId: '115',
        categoryPathHint: 'Игрушки',
      },
      { channelId: 'ozon', subjectIdVerified: true, categoryPathHint: 'Игрушки' },
    ],
    labelLocalesDefault: ['ru'],
  },
};
