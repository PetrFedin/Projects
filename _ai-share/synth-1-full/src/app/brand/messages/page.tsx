'use client';

import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { BrandMessagesCorePage } from '@/app/brand/messages/messages-core';

const BrandMessagesLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/brand/messages/messages-legacy').then(
      (m) => m.BrandMessagesLegacyPage
    ),
  { ssr: false }
);

export default function BrandMessagesPage() {
  if (isPlatformCoreMode()) return <BrandMessagesCorePage />;
  return <BrandMessagesLegacyPage />;
}
