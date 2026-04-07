import { NextResponse } from 'next/server';

/**
 * API для коллекций производства
 * GET /api/production/collections
 * Пока возвращает мок — заменить на запрос к БД при интеграции
 */
export async function GET() {
  const collections = [
    { id: 'SS26', name: 'Summer Solstice 2026', status: 'Production', items: 12, readiness: '65%', budget: '4.2M ₽', type: 'Коллекция', priority: 'High', deadline: '2026-05-15', responsible: 'Анна К.', season: 'SS26', seasonStart: '2026-01-15', seasonEnd: '2026-05-30' },
    { id: 'DROP-UZ', name: 'Urban Zen Drop', status: 'Development', items: 5, readiness: '20%', budget: '850k ₽', type: 'Дроп', priority: 'Standard', deadline: '2026-04-10', responsible: 'Игорь М.', season: 'DROP', seasonStart: '2026-03-01', seasonEnd: '2026-04-15' },
    { id: 'BASIC', name: 'Core Basics (Replenish)', status: 'Active', items: 24, readiness: '100%', budget: '1.2M ₽', type: 'Сток', priority: 'Low', deadline: '—', responsible: 'Елена С.', season: 'BASIC', seasonStart: null, seasonEnd: null },
  ];
  return NextResponse.json({ data: collections });
}
