/**
 * Таблицы габаритов для «Дом и стиль жизни» и «Красота и уход» (страница project-info/sizes).
 * Значения ориентировочные для ТЗ; финальные мерки — по лекалам и ГОСТ/рынку.
 */

/** Текстиль дома (взрослая / общая линия), см */
export const sizeChartDataHomeTextileAdult = [
  {
    productType: 'Плед',
    length: '150–220',
    width: '130–200',
    depth: '—',
    comment: 'Ворс/плотность в ТЗ (г/м²)',
  },
  {
    productType: 'Скатерть прямоугольная',
    length: '140–180',
    width: '110–140',
    depth: '—',
    comment: 'Свес с краёв стола, см',
  },
  {
    productType: 'Постельное (пододеяльник 1,5 сп)',
    length: '215',
    width: '160',
    depth: '—',
    comment: 'Совместить с простынёй/наволочками в комплекте',
  },
  {
    productType: 'Постельное (евро)',
    length: '220',
    width: '200',
    depth: '—',
    comment: '—',
  },
  {
    productType: 'Полотенце банное',
    length: '140–160',
    width: '70–80',
    depth: '—',
    comment: 'Плотность 400–600 г/м² типично',
  },
  {
    productType: 'Коврик для ванной',
    length: '80–100',
    width: '50–60',
    depth: '1–2',
    comment: 'Противоскользящая основа, вес',
  },
  {
    productType: 'Штора (панель)',
    length: '250–280',
    width: '140–200',
    depth: '—',
    comment: 'Сборка/люверсы/шторная лента в ТЗ',
  },
];

/** Текстиль и предметы «дом» для детской линии (мальчики/девочки), см */
export const sizeChartDataHomeTextileKids = [
  {
    productType: 'Плед детский',
    length: '100–150',
    width: '80–120',
    depth: '—',
    comment: 'ТР ТС 007 при контакте с детьми',
  },
  {
    productType: 'Постель (детская кровать 60×120)',
    length: '120',
    width: '60',
    depth: '—',
    comment: 'Простынь на резинке — обхват матраса в ТЗ',
  },
  {
    productType: 'Постель (детская 70×140)',
    length: '140',
    width: '70',
    depth: '—',
    comment: '—',
  },
  {
    productType: 'Полотенце детское',
    length: '100–120',
    width: '50–60',
    depth: '—',
    comment: 'Гипоаллергенные красители в ТЗ',
  },
  {
    productType: 'Коврик/игровой ковёр',
    length: '120–180',
    width: '90–120',
    depth: '0,5–1,5',
    comment: 'Без мелких отрывающихся частей для 0–3',
  },
  {
    productType: 'Штора детская',
    length: '200–250',
    width: '140–180',
    depth: '—',
    comment: 'Крепление без острых крючков — для малышей',
  },
];

/** Новорождённые / младенцы: текстиль и поверхности, см */
export const sizeChartDataHomeTextileNewborn = [
  {
    productType: 'Пелёнка/муслин',
    length: '80–120',
    width: '80–120',
    depth: '—',
    comment: 'Слои, края, швы — мягкие',
  },
  {
    productType: 'Наматрасник/простыня 60×120',
    length: '120',
    width: '60',
    depth: '—',
    comment: 'Глубина бортика матраса',
  },
  {
    productType: 'Кокон/гнёздышко',
    length: '55–75',
    width: '35–45',
    depth: '8–15',
    comment: 'Жёсткость бортов, вентиляция',
  },
  {
    productType: 'Пеленальный матрасик',
    length: '70–85',
    width: '45–55',
    depth: '3–8',
    comment: 'Съёмный чехол, моющийся',
  },
];

export const sizeChartDataHomeDecor = [
  {
    productType: 'Декор (ваза/кэндл)',
    length: '—',
    width: '—',
    depth: '—',
    comment: 'L×W×H упаковки и вес; хрупкое — маркировка',
  },
  {
    productType: 'Подушка декоративная',
    length: '40–60',
    width: '40–60',
    depth: '8–20',
    comment: 'Наполнитель, чехол на молнии',
  },
  {
    productType: 'Корзина/ящик хранения',
    length: '30–50',
    width: '25–40',
    depth: '25–35',
    comment: 'Грузоподъёмность декларировать в ТЗ',
  },
];

export const sizeChartDataHomePets = [
  {
    productType: 'Одежда питомца (спина)',
    length: '20–45',
    width: '—',
    depth: '—',
    comment: 'Обхват шеи/груди — отдельные мерки в ТЗ',
  },
  {
    productType: 'Лежанка S/M/L',
    length: '45 / 60 / 80',
    width: '35 / 45 / 60',
    depth: '10–15',
    comment: 'Бортик, съёмный чехол',
  },
  {
    productType: 'Переноска жёсткая',
    length: '48–58',
    width: '30–35',
    depth: '28–32',
    comment: 'Вентиляция, замок; вес питомца max',
  },
  {
    productType: 'Поводок (длина)',
    length: '120–200',
    width: '1,5–2,5',
    depth: '—',
    comment: 'Карабин, рукоятка',
  },
];

export const sizeChartDataHomeGadgets = [
  {
    productType: 'Lifestyle-гаджет (типовой)',
    length: '—',
    width: '—',
    depth: '—',
    comment: 'Габариты устройства + упаковки, Вт, В, сертификат связи/низковольт',
  },
];

/** Парфюмерия: объём и типовые габариты упаковки */
export const sizeChartDataBeautyPerfume = [
  {
    productType: 'Парфюм / туалетная вода',
    capacity: '30–100 мл',
    length: '—',
    width: '—',
    depth: '—',
    comment: 'Спирт — классификация и хранение; акциз при необходимости',
  },
  {
    productType: 'Флакон ролл-он',
    capacity: '8–15 мл',
    length: '—',
    width: '—',
    depth: '—',
    comment: 'Шарик/насадка — материал',
  },
];

export const sizeChartDataBeautyCosmetics = [
  {
    productType: 'Крем / банка',
    capacity: '30–250 мл',
    length: '—',
    width: '—',
    depth: '—',
    comment: 'Дозатор, срок годности, PAO',
  },
  {
    productType: 'Сыворотка / пипетка',
    capacity: '15–50 мл',
    length: '—',
    width: '—',
    depth: '—',
    comment: 'Светозащита флакона',
  },
  {
    productType: 'Помада / тюбик',
    capacity: '3–5 г / 8–15 мл',
    length: '—',
    width: '—',
    depth: '—',
    comment: 'Механизм выдвижения',
  },
];

export const sizeChartDataBeautyCare = [
  {
    productType: 'Шампунь / гель',
    capacity: '200–400 мл',
    length: '—',
    width: '—',
    depth: '—',
    comment: 'pH, дерматология для детской линии',
  },
  {
    productType: 'Мыло / брусок',
    capacity: '80–150 г',
    length: '—',
    width: '—',
    depth: '—',
    comment: 'Состав INCI полностью в ТЗ',
  },
];

/** Детская косметика и уход (не младенцы) */
export const sizeChartDataBeautyKids = [
  {
    productType: 'Детский шампунь / пена',
    capacity: '150–300 мл',
    length: '—',
    width: '—',
    depth: '—',
    comment: '«Без слёз», возраст 3+ на этикетке при необходимости',
  },
  {
    productType: 'Детский крем / лосьон',
    capacity: '75–200 мл',
    length: '—',
    width: '—',
    depth: '—',
    comment: 'Патч-тест, дерматолог в ТЗ',
  },
];

/** 0+ гигиена и уход (новорождённые) */
export const sizeChartDataBeautyNewborn = [
  {
    productType: 'Средство для купания 0+',
    capacity: '200–500 мл',
    length: '—',
    width: '—',
    depth: '—',
    comment: 'Маркировка 0+; запрет агрессивных консервантов — по регламенту',
  },
  {
    productType: 'Масло / крем под подгузник',
    capacity: '50–150 мл',
    length: '—',
    width: '—',
    depth: '—',
    comment: 'Гипоаллергенность, список без запрещённых для младенцев веществ',
  },
];
