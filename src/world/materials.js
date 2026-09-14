// Themed material factory. One instance per floor; disposes everything on teardown.

import * as THREE from 'three';
import * as Tex from '../engine/textures.js';
import * as Settings from '../engine/settings.js';

export class MaterialSet {
  constructor(theme) {
    this.theme = theme;
    this.owned = [];
    this.size = Settings.textureSize();
    const m = theme.materials;
    this.floor = this.surface(m.floor, 'floor');
    this.wall = this.surface(m.wall, 'wall');
    this.ceiling = this.surface(m.ceiling, 'ceiling');
    this.trim = this.surface(m.trim, 'trim');

    this.stone = this.simple(0x6d6a64, 0.9, 0.02);
    this.darkStone = this.simple(0x3a3833, 0.95, 0.02);
    this.metal = this.simple(0x8a8f96, 0.35, 0.85);
    this.brass = this.simple(0xb08a3c, 0.3, 0.92);
    this.wood = this.simple(0x6b4d2e, 0.78, 0.04);
    this.boneMat = this.simple(0xcfc6ae, 0.72, 0.02);
    this.cloth = this.simple(0x5a4a6a, 0.95, 0.0);
    this.rope = this.simple(0x8a7550, 0.95, 0.0);

    this.glow = this.emissive(theme.accent, 1.7);
    this.glow2 = this.emissive(theme.accent2, 1.4);
    this.flame = this.emissive(theme.lightPlan.color, 2.3);
    this.doorMat = this.simple(theme.doorColor, 0.62, 0.28);
    this.doorLocked = this.simple(new THREE.Color(theme.doorColor).multiplyScalar(0.55).getHex(), 0.5, 0.55);
    this.doorLocked.emissive = new THREE.Color(0x2a0806);
    this.doorLocked.emissiveIntensity = 0.22;

    this.water = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(theme.accent).multiplyScalar(0.28),
      roughness: 0.08, metalness: 0.0, transmission: 0.55, thickness: 1.2,
      transparent: true, opacity: 0.82, ior: 1.33,
      side: THREE.DoubleSide
    });
    this.owned.push(this.water);

    this.glassPane = new THREE.MeshPhysicalMaterial({
      color: 0xbcd4dc, roughness: 0.12, metalness: 0.0, transmission: 0.9,
      thickness: 0.4, transparent: true, opacity: 0.35, side: THREE.DoubleSide
    });
    this.owned.push(this.glassPane);
  }

  // The texture repeat is left at 1 here; the builder scales each mesh's UVs by
  // its real world size so texel density stays constant whether a room is 8
  // metres across or 34.
  surface(spec, role) {
    const t = Tex.texturesFor(spec.tex, this.size, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: spec.color,
      roughness: spec.roughness,
      metalness: spec.metalness,
      map: t.map,
      normalMap: t.normalMap,
      roughnessMap: t.roughnessMap,
      normalScale: new THREE.Vector2(0.75, 0.75)
    });
    mat.userData.density = (spec.scale * (role === 'ceiling' ? 1.2 : 1)) / 10;
    this.owned.push(mat, t.map, t.normalMap, t.roughnessMap);
    return mat;
  }

  simple(color, roughness, metalness) {
    const m = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    this.owned.push(m);
    return m;
  }

  emissive(color, intensity) {
    const m = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a, emissive: new THREE.Color(color), emissiveIntensity: intensity,
      roughness: 0.5, metalness: 0.0
    });
    this.owned.push(m);
    return m;
  }

  // A one-off tinted emissive (for NPC glow, item sparkles, crystals...).
  tinted(color, intensity = 2.0) {
    return this.emissive(color, intensity);
  }

  tintedStandard(color, roughness = 0.8, metalness = 0.0) {
    return this.simple(color, roughness, metalness);
  }

  dispose() {
    for (const o of this.owned) { try { o.dispose(); } catch (e) { /* ignore */ } }
    this.owned.length = 0;
  }
}
