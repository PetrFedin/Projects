'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/routes';
import { products } from '@/lib/products';
import { checkMpAssetCompliance } from '@/lib/fashion/asset-optimizer';
import { ArrowLeft, Image as ImageIcon, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

export default function AssetCompliancePage() {
  const rows = useMemo(() => products.slice(0, 20).map(p => ({
    product: p,
    compliance: checkMpAssetCompliance(p)
  })), []);

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ImageIcon className="h-6 w-6" />
            MP Asset Compliance
          </h1>
          <p className="text-sm text-muted-foreground">Проверка медиа-контента на соответствие требованиям WB, Ozon, Lamoda.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {rows.map(({ product, compliance }) => (
          <Card key={product.sku}>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{product.name} ({product.sku})</CardTitle>
                <Link href={`/products/${product.slug}`} target="_blank">
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                {compliance.map(c => (
                  <div key={c.channel} className="p-2 rounded border bg-muted/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase">{c.channel}</span>
                      {c.status === 'pass' ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-rose-600" />
                      )}
                    </div>
                    {c.missingTypes.length > 0 && (
                      <p className="text-[9px] text-rose-700 italic">Missing: {c.missingTypes.join(', ')}</p>
                    )}
                    {c.resolutionIssues.length > 0 && (
                      <p className="text-[9px] text-amber-700 italic">Issues: {c.resolutionIssues.join(', ')}</p>
                    )}
                    {c.status === 'pass' && (
                      <p className="text-[9px] text-emerald-700 font-medium tracking-tight">Ready for syndication</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
