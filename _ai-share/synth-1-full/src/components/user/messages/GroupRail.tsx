import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { chatGroupConfig } from './constants';

interface GroupRailProps {
  availableGroups: [string, any][];
  activeGroup: keyof typeof chatGroupConfig;
  setActiveGroup: (group: keyof typeof chatGroupConfig) => void;
  slimCore?: boolean;
  className?: string;
}

export const GroupRail: React.FC<GroupRailProps> = ({
  availableGroups,
  activeGroup,
  setActiveGroup,
  slimCore = false,
  className,
}) => {
  return (
    <aside
      className={cn(
        'bg-bg-surface2/80 border-border-subtle flex shrink-0 flex-col items-center gap-1.5 border shadow-sm transition-all',
        slimCore ? 'w-8 rounded-lg p-1' : 'w-10 rounded-2xl p-2',
        className
      )}
    >
      <TooltipProvider>
        {availableGroups.map(([key, config]) => (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <Button
                variant={activeGroup === (key as any) ? 'default' : 'ghost'}
                size="icon"
                className={cn(
                  'rounded-lg transition-all',
                  slimCore ? 'h-7 w-7' : 'h-10 w-10 rounded-xl',
                  activeGroup === (key as any)
                    ? 'bg-text-primary border-text-primary/30 border text-white shadow-md'
                    : 'text-text-muted hover:text-accent-primary hover:border-accent-primary/20 border border-transparent hover:bg-white',
                  !slimCore && activeGroup === (key as any) && 'scale-105 shadow-lg'
                )}
                onClick={() => setActiveGroup(key as any)}
              >
                <config.icon className={slimCore ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-text-primary border-none text-[9px] font-bold uppercase tracking-widest text-white"
            >
              {config.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </aside>
  );
};
