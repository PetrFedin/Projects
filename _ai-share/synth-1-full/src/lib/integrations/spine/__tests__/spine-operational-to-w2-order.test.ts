import { mapOperationalOrderToW2DetailView } from '../spine-operational-to-w2-order';

describe('spine-operational-to-w2-order', () => {
  it('maps operational items to W2 lines', () => {
    const view = mapOperationalOrderToW2DetailView(
      'INT-NU-001',
      {
        status: 'approved',
        amount: '120 000 ₽',
        items: [{ productId: 'SS27-M-COAT-01', quantity: 4, unitPrice: 100 }],
      },
      'SS27'
    );
    expect(view.id).toBe('INT-NU-001');
    expect(view.lines).toHaveLength(1);
    expect(view.lines[0]?.articleId).toBe('m-coat-01');
    expect(view.lines[0]?.qty).toBe(4);
    expect(view.status).toBe('confirmed');
  });
});
