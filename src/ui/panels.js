// Overlay panels: inventory/codex/character, the trade panel, settings, pause,
// and the run-ending screens.

import { escapeHtml } from './hud.js';
import { iconSvg } from './icons.js';
import { getItem } from '../data/items.js';
import { getClass, CLASSES } from '../data/classes.js';
import * as Settings from '../engine/settings.js';
import * as Audio from '../engine/audio.js';

class Panel {
  constructor(root, cls) {
    this.el = document.createElement('div');
    this.el.className = 'panel ' + cls;
    root.appendChild(this.el);
    this.open = false;
  }
  show() { this.open = true; this.el.classList.add('show'); }
  hide() { this.open = false; this.el.classList.remove('show'); }
  toggle() { this.open ? this.hide() : this.show(); }
}

// ---------------------------------------------------------------- inventory

export class InventoryPanel extends Panel {
  constructor(root, state) {
    super(root, 'inventory');
    this.state = state;
    this.tab = 'items';
    this.el.innerHTML = `
      <div class="panel-box">
        <div class="panel-tabs">
          <button data-tab="items" class="on">Satchel</button>
          <button data-tab="codex">Codex</button>
          <button data-tab="self">Petitioner</button>
          <div class="panel-close" title="Close (Tab)">×</div>
        </div>
        <div class="panel-content" id="inv-content"></div>
      </div>`;
    this.content = this.el.querySelector('#inv-content');
    this.el.querySelectorAll('.panel-tabs button').forEach((b) => {
      b.addEventListener('click', () => {
        this.tab = b.dataset.tab;
        this.el.querySelectorAll('.panel-tabs button').forEach((x) => x.classList.toggle('on', x === b));
        Audio.play('ui');
        this.render();
      });
    });
    this.el.querySelector('.panel-close').addEventListener('click', () => this.hide());
    state.on(() => { if (this.open) this.render(); });
  }

  show() { super.show(); this.render(); }

  render() {
    if (this.tab === 'items') this.renderItems();
    else if (this.tab === 'codex') this.renderCodex();
    else this.renderSelf();
  }

  renderItems() {
    const list = this.state.inventoryList();
    if (!list.length) {
      this.content.innerHTML = `<div class="empty">You are carrying nothing at all. The Verrow finds this interesting.</div>`;
      return;
    }
    const groups = {};
    for (const it of list) (groups[it.def.kind] = groups[it.def.kind] || []).push(it);
    const order = ['token', 'key', 'relic', 'tool', 'consumable', 'trade'];
    const titles = {
      token: 'Ward Tokens', key: 'Keys', relic: 'Relics',
      tool: 'Tools', consumable: 'Provisions', trade: 'Goods'
    };
    let html = '';
    for (const k of order) {
      if (!groups[k]) continue;
      html += `<div class="inv-group"><h3>${titles[k]}</h3><div class="inv-grid">`;
      for (const it of groups[k]) {
        html += `
          <div class="inv-item" style="--tint:${it.def.tint || '#9aa'}">
            <div class="inv-icn">${iconSvg(it.def.icon || 'hex', 30)}${it.n > 1 ? `<b>${it.n}</b>` : ''}</div>
            <div class="inv-meta">
              <div class="inv-name">${escapeHtml(it.def.name)}</div>
              <div class="inv-desc">${escapeHtml(it.def.desc || '')}</div>
              ${it.def.value ? `<div class="inv-val">${iconSvg('coin', 13)} worth about ${it.def.value}</div>` : ''}
            </div>
          </div>`;
      }
      html += '</div></div>';
    }
    this.content.innerHTML = html;
  }

  renderCodex() {
    const c = this.state.codex;
    if (!c.length) {
      this.content.innerHTML = `<div class="empty">Nothing recorded yet. Listen harder.</div>`;
      return;
    }
    this.content.innerHTML = c.map((e) => `
      <div class="codex-entry">
        <div class="codex-floor">Floor ${e.floor}</div>
        <h3>${escapeHtml(e.title)}</h3>
        <p>${escapeHtml(e.text)}</p>
      </div>`).join('');
  }

  renderSelf() {
    const s = this.state;
    const cls = getClass(s.classId);
    const mins = Math.floor((Date.now() - s.startedAt) / 60000);
    this.content.innerHTML = `
      <div class="self">
        <div class="self-head" style="--c:${cls.color}">
          <h2>${escapeHtml(cls.name)} <span>${escapeHtml(cls.epithet)}</span></h2>
          <p class="self-blurb">${escapeHtml(cls.blurb)}</p>
        </div>
        <h3>What you can do</h3>
        <ul class="self-abils">${cls.abilities.map((a) => `<li>${escapeHtml(a)}</li>`).join('')}</ul>
        <h3>The descent so far</h3>
        <div class="self-stats">
          <div><b>${s.floorIndex}</b><span>floor reached</span></div>
          <div><b>${s.tokens.length}<i>/10</i></b><span>ward tokens</span></div>
          <div><b>${s.hearts}<i>/${s.maxHearts}</i></b><span>heartbeats left</span></div>
          <div><b>${s.gold}</b><span>gold</span></div>
          <div><b>${s.stats.choices}</b><span>choices made</span></div>
          <div><b>${s.stats.roomsEntered}</b><span>rooms entered</span></div>
          <div><b>${s.stats.heartsLost}</b><span>hearts spent</span></div>
          <div><b>${mins}</b><span>minutes below</span></div>
        </div>
      </div>`;
  }
}

// --------------------------------------------------------------------- shop

export class ShopPanel extends Panel {
  constructor(root, state, hud) {
    super(root, 'shop');
    this.state = state;
    this.hud = hud;
    this.el.innerHTML = `
      <div class="panel-box">
        <div class="panel-tabs">
          <span class="shop-title" id="shop-title">Trade</span>
          <div class="shop-gold" id="shop-gold"></div>
          <div class="panel-close" title="Close">×</div>
        </div>
        <div class="panel-content shop-cols">
          <div class="shop-col"><h3>For sale</h3><div id="shop-buy"></div></div>
          <div class="shop-col"><h3>They will buy</h3><div id="shop-sell"></div></div>
        </div>
      </div>`;
    this.buyEl = this.el.querySelector('#shop-buy');
    this.sellEl = this.el.querySelector('#shop-sell');
    this.goldEl = this.el.querySelector('#shop-gold');
    this.titleEl = this.el.querySelector('#shop-title');
    this.el.querySelector('.panel-close').addEventListener('click', () => this.hide());
    state.on(() => { if (this.open) this.render(); });
  }

  start(spec, npcName) {
    this.spec = spec;
    this.sold = new Set();
    this.titleEl.textContent = npcName ? `Trading with ${npcName}` : 'Trade';
    this.show();
    this.render();
  }

  render() {
    const s = this.state;
    this.goldEl.innerHTML = `${iconSvg('coin', 18)} ${s.gold}`;

    const stock = (this.spec.stock || []).filter((x) => !this.sold.has(x.item) || x.infinite);
    this.buyEl.innerHTML = stock.length ? '' : '<div class="empty small">Nothing today.</div>';
    for (const entry of stock) {
      const def = getItem(entry.item);
      const afford = s.gold >= entry.price;
      const row = document.createElement('div');
      row.className = 'shop-row' + (afford ? '' : ' poor');
      row.innerHTML = `
        <div class="shop-icn" style="--tint:${def.tint || '#9aa'}">${iconSvg(def.icon || 'hex', 26)}</div>
        <div class="shop-info"><b>${escapeHtml(def.name)}</b><span>${escapeHtml(entry.note || def.desc || '')}</span></div>
        <button class="shop-btn" ${afford ? '' : 'disabled'}>${entry.price} ${iconSvg('coin', 14)}</button>`;
      row.querySelector('button').addEventListener('click', () => {
        if (s.gold < entry.price) return;
        s.addGold(-entry.price);
        s.give(entry.item, entry.n || 1);
        if (!entry.infinite) this.sold.add(entry.item);
        Audio.play('coin');
        this.hud.toast(`Bought: ${def.name}`, 'item');
        s.save();
        this.render();
      });
      this.buyEl.appendChild(row);
    }

    const buys = (this.spec.buys || []).filter((x) => s.has(x.item));
    this.sellEl.innerHTML = buys.length ? '' : '<div class="empty small">They want nothing you have.</div>';
    for (const entry of buys) {
      const def = getItem(entry.item);
      const row = document.createElement('div');
      row.className = 'shop-row';
      row.innerHTML = `
        <div class="shop-icn" style="--tint:${def.tint || '#9aa'}">${iconSvg(def.icon || 'hex', 26)}</div>
        <div class="shop-info"><b>${escapeHtml(def.name)}</b><span>you have ${s.count(entry.item)}</span></div>
        <button class="shop-btn sell">${entry.price} ${iconSvg('coin', 14)}</button>`;
      row.querySelector('button').addEventListener('click', () => {
        if (!s.has(entry.item)) return;
        s.give(entry.item, -1);
        s.addGold(entry.price);
        Audio.play('coin');
        this.hud.toast(`Sold: ${def.name}`, 'gold');
        s.save();
        this.render();
      });
      this.sellEl.appendChild(row);
    }
  }
}

// ----------------------------------------------------------------- settings

export class SettingsPanel extends Panel {
  constructor(root, onRebuild) {
    super(root, 'settings');
    this.onRebuild = onRebuild;
    this.group = 'graphics';
    this.el.innerHTML = `
      <div class="panel-box">
        <div class="panel-tabs" id="set-tabs">
          ${Object.entries(Settings.SCHEMA).map(([k, g], i) =>
            `<button data-g="${k}" class="${i === 0 ? 'on' : ''}">${g.label}</button>`).join('')}
          <div class="panel-close" title="Close">×</div>
        </div>
        <div class="panel-content" id="set-content"></div>
        <div class="panel-foot">
          <button class="ghost" id="set-reset">Reset this section</button>
          <span class="foot-note">Changes save immediately.</span>
        </div>
      </div>`;
    this.content = this.el.querySelector('#set-content');
    this.el.querySelectorAll('#set-tabs button').forEach((b) => {
      b.addEventListener('click', () => {
        this.group = b.dataset.g;
        this.el.querySelectorAll('#set-tabs button').forEach((x) => x.classList.toggle('on', x === b));
        Audio.play('ui');
        this.render();
      });
    });
    this.el.querySelector('.panel-close').addEventListener('click', () => this.hide());
    this.el.querySelector('#set-reset').addEventListener('click', () => {
      Settings.resetGroup(this.group);
      this.render();
    });
  }

  show() { super.show(); this.render(); }

  render() {
    const g = Settings.SCHEMA[this.group];
    this.content.innerHTML = '';
    for (const f of g.fields) {
      const row = document.createElement('div');
      row.className = 'set-row';
      const val = Settings.get(f.id);

      let control = '';
      if (f.type === 'toggle') {
        control = `<button class="sw ${val ? 'on' : ''}" role="switch" aria-checked="${!!val}"><i></i></button>`;
      } else if (f.type === 'range') {
        control = `<input type="range" min="${f.min}" max="${f.max}" step="${f.step}" value="${val}">
                   <span class="set-val">${f.fmt ? f.fmt(val) : val}</span>`;
      } else {
        control = `<select>${f.options.map(([v, label]) =>
          `<option value="${v}" ${String(v) === String(val) ? 'selected' : ''}>${label}</option>`).join('')}</select>`;
      }

      row.innerHTML = `
        <div class="set-label">
          <label>${f.label}${f.hard ? '<span class="set-hard" title="Rebuilds the renderer">↻</span>' : ''}</label>
          ${f.hint ? `<p>${escapeHtml(f.hint)}</p>` : ''}
        </div>
        <div class="set-control">${control}</div>`;

      const ctl = row.querySelector('.set-control');
      if (f.type === 'toggle') {
        ctl.querySelector('button').addEventListener('click', (e) => {
          const nv = !Settings.get(f.id);
          Settings.set(f.id, nv);
          e.currentTarget.classList.toggle('on', nv);
          e.currentTarget.setAttribute('aria-checked', String(nv));
          Audio.play('ui');
        });
      } else if (f.type === 'range') {
        const input = ctl.querySelector('input');
        const out = ctl.querySelector('.set-val');
        input.addEventListener('input', () => {
          const nv = parseFloat(input.value);
          Settings.set(f.id, nv);
          out.textContent = f.fmt ? f.fmt(nv) : nv;
        });
      } else {
        ctl.querySelector('select').addEventListener('change', (e) => {
          const raw = e.target.value;
          const opt = f.options.find(([v]) => String(v) === raw);
          Settings.set(f.id, opt ? opt[0] : raw);
          Audio.play('ui');
        });
      }
      this.content.appendChild(row);
    }
  }
}

// -------------------------------------------------------------------- pause

export class PausePanel extends Panel {
  constructor(root, actions) {
    super(root, 'pause');
    this.el.innerHTML = `
      <div class="pause-box">
        <h1>The Verrow</h1>
        <p class="pause-sub" id="pause-sub"></p>
        <div class="pause-actions">
          <button data-a="resume">Continue down</button>
          <button data-a="inventory">Satchel &amp; Codex</button>
          <button data-a="settings">Settings</button>
          <button data-a="abandon" class="danger">Abandon this descent</button>
        </div>
        <p class="pause-keys">
          <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> move &nbsp;·&nbsp;
          <kbd>Shift</kbd> hurry &nbsp;·&nbsp; <kbd>E</kbd> speak &nbsp;·&nbsp;
          <kbd>Tab</kbd> satchel &nbsp;·&nbsp; <kbd>Esc</kbd> pause &nbsp;·&nbsp;
          <kbd>F3</kbd> performance
        </p>
      </div>`;
    this.subEl = this.el.querySelector('#pause-sub');
    this.el.querySelectorAll('.pause-actions button').forEach((b) => {
      b.addEventListener('click', () => { Audio.play('ui'); actions[b.dataset.a](); });
    });
  }
  setSub(text) { this.subEl.textContent = text; }
}

// ------------------------------------------------------------------ endings

export class EndPanel extends Panel {
  constructor(root) {
    super(root, 'endpanel');
  }

  showEnding({ title, kicker, body, stats, buttons }) {
    this.el.innerHTML = `
      <div class="end-box">
        <div class="end-kicker">${escapeHtml(kicker || '')}</div>
        <h1>${escapeHtml(title)}</h1>
        <div class="end-body">${body.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</div>
        ${stats ? `<div class="end-stats">${stats.map((s) =>
          `<div><b>${escapeHtml(String(s[1]))}</b><span>${escapeHtml(s[0])}</span></div>`).join('')}</div>` : ''}
        <div class="end-actions"></div>
      </div>`;
    const acts = this.el.querySelector('.end-actions');
    for (const b of buttons) {
      const el = document.createElement('button');
      el.textContent = b.label;
      if (b.primary) el.className = 'primary';
      el.addEventListener('click', () => { Audio.play('uiBig'); b.onClick(); });
      acts.appendChild(el);
    }
    this.show();
  }
}

export { CLASSES };
