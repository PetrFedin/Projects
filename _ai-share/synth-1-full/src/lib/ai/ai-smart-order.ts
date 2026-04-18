/**
 * OroCommerce: AI SmartOrder — создание черновика заказа из PDF или email PO.
 * Загрузка файла / вставка текста → AI извлекает позиции (стиль, размер, qty) → черновик.
 */

export interface SmartOrderParsedLine {
  style?: string;
  sku?: string;
  color?: string;
  size?: string;
  quantity: number;
  price?: number;
  /** Уверенность парсера 0–1 */
  confidence?: number;
}

export interface SmartOrderParseResult {
  success: boolean;
  lines: SmartOrderParsedLine[];
  /** Исходный текст/мета из PDF или email */
  sourceType: 'pdf' | 'email';
  rawPreview?: string;
  warnings?: string[];
}

/** Демо: имитация парсинга. В проде — вызов API OCR + LLM или специализированного парсера PO. */
export function parseOrderFromText(
  text: string,
  sourceType: 'pdf' | 'email'
): SmartOrderParseResult {
  const lines: SmartOrderParsedLine[] = [];
  const warnings: string[] = [];
  // Простая эвристика по строкам с числами (qty)
  const rowRegex = /(\w+[-]?\d*)\s+(\d+)\s+([\d.,]+)?/gi;
  let m;
  let count = 0;
  while ((m = rowRegex.exec(text)) !== null && count < 50) {
    const style = m[1].trim();
    const qty = parseInt(m[2], 10);
    const price = m[3] ? parseFloat(m[3].replace(',', '.')) : undefined;
    if (style && qty > 0) {
      lines.push({ style, sku: style, quantity: qty, price, confidence: 0.9 });
      count++;
    }
  }
  if (lines.length === 0) {
    // Fallback: одна демо-строка
    lines.push({ style: 'DEMO-001', sku: 'DEMO-001', quantity: 10, confidence: 0.5 });
    warnings.push('Точный разбор не удался. Проверьте черновик.');
  }
  return {
    success: lines.length > 0,
    lines,
    sourceType,
    rawPreview: text.slice(0, 500),
    warnings: warnings.length ? warnings : undefined,
  };
}
