// Lazy floor registry. Floors are imported only when the player reaches them,
// so the title screen doesn't wait on ten story files.

const LOADERS = {
  1: () => import('./floor1.js'),
  2: () => import('./floor2.js'),
  3: () => import('./floor3.js'),
  4: () => import('./floor4.js'),
  5: () => import('./floor5.js'),
  6: () => import('./floor6.js'),
  7: () => import('./floor7.js'),
  8: () => import('./floor8.js'),
  9: () => import('./floor9.js'),
  10: () => import('./floor10.js')
};

export const FLOOR_COUNT = 10;

const cache = new Map();

export async function loadFloor(n) {
  if (cache.has(n)) return cache.get(n);
  const loader = LOADERS[n];
  if (!loader) throw new Error('No such floor: ' + n);
  const mod = await loader();
  const floor = mod.default;
  cache.set(n, floor);
  return floor;
}

export async function loadAllFloors() {
  const out = [];
  for (let i = 1; i <= FLOOR_COUNT; i++) {
    try { out.push(await loadFloor(i)); }
    catch (e) { console.warn('floor ' + i + ' failed to load', e); }
  }
  return out;
}
