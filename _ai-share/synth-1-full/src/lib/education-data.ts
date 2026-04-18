import { EducationCourse, LearningPath, KnowledgeArticle, AcademyEvent, Assessment } from './types';

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
    category: 'economics',
    provider: 'Syntha Academy',
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
    category: 'design',
    provider: 'Syntha Academy',
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
      'Как управлять международной логистикой, таможней и этичным сорсингом в современном мире моды.',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800',
    duration: '18 часов',
    level: 'pro',
    targetRoles: ['distributor', 'supplier', 'manufacturer'],
    category: 'management',
    provider: 'External',
    rating: 4.7,
    studentsCount: 2100,
    curriculum: ['Трансграничная логистика', 'Сорсинг из СНГ и Китая', 'ESG соответствие'],
  },
  {
    id: 'course-4',
    title: 'Психология ритейла и визуальный мерчандайзинг',
    description:
      'Узнайте, как повысить конверсию офлайн-магазина через научный подход к планировке и сенсорный брендинг.',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800',
    duration: '10 часов',
    level: 'beginner',
    targetRoles: ['shop'],
    category: 'retail',
    provider: 'Partner',
    rating: 4.6,
    studentsCount: 3400,
    curriculum: ['Тепловые карты магазина', 'Психология цвета', 'Освещение для сегмента Luxury'],
  },
  {
    id: 'course-5',
    title: 'Стратегическое построение бренда',
    description:
      'Мастер-класс для основателей о том, как создать идентичность бренда, которая масштабируется глобально.',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800',
    duration: '30 часов',
    level: 'intermediate',
    targetRoles: ['brand'],
    category: 'management',
    provider: 'Syntha Academy',
    rating: 5.0,
    studentsCount: 560,
    isRecommended: true,
    curriculum: ['ДНК бренда', 'Маркетинговые воронки', 'Финансовое планирование для основателей'],
  },
];

export const mockArticles: KnowledgeArticle[] = [
  {
    id: 'art-1',
    title: 'Понимание GMROI в современном ритейле',
    slug: 'understanding-gmroi',
    category: 'Economics',
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
    category: 'Legal',
    excerpt:
      'Новые правила, требующие наличия цифровых паспортов для всех текстильных изделий, продаваемых в ЕС.',
    content: 'Анализ новой правовой базы ЕС по цифровым паспортам продукции...',
    authorName: 'Юридический департамент',
    updatedAt: '2026-02-01T14:30:00Z',
    tags: ['Комплаенс', 'Устойчивое развитие', 'ЕС'],
    relatedIds: ['art-1'],
  },
];

export const mockAcademyEvents: AcademyEvent[] = [
  {
    id: 'event-1',
    title: 'Прогноз рынка SS26: Прямой эфир',
    description:
      'Присоединяйтесь к нашим ведущим аналитикам для живого разбора прогнозируемых паттернов спроса на следующий сезон.',
    type: 'webinar',
    startTime: '2026-02-15T15:00:00Z',
    endTime: '2026-02-15T16:30:00Z',
    hostName: 'Команда аналитики Syntha',
    status: 'upcoming',
  },
  {
    id: 'event-2',
    title: 'Воркшоп: Внедрение цифровых паспортов',
    description:
      'Практическая сессия по созданию и отслеживанию паспортов продукции с помощью Syntha OS.',
    type: 'workshop',
    startTime: '2026-02-18T11:00:00Z',
    endTime: '2026-02-18T13:00:00Z',
    hostName: 'Макс Волков (Product)',
    status: 'upcoming',
    relatedId: 'art-2',
  },
];

export const mockLearningPaths: LearningPath[] = [
  {
    id: 'path-1',
    title: 'Сертифицированный B2B менеджер',
    description:
      'Полный трек для освоения оптовых операций, синхронизации запасов и управления отношениями с партнерами.',
    courses: ['course-1', 'course-3'],
    totalDuration: '30 часов',
    outcome: 'Сертификация: Syntha B2B Professional',
  },
  {
    id: 'path-2',
    title: 'Директор по цифровому дизайну',
    description: 'От классического дизайна до процессов устойчивого производства на базе AI.',
    courses: ['course-2', 'course-5'],
    totalDuration: '54 часа',
    outcome: 'Сертификация: Syntha Creative Strategist',
  },
];

export function getCourseById(id: string): EducationCourse | undefined {
  return mockCourses.find((c) => c.id === id);
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
];

export function getMyPlatformEnrollments(): PlatformEnrollment[] {
  return MOCK_MY_PLATFORM_ENROLLMENTS;
}

export function getLearningPathById(id: string): LearningPath | undefined {
  return mockLearningPaths.find((p) => p.id === id);
}

export function getPlatformArticleById(id: string): KnowledgeArticle | undefined {
  return mockArticles.find((a) => a.id === id);
}

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
];
