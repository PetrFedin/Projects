'use client';

import { Badge } from '@/components/ui/badge';

export function ControlCenterOperationalStrip() {
  return (
    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
      <Badge variant="outline" className="font-normal">
        Operational strip
      </Badge>
      <span>Live signals and shortcuts — stub for Control Center.</span>
    </div>
  );
}
