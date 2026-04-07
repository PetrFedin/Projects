'use client';

import { useState, useMemo } from 'react';
import { LiveProcessSchemeStage } from './LiveProcessSchemeStage';
import type { LiveProcessStageDef, LiveProcessStageRuntime, LiveProcessTeamMember } from '@/lib/live-process/types';

const COLS = 4;
const CARD_WIDTH = 240;
const CARD_HEIGHT = 220;
const GAP = 16;

/** Змейка: чётные строки слева направо, нечётные — справа налево */
function getSnakePosition(index: number): { row: number; col: number } {
  const row = Math.floor(index / COLS);
  const posInRow = index % COLS;
  const col = row % 2 === 0 ? posInRow : COLS - 1 - posInRow;
  return { row, col };
}

/** Индекс этапа по позиции в сетке (обратная функция) */
function getStageIndexAt(row: number, col: number): number {
  return row % 2 === 0 ? row * COLS + col : (row + 1) * COLS - 1 - col;
}

/** Координаты центра карточки для SVG линий */
function getCardCenter(row: number, col: number): { x: number; y: number } {
  const x = col * (CARD_WIDTH + GAP) + CARD_WIDTH / 2;
  const y = row * (CARD_HEIGHT + GAP) + CARD_HEIGHT / 2;
  return { x, y };
}

interface LiveProcessSchemeGridProps {
  stages: LiveProcessStageDef[];
  runtimes: Record<string, LiveProcessStageRuntime>;
  team: LiveProcessTeamMember[];
  isBlocked: (stageId: string) => boolean;
  onUpdateRuntime: (stageId: string, patch: Partial<LiveProcessStageRuntime>) => void;
  processLinks?: { sourceProcessId: string; sourceStageId: string; targetProcessId: string; targetStageId?: string }[];
}

export function LiveProcessSchemeGrid({
  stages,
  runtimes,
  team,
  isBlocked,
  onUpdateRuntime,
  processLinks,
}: LiveProcessSchemeGridProps) {
  const [hoveredStageId, setHoveredStageId] = useState<string | null>(null);

  const stagePositions = useMemo(() => {
    const map = new Map<string, { row: number; col: number; index: number }>();
    stages.forEach((s, i) => {
      const { row, col } = getSnakePosition(i);
      map.set(s.id, { row, col, index: i });
    });
    return map;
  }, [stages]);

  const connections = useMemo(() => {
    const lines: { from: string; to: string }[] = [];
    stages.forEach((stage) => {
      stage.dependsOn.forEach((depId) => {
        if (stagePositions.has(depId)) lines.push({ from: depId, to: stage.id });
      });
    });
    return lines;
  }, [stages, stagePositions]);

  const gridWidth = COLS * CARD_WIDTH + (COLS - 1) * GAP;
  const rowsCount = Math.ceil(stages.length / COLS);
  const gridHeight = rowsCount * CARD_HEIGHT + (rowsCount - 1) * GAP;

  const isConnectionHighlighted = (from: string, to: string) =>
    hoveredStageId ? from === hoveredStageId || to === hoveredStageId : false;

  return (
    <div className="relative" style={{ width: gridWidth, minHeight: gridHeight }}>
      {/* SVG слой с линиями связей */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={gridWidth}
        height={gridHeight}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <marker id="arrow-highlight" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="rgb(99 102 241)" />
          </marker>
          <marker id="arrow-default" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="rgb(148 163 184)" />
          </marker>
        </defs>
        {connections.map(({ from, to }) => {
          const fromPos = stagePositions.get(from);
          const toPos = stagePositions.get(to);
          if (!fromPos || !toPos) return null;
          const c1 = getCardCenter(fromPos.row, fromPos.col);
          const c2 = getCardCenter(toPos.row, toPos.col);
          const highlighted = isConnectionHighlighted(from, to);
          const midX = (c1.x + c2.x) / 2;
          const midY = (c1.y + c2.y) / 2;
          return (
            <path
              key={`${from}-${to}`}
              d={`M ${c1.x} ${c1.y} Q ${midX + 30} ${midY - 30} ${c2.x} ${c2.y}`}
              fill="none"
              stroke={highlighted ? 'rgb(99 102 241)' : 'rgb(203 213 225)'}
              strokeWidth={highlighted ? 2.5 : 1}
              strokeDasharray={highlighted ? 'none' : '4 4'}
              opacity={highlighted ? 1 : 0.5}
              markerEnd={highlighted ? 'url(#arrow-highlight)' : 'url(#arrow-default)'}
              className="transition-all duration-150"
            />
          );
        })}
      </svg>
      {/* Сетка карточек змейкой: 4 блока в ряд */}
      <div
        className="relative grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${COLS}, ${CARD_WIDTH}px)`,
          gridTemplateRows: `repeat(${rowsCount}, ${CARD_HEIGHT}px)`,
          width: gridWidth,
        }}
      >
        {Array.from({ length: rowsCount * COLS }, (_, cellIndex) => {
          const row = Math.floor(cellIndex / COLS);
          const col = cellIndex % COLS;
          const index = getStageIndexAt(row, col);
          const stage = stages[index];
          if (!stage) return <div key={cellIndex} />;
          const runtime = runtimes[stage.id];
          if (!runtime) return null;
          return (
            <div
              key={stage.id}
              className="transition-all"
              style={{ gridColumn: col + 1, gridRow: row + 1 }}
              onMouseEnter={() => setHoveredStageId(stage.id)}
              onMouseLeave={() => setHoveredStageId(null)}
            >
                <LiveProcessSchemeStage
                  stage={stage}
                  runtime={runtime}
                  team={team}
                  isBlocked={isBlocked(stage.id)}
                  onUpdateRuntime={onUpdateRuntime}
                  index={index}
                  isHovered={hoveredStageId === stage.id}
                  processLinks={processLinks}
                />
            </div>
          );
        })}
      </div>
    </div>
  );
}
