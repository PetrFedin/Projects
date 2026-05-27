import { NextResponse } from 'next/server';
import type { Workshop2VendorBid } from '@/lib/production/workshop2-dossier-phase1.types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as any;
    const { action, articleId, bidId, currentBids } = body;

    if (!articleId) {
      return NextResponse.json({ error: 'Missing articleId' }, { status: 400 });
    }

    if (action === 'add_mock_bid') {
      const factories = ['ШвейПром', 'ООО "Эталон"', 'Фабрика №1', 'Текстиль-Мастер', 'FashionSew'];
      const randomFactory = factories[Math.floor(Math.random() * factories.length)];

      const newBid: Workshop2VendorBid = {
        id: crypto.randomUUID(),
        vendorId: `vendor-${Math.floor(Math.random() * 1000)}`,
        vendorName: randomFactory,
        cmtPrice: Math.floor(Math.random() * 1500) + 500,
        currency: 'RUB',
        leadTimeDays: Math.floor(Math.random() * 30) + 14,
        moq: Math.floor(Math.random() * 500) + 100,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };

      return NextResponse.json({ bid: newBid });
    }

    if (action === 'accept_bid') {
      if (!bidId) {
        return NextResponse.json({ error: 'Missing bidId' }, { status: 400 });
      }

      const bids = (Array.isArray(currentBids) ? currentBids : []) as any[];
      const updatedBids = bids.map((bid: Workshop2VendorBid) => {
        if (bid.id === bidId) {
          return { ...bid, status: 'accepted' as const };
        }
        return { ...bid, status: 'rejected' as const };
      });

      return NextResponse.json({ bids: updatedBids });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Error in bids API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
