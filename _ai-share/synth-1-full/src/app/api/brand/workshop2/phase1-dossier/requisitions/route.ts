import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { quantity, materialLines, scrapRate = 0 } = (await req.json()) as any;

    // Mock generation of purchase orders
    const requisitions = (materialLines || []).map((line: any) => {
      const yieldPerUnit = line.yieldPerUnit || line.consumption || 1.1; // fallback
      const pureRequired = quantity * yieldPerUnit;
      const totalRequired = Math.ceil(pureRequired * (1 + scrapRate / 100)); // including scrap rate buffer

      return {
        materialName: line.materialName || 'Unknown Material',
        supplier: line.supplier || 'N/A',
        yieldPerUnit,
        unit: line.unit || 'm',
        pureRequired,
        totalRequired,
        scrapRate,
        nodeId: line.nodeId,
      };
    });

    return NextResponse.json({ requisitions });
  } catch (err) {
    return NextResponse.json({ error: 'Failed' }, { status: 400 });
  }
}
