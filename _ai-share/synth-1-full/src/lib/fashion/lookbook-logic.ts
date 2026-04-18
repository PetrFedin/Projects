import type { LookbookProjectV1 } from './types';

const STORAGE_KEY = 'synth.lookbookProjects.v1';

export function loadLookbookProjects(): LookbookProjectV1[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw)
      : [
          {
            id: 'proj-01',
            title: 'SS26 Early Concept',
            skus: [],
            status: 'draft',
            updatedAt: Date.now(),
          },
          {
            id: 'proj-02',
            title: 'Holiday Capsule 25',
            skus: [],
            status: 'published',
            updatedAt: Date.now() - 86400000,
          },
        ];
  } catch {
    return [];
  }
}

export function saveLookbookProjects(projects: LookbookProjectV1[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function addSkuToProject(projectId: string, sku: string): LookbookProjectV1[] {
  const all = loadLookbookProjects();
  const next = all.map((p) => {
    if (p.id === projectId && !p.skus.includes(sku)) {
      return { ...p, skus: [...p.skus, sku], updatedAt: Date.now() };
    }
    return p;
  });
  saveLookbookProjects(next);
  return next;
}
