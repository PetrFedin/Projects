'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, X, AlertTriangle, UserX, Clock } from 'lucide-react';
import { MOCK_REMINDERS } from '@/lib/live-process/mock-metrics';
import type { ProcessReminder } from '@/lib/live-process/types';

interface LiveProcessRemindersProps {
  processId?: string;
  contextId?: string;
}

const REMINDER_ICONS: Record<ProcessReminder['type'], typeof AlertTriangle> = {
  overdue: Clock,
  no_assignee: UserX,
  approval_pending: AlertTriangle,
  sla_at_risk: AlertTriangle,
};

const REMINDER_LABELS: Record<ProcessReminder['type'], string> = {
  overdue: 'Просрочено',
  no_assignee: 'Нет ответственного',
  approval_pending: 'На согласовании',
  sla_at_risk: 'SLA под угрозой',
};

export function LiveProcessReminders({ processId, contextId }: LiveProcessRemindersProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const reminders = MOCK_REMINDERS.filter(
    (r) => !dismissed.has(r.id) && (!processId || r.processId === processId) && (!contextId || r.contextId === contextId)
  );

  if (reminders.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <h3 className="text-sm font-bold">Напоминания</h3>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {reminders.map((r) => {
            const Icon = REMINDER_ICONS[r.type];
            return (
              <li
                key={r.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-100"
              >
                <Icon className="h-4 w-4 text-amber-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-amber-700 font-medium">
                    {REMINDER_LABELS[r.type]}
                  </p>
                  <p className="text-xs text-slate-700">{r.message}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => setDismissed((prev) => new Set(prev).add(r.id))}
                >
                  <X className="h-3 w-3" />
                </Button>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
