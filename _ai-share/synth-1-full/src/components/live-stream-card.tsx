'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlayCircle } from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { StreamDateDisplay } from './live/stream-date-display';

interface LiveStreamCardProps {
  stream: ImagePlaceholder;
  onPlay: () => void;
  isLive: boolean;
}

export default function LiveStreamCard({ stream, onPlay, isLive }: LiveStreamCardProps) {
  return (
    <button className="group w-full text-left" onClick={onPlay}>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
        <Image
          src={stream.imageUrl}
          alt={stream.description}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={stream.imageHint}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        {isLive && (
          <div className="absolute left-2 top-2 flex items-center gap-2">
            <div className="animate-pulse-live rounded-md bg-red-600 px-2 py-1 text-xs font-bold text-white">
              LIVE
            </div>
            {stream.date && <StreamDateDisplay date={stream.date} isLive={true} />}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayCircle className="h-12 w-12 text-white/70 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        {!isLive && (
          <div className="absolute bottom-2 right-2 rounded bg-black/50 px-2 py-1 text-xs text-white">
            {stream.duration ? `${stream.duration} мин` : 'Запись'}
          </div>
        )}
      </div>
      <div className="pt-2">
        <p className="text-sm font-semibold leading-tight">{stream.description}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <p>Ведущий: стилист @username</p>
          {!isLive && stream.date && <StreamDateDisplay date={stream.date} />}
        </div>
      </div>
    </button>
  );
}
