'use client';

import React from 'react';
import Image from 'next/image';
import { 
    BookText, Calendar, Radio, PlayCircle, Users, Rss, 
    Newspaper, Video, Globe, ArrowRight, MapPin, Check, 
    Instagram, Send, Youtube, Eye, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface MediaTabProps {
    displayName: string;
    mediaPeriod: string;
    setMediaPeriod: (period: 'week' | 'month' | 'year' | 'all') => void;
    selectedDate: Date | undefined;
    setSelectedDate: (date: Date | undefined) => void;
    activeMediaTab: string;
    setActiveMediaTab: (tab: string) => void;
    filteredMediaData: any;
    storyImages: any[];
    handleOpenStory: (story: any, data: any[]) => void;
    setSelectedEvent: (event: any) => void;
    setIsLivePlayerOpen: (open: boolean) => void;
    setIsLiveReminderOpen: (open: boolean) => void;
    handleEventRegistration: (id: number, type: string) => void;
    registeredEvents: number[];
    setSelectedBlog: (blog: any) => void;
    setSelectedSocial: (post: any) => void;
    setSelectedStoryVideo: (vid: any) => void;
    setSelectedMention: (mention: any) => void;
    setSelectedPress: (press: any) => void;
    setIsPressKitOpen: (open: boolean) => void;
    toast: any;
    setB2bPartnerStatus: (status: 'none' | 'pending' | 'friend' | 'active' | 'spot') => void;
}

export function MediaTab({
    displayName,
    mediaPeriod,
    setMediaPeriod,
    selectedDate,
    setSelectedDate,
    activeMediaTab,
    setActiveMediaTab,
    filteredMediaData,
    storyImages,
    handleOpenStory,
    setSelectedEvent,
    setIsLivePlayerOpen,
    setIsLiveReminderOpen,
    handleEventRegistration,
    registeredEvents,
    setSelectedBlog,
    setSelectedSocial,
    setSelectedStoryVideo,
    setSelectedMention,
    setSelectedPress,
    setIsPressKitOpen,
    toast,
    setB2bPartnerStatus
}: MediaTabProps) {
    const handleB2bRegistration = () => {
        setB2bPartnerStatus('pending');
        toast({
            title: "Заявка отправлена",
            description: `Бренд ${displayName} рассмотрит ваш запрос в течение 48 часов.`
        });
    };

    const handlePressKitDownload = () => {
        toast({
            title: "Скачивание Press Kit",
            description: `Архив с материалами бренда ${displayName} подготовлен.`,
        });
    };

    return (
        <TabsContent value="media" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-4">
            {/* Media Header & Filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-8 border-b">
                <div className="space-y-1">
                    <h2 className="text-sm font-black tracking-tighter uppercase">Медиа-центр</h2>
                    <p className="text-muted-foreground font-medium">Все события, новости и публикации в одном месте</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="flex bg-muted/50 p-1 rounded-xl border shadow-sm w-full sm:w-auto">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-4 text-[10px] font-black uppercase tracking-widest text-accent hover:bg-accent hover:text-white transition-all rounded-lg"
                            onClick={handlePressKitDownload}
                        >
                            <BookText className="h-3.5 w-3.5 mr-2" /> Press Kit
                        </Button>
                        <div className="w-px h-4 bg-muted-foreground/20 self-center mx-1" />
                        {[
                            { label: 'Неделя', value: 'week' },
                            { label: 'Месяц', value: 'month' },
                            { label: 'Год', value: 'year' },
                            { label: 'Все', value: 'all' }
                        ].map(p => (
                            <Button
                                key={p.value}
                                variant={mediaPeriod === p.value ? 'secondary' : 'ghost'}
                                size="sm"
                                className={cn(
                                    "flex-1 sm:flex-none h-8 px-4 text-[10px] font-black uppercase rounded-lg transition-all",
                                    mediaPeriod === p.value ? "bg-black text-white shadow-md" : "text-muted-foreground"
                                )}
                                onClick={() => setMediaPeriod(p.value as any)}
                            >
                                {p.label}
                            </Button>
                        ))}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className={cn(
                                        "h-8 px-3 rounded-lg transition-all",
                                        selectedDate ? "text-accent" : "text-muted-foreground"
                                    )}
                                >
                                    <Calendar className="h-3.5 w-3.5" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden shadow-2xl border-none" align="end">
                                <CalendarComponent
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    initialFocus
                                    locale={ru}
                                    className="p-3"
                                />
                                {selectedDate && (
                                    <div className="p-4 bg-muted/20 border-t border-muted/10 text-center">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            Выбрано: {format(selectedDate, 'd MMMM yyyy', { locale: ru })}
                                        </p>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="mt-2 h-7 text-[8px] font-black uppercase tracking-widest hover:text-red-500"
                                            onClick={() => setSelectedDate(undefined)}
                                        >
                                            Сбросить дату
                                        </Button>
                                    </div>
                                )}
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>

            {/* Media Sub-navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {[
                    { label: 'Все', value: 'all' },
                    { label: 'Live', value: 'live', icon: <Radio className="h-3.5 w-3.5 mr-2 animate-pulse text-red-500" /> },
                    { label: 'Сториз', value: 'stories', icon: <PlayCircle className="h-3.5 w-3.5 mr-2" /> },
                    { label: 'Отметки', value: 'mentions', icon: <Users className="h-3.5 w-3.5 mr-2" /> },
                    { label: 'Соцсети', value: 'social', icon: <Rss className="h-3.5 w-3.5 mr-2" /> },
                    { label: 'Блог и Новости', value: 'blog', icon: <Newspaper className="h-3.5 w-3.5 mr-2" /> },
                    { label: 'События', value: 'events', icon: <Calendar className="h-3.5 w-3.5 mr-2" /> },
                    { label: 'Видео', value: 'video', icon: <Video className="h-3.5 w-3.5 mr-2" /> },
                    { label: 'Пресса', value: 'press', icon: <Globe className="h-3.5 w-3.5 mr-2" /> },
                    { label: 'BTS', value: 'bts', icon: <Video className="h-3.5 w-3.5 mr-2" /> },
                    { label: 'Подкасты', value: 'podcasts', icon: <Radio className="h-3.5 w-3.5 mr-2" /> }
                ].map(tab => (
                    <Button
                        key={tab.value}
                        variant={activeMediaTab === tab.value ? 'default' : 'outline'}
                        size="sm"
                        className={cn(
                            "rounded-full h-9 px-6 text-[11px] font-black uppercase tracking-wider transition-all shrink-0",
                            activeMediaTab === tab.value ? "bg-black text-white border-black shadow-lg shadow-black/20" : "hover:bg-muted"
                        )}
                        onClick={() => setActiveMediaTab(tab.value)}
                    >
                        {tab.icon}
                        {tab.label}
                    </Button>
                ))}
            </div>

            {/* Media Content Grid */}
            <div className="space-y-4">
                {[
                    { title: 'Live & Предстоящее', id: 'live', data: filteredMediaData?.live || [], type: 'live' },
                    { title: 'Сториз', id: 'stories', data: storyImages || [], type: 'stories' },
                    { title: 'Отметки покупателей', id: 'mentions', data: filteredMediaData?.customerMentions || [], type: 'mentions' },
                    { title: 'Соцсети', id: 'social', data: filteredMediaData?.social || [], type: 'social' },
                    { title: 'Блог и Новости', id: 'blog', data: filteredMediaData?.blog || [], type: 'blog' },
                    { title: 'События и Показы', id: 'events', data: filteredMediaData?.events || [], type: 'events' },
                    { title: 'За кулисами (BTS)', id: 'bts', data: filteredMediaData?.bts || [], type: 'blog' },
                    { title: 'Подкасты бренда', id: 'podcasts', data: filteredMediaData?.podcasts || [], type: 'blog' },
                    { title: 'Видео', id: 'video', data: filteredMediaData?.video || [], type: 'video' },
                    { title: 'Пресса о нас', id: 'press', data: filteredMediaData?.press || [], type: 'press' },
                    { title: 'Архив Live-эфиров', id: 'live_archive', data: [
                        { id: 1, title: 'Презентация Arctic Minimal', date: '12 Дек 2023', items: 5, imageUrl: 'https://images.unsplash.com/photo-1441998852351-768a7f108b4e?w=800&q=80' },
                        { id: 2, title: 'Как носить меринос: Гид', date: '05 Дек 2023', items: 3, imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80' }
                    ], type: 'live_archive' }
                ].filter(section => activeMediaTab === 'all' || activeMediaTab === section.id).map((section) => (
                    <section key={section.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-8 px-2">
                            <div className="space-y-1">
                                <h3 className="text-sm font-black tracking-tight uppercase flex items-center gap-3">
                                    {section.id === 'live' && <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
                                    {section.title}
                                </h3>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    {section.data?.length || 0} {(section.data?.length || 0) === 1 ? 'публикация' : 'публикаций'}
                                </p>
                            </div>
                            {(section.data?.length || 0) > 3 && (
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-2" onClick={() => {
                                        const el = document.getElementById(`scroll-${section.id}`);
                                        if (el) el.scrollBy({ left: -400, behavior: 'smooth' });
                                    }}>
                                        <ArrowRight className="h-4 w-4 rotate-180" />
                                    </Button>
                                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-2" onClick={() => {
                                        const el = document.getElementById(`scroll-${section.id}`);
                                        if (el) el.scrollBy({ left: 400, behavior: 'smooth' });
                                    }}>
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div id={`scroll-${section.id}`} className="flex gap-3 overflow-x-auto pb-8 no-scrollbar snap-x snap-mandatory px-2">
                            {section.type === 'live' && (section.data as any[]).map((item, i) => (
                                <div key={item.id || `live-${i}`} className="w-[340px] shrink-0 snap-start">
                                    <div className="group relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg cursor-pointer">
                                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                        <div className="absolute top-4 left-6 flex items-center gap-2">
                                            {item.status === 'live' ? (
                                                <Badge className="bg-red-500 text-white border-none animate-pulse flex items-center gap-1.5 px-3 py-1.5">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-white" /> LIVE NOW
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-accent text-white border-none flex items-center gap-1.5 px-3 py-1.5 text-[8px]">
                                                    <Calendar className="h-3 w-3" /> PLANNED
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="absolute bottom-8 left-8 right-8">
                                            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">{item.date}</span>
                                            <h4 className="text-white font-black text-base leading-tight uppercase tracking-tight line-clamp-1">{item.title}</h4>
                                            <Button 
                                                onClick={() => {
                                                    if (item.status === 'live') {
                                                        setSelectedEvent(item);
                                                        setIsLivePlayerOpen(true);
                                                    } else {
                                                        setIsLiveReminderOpen(true);
                                                    }
                                                }}
                                                className={cn("mt-4 w-full rounded-xl h-10 font-black uppercase text-[10px] tracking-widest", item.status === 'live' ? "bg-red-500 text-white hover:bg-red-600" : "bg-white text-black hover:bg-white/90")}
                                            >
                                                {item.status === 'live' ? 'Смотреть' : 'Напомнить'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {section.type === 'events' && (section.data as any[]).map((item, i) => (
                                <div key={item.id || `event-${i}`} className="w-[340px] shrink-0 snap-start">
                                    <div className="group relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg cursor-pointer">
                                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                        <div className="absolute top-4 left-6">
                                            <Badge className="bg-white/20 backdrop-blur-md text-white border-none px-3 py-1.5 text-[8px] font-black uppercase tracking-widest">{item.type}</Badge>
                                        </div>
                                        <div className="absolute bottom-8 left-8 right-8">
                                            <div className="flex items-center gap-3 mb-2 text-white/70">
                                                <Calendar className="h-3 w-3" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.date}</span>
                                            </div>
                                            <h4 className="text-white font-black text-base leading-tight uppercase tracking-tight line-clamp-1 mb-1">{item.title}</h4>
                                            <p className="text-white/60 text-[9px] font-bold flex items-center gap-1.5 uppercase"><MapPin className="h-2.5 w-2.5" /> {item.location}</p>
                                            <Button 
                                                onClick={() => handleEventRegistration(item.id, item.type)}
                                                className={cn("mt-4 w-full rounded-xl h-10 font-black uppercase text-[10px] tracking-widest shadow-lg", registeredEvents.includes(item.id) ? "bg-green-500 text-white" : "bg-white text-black")}
                                            >
                                                {registeredEvents.includes(item.id) ? <span className="flex items-center gap-2"><Check className="h-3.5 w-3.5" /> {item.type === 'Мероприятие' ? 'Вы записаны' : 'Запрос отправлен'}</span> : (item.type === 'Мероприятие' ? 'Записаться' : item.type === 'Fashion Show' ? 'Получить приглашение' : 'Хочу посетить')}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {section.type === 'live_archive' && (section.data as any[]).map((item, i) => (
                                <div key={item.id || `archive-${i}`} className="w-[300px] shrink-0 snap-start">
                                    <div className="group relative aspect-video rounded-xl overflow-hidden shadow-md cursor-pointer border border-muted/20">
                                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 group-hover:scale-110">
                                                <PlayCircle className="h-6 w-6 fill-current" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-3 left-4 right-4">
                                            <p className="text-white font-black uppercase text-xs tracking-tight leading-tight">{item.title}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-white/70 text-[9px] font-bold uppercase tracking-widest">{item.date}</p>
                                                <Badge className="bg-accent/80 text-white border-none text-[8px] font-black">{item.items} товаров</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {section.type === 'blog' && (section.data as any[]).map((item, i) => (
                                <div key={item.id || `blog-${i}`} className="w-[340px] shrink-0 snap-start">
                                    <Card className="group overflow-hidden rounded-xl border-none shadow-md hover:shadow-xl cursor-pointer h-full active:scale-[0.98]" onClick={() => setSelectedBlog(item)}>
                                        <div className="relative aspect-[16/10] overflow-hidden">
                                            <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-110" />
                                            <Badge className="absolute top-4 left-4 bg-accent text-white border-none font-black text-[8px] uppercase tracking-[0.2em] px-2 py-1 rounded-full">{item.type}</Badge>
                                        </div>
                                        <CardContent className="p-4 bg-white">
                                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{item.date}</p>
                                            <h3 className="text-sm font-black leading-tight group-hover:text-accent transition-colors line-clamp-2 uppercase">{item.title}</h3>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}

                            {section.type === 'stories' && (section.data as any[]).map((story, i) => (
                                <div key={i} className="w-[240px] shrink-0 snap-start">
                                    <div className="group relative aspect-[9/16] rounded-xl overflow-hidden shadow-lg cursor-pointer" onClick={() => handleOpenStory(story, section.data as any[])}>
                                        <Image src={story.imageUrl} alt="Story" fill className="object-cover group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                        <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white group-hover:scale-110">
                                            <PlayCircle className="h-5 w-5" />
                                        </div>
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <Badge className="bg-red-500 text-white border-none mb-2 text-[7px] px-1.5 py-0.5">STORIES</Badge>
                                            <p className="text-white font-black text-base leading-tight uppercase line-clamp-2">{story.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {section.type === 'social' && (section.data as any[]).map((post, i) => (
                                <div key={post.id || `post-${i}`} className="w-[280px] shrink-0 snap-start">
                                    <Card className="group overflow-hidden rounded-xl border-none shadow-md bg-muted/5 h-full cursor-pointer active:scale-[0.98]" onClick={() => setSelectedSocial(post)}>
                                        <div className="relative aspect-square overflow-hidden">
                                            <Image src={post.imageUrl} alt="Social" fill className="object-cover group-hover:scale-105" />
                                            <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-white/90 shadow-md flex items-center justify-center">
                                                {post.platform === 'instagram' && <Instagram className="h-3.5 w-3.5 text-pink-600" />}
                                                {post.platform === 'telegram' && <Send className="h-3.5 w-3.5 text-blue-500" />}
                                                {post.platform === 'youtube' && <Youtube className="h-3.5 w-3.5 text-red-600" />}
                                            </div>
                                        </div>
                                        <CardContent className="p-3">
                                            {post.text && <p className="text-xs font-medium text-foreground/80 line-clamp-2 mb-3">{post.text}</p>}
                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-3 text-muted-foreground">
                                                    {post.likes && <div className="flex items-center gap-1.5 text-[10px] font-black"><Heart className="h-3 w-3" /> {post.likes}</div>}
                                                    {post.views && <div className="flex items-center gap-1.5 text-[10px] font-black"><Eye className="h-3 w-3" /> {post.views}</div>}
                                                </div>
                                                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{post.date}</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}

                            {section.type === 'video' && (section.data as any[]).map((vid, i) => (
                                <div key={vid.id || `vid-${i}`} className="w-[340px] shrink-0 snap-start">
                                    <div className="group relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg cursor-pointer active:scale-[0.98]" onClick={() => setSelectedStoryVideo(vid)}>
                                        <Image src={vid.imageUrl} alt={vid.title} fill className="object-cover group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-accent text-white flex items-center justify-center shadow-xl scale-90 group-hover:scale-100">
                                            <PlayCircle className="h-8 w-8 fill-current" />
                                        </div>
                                        <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <Badge className="border-none bg-blue-500 text-[7px] px-1.5 py-0.5">{vid.type}</Badge>
                                                    <span className="text-white text-[9px] font-black uppercase tracking-widest">{vid.duration}</span>
                                                </div>
                                                <h4 className="text-white font-black text-sm leading-tight uppercase line-clamp-1">{vid.title}</h4>
                                            </div>
                                            <span className="text-[8px] font-bold text-white/60 uppercase tracking-widest mb-1">{vid.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {section.type === 'mentions' && (section.data as any[]).map((mention, i) => (
                                <div key={mention.id || `mention-${i}`} className="w-[280px] shrink-0 snap-start">
                                    <Card className="group overflow-hidden rounded-xl border-none shadow-md bg-white p-1.5 h-full cursor-pointer active:scale-[0.98] hover:shadow-xl" onClick={() => setSelectedMention(mention)}>
                                        <div className="relative aspect-square rounded-[1.75rem] overflow-hidden">
                                            <Image src={mention.imageUrl} alt="Mention" fill className="object-cover" />
                                            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 pr-3 rounded-full shadow-md">
                                                <div className="h-6 w-6 rounded-full overflow-hidden border-2 border-accent"><Image src={mention.avatar} alt="user" width={24} height={24} /></div>
                                                <span className="text-[8px] font-black uppercase tracking-tight">@{mention.user}</span>
                                            </div>
                                        </div>
                                        <div className="p-3 flex items-center justify-between">
                                            <p className="text-[10px] font-bold italic text-muted-foreground leading-relaxed px-1 line-clamp-1 flex-1">"{mention.text}"</p>
                                            <span className="text-[7px] font-bold text-muted-foreground/60 uppercase tracking-tighter shrink-0 ml-2">{mention.date}</span>
                                        </div>
                                    </Card>
                                </div>
                            ))}

                            {section.type === 'press' && (section.data as any[]).map((article, i) => (
                                <div key={article.id || `press-${i}`} className="w-[320px] shrink-0 snap-start">
                                    <Card className="group overflow-hidden rounded-xl border border-muted/20 hover:border-accent/20 bg-white flex flex-col h-full shadow-sm hover:shadow-lg cursor-pointer active:scale-[0.98]" onClick={() => setSelectedPress(article)}>
                                        <div className="relative aspect-[16/9] overflow-hidden bg-muted/10">
                                            <Image src={article.imageUrl} alt={article.title} fill className="object-cover opacity-80 group-hover:opacity-100" />
                                            {article.logoUrl && (
                                                <div className="absolute bottom-3 left-4 h-5 w-20 bg-white/90 backdrop-blur-md px-2 rounded-md flex items-center justify-center">
                                                    <img src={article.logoUrl} alt={article.name} className="max-h-3 object-contain grayscale" />
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-3 flex-1 flex flex-col justify-between">
                                            <div>
                                                <p className="text-[8px] font-bold text-accent uppercase tracking-widest mb-1.5">{article.name} • {article.date}</p>
                                                <h4 className="text-base font-black leading-snug group-hover:text-accent transition-colors line-clamp-2 uppercase">{article.title}</h4>
                                            </div>
                                            <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-accent font-black text-[8px] uppercase tracking-[0.2em] mt-4 self-start">
                                                Открыть <ArrowRight className="ml-1 h-2.5 w-2.5" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </TabsContent>
    );
}
