'use client';

import { AutoPOWizard } from '@/components/brand/AutoPOWizard';
import { CostingCalculator } from '@/components/brand/CostingCalculator';
import { FittingLog } from '@/components/brand/FittingLog';
import { LabellingWizard } from '@/components/brand/LabellingWizard';
import { MaterialHandoverAct } from '@/components/brand/MaterialHandoverAct';
import { MaterialMarketplace } from '@/components/brand/MaterialMarketplace';

export function ProductionPageContentModalsDialogStackTools({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const {
    isAutoPOOpen,
    setIsAutoPOOpen,
    isCostingOpen,
    setIsCostingOpen,
    isFittingLogOpen,
    setIsFittingLogOpen,
    isLabellingWizardOpen,
    setIsLabellingWizardOpen,
    isHandoverActOpen,
    setIsHandoverActOpen,
    isMarketplaceOpen,
    setIsMarketplaceOpen,
  } = px;

  return (
    <>
      <AutoPOWizard isOpen={!!isAutoPOOpen} onOpenChange={(open) => setIsAutoPOOpen?.(open)} />
      <LabellingWizard
        isOpen={!!isLabellingWizardOpen}
        onOpenChange={(open) => setIsLabellingWizardOpen?.(open)}
      />
      <MaterialHandoverAct
        isOpen={!!isHandoverActOpen}
        onOpenChange={(open) => setIsHandoverActOpen?.(open)}
      />
      <CostingCalculator
        isOpen={!!isCostingOpen}
        onOpenChange={(open) => setIsCostingOpen?.(open)}
      />
      <FittingLog
        isOpen={!!isFittingLogOpen}
        onOpenChange={(open) => setIsFittingLogOpen?.(open)}
      />
      <MaterialMarketplace
        isOpen={!!isMarketplaceOpen}
        onOpenChange={(open) => setIsMarketplaceOpen?.(open)}
        initialQuery=""
      />
    </>
  );
}
