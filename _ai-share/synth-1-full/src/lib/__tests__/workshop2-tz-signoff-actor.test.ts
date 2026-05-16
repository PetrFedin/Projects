/**
 * @jest-environment node
 */
import {
  workshop2TzSectionSignoffByLabelMeaningful,
  workshop2TzSignoffOrganizationLabelFromUser,
} from '@/lib/production/workshop2-tz-signoff-actor';
import type { UserProfile } from '@/lib/types';

describe('workshop2-tz-signoff-actor', () => {
  it('rejects empty and guest placeholder as signer label', () => {
    expect(workshop2TzSectionSignoffByLabelMeaningful('')).toBe(false);
    expect(workshop2TzSectionSignoffByLabelMeaningful('Н')).toBe(false);
    expect(workshop2TzSectionSignoffByLabelMeaningful('Не авторизован')).toBe(false);
    expect(workshop2TzSectionSignoffByLabelMeaningful('  Иван Петров  ')).toBe(true);
  });

  it('prefers brand name from profile for organization label', () => {
    const user = {
      brands: [{ id: '1', name: '  Acme Co ', email: 'a@a.com' }],
    } as unknown as UserProfile;
    expect(workshop2TzSignoffOrganizationLabelFromUser(user)).toBe('Acme Co');
  });
});
