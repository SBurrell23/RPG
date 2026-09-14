// Interprets the effect arrays that story choices and room triggers emit.

import { getItem } from '../data/items.js';
import * as Audio from '../engine/audio.js';

export function runEffects(effects, ctx) {
  if (!effects || !effects.length) return;
  for (const e of effects) {
    try { apply(e, ctx); } catch (err) { console.warn('effect failed', e, err); }
  }
  ctx.state.save();
}

function apply(e, ctx) {
  const { state, world, hud, game } = ctx;

  switch (e.t) {
    case 'unlock': {
      state.unlocked.add(e.to);
      state.relocked.delete(e.to);
      if (world && world.setLocked(e.to, false)) {
        Audio.play('unlock');
        const room = world.layout.rooms.get(e.to);
        hud.toast(room ? `A way opens: ${room.room.name}` : 'Something opens.', 'unlock');
      }
      break;
    }

    case 'lock': {
      state.relocked.add(e.to);
      state.unlocked.delete(e.to);
      if (world && world.setLocked(e.to, true)) {
        Audio.play('door');
        hud.toast('A way closes behind you.', 'lock');
      }
      break;
    }

    case 'item': {
      const n = e.n ?? 1;
      const def = getItem(e.id);
      if (n > 0) {
        state.give(e.id, n);
        Audio.play('pickup');
        hud.toast(`Taken: ${def.name}${n > 1 ? ` ×${n}` : ''}`, 'item');
      } else if (n < 0) {
        if (!state.has(e.id, -n)) break;
        state.give(e.id, n);
        hud.toast(`Given up: ${def.name}`, 'item-lost');
      }
      break;
    }

    case 'gold': {
      if (!e.n) break;
      state.addGold(e.n);
      Audio.play('coin');
      hud.toast(e.n > 0 ? `+${e.n} gold` : `${e.n} gold`, e.n > 0 ? 'gold' : 'gold-lost');
      break;
    }

    case 'heart': {
      if (!e.n) break;
      const before = state.hearts;
      state.changeHearts(e.n);
      if (state.hearts === before) break;
      if (e.n < 0) {
        Audio.play('heartloss');
        hud.shake();
        hud.toast('A heartbeat of grace is spent.', 'heart-lost');
      } else {
        Audio.play('heartgain');
        hud.toast('A heartbeat is returned to you.', 'heart-gain');
      }
      if (state.dead) game.onDeath();
      break;
    }

    case 'heal': {
      state.changeHearts(Math.abs(e.n ?? 1));
      Audio.play('heartgain');
      hud.toast('A heartbeat is returned to you.', 'heart-gain');
      break;
    }

    case 'flag':
      state.setFlag(e.id, e.v !== false);
      break;

    case 'move':
      game.teleport(e.to);
      break;

    case 'say':
      hud.narrate(e.text);
      break;

    case 'sound':
      Audio.play(e.id);
      break;

    case 'shop':
      game.openShop(e);
      break;

    case 'codex':
      if (state.addCodex({ id: e.id, title: e.title, text: e.text, floor: state.floorIndex })) {
        Audio.play('chime');
        hud.toast(`Recorded: ${e.title}`, 'codex');
      }
      break;

    case 'floorEnd':
      game.completeFloor(!!e.token);
      break;

    case 'ending':
      game.reachEnding(e.id);
      break;

    default:
      console.warn('unknown effect', e);
  }
}
