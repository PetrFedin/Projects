/** @jest-environment jsdom */

import { isWorkshop2DossierFormFocused } from '@/lib/production/workshop2-realtime-stub';

describe('workshop2-realtime-stub', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('isWorkshop2DossierFormFocused is true when input focused', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    expect(isWorkshop2DossierFormFocused()).toBe(true);
  });

  it('isWorkshop2DossierFormFocused is false when activeElement is null', () => {
    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      get: () => null,
    });
    expect(isWorkshop2DossierFormFocused()).toBe(false);
  });
});
