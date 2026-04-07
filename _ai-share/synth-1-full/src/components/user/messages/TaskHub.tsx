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
  onOpenEditTask
}) => {
  const visibleTasks = React.useMemo(() => {
    return chatTasks.filter(t => !t.isPrivate || t.user === currentUser);
  }, [chatTasks, currentUser]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-4">
        <header className="flex justify-between items-end border-b border-zinc-100 pb-6">
          <div>
            <h2 className="text-sm font-black uppercase tracking-tighter">Operational Task Hub</h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Cross-Functional Project & Milestone Tracking</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-9 border-zinc-200 rounded-none font-black text-[9px] uppercase tracking-widest px-4">
              <Download className="h-3.5 w-3.5 mr-2" /> EXPORT PORTFOLIO
            </Button>
            <Button size="sm" className="h-9 bg-black text-white rounded-none font-black text-[9px] uppercase tracking-widest px-6" onClick={onOpenCreateTask}>
              <Plus className="h-3.5 w-3.5 mr-2" /> NEW OPERATIONAL TASK
            </Button>
          </div>
        </header>
        
        <DataTablePro 
          columns={[
            {
              accessorKey: "text",
              header: "TASK DESCRIPTION",
              cell: ({ row }: any) => (
                <div className="flex items-center gap-3">
                  <div className={cn("h-2 w-2 rounded-full", statusConfig[row.original.status as TaskStatus]?.color.replace('text-', 'bg-'))} />
                  <span className="font-black text-zinc-900 truncate max-w-[300px] uppercase tracking-tighter">{row.original.text}</span>
                </div>
              )
            },
            {
              accessorKey: "priority",
              header: "PRIORITY",
              cell: ({ row }: any) => (
                <Badge variant="outline" className={cn("text-[8px] font-black uppercase h-5 rounded-none border-zinc-100", priorityConfig[row.original.priority as TaskPriority].color)}>
                  {row.original.priority}
                </Badge>
              )
            },
            {
              accessorKey: "deadline",
              header: "DEADLINE",
              cell: ({ row }: any) => <span className="font-black text-zinc-500 tabular-nums">{row.original.deadline ? new Date(row.original.deadline).toLocaleDateString() : 'N/A'}</span>
            },
            {
              accessorKey: "status",
              header: "STATUS",
              cell: ({ row }: any) => (
                <span className="text-[10px] font-black uppercase text-zinc-400 italic">
                  {statusConfig[row.original.status as TaskStatus]?.label}
                </span>
              )
            },
            {
              id: "actions",
              cell: ({ row }: any) => (
                <Button variant="ghost" size="sm" className="h-7 px-3 border border-zinc-100 text-zinc-400 hover:text-black hover:border-black rounded-none font-black text-[8px] uppercase" onClick={() => onOpenEditTask(row.original)}>
                  DETAILS
                </Button>
              )
            }
          ]} 
          data={visibleTasks} 
          searchPlaceholder="FILTER OPERATIONAL TASKS..." 
        />
      </div>
    </div>
  );
};
