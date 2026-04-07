'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Zap, Sparkles, Camera, Maximize2, ShieldCheck, Box, Thermometer, Globe, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { useUIState } from '@/providers/ui-state';

export function DigitalTwinRunway({ onClose }: { onClose: () => void }) {
  const { hoveredProduct } = useUIState();
  const [activeItem, setActiveItem] = useState<{ id: string; image: string; title: string; fit: string; fabric: string; synergy: number } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeEnv, setActiveEnv] = useState<'LAB' | 'STREET' | 'RUNWAY'>('LAB');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [investorMode, setInvestorMode] = useState(true);

  // Sync with hovered product from catalog
  useEffect(() => {
    if (hoveredProduct) {
      setIsSyncing(true);
      const timer = setTimeout(() => {
        setActiveItem({
          id: hoveredProduct.id,
          title: hoveredProduct.name,
          image: hoveredProduct.images?.[0]?.url || (hoveredProduct as any).image || '/placeholder.jpg',
          fit: `${(92 + Math.random() * 8).toFixed(0)}%`,
          fabric: (hoveredProduct.composition && typeof hoveredProduct.composition !== 'string') 
            ? hoveredProduct.composition[0].material 
            : 'Premium_Blend',
          synergy: Math.floor(Math.random() * 20) + 80
        });
        setIsSyncing(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [hoveredProduct]);

  const envBackgrounds = {
    'LAB': 'bg-[radial-gradient(circle_at_center,_#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]',
    'STREET': 'bg-[url("https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000")] bg-cover bg-center opacity-40',
    'RUNWAY': 'bg-gradient-to-b from-indigo-900/20 to-slate-950 opacity-60'
  };

  return (
    <motion.div 
      drag
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={cn(
        "fixed z-[100] bg-slate-950 border border-white/10 rounded-xl shadow-[0_0_80px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-700 backdrop-blur-2xl",
        isExpanded ? "inset-8 w-auto h-auto md:inset-16" : "bottom-12 right-12 w-[360px] md:w-[440px]"
      )}
    >
      {/* Interactive Background */}
      <div className={cn("absolute inset-0 transition-all duration-1000", envBackgrounds[activeEnv])} />
      
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-20 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-500 text-white border-none text-[9px] font-black uppercase px-3 py-1 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              PRO_TWIN_v5.0
            </Badge>
            {investorMode && (
              <div className="flex items-center gap-2 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                <Cpu className="h-2 w-2 text-indigo-400" />
                <span className="text-[7px] font-black text-indigo-400 uppercase tracking-widest">Neural_Engine_Monitoring</span>
              </div>
            )}
          </div>
          <div className="text-[11px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" />
            Digital_Twin_Runway
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setInvestorMode(!investorMode)} 
            className={cn("p-2 rounded-full transition-all", investorMode ? "bg-indigo-500 text-white" : "bg-white/5 text-white/40 hover:text-white")}
          >
            <ShieldCheck className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-white/40 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-2 bg-white/5 rounded-full">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative w-full h-full min-h-[450px] flex items-center justify-center overflow-hidden">
        {/* Fit Heatmap Simulation Overlay */}
        {showHeatmap && (
          <div className="absolute inset-0 z-30 pointer-events-none opacity-40 mix-blend-overlay">
             <div className="absolute inset-0 bg-gradient-to-t from-rose-500/40 via-emerald-500/20 to-indigo-500/40 animate-pulse" />
          </div>
        )}

        {/* Avatar Area */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {activeItem && !isSyncing ? (
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className={cn(
                  "relative w-full h-full flex items-center justify-center transition-all duration-700",
                  isExpanded ? "p-4" : "p-16"
                )}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                   <User className={cn("transition-all duration-700 text-white stroke-[0.5]", isExpanded ? "h-[95%]" : "h-[85%]")} />
                </div>
                
                <img 
                  src={activeItem.image} 
                  className={cn(
                    "object-contain z-10 drop-shadow-[0_0_60px_rgba(52,211,153,0.5)] transition-all duration-700",
                    isExpanded ? "h-[95%]" : "h-full"
                  )} 
                />
                
                {/* Body Mapping Skeleton Overlay */}
                {investorMode && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                     {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                       <motion.circle 
                         key={i}
                         cx={`${30 + Math.sin(i) * 20}%`}
                         cy={`${10 + i * 7}%`}
                         r={isExpanded ? "4" : "2"}
                         fill={i % 3 === 0 ? "#f43f5e" : "#10b981"}
                         initial={{ opacity: 0 }}
                         animate={{ opacity: [0, 0.8, 0] }}
                         transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                       />
                     ))}
                  </svg>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
              </motion.div>
            ) : (
              <div className={cn("flex flex-col items-center gap-3 transition-all duration-700", isExpanded ? "scale-150" : "scale-125")}>
                <div className="h-40 w-40 rounded-full border border-emerald-500/20 flex items-center justify-center relative">
                  <User className="h-12 w-12 text-emerald-500/40 animate-pulse" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-6 border-2 border-dashed border-emerald-500/10 rounded-full"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-12 border border-dashed border-white/5 rounded-full"
                  />
                </div>
                <div className="text-center space-y-3">
                  <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em] animate-pulse">
                    {isSyncing ? 'NEURAL_FABRIC_MAPPING' : 'SYSTEM_STANDBY_MODE'}
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                        <motion.div animate={{ x: [-96, 96] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-full w-12 bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                     </div>
                     <span className="text-[8px] text-white/20 font-mono uppercase tracking-widest">Waiting_Data_Stream</span>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Real-time Telemetry Overlays */}
        {activeItem && !isSyncing && (
           <div className="absolute inset-0 p-3 pointer-events-none z-30">
              {/* Fit & Fabric Stats */}
              <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={cn("absolute transition-all duration-700 space-y-4", isExpanded ? "left-16 bottom-16" : "left-10 bottom-36")}>
                 <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-3 rounded-xl w-44 space-y-1">
                    <div className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1 flex items-center gap-2">
                       <Box className="h-3 w-3 text-indigo-400" /> Fit Confidence
                    </div>
                    <div className="text-base font-black text-emerald-400 leading-none tabular-nums">{activeItem.fit}</div>
                    <div className="text-[7px] text-white/20 font-mono">Simulated_on_Body_v4</div>
                 </div>
                 <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-3 rounded-xl w-44 space-y-1">
                    <div className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1 flex items-center gap-2">
                       <Cpu className="h-3 w-3 text-emerald-400" /> Material DNA
                    </div>
                    <div className="text-[12px] font-black text-white truncate uppercase tracking-tighter">{activeItem.fabric}</div>
                    <div className="text-[7px] text-white/20 font-mono">Textural_Integrity_Stable</div>
                 </div>
              </motion.div>

              {/* Business Synergy Stats */}
              <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={cn("absolute transition-all duration-700 space-y-4", isExpanded ? "right-16 top-40" : "right-10 top-40")}>
                 <div className="bg-indigo-500/10 backdrop-blur-2xl border border-indigo-500/20 p-4 rounded-xl w-64">
                    <div className="flex items-center gap-2 mb-4">
                       <ShieldCheck className="h-4 w-4 text-indigo-400" />
                       <span className="text-[9px] font-black text-white uppercase tracking-widest">Business Intelligence</span>
                    </div>
                    <div className="space-y-4">
                       <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-black text-white">
                             <span>Style Synergy</span>
                             <span className="text-emerald-400">{activeItem.synergy}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${activeItem.synergy}%` }} 
                               transition={{ duration: 1.5 }}
                               className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" 
                             />
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/5 p-3 rounded-2xl">
                             <div className="text-[7px] font-black text-white/40 uppercase">Conversion</div>
                             <div className="text-xs font-black text-white">+34.2%</div>
                          </div>
                          <div className="bg-white/5 p-3 rounded-2xl">
                             <div className="text-[7px] font-black text-white/40 uppercase">Returns</div>
                             <div className="text-xs font-black text-rose-400">-18.4%</div>
                          </div>
                       </div>
                       <div className="text-[7px] font-black text-white/30 uppercase tracking-widest text-center">Predictive_Market_Resonance</div>
                    </div>
                 </div>
              </motion.div>
           </div>
        )}

        {/* Scanning Beam */}
        {isSyncing && (
          <motion.div 
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_30px_#10b981] z-40"
          />
        )}
      </div>

      {/* Control Panel */}
      <div className="relative z-20 p-3 space-y-4 bg-slate-900/90 backdrop-blur-[40px] border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Neural Simulation</div>
            <div className="text-sm font-black text-white uppercase tracking-tighter leading-none">
               {isSyncing ? 'Syncing_Protocols...' : (activeItem?.title || 'System_Ready')}
            </div>
          </div>
          
          <div className="flex gap-2">
             {[
               { id: 'LAB', icon: Box, label: 'LAB' },
               { id: 'STREET', icon: Globe, label: 'STREET' },
               { id: 'RUNWAY', icon: Zap, label: 'WALK' }
             ].map(env => (
               <button 
                 key={env.id}
                 onClick={() => setActiveEnv(env.id as any)}
                 className={cn(
                   "h-12 px-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-1",
                   activeEnv === env.id ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                 )}
               >
                 <env.icon className="h-4 w-4" />
                 <span className="text-[7px] font-black">{env.label}</span>
               </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
           <Button 
             onClick={() => setShowHeatmap(!showHeatmap)}
             className={cn(
               "h-10 rounded-[1.5rem] font-black uppercase text-[11px] tracking-widest gap-3 shadow-xl transition-all",
               showHeatmap ? "bg-rose-500 text-white" : "bg-white text-black hover:bg-slate-200"
             )}
           >
             <Thermometer className="h-4 w-4" /> Fit Heatmap
           </Button>
           <Button variant="outline" className="h-10 border-white/10 text-white hover:bg-white/5 rounded-[1.5rem] font-black uppercase text-[11px] tracking-widest gap-3">
             <Camera className="h-4 w-4" /> 4K Snapshot
           </Button>
        </div>

        {investorMode && (
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="flex flex-col">
                   <span className="text-[8px] font-black text-white/40 uppercase">Market Strategy</span>
                   <span className="text-[10px] font-black text-indigo-400 uppercase">Growth_Optimized</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex flex-col">
                   <span className="text-[8px] font-black text-white/40 uppercase">Latency</span>
                   <span className="text-[10px] font-black text-white uppercase tabular-nums">12ms</span>
                </div>
             </div>
             <Button variant="ghost" className="text-[9px] font-black text-indigo-400 uppercase hover:text-indigo-300">
                Download Investor Report
             </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
