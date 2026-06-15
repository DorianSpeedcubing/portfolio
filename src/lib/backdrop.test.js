import { describe, it, expect } from 'vitest';
import { shouldAnimateBackdrop } from './backdrop.js';

describe('shouldAnimateBackdrop', () => {
  it('animates when not reduced and not still', () =>
    expect(shouldAnimateBackdrop({ reduced: false, still: false })).toBe(true));
  it('does not animate under reduced motion', () =>
    expect(shouldAnimateBackdrop({ reduced: true, still: false })).toBe(false));
  it('does not animate in still/QA mode', () =>
    expect(shouldAnimateBackdrop({ reduced: false, still: true })).toBe(false));
  it('does not animate when both flags set', () =>
    expect(shouldAnimateBackdrop({ reduced: true, still: true })).toBe(false));
});
