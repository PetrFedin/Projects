import {
  acknowledgeApparelMagicVendorPo,
  importApparelMagicVendorPo,
} from '../apparel-magic-vendor-po.service';
import { getVendorPoByOrderId } from '../vendor-po-persistence.file';
import path from 'path';
import fs from 'fs';
import os from 'os';

describe('wave-i-ext · supplier materials_supplied spine', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'syntha-wave-i-'));

  beforeAll(() => {
    process.env.B2B_VENDOR_PO_FILE = path.join(tmpDir, 'vendor-po.json');
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('vendor PO ack persists acknowledged status for chain resolver', async () => {
    const orderId = 'INT-JOOR-WAVE-I-UNIT';
    const rec = await importApparelMagicVendorPo({
      b2bOrderId: orderId,
      productionOrderId: 'PO-B2B-WAVE-I',
    });
    expect(rec.status).toBe('open');

    const acked = await acknowledgeApparelMagicVendorPo({ vendorPoId: rec.vendorPoId });
    expect(acked?.status).toBe('acknowledged');

    const stored = getVendorPoByOrderId(orderId);
    expect(stored?.status).toBe('acknowledged');
    expect(stored?.lines.every((l) => (l.ackQty ?? 0) > 0)).toBe(true);
  });
});
