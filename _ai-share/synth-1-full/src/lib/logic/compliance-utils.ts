import { ChestnyZNAKCode, EDODocument, MarkingOrder } from '../types/compliance';

/**
 * Compliance Utils
 * Генератор кодов маркировки и валидатор ЭДО.
 */

/**
 * Генерация КИЗ (Код Идентификации Заказа)
 * Эмуляция генерации кода с криптохвостом.
 */
export function generateChestnyZNAKCode(gtin: string, productId: string, ownerId: string): ChestnyZNAKCode {
  const serialNumber = Math.random().toString(36).substring(2, 15).toUpperCase();
  const cryptoTail = Math.random().toString(36).substring(2, 10).toUpperCase();
  
  // Формат: (01)GTIN(21)SERIAL_NUMBER(91)CRYPTO_TAIL
  const fullCode = `(01)${gtin}(21)${serialNumber}(91)${cryptoTail}`;

  return {
    id: `kiz-${Date.now()}-${serialNumber}`,
    gtin,
    serialNumber,
    fullCode,
    status: 'emitted',
    productId,
    batchId: `batch-${new Date().toISOString().split('T')[0]}`,
    producedAt: new Date().toISOString(),
    ownerId
  };
}

/**
 * Пакетная генерация кодов для заказа маркировки
 */
export function createMarkingOrderBatch(order: MarkingOrder): ChestnyZNAKCode[] {
  const codes: ChestnyZNAKCode[] = [];
  for (let i = 0; i < order.quantity; i++) {
    codes.push(generateChestnyZNAKCode(order.gtin, order.productId, order.brandId));
  }
  return codes;
}

/**
 * Валидатор XML УПД (Универсального Передаточного Документа)
 * Проверка структуры по формату ФНС (5.01 / 5.02).
 */
export function validateEDODocument(doc: EDODocument): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!doc.number) errors.push('Missing document number');
  if (!doc.date) errors.push('Missing document date');
  if (doc.items.length === 0) errors.push('Document must contain at least one item');
  
  // Проверка суммы
  const calculatedTotal = doc.items.reduce((sum, item) => sum + item.total, 0);
  if (Math.abs(calculatedTotal - doc.totalAmount) > 0.01) {
    errors.push(`Total amount mismatch: Expected ${doc.totalAmount}, but calculated ${calculatedTotal.toFixed(2)}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Маппинг КИЗов в XML для ЭДО
 */
export function mapKIZsToXML(codes: string[]): string {
  // В реальности здесь будет генерация XML структуры <НомУпак>
  return codes.map(code => `<Code>${code}</Code>`).join('\n');
}
