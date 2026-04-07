import type { RFIDScanSessionV1 } from './types';

/** Интерфейс для RFID сканирования в торговых залах. */
export function getLatestRFIDScan(locationId: string): RFIDScanSessionV1 {
  return {
    id: `RFID-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    scannedCount: 1245,
    discrepancyCount: 3,
    locationId,
    status: 'synced',
  };
}
