import { describe, it, expect } from 'vitest';
import { inkAlpha } from './ink-pixels.mjs';

const O = { floor: 18, gain: 1.9 };

describe('inkAlpha', () => {
  it('pure white -> fully transparent', () =>
    expect(inkAlpha(255, 255, 255, 255, O)).toBe(0));
  it('pure black -> fully opaque', () =>
    expect(inkAlpha(0, 0, 0, 255, O)).toBe(255));
  it('near-white below the floor stays transparent', () =>
    expect(inkAlpha(245, 245, 245, 255, O)).toBe(0)); // dist 10 < floor 18
  it('a saturated colour (orange) is treated as ink, not background', () =>
    expect(inkAlpha(245, 180, 60, 255, O)).toBeGreaterThan(200)); // min=60, dist=195
  it('respects source transparency (alpha 0 stays 0)', () =>
    expect(inkAlpha(0, 0, 0, 0, O)).toBe(0));
  it('scales output by source alpha', () =>
    expect(inkAlpha(0, 0, 0, 128, O)).toBe(128));
  it('a high floor drops baked checkerboard greys', () =>
    expect(inkAlpha(204, 204, 204, 255, { floor: 60, gain: 1.5 })).toBe(0)); // dist 51 < 60
});
