// Branch-map viewer. Draws each floor's real solved plan — rooms at their actual
// footprints, corridors along their actual routed polylines.
//
// Spoiler discipline: by default this shows *shape only* — how many ways out of
// each room, what is locked behind what, how wide the floor fans and where it
// re-converges. It does not say which rooms are dead ends, which route earns the
// Ward Token, who is standing where, or what anybody says. The reveal switch
// turns that on deliberately.

import { buildLayout, CORRIDOR } from './world/layout.js';
import { loadAllFloors } from './data/floors/index.js';
import { getTheme } from './data/themes.js';

const KIND_COLOR = {
  entry: '#9fe4ff', exit: '#7fd8a0', hub: '#8f9aa6', branch: '#6f7a86',
  deadend: '#d4564a', shrine: '#e0c878', shop: '#e0a878', vault: '#b9a0e0', corridor: '#5c646e'
};

let floors = [];
let current = 1;
let reveal = false;

init();

async function init() {
  floors = await loadAllFloors();
  const nav = document.getElementById('nav');
  nav.innerHTML = floors.map((f) =>
    `<button data-n="${f.id}" class="${f.id === 1 ? 'on' : ''}">${f.id}. ${esc(f.name)}</button>`).join('') +
    `<span class="spacer"></span>
     <label class="toggle"><input type="checkbox" id="reveal"> Reveal story details (spoilers)</label>`;

  nav.querySelectorAll('button[data-n]').forEach((b) => {
    b.addEventListener('click', () => {
      current = Number(b.dataset.n);
      nav.querySelectorAll('button[data-n]').forEach((x) => x.classList.toggle('on', x === b));
      render();
    });
  });
  document.getElementById('reveal').addEventListener('change', (e) => {
    reveal = e.target.checked;
    document.getElementById('warn').textContent = reveal
      ? 'Story reveal is ON. Dead ends, the Ward Token route, NPCs and items are visible below.'
      : 'Story reveal is off. Room kinds, dead ends, the Ward Token route, NPCs and items are hidden.';
    document.getElementById('warn').style.color = reveal ? 'var(--blood)' : 'var(--brass)';
    render();
  });

  render();
}

function render() {
  const floor = floors.find((f) => f.id === current);
  const main = document.getElementById('main');
  if (!floor) { main.innerHTML = '<p class="err">Floor failed to load.</p>'; return; }

  let layout;
  try { layout = buildLayout(floor); }
  catch (e) { main.innerHTML = `<p class="err">Layout failed: ${esc(e.message)}</p>`; return; }

  const theme = getTheme(floor.theme);
  const s = stats(floor, layout);

  main.innerHTML = `
    <div class="floor-head">
      <h2>Floor ${floor.id} — ${esc(floor.name)}</h2>
      <span class="ward">${esc(floor.subtitle || '')}</span>
      <span class="theme-chip" style="color:#${theme.accent.toString(16).padStart(6, '0')}">${esc(floor.theme)}</span>
    </div>
    <div class="stats">
      ${stat(s.rooms, 'rooms')}
      ${stat(s.corridors, 'hallways')}
      ${stat(s.locked, 'locked doors')}
      ${stat(s.depth, 'max depth')}
      ${stat(s.widest, 'widest layer')}
      ${stat(s.forks, 'forking rooms')}
      ${stat(s.leaves, 'terminal rooms')}
      ${reveal ? stat(s.npcs, 'npcs') : stat('··', 'npcs')}
      ${reveal ? stat(s.deadends, 'dead ends') : stat('··', 'dead ends')}
      ${stat(s.words.toLocaleString(), 'words')}
    </div>
    <div class="mapwrap">${svg(floor, layout)}</div>
    <div class="legend">
      <span><i style="background:${KIND_COLOR.entry}"></i>entry</span>
      <span><i style="background:${KIND_COLOR.exit}"></i>exit / stair down</span>
      ${reveal ? `
        <span><i style="background:${KIND_COLOR.deadend}"></i>dead end</span>
        <span><i style="background:${KIND_COLOR.shrine}"></i>shrine</span>
        <span><i style="background:${KIND_COLOR.shop}"></i>shop</span>
        <span><i style="background:${KIND_COLOR.vault}"></i>vault</span>` : ''}
      <span><i style="background:#6f7a86"></i>room</span>
      <span><svg width="26" height="9"><line x1="0" y1="4" x2="26" y2="4" stroke="#7fd8a0" stroke-width="3"/></svg> open from the start</span>
      <span><svg width="26" height="9"><line x1="0" y1="4" x2="26" y2="4" stroke="#d4564a" stroke-width="3" stroke-dasharray="5 4"/></svg> opened by a choice</span>
    </div>
    ${table(floor, layout)}
  `;
}

function stat(v, label) {
  return `<div class="stat"><b>${v}</b><span>${label}</span></div>`;
}

function stats(floor, layout) {
  const rooms = floor.rooms;
  let locked = 0;
  for (const c of layout.corridors) if (c.locked) locked++;
  const deg = new Map(rooms.map((r) => [r.id, 0]));
  for (const c of layout.corridors) {
    deg.set(c.a, deg.get(c.a) + 1);
    deg.set(c.b, deg.get(c.b) + 1);
  }
  const layerCount = new Map();
  for (const p of layout.rooms.values()) layerCount.set(p.col, (layerCount.get(p.col) || 0) + 1);

  let words = 0;
  for (const r of rooms) {
    if (!r.npc) continue;
    for (const l of [...(r.npc.greet || []), ...(r.npc.idle || [])]) words += wc(l);
    for (const c of r.npc.choices || []) {
      words += wc(c.text);
      for (const l of c.reply || []) words += wc(l);
    }
  }

  return {
    rooms: rooms.length,
    corridors: layout.corridors.length,
    locked,
    depth: Math.max(...[...layout.rooms.values()].map((p) => p.col)) + 1,
    widest: Math.max(...layerCount.values()),
    forks: [...deg.values()].filter((d) => d >= 3).length,
    leaves: [...deg.values()].filter((d) => d <= 1).length,
    npcs: rooms.filter((r) => r.npc).length,
    deadends: rooms.filter((r) => r.kind === 'deadend').length,
    words
  };
}

function wc(s) { return String(s || '').trim().split(/\s+/).filter(Boolean).length; }

function svg(floor, layout) {
  const b = layout.bounds;
  const pad = 14;
  const W = b.maxX - b.minX + pad * 2;
  const H = b.maxZ - b.minZ + pad * 2;
  const ox = -b.minX + pad, oz = -b.minZ + pad;

  let halls = '', doors = '', boxes = '', labels = '';

  for (const c of layout.corridors) {
    const pts = c.points.map((p) => `${(p.x + ox).toFixed(1)},${(p.z + oz).toFixed(1)}`).join(' ');
    halls += `<polyline points="${pts}" fill="none" stroke="#1d242d" stroke-width="${CORRIDOR.width + 1.4}"
      stroke-linejoin="round" stroke-linecap="round"/>`;
    halls += `<polyline points="${pts}" fill="none"
      stroke="${c.locked ? '#d4564a' : '#7fd8a0'}" stroke-opacity="${c.locked ? 0.75 : 0.6}"
      stroke-width="1.5" ${c.locked ? 'stroke-dasharray="5 4"' : ''}
      stroke-linejoin="round" stroke-linecap="round"/>`;
    for (const d of [c.doorA, c.doorB]) {
      doors += `<circle cx="${(d.x + ox).toFixed(1)}" cy="${(d.z + oz).toFixed(1)}" r="1.5"
        fill="${c.locked ? '#d4564a' : '#7fd8a0'}"/>`;
    }
  }

  let i = 0;
  for (const p of layout.rooms.values()) {
    const kind = p.room.kind;
    const shown = reveal ? kind : (kind === 'entry' || kind === 'exit' ? kind : 'branch');
    const col = KIND_COLOR[shown] || '#6f7a86';
    const x = p.x - p.w / 2 + ox, y = p.z - p.d / 2 + oz;
    boxes += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${p.w}" height="${p.d}" rx="1.2"
      fill="${col}" fill-opacity="0.13" stroke="${col}" stroke-opacity="0.85" stroke-width="0.9"/>`;
    const code = String.fromCharCode(65 + p.col) + (p.row + 1);
    labels += `<text x="${(p.x + ox).toFixed(1)}" y="${(p.z + oz - 1.0).toFixed(1)}"
      text-anchor="middle" font-size="3.4" fill="${col}" font-family="Georgia,serif">${code}</text>`;
    labels += `<text x="${(p.x + ox).toFixed(1)}" y="${(p.z + oz + 2.6).toFixed(1)}"
      text-anchor="middle" font-size="2.5" fill="#8d97a2" font-family="Inter,sans-serif">${esc(clip(p.room.name, 22))}</text>`;
    i++;
  }

  return `<svg viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" preserveAspectRatio="xMidYMid meet">
    <rect width="${W.toFixed(0)}" height="${H.toFixed(0)}" fill="#0c1016"/>
    ${halls}${boxes}${doors}${labels}
  </svg>`;
}

function table(floor, layout) {
  const rows = [...layout.rooms.values()].sort((a, b) => a.col - b.col || a.row - b.row);
  const byId = new Map(floor.rooms.map((r) => [r.id, r]));

  const body = rows.map((p) => {
    const r = p.room;
    const code = String.fromCharCode(65 + p.col) + (p.row + 1);
    const outs = layout.corridors
      .filter((c) => c.a === r.id || c.b === r.id)
      .map((c) => {
        const other = c.a === r.id ? c.b : c.a;
        const o = layout.rooms.get(other);
        const oc = String.fromCharCode(65 + o.col) + (o.row + 1);
        return `<span class="pill" style="border-color:${c.locked ? 'rgba(212,86,74,.5)' : 'rgba(127,216,160,.4)'};color:${c.locked ? '#d4564a' : '#7fd8a0'}">${oc}${c.locked ? ' • locked' : ''}</span>`;
      }).join(' ');

    const choiceCount = (r.npc && r.npc.choices) ? r.npc.choices.length : 0;
    return `<tr>
      <td class="mono">${code}</td>
      <td>${esc(r.name)}</td>
      <td class="mono">${esc(r.size || 'medium')}</td>
      <td>${reveal ? `<span class="pill" style="color:${KIND_COLOR[r.kind]};border-color:${KIND_COLOR[r.kind]}55">${r.kind}</span>` : '<span class="hidden-cell">hidden</span>'}</td>
      <td>${outs || '<span class="hidden-cell">none</span>'}</td>
      <td>${choiceCount ? choiceCount + ' way' + (choiceCount === 1 ? '' : 's') : '<span class="hidden-cell">—</span>'}</td>
      <td>${reveal
        ? (r.npc ? esc(r.npc.name) + (r.npc.title ? ', ' + esc(r.npc.title) : '') : '<span class="hidden-cell">—</span>')
        : (r.npc ? '<span class="hidden-cell">someone</span>' : '<span class="hidden-cell">—</span>')}</td>
    </tr>`;
  }).join('');

  return `<table>
    <thead><tr>
      <th>Cell</th><th>Room</th><th>Size</th><th>Kind</th>
      <th>Connects to</th><th>Choices</th><th>Speaker</th>
    </tr></thead>
    <tbody>${body}</tbody>
  </table>`;
}

function clip(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
