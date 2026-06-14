import { EVENTS, RECORDS, sparklinePath } from '../data/pb.js';

/** Render the headline PB cards + the full records table from WCA data. */
export function initSpeedcube() {
  const grid = document.querySelector('[data-pb-grid]');
  if (grid) {
    grid.innerHTML = EVENTS.map((e) => {
      const pts = sparklinePath(e.trend);
      const fx = pts.split(' ').at(-1) || '0,0';
      const [cx, cy] = fx.split(',');
      return `
      <article class="pb" style="--f:var(${e.color})">
        <div class="pb__top">
          <span class="pb__event">${e.event}</span>
          <span class="pb__chip mono">PB</span>
        </div>
        <div class="pb__times">
          <div class="pb__time"><span class="pb__k mono">single</span><span class="pb__v mono">${e.single}</span></div>
          <div class="pb__time"><span class="pb__k mono">Ao5</span><span class="pb__v mono">${e.ao5}</span></div>
        </div>
        <div class="pb__ranks mono"><span>FR&nbsp;#${e.nr}</span><span>Monde&nbsp;#${e.wr}</span></div>
        <svg class="pb__spark" viewBox="0 0 132 40" preserveAspectRatio="none" aria-hidden="true">
          <polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="1.6"
                    stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="${cx}" cy="${cy}" r="2.4" fill="currentColor" />
        </svg>
      </article>`;
    }).join('');
  }

  const tbody = document.querySelector('[data-records]');
  if (tbody) {
    tbody.innerHTML = RECORDS.map((r) => `
      <tr>
        <th scope="row" class="rec__ev">${r.event}</th>
        <td class="mono rec__t">${r.single}</td>
        <td class="mono rec__t">${r.average}</td>
        <td class="mono rec__rank">${r.nr ? `#${r.nr}` : '—'}</td>
        <td class="mono rec__rank rec__rank--w">${r.wr ? `#${r.wr}` : '—'}</td>
      </tr>`).join('');
  }
}
