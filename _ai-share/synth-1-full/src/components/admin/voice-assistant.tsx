'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, BrainCircuit, Activity, Zap, 
  Settings, User, Box, Truck, Factory, RefreshCcw,
  Volume2, VolumeX, Terminal, ShieldAlert, Sparkles,
  Command
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function AiVoiceAssistant() {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [visualizerLines, setVisualizerLines] = useState<number[]>([]);

  // Simulation of voice activity
  useEffect(() => {
    let interval: any;
    if (isListening) {
      interval = setInterval(() => {
        setVisualizerLines(Array.from({ length: 12 }, () => Math.random() * 100));
      }, 100);
    } else {
      setVisualizerLines([]);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const toggleAssistant = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setTimeout(() => setResponse("Syntha Hands-Free активен. Складская логистика под вашим контролем. Чем могу помочь?"), 1000);
    }
  };

  const simulateListen = () => {
    setIsListening(true);
    setResponse(null);
    setTranscript('');
    
    setTimeout(() => {
      setTranscript("Syntha, сколько метров кашемира MAT-CASH-01 осталось на складе?");
      setTimeout(() => {
        setIsListening(false);
        setResponse("На основном складе Syntha Lab осталось 150.5 метров. Текущий резерв: 50 метров. Хватит на 20 единиц пальто Urban Tech.");
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-3">
      {/* Assistant Window */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-80 bg-slate-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-indigo-400" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Hands-Free Mode</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-bold text-white/40 uppercase">Voice Engine Live</span>
               </div>
            </div>

            <div className="p-4 space-y-6 flex-1 max-h-[400px] overflow-y-auto">
               {/* Visualizer */}
               <div className="h-12 flex items-center justify-center gap-1">
                  {isListening ? (
                    visualizerLines.map((line, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ height: 4 }} 
                        animate={{ height: `${line}%` }} 
                        className="w-1 bg-indigo-500 rounded-full"
                      />
                    ))
                  ) : (
                    <div className="flex items-center gap-1 opacity-20">
                       <div className="h-1 w-1 rounded-full bg-white" />
                       <div className="h-1 w-1 rounded-full bg-white" />
                       <div className="h-1 w-1 rounded-full bg-white" />
                    </div>
                  )}
               </div>

               {/* Interaction Text */}
               <div className="space-y-4">
                  <AnimatePresence>
                    {transcript && (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-1">
                         <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Вы спросили:</p>
                         <p className="text-xs text-white font-medium italic leading-relaxed">"{transcript}"</p>
                      </motion.div>
                    )}
                    {response && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1 pt-4 border-t border-white/5">
                         <p className="text-[8px] font-black uppercase text-indigo-400 tracking-widest">Syntha AI:</p>
                         <p className="text-xs text-white/80 font-medium leading-relaxed">{response}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>

               {/* Quick Commands */}
               {!isListening && !response && (
                 <div className="grid grid-cols-1 gap-2">
                    {[
                      { icon: Box, label: "Остатки сырья" },
                      { icon: Truck, label: "Статус отгрузок" },
                      { icon: Factory, label: "Загрузка цеха" }
                    ].map((cmd, i) => (
                      <button key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors text-left group">
                         <cmd.icon className="h-3.5 w-3.5 text-indigo-400" />
                         <span className="text-[9px] font-black text-white/60 uppercase group-hover:text-white transition-colors">{cmd.label}</span>
                      </button>
                    ))}
                 </div>
               )}
            </div>

            <div className="p-4 bg-indigo-600">
               <Button 
                onClick={simulateListen}
                disabled={isListening}
                className="w-full h-10 bg-white text-indigo-600 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
               >
                 {isListening ? <Activity className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
                 {isListening ? "Слушаю..." : "Нажать и спросить"}
               </Button>
               <p className="text-[8px] text-white/40 text-center font-bold uppercase mt-4 tracking-tighter">Нажмите или скажите «Syntha, отчет»</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button 
        onClick={toggleAssistant}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "h-12 w-12 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500",
          isActive ? "bg-rose-500 rotate-90" : "bg-indigo-600"
        )}
      >
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div key="close" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
               <RefreshCcw className="h-6 w-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative">
               <Mic className="h-6 w-6 text-white" />
               <motion.div 
                 animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className="absolute inset-0 bg-white rounded-full -z-10" 
               />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
