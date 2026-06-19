import {
  isWorkflowStoreDisabled,
  isWorkflowStoreWriteEnabled,
  workflowStoreMeta,
} from '@/lib/server/process-workflow-store';

jest.mock('@/lib/server/workshop2-pg-pool', () => ({
  isWorkshop2PostgresEnabled: jest.fn(),
}));

import { isWorkshop2PostgresEnabled } from '@/lib/server/workshop2-pg-pool';

const mockPg = isWorkshop2PostgresEnabled as jest.Mock;

describe('process-workflow-store meta', () => {
  const env = process.env;

  beforeEach(() => {
    process.env = { ...env };
    delete process.env.WORKFLOW_STORE_DISABLED;
    mockPg.mockReturnValue(false);
  });

  afterEach(() => {
    process.env = env;
  });

  it('reports disabled when WORKFLOW_STORE_DISABLED=1', () => {
    process.env.WORKFLOW_STORE_DISABLED = '1';
    expect(isWorkflowStoreDisabled()).toBe(true);
    expect(isWorkflowStoreWriteEnabled()).toBe(false);
    expect(workflowStoreMeta()).toEqual({ persistence: 'disabled', writesEnabled: false });
  });

  it('reports postgres when PG configured', () => {
    mockPg.mockReturnValue(true);
    expect(workflowStoreMeta()).toEqual({ persistence: 'postgres', writesEnabled: true });
  });

  it('reports file path when no PG', () => {
    const meta = workflowStoreMeta();
    expect(meta.persistence).toBe('file');
    if (meta.persistence === 'file') {
      expect(meta.path).toContain('workflow-store.json');
      expect(meta.writesEnabled).toBe(true);
    }
  });
});
