'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { workshop2B2bShowroom3dStreamTooltipRu } from '@/lib/production/workshop2-b2b-showroom-3d-stream';

type StreamState = {
  mode: 'placeholder' | 'live';
  token?: string;
  hintRu?: string;
};

/** Wave 34: chip «3D stream» — disabled + RU tooltip когда URL не задан. */
export function B2bShowroom3dStreamChip() {
  const [state, setState] = useState<StreamState>({ mode: 'placeholder' });
  const envTooltip = workshop2B2bShowroom3dStreamTooltipRu();

  useEffect(() => {
    void fetch('/api/shop/b2b/showroom/stream-token')
      .then((r) => r.json())
      .then((json: StreamState & { ok?: boolean }) => {
        if (json.ok !== false) {
          setState({
            mode: json.mode ?? 'placeholder',
            token: json.token,
            hintRu: json.hintRu,
          });
        }
      })
      .catch(() => {
        /* keep placeholder */
      });
  }, []);

  const disabled = state.mode !== 'live';
  const tooltip = state.hintRu ?? envTooltip;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <Badge
              variant={disabled ? 'secondary' : 'default'}
              className={`text-[9px] font-black uppercase ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
              aria-disabled={disabled}
            >
              3D stream
            </Badge>
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs text-xs">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
