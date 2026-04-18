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
    <aside className="flex w-10 shrink-0 flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/50 p-2 shadow-sm transition-all">
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
                    ? 'scale-105 border border-slate-800 bg-slate-900 text-white shadow-lg'
                    : 'border border-transparent text-slate-400 hover:border-indigo-100 hover:bg-white hover:text-indigo-600'
                )}
                onClick={() => setActiveGroup(key as any)}
              >
                <config.icon className="h-4.5 w-4.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="border-none bg-slate-900 text-[9px] font-bold uppercase tracking-widest text-white"
            >
              {config.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </aside>
  );
};
