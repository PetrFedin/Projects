'use client';

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { ShopSidebarHeader } from '@/components/shop/ShopSidebarHeader';
import { ShopLayoutSidebarPanel } from '@/app/shop/ShopLayoutSidebarPanel';
import type { Resource, Action, PlatformRole } from '@/lib/rbac';

type ShopMobileSidebarSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: PlatformRole;
  can: (resource: Resource, action: Action) => boolean;
};

/** Мобильное меню shop hub — chunk при первом открытии. */
export function ShopMobileSidebarSheet({
  open,
  onOpenChange,
  role,
  can,
}: ShopMobileSidebarSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex w-72 flex-col gap-0 p-0">
        <div className="shrink-0 pb-0 pt-12">
          <ShopSidebarHeader />
        </div>
        <div className="border-border-subtle shrink-0 border-b px-3 pb-2">
          <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
            Навигация
          </p>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ShopLayoutSidebarPanel role={role} can={can} onNavigate={() => onOpenChange(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
