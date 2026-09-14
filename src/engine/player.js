// First-person controller: pointer-lock look, collide-and-slide movement,
// view bob, footstep timing, and the lantern the player carries.

import * as THREE from 'three';
import * as Settings from './settings.js';
import * as Audio from './audio.js';

const EYE = 1.68;
const WALK = 4.3;
const RUN = 7.0;
const ACCEL = 34;
const FRICTION = 12;

export class Player {
  constructor(camera, canvas) {
    this.camera = camera;
    this.canvas = canvas;
    this.pos = new THREE.Vector3(0, EYE, 0);
    this.vel = new THREE.Vector3();
    this.yaw = 0;
    this.pitch = 0;
    this.bob = 0;
    this.stepAccum = 0;
    this.locked = false;
    this.enabled = true;
    this.keys = new Set();
    this.surface = 'stone';

    this.lantern = new THREE.PointLight(0xffc98a, 11, 12, 2);
    this.lantern.position.set(0.4, -0.25, 0.1);
    camera.add(this.lantern);

    this._onMouseMove = this.onMouseMove.bind(this);
    this._onKeyDown = this.onKeyDown.bind(this);
    this._onKeyUp = this.onKeyUp.bind(this);

    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === canvas;
      if (this.onLockChange) this.onLockChange(this.locked);
    });
    document.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('blur', () => this.keys.clear());
  }

  requestLock() {
    if (!this.locked && this.canvas.requestPointerLock) {
      const p = this.canvas.requestPointerLock();
      if (p && p.catch) p.catch(() => {});
    }
  }

  releaseLock() {
    if (document.pointerLockElement) document.exitPointerLock();
  }

  onMouseMove(e) {
    if (!this.locked || !this.enabled) return;
    const s = Settings.get('sensitivity') * 0.0022;
    this.yaw -= e.movementX * s;
    this.pitch -= e.movementY * s * (Settings.get('invertY') ? -1 : 1);
    const lim = Math.PI / 2 - 0.04;
    this.pitch = Math.max(-lim, Math.min(lim, this.pitch));
  }

  onKeyDown(e) {
    this.keys.add(e.code);
  }

  onKeyUp(e) {
    this.keys.delete(e.code);
  }

  setPosition(x, z, yaw) {
    this.pos.set(x, EYE, z);
    this.vel.set(0, 0, 0);
    if (yaw !== undefined) this.yaw = yaw;
    this.syncCamera(0);
  }

  moving() {
    return this.vel.lengthSq() > 0.6;
  }

  update(dt, world) {
    const k = this.keys;
    let fx = 0, fz = 0;
    if (this.enabled && this.locked) {
      if (k.has('KeyW') || k.has('ArrowUp')) fz += 1;
      if (k.has('KeyS') || k.has('ArrowDown')) fz -= 1;
      if (k.has('KeyA') || k.has('ArrowLeft')) fx -= 1;
      if (k.has('KeyD') || k.has('ArrowRight')) fx += 1;
    }

    const run = k.has('ShiftLeft') || k.has('ShiftRight');
    const speed = run ? RUN : WALK;

    if (fx || fz) {
      const len = Math.hypot(fx, fz);
      fx /= len; fz /= len;
      const sin = Math.sin(this.yaw), cos = Math.cos(this.yaw);
      // forward is -Z in view space
      const wx = fx * cos - fz * sin;
      const wz = -fx * sin - fz * cos;
      this.vel.x += wx * ACCEL * dt;
      this.vel.z += wz * ACCEL * dt;
      const sp = Math.hypot(this.vel.x, this.vel.z);
      if (sp > speed) { this.vel.x *= speed / sp; this.vel.z *= speed / sp; }
    } else {
      const drop = FRICTION * dt;
      const sp = Math.hypot(this.vel.x, this.vel.z);
      if (sp > 0) {
        const f = Math.max(0, sp - drop * Math.max(1, sp * 0.35)) / sp;
        this.vel.x *= f; this.vel.z *= f;
      }
    }

    if (world && (Math.abs(this.vel.x) > 0.0001 || Math.abs(this.vel.z) > 0.0001)) {
      const next = world.resolveMove(
        { x: this.pos.x, z: this.pos.z },
        { x: this.vel.x * dt, z: this.vel.z * dt }
      );
      // if we got stopped, kill that component so we don't build up pressure
      if (Math.abs(next.x - this.pos.x) < Math.abs(this.vel.x * dt) * 0.5) this.vel.x *= 0.2;
      if (Math.abs(next.z - this.pos.z) < Math.abs(this.vel.z * dt) * 0.5) this.vel.z *= 0.2;
      this.pos.x = next.x;
      this.pos.z = next.z;
    }

    // footsteps and head bob follow distance travelled, not time
    const sp = Math.hypot(this.vel.x, this.vel.z);
    if (sp > 0.7) {
      this.stepAccum += sp * dt;
      const stride = run ? 1.9 : 1.55;
      if (this.stepAccum >= stride) {
        this.stepAccum -= stride;
        Audio.play('step', this.surface);
      }
      this.bob += sp * dt * 2.1;
    } else {
      this.stepAccum = Math.min(this.stepAccum, 1.2);
      this.bob += dt * 0.6;
    }

    this.syncCamera(sp);
  }

  syncCamera(speed) {
    const c = this.camera;
    c.rotation.order = 'YXZ';
    c.rotation.y = this.yaw;
    c.rotation.x = this.pitch;
    c.rotation.z = 0;

    let y = this.pos.y;
    let roll = 0;
    if (Settings.get('viewBob') && speed > 0.7) {
      const amp = Math.min(0.055, 0.016 + speed * 0.006);
      y += Math.sin(this.bob * Math.PI) * amp;
      roll = Math.sin(this.bob * Math.PI * 0.5) * 0.006 * Math.min(1, speed / 5);
    }
    c.position.set(this.pos.x, y, this.pos.z);
    c.rotation.z = roll;

    this.lantern.intensity = 10.5 + Math.sin(performance.now() * 0.004) * 0.9;
  }

  // Finds the NPC the player is looking at, if any is close enough.
  findTarget(world, roomId) {
    if (!world || !roomId) return null;
    const npc = world.npcs.get(roomId);
    if (!npc) return null;
    const p = new THREE.Vector3();
    npc.group.getWorldPosition(p);
    p.y = this.pos.y;
    const d = p.distanceTo(this.pos);
    if (d > 5.2) return null;
    const dir = p.clone().sub(this.pos).normalize();
    const look = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, this.yaw, 0, 'YXZ'));
    if (dir.dot(look) < 0.45) return null;
    return { npc, distance: d, roomId };
  }

  dispose() {
    document.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
  }
}

export { EYE };
