import { describe, it, expect } from 'vitest';
import { scrambleFrame } from './scramble.js';

const rand = () => 0; // deterministic: always first glyph 'A'

describe('scrambleFrame', () => {
  it('returns the target at full progress', () => {
    expect(scrambleFrame('SOLVE', 1, rand)).toBe('SOLVE');
  });
  it('preserves length at any progress', () => {
    expect(scrambleFrame('Dorian', 0.4, rand)).toHaveLength(6);
    expect(scrambleFrame('Dorian', 0, rand)).toHaveLength(6);
  });
  it('reveals a left-to-right prefix', () => {
    // progress 0.5 of length 6 -> 3 revealed chars
    expect(scrambleFrame('Dorian', 0.5, rand)).toBe('DorAAA');
  });
  it('preserves spaces (non-space chars become glyphs)', () => {
    expect(scrambleFrame('a b', 0, rand)).toBe('A A');
  });
  it('clamps out-of-range progress', () => {
    expect(scrambleFrame('SOLVE', 2, rand)).toBe('SOLVE');
    expect(scrambleFrame('SOLVE', -1, rand)).toBe('AAAAA');
  });
});
