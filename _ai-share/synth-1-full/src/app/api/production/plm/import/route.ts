import { NextRequest, NextResponse } from 'next/server';
import { parsePlmBom, type PlmProvider } from '@/lib/production/plm-integration';
import { plmImportBom } from '@/lib/integrations/plm-backend-proxy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      provider = 'gerber',
      collectionId = 'default',
      skuId,
      rawXml,
    } = body as {
      provider?: PlmProvider;
      collectionId?: string;
      skuId?: string;
      rawXml?: string;
    };
    const type = provider as 'gerber' | 'clo3d' | 'lectra';
    const remote = await plmImportBom(type, collectionId, rawXml);
    const bomItems =
      remote.bomItems && Array.isArray(remote.bomItems) && remote.bomItems.length > 0
        ? (remote.bomItems as {
            componentId: string;
            name: string;
            consumption: number;
            unit: string;
          }[])
        : rawXml
          ? parsePlmBom(provider, rawXml)
          : parsePlmBom(provider, '');
    return NextResponse.json({
      success: true,
      skuId: skuId ?? `TP-${Date.now().toString().slice(-4)}`,
      bomItems,
      itemsImported: remote.itemsImported ?? bomItems.length,
      gradations: [
        { size: 'XS', measurements: { chest: 84, waist: 64, hip: 90 } },
        { size: 'S', measurements: { chest: 88, waist: 68, hip: 94 } },
        { size: 'M', measurements: { chest: 92, waist: 72, hip: 98 } },
        { size: 'L', measurements: { chest: 96, waist: 76, hip: 102 } },
        { size: 'XL', measurements: { chest: 100, waist: 80, hip: 106 } },
      ],
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, errors: [e instanceof Error ? e.message : 'Import failed'] },
      { status: 400 }
    );
  }
}
