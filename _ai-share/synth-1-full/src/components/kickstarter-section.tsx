'use client';

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function KickstarterSection() {
  const router = useRouter();
  
  const projects = [
    { id: "k1", title: "Recycled Ocean Hoodie", brand: "Nordic Wool", goal: 500, current: 342, days: 12, price_current: 45, price_target: 38, type: "Limited Drop", stage: "Sourcing Fabric", img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800", thresholds: [150, 300, 450] },
    { id: "k2", title: "Smart Heat Jacket", brand: "Syntha Lab", goal: 200, current: 185, days: 5, price_current: 120, price_target: 95, type: "Best-seller Reload", stage: "Sample Ready", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800", thresholds: [50, 100, 150] },
  ];

  return (
    <div id="laboratory-scroll" className="flex overflow-x-auto pb-6 gap-3 custom-scrollbar snap-x snap-mandatory scroll-smooth w-full px-4">
      {projects.map((kick) => (
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
                    asChild
                    className="w-[180px] bg-white text-slate-400 border border-slate-200 h-9 rounded-xl text-[9px] font-black uppercase transition-all duration-500 hover:bg-black hover:text-white hover:border-black hover:button-glimmer hover:button-professional group/btn"
                  >
                    <Link href={`/kickstarter/${kick.id}`}>
                      Участвовать
                      <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
