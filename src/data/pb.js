// ============================================================
//  Speedcube data
//  TODO(dorian): remplace les temps ci-dessous par tes vrais PB
//  (single / Ao5) et la suite `trend` par tes dernières sessions.
//  Les 2 victoires (PALMARES) et "7 ans" sont déjà réelles.
// ============================================================

/** Per-event personal bests. Times are placeholders — see TODO above. */
export const EVENTS = [
  { event: '3×3',     color: '--c-r', single: '8.42',  ao5: '11.30', trend: [16.1, 15.2, 14.6, 14.0, 13.4, 13.1, 12.6, 12.2, 11.9, 11.6, 11.4, 11.3] },
  { event: '2×2',     color: '--c-y', single: '2.61',  ao5: '3.94',  trend: [6.2, 5.8, 5.4, 5.1, 4.9, 4.6, 4.4, 4.2, 4.1, 4.0, 3.97, 3.94] },
  { event: '3×3 OH',  color: '--c-b', single: '18.74', ao5: '23.55', trend: [33, 31, 29.5, 28, 27, 26, 25.2, 24.6, 24.1, 23.9, 23.7, 23.55] },
  { event: 'Pyraminx', color: '--c-g', single: '4.08', ao5: '6.71',  trend: [10.4, 9.7, 9.0, 8.5, 8.0, 7.7, 7.4, 7.1, 6.95, 6.85, 6.78, 6.71] },
  { event: 'Skewb',   color: '--c-o', single: '5.20',  ao5: '7.05',  trend: [11, 10.2, 9.6, 9.0, 8.5, 8.1, 7.8, 7.5, 7.3, 7.2, 7.1, 7.05] },
];

/** Headline stats (real). */
export const STATS = [
  { value: '7', label: 'ans de cube' },
  { value: '2', label: 'victoires' },
  { value: '5', label: 'épreuves' },
];

/** Competition wins (real). */
export const PALMARES = [
  { title: 'Compétition de Lille', date: 'Juin 2025', place: 'Lille, France' },
  { title: 'Compétition de Madrid', date: 'Juillet 2025', place: 'Madrid, Espagne' },
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
