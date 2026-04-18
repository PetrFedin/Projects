import type { RemotePresenceV1 } from './types';

/** Удаленное AR-присутствие байеров в шоуруме. */
export function getRemotePresence(sessionId: string): RemotePresenceV1[] {
  return [
    {
      participantId: 'P-001-Buyer',
      device: 'mobile',
      lastSeenPdpSection: 'Fabric Specs',
      isArActive: true,
      viewportX: 45,
      viewportY: 60,
    },
    {
      participantId: 'P-005-Designer',
      device: 'tablet',
      lastSeenPdpSection: 'Lookbook Mode',
      isArActive: false,
      viewportX: 10,
      viewportY: 20,
    },
  ];
}
