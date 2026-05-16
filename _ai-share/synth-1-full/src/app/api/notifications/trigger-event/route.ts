import { NextRequest, NextResponse } from 'next/server';
import { TriggerType, DEFAULT_TRIGGERS } from '@/lib/notifications/triggers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, body: messageBody } = body;

    if (!type || !title || !messageBody) {
      return NextResponse.json({ error: 'Missing required fields: type, title, body' }, { status: 400 });
    }

    // Validate type against allowed TriggerType values (T-13-03 mitigation)
    const isValidTrigger = DEFAULT_TRIGGERS.some((t) => t.id === type);
    if (!isValidTrigger) {
      return NextResponse.json({ error: `Invalid trigger type: ${type}` }, { status: 400 });
    }

    // Mock dispatching the event
    console.log(`[Notification Hub] Dispatched event: ${type}`);
    console.log(`[Notification Hub] Title: ${title}`);
    console.log(`[Notification Hub] Body: ${messageBody}`);

    return NextResponse.json({
      success: true,
      dispatched: {
        type,
        title,
        body: messageBody,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }
}
