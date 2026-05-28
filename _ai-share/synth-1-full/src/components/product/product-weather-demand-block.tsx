'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudSun, Thermometer, Wind, TrendingUp, Compass, AlertCircle } from 'lucide-react';
import { getWeatherDemandCorrelation } from '@/lib/fashion/weather-demand';
import type { Product } from '@/lib/types';

export function ProductWeatherDemandBlock({ product }: { product: Product }) {
  const regions = [
    'Central Russia',
    'Siberia (Novosibirsk)',
    'South (Krasnodar)',
    'North-West (SPB)',
  ];
  const activeRegion = regions[0];
  const correlation = getWeatherDemandCorrelation(product.sku, activeRegion);

  return (
    <Card className="relative my-4 overflow-hidden border-2 border-sky-50 bg-sky-50/10 p-4 shadow-sm">
      <div className="pointer-events-none absolute right-0 top-0 rotate-12 p-4 opacity-5">
        <CloudSun className="h-16 w-16 text-sky-600" />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sky-600">
          <CloudSun className="h-4 w-4" />
          <h4 className="text-text-primary text-[10px] font-black uppercase tracking-widest">
            Regional Weather-Demand Nexus
          </h4>
        </div>
        <Badge className="border-none bg-sky-600 text-[8px] font-black uppercase text-white">
          Central RU (June 26)
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex min-w-[70px] flex-col items-center rounded-xl border border-sky-100 bg-white/50 p-3">
              <Thermometer className="mb-1 h-5 w-5 text-sky-600" />
              <div className="text-text-primary text-[12px] font-black uppercase leading-none">
                {correlation.idealTempRange}
              </div>
              <div className="text-text-muted mt-1 text-[7px] font-black uppercase">
                Ideal Range
              </div>
            </div>
            <div className="flex min-w-[70px] flex-col items-center rounded-xl border border-sky-100 bg-white/50 p-3">
              <TrendingUp className="mb-1 h-5 w-5 text-emerald-600" />
              <div className="text-[12px] font-black uppercase leading-none text-emerald-600">
                +{Math.round((correlation.demandShiftFactor - 1) * 100)}%
              </div>
              <div className="text-text-muted mt-1 text-[7px] font-black uppercase">
                Demand Shift
              </div>
            </div>
          </div>

          <div className="relative rounded-xl border border-sky-200 bg-white/80 p-3 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 text-sky-600" />
              <span className="text-text-primary text-[9px] font-black uppercase">
                AI Recommendation
              </span>
            </div>
            <p className="text-text-secondary text-[10px] font-bold leading-tight">
              {correlation.recommendation}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-text-muted mb-1 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest">
            <Compass className="h-3 w-3" /> Sensitivity Map
          </div>
          <div className="space-y-2">
            {regions.map((reg) => {
              const regCorr = getWeatherDemandCorrelation(product.sku, reg);
              return (
                <div key={reg} className="space-y-1">
                  <div className="text-text-secondary flex justify-between text-[8px] font-black uppercase">
                    <span>{reg}</span>
                    <span>{regCorr.temperatureSensitivity}/10 Sens.</span>
                  </div>
                  <div className="bg-bg-surface2 h-1 overflow-hidden rounded-full">
                    <div
                      className="h-full bg-sky-400"
                      style={{ width: `${regCorr.temperatureSensitivity * 10}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-text-muted mt-4 flex items-center justify-between border-t border-sky-100 pt-4 text-[8px] font-black uppercase">
        <span>Powered by RU Weather Forecast APIs</span>
        <span className="text-sky-600">Predictive Modeling Active</span>
      </div>
    </Card>
  );
}
