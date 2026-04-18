import { NextResponse } from 'next/server';

const DB: Record<string, Array<{ value: string; label: string }>> = {
  brands: [
    { value: 'brand_syntha_lab', label: 'Syntha Lab' },
    { value: 'brand_nordic_wool', label: 'Nordic Wool' },
  ],
  suppliers: [
    { value: 'factory-01', label: 'Factory 01' },
    { value: 'factory-02', label: 'Factory 02' },
  ],
  retailers: [
    { value: 'willow', label: 'Willow' },
    { value: 'sage', label: 'Sage' },
  ],
  marketplaces: [
    { value: 'main', label: 'Main marketplace' },
    { value: 'b2b', label: 'B2B wholesale' },
  ],
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const type = String(url.searchParams.get('type') ?? '');
  const q = String(url.searchParams.get('q') ?? '').toLowerCase();

  const list = DB[type] ?? [];
  const filtered = q ? list.filter((x) => x.label.toLowerCase().includes(q)) : list;

  return NextResponse.json({ options: filtered.slice(0, 30) });
}
