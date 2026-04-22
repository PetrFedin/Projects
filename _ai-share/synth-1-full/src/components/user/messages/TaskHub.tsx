import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage, TaskStatus, TaskPriority } from '@/lib/types';
import { DataTablePro } from '@/components/data/DataTable/DataTablePro';
import { statusConfig, priorityConfig } from './constants';

interface TaskHubProps {
  chatTasks: ChatMessage[];
  currentUser: string;
  onOpenEditTask: (m: ChatMessage) => void;
}

export const TaskHub: React.FC<TaskHubProps> = ({
  chatTasks,
  currentUser,
  onOpenEditTask
}) => {
  const visibleTasks = React.useMemo(() => {
    return chatTasks.filter(t => !t.isPrivate || t.user === currentUser);
  }, [chatTasks, currentUser]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-4">
        <header className="flex justify-between items-end border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Задачи в чате</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Создание — кнопка «Задача» в поле ввода.</p>
          </div>
          <Button variant="outline" size="sm" className="h-8 border-zinc-200 text-xs">
            <Download className="h-3.5 w-3.5 mr-2" /> Экспорт
          </Button>
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
