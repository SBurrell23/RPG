// Shared vocabularies. Kept free of any three.js import so that tooling
// (the validator, the debug page) can read them under plain Node.

export const PROP_NAMES = [
  'pillars', 'brazier', 'water', 'rubble', 'shelves', 'statue', 'altar', 'chains',
  'gears', 'banners', 'crystals', 'roots', 'bones', 'cages', 'forge', 'mirrors',
  'table', 'well', 'throne', 'stairs', 'sarcophagi', 'pipes', 'spores', 'rain',
  'candles', 'bookstacks', 'hanginglights', 'glass', 'sand', 'machine'
];

export const NPC_FORMS = [
  'robed', 'hunched', 'tall', 'floating', 'armored', 'beast', 'child',
  'construct', 'wisp', 'twin', 'winged', 'coiled'
];

export const NPC_VOICES = ['low', 'mid', 'high', 'dry', 'bell', 'choral', 'broken'];

export const ROOM_KINDS = [
  'entry', 'hub', 'branch', 'deadend', 'shrine', 'shop', 'vault', 'exit', 'corridor'
];

export const SOUND_IDS = [
  'chime', 'stone', 'bell', 'crack', 'water', 'fire', 'gear', 'whisper', 'coin',
  'heartloss', 'heartgain', 'unlock', 'wrong', 'door', 'pickup', 'token',
  'floorComplete', 'thunder', 'death', 'ui', 'uiBig', 'step'
];

export const ICON_NAMES = [
  'key', 'lantern', 'book', 'coin', 'gem', 'bone', 'blade', 'cup', 'ring', 'scroll',
  'seed', 'gear', 'mask', 'bell', 'feather', 'vial', 'eye', 'hex', 'thread', 'star', 'heart'
];

export const EFFECT_TYPES = [
  'unlock', 'lock', 'item', 'gold', 'heart', 'heal', 'flag', 'move', 'say',
  'sound', 'shop', 'codex', 'floorEnd', 'ending'
];
