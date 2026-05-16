import { NextResponse } from 'next/server';
import type { Workshop2TaMilestone } from '@/lib/production/workshop2-dossier-phase1.types';

// In-memory mock data
let mockMilestones: Workshop2TaMilestone[] = [
  {
    id: 'm1',
    title: 'Fabric Ordering',
    targetDate: '2026-06-01',
    actualDate: null,
    status: 'pending',
  },
  {
    id: 'm2',
    title: 'Cutting',
    targetDate: '2026-06-15',
    actualDate: null,
    status: 'pending',
  },
  {
    id: 'm3',
    title: 'Sewing',
    targetDate: '2026-06-30',
    actualDate: null,
    status: 'pending',
  },
  {
    id: 'm4',
    title: 'QC',
    targetDate: '2026-07-05',
    actualDate: null,
    status: 'pending',
  },
  {
    id: 'm5',
    title: 'Shipping',
    targetDate: '2026-07-10',
    actualDate: null,
    status: 'pending',
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get('articleId');
  
  // Return the in-memory mock milestones regardless of articleId for the mock
  return NextResponse.json({ milestones: mockMilestones });
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as any;
    const { milestoneId, actualDate, status } = body;

    const index = mockMilestones.findIndex((m) => m.id === milestoneId);
    if (index === -1) {
      return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
    }

    mockMilestones[index] = {
      ...mockMilestones[index]!,
      ...(actualDate !== undefined && { actualDate }),
      ...(status !== undefined && { status }),
    };

    return NextResponse.json({ milestone: mockMilestones[index] });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
