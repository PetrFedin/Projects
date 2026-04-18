import type { Product } from '@/lib/types';
import type { SyndicatedContentV1, ContentChannelV1 } from './types';

/** Генерирует адаптированные тексты под разные каналы (демо AI-копирайтинга). */
export function generateSyndicatedContent(product: Product): SyndicatedContentV1[] {
  const channels: ContentChannelV1[] = ['wb', 'ozon', 'lamoda', 'instagram'];

  return channels.map((channel) => {
    let title = product.name;
    let description = product.description;
    let tone: SyndicatedContentV1['tone'] = 'technical';
    const keyFeatures = [product.material || 'Premium fabric', 'True to size fit'];

    if (channel === 'wb') {
      title = `[SALE] ${product.name} для женщин и девушек`;
      description = `Базовая модель. ${product.description}. Отлично подходит для подарка.`;
      tone = 'professional';
    } else if (channel === 'instagram') {
      title = `Must-have of the season! ✨`;
      description = `New drop alert! ❤️ ${product.name} is finally here. Swipe to see details. #fashion #newin`;
      tone = 'emotional';
    } else if (channel === 'ozon') {
      tone = 'technical';
      keyFeatures.push('Быстрая доставка', 'Гарантия качества');
    }

    return { channel, title, description, keyFeatures, tone };
  });
}

export const CHANNEL_LABELS: Record<ContentChannelV1, string> = {
  wb: 'Wildberries',
  ozon: 'Ozon',
  lamoda: 'Lamoda',
  shopify: 'Own Store (Shopify)',
  instagram: 'Social (Instagram)',
};
