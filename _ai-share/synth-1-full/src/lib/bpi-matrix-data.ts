export const parameters = [
  {
    id: 'P1',
    name: 'Price Index (средняя розничная цена)',
    group: 'Ценообразование и экономика',
    description:
      'Отражает ценовой сегмент бренда. Рассчитывается как средняя цена ключевых SKU по отношению к рыночным бенчмаркам.',
  },
  {
    id: 'P2',
    name: 'Production Volume (объёмы)',
    group: 'Продукт и производство',
    description:
      'Объём производства одной модели за сезон. Высокие значения характерны для масс-маркета, низкие — для люкса и нишевых брендов.',
  },
  {
    id: 'P3',
    name: 'Assortment Width (ширина ассортимента)',
    group: 'Продукт и производство',
    description:
      'Количество товарных категорий в коллекции. Широкий ассортимент свойственен крупным брендам, узкий — специализированным.',
  },
  {
    id: 'P4',
    name: 'Materials Quality',
    group: 'Продукт и производство',
    description:
      'Уровень качества используемых материалов (натуральные, премиальные, синтетические, технологичные).',
  },
  {
    id: 'P5',
    name: 'Craftsmanship Level',
    group: 'Продукт и производство',
    description:
      'Уровень исполнения изделий: сложность кроя, качество швов, наличие ручной работы.',
  },
  {
    id: 'P6',
    name: 'Tech Fabrics / Membranes',
    group: 'Продукт и производство',
    description:
      'Использование технологичных тканей (мембраны, влагозащита, терморегуляция), характерное для techwear и sport-брендов.',
  },
  {
    id: 'P7',
    name: 'Category Focus (узость / специализация)',
    group: 'Стратегия',
    description:
      'Степень специализации бренда на определенных категориях (например, только верхняя одежда или деним).',
  },
  {
    id: 'P8',
    name: 'Discount Intensity',
    group: 'Ценообразование и экономика',
    description: 'Частота и глубина скидок. Высокая интенсивность характерна для масс-маркета.',
  },
  {
    id: 'P9',
    name: 'D2C Share',
    group: 'Дистрибуция и рынок',
    description: 'Доля прямых продаж через собственные каналы (e-commerce, розница).',
  },
  {
    id: 'P10',
    name: 'Retail Presence (ритейл / маркетплейсы / универмаги)',
    group: 'Дистрибуция и рынок',
    description: 'Присутствие в мультибрендовых магазинах и на крупных онлайн-платформах.',
  },
  {
    id: 'P11',
    name: 'Boutique Presence (монобренд-бутики)',
    group: 'Дистрибуция и рынок',
    description: 'Наличие собственных монобрендовых бутиков.',
  },
  {
    id: 'P12',
    name: 'Heritage / Age',
    group: 'Бренд и маркетинг',
    description: 'Возраст и история бренда. Высокие значения у брендов с наследием.',
  },
  {
    id: 'P13',
    name: 'Innovation & Design',
    group: 'Продукт и производство',
    description: 'Уровень инновационности и оригинальности дизайна.',
  },
  {
    id: 'P14',
    name: 'Visual Identity Level',
    group: 'Бренд и маркетинг',
    description: 'Сила и узнаваемость визуальной айдентики (логотип, стиль съемок, брендинг).',
  },
  {
    id: 'P15',
    name: 'Export Share',
    group: 'Дистрибуция и рынок',
    description: 'Доля продаж на международных рынках.',
  },
  {
    id: 'P16',
    name: 'Sustainability / ESG',
    group: 'Стратегия',
    description:
      'Уровень приверженности принципам устойчивого развития (эко-материалы, прозрачность).',
  },
  {
    id: 'P17',
    name: 'Collab Frequency (коллаборации)',
    group: 'Бренд и маркетинг',
    description: 'Частота коллабораций с другими брендами, артистами или инфлюенсерами.',
  },
  {
    id: 'P18',
    name: 'Audience Income (доход целевой аудитории)',
    group: 'Стратегия',
    description: 'Уровень дохода целевой аудитории бренда.',
  },
  {
    id: 'P19',
    name: 'Digital Maturity (сайт, соцсети, 3D/AR)',
    group: 'Бренд и маркетинг',
    description:
      'Уровень развития цифровых каналов и использования технологий (3D, AR, live-shopping).',
  },
  {
    id: 'P20',
    name: 'Price Stability (отсутсвие markdown)',
    group: 'Ценообразование и экономика',
    description: 'Стабильность цен и отсутствие частых распродаж, характерное для люкс-сегмента.',
  },
  {
    id: 'P21',
    name: 'Time-to-Market (скорость вывода коллекций)',
    group: 'Стратегия',
    description:
      'Скорость вывода новых коллекций на рынок (от дизайна до продажи). Высокая скорость характерна для fast-fashion, низкая — для heritage и couture.',
  },
  {
    id: 'P22',
    name: 'Community Engagement (вовлеченность комьюнити)',
    group: 'Бренд и маркетинг',
    description:
      'Уровень активности аудитории: UGC, комментарии, участие в ивентах. Показывает силу комьюнити.',
  },
  {
    id: 'P23',
    name: 'Physical Store Experience (опыт в физическом магазине)',
    group: 'Дистрибуция и рынок',
    description:
      'Качество клиентского опыта в офлайн-точках: дизайн магазина, уровень сервиса, специальные мероприятия.',
  },
];

export const segments = [
  {
    code: 'S1',
    name: 'Ultra-Mass Market',
    description: 'Максимально дешёвые бренды, огромный ассортимент, fast production.',
    group: 'MASS & VALUE',
  },
  {
    code: 'S2',
    name: 'Mass Market',
    description: 'Стандартные глобальные бренды массового производства.',
    group: 'MASS & VALUE',
  },
  {
    code: 'S3',
    name: 'Upper Mass Market',
    description: 'Качественнее материалов, узкие капсулы, чуть выше цена.',
    group: 'MASS & VALUE',
  },
  {
    code: 'S4',
    name: 'Value Essentials',
    description: 'Умные базовые вещи: функционально, качественно, без лишнего модного шума.',
    group: 'MASS & VALUE',
  },
  {
    code: 'S5',
    name: 'Mass Premium / Affordable Premium',
    description: 'Между массом и премиумом, улучшенное качество.',
    group: 'MASS & VALUE',
  },
  {
    code: 'S6',
    name: 'Trend-led Fast Contemporary',
    description: 'Быстрые модные бренды, высокий оборот fashion-моделей.',
    group: 'CONTEMPORARY & TREND',
  },
  {
    code: 'S7',
    name: 'Urban Contemporary',
    description: 'Городской стиль, актуальные силуэты, digital-коммуникации.',
    group: 'CONTEMPORARY & TREND',
  },
  {
    code: 'S8',
    name: 'Contemporary',
    description: 'Баланс качества, дизайна и цены. Современные бренды без luxury-позиционирования.',
    group: 'CONTEMPORARY & TREND',
  },
  {
    code: 'S9',
    name: 'Upper Contemporary',
    description: 'На границе accessible luxury, устойчивые материалы, сильный digital-брендинг.',
    group: 'CONTEMPORARY & TREND',
  },
  {
    code: 'S10',
    name: 'Designer Contemporary',
    description: 'Авторские бренды, капсулы, креативные коллекции.',
    group: 'CONTEMPORARY & TREND',
  },
  {
    code: 'S11',
    name: 'Avant-Garde / Experimental',
    description: 'Дизайнерские концептуальные бренды.',
    group: 'CONTEMPORARY & TREND',
  },
  {
    code: 'S12',
    name: 'Streetwear',
    description: 'Скейт/хип-хоп культура, дропы, лимитки.',
    group: 'LIFESTYLE & NICHE',
  },
  {
    code: 'S13',
    name: 'Sport Lifestyle',
    description: 'Между спортом и городом.',
    group: 'LIFESTYLE & NICHE',
  },
  {
    code: 'S14',
    name: 'Athleisure Premium',
    description: 'Спортивный премиум.',
    group: 'LIFESTYLE & NICHE',
  },
  {
    code: 'S15',
    name: 'Techwear / Urban Premium',
    description: 'Технологичные ткани, мембраны, функциональность.',
    group: 'LIFESTYLE & NICHE',
  },
  {
    code: 'S16',
    name: 'Structured Heritage',
    description: 'Традиционный tailoring, строгие силуэты.',
    group: 'HERITAGE',
  },
  {
    code: 'S17',
    name: 'Casual Heritage / Utility',
    description: 'Workwear, utilitarian бренды.',
    group: 'HERITAGE',
  },
  {
    code: 'S18',
    name: 'Heritage Luxury',
    description: 'Исторические бренды с высокими стандартами ремесла.',
    group: 'HERITAGE',
  },
  {
    code: 'S19',
    name: 'Accessible Luxury / Affordable Luxury',
    description: 'Доступный люкс.',
    group: 'LUXURY',
  },
  {
    code: 'S20',
    name: 'Luxury / Ultra Luxury / Couture',
    description: 'Haute Couture, top luxury maisons.',
    group: 'LUXURY',
  },
];

export const valueClasses: { [key: string]: string } = {
  R: 'bg-red-500/80 text-white',
  O: 'bg-orange-400/80 text-black',
  Y: 'bg-yellow-400/80 text-black',
  '–': 'bg-muted/50 text-muted-foreground',
};

export const highlightClasses: { [key: string]: string } = {
  R: 'bg-red-500/10 text-red-700 dark:bg-red-900/20 dark:text-red-300',
  O: 'bg-orange-500/10 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
  Y: 'bg-yellow-500/10 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
  '–': 'text-muted-foreground',
};

export const classificationData = segments.map((s, i) => ({
  id: i + 1,
  group: s.group || 'Без группы',
  segment: s.name,
  description: s.description,
}));

// Detailed Matrix Data
const targetProfiles = [
  // G1, G2, G3, G4, G5
  { G1: 0.15, G2: 0.35, G3: 0.35, G4: 0.65, G5: 0.9 }, // P1
  { G1: 0.95, G2: 0.6, G3: 0.6, G4: 0.3, G5: 0.15 }, // P2
  { G1: 0.9, G2: 0.6, G3: 0.55, G4: 0.45, G5: 0.35 }, // P3
  { G1: 0.35, G2: 0.55, G3: 0.55, G4: 0.8, G5: 0.95 }, // P4
  { G1: 0.3, G2: 0.5, G3: 0.45, G4: 0.8, G5: 0.95 }, // P5
  { G1: 0.2, G2: 0.3, G3: 0.8, G4: 0.25, G5: 0.35 }, // P6
  { G1: 0.3, G2: 0.5, G3: 0.55, G4: 0.75, G5: 0.8 }, // P7
  { G1: 0.8, G2: 0.4, G3: 0.35, G4: 0.15, G5: 0.05 }, // P8
  { G1: 0.4, G2: 0.6, G3: 0.7, G4: 0.35, G5: 0.25 }, // P9
  { G1: 0.7, G2: 0.5, G3: 0.5, G4: 0.7, G5: 0.75 }, // P10
  { G1: 0.05, G2: 0.2, G3: 0.15, G4: 0.6, G5: 0.8 }, // P11
  { G1: 0.2, G2: 0.35, G3: 0.25, G4: 0.85, G5: 0.8 }, // P12
  { G1: 0.3, G2: 0.65, G3: 0.75, G4: 0.45, G5: 0.6 }, // P13
  { G1: 0.4, G2: 0.7, G3: 0.7, G4: 0.7, G5: 0.85 }, // P14
  { G1: 0.2, G2: 0.4, G3: 0.45, G4: 0.6, G5: 0.7 }, // P15
  { G1: 0.2, G2: 0.45, G3: 0.45, G4: 0.55, G5: 0.6 }, // P16
  { G1: 0.3, G2: 0.55, G3: 0.7, G4: 0.35, G5: 0.4 }, // P17
  { G1: 0.3, G2: 0.45, G3: 0.45, G4: 0.65, G5: 0.85 }, // P18
  { G1: 0.5, G2: 0.75, G3: 0.8, G4: 0.55, G5: 0.65 }, // P19
  { G1: 0.2, G2: 0.45, G3: 0.4, G4: 0.8, G5: 0.95 }, // P20
  { G1: 0.9, G2: 0.5, G3: 0.4, G4: 0.2, G5: 0.1 }, // P21 Time-to-Market (Fast -> Slow)
  { G1: 0.2, G2: 0.5, G3: 0.8, G4: 0.6, G5: 0.75 }, // P22 Community Engagement
  { G1: 0.1, G2: 0.3, G3: 0.4, G4: 0.7, G5: 0.9 }, // P23 Physical Store Experience
];

const segmentOverrides: Record<
  string,
  Partial<Record<keyof (typeof targetProfiles)[0], number>>
> = {
  S1: { G1: 0.1 },
  S2: { G1: 0.18 },
  S3: { G1: 0.45 },
  S4: { G1: 0.55 },
  S5: { G1: 0.28 },
  S6: { G2: 0.8 },
  S7: { G2: 0.8 },
  S8: { G2: 0.6 },
  S9: { G2: 0.7 },
  S10: { G2: 0.75 },
  S11: { G2: 0.9 },
  S12: { G3: 0.4 },
  S13: { G3: 0.85 },
  S14: { G3: 0.6 },
  S15: { G3: 0.95 },
  S16: { G4: 0.9 },
  S17: { G4: 0.5 },
  S18: { G4: 0.85 },
  S19: { G5: 0.75 },
  S20: { G5: 0.98 },
};

export const detailedMatrixParameters = [
  {
    id: 'P1',
    name: 'Price Index',
    options: [
      { label: 'До 3 000 ₽', value: 0.05 },
      { label: '3–8k ₽', value: 0.15 },
      { label: '8–15k ₽', value: 0.3 },
      { label: '15–30k ₽', value: 0.45 },
      { label: '30–60k ₽', value: 0.65 },
      { label: '60–120k ₽', value: 0.8 },
      { label: '120k+ ₽', value: 0.95 },
    ],
  },
  {
    id: 'P2',
    name: 'Production Volume',
    options: [
      { label: '< 100 шт.', value: 0.05 },
      { label: '100–500 шт.', value: 0.15 },
      { label: '500–2k шт.', value: 0.35 },
      { label: '2k–10k шт.', value: 0.65 },
      { label: '10k+ шт.', value: 0.95 },
    ],
  },
  {
    id: 'P3',
    name: 'Assortment Width',
    options: [
      { label: 'Узкий (1-3 кат.)', value: 0.85 },
      { label: 'Средний (4-6 кат.)', value: 0.55 },
      { label: 'Широкий (7+ кат.)', value: 0.25 },
    ],
  },
  {
    id: 'P4',
    name: 'Materials Quality',
    options: [
      { label: 'Синтетика/смеси', value: 0.3 },
      { label: 'Базовые натуральные', value: 0.55 },
      { label: 'Премиум-смеси', value: 0.8 },
      { label: 'Couture/экзотика', value: 0.95 },
    ],
  },
  {
    id: 'P5',
    name: 'Craftsmanship Level',
    options: [
      { label: 'Стандартное массовое', value: 0.3 },
      { label: 'Улучшенное (ровные швы)', value: 0.5 },
      { label: 'Высокое (ручные элементы)', value: 0.75 },
      { label: 'Couture / Bespoke', value: 0.95 },
    ],
  },
  {
    id: 'P6',
    name: 'Tech Fabrics / Membranes',
    options: [
      { label: 'Используются', value: 0.6 },
      { label: 'Не используются', value: 0.2 },
    ],
  },
  {
    id: 'P7',
    name: 'Category Focus',
    options: [
      { label: 'Высокий (монопродукт)', value: 0.9 },
      { label: 'Средний (несколько категорий)', value: 0.6 },
      { label: 'Низкий (универсальный бренд)', value: 0.3 },
    ],
  },
  {
    id: 'P8',
    name: 'Discount Intensity',
    options: [
      { label: 'Нет скидок', value: 0.05 },
      { label: 'Редко, до 15%', value: 0.2 },
      { label: 'Сезонно, до 30%', value: 0.45 },
      { label: 'Часто, до 50%', value: 0.75 },
      { label: 'Почти всегда, 50%+', value: 0.9 },
    ],
  },
  {
    id: 'P9',
    name: 'D2C Share',
    options: [
      { label: 'Есть собственный e-commerce', value: 0.6 },
      { label: 'Нет собственного e-commerce', value: 0.2 },
    ],
  },
  {
    id: 'P10',
    name: 'Retail Presence',
    options: [
      { label: 'Маркетплейсы масс-рынка', value: 0.25 },
      { label: 'Крупные fashion-ритейлеры', value: 0.4 },
      { label: 'Премиум универмаги', value: 0.6 },
      { label: 'Нет в ритейле', value: 0.1 },
    ],
  },
  {
    id: 'P11',
    name: 'Boutique Presence',
    options: [
      { label: 'Есть монобренд-бутик(и)', value: 0.6 },
      { label: 'Нет монобренд-бутиков', value: 0.2 },
    ],
  },
  {
    id: 'P12',
    name: 'Heritage / Age',
    options: [
      { label: '< 1 года', value: 0.1 },
      { label: '1–3 года', value: 0.3 },
      { label: '3–5 лет', value: 0.5 },
      { label: '5–10 лет', value: 0.7 },
      { label: '10+ лет', value: 0.9 },
    ],
  },
  {
    id: 'P13',
    name: 'Innovation & Design',
    options: [
      { label: 'Базовый дизайн', value: 0.3 },
      { label: 'Трендовый дизайн', value: 0.6 },
      { label: 'Авангардный/инновационный', value: 0.9 },
    ],
  },
  {
    id: 'P14',
    name: 'Visual Identity Level',
    options: [
      { label: 'Слабая/отсутствует', value: 0.2 },
      { label: 'Средняя (есть стиль)', value: 0.6 },
      { label: 'Сильная (узнаваемый бренд)', value: 0.9 },
    ],
  },
  {
    id: 'P15',
    name: 'Export Share',
    options: [
      { label: 'Нет экспорта', value: 0.1 },
      { label: 'Экспорт < 20%', value: 0.4 },
      { label: 'Экспорт > 20%', value: 0.8 },
    ],
  },
  {
    id: 'P16',
    name: 'Sustainability / ESG',
    options: [
      { label: 'Базовые шаги', value: 0.3 },
      { label: 'Сертификации/eco 20–40%', value: 0.5 },
      { label: '40–70% & отчетность', value: 0.7 },
      { label: '70%+ & полная прозрачность', value: 0.9 },
    ],
  },
  {
    id: 'P17',
    name: 'Collab Frequency',
    options: [
      { label: 'Нет коллабораций', value: 0.2 },
      { label: 'Редкие (1-2 в год)', value: 0.5 },
      { label: 'Частые (3+ в год)', value: 0.8 },
    ],
  },
  {
    id: 'P18',
    name: 'Audience Income',
    options: [
      { label: 'Низкий', value: 0.2 },
      { label: 'Средний', value: 0.5 },
      { label: 'Высокий', value: 0.8 },
    ],
  },
  {
    id: 'P19',
    name: 'Digital Maturity',
    options: [
      { label: 'Сайт-визитка, низкий соц. отклик', value: 0.3 },
      { label: 'Стабильный e-com, соцсети растут', value: 0.6 },
      { label: 'Сильный контент, 3D/AR', value: 0.85 },
    ],
  },
  {
    id: 'P20',
    name: 'Price Stability',
    options: [
      { label: 'Высокая (нет скидок)', value: 0.95 },
      { label: 'Средняя (редкие скидки)', value: 0.8 },
      { label: 'Низкая (частые скидки)', value: 0.25 },
    ],
  },
  {
    id: 'P21',
    name: 'Time-to-Market',
    options: [
      { label: 'Fast (2-4 недели)', value: 0.9 },
      { label: 'Mid (1-3 месяца)', value: 0.5 },
      { label: 'Slow (4-6+ месяцев)', value: 0.1 },
    ],
  },
  {
    id: 'P22',
    name: 'Community Engagement',
    options: [
      { label: 'Низкое', value: 0.2 },
      { label: 'Среднее', value: 0.5 },
      { label: 'Высокое', value: 0.8 },
    ],
  },
  {
    id: 'P23',
    name: 'Physical Store Experience',
    options: [
      { label: 'Отсутствует', value: 0.1 },
      { label: 'Базовый', value: 0.4 },
      { label: 'Концептуальный', value: 0.7 },
      { label: 'Люксовый', value: 0.9 },
    ],
  },
];

const getTargetForSegment = (paramIndex: number, segmentIndex: number) => {
  let groupKey: keyof (typeof targetProfiles)[0];
  const segmentCode = segments[segmentIndex]?.code;

  if (segmentIndex < 5) groupKey = 'G1';
  else if (segmentIndex < 11) groupKey = 'G2';
  else if (segmentIndex < 15) groupKey = 'G3';
  else if (segmentIndex < 18) groupKey = 'G4';
  else groupKey = 'G5';

  let target = targetProfiles[paramIndex][groupKey];

  // Apply overrides
  if (
    segmentCode &&
    segmentOverrides[segmentCode] &&
    segmentOverrides[segmentCode][groupKey] !== undefined
  ) {
    target = segmentOverrides[segmentCode][groupKey]!;
  }

  // Invert for negative parameters
  if (parameters[paramIndex].id === 'P2' || parameters[paramIndex].id === 'P8') {
    return 1 - target;
  }

  return target;
};

const calculateFitScore = (optionValue: number, targetValue: number, paramDirection: number) => {
  let effectiveOptionValue = optionValue;
  if (paramDirection === -1) {
    effectiveOptionValue = 1 - optionValue;
  }
  return 1 - Math.abs(effectiveOptionValue - targetValue);
};

const paramDirections: Record<string, number> = {};
parameters.forEach((p) => {
  if (p.name.includes('Volume') || p.name.includes('Discount')) {
    paramDirections[p.id] = -1;
  } else {
    paramDirections[p.id] = 1;
  }
});

const weightMatrixRaw = [
  [
    'R',
    'R',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'R',
    'O',
    'R',
    'R',
    'R',
  ],
  [
    'R',
    'R',
    'R',
    'R',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'Y',
    'Y',
    'Y',
  ],
  [
    'R',
    'R',
    'R',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
  ],
  [
    'Y',
    'Y',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'R',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'R',
    'O',
    'O',
    'R',
    'R',
  ],
  [
    'Y',
    'Y',
    'Y',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'Y',
    'Y',
    'Y',
    'Y',
    'R',
    'O',
    'O',
    'R',
    'R',
  ],
  [
    '–',
    '–',
    '–',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'O',
    'R',
    'O',
    'R',
    '–',
    '–',
    '–',
    'Y',
    'Y',
  ],
  [
    'Y',
    'Y',
    'Y',
    'R',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
  ],
  [
    'R',
    'R',
    'O',
    'O',
    'O',
    'O',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'O',
    'O',
    'O',
    'O',
    'Y',
    'Y',
    'Y',
    'O',
    'R*',
  ],
  [
    'Y',
    'Y',
    'Y',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
  ],
  [
    'R',
    'R',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
  ],
  [
    '–',
    '–',
    '–',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'R',
    'O',
    'R',
    'R',
    'R',
  ],
  [
    '–',
    '–',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'O',
    'Y',
    'Y',
    'Y',
    'Y',
    'R',
    'O',
    'R',
    'R',
    'R',
  ],
  [
    '–',
    '–',
    'Y',
    'Y',
    'O',
    'R',
    'O',
    'O',
    'O',
    'R',
    'R',
    'O',
    'O',
    'O',
    'R',
    'O',
    'Y',
    'O',
    'O',
    'O',
  ],
  [
    'Y',
    'Y',
    'O',
    'O',
    'O',
    'R',
    'R',
    'O',
    'R',
    'R',
    'R',
    'R',
    'O',
    'O',
    'R',
    'R',
    'O',
    'R',
    'R',
    'R',
  ],
  [
    '–',
    '–',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'O',
    'O',
    'O',
    'O',
    'O',
  ],
  [
    '–',
    '–',
    'Y',
    'Y',
    'Y',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'Y',
    'O',
    'O',
    'O',
  ],
  [
    'Y',
    'Y',
    'Y',
    'Y',
    'O',
    'R',
    'O',
    'O',
    'O',
    'O',
    'O',
    'R',
    'O',
    'O',
    'O',
    'Y',
    'Y',
    'O',
    'O',
    'O',
  ],
  [
    'R',
    'R',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'R',
    'O',
    'R',
    'R',
    'R',
  ],
  [
    'O',
    'O',
    'O',
    'O',
    'O',
    'R',
    'R',
    'O',
    'O',
    'O',
    'O',
    'R',
    'O',
    'O',
    'R',
    'O',
    'O',
    'O',
    'O',
    'O',
  ],
  [
    '–',
    '–',
    'Y',
    'O',
    'O',
    'Y',
    'Y',
    'O',
    'O',
    'O',
    'R',
    'Y',
    'Y',
    'Y',
    'Y',
    'R',
    'O',
    'O',
    'O',
    'R',
  ],
  [
    'R',
    'R',
    'O',
    'Y',
    'Y',
    'R',
    'O',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
    'Y',
  ],
  [
    'Y',
    'Y',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'O',
    'R',
    'O',
    'R',
    'O',
    'O',
    'O',
    'Y',
    'O',
    'O',
    'O',
    'O',
  ],
  [
    '–',
    '–',
    'Y',
    'Y',
    'O',
    'O',
    'O',
    'R',
    'O',
    'O',
    'O',
    'Y',
    'Y',
    'Y',
    'O',
    'R',
    'O',
    'R',
    'R',
    'R',
  ],
];

export const matrixData = weightMatrixRaw.map((row, paramIndex) => {
  const param = parameters[paramIndex];
  if (!param) return { name: 'Unknown', values: [], scores: [] };

  const detailedParam = detailedMatrixParameters.find((p) => p.id === param.id);

  return {
    name: param.name,
    values: row,
    scores:
      detailedParam?.options?.map((option) =>
        Array.from({ length: 20 }).map((_, segmentIndex) => {
          const targetValue = getTargetForSegment(paramIndex, segmentIndex);
          const direction = paramDirections[param.id] || 1;
          return calculateFitScore(option.value, targetValue, direction);
        })
      ) || [],
  };
});
