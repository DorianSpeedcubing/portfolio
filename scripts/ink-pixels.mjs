// Pure pixel math for the ink->white recoloring pipeline (no IO, unit-tested).
// Output alpha = "distance from white" (min channel), floored + gained, then
// gated by the source pixel's own alpha so transparency is preserved.

/**
 * @param {number} r 0-255
 * @param {number} g 0-255
 * @param {number} b 0-255
 * @param {number} origAlpha 0-255 (255 for opaque JPEG sources)
 * @param {{floor:number, gain:number}} opts
 * @returns {number} output alpha 0-255
 */
export function inkAlpha(r, g, b, origAlpha, { floor, gain }) {
  const dist = 255 - Math.min(r, g, b);            // 0 for white, high for dark/saturated
  const a = Math.max(0, Math.min(255, Math.round((dist - floor) * gain)));
  return Math.round((a * origAlpha) / 255);        // respect source transparency
}
