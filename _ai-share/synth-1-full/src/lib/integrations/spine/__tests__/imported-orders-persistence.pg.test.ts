import { isSpineImportedOrdersPgEnabled } from '../imported-orders-persistence.pg';

describe('imported-orders-persistence.pg', () => {
  const prevPg = process.env.WORKSHOP2_DATABASE_URL;
  const prevFlag = process.env.SPINE_IMPORTED_ORDERS_PG;

  afterEach(() => {
    if (prevPg === undefined) delete process.env.WORKSHOP2_DATABASE_URL;
    else process.env.WORKSHOP2_DATABASE_URL = prevPg;
    if (prevFlag === undefined) delete process.env.SPINE_IMPORTED_ORDERS_PG;
    else process.env.SPINE_IMPORTED_ORDERS_PG = prevFlag;
  });

  it('isSpineImportedOrdersPgEnabled when WORKSHOP2_DATABASE_URL set', () => {
    process.env.WORKSHOP2_DATABASE_URL = 'postgresql://u:p@localhost:5433/db';
    delete process.env.SPINE_IMPORTED_ORDERS_PG;
    expect(isSpineImportedOrdersPgEnabled()).toBe(true);
  });

  it('isSpineImportedOrdersPgEnabled false when SPINE_IMPORTED_ORDERS_PG=0', () => {
    process.env.WORKSHOP2_DATABASE_URL = 'postgresql://u:p@localhost:5433/db';
    process.env.SPINE_IMPORTED_ORDERS_PG = '0';
    expect(isSpineImportedOrdersPgEnabled()).toBe(false);
  });
});
