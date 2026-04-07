'use client';

import { useCallback, useEffect, useState } from 'react';
import type { LiveProcessStageRuntime } from './types';
import { getLiveProcessDefinition } from './process-definitions';

const STORAGE_PREFIX = 'live_process_runtime_v1';

function buildInitialRuntimes(stageIds: string[]): Record<string, LiveProcessStageRuntime> {
  const out: Record<string, LiveProcessStageRuntime> = {};
  stageIds.forEach((id) => {
    out[id] = {
      stageId: id,
      status: 'not_started',
      assigneeIds: [],
      primaryAssigneeId: null,
      blockedMemberIds: [],
      plannedStartAt: null,
      plannedEndAt: null,
      calendarEventId: null,
      chatId: null,
      participantIds: [],
      comments: [],
      tasks: [],
      note: null,
    };
  });
  return out;
}

export function useLiveProcessRuntime(processId: string, contextId: string) {
  const definition = getLiveProcessDefinition(processId);
  const stageIds = definition?.stages.map((s) => s.id) ?? [];
  const storageKey = `${STORAGE_PREFIX}__${processId}__${contextId || 'default'}`;

  const [runtimes, setRuntimes] = useState<Record<string, LiveProcessStageRuntime>>(() =>
    buildInitialRuntimes(stageIds)
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !stageIds.length) return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, LiveProcessStageRuntime>;
        const merged = { ...buildInitialRuntimes(stageIds) };
        stageIds.forEach((id) => {
          if (parsed[id]) {
            const p = parsed[id];
            // Миграция: assigneeId -> assigneeIds
            const assigneeIds = Array.isArray(p.assigneeIds)
              ? p.assigneeIds
              : p.assigneeId
                ? [p.assigneeId]
                : [];
            const primaryAssigneeId = p.primaryAssigneeId && assigneeIds.includes(p.primaryAssigneeId)
              ? p.primaryAssigneeId
              : assigneeIds[0] ?? null;
            merged[id] = {
              ...merged[id],
              ...p,
              stageId: id,
              assigneeIds,
              primaryAssigneeId: primaryAssigneeId ?? p.primaryAssigneeId ?? null,
              comments: p.comments ?? merged[id].comments,
              tasks: p.tasks ?? merged[id].tasks,
            };
          }
        });
        setRuntimes(merged);
      }
    } catch {
      // ignore
    }
  }, [storageKey, processId, contextId, stageIds.length]);

  useEffect(() => {
    if (typeof window === 'undefined' || !stageIds.length) return;
    window.localStorage.setItem(storageKey, JSON.stringify(runtimes));
    window.dispatchEvent(new CustomEvent('live-process-runtime-updated'));
  }, [runtimes, storageKey, stageIds.length]);

  const updateStageRuntime = useCallback(
    (stageId: string, patch: Partial<LiveProcessStageRuntime>) => {
      setRuntimes((prev) => {
        const current = prev[stageId];
        if (!current) return prev;
        return {
          ...prev,
          [stageId]: { ...current, ...patch },
        };
      });
    },
    []
  );

  return { runtimes, updateStageRuntime };
}
