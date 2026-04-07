'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Maximize2, Move, Smartphone, RotateCcw, X, Smartphone as MobileIcon, Layers, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface ARWholesaleViewerProps {
    product: any;
    onClose: () => void;
}

export function ARWholesaleViewer({ product, onClose }: ARWholesaleViewerProps) {
    const [viewMode, setViewMode] = useState<'floor' | 'rack'>('floor');

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
            {/* Header Overlay */}
            <div className="absolute top-4 left-8 right-8 flex justify-between items-center z-10">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                        <Camera className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-white uppercase tracking-tighter">Оптовое AR-Превью</h3>
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Просмотр в пространстве вашего магазина</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white/10 text-white" onClick={onClose}>
                    <X className="h-6 w-6" />
                </Button>
            </div>

            {/* Simulated AR Viewport */}
            <div className="relative w-full h-full max-w-[500px] max-h-[800px] rounded-xl overflow-hidden border-8 border-white/10 shadow-2xl bg-slate-900">
                <div className="absolute inset-0 opacity-60">
                    <img src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=1200" className="w-full h-full object-cover" alt="Store background" />
                </div>

                {/* 3D Product Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0, y: 100 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="relative w-80 h-full max-h-[500px]"
                    >
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/40 blur-xl rounded-full" />
                        <img 
                            src={product?.images[0]?.url} 
                            alt={product?.name} 
                            className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                        />
                        
                        {/* Hotspots */}
                        <div className="absolute top-1/4 left-1/4 h-6 w-6 rounded-full bg-indigo-600/80 border-2 border-white flex items-center justify-center text-white text-[8px] font-black animate-pulse">
                            <Sparkles className="h-3 w-3" />
                        </div>
                    </motion.div>
                </div>

                {/* AR UI Controls */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-full px-8">
                    <div className="flex gap-3 p-1 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
                        <Button 
                            variant={viewMode === 'floor' ? 'default' : 'ghost'} 
                            size="sm" 
                            className={cn("h-10 rounded-xl text-[10px] font-black uppercase tracking-widest", viewMode === 'floor' ? 'bg-white text-slate-900' : 'text-white')}
                            onClick={() => setViewMode('floor')}
                        >
                            <MobileIcon className="mr-2 h-3.5 w-3.5" /> На пол
                        </Button>
                        <Button 
                            variant={viewMode === 'rack' ? 'default' : 'ghost'} 
                            size="sm" 
                            className={cn("h-10 rounded-xl text-[10px] font-black uppercase tracking-widest", viewMode === 'rack' ? 'bg-white text-slate-900' : 'text-white')}
                            onClick={() => setViewMode('rack')}
                        >
                            <Layers className="mr-2 h-3.5 w-3.5" /> На рейку
                        </Button>
                    </div>

                    <div className="w-full grid grid-cols-3 gap-3">
                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-center">
                            <p className="text-[8px] font-black uppercase text-white/50 mb-1">Масштаб</p>
                            <p className="text-sm font-black text-white">1:1</p>
                        </div>
                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-center">
                            <p className="text-[8px] font-black uppercase text-white/50 mb-1">Освещение</p>
                            <p className="text-sm font-black text-indigo-400">Авто</p>
                        </div>
                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-center">
                            <p className="text-[8px] font-black uppercase text-white/50 mb-1">Текстура</p>
                            <p className="text-sm font-black text-white">UHD</p>
                        </div>
                    </div>
                </div>

                {/* Depth Scanning Overlay */}
                <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-xl pointer-events-none">
                    <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-white/50 rounded-tl-[3rem]" />
                    <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-white/50 rounded-tr-[3rem]" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-white/50 rounded-bl-[3rem]" />
                    <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-white/50 rounded-br-[3rem]" />
                </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 text-center text-white/40 max-w-xs">
                <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Наведите камеру на свободную поверхность для калибровки и размещения модели.</p>
            </div>
        </div>
    );
}

import { motion } from 'framer-motion';
