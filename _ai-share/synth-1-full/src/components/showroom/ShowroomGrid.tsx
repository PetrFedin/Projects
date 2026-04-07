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
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { SynthaProductCard } from '@/components/syntha-product-card';
import { cn } from '@/lib/cn';
import { Product } from '@/types/views';
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
  setIsLookDetailsOpen 
}: { 
  look: any, 
  setSelectedLook: (look: any) => void, 
  setIsLookDetailsOpen: (open: boolean) => void 
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
    toggleComparisonItem
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

  const isWishlisted = wishlist.some(item => item.id === look.id);
  const isInComparison = comparisonList.some(item => item.id === look.id);

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
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextVideo = (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (videos.length > 1) {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      setIsVideoPlaying(true);
    }
  };

  const handlePrevVideo = (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
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
      className="flex-shrink-0 w-64 snap-start relative group/look"
      onMouseEnter={() => setIsUserActive(true)}
      onMouseLeave={() => setIsUserActive(false)}
    >
      <Card className="border-none rounded-3xl bg-slate-50 group/look hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col h-full">
        <div className="relative aspect-[3/3.8] rounded-3xl overflow-hidden shadow-inner bg-slate-50 flex-1">
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
                  <div className="absolute top-4 right-4 z-40">
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLookMode('view'); }}
                      className="text-white hover:scale-110 transition-all drop-shadow-lg p-1"
                    >
                      <ArrowRight className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex gap-1 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-xl">
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setGalleryViewMode('photo'); }}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all duration-300",
                        galleryViewMode === 'photo' ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"
                      )}
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <span className="text-[8px] font-black uppercase tracking-widest">Photo</span>
                    </button>
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setGalleryViewMode('video'); }}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all duration-300",
                        galleryViewMode === 'video' ? "bg-white text-black shadow-lg" : "text-white/60 hover:text-white"
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
                        <img src={images[currentImageIndex]} alt={look.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover/look:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        
                        {/* Photo Navigation Arrows */}
                        <div className="absolute inset-0 z-20 flex items-center justify-between px-3 pointer-events-none">
                          <motion.button 
                            animate={images.length > 1 ? { opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] } : { opacity: 0.2 }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            whileHover={images.length > 1 ? { scale: 1.15, opacity: 1, color: '#000', backgroundColor: '#fff' } : {}}
                            disabled={images.length <= 1}
                            onClick={handlePrev} 
                            className={cn(
                              "h-7 w-7 rounded-full flex items-center justify-center text-white bg-black/30 backdrop-blur-md border border-white/10 transition-all shadow-xl pointer-events-auto",
                              images.length > 1 ? "cursor-pointer" : "cursor-default"
                            )}
                          >
                            <ChevronLeft className="h-4 w-4" strokeWidth={3} />
                          </motion.button>
                          <motion.button 
                            animate={images.length > 1 ? { opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] } : { opacity: 0.2 }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            whileHover={images.length > 1 ? { scale: 1.15, opacity: 1, color: '#000', backgroundColor: '#fff' } : {}}
                            disabled={images.length <= 1}
                            onClick={handleNext} 
                            className={cn(
                              "h-7 w-7 rounded-full flex items-center justify-center text-white bg-black/30 backdrop-blur-md border border-white/10 transition-all shadow-xl pointer-events-auto",
                              images.length > 1 ? "cursor-pointer" : "cursor-default"
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
                        className="absolute inset-0 z-0 bg-black overflow-hidden group/video-container"
                      >
                        {/* Video Background or Actual Video */}
                        {isVideoPlaying ? (
                          <video 
                            key={videos[currentVideoIndex]?.url}
                            src={videos[currentVideoIndex]?.url}
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        ) : (
                          <img 
                            src={images[1] || images[0]} 
                            alt="Video background" 
                            className="w-full h-full object-cover opacity-60 scale-110 blur-sm"
                          />
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                        
                        {/* Central Controls */}
                        <div className={cn(
                          "absolute inset-0 z-20 flex flex-col items-center justify-center transition-all duration-500",
                          isVideoPlaying ? "opacity-0 group-hover/video-container:opacity-100 bg-black/20" : "opacity-100"
                        )}>
                          <div className="flex items-center justify-center gap-3 w-full px-4 relative z-20">
                            {/* Like Button */}
                            <TooltipProvider>
                              <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                  <button 
                                    onClick={(e) => { 
                                      e.preventDefault(); e.stopPropagation(); 
                                      if (isWishlisted) {
                                        toast({ title: "Удалено", description: "Образ удален из коллекции." });
                                      } else {
                                        addWishlistItem(look, 'default');
                                        toast({ title: "Добавлено", description: "Образ сохранен в вашей коллекции." });
                                      }
                                    }}
                                    className={cn(
                                      "h-6 w-6 rounded-lg backdrop-blur-md border transition-all duration-300 shadow-xl flex items-center justify-center cursor-pointer",
                                      isWishlisted 
                                        ? "bg-rose-500 border-rose-400 text-white" 
                                        : "bg-black/40 border-white/10 text-white hover:bg-white hover:text-black"
                                    )}
                                  >
                                    <Heart className={cn("h-3 w-3 transition-transform", isWishlisted && "fill-current")} />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-black text-white border-none text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                                  Нравится
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {/* Play Button */}
                            <div className="relative group/play">
                              <div className="absolute inset-[-6px] rounded-full border border-white/20 scale-110 group-hover/play:scale-125 transition-transform duration-500" />
                              <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsVideoPlaying(!isVideoPlaying); }}
                                className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center relative shadow-2xl hover:scale-105 transition-transform cursor-pointer z-30"
                              >
                                {isVideoPlaying ? <Minus className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current ml-1" />}
                              </button>
                            </div>

                            {/* Expand Button */}
                            <TooltipProvider>
                              <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                  <button 
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsVideoExpanded(true); }}
                                    className="h-6 w-6 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-xl cursor-pointer"
                                  >
                                    <Maximize2 className="h-3 w-3" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-black text-white border-none text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                                  Развернуть
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>

                        {/* Video Navigation Arrows */}
                        {videos.length > 1 && (
                          <div className="absolute inset-0 z-40 flex items-center justify-between px-3 pointer-events-none">
                            <motion.button 
                              animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              whileHover={{ scale: 1.15, opacity: 1, color: '#000', backgroundColor: '#fff' }}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePrevVideo(e); }}
                              className="h-7 w-7 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all shadow-xl pointer-events-auto"
                            >
                              <ChevronLeft className="h-4 w-4" strokeWidth={3} />
                            </motion.button>
                            <motion.button 
                              animate={{ opacity: [0.6, 0.9, 0.6], scale: [1, 1.05, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              whileHover={{ scale: 1.15, opacity: 1, color: '#000', backgroundColor: '#fff' }}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleNextVideo(e); }}
                              className="h-7 w-7 rounded-full bg-black/30 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all shadow-xl pointer-events-auto"
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
                <img src={images[currentImageIndex]} alt={look.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/look:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover/look:opacity-90 transition-opacity duration-500" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-500 z-30">
                  {/* Action Icons Area (Same as Product Card) */}
                  <div 
                    className="flex items-center justify-center gap-3 mb-5 relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    {[
                      { 
                        icon: Library, 
                        label: "Образы", 
                        active: lookboards?.some(lb => lb.looks?.some((l: any) => l.id === look.id)),
                        collections: lookboards?.map(lb => ({ 
                          id: lb.id, 
                          name: lb.title, 
                          items: lb.looks?.map(l => ({ id: l.id })) || [] 
                        })),
                        onAdd: (collId: string) => {
                          toast({ title: "Добавлено в Образы", description: `Лук добавлен в подборку.` });
                          setMenuOpenIdx(null);
                        },
                        onCreate: (name: string) => {
                          addLookboard(name, "");
                        }
                      },
                      { 
                        icon: Heart, 
                        label: "Избранное", 
                        active: isWishlisted,
                        collections: wishlistCollections,
                        onAdd: (collId: string) => {
                          toast({ title: "Добавлено в Избранное", description: `Лук добавлен в избранное.` });
                          setMenuOpenIdx(null);
                        },
                        onCreate: (name: string) => {
                          addWishlistCollection(name);
                        }
                      },
                      { 
                        icon: GitCompare, 
                        label: "Сравнить", 
                        active: isInComparison,
                        collections: savedComparisons?.length > 0 ? savedComparisons : [{ id: 'default', name: 'Основное сравнение' }],
                        onAdd: (collId: string) => {
                          toast({ title: isInComparison ? "Удалено из сравнения" : "Добавлено к сравнению" });
                          setMenuOpenIdx(null);
                        },
                        onCreate: (name: string) => {
                          saveComparison(name);
                        }
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="relative">
                        <AnimatePresence>
                          {isPaused && hoveredIconIndex === idx && menuOpenIdx !== idx && (
                            <motion.div
                              initial={{ opacity: 0, y: 5, x: "-50%", scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                              exit={{ opacity: 0, y: 5, x: "-50%", scale: 0.8 }}
                              className="absolute bottom-full mb-2 left-1/2 bg-black/90 backdrop-blur-md text-white text-[7px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-md border-none shadow-2xl whitespace-nowrap z-[60] pointer-events-none"
                            >
                              {item.label}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <Popover open={menuOpenIdx === idx} onOpenChange={(open) => {
                          setMenuOpenIdx(open ? idx : null);
                          if (!open) {
                            setIsCreatingNewCollection(false);
                            setNewCollectionName('');
                          }
                        }}>
                          <PopoverTrigger asChild>
                            <motion.button
                              animate={{ 
                                scale: (isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) ? 1.5 : 1,
                                backgroundColor: (isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) || item.active ? '#fff' : 'rgba(255,255,255,0.1)',
                                color: (isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) || item.active ? '#000' : '#fff'
                              }}
                              onMouseEnter={() => setHoveredIconIndex(idx)}
                              onMouseLeave={() => setHoveredIconIndex(null)}
                              transition={{ duration: 0.5 }}
                              className={cn(
                                "h-6 w-6 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-all shadow-sm cursor-pointer z-20",
                                ((isPaused ? hoveredIconIndex === idx : activeIconIndex === idx) || item.active) && "ring-1 ring-white/50"
                              )}
                            >
                              <item.icon className={cn("h-3 w-3", item.active && "fill-current")} />
                            </motion.button>
                          </PopoverTrigger>
                          <PopoverContent 
                            side="top" 
                            align="center" 
                            sideOffset={15}
                            className="w-[160px] bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-0 shadow-2xl z-[100] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex flex-col gap-1 p-1">
                              <p className="text-[7px] font-black uppercase tracking-widest text-white/40 px-2 py-1 border-b border-white/5 mb-1">
                                {item.label}
                              </p>
                              
                              {isCreatingNewCollection ? (
                                <div className="p-2 flex flex-col gap-2">
                                  <input
                                    autoFocus
                                    type="text"
                                    value={newCollectionName}
                                    onChange={(e) => setNewCollectionName(e.target.value)}
                                    placeholder="Название..."
                                    className="w-full bg-white/5 border border-white/10 rounded-md px-2 py-1 text-[9px] text-white focus:outline-none focus:border-indigo-500/50"
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
                                      className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white text-[8px] font-black uppercase py-1 rounded-md transition-colors"
                                    >
                                      Ок
                                    </button>
                                    <button
                                      onClick={() => setIsCreatingNewCollection(false)}
                                      className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[8px] font-black uppercase py-1 rounded-md transition-colors"
                                    >
                                      Отмена
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="max-h-[120px] overflow-y-auto no-scrollbar">
                                    {item.collections.map((coll: any) => (
                                      <button
                                        key={coll.id}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          item.onAdd?.(coll.id);
                                        }}
                                        className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-white/10 rounded-md transition-colors group/item"
                                      >
                                        <span className="text-[9px] font-bold text-white/80 group-hover/item:text-white truncate max-w-[110px]">{coll.name}</span>
                                        {coll.items?.some((i: any) => i.id === look.id) && (
                                          <Check className="h-2 w-2 text-emerald-500" />
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                  <button
                                    onClick={() => setIsCreatingNewCollection(true)}
                                    className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-indigo-500/20 rounded-md transition-colors mt-1 border-t border-white/5 pt-2"
                                  >
                                    <Plus className="h-2 w-2 text-indigo-400" />
                                    <span className="text-[8px] font-black uppercase text-indigo-400">Создать новую</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 w-full justify-center">
                    <Button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLookMode('gallery'); }}
                      className="px-2.5 h-8 rounded-xl bg-white/5 hover:bg-white/30 hover:shadow-lg hover:shadow-white/5 text-white border-[0.33px] border-white/10 font-black uppercase text-[7px] tracking-widest transition-all"
                    >
                      <ArrowLeft className="h-2 w-2 mr-1.5" /> Медиа
                    </Button>
                    <Link href={`/looks/${look.id}`}>
                      <Button 
                        className="px-4 h-8 rounded-xl bg-white/5 hover:bg-white/30 hover:shadow-lg hover:shadow-white/5 text-white border-[0.33px] border-white/10 font-black uppercase text-[7px] tracking-widest transition-all"
                      >
                        К образу
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20 group-hover/look:translate-y-[-10px] transition-transform duration-500">
            <div className="space-y-1 text-left">
              <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">{look.author}</p>
              <h4 className="text-base font-black text-white uppercase tracking-tight leading-none">{look.title}</h4>
            </div>
            <Badge className="bg-white/10 backdrop-blur-md text-white border-none font-black text-[10px] px-3 py-1">{look.price?.toLocaleString('ru-RU')}₽</Badge>
          </div>
        </div>
      </Card>

      {/* Mode Switcher Dots (Like in Product Card) */}
      <div className="flex justify-center items-center gap-2 mt-3 pb-1">
        {[
          { id: 'gallery', label: 'Медиа' },
          { id: 'view', label: 'Образ' }
        ].map((mode) => (
          <TooltipProvider key={mode.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setLookMode(mode.id as any)}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all duration-300",
                    lookMode === mode.id ? "bg-black shadow-[0_0_10px_rgba(0,0,0,0.2)] scale-125" : "bg-slate-200 hover:bg-slate-400"
                  )}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-slate-900 text-white border-none text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                {mode.label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Expanded Video Dialog */}
      <Dialog open={isVideoExpanded} onOpenChange={setIsVideoExpanded}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-black border-none rounded-xl h-[80vh]">
          <DialogHeader className="sr-only">
            <DialogTitle>Просмотр видео</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            {videos[currentVideoIndex] && (
              <video 
                src={videos[currentVideoIndex].url}
                className="w-full h-full object-contain"
                autoPlay
                loop
                controls
                playsInline
              />
            )}
            
            {/* Overlay Info */}
            <div className="absolute bottom-10 left-10 right-10 z-20">
              <div className="flex flex-col gap-2">
                <Badge className="bg-white/10 backdrop-blur-md text-white border-none w-fit font-black text-[8px] uppercase px-2 py-0.5">
                  {videos[currentVideoIndex]?.label || 'Video Preview'}
                </Badge>
                <h3 className="text-sm font-black text-white uppercase tracking-tighter leading-none">{look.title}</h3>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{look.author}</p>
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
  currency
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
  if (showroomTab === "kickstarter") {
    return (
      <>
        {[
          { id: "k1", title: "Recycled Ocean Hoodie", brand: "Nordic Wool", goal: 500, current: 342, days: 12, price_current: 45, price_target: 38, type: "Limited Drop", stage: "Sourcing Fabric", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800", thresholds: [150, 300, 450] },
          { id: "k2", title: "Smart Heat Jacket", brand: "Syntha Lab", goal: 200, current: 185, days: 5, price_current: 120, price_target: 95, type: "Best-seller Reload", stage: "Sample Ready", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800", thresholds: [50, 100, 150] },
        ].map((kick) => (
          <motion.div key={kick.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-shrink-0 w-[280px] snap-start">
            <div className="bg-white rounded-[1.5rem] border border-slate-100 p-3 shadow-lg group/kick relative">
              <div className="relative aspect-square mb-3">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <img src={kick.img} className="w-full h-full object-cover transition-transform duration-700 group-hover/kick:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-20">
                  <Badge className="bg-indigo-600 text-white border-none font-black text-[6px] uppercase px-2 py-0.5 shadow-lg">{kick.type}</Badge>
                  <Badge className="bg-emerald-500 text-white border-none font-black text-[6px] uppercase px-2 py-0.5 shadow-lg">Early Bird Price</Badge>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-900 tracking-tight mb-0.5">{kick.title}</h4>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{kick.brand}</p>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-slate-400 line-through">${kick.price_current}</span>
                    <ArrowRight className="h-1.5 w-1.5 text-indigo-500" />
                    <span className="text-xs font-black text-indigo-600">${kick.price_target}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[7px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{kick.current} / {kick.goal} ед.</p>
                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{Math.round((kick.current / kick.goal) * 100)}%</p>
                  </div>
                  <div className="h-1 w-full bg-slate-100 rounded-full relative">
                    <div className="h-full bg-indigo-600 rounded-full relative z-10" style={{ width: `${(kick.current / kick.goal) * 100}%` }} />
                    {/* Divisions */}
                    {kick.thresholds.map((t) => (
                      <div 
                        key={t}
                        className="absolute top-0 bottom-0 w-px bg-white/40 z-20"
                        style={{ left: `${(t / kick.goal) * 100}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-center pt-1">
                    <Button 
                      onClick={() => viewRole === 'b2b' ? router.push(getShowroomB2BLink('kick')) : null}
                      className="w-[180px] bg-white text-slate-400 border border-slate-200 h-9 rounded-xl text-[9px] font-black uppercase transition-all duration-500 hover:bg-black hover:text-white hover:border-black hover:button-glimmer hover:button-professional group/btn"
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
  if (showroomViewMode === "products") {
    const displayProducts = (showroomTab === "all" || showroomTab === "outlet") 
      ? filteredShowroomProducts.slice(0, 2) 
      : filteredShowroomProducts;

    return (
      <>
        {displayProducts.map((p) => (
          <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }} className="flex-shrink-0 w-60 snap-start">
            <SynthaProductCard 
              product={p} 
              viewRole={viewRole as any}
              isLinesheetMode={isLinesheetMode}
              isSelected={selectedLinesheetItems.includes(p.id)}
              onToggleSelect={(productId) => {
                setSelectedLinesheetItems(prev => 
                  prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
                );
              }}
            />
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
