import {
  confirmOperationalImportOrderByBrand,
  getOperationalImportChainStatus,
  normalizeImportedSpineStatus,
} from '../operational-import-handoff.service';
import { importWholesaleOrder } from '../order-import.service';
import path from 'path';
import fs from 'fs';
import os from 'os';

describe('operational-import-handoff', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'syntha-handoff-'));

  beforeAll(() => {
    process.env.SPINE_IMPORTED_ORDERS_PG = '0';
    process.env.B2B_IMPORTED_ORDERS_FILE = path.join(tmpDir, 'orders.json');
    process.env.B2B_INTEGRATION_META_FILE = path.join(tmpDir, 'meta.json');
    process.env.B2B_INTEGRATION_EXTERNAL_REFS_FILE = path.join(tmpDir, 'refs.json');
    process.env.B2B_OPERATIONAL_STATUS_FILE = path.join(tmpDir, 'status.json');
    process.env.B2B_ALLOCATION_QUEUE_FILE = path.join(tmpDir, 'alloc.json');
    process.env.B2B_WORKING_ORDER_FILE = path.join(tmpDir, 'wo.json');
    process.env.B2B_WHOLESALE_EXPORT_FILE = path.join(tmpDir, 'export.json');
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('confirm imported order moves status to confirmed', async () => {
    const extId = 'handoff-test-1';
    const imported = importWholesaleOrder({
      platform: 'joor',
      externalOrderId: extId,
      raw: {
        id: extId,
        status: 'pending',
        lines: [{ sku: 'SS27-M-COAT-01', quantity: 5, unit_price: 100 }],
      },
    });
    expect(imported.created).toBe(true);

    const before = normalizeImportedSpineStatus(imported.wholesaleOrderId, 'pending_approval');
    expect(before).toBe('submitted');

    const confirmed = await confirmOperationalImportOrderByBrand({
      orderId: imported.wholesaleOrderId,
    });
    expect(confirmed.ok).toBe(true);
    if (confirmed.ok) {
      expect(confirmed.status).toBe('confirmed');
    }

    const after = normalizeImportedSpineStatus(imported.wholesaleOrderId, 'pending');
    expect(after).toBe('confirmed');

    const chain = await getOperationalImportChainStatus(imported.wholesaleOrderId);
    expect(chain?.inventoryReserved).toBe(true);
    expect(chain?.steps.find((s) => s.id === 'inventory_reserved')?.done).toBe(true);
  });
});
