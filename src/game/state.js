// The player's run. Everything the story can read or change lives here.

import { getClass, CLASSES } from '../data/classes.js';
import { getItem } from '../data/items.js';
import * as Storage from '../engine/storage.js';

const SAVE_KEY = 'save:v1';

export class GameState {
  constructor() {
    this.listeners = new Set();
    this.reset();
  }

  reset(classId = 'warden') {
    const cls = getClass(classId);
    this.classId = cls.id;
    this.maxHearts = 3;
    this.hearts = 3;
    this.gold = cls.gold;
    this.items = {};
    for (const id of cls.items) this.give(id, 1, true);
    this.flags = new Set();
    this.codex = [];
    this.tokens = [];
    this.floorIndex = 1;
    this.roomId = null;
    this.visited = new Set();
    this.unlocked = new Set();
    this.relocked = new Set();
    this.npcState = {};
    this.startedAt = Date.now();
    this.deaths = 0;
    this.ending = null;
    this.stats = { choices: 0, roomsEntered: 0, goldEarned: 0, goldSpent: 0, heartsLost: 0 };
    this.emit();
  }

  on(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  emit(what = 'change') { for (const fn of this.listeners) fn(what, this); }

  // ---- inventory ----------------------------------------------------------

  give(id, n = 1, silent = false) {
    this.items[id] = (this.items[id] || 0) + n;
    if (this.items[id] <= 0) delete this.items[id];
    if (!silent) this.emit('items');
    return this.items[id] || 0;
  }

  has(id, n = 1) { return (this.items[id] || 0) >= n; }
  count(id) { return this.items[id] || 0; }

  inventoryList() {
    return Object.entries(this.items)
      .map(([id, n]) => ({ id, n, def: getItem(id) }))
      .sort((a, b) => {
        const order = { token: 0, key: 1, relic: 2, tool: 3, consumable: 4, trade: 5 };
        const d = (order[a.def.kind] ?? 9) - (order[b.def.kind] ?? 9);
        return d || a.def.name.localeCompare(b.def.name);
      });
  }

  // ---- economy ------------------------------------------------------------

  addGold(n) {
    const before = this.gold;
    this.gold = Math.max(0, this.gold + n);
    if (n > 0) this.stats.goldEarned += n;
    else this.stats.goldSpent += Math.min(before, -n);
    this.emit('gold');
  }

  // ---- hearts -------------------------------------------------------------

  changeHearts(n) {
    const before = this.hearts;
    this.hearts = Math.max(0, Math.min(this.maxHearts, this.hearts + n));
    if (n < 0) this.stats.heartsLost += before - this.hearts;
    this.emit('hearts');
    return this.hearts;
  }

  get dead() { return this.hearts <= 0; }

  // ---- flags & codex ------------------------------------------------------

  setFlag(id, v = true) {
    if (v) this.flags.add(id); else this.flags.delete(id);
    this.emit('flags');
  }
  hasFlag(id) { return this.flags.has(id); }

  addCodex(entry) {
    if (this.codex.some((c) => c.id === entry.id)) return false;
    this.codex.push(entry);
    this.emit('codex');
    return true;
  }

  // ---- npc conversation bookkeeping ---------------------------------------

  npc(id) {
    if (!this.npcState[id]) this.npcState[id] = { greeted: false, used: [] };
    return this.npcState[id];
  }

  useChoice(npcId, choiceId) {
    const s = this.npc(npcId);
    if (!s.used.includes(choiceId)) s.used.push(choiceId);
    this.stats.choices++;
  }

  choiceUsed(npcId, choiceId) {
    return this.npc(npcId).used.includes(choiceId);
  }

  // ---- requirement checking ------------------------------------------------

  meets(require) {
    if (!require) return { ok: true };
    if (require.class && !require.class.includes(this.classId)) {
      return { ok: false, why: 'class' };
    }
    if (require.items) {
      for (const it of require.items) {
        if (!this.has(it)) return { ok: false, why: 'item', what: it };
      }
    }
    if (require.gold !== undefined && this.gold < require.gold) {
      return { ok: false, why: 'gold', what: require.gold };
    }
    if (require.flags) {
      for (const f of require.flags) if (!this.flags.has(f)) return { ok: false, why: 'flag', what: f };
    }
    if (require.notFlags) {
      for (const f of require.notFlags) if (this.flags.has(f)) return { ok: false, why: 'notFlag', what: f };
    }
    if (require.minHearts !== undefined && this.hearts < require.minHearts) {
      return { ok: false, why: 'hearts', what: require.minHearts };
    }
    return { ok: true };
  }

  // ---- persistence ---------------------------------------------------------

  serialize() {
    return {
      v: 1,
      classId: this.classId, hearts: this.hearts, maxHearts: this.maxHearts,
      gold: this.gold, items: this.items,
      flags: [...this.flags], codex: this.codex, tokens: this.tokens,
      floorIndex: this.floorIndex, roomId: this.roomId,
      visited: [...this.visited], unlocked: [...this.unlocked], relocked: [...this.relocked],
      npcState: this.npcState, startedAt: this.startedAt, deaths: this.deaths,
      stats: this.stats, ending: this.ending
    };
  }

  load(data) {
    if (!validSave(data)) return false;
    Object.assign(this, {
      classId: data.classId, hearts: data.hearts, maxHearts: data.maxHearts ?? 3,
      gold: data.gold, items: data.items || {},
      flags: new Set(data.flags || []), codex: data.codex || [], tokens: data.tokens || [],
      floorIndex: data.floorIndex || 1, roomId: data.roomId || null,
      visited: new Set(data.visited || []), unlocked: new Set(data.unlocked || []),
      relocked: new Set(data.relocked || []),
      npcState: data.npcState || {}, startedAt: data.startedAt || Date.now(),
      deaths: data.deaths || 0,
      stats: data.stats || { choices: 0, roomsEntered: 0, goldEarned: 0, goldSpent: 0, heartsLost: 0 },
      ending: data.ending || null
    });
    this.emit();
    return true;
  }

  save() {
    return Storage.writeJSON(SAVE_KEY, this.serialize());
  }

  // Returns a save only if it is genuinely one of ours and structurally sound.
  // This origin is shared with every other game deployed to the same
  // github.io account, so an unrecognised blob is ignored, not trusted.
  static peek() {
    const data = Storage.readJSON(SAVE_KEY);
    return validSave(data) ? data : null;
  }

  static clearSave() {
    Storage.remove(SAVE_KEY);
  }
}

const CLASS_IDS = new Set(CLASSES.map((c) => c.id));
const isNum = (n) => typeof n === 'number' && Number.isFinite(n);
const isStrArray = (a) => Array.isArray(a) && a.every((x) => typeof x === 'string');

function validSave(d) {
  if (!d || typeof d !== 'object' || Array.isArray(d)) return false;
  if (d.v !== 1) return false;
  if (!CLASS_IDS.has(d.classId)) return false;
  if (!isNum(d.hearts) || d.hearts < 0 || d.hearts > 16) return false;
  if (!isNum(d.gold) || d.gold < 0) return false;
  if (!isNum(d.floorIndex) || d.floorIndex < 1 || d.floorIndex > 10) return false;
  if (!d.items || typeof d.items !== 'object' || Array.isArray(d.items)) return false;
  for (const n of Object.values(d.items)) if (!isNum(n)) return false;
  if (d.flags !== undefined && !isStrArray(d.flags)) return false;
  if (d.visited !== undefined && !isStrArray(d.visited)) return false;
  if (d.unlocked !== undefined && !isStrArray(d.unlocked)) return false;
  if (d.relocked !== undefined && !isStrArray(d.relocked)) return false;
  if (d.tokens !== undefined && !Array.isArray(d.tokens)) return false;
  if (d.codex !== undefined && !Array.isArray(d.codex)) return false;
  if (d.roomId !== undefined && d.roomId !== null && typeof d.roomId !== 'string') return false;
  return true;
}
