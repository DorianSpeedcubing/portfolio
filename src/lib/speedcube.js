import { EVENTS, sparklinePath } from '../data/pb.js';

/** Render the per-event PB cards (with inline SVG sparklines) into the grid. */
export function initSpeedcube() {
  const grid = document.querySelector('[data-pb-grid]');
  if (!grid) return;
  grid.innerHTML = EVENTS.map((e) => {
    const pts = sparklinePath(e.trend);
    const last = e.trend.length - 1;
    const fx = sparklinePath(e.trend).split(' ')[last];
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
        <svg class="pb__spark" viewBox="0 0 132 40" preserveAspectRatio="none" aria-hidden="true">
          <polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="1.6"
                    stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="${fx ? fx.split(',')[0] : 0}" cy="${fx ? fx.split(',')[1] : 0}" r="2.4" fill="currentColor" />
        </svg>
      </article>`;
  }).join('');
}
