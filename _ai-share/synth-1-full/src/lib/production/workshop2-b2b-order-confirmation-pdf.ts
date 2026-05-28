/**
 * Wave 22: PDF подтверждение B2B-заказа (RU template, jsPDF).
 */
import { jsPDF } from 'jspdf';
import type { Workshop2B2bOrderRecord } from '@/lib/production/workshop2-b2b-order-lifecycle';
import { workshop2B2bOrderStatusLabelRu } from '@/lib/production/workshop2-b2b-order-lifecycle';
import { workshop2B2bPaymentTermsLabelRu } from '@/lib/production/workshop2-b2b-wave22-parity';
import { formatWorkshop2RubCurrency } from '@/lib/production/workshop2-rub-currency';

export function buildWorkshop2B2bOrderConfirmationPdfBytes(
  order: Workshop2B2bOrderRecord
): ArrayBuffer {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  let y = 14;
  const line = (text: string, size = 10) => {
    doc.setFontSize(size);
    doc.text(text.slice(0, 96), 14, y);
    y += size * 0.45 + 2;
  };
  line('Подтверждение B2B-заказа', 14);
  line(`№ ${order.id} · ${workshop2B2bOrderStatusLabelRu(order.status)}`, 10);
  if (order.collectionId) line(`Коллекция: ${order.collectionId}`, 9);
  if (order.requestedDeliveryDate) {
    line(`Желаемая отгрузка: ${order.requestedDeliveryDate.slice(0, 10)}`, 9);
  }
  const termsLabel = workshop2B2bPaymentTermsLabelRu(order.paymentTermsRu);
  line(`Условия оплаты: ${termsLabel}`, 9);
  if (order.paymentTermsDays != null && order.paymentTermsDays > 0) {
    line(`Отсрочка: ${order.paymentTermsDays} дн.`, 9);
  }
  y += 2;
  line('Позиции:', 10);
  for (const row of order.lines.slice(0, 14)) {
    line(
      `· ${row.articleId} ${row.colorCode}/${row.size} × ${row.qty} @ ${formatWorkshop2RubCurrency(row.wholesalePriceRub)}`,
      8
    );
  }
  line(`Итого: ${formatWorkshop2RubCurrency(order.totalRub)}`, 11);
  line(`Обновлено: ${order.updatedAt.slice(0, 19)}`, 8);
  return doc.output('arraybuffer') as ArrayBuffer;
}
