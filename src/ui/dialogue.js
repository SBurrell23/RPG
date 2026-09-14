// Conversation UI: typewriter pages, then the choice list. The only way the
// player interacts with the story.

import { escapeHtml } from './hud.js';
import { getItem } from '../data/items.js';
import { getClass } from '../data/classes.js';
import * as Settings from '../engine/settings.js';
import * as Audio from '../engine/audio.js';

export class Dialogue {
  constructor(root, state) {
    this.state = state;
    this.open = false;
    this.el = document.createElement('div');
    this.el.className = 'dlg';
    this.el.innerHTML = `
      <div class="dlg-scrim"></div>
      <div class="dlg-panel">
        <div class="dlg-head">
          <div class="dlg-name" id="dlg-name"></div>
          <div class="dlg-title" id="dlg-title"></div>
        </div>
        <div class="dlg-body" id="dlg-body"></div>
        <div class="dlg-more" id="dlg-more">continue <kbd>Space</kbd></div>
        <div class="dlg-choices" id="dlg-choices"></div>
      </div>`;
    root.appendChild(this.el);

    this.nameEl = this.el.querySelector('#dlg-name');
    this.titleEl = this.el.querySelector('#dlg-title');
    this.bodyEl = this.el.querySelector('#dlg-body');
    this.moreEl = this.el.querySelector('#dlg-more');
    this.choicesEl = this.el.querySelector('#dlg-choices');

    this.el.querySelector('.dlg-panel').addEventListener('click', (e) => {
      if (e.target.closest('.dlg-choice')) return;
      this.advance();
    });
    this.el.querySelector('.dlg-scrim').addEventListener('click', () => {
      if (this.pages && this.pageIndex < this.pages.length - 1) this.advance();
    });
  }

  // ------------------------------------------------------------------ start

  start(npcDef, handlers) {
    this.npc = npcDef;
    this.handlers = handlers;      // { onChoice(choice), onClose() }
    this.open = true;
    this.el.classList.add('show');
    this.nameEl.textContent = npcDef.name || '';
    this.titleEl.textContent = npcDef.title || '';

    const s = this.state.npc(npcDef.id);
    const first = !s.greeted;
    s.greeted = true;
    const hasLiveChoice = this.availableChoices().some((c) => c.enabled);
    const lines = (first || hasLiveChoice)
      ? npcDef.greet
      : (npcDef.idle && npcDef.idle.length ? npcDef.idle : npcDef.greet);
    this.showPages(lines);
  }

  close() {
    if (!this.open) return;
    this.open = false;
    this.el.classList.remove('show');
    this.stopType();
    if (this.handlers && this.handlers.onClose) this.handlers.onClose();
  }

  // ------------------------------------------------------------------ pages

  showPages(pages) {
    this.pages = (pages && pages.length ? pages : ['…']).slice();
    this.pageIndex = 0;
    this.choicesEl.classList.remove('show');
    this.choicesEl.innerHTML = '';
    this.renderPage();
  }

  renderPage() {
    const text = this.pages[this.pageIndex] || '';
    this.typeOut(text, () => {
      const last = this.pageIndex >= this.pages.length - 1;
      this.moreEl.classList.toggle('show', !last);
      if (last) this.renderChoices();
    });
  }

  advance() {
    if (!this.open) return;
    if (this.typing) { this.finishTyping(); return; }
    if (this.pageIndex < this.pages.length - 1) {
      this.pageIndex++;
      this.renderPage();
    }
  }

  typeOut(text, done) {
    this.stopType();
    this.fullText = text;
    this.onTypeDone = done;
    this.moreEl.classList.remove('show');
    const delay = Settings.textCharDelay();
    if (delay <= 0) {
      this.bodyEl.innerHTML = formatLine(text);
      this.typing = false;
      done();
      return;
    }
    this.typing = true;
    let i = 0;
    const voice = (this.npc && this.npc.voice) || 'mid';
    const step = () => {
      if (!this.typing) return;
      i += 1;
      this.bodyEl.innerHTML = formatLine(text.slice(0, i)) + '<span class="caret"></span>';
      const ch = text[i - 1];
      if (ch && /[A-Za-zÀ-ɏ]/.test(ch) && i % 2 === 0) Audio.blip(voice);
      if (i >= text.length) { this.finishTyping(); return; }
      const pause = /[.,;:!?—]/.test(ch || '') ? delay * 7 : delay;
      this.typeTimer = setTimeout(step, pause);
    };
    this.typeTimer = setTimeout(step, delay);
  }

  finishTyping() {
    this.stopType();
    this.bodyEl.innerHTML = formatLine(this.fullText || '');
    if (this.onTypeDone) { const d = this.onTypeDone; this.onTypeDone = null; d(); }
  }

  stopType() {
    this.typing = false;
    clearTimeout(this.typeTimer);
  }

  // ---------------------------------------------------------------- choices

  availableChoices() {
    const st = this.state;
    const out = [];
    for (const c of this.npc.choices || []) {
      const used = c.once !== false && st.choiceUsed(this.npc.id, c.id);
      if (used) continue;
      const check = st.meets(c.require);
      if (!check.ok && !c.lockedText) continue;      // hidden entirely
      out.push({ choice: c, enabled: check.ok, why: check });
    }
    return out;
  }

  renderChoices() {
    const list = this.availableChoices();
    this.choicesEl.innerHTML = '';

    for (const entry of list) {
      const c = entry.choice;
      const btn = document.createElement('button');
      btn.className = 'dlg-choice' + (entry.enabled ? '' : ' locked');
      btn.disabled = !entry.enabled;
      const label = entry.enabled ? c.text : (c.lockedText || c.text);
      btn.innerHTML = `<span class="ch-mark">›</span><span class="ch-text">${escapeHtml(label)}</span>${this.costBadge(c, entry)}`;
      if (entry.enabled) {
        btn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          this.pick(c);
        });
      }
      this.choicesEl.appendChild(btn);
    }

    const leave = document.createElement('button');
    leave.className = 'dlg-choice leave';
    leave.innerHTML = `<span class="ch-mark">×</span><span class="ch-text">${list.length ? 'Say nothing, and step back.' : 'Step back.'}</span>`;
    leave.addEventListener('click', (ev) => { ev.stopPropagation(); Audio.play('ui'); this.close(); });
    this.choicesEl.appendChild(leave);

    this.choicesEl.classList.add('show');
  }

  costBadge(c, entry) {
    const bits = [];
    const r = c.require || {};
    if (r.gold) bits.push(`<span class="badge gold">${r.gold} gold</span>`);
    if (r.items) for (const it of r.items) bits.push(`<span class="badge item">${escapeHtml(getItem(it).name)}</span>`);
    if (r.class) bits.push(`<span class="badge cls">${r.class.map((x) => escapeHtml(getClass(x).name)).join(' / ')}</span>`);
    for (const e of c.effects || []) {
      if (e.t === 'heart' && e.n < 0) bits.push('<span class="badge harm">costs a heart</span>');
      if (e.t === 'gold' && e.n < 0) bits.push(`<span class="badge spend">${-e.n} gold</span>`);
    }
    return bits.length ? `<span class="ch-badges">${bits.join('')}</span>` : '';
  }

  pick(choice) {
    Audio.play('uiBig');
    this.state.useChoice(this.npc.id, choice.id);
    const reply = choice.reply && choice.reply.length ? choice.reply.slice() : null;

    // Effects run before the reply is shown; one of them may close this
    // conversation outright (a teleport, or the end of the floor).
    this.handlers.onChoice(choice);
    if (!this.open) return;

    if (reply) this.showPages(reply);
    else this.renderChoices();
  }

  handleKey(e) {
    if (!this.open) return false;
    if (e.code === 'Escape') {
      if (this.pages && this.pageIndex < this.pages.length - 1) return true;
      this.close();
      return true;
    }
    if (e.code === 'Space' || e.code === 'Enter') { this.advance(); return true; }
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 9 && this.choicesEl.classList.contains('show')) {
      const btns = [...this.choicesEl.querySelectorAll('.dlg-choice:not(:disabled)')];
      if (btns[n - 1]) btns[n - 1].click();
      return true;
    }
    return true;   // swallow everything while a conversation is open
  }
}

// Italics via *asterisks*, and em-dashes get a little breathing room.
function formatLine(text) {
  return escapeHtml(text).replace(/\*([^*]+)\*/g, '<em>$1</em>');
}
