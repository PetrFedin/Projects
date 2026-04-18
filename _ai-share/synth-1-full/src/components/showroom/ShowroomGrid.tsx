'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Calendar,
  Globe2,
  MapPin,
  Zap,
  LineChart,
  MessageSquare,
  Layers,
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  Camera,
  Maximize2,
  ArrowLeft,
  Minus,
  Library,
  Heart,
  GitCompare,
  Share2,
  Check,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { SynthaProductCard } from '@/components/syntha-product-card';
import { cn } from '@/lib/cn';
import type { Product } from '@/lib/types';
import { useUIState } from '@/providers/ui-state';
import { useAuth } from '@/providers/auth-provider';
import { useToast } from '@/hooks/use-toast';

interface ShowroomGridProps {
  viewRole: string;
  showroomTab: string;
  showroomViewMode: string;
  filteredShowroomProducts: Product[];
  totalLookCards: any[];
  isLinesheetMode: boolean;
  selectedLinesheetItems: string[];
  setSelectedLinesheetItems: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedLook: (look: any) => void;
  setIsLookDetailsOpen: (open: boolean) => void;
  router: any;
  currency: string;
}

// 4. Sub-component for Look Cards
const LookCard = ({
  look,
  setSelectedLook,
  setIsLookDetailsOpen,
}: {
  look: any;
  setSelectedLook: (look: any) => void;
  setIsLookDetailsOpen: (open: boolean) => void;
}) => {
  const {
    wishlist,
    addWishlistItem,
    wishlistCollections,
    lookboards,
    addWishlistCollection,
    addLookboard,
    saveComparison,
    savedComparisons,
    comparisonList,
    toggleComparisonItem,
  } = useUIState();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [lookMode, setLookMode] = React.useState<'gallery' | 'view'>('view');
  const [galleryViewMode, setGalleryViewMode] = React.useState<'photo' | 'video'>('photo');
  const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false);
  const [isVideoExpanded, setIsVideoExpanded] = React.useState(false);
  const [isUserActive, setIsUserActive] = React.useState(false);

  const [activeIconIndex, setActiveIconIndex] = React.useState(0);
  const [hoveredIconIndex, setHoveredIconIndex] = React.useState<number | null>(null);
  const [isPaused, setIsPaused] = React.useState(false);
  const [menuOpenIdx, setMenuOpenIdx] = React.useState<number | null>(null);
  const [isCreatingNewCollection, setIsCreatingNewCollection] = React.useState(false);
  const [newCollectionName, setNewCollectionName] = React.useState('');

  const isWishlisted = wishlist.some((item) => item.id === look.id);
  const isInComparison = comparisonList.some((item) => item.id === look.id);

  // Auto-highlight icons every 8 seconds (like in product card)
  React.useEffect(() => {
    if (lookMode !== 'view' || isPaused) {
      if (lookMode !== 'view') setActiveIconIndex(-1);
      return;
    }
    const interval = setInterval(() => {
      setActiveIconIndex((prev) => (prev + 1) % 3);
    }, 8000);
    return () => clearInterval(interval);
  }, [lookMode, isPaused]);

  // Auto-switch to Mode 2 (View) after 15 seconds of inactivity
  React.useEffect(() => {
    if (lookMode === 'view' || isUserActive) return;

    const timer = setTimeout(() => {
      setLookMode('view');
    }, 15000);

    return () => clearTimeout(timer);
  }, [lookMode, isUserActive]);

  const images = look.gallery && look.gallery.length > 0 ? look.gallery : [look.imageUrl];
  const hasMultipleImages = images.length > 1;
  const videos = look.videoUrls || [];

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextVideo = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (videos.length > 1) {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      setIsVideoPlaying(true);
    }
  };

  const handlePrevVideo = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (videos.length > 1) {
      setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
      setIsVideoPlaying(true);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group/look relative w-64 flex-shrink-0 snap-start"
      onMouseEnter={() => setIsUserActive(true)}
      onMouseLeave={() => setIsUserActive(false)}
    >
<<<<<<< HEAD
      <Card className="group/look relative flex h-full flex-col overflow-hidden rounded-3xl border-none bg-slate-50 transition-all duration-500 hover:shadow-2xl">
        <div className="relative aspect-[3/3.8] flex-1 overflow-hidden rounded-3xl bg-slate-50 shadow-inner">
=======
      <Card className="bg-bg-surface2 group/look relative flex h-full flex-col overflow-hidden rounded-3xl border-none transition-all duration-500 hover:shadow-2xl">
        <div className="bg-bg-surface2 relative aspect-[3/3.8] flex-1 overflow-hidden rounded-3xl shadow-inner">
>>>>>>> recover/cabinet-wip-from-stash
          <AnimatePresence mode="wait">
            {lookMode === 'gallery' ? (
              <motion.div
                key="gallery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {/* Mode 1: GALLERY CONTENT */}
                <div className="relative h-full w-full">
                  {/* Back Button */}
                  <div className="absolute right-4 top-4 z-40">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setLookMode('view');
                      }}
                      className="p-1 text-white drop-shadow-lg transition-all hover:scale-110"
                    >
                      <ArrowRight className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="absolute left-1/2 top-4 z-30 flex -translate-x-1/2 gap-1 rounded-full border border-white/10 bg-black/40 p-1 shadow-xl backdrop-blur-md">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setGalleryViewMode('photo');
                      }}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-4 py-1.5 transition-all duration-300',
                        galleryViewMode === 'photo'
                          ? 'bg-white text-black shadow-lg'
                          : 'text-white/60 hover:text-white'
                      )}
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Photo</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setGalleryViewMode('video');
                      }}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-4 py-1.5 transition-all duration-300',
                        galleryViewMode === 'video'
                          ? 'bg-white text-black shadow-lg'
                          : 'text-white/60 hover:text-white'
                      )}
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Video</span>
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {galleryViewMode === 'photo' ? (
                      <motion.div
                        key="photo"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 z-0"
                      >
                        <img
                          src={images[currentImageIndex]}
                          alt={look.title}
                          className="h-full w-full object-cover transition-transform duration-1000 group-hover/look:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        {/* Photo Navigation Arrows */}
                        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-between px-3">
                          <motion.button
                            animate={
                              images.length > 1
                                ? { opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }
                                : { opacity: 0.2 }
                            }
                            transition={{ repeat: Infinity, duration: 2 }}
                            whileHover={
                              images.length > 1
                                ? {
                                    scale: 1.15,
                                    opacity: 1,
                                    color: '#000',
                                    backgroundColor: '#fff',
                                  }
                                : {}
                            }
                            disabled={images.length <= 1}
                            onClick={handlePrev}
                            className={cn(
                              'pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white shadow-xl backdrop-blur-md transition-all',
                              images.length > 1 ? 'cursor-pointer' : 'cursor-default'
                            )}
                          >
                            <ChevronLeft className="h-4 w-4" strokeWidth={3} />
                          </motion.button>
                          <motion.button
                            animate={
                              images.length > 1
                                ? { opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }
                                : { opacity: 0.2 }
                            }
                            transition={{ repeat: Infinity, duration: 2 }}
                            whileHover={
                              images.length > 1
                                ? {
                                    scale: 1.15,
                                    opacity: 1,
                                    color: '#000',
                                    backgroundColor: '#fff',
                                  }
                                : {}
                            }
                            disabled={images.length <= 1}
                            onClick={handleNext}
                            className={cn(
                              'pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white shadow-xl backdrop-blur-md transition-all',
                              images.length > 1 ? 'cursor-pointer' : 'cursor-default'
                            )}
                          >
                            <ChevronRight className="h-4 w-4" strokeWidth={3} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="video"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group/video-container absolute inset-0 z-0 overflow-hidden bg-black"
                      >
                        {/* Video Background or Actual Video */}
                        {isVideoPlaying ? (
                          <video
                            key={videos[currentVideoIndex]?.url}
                            src={videos[currentVideoIndex]?.url}
                            className="h-full w-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={images[1] || images[0]}
                            alt="Video background"
                            className="h-full w-full scale-110 object-cover opacity-60 blur-sm"
                          />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                        {/* Central Controls */}
                        <div
                          className={cn(
                            'absolute inset-0 z-20 flex flex-col items-center justify-center transition-all duration-500',
                            isVideoPlaying
                              ? 'bg-black/20 opacity-0 group-hover/video-container:opacity-100'
                              : 'opacity-100'
                          )}
                        >
                          <div className="relative z-20 flex w-full items-center justify-center gap-3 px-4">
                            {/* Like Button */}
                            <TooltipProvider>
                              <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (isWishlisted) {
                                        toast({
                                          title: 'Удалено',
                                          description: 'Образ удален из коллекции.',
                                        });
                                      } else {
                                        addWishlistItem(look, 'default');
                                        toast({
                                          title: 'Добавлено',
                                          description: 'Образ сохранен в вашей коллекции.',
                                        });
                                      }
                                    }}
                                    className={cn(
                                      'flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg border shadow-xl backdrop-blur-md transition-all duration-300',
                                      isWishlisted
                                        ? 'border-rose-400 bg-rose-500 text-white'
                                        : 'border-white/10 bg-black/40 text-white hover:bg-white hover:text-black'
                                    )}
                                  >
                                    <Heart
                                      className={cn(
                                        'h-3 w-3 transition-transform',
                                        isWishlisted && 'fill-current'
                                      )}
                                    />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="top"
                                  className="rounded-md border-none bg-black px-2 py-1 text-[7px] font-black uppercase tracking-widest text-white"
                                >
                                  Нравится
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {/* Play Button */}
                            <div className="group/play relative">
                              <div className="absolute inset-[-6px] scale-110 rounded-full border border-white/20 transition-transform duration-500 group-hover/play:scale-125" />
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setIsVideoPlaying(!isVideoPlaying);
                                }}
                                className="relative z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-black shadow-2xl transition-transform hover:scale-105"
                              >
                                {isVideoPlaying ? (
                                  <Minus className="h-6 w-6" />
                                ) : (
                                  <Play className="ml-1 h-6 w-6 fill-current" />
                                )}
                              </button>
                            </div>

                            {/* Expand Button */}
                            <TooltipProvider>
                              <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setIsVideoExpanded(true);
                                    }}
                                    className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-black/40 text-white shadow-xl backdrop-blur-md transition-all hover:bg-white hover:text-black"
                                  >
                                    <Maximize2 className="h-3 w-3" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="top"
                                  className="rounded-md border-none bg-black px-2 py-1 text-[7px] font-black uppercase tracking-widest text-white"
                                >
                                  Развернуть
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>

                        {/* Video Navigation Arrows */}
                        {videos.length > 1 && (
                          <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-between px-3">
                            <motion.button
                              animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              whileHover={{
                                scale: 1.15,
                                opacity: 1,
                                color: '#000',
                                backgroundColor: '#fff',
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handlePrevVideo(e);
                              }}
                              className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white shadow-xl backdrop-blur-md transition-all"
                            >
                              <ChevronLeft className="h-4 w-4" strokeWidth={3} />
                            </motion.button>
                            <motion.button
                              animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              whileHover={{
                                scale: 1.15,
                                opacity: 1,
                                color: '#000',
                                backgroundColor: '#fff',
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleNextVideo(e);
                              }}
                              className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white shadow-xl backdrop-blur-md transition-all"
                            >
                              <ChevronRight className="h-4 w-4" strokeWidth={3} />
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : lookMode === 'view' ? (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {/* Mode 2: VIEW CONTENT (Original) */}
                <img
                  src={images[currentImageIndex]}
                  alt={look.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover/look:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover/look:opacity-90" />

                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center transition-opacity duration-500">
                  {/* Action Icons Area (Same as Product Card) */}
                  <div
                    className="relative mb-5 flex items-center justify-center gap-3"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    {[
                      {
                        icon: Library,
                        label: 'Образы',
                        active: lookboards?.some((lb) =>
                          lb.looks?.some((l: any) => l.id === look.id)
                        ),
                        collections: lookboards?.map((lb) => ({
                          id: lb.id,
                          name: lb.title,
                          items: lb.looks?.map((l) => ({ id: l.id })) || [],
                        })),
                        onAdd: (collId: string) => {
                          toast({
                            title: 'Добавлено в Образы',
                            description: `Лук добавлен в подборку.`,
                          });
                          setMenuOpenIdx(null);
                        },
                        onCreate: (name: string) => {
                          addLookboard(name, '');
                        },
                      },
                      {
                        icon: Heart,
                        label: 'Избранное',
                        active: isWishlisted,
                        collections: wishlistCollections,
                        onAdd: (collId: string) => {
                          toast({
                            title: 'Добавлено в Избранное',
                            description: `Лук добавлен в избранное.`,
                          });
                          setMenuOpenIdx(null);
                        },
                        onCreate: (name: string) => {
                          addWishlistCollection(name);
                        },
                      },
                      {
                        icon: GitCompare,
                        label: 'Сравнить',
                        active: isInComparison,
                        collections:
                          savedComparisons?.length > 0
                            ? savedComparisons
                            : [{ id: 'default', name: 'Основное сравнение' }],
                        onAdd: (collId: string) => {
                          toast({
                            title: isInComparison
                              ? 'Удалено из сравнения'
                              : 'Добавлено к сравнению',
                          });
                          setMenuOpenIdx(null);
                        },
                        onCreate: (name: string) => {
                          saveComparison(name);
                        },
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="relative">
                        <AnimatePresence>
                          {isPaused && hoveredIconIndex === idx && menuOpenIdx !== idx && (
                            <motion.div
                              initial={{ opacity: 0, y: 5, x: '-50%', scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                              exit={{ opacity: 0, y: 5, x: '-50%', scale: 0.8 }}
                              className="pointer-events-none absolute bottom-full left-1/2 z-[60] mb-2 whitespace-nowrap rounded-md border-none bg-black/90 px-2 py-1 text-[7px] font-black uppercase tracking-[0.2em] text-white shadow-2xl backdrop-blur-md"
                            >
                              {item.label}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <Popover
                          open={menuOpenIdx === idx}
                          onOpenChange={(open) => {
                            setMenuOpenIdx(open ? idx : null);
                            if (!open) {
                              setIsCreatingNewCollection(false);
                              setNewCollectionName('');
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <motion.button
                              animate={{
                                scale: (
                                  isPaused ? hoveredIconIndex === idx : activeIconIndex === idx
                                )
                                  ? 1.5
                                  : 1,
                                backgroundColor:
                                  (isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) ||
                                  item.active
                                    ? '#fff'
                                    : 'rgba(255,255,255,0.1)',
                                color:
                                  (isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) ||
                                  item.active
                                    ? '#000'
                                    : '#fff',
                              }}
                              onMouseEnter={() => setHoveredIconIndex(idx)}
                              onMouseLeave={() => setHoveredIconIndex(null)}
                              transition={{ duration: 0.5 }}
                              className={cn(
                                'z-20 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-white/10 shadow-sm backdrop-blur-md transition-all',
                                ((isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) ||
                                  item.active) &&
                                  'ring-1 ring-white/50'
                              )}
                            >
                              <item.icon className={cn('h-3 w-3', item.active && 'fill-current')} />
                            </motion.button>
                          </PopoverTrigger>
                          <PopoverContent
                            side="top"
                            align="center"
                            sideOffset={15}
<<<<<<< HEAD
                            className="z-[100] w-[160px] overflow-hidden rounded-xl border border-white/10 bg-zinc-900/95 p-0 shadow-2xl backdrop-blur-xl"
=======
                            className="bg-text-primary/95 z-[100] w-[160px] overflow-hidden rounded-xl border border-white/10 p-0 shadow-2xl backdrop-blur-xl"
>>>>>>> recover/cabinet-wip-from-stash
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex flex-col gap-1 p-1">
                              <p className="mb-1 border-b border-white/5 px-2 py-1 text-[7px] font-black uppercase tracking-widest text-white/40">
                                {item.label}
                              </p>

                              {isCreatingNewCollection ? (
                                <div className="flex flex-col gap-2 p-2">
                                  <input
                                    autoFocus
                                    type="text"
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    placeholder="Название..."
<<<<<<< HEAD
                                    className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[9px] text-white focus:border-indigo-500/50 focus:outline-none"
=======
                                    className="focus:border-accent-primary/50 w-full rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[9px] text-white focus:outline-none"
>>>>>>> recover/cabinet-wip-from-stash
                                  />
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => {
                                        if (newCollectionName.trim()) {
                                          item.onCreate?.(newCollectionName.trim());
                                          setIsCreatingNewCollection(false);
                                          setNewCollectionName('');
                                        }
                                      }}
<<<<<<< HEAD
                                      className="flex-1 rounded-md bg-indigo-500 py-1 text-[8px] font-black uppercase text-white transition-colors hover:bg-indigo-600"
=======
                                      className="bg-accent-primary hover:bg-accent-primary flex-1 rounded-md py-1 text-[8px] font-black uppercase text-white transition-colors"
>>>>>>> recover/cabinet-wip-from-stash
                                    >
                                      Ок
                                    </button>
                                    <button
                                      onClick={() => setIsCreatingNewCollection(false)}
                                      className="flex-1 rounded-md bg-white/5 py-1 text-[8px] font-black uppercase text-white transition-colors hover:bg-white/10"
                                    >
                                      Отмена
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="no-scrollbar max-h-[120px] overflow-y-auto">
                                    {item.collections.map((coll: any) => (
                                      <button
                                        key={coll.id}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          item.onAdd?.(coll.id);
                                        }}
                                        className="group/item flex w-full items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-white/10"
                                      >
                                        <span className="max-w-[110px] truncate text-[9px] font-bold text-white/80 group-hover/item:text-white">
                                          {coll.name}
                                        </span>
                                        {coll.items?.some((i: any) => i.id === look.id) && (
                                          <Check className="h-2 w-2 text-emerald-500" />
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                  <button
                                    onClick={() => setIsCreatingNewCollection(true)}
<<<<<<< HEAD
                                    className="mt-1 flex w-full items-center gap-2 rounded-md border-t border-white/5 px-2 py-1.5 pt-2 transition-colors hover:bg-indigo-500/20"
                                  >
                                    <Plus className="h-2 w-2 text-indigo-400" />
                                    <span className="text-[8px] font-black uppercase text-indigo-400">
=======
                                    className="hover:bg-accent-primary/20 mt-1 flex w-full items-center gap-2 rounded-md border-t border-white/5 px-2 py-1.5 pt-2 transition-colors"
                                  >
                                    <Plus className="text-accent-primary h-2 w-2" />
                                    <span className="text-accent-primary text-[8px] font-black uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                                      Создать новую
                                    </span>
                                  </button>
                                </>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    ))}
                  </div>

                  <div className="flex w-full items-center justify-center gap-1.5">
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setLookMode('gallery');
                      }}
                      className="h-8 rounded-xl border-[0.33px] border-white/10 bg-white/5 px-2.5 text-[7px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/30 hover:shadow-lg hover:shadow-white/5"
                    >
                      <ArrowLeft className="mr-1.5 h-2 w-2" /> Медиа
                    </Button>
                    <Link href={`/looks/${look.id}`}>
                      <Button className="h-8 rounded-xl border-[0.33px] border-white/10 bg-white/5 px-4 text-[7px] font-black uppercase tracking-widest text-white transition-all hover:bg-white/30 hover:shadow-lg hover:shadow-white/5">
                        К образу
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between transition-transform duration-500 group-hover/look:translate-y-[-10px]">
            <div className="space-y-1 text-left">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/50">
                {look.author}
              </p>
              <h4 className="text-base font-black uppercase leading-none tracking-tight text-white">
                {look.title}
              </h4>
            </div>
            <Badge className="border-none bg-white/10 px-3 py-1 text-[10px] font-black text-white backdrop-blur-md">
              {look.price?.toLocaleString('ru-RU')}₽
            </Badge>
          </div>
        </div>
      </Card>

      {/* Mode Switcher Dots (Like in Product Card) */}
      <div className="mt-3 flex items-center justify-center gap-2 pb-1">
        {[
          { id: 'gallery', label: 'Медиа' },
          { id: 'view', label: 'Образ' },
        ].map((mode) => (
          <TooltipProvider key={mode.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setLookMode(mode.id as any)}
                  className={cn(
                    'h-1.5 w-1.5 rounded-full transition-all duration-300',
                    lookMode === mode.id
                      ? 'scale-125 bg-black shadow-[0_0_10px_rgba(0,0,0,0.2)]'
<<<<<<< HEAD
                      : 'bg-slate-200 hover:bg-slate-400'
=======
                      : 'bg-border-subtle hover:bg-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                  )}
                />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
<<<<<<< HEAD
                className="rounded-md border-none bg-slate-900 px-2 py-1 text-[8px] font-black uppercase tracking-widest text-white"
=======
                className="bg-text-primary rounded-md border-none px-2 py-1 text-[8px] font-black uppercase tracking-widest text-white"
>>>>>>> recover/cabinet-wip-from-stash
              >
                {mode.label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Expanded Video Dialog */}
      <Dialog open={isVideoExpanded} onOpenChange={setIsVideoExpanded}>
        <DialogContent className="h-[80vh] overflow-hidden rounded-xl border-none bg-black p-0 sm:max-w-[500px]">
          <DialogHeader className="sr-only">
            <DialogTitle>Просмотр видео</DialogTitle>
          </DialogHeader>
          <div className="relative flex h-full w-full items-center justify-center bg-black">
            {videos[currentVideoIndex] && (
              <video
                src={videos[currentVideoIndex].url}
                className="h-full w-full object-contain"
                autoPlay
                loop
                controls
                playsInline
              />
            )}

            {/* Overlay Info */}
            <div className="absolute bottom-10 left-10 right-10 z-20">
              <div className="flex flex-col gap-2">
                <Badge className="w-fit border-none bg-white/10 px-2 py-0.5 text-[8px] font-black uppercase text-white backdrop-blur-md">
                  {videos[currentVideoIndex]?.label || 'Video Preview'}
                </Badge>
                <h3 className="text-sm font-black uppercase leading-none tracking-tighter text-white">
                  {look.title}
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                  {look.author}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export const ShowroomGrid: React.FC<ShowroomGridProps> = ({
  viewRole,
  showroomTab,
  showroomViewMode,
  filteredShowroomProducts,
  totalLookCards,
  isLinesheetMode,
  selectedLinesheetItems,
  setSelectedLinesheetItems,
  setSelectedLook,
  setIsLookDetailsOpen,
  router,
  currency,
}) => {
  const { user } = useAuth();

  const effectiveRole = React.useMemo(() => {
    if (!user?.roles) return 'brand';
    const roles = user.roles as string[];
    if (roles.includes('admin')) return 'admin';
    if (roles.includes('brand')) return 'brand';
    if (roles.includes('manufacturer')) return 'manufacturer';
    if (roles.includes('supplier')) return 'supplier';
    if (roles.includes('distributor')) return 'distributor';
    if (roles.includes('shop')) return 'shop';
    return 'brand';
  }, [user]);

  const getShowroomB2BLink = (type: 'kick' | 'look') => {
    const role = effectiveRole;
    if (role === 'admin') return '/admin/promotions';
    if (role === 'brand') return '/brand/promotions';
    if (role === 'distributor') return '/distributor/matrix';
    if (role === 'shop') return '/shop/promotions';
    return '/brand/promotions';
  };

  // 1. Tab: Kickstarter
  if (showroomTab === 'kickstarter') {
    return (
      <>
        {[
          {
            id: 'k1',
            title: 'Recycled Ocean Hoodie',
            brand: 'Nordic Wool',
            goal: 500,
            current: 342,
            days: 12,
            price_current: 45,
            price_target: 38,
            type: 'Limited Drop',
            stage: 'Sourcing Fabric',
            img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800',
            thresholds: [150, 300, 450],
          },
          {
            id: 'k2',
            title: 'Smart Heat Jacket',
            brand: 'Syntha Lab',
            goal: 200,
            current: 185,
            days: 5,
            price_current: 120,
            price_target: 95,
            type: 'Best-seller Reload',
            stage: 'Sample Ready',
            img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800',
            thresholds: [50, 100, 150],
          },
        ].map((kick) => (
          <motion.div
            key={kick.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-[280px] flex-shrink-0 snap-start"
          >
<<<<<<< HEAD
            <div className="group/kick relative rounded-[1.5rem] border border-slate-100 bg-white p-3 shadow-lg">
=======
            <div className="border-border-subtle group/kick relative rounded-[1.5rem] border bg-white p-3 shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
              <div className="relative mb-3 aspect-square">
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <img
                    src={kick.img}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover/kick:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <div className="absolute left-2.5 top-2.5 z-20 flex flex-col gap-1">
<<<<<<< HEAD
                  <Badge className="border-none bg-indigo-600 px-2 py-0.5 text-[6px] font-black uppercase text-white shadow-lg">
=======
                  <Badge className="bg-accent-primary border-none px-2 py-0.5 text-[6px] font-black uppercase text-white shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
                    {kick.type}
                  </Badge>
                  <Badge className="border-none bg-emerald-500 px-2 py-0.5 text-[6px] font-black uppercase text-white shadow-lg">
                    Early Bird Price
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
<<<<<<< HEAD
                <h4 className="mb-0.5 text-xs font-black uppercase tracking-tight text-slate-900">
                  {kick.title}
                </h4>
                <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400">
                  {kick.brand}
                </p>
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-slate-400 line-through">
                      ${kick.price_current}
                    </span>
                    <ArrowRight className="h-1.5 w-1.5 text-indigo-500" />
                    <span className="text-xs font-black text-indigo-600">${kick.price_target}</span>
=======
                <h4 className="text-text-primary mb-0.5 text-xs font-black uppercase tracking-tight">
                  {kick.title}
                </h4>
                <p className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
                  {kick.brand}
                </p>
                <div className="bg-bg-surface2 border-border-subtle flex items-center justify-between rounded-xl border p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-text-muted text-[10px] font-black line-through">
                      ${kick.price_current}
                    </span>
                    <ArrowRight className="text-accent-primary h-1.5 w-1.5" />
                    <span className="text-accent-primary text-xs font-black">
                      ${kick.price_target}
                    </span>
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
                    <span className="text-[7px] font-black uppercase tracking-widest text-emerald-600">
                      Active
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-end justify-between">
<<<<<<< HEAD
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-900">
                      {kick.current} / {kick.goal} ед.
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-indigo-600">
                      {Math.round((kick.current / kick.goal) * 100)}%
                    </p>
                  </div>
                  <div className="relative h-1 w-full rounded-full bg-slate-100">
                    <div
                      className="relative z-10 h-full rounded-full bg-indigo-600"
=======
                    <p className="text-text-primary text-[9px] font-black uppercase tracking-widest">
                      {kick.current} / {kick.goal} ед.
                    </p>
                    <p className="text-accent-primary text-[9px] font-black uppercase tracking-widest">
                      {Math.round((kick.current / kick.goal) * 100)}%
                    </p>
                  </div>
                  <div className="bg-bg-surface2 relative h-1 w-full rounded-full">
                    <div
                      className="bg-accent-primary relative z-10 h-full rounded-full"
>>>>>>> recover/cabinet-wip-from-stash
                      style={{ width: `${(kick.current / kick.goal) * 100}%` }}
                    />
                    {/* Divisions */}
                    {kick.thresholds.map((t) => (
                      <div
                        key={t}
                        className="absolute bottom-0 top-0 z-20 w-px bg-white/40"
                        style={{ left: `${(t / kick.goal) * 100}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-center pt-1">
                    <Button
                      onClick={() =>
                        viewRole === 'b2b' ? router.push(getShowroomB2BLink('kick')) : null
                      }
<<<<<<< HEAD
                      className="hover:button-glimmer hover:button-professional group/btn h-9 w-[180px] rounded-xl border border-slate-200 bg-white text-[9px] font-black uppercase text-slate-400 transition-all duration-500 hover:border-black hover:bg-black hover:text-white"
=======
                      className="text-text-muted border-border-default hover:button-glimmer hover:button-professional group/btn h-9 w-[180px] rounded-xl border bg-white text-[9px] font-black uppercase transition-all duration-500 hover:border-black hover:bg-black hover:text-white"
>>>>>>> recover/cabinet-wip-from-stash
                    >
                      Участвовать
                      <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </>
    );
  }

  // 3. Tab: Marketroom (Showcase) or Outlet
  if (showroomViewMode === 'products') {
    const displayProducts =
      showroomTab === 'all' || showroomTab === 'outlet'
        ? filteredShowroomProducts.slice(0, 2)
        : filteredShowroomProducts;

    return (
      <>
        {displayProducts.map((p) => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="w-60 flex-shrink-0 snap-start"
          >
<<<<<<< HEAD
            <SynthaProductCard
              product={p}
              viewRole={viewRole as any}
              isLinesheetMode={isLinesheetMode}
              isSelected={selectedLinesheetItems.includes(p.id)}
              onToggleSelect={(productId) => {
                setSelectedLinesheetItems((prev) =>
                  prev.includes(productId)
                    ? prev.filter((id) => id !== productId)
                    : [...prev, productId]
                );
              }}
            />
=======
            <SynthaProductCard product={p} />
>>>>>>> recover/cabinet-wip-from-stash
          </motion.div>
        ))}
      </>
    );
  }

  // Default: Looks (totalLookCards)
  return (
    <>
      {totalLookCards.map((look) => (
        <LookCard
          key={look.id}
          look={look}
          setSelectedLook={setSelectedLook}
          setIsLookDetailsOpen={setIsLookDetailsOpen}
        />
      ))}
    </>
  );
};
