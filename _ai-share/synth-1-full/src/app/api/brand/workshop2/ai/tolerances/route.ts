import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Имитация задержки AI
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({
      tolerances: {
        chest: 1.5,
        waist: 1.0,
        hips: 1.5,
        length: 2.0,
      },
      standard: 'GOST 31396-2009',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
