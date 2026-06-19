jest.mock('jspdf', () => ({
  jsPDF: jest.fn().mockImplementation(() => {
    const state = { page: 0 };
    return {
      setFont: jest.fn(),
      setFontSize: jest.fn(),
      splitTextToSize: jest.fn((text: string) => [text]),
      text: jest.fn(),
      addPage: jest.fn(() => {
        state.page += 1;
      }),
      output: jest.fn(() => {
        const buf = Buffer.from('%PDF-1.4 schet-offerta mock');
        return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
      }),
    };
  }),
}));

import { buildWorkshop2SchetOffertaPayload } from '@/lib/production/workshop2-schet-offerta';
import { buildWorkshop2SchetOffertaPdfBytes } from '@/lib/production/workshop2-schet-offerta-pdf';

describe('workshop2-schet-offerta-pdf', () => {
  it('builds PDF bytes with %PDF magic', () => {
    const payload = buildWorkshop2SchetOffertaPayload({
      orderId: 'W2-B2B-001',
      lines: [{ name: 'Платье', qty: 2, priceRub: 10_000 }],
    });
    const bytes = buildWorkshop2SchetOffertaPdfBytes(payload);
    expect(bytes.byteLength).toBeGreaterThan(8);
    expect(Buffer.from(bytes.subarray(0, 4)).toString()).toBe('%PDF');
  });
});
