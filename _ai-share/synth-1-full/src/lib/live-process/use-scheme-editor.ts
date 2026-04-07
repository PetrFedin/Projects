'use client';

import { useState, useCallback } from 'react';
import type { LiveProcessDefinition, LiveProcessStageDef } from './types';

function generateStageId(): string {
  return `stage-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useSchemeEditor(initialDefinition: LiveProcessDefinition | null) {
  const [definition, setDefinition] = useState<LiveProcessDefinition | null>(initialDefinition);

  const addStage = useCallback((afterIndex?: number) => {
    const newStage: LiveProcessStageDef = {
      id: generateStageId(),
      title: 'Новый этап',
      description: '',
      area: 'Производство',
      mandatory: true,
      dependsOn: [],
      order: 0,
    };
    setDefinition((prev) => {
      if (!prev) return prev;
      const stages = [...prev.stages];
      const insertAt = afterIndex !== undefined ? afterIndex + 1 : stages.length;
      newStage.order = insertAt;
      stages.forEach((s, i) => {
        if (i >= insertAt) (s as LiveProcessStageDef).order = (s.order ?? i) + 1;
      });
      stages.splice(insertAt, 0, newStage);
      return { ...prev, stages };
    });
    return newStage.id;
  }, []);

  const removeStage = useCallback((stageId: string) => {
    setDefinition((prev) => {
      if (!prev) return prev;
      const stages = prev.stages.filter((s) => s.id !== stageId);
      stages.forEach((s, i) => {
        (s as LiveProcessStageDef).dependsOn = (s.dependsOn ?? []).filter((id) => id !== stageId);
        (s as LiveProcessStageDef).order = i;
      });
      return { ...prev, stages };
    });
  }, []);

  const renameStage = useCallback((stageId: string, title: string, description?: string) => {
    setDefinition((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        stages: prev.stages.map((s) =>
          s.id === stageId ? { ...s, title, ...(description !== undefined && { description }) } : s
        ),
      };
    });
  }, []);

  const reorderStages = useCallback((fromIndex: number, toIndex: number) => {
    setDefinition((prev) => {
      if (!prev) return prev;
      const stages = [...prev.stages];
      const [moved] = stages.splice(fromIndex, 1);
      stages.splice(toIndex, 0, moved);
      stages.forEach((s, i) => {
        (s as LiveProcessStageDef).order = i;
      });
      return { ...prev, stages };
    });
  }, []);

  const updateStage = useCallback((stageId: string, patch: Partial<LiveProcessStageDef>) => {
    setDefinition((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        stages: prev.stages.map((s) => (s.id === stageId ? { ...s, ...patch } : s)),
      };
    });
  }, []);

  const loadTemplate = useCallback((template: LiveProcessDefinition, preserveProcessId?: string) => {
    setDefinition({
      ...template,
      id: preserveProcessId ?? template.id + '-custom',
      meta: { ...template.meta, isTemplate: false },
      stages: template.stages.map((s, i) => ({ ...s, order: i })),
    });
  }, []);

  const createFromScratch = useCallback((name: string, contextKey?: string) => {
    setDefinition({
      id: `process-${Date.now()}`,
      name,
      description: '',
      contextKey,
      stages: [],
      meta: { isTemplate: false },
    });
  }, []);

  return {
    definition,
    setDefinition,
    addStage,
    removeStage,
    renameStage,
    reorderStages,
    updateStage,
    loadTemplate,
    createFromScratch,
  };
}
