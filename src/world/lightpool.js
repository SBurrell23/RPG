// A fixed pool of point lights.
//
// This exists because of how three.js compiles shaders. The number of visible
// point lights, and the number of those that cast shadows, are both baked into
// every material's program key. Change either one and three.js must compile a
// brand new program for every material in the scene — which it does lazily,
// inside the render call, freezing the frame for seconds at a time.
//
// The old approach lit rooms by toggling `visible` and `castShadow` on hundreds
// of individual fixture lights as the player walked. That meant the counts moved
// constantly, and a walk through seven rooms compiled 86 programs with stalls up
// to 1.9 seconds.
//
// So: allocate N lights once, keep every one of them visible forever, fix which
// K of them cast shadows, and light the world by *moving* them and changing
// their colour and intensity. Unused slots sit at intensity 0. The permutation
// never moves, so everything compiles once, during the loading screen.

import * as THREE from 'three';

export class LightPool {
  constructor(scene, { count, shadowCount, shadowMapSize }) {
    this.scene = scene;
    this.count = Math.max(1, count);
    this.shadowCount = Math.max(0, Math.min(shadowCount, this.count));
    this.lights = [];
    this.assigned = new Array(this.count).fill(null);

    for (let i = 0; i < this.count; i++) {
      const l = new THREE.PointLight(0xffffff, 0, 12, 2);
      // Neither of these is ever touched again for the life of the pool.
      l.visible = true;
      l.castShadow = i < this.shadowCount && shadowMapSize > 0;
      if (l.castShadow) {
        l.shadow.mapSize.set(shadowMapSize, shadowMapSize);
        l.shadow.camera.near = 0.3;
        l.shadow.camera.far = 24;
        l.shadow.bias = -0.004;
        l.shadow.normalBias = 0.035;
      }
      l.matrixAutoUpdate = true;
      scene.add(l);
      this.lights.push(l);
    }
  }

  // `descs` is the chosen set, nearest first, shadow-worthy entries at the front.
  // Returns true if any slot changed target, so the caller can refresh shadows.
  assign(descs) {
    let changed = false;
    for (let i = 0; i < this.count; i++) {
      const d = descs[i] || null;
      const l = this.lights[i];

      if (this.assigned[i] !== d) {
        this.assigned[i] = d;
        changed = true;
        if (d) {
          l.position.set(d.x, d.y, d.z);
          l.color.copy(d.color);
          l.distance = d.distance;
          if (l.castShadow) {
            const far = Math.max(4, d.distance);
            if (l.shadow.camera.far !== far) {
              l.shadow.camera.far = far;
              l.shadow.camera.updateProjectionMatrix();
            }
          }
        }
      }
      if (!d) l.intensity = 0;
    }
    return changed;
  }

  // Per-frame flicker. Only touches intensity, which is free.
  animate(t) {
    for (let i = 0; i < this.count; i++) {
      const d = this.assigned[i];
      if (!d) continue;
      const l = this.lights[i];
      if (d.flicker > 0) {
        const s = d.seed;
        const n = Math.sin(t * 13.1 + s) * 0.5 + Math.sin(t * 27.7 + s * 1.7) * 0.3 + Math.sin(t * 5.3 + s) * 0.2;
        l.intensity = d.base * (1 + n * d.flicker);
      } else if (l.intensity !== d.base) {
        l.intensity = d.base;
      }
    }
  }

  dispose() {
    for (const l of this.lights) {
      if (l.shadow && l.shadow.map) { l.shadow.map.dispose(); l.shadow.map = null; }
      this.scene.remove(l);
      l.dispose();
    }
    this.lights.length = 0;
    this.assigned.length = 0;
  }
}
