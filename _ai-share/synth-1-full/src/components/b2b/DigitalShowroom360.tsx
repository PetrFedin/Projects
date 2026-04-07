'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Info, 
  ZoomIn,
  ZoomOut,
  Scan,
  Box,
  Cpu,
  Shield,
  Wind,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useB2BState } from '@/providers/b2b-state';
import allProductsData from '@/lib/products';
import { cn } from '@/lib/cn';

interface DigitalShowroom360Props {
  onClose: () => void;
  brandId?: string;
}

export function DigitalShowroom360({ onClose, brandId = 'brand-1' }: DigitalShowroom360Props) {
  const { addB2bOrderItem } = useB2BState();
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [activeStyle, setActiveStyle] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Mock 360 images (sequence of frames)
  const frames = [
    'https://images.unsplash.com/photo-1539109132304-372874a581ad?q=80&w=1200',
    'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1200',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200',
    'https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=1200'
  ];

  const hotspots = [
    { id: 'h1', productId: '1', x: 45, y: 30, label: 'Cyber Tech Parka', details: 'Graphene Reinforced' },
    { id: 'h2', productId: '2', x: 65, y: 70, label: 'Neural Cargo', details: 'Adaptive Silhouette' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoRotating) {
      interval = setInterval(() => {
        setRotation(prev => (prev + 1) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isAutoRotating) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    setRotation(Math.floor(x * 360));
  };

  const currentFrame = frames[Math.floor((rotation / 360) * frames.length)];

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 backdrop-blur-xl bg-black/50 absolute top-0 left-0 right-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center">
            <Scan className="h-6 w-6 text-black" />
          </div>
          <div>
            <Badge className="bg-indigo-600 text-white border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5 mb-1">Interactive_Showroom_v1.2</Badge>
            <h2 className="text-sm font-black uppercase tracking-tighter leading-none">NEURAL_NOMAD_360°</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-6 py-2 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">FPS</span>
            <span className="text-xs font-black text-emerald-400">120.0</span>
          </div>
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="h-10 w-10 rounded-2xl border border-white/10 text-white hover:bg-white hover:text-black transition-all"
          >
            <Plus className="h-6 w-6 rotate-45" />
          </Button>
        </div>
      </div>

      {/* Main Viewer */}
      <div className="flex-1 relative flex items-center justify-center bg-[#0a0a0a]">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} 
        />

        <div 
          ref={containerRef}
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsAutoRotating(false)}
          onMouseLeave={() => setIsAutoRotating(true)}
          onMouseMove={handleMouseMove}
        >
          <motion.div 
            className="relative w-[80%] h-[80%] flex items-center justify-center"
            style={{ scale: zoom }}
            animate={{ rotateY: 0 }}
          >
            <img 
              src={currentFrame} 
              className="max-h-full max-w-full object-contain shadow-[0_0_100px_rgba(255,255,255,0.1)] rounded-3xl"
              draggable={false}
            />

            {/* Hotspots */}
            {showHotspots && hotspots.map((hs) => (
              <motion.div
                key={hs.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute z-20"
                style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
              >
                <div 
                  className="relative group"
                  onMouseEnter={() => setSelectedHotspot(hs.id)}
                  onMouseLeave={() => setSelectedHotspot(null)}
                >
                  <div className="h-6 w-6 rounded-full bg-white text-black flex items-center justify-center animate-pulse cursor-pointer shadow-2xl">
                    <Plus className="h-4 w-4" />
                  </div>

                  <AnimatePresence>
                    {selectedHotspot === hs.id && (
                      <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 10, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        className="absolute left-full top-1/2 -translate-y-1/2 ml-4 w-64 p-4 rounded-xl bg-white text-black shadow-2xl z-30"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-black text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5">STYLE_REF_{hs.productId}</Badge>
                            <ShoppingCart className="h-4 w-4 text-slate-400" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-black uppercase tracking-tighter leading-tight">{hs.label}</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{hs.details}</p>
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                             <Button 
                                className="flex-1 bg-black text-white h-10 rounded-xl font-black uppercase text-[9px] tracking-widest"
                                onClick={() => {
                                  const prod = allProductsData.find(p => p.id === hs.productId);
                                  if (prod) addB2bOrderItem(prod, 'L', 1);
                                }}
                             >
                                Configure Order
                             </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* UI Overlays: Left Controls */}
        <div className="absolute left-10 top-1/2 -translate-y-1/2 space-y-4">
           {[
             { icon: Cpu, label: 'Fiber_Analysis', color: 'indigo' },
             { icon: Shield, label: 'Thermal_Scan', color: 'emerald' },
             { icon: Wind, label: 'Air_Flow', color: 'amber' },
             { icon: Box, label: 'Wireframe', color: 'slate' }
           ].map((tool, i) => (
             <Button 
               key={i}
               variant="ghost" 
               className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 p-0 flex flex-col items-center justify-center gap-1 hover:bg-white hover:text-black transition-all group"
             >
               <tool.icon className="h-6 w-6" />
               <span className="text-[7px] font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity">{tool.label}</span>
             </Button>
           ))}
        </div>

        {/* UI Overlays: Right Zoom/Rotation Info */}
        <div className="absolute right-10 bottom-40 space-y-6">
           <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
              <div className="space-y-2">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Rotation_Angle</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-500"
                      style={{ width: `${(rotation / 360) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-white font-mono">{rotation}°</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Optical_Zoom</p>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    className="h-8 w-8 rounded-lg bg-white/10 p-0 hover:bg-white hover:text-black"
                    onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-xs font-black text-white font-mono">{zoom.toFixed(1)}x</span>
                  <Button 
                    variant="ghost" 
                    className="h-8 w-8 rounded-lg bg-white/10 p-0 hover:bg-white hover:text-black"
                    onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button 
                variant="ghost" 
                className={cn(
                  "w-full h-10 rounded-xl border font-black uppercase text-[9px] tracking-widest gap-2 transition-all",
                  showHotspots ? "bg-indigo-600 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-white/40"
                )}
                onClick={() => setShowHotspots(!showHotspots)}
              >
                <Info className="h-4 w-4" />
                {showHotspots ? 'Hide Tags' : 'Show Tags'}
              </Button>
           </div>
        </div>
      </div>

      {/* Bottom Thumbnails / Selector */}
      <div className="p-4 backdrop-blur-3xl bg-black/50 border-t border-white/10">
        <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
            {frames.map((frame, i) => (
              <button
                key={i}
                onClick={() => setActiveStyle(i)}
                className={cn(
                  "relative flex-shrink-0 w-32 aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all duration-500",
                  activeStyle === i ? "border-indigo-600 scale-105" : "border-transparent opacity-40 hover:opacity-100"
                )}
              >
                <img src={frame} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <span className="absolute bottom-2 left-2 text-[8px] font-black uppercase tracking-widest text-white/60">Style_0{i+1}</span>
              </button>
            ))}
          </div>

          <div className="w-80 space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Global_Status</span>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Syntha_Live_Sync</span>
             </div>
             <Button className="w-full h-10 rounded-2xl bg-white text-black font-black uppercase text-[11px] tracking-widest gap-3 shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-[1.02] transition-all">
                Add Selected to Assortment <Plus className="h-5 w-5" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
