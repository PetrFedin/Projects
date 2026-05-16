import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Имитация задержки AI
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      hex: '#B47B84',
      label: 'Пыльная роза (Pantone 15-1614 TCX)'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
