import { NextResponse } from 'next/server';

import { buildWorkshop2InvestorDemoBrief } from '@/lib/production/workshop2-investor-demo-brief';
import { buildWorkshop2InvestorBriefPdfBytes } from '@/lib/production/workshop2-investor-brief-pdf';

/** GET — investor brief PDF (Platform Core P0: полный export pipeline). */
export async function GET() {
  const brief = buildWorkshop2InvestorDemoBrief();
  const bytes = buildWorkshop2InvestorBriefPdfBytes(brief);
  return new NextResponse(bytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="investor-brief-platform-core.pdf"',
      'Cache-Control': 'no-store',
    },
  });
}
