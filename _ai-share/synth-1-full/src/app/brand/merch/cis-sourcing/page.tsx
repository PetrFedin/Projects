'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Factory, MapPin, ShieldCheck, Star, Users, Briefcase, Zap, Search } from 'lucide-react';
import { getCisSuppliers } from '@/lib/fashion/cis-sourcing';
import { Button } from '@/components/ui/button';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';

export default function CisSourcingPage() {
  const suppliers = getCisSuppliers();

  return (
    <CabinetPageContent maxWidth="6xl" className="space-y-6 p-8 pb-24">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-100 p-2">
            <Factory className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="text-text-primary text-3xl font-bold tracking-tight">
            Local Sourcing Registry (CIS)
          </h1>
        </div>
        <p className="text-muted-foreground">
          Реестр проверенных фабрик и ателье в России и странах СНГ для оптимизации производства и
          логистики.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {suppliers.map((s) => (
          <Card
            key={s.id}
            className="border-border-subtle border-2 p-6 shadow-sm transition-all hover:border-emerald-200"
          >
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 shadow-sm">
                  <Briefcase className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-text-muted mb-1 text-[10px] font-black uppercase leading-none">
                    {s.id}
                  </div>
                  <h3 className="text-text-primary text-xl font-bold tracking-tight">{s.name}</h3>
                  <div className="text-text-secondary mt-1 flex items-center gap-1.5 text-xs font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-emerald-500" /> {s.location}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1 text-sm font-black uppercase text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" /> {s.rating}
                </div>
                <Badge
                  variant="outline"
                  className="h-4 border-emerald-100 bg-emerald-50 text-[9px] font-black uppercase tracking-tighter text-emerald-700 shadow-sm"
                >
                  {s.specialization}
                </Badge>
              </div>
            </div>

            <div className="border-border-subtle mb-6 grid grid-cols-2 gap-4 border-t pt-4">
              <div className="bg-bg-surface2/80 border-border-subtle rounded-lg border p-3 text-center shadow-sm">
                <div className="text-text-muted mb-1 text-[10px] font-black uppercase">
                  Min Order (MOQ)
                </div>
                <div className="text-text-primary text-lg font-black">{s.moq} pcs</div>
              </div>
              <div className="bg-bg-surface2/80 border-border-subtle rounded-lg border p-3 text-center shadow-sm">
                <div className="text-text-muted mb-1 text-[10px] font-black uppercase">
                  Certifications
                </div>
                <div className="mt-1 flex justify-center gap-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <Zap className="h-4 w-4 text-amber-500" />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="h-10 flex-1 bg-emerald-600 text-[11px] font-black uppercase text-white shadow-md hover:bg-emerald-700">
                Request RFQ Pack
              </Button>
              <Button
                variant="outline"
                className="border-border-default h-10 text-[11px] font-black uppercase"
              >
                Profile
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden border-2 border-emerald-50 bg-emerald-50/10 p-6 shadow-sm">
          <div className="absolute right-0 top-0 rotate-45 p-2 opacity-5">
            <Search className="h-12 w-12" />
          </div>
          <div className="mb-4 flex items-center gap-3 text-emerald-600">
            <Users className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase">Supplier Matching</h3>
          </div>
          <p className="mb-4 text-[11px] font-medium leading-snug text-emerald-600">
            AI-based matching based on your design complexity and target pricing.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-full border-emerald-200 text-[10px] font-black uppercase text-emerald-700 hover:bg-emerald-50"
          >
            Start Matchmaking
          </Button>
        </Card>

        <Card className="border-border-subtle bg-bg-surface2/20 border-2 p-6 shadow-sm">
          <div className="text-text-secondary mb-4 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase">Audit Reports</h3>
          </div>
          <p className="text-text-secondary mb-4 text-[11px] font-medium leading-snug">
            Latest social and quality audit reports for all registered CIS suppliers.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="border-border-default text-text-primary h-8 w-full text-[10px] font-black uppercase"
          >
            View Reports
          </Button>
        </Card>

        <Card className="border-2 border-amber-50 bg-amber-50/10 p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3 text-amber-600">
            <Zap className="h-5 w-5" />
            <h3 className="text-sm font-bold uppercase">Quick Sourcing</h3>
          </div>
          <p className="mb-4 text-[11px] font-medium leading-snug text-amber-600">
            Need samples in 48h? Access our premium rapid-ateliers in Moscow and SPB.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-full border-amber-200 text-[10px] font-black uppercase text-amber-700 hover:bg-amber-50"
          >
            Request Samples
          </Button>
        </Card>
      </div>

      <div className="mt-8 flex items-center gap-5 rounded-xl border border-emerald-100 bg-emerald-50 p-5 shadow-md">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-emerald-200 bg-white shadow-sm">
          <Factory className="h-6 w-6 text-emerald-600" />
        </div>
        <div className="flex-1">
          <div className="mb-1 text-xs font-black uppercase tracking-tight text-emerald-700">
            Sourcing Intelligence Unit
          </div>
          <div className="text-sm font-bold leading-snug tracking-tight text-emerald-600">
            Платформа рекомендует фабрику <b>"Moscow Atelier Lab"</b> для вашей коллекции
            аксессуаров на основе текущей загрузки мощностей и географической близости к
            центральному складу.
          </div>
        </div>
      </div>
    </CabinetPageContent>
  );
}
