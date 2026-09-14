// Turns an authored room graph into physical space.
//
// Story files declare rooms and which rooms they connect to; they never declare
// coordinates. This module assigns every room a cell in a layered grid (column =
// distance from the entry, row = position within that layer, ordered to minimise
// crossings), then routes each connection as a corridor using A* over a coarse
// grid in which room cells are solid and the gaps between them are open lanes.
// The result is deterministic: the same floor file always produces the same dungeon.

export const SIZES = {
  tiny:   { w: 8,  d: 8,  h: 4.5 },
  small:  { w: 12, d: 12, h: 5.0 },
  medium: { w: 17, d: 17, h: 6.0 },
  large:  { w: 24, d: 24, h: 8.0 },
  grand:  { w: 34, d: 34, h: 12.0 },
  hall:   { w: 30, d: 14, h: 7.0 },
  vault:  { w: 17, d: 17, h: 12.0 }
};

export const CORRIDOR = { width: 4.6, height: 4.4 };
export const DOORWAY = { width: 3.4, height: 3.7 };
const GAP = 15;          // lane width between columns/rows

export function sizeOf(room) {
  return SIZES[room.size] || SIZES.medium;
}

// --------------------------------------------------------------------------

export function buildLayout(floor) {
  const rooms = floor.rooms;
  const byId = new Map(rooms.map((r) => [r.id, r]));

  // 1. undirected adjacency from authored doors ------------------------------
  const edges = [];
  const adj = new Map(rooms.map((r) => [r.id, []]));
  const seen = new Set();
  for (const r of rooms) {
    for (const d of r.doors || []) {
      if (!byId.has(d.to) || d.to === r.id) continue;
      const key = [r.id, d.to].sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ key, a: r.id, b: d.to, locked: !!d.locked, secret: !!d.secret, label: d.label || null });
      adj.get(r.id).push(d.to);
      adj.get(d.to).push(r.id);
    }
  }

  // 2. column = BFS depth from the entry -------------------------------------
  const col = new Map([[floor.entry, 0]]);
  const queue = [floor.entry];
  while (queue.length) {
    const id = queue.shift();
    for (const n of adj.get(id) || []) {
      if (!col.has(n)) { col.set(n, col.get(id) + 1); queue.push(n); }
    }
  }
  let maxCol = Math.max(0, ...col.values());
  for (const r of rooms) if (!col.has(r.id)) col.set(r.id, ++maxCol);
  maxCol = Math.max(...col.values());

  const columns = Array.from({ length: maxCol + 1 }, () => []);
  for (const r of rooms) columns[col.get(r.id)].push(r.id);

  // 3. rows, ordered by barycentre to keep corridors from tangling ------------
  const rowCount = Math.max(1, Math.max(1, ...columns.map((c) => c.length)) * 2 - 1);
  const row = new Map();
  const spread = (ids) => {
    const m = ids.length;
    ids.forEach((id, i) => {
      row.set(id, m === 1 ? Math.floor((rowCount - 1) / 2) : Math.round((i + 0.5) * rowCount / m - 0.5));
    });
  };
  columns.forEach(spread);

  for (let pass = 0; pass < 8; pass++) {
    const order = columns.map((_, i) => (pass % 2 === 0 ? i : columns.length - 1 - i));
    for (const ci of order) {
      const ids = columns[ci];
      if (ids.length < 2) continue;
      const bary = new Map();
      for (const id of ids) {
        const ns = (adj.get(id) || []).filter((n) => col.get(n) !== ci);
        bary.set(id, ns.length ? ns.reduce((s, n) => s + (row.get(n) ?? 0), 0) / ns.length : (row.get(id) ?? 0));
      }
      ids.sort((a, b) => (bary.get(a) - bary.get(b)) || a.localeCompare(b));
      spread(ids);
    }
  }

  // de-collide rows within each column
  for (const ids of columns) {
    const used = new Set();
    for (const id of ids) {
      let r = row.get(id);
      while (used.has(r)) r++;
      used.add(r);
      row.set(id, r);
    }
  }
  const maxRow = Math.max(0, ...row.values());

  // 4. world coordinates: a non-uniform grid sized to the rooms present -------
  const colWidth = columns.map((ids) => Math.max(10, ...ids.map((id) => sizeOf(byId.get(id)).w)));
  const rowDepth = [];
  for (let r = 0; r <= maxRow; r++) {
    const here = rooms.filter((x) => row.get(x.id) === r);
    rowDepth.push(Math.max(10, ...here.map((x) => sizeOf(x).d)));
  }

  const laneX = [], colX = [];
  let cur = 0;
  for (let i = 0; i < colWidth.length; i++) {
    laneX.push(cur + GAP / 2); cur += GAP;
    colX.push(cur + colWidth[i] / 2); cur += colWidth[i];
  }
  laneX.push(cur + GAP / 2);

  const laneZ = [], rowZ = [];
  cur = 0;
  for (let i = 0; i < rowDepth.length; i++) {
    laneZ.push(cur + GAP / 2); cur += GAP;
    rowZ.push(cur + rowDepth[i] / 2); cur += rowDepth[i];
  }
  laneZ.push(cur + GAP / 2);

  const gw = colWidth.length * 2 + 1;
  const gh = rowDepth.length * 2 + 1;
  const worldX = (gx) => (gx % 2 === 1 ? colX[(gx - 1) / 2] : laneX[gx / 2]);
  const worldZ = (gz) => (gz % 2 === 1 ? rowZ[(gz - 1) / 2] : laneZ[gz / 2]);
  const cx = (laneX[laneX.length - 1] + laneX[0]) / 2;
  const cz = (laneZ[laneZ.length - 1] + laneZ[0]) / 2;

  const placed = new Map();
  for (const r of rooms) {
    const s = sizeOf(r);
    const gx = col.get(r.id) * 2 + 1;
    const gz = row.get(r.id) * 2 + 1;
    placed.set(r.id, {
      room: r, id: r.id,
      col: col.get(r.id), row: row.get(r.id), gx, gz,
      x: worldX(gx) - cx, z: worldZ(gz) - cz,
      w: s.w, d: s.d, h: s.h
    });
  }

  // 5. corridor routing ------------------------------------------------------
  const blocked = new Set();
  for (const p of placed.values()) blocked.add(p.gx + ',' + p.gz);

  const traffic = new Map();                       // lane wear spreads parallel runs apart
  const usedExits = new Map(rooms.map((r) => [r.id, new Set()]));  // one doorway per connection

  // Route short connections first so the obvious ones get the clean lanes.
  const ordered = edges.slice().sort((e1, e2) => {
    const d = (e) => {
      const A = placed.get(e.a), B = placed.get(e.b);
      return Math.abs(A.gx - B.gx) + Math.abs(A.gz - B.gz);
    };
    return d(e1) - d(e2);
  });

  const corridors = [];
  for (const e of ordered) {
    const A = placed.get(e.a), B = placed.get(e.b);
    if (!A || !B) continue;
    let path = astar(A, B, gw, gh, blocked, traffic, usedExits.get(A.id), usedExits.get(B.id));
    if (!path) path = astar(A, B, gw, gh, blocked, traffic, null, null);   // >4 connections: share a doorway
    if (!path || path.length < 2) continue;

    usedExits.get(A.id).add(path[1]);
    usedExits.get(B.id).add(path[path.length - 2]);
    for (const c of path) traffic.set(c, (traffic.get(c) || 0) + 1);

    const pts = path.map((c) => {
      const [gx, gz] = c.split(',').map(Number);
      return { x: worldX(gx) - cx, z: worldZ(gz) - cz };
    });

    const doorA = wallSide(A, pts[1]);
    const doorB = wallSide(B, pts[pts.length - 2]);
    pts[0] = wallPoint(A, doorA);
    pts[pts.length - 1] = wallPoint(B, doorB);

    corridors.push({
      key: e.key, a: e.a, b: e.b, locked: e.locked, secret: e.secret, label: e.label,
      points: pts,
      segments: toSegments(pts),
      doorA: { room: A.id, side: doorA, ...wallPoint(A, doorA) },
      doorB: { room: B.id, side: doorB, ...wallPoint(B, doorB) }
    });
  }

  return {
    floor,
    rooms: placed,
    corridors,
    edges,
    adjacency: adj,
    depth: col,
    bounds: {
      minX: laneX[0] - cx, maxX: laneX[laneX.length - 1] - cx,
      minZ: laneZ[0] - cz, maxZ: laneZ[laneZ.length - 1] - cz
    },
    doorway: DOORWAY
  };
}

// --------------------------------------------------------------------------

function astar(A, B, gw, gh, blocked, traffic, banFirst, banLast) {
  const start = A.gx + ',' + A.gz;
  const goal = B.gx + ',' + B.gz;
  if (start === goal) return null;
  const h = (gx, gz) => Math.abs(gx - B.gx) + Math.abs(gz - B.gz);
  const open = [{ k: start, gx: A.gx, gz: A.gz, g: 0, f: h(A.gx, A.gz), prev: null }];
  const came = new Map();
  const best = new Map([[start, 0]]);

  while (open.length) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) if (open[i].f < open[bi].f) bi = i;
    const cur = open.splice(bi, 1)[0];

    if (cur.k === goal) {
      const out = [cur.k];
      let k = cur.k;
      while (came.has(k)) { k = came.get(k); out.unshift(k); }
      return out;
    }

    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cur.gx + dx, nz = cur.gz + dz;
      if (nx < 0 || nz < 0 || nx >= gw || nz >= gh) continue;
      const nk = nx + ',' + nz;
      if (nk !== goal && blocked.has(nk)) continue;
      if (cur.k === start && banFirst && banFirst.has(nk)) continue;
      if (nk === goal && banLast && banLast.has(cur.k)) continue;
      const wear = (traffic.get(nk) || 0) * 0.9;
      const turn = cur.prev ? turnCost(cur.prev, cur.k, nk) : 0;
      const g = cur.g + 1 + wear + turn;
      if (g >= (best.get(nk) ?? Infinity)) continue;
      best.set(nk, g);
      came.set(nk, cur.k);
      open.push({ k: nk, gx: nx, gz: nz, g, f: g + h(nx, nz), prev: cur.k });
    }
  }
  return null;
}

function turnCost(prev, cur, next) {
  const [px, pz] = prev.split(',').map(Number);
  const [ax, az] = cur.split(',').map(Number);
  const [nx, nz] = next.split(',').map(Number);
  return (ax - px) === (nx - ax) && (az - pz) === (nz - az) ? 0 : 0.7;
}

// Collapse the routed polyline into axis-aligned corridor boxes.
function toSegments(pts) {
  const half = CORRIDOR.width / 2;
  const segments = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const dx = Math.abs(b.x - a.x), dz = Math.abs(b.z - a.z);
    if (dx < 0.01 && dz < 0.01) continue;
    const minX = Math.min(a.x, b.x), maxX = Math.max(a.x, b.x);
    const minZ = Math.min(a.z, b.z), maxZ = Math.max(a.z, b.z);
    segments.push(dx > dz
      ? { minX, maxX, minZ: minZ - half, maxZ: maxZ + half, horizontal: true }
      : { minX: minX - half, maxX: maxX + half, minZ, maxZ, horizontal: false });
  }
  return segments;
}

function wallSide(room, toward) {
  const dx = toward.x - room.x, dz = toward.z - room.z;
  return Math.abs(dx) > Math.abs(dz) ? (dx > 0 ? 'east' : 'west') : (dz > 0 ? 'south' : 'north');
}

function wallPoint(room, side) {
  switch (side) {
    case 'east':  return { x: room.x + room.w / 2, z: room.z };
    case 'west':  return { x: room.x - room.w / 2, z: room.z };
    case 'south': return { x: room.x, z: room.z + room.d / 2 };
    default:      return { x: room.x, z: room.z - room.d / 2 };
  }
}
