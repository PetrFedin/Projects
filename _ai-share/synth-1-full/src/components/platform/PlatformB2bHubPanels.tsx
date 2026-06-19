'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { buildPlatformB2bHubSession } from '@/lib/b2b/platform-b2b-hub';
import { useWorkshop2PublishedArticleCount } from '@/hooks/use-workshop2-published-article-count';
import { PlatformB2bSpineGoldenPathStrip } from '@/components/platform/PlatformB2bSpineGoldenPathStrip';
import { Compass, Store, Users } from 'lucide-react';

type Props = {
  collectionId?: string;
};

export function PlatformB2bHubOverviewPanel({ collectionId }: Props) {
  const session = buildPlatformB2bHubSession({ collectionId });
  const cid = session.collectionId;
  const { count, loading, error } = useWorkshop2PublishedArticleCount(cid);

  return (
    <div className="space-y-4 px-4 pb-8" data-testid="platform-b2b-hub-overview-panel">
      <PlatformB2bSpineGoldenPathStrip
        collectionId={cid}
        activeStep="hub"
        testIdPrefix="platform-b2b-hub"
      />
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Store className="h-4 w-4" />
            <CardTitle className="text-base">B2B Platform hub</CardTitle>
            {!loading && !error && count != null ? (
              <Badge
                variant="outline"
                className="border-emerald-500/40 text-[10px] text-emerald-800"
                data-testid="platform-b2b-hub-published-pg-badge"
              >
                PG · {count} published
              </Badge>
            ) : null}
          </div>
          <CardDescription>
            Столп 2 · sample_collection: marketroom → partners → shop buy path.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.marketroomShowcaseHref} data-testid="platform-hub-marketroom-link">
              Open marketroom
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.partnersDirectoryHref}>Partners directory</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.shopShowroomHref}>Shop showroom</Link>
          </Button>
          <Button size="sm" variant="secondary" asChild>
            <Link href={session.shopMatrixHref} data-testid="platform-b2b-hub-shop-matrix-link">
              Shop matrix
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.brandPublishHref} data-testid="platform-b2b-hub-brand-publish-link">
              Brand publish
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function PlatformB2bHubMarketroomBridgePanel({ collectionId }: Props) {
  const session = buildPlatformB2bHubSession({ collectionId });

  return (
    <div className="space-y-4 px-4 pb-8" data-testid="platform-b2b-hub-marketroom-panel">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Compass className="h-4 w-4" />
            <CardTitle className="text-base">Marketroom entry</CardTitle>
          </div>
          <CardDescription>Full workspace на отдельном маршруте — здесь только мост.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.marketroomShowcaseHref}>Showcase workspace</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.buyPathHref}>Buy path tab</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function PlatformB2bHubPartnersBridgePanel({ collectionId }: Props) {
  const session = buildPlatformB2bHubSession({ collectionId });

  return (
    <div className="space-y-4 px-4 pb-8" data-testid="platform-b2b-hub-partners-panel">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Users className="h-4 w-4" />
            <CardTitle className="text-base">Partners entry</CardTitle>
          </div>
          <CardDescription>Directory · shop roster · marketroom bridge.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" asChild>
            <Link href={session.partnersDirectoryHref}>Partners workspace</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={session.marketroomShowcaseHref}>Marketroom showcase</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
