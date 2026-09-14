// Every sound in the game is synthesised at runtime. No audio files anywhere.
// Signal path:  source -> bus (ambient|sfx|voice|steps) -> [reverb send] -> master -> out

import * as Settings from './settings.js';

let ctx = null;
let master = null;
let comp = null;
let buses = {};
let convolver = null;
let reverbSend = null;
let noiseBuf = null;
let ambience = null;
let started = false;

export function init() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();

  master = ctx.createGain();
  comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.knee.value = 24;
  comp.ratio.value = 3.2;
  comp.attack.value = 0.006;
  comp.release.value = 0.26;
  master.connect(comp);
  comp.connect(ctx.destination);

  // A stone-room impulse response, generated rather than loaded.
  convolver = ctx.createConvolver();
  convolver.buffer = makeImpulse(2.9, 2.6);
  const wet = ctx.createGain();
  wet.gain.value = 0.42;
  convolver.connect(wet);
  wet.connect(master);
  reverbSend = convolver;

  for (const name of ['ambient', 'sfx', 'voice', 'steps']) {
    const g = ctx.createGain();
    g.connect(master);
    const s = ctx.createGain();
    s.gain.value = name === 'ambient' ? 0.22 : name === 'steps' ? 0.12 : 0.3;
    g.connect(s);
    s.connect(convolver);
    buses[name] = { gain: g, send: s };
  }

  noiseBuf = makeNoise(3.0);
  applyVolumes();
  Settings.onChange(applyVolumes);
  return ctx;
}

export function resume() {
  if (!ctx) init();
  if (ctx && ctx.state === 'suspended') ctx.resume();
  started = true;
}

export function isReady() { return !!ctx && started; }

function applyVolumes() {
  if (!ctx) return;
  const m = Settings.get('muted') ? 0 : Settings.get('volMaster');
  const t = ctx.currentTime;
  master.gain.setTargetAtTime(m, t, 0.05);
  buses.ambient.gain.gain.setTargetAtTime(Settings.get('volAmbient'), t, 0.05);
  buses.sfx.gain.gain.setTargetAtTime(Settings.get('volSfx'), t, 0.05);
  buses.voice.gain.gain.setTargetAtTime(Settings.get('volVoice'), t, 0.05);
  buses.steps.gain.gain.setTargetAtTime(Settings.get('volSteps'), t, 0.05);
}

// ---------------------------------------------------------------- primitives

function makeNoise(seconds) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    // mild brown tilt keeps it from sounding like a hiss
    last = (last + 0.02 * white) / 1.02;
    d[i] = white * 0.7 + last * 3.2;
  }
  return buf;
}

function makeImpulse(seconds, decay) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      // early reflections then a smooth tail
      const early = i < ctx.sampleRate * 0.06 ? (Math.random() * 2 - 1) * 0.8 : 0;
      d[i] = ((Math.random() * 2 - 1) * Math.pow(1 - t, decay)) * 0.6 + early * Math.pow(1 - t, 8);
    }
  }
  return buf;
}

function noiseSource(loop = false) {
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  s.loop = loop;
  return s;
}

function env(gain, t, a, d, peak = 1, sustain = 0, rel = 0) {
  gain.gain.cancelScheduledValues(t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak), t + a);
  if (sustain > 0) {
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak * 0.6), t + a + d);
    gain.gain.setValueAtTime(Math.max(0.0001, peak * 0.6), t + a + d + sustain);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + a + d + sustain + rel);
  } else {
    gain.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  }
}

function tone(opts) {
  if (!ctx) return;
  const {
    freq = 440, type = 'sine', bus = 'sfx', gain = 0.3, attack = 0.005,
    decay = 0.3, detune = 0, slideTo = null, slideTime = 0.2, delay = 0, filter = null, q = 1
  } = opts;
  const t = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  osc.detune.value = detune;
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), t + slideTime);
  const g = ctx.createGain();
  let node = osc;
  if (filter) {
    const f = ctx.createBiquadFilter();
    f.type = typeof filter === 'string' ? filter : 'lowpass';
    f.frequency.value = opts.cutoff || 1200;
    f.Q.value = q;
    osc.connect(f); node = f;
  }
  node.connect(g);
  g.connect(buses[bus].gain);
  env(g, t, attack, decay, gain);
  osc.start(t);
  osc.stop(t + attack + decay + 0.05);
}

function noiseHit(opts) {
  if (!ctx) return;
  const {
    bus = 'sfx', gain = 0.3, attack = 0.002, decay = 0.25, type = 'bandpass',
    cutoff = 900, q = 1.2, delay = 0, sweepTo = null
  } = opts;
  const t = ctx.currentTime + delay;
  const s = noiseSource();
  s.playbackRate.value = 0.8 + Math.random() * 0.4;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.setValueAtTime(cutoff, t);
  if (sweepTo) f.frequency.exponentialRampToValueAtTime(Math.max(40, sweepTo), t + decay);
  f.Q.value = q;
  const g = ctx.createGain();
  s.connect(f); f.connect(g); g.connect(buses[bus].gain);
  env(g, t, attack, decay, gain);
  s.start(t);
  s.stop(t + attack + decay + 0.1);
}

// -------------------------------------------------------------------- sfx

const SFX = {
  chime() {
    [880, 1320, 1760].forEach((f, i) =>
      tone({ freq: f, type: 'sine', gain: 0.18 / (i + 1), attack: 0.004, decay: 1.4 + i * 0.3, delay: i * 0.04 }));
  },
  bell() {
    [220, 523, 659, 1047].forEach((f, i) =>
      tone({ freq: f, type: 'sine', gain: 0.16 / (i * 0.7 + 1), attack: 0.003, decay: 2.8 - i * 0.3, detune: i * 4 }));
  },
  stone() {
    noiseHit({ cutoff: 420, sweepTo: 120, decay: 0.42, gain: 0.32, q: 0.9 });
    tone({ freq: 90, type: 'triangle', gain: 0.22, decay: 0.3, slideTo: 55, slideTime: 0.25 });
  },
  crack() {
    noiseHit({ cutoff: 2600, sweepTo: 400, decay: 0.22, gain: 0.4, q: 2.0, type: 'bandpass' });
    noiseHit({ cutoff: 700, decay: 0.5, gain: 0.2, delay: 0.03 });
  },
  water() {
    for (let i = 0; i < 3; i++) {
      tone({ freq: 700 + Math.random() * 900, type: 'sine', gain: 0.12, attack: 0.002,
        decay: 0.18, slideTo: 200, slideTime: 0.16, delay: i * 0.07 });
    }
    noiseHit({ cutoff: 1800, decay: 0.3, gain: 0.1, type: 'highpass' });
  },
  fire() {
    noiseHit({ cutoff: 1400, sweepTo: 300, decay: 0.9, gain: 0.22, q: 0.7 });
    noiseHit({ cutoff: 3000, decay: 0.35, gain: 0.1, type: 'highpass', delay: 0.08 });
  },
  gear() {
    for (let i = 0; i < 5; i++) {
      noiseHit({ cutoff: 1100 + i * 140, decay: 0.06, gain: 0.14, q: 4, delay: i * 0.055 });
    }
    tone({ freq: 150, type: 'square', gain: 0.06, decay: 0.4, filter: 'lowpass', cutoff: 500 });
  },
  whisper() {
    noiseHit({ cutoff: 1700, decay: 0.85, gain: 0.16, q: 3.2, type: 'bandpass', sweepTo: 2400 });
  },
  coin() {
    [1860, 2340, 3120].forEach((f, i) =>
      tone({ freq: f, type: 'triangle', gain: 0.13, attack: 0.002, decay: 0.5, delay: i * 0.035 }));
  },
  unlock() {
    noiseHit({ cutoff: 2200, decay: 0.1, gain: 0.24, q: 3 });
    tone({ freq: 160, type: 'sawtooth', gain: 0.12, decay: 0.5, slideTo: 320, slideTime: 0.4, filter: 'lowpass', cutoff: 900 });
    SFX.chime();
  },
  wrong() {
    tone({ freq: 180, type: 'sawtooth', gain: 0.16, decay: 0.45, slideTo: 92, slideTime: 0.4, filter: 'lowpass', cutoff: 700 });
  },
  heartloss() {
    tone({ freq: 140, type: 'sine', gain: 0.3, attack: 0.01, decay: 1.1, slideTo: 62, slideTime: 0.9 });
    noiseHit({ cutoff: 300, decay: 1.2, gain: 0.18, q: 0.6 });
    tone({ freq: 70, type: 'sine', gain: 0.24, decay: 1.6, delay: 0.18 });
  },
  heartgain() {
    [392, 523, 784].forEach((f, i) =>
      tone({ freq: f, type: 'sine', gain: 0.16, attack: 0.01, decay: 1.0, delay: i * 0.11 }));
  },
  door() {
    noiseHit({ cutoff: 260, sweepTo: 90, decay: 1.3, gain: 0.3, q: 0.8 });
    tone({ freq: 58, type: 'triangle', gain: 0.2, decay: 1.4 });
  },
  pickup() {
    tone({ freq: 660, type: 'triangle', gain: 0.16, decay: 0.22, slideTo: 990, slideTime: 0.14 });
    tone({ freq: 1320, type: 'sine', gain: 0.08, decay: 0.4, delay: 0.08 });
  },
  step(surface = 'stone') {
    const cut = { stone: 520, water: 900, dirt: 300, metal: 1500, bone: 780 }[surface] || 520;
    noiseHit({ bus: 'steps', cutoff: cut + Math.random() * 120, sweepTo: cut * 0.35,
      decay: 0.1 + Math.random() * 0.05, gain: 0.34, q: 1.1 });
    if (surface === 'water') noiseHit({ bus: 'steps', cutoff: 2400, decay: 0.18, gain: 0.14, type: 'highpass' });
  },
  ui() { tone({ freq: 1180, type: 'sine', gain: 0.07, attack: 0.002, decay: 0.07 }); },
  uiBig() {
    tone({ freq: 440, type: 'triangle', gain: 0.12, decay: 0.18 });
    tone({ freq: 880, type: 'sine', gain: 0.08, decay: 0.3, delay: 0.05 });
  },
  floorComplete() {
    [261, 329, 392, 523, 659].forEach((f, i) =>
      tone({ freq: f, type: 'sine', gain: 0.16, attack: 0.02, decay: 2.2 - i * 0.15, delay: i * 0.16 }));
    tone({ freq: 65, type: 'sine', gain: 0.22, attack: 0.05, decay: 3.2 });
  },
  token() {
    [523, 784, 1047, 1568].forEach((f, i) =>
      tone({ freq: f, type: 'sine', gain: 0.14, attack: 0.004, decay: 2.0, delay: i * 0.08 }));
  },
  death() {
    tone({ freq: 110, type: 'sine', gain: 0.3, attack: 0.02, decay: 4.0, slideTo: 40, slideTime: 3.6 });
    noiseHit({ cutoff: 400, sweepTo: 60, decay: 4.0, gain: 0.2, q: 0.5 });
  },
  thunder() {
    noiseHit({ bus: 'ambient', cutoff: 200, sweepTo: 50, decay: 2.6, gain: 0.42, q: 0.5 });
    noiseHit({ bus: 'ambient', cutoff: 900, decay: 0.4, gain: 0.2, delay: 0.02 });
    tone({ bus: 'ambient', freq: 48, type: 'sine', gain: 0.26, decay: 3.0, delay: 0.05 });
  }
};

export function play(id, arg) {
  if (!ctx || Settings.get('muted')) return;
  resume();
  const fn = SFX[id];
  if (fn) fn(arg);
}

// ------------------------------------------------------------------- voice

const VOICE = {
  low:    { base: 128, type: 'square',   cut: 620,  jitter: 0.10, dur: 0.055 },
  mid:    { base: 210, type: 'triangle', cut: 1100, jitter: 0.14, dur: 0.045 },
  high:   { base: 330, type: 'triangle', cut: 1800, jitter: 0.18, dur: 0.038 },
  dry:    { base: 165, type: 'sawtooth', cut: 780,  jitter: 0.05, dur: 0.05 },
  bell:   { base: 520, type: 'sine',     cut: 2600, jitter: 0.22, dur: 0.09 },
  choral: { base: 260, type: 'sine',     cut: 1500, jitter: 0.12, dur: 0.12 },
  broken: { base: 148, type: 'square',   cut: 500,  jitter: 0.35, dur: 0.04 }
};

export function blip(voice = 'mid') {
  if (!ctx || Settings.get('muted') || Settings.get('volVoice') <= 0) return;
  const v = VOICE[voice] || VOICE.mid;
  const f = v.base * (1 + (Math.random() * 2 - 1) * v.jitter);
  tone({ freq: f, type: v.type, bus: 'voice', gain: 0.12, attack: 0.004,
    decay: v.dur, filter: 'lowpass', cutoff: v.cut, q: 1 });
  if (voice === 'choral') {
    tone({ freq: f * 1.5, type: 'sine', bus: 'voice', gain: 0.05, attack: 0.01, decay: v.dur * 1.6 });
  }
}

// ---------------------------------------------------------------- ambience

class Ambience {
  constructor(kind) {
    this.kind = kind;
    this.nodes = [];
    this.timers = [];
    this.out = ctx.createGain();
    this.out.gain.value = 0.0001;
    this.out.connect(buses.ambient.gain);
    const send = ctx.createGain();
    send.gain.value = 0.3;
    this.out.connect(send);
    send.connect(convolver);
    this.build(kind);
    this.out.gain.exponentialRampToValueAtTime(1.0, ctx.currentTime + 2.2);
  }

  drone(freq, type, gain, detune = 0, cutoff = 600) {
    const o = ctx.createOscillator();
    o.type = type; o.frequency.value = freq; o.detune.value = detune;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = cutoff;
    const g = ctx.createGain(); g.gain.value = gain;
    o.connect(f); f.connect(g); g.connect(this.out);
    o.start();
    this.nodes.push(o, f, g);
    return { osc: o, gain: g, filter: f };
  }

  noiseLayer(type, cutoff, q, gain, rate = 1) {
    const s = noiseSource(true);
    s.playbackRate.value = rate;
    const f = ctx.createBiquadFilter();
    f.type = type; f.frequency.value = cutoff; f.Q.value = q;
    const g = ctx.createGain(); g.gain.value = gain;
    s.connect(f); f.connect(g); g.connect(this.out);
    s.start();
    this.nodes.push(s, f, g);
    return { src: s, filter: f, gain: g };
  }

  lfo(target, freq, depth, center) {
    const o = ctx.createOscillator();
    o.type = 'sine'; o.frequency.value = freq;
    const g = ctx.createGain(); g.gain.value = depth;
    o.connect(g); g.connect(target);
    if (center !== undefined) target.value = center;
    o.start();
    this.nodes.push(o, g);
  }

  every(ms, fn, jitter = 0.5) {
    const tick = () => {
      fn();
      this.timers.push(setTimeout(tick, ms * (1 - jitter / 2 + Math.random() * jitter)));
    };
    this.timers.push(setTimeout(tick, ms * Math.random()));
  }

  build(kind) {
    switch (kind) {
      case 'wind': {
        const n = this.noiseLayer('bandpass', 420, 0.9, 0.16);
        this.lfo(n.filter.frequency, 0.055, 260, 480);
        this.lfo(n.gain.gain, 0.031, 0.07, 0.16);
        this.drone(48, 'sine', 0.05);
        this.every(9000, () => noiseHit({ bus: 'ambient', cutoff: 1400, decay: 1.6, gain: 0.06, q: 2.2, sweepTo: 500 }));
        break;
      }
      case 'breath': {
        const n = this.noiseLayer('lowpass', 300, 0.7, 0.11);
        this.lfo(n.gain.gain, 0.19, 0.085, 0.11);
        this.drone(41, 'sine', 0.075);
        this.drone(61.5, 'sine', 0.035, 6);
        this.every(7000, () => {
          tone({ bus: 'ambient', freq: 52, type: 'sine', gain: 0.1, attack: 0.3, decay: 1.4 });
          noiseHit({ bus: 'ambient', cutoff: 240, decay: 1.2, gain: 0.07, q: 0.6, delay: 0.2 });
        });
        break;
      }
      case 'water': {
        const n = this.noiseLayer('lowpass', 380, 0.6, 0.13, 0.6);
        this.lfo(n.filter.frequency, 0.07, 150, 380);
        this.drone(58, 'sine', 0.06);
        this.drone(87, 'sine', 0.028, -8);
        this.every(2600, () => play('water'), 0.9);
        break;
      }
      case 'forge': {
        this.noiseLayer('lowpass', 220, 0.5, 0.15, 0.5);
        const crack = this.noiseLayer('bandpass', 2200, 3.0, 0.045);
        this.lfo(crack.gain.gain, 2.7, 0.04, 0.045);
        this.drone(43, 'sawtooth', 0.05, 0, 180);
        this.every(4200, () => {
          noiseHit({ bus: 'ambient', cutoff: 700, sweepTo: 180, decay: 0.6, gain: 0.13, q: 1.4 });
          tone({ bus: 'ambient', freq: 128, type: 'triangle', gain: 0.08, decay: 0.5 });
        }, 0.35);
        break;
      }
      case 'garden': {
        this.drone(98, 'sine', 0.055);
        this.drone(147, 'sine', 0.04, 7);
        this.drone(196, 'triangle', 0.022, -5, 900);
        const n = this.noiseLayer('bandpass', 3200, 2.4, 0.03);
        this.lfo(n.filter.frequency, 0.045, 900, 3200);
        this.every(6500, () => tone({ bus: 'ambient', freq: 1046 + Math.random() * 600, type: 'sine', gain: 0.07, attack: 0.02, decay: 2.4 }));
        break;
      }
      case 'clock': {
        this.drone(110, 'sawtooth', 0.03, 0, 320);
        this.drone(165, 'sine', 0.025, 4);
        let beat = 0;
        this.every(920, () => {
          const hi = beat++ % 2 === 0;
          noiseHit({ bus: 'ambient', cutoff: hi ? 2400 : 1600, decay: 0.045, gain: 0.10, q: 5 });
        }, 0.02);
        this.every(31000, () => play('gear'));
        break;
      }
      case 'choir': {
        // The held note. Slightly detuned voices beating against each other.
        [0, 4, 7, -5].forEach((cents, i) => this.drone(196 * Math.pow(2, i === 3 ? -1 / 12 : 0), 'sine', 0.045, cents * 3, 1400));
        this.drone(392, 'sine', 0.022, 3, 2000);
        const n = this.noiseLayer('bandpass', 1800, 4, 0.025);
        this.lfo(n.gain.gain, 0.09, 0.02, 0.025);
        this.every(11000, () => play('whisper'));
        break;
      }
      case 'ossuary': {
        this.drone(55, 'sine', 0.07);
        this.drone(82.5, 'sine', 0.04, -6);
        this.drone(110, 'triangle', 0.02, 5, 420);
        this.noiseLayer('lowpass', 180, 0.6, 0.06);
        this.every(19000, () => play('bell'));
        break;
      }
      case 'storm': {
        const rain = this.noiseLayer('highpass', 1100, 0.6, 0.17, 1.4);
        this.lfo(rain.gain.gain, 0.037, 0.05, 0.17);
        const wind = this.noiseLayer('bandpass', 300, 0.8, 0.12);
        this.lfo(wind.filter.frequency, 0.043, 190, 340);
        this.drone(38, 'sine', 0.06);
        this.every(13000, () => play('thunder'), 0.8);
        break;
      }
      case 'cadence': {
        this.drone(65.4, 'sine', 0.08);
        this.drone(130.8, 'sine', 0.045, 3);
        this.drone(196.0, 'sine', 0.025, -4, 1200);
        this.drone(261.6, 'sine', 0.014, 6, 1800);
        const n = this.noiseLayer('bandpass', 900, 1.6, 0.03);
        this.lfo(n.gain.gain, 0.021, 0.022, 0.03);
        // a slow double heartbeat
        this.every(4000, () => {
          tone({ bus: 'ambient', freq: 46, type: 'sine', gain: 0.14, attack: 0.02, decay: 0.5 });
          tone({ bus: 'ambient', freq: 42, type: 'sine', gain: 0.10, attack: 0.02, decay: 0.6, delay: 0.34 });
        }, 0.05);
        break;
      }
      default: {
        this.drone(52, 'sine', 0.05);
        this.noiseLayer('lowpass', 400, 0.7, 0.08);
      }
    }
  }

  stop(fade = 1.6) {
    const t = ctx.currentTime;
    try { this.out.gain.cancelScheduledValues(t); this.out.gain.setValueAtTime(this.out.gain.value, t);
      this.out.gain.exponentialRampToValueAtTime(0.0001, t + fade); } catch (e) { /* ignore */ }
    for (const id of this.timers) clearTimeout(id);
    this.timers.length = 0;
    setTimeout(() => {
      for (const n of this.nodes) { try { n.stop && n.stop(); n.disconnect && n.disconnect(); } catch (e) { /* ignore */ } }
      try { this.out.disconnect(); } catch (e) { /* ignore */ }
      this.nodes.length = 0;
    }, fade * 1000 + 200);
  }
}

export function setAmbience(kind) {
  if (!ctx) return;
  if (ambience && ambience.kind === kind) return;
  if (ambience) ambience.stop();
  ambience = kind ? new Ambience(kind) : null;
}

export function stopAmbience() {
  if (ambience) { ambience.stop(); ambience = null; }
}

// A short musical sting used by the title screen and endings.
export function motif(which = 'title') {
  if (!ctx) return;
  resume();
  const seqs = {
    title: [[196, 0], [233, 0.5], [294, 1.0], [261, 1.7], [196, 2.4]],
    ending: [[130, 0], [164, 0.7], [196, 1.4], [261, 2.1], [329, 2.8], [392, 3.5]],
    fail: [[196, 0], [164, 0.6], [138, 1.2], [110, 1.9]]
  };
  for (const [f, d] of (seqs[which] || seqs.title)) {
    tone({ bus: 'ambient', freq: f, type: 'sine', gain: 0.15, attack: 0.05, decay: 2.6, delay: d });
    tone({ bus: 'ambient', freq: f * 2, type: 'sine', gain: 0.05, attack: 0.08, decay: 2.0, delay: d + 0.03 });
  }
}
