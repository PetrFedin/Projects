'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function KickstarterSection() {
  const router = useRouter();

  const projects = [
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
  ];

  return (
    <div
      id="laboratory-scroll"
      className="custom-scrollbar flex w-full snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-6"
    >
      {projects.map((kick) => (
        <motion.div
          key={kick.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-[280px] flex-shrink-0 snap-start"
        >
<<<<<<< HEAD
          <div className="group/kick relative rounded-[1.5rem] border border-slate-100 bg-white p-3 shadow-lg">
=======
          <div className="group/kick border-border-subtle bg-bg-surface relative rounded-[1.5rem] border p-3 shadow-lg">
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
                  {kick.type}
                </Badge>
                <Badge className="border-none bg-emerald-500 px-2 py-0.5 text-[6px] font-black uppercase text-white shadow-lg">
=======
                <Badge className="bg-accent-primary text-text-inverse border-none px-2 py-0.5 text-[6px] font-black uppercase shadow-lg">
                  {kick.type}
                </Badge>
                <Badge className="bg-state-success text-text-inverse border-none px-2 py-0.5 text-[6px] font-black uppercase shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
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
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
                  <span className="text-[7px] font-black uppercase tracking-widest text-emerald-600">
=======
              <h4 className="text-text-primary mb-0.5 text-xs font-black uppercase tracking-tight">
                {kick.title}
              </h4>
              <p className="text-text-muted text-[8px] font-bold uppercase tracking-widest">
                {kick.brand}
              </p>
              <div className="border-border-subtle bg-bg-surface2 flex items-center justify-between rounded-xl border p-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-text-muted text-[10px] font-black line-through">
                    ${kick.price_current}
                  </span>
                  <ArrowRight className="text-accent-primary h-1.5 w-1.5" />
                  <span className="text-accent-primary text-xs font-black">
                    ${kick.price_target}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="bg-state-success h-1 w-1 animate-pulse rounded-full" />
                  <span className="text-state-success text-[7px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
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
                    asChild
<<<<<<< HEAD
                    className="hover:button-glimmer hover:button-professional group/btn h-9 w-[180px] rounded-xl border border-slate-200 bg-white text-[9px] font-black uppercase text-slate-400 transition-all duration-500 hover:border-black hover:bg-black hover:text-white"
=======
                    className="group/btn border-border-default bg-bg-surface text-text-muted hover:border-text-primary hover:bg-text-primary hover:text-text-inverse hover:button-glimmer hover:button-professional h-9 w-[180px] rounded-xl border text-[9px] font-black uppercase transition-all duration-500"
>>>>>>> recover/cabinet-wip-from-stash
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
