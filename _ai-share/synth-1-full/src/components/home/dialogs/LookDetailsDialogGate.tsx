'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const LookDetailsDialog = dynamic(
  () =>
    import('@/components/home/dialogs/LookDetailsDialog').then((m) => ({
      default: m.LookDetailsDialog,
    })),
  { ssr: false }
);

type ShowroomViewMode = 'products' | 'looks' | 'collections' | 'my_orders' | 'planning';

type LookDetailsDialogGateProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLook: unknown;
  viewRole: string;
  setShowroomViewMode: (mode: ShowroomViewMode) => void;
};

/** Look details modal — chunk грузится при первом открытии, остаётся для close animation. */
export function LookDetailsDialogGate({
  isOpen,
  onOpenChange,
  selectedLook,
  viewRole,
  setShowroomViewMode,
}: LookDetailsDialogGateProps) {
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (isOpen) setHasOpened(true);
  }, [isOpen]);

  if (!hasOpened) return null;

  return (
    <LookDetailsDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      selectedLook={selectedLook}
      viewRole={viewRole}
      setShowroomViewMode={setShowroomViewMode}
    />
  );
}
