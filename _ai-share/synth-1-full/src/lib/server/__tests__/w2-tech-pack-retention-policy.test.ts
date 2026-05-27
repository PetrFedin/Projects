import {
  w2TechPackMaxBytesEffective,
  w2TechPackRetentionDays,
} from '@/lib/server/w2-tech-pack-retention-policy';
import { MAX_W2_TECHPACK_BYTES } from '@/lib/server/w2-tech-pack-remote-s3';

describe('w2-tech-pack-retention-policy', () => {
  const orig = process.env;

  afterEach(() => {
    process.env = { ...orig };
  });

  test('default max bytes matches remote cap', () => {
    delete process.env.W2_TECHPACK_MAX_BYTES;
    expect(w2TechPackMaxBytesEffective()).toBe(MAX_W2_TECHPACK_BYTES);
  });

  test('retention null when unset', () => {
    delete process.env.W2_TECHPACK_RETENTION_DAYS;
    expect(w2TechPackRetentionDays()).toBeNull();
  });
});
