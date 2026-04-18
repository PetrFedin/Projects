import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage, TaskStatus, TaskPriority } from '@/lib/types';
import { DataTablePro } from '@/components/data/DataTable/DataTablePro';
import { statusConfig, priorityConfig } from './constants';

interface TaskHubProps {
  chatTasks: ChatMessage[];
  currentUser: string;
  onOpenCreateTask: () => void;
  onOpenEditTask: (m: ChatMessage) => void;
}

export const TaskHub: React.FC<TaskHubProps> = ({
  chatTasks,
  currentUser,
  onOpenCreateTask,
  onOpenEditTask,
}) => {
  const visibleTasks = React.useMemo(() => {
    return chatTasks.filter((t) => !t.isPrivate || t.user === currentUser);
  }, [chatTasks, currentUser]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mx-auto max-w-6xl space-y-4">
<<<<<<< HEAD
        <header className="flex items-end justify-between border-b border-zinc-100 pb-6">
          <div>
            <h2 className="text-sm font-black uppercase tracking-tighter">Operational Task Hub</h2>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
=======
        <header className="border-border-subtle flex items-end justify-between border-b pb-6">
          <div>
            <h2 className="text-sm font-black uppercase tracking-tighter">Operational Task Hub</h2>
            <p className="text-text-muted mt-1 text-[10px] font-bold uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
              Cross-Functional Project & Milestone Tracking
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
<<<<<<< HEAD
              className="h-9 rounded-none border-zinc-200 px-4 text-[9px] font-black uppercase tracking-widest"
=======
              className="border-border-default h-9 rounded-none px-4 text-[9px] font-black uppercase tracking-widest"
>>>>>>> recover/cabinet-wip-from-stash
            >
              <Download className="mr-2 h-3.5 w-3.5" /> EXPORT PORTFOLIO
            </Button>
            <Button
              size="sm"
              className="h-9 rounded-none bg-black px-6 text-[9px] font-black uppercase tracking-widest text-white"
              onClick={onOpenCreateTask}
            >
              <Plus className="mr-2 h-3.5 w-3.5" /> NEW OPERATIONAL TASK
            </Button>
          </div>
        </header>

        <DataTablePro
          columns={[
            {
              accessorKey: 'text',
              header: 'TASK DESCRIPTION',
              cell: ({ row }: any) => (
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'h-2 w-2 rounded-full',
                      statusConfig[row.original.status as TaskStatus]?.color.replace('text-', 'bg-')
                    )}
                  />
<<<<<<< HEAD
                  <span className="max-w-[300px] truncate font-black uppercase tracking-tighter text-zinc-900">
=======
                  <span className="text-text-primary max-w-[300px] truncate font-black uppercase tracking-tighter">
>>>>>>> recover/cabinet-wip-from-stash
                    {row.original.text}
                  </span>
                </div>
              ),
            },
            {
              accessorKey: 'priority',
              header: 'PRIORITY',
              cell: ({ row }: any) => (
                <Badge
                  variant="outline"
                  className={cn(
<<<<<<< HEAD
                    'h-5 rounded-none border-zinc-100 text-[8px] font-black uppercase',
=======
                    'border-border-subtle h-5 rounded-none text-[8px] font-black uppercase',
>>>>>>> recover/cabinet-wip-from-stash
                    priorityConfig[row.original.priority as TaskPriority].color
                  )}
                >
                  {row.original.priority}
                </Badge>
              ),
            },
            {
              accessorKey: 'deadline',
              header: 'DEADLINE',
              cell: ({ row }: any) => (
<<<<<<< HEAD
                <span className="font-black tabular-nums text-zinc-500">
=======
                <span className="text-text-secondary font-black tabular-nums">
>>>>>>> recover/cabinet-wip-from-stash
                  {row.original.deadline
                    ? new Date(row.original.deadline).toLocaleDateString()
                    : 'N/A'}
                </span>
              ),
            },
            {
              accessorKey: 'status',
              header: 'STATUS',
              cell: ({ row }: any) => (
<<<<<<< HEAD
                <span className="text-[10px] font-black uppercase italic text-zinc-400">
=======
                <span className="text-text-muted text-[10px] font-black uppercase italic">
>>>>>>> recover/cabinet-wip-from-stash
                  {statusConfig[row.original.status as TaskStatus]?.label}
                </span>
              ),
            },
            {
              id: 'actions',
              cell: ({ row }: any) => (
                <Button
                  variant="ghost"
                  size="sm"
<<<<<<< HEAD
                  className="h-7 rounded-none border border-zinc-100 px-3 text-[8px] font-black uppercase text-zinc-400 hover:border-black hover:text-black"
=======
                  className="border-border-subtle text-text-muted h-7 rounded-none border px-3 text-[8px] font-black uppercase hover:border-black hover:text-black"
>>>>>>> recover/cabinet-wip-from-stash
                  onClick={() => onOpenEditTask(row.original)}
                >
                  DETAILS
                </Button>
              ),
            },
          ]}
          data={visibleTasks}
          searchPlaceholder="FILTER OPERATIONAL TASKS..."
        />
      </div>
    </div>
  );
};
