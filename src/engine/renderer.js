// Render pipeline. Always runs through the composer so MSAA, bloom and the
// tone-mapped output pass behave identically regardless of which options are on.
//
// The WebGL context is created exactly once (a canvas can only ever have one).
// MSAA is taken from the composer's multisampled render target rather than from
// context attributes, so anti-aliasing can be changed live by rebuilding only
// the composer.

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import * as Settings from './settings.js';
import * as Tex from './textures.js';

export class Renderer {
  constructor(canvas, scene, camera) {
    this.canvas = canvas;
    this.scene = scene;
    this.camera = camera;
    this.theme = null;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false,
      alpha: false
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.applyShadowSettings();
    this.applyAnisotropy();
    this.applyPixelRatio();
    this.rebuildComposer();

    window.addEventListener('resize', () => this.resize());
  }

  applyShadowSettings() {
    const size = Settings.shadowMapSize();
    this.renderer.shadowMap.enabled = size > 0;
    this.renderer.shadowMap.type = size >= 4096 ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
    // Point-light shadows are cube maps: six faces of the scene per light, per
    // frame. The dungeon is static, so render them only when a light actually
    // moves to a new fixture (see requestShadowUpdate).
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.needsUpdate = true;
  }

  requestShadowUpdate() {
    this.renderer.shadowMap.needsUpdate = true;
  }

  // Compiles every program the scene needs, up front, so three.js never has to
  // do it inside a render call while the player is walking around.
  precompile(scene, camera) {
    this.renderer.compile(scene, camera);
  }

  applyAnisotropy() {
    Tex.setAnisotropyCap(Math.min(
      Settings.get('anisotropy'),
      this.renderer.capabilities.getMaxAnisotropy()
    ));
  }

  applyPixelRatio() {
    const scale = Settings.get('resolution');
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2) * scale);
  }

  rebuildComposer() {
    if (this.composer) this.composer.dispose();
    const samples = Settings.msaaSamples();
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    const rt = new THREE.WebGLRenderTarget(Math.max(1, size.x), Math.max(1, size.y), {
      type: THREE.HalfFloatType,
      samples
    });
    this.composer = new EffectComposer(this.renderer, rt);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), 0.6, 0.8, 0.6);
    this.composer.addPass(this.bloomPass);

    this.fxaaPass = null;
    if (Settings.useFxaa()) {
      this.fxaaPass = new ShaderPass(FXAAShader);
      this.composer.addPass(this.fxaaPass);
    }

    this.composer.addPass(new OutputPass());
    this.applyBloom();
    this.resize();
  }

  applyBloom() {
    if (!this.bloomPass) return;
    const scale = Settings.bloomScale();
    const spec = (this.theme && this.theme.bloom) || { strength: 0.6, radius: 0.8, threshold: 0.6 };
    this.bloomPass.enabled = scale > 0;
    this.bloomPass.strength = spec.strength * scale;
    this.bloomPass.radius = spec.radius;
    this.bloomPass.threshold = spec.threshold;
  }

  setTheme(theme) {
    this.theme = theme;
    this.renderer.toneMappingExposure = theme.exposure;
    this.applyBloom();
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.applyPixelRatio();
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    if (this.bloomPass) this.bloomPass.setSize(size.x, size.y);
    if (this.fxaaPass) this.fxaaPass.material.uniforms.resolution.value.set(1 / size.x, 1 / size.y);
  }

  // Returns 'refloor' when the caller needs to rebuild the world (new textures).
  onSettingsChange(ev) {
    const id = ev.id;
    const all = id === '*';

    if (all || id === 'antialias') this.rebuildComposer();
    if (all || id === 'resolution') { this.resize(); }
    if (all || id === 'bloom') this.applyBloom();
    if (all || id === 'anisotropy') this.applyAnisotropy();
    if (all || id === 'shadows') {
      this.applyShadowSettings();
      this.scene.traverse((o) => {
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          for (const m of mats) m.needsUpdate = true;
        }
      });
      return 'refloor';   // the light pool is sized from this
    }
    if (all || id === 'lights') return 'refloor';
    if (all || id === 'fov') {
      this.camera.fov = Settings.get('fov');
      this.camera.updateProjectionMatrix();
    }
    if (all || id === 'textures') {
      Tex.clearCache();
      return 'refloor';
    }
    if (all || id === 'particles') return 'refloor';
    return 'ok';
  }

  render() { this.composer.render(); }

  get info() { return this.renderer.info; }
}

// Frame pacing that respects the FPS cap without drifting into half-rate.
export class FrameClock {
  constructor() {
    this.last = performance.now();
    this.fps = 0;
    this.samples = [];
  }

  tick() {
    const now = performance.now();
    let dt = (now - this.last) / 1000;
    const cap = Settings.get('fpsCap');
    if (cap > 0 && dt < (1 / cap) - 0.0015) return null;
    this.last = now;
    dt = Math.min(dt, 0.1);
    this.samples.push(dt);
    if (this.samples.length > 30) this.samples.shift();
    const avg = this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
    this.fps = avg > 0 ? 1 / avg : 0;
    return dt;
  }
}
