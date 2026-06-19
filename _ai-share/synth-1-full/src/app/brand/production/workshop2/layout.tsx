import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import {
  COLLECTION_DEV_HUB_LEAD_RU,
  COLLECTION_DEV_HUB_TITLE_RU,
} from '@/lib/production/collection-development-labels';
import { Workshop2ClientLayout } from './workshop2-client-layout';

export const metadata: Metadata = {
  title: COLLECTION_DEV_HUB_TITLE_RU,
  description: COLLECTION_DEV_HUB_LEAD_RU,
};

export default function Workshop2Layout({ children }: { children: ReactNode }) {
  return <Workshop2ClientLayout>{children}</Workshop2ClientLayout>;
}
