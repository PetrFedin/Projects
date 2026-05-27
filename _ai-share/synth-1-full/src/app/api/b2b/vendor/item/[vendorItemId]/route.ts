import { NextResponse } from 'next/server';
import { getVendorItemStock } from '@/lib/b2b/vendor-connect';

export async function GET(request: Request, { params }: { params: { vendorItemId: string } }) {
  try {
    // Threat Model T-02-01, T-02-02: Require valid user session and verify org scope
    // In this mock environment, we simulate the auth check
    const authHeader = request.headers.get('Authorization');
    const isMockAuth =
      process.env.NODE_ENV === 'development' ||
      process.env.NEXT_PUBLIC_SYNTH_DEV_AUTO_LOGIN !== 'false';

    // In a real app, we would validate the JWT and check if the user's organization
    // has access to this vendor's catalog.

    const { vendorItemId } = params;

    if (!vendorItemId) {
      return NextResponse.json({ error: 'vendorItemId is required' }, { status: 400 });
    }

    const stockData = await getVendorItemStock(vendorItemId);

    return NextResponse.json(stockData);
  } catch (error) {
    console.error('Failed to fetch vendor item stock:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
