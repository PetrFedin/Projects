'use client';

import React from 'react';
import { Check, UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Participant } from '@/lib/types/calendar';
import type { UserRole } from '@/lib/types';
import { partnerTeams } from '@/components/team/_fixtures/team-data';
import { organizations } from '@/components/team/_fixtures/team-data';

interface ParticipantPickerProps {
  participants: Participant[];
  onChange: (participants: Participant[]) => void;
  currentUserId: string;
  currentOrgId?: string;
  disabled?: boolean;
}

/** Список участников из команды и связанных организаций */
function getAvailableParticipants(currentOrgId?: string): { uid: string; name: string; role: UserRole }[] {
  const list: { uid: string; name: string; role: UserRole }[] = [];
  const added = new Set<string>();
  const orgIds = currentOrgId ? [currentOrgId] : Object.keys(partnerTeams);
  for (const orgId of orgIds) {
    const team = partnerTeams[orgId];
    if (!team) continue;
    const org = organizations[orgId];
    const role = (org?.type as UserRole) || 'brand';
    for (const m of team) {
      if (added.has(m.id)) continue;
      added.add(m.id);
      list.push({
        uid: m.id,
        name: `${m.firstName} ${m.lastName}`.trim() || m.nickname,
        role,
      });
    }
  }
  if (list.length === 0) {
    // Fallback: все команды
    for (const [orgId, team] of Object.entries(partnerTeams)) {
      const org = organizations[orgId];
      const role = (org?.type as UserRole) || 'brand';
      for (const m of team) {
        if (added.has(m.id)) continue;
        added.add(m.id);
        list.push({ uid: m.id, name: `${m.firstName} ${m.lastName}`.trim() || m.nickname, role });
      }
    }
  }
  return list;
}

export function ParticipantPicker({
  participants,
  onChange,
  currentUserId,
  currentOrgId,
  disabled,
}: ParticipantPickerProps) {
  const available = React.useMemo(
    () => getAvailableParticipants(currentOrgId),
    [currentOrgId]
  );
  const selectedIds = new Set(participants.map((p) => p.uid));

  const toggle = (uid: string, name: string, role: UserRole) => {
    if (selectedIds.has(uid)) {
      onChange(participants.filter((p) => p.uid !== uid));
    } else {
      onChange([
        ...participants,
        { uid, name, role, status: 'pending' as const },
      ]);
    }
  };

  const remove = (uid: string) => {
    onChange(participants.filter((p) => p.uid !== uid));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {participants.map((p) => (
          <Badge
            key={p.uid}
            variant="secondary"
            className="gap-1 pr-1 text-xs"
          >
            {p.name}
            {p.status === 'pending' && (
              <span className="text-[10px] text-amber-600">(приглашён)</span>
            )}
            {!disabled && (
              <button
                type="button"
                onClick={() => remove(p.uid)}
                className="rounded p-0.5 hover:bg-slate-300"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </Badge>
        ))}
      </div>
      {!disabled && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <UserPlus className="h-3.5 w-3.5" />
              Добавить участников
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <ScrollArea className="h-48">
              <div className="p-2 space-y-0.5">
                {available.map((a) => (
                  <button
                    key={a.uid}
                    type="button"
                    onClick={() => toggle(a.uid, a.name, a.role)}
                    className={cn(
                      'w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                      selectedIds.has(a.uid)
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'hover:bg-slate-50'
                    )}
                  >
                    {selectedIds.has(a.uid) ? (
                      <Check className="h-4 w-4 shrink-0 text-indigo-600" />
                    ) : (
                      <span className="w-4" />
                    )}
                    <span className="truncate">{a.name}</span>
                    <span className="text-[10px] text-slate-400 ml-auto">{a.role}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
