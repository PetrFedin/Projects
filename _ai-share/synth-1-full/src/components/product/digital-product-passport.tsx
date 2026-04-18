'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  Leaf,
  Globe,
  Factory,
  History,
  QrCode,
  Share2,
  Info,
  CheckCircle2,
  AlertCircle,
  Box,
  FileText,
  Zap,
  Sparkles,
  MapPin,
  Truck,
  Recycle,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { buildLocalDppPayload } from '@/lib/platform/dpp-payload';
import type { DppCertificate } from '@/lib/platform/types';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface DPPProps {
  product: Product;
}

const CERT_TONE: Record<DppCertificate['tone'], string> = {
  emerald: 'bg-emerald-50 text-emerald-700',
  blue: 'bg-blue-50 text-blue-700',
<<<<<<< HEAD
  indigo: 'bg-indigo-50 text-indigo-700',
=======
  indigo: 'bg-accent-primary/10 text-accent-primary',
>>>>>>> recover/cabinet-wip-from-stash
};

export default function DigitalProductPassport({ product }: DPPProps) {
  const dpp = buildLocalDppPayload(product);
  const { sustainabilityScore, supplyChain, materials, certificates } = dpp;
  const materialRows = materials.map((m) => ({
    ...m,
    icon: m.name.includes('Elastane') || m.name.includes('полимер') ? Recycle : Leaf,
    desc: m.description,
  }));

  return (
    <div className="space-y-10 duration-700 animate-in fade-in">
      <header className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
<<<<<<< HEAD
          <div className="flex h-12 w-12 items-center justify-center rounded-[1.5rem] bg-slate-900 text-white shadow-xl">
=======
          <div className="bg-text-primary flex h-12 w-12 items-center justify-center rounded-[1.5rem] text-white shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
            <QrCode className="h-8 w-8" />
          </div>
          <div>
            <Badge className="mb-1 border-none bg-emerald-500 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
              Verified Authentic
            </Badge>
<<<<<<< HEAD
            <h1 className="text-base font-black uppercase leading-tight tracking-tight text-slate-900">
              Digital Product <span className="italic text-indigo-600">Passport</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
=======
            <h1 className="text-text-primary text-base font-black uppercase leading-tight tracking-tight">
              Digital Product <span className="text-accent-primary italic">Passport</span>
            </h1>
            <p className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em]">
>>>>>>> recover/cabinet-wip-from-stash
              ID: {dpp.passportId}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
<<<<<<< HEAD
            className="h-10 rounded-xl border-slate-200 px-4 text-[9px] font-bold uppercase tracking-widest"
          >
            <Share2 className="mr-2 h-3.5 w-3.5" /> Share DPP
          </Button>
          <Button className="h-10 rounded-xl bg-slate-900 px-6 text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
=======
            className="border-border-default h-10 rounded-xl px-4 text-[9px] font-bold uppercase tracking-widest"
          >
            <Share2 className="mr-2 h-3.5 w-3.5" /> Share DPP
          </Button>
          <Button className="bg-text-primary h-10 rounded-xl px-6 text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
>>>>>>> recover/cabinet-wip-from-stash
            <ShieldCheck className="mr-2 h-3.5 w-3.5" /> Verify Blockchain
          </Button>
        </div>
      </header>

<<<<<<< HEAD
      <Card className="rounded-xl border border-none border-slate-100 bg-slate-50 p-4 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Box className="h-5 w-5 text-indigo-600" />
=======
      <Card className="bg-bg-surface2 border-border-subtle rounded-xl border border-none p-4 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Box className="text-accent-primary h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
              <h3 className="text-sm font-black uppercase tracking-widest">
                Партия и прослеживаемость
              </h3>
            </div>
            <div className="grid gap-2 text-[11px] sm:grid-cols-2">
<<<<<<< HEAD
              <div className="rounded-lg border border-slate-100 bg-white p-3">
                <p className="text-[9px] font-bold uppercase text-slate-400">Партия пошива</p>
                <p className="font-mono font-bold text-slate-900">{dpp.batchLabel}</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-white p-3">
                <p className="text-[9px] font-bold uppercase text-slate-400">Партия окраса</p>
                <p className="font-mono font-bold text-slate-900">{dpp.dyeBatchLabel}</p>
              </div>
              <div className="rounded-lg border border-slate-100 bg-white p-3 sm:col-span-2">
                <p className="text-[9px] font-bold uppercase text-slate-400">Сертификат ткани</p>
                <p className="font-semibold text-slate-800">{dpp.fabricCertLine}</p>
=======
              <div className="border-border-subtle rounded-lg border bg-white p-3">
                <p className="text-text-muted text-[9px] font-bold uppercase">Партия пошива</p>
                <p className="text-text-primary font-mono font-bold">{dpp.batchLabel}</p>
              </div>
              <div className="border-border-subtle rounded-lg border bg-white p-3">
                <p className="text-text-muted text-[9px] font-bold uppercase">Партия окраса</p>
                <p className="text-text-primary font-mono font-bold">{dpp.dyeBatchLabel}</p>
              </div>
              <div className="border-border-subtle rounded-lg border bg-white p-3 sm:col-span-2">
                <p className="text-text-muted text-[9px] font-bold uppercase">Сертификат ткани</p>
                <p className="text-text-primary font-semibold">{dpp.fabricCertLine}</p>
>>>>>>> recover/cabinet-wip-from-stash
              </div>
            </div>
          </div>
          <div className="shrink-0 lg:w-[280px]">
<<<<<<< HEAD
            <p className="mb-2 text-[9px] font-bold uppercase text-slate-400">
              Карта цепочки (обезличенно)
            </p>
            <div className="relative h-36 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-200 via-emerald-100/40 to-indigo-100">
=======
            <p className="text-text-muted mb-2 text-[9px] font-bold uppercase">
              Карта цепочки (обезличенно)
            </p>
            <div className="from-border-subtle to-accent-primary/15 border-border-default relative h-36 overflow-hidden rounded-xl border bg-gradient-to-br via-emerald-100/40">
>>>>>>> recover/cabinet-wip-from-stash
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 30%, #6366f1 2px, transparent 3px), radial-gradient(circle at 70% 50%, #10b981 2px, transparent 3px), radial-gradient(circle at 45% 75%, #f43f5e 2px, transparent 3px)',
                  backgroundSize: '80px 80px',
                }}
              />
              <div
<<<<<<< HEAD
                className="absolute left-6 top-4 h-3 w-3 rounded-full bg-indigo-600 shadow ring-2 ring-white"
=======
                className="bg-accent-primary absolute left-6 top-4 h-3 w-3 rounded-full shadow ring-2 ring-white"
>>>>>>> recover/cabinet-wip-from-stash
                title="Сырьё"
              />
              <div
                className="absolute right-8 top-1/2 h-3 w-3 rounded-full bg-emerald-600 shadow ring-2 ring-white"
                title="Пошив"
              />
              <div
                className="absolute bottom-5 left-1/3 h-3 w-3 rounded-full bg-rose-500 shadow ring-2 ring-white"
                title="Склад"
              />
            </div>
<<<<<<< HEAD
            <p className="mt-2 text-[9px] leading-snug text-slate-500">
=======
            <p className="text-text-secondary mt-2 text-[9px] leading-snug">
>>>>>>> recover/cabinet-wip-from-stash
              В проде — GeoJSON / карта поставщиков с согласованными данными.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid items-start gap-3 lg:grid-cols-12">
        {/* Left: Product Info & Materials */}
        <div className="space-y-4 lg:col-span-4">
          <Card className="group overflow-hidden rounded-xl border-none bg-white shadow-xl">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={product.images?.[0]?.url || (product as any).image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute bottom-6 left-6 right-6 translate-y-4 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
<<<<<<< HEAD
                <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-indigo-300">
=======
                <p className="text-accent-primary mb-1 text-[10px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  {product.brand}
                </p>
                <h4 className="text-base font-black uppercase leading-none tracking-tight">
                  {product.name}
                </h4>
              </div>
            </div>
          </Card>

<<<<<<< HEAD
          <Card className="space-y-6 rounded-xl border-none bg-slate-900 p-4 text-white shadow-xl">
=======
          <Card className="bg-text-primary space-y-6 rounded-xl border-none p-4 text-white shadow-xl">
>>>>>>> recover/cabinet-wip-from-stash
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase italic tracking-widest">
                Sustainability Score
              </h3>
<<<<<<< HEAD
              <Badge className="border-none bg-indigo-500 font-black text-white">
=======
              <Badge className="bg-accent-primary border-none font-black text-white">
>>>>>>> recover/cabinet-wip-from-stash
                {sustainabilityScore}/100
              </Badge>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500"
                style={{ width: `${Math.min(100, sustainabilityScore)}%` }}
              />
            </div>
<<<<<<< HEAD
            <p className="text-[10px] font-medium italic leading-relaxed text-slate-400">
=======
            <p className="text-text-muted text-[10px] font-medium italic leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
              {dpp.sustainabilityBlurb}
            </p>
          </Card>

          <Card className="rounded-xl border-none bg-white p-4 shadow-xl">
            <h3 className="mb-6 text-sm font-black uppercase tracking-widest">
              Material Composition
            </h3>
            <div className="space-y-6">
              {materialRows.map((mat) => (
                <div key={mat.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <mat.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-tight">
                          {mat.name}
                        </p>
<<<<<<< HEAD
                        <p className="text-[9px] font-medium uppercase text-slate-400">
=======
                        <p className="text-text-muted text-[9px] font-medium uppercase">
>>>>>>> recover/cabinet-wip-from-stash
                          {mat.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black">{mat.percentage}%</span>
                  </div>
<<<<<<< HEAD
                  <Progress value={mat.percentage} className="h-1 rounded-full bg-slate-50" />
=======
                  <Progress value={mat.percentage} className="bg-bg-surface2 h-1 rounded-full" />
>>>>>>> recover/cabinet-wip-from-stash
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Middle & Right: Supply Chain & Certificates */}
        <div className="space-y-10 lg:col-span-8">
          <Card className="relative overflow-hidden rounded-xl border-none bg-white p-3 shadow-xl">
            <div className="absolute right-0 top-0 p-3 opacity-5">
              <Globe className="h-64 w-64 rotate-12" />
            </div>
            <div className="relative z-10 space-y-10">
              <div className="flex items-center gap-3">
<<<<<<< HEAD
                <Factory className="h-6 w-6 text-indigo-600" />
=======
                <Factory className="text-accent-primary h-6 w-6" />
>>>>>>> recover/cabinet-wip-from-stash
                <h3 className="text-base font-black uppercase leading-none tracking-tight">
                  Transparency Supply Chain
                </h3>
              </div>

              <div className="relative">
                {/* Vertical Line */}
<<<<<<< HEAD
                <div className="absolute bottom-2 left-[19px] top-2 w-0.5 bg-slate-100" />
=======
                <div className="bg-bg-surface2 absolute bottom-2 left-[19px] top-2 w-0.5" />
>>>>>>> recover/cabinet-wip-from-stash

                <div className="space-y-6">
                  {supplyChain.map((step, idx) => (
                    <div key={idx} className="relative flex gap-3">
                      <div
                        className={cn(
                          'z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                          step.status === 'completed'
<<<<<<< HEAD
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                            : 'bg-slate-100 text-slate-400'
=======
                            ? 'bg-accent-primary shadow-accent-primary/10 text-white shadow-lg'
                            : 'bg-bg-surface2 text-text-muted'
>>>>>>> recover/cabinet-wip-from-stash
                        )}
                      >
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
<<<<<<< HEAD
                          <div className="h-2 w-2 rounded-full bg-slate-300" />
=======
                          <div className="bg-border-default h-2 w-2 rounded-full" />
>>>>>>> recover/cabinet-wip-from-stash
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
<<<<<<< HEAD
                            className="border-slate-100 px-2 text-[8px] font-black uppercase tracking-widest text-slate-400"
                          >
                            {step.stage}
                          </Badge>
                          <span className="flex items-center gap-1 text-[9px] font-bold uppercase text-slate-300">
                            <MapPin className="h-3 w-3" /> {step.location}
                          </span>
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-slate-900">
                          {step.detail}
                        </h4>
                        <p className="max-w-lg text-[10px] font-medium italic leading-relaxed text-slate-400">
=======
                            className="border-border-subtle text-text-muted px-2 text-[8px] font-black uppercase tracking-widest"
                          >
                            {step.stage}
                          </Badge>
                          <span className="text-text-muted flex items-center gap-1 text-[9px] font-bold uppercase">
                            <MapPin className="h-3 w-3" /> {step.location}
                          </span>
                        </div>
                        <h4 className="text-text-primary text-sm font-black uppercase tracking-tight">
                          {step.detail}
                        </h4>
                        <p className="text-text-muted max-w-lg text-[10px] font-medium italic leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                          Верифицировано независимым аудитором. Соответствует стандартам Fair Trade
                          и ISO 14001.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-3 md:grid-cols-2">
            <Card className="space-y-6 rounded-xl border-none bg-white p-4 shadow-xl">
              <div className="flex items-center gap-3">
<<<<<<< HEAD
                <ShieldCheck className="h-5 w-5 text-indigo-600" />
=======
                <ShieldCheck className="text-accent-primary h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
                <h3 className="text-sm font-black uppercase tracking-widest">
                  Official Certificates
                </h3>
              </div>
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div
                    key={cert.name}
<<<<<<< HEAD
                    className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-50 p-4 transition-all hover:border-indigo-100"
=======
                    className="border-border-subtle hover:border-accent-primary/20 group flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all"
>>>>>>> recover/cabinet-wip-from-stash
                  >
                    <div>
                      <p
                        className={cn(
                          'mb-1 inline-block rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-widest',
                          CERT_TONE[cert.tone]
                        )}
                      >
                        {cert.name}
                      </p>
<<<<<<< HEAD
                      <p className="text-[10px] font-bold leading-none text-slate-400">
                        {cert.description}
                      </p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-300 transition-colors group-hover:text-indigo-600" />
=======
                      <p className="text-text-muted text-[10px] font-bold leading-none">
                        {cert.description}
                      </p>
                    </div>
                    <ExternalLink className="text-text-muted group-hover:text-accent-primary h-3.5 w-3.5 transition-colors" />
>>>>>>> recover/cabinet-wip-from-stash
                  </div>
                ))}
              </div>
            </Card>

<<<<<<< HEAD
            <Card className="group relative overflow-hidden rounded-xl border-none bg-gradient-to-br from-indigo-600 to-indigo-950 p-4 text-white shadow-xl">
              <Recycle className="absolute -bottom-4 -right-4 h-32 w-32 rotate-12 opacity-10 transition-transform duration-700 group-hover:rotate-0" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <Recycle className="h-5 w-5 text-indigo-200" />
=======
            <Card className="from-accent-primary to-text-primary group relative overflow-hidden rounded-xl border-none bg-gradient-to-br p-4 text-white shadow-xl">
              <Recycle className="absolute -bottom-4 -right-4 h-32 w-32 rotate-12 opacity-10 transition-transform duration-700 group-hover:rotate-0" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                  <Recycle className="text-accent-primary/40 h-5 w-5" />
>>>>>>> recover/cabinet-wip-from-stash
                  <h3 className="text-sm font-black uppercase tracking-widest">
                    End of Life Cycle
                  </h3>
                </div>
                <div className="space-y-4">
<<<<<<< HEAD
                  <p className="text-xs font-medium italic leading-relaxed text-indigo-100">
=======
                  <p className="text-accent-primary/30 text-xs font-medium italic leading-relaxed">
>>>>>>> recover/cabinet-wip-from-stash
                    Syntha заботится о будущем. Когда вещь вам надоест, вы можете:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                      <p className="text-[10px] font-bold uppercase leading-tight">
                        Сдать на переработку (+300 SC)
                      </p>
                    </li>
                  </ul>
                </div>
<<<<<<< HEAD
                <Button className="h-10 w-full rounded-xl bg-white text-[9px] font-black uppercase tracking-widest text-slate-900 hover:bg-slate-100">
=======
                <Button className="text-text-primary hover:bg-bg-surface2 h-10 w-full rounded-xl bg-white text-[9px] font-black uppercase tracking-widest">
>>>>>>> recover/cabinet-wip-from-stash
                  Circularity Program Details
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
