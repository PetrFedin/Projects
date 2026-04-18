'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Globe,
  MapPin,
  Leaf,
  Droplets,
  ShieldCheck,
  QrCode,
  History,
  Info,
  ChevronRight,
  Calculator,
  ExternalLink,
  Zap,
  CheckCircle2,
  Package,
  Calendar,
  Building2,
  ArrowRightLeft,
  Share2,
  Scissors,
  Layers,
  Sparkles,
  Heart,
  ShoppingCart,
  ArrowLeft,
} from 'lucide-react';
import { getProductPassport, MATERIAL_SOURCES } from '@/lib/logic/passport-utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { AcronymWithTooltip } from '@/components/ui/acronym-with-tooltip';
import { RegistryPageShell } from '@/components/design-system';

/**
 * Digital Product Passport (DPP) Public View
 * Публичная страница истории вещи для конечного клиента.
 */

export default function ProductPassportPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = React.use(paramsPromise);
  const passport = getProductPassport(params.id) || getProductPassport('PASS-9921')!;
  const sources = MATERIAL_SOURCES[passport.id] || [];

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-bg-surface2 text-text-primary min-h-screen pb-20">
      {/* Mobile-Friendly Header */}
      <div className="border-border-subtle sticky top-0 z-50 border-b bg-white px-6 py-4 shadow-sm">
        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center space-y-3 px-4 text-center sm:px-6">
          {/* Back Button */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="hover:bg-bg-surface2 h-8 w-8 rounded-full"
            >
              <Link href="/brand/products">
                <ArrowLeft className="text-text-muted h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="text-accent-primary flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
            <ShieldCheck className="h-3.5 w-3.5" />
            Digital Product Passport (<AcronymWithTooltip abbr="DPP" />)
          </div>
          <h1 className="font-headline text-sm font-black uppercase tracking-tighter">
            {passport.name}
          </h1>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="h-5 border-emerald-100 bg-emerald-50 px-2 text-[8px] font-black uppercase text-emerald-600"
            >
              Authentic & Verified
            </Badge>
            <span className="text-text-muted text-[10px] font-black uppercase">
              <AcronymWithTooltip abbr="SKU" />: {passport.sku}
            </span>
          </div>
        </div>
      </div>

      <RegistryPageShell className="mt-8 max-w-2xl space-y-4 pb-16">
        {/* Visual Header / Gallery Mock */}
        <Card className="overflow-hidden rounded-xl border-none bg-white shadow-md shadow-xl">
          <div className="bg-bg-surface2 group relative flex aspect-[4/5] items-center justify-center">
            <Package className="text-text-muted h-20 w-20" />
            <div className="absolute right-6 top-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur">
                <Heart className="h-5 w-5 text-rose-500" />
              </div>
            </div>
          </div>
        </Card>

        {/* Origin & Production Section */}
        <div className="space-y-4">
          <h3 className="text-text-muted ml-4 text-[10px] font-black uppercase tracking-widest">
            Origin & Supply Chain
          </h3>
          <Card className="space-y-4 rounded-xl border-none p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-accent-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
                <Globe className="text-accent-primary h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black uppercase tracking-tight">
                  Made in {passport.originCountry}
                </p>
                <p className="text-text-secondary text-xs font-medium">
                  {passport.factoryName}, {passport.factoryLocation}
                </p>
              </div>
            </div>

            <div className="border-border-subtle space-y-4 border-t pt-6">
              <p className="text-text-muted text-[10px] font-black uppercase">
                Material Traceability
              </p>
              {sources.map((source, i) => (
                <div
                  key={i}
                  className="bg-bg-surface2 flex items-center justify-between rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="border-border-subtle flex h-8 w-8 items-center justify-center rounded-full border bg-white">
                      <Layers className="text-accent-primary h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">{source.material}</p>
                      <p className="text-text-muted text-[9px] font-medium uppercase">
                        {source.origin} • {source.supplier}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[8px] font-black uppercase text-emerald-600"
                  >
                    {source.sustainabilityScore}% ESG
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Environmental Impact */}
        <div className="space-y-4">
          <h3 className="text-text-muted ml-4 text-[10px] font-black uppercase tracking-widest">
            Environmental Impact
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-text-primary space-y-3 rounded-xl border-none p-4 text-white shadow-sm">
              <div className="text-accent-primary flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                <span className="text-[8px] font-black uppercase tracking-widest">
                  Carbon Footprint
                </span>
              </div>
              <p className="text-sm font-black">{passport.carbonFootprint} kg</p>
              <p className="text-[10px] font-bold uppercase tracking-tight text-white/40">
                CO2 PER ITEM
              </p>
            </Card>
            <Card className="border-border-subtle space-y-3 rounded-xl border border-none bg-white p-4 shadow-sm">
              <div className="text-accent-primary flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                <span className="text-[8px] font-black uppercase tracking-widest">Water Usage</span>
              </div>
              <p className="text-text-primary text-sm font-black">
                {isMounted ? passport.waterUsage.toLocaleString() : '—'} L
              </p>
              <p className="text-text-muted text-[10px] font-bold uppercase tracking-tight">
                LITERS PER ITEM
              </p>
            </Card>
          </div>
        </div>

        {/* Certifications */}
        <div className="space-y-4">
          <h3 className="text-text-muted ml-4 text-[10px] font-black uppercase tracking-widest">
            Verified Certifications
          </h3>
          <div className="flex flex-wrap gap-2">
            {passport.certifications.map((cert, i) => (
              <Badge
                key={i}
                className="text-accent-primary border-accent-primary/20 h-10 gap-2 rounded-full border bg-white px-6 text-[9px] font-black uppercase shadow-sm"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {cert}
              </Badge>
            ))}
          </div>
        </div>

        {/* Composition & Care */}
        <div className="space-y-4">
          <h3 className="text-text-muted ml-4 text-[10px] font-black uppercase tracking-widest">
            Care & Circularity
          </h3>
          <Card className="space-y-4 rounded-xl border-none p-4 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Scissors className="text-accent-primary h-4 w-4" />
                <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                  Composition
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {passport.composition.map((mat, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-sm font-black">{mat.percentage}%</p>
                    <p className="text-text-muted text-[10px] font-bold uppercase">
                      {mat.material}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-border-subtle space-y-6 border-t pt-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                    Care Instructions
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {passport.careInstructions.map((instr, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="text-accent-primary h-3 w-3" />
                      <span className="text-text-secondary text-xs font-medium">{instr}</span>
                    </div>
                  ))}
                </div>
              </div>

              {passport.repairGuideUrl && (
                <Button
                  variant="outline"
                  className="border-border-subtle h-12 w-full gap-2 rounded-2xl text-[10px] font-black uppercase"
                >
                  <History className="h-4 w-4" /> Repair & Care Guide
                  <ExternalLink className="ml-auto h-3 w-3 opacity-40" />
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Resale CTA */}
        {passport.resaleEligible && (
          <Card className="shadow-accent-primary/10 bg-accent-primary space-y-6 rounded-xl border-none p-4 text-white shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                <ArrowRightLeft className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight">One-Click Resale</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                  CIRCULAR ECONOMY
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-white/80">
              Эта вещь верифицирована. Вы можете мгновенно выставить её на перепродажу через
              маркетплейс Synth-1, получив полную цену за аутентичность.
            </p>
            <Button className="text-accent-primary hover:bg-accent-primary/10 h-12 w-full rounded-xl border-none bg-white text-[10px] font-black uppercase">
              List for Resale
            </Button>
          </Card>
        )}

        {/* Blockchain Proof */}
        {passport.blockchainHash && (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="border-border-subtle rounded-3xl border bg-white p-4 shadow-sm">
              <QrCode className="text-text-primary h-32 w-32" />
            </div>
            <div className="space-y-1 text-center">
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">
                Blockchain Verified
              </p>
              <p className="text-text-muted font-mono text-[9px]">{passport.blockchainHash}</p>
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="border-border-subtle fixed bottom-0 left-0 right-0 z-50 border-t bg-white/80 p-4 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-2xl gap-3 px-4 sm:px-6">
            <Button className="bg-text-primary h-10 flex-1 gap-2 rounded-2xl text-[10px] font-black uppercase text-white">
              <ShoppingCart className="h-4 w-4" /> Add to Closet
            </Button>
            <Button variant="outline" className="border-border-default h-10 w-10 rounded-2xl">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </RegistryPageShell>
    </div>
  );
}
