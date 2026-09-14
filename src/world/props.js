// Set-piece builders. Every prop in the game is assembled from primitives here.
// A prop receives the placed room, the floor's material set, a deterministic RNG,
// and collectors for lights and per-frame animation.

import * as THREE from 'three';
import { pointSprite } from '../engine/textures.js';

export function makeRng(seedStr) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return function rng() {
    h += 0x6D2B79F5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GEO = {};
function geo(key, make) {
  if (!GEO[key]) GEO[key] = make();
  return GEO[key];
}

export function disposeSharedGeometry() {
  for (const g of Object.values(GEO)) g.dispose();
  for (const k of Object.keys(GEO)) delete GEO[k];
}

// True if a point sits in the walking approach to one of the room's doorways.
// ctx.doorways holds room-local door positions; the approach is a lane reaching
// APPROACH metres in from the wall and HALF_LANE either side of the door centre.
const APPROACH = 5.2;
const HALF_LANE = 2.9;

function blocksDoor(ctx, x, z, pad = 0) {
  for (const d of ctx.doorways || []) {
    let along, lateral;
    if (d.side === 'north') { along = z - d.z; lateral = x - d.x; }
    else if (d.side === 'south') { along = d.z - z; lateral = x - d.x; }
    else if (d.side === 'west') { along = x - d.x; lateral = z - d.z; }
    else { along = d.x - x; lateral = z - d.z; }
    if (along > -1.2 && along < APPROACH + pad && Math.abs(lateral) < HALF_LANE + pad) return true;
  }
  return false;
}

// Keeps props out of the middle of the room (where the NPC and the player stand)
// and out of the doorways. If the slot the ring wants is in front of a door it
// steps around the room until it finds one that isn't.
function ring(ctx, i, n, radiusFrac = 0.78, jitter = 0.1) {
  const { room, rng } = ctx;
  const base = (i / n) * Math.PI * 2 + rng() * jitter;
  const rx = (room.w / 2) * radiusFrac;
  const rz = (room.d / 2) * radiusFrac;
  for (let k = 0; k < 14; k++) {
    const a = base + k * 0.42;
    const x = Math.cos(a) * rx, z = Math.sin(a) * rz;
    if (!blocksDoor(ctx, x, z)) return { x, z, a };
  }
  return { x: Math.cos(base) * rx, z: Math.sin(base) * rz, a: base };
}

function corner(ctx, i, inset = 2.4) {
  const { room } = ctx;
  const sx = i & 1 ? 1 : -1;
  const sz = i & 2 ? 1 : -1;
  return { x: sx * (room.w / 2 - inset), z: sz * (room.d / 2 - inset) };
}

// Matches LIGHT_SCALE in builder.js: three.js point lights are in candela.
const LIGHT_SCALE = 8;

function addLight(ctx, color, intensity, distance, x, y, z, flicker = 0) {
  const scaled = intensity * LIGHT_SCALE;
  const l = new THREE.PointLight(color, scaled, distance, 2);
  l.position.set(x, y, z);
  ctx.lights.push({ light: l, flicker, base: scaled });
  return l;
}

function anim(ctx, fn) { ctx.animated.push(fn); }

// Registers a room-local AABB the player can't walk through. The builder offsets
// these into world space. A prop that would stand across a doorway is left
// visible but made non-solid rather than sealing the room.
function solid(ctx, x, z, halfW, halfD) {
  if (blocksDoor(ctx, x, z, Math.max(halfW, halfD))) return;
  ctx.colliders.push({ minX: x - halfW, maxX: x + halfW, minZ: z - halfD, maxZ: z + halfD });
}

// ---------------------------------------------------------------------------

const PROPS = {

  pillars(g, ctx) {
    const { room, mats, rng } = ctx;
    const n = room.w > 26 ? 8 : room.w > 18 ? 6 : 4;
    const h = room.h - 0.2;
    const shaft = geo('pillar', () => new THREE.CylinderGeometry(0.55, 0.68, 1, 12));
    const cap = geo('pillarCap', () => new THREE.BoxGeometry(1.7, 0.42, 1.7));
    for (let i = 0; i < n; i++) {
      const p = ring(ctx, i, n, 0.82, 0.02);
      const m = new THREE.Mesh(shaft, mats.trim);
      m.scale.set(1, h, 1);
      m.position.set(p.x, h / 2, p.z);
      m.castShadow = m.receiveShadow = true;
      g.add(m);
      solid(ctx, p.x, p.z, 0.78, 0.78);
      for (const y of [0.22, h - 0.22]) {
        const c = new THREE.Mesh(cap, mats.trim);
        c.position.set(p.x, y, p.z);
        c.castShadow = true;
        g.add(c);
      }
      if (rng() > 0.72) {
        const crack = new THREE.Mesh(geo('rock', () => new THREE.DodecahedronGeometry(0.5, 0)), mats.stone);
        crack.position.set(p.x + (rng() - 0.5) * 2, 0.3, p.z + (rng() - 0.5) * 2);
        crack.scale.setScalar(0.4 + rng() * 0.5);
        crack.rotation.set(rng() * 3, rng() * 3, rng() * 3);
        crack.castShadow = true;
        g.add(crack);
      }
    }
  },

  brazier(g, ctx) {
    const { theme, mats } = ctx;
    const n = ctx.room.w > 22 ? 3 : 2;
    for (let i = 0; i < n; i++) {
      const p = ring(ctx, i + 0.5, n, 0.66, 0.2);
      const stand = new THREE.Mesh(geo('brazStand', () => new THREE.CylinderGeometry(0.14, 0.34, 1.5, 8)), mats.metal);
      stand.position.set(p.x, 0.75, p.z);
      stand.castShadow = true;
      g.add(stand);
      const bowl = new THREE.Mesh(geo('brazBowl', () => new THREE.CylinderGeometry(0.72, 0.4, 0.5, 12, 1, true)), mats.metal);
      bowl.position.set(p.x, 1.68, p.z);
      bowl.castShadow = true;
      g.add(bowl);
      const fire = new THREE.Mesh(geo('flame', () => new THREE.ConeGeometry(0.5, 1.15, 8)), mats.flame);
      fire.position.set(p.x, 2.25, p.z);
      g.add(fire);
      const l = addLight(ctx, theme.lightPlan.color, 3.0, 15, p.x, 2.5, p.z, 0.45);
      g.add(l);
      const seed = ctx.rng() * 100;
      anim(ctx, (t) => {
        const s = 0.86 + Math.sin(t * 11 + seed) * 0.1 + Math.sin(t * 19.3 + seed) * 0.06;
        fire.scale.set(s, 1 / s, s);
        fire.rotation.y = t * 1.4 + seed;
      });
    }
  },

  water(g, ctx) {
    const { room, mats } = ctx;
    const w = room.w - 1.2, d = room.d - 1.2;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(w, d, 24, 24), mats.water);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0.14;
    plane.receiveShadow = true;
    g.add(plane);
    ctx.disposables.push(plane.geometry);
    const pos = plane.geometry.attributes.position;
    const base = Float32Array.from(pos.array);
    anim(ctx, (t) => {
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3], y = base[i * 3 + 1];
        pos.array[i * 3 + 2] = Math.sin(x * 0.5 + t * 1.1) * 0.055 + Math.cos(y * 0.42 - t * 0.8) * 0.045;
      }
      pos.needsUpdate = true;
    });
    ctx.surface = 'water';
  },

  rubble(g, ctx) {
    const { room, mats, rng } = ctx;
    const n = 26;
    const im = new THREE.InstancedMesh(geo('rock', () => new THREE.DodecahedronGeometry(0.5, 0)), mats.stone, n);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
    for (let i = 0; i < n; i++) {
      const edge = rng() > 0.4;
      const rx = edge ? (room.w / 2 - 1 - rng() * 2.5) * (rng() > 0.5 ? 1 : -1) : (rng() - 0.5) * room.w * 0.8;
      const rz = edge ? (room.d / 2 - 1 - rng() * 2.5) * (rng() > 0.5 ? 1 : -1) : (rng() - 0.5) * room.d * 0.8;
      const sc = 0.22 + rng() * 0.62;
      p.set(rx, sc * 0.42, rz);
      e.set(rng() * 6, rng() * 6, rng() * 6);
      q.setFromEuler(e);
      s.set(sc, sc * (0.5 + rng() * 0.6), sc);
      m.compose(p, q, s);
      im.setMatrixAt(i, m);
    }
    im.castShadow = im.receiveShadow = true;
    g.add(im);
  },

  shelves(g, ctx) {
    const { room, mats, rng } = ctx;
    const h = Math.min(room.h - 1.0, 4.6);
    const bookGeo = geo('book', () => new THREE.BoxGeometry(0.16, 0.5, 0.42));
    for (const side of [-1, 1]) {
      const count = Math.max(2, Math.floor(room.d / 6));
      for (let i = 0; i < count; i++) {
        const z = -room.d / 2 + 3 + i * (room.d - 6) / Math.max(1, count - 1);
        const x = side * (room.w / 2 - 0.85);
        if (blocksDoor(ctx, x, z, 2.2)) continue;
        const frame = new THREE.Mesh(geo('shelfFrame', () => new THREE.BoxGeometry(1.1, 1, 4.2)), mats.wood);
        frame.scale.y = h;
        frame.position.set(x, h / 2, z);
        frame.castShadow = frame.receiveShadow = true;
        g.add(frame);
        solid(ctx, x, z, 0.75, 2.2);
        const shelves = Math.floor(h / 0.85);
        const im = new THREE.InstancedMesh(bookGeo, mats.cloth, shelves * 14);
        const mtx = new THREE.Matrix4();
        let k = 0;
        for (let sI = 0; sI < shelves; sI++) {
          for (let b = 0; b < 14; b++) {
            if (rng() > 0.82) { mtx.makeScale(0, 0, 0); im.setMatrixAt(k++, mtx); continue; }
            const bz = z - 1.8 + b * 0.27;
            const lean = rng() > 0.9 ? 0.3 : 0;
            mtx.compose(
              new THREE.Vector3(x - side * 0.15, 0.55 + sI * 0.85, bz),
              new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, lean)),
              new THREE.Vector3(1, 0.7 + rng() * 0.55, 0.7 + rng() * 0.5)
            );
            im.setMatrixAt(k++, mtx);
          }
        }
        im.castShadow = true;
        g.add(im);
      }
    }
  },

  statue(g, ctx) {
    const { mats, rng } = ctx;
    const n = ctx.room.w > 22 ? 4 : 2;
    for (let i = 0; i < n; i++) {
      const p = ring(ctx, i + 0.25, n, 0.8, 0.05);
      const base = new THREE.Mesh(geo('statueBase', () => new THREE.CylinderGeometry(0.85, 1.0, 0.6, 8)), mats.trim);
      base.position.set(p.x, 0.3, p.z);
      base.castShadow = base.receiveShadow = true;
      g.add(base);
      const fig = new THREE.Group();
      const body = new THREE.Mesh(geo('statueBody', () => new THREE.CapsuleGeometry(0.42, 1.3, 4, 10)), mats.stone);
      body.position.y = 1.35; body.castShadow = true; fig.add(body);
      const head = new THREE.Mesh(geo('statueHead', () => new THREE.SphereGeometry(0.3, 12, 10)), mats.stone);
      head.position.y = 2.32; head.castShadow = true; fig.add(head);
      for (const s of [-1, 1]) {
        const arm = new THREE.Mesh(geo('statueArm', () => new THREE.CapsuleGeometry(0.13, 0.9, 3, 6)), mats.stone);
        arm.position.set(s * 0.45, 1.5, 0);
        arm.rotation.z = s * (0.25 + rng() * 0.5);
        arm.castShadow = true;
        fig.add(arm);
      }
      if (rng() > 0.6) { head.rotation.z = 0.5; head.position.x = 0.1; }   // a few have lost their heads' composure
      fig.position.set(p.x, 0.6, p.z);
      fig.rotation.y = -p.a + Math.PI / 2;
      g.add(fig);
      solid(ctx, p.x, p.z, 1.0, 1.0);
    }
  },

  altar(g, ctx) {
    const { mats, theme } = ctx;
    const slab = new THREE.Mesh(geo('altarSlab', () => new THREE.BoxGeometry(2.6, 0.34, 1.5)), mats.trim);
    slab.position.set(0, 1.06, -ctx.room.d * 0.24);
    slab.castShadow = slab.receiveShadow = true;
    g.add(slab);
    const stem = new THREE.Mesh(geo('altarStem', () => new THREE.BoxGeometry(1.5, 0.9, 1.0)), mats.stone);
    stem.position.set(0, 0.45, -ctx.room.d * 0.24);
    stem.castShadow = stem.receiveShadow = true;
    g.add(stem);
    solid(ctx, 0, -ctx.room.d * 0.24, 1.45, 0.9);
    const orb = new THREE.Mesh(geo('orb', () => new THREE.IcosahedronGeometry(0.34, 2)), mats.glow);
    orb.position.set(0, 1.65, -ctx.room.d * 0.24);
    g.add(orb);
    const l = addLight(ctx, theme.accent, 2.6, 12, 0, 1.9, -ctx.room.d * 0.24, 0.08);
    g.add(l);
    anim(ctx, (t) => {
      orb.position.y = 1.65 + Math.sin(t * 1.1) * 0.09;
      orb.rotation.y = t * 0.4;
      orb.rotation.x = Math.sin(t * 0.3) * 0.3;
    });
  },

  chains(g, ctx) {
    const { room, mats, rng } = ctx;
    const n = 12;
    const link = geo('link', () => new THREE.TorusGeometry(0.12, 0.042, 5, 9));
    for (let i = 0; i < n; i++) {
      const x = (rng() - 0.5) * room.w * 0.82;
      const z = (rng() - 0.5) * room.d * 0.82;
      const len = 1.2 + rng() * (room.h - 2.2);
      const links = Math.floor(len / 0.2);
      const im = new THREE.InstancedMesh(link, mats.metal, links);
      const mtx = new THREE.Matrix4();
      for (let k = 0; k < links; k++) {
        mtx.compose(
          new THREE.Vector3(0, -k * 0.2, 0),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, (k % 2) * Math.PI / 2, 0)),
          new THREE.Vector3(1, 1, 1)
        );
        im.setMatrixAt(k, mtx);
      }
      im.castShadow = true;
      const holder = new THREE.Group();
      holder.add(im);
      holder.position.set(x, room.h - 0.1, z);
      g.add(holder);
      const ph = rng() * 6, amp = 0.012 + rng() * 0.02;
      anim(ctx, (t) => {
        holder.rotation.z = Math.sin(t * 0.6 + ph) * amp;
        holder.rotation.x = Math.cos(t * 0.47 + ph) * amp;
      });
    }
  },

  gears(g, ctx) {
    const { room, mats, rng } = ctx;
    const n = 5;
    for (let i = 0; i < n; i++) {
      const r = 1.0 + rng() * 2.4;
      const teeth = Math.max(9, Math.round(r * 7));
      const gear = new THREE.Group();
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.3, 28), mats.brass);
      disc.rotation.x = Math.PI / 2;
      disc.castShadow = disc.receiveShadow = true;
      gear.add(disc);
      ctx.disposables.push(disc.geometry);
      const tooth = geo('tooth', () => new THREE.BoxGeometry(0.34, 0.34, 0.3));
      const im = new THREE.InstancedMesh(tooth, mats.brass, teeth);
      const mtx = new THREE.Matrix4();
      for (let k = 0; k < teeth; k++) {
        const a = (k / teeth) * Math.PI * 2;
        mtx.compose(
          new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, 0),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, a)),
          new THREE.Vector3(1, 1, 1)
        );
        im.setMatrixAt(k, mtx);
      }
      im.castShadow = true;
      gear.add(im);
      const side = rng() > 0.5 ? 1 : -1;
      gear.position.set(side * (room.w / 2 - 0.45), 1.6 + rng() * (room.h - 3.4), (rng() - 0.5) * room.d * 0.75);
      gear.rotation.y = side * Math.PI / 2;
      g.add(gear);
      const spd = (rng() > 0.5 ? 1 : -1) * (0.12 + rng() * 0.3);
      anim(ctx, (t) => { gear.rotation.z = t * spd; });
    }
  },

  banners(g, ctx) {
    const { room, mats, rng } = ctx;
    const n = Math.max(4, Math.floor(room.w / 5));
    const geoB = geo('banner', () => new THREE.PlaneGeometry(1.5, 3.4, 3, 8));
    for (let i = 0; i < n; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const z = -room.d / 2 + 3 + (i >> 1) * 4.6;
      if (Math.abs(z) > room.d / 2 - 1.5) continue;
      const b = new THREE.Mesh(geoB, mats.cloth);
      b.position.set(side * (room.w / 2 - 0.35), room.h - 2.4, z);
      b.rotation.y = side * Math.PI / 2;
      b.castShadow = true;
      g.add(b);
      const ph = rng() * 6;
      anim(ctx, (t) => { b.rotation.z = Math.sin(t * 0.7 + ph) * 0.028; });
    }
  },

  crystals(g, ctx) {
    const { room, mats, theme, rng } = ctx;
    const n = 14;
    const cg = geo('crystal', () => new THREE.ConeGeometry(0.3, 1.5, 5));
    const lit = [];
    for (let i = 0; i < n; i++) {
      const wall = rng() > 0.45;
      const c = new THREE.Mesh(cg, mats.glow);
      const sc = 0.4 + rng() * 1.1;
      if (wall) {
        const side = rng() > 0.5 ? 1 : -1;
        const onX = rng() > 0.5;
        c.position.set(
          onX ? side * (room.w / 2 - 0.4) : (rng() - 0.5) * room.w * 0.8,
          0.8 + rng() * (room.h - 2),
          onX ? (rng() - 0.5) * room.d * 0.8 : side * (room.d / 2 - 0.4)
        );
        c.rotation.set(rng() * 0.6 - 0.3, rng() * 6, (onX ? side : 0) * 1.3 + rng() * 0.4);
      } else {
        c.position.set((rng() - 0.5) * room.w * 0.78, sc * 0.6, (rng() - 0.5) * room.d * 0.78);
        c.rotation.set((rng() - 0.5) * 0.4, rng() * 6, (rng() - 0.5) * 0.4);
      }
      c.scale.setScalar(sc);
      g.add(c);
      if (i < 3) lit.push(c.position.clone());
    }
    for (const p of lit) g.add(addLight(ctx, theme.accent, 1.5, 10, p.x, p.y, p.z, 0.05));
  },

  roots(g, ctx) {
    const { room, mats, rng } = ctx;
    const n = 16;
    for (let i = 0; i < n; i++) {
      const pts = [];
      const sx = (rng() - 0.5) * room.w * 0.9;
      const sz = (rng() - 0.5) * room.d * 0.9;
      let x = sx, y = room.h, z = sz;
      for (let k = 0; k < 6; k++) {
        pts.push(new THREE.Vector3(x, y, z));
        x += (rng() - 0.5) * 1.9;
        z += (rng() - 0.5) * 1.9;
        y -= room.h / 5.5;
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      const tube = new THREE.TubeGeometry(curve, 14, 0.09 + rng() * 0.16, 6, false);
      const m = new THREE.Mesh(tube, mats.wood);
      m.castShadow = true;
      g.add(m);
      ctx.disposables.push(tube);
    }
  },

  bones(g, ctx) {
    const { room, mats, rng } = ctx;
    const n = 40;
    const im = new THREE.InstancedMesh(geo('boneGeo', () => new THREE.CapsuleGeometry(0.09, 0.5, 3, 6)), mats.boneMat, n);
    const mtx = new THREE.Matrix4();
    for (let i = 0; i < n; i++) {
      const p = ring(ctx, i * 2.7, n, 0.6 + rng() * 0.3, 2.0);
      mtx.compose(
        new THREE.Vector3(p.x, 0.1 + rng() * 0.35, p.z),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(rng() * 6, rng() * 6, Math.PI / 2 + (rng() - 0.5) * 0.9)),
        new THREE.Vector3(1, 0.6 + rng() * 0.9, 1)
      );
      im.setMatrixAt(i, mtx);
    }
    im.castShadow = im.receiveShadow = true;
    g.add(im);
    for (let i = 0; i < 3; i++) {
      const p = ring(ctx, i + 0.4, 3, 0.72, 0.3);
      const skull = new THREE.Mesh(geo('skull', () => new THREE.SphereGeometry(0.28, 10, 8)), mats.boneMat);
      skull.position.set(p.x, 0.26, p.z);
      skull.scale.set(1, 0.92, 1.18);
      skull.rotation.y = rng() * 6;
      skull.castShadow = true;
      g.add(skull);
    }
  },

  cages(g, ctx) {
    const { room, mats, rng } = ctx;
    const n = 4;
    for (let i = 0; i < n; i++) {
      const p = ring(ctx, i + 0.5, n, 0.68, 0.2);
      const cage = new THREE.Group();
      const bars = 8, r = 0.72, hh = 1.5;
      const bar = geo('cageBar', () => new THREE.CylinderGeometry(0.045, 0.045, 1, 5));
      const im = new THREE.InstancedMesh(bar, mats.metal, bars);
      const mtx = new THREE.Matrix4();
      for (let k = 0; k < bars; k++) {
        const a = (k / bars) * Math.PI * 2;
        mtx.compose(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r),
          new THREE.Quaternion(), new THREE.Vector3(1, hh, 1));
        im.setMatrixAt(k, mtx);
      }
      im.castShadow = true;
      cage.add(im);
      for (const y of [-hh / 2, hh / 2]) {
        const hoop = new THREE.Mesh(geo('hoop', () => new THREE.TorusGeometry(0.72, 0.05, 5, 16)), mats.metal);
        hoop.rotation.x = Math.PI / 2;
        hoop.position.y = y;
        cage.add(hoop);
      }
      const hang = room.h - 0.2 - (hh / 2 + 1.0 + rng() * 1.5);
      cage.position.set(p.x, hang, p.z);
      const chainLen = room.h - 0.2 - (hang + hh / 2);
      const ch = new THREE.Mesh(geo('chainRod', () => new THREE.CylinderGeometry(0.03, 0.03, 1, 4)), mats.metal);
      ch.scale.y = Math.max(0.1, chainLen);
      ch.position.set(p.x, hang + hh / 2 + chainLen / 2, p.z);
      g.add(ch);
      g.add(cage);
      const ph = rng() * 6;
      anim(ctx, (t) => { cage.rotation.y = Math.sin(t * 0.4 + ph) * 0.25; cage.rotation.z = Math.sin(t * 0.63 + ph) * 0.02; });
    }
  },

  forge(g, ctx) {
    const { mats, theme } = ctx;
    const z = -ctx.room.d * 0.3;
    const body = new THREE.Mesh(geo('forgeBody', () => new THREE.BoxGeometry(4.0, 2.6, 2.4)), mats.trim);
    body.position.set(0, 1.3, z);
    body.castShadow = body.receiveShadow = true;
    g.add(body);
    solid(ctx, 0, z, 2.1, 1.3);
    const mouth = new THREE.Mesh(geo('forgeMouth', () => new THREE.BoxGeometry(2.2, 1.3, 0.3)), mats.flame);
    mouth.position.set(0, 1.3, z + 1.25);
    g.add(mouth);
    const l = addLight(ctx, theme.lightPlan.color, 5.0, 22, 0, 1.4, z + 2.2, 0.3);
    g.add(l);
    const anvil = new THREE.Mesh(geo('anvil', () => new THREE.BoxGeometry(1.5, 0.5, 0.6)), mats.metal);
    anvil.position.set(2.6, 1.0, z + 2.4);
    anvil.castShadow = true;
    g.add(anvil);
    const stump = new THREE.Mesh(geo('stump', () => new THREE.CylinderGeometry(0.42, 0.5, 0.78, 9)), mats.wood);
    stump.position.set(2.6, 0.39, z + 2.4);
    stump.castShadow = true;
    g.add(stump);
    anim(ctx, (t) => {
      mouth.material.emissiveIntensity = 3.0 + Math.sin(t * 6.1) * 0.7 + Math.sin(t * 13.7) * 0.4;
    });
  },

  mirrors(g, ctx) {
    const { room, mats } = ctx;
    const n = 6;
    const mirror = new THREE.MeshStandardMaterial({ color: 0xcfd8e0, roughness: 0.06, metalness: 1.0 });
    ctx.disposables.push(mirror);
    for (let i = 0; i < n; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const z = -room.d / 2 + 3.5 + (i >> 1) * (room.d - 7) / 2;
      const frame = new THREE.Mesh(geo('mirrorFrame', () => new THREE.BoxGeometry(0.2, 3.4, 1.7)), mats.trim);
      frame.position.set(side * (room.w / 2 - 0.28), 2.0, z);
      frame.castShadow = true;
      g.add(frame);
      const pane = new THREE.Mesh(geo('mirrorPane', () => new THREE.PlaneGeometry(1.45, 3.1)), mirror);
      pane.position.set(side * (room.w / 2 - 0.4), 2.0, z);
      pane.rotation.y = -side * Math.PI / 2;
      g.add(pane);
    }
  },

  table(g, ctx) {
    const { mats, rng } = ctx;
    const top = new THREE.Mesh(geo('tableTop', () => new THREE.BoxGeometry(3.2, 0.14, 1.5)), mats.wood);
    const px = ctx.room.w * 0.22, pz = ctx.room.d * 0.24;
    top.position.set(px, 0.92, pz);
    top.castShadow = top.receiveShadow = true;
    g.add(top);
    solid(ctx, px, pz, 1.65, 0.85);
    const leg = geo('tableLeg', () => new THREE.BoxGeometry(0.15, 0.9, 0.15));
    for (let i = 0; i < 4; i++) {
      const m = new THREE.Mesh(leg, mats.wood);
      m.position.set(px + (i & 1 ? 1.45 : -1.45), 0.45, pz + (i & 2 ? 0.6 : -0.6));
      m.castShadow = true;
      g.add(m);
    }
    for (let i = 0; i < 7; i++) {
      const junk = new THREE.Mesh(
        rng() > 0.5
          ? geo('cup', () => new THREE.CylinderGeometry(0.11, 0.09, 0.22, 8))
          : geo('book', () => new THREE.BoxGeometry(0.16, 0.5, 0.42)),
        rng() > 0.5 ? mats.metal : mats.cloth
      );
      junk.position.set(px + (rng() - 0.5) * 2.7, 1.06, pz + (rng() - 0.5) * 1.1);
      junk.rotation.set(rng() > 0.6 ? Math.PI / 2 : 0, rng() * 6, 0);
      junk.castShadow = true;
      g.add(junk);
    }
  },

  well(g, ctx) {
    const { mats, theme } = ctx;
    const ring0 = new THREE.Mesh(geo('wellRing', () => new THREE.CylinderGeometry(1.6, 1.7, 0.9, 18, 1, true)), mats.stone);
    ring0.position.y = 0.45;
    ring0.castShadow = ring0.receiveShadow = true;
    g.add(ring0);
    solid(ctx, 0, 0, 1.75, 1.75);
    const lip = new THREE.Mesh(geo('wellLip', () => new THREE.TorusGeometry(1.63, 0.14, 6, 20)), mats.trim);
    lip.rotation.x = Math.PI / 2;
    lip.position.y = 0.9;
    g.add(lip);
    const inner = new THREE.Mesh(geo('wellInner', () => new THREE.CircleGeometry(1.55, 18)), mats.glow2);
    inner.rotation.x = -Math.PI / 2;
    inner.position.y = 0.05;
    g.add(inner);
    g.add(addLight(ctx, theme.accent2, 2.2, 11, 0, 0.7, 0, 0.1));
    anim(ctx, (t) => { inner.material.emissiveIntensity = 1.5 + Math.sin(t * 0.9) * 0.4; });
  },

  throne(g, ctx) {
    const { mats } = ctx;
    const z = -ctx.room.d * 0.32;
    const dais = new THREE.Mesh(geo('dais', () => new THREE.BoxGeometry(5.0, 0.5, 3.4)), mats.trim);
    dais.position.set(0, 0.25, z);
    dais.receiveShadow = dais.castShadow = true;
    g.add(dais);
    const seat = new THREE.Mesh(geo('seat', () => new THREE.BoxGeometry(1.9, 0.3, 1.6)), mats.stone);
    seat.position.set(0, 1.1, z);
    seat.castShadow = true;
    g.add(seat);
    const back = new THREE.Mesh(geo('throneBack', () => new THREE.BoxGeometry(1.9, 3.2, 0.28)), mats.stone);
    back.position.set(0, 2.6, z - 0.7);
    back.castShadow = true;
    g.add(back);
    solid(ctx, 0, z, 2.5, 1.7);
    for (const s of [-1, 1]) {
      const arm = new THREE.Mesh(geo('throneArm', () => new THREE.BoxGeometry(0.24, 0.24, 1.6)), mats.trim);
      arm.position.set(s * 0.95, 1.45, z);
      arm.castShadow = true;
      g.add(arm);
    }
  },

  stairs(g, ctx) {
    const { mats, theme } = ctx;
    const z = -ctx.room.d * 0.3;
    const steps = 9;
    const stepGeo = geo('step', () => new THREE.BoxGeometry(4.2, 0.26, 0.8));
    for (let i = 0; i < steps; i++) {
      const m = new THREE.Mesh(stepGeo, mats.trim);
      m.position.set(0, 0.13 + i * 0.26, z + i * 0.8);
      m.castShadow = m.receiveShadow = true;
      g.add(m);
    }
    const arch = new THREE.Mesh(geo('arch', () => new THREE.TorusGeometry(2.1, 0.2, 8, 18, Math.PI)), mats.trim);
    arch.position.set(0, 2.4 + steps * 0.26 * 0, z - 0.6);
    arch.castShadow = true;
    g.add(arch);
    const glowPanel = new THREE.Mesh(geo('archGlow', () => new THREE.PlaneGeometry(3.6, 3.0)), mats.glow);
    glowPanel.position.set(0, 1.6, z - 0.62);
    g.add(glowPanel);
    g.add(addLight(ctx, theme.accent, 3.4, 16, 0, 2.0, z + 1.2, 0.06));
    anim(ctx, (t) => { glowPanel.material.emissiveIntensity = 2.0 + Math.sin(t * 1.3) * 0.45; });
  },

  sarcophagi(g, ctx) {
    const { mats, rng } = ctx;
    const n = 4;
    for (let i = 0; i < n; i++) {
      const p = ring(ctx, i + 0.5, n, 0.7, 0.1);
      const box = new THREE.Mesh(geo('sarc', () => new THREE.BoxGeometry(1.1, 0.85, 2.6)), mats.stone);
      box.position.set(p.x, 0.42, p.z);
      box.rotation.y = -p.a;
      box.castShadow = box.receiveShadow = true;
      g.add(box);
      solid(ctx, p.x, p.z, 1.4, 1.4);
      const lid = new THREE.Mesh(geo('sarcLid', () => new THREE.BoxGeometry(1.25, 0.2, 2.75)), mats.trim);
      const open = rng() > 0.65;
      lid.position.set(p.x + (open ? Math.cos(-p.a) * 0.5 : 0), 0.92, p.z + (open ? 0.55 : 0));
      lid.rotation.y = -p.a + (open ? 0.22 : 0);
      lid.castShadow = true;
      g.add(lid);
    }
  },

  pipes(g, ctx) {
    const { room, mats, rng } = ctx;
    const n = 7;
    const pipe = geo('pipe', () => new THREE.CylinderGeometry(0.16, 0.16, 1, 8));
    for (let i = 0; i < n; i++) {
      const horizontal = rng() > 0.4;
      const m = new THREE.Mesh(pipe, mats.metal);
      if (horizontal) {
        const y = 1.4 + rng() * (room.h - 2.4);
        const side = rng() > 0.5 ? 1 : -1;
        m.scale.y = room.w - 1.0;
        m.rotation.z = Math.PI / 2;
        m.position.set(0, y, side * (room.d / 2 - 0.6 - rng() * 1.6));
      } else {
        const p = ring(ctx, i, n, 0.86, 0.4);
        m.scale.y = room.h - 0.3;
        m.position.set(p.x, room.h / 2, p.z);
      }
      m.castShadow = true;
      g.add(m);
      const flange = new THREE.Mesh(geo('flange', () => new THREE.TorusGeometry(0.22, 0.06, 5, 10)), mats.brass);
      flange.position.copy(m.position);
      flange.rotation.copy(m.rotation);
      flange.rotateX(Math.PI / 2);
      g.add(flange);
    }
  },

  spores(g, ctx) {
    const { room, theme, rng } = ctx;
    const n = 90;
    const pts = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pts[i * 3] = (rng() - 0.5) * room.w * 0.9;
      pts[i * 3 + 1] = 0.3 + rng() * (room.h - 0.8);
      pts[i * 3 + 2] = (rng() - 0.5) * room.d * 0.9;
    }
    const bg = new THREE.BufferGeometry();
    bg.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    const mat = new THREE.PointsMaterial({
      color: theme.particles.color, size: 0.3, transparent: true, opacity: 0.8,
      map: pointSprite(), alphaTest: 0.02,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    });
    const p = new THREE.Points(bg, mat);
    g.add(p);
    ctx.disposables.push(bg, mat);
    const base = Float32Array.from(pts);
    anim(ctx, (t) => {
      const a = bg.attributes.position.array;
      for (let i = 0; i < n; i++) {
        a[i * 3] = base[i * 3] + Math.sin(t * 0.3 + i) * 0.5;
        a[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * 0.22 + i * 1.7) * 0.7;
        a[i * 3 + 2] = base[i * 3 + 2] + Math.cos(t * 0.27 + i * 0.9) * 0.5;
      }
      bg.attributes.position.needsUpdate = true;
    });
  },

  rain(g, ctx) {
    const { room, rng } = ctx;
    const n = 320;
    const pts = new Float32Array(n * 3);
    const spd = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pts[i * 3] = (rng() - 0.5) * room.w;
      pts[i * 3 + 1] = rng() * room.h;
      pts[i * 3 + 2] = (rng() - 0.5) * room.d;
      spd[i] = 9 + rng() * 9;
    }
    const bg = new THREE.BufferGeometry();
    bg.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xbcd0e4, size: 0.1, transparent: true, opacity: 0.6,
      map: pointSprite(), alphaTest: 0.02, depthWrite: false, sizeAttenuation: true
    });
    g.add(new THREE.Points(bg, mat));
    ctx.disposables.push(bg, mat);
    let last = 0;
    anim(ctx, (t) => {
      const dt = Math.min(0.05, t - last); last = t;
      const a = bg.attributes.position.array;
      for (let i = 0; i < n; i++) {
        a[i * 3 + 1] -= spd[i] * dt;
        if (a[i * 3 + 1] < 0.05) a[i * 3 + 1] = room.h;
      }
      bg.attributes.position.needsUpdate = true;
    });
    ctx.surface = 'water';
  },

  candles(g, ctx) {
    const { room, mats, theme, rng } = ctx;
    const n = 24;
    const stick = geo('candle', () => new THREE.CylinderGeometry(0.055, 0.07, 0.42, 6));
    const im = new THREE.InstancedMesh(stick, mats.boneMat, n);
    const flameGeo = geo('smallFlame', () => new THREE.ConeGeometry(0.06, 0.18, 5));
    const fim = new THREE.InstancedMesh(flameGeo, mats.flame, n);
    const mtx = new THREE.Matrix4();
    const spots = [];
    for (let i = 0; i < n; i++) {
      const p = ring(ctx, i * 1.618, n, 0.55 + rng() * 0.38, 3.0);
      const y = rng() > 0.75 ? 0.9 + rng() * 0.6 : 0.21;
      spots.push([p.x, y, p.z]);
      mtx.compose(new THREE.Vector3(p.x, y, p.z), new THREE.Quaternion(), new THREE.Vector3(1, 0.6 + rng() * 0.9, 1));
      im.setMatrixAt(i, mtx);
      mtx.compose(new THREE.Vector3(p.x, y + 0.3, p.z), new THREE.Quaternion(), new THREE.Vector3(1, 1, 1));
      fim.setMatrixAt(i, mtx);
    }
    im.castShadow = true;
    g.add(im, fim);
    for (let i = 0; i < Math.min(3, spots.length); i++) {
      const s = spots[i * 7 % spots.length];
      g.add(addLight(ctx, theme.lightPlan.color, 1.2, 8, s[0], s[1] + 0.4, s[2], 0.5));
    }
  },

  bookstacks(g, ctx) {
    const { room, mats, rng } = ctx;
    const n = 60;
    const im = new THREE.InstancedMesh(geo('book', () => new THREE.BoxGeometry(0.16, 0.5, 0.42)), mats.cloth, n);
    const mtx = new THREE.Matrix4();
    let k = 0;
    const stacks = 9;
    for (let s = 0; s < stacks && k < n; s++) {
      const p = ring(ctx, s + rng() * 0.6, stacks, 0.5 + rng() * 0.4, 1.4);
      const h = 2 + Math.floor(rng() * 6);
      const rot = rng() * 6;
      for (let i = 0; i < h && k < n; i++) {
        mtx.compose(
          new THREE.Vector3(p.x + (rng() - 0.5) * 0.1, 0.085 + i * 0.17, p.z + (rng() - 0.5) * 0.1),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rot + (rng() - 0.5) * 0.3, Math.PI / 2)),
          new THREE.Vector3(1, 1, 1)
        );
        im.setMatrixAt(k++, mtx);
      }
    }
    for (; k < n; k++) { mtx.makeScale(0, 0, 0); im.setMatrixAt(k, mtx); }
    im.castShadow = im.receiveShadow = true;
    g.add(im);
  },

  hanginglights(g, ctx) {
    const { room, mats, theme, rng } = ctx;
    const n = room.w > 22 ? 5 : 3;
    for (let i = 0; i < n; i++) {
      const p = ring(ctx, i + 0.5, n, 0.5, 0.3);
      const drop = 1.0 + rng() * 1.4;
      const y = room.h - drop;
      const cord = new THREE.Mesh(geo('cord', () => new THREE.CylinderGeometry(0.02, 0.02, 1, 4)), mats.metal);
      cord.scale.y = drop;
      cord.position.set(p.x, room.h - drop / 2, p.z);
      g.add(cord);
      const shade = new THREE.Mesh(geo('shade', () => new THREE.ConeGeometry(0.46, 0.44, 12, 1, true)), mats.trim);
      shade.position.set(p.x, y, p.z);
      shade.castShadow = true;
      g.add(shade);
      const bulb = new THREE.Mesh(geo('bulb', () => new THREE.SphereGeometry(0.15, 8, 6)), mats.glow2);
      bulb.position.set(p.x, y - 0.22, p.z);
      g.add(bulb);
      g.add(addLight(ctx, theme.lightPlan.color, 2.4, 15, p.x, y - 0.3, p.z, 0.05));
      const ph = rng() * 6;
      anim(ctx, (t) => {
        const sw = Math.sin(t * 0.5 + ph) * 0.012;
        shade.rotation.z = sw; bulb.position.x = p.x + sw * drop;
      });
    }
  },

  glass(g, ctx) {
    const { room, mats } = ctx;
    const panes = 5;
    for (let i = 0; i < panes; i++) {
      const z = -room.d / 2 + (i + 0.5) * (room.d / panes);
      const pane = new THREE.Mesh(new THREE.PlaneGeometry(room.w - 1, room.d / panes - 0.3), mats.glassPane);
      pane.rotation.x = Math.PI / 2;
      pane.position.set(0, room.h - 0.12, z);
      g.add(pane);
      ctx.disposables.push(pane.geometry);
      const rib = new THREE.Mesh(geo('rib', () => new THREE.BoxGeometry(1, 0.16, 0.16)), mats.trim);
      rib.scale.x = room.w;
      rib.position.set(0, room.h - 0.2, z - room.d / panes / 2);
      g.add(rib);
    }
  },

  sand(g, ctx) {
    const { room, mats, rng } = ctx;
    const n = 9;
    const dune = geo('dune', () => new THREE.SphereGeometry(1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2));
    for (let i = 0; i < n; i++) {
      const m = new THREE.Mesh(dune, mats.floor);
      const p = ring(ctx, i * 1.3, n, 0.55 + rng() * 0.4, 2.2);
      m.position.set(p.x, 0, p.z);
      m.scale.set(1.2 + rng() * 2.4, 0.22 + rng() * 0.5, 1.2 + rng() * 2.4);
      m.receiveShadow = true;
      g.add(m);
    }
  },

  machine(g, ctx) {
    const { room, mats, rng, theme } = ctx;
    const base = new THREE.Mesh(geo('machBase', () => new THREE.BoxGeometry(3.0, 2.2, 1.8)), mats.trim);
    const px = -room.w * 0.26, pz = -room.d * 0.26;
    base.position.set(px, 1.1, pz);
    base.castShadow = base.receiveShadow = true;
    g.add(base);
    solid(ctx, px, pz, 1.6, 1.1);
    for (let i = 0; i < 5; i++) {
      const rod = new THREE.Mesh(geo('rod', () => new THREE.CylinderGeometry(0.07, 0.07, 1, 6)), mats.brass);
      rod.scale.y = 0.7 + rng() * 1.5;
      rod.position.set(px - 1.2 + i * 0.6, 2.2 + rod.scale.y / 2, pz);
      rod.castShadow = true;
      g.add(rod);
      const ph = i * 0.7;
      anim(ctx, (t) => { rod.position.y = 2.2 + rod.scale.y / 2 + Math.sin(t * 2.2 + ph) * 0.18; });
    }
    const dial = new THREE.Mesh(geo('dial', () => new THREE.CircleGeometry(0.5, 16)), mats.glow2);
    dial.position.set(px, 1.5, pz + 0.92);
    g.add(dial);
    g.add(addLight(ctx, theme.accent2, 1.3, 8, px, 1.5, pz + 1.6, 0.12));
    const needle = new THREE.Mesh(geo('needle', () => new THREE.BoxGeometry(0.04, 0.42, 0.02)), mats.metal);
    needle.position.set(px, 1.5, pz + 0.95);
    needle.geometry.translate(0, 0.21, 0);
    g.add(needle);
    anim(ctx, (t) => { needle.rotation.z = Math.sin(t * 0.8) * 2.2; });
  }
};

export function buildProps(names, ctx) {
  const group = new THREE.Group();
  for (const name of names || []) {
    const fn = PROPS[name];
    if (!fn) continue;
    const sub = new THREE.Group();
    try { fn(sub, ctx); } catch (e) { console.warn('prop failed:', name, e); }
    group.add(sub);
  }
  return group;
}

export const PROP_NAMES = Object.keys(PROPS);
