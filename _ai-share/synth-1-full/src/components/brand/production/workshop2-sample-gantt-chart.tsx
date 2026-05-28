import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GanttPhase {
  id: string;
  name: string;
  startPercent: number;
  widthPercent: number;
  color: string;
}

interface Workshop2SampleGanttChartProps {
  phases: GanttPhase[];
}

export function Workshop2SampleGanttChart({ phases }: Workshop2SampleGanttChartProps) {
  if (!phases || phases.length === 0) return null;

  return (
    <div className="mb-6 w-full">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-text-primary text-xs font-semibold uppercase tracking-wider">
          Критический путь сэмпла (Gantt)
        </h3>
      </div>
      <div className="bg-bg-surface2 border-border-subtle relative flex h-8 w-full overflow-hidden rounded-md border shadow-inner">
        {phases.map((phase) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={cn(
              'absolute flex h-full origin-left items-center overflow-hidden text-ellipsis whitespace-nowrap border-r border-white/20 px-2 text-[10px] font-bold text-white shadow-sm last:border-r-0 sm:text-[11px]',
              phase.color
            )}
            style={{ left: `${phase.startPercent}%`, width: `${phase.widthPercent}%` }}
            title={phase.name}
          >
            {phase.name}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
