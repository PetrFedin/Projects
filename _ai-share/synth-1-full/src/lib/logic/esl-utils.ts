import { ESLDevice, ESLSyncLog } from '../types/retail';

/**
 * ESL Management Logic
 */

export const MOCK_ESL_DEVICES: ESLDevice[] = [
  { id: 'ESL-001', sku: 'BL-SLK-M', productName: 'Silk Satin Blouse', currentPrice: 125, currency: 'USD', batteryLevel: 82, signalStrength: 95, lastSync: '2026-03-07T10:00:00Z', status: 'online', location: 'Showroom A' },
  { id: 'ESL-002', sku: 'TRS-WOL-M', productName: 'Wool Trousers', currentPrice: 185, promoPrice: 165, currency: 'USD', batteryLevel: 14, signalStrength: 42, lastSync: '2026-03-07T09:45:00Z', status: 'online', location: 'Showroom A' },
  { id: 'ESL-003', sku: 'ACC-BELT-01', productName: 'Leather Belt', currentPrice: 45, currency: 'USD', batteryLevel: 98, signalStrength: 88, lastSync: '2026-03-06T18:20:00Z', status: 'offline', location: 'Accessories Wall' },
];

export async function pushPriceUpdate(deviceId: string, newPrice: number): Promise<ESLSyncLog> {
  // Simulate API call to ESL gateway
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const success = Math.random() > 0.1; // 90% success rate
  
  return {
    id: `LOG-${Date.now()}`,
    deviceId,
    timestamp: new Date().toISOString(),
    action: 'price_update',
    status: success ? 'success' : 'failed',
    details: success ? `Price updated to ${newPrice}` : 'Connection timeout with ESL Gateway'
  };
}

export function getBatteryStatus(level: number): 'critical' | 'low' | 'normal' | 'full' {
  if (level < 15) return 'critical';
  if (level < 30) return 'low';
  if (level < 80) return 'normal';
  return 'full';
}
