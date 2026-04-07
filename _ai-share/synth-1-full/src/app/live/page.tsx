
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import LivePlayer from '@/components/live-player';
import LiveStreamCard from '@/components/live-stream-card';
import type { ImagePlaceholder } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { X, Calendar as CalendarIcon, PlayCircle, Mic, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isSameDay, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import PodcastCard from '@/components/podcast-card';
import { useUIState } from '@/providers/ui-state';
import { StreamDateDisplay } from '@/components/live/stream-date-display';

export default function LivePage() {
  const { playingPodcast, setPlayingPodcast, viewRole, user } = useUIState();
  const [isLivePlayerOpen, setIsLivePlayerOpen] = useState(false);
  
  const role = user?.activeOrganizationId?.includes('org-brand') ? 'brand' : 
               user?.activeOrganizationId?.includes('org-factory') ? 'factory' : 'client';
  const [selectedEvent, setSelectedEvent] = useState<ImagePlaceholder | null>(null);
  const [isEventLive, setIsEventLive] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [activeFilters, setActiveFilters] = useState<string[]>(['Все']);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const streamsPerPage = 6;
  

  const allStreams = useMemo(() => [
    ...PlaceHolderImages.filter(img => img.id.startsWith("live-")),
    ...PlaceHolderImages.filter(img => img.id.startsWith("upcoming-")),
    ...PlaceHolderImages.filter(img => img.id.startsWith("story-")),
    ...PlaceHolderImages.filter(img => img.id.startsWith("podcast-"))
  ], []);

  const streamCategories = useMemo(() => {
    const categories = new Set(allStreams.map(s => s.category).filter(Boolean));
    return ['Все', ...Array.from(categories)] as string[];
  }, [allStreams]);
  
  const allHashtags = useMemo(() => {
    const hashtags = new Set(allStreams.flatMap(s => s.hashtags || []));
    return Array.from(hashtags);
  }, [allStreams]);

  const filteredStreams = useMemo(() => {
    return allStreams.filter(stream => {
      const categoryMatch = activeFilters.includes('Все') || (stream.category && activeFilters.some(f => stream.category === f));
      const hashtagMatch = selectedHashtags.length === 0 || (stream.hashtags && stream.hashtags.some(h => selectedHashtags.includes(h)));
      const dateMatch = !date || (stream.date && isSameDay(parseISO(stream.date), date));
      return categoryMatch && hashtagMatch && dateMatch;
    });
  }, [activeFilters, selectedHashtags, date, allStreams]);


  const filteredLiveImages = filteredStreams.filter(s => s.id.startsWith('live-'));
  const filteredUpcomingStreams = filteredStreams.filter(s => s.id.startsWith('upcoming-'));
  const filteredPastStreams = filteredStreams.filter(s => s.id.startsWith('story-'));
  
  const filteredLivePodcasts = filteredStreams.filter(s => s.id.startsWith('podcast-live-'));
  const filteredUpcomingPodcasts = filteredStreams.filter(s => s.id.startsWith('podcast-upcoming-'));
  const filteredPastPodcasts = filteredStreams.filter(s => s.id.startsWith('podcast-past-'));


  const streamDates = useMemo(() => allStreams.filter(s => s.date).map(s => parseISO(s.date!)), [allStreams]);
  
  // Pagination logic
  const indexOfLastStream = currentPage * streamsPerPage;
  const indexOfFirstStream = indexOfLastStream - streamsPerPage;
  const currentPastStreams = filteredPastStreams.slice(indexOfFirstStream, indexOfLastStream);
  const totalPages = Math.ceil(filteredPastStreams.length / streamsPerPage);

  const handleOpenLivePlayer = (event: ImagePlaceholder, isLive: boolean) => {
    setSelectedEvent(event);
    setIsEventLive(isLive);
    setIsLivePlayerOpen(true);
  };
  
  const handlePlayPodcast = (podcast: ImagePlaceholder) => {
    setPlayingPodcast(podcast.id === playingPodcast?.id ? null : podcast);
  }

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev => 
      prev.includes(hashtag) 
      ? prev.filter(h => h !== hashtag)
      : [...prev, hashtag]
    );
  }

  const toggleFilter = (filter: string) => {
    if (filter === 'Все') {
      setActiveFilters(['Все']);
      return;
    }

    setActiveFilters(prev => {
      const newFilters = prev.filter(f => f !== 'Все');
      if (newFilters.includes(filter)) {
        const updated = newFilters.filter(f => f !== filter);
        return updated.length === 0 ? ['Все'] : updated;
      } else {
        return [...newFilters, filter];
      }
    });
  }

  const DayWithStreams = (day: Date) => {
    const streamsOnDay = allStreams.filter(s => s.date && isSameDay(parseISO(s.date), day));
    if (streamsOnDay.length === 0) return <div>{day.getDate()}</div>;

    return (
        <Popover>
            <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                <div className="relative h-full w-full flex items-center justify-center">
                    {day.getDate()}
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-accent"></span>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-3">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">События за {day.toLocaleDateString('ru-RU')}</h4>
                        <p className="text-sm text-muted-foreground">Нажмите, чтобы посмотреть.</p>
                    </div>
                    <div className="grid gap-2">
                       {streamsOnDay.map(stream => (
                           <button key={stream.id} className="flex items-center gap-2 hover:bg-accent/50 p-2 rounded-md" onClick={() => handleOpenLivePlayer(stream, stream.id.startsWith('live-'))}>
                                <Image src={stream.imageUrl} width={40} height={40} alt={stream.description} className="rounded-md object-cover" />
                                <span className="text-sm font-medium truncate">{stream.description}</span>
                                <PlayCircle className="h-5 w-5 ml-auto text-muted-foreground" />
                           </button>
                       ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
  };
  
    const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center items-center gap-3 mt-8">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
        >
          Назад
        </Button>
        <span className="text-sm text-muted-foreground">
          Страница {currentPage} из {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
        >
          Вперед
        </Button>
      </div>
    );
  };


  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-4 space-y-4">
        {viewRole === 'b2b' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-in slide-in-from-top-4 duration-500">
            <Card className="md:col-span-2 p-4 bg-slate-900 text-white rounded-xl border-none shadow-2xl relative overflow-hidden flex items-center justify-between group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700"><Mic className="h-32 w-32" /></div>
              <div className="relative z-10 space-y-4">
                <Badge className="bg-rose-600 text-white border-none uppercase text-[8px] font-black tracking-widest px-2">Broadcast Control</Badge>
                <h3 className="text-base font-black uppercase tracking-tighter">Управление эфирами</h3>
                <p className="text-slate-400 text-sm font-medium max-w-md italic">
                  {role === 'brand' 
                    ? 'Запускайте презентации коллекций и общайтесь с байерами в реальном времени.' 
                    : 'Демонстрируйте прозрачность производства и технологические процессы через Live-стримы.'}
                </p>
                <Button asChild className="h-12 px-8 bg-white text-slate-900 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-transform">
                  <Link href={role === 'brand' ? '/brand/live' : '/factory/live'}>Открыть Dashboard</Link>
                </Button>
              </div>
            </Card>
            <Card className="p-4 bg-indigo-600 text-white rounded-xl border-none shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-200" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">B2B Аудитория</span>
                </div>
                <h4 className="text-sm font-black tabular-nums">4.2k</h4>
                <p className="text-[10px] font-bold text-indigo-100/80 leading-relaxed uppercase tracking-widest">Активных байеров в сети</p>
              </div>
              <div className="pt-4 border-t border-white/10 relative z-10">
                <p className="text-[9px] font-black uppercase text-indigo-200 flex items-center gap-2">
                  <Zap className="h-3 w-3 fill-indigo-200" /> AI Insight: "Вечерние стримы (19:00+) повышают CTR на 24%"
                </p>
              </div>
            </Card>
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-sm md:text-sm font-headline font-bold">Прямые эфиры и Подкасты</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Присоединяйтесь к нашим live-трансляциям, слушайте подкасты, общайтесь со стилистами и совершайте покупки в режиме реального времени.
          </p>
        </header>

        <div className="flex flex-wrap gap-2 mb-8">
          {streamCategories.map(filter => (
            <Button 
              key={filter}
              variant={activeFilters.includes(filter) ? 'default' : 'secondary'}
              onClick={() => toggleFilter(filter)}
              size="sm"
              className="rounded-full"
            >
              {filter}
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-3 items-start">
          <main className="lg:col-span-3 space-y-6">
            {/* Live Streams Now */}
            {filteredLiveImages.length > 0 && <section>
              <h2 className="text-sm font-bold mb-4">Сейчас в эфире</h2>
                <Carousel opts={{ align: "start" }} className="w-full">
                  <CarouselContent>
                    {filteredLiveImages.map((stream) => (
                      <CarouselItem key={stream.id} className="md:basis-1/2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="p-1 h-full">
                                <LiveStreamCard 
                                  stream={stream} 
                                  onPlay={() => handleOpenLivePlayer(stream, true)} 
                                  isLive={true} 
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{stream.description}</p>
                            </TooltipContent>
                          </Tooltip>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {filteredLiveImages.length > 2 && <CarouselPrevious className="hidden sm:flex" />}
                  {filteredLiveImages.length > 2 && <CarouselNext className="hidden sm:flex" />}
                </Carousel>
            </section>}

             {/* Live Podcasts Now */}
            {filteredLivePodcasts.length > 0 && (
              <section>
                 <h2 className="text-sm font-bold mb-4">Подкасты в прямом эфире</h2>
                  <div className="space-y-6">
                    {filteredLivePodcasts.map(podcast => (
                       <PodcastCard key={podcast.id} podcast={podcast} onPlay={() => handlePlayPodcast(podcast)} isPlaying={playingPodcast?.id === podcast.id}/>
                    ))}
                  </div>
              </section>
            )}
            
            {/* Upcoming Streams */}
            {filteredUpcomingStreams.length > 0 && <section>
              <h2 className="text-sm font-bold mb-4">Анонсы трансляций</h2>
                <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselContent>
                        {filteredUpcomingStreams.map((stream) => (
                             <CarouselItem key={stream.id} className="md:basis-1/2">
                                <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="group relative rounded-lg border bg-card p-4 flex items-center gap-3 m-1">
                                        <Image
                                            src={stream.imageUrl}
                                            alt={stream.description}
                                            width={100}
                                            height={100}
                                            className="rounded-md object-cover aspect-square"
                                            data-ai-hint={stream.imageHint}
                                        />
                                        <div className="flex-1">
                                            <p className="font-semibold">{stream.description}</p>
                                            {stream.date && <StreamDateDisplay date={stream.date} />}
                                            <Button variant="secondary" size="sm" className="mt-2">Напомнить</Button>
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{stream.description}</p>
                                </TooltipContent>
                                </Tooltip>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {filteredUpcomingStreams.length > 2 && <CarouselPrevious className="hidden sm:flex" />}
                    {filteredUpcomingStreams.length > 2 && <CarouselNext className="hidden sm:flex" />}
                </Carousel>
            </section>}

            {/* Upcoming Podcasts */}
            {filteredUpcomingPodcasts.length > 0 && (
              <section>
                 <h2 className="text-sm font-bold mb-4">Анонсы подкастов</h2>
                  <div className="space-y-6">
                    {filteredUpcomingPodcasts.map(podcast => (
                       <PodcastCard key={podcast.id} podcast={podcast} onPlay={() => handlePlayPodcast(podcast)} isPlaying={playingPodcast?.id === podcast.id}/>
                    ))}
                  </div>
              </section>
            )}


            {/* Past Streams Archive */}
            {currentPastStreams.length > 0 && <section>
              <h2 className="text-sm font-bold mb-4">Архив трансляций</h2>
               
                 <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {currentPastStreams.map(stream => (
                            <Tooltip key={stream.id}>
                              <TooltipTrigger asChild>
                                <div>
                                  <LiveStreamCard 
                                    stream={stream} 
                                    onPlay={() => handleOpenLivePlayer(stream, false)}
                                    isLive={false}
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{stream.description}</p>
                              </TooltipContent>
                            </Tooltip>
                        ))}
                      </div>
                      {renderPagination()}
                 </>
            </section>}
            
             {/* Past Podcasts Archive */}
            {filteredPastPodcasts.length > 0 && (
              <section>
                 <h2 className="text-sm font-bold mb-4">Архив подкастов</h2>
                  <div className="space-y-6">
                     {filteredPastPodcasts.map(podcast => (
                       <PodcastCard key={podcast.id} podcast={podcast} onPlay={() => handlePlayPodcast(podcast)} isPlaying={playingPodcast?.id === podcast.id}/>
                    ))}
                  </div>
              </section>
            )}

            {filteredLiveImages.length === 0 && filteredUpcomingStreams.length === 0 && currentPastStreams.length === 0 && filteredLivePodcasts.length === 0 && filteredUpcomingPodcasts.length === 0 && filteredPastPodcasts.length === 0 && (
                 <div className="text-center py-4 border-2 border-dashed rounded-lg bg-muted/50">
                    <h3 className="text-base font-semibold text-muted-foreground">Нет событий</h3>
                    <p className="mt-2 text-muted-foreground">Попробуйте выбрать другую дату или сбросить фильтры.</p>
                </div>
            )}
          </main>
          
          <aside className="lg:col-span-1 sticky top-24 space-y-6">
              <Card>
                  <CardHeader className="flex-row items-center justify-between pt-4 pb-2">
                     <CardTitle className="text-base flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> Календарь</CardTitle>
                      {date && (
                        <Button variant="ghost" size="sm" onClick={() => setDate(undefined)} className="text-xs">
                          Сбросить
                        </Button>
                      )}
                  </CardHeader>
                  <CardContent className="p-2">
                      <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          className="w-full"
                          locale={ru}
                          modifiers={{ hasStream: streamDates }}
                          modifiersClassNames={{ hasStream: 'day-with-stream' }}
                          components={{
                            Day: (props) => DayWithStreams(props.date),
                          }}
                      />
                  </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex-row items-center justify-between pt-4 pb-2">
                  <CardTitle className="text-base">Фильтр по тегам</CardTitle>
                   {selectedHashtags.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setSelectedHashtags([])} className="text-xs">
                      Сбросить
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 p-4">
                  {allHashtags.map(tag => (
                    <Button 
                      key={tag}
                      variant={selectedHashtags.includes(tag) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleHashtag(tag)}
                      className="rounded-full"
                    >
                      {tag}
                      {selectedHashtags.includes(tag) && <X className="ml-1.5 h-3 w-3" />}
                    </Button>
                  ))}
                </CardContent>
              </Card>
          </aside>
        </div>

        {selectedEvent && (
          <LivePlayer event={selectedEvent} isOpen={isLivePlayerOpen} onOpenChange={setIsLivePlayerOpen} isLive={isEventLive}/>
        )}
      </div>
    </TooltipProvider>
  );
}
