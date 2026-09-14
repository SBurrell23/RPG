// Per-floor visual identity: palette, lighting plan, atmosphere, materials.
// Everything the renderer needs to make a floor feel like a different place.
//
// Colour discipline: each theme has ONE dominant hue in the fog/ambient, ONE
// complementary accent used by lights and emissives, and keeps materials
// desaturated so the lights do the talking.

const THEMES = {
  // ---------------------------------------------------------------- floor 1
  salt: {
    name: 'Salt',
    fog: { color: 0x0b1a20, near: 6, far: 62, density: 0.026 },
    ambient: { color: 0x24404c, intensity: 0.45 },
    hemi: { sky: 0x4f7a88, ground: 0x1c1712, intensity: 0.74 },
    accent: 0x9fe4ff,
    accent2: 0xffd9a0,
    materials: {
      floor: { color: 0x8d928c, roughness: 0.88, metalness: 0.02, tex: 'salt', scale: 3 },
      wall: { color: 0x7f867f, roughness: 0.94, metalness: 0.0, tex: 'saltwall', scale: 2 },
      ceiling: { color: 0x4c534f, roughness: 0.98, metalness: 0.0, tex: 'rough', scale: 2 },
      trim: { color: 0x3b4247, roughness: 0.6, metalness: 0.35, tex: 'metal', scale: 1 }
    },
    lightPlan: {
      style: 'sconce',           // sconce | pendant | floor | volume | none
      color: 0xffc98a,
      intensity: 3.2,
      distance: 17,
      flicker: 0.20,
      height: 2.6,
      fill: { color: 0x3d6b80, intensity: 0.35 }   // cool bounce from the salt
    },
    particles: { kind: 'dust', color: 0xcfe8f0, count: 140, drift: 0.05, size: 0.045 },
    exposure: 1.0,
    bloom: { strength: 0.34, radius: 0.7, threshold: 1.15 },
    doorColor: 0x5e6a70,
    ambientLoop: 'wind'
  },

  // ---------------------------------------------------------------- floor 2
  warren: {
    name: 'Warren',
    fog: { color: 0x1a0f08, near: 3, far: 40, density: 0.055 },
    ambient: { color: 0x42230f, intensity: 0.42 },
    hemi: { sky: 0x6b3a18, ground: 0x140c06, intensity: 0.57 },
    accent: 0xffa53c,
    accent2: 0xd4644a,
    materials: {
      floor: { color: 0x4a382a, roughness: 0.96, metalness: 0.0, tex: 'dirt', scale: 4 },
      wall: { color: 0x53402f, roughness: 0.92, metalness: 0.0, tex: 'hide', scale: 2.5 },
      ceiling: { color: 0x2c2018, roughness: 1.0, metalness: 0.0, tex: 'dirt', scale: 3 },
      trim: { color: 0x6a5844, roughness: 0.7, metalness: 0.1, tex: 'bone', scale: 1 }
    },
    lightPlan: {
      style: 'floor',
      color: 0xff8b32,
      intensity: 3.6,
      distance: 13,
      flicker: 0.42,
      height: 0.7,
      fill: { color: 0x5a2a12, intensity: 0.38 }
    },
    particles: { kind: 'embers', color: 0xffb05a, count: 110, drift: 0.10, size: 0.05 },
    exposure: 1.0,
    bloom: { strength: 0.44, radius: 0.75, threshold: 1.05 },
    doorColor: 0x6b503a,
    ambientLoop: 'breath'
  },

  // ---------------------------------------------------------------- floor 3
  archive: {
    name: 'Archive',
    fog: { color: 0x061a19, near: 4, far: 48, density: 0.042 },
    ambient: { color: 0x14464a, intensity: 0.51 },
    hemi: { sky: 0x2f7d76, ground: 0x07100f, intensity: 0.68 },
    accent: 0x6fe8d4,
    accent2: 0xbfe8a0,
    materials: {
      floor: { color: 0x4a5a58, roughness: 0.5, metalness: 0.05, tex: 'tile', scale: 3 },
      wall: { color: 0x3f5250, roughness: 0.85, metalness: 0.0, tex: 'stone', scale: 2 },
      ceiling: { color: 0x223432, roughness: 0.95, metalness: 0.0, tex: 'stone', scale: 2 },
      trim: { color: 0x6d5a3a, roughness: 0.55, metalness: 0.4, tex: 'metal', scale: 1 }
    },
    lightPlan: {
      style: 'pendant',
      color: 0x7ff0dc,
      intensity: 2.8,
      distance: 18,
      flicker: 0.08,
      height: 4.2,
      fill: { color: 0x1d5c58, intensity: 0.42 }
    },
    particles: { kind: 'motes', color: 0x9ff4e2, count: 170, drift: -0.04, size: 0.05 },
    exposure: 1.0,
    bloom: { strength: 0.42, radius: 0.8, threshold: 1.08 },
    doorColor: 0x7a6338,
    ambientLoop: 'water',
    causticColor: 0x6fe8d4
  },

  // ---------------------------------------------------------------- floor 4
  foundry: {
    name: 'Foundry',
    fog: { color: 0x180804, near: 3, far: 44, density: 0.05 },
    ambient: { color: 0x4a1d08, intensity: 0.39 },
    hemi: { sky: 0x7a2f0c, ground: 0x120703, intensity: 0.51 },
    accent: 0xff6a1e,
    accent2: 0xffd24a,
    materials: {
      floor: { color: 0x3a3430, roughness: 0.82, metalness: 0.12, tex: 'metalplate', scale: 3 },
      wall: { color: 0x4a3b32, roughness: 0.78, metalness: 0.12, tex: 'brick', scale: 2 },
      ceiling: { color: 0x231a16, roughness: 0.9, metalness: 0.1, tex: 'metalplate', scale: 2 },
      trim: { color: 0x8a5a2a, roughness: 0.45, metalness: 0.75, tex: 'metal', scale: 1 }
    },
    lightPlan: {
      style: 'volume',
      color: 0xff5a14,
      intensity: 4.4,
      distance: 20,
      flicker: 0.30,
      height: 1.2,
      fill: { color: 0x7a2a08, intensity: 0.5 }
    },
    particles: { kind: 'embers', color: 0xffb25a, count: 200, drift: 0.22, size: 0.055 },
    exposure: 0.95,
    bloom: { strength: 0.48, radius: 0.75, threshold: 1.05 },
    doorColor: 0x7a5030,
    ambientLoop: 'forge'
  },

  // ---------------------------------------------------------------- floor 5
  garden: {
    name: 'Garden',
    fog: { color: 0x0d0620, near: 5, far: 55, density: 0.036 },
    ambient: { color: 0x2a1a4c, intensity: 0.48 },
    hemi: { sky: 0x4b3a86, ground: 0x0a1a14, intensity: 0.70 },
    accent: 0xb17aff,
    accent2: 0x5cffc0,
    materials: {
      floor: { color: 0x3a4438, roughness: 0.95, metalness: 0.0, tex: 'moss', scale: 4 },
      wall: { color: 0x33384a, roughness: 0.9, metalness: 0.0, tex: 'stone', scale: 2 },
      ceiling: { color: 0x20263a, roughness: 0.35, metalness: 0.0, tex: 'glass', scale: 3 },
      trim: { color: 0x5c6a4a, roughness: 0.7, metalness: 0.15, tex: 'wood', scale: 1 }
    },
    lightPlan: {
      style: 'volume',
      color: 0x8a5cff,
      intensity: 2.6,
      distance: 19,
      flicker: 0.06,
      height: 3.0,
      fill: { color: 0x2c6b58, intensity: 0.48 }
    },
    particles: { kind: 'spores', color: 0x8fffd0, count: 260, drift: 0.03, size: 0.07 },
    exposure: 1.0,
    bloom: { strength: 0.46, radius: 0.8, threshold: 1.08 },
    doorColor: 0x4a5a48,
    ambientLoop: 'garden'
  },

  // ---------------------------------------------------------------- floor 6
  clockwork: {
    name: 'Clockwork',
    fog: { color: 0x0e1216, near: 6, far: 58, density: 0.028 },
    ambient: { color: 0x2c3640, intensity: 0.54 },
    hemi: { sky: 0x6e7f90, ground: 0x1c1a16, intensity: 0.81 },
    accent: 0xd8e8f4,
    accent2: 0xe0b45c,
    materials: {
      floor: { color: 0x5a5348, roughness: 0.55, metalness: 0.12, tex: 'metalplate', scale: 3 },
      wall: { color: 0x4e4a44, roughness: 0.6, metalness: 0.12, tex: 'metal', scale: 2 },
      ceiling: { color: 0x2e2c28, roughness: 0.7, metalness: 0.3, tex: 'metalplate', scale: 2 },
      trim: { color: 0xb08a3c, roughness: 0.34, metalness: 0.92, tex: 'metal', scale: 1 }
    },
    lightPlan: {
      style: 'pendant',
      color: 0xeaf4ff,
      intensity: 3.0,
      distance: 20,
      flicker: 0.02,
      height: 4.6,
      fill: { color: 0x3a4a58, intensity: 0.4 }
    },
    particles: { kind: 'dust', color: 0xd8e0e8, count: 120, drift: 0.02, size: 0.04 },
    exposure: 1.0,
    bloom: { strength: 0.36, radius: 0.6, threshold: 1.2 },
    doorColor: 0x8a6f38,
    ambientLoop: 'clock'
  },

  // ---------------------------------------------------------------- floor 7
  choir: {
    name: 'Choir',
    fog: { color: 0x0a1220, near: 5, far: 50, density: 0.034 },
    ambient: { color: 0x24344e, intensity: 0.57 },
    hemi: { sky: 0x5a78a8, ground: 0x141824, intensity: 0.78 },
    accent: 0xbfe4ff,
    accent2: 0xfff0c8,
    materials: {
      floor: { color: 0x5e6472, roughness: 0.45, metalness: 0.1, tex: 'tile', scale: 3 },
      wall: { color: 0xa8a89c, roughness: 0.7, metalness: 0.0, tex: 'paper', scale: 2 },
      ceiling: { color: 0x343c4c, roughness: 0.8, metalness: 0.0, tex: 'stone', scale: 2 },
      trim: { color: 0xc0c8d4, roughness: 0.34, metalness: 0.85, tex: 'metal', scale: 1 }
    },
    lightPlan: {
      style: 'sconce',
      color: 0xcfe8ff,
      intensity: 2.6,
      distance: 17,
      flicker: 0.10,
      height: 3.1,
      fill: { color: 0x3c5878, intensity: 0.45 }
    },
    particles: { kind: 'motes', color: 0xdfefff, count: 150, drift: 0.015, size: 0.04 },
    exposure: 1.0,
    bloom: { strength: 0.42, radius: 0.85, threshold: 1.1 },
    doorColor: 0x8c94a4,
    ambientLoop: 'choir',
    translucentWalls: true
  },

  // ---------------------------------------------------------------- floor 8
  ossuary: {
    name: 'Ossuary',
    fog: { color: 0x100a18, near: 5, far: 54, density: 0.033 },
    ambient: { color: 0x2e2044, intensity: 0.42 },
    hemi: { sky: 0x5a4080, ground: 0x181220, intensity: 0.62 },
    accent: 0xc89cff,
    accent2: 0xfff4d8,
    materials: {
      floor: { color: 0x4c4654, roughness: 0.6, metalness: 0.05, tex: 'tile', scale: 3 },
      wall: { color: 0xa79c88, roughness: 0.82, metalness: 0.0, tex: 'bone', scale: 2 },
      ceiling: { color: 0x2a2434, roughness: 0.9, metalness: 0.0, tex: 'bone', scale: 2.5 },
      trim: { color: 0x6a5c80, roughness: 0.4, metalness: 0.5, tex: 'metal', scale: 1 }
    },
    lightPlan: {
      style: 'sconce',
      color: 0xfff0cc,
      intensity: 2.4,
      distance: 15,
      flicker: 0.26,
      height: 3.4,
      fill: { color: 0x53386e, intensity: 0.44 }
    },
    particles: { kind: 'dust', color: 0xe8dcc8, count: 130, drift: -0.02, size: 0.045 },
    exposure: 1.0,
    bloom: { strength: 0.44, radius: 0.82, threshold: 1.05 },
    doorColor: 0x6c5c44,
    ambientLoop: 'ossuary'
  },

  // ---------------------------------------------------------------- floor 9
  storm: {
    name: 'Storm',
    fog: { color: 0x141a26, near: 8, far: 70, density: 0.022 },
    ambient: { color: 0x2c3a52, intensity: 0.51 },
    hemi: { sky: 0x44587a, ground: 0x1a1e24, intensity: 1.01 },
    accent: 0x9fc0ff,
    accent2: 0xfff4b0,
    materials: {
      floor: { color: 0x555b62, roughness: 0.42, metalness: 0.08, tex: 'wetstone', scale: 3 },
      wall: { color: 0x4c525a, roughness: 0.7, metalness: 0.03, tex: 'stone', scale: 2 },
      ceiling: { color: 0x2a303a, roughness: 0.9, metalness: 0.0, tex: 'stone', scale: 2 },
      trim: { color: 0x3e4650, roughness: 0.5, metalness: 0.5, tex: 'metal', scale: 1 }
    },
    lightPlan: {
      style: 'none',
      color: 0xaac4ff,
      intensity: 1.6,
      distance: 22,
      flicker: 0.0,
      height: 5.0,
      fill: { color: 0x35496e, intensity: 0.6 }
    },
    particles: { kind: 'rain', color: 0xaec6e0, count: 900, drift: 0, size: 0.03 },
    exposure: 1.0,
    bloom: { strength: 0.38, radius: 0.7, threshold: 1.15 },
    doorColor: 0x4a525c,
    ambientLoop: 'storm',
    openSky: true,
    lightning: true
  },

  // --------------------------------------------------------------- floor 10
  cadence: {
    name: 'Cadence',
    fog: { color: 0x06050a, near: 6, far: 60, density: 0.030 },
    ambient: { color: 0x3a2e18, intensity: 0.36 },
    hemi: { sky: 0x6a5426, ground: 0x0a0810, intensity: 0.54 },
    accent: 0xffc860,
    accent2: 0x8fd8ff,
    materials: {
      floor: { color: 0x2a2620, roughness: 0.42, metalness: 0.12, tex: 'marble', scale: 4 },
      wall: { color: 0x1e1a16, roughness: 0.6, metalness: 0.12, tex: 'marble', scale: 3 },
      ceiling: { color: 0x0a0810, roughness: 1.0, metalness: 0.0, tex: 'rough', scale: 2 },
      trim: { color: 0xd4a848, roughness: 0.34, metalness: 0.95, tex: 'metal', scale: 1 }
    },
    lightPlan: {
      style: 'volume',
      color: 0xffb84a,
      intensity: 3.4,
      distance: 22,
      flicker: 0.05,
      height: 2.2,
      fill: { color: 0x2a3a52, intensity: 0.3 }
    },
    particles: { kind: 'motes', color: 0xffd88a, count: 220, drift: -0.03, size: 0.055 },
    exposure: 0.92,
    bloom: { strength: 0.40, radius: 0.72, threshold: 1.25 },
    doorColor: 0xb08a3c,
    ambientLoop: 'cadence'
  }
};

// Rooms of certain kinds get a light accent on top of the theme plan.
export const KIND_ACCENTS = {
  entry:   { color: 0xffffff, intensity: 0.0 },
  shrine:  { color: 0xfff0c0, intensity: 2.4, height: 1.6 },
  shop:    { color: 0xffca70, intensity: 2.0, height: 2.2 },
  vault:   { color: 0xffd24a, intensity: 2.6, height: 2.0 },
  exit:    { color: 0x9fe4ff, intensity: 3.0, height: 1.2 },
  deadend: { color: 0x8a2a2a, intensity: 1.1, height: 2.0 }
};

export function getTheme(key) {
  return THEMES[key] || THEMES.salt;
}

export default THEMES;
