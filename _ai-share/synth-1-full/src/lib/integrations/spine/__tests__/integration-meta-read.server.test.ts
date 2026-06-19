import { getIntegrationMetaForOperationalUi } from '../integration-meta-read.server';

jest.mock('../integration-meta-persistence.file', () => ({
  getIntegrationMetaForOrder: jest.fn(),
}));

jest.mock('../spine-operational-persistence.pg', () => ({
  getIntegrationMetaFromPg: jest.fn(),
}));

jest.mock('../spine-operational-store', () => ({
  ensureSpineOperationalStoreReady: jest.fn().mockResolvedValue(undefined),
  isSpineOperationalPgEnabled: jest.fn(() => true),
}));

jest.mock('../spine-pg-hydrate-guards', () => ({
  isSpineOperationalPgPrimary: jest.fn(),
}));

import { getIntegrationMetaForOrder } from '../integration-meta-persistence.file';
import { getIntegrationMetaFromPg } from '../spine-operational-persistence.pg';
import { isSpineOperationalPgPrimary } from '../spine-pg-hydrate-guards';

const mockPgPrimary = isSpineOperationalPgPrimary as jest.Mock;
const mockGetPg = getIntegrationMetaFromPg as jest.Mock;
const mockGetFile = getIntegrationMetaForOrder as jest.Mock;

describe('integration-meta-read.server', () => {
  beforeEach(() => {
    mockPgPrimary.mockReset();
    mockGetPg.mockReset();
    mockGetFile.mockReset();
  });

  it('reads file when not PG-primary', async () => {
    mockPgPrimary.mockReturnValue(false);
    mockGetFile.mockReturnValue({ sourcePlatform: 'joor' });
    const meta = await getIntegrationMetaForOperationalUi('INT-JOOR-1');
    expect(meta?.sourcePlatform).toBe('joor');
    expect(mockGetPg).not.toHaveBeenCalled();
  });

  it('reads PG when PG-primary', async () => {
    mockPgPrimary.mockReturnValue(true);
    mockGetPg.mockResolvedValue({ sourcePlatform: 'joor', externalOrderId: 'x' });
    const meta = await getIntegrationMetaForOperationalUi('INT-JOOR-9');
    expect(meta?.externalOrderId).toBe('x');
    expect(mockGetFile).not.toHaveBeenCalled();
  });
});
