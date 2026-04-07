/**
 * WizCommerce: AI-изображения каталога — генерация фото для каталога без съёмки.
 * Ввод: артикул / референс / описание → генерация lifestyle или flat-lay для каталога.
 */

export type CatalogImageType = 'lifestyle' | 'flat_lay' | 'white_background' | 'model';

export interface CatalogImageGenRequest {
  productId?: string;
  sku?: string;
  productName?: string;
  /** Текстовый промпт для стиля/окружения */
  prompt?: string;
  imageType: CatalogImageType;
}

export interface CatalogImageGenResult {
  success: boolean;
  /** URL сгенерированного изображения (демо — заглушка) */
  imageUrl?: string;
  jobId?: string;
  /** В проде: статус очереди (pending / processing / done) */
  status: 'done' | 'processing' | 'failed';
  message?: string;
}

const IMAGE_TYPE_LABELS: Record<CatalogImageType, string> = {
  lifestyle: 'Lifestyle (в интерьере)',
  flat_lay: 'Flat-lay (сверху)',
  white_background: 'Белый фон',
  model: 'На модели',
};

export function getCatalogImageTypeLabel(t: CatalogImageType): string {
  return IMAGE_TYPE_LABELS[t] ?? t;
}

/**
 * Демо: задержка + Unsplash. В проде: задайте `NEXT_PUBLIC_CATALOG_IMAGE_GEN_URL` — POST JSON
 * `{ prompt, imageType, sku? }`, ответ `{ imageUrl?: string, jobId?: string, status, message? }`.
 */
export async function requestCatalogImageGeneration(request: CatalogImageGenRequest): Promise<CatalogImageGenResult> {
  const endpoint =
    typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_CATALOG_IMAGE_GEN_URL?.trim() : undefined;
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      const data = (await res.json()) as Partial<CatalogImageGenResult>;
      if (!res.ok) {
        return {
          success: false,
          status: 'failed',
          message: data.message ?? `HTTP ${res.status}`,
        };
      }
      return {
        success: Boolean(data.success ?? data.imageUrl),
        imageUrl: data.imageUrl,
        jobId: data.jobId,
        status: data.status ?? 'done',
        message: data.message,
      };
    } catch (e) {
      return {
        success: false,
        status: 'failed',
        message: e instanceof Error ? e.message : 'Сеть',
      };
    }
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800',
        jobId: `img-${Date.now()}`,
        status: 'done',
        message: 'Демо: изображение-заглушка. Задайте NEXT_PUBLIC_CATALOG_IMAGE_GEN_URL для своего API.',
      });
    }, 1500);
  });
}
