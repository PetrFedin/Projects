'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Activity } from 'lucide-react';
import { LIVE_PROCESS_DEFINITIONS } from '@/lib/live-process/process-definitions';
import { processLiveUrl } from '@/lib/routes';
import { ROUTES } from '@/lib/routes';

export default function LiveProcessHubPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-6 pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href={ROUTES.brand.controlCenter ?? ROUTES.brand.home}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold uppercase tracking-tight">LIVE процессы</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Хаб всех поэтапных схем: production, B2B, логистика, сорсинг, QC, финансы, согласование,
            ЭДО
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {LIVE_PROCESS_DEFINITIONS.map((def) => (
          <Link key={def.id} href={processLiveUrl(def.id)}>
            <Card className="h-full cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-slate-500" />
                  <CardTitle className="text-base">{def.name}</CardTitle>
                </div>
                <CardDescription className="line-clamp-2 text-sm">
                  {def.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-xs text-slate-400">
                  {def.stages.length} этапов
                  {def.contextKey && ` · контекст: ${def.contextKey}`}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
