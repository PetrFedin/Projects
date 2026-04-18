'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { processLiveUrl } from '@/lib/routes';
import { getLiveProcessDefinition } from '@/lib/live-process/process-definitions';
import type { ProcessLink } from '@/lib/live-process/types';

interface ProcessLinksBadgeProps {
  processLinks?: ProcessLink[];
  sourceStageId: string;
}

export function ProcessLinksBadge({ processLinks, sourceStageId }: ProcessLinksBadgeProps) {
  if (!processLinks?.length) return null;

  const links = processLinks.filter((l) => l.sourceStageId === sourceStageId);
  if (links.length === 0) return null;

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {links.map((link) => {
        const targetDef = getLiveProcessDefinition(link.targetProcessId);
        return (
          <Link
            key={`${link.sourceProcessId}-${link.sourceStageId}-${link.targetProcessId}`}
            href={processLiveUrl(link.targetProcessId)}
            className="inline-flex items-center gap-0.5 text-[10px] text-indigo-600 hover:text-indigo-700"
          >
            <ArrowRight className="h-3 w-3" />→ {targetDef?.name ?? link.targetProcessId}
          </Link>
        );
      })}
    </div>
  );
}
