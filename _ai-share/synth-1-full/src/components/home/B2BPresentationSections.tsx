'use client';

import { ProductionSection } from './_components/ProductionSection';
import { ProcurementSection } from './sections/ProcurementSection';
import { EcosystemSection } from './_components/EcosystemSection';
import { PartnersSection } from './_components/PartnersSection';
import { RhythmSection } from './_components/RhythmSection';
import { MediaHubSection } from './_components/MediaHubSection';
import { WorkplaceSection } from './sections/WorkplaceSection';
import { useRouter } from 'next/navigation';

type B2BPresentationSectionsProps = {
  isVisible: boolean;
};

export function B2BPresentationSections({ isVisible }: B2BPresentationSectionsProps) {
  const router = useRouter();
  if (!isVisible) return null;

  return (
    <>
      <ProductionSection />
      <WorkplaceSection />
      <EcosystemSection />
      <PartnersSection />
      <RhythmSection />
      <MediaHubSection />
      <ProcurementSection viewRole="b2b" router={router} />
    </>
  );
}
