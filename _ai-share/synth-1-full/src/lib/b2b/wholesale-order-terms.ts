/**
 * Оптовые условия заказа (окна поставки, MOQ) — product-facing re-exports.
 */
export {
  JOOR_DELIVERY_WINDOWS as WHOLESALE_DELIVERY_WINDOWS,
  JOOR_MOQ_BY_PRODUCT as WHOLESALE_MOQ_BY_PRODUCT,
  getMoqForProduct as getWholesaleMoqForProduct,
} from '@/lib/b2b/joor-constants';
