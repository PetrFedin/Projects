'use client';

import { ProductionPageContentModalsRejectSampleInner } from '@/app/brand/production/production-page-content-modals-reject-sample-inner';

export function ProductionPageContentModalsRejectSample({ p }: { p: Record<string, unknown> }) {
  const px = p as Record<string, any>;
  const {
    rejectSample,
    setRejectSample,
    rejectReason,
    setRejectReason,
    rejectCommentCustom,
    setRejectCommentCustom,
    setSampleStatuses,
    handleAction,
  } = px;

  return (
    <ProductionPageContentModalsRejectSampleInner
      rejectSample={rejectSample}
      setRejectSample={setRejectSample}
      rejectReason={rejectReason}
      setRejectReason={setRejectReason}
      rejectCommentCustom={rejectCommentCustom}
      setRejectCommentCustom={setRejectCommentCustom}
      setSampleStatuses={setSampleStatuses}
      handleAction={handleAction}
    />
  );
}
