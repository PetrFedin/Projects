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
    <div className="container max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href={ROUTES.brand.controlCenter ?? ROUTES.brand.home}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold uppercase tracking-tight">LIVE процессы</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Хаб всех поэтапных схем: production, B2B, логистика, сорсинг, QC, финансы, согласование, ЭДО
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {LIVE_PROCESS_DEFINITIONS.map((def) => (
          <Link key={def.id} href={processLiveUrl(def.id)}>
            <Card className="h-full transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-slate-500" />
                  <CardTitle className="text-base">{def.name}</CardTitle>
                </div>
                <CardDescription className="text-sm line-clamp-2">{def.description}</CardDescription>
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
