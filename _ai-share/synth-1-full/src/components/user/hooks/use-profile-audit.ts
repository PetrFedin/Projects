'use client';

import { useState, useCallback } from 'react';

export interface AuditEvent {
  id: string;
  message: string;
  section?: string;
  ts: number;
}

export function useProfileAudit() {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);

  const appendAudit = useCallback((message: string, section?: string) => {
    setAuditEvents((prev) => [
      {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        message,
        section,
        ts: Date.now(),
      },
      ...prev,
    ].slice(0, 50));
  }, []);

  return { auditEvents, appendAudit };
}

export default useProfileAudit;
