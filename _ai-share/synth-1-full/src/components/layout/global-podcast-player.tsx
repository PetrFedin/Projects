'use client';

import { useUIState } from '@/providers/ui-state';
import { Button } from '../ui/button';
import { Radio, Pause, X, Music } from 'lucide-react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

export default function GlobalPodcastPlayer() {
  const { playingPodcast, setPlayingPodcast } = useUIState();

  if (!playingPodcast) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: '0%' }}
        exit={{ y: '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="sticky top-0 z-[60] bg-secondary text-secondary-foreground"
      >
        <div className="mx-auto flex h-10 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-muted">
              <Image
                src={playingPodcast.imageUrl}
                alt={playingPodcast.description}
                fill
                className="object-cover"
              />
            </div>
            <div className="overflow-hidden">
              <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                <Radio className="h-4 w-4 flex-shrink-0 animate-pulse-live text-red-500" />
                <span className="truncate">{playingPodcast.description}</span>
              </p>
              <p className="truncate text-xs text-secondary-foreground/70">
                Ведущие: {playingPodcast.hosts?.join(', ')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black/10">
              <Pause className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-black/10"
              onClick={() => setPlayingPodcast(null)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
