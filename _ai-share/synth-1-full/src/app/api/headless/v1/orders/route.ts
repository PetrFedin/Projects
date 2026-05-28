import { NextResponse } from 'next/server';
import { readJsonBody } from '@/lib/http/read-json-body';

/**
 * Headless Commerce API — POST /v1/orders
 * Прием заказов от внешних фронтендов.
 */

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer syn_live_')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { items, customer_email, shipping_address } = await readJsonBody<{
      items?: Array<{ price?: number; qty?: number }>;
      customer_email?: string;
      shipping_address?: unknown;
    }>(request);

    if (!items || !items.length || !customer_email) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Имитация создания заказа в ERP/OMS Synth-1
    const orderId = `ORD-HEADLESS-${Date.now()}`;

    return NextResponse.json({
      status: 'success',
      data: {
        order_id: orderId,
        total_amount: items.reduce((sum: number, it: any) => sum + it.price * it.qty, 0),
        status: 'pending_payment',
        payment_url: `https://checkout.synth1.fashion/pay/${orderId}`,
        estimated_delivery: '2026-03-15',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
