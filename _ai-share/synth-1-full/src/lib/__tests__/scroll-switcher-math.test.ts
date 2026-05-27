import {
  advanceAutoTour,
  applyVelocityDelta,
  autoTourSectionDurationMs,
  easeOutCubic,
  lerpToward,
  resetAutoTour,
  resolveSnapTargetProgress,
  sectionLocalProgress,
  sectionMidpoint,
  startAutoTour,
  velocityScrollMultiplier,
} from '../scroll-switcher-math';

describe('scroll-switcher-math', () => {
  it('easeOutCubic — монотонный рост 0→1', () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.4);
    expect(easeOutCubic(0.5)).toBeLessThan(0.9);
  });

  it('lerpToward — easeOut даёт больший шаг при том же factor', () => {
    const linear = lerpToward(0, 1, 0.5, false);
    const eased = lerpToward(0, 1, 0.5, true);
    expect(eased).toBeGreaterThan(linear);
  });

  it('velocityScrollMultiplier — растёт с deltaY', () => {
    expect(velocityScrollMultiplier(10)).toBeLessThan(velocityScrollMultiplier(200));
    expect(velocityScrollMultiplier(500)).toBeLessThanOrEqual(2.6);
  });

  it('applyVelocityDelta — clamp по maxVelocity', () => {
    const v = applyVelocityDelta(0.05, 300, 0.012);
    expect(Math.abs(v)).toBeLessThanOrEqual(0.012);
  });

  it('sectionMidpoint — центры трёх секций', () => {
    expect(sectionMidpoint(0, 3)).toBeCloseTo(1 / 6);
    expect(sectionMidpoint(1, 3)).toBeCloseTo(0.5);
    expect(sectionMidpoint(2, 3)).toBeCloseTo(5 / 6);
  });

  it('resolveSnapTargetProgress — snap к ближайшей середине', () => {
    expect(resolveSnapTargetProgress(0.1, 3)).toBeCloseTo(1 / 6);
    expect(resolveSnapTargetProgress(0.45, 3)).toBeCloseTo(0.5);
    expect(resolveSnapTargetProgress(0.9, 3)).toBeCloseTo(5 / 6);
  });

  it('sectionLocalProgress — прогресс внутри секции', () => {
    expect(sectionLocalProgress(0.2, 3)).toBeCloseTo(0.6);
    expect(sectionLocalProgress(0.5, 3)).toBeCloseTo(0.5);
    expect(sectionLocalProgress(1 / 6, 3)).toBeCloseTo(0.5);
  });

  it('autoTour — проходит 3 секции за 8 секунд', () => {
    let state = startAutoTour();
    const sectionDur = autoTourSectionDurationMs(3);
    expect(sectionDur).toBeCloseTo(8000 / 3);

    state = advanceAutoTour(state, sectionDur - 1, 3);
    expect(state.targetSection).toBe(0);
    expect(state.phase).toBe('running');

    state = advanceAutoTour(state, 2, 3);
    expect(state.targetSection).toBe(1);

    state = advanceAutoTour(state, sectionDur, 3);
    expect(state.targetSection).toBe(2);

    state = advanceAutoTour(state, sectionDur, 3);
    expect(state.phase).toBe('complete');
    expect(state.targetSection).toBe(2);
  });

  it('resetAutoTour — idle', () => {
    expect(resetAutoTour().phase).toBe('idle');
  });
});
