'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import {
  getPartnersByRegion,
  getTerritoryConflicts,
  type PartnerTerritory,
  type TerritoryConflict,
} from '@/lib/b2b/partner-territory-map';
import { MapPin, AlertTriangle, Shield, Store, Users } from 'lucide-react';

export default function BrandPartnerMapPage() {
  const [regions, setRegions] = useState<
    { regionKey: string; region: string; partners: PartnerTerritory[] }[]
  >([]);
  const [conflicts, setConflicts] = useState<TerritoryConflict[]>([]);

  const load = useCallback(() => {
    setRegions(getPartnersByRegion());
    setConflicts(getTerritoryConflicts());
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-6 pb-24">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold uppercase tracking-tight">
          <MapPin className="h-6 w-6" /> Карта партнёров / территории
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Colect: визуально кто где торгует, конфликты территории, статус эксклюзива.
        </p>
      </div>

      {conflicts.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-amber-800">
              <AlertTriangle className="h-4 w-4" /> Конфликты территории
            </CardTitle>
            <CardDescription>
              Регионы, где несколько партнёров или эксклюзив оспорен.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {conflicts.map((c) => (
              <div key={c.regionKey} className="rounded-lg border border-amber-100 bg-white p-3">
                <p className="text-sm font-medium text-amber-900">{c.region}</p>
                <p className="mt-0.5 text-xs text-amber-800">{c.message}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.partners.map((p) => (
                    <Badge
                      key={p.partnerId}
                      variant={p.isExclusive ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {p.partnerName} {p.isExclusive ? '· Эксклюзив' : ''}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Store className="h-4 w-4" /> Партнёры по регионам
          </CardTitle>
          <CardDescription>Кто где торгует, статус эксклюзива по территории.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {regions.map(({ regionKey, region, partners }) => (
              <div key={regionKey} className="rounded-xl border border-slate-200 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <span className="font-medium">{region}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {partners.length} партн.
                  </Badge>
                </div>
                <ul className="space-y-2">
                  {partners.map((p) => (
                    <li key={p.partnerId} className="flex items-center justify-between text-sm">
                      <span>{p.partnerName}</span>
                      <div className="flex items-center gap-1">
                        {p.isExclusive && (
                          <Badge className="gap-0.5 bg-emerald-600 text-[10px]">
                            <Shield className="h-2.5 w-2.5" /> Эксклюзив
                          </Badge>
                        )}
                        <Badge
                          variant={p.status === 'active' ? 'secondary' : 'outline'}
                          className="text-[10px]"
                        >
                          {p.status === 'active' ? 'Активен' : p.status}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.retailers}>
            <Users className="mr-1 h-3.5 w-3.5" /> Партнёры
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.lookbookProjects}>Лукбуки</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.brand.buyerApplications}>Заявки на доступ</Link>
        </Button>
      </div>
    </div>
  );
}
