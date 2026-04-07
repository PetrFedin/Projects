'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Sparkles, ShoppingCart, Zap, Play, Target, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';

interface ConstellationNode {
  id: string;
  x: number;
  y: number;
  z: number;
  title: string;
  brand: string;
  image: string;
  category: string;
  aiReason: string;
  similarity: string;
  mood: string;
  trendScore: number;
}

export function VisualConstellation({ onClose }: { onClose: () => void }) {
  const [nodes, setNodes] = useState<ConstellationNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<ConstellationNode | null>(null);
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isAutoTour, setIsAutoTour] = useState(false);
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const tourInterval = useRef<any>(null);

  useEffect(() => {
    async function loadProducts() {
      const moods = ["CYBERPUNK", "MINIMAL", "AVANT-GARDE", "OLD_MONEY", "STREETWEAR"];
      try {
        const response = await fetch("/data/products.json");
        const products: any[] = await response.json();
        
        const constellationNodes: ConstellationNode[] = products.map((p, i) => ({
          id: p.id,
          x: Math.random() * 100,
          y: Math.random() * 100,
          z: Math.random() * 100,
          title: p.name,
          brand: p.brand,
          image: p.images?.[0]?.url || p.image || '/placeholder.jpg',
          category: p.category,
          aiReason: ["Visual Match", "Aesthetic DNA", "Material Sync", "Trend Alignment"][i % 4],
          similarity: `${(85 + Math.random() * 14).toFixed(1)}%`,
          mood: moods[i % moods.length],
          trendScore: Math.floor(Math.random() * 40) + 60
        }));
        setNodes(constellationNodes);
      } catch (e) {
        // Fallback
        const mockNodes: ConstellationNode[] = Array.from({ length: 60 }).map((_, i) => ({
          id: `star-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          z: Math.random() * 100,
          title: ["Cyber Jacket", "Oversize Hoodie", "Tech Pants", "Leather Boots", "Matrix Coat", "Utility Vest"][i % 6],
          brand: ["SYNTHA_LAB", "NEO_DESIGN", "PROTO_TECH", "VOID_WEAR"][i % 4],
          image: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=400&q=80`,
          category: ["Outerwear", "Tops", "Bottoms", "Shoes"][i % 4],
          aiReason: ["Aesthetic Similarity", "Material Match", "Trend Pulse", "Visual Context"][i % 4],
          similarity: `${(85 + Math.random() * 14).toFixed(1)}%`,
          mood: moods[i % moods.length],
          trendScore: Math.floor(Math.random() * 40) + 60
        }));
        setNodes(mockNodes);
      }
    }
    
    loadProducts();

    const handleMouseMove = (e: MouseEvent) => {
      if (isAutoTour) return;
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    
    const handleWheel = (e: WheelEvent) => {
      setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.001, 0.5), 3.5));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isAutoTour]);

  // AI Auto-Tour Logic
  useEffect(() => {
    if (isAutoTour) {
      tourInterval.current = setInterval(() => {
        const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
        setSelectedNode(randomNode);
        setZoom(2.5);
        setMousePos({
          x: (randomNode.x - 50) * -0.8,
          y: (randomNode.y - 50) * -0.8
        });
      }, 4000);
    } else {
      clearInterval(tourInterval.current);
    }
    return () => clearInterval(tourInterval.current);
  }, [isAutoTour, nodes]);

  const filteredNodes = nodes.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        n.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMood = !activeMood || n.mood === activeMood;
    return matchSearch && matchMood;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-slate-950 flex flex-col overflow-hidden"
    >
      {/* Neural Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#4f46e530_0%,transparent_70%)]" />
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" 
        />
      </div>

      {/* Top Navigation Panel */}
      <div className="relative z-10 p-4 flex justify-between items-start">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge className="bg-indigo-600 text-white border-none px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                AI_NEURAL_NAV_v3.0
              </Badge>
              {isAutoTour && (
                <div className="flex items-center gap-2 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Auto_Tour_Active</span>
                </div>
              )}
            </div>
            <h2 className="text-sm md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.85]">
              VISION<br/><span className="text-indigo-500">CLOUD</span>
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search Aesthetics, Vibes, or Tech..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-8 py-3 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 w-80 backdrop-blur-xl transition-all shadow-2xl"
              />
            </div>

            {/* Aesthetic Clusters Toggle */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {["CYBERPUNK", "MINIMAL", "OLD_MONEY", "STREETWEAR"].map(mood => (
                <button
                  key={mood}
                  onClick={() => setActiveMood(activeMood === mood ? null : mood)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all border shrink-0",
                    activeMood === mood 
                      ? "bg-indigo-500 border-indigo-400 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]" 
                      : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/30"
                  )}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <Button 
            variant="outline" 
            onClick={() => setIsAutoTour(!isAutoTour)}
            className={cn(
              "rounded-2xl h-10 px-6 border-white/10 text-white font-black uppercase text-[10px] tracking-widest gap-3 backdrop-blur-xl transition-all",
              isAutoTour ? "bg-indigo-500 border-indigo-400" : "bg-white/5 hover:bg-white/10"
            )}
          >
            {isAutoTour ? <Target className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            AI Guided Tour
          </Button>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white p-4 transition-colors border border-white/10 rounded-full bg-black/40 backdrop-blur-3xl hover:bg-white/5 shadow-2xl"
          >
            <X className="h-8 w-8" />
          </button>
        </div>
      </div>

      {/* Main Cloud Canvas */}
      <div className="relative flex-1 cursor-grab active:cursor-grabbing perspective-[2500px]">
        <motion.div 
          animate={{ 
            x: mousePos.x * -1.5, 
            y: mousePos.y * -1.5,
            scale: zoom,
            rotateX: mousePos.y * 0.15,
            rotateY: mousePos.x * -0.15
          }}
          transition={{ type: "spring", damping: 30, stiffness: 50 }}
          className="absolute inset-0 flex items-center justify-center preserve-3d"
        >
          <div className="relative w-full h-full max-w-7xl max-h-screen preserve-3d">
            {nodes.map((node) => {
              const isMatch = (searchQuery === "" || node.title.toLowerCase().includes(searchQuery.toLowerCase())) && 
                              (!activeMood || node.mood === activeMood);
              const isActive = isHovering === node.id || selectedNode?.id === node.id;
              
              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: isMatch ? 1 : 0.1, 
                    scale: isActive ? 1.8 : (isMatch ? 1 : 0.5),
                    x: `${node.x}%`,
                    y: `${node.y}%`,
                    z: node.z * (zoom + 1)
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="absolute"
                  onHoverStart={() => setIsHovering(node.id)}
                  onHoverEnd={() => setIsHovering(null)}
                  onClick={() => setSelectedNode(node)}
                >
                  <div className={cn(
                    "h-4 w-4 rounded-full cursor-pointer transition-all duration-700",
                    isActive ? "bg-indigo-400 shadow-[0_0_40px_rgba(129,140,248,1)] ring-[6px] ring-indigo-500/30" : 
                    (isMatch ? "bg-white/80 shadow-[0_0_15px_rgba(255,255,255,0.4)]" : "bg-white/10")
                  )} />

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className="absolute top-full mt-4 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-[60]"
                      >
                        <div className="bg-black/80 backdrop-blur-2xl border border-indigo-500/30 px-4 py-2 rounded-2xl shadow-2xl">
                          <div className="text-[10px] font-black text-white uppercase tracking-widest">{node.title}</div>
                          <div className="flex items-center justify-center gap-2 mt-1">
                            <span className="text-[7px] font-black text-indigo-400 uppercase tracking-[0.2em]">{node.mood}</span>
                            <div className="h-1 w-1 rounded-full bg-white/20" />
                            <span className="text-[7px] font-black text-emerald-400 uppercase tracking-[0.2em]">{node.similarity} DNA</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Neural Connectors */}
                  {isActive && (
                    <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-visible w-0 h-0">
                      {nodes.slice(0, 12).filter(t => t.id !== node.id && t.mood === node.mood).map((target, idx) => (
                        <React.Fragment key={idx}>
                          <motion.line
                            x1="0" y1="0"
                            x2={`${(target.x - node.x) * (20 / zoom)}px`}
                            y2={`${(target.y - node.y) * (20 / zoom)}px`}
                            stroke="rgba(129,140,248,0.5)"
                            strokeWidth="0.5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.2 }}
                          />
                          <motion.circle
                            r="1.5"
                            fill="#818cf8"
                            animate={{ 
                              cx: [0, `${(target.x - node.x) * (20 / zoom)}px`],
                              cy: [0, `${(target.y - node.y) * (20 / zoom)}px`],
                              opacity: [0, 1, 0],
                              scale: [1, 2, 1]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: idx * 0.15 }}
                          />
                        </React.Fragment>
                      ))}
                    </svg>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Selected Product Card */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 150, rotateY: 20 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: 150, rotateY: 20 }}
              className="absolute right-12 top-1/2 -translate-y-1/2 w-[420px] bg-slate-900/40 backdrop-blur-[40px] border border-white/10 rounded-[4rem] p-3 text-white space-y-4 shadow-[0_0_100px_rgba(0,0,0,0.6)] z-50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/5" />
              
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden group shadow-2xl">
                <img src={selectedNode.image} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                
                <div className="absolute top-4 left-6">
                   <Badge className="bg-indigo-600/80 backdrop-blur-md text-white border-none text-[9px] font-black uppercase px-4 py-1.5 tracking-tighter">
                     {selectedNode.mood} DNA
                   </Badge>
                </div>

                <div className="absolute bottom-8 left-8 right-8 flex flex-col gap-2">
                   <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                      <span className="text-white/60">Trend Momentum</span>
                      <span className="text-emerald-400">+{selectedNode.trendScore}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedNode.trendScore}%` }}
                        className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
                      />
                   </div>
                </div>
              </div>

              <div className="relative space-y-6">
                <div className="space-y-2">
                  <div className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.3em]">{selectedNode.brand}</div>
                  <h3 className="text-sm font-black uppercase tracking-tighter leading-[0.85]">{selectedNode.title}</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <div className="p-4 rounded-3xl bg-white/5 border border-white/5 space-y-1">
                      <div className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none">Visual Match</div>
                      <div className="text-base font-black text-indigo-400">{selectedNode.similarity}</div>
                   </div>
                   <div className="p-4 rounded-3xl bg-white/5 border border-white/5 space-y-1">
                      <div className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none">Aesthetic Rank</div>
                      <div className="text-base font-black text-white">#0{nodes.indexOf(selectedNode) % 9 + 1}</div>
                   </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-indigo-400 fill-indigo-400" />
                    <div className="text-[10px] font-black text-white uppercase tracking-widest">AI Cluster Reasoning</div>
                  </div>
                  <p className="text-[11px] text-white/60 leading-relaxed font-medium">
                    This item share 94.2% structural aesthetic data with the current cluster. Visual engine identifies primary compatibility in "Bio-Organic Geometry" and "Cyber-Textural Contrast".
                  </p>
                </div>
              </div>

              <div className="relative flex gap-3">
                <Button className="flex-1 bg-white text-black hover:bg-slate-200 rounded-xl h-12 font-black uppercase text-[12px] tracking-widest gap-3 shadow-2xl shadow-indigo-500/20">
                  <ShoppingCart className="h-5 w-5" /> Add to Look
                </Button>
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 rounded-xl h-12 w-12 p-0 shrink-0">
                  <Activity className="h-6 w-6" />
                </Button>
              </div>

              <button 
                onClick={() => setSelectedNode(null)}
                className="relative w-full text-[10px] font-black uppercase text-white/20 hover:text-white transition-colors tracking-[0.4em]"
              >
                Close Protocol_View
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Real-time System Analytics Bar */}
      <div className="relative z-10 p-3 border-t border-white/5 bg-black/40 backdrop-blur-3xl flex items-center justify-between">
        <div className="flex gap-16">
          {[
            { label: "Active Aesthetics", val: activeMood || "All_Clusters" },
            { label: "Neural Synapse", val: nodes.length > 0 ? "8.4Gbit/s" : "Init..." },
            { label: "Cloud Integrity", val: "Verified_99.9%" },
            { label: "Market Resonance", val: "Bullish_Strong" }
          ].map((stat, i) => (
            <div key={i} className="hidden lg:block space-y-1">
              <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{stat.label}</div>
              <div className={cn(
                "text-sm font-black uppercase tracking-tighter",
                i === 0 ? "text-indigo-400" : "text-white"
              )}>{stat.val}</div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
             <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Neural Engine Load</div>
             <div className="flex items-center gap-2 mt-1">
                <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                   <motion.div 
                     animate={{ width: ["20%", "85%", "40%"] }} 
                     transition={{ duration: 10, repeat: Infinity }}
                     className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" 
                   />
                </div>
                <span className="text-[10px] font-black text-indigo-400 tabular-nums">42%</span>
             </div>
          </div>
          
          <div className="h-10 w-px bg-white/10 mx-2" />
          
          <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
            <div className="flex flex-col">
               <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Core Status</span>
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Syntha_Stable
               </span>
            </div>
            <Sparkles className="h-5 w-5 text-indigo-400" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
