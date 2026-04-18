import type { SessionParticipantV1 } from './types';

/** Управление участниками сессии шоурума. */
export function getSessionParticipants(appointmentId: string): SessionParticipantV1[] {
  return [
    {
      id: 'U-001',
      name: 'Elena (Lead Buyer)',
      role: 'Buyer',
      isOnline: true,
      lastAction: 'Added SKU-101',
    },
    {
      id: 'U-002',
      name: 'Dmitry (Regional Mgr)',
      role: 'Merchandiser',
      isOnline: true,
      lastAction: 'Viewed LOOK-01',
    },
    {
      id: 'U-003',
      name: 'Brand Admin',
      role: 'Brand Manager',
      isOnline: true,
      lastAction: 'Presenter',
    },
    { id: 'U-004', name: 'Anna (Store Mgr)', role: 'Buyer', isOnline: false },
  ];
}
