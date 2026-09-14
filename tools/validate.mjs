// Static validation for every floor file. Run: node tools/validate.mjs
//
// Checks structure, vocabularies, graph reachability, effect targets, item
// references, and does a reachability simulation to prove no floor can soft-lock
// a player who arrives broke, empty-handed and on one heart.

import { ITEMS } from '../src/data/items.js';
import { CLASSES } from '../src/data/classes.js';
import THEMES from '../src/data/themes.js';
import { buildLayout, SIZES } from '../src/world/layout.js';
import {
  PROP_NAMES, NPC_FORMS as FORMS, NPC_VOICES as VOICES, ROOM_KINDS as KINDS,
  SOUND_IDS as SOUNDS, ICON_NAMES as ICONS, EFFECT_TYPES as EFFECTS
} from '../src/data/vocab.js';
const CLASS_IDS = CLASSES.map((c) => c.id);

let errors = 0, warnings = 0;
const err = (f, m) => { console.log(`  \x1b[31mERROR\x1b[0m  [f${f}] ${m}`); errors++; };
const warn = (f, m) => { console.log(`  \x1b[33mwarn \x1b[0m  [f${f}] ${m}`); warnings++; };

const allItems = new Set(Object.keys(ITEMS));
const allFlagsSet = new Set();
const allFlagsRequired = [];
const summary = [];

for (let n = 1; n <= 10; n++) {
  let floor;
  try {
    floor = (await import(`../src/data/floors/floor${n}.js`)).default;
  } catch (e) {
    err(n, `cannot import: ${e.message}`);
    continue;
  }
  check(floor, n);
}

// cross-floor flag sanity
for (const { floor, flag, where } of allFlagsRequired) {
  if (!allFlagsSet.has(flag)) warn(floor, `${where} requires flag "${flag}" which nothing ever sets`);
}

console.log('\n' + '─'.repeat(78));
console.log(' Floor  Rooms  NPCs  Dead  Shops  Tokens  Words   Layout');
console.log('─'.repeat(78));
for (const s of summary) {
  console.log(` ${String(s.id).padStart(4)}   ${String(s.rooms).padStart(4)}   ${String(s.npcs).padStart(4)}` +
    `  ${String(s.dead).padStart(4)}  ${String(s.shops).padStart(5)}  ${String(s.tokenRoutes).padStart(6)}` +
    `  ${String(s.words).padStart(5)}   ${s.layout}`);
}
console.log('─'.repeat(78));
const totalWords = summary.reduce((a, b) => a + b.words, 0);
const totalRooms = summary.reduce((a, b) => a + b.rooms, 0);
const totalNpcs = summary.reduce((a, b) => a + b.npcs, 0);
console.log(` Total: ${totalRooms} rooms, ${totalNpcs} NPCs, ${totalWords.toLocaleString()} words of dialogue`);
console.log(`\n ${errors} errors, ${warnings} warnings\n`);
process.exit(errors ? 1 : 0);

// ---------------------------------------------------------------------------

function check(floor, n) {
  const id = floor.id;
  if (id !== n) err(n, `floor.id is ${id}, expected ${n}`);
  if (!THEMES[floor.theme]) err(n, `unknown theme "${floor.theme}"`);
  for (const k of ['name', 'subtitle', 'intro', 'entry']) {
    if (!floor[k]) err(n, `missing floor.${k}`);
  }

  const rooms = floor.rooms || [];
  const byId = new Map();
  for (const r of rooms) {
    if (byId.has(r.id)) err(n, `duplicate room id ${r.id}`);
    byId.set(r.id, r);
    if (!r.id.startsWith(`f${n}_`)) err(n, `room id "${r.id}" is not prefixed f${n}_`);
    if (!KINDS.includes(r.kind)) err(n, `${r.id}: bad kind "${r.kind}"`);
    if (r.size && !SIZES[r.size]) err(n, `${r.id}: bad size "${r.size}"`);
    for (const p of r.props || []) {
      if (!PROP_NAMES.includes(p)) err(n, `${r.id}: unknown prop "${p}"`);
    }
  }

  if (!byId.has(floor.entry)) err(n, `entry room "${floor.entry}" does not exist`);
  if (rooms.length < 14 || rooms.length > 20) warn(n, `${rooms.length} rooms (spec says 14-20)`);

  const entries = rooms.filter((r) => r.kind === 'entry');
  const exits = rooms.filter((r) => r.kind === 'exit');
  if (entries.length !== 1) err(n, `${entries.length} rooms of kind "entry" (need exactly 1)`);
  if (exits.length !== 1) err(n, `${exits.length} rooms of kind "exit" (need exactly 1)`);

  // ---- doors & reachability
  const adj = new Map(rooms.map((r) => [r.id, new Set()]));
  const declared = new Set();
  for (const r of rooms) {
    for (const d of r.doors || []) {
      if (!byId.has(d.to)) { err(n, `${r.id}: door to missing room "${d.to}"`); continue; }
      if (d.to === r.id) { err(n, `${r.id}: door to itself`); continue; }
      const key = [r.id, d.to].sort().join('|');
      if (declared.has(key)) err(n, `connection ${key} declared twice (declare each edge once)`);
      declared.add(key);
      adj.get(r.id).add(d.to);
      adj.get(d.to).add(r.id);
    }
  }

  const seen = new Set([floor.entry]);
  const q = [floor.entry];
  while (q.length) {
    for (const x of adj.get(q.shift()) || []) if (!seen.has(x)) { seen.add(x); q.push(x); }
  }
  for (const r of rooms) if (!seen.has(r.id)) err(n, `${r.id} is unreachable from the entry`);

  // ---- floor-local item catalogue
  const localItems = new Set([...allItems, ...Object.keys(floor.items || {})]);
  for (const [iid, def] of Object.entries(floor.items || {})) {
    if (!def.name) err(n, `item ${iid}: missing name`);
    if (def.icon && !ICONS.includes(def.icon)) err(n, `item ${iid}: unknown icon "${def.icon}"`);
    if (allItems.has(iid)) warn(n, `item ${iid} shadows the global catalogue`);
  }

  // ---- effects
  let tokenRoutes = 0, plainEnds = 0, shops = 0, words = 0, npcs = 0, dead = 0;
  const flagsSetHere = new Set();

  const checkEffects = (list, where) => {
    for (const e of list || []) {
      if (!EFFECTS.includes(e.t)) { err(n, `${where}: unknown effect "${e.t}"`); continue; }
      if ((e.t === 'unlock' || e.t === 'lock' || e.t === 'move') && !byId.has(e.to)) {
        err(n, `${where}: ${e.t} targets missing room "${e.to}"`);
      }
      if (e.t === 'item' && !localItems.has(e.id)) err(n, `${where}: unknown item "${e.id}"`);
      if (e.t === 'sound' && !SOUNDS.includes(e.id)) err(n, `${where}: unknown sound "${e.id}"`);
      if (e.t === 'flag') { flagsSetHere.add(e.id); allFlagsSet.add(e.id); }
      if (e.t === 'floorEnd') { if (e.token) tokenRoutes++; else plainEnds++; }
      if (e.t === 'ending' && n !== 10) err(n, `${where}: {t:"ending"} is only allowed on floor 10`);
      if (e.t === 'codex' && (!e.id || !e.title || !e.text)) err(n, `${where}: codex entry incomplete`);
      if (e.t === 'shop') {
        shops++;
        for (const s of [...(e.stock || []), ...(e.buys || [])]) {
          if (!localItems.has(s.item)) err(n, `${where}: shop references unknown item "${s.item}"`);
          if (typeof s.price !== 'number') err(n, `${where}: shop entry for ${s.item} has no price`);
        }
      }
    }
  };

  for (const r of rooms) {
    if (r.kind === 'deadend') dead++;
    checkEffects(r.onEnter, `${r.id}.onEnter`);
    checkEffects(r.onEnterAlways, `${r.id}.onEnterAlways`);

    // dead ends must cost a heart and must offer a way out
    if (r.kind === 'deadend') {
      const all = [...(r.onEnter || []), ...(r.onEnterAlways || []),
        ...((r.npc?.choices || []).flatMap((c) => c.effects || []))];
      if (!all.some((e) => e.t === 'heart' && e.n < 0)) warn(n, `${r.id}: dead end that costs no heart`);
      const escapes = all.some((e) => e.t === 'move' || e.t === 'unlock');
      const hasOpenDoor = (r.doors || []).some((d) => !d.locked) ||
        rooms.some((o) => (o.doors || []).some((d) => d.to === r.id && !d.locked));
      if (!escapes && !hasOpenDoor) err(n, `${r.id}: dead end with no escape (soft-lock)`);
    }

    if (!r.npc) continue;
    npcs++;
    const npc = r.npc;
    if (!npc.id || !npc.id.startsWith(`f${n}_`)) err(n, `${r.id}: npc id "${npc.id}" not prefixed f${n}_`);
    if (!FORMS.includes(npc.form)) err(n, `${npc.id}: bad form "${npc.form}"`);
    if (npc.voice && !VOICES.includes(npc.voice)) err(n, `${npc.id}: bad voice "${npc.voice}"`);
    if (!npc.greet || !npc.greet.length) err(n, `${npc.id}: no greet lines`);

    for (const line of [...(npc.greet || []), ...(npc.idle || [])]) words += wordCount(line);

    let free = 0;
    const seenChoice = new Set();
    for (const c of npc.choices || []) {
      if (seenChoice.has(c.id)) err(n, `${npc.id}: duplicate choice id "${c.id}"`);
      seenChoice.add(c.id);
      if (!c.text) err(n, `${npc.id}/${c.id}: no text`);
      if (!c.require) free++;
      if (c.require) {
        const r0 = c.require;
        for (const cl of r0.class || []) if (!CLASS_IDS.includes(cl)) err(n, `${npc.id}/${c.id}: unknown class "${cl}"`);
        for (const it of r0.items || []) if (!localItems.has(it)) err(n, `${npc.id}/${c.id}: requires unknown item "${it}"`);
        for (const f of [...(r0.flags || []), ...(r0.notFlags || [])]) {
          allFlagsRequired.push({ floor: n, flag: f, where: `${npc.id}/${c.id}` });
        }
        if ((r0.gold || r0.items) && !c.lockedText) {
          warn(n, `${npc.id}/${c.id}: gated on gold/items with no lockedText (choice will be hidden)`);
        }
      }
      for (const line of [...(c.reply || [])]) words += wordCount(line);
      words += wordCount(c.text);
      checkEffects(c.effects, `${npc.id}/${c.id}`);
    }
    if (!free) err(n, `${npc.id}: every choice is gated — the player can be stuck here`);
  }

  if (tokenRoutes !== 1 && n !== 10) err(n, `${tokenRoutes} routes call floorEnd with token:true (need exactly 1)`);
  if (!plainEnds && n !== 10) err(n, 'no token-free route to the exit');
  if (!shops && n >= 2 && n <= 9) warn(n, 'no shop NPC on this floor');
  if (dead < 2 || dead > 4) warn(n, `${dead} dead ends (spec says 2-4)`);
  if (words < 1400) warn(n, `only ${words} words of dialogue`);

  // ---- layout solves?
  let layoutNote = 'ok';
  try {
    const L = buildLayout(floor);
    const unrouted = L.edges.length - L.corridors.length;
    if (unrouted > 0) { err(n, `${unrouted} connections could not be routed as corridors`); layoutNote = 'UNROUTED'; }
    else layoutNote = `${L.corridors.length} halls`;
    // corridors must not run through room footprints
    for (const c of L.corridors) {
      for (const s of c.segments) {
        for (const p of L.rooms.values()) {
          if (p.id === c.a || p.id === c.b) continue;
          const ox = Math.min(s.maxX, p.x + p.w / 2) - Math.max(s.minX, p.x - p.w / 2);
          const oz = Math.min(s.maxZ, p.z + p.d / 2) - Math.max(s.minZ, p.z - p.d / 2);
          if (ox > 0.6 && oz > 0.6) {
            err(n, `corridor ${c.a}->${c.b} passes through room ${p.id}`);
            layoutNote = 'OVERLAP';
          }
        }
      }
    }
  } catch (e) {
    err(n, `layout failed: ${e.message}`);
    layoutNote = 'FAILED';
  }

  // ---- soft-lock simulation: broke, empty-handed, 1 heart, no class gates
  const reach = simulate(floor, byId);
  if (!reach.canEnd) err(n, 'a player with no gold, no items and no class gates cannot finish this floor');

  summary.push({
    id: n, rooms: rooms.length, npcs, dead, shops,
    tokenRoutes, words, layout: layoutNote
  });
}

function wordCount(s) {
  return String(s || '').trim().split(/\s+/).filter(Boolean).length;
}

// Walks the floor as the poorest possible player: no gold, no items, no class
// gate ever passes, hearts ignored. Anything that opens is followed.
function simulate(floor, byId) {
  const open = new Set();
  const flags = new Set();
  const visited = new Set();
  let canEnd = false;

  const passable = (from, to) => {
    const r = byId.get(from);
    const d = (r.doors || []).find((x) => x.to === to);
    if (d) return !d.locked || open.has(to);
    const back = byId.get(to);
    const d2 = (back.doors || []).find((x) => x.to === from);
    if (d2) return !d2.locked || open.has(from);
    return false;
  };

  const applyable = (require) => {
    if (!require) return true;
    if (require.class) return false;          // assume no class gate passes
    if (require.items && require.items.length) return false;
    if (require.gold) return false;
    if (require.flags) return require.flags.every((f) => flags.has(f));
    return true;
  };

  for (let pass = 0; pass < 30; pass++) {
    let changed = false;
    // explore
    const q = [floor.entry];
    const seen = new Set([floor.entry]);
    while (q.length) {
      const id = q.shift();
      if (!visited.has(id)) { visited.add(id); changed = true; }
      const r = byId.get(id);
      for (const e of [...(r.onEnter || []), ...(r.onEnterAlways || [])]) {
        if (e.t === 'unlock' && !open.has(e.to)) { open.add(e.to); changed = true; }
        if (e.t === 'flag' && e.v !== false && !flags.has(e.id)) { flags.add(e.id); changed = true; }
        if (e.t === 'move' && !seen.has(e.to)) { seen.add(e.to); q.push(e.to); }
        if (e.t === 'floorEnd' || e.t === 'ending') canEnd = true;
      }
      if (r.npc) {
        for (const c of r.npc.choices || []) {
          if (!applyable(c.require)) continue;
          for (const e of c.effects || []) {
            if (e.t === 'unlock' && !open.has(e.to)) { open.add(e.to); changed = true; }
            if (e.t === 'flag' && e.v !== false && !flags.has(e.id)) { flags.add(e.id); changed = true; }
            if (e.t === 'move' && !seen.has(e.to)) { seen.add(e.to); q.push(e.to); }
            if (e.t === 'floorEnd' || e.t === 'ending') canEnd = true;
          }
        }
      }
      for (const other of byId.keys()) {
        if (seen.has(other)) continue;
        if (passable(id, other)) { seen.add(other); q.push(other); }
      }
    }
    if (!changed) break;
  }
  return { canEnd, visited };
}
