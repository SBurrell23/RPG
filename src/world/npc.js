// Procedural NPC figures. Twelve body forms, each assembled from primitives and
// tinted by the palette the story file gives them. Nothing here is a loaded model.

import * as THREE from 'three';
import { pointSprite } from './../engine/textures.js';

function col(hex, fallback) {
  try { return new THREE.Color(hex || fallback); } catch (e) { return new THREE.Color(fallback); }
}

export function createNpc(def, theme) {
  const pal = def.palette || {};
  const robeC = col(pal.robe, 0x3a3a48);
  const trimC = col(pal.trim, robeC.clone().offsetHSL(0, 0, 0.18).getHex());
  const skinC = col(pal.skin, 0xcdb89c);
  const glowC = col(pal.glow, theme.accent);

  const owned = [];
  const mk = (c, r, m) => {
    const mat = new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
    owned.push(mat);
    return mat;
  };
  const mkGlow = (c, i) => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0b0b0f, emissive: c, emissiveIntensity: i, roughness: 0.4, metalness: 0
    });
    owned.push(mat);
    return mat;
  };

  const robe = mk(robeC, 0.92, 0.02);
  const trim = mk(trimC, 0.6, 0.25);
  const skin = mk(skinC, 0.78, 0.0);
  const glow = mkGlow(glowC, 2.6);
  const dark = mk(robeC.clone().multiplyScalar(0.45), 0.95, 0.0);

  const g = new THREE.Group();
  const parts = {};
  const form = def.form || 'robed';

  const G = (geoFn) => { const x = geoFn(); owned.push(x); return x; };

  function humanoid(o = {}) {
    const {
      height = 1.75, girth = 0.42, hunch = 0, hood = true,
      headR = 0.2, armLen = 0.62, legs = true
    } = o;
    const bodyH = height * 0.52;
    const body = new THREE.Mesh(G(() => new THREE.ConeGeometry(girth + 0.16, bodyH + 0.5, 12, 1, false)), robe);
    body.position.y = (bodyH + 0.5) / 2;
    body.castShadow = true;
    g.add(body);
    parts.body = body;

    const torso = new THREE.Mesh(G(() => new THREE.CapsuleGeometry(girth * 0.62, bodyH * 0.42, 4, 10)), robe);
    torso.position.y = height * 0.66;
    torso.castShadow = true;
    g.add(torso);

    const neck = new THREE.Mesh(G(() => new THREE.CylinderGeometry(0.075, 0.09, 0.14, 8)), skin);
    neck.position.y = height * 0.86;
    g.add(neck);

    const head = new THREE.Mesh(G(() => new THREE.SphereGeometry(headR, 14, 12)), skin);
    head.position.y = height * 0.93;
    head.scale.set(0.92, 1.06, 0.96);
    head.castShadow = true;
    g.add(head);
    parts.head = head;

    if (hood) {
      const h = new THREE.Mesh(G(() => new THREE.ConeGeometry(headR + 0.13, 0.46, 12, 1, true)), trim);
      h.position.y = height * 0.965;
      h.castShadow = true;
      g.add(h);
      parts.hood = h;
    }

    parts.arms = [];
    for (const s of [-1, 1]) {
      const arm = new THREE.Mesh(G(() => new THREE.CapsuleGeometry(0.075, armLen, 3, 7)), robe);
      arm.position.set(s * (girth * 0.78), height * 0.66, 0);
      arm.rotation.z = s * 0.16;
      arm.castShadow = true;
      g.add(arm);
      parts.arms.push(arm);
      const hand = new THREE.Mesh(G(() => new THREE.SphereGeometry(0.062, 7, 6)), skin);
      hand.position.set(s * (girth * 0.86), height * 0.66 - armLen * 0.62, 0.04);
      g.add(hand);
    }

    if (legs) {
      for (const s of [-1, 1]) {
        const leg = new THREE.Mesh(G(() => new THREE.CapsuleGeometry(0.085, 0.42, 3, 7)), dark);
        leg.position.set(s * 0.12, 0.28, 0);
        g.add(leg);
      }
    }

    g.rotation.x = 0;
    if (hunch) {
      torso.rotation.x = hunch;
      head.position.z += Math.sin(hunch) * 0.28;
      head.position.y -= 0.1 * hunch;
      if (parts.hood) { parts.hood.position.copy(head.position); parts.hood.position.y += height * 0.035; }
    }
    return { body, torso, head };
  }

  let update = () => {};
  const seed = Math.random() * 10;

  switch (form) {
    case 'hunched': {
      const h = humanoid({ height: 1.5, girth: 0.46, hunch: 0.42, headR: 0.19 });
      update = (t) => {
        h.torso.rotation.x = 0.42 + Math.sin(t * 0.9 + seed) * 0.035;
        h.head.rotation.y = Math.sin(t * 0.4 + seed) * 0.22;
      };
      break;
    }
    case 'tall': {
      const h = humanoid({ height: 2.55, girth: 0.36, headR: 0.18, armLen: 0.86 });
      update = (t) => {
        g.position.y = Math.sin(t * 0.55 + seed) * 0.025;
        h.head.rotation.z = Math.sin(t * 0.33 + seed) * 0.1;
      };
      break;
    }
    case 'floating': {
      const h = humanoid({ height: 1.8, girth: 0.44, legs: false });
      const trail = new THREE.Mesh(G(() => new THREE.ConeGeometry(0.5, 1.3, 12, 1, true)), dark);
      trail.position.y = -0.2;
      trail.rotation.x = Math.PI;
      g.add(trail);
      update = (t) => {
        g.position.y = 0.55 + Math.sin(t * 0.8 + seed) * 0.12;
        g.rotation.y = Math.sin(t * 0.25 + seed) * 0.14;
        trail.scale.x = trail.scale.z = 1 + Math.sin(t * 1.4 + seed) * 0.07;
      };
      break;
    }
    case 'armored': {
      const h = humanoid({ height: 1.9, girth: 0.5, hood: false, headR: 0.2 });
      const helm = new THREE.Mesh(G(() => new THREE.CylinderGeometry(0.24, 0.26, 0.36, 8)), trim);
      helm.position.y = 1.9 * 0.94;
      helm.castShadow = true;
      g.add(helm);
      const slit = new THREE.Mesh(G(() => new THREE.BoxGeometry(0.3, 0.045, 0.05)), glow);
      slit.position.set(0, 1.9 * 0.95, 0.25);
      g.add(slit);
      for (const s of [-1, 1]) {
        const pauldron = new THREE.Mesh(G(() => new THREE.SphereGeometry(0.19, 9, 7, 0, Math.PI * 2, 0, Math.PI / 2)), trim);
        pauldron.position.set(s * 0.42, 1.9 * 0.74, 0);
        pauldron.castShadow = true;
        g.add(pauldron);
      }
      update = (t) => {
        h.torso.rotation.y = Math.sin(t * 0.4 + seed) * 0.06;
        slit.material.emissiveIntensity = 2.2 + Math.sin(t * 2.1 + seed) * 0.5;
      };
      break;
    }
    case 'beast': {
      const body = new THREE.Mesh(G(() => new THREE.CapsuleGeometry(0.44, 1.05, 5, 12)), robe);
      body.rotation.z = Math.PI / 2;
      body.position.y = 0.78;
      body.castShadow = true;
      g.add(body);
      const head = new THREE.Mesh(G(() => new THREE.ConeGeometry(0.3, 0.72, 10)), robe);
      head.rotation.x = Math.PI / 2;
      head.position.set(0, 0.88, 0.82);
      head.castShadow = true;
      g.add(head);
      const eyes = new THREE.Mesh(G(() => new THREE.SphereGeometry(0.055, 7, 6)), glow);
      eyes.position.set(0.11, 0.98, 0.86);
      g.add(eyes);
      const eyes2 = eyes.clone(); eyes2.position.x = -0.11; g.add(eyes2);
      for (let i = 0; i < 4; i++) {
        const leg = new THREE.Mesh(G(() => new THREE.CapsuleGeometry(0.085, 0.5, 3, 6)), dark);
        leg.position.set((i & 1 ? 0.3 : -0.3), 0.3, (i & 2 ? 0.46 : -0.46));
        leg.castShadow = true;
        g.add(leg);
      }
      update = (t) => {
        body.position.y = 0.78 + Math.sin(t * 1.5 + seed) * 0.03;
        head.rotation.z = Math.sin(t * 0.6 + seed) * 0.16;
      };
      break;
    }
    case 'child': {
      const h = humanoid({ height: 1.15, girth: 0.3, headR: 0.2, armLen: 0.4 });
      update = (t) => {
        g.position.y = Math.abs(Math.sin(t * 1.1 + seed)) * 0.035;
        h.head.rotation.y = Math.sin(t * 0.8 + seed) * 0.35;
      };
      break;
    }
    case 'construct': {
      const core = new THREE.Mesh(G(() => new THREE.IcosahedronGeometry(0.3, 1)), glow);
      core.position.y = 1.1;
      g.add(core);
      const shellGeo = G(() => new THREE.TorusGeometry(0.55, 0.07, 6, 20));
      for (let i = 0; i < 3; i++) {
        const ringM = new THREE.Mesh(shellGeo, trim);
        ringM.position.y = 1.1;
        ringM.rotation.set(i * 1.1, i * 0.7, 0);
        ringM.castShadow = true;
        g.add(ringM);
        parts['ring' + i] = ringM;
      }
      const column = new THREE.Mesh(G(() => new THREE.CylinderGeometry(0.2, 0.34, 0.95, 8)), robe);
      column.position.y = 0.47;
      column.castShadow = true;
      g.add(column);
      update = (t) => {
        core.rotation.set(t * 0.5, t * 0.7, 0);
        core.material.emissiveIntensity = 2.2 + Math.sin(t * 1.7 + seed) * 0.6;
        for (let i = 0; i < 3; i++) parts['ring' + i].rotation.z = t * (0.2 + i * 0.16) * (i % 2 ? -1 : 1);
      };
      break;
    }
    case 'wisp': {
      const n = 26;
      const pts = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        pts[i * 3] = (Math.random() - 0.5) * 0.7;
        pts[i * 3 + 1] = 0.7 + Math.random() * 1.0;
        pts[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
      }
      const bg = new THREE.BufferGeometry();
      bg.setAttribute('position', new THREE.BufferAttribute(pts, 3));
      owned.push(bg);
      const pm = new THREE.PointsMaterial({
        color: glowC, size: 0.26, transparent: true, opacity: 0.95,
        map: pointSprite(), alphaTest: 0.02,
        blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true
      });
      owned.push(pm);
      const cloud = new THREE.Points(bg, pm);
      g.add(cloud);
      const shroud = new THREE.Mesh(G(() => new THREE.ConeGeometry(0.42, 1.5, 10, 1, true)), dark);
      shroud.material = new THREE.MeshStandardMaterial({
        color: robeC, transparent: true, opacity: 0.3, roughness: 1, side: THREE.DoubleSide
      });
      owned.push(shroud.material);
      shroud.position.y = 0.9;
      g.add(shroud);
      const base = Float32Array.from(pts);
      update = (t) => {
        const a = bg.attributes.position.array;
        for (let i = 0; i < n; i++) {
          a[i * 3] = base[i * 3] + Math.sin(t * 1.3 + i) * 0.14;
          a[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * 0.9 + i * 1.3) * 0.16;
          a[i * 3 + 2] = base[i * 3 + 2] + Math.cos(t * 1.1 + i * 0.7) * 0.14;
        }
        bg.attributes.position.needsUpdate = true;
        shroud.scale.setScalar(1 + Math.sin(t * 0.7) * 0.05);
      };
      break;
    }
    case 'twin': {
      const made = [];
      for (const s of [-1, 1]) {
        const sub = new THREE.Group();
        const body = new THREE.Mesh(G(() => new THREE.ConeGeometry(0.3, 1.35, 10)), s < 0 ? robe : trim);
        body.position.y = 0.67; body.castShadow = true; sub.add(body);
        const head = new THREE.Mesh(G(() => new THREE.SphereGeometry(0.17, 12, 10)), skin);
        head.position.y = 1.46; head.castShadow = true; sub.add(head);
        const hd = new THREE.Mesh(G(() => new THREE.ConeGeometry(0.24, 0.34, 10, 1, true)), s < 0 ? trim : robe);
        hd.position.y = 1.52; sub.add(hd);
        sub.position.set(s * 0.42, 0, s * 0.12);
        sub.rotation.y = -s * 0.3;
        g.add(sub);
        made.push({ sub, head });
      }
      update = (t) => {
        made[0].sub.position.y = Math.sin(t * 0.9 + seed) * 0.02;
        made[1].sub.position.y = Math.sin(t * 0.9 + seed + Math.PI) * 0.02;
        made[0].head.rotation.y = Math.sin(t * 0.5) * 0.2;
        made[1].head.rotation.y = -Math.sin(t * 0.5) * 0.2;
      };
      break;
    }
    case 'winged': {
      const h = humanoid({ height: 1.95, girth: 0.4, headR: 0.19 });
      const wingGeo = G(() => new THREE.PlaneGeometry(1.5, 0.95, 4, 3));
      const wingMat = new THREE.MeshStandardMaterial({
        color: trimC, roughness: 0.85, side: THREE.DoubleSide, transparent: true, opacity: 0.88
      });
      owned.push(wingMat);
      const wings = [];
      for (const s of [-1, 1]) {
        const w = new THREE.Mesh(wingGeo, wingMat);
        w.position.set(s * 0.72, 1.4, -0.2);
        w.rotation.set(0.2, s * 0.9, s * 0.25);
        w.castShadow = true;
        g.add(w);
        wings.push(w);
      }
      update = (t) => {
        wings.forEach((w, i) => {
          const s = i === 0 ? -1 : 1;
          w.rotation.y = s * (0.9 + Math.sin(t * 0.8 + seed) * 0.13);
        });
        h.head.rotation.x = Math.sin(t * 0.4) * 0.08;
      };
      break;
    }
    case 'coiled': {
      const segs = 9;
      const list = [];
      for (let i = 0; i < segs; i++) {
        const r = 0.46 - i * 0.035;
        const seg = new THREE.Mesh(G(() => new THREE.TorusGeometry(r, 0.15, 7, 16)), i % 2 ? robe : trim);
        seg.rotation.x = Math.PI / 2;
        seg.position.y = 0.2 + i * 0.19;
        seg.castShadow = true;
        g.add(seg);
        list.push(seg);
      }
      const head = new THREE.Mesh(G(() => new THREE.ConeGeometry(0.19, 0.5, 9)), robe);
      head.position.y = 0.2 + segs * 0.19 + 0.18;
      head.rotation.x = Math.PI / 2.6;
      head.castShadow = true;
      g.add(head);
      const eye = new THREE.Mesh(G(() => new THREE.SphereGeometry(0.05, 7, 6)), glow);
      eye.position.set(0.08, head.position.y + 0.05, 0.2);
      g.add(eye);
      update = (t) => {
        list.forEach((s, i) => { s.position.x = Math.sin(t * 0.7 + i * 0.5 + seed) * 0.07; });
        head.position.x = Math.sin(t * 0.7 + segs * 0.5 + seed) * 0.09;
        eye.position.x = head.position.x + 0.08;
      };
      break;
    }
    case 'robed':
    default: {
      const h = humanoid({ height: 1.8, girth: 0.44, headR: 0.2 });
      update = (t) => {
        h.torso.rotation.y = Math.sin(t * 0.45 + seed) * 0.09;
        h.head.rotation.y = Math.sin(t * 0.32 + seed) * 0.2;
        g.position.y = Math.sin(t * 0.7 + seed) * 0.012;
      };
      break;
    }
  }

  // Every NPC reads against the dark by way of a small personal light, but the
  // light itself is owned by the floor's light pool rather than by this group —
  // see lightpool.js. We only report where it should be and what colour.

  const label = makeLabel(def, glowC);
  label.position.y = form === 'tall' ? 3.0 : form === 'beast' || form === 'child' ? 1.65 : 2.35;
  g.add(label);
  owned.push(label.material.map, label.material);

  return {
    group: g,
    label,
    glowColor: glowC,
    update,
    dispose() {
      for (const o of owned) { try { o.dispose(); } catch (e) { /* ignore */ } }
      owned.length = 0;
    }
  };
}

function makeLabel(def, glowC) {
  const name = def.name || '';
  const title = def.title || '';
  const pad = 24;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  ctx.font = '600 44px Georgia, serif';
  const w1 = ctx.measureText(name).width;
  ctx.font = 'italic 30px Georgia, serif';
  const w2 = title ? ctx.measureText(title).width : 0;
  const width = Math.ceil(Math.max(w1, w2) + pad * 2);
  const height = title ? 118 : 76;
  c.width = Math.max(4, width);
  c.height = height;

  const g = ctx.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0, 'rgba(8,10,14,0.0)');
  g.addColorStop(0.5, 'rgba(8,10,14,0.55)');
  g.addColorStop(1, 'rgba(8,10,14,0.0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.width, c.height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#f2ece0';
  ctx.font = '600 44px Georgia, serif';
  ctx.fillText(name, c.width / 2, title ? 38 : height / 2);
  if (title) {
    ctx.fillStyle = '#' + new THREE.Color(glowC).getHexString();
    ctx.font = 'italic 30px Georgia, serif';
    ctx.fillText(title, c.width / 2, 84);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: true });
  const sprite = new THREE.Sprite(mat);
  const scale = 0.0042;
  sprite.scale.set(c.width * scale, c.height * scale, 1);
  return sprite;
}
