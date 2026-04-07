
'use client';

import Image from 'next/image';
import type { ImagePlaceholder } from '@/lib/types';
import { Button } from './ui/button';
import { Mic, Play, Pause, Bell, Clock } from 'lucide-react';
import { Badge } from './ui/badge';
import { formatDistanceToNow, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useUIState } from '@/providers/ui-state';
import { StreamDateDisplay } from './live/stream-date-display';

interface PodcastCardProps {
  podcast: ImagePlaceholder;
}

export default function PodcastCard({ podcast }: PodcastCardProps) {
    const { playingPodcast, setPlayingPodcast } = useUIState();
    
    const isPlaying = playingPodcast?.id === podcast.id;
    const isLive = podcast.id.startsWith('podcast-live');
    const isUpcoming = !isLive && podcast.date && new Date(podcast.date) > new Date();
    const isPast = !isLive && !isUpcoming;
    
    const handlePlay = () => {
        setPlayingPodcast(isPlaying ? null : podcast);
    }


  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        <Image src={podcast.imageUrl} alt={podcast.description} fill className="object-cover" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
            {isLive ? (
                <Badge className="bg-red-500 hover:bg-red-600 animate-pulse-live">
                    <Mic className="h-3 w-3 mr-1.5"/> LIVE
                </Badge>
            ) : isUpcoming ? (
                 <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1.5" /> Анонс
                </Badge>
            ) : (
                 <Badge variant="outline">Запись</Badge>
            )}
             {podcast.date && <StreamDateDisplay date={podcast.date} isLive={isLive}/>}
        </div>
        <h3 className="font-semibold leading-tight">{podcast.description}</h3>
        <p className="text-sm text-muted-foreground">Ведущие: {podcast.hosts?.join(', ')}</p>
         {podcast.guests && podcast.guests.length > 0 && (
            <p className="text-sm text-muted-foreground">Гости: {podcast.guests.join(', ')}</p>
        )}
      </div>
      <div className="ml-auto">
        {isUpcoming ? (
            <Button variant="secondary" size="icon">
                <Bell className="h-5 w-5" />
            </Button>
        ) : (
            <Button size="icon" onClick={handlePlay} variant={isPlaying ? "default" : "outline"}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
        )}
      </div>
    </div>
  );
}
