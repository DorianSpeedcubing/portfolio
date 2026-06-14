import { describe, it, expect } from 'vitest';
import { sparklinePath, EVENTS } from './pb.js';

describe('sparklinePath', () => {
  it('returns empty for too-few points', () => {
    expect(sparklinePath([])).toBe('');
    expect(sparklinePath([5])).toBe('');
  });
  it('produces one coordinate pair per value', () => {
    const pts = sparklinePath([10, 8, 6, 4]).split(' ');
    expect(pts).toHaveLength(4);
    pts.forEach((p) => expect(p).toMatch(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/));
  });
  it('puts the largest value at the top (smallest y) and smallest at the bottom', () => {
    const pts = sparklinePath([10, 5], 100, 40, 4).split(' ').map((p) => p.split(',').map(Number));
    const [, yFirst] = pts[0]; // value 10 (max) -> top
    const [, yLast] = pts[1]; // value 5 (min) -> bottom
    expect(yFirst).toBeLessThan(yLast);
  });
  it('keeps every event trend descending overall (improvement)', () => {
    EVENTS.forEach((e) => {
      expect(e.trend[0]).toBeGreaterThan(e.trend[e.trend.length - 1]);
    });
  });
});
