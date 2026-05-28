'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { getAvailableCampaigns } from '@/lib/fashion/campaign-logic';
import { ArrowLeft, Megaphone, Calendar, Lock, Globe, Percent } from 'lucide-react';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';

export default function CampaignVersionsPage() {
  const campaigns = useMemo(() => getAvailableCampaigns(), []);

  return (
    <CabinetPageContent maxWidth="5xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <Megaphone className="h-6 w-6" />
            B2B Campaign Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Управление версиями каталога и условиями доступа для разных сегментов байеров.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {campaigns.map((c) => (
          <Card key={c.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    {c.id.toUpperCase()}
                    <Badge variant="outline" className="text-[10px] font-normal">
                      {c.version.replace('_', ' ')}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3" /> Access until {c.accessExpiry}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">
                    Price Multiplier
                  </p>
                  <p className="text-lg font-bold text-primary">{c.priceMultiplier}x</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between border-t pt-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5" />
                    <span>Private Link</span>
                  </div>
                  {c.moqOverride && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Percent className="h-3.5 w-3.5" />
                      <span>MOQ: {c.moqOverride} pcs</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Copy Invite
                  </Button>
                  <Button size="sm" className="h-8 text-xs">
                    View Catalog
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CabinetPageContent>
  );
}
