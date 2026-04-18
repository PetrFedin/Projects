/**
 * Colect: коллекции как «проекты» — лукбук + права (кто видит, до какой даты), watermarked PDF, заказ из лукбука.
 * Демо: только бренды Syntha Lab и Nordic Wool; партнёры — id из `partner-territory-map` (retail_msk_*).
 */

export type LookbookVisibility = 'all' | 'invited';

export interface LookbookProject {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  /** Ссылка на лукбук (или оригинальный PDF) */
  lookbookUrl: string;
  /** Ссылка на PDF с водяным знаком (мок: может совпадать с lookbookUrl) */
  watermarkedPdfUrl?: string;
  /** Кто видит: все партнёры или только приглашённые */
  visibility: LookbookVisibility;
  /** ID партнёров, которым доступен (при visibility === 'invited') */
  invitedPartnerIds: string[];
  /** До какой даты виден (ISO) */
  visibleUntil: string;
  createdAt: string;
  collectionId?: string;
  /** Сезон для виртуального шоурума (FW26, SS26 и т.д.) */
  season?: string;
}

const STORAGE_KEY = 'b2b_lookbook_projects';

const SEED: LookbookProject[] = [
  {
    id: 'lb-fw26-1',
    name: 'FW26 Lookbook',
    brandId: 'brand_syntha_lab',
    brandName: 'Syntha Lab',
    lookbookUrl: '/lookbooks/fw26.pdf',
    watermarkedPdfUrl: '/lookbooks/fw26-watermarked.pdf',
    visibility: 'invited',
    invitedPartnerIds: ['retail_msk_1', 'retail_msk_2'],
    visibleUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    collectionId: 'fw26',
    season: 'FW26',
  },
  {
    id: 'lb-ss26-1',
    name: 'SS26 Early Bird',
    brandId: 'brand_syntha_lab',
    brandName: 'Syntha Lab',
    lookbookUrl: '/lookbooks/ss26.pdf',
    visibility: 'all',
    season: 'SS26',
    invitedPartnerIds: [],
    visibleUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'lb-nw-fw26',
    name: 'Nordic Wool FW26',
    brandId: 'brand_nordic_wool',
    brandName: 'Nordic Wool',
    lookbookUrl: '/lookbooks/nw-fw26.pdf',
    watermarkedPdfUrl: '/lookbooks/nw-fw26-watermarked.pdf',
    visibility: 'invited',
    invitedPartnerIds: ['retail_msk_1'],
    visibleUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    collectionId: 'nw-fw26',
    season: 'FW26',
  },
];

function load(): LookbookProject[] {
  if (typeof window === 'undefined') return SEED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    return JSON.parse(raw);
  } catch {
    return SEED;
  }
}

function save(projects: LookbookProject[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function getLookbookProjects(brandId?: string): LookbookProject[] {
  const all = load();
  if (brandId) return all.filter((p) => p.brandId === brandId);
  return all;
}

/** Для байера: проекты, которые он может видеть (по invited или all) и которые ещё не истекли. */
export function getVisibleLookbooksForPartner(
  partnerId: string,
  brandId?: string
): LookbookProject[] {
  const now = new Date().toISOString();
  return getLookbookProjects(brandId).filter((p) => {
    if (p.visibleUntil < now) return false;
    if (p.visibility === 'all') return true;
    return p.invitedPartnerIds.includes(partnerId);
  });
}

export function addLookbookProject(
  project: Omit<LookbookProject, 'id' | 'createdAt'>
): LookbookProject {
  const projects = load();
  const newProject: LookbookProject = {
    ...project,
    id: `lb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  projects.push(newProject);
  save(projects);
  return newProject;
}

export function updateLookbookProject(
  id: string,
  patch: Partial<LookbookProject>
): LookbookProject | null {
  const projects = load();
  const i = projects.findIndex((p) => p.id === id);
  if (i === -1) return null;
  projects[i] = { ...projects[i], ...patch };
  save(projects);
  return projects[i];
}

/** Мок: «скачать PDF с водяным знаком» — возвращает URL (в проде — генерация на бэке). */
export function getWatermarkedPdfUrl(projectId: string): string {
  const projects = load();
  const p = projects.find((x) => x.id === projectId);
  return p?.watermarkedPdfUrl ?? p?.lookbookUrl ?? '#';
}
