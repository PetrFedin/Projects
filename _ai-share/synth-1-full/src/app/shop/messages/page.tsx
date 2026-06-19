'use client';

import dynamic from 'next/dynamic';
import { isPlatformCoreMode } from '@/lib/cabinet-core-mode';
import { ShopMessagesCorePage } from '@/app/shop/messages/messages-core';

const ShopMessagesLegacyPage = dynamic(
  () =>
    import('@/_archive/platform-core-legacy/app/shop/messages/messages-legacy').then(
      (m) => m.ShopMessagesLegacyPage
    ),
  { ssr: false }
);

export default function ShopMessagesPage() {
  if (isPlatformCoreMode()) return <ShopMessagesCorePage />;
  return <ShopMessagesLegacyPage />;
}
