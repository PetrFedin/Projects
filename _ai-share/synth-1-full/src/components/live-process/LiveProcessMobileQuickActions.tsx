'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, CheckCircle2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { LiveProcessStageDef, LiveProcessStageRuntime, StageStatus } from '@/lib/live-process/types';

interface LiveProcessMobileQuickActionsProps {
  stages: LiveProcessStageDef[];
  runtimes: Record<string, LiveProcessStageRuntime>;
  onStatusChange: (stageId: string, status: StageStatus) => void;
  onOpenChat?: (stageId: string) => void;
}

export function LiveProcessMobileQuickActions({
  stages,
  runtimes,
  onStatusChange,
  onOpenChat,
}: LiveProcessMobileQuickActionsProps) {
  const currentStage = useMemo(() => {
    const doneIds = new Set(stages.filter((s) => runtimes[s.id]?.status === 'done').map((s) => s.id));
    const inProgress = stages.find((s) => runtimes[s.id]?.status === 'in_progress');
    if (inProgress) return inProgress;
    return stages.find((s) => {
      const deps = s.dependsOn;
      return runtimes[s.id]?.status === 'not_started' && deps.every((d) => doneIds.has(d));
    });
  }, [stages, runtimes]);

  if (!currentStage) return null;
  const runtime = runtimes[currentStage.id];
  const status = runtime?.status ?? 'not_started';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex sm:hidden items-center justify-center gap-2 border-t bg-white/95 backdrop-blur px-4 py-3 safe-area-pb">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex-1 max-w-[200px]">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            {currentStage.title}: {status === 'done' ? 'Готово' : status === 'in_progress' ? 'В работе' : 'Не начато'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="top" className="w-48">
          <DropdownMenuItem
            onClick={() => onStatusChange(currentStage.id, 'not_started')}
            disabled={status === 'not_started'}
          >
            Не начато
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onStatusChange(currentStage.id, 'in_progress')}
            disabled={status === 'in_progress'}
          >
            В работе
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onStatusChange(currentStage.id, 'done')}
            disabled={status === 'done'}
          >
            Готово
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {onOpenChat && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenChat(currentStage.id)}
          className="shrink-0"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
