import { getPlatformRole, canAccess } from '../rbac';

describe('RBAC', () => {
  it('getPlatformRole returns brand for brand role', () => {
    expect(getPlatformRole(['brand'])).toBe('brand');
  });

  it('getPlatformRole returns admin for admin role', () => {
    expect(getPlatformRole(['admin'])).toBe('admin');
  });

  it('getPlatformRole returns retailer when no roles', () => {
    expect(getPlatformRole(undefined)).toBe('retailer');
  });

  it('admin can access all resources', () => {
    expect(canAccess('admin', 'production', 'delete')).toBe(true);
    expect(canAccess('admin', 'warehouse', 'edit')).toBe(true);
  });

  it('retailer can view b2b_catalog but not edit', () => {
    expect(canAccess('retailer', 'b2b_catalog', 'view')).toBe(true);
    expect(canAccess('retailer', 'b2b_catalog', 'edit')).toBe(false);
  });
});
