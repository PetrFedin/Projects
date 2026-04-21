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
import { products } from '@/lib/products';
import { checkMpAssetCompliance } from '@/lib/fashion/asset-optimizer';
import { ArrowLeft, Image as ImageIcon, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { CabinetPageContent } from '@/components/layout/cabinet-page-content';

export default function AssetCompliancePage() {
  const rows = useMemo(
    () =>
      products.slice(0, 20).map((p) => ({
        product: p,
        compliance: checkMpAssetCompliance(p),
      })),
    []
  );

  return (
    <CabinetPageContent maxWidth="6xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <ImageIcon className="h-6 w-6" />
            MP Asset Compliance
          </h1>
          <p className="text-sm text-muted-foreground">
            Проверка медиа-контента на соответствие требованиям WB, Ozon, Lamoda.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {rows.map(({ product, compliance }) => (
          <Card key={product.sku}>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {product.name} ({product.sku})
                </CardTitle>
                <Link href={`/products/${product.slug}`} target="_blank">
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                {compliance.map((c) => (
                  <div key={c.channel} className="space-y-2 rounded border bg-muted/20 p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase">{c.channel}</span>
                      {c.status === 'pass' ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-rose-600" />
                      )}
                    </div>
                    {c.missingTypes.length > 0 && (
                      <p className="text-[9px] italic text-rose-700">
                        Missing: {c.missingTypes.join(', ')}
                      </p>
                    )}
                    {c.resolutionIssues.length > 0 && (
                      <p className="text-[9px] italic text-amber-700">
                        Issues: {c.resolutionIssues.join(', ')}
                      </p>
                    )}
                    {c.status === 'pass' && (
                      <p className="text-[9px] font-medium tracking-tight text-emerald-700">
                        Ready for syndication
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CabinetPageContent>
  );
}
