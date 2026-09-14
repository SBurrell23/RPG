// The heads-up display: hearts, gold, room and floor banners, the interaction
// prompt, narration lines and toasts.

import { iconSvg } from './icons.js';
import * as Settings from '../engine/settings.js';

export class Hud {
  constructor(root, state) {
    this.state = state;
    this.el = document.createElement('div');
    this.el.className = 'hud';
    this.el.innerHTML = `
      <div class="hud-vignette"></div>
      <div class="hud-damage"></div>
      <div class="hud-top">
        <div class="hud-hearts" id="hud-hearts"></div>
        <div class="hud-right">
          <div class="hud-gold"><span class="hud-gold-icn">${iconSvg('coin', 20)}</span><span id="hud-gold-n">0</span></div>
          <div class="hud-tokens" id="hud-tokens" title="Ward Tokens"></div>
        </div>
      </div>
      <div class="hud-crosshair" id="hud-cross"></div>
      <div class="hud-roomname" id="hud-roomname"></div>
      <div class="hud-prompt" id="hud-prompt"><kbd>E</kbd> <span id="hud-prompt-txt">Speak</span></div>
      <div class="hud-narrate" id="hud-narrate"></div>
      <div class="hud-toasts" id="hud-toasts"></div>
      <div class="hud-floorcard" id="hud-floorcard"></div>
      <div class="hud-hint" id="hud-hint"></div>
      <div class="hud-perf" id="hud-perf"></div>
    `;
    root.appendChild(this.el);

    this.heartsEl = this.el.querySelector('#hud-hearts');
    this.goldEl = this.el.querySelector('#hud-gold-n');
    this.tokensEl = this.el.querySelector('#hud-tokens');
    this.roomNameEl = this.el.querySelector('#hud-roomname');
    this.promptEl = this.el.querySelector('#hud-prompt');
    this.promptTxt = this.el.querySelector('#hud-prompt-txt');
    this.narrateEl = this.el.querySelector('#hud-narrate');
    this.toastEl = this.el.querySelector('#hud-toasts');
    this.floorCard = this.el.querySelector('#hud-floorcard');
    this.crossEl = this.el.querySelector('#hud-cross');
    this.damageEl = this.el.querySelector('.hud-damage');
    this.hintEl = this.el.querySelector('#hud-hint');
    this.perfEl = this.el.querySelector('#hud-perf');

    this.shakeT = 0;
    this.showPerf = false;

    state.on(() => this.sync());
    Settings.onChange(() => this.applySettings());
    this.applySettings();
    this.sync();
  }

  applySettings() {
    this.crossEl.style.display = Settings.get('crosshair') ? '' : 'none';
    this.roomNameEl.style.display = Settings.get('showRoomName') ? '' : 'none';
  }

  sync() {
    const s = this.state;
    let h = '';
    for (let i = 0; i < s.maxHearts; i++) {
      h += `<span class="heart ${i < s.hearts ? 'full' : 'empty'}">${iconSvg('heart', 30)}</span>`;
    }
    this.heartsEl.innerHTML = h;
    this.goldEl.textContent = s.gold;
    this.tokensEl.innerHTML = s.tokens.length
      ? `${iconSvg('hex', 16)}<span>${s.tokens.length}<i>/10</i></span>`
      : '';
  }

  setVisible(v) { this.el.classList.toggle('hidden', !v); }

  showRoom(name, kind) {
    if (!name) return;
    this.roomNameEl.textContent = name;
    this.roomNameEl.classList.remove('show');
    void this.roomNameEl.offsetWidth;
    this.roomNameEl.classList.add('show');
    this.roomNameEl.dataset.kind = kind || '';
  }

  showPrompt(text) {
    if (text) {
      this.promptTxt.textContent = text;
      this.promptEl.classList.add('show');
    } else {
      this.promptEl.classList.remove('show');
    }
  }

  hint(text, ms = 5000) {
    this.hintEl.textContent = text || '';
    this.hintEl.classList.toggle('show', !!text);
    clearTimeout(this._hintT);
    if (text) this._hintT = setTimeout(() => this.hintEl.classList.remove('show'), ms);
  }

  narrate(text) {
    const line = document.createElement('div');
    line.className = 'narrate-line';
    line.textContent = text;
    this.narrateEl.appendChild(line);
    requestAnimationFrame(() => line.classList.add('show'));
    setTimeout(() => {
      line.classList.remove('show');
      setTimeout(() => line.remove(), 900);
    }, 4600);
  }

  toast(text, kind = '') {
    const t = document.createElement('div');
    t.className = 'toast ' + kind;
    t.textContent = text;
    this.toastEl.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => {
      t.classList.remove('show');
      setTimeout(() => t.remove(), 600);
    }, 3200);
    while (this.toastEl.children.length > 6) this.toastEl.firstChild.remove();
  }

  shake(amount = 1) {
    this.shakeT = 0.5 * amount;
    this.damageEl.classList.add('flash');
    setTimeout(() => this.damageEl.classList.remove('flash'), 500);
  }

  floorTitle(floor) {
    this.floorCard.innerHTML = `
      <div class="fc-inner">
        <div class="fc-num">Floor ${floor.id}</div>
        <div class="fc-name">${escapeHtml(floor.name)}</div>
        <div class="fc-sub">${escapeHtml(floor.subtitle || '')}</div>
        <div class="fc-intro">${escapeHtml(floor.intro || '')}</div>
      </div>`;
    this.floorCard.classList.add('show');
    return new Promise((resolve) => {
      setTimeout(() => {
        this.floorCard.classList.remove('show');
        setTimeout(resolve, 900);
      }, 4200);
    });
  }

  update(dt, fps, info) {
    if (this.shakeT > 0) {
      this.shakeT -= dt;
      const a = Math.max(0, this.shakeT) * 9;
      this.el.style.transform = `translate(${(Math.random() - 0.5) * a}px, ${(Math.random() - 0.5) * a}px)`;
      if (this.shakeT <= 0) this.el.style.transform = '';
    }
    if (this.showPerf && info) {
      this.perfEl.textContent =
        `${fps.toFixed(0)} fps   |   ${info.render.calls} draws   |   ${(info.render.triangles / 1000).toFixed(0)}k tris   |   ${info.memory.geometries} geo  ${info.memory.textures} tex`;
    }
  }

  togglePerf() {
    this.showPerf = !this.showPerf;
    this.perfEl.classList.toggle('show', this.showPerf);
  }
}

export function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
