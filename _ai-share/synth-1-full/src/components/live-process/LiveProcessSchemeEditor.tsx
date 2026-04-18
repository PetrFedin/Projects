'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Plus, Trash2, Pencil, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useSchemeEditor } from '@/lib/live-process/use-scheme-editor';
import {
  PROCESS_TEMPLATES,
  INDUSTRY_LABELS,
  BUSINESS_TYPE_LABELS,
  getTemplateById,
} from '@/lib/live-process/process-templates';
import { getLiveProcessDefinition } from '@/lib/live-process/process-definitions';
import type { LiveProcessDefinition, LiveProcessStageDef } from '@/lib/live-process/types';

interface LiveProcessSchemeEditorProps {
  processId: string;
  onSave?: (definition: LiveProcessDefinition) => void;
  readOnly?: boolean;
  /** При загрузке шаблона сохранить текущий processId */
  preserveProcessIdOnTemplate?: boolean;
}

export function LiveProcessSchemeEditor({
  processId,
  onSave,
  readOnly = false,
  preserveProcessIdOnTemplate = true,
}: LiveProcessSchemeEditorProps) {
  const initialDef = getLiveProcessDefinition(processId);
  const {
    definition,
    setDefinition,
    addStage,
    removeStage,
    renameStage,
    reorderStages,
    loadTemplate,
  } = useSchemeEditor(initialDef);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const stages = definition?.stages ?? [];

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (readOnly) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = draggedIndex;
    setDraggedIndex(null);
    if (fromIndex === null || fromIndex === toIndex) return;
    reorderStages(fromIndex, toIndex);
  };

  const handleRename = (stageId: string) => {
    const stage = stages.find((s) => s.id === stageId);
    if (!stage) return;
    setEditTitle(stage.title);
    setEditingStageId(stageId);
  };

  const confirmRename = () => {
    if (editingStageId) {
      renameStage(editingStageId, editTitle);
      setEditingStageId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Библиотека шаблонов */}
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-sm font-bold">Библиотека шаблонов</h3>
          <p className="text-xs text-slate-500">
            Готовые схемы по индустриям: Fast Fashion, Luxury, Made-to-Order, QC с ветвлениями
          </p>
        </CardHeader>
        <CardContent>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={readOnly}>
                Загрузить шаблон
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>По индустрии</DropdownMenuLabel>
              {PROCESS_TEMPLATES.map((t) => (
                <DropdownMenuItem
                  key={t.id}
                  onClick={() =>
                    loadTemplate(t.definition, preserveProcessIdOnTemplate ? processId : undefined)
                  }
                >
                  {INDUSTRY_LABELS[t.industry]} → {BUSINESS_TYPE_LABELS[t.businessType]}
                  <span className="ml-1 text-[10px] text-slate-400">
                    ({t.definition.stages.length} этапов)
                  </span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Специальные</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  const t = getTemplateById('qc-with-branches');
                  if (t) loadTemplate(t, preserveProcessIdOnTemplate ? processId : undefined);
                }}
              >
                QC с ветвлениями (провал → исправление)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      {/* Редактор этапов */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Этапы схемы</h3>
            {!readOnly && (
              <Button size="sm" onClick={() => addStage()} disabled={!definition}>
                <Plus className="mr-1 h-4 w-4" />
                Добавить этап
              </Button>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Перетаскивайте для изменения порядка. Редактирование без деплоя.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stages.map((stage, index) => (
              <div
                key={stage.id}
                draggable={!readOnly}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={() => setDraggedIndex(null)}
                className={`flex items-center gap-2 rounded-lg border bg-white p-2 ${
                  draggedIndex === index ? 'opacity-50' : ''
                } ${!readOnly ? 'cursor-move' : ''}`}
              >
                {!readOnly && <GripVertical className="h-4 w-4 shrink-0 text-slate-400" />}
                <div className="min-w-0 flex-1">
                  {editingStageId === stage.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={confirmRename}
                        onKeyDown={(e) => e.key === 'Enter' && confirmRename()}
                        className="h-8 flex-1 rounded border border-slate-200 px-2 text-sm"
                        autoFocus
                      />
                      <Button size="sm" variant="ghost" onClick={confirmRename}>
                        OK
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-400">#{index + 1}</span>
                      <span className="truncate text-sm font-medium">{stage.title}</span>
                      {stage.mandatory && (
                        <span className="rounded bg-amber-100 px-1 text-[10px] text-amber-700">
                          обяз.
                        </span>
                      )}
                      {stage.sla?.maxDays && (
                        <span className="text-[10px] text-slate-500">
                          SLA: {stage.sla.maxDays} дн.
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {!readOnly && (
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleRename(stage.id)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-600"
                      onClick={() => removeStage(stage.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
            {stages.length === 0 && (
              <p className="py-4 text-center text-sm text-slate-500">
                Нет этапов. Добавьте этап или загрузите шаблон.
              </p>
            )}
          </div>
          {!readOnly && definition && onSave && (
            <Button className="mt-4" onClick={() => onSave(definition)}>
              Сохранить схему
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
