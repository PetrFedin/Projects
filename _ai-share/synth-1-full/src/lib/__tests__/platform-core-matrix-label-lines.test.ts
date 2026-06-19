import { describe, expect, it } from 'vitest';
import { stackHubMatrixLabelLines } from '../platform-core-matrix-label-lines';

describe('stackHubMatrixLabelLines', () => {
  it('single word unchanged', () => {
    expect(stackHubMatrixLabelLines('Разработка')).toEqual(['Разработка']);
  });

  it('two words on two lines', () => {
    expect(stackHubMatrixLabelLines('Оптовый заказ')).toEqual(['Оптовый', 'заказ']);
  });

  it('joiner «и» stays with neighbor', () => {
    expect(stackHubMatrixLabelLines('Коллекция и витрина')).toEqual(['Коллекция и', 'витрина']);
  });

  it('joiner «по» stays with neighbor', () => {
    expect(stackHubMatrixLabelLines('Средняя по столпу')).toEqual(['Средняя по', 'столпу']);
  });
});
