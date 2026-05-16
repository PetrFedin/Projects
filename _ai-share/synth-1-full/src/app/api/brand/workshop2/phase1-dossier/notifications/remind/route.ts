import { NextResponse } from 'next/server';
import { logObservability } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as any;
    const { section, side, url, message } = body;

    logObservability('api.http', {
      route: '/api/brand/workshop2/phase1-dossier/notifications/remind',
      method: 'POST',
      status: 200,
      latencyMs: 0,
    });

    // Real Resend integration logic
    const resendApiKey = process.env.RESEND_API_KEY;
    let delivered = false;
    
    if (resendApiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'Tech Pack System <onboarding@resend.dev>',
          to: 'factory-tech@example.com', // In a real system, resolve based on dossier/article
          subject: `Напоминание: Требуется подпись ТЗ (Секция: ${section})`,
          html: `<p><strong>${message}</strong></p><p>Ссылка на Техническое Задание: <a href="${url}">${url}</a></p>`,
        }),
      });
      if (!res.ok) {
        console.error('[RESEND ERROR]', await res.text());
      } else {
        delivered = true;
      }
    } else {
      console.warn('[RESEND SKIPPED] RESEND_API_KEY not configured.');
    }

    console.log('[NOTIFICATION SENT]', {
      type: 'TzSignoffReminder',
      section,
      side,
      url,
      message,
      delivered,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, delivered });
  } catch (err) {
    console.error('[NOTIFICATION ERROR]', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}