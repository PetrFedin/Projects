import type { ShowroomSessionV1 } from './types';

/** Инфраструктура для активной сессии в шоуруме. */
export function getActiveSession(sessionId: string): ShowroomSessionV1 | null {
  // Demo: return a session linked to the first appointment
  return {
    id: sessionId,
    appointmentId: 'SH-2026-01',
    activeSkus: ['SKU-101', 'SKU-102', 'SKU-103'],
    orderDraft: [
      { sku: 'SKU-101', quantity: 50 },
      { sku: 'SKU-102', quantity: 120 },
    ],
    lastInteraction: new Date().toISOString(),
  };
}

export function saveSessionState(session: ShowroomSessionV1) {
  // In real app: persistence logic
  console.log('Session saved:', session);
}
