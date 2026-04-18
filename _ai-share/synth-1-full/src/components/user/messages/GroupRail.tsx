import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { chatGroupConfig } from './constants';

interface GroupRailProps {
  availableGroups: [string, any][];
  activeGroup: keyof typeof chatGroupConfig;
  setActiveGroup: (group: keyof typeof chatGroupConfig) => void;
}

export const GroupRail: React.FC<GroupRailProps> = ({
  availableGroups,
  activeGroup,
  setActiveGroup,
}) => {
  return (
<<<<<<< HEAD
    <aside className="flex w-10 shrink-0 flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-2 shadow-sm transition-all">
=======
    <aside className="bg-bg-surface2/80 border-border-subtle flex w-10 shrink-0 flex-col items-center gap-2 rounded-2xl border p-2 shadow-sm transition-all">
>>>>>>> recover/cabinet-wip-from-stash
      <TooltipProvider>
        {availableGroups.map(([key, config]) => (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <Button
                variant={activeGroup === (key as any) ? 'default' : 'ghost'}
                size="icon"
                className={cn(
                  'h-10 w-10 rounded-xl transition-all',
                  activeGroup === (key as any)
<<<<<<< HEAD
                    ? 'scale-105 border border-slate-800 bg-slate-900 text-white shadow-lg'
                    : 'border border-transparent text-slate-400 hover:border-indigo-100 hover:bg-white hover:text-indigo-600'
=======
                    ? 'bg-text-primary border-text-primary/30 scale-105 border text-white shadow-lg'
                    : 'text-text-muted hover:text-accent-primary hover:border-accent-primary/20 border border-transparent hover:bg-white'
>>>>>>> recover/cabinet-wip-from-stash
                )}
                onClick={() => setActiveGroup(key as any)}
              >
                <config.icon className="h-4.5 w-4.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
<<<<<<< HEAD
              className="border-none bg-slate-900 text-[9px] font-bold uppercase tracking-widest text-white"
=======
              className="bg-text-primary border-none text-[9px] font-bold uppercase tracking-widest text-white"
>>>>>>> recover/cabinet-wip-from-stash
            >
              {config.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </aside>
  );
};
