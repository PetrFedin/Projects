import { NextRequest, NextResponse } from 'next/server';
import type { ErpProvider } from '@/lib/production/erp-integration';
import { erpSync } from '@/lib/integrations/erp-backend-proxy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      provider = '1c',
      scope = 'all',
      collectionIds,
    } = body as {
      provider?: ErpProvider;
      scope?: 'orders' | 'stock' | 'finance' | 'all';
      collectionIds?: string[];
    };
    const erpProvider = provider as '1c' | 'sap' | 'moysklad';
    const result = await erpSync(erpProvider, scope, collectionIds);
    return NextResponse.json({
      success: result.success,
      scope,
      ordersSync: result.ordersSync,
      stockSync: result.stockSync,
      financeSync: result.financeSync,
      lastSync: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, errors: [e instanceof Error ? e.message : 'Sync failed'] },
      { status: 400 }
    );
  }
}
