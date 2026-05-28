import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json';
  const period = searchParams.get('period') || 'month';

  // Mock data - в продакшене подключить к БД
  const data = {
    timestamp: new Date().toISOString(),
    period,
    kpis: {
      gmv: 388000000,
      fillRate: 94.2,
      customers: 12482,
      partners: 128,
    },
    risks: [
      { type: 'production', severity: 'high', description: 'Фабрика Восток опаздывает на 5 дней' },
      { type: 'deadstock', severity: 'high', description: 'SKU #4821 риск затаривания 82%' },
      { type: 'cashflow', severity: 'medium', description: 'Ликвидность 18 дней' },
    ],
    pipeline: {
      draft: 78500000,
      pending: 110900000,
      confirmed: 194000000,
    },
  };

  if (format === 'csv') {
    const csv = `Метрика,Значение\nGMV,${data.kpis.gmv}\nFill Rate,${data.kpis.fillRate}\nКлиенты,${data.kpis.customers}\nПартнеры,${data.kpis.partners}`;
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="dashboard-${period}-${Date.now()}.csv"`,
      },
    });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();

  // Webhook для внешних систем
  console.log('Dashboard webhook triggered:', body);

  return NextResponse.json({
    success: true,
    message: 'Webhook processed',
    timestamp: new Date().toISOString(),
  });
}
