// ============================================================
//  Speedcube data — Dorian Bellet · WCA 2019GERA06 (real figures)
//  Source: World Cube Association profile.
// ============================================================

/**
 * Headline per-event cards. `single`/`ao5` are real PBs; `nr`/`wr` are the real
 * national / world ranks for the single. `trend` is an illustrative improvement
 * curve (no public session data) ending near the real Ao5.
 */
export const EVENTS = [
  { event: '3×3',      color: '--c-r', single: '5.70',  ao5: '7.60',  nr: 23,  wr: 882,
    trend: [13.4, 12.6, 11.8, 11.0, 10.3, 9.6, 9.0, 8.6, 8.2, 7.9, 7.7, 7.60] },
  { event: '2×2',      color: '--c-y', single: '1.25',  ao5: '2.65',  nr: 49,  wr: 2166,
    trend: [5.2, 4.8, 4.4, 4.0, 3.7, 3.4, 3.2, 3.0, 2.9, 2.8, 2.72, 2.65] },
  { event: '3×3 OH',   color: '--c-b', single: '11.57', ao5: '14.54', nr: 41,  wr: 1746,
    trend: [24, 22.5, 21, 19.8, 18.6, 17.6, 16.8, 16.1, 15.5, 15.0, 14.7, 14.54] },
  { event: '4×4',      color: '--c-g', single: '30.86', ao5: '34.34', nr: 63,  wr: 2691,
    trend: [52, 49, 46, 43.5, 41.5, 39.8, 38.4, 37.2, 36.2, 35.4, 34.8, 34.34] },
  { event: 'Pyraminx', color: '--c-o', single: '5.17',  ao5: '7.83',  nr: 346, wr: 17921,
    trend: [13.5, 12.6, 11.7, 11.0, 10.3, 9.7, 9.2, 8.8, 8.4, 8.1, 7.95, 7.83] },
  { event: 'Skewb',    color: '--c-p', single: '4.61',  ao5: '5.73',  nr: 220, wr: 10891,
    trend: [10.4, 9.6, 8.9, 8.3, 7.7, 7.2, 6.8, 6.4, 6.1, 5.9, 5.8, 5.73] },
];

/** Full personal-best table — every official event (single · average · ranks). */
export const RECORDS = [
  { event: '3×3',                single: '5.70',    average: '7.60',    nr: 23,  wr: 882 },
  { event: '2×2',                single: '1.25',    average: '2.65',    nr: 49,  wr: 2166 },
  { event: '4×4',                single: '30.86',   average: '34.34',   nr: 63,  wr: 2691 },
  { event: '5×5',                single: '1:05.40', average: '1:16.70', nr: 73,  wr: 3372 },
  { event: '6×6',                single: '2:43.60', average: '2:49.03', nr: 121, wr: 5511 },
  { event: '3×3 à une main',     single: '11.57',   average: '14.54',   nr: 41,  wr: 1746 },
  { event: '3×3 à l’aveugle',    single: '2:16.51', average: '2:53.76', nr: 159, wr: 4618 },
  { event: '3×3 fewest moves',   single: '35',      average: '—',       nr: 137, wr: 3605 },
  { event: 'Clock',              single: '9.20',    average: '10.96',   nr: 138, wr: 6563 },
  { event: 'Pyraminx',           single: '5.17',    average: '7.83',    nr: 346, wr: 17921 },
  { event: 'Skewb',              single: '4.61',    average: '5.73',    nr: 220, wr: 10891 },
  { event: 'Square-1',           single: '12.14',   average: '21.38',   nr: 56,  wr: 2490 },
];

/**
 * Build an SVG polyline `points` string for a session trend.
 * Larger (slower) values sit at the top, so an improving series descends
 * left→right. Pure + deterministic (unit-tested).
 */
export function sparklinePath(values, w = 132, h = 40, pad = 4) {
  if (!values || values.length < 2) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = (w - pad * 2) / (values.length - 1);
  return values
    .map((v, i) => {
      const x = pad + i * step;
      const y = pad + (1 - (v - min) / span) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}
