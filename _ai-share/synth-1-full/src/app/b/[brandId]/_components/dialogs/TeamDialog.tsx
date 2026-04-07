import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Quote, MessageSquare, Instagram, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { cn } from '@/lib/utils';

interface TeamDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    brand: any;
    currentTeamIdx: number;
    setCurrentTeamIdx: React.Dispatch<React.SetStateAction<number>>;
}

export function TeamDialog({ isOpen, onOpenChange, brand, currentTeamIdx, setCurrentTeamIdx }: TeamDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none">
                <VisuallyHidden>
                    <DialogTitle>Команда бренда</DialogTitle>
                </VisuallyHidden>
                <div className="relative w-full aspect-video md:aspect-[16/9] bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                    <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTeamIdx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="absolute inset-0"
                            >
                                <Image 
                                    src={brand?.team?.[currentTeamIdx]?.imageUrl || ""} 
                                    alt={brand?.team?.[currentTeamIdx]?.name || ""} 
                                    fill 
                                    className="object-cover" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            </motion.div>
                        </AnimatePresence>
                        
                        {(brand?.team?.length || 0) > 1 && (
                            <div className="absolute bottom-8 left-8 flex gap-2 z-20">
                                <button 
                                    onClick={() => setCurrentTeamIdx(prev => (prev > 0 ? prev - 1 : (brand.team?.length || 1) - 1))}
                                    className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/10"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button 
                                    onClick={() => setCurrentTeamIdx(prev => (prev < (brand.team?.length || 1) - 1 ? prev + 1 : 0))}
                                    className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all border border-white/10"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 p-4 md:p-4 flex flex-col justify-center bg-white relative">
                        <DialogPrimitive.Close asChild>
                            <Button variant="ghost" size="icon" className="absolute top-4 right-6 rounded-full hover:bg-muted">
                                <X className="h-5 w-5" />
                            </Button>
                        </DialogPrimitive.Close>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTeamIdx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-6"
                            >
                                <div>
                                    <p className="text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-2">Команда</p>
                                    <h3 className="text-base font-black uppercase tracking-tighter leading-none">
                                        {brand?.team?.[currentTeamIdx]?.name}
                                    </h3>
                                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-3">
                                        {brand?.team?.[currentTeamIdx]?.role}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="relative">
                                        <Quote className="h-8 w-8 text-accent/10 absolute -top-4 -left-4" />
                                        <p className="text-sm font-medium text-foreground/80 leading-relaxed italic relative z-10 pl-2">
                                            «{brand?.team?.[currentTeamIdx]?.quote}»
                                        </p>
                                    </div>
                                    <div className="h-px w-12 bg-accent/20" />
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {brand?.team?.[currentTeamIdx]?.bio}
                                    </p>
                                </div>

                                <div className="pt-6 flex items-center gap-3">
                                    <Button variant="outline" size="sm" className="rounded-xl text-[10px] font-black uppercase tracking-widest px-6 h-10 flex items-center gap-2 group/btn">
                                        <MessageSquare className="h-3.5 w-3.5 text-accent transition-transform group-hover/btn:-rotate-12" />
                                        Написать
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-accent/5 hover:text-accent transition-all border border-transparent hover:border-accent/10">
                                            <Instagram className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-accent/5 hover:text-accent transition-all border border-transparent hover:border-accent/10">
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {(brand?.team?.length || 0) > 1 && (
                            <div className="absolute bottom-8 right-12 flex gap-1.5">
                                {brand.team?.map((_: any, i: number) => (
                                    <div 
                                        key={i} 
                                        className={cn(
                                            "h-1 rounded-full transition-all duration-300",
                                            i === currentTeamIdx ? "w-4 bg-accent" : "w-1 bg-accent/20"
                                        )} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
