/**
 * Данные академии бренда: база знаний, обучение по коллекциям, материалы для клиентов.
 */

export interface BrandKnowledgeArticle {
  id: string;
  title: string;
  excerpt: string;
  category: 'brand' | 'industry' | 'process' | 'faq';
  /** Для кого: team, partners, clients */
  audience: ('team' | 'partners' | 'clients')[];
  updatedAt: string;
  tags: string[];
}

export interface CollectionTraining {
  id: string;
  collectionId: string;
  collectionName: string;
  season: string;
  /** Для магазинов: product knowledge, merchandising, sales scripts */
  type: 'product' | 'merchandising' | 'sales' | 'full';
  title: string;
  description: string;
  duration: string;
  modules: number;
  /** Доступно партнёрам, купившим коллекцию */
  forStores: boolean;
}

export interface ClientMaterial {
  id: string;
  collectionId?: string;
  title: string;
  type: 'care' | 'styling' | 'intro' | 'lookbook';
  description: string;
  /** Ссылка на контент */
  url?: string;
}

export interface BrandCourse {
  id: string;
  title: string;
  description: string;
  modules: number;
  duration: string;
  status: 'completed' | 'in_progress' | 'not_started';
  progress: number;
  curriculum?: string[];
}

const BRAND_COURSES: BrandCourse[] = [
  { id: 'bc-1', title: 'ДНК бренда Syntha', description: 'Философия, история и идентичность бренда.', modules: 5, duration: '~1 ч', status: 'completed', progress: 100, curriculum: ['История бренда', 'Ценности и миссия', 'Визуальная идентичность', 'Тон коммуникации', 'Тест'] },
  { id: 'bc-2', title: 'Продуктовая линейка FW26', description: 'Ключевые модели, материалы и USP коллекции.', modules: 8, duration: '~2 ч', status: 'in_progress', progress: 45, curriculum: ['Обзор коллекции', 'Ключевые силуэты', 'Материалы и крой', 'Мерчандайзинг', 'Скрипты продаж', 'Практика', 'Тест 1', 'Тест 2'] },
  { id: 'bc-3', title: 'Процессы B2B и согласование заказов', description: 'MOQ, логистика, работа с заказами.', modules: 6, duration: '~1.5 ч', status: 'not_started', progress: 0, curriculum: ['Введение в B2B', 'Минимальные заказы', 'Логистика и сроки', 'Согласование и подтверждение', 'Типичные ошибки', 'Тест'] },
];

const STORAGE_KEY_KNOWLEDGE = 'brand_academy_knowledge_v1';
const STORAGE_KEY_COLLECTION = 'brand_academy_collection_training_v1';
const STORAGE_KEY_CLIENT = 'brand_academy_client_materials_v1';

const DEFAULT_KNOWLEDGE: BrandKnowledgeArticle[] = [
  { id: 'k1', title: 'О бренде Syntha', excerpt: 'Философия, история, ДНК бренда. Что важно знать партнёрам.', category: 'brand', audience: ['partners', 'clients'], updatedAt: '2026-03-01', tags: ['бренд', 'история'] },
  { id: 'k2', title: 'Устойчивое производство: наши стандарты', excerpt: 'Эко-материалы, сертификаты, ESG-подход.', category: 'industry', audience: ['partners'], updatedAt: '2026-02-28', tags: ['ESG', 'устойчивость'] },
  { id: 'k3', title: 'Как мы работаем с заказами B2B', excerpt: 'Сроки, MOQ, логистика, согласование.', category: 'process', audience: ['partners'], updatedAt: '2026-02-25', tags: ['B2B', 'заказы'] },
  { id: 'k4', title: 'Частые вопросы покупателей', excerpt: 'Размеры, уход, возвраты.', category: 'faq', audience: ['clients'], updatedAt: '2026-02-20', tags: ['FAQ'] },
];

const DEFAULT_COLLECTION_TRAINING: CollectionTraining[] = [
  { id: 'ct1', collectionId: 'fw26', collectionName: 'FW26 Main', season: 'FW26', type: 'full', title: 'Коллекция FW26: полное обучение', description: 'Product knowledge, мерчандайзинг, скрипты продаж.', duration: '2 ч', modules: 6, forStores: true },
  { id: 'ct2', collectionId: 'fw26', collectionName: 'FW26 Main', season: 'FW26', type: 'product', title: 'Ключевые модели FW26', description: 'Материалы, крой, USP каждой модели.', duration: '45 мин', modules: 3, forStores: true },
  { id: 'ct3', collectionId: 'ss26', collectionName: 'SS26 Pre-collection', season: 'SS26', type: 'merchandising', title: 'Мерчандайзинг SS26', description: 'Выкладка, зонирование, витрины.', duration: '30 мин', modules: 2, forStores: true },
];

const DEFAULT_CLIENT_MATERIALS: ClientMaterial[] = [
  { id: 'cm1', collectionId: 'fw26', title: 'Уход за изделиями FW26', type: 'care', description: 'Стирка, хранение, ремонт.' },
  { id: 'cm2', collectionId: 'fw26', title: 'Как сочетать FW26', type: 'styling', description: 'Идеи образов и комбинаций.' },
  { id: 'cm3', title: 'О коллекции FW26', type: 'intro', description: 'Концепция, вдохновение, ключевые силуэты.' },
];

function loadKnowledge(): BrandKnowledgeArticle[] {
  if (typeof window === 'undefined') return DEFAULT_KNOWLEDGE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_KNOWLEDGE);
    return raw ? JSON.parse(raw) : DEFAULT_KNOWLEDGE;
  } catch {
    return DEFAULT_KNOWLEDGE;
  }
}

function loadCollectionTraining(): CollectionTraining[] {
  if (typeof window === 'undefined') return DEFAULT_COLLECTION_TRAINING;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COLLECTION);
    return raw ? JSON.parse(raw) : DEFAULT_COLLECTION_TRAINING;
  } catch {
    return DEFAULT_COLLECTION_TRAINING;
  }
}

function loadClientMaterials(): ClientMaterial[] {
  if (typeof window === 'undefined') return DEFAULT_CLIENT_MATERIALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLIENT);
    return raw ? JSON.parse(raw) : DEFAULT_CLIENT_MATERIALS;
  } catch {
    return DEFAULT_CLIENT_MATERIALS;
  }
}

export function getBrandKnowledgeArticles(audience?: 'team' | 'partners' | 'clients'): BrandKnowledgeArticle[] {
  const all = loadKnowledge();
  if (!audience) return all;
  return all.filter((a) => a.audience.includes(audience));
}

export function getCollectionTrainings(collectionId?: string): CollectionTraining[] {
  const all = loadCollectionTraining();
  if (!collectionId) return all;
  return all.filter((t) => t.collectionId === collectionId);
}

export function getClientMaterials(collectionId?: string): ClientMaterial[] {
  const all = loadClientMaterials();
  if (!collectionId) return all;
  return all.filter((m) => !m.collectionId || m.collectionId === collectionId);
}

export function addKnowledgeArticle(article: Omit<BrandKnowledgeArticle, 'id'>): BrandKnowledgeArticle {
  const all = loadKnowledge();
  const newArt: BrandKnowledgeArticle = {
    ...article,
    id: `k-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
  all.unshift(newArt);
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY_KNOWLEDGE, JSON.stringify(all));
  return newArt;
}

export function addCollectionTraining(training: Omit<CollectionTraining, 'id'>): CollectionTraining {
  const all = loadCollectionTraining();
  const newT: CollectionTraining = {
    ...training,
    id: `ct-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
  all.push(newT);
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY_COLLECTION, JSON.stringify(all));
  return newT;
}

export function addClientMaterial(material: Omit<ClientMaterial, 'id'>): ClientMaterial {
  const all = loadClientMaterials();
  const newM: ClientMaterial = {
    ...material,
    id: `cm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
  all.push(newM);
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY_CLIENT, JSON.stringify(all));
  return newM;
}

export function getKnowledgeArticle(id: string): BrandKnowledgeArticle | undefined {
  return loadKnowledge().find((a) => a.id === id);
}

export function getBrandCourses(): BrandCourse[] {
  return BRAND_COURSES;
}

export function getBrandCourseById(id: string): BrandCourse | undefined {
  return BRAND_COURSES.find((c) => c.id === id);
}

export function getCollectionTrainingById(id: string): CollectionTraining | undefined {
  return loadCollectionTraining().find((t) => t.id === id);
}

export function getClientMaterialById(id: string): ClientMaterial | undefined {
  return loadClientMaterials().find((m) => m.id === id);
}

export const COLLECTION_TRAINING_TYPE_LABELS: Record<string, string> = {
  product: 'Product knowledge',
  merchandising: 'Мерчандайзинг',
  sales: 'Скрипты продаж',
  full: 'Полное обучение',
};

export const KNOWLEDGE_CATEGORY_LABELS: Record<string, string> = {
  brand: 'О бренде',
  industry: 'Индустрия',
  process: 'Процессы',
  faq: 'FAQ',
};
