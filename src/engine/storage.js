// Namespaced, defensive localStorage.
//
// Every GitHub Pages project site for one account is served from the SAME
// origin (https://<user>.github.io), so every game deployed there shares one
// localStorage bucket. This module therefore:
//
//   * prefixes every key with `verrow:` so it cannot collide with a neighbour;
//   * never enumerates, clears or removes anything outside that prefix;
//   * treats whatever comes back as untrusted — a neighbouring app, an older
//     build, or a half-written value can all put garbage under our key, so
//     every read is parsed in a try/catch and then validated by the caller;
//   * survives storage being unavailable entirely (private windows, blocked
//     site data, quota exhausted by another game on the origin).

const NS = 'verrow:';

// Keys this game used before it was namespaced. Read once, then migrated.
const LEGACY = {
  'settings:v1': 'verrow.settings.v1',
  'save:v1': 'verrow.save.v1'
};

function available() {
  try {
    const probe = NS + '__probe';
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return true;
  } catch (e) {
    return false;
  }
}

const OK = available();

export function isAvailable() { return OK; }

export function readJSON(key) {
  if (!OK) return null;
  let raw = null;
  try { raw = localStorage.getItem(NS + key); } catch (e) { return null; }

  // one-time migration off the old un-namespaced key
  if (raw === null && LEGACY[key]) {
    try {
      raw = localStorage.getItem(LEGACY[key]);
      if (raw !== null) {
        localStorage.setItem(NS + key, raw);
        localStorage.removeItem(LEGACY[key]);
      }
    } catch (e) { /* migration is best-effort */ }
  }

  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw);
    // only ever hand back a plain object; anything else is someone else's data
    return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : null;
  } catch (e) {
    return null;
  }
}

export function writeJSON(key, value) {
  if (!OK) return false;
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
    return true;
  } catch (e) {
    // Most likely the origin's quota is full — quite possibly because of
    // another game on it. Nothing to do but carry on unsaved.
    return false;
  }
}

export function remove(key) {
  if (!OK) return;
  try {
    localStorage.removeItem(NS + key);
    if (LEGACY[key]) localStorage.removeItem(LEGACY[key]);
  } catch (e) { /* ignore */ }
}

// Wipes this game's data and nothing else. There is deliberately no
// "clear everything" here: on a shared origin that would destroy a
// neighbouring game's saves.
export function removeAllVerrowKeys() {
  if (!OK) return;
  try {
    const doomed = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(NS)) doomed.push(k);
    }
    for (const k of doomed) localStorage.removeItem(k);
    for (const legacy of Object.values(LEGACY)) localStorage.removeItem(legacy);
  } catch (e) { /* ignore */ }
}

export { NS as NAMESPACE };
