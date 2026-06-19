'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchBrandMaterialPassportCerts } from '@/lib/fashion/brand-material-passport-certs-store';
import {
  brandMaterialPassportFeatureHref,
  brandMaterialPassportReleaseChecklistHref,
  brandMaterialPassportSyndicationHref,
} from '@/lib/fashion/brand-material-passport-workspace';

type Props = {
  collectionId?: string;
};

export function BrandMaterialPassportReleasePanel({ collectionId = 'SS27' }: Props) {
  const [ready, setReady] = useState(0);
  const [total, setTotal] = useState(0);
  const [releaseBlocked, setReleaseBlocked] = useState(true);
  const [storageMode, setStorageMode] = useState<string>('demo');

  const reload = useCallback(async () => {
    const res = await fetchBrandMaterialPassportCerts(collectionId);
    setReady(res.summary?.ready ?? 0);
    setTotal(res.summary?.total ?? 0);
    setReleaseBlocked(res.releaseBlocked ?? true);
    setStorageMode(res.storageMode ?? 'demo');
  }, [collectionId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const certsHref = brandMaterialPassportFeatureHref('certs', collectionId);
  const checklistHref = brandMaterialPassportReleaseChecklistHref(collectionId);
  const syndicationHref = brandMaterialPassportSyndicationHref(collectionId);

  return (
    <div className="space-y-4" data-testid="brand-material-passport-release-panel">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Material → release</Badge>
        <Badge variant="outline">Столп 1 → 2</Badge>
        <Badge variant="outline" data-testid={`brand-material-passport-release-source-${storageMode}`}>
          {storageMode === 'pg' ? 'PG release' : `${storageMode} release`}
        </Badge>
        {releaseBlocked ? (
          <Badge variant="destructive" data-testid="brand-material-passport-release-blocked-badge">
            Blocked · {ready}/{total} certs
          </Badge>
        ) : (
          <Badge className="border-emerald-300 bg-emerald-50 text-emerald-800" data-testid="brand-material-passport-release-ready-badge">
            Certs ready · {ready}/{total}
          </Badge>
        )}
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Release linkage</CardTitle>
          <CardDescription>
            Certs и rollup должны быть ready до sc-release-gate и syndication.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href={certsHref}>Material certs</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={checklistHref}>Release checklist</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={syndicationHref}>Syndication feed</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
