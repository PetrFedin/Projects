'use client';

import { useParams } from 'next/navigation';
import { LiveProcessPageBody } from '@/components/live-process/LiveProcessPageBody';

export default function BrandProcessLivePage() {
  const params = useParams();
  const processId = typeof params.processId === 'string' ? params.processId : '';
  return <LiveProcessPageBody processId={processId} />;
}
