'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Plus, Layers } from 'lucide-react';
import { getContextsByType, getInstancesForProcess } from '@/lib/live-process/mock-contexts';

interface ProcessContextSelectorProps {
  processId: string;
  contextKey?: string;
  contextId: string;
  onContextChange: (contextId: string) => void;
}

export function ProcessContextSelector({
  processId,
  contextKey,
  contextId,
  onContextChange,
}: ProcessContextSelectorProps) {
  const instances = getInstancesForProcess(processId);
  const contexts = getContextsByType(contextKey);

  const currentContext =
    instances.find((i) => i.contextId === contextId)?.context ??
    contexts.find((c) => c.id === contextId);

  const displayLabel = currentContext
    ? currentContext.label
    : contextId
      ? `Контекст: ${contextId}`
      : 'Выберите контекст';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="min-w-[200px] justify-between">
          <span className="truncate">{displayLabel}</span>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>Параллельные инстансы</DropdownMenuLabel>
        {instances.map((inst) => (
          <DropdownMenuItem key={inst.id} onClick={() => onContextChange(inst.contextId)}>
<<<<<<< HEAD
            <Layers className="mr-2 h-4 w-4 text-slate-400" />
=======
            <Layers className="text-text-muted mr-2 h-4 w-4" />
>>>>>>> recover/cabinet-wip-from-stash
            {inst.context.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Выбрать контекст</DropdownMenuLabel>
        {contexts.map((ctx) => (
          <DropdownMenuItem key={ctx.id} onClick={() => onContextChange(ctx.id)}>
            {ctx.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <Plus className="mr-2 h-4 w-4" />
          Создать новый инстанс (скоро)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
