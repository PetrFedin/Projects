import {
  EducationCourse,
  LearningPath,
  LearningPathProgramDetail,
  KnowledgeArticle,
  AcademyEvent,
  Assessment,
} from './types';
import { isCourseVisibleInClientCatalog } from './academy-catalog-rules';
import { DEMO_BRAND_OWNER_ID, DEMO_ORGANIZATION_OWNER_ID } from './academy-constants';

export const glossary: Record<string, { term: string; definition: string }> = {
  GMROI: {
    term: 'Gross Margin Return on Investment',
    definition:
      'Рентабельность инвестиций в запасы по валовой марже. Показывает, сколько валовой прибыли приносит каждый рубль, вложенный в товар.',
  },
  SKU: {
    term: 'Stock Keeping Unit',
    definition:
      'Идентификатор товарной позиции, единица учета запасов. Каждому цвету и размеру модели присваивается свой SKU.',
  },
  RFID: {
    term: 'Radio Frequency Identification',
    definition:
      'Способ автоматической идентификации объектов, при котором посредством радиосигналов считываются данные, хранящиеся в RFID-метках.',
  },
  ESG: {
    term: 'Environmental, Social, and Governance',
    definition:
      'Совокупность стандартов деятельности компании, которые социально ответственные инвесторы используют для проверки потенциальных инвестиций.',
  },
  ROI: {
    term: 'Return on Investment',
    definition:
      'Коэффициент окупаемости инвестиций. Отношение полученной прибыли к сумме вложенных средств.',
  },
  B2B: {
    term: 'Business-to-Business',
    definition:
      'Формат взаимодействия, при котором одна компания продает товары или услуги другой компании.',
  },
  PLM: {
    term: 'Product Lifecycle Management',
    definition:
      'Система управления жизненным циклом изделия: от идеи и дизайна до производства и утилизации.',
  },
};

export const mockCourses: EducationCourse[] = [
  {
    id: 'course-1',
    title: 'Экономика Fashion-ритейла: от маржи до прибыли',
    description:
      'Глубокое погружение в метрики розничной торговли, юнит-экономику и оптимизацию маржи для владельцев магазинов и байеров.',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800',
    duration: '12 часов',
    level: 'intermediate',
    targetRoles: ['shop', 'brand', 'distributor'],
    catalogSource: 'platform',
    audienceKind: 'professional',
    professionalScope: 'role_team',
    category: 'economics',
    provider: 'Syntha Academy',
    providerKind: 'syntha',
    access: 'paid',
    price: 8_900,
    outcomeKind: 'qualification',
    rating: 4.9,
    studentsCount: 1240,
    isRecommended: true,
    curriculum: ['Основы юнит-экономики', 'Управление уценками', 'Оптимизация оборачиваемости'],
    media: [
      { type: 'video', title: 'Мастер-класс по оптимизации маржи', url: '#' },
      { type: 'file', title: 'Шаблон юнит-экономики (Excel)', url: '#', size: '2.4 MB' },
    ],
    relatedIds: ['art-1'],
  },
  {
    id: 'course-2',
    title: 'AI в дизайне одежды: 3D и генеративные рабочие процессы',
    description:
      'Освойте инструменты завтрашнего дня. Узнайте, как интегрировать AI и 3D-моделирование в ваш процесс проектирования.',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800',
    duration: '24 часа',
    level: 'advanced',
    targetRoles: ['brand', 'manufacturer'],
    catalogSource: 'platform',
    audienceKind: 'professional',
    professionalScope: 'single_role',
    category: 'design',
    provider: 'Syntha Academy',
    providerKind: 'syntha',
    access: 'paid',
    price: 14_900,
    outcomeKind: 'certificate',
    rating: 4.8,
    studentsCount: 850,
    isNew: true,
    curriculum: ['Основы CLO 3D', 'Stable Diffusion для текстиля', 'Цифровое семплирование'],
    media: [
      { type: 'video', title: 'Генерация лекал с помощью AI', url: '#' },
      { type: 'file', title: 'Пакет 3D-ассетов', url: '#', size: '156 MB' },
    ],
  },
  {
    id: 'course-3',
    title: 'Глобальное управление цепочками поставок',
    description:
      'Университетская программа партнёра: международная логистика, таможня и этичный сорсинг — с итоговым дипломом установленного образца.',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800',
    duration: '18 часов',
    level: 'pro',
    targetRoles: ['distributor', 'supplier', 'manufacturer'],
    catalogSource: 'platform',
    audienceKind: 'professional',
    professionalScope: 'role_team',
    category: 'management',
    provider: 'НИУ ВШЭ — программа партнёра',
    providerKind: 'university',
    access: 'paid',
    price: 42_000,
    outcomeKind: 'diploma',
    rating: 4.7,
    studentsCount: 2100,
    curriculum: ['Трансграничная логистика', 'Сорсинг из СНГ и Китая', 'ESG соответствие'],
  },
  {
    id: 'course-4',
    title: 'Психология ритейла и визуальный мерчандайзинг',
    description:
      'Лёгкий практический курс школы визуального мерчандайзинга: повысьте конверсию офлайн-магазина без академической отчётности — для общего понимания и навыков.',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800',
    duration: '10 часов',
    level: 'beginner',
    targetRoles: ['shop'],
    catalogSource: 'platform',
    audienceKind: 'individual',
    category: 'retail',
    provider: 'Школа «Витрина»',
    providerKind: 'school',
    access: 'free',
    price: 0,
    outcomeKind: 'casual',
    rating: 4.6,
    studentsCount: 3400,
    archived: true,
    curriculum: ['Тепловые карты магазина', 'Психология цвета', 'Освещение для сегмента Luxury'],
  },
  {
    id: 'course-5',
    title: 'Стратегическое построение бренда',
    description:
      'Мастер-класс для основателей: идентичность бренда и масштабирование — с удостоверением о повышении квалификации от образовательного центра бренда.',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800',
    duration: '30 часов',
    level: 'intermediate',
    targetRoles: ['brand'],
    catalogSource: 'platform',
    audienceKind: 'professional',
    professionalScope: 'single_role',
    category: 'management',
    provider: 'Образовательный центр Aurora',
    providerKind: 'brand',
    access: 'paid',
    price: 18_900,
    outcomeKind: 'qualification',
    rating: 5.0,
    studentsCount: 560,
    isRecommended: true,
    archived: true,
    curriculum: ['ДНК бренда', 'Маркетинговые воронки', 'Финансовое планирование для основателей'],
    media: [
      { type: 'video', title: 'Воркшоп: позиционирование бренда', url: '#' },
      { type: 'file', title: 'Чек-лист запуска коллекции (PDF)', url: '#', size: '1.1 MB' },
    ],
  },
  {
    id: 'course-6',
    title: '15 минут: тренды сезона без воды',
    description:
      'Короткий бесплатный формат от fashion-бренда: ориентиры по цвету и силуэту сезона — чтобы быстро войти в контекст закупок или вдохновиться.',
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800',
    duration: '2 часа',
    level: 'beginner',
    targetRoles: ['shop', 'brand', 'distributor'],
    catalogSource: 'platform',
    audienceKind: 'individual',
    category: 'design',
    provider: 'Marina Rinaldi — открытое обучение',
    providerKind: 'brand',
    access: 'free',
    price: 0,
    outcomeKind: 'casual',
    rating: 4.5,
    studentsCount: 12_800,
    isNew: true,
    curriculum: ['Палитра сезона', 'Силуэты и материалы', 'Как перенести тренд в ассортимент'],
  },
  {
    id: 'course-brand-approved',
    title: 'Визуальный язык коллекции: демо бренда Aurora',
    description:
      'Демо: курс бренда с платформы после одобрения Syntha — материалы для клиентов и партнёров, как только появится контент. Сейчас заглушки.',
    thumbnail: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800',
    duration: '6 часов',
    level: 'intermediate',
    targetRoles: ['shop', 'brand'],
    catalogSource: 'brand',
    ownerBrandId: DEMO_BRAND_OWNER_ID,
    moderationStatus: 'approved',
    audienceKind: 'professional',
    professionalScope: 'single_role',
    category: 'design',
    provider: 'Образовательная студия Aurora',
    providerKind: 'brand',
    access: 'free',
    price: 0,
    outcomeKind: 'certificate',
    rating: 4.7,
    studentsCount: 120,
    curriculum: ['Линия коллекции', 'Цвет и фактура', 'Коммуникация с ритейлом'],
  },
  {
    id: 'course-brand-pending',
    title: '[На согласовании] Закрытый воркшоп для партнёров бренда',
    description:
      'Демо: курс в очереди модерации — в клиентском каталоге не отображается, пока админ платформы не одобрит.',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800',
    duration: '3 часа',
    level: 'beginner',
    targetRoles: ['shop', 'distributor'],
    catalogSource: 'brand',
    ownerBrandId: DEMO_BRAND_OWNER_ID,
    moderationStatus: 'pending_review',
    audienceKind: 'professional',
    professionalScope: 'role_team',
    category: 'retail',
    provider: 'Образовательная студия Aurora',
    providerKind: 'brand',
    access: 'paid',
    price: 4_900,
    outcomeKind: 'casual',
    rating: 0,
    studentsCount: 0,
    curriculum: ['Брифинг партнёра', 'Ассортиментные приоритеты'],
  },
  {
    id: 'course-org-approved',
    title: 'Комплаенс поставок: программа партнёрской организации',
    description:
      'Демо: курс организации после одобрения платформы — для профессиональных ролей в закупках и производстве.',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800',
    duration: '14 часов',
    level: 'pro',
    targetRoles: ['supplier', 'manufacturer', 'brand'],
    catalogSource: 'organization',
    ownerOrganizationId: DEMO_ORGANIZATION_OWNER_ID,
    moderationStatus: 'approved',
    audienceKind: 'professional',
    professionalScope: 'role_team',
    category: 'legal',
    provider: 'Ассоциация «Ответственные поставки»',
    providerKind: 'partner',
    access: 'paid',
    price: 9_500,
    outcomeKind: 'qualification',
    rating: 4.8,
    studentsCount: 640,
    curriculum: ['Документооборот', 'Аудит фабрики', 'Цифровой след'],
  },
  {
    id: 'course-org-pending',
    title: '[На согласовании] Открытый лекторий для индивидуальных слушателей',
    description:
      'Демо: заявка организации на модерации — не видна клиентам до одобрения.',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800',
    duration: '8 часов',
    level: 'beginner',
    targetRoles: ['client', 'shop', 'brand'],
    catalogSource: 'organization',
    ownerOrganizationId: DEMO_ORGANIZATION_OWNER_ID,
    moderationStatus: 'pending_review',
    audienceKind: 'individual',
    category: 'economics',
    provider: 'Институт моды (партнёр)',
    providerKind: 'school',
    access: 'free',
    price: 0,
    outcomeKind: 'casual',
    rating: 0,
    studentsCount: 0,
    curriculum: ['Обзор рынка', 'Карьера в индустрии'],
  },
];

export const mockArticles: KnowledgeArticle[] = [
  {
    id: 'art-1',
    title: 'Понимание GMROI в современном ритейле',
    slug: 'understanding-gmroi',
    category: 'Экономика',
    excerpt:
      'Валовая маржа на инвестиции в запасы (GMROI) — ключевой показатель для управления запасами.',
    content: 'Полный текст статьи о расчетах GMROI и их важности для бизнеса...',
    authorName: 'Д-р Fashion-аналитики',
    updatedAt: '2026-01-15T10:00:00Z',
    tags: ['Метрики', 'ROI', 'Запасы'],
    relatedIds: ['course-1', 'art-2'],
  },
  {
    id: 'art-2',
    title: 'Эра Digital ID: Соответствие нормам ЕС 2026',
    slug: 'digital-product-passports-regulation',
    category: 'Право',
    excerpt:
      'Новые правила, требующие наличия цифровых паспортов для всех текстильных изделий, продаваемых в ЕС.',
    content: 'Анализ новой правовой базы ЕС по цифровым паспортам продукции...',
    authorName: 'Юридический департамент',
    updatedAt: '2026-02-01T14:30:00Z',
    tags: ['Комплаенс', 'Устойчивое развитие', 'ЕС'],
    relatedIds: ['art-1'],
  },
  {
    id: 'art-arch-1',
    title: 'Архив: закупочные контракты SS24 (справка)',
    slug: 'archive-ss24-contracts',
    category: 'Право',
    excerpt: 'Устаревший обзор типовых пунктов контракта для демо-архива базы знаний.',
    content: 'Полный текст перенесён в архив; актуальная версия — в разделе комплаенса.',
    authorName: 'Syntha Academy',
    updatedAt: '2023-11-01T12:00:00Z',
    tags: ['Архив', 'B2B', 'Контракт'],
    archived: true,
  },
  {
    id: 'art-arch-2',
    title: 'Архив: маржинальность аутлетов (методика 2022)',
    slug: 'archive-outlet-margin-2022',
    category: 'Экономика',
    excerpt: 'Историческая методика расчёта для сравнения с текущими KPI.',
    content: 'Материал сохранён только для обучения; цифры не отражают текущий рынок.',
    authorName: 'Syntha Academy',
    updatedAt: '2022-08-20T09:00:00Z',
    tags: ['Архив', 'Маржа', 'Аутлет'],
    archived: true,
  },
];

export const mockAcademyEvents: AcademyEvent[] = [
  {
    id: 'event-up-1',
    title: 'Прогноз рынка FW26/27: прямой эфир',
    description:
      'Живой разбор прогнозируемых паттернов спроса и закупок на следующий сезон — для байеров и владельцев магазинов.',
    type: 'webinar',
    startTime: '2026-09-10T15:00:00Z',
    endTime: '2026-09-10T16:30:00Z',
    hostName: 'Команда аналитики Syntha',
    status: 'upcoming',
    streamUrl: 'https://syntha.example.com/live/fw26-forecast',
    relatedCourseId: 'course-1',
  },
  {
    id: 'event-up-2',
    title: 'Воркшоп: цифровые паспорта продукции',
    description:
      'Практическая сессия по созданию и отслеживанию паспортов продукции в Syntha OS.',
    type: 'workshop',
    startTime: '2026-11-05T11:00:00Z',
    endTime: '2026-11-05T13:00:00Z',
    hostName: 'Макс Волков (Product)',
    status: 'upcoming',
    relatedId: 'art-2',
    relatedCourseId: 'course-2',
    streamUrl: 'https://syntha.example.com/workshops/dpp-2026',
  },
  {
    id: 'event-past-1',
    title: 'Прогноз рынка SS26 (запись)',
    description: 'Запись эфира с разбором сезонных трендов и закупок SS26.',
    type: 'webinar',
    startTime: '2026-02-15T15:00:00Z',
    endTime: '2026-02-15T16:30:00Z',
    hostName: 'Команда аналитики Syntha',
    status: 'ended',
    recordingUrl: 'https://syntha.example.com/recordings/ss26-forecast',
    relatedCourseId: 'course-1',
  },
  {
    id: 'event-past-2',
    title: 'Мини-лекция: ESG и закупки',
    description: 'Короткий разбор требований к поставщикам и маркировке.',
    type: 'live_stream',
    startTime: '2026-03-20T10:00:00Z',
    endTime: '2026-03-20T10:45:00Z',
    hostName: 'Syntha Academy',
    status: 'ended',
    recordingUrl: 'https://syntha.example.com/recordings/esg-buying-2026',
    relatedId: 'art-2',
  },
];

/** Подписи уровня для курсов и траекторий */
export const academyLevelLabels: Record<NonNullable<EducationCourse['level']>, string> = {
  beginner: 'Начальный',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
  pro: 'Экспертный',
};

const PATH_1_DETAIL: LearningPathProgramDetail = {
  overviewExtended:
    'Программа объединяет финансовую грамотность fashion-ритейла и управление международными цепочками поставок. Вы последовательно закрепляете метрики маржи и оборачиваемости, затем переходите к контрактам, SLA поставщиков и ESG-требованиям — с опорой на демо-данные Syntha и шаблоны документов. Формат рассчитан на специалистов, которые уже работают с заказами и каталогом, но хотят системно выстроить оптовые процессы.',
  audienceDetail:
    'Закупщики и категорийные менеджеры, снабженцы и руководители направлений B2B, а также ритейл-операционисты, которым нужно согласовать экономику витрины с условиями поставщиков. Полезно при базовом понимании SKU, сезонности и закупочных цен; глубокая финансовая подготовка не обязательна.',
  competencies: [
    'Считать маржу, GMROI и влияние уценок на P&L в типовых сценариях fashion-ритейла.',
    'Собирать оптовый контракт-пакет: MOQ, Incoterms, штрафы за просрочку, опции возврата.',
    'Выстраивать карту поставщиков: риски, дублирование, резервирование мощностей и альтернативы.',
    'Проверять поставщика по ESG-сигналам и маркировке в демо-чек-листах Syntha.',
    'Готовить входные данные для ERP/PLM-интеграций (номенклатура, атрибуты, сроки).',
  ],
  prerequisites: [
    'Доступ к демо-кабинету Syntha (роль «клиент» или выше).',
    'Умение работать с таблицами (Excel / Google Sheets) для домашних кейсов.',
    'Чтение технической документации на английском — отдельные юниты содержат термины Incoterms.',
  ],
  workload:
    'Ориентир 4–6 недель при темпе 6–8 часов в неделю: видео можно смотреть асинхронно, разборы кейсов — в фиксированные слоты (по расписанию академии в демо). Итоговый кейс-пакет формируется постепенно; дедлайны по модулям указаны внутри курсов.',
  assessmentAndCert:
    'Промежуточные тесты по юнитам (закрытые вопросы + мини-кейсы), практическое задание по портфелю поставщиков и финальный синтез: «экономика + логистика» в одном документе. Порог зачёта 70% по тестам и зачёт по чек-листу кейса наставником в демо-режиме.',
  certificationDetail:
    'При успешном прохождении выдаётся электронный сертификат Syntha Wholesale Partner (демо): ID выпуска, дата, список модулей и ссылка на проверку. Партнёрский диплом НИУ ВШЭ по второму курсу траектории остаётся на стороне партнёрской программы и оформляется по их правилам.',
  tools: [
    'Syntha B2B-витрина и демо-каталог атрибутов',
    'Шаблоны Excel: юнит-экономика, матрица поставщиков',
    'Чек-листы compliance / ESG (PDF)',
  ],
  readings: [
    'Syntha Glossary — разделы B2B, SKU, ESG',
    'Рекомендованная статья базы знаний по сорсингу (связанные материалы внутри курсов)',
  ],
  courseBlocks: [
    {
      courseId: 'course-1',
      roleInPath:
        'Фундамент: выравниваем язык цифр между закупкой и финансами, чтобы дальнейшие логистические решения опирались на измеримые KPI.',
      narrative:
        'Курс даёт каркас метрик fashion-ритейла: маржа, оборачиваемость, влияние промо и уценок. Вы разберёте типовые отчёты и научитесь формулировать запросы к финансовой команде и поставщику на основе цифр, а не «ощущений витрины».',
      keyUnits: [
        'Юнит-экономика SKU и корзины закупки',
        'Управление уценками и промо-долей',
        'Оборачиваемость и запасы: связка с оптовыми партиями',
      ],
      labOrProject:
        'Мини-проект: заполнить шаблон юнит-экономики для вымышленной капсулы и обосновать размер оптовой партии.',
    },
    {
      courseId: 'course-3',
      roleInPath:
        'Углубление: международная логистика, контрактная дисциплина и устойчивый сорсинг — то, без чего оптовая закупка не масштабируется.',
      narrative:
        'Второй блок переводит экономику в цепочку поставок: трансграничные поставки, таможня, этичный сорсинг и требования к поставщику. Акцент на согласовании сроков, штрафов и резервов с первым курсом — вы собираете цельную историю для руководства.',
      keyUnits: [
        'Трансграничная логистика и точки контроля',
        'Сорсинг из СНГ и Китая: риски и диверсификация',
        'ESG и соответствие: практические фильтры при выборе фабрики',
      ],
      labOrProject:
        'Итоговый кейс: карта поставщиков + контрактные условия + расчёт влияния на маржу из первого курса.',
    },
  ],
  faq: [
    {
      question: 'Можно ли проходить курсы в другом порядке?',
      answer:
        'В демо-траектории зафиксирована рекомендованная последовательность: сначала экономика, затем цепочки поставок. Так вы не «прыгаете» с контрактов к метрикам без базы.',
    },
    {
      question: 'Нужен ли доступ к реальному ERP?',
      answer:
        'Нет: достаточно демо-кабинета и выгрузок-шаблонов. В проде те же шаги можно воспроизвести с вашими системами.',
    },
    {
      question: 'Сертификат имеет юридическую силу?',
      answer:
        'Демо-сертификат Syntha подтверждает прохождение учебной программы на платформе. Диплом партнёрского вуза — по отдельному договору с партнёром курса.',
    },
  ],
  finePrint:
    'Расписание эфиров, состав преподавателей и итоговая стоимость пакета в продакшене могут отличаться от демо. Материалы носят учебный характер и не являются юридической или налоговой консультацией.',
};

const PATH_2_DETAIL: LearningPathProgramDetail = {
  overviewExtended:
    'Траектория связывает операционный дизайн с AI-инструментами и зрелым бренд-менеджментом: от 3D/генеративных процессов до стратегии масштабирования. Вы накапливаете артефакты (рендеры, брифы, финансовые допущения), которые можно показать как портфолио руководителю или инвестору в демо-сценарии.',
  audienceDetail:
    'Дизайнеры одежды и продакт-лиды, креативные директора и основатели брендов, которым нужно согласовать визуальный язык, производственные ограничения и экономику коллекции. Ожидается уверенный уровень владения графическими инструментами; опыт 3D приветствуется, но не обязателен — первый курс даёт вводную по пайплайну.',
  competencies: [
    'Собирать AI+3D пайплайн: от референса до семпла с учётом ограничений фабрики.',
    'Оценивать стоимость и сроки итераций при внедрении генеративных инструментов.',
    'Формулировать ДНК бренда, позиционирование и продуктовую линейку с метриками.',
    'Связывать маркетинговые воронки и финансовое планирование на уровне коллекции.',
    'Готовить презентацию стратегии бренда для внутренних стейкхолдеров.',
  ],
  prerequisites: [
    'Профиль с доступом к медиа-материалам демо (скачивание пакетов упражнений).',
    'Базовые навыки презентации (Figma / Keynote / PowerPoint) для защиты проекта.',
  ],
  workload:
    'Ориентир 6–8 недель при 8–10 часах в неделю: много практики на файлах и разборы peer-review в демо. Второй курс тяжелее по тексту и финансовым блокам — заложите время на чтение и шаблоны.',
  assessmentAndCert:
    'Промежуточные задания по 3D/AI (артефакты + короткое описание пайплайна), разбор стратегического кейса и финальная защита концепции бренда. Оценивается полнота обоснований и связность с материалами первого курса.',
  certificationDetail:
    'Syntha Creative Strategist (демо) фиксирует освоение траектории на платформе. Удостоверение о повышении квалификации партнёрского центра Aurora выдаётся по правилам партнёра второго курса.',
  tools: [
    'Демо-пакеты 3D/AI (CLO, Stable Diffusion — в учебных сценариях)',
    'Шаблоны брифов и чек-лист запуска коллекции',
    'Материалы воркшопа по позиционированию',
  ],
  readings: [
    'Глоссарий Syntha — дизайн, производство, AI',
    'Связанные статьи базы знаний из карточек курсов',
  ],
  courseBlocks: [
    {
      courseId: 'course-2',
      roleInPath:
        'Технологический фундамент: ускоряете создание визуала и семплов без потери контроля качества.',
      narrative:
        'Курс проходит через CLO 3D, генеративные workflow и цифровое семплирование. Вы учитесь документировать решения так, чтобы производство и закупка могли их прочитать — мост к стратегическому блоку.',
      keyUnits: [
        'Основы CLO 3D и передача в производство',
        'Stable Diffusion для текстиля: ограничения и QA',
        'Цифровое семплирование: стоимость и календарь',
      ],
      labOrProject:
        'Проект: серия рендеров + описание пайплайна и список рисков для фабрики.',
    },
    {
      courseId: 'course-5',
      roleInPath:
        'Стратегический купол: переводите креатив в устойчивую бренд- и финансовую модель.',
      narrative:
        'Фокус на ДНК бренда, воронках и финансовом планировании для основателей. Вы связываете продуктовые решения из первого курса с ценностным предложением и дорожной картой роста.',
      keyUnits: [
        'ДНК бренда и архетипы коммуникации',
        'Маркетинговые воронки и каналы',
        'Финансовое планирование для коллекции и масштабирования',
      ],
      labOrProject:
        'Итог: презентация стратегии бренда с приложением артефактов из AI/3D блока.',
    },
  ],
  faq: [
    {
      question: 'Нужен ли платный софт?',
      answer:
        'В демо используются учебные файлы и ссылки на материалы. В бою лицензии на профессиональные пакеты приобретаются отдельно.',
    },
    {
      question: 'Подойдёт ли программа основателю без команды?',
      answer:
        'Да: задания рассчитаны на самостоятельную работу, но предусмотрены шаблоны для обратной связи как у команды из 2–3 ролей.',
    },
    {
      question: 'Можно ли зачесть один курс без второго?',
      answer:
        'Сертификат траектории выдаётся при завершении обоих курсов; отдельные курсы доступны в каталоге поштучно.',
    },
  ],
  finePrint:
    'Демо не гарантирует место на воркшопах с ограниченным числом мест. Требования к ПК для 3D/AI указаны внутри курса.',
};

export const mockLearningPaths: LearningPath[] = [
  {
    id: 'path-1',
    title: 'Оптовые закупки и работа с поставщиками',
    description:
      'Траектория для закупщиков: оптовые операции, синхронизация запасов и устойчивые отношения с партнерами.',
    courses: ['course-1', 'course-3'],
    totalDuration: '30 часов',
    outcome: 'Сертификация: Syntha Wholesale Partner',
    audience: 'Закупки, снабжение, B2B-операции',
    level: 'intermediate',
    format: 'Видео + кейсы + самопроверка',
    programDetail: PATH_1_DETAIL,
  },
  {
    id: 'path-2',
    title: 'Директор по цифровому дизайну',
    description: 'От классического дизайна до процессов устойчивого производства на базе AI.',
    courses: ['course-2', 'course-5'],
    totalDuration: '54 часа',
    outcome: 'Сертификация: Syntha Creative Strategist',
    audience: 'Дизайн, продукт, креативные роли',
    level: 'advanced',
    format: 'Видео + проекты + разборы',
    programDetail: PATH_2_DETAIL,
    archived: true,
  },
];

export function getCourseById(id: string): EducationCourse | undefined {
  return mockCourses.find((c) => c.id === id);
}

/** Подборка курсов для блока «ещё в каталоге»: сначала та же категория, затем остальные. */
export function getSuggestedCourses(excludeCourseId: string, limit = 4): EducationCourse[] {
  const course = getCourseById(excludeCourseId);
  if (!course) return [];
  const others = mockCourses.filter(
    (c) => c.id !== excludeCourseId && isCourseVisibleInClientCatalog(c)
  );
  const sameCat = others.filter((c) => c.category === course.category);
  const rest = others.filter((c) => c.category !== course.category);
  return [...sameCat, ...rest].slice(0, limit);
}

/**
 * Траектории, в которые входит курс (сырой список по мокам).
 * Для клиентской витрины используйте `getLearningPathsForCourseForClient` из `@/lib/academy-catalog`.
 */
export function getLearningPathsForCourse(courseId: string): LearningPath[] {
  return mockLearningPaths.filter((p) => p.courses.includes(courseId));
}

/** Мок: записи текущего пользователя на курсы платформы (для блока «Мои курсы») */
export interface PlatformEnrollment {
  courseId: string;
  progress: number;
  status: 'in_progress' | 'completed';
}

const MOCK_MY_PLATFORM_ENROLLMENTS: PlatformEnrollment[] = [
  { courseId: 'course-1', progress: 85, status: 'in_progress' },
  { courseId: 'course-2', progress: 30, status: 'in_progress' },
  { courseId: 'course-3', progress: 100, status: 'completed' },
  { courseId: 'course-5', progress: 100, status: 'completed' },
];

export function getMyPlatformEnrollments(): PlatformEnrollment[] {
  return MOCK_MY_PLATFORM_ENROLLMENTS;
}

/** Агрегаты платформы по обучению (мок для блока «рейтинг / активность»). */
export interface AcademyPlatformLearningBenchmarks {
  /** Среднее число завершённых курсов на активного клиента */
  avgCompletedCoursesPerActiveClient: number;
  /** Средний индекс вовлечённости активных учеников, 0–100 */
  platformEngagementIndex: number;
  /** Доля клиентов с ≥1 завершённым курсом, % */
  shareClientsWithAtLeastOneCompletion: number;
  /** Всего клиентов в рейтинге обучения (деноминатор) */
  totalClientsInLearningRanking: number;
}

export function getAcademyPlatformLearningBenchmarks(): AcademyPlatformLearningBenchmarks {
  return {
    avgCompletedCoursesPerActiveClient: 2.4,
    platformEngagementIndex: 71,
    shareClientsWithAtLeastOneCompletion: 38,
    totalClientsInLearningRanking: 12_400,
  };
}

/** Персональная активность и место в общем рейтинге (мок, согласовано с enrollments). */
export interface ClientAcademyLearningActivity {
  activityScore: number;
  rankAmongClients: number;
  totalClientsRanked: number;
  /** Доля клиентов, у которых активность ниже (0–99): для формулировки «лучше, чем у X%» */
  betterThanClientsPercent: number;
  completedCourses: number;
  inProgressCourses: number;
}

export function getClientAcademyLearningActivity(
  enrollments: PlatformEnrollment[]
): ClientAcademyLearningActivity {
  const completedCourses = enrollments.filter((e) => e.status === 'completed').length;
  const inProgressCourses = enrollments.filter((e) => e.status === 'in_progress').length;
  const avgProgress =
    enrollments.length > 0
      ? enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
      : 0;
  const activityScore = Math.round(
    Math.min(100, completedCourses * 22 + inProgressCourses * 9 + avgProgress * 0.12)
  );
  const totalClientsRanked = getAcademyPlatformLearningBenchmarks().totalClientsInLearningRanking;
  const rankAmongClients = Math.max(
    1,
    Math.min(
      totalClientsRanked,
      Math.round(totalClientsRanked * (1 - activityScore / 100) * 0.35 + completedCourses * 40 + 120)
    )
  );
  const worseOrEqualPct = Math.ceil((rankAmongClients / totalClientsRanked) * 100);
  const betterThanClientsPercent = Math.max(0, Math.min(99, 100 - worseOrEqualPct));
  return {
    activityScore,
    rankAmongClients,
    totalClientsRanked,
    betterThanClientsPercent,
    completedCourses,
    inProgressCourses,
  };
}

export function getLearningPathById(id: string): LearningPath | undefined {
  return mockLearningPaths.find((p) => p.id === id);
}

export function getPlatformArticleById(id: string): KnowledgeArticle | undefined {
  return mockArticles.find((a) => a.id === id);
}

export function getArticleBySlug(slug: string): KnowledgeArticle | undefined {
  return mockArticles.find((a) => a.slug === slug);
}

/** Практические кейсы для закрепления (академия ЛК клиента) */
export interface AcademyDeskTask {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  points: number;
}

export const mockAcademyDeskTasks: AcademyDeskTask[] = [
  {
    id: 'task-1',
    title: 'Расчёт маржинальности SS25',
    type: 'Экономика',
    difficulty: 'Middle',
    points: 150,
  },
  {
    id: 'task-2',
    title: 'Оптимизация tech-pack для AI',
    type: 'Производство',
    difficulty: 'Senior',
    points: 300,
  },
  {
    id: 'task-3',
    title: 'Кейс: логистика в условиях кризиса',
    type: 'Менеджмент',
    difficulty: 'Pro',
    points: 500,
  },
];

/** Прогресс команды по обучению (мок для блока «Обучение команды») */
export interface TeamLearningMemberRow {
  name: string;
  role: string;
  progress: number;
  course: string;
  status: 'In Progress' | 'Completed';
  nextDeadline: string;
}

export const mockTeamLearningMembers: TeamLearningMemberRow[] = [
  {
    name: 'Дмитрий Соколов',
    role: 'Менеджер закупок',
    progress: 65,
    course: 'B2B Fashion Economics',
    status: 'In Progress',
    nextDeadline: '12 фев',
  },
  {
    name: 'Анна Павлова',
    role: 'Дизайнер',
    progress: 100,
    course: 'AI in Fashion Design',
    status: 'Completed',
    nextDeadline: '—',
  },
  {
    name: 'Иван Сергеев',
    role: 'Аналитик',
    progress: 12,
    course: 'Strategic Brand Building',
    status: 'In Progress',
    nextDeadline: '15 фев',
  },
];

export const mockAssessments: Assessment[] = [
  {
    id: 'assess-1',
    title: 'Сертификация по метрикам B2B ритейла',
    description:
      'Проверьте свои знания в области GMROI, оборачиваемости запасов и процента продаж.',
    courseId: 'course-1',
    targetRoles: ['shop', 'brand'],
    category: 'economics',
    passingScore: 80,
    timeLimitMinutes: 20,
    questions: [
      {
        id: 'q1',
        text: 'Что означает аббревиатура GMROI?',
        type: 'single_choice',
        options: [
          'Gross Margin Return on Investment',
          'General Market Return on Inventory',
          'Global Management Retail Output Index',
        ],
        correctAnswer: 'Gross Margin Return on Investment',
      },
      {
        id: 'q2',
        text: 'Уровень продаж (sell-through) в 70% за первый месяц считается:',
        type: 'single_choice',
        options: ['Низким', 'Средним', 'Отличным'],
        correctAnswer: 'Отличным',
      },
    ],
  },
  {
    id: 'assess-2',
    title: 'Тест на знание AI в дизайне',
    description:
      'Оцените свои навыки в 3D-моделировании и использовании генеративного AI для дизайна текстиля.',
    courseId: 'course-2',
    targetRoles: ['brand', 'manufacturer'],
    category: 'design',
    passingScore: 75,
    questions: [
      {
        id: 'q1',
        text: 'Какой формат файлов является стандартным для экспорта 3D-одежды?',
        type: 'single_choice',
        options: ['.obj', '.glB', '.fbx', 'Все вышеперечисленное'],
        correctAnswer: 'Все вышеперечисленное',
      },
    ],
  },
  {
    id: 'assess-arch-1',
    title: 'Архив: тест по маркдауну закупок v1',
    description: 'Снят с публикации; оставлен для просмотра результатов прошлых потоков.',
    courseId: 'course-1',
    targetRoles: ['shop'],
    category: 'economics',
    passingScore: 70,
    timeLimitMinutes: 15,
    archived: true,
    questions: [
      {
        id: 'q1',
        text: 'MOQ — это:',
        type: 'single_choice',
        options: ['Минимальный заказ', 'Максимальный остаток', 'Срок годности'],
        correctAnswer: 'Минимальный заказ',
      },
    ],
  },
  {
    id: 'assess-arch-2',
    title: 'Архив: вводный тест по визуальному мерчандайзингу',
    description: 'Устаревшая версия; актуальные вопросы — в текущих аттестациях.',
    courseId: 'course-4',
    targetRoles: ['shop'],
    category: 'retail',
    passingScore: 60,
    timeLimitMinutes: 10,
    archived: true,
    questions: [
      {
        id: 'q1',
        text: 'Тепловая карта магазина показывает:',
        type: 'single_choice',
        options: ['Трафик покупателей', 'Только склад', 'Только витрину'],
        correctAnswer: 'Трафик покупателей',
      },
    ],
  },
];
