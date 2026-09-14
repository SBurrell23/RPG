// Assembles a floor: room shells with doorways cut where corridors meet them,
// corridors with proper corner junctions, doors, the lighting rig, props, NPCs,
// and the collision set. One instance per floor; dispose() puts it all back.

import * as THREE from 'three';
import { buildLayout, CORRIDOR, DOORWAY } from './layout.js';
import { MaterialSet } from './materials.js';
import { buildProps, makeRng } from './props.js';
import { createNpc } from './npc.js';
import { KIND_ACCENTS } from '../data/themes.js';
import { LightPool } from './lightpool.js';
import * as Settings from '../engine/settings.js';
import { pointSprite } from '../engine/textures.js';

const WALL_T = 0.5;
const PLAYER_R = 0.42;

// three.js uses physical light units (candela) by default since r155, so the
// intensities the themes express in "how bright should this feel" terms are
// scaled up into something a point light with quadratic decay can actually do.
const LIGHT_SCALE = 8;

export class FloorWorld {
  constructor(floor, theme, scene) {
    this.floor = floor;
    this.theme = theme;
    this.scene = scene;
    this.layout = buildLayout(floor);
    this.mats = new MaterialSet(theme);

    this.root = new THREE.Group();
    this.root.name = 'floor-' + floor.id;
    scene.add(this.root);

    this.roomGroups = new Map();      // roomId -> { group, lights, animated, npc, colliders }
    this.corridorGroups = new Map();  // key    -> { group, lights, animated, colliders, door meshes }
    this.doors = new Map();           // key    -> { locked, meshes[], colliders[], opened }
    this.colliders = [];              // active AABBs
    this.animated = [];
    // Light *descriptors*, not lights. The pool below owns the only real
    // PointLights in the scene; see lightpool.js.
    this.lightDescs = [];
    this.pool = new LightPool(scene, {
      count: Settings.maxDynamicLights(),
      shadowCount: Settings.maxShadowLights(),
      shadowMapSize: Settings.shadowMapSize()
    });
    this._cands = [];
    this._selectIn = 0;
    this._pickToken = 0;
    this.shadowsDirty = true;
    this.npcs = new Map();
    this.disposables = [];
    this.surfaceByRoom = new Map();

    this.buildRooms();
    this.buildCorridors();
    this.buildAtmosphere();
    this.rebuildColliders();
  }

  // Records a light without creating one. `owner` is the room id or corridor
  // key whose visibility gates it.
  addLightDesc({ x, y, z, color, intensity, distance, flicker = 0, owner, isCorridor = false, shadowWorthy }) {
    const d = {
      x, y, z,
      color: new THREE.Color(color),
      base: intensity,
      distance,
      flicker,
      owner, isCorridor,
      shadowWorthy: shadowWorthy !== undefined ? shadowWorthy : intensity > 1.2 * LIGHT_SCALE,
      seed: this.lightDescs.length * 1.7,
      dist: 0, pick: 0
    };
    this.lightDescs.push(d);
    return d;
  }

  // ------------------------------------------------------------------ rooms

  buildRooms() {
    for (const placed of this.layout.rooms.values()) {
      const room = placed.room;
      const g = new THREE.Group();
      g.position.set(placed.x, 0, placed.z);
      const entry = { group: g, lights: [], animated: [], colliders: [], placed, npc: null };
      this.roomGroups.set(room.id, entry);

      const openSky = !!this.theme.openSky;

      // floor slab
      const fl = new THREE.Mesh(
        tileUv(new THREE.BoxGeometry(placed.w, 0.4, placed.d), this.mats.floor, placed.w, placed.d),
        this.mats.floor);
      fl.position.y = -0.2;
      fl.receiveShadow = true;
      g.add(fl);
      this.disposables.push(fl.geometry);

      // ceiling
      if (!openSky) {
        const cl = new THREE.Mesh(
          tileUv(new THREE.BoxGeometry(placed.w, 0.4, placed.d), this.mats.ceiling, placed.w, placed.d),
          this.mats.ceiling);
        cl.position.y = placed.h + 0.2;
        cl.receiveShadow = true;
        g.add(cl);
        this.disposables.push(cl.geometry);
      }

      // walls, with a gap wherever a corridor arrives
      const gaps = { north: [], south: [], east: [], west: [] };
      for (const c of this.layout.corridors) {
        for (const d of [c.doorA, c.doorB]) {
          if (d.room !== room.id) continue;
          const along = (d.side === 'north' || d.side === 'south') ? d.x - placed.x : d.z - placed.z;
          gaps[d.side].push(along);
        }
      }

      const hw = placed.w / 2, hd = placed.d / 2;
      this.wallRun(g, entry, 'x', -hd - WALL_T / 2, -hw, hw, placed.h, gaps.north, placed.w);
      this.wallRun(g, entry, 'x', hd + WALL_T / 2, -hw, hw, placed.h, gaps.south, placed.w);
      this.wallRun(g, entry, 'z', -hw - WALL_T / 2, -hd, hd, placed.h, gaps.west, placed.d);
      this.wallRun(g, entry, 'z', hw + WALL_T / 2, -hd, hd, placed.h, gaps.east, placed.d);

      // lighting rig
      this.lightRoom(entry, placed);

      // props
      const doorways = [];
      for (const c of this.layout.corridors) {
        for (const d of [c.doorA, c.doorB]) {
          if (d.room === room.id) doorways.push({ x: d.x - placed.x, z: d.z - placed.z, side: d.side });
        }
      }

      const ctx = {
        room: placed, mats: this.mats, theme: this.theme,
        rng: makeRng(room.id + '|props'),
        lights: [], animated: [], disposables: this.disposables, colliders: [],
        doorways, surface: null
      };
      const props = buildProps(room.props, ctx);
      g.add(props);
      for (const l of ctx.lights) {
        this.addLightDesc({
          x: placed.x + l.x, y: l.y, z: placed.z + l.z,
          color: l.color, intensity: l.intensity, distance: l.distance,
          flicker: l.flicker, owner: room.id
        });
      }
      for (const a of ctx.animated) entry.animated.push(a);
      for (const c of ctx.colliders) {
        entry.colliders.push({
          minX: placed.x + c.minX, maxX: placed.x + c.maxX,
          minZ: placed.z + c.minZ, maxZ: placed.z + c.maxZ
        });
      }
      this.surfaceByRoom.set(room.id, ctx.surface || this.defaultSurface());

      // NPC
      if (room.npc) {
        const npc = createNpc(room.npc, this.theme);
        npc.group.position.set(0, 0, -placed.d * 0.16);
        npc.group.rotation.y = Math.PI;
        g.add(npc.group);
        entry.npc = npc;
        this.npcs.set(room.id, npc);
        entry.animated.push(npc.update);
        this.addLightDesc({
          x: placed.x + 1.6, y: 2.6, z: placed.z - placed.d * 0.16 + 1.8,
          color: this.theme.accent2, intensity: 1.5 * LIGHT_SCALE, distance: 9,
          owner: room.id
        });
        // the figure's own glow, so they read against the dark
        this.addLightDesc({
          x: placed.x, y: 1.5, z: placed.z - placed.d * 0.16,
          color: npc.glowColor, intensity: 1.0 * LIGHT_SCALE, distance: 7.5,
          owner: room.id, shadowWorthy: false
        });
      }

      this.root.add(g);
    }
  }

  // Builds one side of a room: solid pieces between the doorway gaps, plus lintels.
  wallRun(group, entry, axis, fixed, from, to, height, gaps, span) {
    const half = DOORWAY.width / 2;
    const sorted = gaps.slice().sort((a, b) => a - b);
    const pieces = [];
    let cursor = from;
    for (const gpos of sorted) {
      const a = Math.max(from, gpos - half);
      const b = Math.min(to, gpos + half);
      if (a > cursor) pieces.push([cursor, a]);
      cursor = Math.max(cursor, b);
      // lintel above the doorway
      if (height > DOORWAY.height + 0.05) {
        this.wallBox(group, entry, axis, fixed, a, b, DOORWAY.height, height, false);
      }
    }
    if (cursor < to) pieces.push([cursor, to]);
    for (const [a, b] of pieces) this.wallBox(group, entry, axis, fixed, a, b, 0, height, true);
  }

  wallBox(group, entry, axis, fixed, a, b, y0, y1, solid) {
    const len = b - a;
    if (len <= 0.01) return;
    const h = y1 - y0;
    const geom = tileUv(
      axis === 'x' ? new THREE.BoxGeometry(len, h, WALL_T) : new THREE.BoxGeometry(WALL_T, h, len),
      this.mats.wall, len, h);
    const m = new THREE.Mesh(geom, this.mats.wall);
    const mid = (a + b) / 2;
    if (axis === 'x') m.position.set(mid, y0 + h / 2, fixed);
    else m.position.set(fixed, y0 + h / 2, mid);
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    this.disposables.push(geom);
    if (solid) {
      const p = entry.placed;
      const world = axis === 'x'
        ? { minX: p.x + a, maxX: p.x + b, minZ: p.z + fixed - WALL_T / 2, maxZ: p.z + fixed + WALL_T / 2 }
        : { minX: p.x + fixed - WALL_T / 2, maxX: p.x + fixed + WALL_T / 2, minZ: p.z + a, maxZ: p.z + b };
      entry.colliders.push(world);
    }
  }

  // -------------------------------------------------------------- corridors

  buildCorridors() {
    const W = CORRIDOR.width, H = CORRIDOR.height, half = W / 2;

    // Pass one: work out every corridor's straight runs and corner junctions,
    // and accumulate the union of all their walkable footprints. Two corridors
    // are allowed to share a lane, so a wall may not be built anywhere another
    // corridor actually walks — otherwise one route silently seals another.
    const plans = [];
    this.walkable = [];
    for (const c of this.layout.corridors) {
      const p = c.points;
      const runs = [];
      for (let i = 0; i < p.length - 1; i++) {
        const a = { ...p[i] }, b = { ...p[i + 1] };
        const horiz = Math.abs(b.x - a.x) > Math.abs(b.z - a.z);
        const dir = horiz ? Math.sign(b.x - a.x) : Math.sign(b.z - a.z);
        if (i > 0) { if (horiz) a.x += dir * half; else a.z += dir * half; }
        if (i < p.length - 2) { if (horiz) b.x -= dir * half; else b.z -= dir * half; }
        if (horiz ? Math.abs(b.x - a.x) < 0.02 : Math.abs(b.z - a.z) < 0.02) continue;
        const minX = Math.min(a.x, b.x), maxX = Math.max(a.x, b.x);
        const minZ = Math.min(a.z, b.z), maxZ = Math.max(a.z, b.z);
        const rect = horiz
          ? { minX, maxX, minZ: minZ - half, maxZ: maxZ + half }
          : { minX: minX - half, maxX: maxX + half, minZ, maxZ };
        runs.push({ horiz, rect });
        this.walkable.push(rect);
      }
      const corners = [];
      for (let i = 1; i < p.length - 1; i++) {
        const cur = p[i];
        corners.push({ cur, prev: p[i - 1], next: p[i + 1] });
        this.walkable.push({
          minX: cur.x - half, maxX: cur.x + half, minZ: cur.z - half, maxZ: cur.z + half
        });
      }
      plans.push({ c, runs, corners });
    }

    // Pass two: build.
    for (const plan of plans) {
      const c = plan.c;
      const g = new THREE.Group();
      const entry = { group: g, lights: [], animated: [], colliders: [], corridor: c };
      this.corridorGroups.set(c.key, entry);
      const p = c.points;

      for (const r of plan.runs) {
        const { minX, maxX, minZ, maxZ } = r.rect;
        const cxp = r.horiz ? (minX + maxX) / 2 : (minX + maxX) / 2;
        const czp = r.horiz ? (minZ + maxZ) / 2 : (minZ + maxZ) / 2;
        const bx = maxX - minX, bz = maxZ - minZ;

        this.slab(g, cxp, -0.2, czp, bx, 0.4, bz, this.mats.floor);
        if (!this.theme.openSky) this.slab(g, cxp, H + 0.2, czp, bx, 0.4, bz, this.mats.ceiling);

        if (r.horiz) {
          this.corridorWall(g, entry, 'x', minZ - WALL_T / 2, minX, maxX);
          this.corridorWall(g, entry, 'x', maxZ + WALL_T / 2, minX, maxX);
        } else {
          this.corridorWall(g, entry, 'z', minX - WALL_T / 2, minZ, maxZ);
          this.corridorWall(g, entry, 'z', maxX + WALL_T / 2, minZ, maxZ);
        }
      }

      // corner junctions: floor, ceiling, and walls on the sides nothing uses
      for (const k of plan.corners) {
        const cur = k.cur;
        this.slab(g, cur.x, -0.2, cur.z, W, 0.4, W, this.mats.floor);
        if (!this.theme.openSky) this.slab(g, cur.x, H + 0.2, cur.z, W, 0.4, W, this.mats.ceiling);
        const open = new Set();
        for (const o of [k.prev, k.next]) {
          const dx = o.x - cur.x, dz = o.z - cur.z;
          open.add(Math.abs(dx) > Math.abs(dz) ? (dx > 0 ? 'e' : 'w') : (dz > 0 ? 's' : 'n'));
        }
        if (!open.has('n')) this.corridorWall(g, entry, 'x', cur.z - half - WALL_T / 2, cur.x - half - WALL_T, cur.x + half + WALL_T);
        if (!open.has('s')) this.corridorWall(g, entry, 'x', cur.z + half + WALL_T / 2, cur.x - half - WALL_T, cur.x + half + WALL_T);
        if (!open.has('w')) this.corridorWall(g, entry, 'z', cur.x - half - WALL_T / 2, cur.z - half - WALL_T, cur.z + half + WALL_T);
        if (!open.has('e')) this.corridorWall(g, entry, 'z', cur.x + half + WALL_T / 2, cur.z - half - WALL_T, cur.z + half + WALL_T);
      }

      // corridor lighting: a sconce every few metres
      const len = corridorLength(p);
      const lampEvery = 8.5;
      const n = Math.max(1, Math.round(len / lampEvery));
      for (let i = 0; i < n; i++) {
        const pt = pointAlong(p, ((i + 0.5) / n) * len);
        this.addLightDesc({
          x: pt.x, y: H * 0.72, z: pt.z,
          color: this.theme.lightPlan.color, intensity: 2.4 * LIGHT_SCALE, distance: 13,
          flicker: this.theme.lightPlan.flicker * 0.7, owner: c.key, isCorridor: true
        });
        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 7, 6),
          this.mats.flame
        );
        bulb.position.set(pt.x, H * 0.72, pt.z);
        g.add(bulb);
        this.disposables.push(bulb.geometry);
      }

      // doors at both ends
      this.makeDoor(g, entry, c, c.doorA);
      this.makeDoor(g, entry, c, c.doorB);

      this.doors.set(c.key, {
        locked: c.locked, secret: c.secret, key: c.key, a: c.a, b: c.b,
        label: c.label, panels: entry.panels || [], opened: !c.locked
      });

      this.root.add(g);
    }
  }

  // A corridor wall along `axis` at `fixed`, spanning `from`..`to`, with any
  // stretch that another corridor walks through cut out of it. Where two routes
  // cross, this leaves an opening in both — which is what a crossing is.
  corridorWall(group, entry, axis, fixed, from, to) {
    const H = CORRIDOR.height;
    const t = WALL_T / 2;
    const box = axis === 'x'
      ? { minX: from, maxX: to, minZ: fixed - t, maxZ: fixed + t }
      : { minX: fixed - t, maxX: fixed + t, minZ: from, maxZ: to };

    const blocked = [];
    for (const f of this.walkable) {
      const ox = Math.min(box.maxX, f.maxX) - Math.max(box.minX, f.minX);
      const oz = Math.min(box.maxZ, f.maxZ) - Math.max(box.minZ, f.minZ);
      if (ox <= 0.08 || oz <= 0.08) continue;
      blocked.push(axis === 'x'
        ? [Math.max(from, f.minX - 0.3), Math.min(to, f.maxX + 0.3)]
        : [Math.max(from, f.minZ - 0.3), Math.min(to, f.maxZ + 0.3)]);
    }

    blocked.sort((a, b) => a[0] - b[0]);
    const pieces = [];
    let cursor = from;
    for (const [s, e] of blocked) {
      if (s > cursor) pieces.push([cursor, s]);
      cursor = Math.max(cursor, e);
    }
    if (cursor < to) pieces.push([cursor, to]);

    for (const [s, e] of pieces) {
      if (e - s < 0.2) continue;
      const cx = axis === 'x' ? (s + e) / 2 : fixed;
      const cz = axis === 'x' ? fixed : (s + e) / 2;
      const sx = axis === 'x' ? e - s : WALL_T;
      const sz = axis === 'x' ? WALL_T : e - s;
      this.slab(group, cx, H / 2, cz, sx, H, sz, this.mats.wall, entry);
    }
  }

  slab(group, x, y, z, sx, sy, sz, mat, colliderEntry) {
    const w = Math.max(0.01, sx), hgt = Math.max(0.01, sy), dep = Math.max(0.01, sz);
    const geom = tileUv(new THREE.BoxGeometry(w, hgt, dep), mat,
      Math.max(w, dep), hgt > 1 ? hgt : Math.min(w, dep));
    const m = new THREE.Mesh(geom, mat);
    m.position.set(x, y, z);
    m.castShadow = sy > 1;
    m.receiveShadow = true;
    group.add(m);
    this.disposables.push(geom);
    if (colliderEntry) {
      colliderEntry.colliders.push({
        minX: x - sx / 2, maxX: x + sx / 2, minZ: z - sz / 2, maxZ: z + sz / 2
      });
    }
    return m;
  }

  makeDoor(group, entry, corridor, door) {
    const w = DOORWAY.width, h = DOORWAY.height;
    const vertical = door.side === 'east' || door.side === 'west';
    const panelGeo = new THREE.BoxGeometry(vertical ? 0.28 : w - 0.12, h - 0.1, vertical ? w - 0.12 : 0.28);
    const panel = new THREE.Mesh(panelGeo, corridor.locked ? this.mats.doorLocked : this.mats.doorMat);
    panel.position.set(door.x, (h - 0.1) / 2, door.z);
    panel.castShadow = panel.receiveShadow = true;
    group.add(panel);
    this.disposables.push(panelGeo);

    // frame
    const frameMat = this.mats.trim;
    const fT = 0.22;
    if (vertical) {
      this.slab(group, door.x, h / 2, door.z - w / 2 - fT / 2, 0.6, h + fT, fT, frameMat);
      this.slab(group, door.x, h / 2, door.z + w / 2 + fT / 2, 0.6, h + fT, fT, frameMat);
      this.slab(group, door.x, h + fT / 2, door.z, 0.6, fT, w + fT * 2, frameMat);
    } else {
      this.slab(group, door.x - w / 2 - fT / 2, h / 2, door.z, fT, h + fT, 0.6, frameMat);
      this.slab(group, door.x + w / 2 + fT / 2, h / 2, door.z, fT, h + fT, 0.6, frameMat);
      this.slab(group, door.x, h + fT / 2, door.z, w + fT * 2, fT, 0.6, frameMat);
    }

    entry.panels = entry.panels || [];
    entry.panels.push({
      mesh: panel, side: door.side, closedY: (h - 0.1) / 2, openY: (h - 0.1) / 2 + h + 0.2,
      collider: {
        minX: door.x - (vertical ? 0.2 : w / 2), maxX: door.x + (vertical ? 0.2 : w / 2),
        minZ: door.z - (vertical ? w / 2 : 0.2), maxZ: door.z + (vertical ? w / 2 : 0.2)
      }
    });

    if (corridor.secret && corridor.locked) {
      panel.material = this.mats.wall;
    }
  }

  // ------------------------------------------------------------- lighting

  lightRoom(entry, placed) {
    const plan = this.theme.lightPlan;
    const kind = KIND_ACCENTS[placed.room.kind];

    if (plan.style !== 'none') {
      const n = placed.w > 28 ? 6 : placed.w > 20 ? 4 : placed.w > 13 ? 3 : 2;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + 0.4;
        const rx = (placed.w / 2 - 1.6) * (plan.style === 'volume' ? 0.55 : 0.92);
        const rz = (placed.d / 2 - 1.6) * (plan.style === 'volume' ? 0.55 : 0.92);
        const y = plan.style === 'pendant' ? Math.min(plan.height, placed.h - 1.0)
          : plan.style === 'floor' ? plan.height
          : plan.style === 'volume' ? Math.min(plan.height, placed.h * 0.4)
          : plan.height;
        const lx = Math.cos(a) * rx, lz = Math.sin(a) * rz;
        this.addLightDesc({
          x: placed.x + lx, y, z: placed.z + lz,
          color: plan.color, intensity: plan.intensity * LIGHT_SCALE, distance: plan.distance,
          flicker: plan.flicker, owner: placed.room.id
        });

        // the fitting itself, so the light has a visible source
        const fitting = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), this.mats.flame);
        fitting.position.set(lx, y, lz);
        entry.group.add(fitting);
        this.disposables.push(fitting.geometry);
      }
    }

    // cool bounce fill so shadows aren't pure black
    if (plan.fill && plan.fill.intensity > 0) {
      this.addLightDesc({
        x: placed.x, y: placed.h * 0.62, z: placed.z,
        color: plan.fill.color, intensity: plan.fill.intensity * LIGHT_SCALE * 1.1,
        distance: placed.w * 1.25, owner: placed.room.id, shadowWorthy: false
      });
    }

    if (kind && kind.intensity > 0) {
      this.addLightDesc({
        x: placed.x, y: kind.height, z: placed.z,
        color: kind.color, intensity: kind.intensity * LIGHT_SCALE, distance: placed.w * 1.1,
        flicker: placed.room.kind === 'deadend' ? 0.3 : 0.05, owner: placed.room.id
      });
    }
  }

  // ------------------------------------------------------------ atmosphere

  buildAtmosphere() {
    const spec = this.theme.particles;
    const scale = Settings.particleScale();
    if (!spec || scale <= 0) { this.particles = null; return; }
    const n = Math.max(20, Math.round(spec.count * scale));
    const R = 34;
    const pos = new Float32Array(n * 3);
    const vel = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * R;
      pos[i * 3 + 1] = Math.random() * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * R;
      vel[i] = 0.5 + Math.random();
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: spec.color, size: spec.size * (spec.kind === 'rain' ? 1.6 : 2.4), transparent: true,
      opacity: spec.kind === 'rain' ? 0.55 : 0.75,
      map: pointSprite(), alphaTest: 0.02,
      depthWrite: false, sizeAttenuation: true,
      blending: spec.kind === 'rain' ? THREE.NormalBlending : THREE.AdditiveBlending
    });
    const pts = new THREE.Points(geom, mat);
    pts.frustumCulled = false;
    this.scene.add(pts);
    this.particles = { pts, geom, mat, n, vel, kind: spec.kind, drift: spec.drift, R };
    this.disposables.push(geom, mat);

    if (this.theme.lightning) {
      this.bolt = new THREE.DirectionalLight(0xdce8ff, 0);
      this.bolt.position.set(24, 60, -18);
      this.scene.add(this.bolt);
      this.nextBolt = 4 + Math.random() * 8;
    }
  }

  updateParticles(dt, camPos) {
    const p = this.particles;
    if (!p) return;
    const a = p.geom.attributes.position.array;
    const R = p.R, half = R / 2;
    for (let i = 0; i < p.n; i++) {
      const ix = i * 3;
      if (p.kind === 'rain') {
        a[ix + 1] -= p.vel[i] * 26 * dt;
        if (a[ix + 1] < -2) {
          a[ix + 1] = 16;
          a[ix] = camPos.x + (Math.random() - 0.5) * R;
          a[ix + 2] = camPos.z + (Math.random() - 0.5) * R;
        }
      } else {
        a[ix + 1] += p.drift * p.vel[i] * dt * 4;
        a[ix] += Math.sin(a[ix + 2] * 0.2 + performance.now() * 0.0002) * dt * 0.3;
        if (a[ix + 1] > 13) a[ix + 1] = 0.2;
        if (a[ix + 1] < 0) a[ix + 1] = 12.8;
      }
      // keep the cloud centred on the player
      if (a[ix] - camPos.x > half) a[ix] -= R;
      if (a[ix] - camPos.x < -half) a[ix] += R;
      if (a[ix + 2] - camPos.z > half) a[ix + 2] -= R;
      if (a[ix + 2] - camPos.z < -half) a[ix + 2] += R;
    }
    p.geom.attributes.position.needsUpdate = true;
  }

  // -------------------------------------------------------------- doors

  setLocked(roomIdTo, locked) {
    let changed = false;
    for (const d of this.doors.values()) {
      if (d.b !== roomIdTo && d.a !== roomIdTo) continue;
      // only the door *leading into* that room, as authored
      if (d.b !== roomIdTo) continue;
      if (d.locked === locked) continue;
      d.locked = locked;
      changed = true;
    }
    if (changed) this.rebuildColliders();
    return changed;
  }

  isOpen(key) {
    const d = this.doors.get(key);
    return d ? !d.locked : false;
  }

  updateDoors(dt) {
    for (const [key, d] of this.doors) {
      const entry = this.corridorGroups.get(key);
      if (!entry || !entry.panels) continue;
      const want = d.locked ? 0 : 1;
      d.anim = d.anim === undefined ? want : d.anim;
      const before = d.anim;
      d.anim += (want - d.anim) * Math.min(1, dt * 2.4);
      if (Math.abs(want - d.anim) < 0.002) d.anim = want;
      if (Math.abs(before - d.anim) > 0.0005) {
        for (const p of entry.panels) {
          p.mesh.position.y = p.closedY + (p.openY - p.closedY) * d.anim;
        }
        this.shadowsDirty = true;   // a door moved; its shadow is now stale
      }
    }
  }

  // ---------------------------------------------------------- collision

  rebuildColliders() {
    const out = [];
    for (const e of this.roomGroups.values()) out.push(...e.colliders);
    for (const [key, e] of this.corridorGroups) {
      out.push(...e.colliders);
      const d = this.doors.get(key);
      if (d && d.locked && e.panels) for (const p of e.panels) out.push(p.collider);
    }
    this.colliders = out;
  }

  // Slide-along-walls resolution against the AABB set.
  resolveMove(from, delta) {
    const r = PLAYER_R;
    let x = from.x, z = from.z;
    const tryAxis = (nx, nz) => {
      for (const c of this.colliders) {
        if (nx + r > c.minX && nx - r < c.maxX && nz + r > c.minZ && nz - r < c.maxZ) return false;
      }
      return true;
    };
    if (tryAxis(x + delta.x, z)) x += delta.x;
    if (tryAxis(x, z + delta.z)) z += delta.z;
    return { x, z };
  }

  // Somewhere in this room the player can actually stand. Starts from the
  // preferred spot and spirals outward if a prop happens to occupy it.
  spawnPoint(roomId) {
    const p = this.layout.rooms.get(roomId);
    if (!p) return null;
    const clear = (x, z) => {
      for (const c of this.colliders) {
        if (x + PLAYER_R > c.minX && x - PLAYER_R < c.maxX &&
            z + PLAYER_R > c.minZ && z - PLAYER_R < c.maxZ) return false;
      }
      return true;
    };
    const prefer = { x: p.x, z: p.z + p.d * 0.30 };
    if (clear(prefer.x, prefer.z)) return prefer;
    for (let r = 1.2; r < Math.max(p.w, p.d) * 0.5; r += 1.2) {
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const x = prefer.x + Math.cos(a) * r;
        const z = prefer.z + Math.sin(a) * r;
        if (Math.abs(x - p.x) > p.w / 2 - 1 || Math.abs(z - p.z) > p.d / 2 - 1) continue;
        if (clear(x, z)) return { x, z };
      }
    }
    return { x: p.x, z: p.z };
  }

  roomAt(x, z) {
    for (const p of this.layout.rooms.values()) {
      if (x > p.x - p.w / 2 && x < p.x + p.w / 2 && z > p.z - p.d / 2 && z < p.z + p.d / 2) return p.room.id;
    }
    return null;
  }

  defaultSurface() {
    return { salt: 'stone', warren: 'dirt', archive: 'water', foundry: 'metal', garden: 'dirt',
      clockwork: 'metal', choir: 'stone', ossuary: 'bone', storm: 'water', cadence: 'stone'
    }[this.theme.key] || 'stone';
  }

  // Makes the whole floor visible for one compile pass so every material and
  // geometry variant gets its program built during the loading screen, then
  // restores whatever was visible before.
  precompile(rendererWrapper, camera) {
    const roomVis = new Map(), corrVis = new Map();
    for (const [id, e] of this.roomGroups) { roomVis.set(id, e.group.visible); e.group.visible = true; }
    for (const [k, e] of this.corridorGroups) { corrVis.set(k, e.group.visible); e.group.visible = true; }

    // Visible is not enough: the render path frustum-culls, and a program only
    // compiles when its object is actually submitted. A transmissive pool of
    // water at the far end of the floor would otherwise wait until the player
    // walked into the room and then compile mid-step. Submit everything.
    const culled = [];
    this.root.traverse((o) => {
      if (o.isMesh || o.isPoints) { culled.push([o, o.frustumCulled]); o.frustumCulled = false; }
    });

    try {
      rendererWrapper.renderer.compile(this.scene, camera);
      // compile() builds surface programs but not the shadow-map depth programs,
      // and a program's key also depends on the colour space of the target it is
      // drawn into. So force a couple of real frames down the exact path the game
      // uses — through the composer, into its linear target, with shadows on —
      // with the whole floor visible. Everything compiles here, behind the
      // loading card, instead of mid-walk.
      for (let i = 0; i < 2; i++) {
        rendererWrapper.requestShadowUpdate();
        rendererWrapper.render();
      }
    } catch (e) { /* not fatal */ }

    for (const [o, was] of culled) o.frustumCulled = was;
    for (const [id, e] of this.roomGroups) e.group.visible = roomVis.get(id);
    for (const [k, e] of this.corridorGroups) e.group.visible = corrVis.get(k);
    this.shadowsDirty = true;
  }

  // ------------------------------------------------------------ visibility

  setVisibleFrom(roomId) {
    if (this._visFrom === roomId) return;
    this._visFrom = roomId;
    const show = new Set();
    const showCorr = new Set();
    if (roomId) {
      show.add(roomId);
      for (const c of this.layout.corridors) {
        if (c.a !== roomId && c.b !== roomId) continue;
        showCorr.add(c.key);
        show.add(c.a); show.add(c.b);
      }
      // one more hop of corridors so doorways in neighbouring rooms aren't voids
      for (const c of this.layout.corridors) {
        if (show.has(c.a) || show.has(c.b)) showCorr.add(c.key);
      }
    } else {
      for (const id of this.roomGroups.keys()) show.add(id);
      for (const k of this.corridorGroups.keys()) showCorr.add(k);
    }
    for (const [id, e] of this.roomGroups) e.group.visible = show.has(id);
    for (const [k, e] of this.corridorGroups) e.group.visible = showCorr.has(k);
    this.visibleRooms = show;
    this.visibleCorridors = showCorr;
    this._visDirty = true;
  }

  // Chooses which descriptors the fixed pool should be lighting. Nothing here
  // ever changes how many lights are visible or how many cast shadows — that
  // would force three.js to recompile every material in the scene mid-frame.
  updateLights(camPos, t, dt) {
    this._selectIn -= dt;
    if (this._selectIn <= 0 || this._visDirty) {
      this._selectIn = 0.12;
      this._visDirty = false;
      this.selectLights(camPos);
    }
    this.pool.animate(t);

    if (this.bolt) {
      this.nextBolt -= dt;
      if (this.nextBolt <= 0) {
        this.boltT = 0.42;
        this.nextBolt = 6 + Math.random() * 14;
      }
      if (this.boltT > 0) {
        this.boltT -= dt;
        const f = Math.max(0, this.boltT);
        this.bolt.intensity = (Math.random() > 0.35 ? 1 : 0.2) * f * 16;
      } else this.bolt.intensity = 0;
    }
  }

  selectLights(camPos) {
    const cands = this._cands;
    cands.length = 0;
    const token = ++this._pickToken;

    for (const d of this.lightDescs) {
      const on = d.isCorridor
        ? (!this.visibleCorridors || this.visibleCorridors.has(d.owner))
        : (!this.visibleRooms || this.visibleRooms.has(d.owner));
      if (!on) continue;
      const dx = d.x - camPos.x, dy = d.y - camPos.y, dz = d.z - camPos.z;
      const dist = dx * dx + dy * dy + dz * dz;
      // past its own reach it contributes nothing worth a pool slot
      const reach = d.distance + 10;
      if (dist > reach * reach) continue;
      d.dist = dist;
      d.pick = 0;
      cands.push(d);
    }

    cands.sort(byDist);

    const chosen = this._chosen || (this._chosen = []);
    chosen.length = 0;
    // shadow-casting slots come first, so they go to the nearest lights that
    // are actually worth casting from
    for (const d of cands) {
      if (chosen.length >= this.pool.shadowCount) break;
      if (!d.shadowWorthy) continue;
      d.pick = token;
      chosen.push(d);
    }
    for (const d of cands) {
      if (chosen.length >= this.pool.count) break;
      if (d.pick === token) continue;
      d.pick = token;
      chosen.push(d);
    }

    if (this.pool.assign(chosen)) this.shadowsDirty = true;
  }

  update(t, dt, camPos) {
    for (const e of this.roomGroups.values()) {
      if (!e.group.visible) continue;
      for (const fn of e.animated) fn(t);
    }
    this.updateDoors(dt);
    this.updateParticles(dt, camPos);
    this.updateLights(camPos, t, dt);
  }

  dispose() {
    this.pool.dispose();
    for (const n of this.npcs.values()) n.dispose();
    this.npcs.clear();
    for (const d of this.disposables) { try { d.dispose(); } catch (e) { /* ignore */ } }
    this.disposables.length = 0;
    this.mats.dispose();
    if (this.particles) this.scene.remove(this.particles.pts);
    if (this.bolt) this.scene.remove(this.bolt);
    this.scene.remove(this.root);
    this.root.traverse((o) => {
      if (o.geometry && !o.geometry.__shared) { try { o.geometry.dispose(); } catch (e) { /* ignore */ } }
    });
  }
}

const _v = new THREE.Vector3();
function byDist(a, b) { return a.dist - b.dist; }

// Rescales a box's UVs so the texture tiles at a constant real-world size
// regardless of how big the box is.
function tileUv(geom, mat, su, sv) {
  const d = (mat && mat.userData && mat.userData.density) || 0.3;
  const uv = geom.attributes.uv;
  if (!uv) return geom;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, uv.getX(i) * su * d, uv.getY(i) * sv * d);
  }
  uv.needsUpdate = true;
  return geom;
}

function corridorLength(p) {
  let L = 0;
  for (let i = 0; i < p.length - 1; i++) L += Math.hypot(p[i + 1].x - p[i].x, p[i + 1].z - p[i].z);
  return L;
}

function pointAlong(p, dist) {
  let L = 0;
  for (let i = 0; i < p.length - 1; i++) {
    const seg = Math.hypot(p[i + 1].x - p[i].x, p[i + 1].z - p[i].z);
    if (L + seg >= dist) {
      const f = seg < 0.001 ? 0 : (dist - L) / seg;
      return { x: p[i].x + (p[i + 1].x - p[i].x) * f, z: p[i].z + (p[i + 1].z - p[i].z) * f };
    }
    L += seg;
  }
  return p[p.length - 1];
}
