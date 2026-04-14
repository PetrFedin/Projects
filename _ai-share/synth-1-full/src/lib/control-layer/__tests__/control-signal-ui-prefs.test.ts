/**
 * @jest-environment jsdom
 */

import {
  patchBrandControlSignalUiPrefs,
  readBrandControlSignalUiPrefs,
  writeBrandControlSignalUiPrefs,
} from '@/lib/control-layer/control-signal-ui-prefs';

describe('control-signal-ui-prefs', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('read returns {} when missing', () => {
    expect(readBrandControlSignalUiPrefs()).toEqual({});
  });

  it('patch merges and persists', () => {
    patchBrandControlSignalUiPrefs({ hideOrderControlAugmentations: true });
    expect(readBrandControlSignalUiPrefs()).toEqual({ hideOrderControlAugmentations: true });
    patchBrandControlSignalUiPrefs({ hideArticleControlAugmentations: true });
    expect(readBrandControlSignalUiPrefs()).toEqual({
      hideOrderControlAugmentations: true,
      hideArticleControlAugmentations: true,
    });
  });

  it('write replaces whole object', () => {
    writeBrandControlSignalUiPrefs({ hideOrderControlAugmentations: false });
    expect(readBrandControlSignalUiPrefs()).toEqual({ hideOrderControlAugmentations: false });
  });
});
