'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

import * as topojson from 'topojson-client';
import { geoMercator, geoPath } from 'd3-geo';

import worldData from '@/data/world-topo.json'; // твой topojson (обязательно)
import { CIS_VIEW_DATA } from './geo.constants';
import { CisCode, PeriodPreset, GeoAnalyticsResponse } from './geo.types';
import { heatColor, computeWeeklyInsights, minMaxForPoint } from './geo.utils';
import { GeoTimelineStrip } from './GeoTimelineStrip';

type TooltipState = {
  x: number;
  y: number;
  label: string;
  sublabel?: string;
} | null;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mapping ISO A2 codes to Numeric ISO codes used in world-topo.json
const CIS_ID_MAP: Record<CisCode, string> = {
  RU: '643',
  BY: '112',
  UA: '804',
  KZ: '398',
  AM: '051',
  AZ: '031',
  KG: '417',
  UZ: '860',
  TJ: '762',
  TM: '795',
  MD: '498',
  GE: '268',
};

export function GeoAnalyticsDialog({ open, onOpenChange }: Props) {
  const [hoverTooltip, setHoverTooltip] = React.useState<TooltipState>(null);
  const [cityTooltip, setCityTooltip] = React.useState<TooltipState>(null);
  const [selectedCode, setSelectedCode] = React.useState<CisCode>('RU');

  const [period, setPeriod] = React.useState<PeriodPreset>('90d');
  const [isPlaying, setIsPlaying] = React.useState(false);

  const [data, setData] = React.useState<GeoAnalyticsResponse | null>(null);
  const [index, setIndex] = React.useState(0);

  // 1) Грузим данные (мок API, но реальный endpoint)
  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      const res = await fetch(`/api/geo/analytics?granularity=week&period=${period}`, {
        cache: 'no-store',
      });
      const json = (await res.json()) as GeoAnalyticsResponse;
      if (cancelled) return;
      setData(json);
      setIndex(Math.max(0, json.points.length - 1));
      setIsPlaying(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [period]);

  // 2) Play timeline
  React.useEffect(() => {
    if (!isPlaying) return;
    if (!data?.points?.length) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1 >= data.points.length ? 0 : prev + 1));
    }, 1200);

    return () => clearInterval(id);
  }, [isPlaying, data?.points?.length]);

  const points = data?.points ?? [];
  const current = points[index] ?? points[0];
  const prev = index > 0 ? points[index - 1] : null;

  const weeklyInsights = React.useMemo(() => {
    if (!current) return 'Нет данных.';
    return computeWeeklyInsights(prev, current);
  }, [prev, current]);

  const { min: minViewers, max: maxViewers } = React.useMemo(() => {
    if (!current) return { min: 0, max: 1 };
    return minMaxForPoint(current);
  }, [current]);

  // 3) Topo -> features
  const countries = React.useMemo(() => {
    if (!worldData) return [];
    const geo = topojson.feature(worldData as any, (worldData as any).objects.countries) as any;

    return geo.features as any[];
  }, []);

  const worldProjection = React.useMemo(
    () =>
      geoMercator().fitSize([800, 400], { type: 'FeatureCollection', features: countries } as any),
    [countries]
  );

  const worldPath = React.useMemo(() => geoPath(worldProjection), [worldProjection]);

  const cisFeatures = React.useMemo(
    () => countries.filter((f) => Object.values(CIS_ID_MAP).includes(String(f.id))),
    [countries]
  );

  const cisProjection = React.useMemo(
    () =>
      geoMercator().fitSize([420, 360], {
        type: 'FeatureCollection',
        features: cisFeatures,
      } as any),
    [cisFeatures]
  );

  const cisPath = React.useMemo(() => geoPath(cisProjection), [cisProjection]);

  const clearTooltips = () => {
    setHoverTooltip(null);
    setCityTooltip(null);
  };

  function getViewers(code: CisCode) {
    if (!current) return CIS_VIEW_DATA[code].viewers;
    return current.viewersByCountry?.[code] ?? CIS_VIEW_DATA[code].viewers;
  }

  const getCisCodeFromId = (id: string | number): CisCode | undefined => {
    const entry = Object.entries(CIS_ID_MAP).find(([_, val]) => val === String(id));
    return entry ? (entry[0] as CisCode) : undefined;
  };

  const selectedCountry = React.useMemo(() => {
    const base = CIS_VIEW_DATA[selectedCode];
    const viewers = getViewers(selectedCode);
    return { ...base, viewers };
  }, [selectedCode, current]);

  const handleCountryHover = (e: React.MouseEvent<SVGPathElement>, code: CisCode) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    const bounds = svg.getBoundingClientRect();

    setHoverTooltip({
      x: e.clientX - bounds.left + 10,
      y: e.clientY - bounds.top + 10,
      label: CIS_VIEW_DATA[code]?.name ?? code,
      sublabel: `Зрителей: ${getViewers(code).toLocaleString('ru-RU')}`,
    });
  };

  const handleCityHover = (
    e: React.MouseEvent<SVGCircleElement>,
    city: { name: string; viewers: number },
    countryName: string
  ) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return;
    const bounds = svg.getBoundingClientRect();

    setCityTooltip({
      x: e.clientX - bounds.left + 10,
      y: e.clientY - bounds.top + 10,
      label: city.name,
      sublabel: `${countryName} · зрителей: ${city.viewers.toLocaleString('ru-RU')}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>GeoAnalytics — мир + зум по СНГ</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[3fr,2fr]">
          {/* LEFT: World + controls */}
          <div className="bg-text-primary text-text-inverse space-y-3 rounded-xl p-4">
            <div className="text-text-muted flex flex-wrap items-center justify-between gap-3 text-xs">
              <span>Мир: кликабельны Россия и страны СНГ</span>
              <span>Цвет = интенсивность аудитории (heatmap)</span>
            </div>

            <GeoTimelineStrip
              period={period}
              onPeriodChange={(p) => {
                setPeriod(p);
              }}
              points={points}
              index={index}
              onIndexChange={(i) => {
                setIndex(i);
                setIsPlaying(false);
              }}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying((v) => !v)}
            />

            <div className="text-text-muted text-xs">{weeklyInsights}</div>

            <div className="bg-text-primary relative aspect-[2/1] w-full overflow-hidden rounded-lg">
              <svg viewBox="0 0 800 400" className="h-full w-full" onMouseLeave={clearTooltips}>
                {countries.map((f, idx) => {
                  const cisCode = getCisCodeFromId(f.id);
                  const isCis = !!cisCode;

                  const fill = isCis
                    ? heatColor(getViewers(cisCode), minViewers, maxViewers)
                    : '#1f2937';

                  return (
                    <path
                      key={idx}
                      d={worldPath(f) || ''}
                      fill={fill}
                      opacity={isCis ? 0.92 : 0.35}
                      stroke="#020617"
                      strokeWidth={isCis ? 1 : 0.5}
                      className={isCis ? 'cursor-pointer transition-all hover:opacity-100' : ''}
                      onMouseMove={isCis ? (e) => handleCountryHover(e, cisCode) : undefined}
                      onMouseEnter={isCis ? (e) => handleCountryHover(e, cisCode) : undefined}
                      onMouseLeave={isCis ? clearTooltips : undefined}
                      onClick={isCis ? () => setSelectedCode(cisCode) : undefined}
                    />
                  );
                })}

                {hoverTooltip && (
                  <foreignObject x={hoverTooltip.x} y={hoverTooltip.y} width={240} height={70}>
                    <div className="bg-text-primary/95 text-text-inverse border-text-primary/25 rounded-md border px-3 py-2 text-xs shadow-lg">
                      <div className="font-semibold">{hoverTooltip.label}</div>
                      {hoverTooltip.sublabel && (
                        <div className="text-text-muted mt-0.5">{hoverTooltip.sublabel}</div>
                      )}
                    </div>
                  </foreignObject>
                )}
              </svg>
            </div>
          </div>

          {/* RIGHT: CIS zoom + cities */}
          <div className="space-y-4">
            <Card>
              <CardContent className="space-y-3 p-4">
                <div className="text-text-muted text-xs uppercase">Зум по СНГ</div>

                <div className="bg-text-primary relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <svg viewBox="0 0 420 360" className="h-full w-full" onMouseLeave={clearTooltips}>
                    {cisFeatures.map((f, idx) => {
                      const code = getCisCodeFromId(f.id)!;
                      const isSelected = selectedCode === code;

                      const fill = heatColor(getViewers(code), minViewers, maxViewers);

                      return (
                        <path
                          key={idx}
                          d={cisPath(f) || ''}
                          fill={fill}
                          opacity={isSelected ? 1 : 0.86}
                          stroke={isSelected ? '#fbbf24' : '#020617'}
                          strokeWidth={isSelected ? 1.6 : 1}
                          className="cursor-pointer transition-all hover:opacity-100"
                          onMouseMove={(e) => handleCountryHover(e as any, code)}
                          onMouseEnter={(e) => handleCountryHover(e as any, code)}
                          onMouseLeave={clearTooltips}
                          onClick={() => setSelectedCode(code)}
                        />
                      );
                    })}

                    {selectedCountry.cities.map((city) => {
                      const [cx, cy] = cisProjection([city.lon, city.lat]) as [number, number];
                      return (
                        <g key={city.name}>
                          <circle
                            cx={cx}
                            cy={cy}
                            r={5}
                            fill="#f97316"
                            stroke="#111827"
                            strokeWidth={1}
                            className="cursor-pointer"
                            onMouseMove={(e) => handleCityHover(e, city, selectedCountry.name)}
                            onMouseEnter={(e) => handleCityHover(e, city, selectedCountry.name)}
                            onMouseLeave={() => setCityTooltip(null)}
                          />
                          <circle
                            cx={cx}
                            cy={cy}
                            r={10}
                            fill="none"
                            stroke="#f97316"
                            strokeWidth={1}
                            opacity={0.35}
                          />
                        </g>
                      );
                    })}

                    {cityTooltip && (
                      <foreignObject x={cityTooltip.x} y={cityTooltip.y} width={280} height={70}>
                        <div className="bg-text-primary/95 text-text-inverse rounded-md border border-amber-500/70 px-3 py-2 text-xs shadow-lg">
                          <div className="font-semibold">{cityTooltip.label}</div>
                          {cityTooltip.sublabel && (
                            <div className="text-text-muted mt-0.5">{cityTooltip.sublabel}</div>
                          )}
                        </div>
                      </foreignObject>
                    )}

                    {hoverTooltip && !cityTooltip && (
                      <foreignObject x={hoverTooltip.x} y={hoverTooltip.y} width={240} height={70}>
                        <div className="bg-text-primary/95 text-text-inverse border-text-primary/25 rounded-md border px-3 py-2 text-xs shadow-lg">
                          <div className="font-semibold">{hoverTooltip.label}</div>
                          {hoverTooltip.sublabel && (
                            <div className="text-text-muted mt-0.5">{hoverTooltip.sublabel}</div>
                          )}
                        </div>
                      </foreignObject>
                    )}
                  </svg>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-text-muted space-y-2 p-4 text-sm">
                <div className="font-semibold">{selectedCountry.name}</div>
                <div className="text-text-muted">
                  Всего зрителей:{' '}
                  <span className="font-mono">
                    {selectedCountry.viewers.toLocaleString('ru-RU')}
                  </span>
                </div>

                <div className="text-text-muted mb-1 mt-2 text-xs">Города (симуляция)</div>
                <ul className="space-y-1 text-sm">
                  {selectedCountry.cities.map((city) => (
                    <li key={city.name} className="flex items-center justify-between">
                      <span>{city.name}</span>
                      <span className="text-text-muted font-mono">
                        {city.viewers.toLocaleString('ru-RU')}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
