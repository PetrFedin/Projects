import type { Product } from '@/lib/types';
import type { WholesalePreOrderV1 } from './types';

/** Инфраструктура для управления B2B предзаказами (Wholesale). */
export function getWholesalePreOrderInfo(product: Product): WholesalePreOrderV1 {
  const basePrice = product.price;
  
  // Эвристика для оптовых цен на основе розничной цены
  const tiers = [
    { minQty: 50, price: Math.round(basePrice * 0.7) },   // -30%
    { minQty: 100, price: Math.round(basePrice * 0.6) },  // -40%
    { minQty: 500, price: Math.round(basePrice * 0.5) },  // -50%
  ];

  // Динамическое окно предзаказа (начинается сегодня, длится 60 дней)
  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + 60);

  const isSoldOut = product.sku.length % 7 === 0; // Демо-условие

  return {
    productId: product.id,
    moq: 50,
    tierPrices: tiers,
    preOrderWindow: {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    },
    allocationStatus: isSoldOut ? 'sold_out' : (product.price > 10000 ? 'limited' : 'open'),
  };
}
