'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  WORKSHOP2_DOSSIER_VIEW_OPTIONS,
  type Workshop2DossierViewProfile,
} from '@/lib/production/workshop2-dossier-view-infrastructure';
import { useWorkshop2DossierView } from '@/components/brand/production/workshop2-dossier-view-context';

export function Workshop2DossierViewModeSelect({ className }: { className?: string }) {
  const { profile, setProfile } = useWorkshop2DossierView();

  return (
    <div className={className}>
      <Label htmlFor="w2-dossier-view-mode" className="sr-only">
        Режим просмотра ТЗ
      </Label>
      <Select value={profile} onValueChange={(v) => setProfile(v as Workshop2DossierViewProfile)}>
        <SelectTrigger id="w2-dossier-view-mode" className="h-9 w-[min(100%,220px)] text-xs">
          <SelectValue placeholder="Режим просмотра" />
        </SelectTrigger>
        <SelectContent>
          {WORKSHOP2_DOSSIER_VIEW_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-xs">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
