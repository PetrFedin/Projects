/**
 * HTTP-адаптер под тот же контракт, что LocalStorageProductionDataPort.
 * Тело sku-flow: `CollectionSkuFlowDoc` (в т.ч. `productionProfileId` для пресета графа).
 * Ожидаемые пути (пример, согласовать с бэкендом):
 *   GET/PUT  {baseUrl}/sku-flow/:collectionKey
 *   GET/PUT  {baseUrl}/tech-pack/:styleId
 *   GET/PUT  {baseUrl}/tasks
 *   GET/PUT  {baseUrl}/floor-tabs/:scope
 */

import type { CollectionSkuFlowDoc } from '@/lib/production/unified-sku-flow-store';
import type {
  BrandTaskRecord,
  FloorTabScope,
  ProductionDataPort,
  TechPackDraftV1,
} from './port';

export type HttpProductionDataPortOptions = {
  baseUrl: string;
  getToken?: () => string | null;
};

export class HttpProductionDataPort implements ProductionDataPort {
  constructor(private readonly opts: HttpProductionDataPortOptions) {}

  private headers(): HeadersInit {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    const t = this.opts.getToken?.();
    if (t) h.Authorization = `Bearer ${t}`;
    return h;
  }

  private url(path: string): string {
    const base = this.opts.baseUrl.replace(/\/$/, '');
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  }

  async getSkuFlow(collectionKey: string): Promise<CollectionSkuFlowDoc> {
    const r = await fetch(this.url(`/sku-flow/${encodeURIComponent(collectionKey)}`), {
      headers: this.headers(),
    });
    if (r.status === 404) return { v: 1, skus: {} };
    if (!r.ok) throw new Error(`getSkuFlow: ${r.status}`);
    return r.json() as Promise<CollectionSkuFlowDoc>;
  }

  async saveSkuFlow(collectionKey: string, doc: CollectionSkuFlowDoc): Promise<void> {
    const r = await fetch(this.url(`/sku-flow/${encodeURIComponent(collectionKey)}`), {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(doc),
    });
    if (!r.ok) throw new Error(`saveSkuFlow: ${r.status}`);
  }

  async getTechPackDraft(styleId: string): Promise<TechPackDraftV1 | null> {
    const r = await fetch(this.url(`/tech-pack/${encodeURIComponent(styleId)}`), { headers: this.headers() });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`getTechPackDraft: ${r.status}`);
    return r.json() as Promise<TechPackDraftV1>;
  }

  async saveTechPackDraft(draft: TechPackDraftV1): Promise<void> {
    const r = await fetch(this.url(`/tech-pack/${encodeURIComponent(draft.styleId)}`), {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(draft),
    });
    if (!r.ok) throw new Error(`saveTechPackDraft: ${r.status}`);
  }

  async listTasks(): Promise<BrandTaskRecord[]> {
    const r = await fetch(this.url('/tasks'), { headers: this.headers() });
    if (!r.ok) throw new Error(`listTasks: ${r.status}`);
    return r.json() as Promise<BrandTaskRecord[]>;
  }

  async saveTasks(tasks: BrandTaskRecord[]): Promise<void> {
    const r = await fetch(this.url('/tasks'), {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(tasks),
    });
    if (!r.ok) throw new Error(`saveTasks: ${r.status}`);
  }

  async getFloorTabDraft(scope: FloorTabScope): Promise<unknown | null> {
    const r = await fetch(this.url(`/floor-tabs/${encodeURIComponent(scope)}`), { headers: this.headers() });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`getFloorTabDraft: ${r.status}`);
    return r.json() as Promise<unknown>;
  }

  async saveFloorTabDraft(scope: FloorTabScope, payload: unknown): Promise<void> {
    const r = await fetch(this.url(`/floor-tabs/${encodeURIComponent(scope)}`), {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error(`saveFloorTabDraft: ${r.status}`);
  }
}
