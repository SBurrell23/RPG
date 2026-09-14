// Persisted user settings. Any consumer can subscribe; changes flagged `hard`
// cause the renderer to be rebuilt (antialias mode can't change on a live context).

import * as Storage from './storage.js';

const KEY = 'settings:v1';

export const SCHEMA = {
  graphics: {
    label: 'Graphics',
    fields: [
      { id: 'fpsCap', label: 'FPS Cap', type: 'select', def: 60,
        options: [[0, 'Unlimited'], [30, '30'], [60, '60'], [75, '75'], [120, '120'], [144, '144'], [240, '240']],
        hint: 'Caps the simulation and draw rate. Unlimited follows your display.' },
      { id: 'antialias', label: 'Anti-aliasing', type: 'select', def: 'msaa4', hard: true,
        options: [['off', 'Off'], ['fxaa', 'FXAA (cheap)'], ['msaa2', 'MSAA 2×'], ['msaa4', 'MSAA 4×'], ['msaa8', 'MSAA 8×']],
        hint: 'MSAA is sharper; FXAA is faster and slightly soft. Rebuilds the renderer.' },
      { id: 'resolution', label: 'Render Scale', type: 'range', def: 1.0, min: 0.5, max: 2.0, step: 0.05, fmt: (v) => Math.round(v * 100) + '%',
        hint: 'Below 100% renders smaller and upscales. Above 100% is supersampling.' },
      { id: 'shadows', label: 'Shadows', type: 'select', def: 'medium', hard: true,
        options: [['off', 'Off'], ['low', 'Low (1024)'], ['medium', 'Medium (2048)'], ['high', 'High (4096)']],
        hint: 'Shadow-casting lights are limited; higher settings raise map resolution and count.' },
      { id: 'bloom', label: 'Bloom', type: 'select', def: 'medium',
        options: [['off', 'Off'], ['low', 'Subtle'], ['medium', 'Medium'], ['high', 'Heavy']],
        hint: 'Glow around torches, emissives and lanterns. Off disables the post pipeline.' },
      { id: 'lights', label: 'Dynamic Lights', type: 'select', def: 'medium',
        options: [['low', 'Low'], ['medium', 'Medium'], ['high', 'High'], ['ultra', 'Ultra']],
        hint: 'How many point lights may be active at once in nearby rooms.' },
      { id: 'particles', label: 'Particles', type: 'select', def: 'medium',
        options: [['off', 'Off'], ['low', 'Low'], ['medium', 'Medium'], ['high', 'High']],
        hint: 'Dust, embers, spores and rain.' },
      { id: 'textures', label: 'Texture Detail', type: 'select', def: 'medium', hard: true,
        options: [['low', 'Low (128)'], ['medium', 'Medium (256)'], ['high', 'High (512)']],
        hint: 'Resolution of the procedurally generated surface textures.' },
      { id: 'fog', label: 'Atmospheric Fog', type: 'toggle', def: true,
        hint: 'Depth haze. Disabling it flattens the look but reveals more of each room.' },
      { id: 'anisotropy', label: 'Anisotropic Filter', type: 'select', def: 4,
        options: [[1, 'Off'], [2, '2×'], [4, '4×'], [8, '8×'], [16, '16×']],
        hint: 'Sharpens floors viewed at a glancing angle.' },
      { id: 'fov', label: 'Field of View', type: 'range', def: 75, min: 60, max: 105, step: 1, fmt: (v) => v + '°' },
      { id: 'viewBob', label: 'View Bob', type: 'toggle', def: true, hint: 'Head movement while walking.' }
    ]
  },
  sound: {
    label: 'Sound',
    fields: [
      { id: 'muted', label: 'Mute All', type: 'toggle', def: false },
      { id: 'volMaster', label: 'Master Volume', type: 'range', def: 0.8, min: 0, max: 1, step: 0.01, fmt: pct },
      { id: 'volAmbient', label: 'Ambience', type: 'range', def: 0.65, min: 0, max: 1, step: 0.01, fmt: pct,
        hint: 'The drones, wind, water and machinery of each floor.' },
      { id: 'volSfx', label: 'Sound Effects', type: 'range', def: 0.8, min: 0, max: 1, step: 0.01, fmt: pct },
      { id: 'volVoice', label: 'Speech Blips', type: 'range', def: 0.55, min: 0, max: 1, step: 0.01, fmt: pct,
        hint: 'The synthesised voice tones as dialogue types out.' },
      { id: 'volSteps', label: 'Footsteps', type: 'range', def: 0.5, min: 0, max: 1, step: 0.01, fmt: pct }
    ]
  },
  controls: {
    label: 'Controls',
    fields: [
      { id: 'sensitivity', label: 'Mouse Sensitivity', type: 'range', def: 1.0, min: 0.2, max: 3.0, step: 0.05, fmt: (v) => v.toFixed(2) },
      { id: 'invertY', label: 'Invert Vertical Look', type: 'toggle', def: false },
      { id: 'textSpeed', label: 'Text Speed', type: 'select', def: 'normal',
        options: [['slow', 'Slow'], ['normal', 'Normal'], ['fast', 'Fast'], ['instant', 'Instant']] },
      { id: 'crosshair', label: 'Crosshair', type: 'toggle', def: true },
      { id: 'showRoomName', label: 'Room Name Banner', type: 'toggle', def: true }
    ]
  }
};

function pct(v) { return Math.round(v * 100) + '%'; }

const defaults = {};
for (const group of Object.values(SCHEMA)) {
  for (const f of group.fields) defaults[f.id] = f.def;
}

let values = { ...defaults };
const listeners = new Set();

// Coerces one stored value onto the schema, or returns undefined if it is not
// something this field could ever legitimately hold. Storage is shared with
// every other game on this origin, so a value under our key is not proof that
// we wrote it.
function sanitise(field, value) {
  if (value === undefined || value === null) return undefined;
  if (field.type === 'toggle') {
    return typeof value === 'boolean' ? value : undefined;
  }
  if (field.type === 'range') {
    const n = Number(value);
    if (!Number.isFinite(n)) return undefined;
    return Math.min(field.max, Math.max(field.min, n));
  }
  // select: must be one of the offered options, matched loosely so that a
  // number stored as a string still resolves to the typed option value
  const match = field.options.find(([v]) => String(v) === String(value));
  return match ? match[0] : undefined;
}

const stored = Storage.readJSON(KEY);
if (stored) {
  for (const group of Object.values(SCHEMA)) {
    for (const f of group.fields) {
      const clean = sanitise(f, stored[f.id]);
      if (clean !== undefined) values[f.id] = clean;
    }
  }
}

export const settings = new Proxy(values, {
  get: (t, k) => t[k],
  set: () => { throw new Error('Use Settings.set()'); }
});

export function get(id) { return values[id]; }

export function set(id, value) {
  if (values[id] === value) return;
  values[id] = value;
  persist();
  const field = findField(id);
  emit({ id, value, hard: !!(field && field.hard) });
}

export function resetGroup(groupKey) {
  const group = SCHEMA[groupKey];
  if (!group) return;
  let hard = false;
  for (const f of group.fields) {
    if (values[f.id] !== f.def) { values[f.id] = f.def; if (f.hard) hard = true; }
  }
  persist();
  emit({ id: '*', value: null, hard });
}

export function resetAll() {
  values = { ...defaults };
  persist();
  emit({ id: '*', value: null, hard: true });
}

function findField(id) {
  for (const g of Object.values(SCHEMA)) {
    const f = g.fields.find((x) => x.id === id);
    if (f) return f;
  }
  return null;
}

function persist() {
  Storage.writeJSON(KEY, values);
}

function emit(ev) { for (const fn of listeners) fn(ev); }

export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

// ---- derived values the engine asks for -----------------------------------

export function shadowMapSize() {
  return { off: 0, low: 1024, medium: 2048, high: 4096 }[values.shadows] || 0;
}

export function maxShadowLights() {
  return { off: 0, low: 2, medium: 4, high: 6 }[values.shadows] || 0;
}

export function maxDynamicLights() {
  return { low: 6, medium: 12, high: 20, ultra: 32 }[values.lights] || 12;
}

export function textureSize() {
  return { low: 128, medium: 256, high: 512 }[values.textures] || 256;
}

export function particleScale() {
  return { off: 0, low: 0.3, medium: 0.65, high: 1.0 }[values.particles] ?? 0.65;
}

export function bloomScale() {
  return { off: 0, low: 0.5, medium: 1.0, high: 1.7 }[values.bloom] ?? 1.0;
}

export function msaaSamples() {
  return { off: 0, fxaa: 0, msaa2: 2, msaa4: 4, msaa8: 8 }[values.antialias] ?? 4;
}

export function useFxaa() { return values.antialias === 'fxaa'; }

export function textCharDelay() {
  return { slow: 42, normal: 20, fast: 9, instant: 0 }[values.textSpeed] ?? 20;
}
