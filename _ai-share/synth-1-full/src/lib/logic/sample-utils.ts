import { CollectionSample, SampleMovement, SampleStatus } from '../types/samples';

/**
 * Sample Control Utils
 * Логика перемещения образцов и QR/RFID симуляция.
 */

export function moveSample(
  sample: CollectionSample, 
  toLocation: string, 
  movedBy: string, 
  status: SampleStatus,
  note?: string
): { updatedSample: CollectionSample, movement: SampleMovement } {
  const movement: SampleMovement = {
    id: `MOV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    sampleId: sample.id,
    fromLocation: sample.currentLocation,
    toLocation,
    movedAt: new Date().toISOString(),
    movedBy,
    note,
    statusAfter: status
  };

  const updatedSample: CollectionSample = {
    ...sample,
    status,
    currentLocation: toLocation,
    lastSeenAt: movement.movedAt,
    history: [movement, ...sample.history]
  };

  return { updatedSample, movement };
}

/**
 * Проверка задержки возврата (Overdue)
 */
export function isSampleOverdue(sample: CollectionSample): boolean {
  if (!sample.expectedReturnAt || sample.status === 'in_stock') return false;
  return new Date(sample.expectedReturnAt) < new Date();
}

/**
 * Симуляция QR/RFID сканирования
 */
export function simulateSampleScan(id: string): string {
  // В реальности здесь был бы вызов к API RFID-считывателя или декодирование QR
  return `https://synth1.fashion/sample/${id}?scan=true`;
}
