import type { Product } from '@/data/products.mock';
import type { AiStylistRepo, StylistRequest, StylistResponse } from './aiStylistRepo';
import type { LookItem } from './aiStylistRepo';

const serverOnlyMsg =
  'repo.aiStylist доступен только на сервере. Для клиента используйте POST /api/ai/stylist.';

export const aiStylistStub: AiStylistRepo = {
  async generateLooks(_req: StylistRequest): Promise<StylistResponse> {
    throw new Error(serverOnlyMsg);
  },
  async getProductDetails(_query: string): Promise<Product | null> {
    throw new Error(serverOnlyMsg);
  },
  async suggestProductsForLook(_image: string): Promise<LookItem[]> {
    throw new Error(serverOnlyMsg);
  },
};
