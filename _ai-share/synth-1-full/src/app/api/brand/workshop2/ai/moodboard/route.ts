import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Имитация задержки генерации AI
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Возвращаем 4 mock-изображения
    const images = [
      {
        url: 'https://images.unsplash.com/photo-1550614000-4b95d4ed688c?auto=format&fit=crop&w=400&q=80',
        title: 'Вариант 1',
      },
      {
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
        title: 'Вариант 2',
      },
      {
        url: 'https://images.unsplash.com/photo-1434389678240-61f2214ebc29?auto=format&fit=crop&w=400&q=80',
        title: 'Вариант 3',
      },
      {
        url: 'https://images.unsplash.com/photo-1485230895905-ef1630137452?auto=format&fit=crop&w=400&q=80',
        title: 'Вариант 4',
      },
    ];

    return NextResponse.json({ images });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
