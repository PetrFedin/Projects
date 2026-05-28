import { NextResponse } from 'next/server';
import { readJsonBody } from '@/lib/http/read-json-body';

export async function POST(request: Request) {
  try {
    const { event, data, timestamp } = await readJsonBody<{
      event?: string;
      data?: unknown;
      timestamp?: unknown;
    }>(request);

    // Валидация webhook
    if (!event || !data) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    // Обработка различных событий
    switch (event) {
      case 'order.created':
        console.log('New order created:', data);
        // Триггер обновления Pipeline
        break;

      case 'stock.low':
        console.log('Low stock alert:', data);
        // Триггер AI Risk Radar
        break;

      case 'buyer.active':
        console.log('Buyer activity:', data);
        // Обновление Showroom Live
        break;

      case 'cohort.retention':
        console.log('Cohort retention update:', data);
        // Обновление Cohort Analysis
        break;

      default:
        console.log('Unknown event:', event);
    }

    return NextResponse.json({
      success: true,
      event,
      processed_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
