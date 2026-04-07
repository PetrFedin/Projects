import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_TRIGGERS } from '@/lib/notifications/triggers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { triggerId, channels = ['email', 'push'], payload } = body as {
      triggerId: string;
      channels?: string[];
      payload?: { title?: string; text?: string; userId?: string };
    };
    const cfg = DEFAULT_TRIGGERS.find(t => t.id === triggerId);
    if (!cfg) {
      return NextResponse.json({ success: false, error: 'Unknown trigger' }, { status: 400 });
    }
    // Mock — реально: SendGrid для email, FCM для push
    const sent = {
      email: channels.includes('email') && cfg.email,
      push: channels.includes('push') && cfg.push,
    };
    return NextResponse.json({
      success: true,
      sent,
      message: payload?.title ?? cfg.label,
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Send failed' },
      { status: 400 }
    );
  }
}
