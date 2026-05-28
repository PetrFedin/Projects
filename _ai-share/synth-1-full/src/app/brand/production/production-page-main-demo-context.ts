/**
 * Статический контекст коллекции для демо production-main (без setter — не состояние).
 * В приложении импортируйте `production-page-main-demo-context.resolve.ts`, чтобы уважать
 * `NEXT_PUBLIC_PRODUCTION_MAIN_USE_DEMO_SEED`.
 */
export const INITIAL_PRODUCTION_CONTEXT_DATA = {
  SS26: {
    analytics: {
      categories: [
        { name: 'Dresses', count: 5, cost: '450k ₽' },
        { name: 'Tops', count: 4, cost: '280k ₽' },
        { name: 'Bottoms', count: 3, cost: '320k ₽' },
      ],
      materials: [
        { name: 'Silk Satin', qty: '450 м', cost: '120k ₽' },
        { name: 'Cotton Jersey', qty: '800 м', cost: '85k ₽' },
        { name: 'Linen', qty: '300 м', cost: '65k ₽' },
      ],
    },
    materials: [
      {
        name: 'Лен Premium (White)',
        roll: '#SS-01',
        length: '120.0 м',
        width: '150 см',
        defects: 1,
      },
    ],
    sfc: [
      {
        op: 'Закупка сырья (Основная ткань)',
        plan: '100% лот',
        fact: '100% лот',
        diff: '0%',
        cost: '150,000 ₽',
        status: 'success',
        confirmed: true,
        date: '01.03.2026',
        type: 'supply',
      },
    ],
  },
} as const;
