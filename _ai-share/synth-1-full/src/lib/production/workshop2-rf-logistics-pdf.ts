/**
 * Wave 10: PDF ТТН/УПД (jsPDF) — отдельный модуль для API/runtime (не в unit bundle шаблона).
 */
import { jsPDF } from 'jspdf';
import type { Workshop2RfLogisticsDocTemplate } from '@/lib/production/workshop2-rf-logistics-docs';
import { formatWorkshop2RubCurrency } from '@/lib/production/workshop2-rub-currency';

/** Генерирует PDF-байты (ArrayBuffer) для скачивания — не пустая заглушка. */
export function buildWorkshop2RfLogisticsPdfBytes(
  template: Workshop2RfLogisticsDocTemplate
): ArrayBuffer {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  let y = 14;
  const line = (text: string, size = 10) => {
    doc.setFontSize(size);
    doc.text(text.slice(0, 96), 14, y);
    y += size * 0.45 + 2;
  };
  line(template.titleRu, 14);
  line(`Коллекция: ${template.collectionId} · Артикул: ${template.articleId}`, 9);
  line(`Дата: ${template.generatedAt.slice(0, 10)}`, 9);
  if (template.linkedMovementId) {
    line(`Отгрузка: ${template.linkedMovementId}`, 9);
  }
  line(`Продавец: ${template.seller.name}, ИНН ${template.seller.inn}`, 9);
  line(`Покупатель: ${template.buyer.name}, ИНН ${template.buyer.inn}`, 9);
  y += 2;
  line('Позиции:', 10);
  for (const row of template.lines.slice(0, 12)) {
    const price = row.priceRub != null ? formatWorkshop2RubCurrency(row.priceRub) : '—';
    line(`· ${row.name} — ${row.qty} ${row.unit}, ${price}`, 9);
  }
  line(`Итого: ${formatWorkshop2RubCurrency(template.totalRub)} · НДС ${template.vatRatePct}%`, 10);
  line(template.noteRu, 8);
  return doc.output('arraybuffer') as ArrayBuffer;
}
