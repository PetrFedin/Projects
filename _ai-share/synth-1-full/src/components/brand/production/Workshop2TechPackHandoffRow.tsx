'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type {
  Workshop2Phase1TechPackAttachment,
  Workshop2TechPackFactoryHandoff,
  Workshop2TechPackHandoffStatus,
} from '@/lib/production/workshop2-dossier-phase1.types';
import { W2_TZ_HINT_PRODUCTION_EDIT } from '@/lib/production/workshop2-tz-rbac-hints';

function HandoffDisabledWrap({
  disabled,
  hint,
  children,
}: {
  disabled: boolean;
  hint: string | null;
  children: React.ReactNode;
}) {
  if (!disabled || !hint) return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex max-w-full">{children}</span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[280px] text-xs leading-snug">
        {hint}
      </TooltipContent>
    </Tooltip>
  );
}

export function Workshop2TechPackHandoffRow({
  row,
  attachments,
  statuses,
  onStatus,
  onSaveFactoryComment,
  tzWriteDisabled,
}: {
  row: Workshop2TechPackFactoryHandoff;
  attachments: Workshop2Phase1TechPackAttachment[];
  statuses: { id: Workshop2TechPackHandoffStatus; label: string }[];
  onStatus: (hid: string, s: Workshop2TechPackHandoffStatus) => void;
  onSaveFactoryComment: (hid: string, c: string, by: string) => void;
  tzWriteDisabled: boolean;
}) {
  const [c, setC] = useState(row.factoryComment ?? '');
  const [by, setBy] = useState(row.factoryResponseBy ?? '');
  const names = row.attachmentIds
    .map((id) => attachments.find((a) => a.attachmentId === id)?.fileName)
    .filter(Boolean);
  return (
    <li className="bg-bg-surface2/80 rounded border p-2 text-[10px]">
      <div className="text-text-primary font-medium">
        {row.packageRevisionLabel} · {row.channel}{' '}
        <span className="text-text-secondary">({row.status})</span>
      </div>
      <p className="text-text-secondary mt-0.5">{names.join(', ') || '—'}</p>
      {row.brandDispatchedAt && row.brandDispatchedBy ? (
        <p className="text-text-secondary mt-1 text-[10px]">
          Бренд передал: {new Date(row.brandDispatchedAt).toLocaleString('ru-RU')} ·{' '}
          {row.brandDispatchedBy}
        </p>
      ) : null}
      {row.factoryReceivedAt && row.factoryReceivedBy ? (
        <p className="text-text-secondary text-[10px]">
          Производство приняло: {new Date(row.factoryReceivedAt).toLocaleString('ru-RU')} ·{' '}
          {row.factoryReceivedBy}
        </p>
      ) : null}
      {row.verifiedTechPackAuditAtSend && row.verifiedTechPackAuditAtSend.length > 0 ? (
        <p className="text-text-muted mt-1 font-mono text-[9px] leading-snug">
          Канон на момент передачи (S3 / complete):{' '}
          {row.verifiedTechPackAuditAtSend
            .map((x) => x.remoteObjectKey || x.attachmentId)
            .join(' · ')}
        </p>
      ) : null}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <HandoffDisabledWrap
          disabled={tzWriteDisabled}
          hint={tzWriteDisabled ? W2_TZ_HINT_PRODUCTION_EDIT : null}
        >
          <Select
            value={row.status}
            onValueChange={(v) => onStatus(row.handoffId, v as Workshop2TechPackHandoffStatus)}
            disabled={tzWriteDisabled}
          >
            <SelectTrigger className="h-8 w-[220px] text-[10px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s.id} value={s.id} className="text-[10px]">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </HandoffDisabledWrap>
      </div>
      <div className="mt-2 space-y-1">
        <Label className="text-[10px]">Ответ фабрики</Label>
        <Textarea
          className="min-h-[48px] text-[10px]"
          value={c}
          onChange={(e) => setC(e.target.value)}
          disabled={tzWriteDisabled}
        />
        <Input
          className="h-8 text-[10px]"
          placeholder="Подпись (имя, роль)"
          value={by}
          onChange={(e) => setBy(e.target.value)}
          disabled={tzWriteDisabled}
        />
        <HandoffDisabledWrap
          disabled={tzWriteDisabled}
          hint={tzWriteDisabled ? W2_TZ_HINT_PRODUCTION_EDIT : null}
        >
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="h-8 text-[10px]"
            disabled={tzWriteDisabled}
            onClick={() => onSaveFactoryComment(row.handoffId, c, by)}
          >
            Сохранить ответ
          </Button>
        </HandoffDisabledWrap>
      </div>
    </li>
  );
}
