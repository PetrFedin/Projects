'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ROUTES } from '@/lib/routes';
import { getSupplierMetrics } from '@/lib/fashion/supplier-logic';
import { ArrowLeft, Factory, ShieldCheck, Clock, Award } from 'lucide-react';

export default function SupplierScorecardPage() {
  const rows = useMemo(() => getSupplierMetrics(), []);

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
            <Factory className="h-6 w-6" />
            Supplier Compliance Scorecard
          </h1>
          <p className="text-sm text-muted-foreground">Мониторинг качества, ESG-грейдов и соблюдения сроков отгрузки.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {rows.map((s) => (
          <Card key={s.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {s.name}
                    <Badge variant="outline" className="text-[10px] font-mono">{s.id}</Badge>
                  </CardTitle>
                  <CardDescription className="text-xs">Main category: Knitwear & Jersey</CardDescription>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">ESG Grade</p>
                  <Badge className={
                    s.esgGrade === 'A' ? 'bg-emerald-500' :
                    s.esgGrade === 'B' ? 'bg-lime-500' : 'bg-yellow-500'
                  }>Grade {s.esgGrade}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-amber-500" /> Quality Score</span>
                    <span>{s.qualityScore}%</span>
                  </div>
                  <Progress value={s.qualityScore} className="h-2 bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-blue-500" /> On-Time Delivery</span>
                    <span>{s.onTimeDeliveryPct}%</span>
                  </div>
                  <Progress value={s.onTimeDeliveryPct} className="h-2 bg-muted" />
                </div>
              </div>

              <div className="pt-4 border-t grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Avg Lead Time</p>
                  <p className="text-sm font-bold">{s.avgLeadTimeDays} days</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Audit Status</p>
                  <p className="text-sm font-bold text-emerald-600">Verified</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Active POs</p>
                  <p className="text-sm font-bold">12</p>
                </div>
                <div className="flex justify-end items-end">
                  <Button variant="outline" size="sm" className="text-[10px] h-7">View Factory Portal</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
