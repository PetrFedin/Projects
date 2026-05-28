import { isBrandAcademyPathname } from '@/lib/layout/brand-academy-route';

describe('isBrandAcademyPathname', () => {
  it('matches brand academy routes', () => {
    expect(isBrandAcademyPathname('/brand/academy')).toBe(true);
    expect(isBrandAcademyPathname('/brand/academy/')).toBe(true);
    expect(isBrandAcademyPathname('/brand/academy/knowledge')).toBe(true);
    expect(isBrandAcademyPathname('/brand/academy/platform/course/1')).toBe(true);
  });

  it('excludes other brand hub paths', () => {
    expect(isBrandAcademyPathname('/brand/profile')).toBe(false);
    expect(isBrandAcademyPathname('/brand/production')).toBe(false);
    expect(isBrandAcademyPathname('/academy')).toBe(false);
  });
});
