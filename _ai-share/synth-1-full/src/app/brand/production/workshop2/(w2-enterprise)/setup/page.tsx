'use client';

import { Workshop2SetupHealthPanel } from '@/components/brand/production/Workshop2SetupHealthPanel';
import { Workshop2DomainEventsSyncButton } from '@/components/brand/production/Workshop2DomainEventsSyncButton';
import { Workshop2SetupAdminActions } from '@/components/brand/production/Workshop2SetupAdminActions';
import { Workshop2SetupArticleImportPanel } from '@/components/brand/production/Workshop2SetupArticleImportPanel';

export default function Workshop2SetupPage() {
  return (
    <div className="space-y-6 pb-16">
      <Workshop2SetupHealthPanel />
      <div className="flex flex-wrap gap-2">
        <Workshop2DomainEventsSyncButton />
        <Workshop2SetupAdminActions />
      </div>
      <Workshop2SetupArticleImportPanel defaultCollectionId="SS27" />
    </div>
  );
}
