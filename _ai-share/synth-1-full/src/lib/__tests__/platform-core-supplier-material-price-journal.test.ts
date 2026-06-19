import { extractSupplierMaterialPriceJournalFromDossierEvents } from '@/lib/platform-core-supplier-material-price-journal';

describe('platform-core-supplier-material-price-journal', () => {
  it('извлекает цены из materialLines в dossier_events', () => {
    const rows = extractSupplierMaterialPriceJournalFromDossierEvents([
      {
        eventType: 'dossier_updated',
        createdAt: '2026-06-01T10:00:00.000Z',
        eventPayload: {
          materialLines: [
            { materialName: 'Хлопок', unitCostNet: 420, currency: 'RUB' },
            { materialName: 'Подклад', unitCostNet: 0 },
          ],
        },
      },
      {
        eventType: 'dossier_updated',
        createdAt: '2026-06-03T12:00:00.000Z',
        eventPayload: {
          productionModel: {
            materialLines: [{ materialName: 'Хлопок', unitCostNet: 450, currency: 'RUB' }],
          },
        },
      },
    ]);
    expect(rows).toHaveLength(2);
    expect(rows[0]?.unitCostNet).toBe(450);
    expect(rows[0]?.materialName).toBe('Хлопок');
    expect(rows[1]?.unitCostNet).toBe(420);
  });

  it('возвращает пустой массив без цен', () => {
    expect(
      extractSupplierMaterialPriceJournalFromDossierEvents([
        { eventType: 'ping', createdAt: '2026-01-01T00:00:00.000Z', eventPayload: {} },
      ])
    ).toHaveLength(0);
  });
});
