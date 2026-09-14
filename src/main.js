// The Verrow — entry point and game controller.

import * as THREE from 'three';
import { Renderer, FrameClock } from './engine/renderer.js';
import { Player } from './engine/player.js';
import * as Settings from './engine/settings.js';
import * as Audio from './engine/audio.js';
import { FloorWorld } from './world/builder.js';
import { getTheme } from './data/themes.js';
import { loadFloor, FLOOR_COUNT } from './data/floors/index.js';
import { mergeItems } from './data/items.js';
import { endingFor } from './data/endings.js';
import { GameState } from './game/state.js';
import { runEffects } from './game/effects.js';
import { Hud } from './ui/hud.js';
import { Dialogue } from './ui/dialogue.js';
import { InventoryPanel, ShopPanel, SettingsPanel, PausePanel, EndPanel } from './ui/panels.js';
import { TitleScreen } from './ui/title.js';

class Game {
  constructor() {
    this.ui = document.getElementById('ui');
    this.canvas = document.getElementById('view');
    this.loadingEl = document.getElementById('loading');

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(Settings.get('fov'), 1, 0.1, 400);
    this.scene.add(this.camera);

    this.renderer = new Renderer(this.canvas, this.scene, this.camera);
    this.clock = new FrameClock();
    this.player = new Player(this.camera, this.canvas);

    this.state = new GameState();
    this.world = null;
    this.floor = null;
    this.theme = null;
    this.mode = 'title';           // title | play | dialogue | panel | ended
    this.currentRoom = null;
    this.lastRoom = null;
    this.busy = false;

    this.hud = new Hud(this.ui, this.state);
    this.hud.setVisible(false);
    this.dialogue = new Dialogue(this.ui, this.state);
    this.inventory = new InventoryPanel(this.ui, this.state);
    this.shop = new ShopPanel(this.ui, this.state, this.hud);
    this.settings = new SettingsPanel(this.ui);
    this.pause = new PausePanel(this.ui, {
      resume: () => this.setPaused(false),
      inventory: () => { this.pause.hide(); this.inventory.show(); },
      settings: () => { this.pause.hide(); this.settings.show(); },
      abandon: () => this.abandon()
    });
    this.endPanel = new EndPanel(this.ui);

    this.title = new TitleScreen(this.ui, {
      begin: (cls) => this.begin(cls),
      continue: () => this.continueRun(),
      settings: () => this.settings.show()
    });

    this.ambientLight = new THREE.AmbientLight(0x202830, 0.3);
    this.hemiLight = new THREE.HemisphereLight(0x445566, 0x101010, 0.5);
    this.scene.add(this.ambientLight, this.hemiLight);

    Settings.onChange((ev) => this.onSettingsChange(ev));
    window.addEventListener('keydown', (e) => this.onKey(e));
    this.canvas.addEventListener('click', () => {
      if (this.mode === 'play') this.player.requestLock();
    });
    this.player.onLockChange = (locked) => {
      if (!locked && this.mode === 'play' && !this.busy) this.setPaused(true);
    };
    window.addEventListener('beforeunload', () => { if (this.mode !== 'title') this.state.save(); });

    this.loadingEl.classList.remove('show');
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  // ------------------------------------------------------------- run start

  async begin(classId) {
    Audio.init();
    Audio.resume();
    this.closePanels();
    this.state.reset(classId);
    this.title.hide();
    this.title.stopBackdrop();
    await this.enterFloor(1);
  }

  async continueRun() {
    Audio.init();
    Audio.resume();
    this.closePanels();
    const save = GameState.peek();
    if (!save || !this.state.load(save)) return;
    this.title.hide();
    this.title.stopBackdrop();
    await this.enterFloor(this.state.floorIndex, this.state.roomId);
  }

  abandon() {
    GameState.clearSave();
    this.teardownFloor();
    Audio.stopAmbience();
    this.closePanels();
    this.hud.setVisible(false);
    this.mode = 'title';
    this.title.stage = 'menu';
    this.title.render();
    this.title.show();
  }

  // ------------------------------------------------------------ floor load

  async enterFloor(n, atRoom = null) {
    this.busy = true;
    this.setLoading(true, `Descending to floor ${n}…`);
    this.player.releaseLock();

    try {
      const floor = await loadFloor(n);
      mergeItems(floor.items);
      this.teardownFloor();

      this.floor = floor;
      this.state.floorIndex = n;
      this.theme = getTheme(floor.theme);
      this.theme.key = floor.theme;

      this.applyAtmosphere(this.theme);
      this.renderer.setTheme(this.theme);

      this.world = new FloorWorld(floor, this.theme, this.scene);
      this.applyDoorState();

      const startId = (atRoom && this.world.layout.rooms.has(atRoom)) ? atRoom : floor.entry;
      this.placeInRoom(startId, true);

      Audio.setAmbience(this.theme.ambientLoop);
      this.hud.setVisible(true);
      this.state.save();

      this.setLoading(false);
      this.mode = 'play';
      this.busy = false;

      await this.hud.floorTitle(floor);
      if (this.mode === 'play') {
        this.hud.hint('Click to look around. Walk up to someone and press E to speak.', 7000);
      }
    } catch (err) {
      console.error(err);
      this.setLoading(true, `Floor ${n} could not be opened.\n${err.message}`);
      this.busy = false;
    }
  }

  applyAtmosphere(theme) {
    const fogOn = Settings.get('fog');
    this.scene.fog = fogOn ? new THREE.FogExp2(theme.fog.color, theme.fog.density) : null;
    this.scene.background = new THREE.Color(theme.fog.color);
    this.ambientLight.color.set(theme.ambient.color);
    this.ambientLight.intensity = theme.ambient.intensity;
    this.hemiLight.color.set(theme.hemi.sky);
    this.hemiLight.groundColor.set(theme.hemi.ground);
    this.hemiLight.intensity = theme.hemi.intensity;
    this.player.lantern.color.set(theme.lightPlan.color);
  }

  applyDoorState() {
    if (!this.world) return;
    for (const id of this.state.unlocked) this.world.setLocked(id, false);
    for (const id of this.state.relocked) this.world.setLocked(id, true);
  }

  teardownFloor() {
    if (this.world) { this.world.dispose(); this.world = null; }
    this.currentRoom = null;
    this.lastRoom = null;
  }

  placeInRoom(roomId, initial = false) {
    const placed = this.world.layout.rooms.get(roomId);
    if (!placed) return;
    // stand just inside the room facing its centre (camera forward is -Z at yaw 0),
    // nudged clear of anything a prop happens to be occupying
    const spot = this.world.spawnPoint(roomId) || { x: placed.x, z: placed.z + placed.d * 0.30 };
    this.player.setPosition(spot.x, spot.z, 0);
    this.onRoomEnter(roomId, initial);
  }

  teleport(roomId) {
    if (!this.world || !this.world.layout.rooms.has(roomId)) return;
    if (this.dialogue.open) this.dialogue.close();
    this.placeInRoom(roomId);
    Audio.play('whisper');
  }

  // --------------------------------------------------------- room entering

  onRoomEnter(roomId, initial = false) {
    if (!this.world) return;
    const placed = this.world.layout.rooms.get(roomId);
    if (!placed) return;
    const room = placed.room;

    this.currentRoom = roomId;
    this.lastRoom = roomId;
    this.state.roomId = roomId;
    this.world.setVisibleFrom(roomId);
    this.player.surface = this.world.surfaceByRoom.get(roomId) || 'stone';
    this.hud.showRoom(room.name, room.kind);

    const first = !this.state.visited.has(roomId);
    if (first) {
      this.state.visited.add(roomId);
      this.state.stats.roomsEntered++;
      if (room.desc) this.hud.narrate(room.desc);
    }

    const ctx = this.effectCtx();
    if (first && room.onEnter) runEffects(room.onEnter, ctx);
    if (room.onEnterAlways) runEffects(room.onEnterAlways, ctx);
    if (!initial) this.state.save();
  }

  effectCtx() {
    return { state: this.state, world: this.world, hud: this.hud, game: this };
  }

  // ------------------------------------------------------------ interaction

  talk() {
    if (this.mode !== 'play' || !this.currentRoom) return;
    const target = this.player.findTarget(this.world, this.currentRoom);
    if (!target) return;
    const placed = this.world.layout.rooms.get(this.currentRoom);
    const npcDef = placed.room.npc;
    if (!npcDef) return;

    this.mode = 'dialogue';
    this.player.releaseLock();
    this.hud.showPrompt(null);
    this.dialogue.start(npcDef, {
      onChoice: (choice) => runEffects(choice.effects, this.effectCtx()),
      onClose: () => {
        if (this.mode === 'dialogue') {
          this.mode = 'play';
          this.player.requestLock();
        }
      }
    });
  }

  openShop(spec) {
    const placed = this.world && this.world.layout.rooms.get(this.currentRoom);
    const name = placed && placed.room.npc ? placed.room.npc.name : null;
    this.shop.start(spec, name);
  }

  // ---------------------------------------------------------- progression

  async completeFloor(token) {
    if (this.busy) return;
    const n = this.state.floorIndex;
    if (token && !this.state.tokens.includes(n)) {
      this.state.tokens.push(n);
      this.state.give('ward_token_' + n, 1);
      Audio.play('token');
      this.hud.toast('Ward Token earned.', 'token');
    }
    Audio.play('floorComplete');
    if (this.dialogue.open) this.dialogue.close();

    if (n >= FLOOR_COUNT) { this.reachEnding('quiet'); return; }
    this.state.floorIndex = n + 1;
    this.state.roomId = null;
    this.state.save();
    await this.enterFloor(n + 1);
  }

  onDeath() {
    if (this.mode === 'ended') return;
    this.mode = 'ended';
    this.state.deaths++;
    this.state.ending = 'kept';
    if (this.dialogue.open) this.dialogue.close();
    this.player.releaseLock();
    Audio.play('death');
    Audio.stopAmbience();
    setTimeout(() => Audio.motif('fail'), 900);
    GameState.clearSave();
    this.showEnd('kept');
  }

  reachEnding(id) {
    if (this.mode === 'ended') return;
    this.mode = 'ended';
    this.state.ending = id;
    if (this.dialogue.open) this.dialogue.close();
    this.player.releaseLock();
    Audio.stopAmbience();
    Audio.motif(endingFor(id).motif || 'ending');
    GameState.clearSave();
    this.showEnd(id);
  }

  showEnd(id) {
    const e = endingFor(id);
    const s = this.state;
    const mins = Math.max(1, Math.round((Date.now() - s.startedAt) / 60000));
    this.hud.setVisible(false);
    this.endPanel.showEnding({
      title: e.title,
      kicker: e.kicker,
      body: e.body,
      stats: [
        ['floor reached', s.floorIndex],
        ['ward tokens', `${s.tokens.length}/10`],
        ['heartbeats left', `${s.hearts}/${s.maxHearts}`],
        ['choices made', s.stats.choices],
        ['rooms entered', s.stats.roomsEntered],
        ['gold at the end', s.gold],
        ['minutes below', mins]
      ],
      buttons: [
        { label: 'Descend again', primary: true, onClick: () => window.location.reload() }
      ]
    });
  }

  // --------------------------------------------------------------- input

  onKey(e) {
    // Panels can be opened from the title screen (Settings), so Escape has to
    // dismiss them before the title/ended early-out below.
    if (this.settings.open) {
      if (e.code === 'Escape') {
        e.preventDefault();
        this.settings.hide();
        if (this.mode === 'play' && !this.pause.open) this.setPaused(true);
      }
      return;
    }

    if (this.mode === 'title' || this.mode === 'ended') return;

    if (e.code === 'F3') { e.preventDefault(); this.hud.togglePerf(); return; }

    if (this.shop.open) {
      if (e.code === 'Escape' || e.code === 'Tab') { e.preventDefault(); this.shop.hide(); }
      return;
    }
    if (this.inventory.open) {
      if (e.code === 'Escape' || e.code === 'Tab') { e.preventDefault(); this.inventory.hide(); }
      return;
    }
    if (this.dialogue.open) {
      if (this.dialogue.handleKey(e)) e.preventDefault();
      return;
    }
    if (this.pause.open) {
      if (e.code === 'Escape') { e.preventDefault(); this.setPaused(false); }
      return;
    }

    if (e.code === 'Escape') { e.preventDefault(); this.setPaused(true); return; }
    if (e.code === 'Tab') { e.preventDefault(); this.inventory.show(); this.player.releaseLock(); return; }
    if (e.code === 'KeyE') { e.preventDefault(); this.talk(); }
  }

  closePanels() {
    this.pause.hide();
    this.settings.hide();
    this.inventory.hide();
    this.shop.hide();
  }

  setPaused(on) {
    if (on) {
      this.pause.setSub(this.floor ? `Floor ${this.floor.id} · ${this.floor.name}` : '');
      this.pause.show();
      this.player.releaseLock();
    } else {
      this.pause.hide();
      this.inventory.hide();
      this.settings.hide();
      if (this.mode === 'play') this.player.requestLock();
    }
  }

  onSettingsChange(ev) {
    const result = this.renderer.onSettingsChange(ev);
    if (ev.id === 'fog' || ev.id === '*') {
      if (this.theme) this.applyAtmosphere(this.theme);
    }
    if (result === 'refloor' && this.world && this.mode !== 'title') {
      clearTimeout(this._refloorT);
      this._refloorT = setTimeout(() => this.rebuildWorld(), 260);
    }
  }

  rebuildWorld() {
    if (!this.floor || !this.world) return;
    const at = this.currentRoom || this.floor.entry;
    const pos = { x: this.player.pos.x, z: this.player.pos.z, yaw: this.player.yaw };
    this.teardownFloor();
    this.world = new FloorWorld(this.floor, this.theme, this.scene);
    this.applyDoorState();
    this.player.setPosition(pos.x, pos.z, pos.yaw);
    this.onRoomEnter(at, true);
  }

  setLoading(on, text) {
    this.loadingEl.classList.toggle('show', on);
    if (text) this.loadingEl.querySelector('.loading-text').textContent = text;
  }

  // ----------------------------------------------------------------- loop

  loop() {
    requestAnimationFrame(this.loop);
    const dt = this.clock.tick();
    if (dt === null) return;
    const t = performance.now() / 1000;

    const interactive = this.mode === 'play' && !this.pause.open &&
      !this.inventory.open && !this.settings.open && !this.shop.open;
    this.player.enabled = interactive;
    this.player.update(dt, this.world);

    if (this.world) {
      const here = this.world.roomAt(this.player.pos.x, this.player.pos.z);
      if (here && here !== this.currentRoom) this.onRoomEnter(here);
      else if (!here) this.currentRoom = null;

      this.world.update(t, dt, this.player.pos);

      if (interactive && this.player.locked) {
        const room = this.lastRoom && this.world.roomAt(this.player.pos.x, this.player.pos.z);
        const target = room ? this.player.findTarget(this.world, room) : null;
        const npcDef = target && this.world.layout.rooms.get(room).room.npc;
        this.hud.showPrompt(npcDef ? `Speak to ${npcDef.name}` : null);
      } else {
        this.hud.showPrompt(null);
      }
    }

    this.hud.update(dt, this.clock.fps, this.renderer.info);
    this.renderer.render();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  try {
    window.__verrow = new Game();
  } catch (err) {
    console.error(err);
    const el = document.getElementById('loading');
    el.classList.add('show');
    el.querySelector('.loading-text').textContent =
      'The Verrow could not open.\n' + err.message +
      '\n\nThis game needs WebGL2. Try a recent Chrome, Edge, Firefox or Safari.';
  }
});
