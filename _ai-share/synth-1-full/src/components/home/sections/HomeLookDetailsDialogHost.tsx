'use client';

import dynamic from 'next/dynamic';
import {
  useHomeShowroomLookDialog,
  useHomeShowroomShowcase,
} from '@/components/home/context/HomeShowroomMidFoldContext';

const LookDetailsDialogGate = dynamic(
  () =>
    import('@/components/home/dialogs/LookDetailsDialogGate').then((m) => ({
      default: m.LookDetailsDialogGate,
    })),
  { ssr: false }
);

/** Look dialog — читает split context; не триггерит re-render showcase consumers. */
export function HomeLookDetailsDialogHost() {
  const { selectedLook, isLookDetailsOpen, setIsLookDetailsOpen } =
    useHomeShowroomLookDialog();
  const { viewRole, setShowroomViewMode } = useHomeShowroomShowcase();

  return (
    <LookDetailsDialogGate
      isOpen={isLookDetailsOpen}
      onOpenChange={setIsLookDetailsOpen}
      selectedLook={selectedLook}
      viewRole={viewRole}
      setShowroomViewMode={setShowroomViewMode}
    />
  );
}
