// Procedural surface generation. Every material in the game gets an albedo map,
// a derived normal map and a roughness map, all built in a canvas at load time.
// No image files exist in this project.

import * as THREE from 'three';

const cache = new Map();
let anisotropyCap = 4;

export function setAnisotropyCap(v) { anisotropyCap = v; }

// ------------------------------------------------------------------- noise

function hash2(x, y, seed) {
  let h = x * 374761393 + y * 668265263 + seed * 2246822519;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

function smooth(t) { return t * t * (3 - 2 * t); }

function valueNoise(x, y, seed) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = smooth(xf), v = smooth(yf);
  const a = hash2(xi, yi, seed), b = hash2(xi + 1, yi, seed);
  const c = hash2(xi, yi + 1, seed), d = hash2(xi + 1, yi + 1, seed);
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}

// Tiling fbm: sample on a torus so the texture repeats seamlessly.
function tileNoise(x, y, freq, seed, size) {
  const p = freq;
  const nx = (x / size) * p, ny = (y / size) * p;
  // wrap by blending the four shifted samples
  const a = valueNoise(nx, ny, seed);
  const b = valueNoise(nx - p, ny, seed);
  const c = valueNoise(nx, ny - p, seed);
  const d = valueNoise(nx - p, ny - p, seed);
  const fx = x / size, fy = y / size;
  return (a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + d * fx * fy);
}

function fbm(x, y, size, seed, octaves = 4, baseFreq = 4, gain = 0.5) {
  let sum = 0, amp = 1, norm = 0, f = baseFreq;
  for (let i = 0; i < octaves; i++) {
    sum += tileNoise(x, y, Math.round(f), seed + i * 131, size) * amp;
    norm += amp;
    amp *= gain;
    f *= 2;
  }
  return sum / norm;
}

function ridged(x, y, size, seed, octaves = 4, baseFreq = 4) {
  let sum = 0, amp = 1, norm = 0, f = baseFreq;
  for (let i = 0; i < octaves; i++) {
    const n = Math.abs(tileNoise(x, y, Math.round(f), seed + i * 57, size) * 2 - 1);
    sum += (1 - n) * amp;
    norm += amp;
    amp *= 0.5;
    f *= 2;
  }
  return sum / norm;
}

// ---------------------------------------------------------------- specs

// h  -> height 0..1 (drives the normal map)
// c  -> [r,g,b] 0..255
// r  -> roughness 0..1
const SPECS = {
  stone: {
    base: [122, 120, 114], seed: 11,
    fn(x, y, s) {
      const n = fbm(x, y, s, 11, 5, 5);
      const cr = ridged(x, y, s, 71, 4, 7);
      const crack = cr > 0.82 ? (cr - 0.82) / 0.18 : 0;
      const h = n * 0.8 - crack * 0.65;
      const v = 0.72 + n * 0.42 - crack * 0.35;
      return { h, c: [v, v * 0.99, v * 0.94], r: 0.78 + (1 - n) * 0.18 };
    }
  },
  rough: {
    base: [96, 94, 90], seed: 23,
    fn(x, y, s) {
      const n = fbm(x, y, s, 23, 6, 8);
      return { h: n, c: [0.7 + n * 0.5, 0.7 + n * 0.48, 0.69 + n * 0.45], r: 0.9 + n * 0.1 };
    }
  },
  brick: {
    base: [128, 78, 58], seed: 31,
    fn(x, y, s) {
      const rows = 8, cols = 4;
      const rh = s / rows;
      const row = Math.floor(y / rh);
      const offset = (row % 2) * (s / cols / 2);
      const bw = s / cols;
      const bx = ((x + offset) % bw) / bw;
      const by = (y % rh) / rh;
      const mortar = bx < 0.045 || bx > 0.955 || by < 0.07 || by > 0.93;
      const n = fbm(x, y, s, 31, 4, 10);
      if (mortar) return { h: 0.18 + n * 0.1, c: [0.52 + n * 0.16, 0.5 + n * 0.15, 0.47 + n * 0.14], r: 0.95 };
      const tintSeed = hash2(Math.floor((x + offset) / bw), row, 5);
      const t = 0.82 + tintSeed * 0.36;
      const h = 0.62 + n * 0.3;
      return { h, c: [(0.72 + n * 0.3) * t, (0.55 + n * 0.24) * t, (0.46 + n * 0.2) * t], r: 0.8 + n * 0.14 };
    }
  },
  tile: {
    base: [104, 108, 112], seed: 43,
    fn(x, y, s) {
      const cells = 4;
      const cw = s / cells;
      const cx = (x % cw) / cw, cy = (y % cw) / cw;
      const edge = Math.min(cx, 1 - cx, cy, 1 - cy);
      const groove = edge < 0.035;
      const bevel = Math.min(1, edge / 0.1);
      const n = fbm(x, y, s, 43, 4, 8);
      const idx = hash2(Math.floor(x / cw), Math.floor(y / cw), 9);
      const t = 0.86 + idx * 0.3;
      if (groove) return { h: 0.1, c: [0.38 * t, 0.39 * t, 0.41 * t], r: 0.92 };
      const h = 0.55 + bevel * 0.35 + n * 0.12;
      const v = (0.68 + n * 0.28) * t;
      return { h, c: [v, v * 1.01, v * 1.05], r: 0.42 + n * 0.22 };
    }
  },
  marble: {
    base: [150, 146, 140], seed: 57,
    fn(x, y, s) {
      const turb = fbm(x, y, s, 57, 5, 4) * 3.4;
      const vein = Math.abs(Math.sin((x / s) * Math.PI * 3 + turb * 2.2));
      const v = 0.62 + Math.pow(vein, 0.6) * 0.4;
      const dark = Math.pow(1 - vein, 6) * 0.5;
      return { h: 0.5 + (1 - vein) * 0.12, c: [v - dark, v - dark * 1.05, v - dark * 0.9], r: 0.22 + (1 - vein) * 0.25 };
    }
  },
  metal: {
    base: [138, 140, 146], seed: 67,
    fn(x, y, s) {
      const streak = valueNoise(x / 1.4, y / 42, 67);
      const n = fbm(x, y, s, 67, 3, 12) * 0.35;
      const v = 0.68 + streak * 0.34 + n * 0.2;
      return { h: 0.5 + streak * 0.14, c: [v, v * 1.0, v * 1.03], r: 0.3 + streak * 0.28 };
    }
  },
  metalplate: {
    base: [110, 108, 104], seed: 79,
    fn(x, y, s) {
      const cells = 2;
      const cw = s / cells;
      const cx = (x % cw) / cw, cy = (y % cw) / cw;
      const edge = Math.min(cx, 1 - cx, cy, 1 - cy);
      const seam = edge < 0.022;
      // rivets near the panel corners
      const rx = Math.min(cx, 1 - cx), ry = Math.min(cy, 1 - cy);
      const rd = Math.hypot((rx - 0.07) * cw, (ry - 0.07) * cw);
      const rivet = rd < cw * 0.026;
      const streak = valueNoise(x / 2, y / 30, 79);
      const n = fbm(x, y, s, 79, 4, 9);
      if (seam) return { h: 0.12, c: [0.36, 0.35, 0.34], r: 0.85 };
      if (rivet) return { h: 0.95, c: [0.78 + n * 0.2, 0.76 + n * 0.2, 0.74 + n * 0.2], r: 0.36 };
      const v = 0.56 + streak * 0.22 + n * 0.22;
      return { h: 0.55 + n * 0.16, c: [v, v * 0.99, v * 0.95], r: 0.48 + n * 0.3 };
    }
  },
  wood: {
    base: [120, 88, 54], seed: 91,
    fn(x, y, s) {
      const grain = Math.sin((y / s) * 26 + fbm(x, y, s, 91, 3, 3) * 9);
      const g = (grain + 1) / 2;
      const fine = valueNoise(x / 1.2, y / 8, 91) * 0.18;
      const v = 0.5 + g * 0.32 + fine;
      return { h: 0.45 + g * 0.2, c: [v, v * 0.72, v * 0.48], r: 0.66 + (1 - g) * 0.22 };
    }
  },
  bone: {
    base: [206, 196, 174], seed: 103,
    fn(x, y, s) {
      const n = fbm(x, y, s, 103, 5, 6);
      const fis = ridged(x, y, s, 137, 3, 12);
      const crack = fis > 0.88 ? (fis - 0.88) / 0.12 : 0;
      const v = 0.82 + n * 0.24 - crack * 0.34;
      return { h: 0.55 + n * 0.3 - crack * 0.5, c: [v, v * 0.96, v * 0.86], r: 0.68 + n * 0.2 };
    }
  },
  dirt: {
    base: [86, 66, 48], seed: 113,
    fn(x, y, s) {
      const n = fbm(x, y, s, 113, 6, 7);
      const grit = valueNoise(x * 1.7, y * 1.7, 211) * 0.22;
      const v = 0.52 + n * 0.4 + grit;
      return { h: n * 0.9 + grit, c: [v, v * 0.79, v * 0.6], r: 0.94 };
    }
  },
  hide: {
    base: [104, 78, 56], seed: 127,
    fn(x, y, s) {
      const streak = valueNoise(x / 3, y / 1.3, 127);
      const n = fbm(x, y, s, 127, 4, 5);
      const v = 0.5 + n * 0.34 + streak * 0.24;
      return { h: 0.4 + streak * 0.4, c: [v, v * 0.77, v * 0.6], r: 0.86 + n * 0.12 };
    }
  },
  salt: {
    base: [196, 202, 200], seed: 139,
    fn(x, y, s) {
      const n = fbm(x, y, s, 139, 5, 6);
      const cr = ridged(x, y, s, 151, 4, 9);
      const sparkle = hash2(Math.floor(x), Math.floor(y), 7) > 0.987 ? 0.5 : 0;
      const crust = Math.pow(cr, 2.2);
      const v = 0.74 + n * 0.2 + crust * 0.28 + sparkle;
      return { h: 0.4 + crust * 0.55 + n * 0.2, c: [v, v * 1.01, v * 1.02], r: 0.62 - crust * 0.3 + n * 0.2 };
    }
  },
  saltwall: {
    base: [178, 186, 188], seed: 149,
    fn(x, y, s) {
      const drip = valueNoise(x / 2.2, y / 26, 149);
      const n = fbm(x, y, s, 149, 5, 5);
      const crust = Math.pow(ridged(x, y, s, 163, 3, 7), 2);
      const v = 0.66 + n * 0.24 + crust * 0.24 + drip * 0.12;
      return { h: 0.35 + crust * 0.5 + drip * 0.2, c: [v * 0.98, v, v * 1.03], r: 0.7 - crust * 0.28 };
    }
  },
  wetstone: {
    base: [96, 100, 106], seed: 173,
    fn(x, y, s) {
      const n = fbm(x, y, s, 173, 5, 5);
      const pool = n < 0.42 ? (0.42 - n) / 0.42 : 0;
      const v = 0.6 + n * 0.36 - pool * 0.3;
      return { h: n * 0.8, c: [v * 0.94, v * 0.98, v * 1.04], r: 0.62 - pool * 0.55 };
    }
  },
  moss: {
    base: [78, 96, 64], seed: 181,
    fn(x, y, s) {
      const st = fbm(x, y, s, 11, 5, 5);
      const m = fbm(x, y, s, 181, 5, 9);
      const cover = m > 0.48 ? Math.min(1, (m - 0.48) / 0.22) : 0;
      const sv = 0.66 + st * 0.34;
      const mv = 0.4 + m * 0.5;
      const v = sv * (1 - cover) + mv * cover;
      return {
        h: st * 0.7 + cover * 0.3,
        c: [v * (1 - cover * 0.45), v * (1 + cover * 0.12), v * (1 - cover * 0.55)],
        r: 0.8 + cover * 0.18
      };
    }
  },
  paper: {
    base: [214, 208, 192], seed: 193,
    fn(x, y, s) {
      const fiber = valueNoise(x * 2.2, y / 2.4, 193) * 0.5 + valueNoise(x / 2.4, y * 2.2, 197) * 0.5;
      const n = fbm(x, y, s, 193, 3, 6);
      const v = 0.82 + fiber * 0.16 + n * 0.1;
      return { h: 0.5 + fiber * 0.16, c: [v, v * 0.99, v * 0.94], r: 0.78 };
    }
  },
  glass: {
    base: [186, 200, 208], seed: 199,
    fn(x, y, s) {
      const smudge = fbm(x, y, s, 199, 3, 3);
      const v = 0.86 + smudge * 0.16;
      return { h: 0.5 + smudge * 0.05, c: [v * 0.94, v * 0.99, v], r: 0.1 + smudge * 0.22 };
    }
  }
};

// --------------------------------------------------------------- builder

function buildPack(type, size) {
  const spec = SPECS[type] || SPECS.stone;
  const n = size * size;
  const albedo = new Uint8ClampedArray(n * 4);
  const height = new Float32Array(n);
  const rough = new Uint8ClampedArray(n * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      const o = spec.fn(x, y, size);
      height[i] = o.h;
      const b = spec.base;
      albedo[i * 4 + 0] = b[0] * o.c[0];
      albedo[i * 4 + 1] = b[1] * o.c[1];
      albedo[i * 4 + 2] = b[2] * o.c[2];
      albedo[i * 4 + 3] = 255;
      const r = Math.max(0, Math.min(1, o.r)) * 255;
      rough[i * 4 + 0] = r; rough[i * 4 + 1] = r; rough[i * 4 + 2] = r; rough[i * 4 + 3] = 255;
    }
  }

  // Normalise the albedo to a consistent mid-bright detail map. The material's
  // own `color` carries the hue and value; without this the two multiply
  // together and every surface comes out nearly black.
  let mean = 0;
  for (let i = 0; i < n; i++) {
    mean += albedo[i * 4] * 0.2126 + albedo[i * 4 + 1] * 0.7152 + albedo[i * 4 + 2] * 0.0722;
  }
  mean /= n;
  if (mean > 1) {
    const gain = Math.min(3.2, 196 / mean);
    for (let i = 0; i < n; i++) {
      albedo[i * 4] *= gain;
      albedo[i * 4 + 1] *= gain;
      albedo[i * 4 + 2] *= gain;
    }
  }

  // Sobel the height field into a tangent-space normal map.
  const normal = new Uint8ClampedArray(n * 4);
  const strength = 2.6;
  const at = (x, y) => height[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x - 1, y - 1) + 2 * at(x - 1, y) + at(x - 1, y + 1))
               - (at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1));
      const dy = (at(x - 1, y - 1) + 2 * at(x, y - 1) + at(x + 1, y - 1))
               - (at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1));
      let nx = dx * strength, ny = dy * strength, nz = 1.0;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len; ny /= len; nz /= len;
      const i = (y * size + x) * 4;
      normal[i + 0] = (nx * 0.5 + 0.5) * 255;
      normal[i + 1] = (ny * 0.5 + 0.5) * 255;
      normal[i + 2] = (nz * 0.5 + 0.5) * 255;
      normal[i + 3] = 255;
    }
  }

  const map = dataTexture(albedo, size, THREE.SRGBColorSpace);
  const normalMap = dataTexture(normal, size, THREE.NoColorSpace);
  const roughnessMap = dataTexture(rough, size, THREE.NoColorSpace);
  return { map, normalMap, roughnessMap };
}

function dataTexture(data, size, colorSpace) {
  const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  t.colorSpace = colorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.magFilter = THREE.LinearFilter;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.generateMipmaps = true;
  t.anisotropy = anisotropyCap;
  t.needsUpdate = true;
  return t;
}

export function getPack(type, size) {
  const key = `${type}|${size}`;
  if (!cache.has(key)) cache.set(key, buildPack(type, size));
  return cache.get(key);
}

// Returns a fresh set of texture *clones* so each material can set its own repeat
// without fighting over the shared source.
export function texturesFor(type, size, repeat) {
  const pack = getPack(type, size);
  const out = {};
  for (const k of ['map', 'normalMap', 'roughnessMap']) {
    const t = pack[k].clone();
    t.needsUpdate = true;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat, repeat);
    t.anisotropy = anisotropyCap;
    out[k] = t;
  }
  return out;
}

export function clearCache() {
  for (const pack of cache.values()) {
    for (const t of Object.values(pack)) t.dispose();
  }
  cache.clear();
}

export const TEXTURE_TYPES = Object.keys(SPECS);

// A soft round sprite so particle systems render as motes rather than squares.
let _pointSprite = null;
export function pointSprite() {
  if (_pointSprite) return _pointSprite;
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0.0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.65)');
  g.addColorStop(0.75, 'rgba(255,255,255,0.12)');
  g.addColorStop(1.0, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  _pointSprite = new THREE.CanvasTexture(c);
  _pointSprite.colorSpace = THREE.SRGBColorSpace;
  _pointSprite.minFilter = THREE.LinearFilter;
  _pointSprite.needsUpdate = true;
  return _pointSprite;
}
