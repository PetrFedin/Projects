'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ROUTES } from '@/lib/routes';
import { loadDigitalTwinTests } from '@/lib/fashion/digital-twin-logic';
import { ArrowLeft, Box, Users, MousePointerClick, Zap } from 'lucide-react';

export default function DigitalTwinTestingPage() {
  const tests = useMemo(() => loadDigitalTwinTests(), []);

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
            <Box className="h-6 w-6 text-violet-600" />
            Digital Twin A/B Testing
          </h1>
          <p className="text-sm text-muted-foreground">Тестирование спроса на новые дизайны через виртуальные рендеры до запуска в производство.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {tests.map(test => (
          <Card key={test.id} className={test.status === 'active' ? 'border-violet-200' : ''}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    {test.designName}
                    <Badge variant={test.status === 'active' ? 'default' : 'secondary'} className="text-[10px]">
                      {test.status.toUpperCase()}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">ID: {test.id} • {test.variants} Variants tested</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1 text-violet-600 flex items-center gap-1 justify-end">
                    <Zap className="h-3 w-3" /> Conversion Est.
                  </p>
                  <p className="text-2xl font-black text-violet-700">{test.conversionEstimate}%</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-6 pt-4 border-t">
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-bold">
                    <Users className="h-3 w-3" /> Audience reach
                  </p>
                  <p className="text-sm font-bold">{test.votes.toLocaleString()} users</p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-bold">
                    <MousePointerClick className="h-3 w-3" /> Top Variant
                  </p>
                  <p className="text-sm font-bold">Variant B (Eco-Black)</p>
                </div>
                <div className="flex items-end justify-end">
                  <Button variant="outline" size="sm" className="text-[10px] h-7 gap-2">
                    View Heatmap
                  </Button>
                  <Button size="sm" className={`text-[10px] h-7 ml-2 ${test.status === 'active' ? 'bg-violet-600' : ''}`}>
                    {test.status === 'active' ? 'Approve for Sample' : 'View Results'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
