// Global item catalogue. Floors may add their own via a floor file's `items` map;
// those are merged over this at load time.

export const ITEMS = {
  // ---- class starting gear -------------------------------------------------
  iron_pact_signet: {
    name: 'Signet of the Iron Pact', kind: 'relic', value: 0, icon: 'ring', tint: '#c6ccd6',
    desc: 'A soldier’s ring from an order that was dissolved by decree, not by defeat. It still closes doors on people.',
    bound: true
  },
  emberglass_lens: {
    name: 'Emberglass Lens', kind: 'relic', value: 0, icon: 'eye', tint: '#ff9b52',
    desc: 'Glass poured through fire twice. Script that has forgotten itself becomes legible through it, briefly and unwillingly.',
    bound: true
  },
  skeleton_sigil: {
    name: 'Skeleton Sigil', kind: 'relic', value: 0, icon: 'key', tint: '#e0c878',
    desc: 'Not a key. A very persuasive argument, folded into the shape of one.',
    bound: true
  },
  empty_reliquary: {
    name: 'Empty Reliquary', kind: 'relic', value: 0, icon: 'cup', tint: '#d8d2e8',
    desc: 'Hinged, lined, and empty. Whatever it held is not gone; it is simply no longer the sort of thing that fits inside things.',
    bound: true
  },
  blind_astrolabe: {
    name: 'Blind Astrolabe', kind: 'relic', value: 0, icon: 'star', tint: '#9fd8e8',
    desc: 'It has no sighting hole. It has never needed one. It measures where you are by how wrong you feel about it.',
    bound: true
  },

  // ---- cross-floor contract items -----------------------------------------
  salt_shard: {
    name: 'Vestibule Salt Shard', kind: 'trade', value: 18, icon: 'gem', tint: '#dff0f4',
    desc: 'A flake of the Verrow’s first floor. Cold long after your hand should have warmed it.'
  },
  unmade_collar: {
    name: 'Collar of the Unmade', kind: 'relic', value: 45, icon: 'ring', tint: '#c98a5a',
    desc: 'Leather, worn soft at one point, as though something rested its chin there for two hundred years.'
  },
  drowned_page: {
    name: 'Page From the Drowned Index', kind: 'trade', value: 35, icon: 'scroll', tint: '#8fd6c4',
    desc: 'Wet. Stays wet. The ink runs upward.'
  },
  cooling_godling: {
    name: 'A Godling, Cooling', kind: 'relic', value: 90, icon: 'hex', tint: '#ff7a3c',
    desc: 'Palm-sized, still ticking with heat. Unfinished. It has opinions about that.'
  },
  glass_seed: {
    name: 'Seed Under Glass', kind: 'relic', value: 60, icon: 'seed', tint: '#a9f0c2',
    desc: 'Sealed in a bead of glass so it can neither grow nor stop intending to.'
  },
  stopped_tooth: {
    name: 'Tooth From a Stopped Gear', kind: 'trade', value: 40, icon: 'gear', tint: '#d8b06a',
    desc: 'Brass, sheared clean. The moment it broke is still audible if you hold it near your ear.'
  },
  held_note: {
    name: 'A Note, Still Held', kind: 'relic', value: 55, icon: 'bell', tint: '#bfe4ff',
    desc: 'Not written down. Held. Someone is still singing it and has been for a very long time.'
  },
  owed_favor: {
    name: 'A Favour, Written Down', kind: 'trade', value: 70, icon: 'scroll', tint: '#e0c0ea',
    desc: 'Signed by a dead noble in a court that never adjourned. Debt outlives jurisdiction.'
  },
  storm_receipt: {
    name: 'Receipt For One Storm', kind: 'trade', value: 80, icon: 'scroll', tint: '#a8c4ff',
    desc: 'Itemised. Wind, water, light, and one line reading FEAR — SUNDRIES.'
  },

  // ---- carried down from the Salt Vestibule --------------------------------
  salt_lily: {
    name: 'Salt Lily', kind: 'trade', value: 24, icon: 'seed', tint: '#e4f2f6',
    desc: 'Grown, not carved. The Salt-Born make them the way other people hum — absently, and constantly, and then are surprised you noticed.'
  },
  left_glove: {
    name: 'One Left Glove', kind: 'trade', value: 9, icon: 'thread', tint: '#c9bfae',
    desc: 'Abandoned in the Alcove by a Petitioner who wanted to travel light. Still holds the shape of a hand that let it go.'
  },
  brine_lamp: {
    name: 'Brine Lamp', kind: 'tool', value: 26, icon: 'lantern', tint: '#9fe4ff',
    desc: 'A wick floating in salt water that has no business burning. It does not light the room so much as make the room admit things.'
  },
  tally_stone: {
    name: 'Tallyman’s Stone', kind: 'relic', value: 44, icon: 'hex', tint: '#8aa2b0',
    desc: 'Hask’s counting stone. Worn smooth on one face by two hundred years of the same thumb. He will want it back. He will not ask.'
  },

  // ---- common tools & trade goods -----------------------------------------
  rope_coil: {
    name: 'Coil of Wet Rope', kind: 'tool', value: 10, icon: 'thread', tint: '#b9a882',
    desc: 'Long enough. It is always exactly long enough, which is its own kind of unsettling.'
  },
  tallow_candle: {
    name: 'Tallow Candle', kind: 'consumable', value: 6, icon: 'vial', tint: '#f2e3b8',
    desc: 'Burns with a small honest flame that does not ask what it is lighting.'
  },
  brass_key: {
    name: 'Brass Key', kind: 'key', value: 15, icon: 'key', tint: '#d9ad55',
    desc: 'Warm. Keys in the Verrow are usually warm; nobody has explained this.'
  },
  chalk_stub: {
    name: 'Stub of Chalk', kind: 'tool', value: 5, icon: 'seed', tint: '#e8e2d0',
    desc: 'Worn to a nub. Someone was counting something, and stopped mid-count.'
  },
  bone_whistle: {
    name: 'Bone Whistle', kind: 'tool', value: 22, icon: 'bone', tint: '#e4dcc8',
    desc: 'Produces no sound you can hear. Things that are not you turn their heads.'
  },
  black_glass_hex: {
    name: 'Blank Hex of Black Glass', kind: 'trade', value: 30, icon: 'hex', tint: '#4a4458',
    desc: 'The shape of a Ward Token with no word fired into it. A promise nobody made.'
  },
  cold_iron_nail: {
    name: 'Cold Iron Nail', kind: 'tool', value: 12, icon: 'blade', tint: '#9aa4ad',
    desc: 'Hand-forged, square-headed. Useful for pinning things that would rather drift.'
  },
  memory_of_bread: {
    name: 'The Memory of Bread', kind: 'consumable', value: 25, icon: 'cup', tint: '#e8c08a',
    desc: 'Not bread. The recollection of having eaten some, kept fresh. It nourishes about as well as you would expect, which is to say: surprisingly.'
  },
  quiet_coin: {
    name: 'Quiet Coin', kind: 'trade', value: 50, icon: 'coin', tint: '#cfd6c2',
    desc: 'Struck in a denomination that no longer exists, by a mint that never did.'
  },
  mourner_mask: {
    name: 'Mourner’s Mask', kind: 'relic', value: 38, icon: 'mask', tint: '#cbc4d8',
    desc: 'Plain white, no eyeholes. Worn to grieve someone whose name has already gone.'
  },
  grey_feather: {
    name: 'Grey Feather', kind: 'trade', value: 14, icon: 'feather', tint: '#c2c8cc',
    desc: 'From a bird that does not exist below ground, found seven floors below ground.'
  },
  vial_of_still_water: {
    name: 'Vial of Still Water', kind: 'consumable', value: 20, icon: 'vial', tint: '#9fd8e8',
    desc: 'Perfectly level regardless of how you hold it. It knows which way is down better than you do.'
  },
  ledger_stub: {
    name: 'Torn Ledger Stub', kind: 'trade', value: 16, icon: 'scroll', tint: '#d6cbb0',
    desc: 'The right-hand column only. Everything owed, nothing owing.'
  },
  lodestone: {
    name: 'Lodestone', kind: 'tool', value: 28, icon: 'gem', tint: '#7f8a99',
    desc: 'Points at whatever you are avoiding.'
  }
};

// Ward tokens are generated rather than typed out.
for (let i = 1; i <= 10; i++) {
  ITEMS['ward_token_' + i] = {
    name: `Ward Token — ${['First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth','Tenth'][i - 1]}`,
    kind: 'token', value: 0, icon: 'hex', tint: '#8fe0ff', bound: true,
    desc: 'A hexagonal chit of black glass with one word fired into it, edge-on so it can only be read by someone who already knows it.'
  };
}

export function mergeItems(extra) {
  if (!extra) return;
  for (const [id, def] of Object.entries(extra)) {
    if (!ITEMS[id]) ITEMS[id] = def;
  }
}

export function getItem(id) {
  return ITEMS[id] || { name: id, kind: 'trade', value: 0, icon: 'hex', tint: '#888', desc: '' };
}
