import { runWorkshop2VaultVirusScanStub } from '@/lib/production/workshop2-vault-virus-scan';

describe('runWorkshop2VaultVirusScanStub prod without URL', () => {
  it('returns clean in production when WORKSHOP2_VIRUS_SCAN_URL unset', async () => {
    const status = await runWorkshop2VaultVirusScanStub({
      documentId: 'd1',
      storagePath: 'k/doc.pdf',
      env: { NODE_ENV: 'production' },
    });
    expect(status).toBe('clean');
  });

  it('returns pending in production when scanner URL configured', async () => {
    const status = await runWorkshop2VaultVirusScanStub({
      documentId: 'd1',
      storagePath: 'k/doc.pdf',
      env: { NODE_ENV: 'production', WORKSHOP2_VIRUS_SCAN_URL: 'https://scan.example/hook' },
    });
    expect(status).toBe('pending');
  });
});
