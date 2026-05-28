import { NextRequest, NextResponse } from 'next/server';

/** Open-Meteo free API, no key required */
const MOSCOW = { lat: 55.7558, lon: 37.6173 };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat') ?? MOSCOW.lat;
  const lon = searchParams.get('lon') ?? MOSCOW.lon;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code`;
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error('Weather API error');
    const json = (await res.json()) as {
      current?: {
        temperature_2m?: number;
        precipitation?: number;
        weather_code?: number;
      };
    };
    const current = json.current;
    return NextResponse.json({
      temperature: Math.round(current?.temperature_2m ?? 15),
      precipitation: current?.precipitation ?? 0,
      weatherCode: current?.weather_code ?? 0,
    });
  } catch (e) {
    console.warn('[weather] Failed:', e);
    return NextResponse.json({ temperature: 15, precipitation: 0, weatherCode: 0 });
  }
}
