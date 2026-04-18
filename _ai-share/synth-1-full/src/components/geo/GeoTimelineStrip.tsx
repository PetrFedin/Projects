'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { PeriodPreset, TimePoint } from './geo.types';

type Props = {
  period: PeriodPreset;
  onPeriodChange: (p: PeriodPreset) => void;

  points: TimePoint[];
  index: number;
  onIndexChange: (i: number) => void;

  isPlaying: boolean;
  onTogglePlay: () => void;

  label?: string;
};

const PRESETS: { id: PeriodPreset; label: string }[] = [
  { id: '7d', label: '7 дней' },
  { id: '30d', label: '30 дней' },
  { id: '90d', label: '90 дней' },
  { id: 'season', label: 'Сезон' },
  { id: 'year', label: 'Год' },
];

export function GeoTimelineStrip(props: Props) {
  const { period, onPeriodChange, points, index, onIndexChange, isPlaying, onTogglePlay } = props;
  const current = points[index];

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-text-secondary h-7 w-7"
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>
          <span className="text-text-muted">{current?.label ?? '—'}</span>
        </div>

        <div className="flex items-center gap-1">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => onPeriodChange(p.id)}
              className={`rounded-full border px-2 py-1 text-[11px] ${
                period === p.id
                  ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200'
                  : 'border-text-primary/25 bg-text-primary/90 text-text-muted hover:bg-text-primary/80'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-text-muted flex items-center gap-3 text-xs">
        <span>Таймлайн</span>
        <input
          type="range"
          min={0}
          max={Math.max(0, points.length - 1)}
          value={index}
          onChange={(e) => onIndexChange(Number(e.target.value))}
          className="flex-1"
        />
        <span>{points.length ? `${index + 1}/${points.length}` : '0/0'}</span>
      </div>
    </div>
  );
}
