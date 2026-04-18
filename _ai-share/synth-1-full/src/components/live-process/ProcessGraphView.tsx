'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { LiveProcessStageDef, LiveProcessStageRuntime } from '@/lib/live-process/types';

interface ProcessGraphViewProps {
  stages: LiveProcessStageDef[];
  runtimes: Record<string, LiveProcessStageRuntime>;
  onStageClick?: (stageId: string) => void;
}

const NODE_WIDTH = 160;
const NODE_HEIGHT = 72;
const H_GAP = 48;
const V_GAP = 32;

/** Топологический layout: узлы слева направо по dependsOn. */
function computeLayout(stages: LiveProcessStageDef[]) {
  const stageMap = new Map(stages.map((s) => [s.id, s]));
  const levels = new Map<string, number>();

  function getLevel(id: string): number {
    const cached = levels.get(id);
    if (cached !== undefined) return cached;
    const stage = stageMap.get(id);
    if (!stage || !stage.dependsOn.length) {
      levels.set(id, 0);
      return 0;
    }
    const depLevels = stage.dependsOn.map((d) => getLevel(d));
    const level = Math.max(...depLevels, 0) + 1;
    levels.set(id, level);
    return level;
  }

  stages.forEach((s) => getLevel(s.id));
  const byLevel = new Map<number, string[]>();
  stages.forEach((s) => {
    const l = levels.get(s.id) ?? 0;
    const list = byLevel.get(l) ?? [];
    list.push(s.id);
    byLevel.set(l, list);
  });

  const positions = new Map<string, { x: number; y: number }>();
  const sortedLevels = Array.from(byLevel.keys()).sort((a, b) => a - b);
  sortedLevels.forEach((level, li) => {
    const ids = byLevel.get(level) ?? [];
    ids.forEach((id, ii) => {
      const x = li * (NODE_WIDTH + H_GAP) + 12;
      const y = ii * (NODE_HEIGHT + V_GAP) + 12;
      positions.set(id, { x, y });
    });
  });

  return { positions, levels: sortedLevels };
}

export function ProcessGraphView({ stages, runtimes, onStageClick }: ProcessGraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  const { positions, levels } = useMemo(() => computeLayout(stages), [stages]);

  const connections = useMemo(() => {
    const lines: {
      from: string;
      to: string;
      fromX: number;
      fromY: number;
      toX: number;
      toY: number;
    }[] = [];
    stages.forEach((stage) => {
      stage.dependsOn.forEach((depId) => {
        const fromPos = positions.get(depId);
        const toPos = positions.get(stage.id);
        if (fromPos && toPos) {
          lines.push({
            from: depId,
            to: stage.id,
            fromX: fromPos.x + NODE_WIDTH,
            fromY: fromPos.y + NODE_HEIGHT / 2,
            toX: toPos.x,
            toY: toPos.y + NODE_HEIGHT / 2,
          });
        }
      });
    });
    return lines;
  }, [stages, positions]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0]?.contentRect ?? { width: 600, height: 400 };
      setDimensions({ width: Math.max(600, width), height: Math.max(400, height) });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const maxX = Math.max(...Array.from(positions.values()).map((p) => p.x), 0) + NODE_WIDTH + 24;
  const maxY = Math.max(...Array.from(positions.values()).map((p) => p.y), 0) + NODE_HEIGHT + 24;

  const isConnectionHighlighted = (from: string, to: string) =>
    hoveredId ? from === hoveredId || to === hoveredId : false;

  return (
    <div ref={containerRef} className="overflow-auto rounded-lg border bg-white">
      <svg
        width={Math.max(dimensions.width, maxX)}
        height={Math.max(dimensions.height, maxY)}
        className="min-w-full"
      >
        <defs>
          <marker id="graph-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="rgb(148 163 184)" />
          </marker>
          <marker
            id="graph-arrow-hover"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill="rgb(99 102 241)" />
          </marker>
        </defs>
        {/* Рёбра */}
        {connections.map(({ from, to, fromX, fromY, toX, toY }) => {
          const midX = (fromX + toX) / 2;
          const highlighted = isConnectionHighlighted(from, to);
          return (
            <path
              key={`${from}-${to}`}
              d={`M ${fromX} ${fromY} C ${midX + 40} ${fromY}, ${midX - 40} ${toY}, ${toX} ${toY}`}
              fill="none"
              stroke={highlighted ? 'rgb(99 102 241)' : 'rgb(203 213 225)'}
              strokeWidth={highlighted ? 2.5 : 1}
              strokeDasharray={highlighted ? 'none' : '4 4'}
              opacity={highlighted ? 1 : 0.6}
              markerEnd={highlighted ? 'url(#graph-arrow-hover)' : 'url(#graph-arrow)'}
              className="pointer-events-none transition-all duration-150"
            />
          );
        })}
        {/* Узлы */}
        {stages.map((stage) => {
          const pos = positions.get(stage.id);
          if (!pos) return null;
          const runtime = runtimes[stage.id];
          const status = runtime?.status ?? 'not_started';
          const isHovered = hoveredId === stage.id;
          return (
            <g
              key={stage.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              onMouseEnter={() => setHoveredId(stage.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onStageClick?.(stage.id)}
              className="cursor-pointer"
            >
              <rect
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx={8}
                ry={8}
                fill={isHovered ? 'rgb(238 242 255)' : 'white'}
                stroke={
                  status === 'done'
                    ? 'rgb(34 197 94)'
                    : status === 'in_progress'
                      ? 'rgb(99 102 241)'
                      : 'rgb(226 232 240)'
                }
                strokeWidth={isHovered ? 2 : 1}
                className="transition-all"
              />
              <text
                x={NODE_WIDTH / 2}
                y={24}
                textAnchor="middle"
                className="fill-text-primary pointer-events-none text-xs font-medium"
              >
                {stage.title.length > 18 ? stage.title.slice(0, 17) + '…' : stage.title}
              </text>
              <text
                x={NODE_WIDTH / 2}
                y={44}
                textAnchor="middle"
                className={cn(
                  'pointer-events-none text-[10px]',
                  status === 'done' && 'fill-emerald-600',
                  status === 'in_progress' && 'fill-accent-primary',
                  status === 'not_started' && 'fill-text-muted'
                )}
              >
                {status === 'done' ? 'Готово' : status === 'in_progress' ? 'В работе' : 'Не начато'}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
