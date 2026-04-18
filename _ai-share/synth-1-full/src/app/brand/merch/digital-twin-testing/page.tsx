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
import { Progress } from '@/components/ui/progress';
import { ROUTES } from '@/lib/routes';
import { loadDigitalTwinTests } from '@/lib/fashion/digital-twin-logic';
import { ArrowLeft, Box, Users, MousePointerClick, Zap } from 'lucide-react';

export default function DigitalTwinTestingPage() {
  const tests = useMemo(() => loadDigitalTwinTests(), []);

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 py-6 pb-24">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.brand.growthHub}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold">
            <Box className="text-accent-primary h-6 w-6" />
            Digital Twin A/B Testing
          </h1>
          <p className="text-sm text-muted-foreground">
            Тестирование спроса на новые дизайны через виртуальные рендеры до запуска в
            производство.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {tests.map((test) => (
          <Card
            key={test.id}
            className={test.status === 'active' ? 'border-accent-primary/25' : ''}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    {test.designName}
                    <Badge
                      variant={test.status === 'active' ? 'default' : 'secondary'}
                      className="text-[10px]"
                    >
                      {test.status.toUpperCase()}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs">
                    ID: {test.id} • {test.variants} Variants tested
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-accent-primary mb-1 flex items-center justify-end gap-1 text-[10px] font-bold uppercase text-muted-foreground">
                    <Zap className="h-3 w-3" /> Conversion Est.
                  </p>
                  <p className="text-accent-primary text-2xl font-black">
                    {test.conversionEstimate}%
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 border-t pt-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase text-muted-foreground">
                    <Users className="h-3 w-3" /> Audience reach
                  </p>
                  <p className="text-sm font-bold">{test.votes.toLocaleString()} users</p>
                </div>
                <div className="space-y-1.5">
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase text-muted-foreground">
                    <MousePointerClick className="h-3 w-3" /> Top Variant
                  </p>
                  <p className="text-sm font-bold">Variant B (Eco-Black)</p>
                </div>
                <div className="flex items-end justify-end">
                  <Button variant="outline" size="sm" className="h-7 gap-2 text-[10px]">
                    View Heatmap
                  </Button>
                  <Button
                    size="sm"
                    className={`ml-2 h-7 text-[10px] ${test.status === 'active' ? 'bg-accent-primary' : ''}`}
                  >
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
