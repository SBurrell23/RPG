// The five Petitioner classes. `id` values are what floor data checks in require.class.

export const CLASSES = [
  {
    id: 'warden',
    name: 'Warden',
    epithet: 'of the Iron Pact',
    blurb: 'A soldier of an order dissolved by decree rather than defeat. You kept the oath anyway, because nobody told you the oath had been dissolved, and then because nobody could.',
    abilities: [
      'Invoke the Pact — swear surety on a threshold, and things that respect oaths will honour it.',
      'Stand — refuse to move, and be believed.',
      'Doors held shut by obligation rather than by locks tend to open for you, and the Kept of dissolved orders will speak to you where they speak to nobody else.'
    ],
    // Wardens never learned to carry money; they were issued things instead.
    gold: 25,
    items: ['iron_pact_signet', 'cold_iron_nail'],
    color: '#b8c0cc',
    accent: '#6d7a8c',
    sigil: 'shield'
  },
  {
    id: 'ashcaller',
    name: 'Ashcaller',
    epithet: 'of the Second Burning',
    blurb: 'You read what has forgotten how to be read, and you do it by setting a small controlled fire behind your own eyes. It costs you something every time. You have stopped keeping track.',
    abilities: [
      'Read the dead script — inscriptions, ledgers and labels that have gone illegible speak to you.',
      'Kindle — give fire to a thing that needs it, whether or not it wants it.',
      'You see heat, and residue, and the places where something was very recently standing.'
    ],
    gold: 30,
    items: ['emberglass_lens', 'tallow_candle'],
    color: '#ff9b52',
    accent: '#8c3a14',
    sigil: 'flame'
  },
  {
    id: 'coinwright',
    name: 'Coinwright',
    epithet: 'of the Named Price',
    blurb: 'A debt-mage. You do not pick locks so much as explain to them, at length and with documentation, why they were never really closed. You start rich. It will not last.',
    abilities: [
      'Name the true price — see what a thing is actually worth, and say it out loud.',
      'The Skeleton Sigil — an argument shaped like a key. Some doors accept arguments.',
      'You start with substantially more gold, and every merchant in the Verrow already knows.'
    ],
    gold: 90,
    items: ['skeleton_sigil', 'ledger_stub'],
    color: '#e0c878',
    accent: '#8a6a1c',
    sigil: 'coin'
  },
  {
    id: 'hollow-saint',
    name: 'Hollow Saint',
    epithet: 'of the Empty Reliquary',
    blurb: 'You are a priest of a god that forgot you first. You kept performing the rites into the silence, and something started answering. You have chosen not to ask what.',
    abilities: [
      'Bless — and be heard by the Kept, the filed, and the not-quite-dead.',
      'Bear it — take another’s pain onto yourself, which is exactly as costly as it sounds.',
      'At shrines you may restore a spent heart. Once per floor, and never twice in the same place.'
    ],
    gold: 20,
    items: ['empty_reliquary', 'mourner_mask'],
    color: '#d8d2e8',
    accent: '#5c4f78',
    sigil: 'chalice'
  },
  {
    id: 'cartographer',
    name: 'Cartographer',
    epithet: 'of the Blind Astrolabe',
    blurb: 'You map places that are not there. This was a novelty act until the Thinning started eating roads, and then it was the only profession that mattered, and then everyone forgot it existed.',
    abilities: [
      'True shape — you always know where the doors of a room lead, including the ones that are lying about it.',
      'Recall the route — you have been somewhere like this before, and you remember the trick.',
      'Your map fills itself in. Dead ends are marked before you walk into them.'
    ],
    gold: 45,
    items: ['blind_astrolabe', 'chalk_stub'],
    color: '#9fd8e8',
    accent: '#2c5866',
    sigil: 'compass'
  }
];

export function getClass(id) {
  return CLASSES.find((c) => c.id === id) || CLASSES[0];
}
