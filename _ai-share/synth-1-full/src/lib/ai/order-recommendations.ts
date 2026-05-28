/**
 * WizCommerce / RepSpark: AI-рекомендации по заказам — рекомендации и аномалии.
 * «Часто заказывают вместе», «Добавьте к заказу», «Аномалия: нестандартное qty по размеру».
 */

export type RecommendationType =
  | 'add_to_order'
  | 'often_bought_together'
  | 'anomaly'
  | 'trend'
  | 'restock';

export interface OrderRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  /** SKU или productId для добавления в заказ */
  productId?: string;
  sku?: string;
  productName?: string;
  /** Предлагаемое qty */
  suggestedQty?: number;
  /** Для аномалий: по какой позиции */
  relatedLineId?: string;
  /** Важность 1–5 */
  priority?: number;
  createdAt: string;
}

export interface OrderAnomaly {
  id: string;
  type: 'qty_deviation' | 'size_skew' | 'missing_category' | 'price_outlier';
  title: string;
  description: string;
  orderId?: string;
  lineId?: string;
  severity: 'low' | 'medium' | 'high';
  suggestedAction?: string;
}

/** Демо: рекомендации для текущего заказа/черновика */
export function getMockOrderRecommendations(orderLineCount: number): OrderRecommendation[] {
  const recs: OrderRecommendation[] = [];
  recs.push({
    id: 'rec1',
    type: 'often_bought_together',
    title: 'Часто заказывают вместе',
    description: 'К этому заказу часто добавляют базовую футболку SS26.',
    productId: 'prod-ss26-tee',
    sku: 'SS26-TEE-WHT',
    productName: 'Футболка базовая SS26',
    suggestedQty: 20,
    priority: 4,
    createdAt: new Date().toISOString(),
  });
  if (orderLineCount < 5) {
    recs.push({
      id: 'rec2',
      type: 'add_to_order',
      title: 'Дополните заказ',
      description:
        'Рекомендуем добавить аксессуары из той же коллекции для увеличения среднего чека.',
      priority: 3,
      createdAt: new Date().toISOString(),
    });
  }
  return recs;
}

/** Демо: аномалии по заказу */
export function getMockOrderAnomalies(): OrderAnomaly[] {
  return [
    {
      id: 'an1',
      type: 'size_skew',
      title: 'Перекос по размеру M',
      description: 'Количество по размеру M на 40% выше среднего по сегменту. Проверьте прогноз.',
      severity: 'medium',
      suggestedAction: 'Сравнить с продажами прошлого сезона',
    },
    {
      id: 'an2',
      type: 'qty_deviation',
      title: 'Минимальный заказ',
      description:
        'По позиции FW26-JKT-01 общее qty ниже MOQ (24). Добавьте 4 шт. для соблюдения MOQ.',
      lineId: 'line-1',
      severity: 'high',
      suggestedAction: 'Увеличить qty до 24 или объединить с другим цветом',
    },
  ];
}
