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
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
          Критический путь сэмпла (Gantt)
        </h3>
      </div>
      <div className="relative flex h-8 w-full bg-bg-surface2 rounded-md overflow-hidden border border-border-subtle shadow-inner">
        {phases.map((phase) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={cn(
              "absolute h-full flex items-center px-2 text-[10px] sm:text-[11px] font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis shadow-sm border-r border-white/20 last:border-r-0 origin-left",
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
