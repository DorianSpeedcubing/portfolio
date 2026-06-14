import { describe, it, expect } from 'vitest';
import { formatTime } from './timer.js';

describe('formatTime', () => {
  it('formats zero', () => expect(formatTime(0)).toBe('0.00'));
  it('formats sub-minute with two decimals', () => expect(formatTime(6420)).toBe('6.42'));
  it('pads centiseconds', () => expect(formatTime(6400)).toBe('6.40'));
  it('formats over a minute', () => expect(formatTime(72530)).toBe('1:12.53'));
  it('pads seconds past a minute', () => expect(formatTime(63000)).toBe('1:03.00'));
  it('clamps negative input', () => expect(formatTime(-50)).toBe('0.00'));
  it('truncates rather than rounds', () => expect(formatTime(9999)).toBe('9.99'));
});
